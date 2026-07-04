<script setup>
import { computed } from 'vue'
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
  candidateAppliedOn: {
    type: String,
    default: '10 May 2025',
  },
})

const emit = defineEmits(['close', 'assign-hiring-manager', 'schedule-hm-review'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const keySignals = [
  { label: 'Experience Match', note: '8 years relevant experience', status: 'Strong', tone: 'green', icon: 'briefcase' },
  { label: 'Skills Alignment', note: 'Design Systems, Figma, Strategy', status: 'Strong', tone: 'green', icon: 'sparkles' },
  { label: 'Salary Alignment', note: 'Within approved range', status: 'Confirmed', tone: 'green', icon: 'wallet' },
  { label: 'Availability', note: 'Available to start within 4 weeks', status: 'Confirmed', tone: 'green', icon: 'calendar' },
  { label: 'Knockout Requirements', note: 'All must-have requirements passed', status: 'Passed', tone: 'green', icon: 'checkCircle' },
  { label: 'Work Authorization', note: 'EU Citizen', status: 'Verified', tone: 'green', icon: 'shield' },
]

const whyItems = [
  'Resume & Work History Analysis',
  'Application & Screening Answers',
  'Qualification Requirement Match',
  'Compensation & Availability Signals',
  'Market & Role Fit Intelligence',
]

const strengths = [
  '8 years of relevant product design experience',
  'Strong design systems and UI/UX expertise',
  'Leadership and cross-functional collaboration',
  'Salary expectations within budget range',
]

const risks = [
  'Limited B2B SaaS experience',
  'No direct marketplace experience',
]

const atAGlance = [
  ['Overall Readiness', 'Strong'],
  ['Fit for Role', 'High'],
  ['Risk Level', 'Low'],
  ['Time to Start', '4 weeks'],
  ['Salary Alignment', 'Aligned'],
]

function closeOverlay() {
  emit('close')
}

function assignNow() {
  emit('assign-hiring-manager')
  emit('close')
}

function scheduleReview() {
  emit('schedule-hm-review')
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-qualification-overlay" @click.self="closeOverlay">
      <section class="ai-qualification-modal">
        <header class="ai-qualification-modal__head">
          <div class="ai-qualification-modal__title">
            <span class="ai-qualification-modal__title-icon">
              <AppIcon name="spark" :size="17" />
            </span>
            <div>
              <h2>AI Qualification Analysis</h2>
              <p>Comprehensive AI analysis based on candidate data and hiring requirements</p>
            </div>
          </div>

          <button class="ai-qualification-modal__close" type="button" aria-label="Close qualification analysis" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="ai-qualification-modal__body">
          <div class="ai-qualification-layout">
            <aside class="ai-qualification-left">
              <section class="ai-qualification-candidate">
                <div class="ai-qualification-candidate__badge">QUALIFIED</div>
                <span class="ai-qualification-candidate__avatar">{{ candidateInitials }}</span>
                <strong>{{ candidateName }}</strong>
                <span>{{ candidateRole }}</span>
                <small>Applied on {{ candidateAppliedOn }}</small>
              </section>

              <section class="ai-qualification-action-card">
                <span class="ai-qualification-action-card__icon"><AppIcon name="checkCircle" :size="18" /></span>
                <small>Recommendation</small>
                <strong>Proceed to Hiring Manager Review</strong>
                <p>High confidence based on available hiring signals.</p>
                <div class="ai-qualification-action-card__pill">
                  <AppIcon name="trend-up" :size="13" />
                  <span>Confidence: High</span>
                </div>
              </section>

              <section class="ai-qualification-card">
                <div class="ai-qualification-card__head">
                  <AppIcon name="sparkles" :size="14" />
                  <strong>At a Glance</strong>
                </div>
                <dl class="ai-qualification-at-a-glance">
                  <div v-for="[label, value] in atAGlance" :key="label">
                    <dt>{{ label }}</dt>
                    <dd>{{ value }}</dd>
                  </div>
                </dl>
              </section>
            </aside>

            <main class="ai-qualification-main">
              <section class="ai-qualification-card">
                <h3>Key Signals</h3>
                <div class="ai-qualification-signals">
                  <article v-for="item in keySignals" :key="item.label" class="ai-qualification-signal">
                    <span class="ai-qualification-signal__icon">
                      <AppIcon :name="item.icon" :size="13" />
                    </span>
                    <div class="ai-qualification-signal__copy">
                      <strong>{{ item.label }}</strong>
                      <small>{{ item.note }}</small>
                    </div>
                    <em :class="`is-${item.tone}`">{{ item.status }}</em>
                  </article>
                </div>
              </section>

              <div class="ai-qualification-columns">
                <section class="ai-qualification-card">
                  <h3>Strengths</h3>
                  <ul class="ai-qualification-list">
                    <li v-for="item in strengths" :key="item">
                      <AppIcon name="checkCircle" :size="12" />
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </section>

                <section class="ai-qualification-card">
                  <h3>Potential Risks</h3>
                  <ul class="ai-qualification-list is-risk">
                    <li v-for="item in risks" :key="item">
                      <AppIcon name="alert" :size="12" />
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </section>
              </div>
            </main>

            <aside class="ai-qualification-right">
              <section class="ai-qualification-card">
                <div class="ai-qualification-card__head">
                  <AppIcon name="info" :size="14" />
                  <strong>Why NitroSync Recommends This</strong>
                </div>
                <p class="ai-qualification-side-copy">Our AI analyzed multiple data points to evaluate this candidate.</p>
                <ul class="ai-qualification-side-links">
                  <li v-for="item in whyItems" :key="item">
                    <AppIcon name="document" :size="12" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </section>

              <section class="ai-qualification-card">
                <div class="ai-qualification-card__head">
                  <AppIcon name="sparkles" :size="14" />
                  <strong>Recommended Next Action</strong>
                </div>

                <div class="ai-qualification-next-action">
                  <div>
                    <strong>Assign Hiring Manager</strong>
                    <small>Engage the right hiring manager to move forward.</small>
                  </div>
                  <button class="ai-qualification-button ai-qualification-button--primary" type="button" @click="assignNow">
                    Assign Now
                  </button>
                </div>

                <div class="ai-qualification-divider">OR</div>

                <div class="ai-qualification-next-action">
                  <div>
                    <strong>Schedule HM Review</strong>
                    <small>Book time for the hiring manager to review this candidate.</small>
                  </div>
                  <button class="ai-qualification-button ai-qualification-button--ghost" type="button" @click="scheduleReview">
                    Schedule Review
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="ai-qualification-modal__footer">
          <button class="ai-qualification-link" type="button">
            <AppIcon name="document" :size="14" />
            <span>Export Analysis</span>
          </button>

          <div class="ai-qualification-modal__actions">
            <button class="ai-qualification-button ai-qualification-button--ghost" type="button" @click="closeOverlay">Close</button>
            <button class="ai-qualification-button ai-qualification-button--primary" type="button" @click="assignNow">
              <span>Move Forward</span>
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style>
.ai-qualification-overlay {
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

.ai-qualification-modal {
  width: min(100%, 1120px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.22);
}

.ai-qualification-modal__head,
.ai-qualification-modal__title,
.ai-qualification-layout,
.ai-qualification-card__head,
.ai-qualification-candidate,
.ai-qualification-action-card,
.ai-qualification-action-card__pill,
.ai-qualification-signal,
.ai-qualification-columns,
.ai-qualification-list li,
.ai-qualification-side-links li,
.ai-qualification-next-action,
.ai-qualification-modal__footer,
.ai-qualification-modal__actions,
.ai-qualification-button,
.ai-qualification-link {
  display: flex;
  align-items: center;
}

.ai-qualification-modal__head,
.ai-qualification-modal__footer {
  justify-content: space-between;
}

.ai-qualification-modal__head {
  padding: 18px 22px;
  border-bottom: 1px solid #edf2fb;
}

.ai-qualification-modal__title {
  gap: 12px;
}

.ai-qualification-modal__title-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #eff0ff;
  color: #6570f6;
}

.ai-qualification-modal__title h2,
.ai-qualification-card h3,
.ai-qualification-candidate strong,
.ai-qualification-action-card strong,
.ai-qualification-signal__copy strong,
.ai-qualification-next-action strong {
  margin: 0;
  color: #1f2940;
}

.ai-qualification-modal__title h2 {
  font-size: 18px;
  font-weight: 700;
}

.ai-qualification-modal__title p,
.ai-qualification-candidate span,
.ai-qualification-candidate small,
.ai-qualification-action-card p,
.ai-qualification-signal__copy small,
.ai-qualification-side-copy,
.ai-qualification-side-links li,
.ai-qualification-next-action small,
.ai-qualification-at-a-glance dt,
.ai-qualification-list li span {
  margin: 0;
  color: #7a879e;
  font-size: 12px;
  line-height: 1.45;
}

.ai-qualification-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.ai-qualification-modal__body {
  overflow: auto;
  padding: 18px 22px 22px;
}

.ai-qualification-layout {
  align-items: flex-start;
  gap: 18px;
}

.ai-qualification-left {
  width: 230px;
  display: grid;
  gap: 16px;
  flex: 0 0 230px;
}

.ai-qualification-main {
  min-width: 0;
  flex: 1 1 auto;
}

.ai-qualification-right {
  width: 280px;
  display: grid;
  gap: 16px;
  flex: 0 0 280px;
}

.ai-qualification-card,
.ai-qualification-candidate,
.ai-qualification-action-card {
  padding: 16px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
  background: #fff;
}

.ai-qualification-candidate {
  flex-direction: column;
  text-align: center;
}

.ai-qualification-candidate__badge {
  align-self: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: #eef0ff;
  color: #6570f6;
  font-size: 9px;
  font-weight: 800;
}

.ai-qualification-candidate__avatar {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  margin-top: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd49a 0%, #466d7f 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 800;
}

.ai-qualification-candidate strong {
  margin-top: 14px;
  font-size: 18px;
  font-weight: 700;
}

.ai-qualification-candidate span {
  margin-top: 4px;
  color: #44506b;
}

.ai-qualification-candidate small {
  margin-top: 6px;
}

.ai-qualification-action-card {
  flex-direction: column;
  text-align: center;
  background: #f5fff9;
}

.ai-qualification-action-card__icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #14a05d;
  background: #fff;
}

.ai-qualification-action-card small {
  margin-top: 10px;
  color: #8ea09a;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-qualification-action-card strong {
  margin-top: 8px;
  color: #06925c;
  font-size: 16px;
  line-height: 1.35;
}

.ai-qualification-action-card p {
  margin-top: 10px;
}

.ai-qualification-action-card__pill {
  gap: 6px;
  margin-top: 14px;
  padding: 8px 10px;
  border-radius: 12px;
  background: #fff;
  color: #14a05d;
  font-size: 12px;
  font-weight: 700;
}

.ai-qualification-card h3 {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
}

.ai-qualification-card__head {
  gap: 8px;
  margin-bottom: 12px;
}

.ai-qualification-card__head strong {
  color: #3a4867;
  font-size: 13px;
}

.ai-qualification-at-a-glance {
  margin: 0;
}

.ai-qualification-at-a-glance div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
}

.ai-qualification-at-a-glance dd {
  margin: 0;
  color: #14a05d;
  font-size: 12px;
  font-weight: 700;
}

.ai-qualification-signals {
  display: grid;
  gap: 10px;
}

.ai-qualification-signal {
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #edf2fb;
}

.ai-qualification-signal:last-child {
  border-bottom: 0;
}

.ai-qualification-signal__icon {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #6570f6;
  background: #eff0ff;
  flex: 0 0 24px;
}

.ai-qualification-signal__copy {
  min-width: 0;
  flex: 1 1 auto;
}

.ai-qualification-signal__copy strong {
  display: block;
  font-size: 13px;
  font-weight: 700;
}

.ai-qualification-signal__copy small {
  display: block;
  margin-top: 3px;
}

.ai-qualification-signal em {
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  color: #14a05d;
}

.ai-qualification-columns {
  gap: 16px;
  margin-top: 16px;
  align-items: stretch;
}

.ai-qualification-columns > * {
  flex: 1 1 0;
}

.ai-qualification-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ai-qualification-list li {
  gap: 8px;
  align-items: flex-start;
}

.ai-qualification-list svg {
  color: #14a05d;
  flex: 0 0 auto;
  margin-top: 2px;
}

.ai-qualification-list.is-risk svg {
  color: #ff8c23;
}

.ai-qualification-side-copy {
  margin-bottom: 12px;
}

.ai-qualification-side-links {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ai-qualification-side-links li {
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #edf2fb;
  border-radius: 12px;
  background: #fbfcff;
}

.ai-qualification-side-links svg {
  color: #6570f6;
}

.ai-qualification-next-action + .ai-qualification-next-action {
  margin-top: 12px;
}

.ai-qualification-next-action {
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 14px;
  border: 1px solid #edf2fb;
  border-radius: 14px;
  background: #fbfcff;
}

.ai-qualification-next-action strong {
  display: block;
  font-size: 13px;
  font-weight: 700;
}

.ai-qualification-divider {
  margin: 12px 0;
  color: #a6b0c2;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
}

.ai-qualification-modal__footer {
  padding: 16px 22px 18px;
  border-top: 1px solid #edf2fb;
}

.ai-qualification-link {
  gap: 8px;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  background: #fff;
  color: #55627b;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  padding: 0 14px;
  min-height: 40px;
  cursor: pointer;
}

.ai-qualification-modal__actions {
  gap: 10px;
}

.ai-qualification-button {
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.ai-qualification-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #42506d;
}

.ai-qualification-button--primary {
  border: 0;
  background: linear-gradient(90deg, #6d74ff 0%, #5e68f4 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(94, 104, 244, 0.18);
}

@media (max-width: 1020px) {
  .ai-qualification-layout,
  .ai-qualification-columns {
    flex-direction: column;
  }

  .ai-qualification-left,
  .ai-qualification-right {
    width: 100%;
    flex: 1 1 auto;
  }
}

@media (max-width: 720px) {
  .ai-qualification-overlay {
    padding: 12px;
  }

  .ai-qualification-modal {
    max-height: calc(100vh - 24px);
    border-radius: 18px;
  }

  .ai-qualification-modal__head,
  .ai-qualification-modal__footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .ai-qualification-modal__body,
  .ai-qualification-modal__head,
  .ai-qualification-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .ai-qualification-modal__actions,
  .ai-qualification-link,
  .ai-qualification-button {
    width: 100%;
  }
}
</style>
