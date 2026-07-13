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

const emit = defineEmits([
  'close',
  'move-offer',
  'schedule-final-interview',
  'request-hm-review',
  'add-note',
  'add-to-pool',
  'reject-candidate',
])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateFirstName = computed(() => (
  props.candidateName.split(' ').find(Boolean) ?? props.candidateName
))

const confidenceScore = 96
const alignmentScore = 92
const overlayOpenedAt = ref(0)

const profileFacts = computed(() => ([
  ['Department', 'Engineering'],
  ['Location', 'San Francisco, CA'],
  ['Employment Type', 'Full-time'],
  ['Current Stage', props.candidateStage],
  ['Last Updated', 'May 25, 2026 · 10:24 AM'],
]))

const recommendationTags = [
  { label: 'Strong technical expertise', tone: 'success' },
  { label: 'Leadership potential', tone: 'success' },
  { label: 'Great team fit', tone: 'success' },
  { label: 'Low hiring risk', tone: 'danger' },
]

const keyEvidence = [
  ['Interview scorecards', '5 rounds', 'Complete'],
  ['Assessments', '2 completed', 'Complete'],
  ['References', '3 received', 'Complete'],
  ['Background check', 'Passed', 'Complete'],
  ['Work authorization', 'Verified', 'Complete'],
  ['Documents', 'All verified', 'Complete'],
]

const confidenceBreakdown = [
  ['Interview evidence', '98%', 'pink'],
  ['Assessment evidence', '91%', 'rose'],
  ['Reference evidence', '100%', 'orange'],
  ['Background check', '100%', 'blue'],
  ['Hiring manager feedback', '93%', 'violet'],
]

const strongestSignals = [
  'Excellent technical skills and problem solving',
  'Consistent high performance in all interviews',
  'Strong ownership and accountability',
  'References strongly recommend hiring',
  'Great cultural alignment with the team',
]

const attentionPoints = [
  ['Employment gap of 2 weeks', 'explained'],
  ['Visa expires in 18 months', 'renewal possible'],
  ['Limited healthcare domain', 'learning curve expected'],
]

const interviewerConsensus = [
  ['Strong Hire', 4],
  ['Hire', 1],
  ['No Hire', 0],
]

const interviewerAvatars = ['SB', 'AK', 'MJ', 'LT', '+1']

const confidenceGaps = [
  ['Interview rating', 'One interviewer rated communication slightly lower'],
  ['Domain match', 'Healthcare domain experience is limited'],
  ['Reference timing', 'One reference responded after reminder'],
]

const nextStepRecommendations = [
  'Move candidate to Offer',
  'Schedule final interview (optional)',
  'Request Hiring Manager review',
]

const auditTimeline = [
  ['AI Recommendation Generated', 'May 25, 2026 · 10:24 AM'],
  ['Assessments Completed', 'May 24, 2026 · 5:10 PM'],
  ['References Verified', 'May 24, 2026 · 11:30 AM'],
  ['Background Check Passed', 'May 23, 2026 · 4:20 PM'],
  ['Hiring Manager Review Pending', 'Next step'],
]

const scoreRingStyle = computed(() => ({
  background: `conic-gradient(#ff4f9c 0deg ${confidenceScore * 3.6}deg, #eef2fb ${confidenceScore * 3.6}deg 360deg)`,
}))

const alignmentRingStyle = computed(() => ({
  background: `conic-gradient(#ff4f9c 0deg ${alignmentScore * 3.6}deg, #eef2fb ${alignmentScore * 3.6}deg 360deg)`,
}))

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : ''
}

function closeOverlay() {
  emit('close')
}

