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
    default: 'INTERVIEW STAGE',
  },
  candidateAppliedOn: {
    type: String,
    default: '12 May 2025',
  },
})

const emit = defineEmits(['close', 'schedule-screening'])

const recommendationItems = [
  {
    title: 'Strong UX Research skills',
    copy: 'Extensive experience in user research and usability testing',
  },
  {
    title: 'Advanced Design Systems',
    copy: 'Proven track record building and maintaining design systems',
  },
  {
    title: 'Figma Expertise',
    copy: 'Expert level in Figma with advanced features',
  },
  {
    title: 'SaaS Industry Experience',
    copy: 'Worked with B2B SaaS products and complex user flows',
  },
]

const gapItems = [
  {
    title: 'No People Management',
    copy: 'No direct management experience yet',
  },
  {
    title: 'Limited Enterprise Experience',
    copy: 'Mostly mid-market SaaS exposure',
  },
]

const scoreRows = [
  { label: 'Skills', value: 35, tone: 'pink' },
  { label: 'Experience', value: 25, tone: 'violet' },
  { label: 'Portfolio', value: 20, tone: 'pink' },
]

const metricCards = [
  { value: '91%', label: 'Screening Pass', icon: 'clipboard-check' },
  { value: '82%', label: 'Interview Pass', icon: 'message' },
  { value: '68%', label: 'Offer Likelihood', icon: 'star' },
]

const similarHires = [
  { name: 'Emma Wilson', role: 'Senior UX Designer', match: '94% Match', note: 'Promoted after 8 months' },
  { name: 'Daniel Lee', role: 'UX Designer', match: '92% Match', note: 'High performer' },
  { name: 'Priya Patel', role: 'Senior UX Designer', match: '90% Match', note: 'Exceeded expectations' },
]

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateFirstName = computed(() => (
  props.candidateName.split(' ').filter(Boolean)[0] ?? 'The candidate'
))

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

const resolvedInsightCopy = computed(() => (
  `${candidateFirstName.value} shows excellent individual contributor potential and strong ownership. Great fit for senior IC or future leadership track.`
))

const resolvedRecommendationCopy = computed(() => (
  `Based on our deep analysis, ${candidateFirstName.value} is an ideal candidate for this role. Their specialized SaaS experience and design systems mastery provide an immediate competitive advantage for the team.`
))

function closeOverlay() {
  emit('close')
}

