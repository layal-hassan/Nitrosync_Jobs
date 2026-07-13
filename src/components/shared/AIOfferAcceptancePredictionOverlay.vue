<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Olivia Chen',
  },
  candidateRole: {
    type: String,
    default: 'Senior Product Designer',
  },
})

const emit = defineEmits(['close'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'OC'
))

const reasonRows = [
  ['Salary matches expectation', '+25%', 'positive'],
  ['Strong interview feedback', '+18%', 'positive'],
  ['Offer sent within 24 hours', '+12%', 'positive'],
  ['Candidate interviewing elsewhere', '-12%', 'negative'],
  ['Equity slightly below preference', '-6%', 'negative'],
]

const signalRows = [
  ['Viewed offer', '2 times', 'eye', 'neutral'],
  ['Viewed compensation', 'Yes', 'checkCircle', 'positive'],
  ['Viewed benefits', 'Yes', 'checkCircle', 'positive'],
  ['Viewed NDA', 'No', 'close', 'negative'],
  ['Downloaded offer PDF', 'Yes', 'document', 'positive'],
  ['Time on offer', '5m 42s', 'clock', 'neutral'],
  ['Last activity', '2 min ago', 'trend-up', 'neutral'],
]

const competitivenessRows = [
  ['Salary', 'Strong', '92%'],
  ['Equity', 'Average', '63%'],
  ['Benefits', 'Strong', '88%'],
]

const confidenceRows = [
  '1,842 similar offers',
  'Candidate engagement data',
  'Market compensation data',
  'Historical acceptance outcomes',
]

