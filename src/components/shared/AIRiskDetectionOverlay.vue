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
    default: 'UX Designer',
  },
  candidateLocation: {
    type: String,
    default: 'Stockholm, Sweden',
  },
  candidateEmail: {
    type: String,
    default: '',
  },
  candidateStage: {
    type: String,
    default: 'Interview',
  },
  candidateAppliedOn: {
    type: String,
    default: 'May 12, 2025',
  },
})

const emit = defineEmits(['close', 'add-risk-note', 'continue-next-stage'])

const riskCards = [
  {
    title: 'Leadership Experience',
    level: 'High Risk',
    summary: 'No direct people management experience.',
    impact: 'This role manages a team of 5 designers.',
    validation: 'Ask about times they led or influenced a team.',
    tone: 'red',
    icon: 'users',
  },
  {
    title: 'Enterprise Exposure',
    level: 'Medium Risk',
    summary: 'Most experience in mid-market SaaS companies.',
    impact: 'This role works with enterprise clients.',
    validation: 'Explore experience with large orgs or complex sales.',
    tone: 'orange',
    icon: 'building',
  },
  {
    title: 'Job Stability',
    level: 'Medium Risk',
    summary: 'Average tenure is 1.2 years across past 3 roles.',
    impact: 'May impact long-term retention.',
    validation: 'Understand career motivations and what drives stability.',
    tone: 'yellow',
    icon: 'clock',
  },
]