function scheduleScreening() {
  emit('schedule-screening')
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-match-overlay" @click.self="closeOverlay">
      <section class="ai-match-modal">
        <header class="ai-match-modal__head">
          <div class="ai-match-modal__title">
            <span class="ai-match-modal__title-icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <h2>AI Match Analysis</h2>
              <p>AI-powered analysis to help you make faster, smarter hiring decisions</p>
            </div>
          </div>

          <button class="ai-match-modal__close" type="button" aria-label="Close AI Match Analysis" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="ai-match-modal__body">
          <section class="ai-match-hero">
            <article class="ai-match-profile">
              <span class="ai-match-profile__avatar">{{ candidateInitials }}</span>
              <div class="ai-match-profile__copy">
                <div class="ai-match-profile__name-row">
                  <strong>{{ candidateName }}</strong>
                  <em>{{ candidateStage }}</em>
                </div>
                <span>{{ candidateRole }}</span>
                <div class="ai-match-profile__meta">
                  <span><AppIcon name="mapPin" :size="13" /> {{ candidateLocation }}</span>
                  <span><AppIcon name="mail" :size="13" /> {{ resolvedCandidateEmail }}</span>
                </div>
                <small>Applied on {{ candidateAppliedOn }}</small>
              </div>
            </article>

            <div class="ai-match-score">
              <strong>94%</strong>
              <span>Excellent Match</span>
              <small>Top 5% of applicants</small>
            </div>

            <div class="ai-match-rank">
              <div class="ai-match-rank__ring">
                <strong>#2 of 48</strong>
                <span>Applicant Rank</span>
              </div>
            </div>
          </section>

          <section class="ai-match-grid">
            <article class="ai-match-card">
              <h3>Why Nitro Recommends</h3>
              <div class="ai-match-list">
                <div v-for="item in recommendationItems" :key="item.title" class="ai-match-list__item">
                  <span class="ai-match-list__icon is-good"><AppIcon name="check" :size="12" /></span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.copy }}</p>
                  </div>
                </div>
              </div>
            </article>

            <article class="ai-match-card">
              <h3>Potential Gaps</h3>
              <div class="ai-match-list">
                <div v-for="item in gapItems" :key="item.title" class="ai-match-list__item">
                  <span class="ai-match-list__icon is-warn"><AppIcon name="alert" :size="12" /></span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.copy }}</p>
                  </div>
                </div>
              </div>
            </article>

            <article class="ai-match-card">
              <div class="ai-match-card__head">
                <h3>Why 94% Match?</h3>
                <AppIcon name="info" :size="14" />
              </div>
              <div class="ai-match-score-breakdown">
                <div v-for="row in scoreRows" :key="row.label" class="ai-match-score-breakdown__row">
                  <div class="ai-match-score-breakdown__head">
                    <span>{{ row.label }}</span>
                    <strong>{{ row.value }}%</strong>
                  </div>
                  <div class="ai-match-score-breakdown__bar" :class="`is-${row.tone}`">
                    <span :style="{ width: `${row.value * 2.4}%` }" />
                  </div>
                </div>
              </div>
              <div class="ai-match-growth">
                <strong>Match Growth Area</strong>
                <span>People leadership/mentoring</span>
                <span>Enterprise SaaS examples</span>
              </div>
            </article>

            <article class="ai-match-insight">
              <small>Nitro Insight</small>
              <p>{{ resolvedInsightCopy }}</p>
            </article>
          </section>

          <section class="ai-match-metrics">
            <div class="ai-match-section-title">
              <span class="ai-match-section-title__icon"><AppIcon name="trend-up" :size="18" /></span>
              <div>
                <h3>Predicted Success Metrics</h3>
                <p>Based on performance data from 1,200+ similar hires</p>
              </div>
            </div>

            <div class="ai-match-metrics__grid">
              <article v-for="item in metricCards" :key="item.label" class="ai-match-metric-card">
                <span class="ai-match-metric-card__icon"><AppIcon :name="item.icon" :size="18" /></span>
                <div>
                  <strong>{{ item.value }}</strong>
                  <small>{{ item.label }}</small>
                </div>
              </article>
            </div>
          </section>

          <section class="ai-match-hires">
            <div class="ai-match-section-title ai-match-section-title--spread">
              <div>
                <h3>Similar Successful Hires</h3>
              </div>
              <button type="button">View full pipeline comparison</button>
            </div>

            <div class="ai-match-hires__grid">
              <article v-for="hire in similarHires" :key="hire.name" class="ai-match-hire-card">
                <span class="ai-match-hire-card__avatar">{{ hire.name.split(' ').map((part) => part[0]).slice(0,2).join('') }}</span>
                <div>
                  <strong>{{ hire.name }}</strong>
                  <small>{{ hire.role }}</small>
                  <p>{{ hire.note }}</p>
                </div>
                <em>{{ hire.match }}</em>
              </article>
            </div>
          </section>

          <section class="ai-match-recommendation">
            <div class="ai-match-recommendation__main">
              <small>Nitro Smart Recommendation</small>
              <div class="ai-match-recommendation__title">
                <strong>Move to Qualified</strong>
                <span>Confidence: 93%</span>
              </div>
              <p>{{ resolvedRecommendationCopy }}</p>
            </div>

            <div class="ai-match-recommendation__side">
              <div>
                <small>Suggested Next Step</small>
                <strong>Schedule Screening</strong>
                <span>Expected Success: 88%</span>
              </div>
              <button type="button" @click="scheduleScreening">
                <AppIcon name="calendar" :size="16" />
                <span>Schedule Screening</span>
              </button>
            </div>
          </section>
        </div>

        <footer class="ai-match-modal__footer">
          <button class="ai-match-link" type="button">
            <span>View Full Detailed Profile</span>
            <AppIcon name="external-link" :size="14" />
          </button>
          <div class="ai-match-modal__actions">
            <button class="ai-match-button ai-match-button--ghost" type="button" @click="closeOverlay">Close</button>
            <button class="ai-match-button ai-match-button--primary" type="button" @click="closeOverlay">
              <span>Move to Qualified</span>
              <AppIcon name="chevronRight" :size="15" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-match-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(21, 28, 42, 0.54);
  backdrop-filter: blur(5px);
}