const acceptanceScore = 82
const gaugeRadius = 98
const gaugeCenterX = 120
const gaugeCenterY = 118
const gaugeSweep = computed(() => acceptanceScore)
const gaugePointer = computed(() => {
  const angle = Math.PI - ((acceptanceScore / 100) * Math.PI)

  return {
    cx: gaugeCenterX + (gaugeRadius * Math.cos(angle)),
    cy: gaugeCenterY - (gaugeRadius * Math.sin(angle)),
  }
})

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
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-offer-acceptance-overlay" @click.self="emit('close')">
      <section class="ai-offer-acceptance-modal" @click.stop>
        <header class="ai-offer-acceptance-header">
          <div class="ai-offer-acceptance-header__title">
            <span class="ai-offer-acceptance-header__icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <div class="ai-offer-acceptance-header__heading">
                <h2>AI Offer Acceptance Prediction</h2>
                <b>BETA</b>
              </div>
              <p>AI analyzes candidate signals, offer details, and market data to predict acceptance probability.</p>
            </div>
          </div>

          <button type="button" class="ai-offer-acceptance-close" aria-label="Close" @click="emit('close')">
            <AppIcon name="close" :size="16" />
          </button>
        </header>

        <section class="ai-offer-acceptance-summary">
          <article class="ai-offer-acceptance-summary__candidate">
            <span>{{ candidateInitials }}</span>
            <div>
              <div class="ai-offer-acceptance-summary__person">
                <strong>{{ candidateName }}</strong>
                <em>Top Choice</em>
              </div>
              <small>{{ candidateRole }}</small>
              <small>New York, NY</small>
            </div>
          </article>

          <article class="ai-offer-acceptance-summary__stat">
            <span>Offer Amount</span>
            <strong>$120,000</strong>
            <small>Base Salary</small>
          </article>
          <article class="ai-offer-acceptance-summary__stat">
            <span>Offer Sent</span>
            <strong>May 16, 2024</strong>
            <small>9:21 AM</small>
          </article>
          <article class="ai-offer-acceptance-summary__stat">
            <span>Offer Expires</span>
            <strong>May 23, 2024</strong>
            <small class="is-pink">5 days left</small>
          </article>
        </section>

        <div class="ai-offer-acceptance-grid">
          <article class="ai-offer-acceptance-card">
            <h3>Acceptance Prediction</h3>
            <div class="ai-offer-acceptance-score">
              <strong>{{ acceptanceScore }}%</strong>
              <span>Very Likely</span>
            </div>

            <div class="ai-offer-acceptance-gauge">
              <svg viewBox="0 0 240 132" class="ai-offer-acceptance-gauge__svg" aria-hidden="true">
                <path
                  class="ai-offer-acceptance-gauge__track"
                  d="M 22 118 A 98 98 0 0 1 218 118"
                  pathLength="100"
                />
                <path
                  class="ai-offer-acceptance-gauge__progress"
                  d="M 22 118 A 98 98 0 0 1 218 118"
                  pathLength="100"
                  :stroke-dasharray="`${gaugeSweep} 100`"
                />
                <circle
                  class="ai-offer-acceptance-gauge__pointer"
                  :cx="gaugePointer.cx"
                  :cy="gaugePointer.cy"
                  r="6.5"
                />
              </svg>
            </div>

            <div class="ai-offer-acceptance-confidence-copy">
              <small>Confidence</small>
              <strong>High</strong>
              <span>||||</span>
            </div>

            <div class="ai-offer-acceptance-live-note">
              <AppIcon name="spark" :size="14" />
              <div>
                <strong>This prediction is updated in real-time</strong>
                <small>Last updated: 2 min ago</small>
              </div>
            </div>
          </article>

          <article class="ai-offer-acceptance-card">
            <div class="ai-offer-acceptance-card__head">
              <h3>Why AI thinks this?</h3>
              <span>Impact</span>
            </div>

            <div class="ai-offer-acceptance-reasons">
              <article v-for="item in reasonRows" :key="item[0]">
                <div>
                  <span :class="`is-${item[2]}`">
                    <AppIcon :name="item[2] === 'positive' ? 'checkCircle' : 'close'" :size="13" />
                  </span>
                  <strong>{{ item[0] }}</strong>
                </div>
                <b :class="`is-${item[2]}`">{{ item[1] }}</b>
              </article>
            </div>

            <button type="button" class="ai-offer-acceptance-link">
              <span>How does this work?</span>
              <AppIcon name="external-link" :size="12" />
            </button>
          </article>

          <article class="ai-offer-acceptance-card">
            <div class="ai-offer-acceptance-card__head">
              <h3>Live Candidate Signals</h3>
              <em>Live</em>
            </div>

            <div class="ai-offer-acceptance-signals">
              <article v-for="item in signalRows" :key="item[0]">
                <div>
                  <AppIcon :name="item[2]" :size="13" />
                  <strong>{{ item[0] }}</strong>
                </div>
                <span :class="`is-${item[3]}`">{{ item[1] }}</span>
              </article>
            </div>

            <button type="button" class="ai-offer-acceptance-link is-end">
              <span>View full activity</span>
              <AppIcon name="chevronRight" :size="12" />
            </button>
          </article>

          <article class="ai-offer-acceptance-card is-recommended">
            <h3>AI Recommended Action</h3>
            <div class="ai-offer-acceptance-action">
              <span><AppIcon name="phone" :size="15" /></span>
              <div>
                <strong>Call candidate today</strong>
                <small>Personal outreach can increase acceptance probability.</small>
              </div>
            </div>

            <div class="ai-offer-acceptance-improvement">
              <span>Expected improvement</span>
              <strong>+8%</strong>
            </div>

            <div class="ai-offer-acceptance-buttons">
              <button type="button" class="is-primary">Call Candidate</button>
              <button type="button">Email Candidate</button>
            </div>

            <button type="button" class="ai-offer-acceptance-reminder">
              <AppIcon name="calendar" :size="12" />
              <span>Set Reminder</span>
              <AppIcon name="chevronDown" :size="12" />
            </button>
          </article>

          <article class="ai-offer-acceptance-card">
            <h3>Offer Competitiveness</h3>
            <small>Compared to similar roles in New York</small>

            <div class="ai-offer-acceptance-competition">
              <article v-for="item in competitivenessRows" :key="item[0]">
                <strong>{{ item[0] }}</strong>
                <div class="ai-offer-acceptance-competition__bar">
                  <i :style="{ width: item[2] }"></i>
                </div>
                <span>{{ item[1] }}</span>
              </article>
            </div>

            <div class="ai-offer-acceptance-competition__summary">
              <AppIcon name="star" :size="14" />
              <strong>Overall: Highly Competitive</strong>
            </div>
          </article>

          <article class="ai-offer-acceptance-card">
            <h3>Prediction Confidence</h3>
            <div class="ai-offer-acceptance-confidence">
              <div class="ai-offer-acceptance-confidence__ring">
                <span>94%</span>
              </div>
              <div>
                <strong>High confidence</strong>
                <small>Based on:</small>
                <ul>
                  <li v-for="item in confidenceRows" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </article>
        </div>

        <footer class="ai-offer-acceptance-footer">
          <div class="ai-offer-acceptance-disclaimer">
            <AppIcon name="spark" :size="14" />
            <span>AI predictions are not 100% accurate. Use insights to guide conversations.</span>
          </div>
          <button type="button" class="ai-offer-acceptance-footer__close" @click="emit('close')">Close</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-offer-acceptance-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(10px);
}