const suggestedQuestions = [
  {
    title: 'Leadership',
    body: 'Tell me about a time you influenced a team without having direct authority.',
  },
  {
    title: 'Enterprise Experience',
    body: 'Describe a complex stakeholder or project you handled in a larger organization.',
  },
  {
    title: 'Career Motivation',
    body: 'What motivated your recent career moves? What are you looking for in your next role?',
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

const candidateFirstName = computed(() => props.candidateName.split(' ').filter(Boolean)[0] ?? 'Candidate')

const resolvedCandidateEmail = computed(() => {
  if (props.candidateEmail.trim()) {
    return props.candidateEmail
  }

  const emailSlug = props.candidateName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')

  return `${emailSlug || 'candidate'}@email.com`
})

const stageBadgeLabel = computed(() => `${props.candidateStage.toUpperCase()} STAGE`)
const stageDurationCopy = computed(() => `In ${props.candidateStage.toLowerCase()} stage for 4 days`)
const insightCopy = computed(() => `Candidates with similar profiles who validated leadership skills in interview had a 2.1x higher offer rate.`)

function closeOverlay() {
  emit('close')
}

function addRiskNote() {
  emit('add-risk-note')
  emit('close')
}

function continueToNextStage() {
  emit('continue-next-stage')
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-risk-overlay" @click.self="closeOverlay">
      <section class="ai-risk-modal">
        <header class="ai-risk-modal__head">
          <div class="ai-risk-modal__title">
            <span class="ai-risk-modal__title-icon">
              <AppIcon name="shield" :size="18" />
            </span>
            <div>
              <div class="ai-risk-modal__heading-row">
                <h2>AI Risk Detection</h2>
                <em>Beta</em>
              </div>
              <p>Quickly identify potential risks and get guidance on how to validate them.</p>
            </div>
          </div>

          <button class="ai-risk-modal__close" type="button" aria-label="Close AI Risk Detection" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="ai-risk-modal__body">
          <section class="ai-risk-hero">
            <article class="ai-risk-profile">
              <span class="ai-risk-profile__avatar">{{ candidateInitials }}</span>
              <div class="ai-risk-profile__copy">
                <div class="ai-risk-profile__name-row">
                  <strong>{{ candidateName }}</strong>
                  <span>{{ stageBadgeLabel }}</span>
                </div>
                <small class="ai-risk-profile__role">{{ candidateRole }}</small>
                <div class="ai-risk-profile__meta">
                  <span><AppIcon name="mapPin" :size="13" /> {{ candidateLocation }}</span>
                  <span><AppIcon name="mail" :size="13" /> {{ resolvedCandidateEmail }}</span>
                  <span><AppIcon name="calendar" :size="13" /> Applied on {{ candidateAppliedOn }}</span>
                </div>
                <p>{{ stageDurationCopy }}</p>
              </div>
            </article>

            <div class="ai-risk-scoreboard">
              <div class="ai-risk-scoreboard__match">
                <small>Match score <AppIcon name="info" :size="13" /></small>
                <strong>94%</strong>
                <em>Excellent Match</em>
              </div>

              <div class="ai-risk-scoreboard__divider" />

              <div class="ai-risk-scoreboard__risk">
                <small>Risk level <AppIcon name="info" :size="13" /></small>
                <div class="ai-risk-scoreboard__gauge">
                  <div class="ai-risk-scoreboard__gauge-arc" />
                  <span class="ai-risk-scoreboard__needle" />
                  <strong>Medium</strong>
                </div>
                <em>3 risks detected</em>
              </div>
            </div>
          </section>

          <section class="ai-risk-content">
            <div class="ai-risk-content__main">
              <div class="ai-risk-section-head">
                <strong>Identified Risks</strong>
                <AppIcon name="info" :size="14" />
              </div>

              <div class="ai-risk-list">
                <article
                  v-for="item in riskCards"
                  :key="item.title"
                  class="ai-risk-card"
                  :class="`is-${item.tone}`"
                >
                  <div class="ai-risk-card__left">
                    <span class="ai-risk-card__icon"><AppIcon :name="item.icon" :size="18" /></span>
                    <div class="ai-risk-card__copy">
                      <div class="ai-risk-card__title-row">
                        <strong>{{ item.title }}</strong>
                        <em>{{ item.level }}</em>
                      </div>
                      <p>{{ item.summary }}</p>
                      <small>Why it matters: {{ item.impact }}</small>
                    </div>
                  </div>

                  <div class="ai-risk-card__right">
                    <div class="ai-risk-card__top">
                      <strong>How to validate</strong>
                      <AppIcon name="chevronDown" :size="16" />
                    </div>
                    <p>{{ item.validation }}</p>
                    <button type="button">
                      <AppIcon name="message" :size="14" />
                      <span>Add question</span>
                    </button>
                  </div>
                </article>
              </div>

              <article class="ai-risk-insight">
                <span><AppIcon name="sparkles" :size="16" /></span>
                <div>
                  <strong>Nitro Insight</strong>
                  <p>{{ insightCopy }}</p>
                </div>
              </article>
            </div>

            <aside class="ai-risk-content__side">
              <article class="ai-risk-verdict">
                <div class="ai-risk-verdict__head">
                  <AppIcon name="shield" :size="18" />
                  <strong>Nitro Verdict</strong>
                </div>

                <h3>Proceed with Caution</h3>
                <ul>
                  <li>Risks are not disqualifying.</li>
                  <li>Candidate is a strong match for the role.</li>
                  <li>Validate leadership capability and long-term fit during interview.</li>
                </ul>
              </article>

              <article class="ai-risk-questions">
                <div class="ai-risk-questions__head">
                  <AppIcon name="message" :size="16" />
                  <strong>Suggested Interview Questions</strong>
                </div>

                <div class="ai-risk-questions__list">
                  <article v-for="(item, index) in suggestedQuestions" :key="item.title" class="ai-risk-question-card">
                    <span>{{ index + 1 }}</span>
                    <div>
                      <strong>{{ item.title }}</strong>
                      <p>{{ item.body }}</p>
                    </div>
                  </article>
                </div>
              </article>
            </aside>
          </section>
        </div>

        <footer class="ai-risk-modal__footer">
          <button class="ai-risk-link" type="button">
            <span>View Full Profile</span>
            <AppIcon name="external-link" :size="14" />
          </button>

          <div class="ai-risk-modal__actions">
            <button class="ai-risk-button ai-risk-button--ghost" type="button" @click="closeOverlay">Close</button>
            <button class="ai-risk-button ai-risk-button--ghost is-pink" type="button" @click="addRiskNote">
              <AppIcon name="edit" :size="15" />
              <span>Add Risk Note</span>
            </button>
            <button class="ai-risk-button ai-risk-button--primary" type="button" @click="continueToNextStage">
              <span>Continue to Next Stage</span>
              <AppIcon name="chevronRight" :size="15" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-risk-overlay {
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

.ai-risk-modal {
  width: min(100%, 1150px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.22);
}

.ai-risk-modal__head,
.ai-risk-modal__title,
.ai-risk-modal__heading-row,
.ai-risk-hero,
.ai-risk-profile,
.ai-risk-profile__name-row,
.ai-risk-profile__meta,
.ai-risk-scoreboard,
.ai-risk-card__left,
.ai-risk-card__top,
.ai-risk-card__title-row,
.ai-risk-content,
.ai-risk-verdict__head,
.ai-risk-questions__head,
.ai-risk-question-card,
.ai-risk-insight,
.ai-risk-modal__footer,
.ai-risk-modal__actions,
.ai-risk-button,
.ai-risk-link,
.ai-risk-section-head {
  display: flex;
  align-items: center;
}

.ai-risk-modal__head,
.ai-risk-modal__footer,
.ai-risk-content {
  justify-content: space-between;
}

.ai-risk-modal__head {
  padding: 20px 24px;
  border-bottom: 1px solid #edf2fb;
}

.ai-risk-modal__title {
  gap: 14px;
}

.ai-risk-modal__title-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #fff1f8;
  color: #ff67b5;
}

.ai-risk-modal__heading-row {
  gap: 10px;
}

.ai-risk-modal__heading-row h2,
.ai-risk-profile__copy strong,
.ai-risk-section-head strong,
.ai-risk-card__copy strong,
.ai-risk-card__right strong,
.ai-risk-verdict h3,
.ai-risk-verdict__head strong,
.ai-risk-questions__head strong,
.ai-risk-question-card strong,
.ai-risk-insight strong {
  margin: 0;
  color: #1f2940;
}

.ai-risk-modal__heading-row em {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  background: #f2efff;
  color: #6570f6;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-risk-modal__title p,
.ai-risk-profile__copy p,
.ai-risk-profile__copy small,
.ai-risk-card__copy p,
.ai-risk-card__right p,
.ai-risk-insight p,
.ai-risk-question-card p {
  margin: 0;
  color: #738199;
}

.ai-risk-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.ai-risk-modal__body {
  overflow: auto;
}

.ai-risk-hero {
  padding: 26px 32px;
  border-bottom: 1px solid #edf2fb;
}

.ai-risk-profile {
  gap: 18px;
  min-width: 0;
}

.ai-risk-profile__avatar {
  width: 96px;
  height: 96px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f2f5fb 0%, #dce5f3 100%);
  color: #7b8aa6;
  font-size: 1.5rem;
  font-weight: 800;
}

.ai-risk-profile__name-row {
  gap: 12px;
}

.ai-risk-profile__copy strong {
  display: block;
  font-size: 1.2rem;
}

.ai-risk-profile__name-row span {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 9px;
  border-radius: 8px;
  background: #f2efff;
  color: #6570f6;
  font-size: 0.7rem;
  font-weight: 800;
}

.ai-risk-profile__role {
  display: block;
  margin-top: 6px;
  color: #2c3650;
  font-size: 0.98rem;
}

.ai-risk-profile__meta {
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.ai-risk-profile__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #62728d;
}

.ai-risk-profile__copy p {
  margin-top: 10px;
  font-size: 0.95rem;
}

.ai-risk-scoreboard {
  gap: 28px;
}

.ai-risk-scoreboard__match,
.ai-risk-scoreboard__risk {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.ai-risk-scoreboard small {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #667792;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-risk-scoreboard__match strong {
  color: #22b857;
  font-size: 2rem;
  line-height: 0.95;
}

.ai-risk-scoreboard__match em,
.ai-risk-scoreboard__risk em {
  display: inline-flex;
  align-items: center;
  min-height: 18px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-risk-scoreboard__match em {
  background: #eefcf3;
  color: #22b857;
}

.ai-risk-scoreboard__divider {
  width: 1px;
  align-self: stretch;
  background: #e6ecf5;
}

.ai-risk-scoreboard__gauge {
  position: relative;
  width: 122px;
  height: 72px;
  display: grid;
  justify-items: center;
  align-content: end;
}

.ai-risk-scoreboard__gauge-arc {
  position: absolute;
  inset: 0;
  border-top-left-radius: 122px;
  border-top-right-radius: 122px;
  overflow: hidden;
}

.ai-risk-scoreboard__gauge-arc::before {
  content: '';
  position: absolute;
  inset: 0;
  background: conic-gradient(from 180deg, #e9edf4 0deg, #e9edf4 94deg, #ff7a1c 94deg, #ff7a1c 180deg);
  border-radius: inherit;
}

.ai-risk-scoreboard__gauge-arc::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  top: 14px;
  bottom: -14px;
  background: #fff;
  border-top-left-radius: 999px;
  border-top-right-radius: 999px;
}

.ai-risk-scoreboard__needle {
  position: absolute;
  bottom: 10px;
  width: 48px;
  height: 2px;
  background: #263247;
  transform-origin: right center;
  transform: rotate(-52deg);
}

.ai-risk-scoreboard__needle::after {
  content: '';
  position: absolute;
  right: -2px;
  top: -3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #263247;
}

.ai-risk-scoreboard__risk strong {
  position: relative;
  z-index: 1;
  color: #ff7a1c;
  font-size: 1.55rem;
  line-height: 1;
}

.ai-risk-scoreboard__risk em {
  background: #fff4ea;
  color: #ff7a1c;
}

.ai-risk-content {
  align-items: stretch;
}

.ai-risk-content__main {
  flex: 1;
  min-width: 0;
  padding: 30px 32px;
}

.ai-risk-section-head {
  gap: 8px;
  color: #64758f;
}

.ai-risk-list {
  display: grid;
  gap: 16px;
  margin-top: 18px;
}

.ai-risk-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 22px;
  padding: 22px;
  border: 1px solid #e6ecf5;
  border-left-width: 6px;
  border-radius: 16px;
  background: #fff;
}

.ai-risk-card.is-red {
  border-left-color: #ff4d57;
}

.ai-risk-card.is-orange {
  border-left-color: #ff7a1c;
}

.ai-risk-card.is-yellow {
  border-left-color: #ffd547;
}

.ai-risk-card__left {
  gap: 14px;
  align-items: flex-start;
}

.ai-risk-card__icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #fff6f7;
  color: #ff4d57;
}

.ai-risk-card.is-orange .ai-risk-card__icon {
  background: #fff4ea;
  color: #ff7a1c;
}

.ai-risk-card.is-yellow .ai-risk-card__icon {
  background: #fffbe9;
  color: #d39f00;
}

.ai-risk-card__title-row {
  gap: 10px;
  flex-wrap: wrap;
}

.ai-risk-card__title-row strong {
  font-size: 1rem;
}

.ai-risk-card__title-row em {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  background: #fff6f7;
  color: #ff4d57;
  font-size: 0.64rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-risk-card.is-orange .ai-risk-card__title-row em {
  background: #fff4ea;
  color: #ff7a1c;
}

.ai-risk-card.is-yellow .ai-risk-card__title-row em {
  background: #fffbe9;
  color: #d39f00;
}

.ai-risk-card__copy p {
  margin-top: 6px;
  color: #2f3952;
  font-size: 0.98rem;
  line-height: 1.45;
}

.ai-risk-card__copy small {
  display: block;
  margin-top: 14px;
  color: #64758f;
  line-height: 1.45;
}

.ai-risk-card__right {
  padding-left: 22px;
  border-left: 1px solid #edf2fb;
}

.ai-risk-card__top {
  justify-content: space-between;
}

.ai-risk-card__right p {
  margin-top: 10px;
  line-height: 1.5;
}

.ai-risk-card__right button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  margin-top: 16px;
  padding: 0 12px;
  border: 1px solid #ffd8ea;
  border-radius: 10px;
  background: #fff;
  color: #ff67b5;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.ai-risk-insight {
  gap: 14px;
  margin-top: 24px;
  padding: 20px 22px;
  border: 1px solid #d8e4ff;
  border-radius: 14px;
  background: #f8fbff;
}

.ai-risk-insight span {
  color: #ff67b5;
}

.ai-risk-insight p {
  margin-top: 6px;
  line-height: 1.5;
}

.ai-risk-content__side {
  width: 382px;
  padding: 30px 32px;
  border-left: 1px solid #edf2fb;
  background: #fbfcff;
}

.ai-risk-verdict,
.ai-risk-questions {
  padding: 24px;
  border: 1px solid #d8f1e4;
  border-radius: 16px;
  background: #fff;
}

.ai-risk-verdict__head {
  gap: 10px;
  color: #0aa567;
}

.ai-risk-verdict h3 {
  margin-top: 14px;
  color: #0aa567;
  font-size: 1.2rem;
}

.ai-risk-verdict ul {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.ai-risk-verdict li {
  color: #2f3952;
  line-height: 1.45;
}

.ai-risk-verdict li::before {
  content: '\2713';
  margin-right: 10px;
  color: #0aa567;
}

.ai-risk-questions {
  margin-top: 22px;
  border-color: #e6ecf5;
}

.ai-risk-questions__head {
  gap: 10px;
  color: #5565ff;
}

.ai-risk-questions__list {
  display: grid;
  gap: 18px;
  margin-top: 20px;
}

.ai-risk-question-card {
  gap: 14px;
  align-items: flex-start;
}

.ai-risk-question-card span {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  border-radius: 10px;
  background: #eef2ff;
  color: #5565ff;
  font-weight: 800;
}

.ai-risk-question-card p {
  margin-top: 6px;
  line-height: 1.5;
}

.ai-risk-modal__footer {
  padding: 16px 32px;
  border-top: 1px solid #edf2fb;
}

.ai-risk-link {
  gap: 6px;
  border: 0;
  background: transparent;
  color: #ff67b5;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.ai-risk-modal__actions {
  gap: 12px;
  flex-wrap: wrap;
}

.ai-risk-button {
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

.ai-risk-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #2e3952;
}

.ai-risk-button--ghost.is-pink {
  border-color: #ffd8ea;
  color: #ff67b5;
}

.ai-risk-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.18);
}

@media (max-width: 1100px) {
  .ai-risk-hero,
  .ai-risk-content,
  .ai-risk-modal__footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .ai-risk-content__side {
    width: 100%;
    border-left: 0;
    border-top: 1px solid #edf2fb;
  }

  .ai-risk-card {
    grid-template-columns: 1fr;
  }

  .ai-risk-card__right {
    padding-left: 0;
    border-left: 0;
    border-top: 1px solid #edf2fb;
    padding-top: 18px;
  }
}

@media (max-width: 720px) {
  .ai-risk-overlay {
    padding: 12px;
  }

  .ai-risk-modal {
    max-height: calc(100vh - 24px);
    border-radius: 18px;
  }

  .ai-risk-modal__head,
  .ai-risk-hero,
  .ai-risk-content__main,
  .ai-risk-content__side,
  .ai-risk-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .ai-risk-modal__title,
  .ai-risk-profile,
  .ai-risk-scoreboard,
  .ai-risk-modal__footer,
  .ai-risk-modal__actions {
    width: 100%;
  }

  .ai-risk-scoreboard,
  .ai-risk-modal__footer,
  .ai-risk-modal__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-risk-scoreboard__divider {
    width: 100%;
    height: 1px;
  }

  .ai-risk-button {
    width: 100%;
  }
}
</style>