.ai-match-modal {
  width: min(100%, 1180px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.24);
}

.ai-match-modal__head,
.ai-match-modal__title,
.ai-match-hero,
.ai-match-profile,
.ai-match-profile__name-row,
.ai-match-profile__meta,
.ai-match-card__head,
.ai-match-list__item,
.ai-match-section-title,
.ai-match-section-title--spread,
.ai-match-metric-card,
.ai-match-hire-card,
.ai-match-recommendation,
.ai-match-modal__footer,
.ai-match-modal__actions,
.ai-match-button,
.ai-match-link {
  display: flex;
  align-items: center;
}

.ai-match-modal__head,
.ai-match-modal__footer,
.ai-match-section-title--spread {
  justify-content: space-between;
}

.ai-match-modal__head {
  padding: 20px 24px;
  border-bottom: 1px solid #edf2fb;
}

.ai-match-modal__title {
  gap: 14px;
}

.ai-match-modal__title-icon,
.ai-match-section-title__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ai-match-modal__title-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fff1f8;
  color: #ff67b5;
}

.ai-match-modal__title h2,
.ai-match-section-title h3,
.ai-match-card h3,
.ai-match-score strong,
.ai-match-rank__ring strong,
.ai-match-metric-card strong,
.ai-match-recommendation__title strong,
.ai-match-hire-card strong {
  margin: 0;
  color: #1f2940;
}

.ai-match-modal__title p,
.ai-match-profile__copy span,
.ai-match-profile__copy small,
.ai-match-list__item p,
.ai-match-section-title p,
.ai-match-metric-card small,
.ai-match-hire-card small,
.ai-match-hire-card p,
.ai-match-recommendation p,
.ai-match-growth span {
  margin: 0;
  color: #738199;
}

.ai-match-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.ai-match-modal__body {
  overflow: auto;
}

.ai-match-hero {
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 24px;
  border-bottom: 1px solid #edf2fb;
}

.ai-match-profile {
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.ai-match-profile__avatar,
.ai-match-hire-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-weight: 800;
}

.ai-match-profile__avatar {
  width: 88px;
  height: 88px;
  flex: 0 0 88px;
  font-size: 1.4rem;
}

.ai-match-profile__copy strong {
  display: block;
  font-size: 1.25rem;
}

.ai-match-profile__name-row {
  gap: 12px;
}

.ai-match-profile__name-row em {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: #fff1f8;
  color: #ff67b5;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
}

.ai-match-profile__copy > span {
  display: block;
  margin-top: 6px;
  font-size: 1rem;
  color: #3a4867;
}

.ai-match-profile__meta {
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.ai-match-profile__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #66758f;
}

.ai-match-profile__copy small {
  display: block;
  margin-top: 14px;
}

.ai-match-score {
  min-width: 188px;
  text-align: center;
}

.ai-match-score strong {
  display: block;
  color: #f064b0;
  font-size: clamp(2.6rem, 5.2vw, 3.95rem);
  line-height: 0.9;
}

.ai-match-score span {
  display: block;
  margin-top: 8px;
  color: #ff67b5;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.ai-match-score small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  margin-top: 12px;
  padding: 0 12px;
  border-radius: 999px;
  background: #fff2f8;
  color: #ff67b5;
  font-size: 0.8rem;
  font-weight: 700;
}