.ai-offer-acceptance-modal {
  width: min(1380px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
}

.ai-offer-acceptance-header,
.ai-offer-acceptance-header__title,
.ai-offer-acceptance-summary,
.ai-offer-acceptance-summary__candidate,
.ai-offer-acceptance-summary__person,
.ai-offer-acceptance-card__head,
.ai-offer-acceptance-reasons article,
.ai-offer-acceptance-reasons article > div,
.ai-offer-acceptance-signals article,
.ai-offer-acceptance-signals article > div,
.ai-offer-acceptance-action,
.ai-offer-acceptance-buttons,
.ai-offer-acceptance-reminder,
.ai-offer-acceptance-confidence,
.ai-offer-acceptance-footer,
.ai-offer-acceptance-disclaimer {
  display: flex;
  align-items: center;
}

.ai-offer-acceptance-header,
.ai-offer-acceptance-summary,
.ai-offer-acceptance-grid,
.ai-offer-acceptance-footer {
  padding: 18px 22px;
}

.ai-offer-acceptance-header {
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #edf1f8;
}

.ai-offer-acceptance-header__title {
  gap: 12px;
}

.ai-offer-acceptance-header__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
}

.ai-offer-acceptance-header__heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-offer-acceptance-header h2,
.ai-offer-acceptance-card h3,
.ai-offer-acceptance-summary strong,
.ai-offer-acceptance-score strong,
.ai-offer-acceptance-reasons strong,
.ai-offer-acceptance-signals strong,
.ai-offer-acceptance-action strong,
.ai-offer-acceptance-confidence strong {
  margin: 0;
  color: #1f2c4f;
}

.ai-offer-acceptance-header p,
.ai-offer-acceptance-summary span,
.ai-offer-acceptance-summary small,
.ai-offer-acceptance-card small,
.ai-offer-acceptance-score span,
.ai-offer-acceptance-confidence-copy small,
.ai-offer-acceptance-confidence-copy span,
.ai-offer-acceptance-live-note small,
.ai-offer-acceptance-disclaimer span {
  margin: 0;
  color: #7d8cab;
}

.ai-offer-acceptance-header__heading b {
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #6d5cff;
  background: #f3f0ff;
  font-size: 0.65rem;
  font-weight: 800;
}

.ai-offer-acceptance-close,
.ai-offer-acceptance-buttons button,
.ai-offer-acceptance-reminder,
.ai-offer-acceptance-footer__close {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #223251;
  background: #fff;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 800;
}

.ai-offer-acceptance-close {
  width: 36px;
  padding: 0;
}

.ai-offer-acceptance-summary {
  gap: 12px;
  border-bottom: 1px solid #edf1f8;
}