function handleBackdropClick() {
  if (Date.now() - overlayOpenedAt.value < 180) {
    return
  }

  closeOverlay()
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      overlayOpenedAt.value = Date.now()
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-decision-summary-overlay" @click.self="handleBackdropClick">
      <section class="ai-decision-summary-modal">
        <header class="ai-decision-summary-head">
          <div>
            <div class="ai-decision-summary-head__title">
              <h2>AI Decision Summary</h2>
              <span>AI</span>
            </div>
            <p>Executive summary of all validation results and hiring signals to help you make a confident decision.</p>
          </div>

          <div class="ai-decision-summary-head__actions">
            <button type="button" class="ai-decision-summary-download">
              <AppIcon name="document" :size="14" />
              <span>Download summary</span>
            </button>
            <button type="button" class="ai-decision-summary-icon" aria-label="Close AI decision summary" @click="closeOverlay">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <div class="ai-decision-summary-body">
          <section class="ai-decision-summary-profile">
            <div class="ai-decision-summary-profile__identity">
              <span class="ai-decision-summary-avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
                <button type="button" class="ai-decision-summary-link">
                  <span>View candidate profile</span>
                  <AppIcon name="external-link" :size="12" />
                </button>
              </div>
            </div>

            <div class="ai-decision-summary-profile__facts">
              <article v-for="item in profileFacts" :key="item[0]">
                <small>{{ item[0] }}</small>
                <strong :class="{ 'is-stage': item[0] === 'Current Stage' }">{{ item[1] }}</strong>
              </article>
            </div>
          </section>

          <div class="ai-decision-summary-top-grid">
            <section class="ai-decision-summary-card">
              <div class="ai-decision-summary-card__head">
                <span class="ai-decision-summary-card__index">1.</span>
                <strong>Why is this candidate recommended?</strong>
              </div>
              <p class="ai-decision-summary-copy">
                {{ candidateFirstName }} consistently exceeded expectations across interviews and assessments, demonstrating strong technical expertise, problem solving skills, and leadership potential. References are strong, reliability is confirmed, and all validations are complete with no major concerns.
              </p>
              <div class="ai-decision-summary-tag-list">
                <span v-for="item in recommendationTags" :key="item.label" :class="`is-${item.tone}`">{{ item.label }}</span>
              </div>
            </section>

            <section class="ai-decision-summary-card">
              <div class="ai-decision-summary-card__head">
                <span class="ai-decision-summary-card__index">2.</span>
                <strong>Key evidence supporting this decision</strong>
              </div>
              <div class="ai-decision-summary-evidence-list">
                <article v-for="item in keyEvidence" :key="item[0]">
                  <div>
                    <AppIcon name="document" :size="13" />
                    <span>{{ item[0] }}</span>
                  </div>
                  <strong>{{ item[1] }}</strong>
                  <em>{{ item[2] }}</em>
                </article>
              </div>
              <div class="ai-decision-summary-note">
                <AppIcon name="info" :size="13" />
                <span>Click any item to view full details and evidence.</span>
              </div>
            </section>

            <section class="ai-decision-summary-card ai-decision-summary-card--stack">
              <article class="ai-decision-summary-mini-card">
                <small>Overall AI Recommendation</small>
                <div class="ai-decision-summary-recommendation">
                  <span class="ai-decision-summary-star">
                    <AppIcon name="star" :size="16" />
                  </span>
                  <div>
                    <strong>Highly Recommended</strong>
                    <p>{{ confidenceScore }}% confidence</p>
                  </div>
                </div>
                <div class="ai-decision-summary-badge">Ready to move to Offer</div>
              </article>

              <article class="ai-decision-summary-mini-card">
                <small>AI Confidence Score</small>
                <div class="ai-decision-summary-confidence">
                  <div class="ai-decision-summary-ring" :style="scoreRingStyle">
                    <div>
                      <strong>{{ confidenceScore }}%</strong>
                      <span>Overall</span>
                    </div>
                  </div>
                  <div class="ai-decision-summary-breakdown">
                    <article v-for="item in confidenceBreakdown" :key="item[0]">
                      <span :class="`is-${item[2]}`" />
                      <small>{{ item[0] }}</small>
                      <strong>{{ item[1] }}</strong>
                    </article>
                  </div>
                </div>
              </article>
            </section>

            <section class="ai-decision-summary-card">
              <div class="ai-decision-summary-card__head">
                <span class="ai-decision-summary-card__index">Recommended next step</span>
              </div>
              <div class="ai-decision-summary-action-list">
                <button type="button" class="is-primary" @click="$emit('move-offer')">
                  <AppIcon name="sparkles" :size="14" />
                  <span>Move to Offer</span>
                </button>
                <button type="button" @click="$emit('schedule-final-interview')">
                  <AppIcon name="calendar" :size="14" />
                  <span>Schedule Final Interview</span>
                </button>
                <button type="button" @click="$emit('request-hm-review')">
                  <AppIcon name="users" :size="14" />
                  <span>Request Hiring Manager Review</span>
                </button>
                <button type="button" @click="$emit('add-to-pool')">
                  <AppIcon name="copy" :size="14" />
                  <span>Add to Backup List</span>
                </button>
                <button type="button" class="is-danger" @click="$emit('reject-candidate')">
                  <AppIcon name="close" :size="14" />
                  <span>Do Not Proceed</span>
                </button>
              </div>
              <div class="ai-decision-summary-generated">
                <AppIcon name="sparkles" :size="14" />
                <div>
                  <small>AI Generated On</small>
                  <strong>May 25, 2026 · 10:24 AM</strong>
                  <span>By NitroSync AI</span>
                </div>
              </div>
            </section>
          </div>

          <div class="ai-decision-summary-middle-grid">
            <section class="ai-decision-summary-card">
              <div class="ai-decision-summary-card__head">
                <span class="ai-decision-summary-card__index">3.</span>
                <strong>Strongest hiring signals</strong>
              </div>
              <ul class="ai-decision-summary-list">
                <li v-for="item in strongestSignals" :key="item">
                  <AppIcon name="check" :size="13" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </section>

            <section class="ai-decision-summary-card">
              <div class="ai-decision-summary-card__head">
                <span class="ai-decision-summary-card__index is-warning">4.</span>
                <strong>What to pay attention to</strong>
              </div>
              <div class="ai-decision-summary-attention-list">
                <article v-for="item in attentionPoints" :key="item[0]">
                  <strong>{{ item[0] }}</strong>
                  <span>{{ item[1] }}</span>
                </article>
              </div>
              <p class="ai-decision-summary-subtle">Details reviewed. No major concerns.</p>
            </section>

            <section class="ai-decision-summary-card">
              <div class="ai-decision-summary-card__head">
                <span class="ai-decision-summary-card__index">5.</span>
                <strong>Interviewer consensus</strong>
              </div>
              <div class="ai-decision-summary-consensus">
                <div class="ai-decision-summary-ring ai-decision-summary-ring--small" :style="alignmentRingStyle">
                  <div>
                    <strong>{{ alignmentScore }}%</strong>
                    <span>Alignment</span>
                  </div>
                </div>

                <div class="ai-decision-summary-consensus__bars">
                  <article v-for="item in interviewerConsensus" :key="item[0]">
                    <span>{{ item[0] }}</span>
                    <div><i :style="{ width: `${Math.max(item[1] * 24, 0)}px` }" /></div>
                    <strong>{{ item[1] }}</strong>
                  </article>
                </div>
              </div>

              <div class="ai-decision-summary-reviewers">
                <div class="ai-decision-summary-reviewers__avatars">
                  <span v-for="item in interviewerAvatars" :key="item">{{ item }}</span>
                </div>
                <em>Ready for Offer</em>
              </div>
            </section>
          </div>

          <div class="ai-decision-summary-bottom-grid">
            <section class="ai-decision-summary-card">
              <div class="ai-decision-summary-card__head">
                <span class="ai-decision-summary-card__index is-danger">7.</span>
                <strong>Why isn't confidence 100%?</strong>
              </div>
              <div class="ai-decision-summary-gaps">
                <article v-for="item in confidenceGaps" :key="item[0]">
                  <strong>{{ item[0] }}</strong>
                  <p>{{ item[1] }}</p>
                </article>
              </div>
              <p class="ai-decision-summary-subtle is-danger">These factors are minor and do not affect the overall recommendation.</p>
            </section>

            <section class="ai-decision-summary-card">
              <div class="ai-decision-summary-card__head">
                <span class="ai-decision-summary-card__index">8.</span>
                <strong>What should we do next?</strong>
              </div>
              <p class="ai-decision-summary-copy">
                Based on the evidence and validation results, AI recommends moving this candidate to the Offer stage. This ensures we secure top talent while maintaining a strong hiring bar.
              </p>
              <div class="ai-decision-summary-steps">
                <strong>Recommended actions:</strong>
                <ul class="ai-decision-summary-list">
                  <li v-for="item in nextStepRecommendations" :key="item">
                    <AppIcon name="check" :size="13" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <div class="ai-decision-summary-illustration">
                <span>
                  <AppIcon name="clipboard-check" :size="46" />
                </span>
              </div>
            </section>

            <section class="ai-decision-summary-card">
              <div class="ai-decision-summary-card__head">
                <strong>Decision Audit Timeline</strong>
              </div>
              <div class="ai-decision-summary-timeline">
                <article v-for="item in auditTimeline" :key="item[0]">
                  <span />
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                </article>
              </div>
              <p class="ai-decision-summary-subtle">All times shown in your local time zone.</p>
            </section>
          </div>
        </div>

        <footer class="ai-decision-summary-foot">
          <div class="ai-decision-summary-foot__top">
            <label class="ai-decision-summary-foot__intro">
              <span>Override AI Recommendation</span>
              <small>If you disagree with the AI recommendation, provide a reason. This will be logged.</small>
            </label>

            <label class="ai-decision-summary-foot__field">
              <span>Reason</span>
              <select>
                <option>Select a reason</option>
              </select>
            </label>

            <label class="ai-decision-summary-foot__field">
              <span>Additional comments (optional)</span>
              <input type="text" placeholder="Add your comments here...">
            </label>

            <div class="ai-decision-summary-foot__primary">
              <button type="button" class="ai-decision-summary-override-button">Override Recommendation</button>
            </div>
          </div>

          <div class="ai-decision-summary-foot__bottom">
            <div class="ai-decision-summary-foot__notice">
              <AppIcon name="lock" :size="13" />
              <span>All validation data is encrypted and visible only to authorized team members.</span>
            </div>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-decision-summary-overlay {
  position: fixed;
  inset: 0;
  z-index: 2300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(255, 255, 255, 0.66);
  backdrop-filter: blur(6px);
}

.ai-decision-summary-modal {
  width: min(1420px, calc(100vw - 36px));
  max-height: calc(100vh - 28px);
  display: flex;
  flex-direction: column;
  border: 1px solid #e9eef8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(35, 47, 86, 0.14);
  overflow: hidden;
}

.ai-decision-summary-head,
.ai-decision-summary-head__title,
.ai-decision-summary-head__actions,
.ai-decision-summary-profile__identity,
.ai-decision-summary-recommendation,
.ai-decision-summary-confidence,
.ai-decision-summary-generated,
.ai-decision-summary-consensus,
.ai-decision-summary-reviewers,
.ai-decision-summary-foot__bottom,
.ai-decision-summary-foot__notice,
.ai-decision-summary-foot__primary {
  display: flex;
  align-items: center;
}

.ai-decision-summary-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
}