.ai-match-rank {
  min-width: 138px;
  display: grid;
  place-items: center;
}

.ai-match-rank__ring {
  position: relative;
  width: 108px;
  height: 108px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #fff 60%, transparent 61%),
    conic-gradient(from 120deg, #6570f6 0deg, #6570f6 52deg, transparent 52deg 125deg, #6570f6 125deg 178deg, transparent 178deg 250deg, #6570f6 250deg 305deg, transparent 305deg 360deg);
  text-align: center;
}

.ai-match-rank__ring strong {
  display: block;
  font-size: 0.74rem;
  line-height: 1.1;
}

.ai-match-rank__ring span {
  display: block;
  width: 84px;
  margin-top: 6px;
  color: #7d89a0;
  font-size: 0.54rem;
  line-height: 1.25;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ai-match-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 22px;
  padding: 24px;
  border-bottom: 1px solid #edf2fb;
}

.ai-match-card,
.ai-match-insight {
  padding: 22px;
  border: 1px solid #e9eef7;
  border-radius: 18px;
  background: #fff;
}

.ai-match-card__head {
  justify-content: space-between;
  gap: 10px;
}

.ai-match-list {
  display: grid;
  gap: 18px;
  margin-top: 18px;
}

.ai-match-list__item {
  gap: 12px;
  align-items: flex-start;
}

.ai-match-list__icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex: 0 0 20px;
}

.ai-match-list__icon.is-good {
  background: #eef1ff;
  color: #6b73ff;
}

.ai-match-list__icon.is-warn {
  background: #fff4ea;
  color: #ff8c23;
}

.ai-match-list__item strong {
  display: block;
  color: #1f2940;
  font-size: 0.92rem;
}

.ai-match-list__item p {
  margin-top: 4px;
  line-height: 1.45;
}

.ai-match-score-breakdown {
  display: grid;
  gap: 18px;
  margin-top: 18px;
}

.ai-match-score-breakdown__head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #718099;
  text-transform: uppercase;
  font-size: 0.74rem;
  font-weight: 800;
}

.ai-match-score-breakdown__head strong {
  font-size: 0.78rem;
}

.ai-match-score-breakdown__bar {
  height: 5px;
  margin-top: 8px;
  border-radius: 999px;
  background: #e8edf4;
  overflow: hidden;
}

