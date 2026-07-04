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
})

const emit = defineEmits(['close', 'share-team', 'proceed'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const readinessItems = [
  {
    title: 'Candidate Profile',
    description: 'Complete profile with sufficient information',
    icon: 'user',
    status: 'Complete',
    tone: 'green',
  },
  {
    title: 'Hiring Team',
    description: 'Hiring manager and team assigned',
    icon: 'users',
    status: 'Complete',
    tone: 'green',
  },
  {
    title: 'Interview Setup',
    description: 'Interview kit and process configured',
    icon: 'calendar',
    status: 'Complete',
    tone: 'green',
  },
  {
    title: 'Required Information',
    description: 'All key information collected',
    icon: 'document',
    status: 'Incomplete',
    tone: 'orange',
  },
]

const focusAreas = [
  {
    title: 'Leadership Experience',
    description: 'Explore examples of leading cross-functional projects and influencing stakeholder decisions.',
    icon: 'document',
  },
  {
    title: 'Stakeholder Management',
    description: 'Assess experience managing expectations and communicating with diverse stakeholders.',
    icon: 'users',
  },
  {
    title: 'Product Thinking',
    description: 'Evaluate approach to problem framing, prioritization, and data-informed decisions.',
    icon: 'spark',
  },
]

const contextItems = [
  {
    title: 'Interview Kit',
    subtitle: 'Product Designer - Round 1',
    action: 'View',
    icon: 'document',
    tone: 'blue',
  },
  {
    title: 'Interview Panel',
    subtitle: '3 interviewers assigned',
    action: 'View',
    icon: 'users',
    tone: 'purple',
  },
  {
    title: 'Proposed Timeline',
    subtitle: 'Next week',
    action: 'Edit',
    icon: 'calendar',
    tone: 'indigo',
  },
]

const gapItems = [
  {
    title: 'Salary Expectations',
    description: 'Not provided by candidate',
    action: 'Request',
    icon: 'wallet',
  },
  {
    title: 'Portfolio Review',
    description: 'Not yet reviewed by hiring team',
    action: 'Review',
    icon: 'archive',
  },
]

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function closeOverlay() {
  emit('close')
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
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="readiness-overlay" @click.self="closeOverlay">
      <section class="readiness-modal">
        <header class="readiness-modal__header">
          <div class="readiness-modal__title">
            <span class="readiness-modal__icon">
              <AppIcon name="sparkles" :size="19" />
            </span>
            <div>
              <h2>AI Interview Readiness</h2>
              <p>AI-powered analysis of readiness to move forward with interviews</p>
            </div>
          </div>

          <button class="readiness-modal__close" type="button" aria-label="Close AI Interview Readiness" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="readiness-modal__body">
          <section class="readiness-top">
            <article class="readiness-candidate-card">
              <div class="readiness-candidate-card__identity">
                <span class="readiness-candidate-card__avatar">{{ candidateInitials }}</span>

                <div class="readiness-candidate-card__copy">
                  <h3>{{ candidateName }}</h3>
                  <p>{{ candidateRole }}</p>

                  <div class="readiness-candidate-card__chips">
                    <span>{{ candidateStage }}</span>
                    <small>Added 5 days ago</small>
                  </div>

                  <div class="readiness-candidate-card__meta">
                    <div>
                      <span>Current Stage</span>
                      <strong>{{ candidateStage }}</strong>
                    </div>
                    <div>
                      <span>Applied on</span>
                      <strong>10 May 2024</strong>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article class="readiness-score-card">
              <div class="readiness-score-card__score">92%</div>
              <div class="readiness-score-card__content">
                <div class="readiness-score-card__title-row">
                  <h3>Interview Ready</h3>
                  <AppIcon name="checkCircle" :size="20" />
                </div>
                <span class="readiness-badge">High Confidence</span>
                <p>This candidate is ready to move forward with interviews based on available information and AI analysis.</p>
              </div>
            </article>
          </section>

          <section class="readiness-grid">
            <div class="readiness-main">
              <section class="readiness-card">
                <h3>Readiness Breakdown</h3>

                <div class="readiness-breakdown">
                  <article v-for="item in readinessItems" :key="item.title" class="readiness-breakdown__item">
                    <div class="readiness-breakdown__copy">
                      <span class="readiness-breakdown__icon" :class="`is-${item.tone}`">
                        <AppIcon :name="item.icon" :size="18" />
                      </span>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <p>{{ item.description }}</p>
                      </div>
                    </div>

                    <span class="readiness-status" :class="`is-${item.tone}`">
                      <AppIcon :name="item.tone === 'green' ? 'checkCircle' : 'alert'" :size="14" />
                      {{ item.status }}
                    </span>
                  </article>
                </div>
              </section>

              <section class="readiness-card">
                <h3>Additional Context</h3>

                <div class="readiness-context">
                  <article v-for="item in contextItems" :key="item.title" class="readiness-context__item">
                    <div class="readiness-context__copy">
                      <span class="readiness-context__icon" :class="`is-${item.tone}`">
                        <AppIcon :name="item.icon" :size="17" />
                      </span>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <p>{{ item.subtitle }}</p>
                      </div>
                    </div>

                    <button type="button">{{ item.action }}</button>
                  </article>
                </div>
              </section>
            </div>

            <aside class="readiness-side">
              <section class="readiness-card readiness-card--insight">
                <div class="readiness-card__head">
                  <AppIcon name="spark" :size="16" />
                  <h3>AI Insight</h3>
                </div>
                <p>Sarah is well-prepared for the next stage. Focus on leadership experience and stakeholder management in interviews.</p>
              </section>

              <section class="readiness-card">
                <div class="readiness-card__head">
                  <div>
                    <h3>AI Suggested Interview Focus</h3>
                    <small>Based on role requirements and candidate background</small>
                  </div>
                  <AppIcon name="info" :size="14" />
                </div>

                <div class="readiness-focus-list">
                  <article v-for="item in focusAreas" :key="item.title">
                    <span class="readiness-focus-list__icon">
                      <AppIcon :name="item.icon" :size="16" />
                    </span>
                    <div>
                      <strong>{{ item.title }}</strong>
                      <p>{{ item.description }}</p>
                    </div>
                  </article>
                </div>
              </section>

              <section class="readiness-card">
                <div class="readiness-card__head">
                  <div class="readiness-risks__title">
                    <AppIcon name="alert" :size="15" />
                    <h3>Gaps & Risks</h3>
                  </div>
                </div>

                <div class="readiness-risks">
                  <article v-for="item in gapItems" :key="item.title" class="readiness-risks__item">
                    <div class="readiness-risks__copy">
                      <span class="readiness-risks__icon">
                        <AppIcon :name="item.icon" :size="15" />
                      </span>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <p>{{ item.description }}</p>
                      </div>
                    </div>

                    <button type="button">{{ item.action }}</button>
                  </article>
                </div>
              </section>
            </aside>
          </section>

            <section class="readiness-recommendation">
              <div class="readiness-recommendation__head">
                <div class="readiness-recommendation__title">
                  <AppIcon name="sparkles" :size="16" />
                  <h3>AI Recommendation</h3>
                </div>
                <p>Candidate is interview-ready with high confidence. Address the gaps above to strengthen evaluation during the first round.</p>
              </div>

            <button class="readiness-recommendation__action" type="button" @click="emit('proceed')">
              <span>
                <AppIcon name="checkCircle" :size="18" />
                Proceed to Round 1 Interview
              </span>
              <AppIcon name="chevronRight" :size="18" />
            </button>
          </section>
        </div>

        <footer class="readiness-modal__footer">
          <div class="readiness-modal__updated">
            <AppIcon name="info" :size="13" />
            <span>Last updated by AI - 22 May 2024 at 00:30 AM</span>
          </div>

          <div class="readiness-modal__actions">
            <button class="readiness-button readiness-button--ghost" type="button" @click="closeOverlay">Close</button>
            <button class="readiness-button readiness-button--ghost readiness-button--icon" type="button" @click="emit('share-team')">
              <AppIcon name="share" :size="15" />
              <span>Share with Team</span>
            </button>
            <button class="readiness-button readiness-button--primary" type="button" @click="emit('proceed')">
              <span>Proceed to Interview</span>
              <AppIcon name="chevronRight" :size="16" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.readiness-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(10px);
}

.readiness-modal {
  width: min(1220px, calc(100vw - 28px));
  max-height: calc(100vh - 24px);
  overflow: auto;
  border: 1px solid #e6ebf5;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.18);
}

.readiness-modal__header,
.readiness-modal__body,
.readiness-modal__footer {
  padding-left: 26px;
  padding-right: 26px;
}

.readiness-modal__header,
.readiness-modal__title,
.readiness-top,
.readiness-candidate-card__identity,
.readiness-candidate-card__chips,
.readiness-candidate-card__meta,
.readiness-score-card,
.readiness-score-card__title-row,
.readiness-breakdown__item,
.readiness-breakdown__copy,
.readiness-context__item,
.readiness-context__copy,
.readiness-card__head,
.readiness-focus-list article,
.readiness-risks__title,
.readiness-risks__item,
.readiness-risks__copy,
.readiness-recommendation__title,
.readiness-recommendation__action,
.readiness-modal__footer,
.readiness-modal__actions,
.readiness-modal__updated,
.readiness-button {
  display: flex;
}

.readiness-modal__header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-top: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #edf1f7;
}

.readiness-modal__title {
  align-items: flex-start;
  gap: 14px;
}

.readiness-modal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 13px;
  color: #ff67b1;
  background: #fff0f7;
}