.ai-decision-summary-head__title {
  gap: 8px;
}

.ai-decision-summary-head h2 {
  margin: 0;
  color: #223456;
  font-size: 1.05rem;
}

.ai-decision-summary-head__title span {
  padding: 2px 7px;
  border-radius: 999px;
  background: #fff0f7;
  color: #ff4f9c;
  font-size: 0.63rem;
  font-weight: 800;
}

.ai-decision-summary-head p {
  margin: 2px 0 0;
  color: #8390aa;
  font-size: 0.7rem;
}

.ai-decision-summary-head__actions {
  gap: 8px;
}

.ai-decision-summary-download,
.ai-decision-summary-icon,
.ai-decision-summary-action-list button,
.ai-decision-summary-override-button {
  border: 1px solid #dfe6f5;
  background: #fff;
  font: inherit;
  cursor: pointer;
}

.ai-decision-summary-download {
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #334155;
  font-size: 0.68rem;
  font-weight: 700;
}

.ai-decision-summary-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #66758f;
}

.ai-decision-summary-body {
  flex: 1;
  overflow: auto;
  padding: 14px;
  background:
    radial-gradient(circle at top left, rgba(255, 89, 162, 0.05), transparent 22%),
    linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.ai-decision-summary-profile,
.ai-decision-summary-card,
.ai-decision-summary-mini-card {
  border: 1px solid #edf2fb;
  border-radius: 14px;
  background: #fff;
}

.ai-decision-summary-profile {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
  padding: 14px 16px;
}

.ai-decision-summary-profile__identity {
  gap: 14px;
}

.ai-decision-summary-avatar {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #151515 0%, #da7d63 100%);
  color: #fff;
  font-weight: 800;
  font-size: 0.95rem;
}

.ai-decision-summary-profile__identity strong {
  display: block;
  color: #223456;
  font-size: 0.93rem;
}

.ai-decision-summary-profile__identity p {
  margin: 2px 0 0;
  color: #73829d;
  font-size: 0.72rem;
}

.ai-decision-summary-link {
  margin-top: 7px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ff4f9c;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
}

.ai-decision-summary-profile__facts {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.ai-decision-summary-profile__facts small,
.ai-decision-summary-mini-card small,
.ai-decision-summary-foot__intro span,
.ai-decision-summary-foot__field span {
  display: block;
  color: #95a1b6;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-decision-summary-profile__facts strong {
  display: block;
  margin-top: 5px;
  color: #223456;
  font-size: 0.75rem;
}

.ai-decision-summary-profile__facts strong.is-stage {
  color: #ff4f9c;
}

.ai-decision-summary-top-grid,
.ai-decision-summary-middle-grid,
.ai-decision-summary-bottom-grid,
.ai-decision-summary-foot__top {
  display: grid;
  gap: 12px;
}

.ai-decision-summary-top-grid {
  grid-template-columns: 1.1fr 1.2fr 0.95fr 0.9fr;
  margin-top: 12px;
}

.ai-decision-summary-middle-grid {
  grid-template-columns: 1fr 1fr 1.2fr;
  margin-top: 12px;
}

.ai-decision-summary-bottom-grid {
  grid-template-columns: 1fr 1.05fr 0.95fr;
  margin-top: 12px;
}

.ai-decision-summary-card {
  padding: 14px;
  box-shadow: 0 8px 24px rgba(27, 39, 76, 0.04);
}

.ai-decision-summary-card--stack {
  display: grid;
  gap: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.ai-decision-summary-mini-card {
  padding: 14px;
}

.ai-decision-summary-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-decision-summary-card__head strong {
  color: #223456;
  font-size: 0.8rem;
}

.ai-decision-summary-card__index {
  color: #ff4f9c;
  font-size: 0.78rem;
  font-weight: 800;
}

.ai-decision-summary-card__index.is-warning {
  color: #fb923c;
}

.ai-decision-summary-card__index.is-danger {
  color: #f44f82;
}

.ai-decision-summary-copy {
  margin: 12px 0 0;
  color: #5f6e89;
  font-size: 0.72rem;
  line-height: 1.65;
}

.ai-decision-summary-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 14px;
}

.ai-decision-summary-tag-list span,
.ai-decision-summary-badge,
.ai-decision-summary-reviewers em {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-weight: 700;
}

.ai-decision-summary-tag-list span {
  padding: 6px 10px;
  font-size: 0.64rem;
}

.ai-decision-summary-tag-list .is-success {
  background: #eafaf0;
  color: #25a35b;
}

.ai-decision-summary-tag-list .is-danger {
  background: #fff0f5;
  color: #ff4f9c;
}

.ai-decision-summary-evidence-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.ai-decision-summary-evidence-list article,
.ai-decision-summary-breakdown article,
.ai-decision-summary-consensus__bars article,
.ai-decision-summary-timeline article {
  display: grid;
  align-items: center;
}

.ai-decision-summary-evidence-list article {
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 8px;
  font-size: 0.7rem;
}

.ai-decision-summary-evidence-list article > div {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: #4e5e79;
}

.ai-decision-summary-evidence-list strong {
  color: #223456;
  font-size: 0.68rem;
}

.ai-decision-summary-evidence-list em {
  color: #22a559;
  font-style: normal;
  font-size: 0.66rem;
  font-weight: 700;
}

.ai-decision-summary-note {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff7fb;
  color: #7c8aa5;
  font-size: 0.66rem;
}

.ai-decision-summary-recommendation {
  gap: 10px;
  margin-top: 10px;
}

.ai-decision-summary-star {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff338f 100%);
  color: #fff;
}

.ai-decision-summary-recommendation strong {
  display: block;
  color: #ff4f9c;
  font-size: 1rem;
}

.ai-decision-summary-recommendation p {
  margin: 3px 0 0;
  color: #6d7d98;
  font-size: 0.68rem;
}

.ai-decision-summary-badge {
  margin-top: 12px;
  padding: 6px 10px;
  background: #ebfaf0;
  color: #22a559;
  font-size: 0.64rem;
}

.ai-decision-summary-confidence {
  gap: 12px;
  margin-top: 10px;
  align-items: center;
}

.ai-decision-summary-ring {
  width: 88px;
  height: 88px;
  padding: 8px;
  border-radius: 50%;
  flex: 0 0 88px;
}

.ai-decision-summary-ring--small {
  width: 76px;
  height: 76px;
  flex-basis: 76px;
}

.ai-decision-summary-ring > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
  box-shadow: inset 0 0 0 1px #edf2fb;
  text-align: center;
}