.ai-match-score-breakdown__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.ai-match-score-breakdown__bar.is-pink span {
  background: linear-gradient(90deg, #ff72ba 0%, #f15fab 100%);
}

.ai-match-score-breakdown__bar.is-violet span {
  background: linear-gradient(90deg, #6970f8 0%, #5a63f2 100%);
}

.ai-match-growth {
  margin-top: 22px;
  padding: 16px;
  border-radius: 14px;
  background: #f7f9fd;
}

.ai-match-growth strong {
  display: block;
  margin-bottom: 10px;
  color: #6570f6;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ai-match-growth span {
  display: block;
  line-height: 1.55;
}

.ai-match-insight {
  grid-column: 2 / 3;
  border-color: #ffd9eb;
  background: #fffafd;
}

.ai-match-insight small {
  display: block;
  color: #ff67b5;
  font-size: 0.84rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-match-insight p {
  margin-top: 14px;
  color: #48556f;
  font-size: 1rem;
  line-height: 1.6;
}

.ai-match-metrics,
.ai-match-hires {
  padding: 24px;
  border-bottom: 1px solid #edf2fb;
}

.ai-match-section-title {
  gap: 12px;
}

.ai-match-section-title__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #eff1ff;
  color: #6570f6;
}

.ai-match-metrics__grid,
.ai-match-hires__grid {
  display: grid;
  gap: 18px;
  margin-top: 22px;
}

.ai-match-metrics__grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.ai-match-metric-card {
  gap: 18px;
  padding: 24px;
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
}

.ai-match-metric-card__icon {
  width: 62px;
  height: 62px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: inset 0 0 0 5px #6570f6;
  color: #6570f6;
  flex: 0 0 62px;
}

.ai-match-metric-card strong {
  display: block;
  font-size: 2rem;
}

.ai-match-metric-card small {
  display: block;
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.86rem;
  font-weight: 800;
}

.ai-match-section-title--spread button,
.ai-match-link {
  border: 0;
  background: transparent;
  color: #6570f6;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.ai-match-hires__grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.ai-match-hire-card {
  gap: 14px;
  padding: 18px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
  background: #fff;
}

.ai-match-hire-card__avatar {
  width: 54px;
  height: 54px;
  flex: 0 0 54px;
}

.ai-match-hire-card strong,
.ai-match-hire-card small,
.ai-match-hire-card p {
  display: block;
}

.ai-match-hire-card p {
  margin-top: 8px;
  color: #6570f6;
}

.ai-match-hire-card em {
  margin-left: auto;
  color: #6570f6;
  font-style: normal;
  font-size: 0.76rem;
  font-weight: 800;
  white-space: nowrap;
}

.ai-match-recommendation {
  justify-content: space-between;
  gap: 22px;
  margin: 24px;
  padding: 26px 24px;
  border: 1px solid #ffd8ea;
  border-radius: 18px;
  background: linear-gradient(180deg, #fffafd 0%, #fff 100%);
}

.ai-match-recommendation__main {
  max-width: 680px;
}

.ai-match-recommendation__main > small,
.ai-match-recommendation__side small {
  display: block;
  color: #ff67b5;
  font-size: 0.84rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-match-recommendation__title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.ai-match-recommendation__title strong {
  font-size: 1.35rem;
}

.ai-match-recommendation__title span,
.ai-match-recommendation__side span {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f4efff;
  color: #8b73ff;
  font-size: 0.8rem;
  font-weight: 700;
}

.ai-match-recommendation p {
  margin-top: 14px;
  line-height: 1.6;
  font-size: 1rem;
}

.ai-match-recommendation__side {
  display: grid;
  gap: 14px;
  min-width: 250px;
  justify-items: end;
  text-align: right;
}

.ai-match-recommendation__side strong {
  display: block;
  margin-top: 8px;
  color: #ff67b5;
  font-size: 1.25rem;
}

.ai-match-recommendation__side button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 274px;
  height: 46px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.2);
}

.ai-match-modal__footer {
  padding: 18px 24px 24px;
  border-top: 1px solid #edf2fb;
}

.ai-match-modal__actions {
  gap: 12px;
}

.ai-match-button {
  justify-content: center;
  gap: 8px;
  min-width: 142px;
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.ai-match-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #42506d;
}

.ai-match-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.2);
}

@media (max-width: 1100px) {
  .ai-match-hero,
  .ai-match-recommendation {
    flex-direction: column;
    align-items: flex-start;
  }

  .ai-match-grid,
  .ai-match-metrics__grid,
  .ai-match-hires__grid {
    grid-template-columns: 1fr;
  }

  .ai-match-insight {
    grid-column: auto;
  }

  .ai-match-recommendation__side {
    justify-items: start;
    text-align: left;
  }
}

@media (max-width: 720px) {
  .ai-match-overlay {
    padding: 12px;
  }

  .ai-match-modal {
    width: 100%;
    max-height: calc(100vh - 24px);
    border-radius: 20px;
  }

  .ai-match-modal__body,
  .ai-match-metrics,
  .ai-match-hires,
  .ai-match-hero,
  .ai-match-grid,
  .ai-match-modal__head,
  .ai-match-modal__footer,
  .ai-match-recommendation {
    padding-left: 18px;
    padding-right: 18px;
  }

  .ai-match-modal__head,
  .ai-match-modal__footer,
  .ai-match-profile {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .ai-match-modal__footer {
    gap: 12px;
  }

  .ai-match-modal__actions,
  .ai-match-button,
  .ai-match-recommendation__side button {
    width: 100%;
  }
}
</style>