.readiness-modal__title h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.05rem;
  font-weight: 800;
}

.readiness-modal__title p {
  margin: 6px 0 0;
  color: #7b869b;
  font-size: 0.96rem;
}

.readiness-modal__close {
  border: 0;
  background: transparent;
  color: #9aa4b8;
  cursor: pointer;
}

.readiness-modal__body {
  padding-top: 18px;
  padding-bottom: 26px;
}

.readiness-top {
  gap: 22px;
}

.readiness-candidate-card,
.readiness-score-card,
.readiness-card,
.readiness-recommendation {
  border: 1px solid #e9eef7;
  border-radius: 14px;
  background: #ffffff;
}

.readiness-candidate-card {
  flex: 0 0 370px;
  padding: 24px 22px;
}

.readiness-candidate-card__identity {
  align-items: flex-start;
  gap: 16px;
}

.readiness-candidate-card__avatar {
  width: 74px;
  height: 74px;
  flex: 0 0 74px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #f26eb4;
  font-size: 1.15rem;
  font-weight: 800;
  background: linear-gradient(180deg, #fff5fb 0%, #f4efff 100%);
  box-shadow: inset 0 0 0 2px #ffd8ec;
}

.readiness-candidate-card__copy h3,
.readiness-score-card__content h3,
.readiness-card h3 {
  margin: 0;
  color: #1f2a44;
  font-weight: 800;
}

.readiness-candidate-card__copy h3 {
  font-size: 1rem;
}

.readiness-candidate-card__copy > p {
  margin: 4px 0 0;
  color: #6e7a90;
  font-size: 0.98rem;
}

.readiness-candidate-card__chips {
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.readiness-candidate-card__chips span {
  padding: 5px 12px;
  border-radius: 999px;
  background: #ffeaf4;
  color: #ef69b3;
  font-size: 0.72rem;
  font-weight: 800;
}

.readiness-candidate-card__chips small,
.readiness-card__head small {
  color: #a0a9bc;
  font-size: 0.74rem;
}

.readiness-candidate-card__meta {
  gap: 34px;
  margin-top: 18px;
}

.readiness-candidate-card__meta span {
  display: block;
  color: #a0a9bc;
  font-size: 0.78rem;
}

.readiness-candidate-card__meta strong {
  display: block;
  margin-top: 5px;
  color: #1f2a44;
  font-size: 0.92rem;
  font-weight: 800;
}

.readiness-score-card {
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 58px;
  padding: 30px 34px;
}

.readiness-score-card__score {
  color: #1f2a44;
  font-size: 2.2rem;
  font-weight: 800;
}

.readiness-score-card__content {
  max-width: 450px;
}

.readiness-score-card__title-row {
  align-items: center;
  gap: 10px;
  color: #22c55e;
}

.readiness-score-card__content h3 {
  font-size: 1.2rem;
}

.readiness-badge {
  display: inline-flex;
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 9px;
  background: #eaf8ee;
  color: #1e9f59;
  font-size: 0.71rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.readiness-score-card__content p {
  margin: 12px 0 0;
  color: #6f7b91;
  font-size: 0.99rem;
  line-height: 1.6;
}

.readiness-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.42fr) minmax(0, 1fr);
  gap: 22px;
  margin-top: 26px;
}

.readiness-main,
.readiness-side {
  display: grid;
  gap: 22px;
}

.readiness-card {
  padding: 22px 24px;
}

.readiness-card--insight {
  border-color: #dce4fb;
  background: linear-gradient(180deg, #f5f7ff 0%, #f7f9ff 100%);
}

.readiness-card--insight p {
  margin: 12px 0 0;
  color: #4c58da;
  line-height: 1.7;
}

.readiness-breakdown,
.readiness-context,
.readiness-focus-list,
.readiness-risks {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.readiness-breakdown__item,
.readiness-context__item,
.readiness-risks__item {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.readiness-breakdown__copy,
.readiness-context__copy,
.readiness-risks__copy,
.readiness-focus-list article {
  align-items: flex-start;
  gap: 14px;
}

.readiness-breakdown__icon,
.readiness-context__icon,
.readiness-focus-list__icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.readiness-breakdown__icon.is-green {
  color: #16a34a;
  background: #eefbf2;
}

.readiness-breakdown__icon.is-orange {
  color: #f97316;
  background: #fff3ea;
}

.readiness-context__icon.is-blue {
  color: #4f63ff;
  background: #eef2ff;
}

.readiness-context__icon.is-purple {
  color: #8b5cf6;
  background: #f3ecff;
}

.readiness-context__icon.is-indigo {
  color: #6366f1;
  background: #eef0ff;
}

.readiness-breakdown__copy strong,
.readiness-context__copy strong,
.readiness-focus-list article strong,
.readiness-risks__copy strong {
  display: block;
  color: #1f2a44;
  font-size: 0.98rem;
  font-weight: 800;
}

.readiness-breakdown__copy p,
.readiness-context__copy p,
.readiness-focus-list article p,
.readiness-risks__copy p {
  margin: 4px 0 0;
  color: #7a869b;
  line-height: 1.55;
}

.readiness-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
}

.readiness-status.is-green {
  color: #16a34a;
}

.readiness-status.is-orange {
  color: #f97316;
}

.readiness-context__item button,
.readiness-risks__item button {
  min-width: 76px;
  padding: 10px 14px;
  border: 1px solid #cfd9f9;
  border-radius: 9px;
  background: #ffffff;
  color: #4f46e5;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
}

.readiness-card__head {
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  color: #ef69b3;
}

.readiness-risks__title {
  align-items: center;
  gap: 8px;
  color: #f97316;
}

.readiness-focus-list__icon {
  color: #ef69b3;
  background: #fff1f7;
}

.readiness-focus-list article + article,
.readiness-risks__item + .readiness-risks__item {
  padding-top: 14px;
  border-top: 1px solid #edf1f7;
}

.readiness-risks__icon {
  width: 24px;
  flex: 0 0 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
}

.readiness-recommendation {
  margin-top: 24px;
  padding: 22px 24px;
  border-color: #dce4fb;
  background: linear-gradient(180deg, #f5f7ff 0%, #f6f8ff 100%);
}

.readiness-recommendation__title {
  align-items: center;
  gap: 10px;
  color: #ef69b3;
}

.readiness-recommendation__title h3 {
  margin: 0;
  color: #1f2a44;
  font-size: 1rem;
  font-weight: 800;
}

.readiness-recommendation__head p {
  margin: 12px 0 0;
  color: #69768e;
  line-height: 1.65;
}

.readiness-recommendation__action {
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 18px;
  padding: 18px 20px;
  border: 1px solid #bfe8cb;
  border-radius: 12px;
  background: linear-gradient(180deg, #f3fff6 0%, #effdf3 100%);
  color: #15803d;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
}

.readiness-recommendation__action span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.readiness-modal__footer {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding-top: 18px;
  padding-bottom: 18px;
  border-top: 1px solid #edf1f7;
}

.readiness-modal__updated {
  align-items: center;
  gap: 8px;
  color: #a0a9bc;
  font-size: 0.78rem;
}

.readiness-modal__actions {
  align-items: center;
  gap: 12px;
}

.readiness-button {
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
}

.readiness-button--ghost {
  border: 1px solid #d9e0ec;
  background: #ffffff;
  color: #334155;
}

.readiness-button--primary {
  border: 0;
  color: #ffffff;
  background: linear-gradient(135deg, #f05daa 0%, #ee7bbb 100%);
  box-shadow: 0 16px 30px rgba(240, 93, 170, 0.24);
}

@media (max-width: 1080px) {
  .readiness-top,
  .readiness-grid,
  .readiness-modal__footer {
    flex-direction: column;
    display: flex;
  }

  .readiness-candidate-card,
  .readiness-score-card,
  .readiness-main,
  .readiness-side,
  .readiness-modal__actions {
    width: 100%;
  }

  .readiness-score-card {
    gap: 28px;
  }
}

@media (max-width: 760px) {
  .readiness-overlay {
    padding: 10px;
  }

  .readiness-modal {
    width: min(100vw - 8px, 100%);
    max-height: calc(100vh - 12px);
  }

  .readiness-modal__header,
  .readiness-modal__body,
  .readiness-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .readiness-score-card,
  .readiness-breakdown__item,
  .readiness-context__item,
  .readiness-risks__item,
  .readiness-modal__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .readiness-candidate-card__meta {
    gap: 18px;
    flex-direction: column;
  }

  .readiness-score-card__score {
    font-size: 1.8rem;
  }

  .readiness-button {
    width: 100%;
  }
}
</style>