.ai-decision-summary-ring strong {
  display: block;
  color: #223456;
  font-size: 1rem;
}

.ai-decision-summary-ring span {
  color: #96a2b6;
  font-size: 0.58rem;
}

.ai-decision-summary-breakdown {
  flex: 1;
  display: grid;
  gap: 7px;
}

.ai-decision-summary-breakdown article {
  grid-template-columns: 8px minmax(0, 1fr) auto;
  gap: 7px;
}

.ai-decision-summary-breakdown span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.ai-decision-summary-breakdown small {
  color: #66758f;
  font-size: 0.64rem;
}

.ai-decision-summary-breakdown strong {
  color: #223456;
  font-size: 0.64rem;
}

.ai-decision-summary-breakdown .is-pink { background: #ff4f9c; }
.ai-decision-summary-breakdown .is-rose { background: #ff7aa8; }
.ai-decision-summary-breakdown .is-orange { background: #fb923c; }
.ai-decision-summary-breakdown .is-blue { background: #4f83ff; }
.ai-decision-summary-breakdown .is-violet { background: #7c5cff; }

.ai-decision-summary-action-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.ai-decision-summary-action-list button {
  min-height: 38px;
  padding: 0 12px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-size: 0.69rem;
  font-weight: 700;
}

.ai-decision-summary-action-list button.is-primary {
  border-color: transparent;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
}

.ai-decision-summary-action-list button.is-danger {
  color: #ef4444;
  background: #fff8f8;
  border-color: #ffd6df;
}

.ai-decision-summary-generated {
  gap: 9px;
  margin-top: 14px;
  color: #ff4f9c;
}

.ai-decision-summary-generated small,
.ai-decision-summary-generated span {
  display: block;
  color: #93a0b4;
  font-size: 0.62rem;
}

.ai-decision-summary-generated strong {
  display: block;
  margin-top: 2px;
  color: #223456;
  font-size: 0.68rem;
}

.ai-decision-summary-list {
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.ai-decision-summary-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #51617c;
  font-size: 0.7rem;
  line-height: 1.45;
}

.ai-decision-summary-list li :deep(svg) {
  color: #22a559;
  flex: 0 0 auto;
  margin-top: 1px;
}

.ai-decision-summary-attention-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.ai-decision-summary-attention-list strong,
.ai-decision-summary-gaps strong,
.ai-decision-summary-steps strong,
.ai-decision-summary-timeline strong {
  display: block;
  color: #223456;
}

.ai-decision-summary-attention-list strong,
.ai-decision-summary-gaps strong {
  font-size: 0.69rem;
}

.ai-decision-summary-attention-list span {
  display: block;
  margin-top: 3px;
  color: #7b879c;
  font-size: 0.67rem;
}

.ai-decision-summary-subtle {
  margin: 12px 0 0;
  color: #8f9cb0;
  font-size: 0.63rem;
}

.ai-decision-summary-subtle.is-danger {
  color: #ff4f9c;
}

.ai-decision-summary-consensus {
  gap: 14px;
  margin-top: 12px;
  align-items: center;
}

.ai-decision-summary-consensus__bars {
  flex: 1;
  display: grid;
  gap: 9px;
}

.ai-decision-summary-consensus__bars article {
  grid-template-columns: 86px minmax(0, 1fr) auto;
  gap: 9px;
  font-size: 0.67rem;
}

.ai-decision-summary-consensus__bars span {
  color: #51617c;
}

.ai-decision-summary-consensus__bars div {
  height: 4px;
  align-self: center;
  border-radius: 999px;
  background: #eef2fb;
  overflow: hidden;
}

.ai-decision-summary-consensus__bars i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff5aa7 0%, #ff2d89 100%);
}

.ai-decision-summary-consensus__bars strong {
  color: #223456;
}

.ai-decision-summary-reviewers {
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
}

.ai-decision-summary-reviewers__avatars {
  display: flex;
}

.ai-decision-summary-reviewers__avatars span {
  width: 24px;
  height: 24px;
  margin-left: -6px;
  border: 2px solid #fff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #273451 0%, #ff7f76 100%);
  color: #fff;
  font-size: 0.55rem;
  font-weight: 800;
}

.ai-decision-summary-reviewers__avatars span:first-child {
  margin-left: 0;
}

.ai-decision-summary-reviewers em {
  padding: 5px 9px;
  background: #ebfaf0;
  color: #22a559;
  font-style: normal;
  font-size: 0.63rem;
}

.ai-decision-summary-gaps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.ai-decision-summary-gaps p {
  margin: 4px 0 0;
  color: #7b879c;
  font-size: 0.65rem;
  line-height: 1.5;
}

.ai-decision-summary-steps {
  margin-top: 12px;
}

.ai-decision-summary-illustration {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.ai-decision-summary-illustration span {
  width: 94px;
  height: 94px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top left, rgba(255, 79, 156, 0.14), transparent 60%), #fff3f8;
  color: #ff4f9c;
}

.ai-decision-summary-timeline {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.ai-decision-summary-timeline article {
  grid-template-columns: 12px minmax(0, 1fr);
  gap: 8px;
}

.ai-decision-summary-timeline article > span {
  width: 10px;
  height: 10px;
  margin-top: 2px;
  border-radius: 50%;
  background: #ff4f9c;
  box-shadow: 0 0 0 3px #fff2f8;
}

.ai-decision-summary-timeline small {
  display: block;
  margin-top: 4px;
  color: #8f9cb0;
  font-size: 0.63rem;
}

.ai-decision-summary-foot {
  padding: 12px 16px 14px;
  border-top: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.03) 0%, #fff 100%);
}

.ai-decision-summary-foot__top {
  grid-template-columns: 240px 210px minmax(0, 1fr) auto;
  align-items: end;
}

.ai-decision-summary-foot__intro,
.ai-decision-summary-foot__field {
  display: grid;
  gap: 7px;
}

.ai-decision-summary-foot__intro small {
  color: #93a0b4;
  font-size: 0.63rem;
  line-height: 1.45;
}

.ai-decision-summary-foot__field select,
.ai-decision-summary-foot__field input {
  height: 38px;
  padding: 0 12px;
  border: 1px solid #dfe6f5;
  border-radius: 9px;
  outline: none;
  background: #fff;
  color: #223456;
  font: inherit;
  font-size: 0.69rem;
}

.ai-decision-summary-foot__field input::placeholder {
  color: #9aa7bb;
}

.ai-decision-summary-foot__bottom {
  margin-top: 10px;
  justify-content: flex-start;
}

.ai-decision-summary-foot__notice {
  gap: 7px;
  color: #8f9cb0;
  font-size: 0.62rem;
}

.ai-decision-summary-override-button {
  height: 38px;
  padding: 0 16px;
  border-color: transparent;
  border-radius: 9px;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
}

@media (max-width: 1380px) {
  .ai-decision-summary-top-grid,
  .ai-decision-summary-middle-grid,
  .ai-decision-summary-bottom-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ai-decision-summary-profile__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1080px) {
  .ai-decision-summary-profile,
  .ai-decision-summary-top-grid,
  .ai-decision-summary-middle-grid,
  .ai-decision-summary-bottom-grid,
  .ai-decision-summary-foot__top {
    grid-template-columns: 1fr;
  }

  .ai-decision-summary-confidence,
  .ai-decision-summary-consensus,
  .ai-decision-summary-head {
    align-items: flex-start;
  }

  .ai-decision-summary-head,
  .ai-decision-summary-head__actions,
  .ai-decision-summary-profile__identity,
  .ai-decision-summary-confidence,
  .ai-decision-summary-consensus,
  .ai-decision-summary-foot__primary {
    flex-wrap: wrap;
  }

  .ai-decision-summary-gaps,
  .ai-decision-summary-profile__facts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .ai-decision-summary-overlay {
    padding: 10px;
  }

  .ai-decision-summary-modal {
    width: 100%;
    max-height: calc(100vh - 12px);
    border-radius: 16px;
  }

  .ai-decision-summary-head,
  .ai-decision-summary-body,
  .ai-decision-summary-foot {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