.ai-offer-acceptance-summary > article {
  min-height: 86px;
  padding: 14px 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
  flex: 1 1 0;
}

.ai-offer-acceptance-summary__candidate {
  gap: 12px;
  flex: 1.4 1 0;
}

.ai-offer-acceptance-summary__stat {
  display: grid;
  align-content: center;
  gap: 6px;
}

.ai-offer-acceptance-summary__stat > span,
.ai-offer-acceptance-summary__stat > strong,
.ai-offer-acceptance-summary__stat > small {
  display: block;
}

.ai-offer-acceptance-summary__stat > strong {
  font-size: 1.05rem;
  line-height: 1.2;
}

.ai-offer-acceptance-summary__candidate > span {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.82rem;
  font-weight: 800;
  flex: 0 0 46px;
}

.ai-offer-acceptance-summary__person {
  gap: 8px;
}

.ai-offer-acceptance-summary__person em {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.ai-offer-acceptance-summary small.is-pink {
  color: #ff2d87;
  font-weight: 700;
}

.ai-offer-acceptance-grid {
  display: grid;
  grid-template-columns: 1.05fr 1.2fr 1fr;
  gap: 16px;
}

.ai-offer-acceptance-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.ai-offer-acceptance-card.is-recommended {
  background: linear-gradient(180deg, #fff7fb 0%, #fff 100%);
  border-color: #ffd9e9;
}

.ai-offer-acceptance-card__head {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.ai-offer-acceptance-card__head em {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.ai-offer-acceptance-score {
  display: grid;
  justify-items: center;
  gap: 6px;
}

.ai-offer-acceptance-score strong {
  font-size: 3rem;
  line-height: 1;
}

.ai-offer-acceptance-score span {
  color: #ff2d87;
  font-weight: 800;
}

.ai-offer-acceptance-gauge {
  position: relative;
  width: 100%;
  max-width: 260px;
  margin: 10px auto 0;
}

.ai-offer-acceptance-gauge__svg {
  width: 100%;
  height: auto;
  display: block;
}

.ai-offer-acceptance-gauge__track,
.ai-offer-acceptance-gauge__progress {
  fill: none;
  stroke-linecap: round;
}

.ai-offer-acceptance-gauge__track {
  stroke: #e8edf6;
  stroke-width: 8;
}

.ai-offer-acceptance-gauge__progress {
  stroke: #ff4b9b;
  stroke-width: 8;
}

.ai-offer-acceptance-gauge__pointer {
  fill: #fff;
  stroke: #ff4b9b;
  stroke-width: 4;
}

.ai-offer-acceptance-confidence-copy {
  display: grid;
  justify-items: center;
  gap: 4px;
  margin-top: 8px;
}

.ai-offer-acceptance-confidence-copy strong {
  color: #16a34a;
}

.ai-offer-acceptance-live-note,
.ai-offer-acceptance-competition__summary {
  gap: 10px;
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
}

.ai-offer-acceptance-live-note {
  color: #6d5cff;
  background: #f6f3ff;
}

.ai-offer-acceptance-live-note strong {
  color: #6d5cff;
}

.ai-offer-acceptance-reasons,
.ai-offer-acceptance-signals,
.ai-offer-acceptance-competition {
  display: grid;
  gap: 10px;
}

.ai-offer-acceptance-reasons article,
.ai-offer-acceptance-signals article {
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf1f8;
}

.ai-offer-acceptance-reasons article:last-child,
.ai-offer-acceptance-signals article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.ai-offer-acceptance-reasons article > div,
.ai-offer-acceptance-signals article > div {
  gap: 8px;
}

.ai-offer-acceptance-reasons article > div span {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ai-offer-acceptance-reasons article > div span.is-positive {
  color: #16a34a;
  background: #effcf4;
}

.ai-offer-acceptance-reasons article > div span.is-negative {
  color: #ff4b9b;
  background: #fff1f7;
}

.ai-offer-acceptance-reasons b.is-positive,
.ai-offer-acceptance-signals span.is-positive {
  color: #16a34a;
}

.ai-offer-acceptance-reasons b.is-negative,
.ai-offer-acceptance-signals span.is-negative {
  color: #ff2d87;
}

.ai-offer-acceptance-signals span.is-neutral {
  color: #64748b;
}

.ai-offer-acceptance-link {
  margin-top: 12px;
  padding: 0;
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6d5cff;
  background: transparent;
  font: inherit;
  font-size: 0.73rem;
  font-weight: 800;
}

.ai-offer-acceptance-link.is-end {
  justify-self: end;
}

.ai-offer-acceptance-action {
  gap: 12px;
  margin-top: 12px;
}

.ai-offer-acceptance-action > span {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
  flex: 0 0 40px;
}

.ai-offer-acceptance-action > div {
  display: grid;
  gap: 4px;
}

.ai-offer-acceptance-improvement {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ff2d87;
  background: #fff1f7;
  font-size: 0.72rem;
  font-weight: 800;
}

.ai-offer-acceptance-buttons {
  gap: 10px;
  margin-top: 12px;
}

.ai-offer-acceptance-buttons button {
  flex: 1 1 0;
}

.ai-offer-acceptance-buttons button.is-primary {
  color: #fff;
  border-color: #ff2d87;
  background: linear-gradient(135deg, #ff4b9b 0%, #ff2d87 100%);
}

.ai-offer-acceptance-reminder {
  margin-top: 12px;
}

.ai-offer-acceptance-competition article {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 10px;
  align-items: center;
}

.ai-offer-acceptance-competition__bar {
  height: 8px;
  border-radius: 999px;
  background: #edf1f8;
  overflow: hidden;
}

.ai-offer-acceptance-competition__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.ai-offer-acceptance-competition article:nth-child(2) .ai-offer-acceptance-competition__bar i {
  background: linear-gradient(90deg, #6d5cff 0%, #4f46e5 100%);
}

.ai-offer-acceptance-competition__summary {
  justify-content: center;
  color: #16a34a;
  background: #effcf4;
}

.ai-offer-acceptance-confidence {
  gap: 18px;
  margin-top: 12px;
  align-items: start;
}

.ai-offer-acceptance-confidence__ring {
  width: 94px;
  aspect-ratio: 1 / 1;
  border: 8px solid #d7f5df;
  border-top-color: #22c55e;
  border-right-color: #22c55e;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1f2c4f;
  font-size: 1.45rem;
  font-weight: 800;
  flex: 0 0 94px;
}

.ai-offer-acceptance-confidence ul {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
  color: #475569;
  font-size: 0.76rem;
  font-weight: 600;
}

.ai-offer-acceptance-confidence li::before {
  content: '✓';
  margin-right: 8px;
  color: #16a34a;
  font-weight: 800;
}

.ai-offer-acceptance-footer {
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #edf1f8;
}

.ai-offer-acceptance-disclaimer {
  gap: 8px;
  color: #6d5cff;
}

.ai-offer-acceptance-footer__close {
  min-width: 92px;
  color: #fff;
  border-color: #223251;
  background: #18233f;
}

@media (max-width: 1180px) {
  .ai-offer-acceptance-summary,
  .ai-offer-acceptance-grid {
    grid-template-columns: 1fr 1fr;
    display: grid;
  }

  .ai-offer-acceptance-summary__candidate,
  .ai-offer-acceptance-grid > :nth-child(2),
  .ai-offer-acceptance-grid > :nth-child(5) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .ai-offer-acceptance-overlay {
    padding: 12px;
  }

  .ai-offer-acceptance-modal {
    width: min(100%, calc(100vw - 24px));
  }

  .ai-offer-acceptance-header,
  .ai-offer-acceptance-summary,
  .ai-offer-acceptance-grid,
  .ai-offer-acceptance-footer,
  .ai-offer-acceptance-buttons,
  .ai-offer-acceptance-confidence {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>
