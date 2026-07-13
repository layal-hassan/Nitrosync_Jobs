<script setup>
import { computed } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import { getJobById } from '../../data/jobs'

const props = defineProps({
  jobId: {
    type: String,
    default: 'ac-1187',
  },
  candidateId: {
    type: String,
    default: '',
  },
  candidateName: {
    type: String,
    default: 'Marvin McKinney',
  },
  candidateRole: {
    type: String,
    default: 'Senior Frontend Developer',
  },
  sourceStage: {
    type: String,
    default: 'Offer',
  },
})

const emit = defineEmits(['back', 'open-source', 'open-offer-package'])

const job = computed(() => getJobById(props.jobId))

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const packageHref = computed(() => {
  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'scratch-offer-package',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  return `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
})

const reviewMetrics = [
  ['Offer Competitiveness', '94%', 'Excellent', 'Very competitive in San Francisco market', 'ring'],
  ['Market Position', 'P62', 'Higher than market', 'Top 38% of offers for this role', 'violet'],
  ['Acceptance Prediction', '94%', 'High likelihood', 'Strong offer with high acceptance chance', 'green'],
  ['Internal Equity', 'Aligned', '', 'Well aligned with internal equity', 'green'],
  ['Budget Check', 'Approved', '', 'Within approved budget range', 'green'],
]

const aiInsights = [
  ['Base Salary', 'Increasing base salary by $3,000 could improve acceptance probability from 94% to 97%.', '+ $3,000', 'Apply', 'trend-up'],
  ['Equity (RSUs)', '750 RSUs is competitive. Top offers for this role typically range from 600 - 1,000 RSUs.', 'Optimal', '', 'sparkles'],
  ['Benefits Package', 'Great package! Adding a learning budget is a popular perk for this role.', '', 'View suggestions', 'gift'],
  ['Signing Bonus', 'Consider adding a signing bonus to stand out in a competitive market.', '+ $5,000 - $10,000', 'Add', 'wallet'],
]

const scoreRows = [
  ['Compensation', '95/100', 'green'],
  ['Benefits', '90/100', 'violet'],
  ['Equity', '88/100', 'blue'],
  ['Terms', '93/100', 'orange'],
  ['Market Fit', '94/100', 'pink'],
]

const includedRows = [
  ['Base Salary', '$145,000'],
  ['Annual Bonus', '12%'],
  ['Equity (RSUs)', '750 RSUs'],
  ['Signing Bonus', '$10,000'],
  ['Benefits Package', 'Standard US Benefits'],
  ['Relocation Support', '$5,000'],
  ['Work Arrangement', 'Hybrid'],
  ['Start Date', 'June 16, 2025'],
]
</script>

<template>
  <main class="offer-ai-page">
    <section class="offer-ai-shell">
      <header class="offer-ai-header">
        <div class="offer-ai-header__copy">
          <div class="offer-ai-breadcrumb">Offers <span>&gt;</span> Create Offer</div>
          <div class="offer-ai-header__title">
            <h1>Create Offer from Scratch</h1>
            <AppIcon name="sparkles" :size="17" />
          </div>
          <p>Step 4 of 7 - AI review &amp; offer intelligence</p>
        </div>

        <div class="offer-ai-header__actions">
          <button class="offer-ai-save" type="button">
            <AppIcon name="document" :size="14" />
            <span>Save draft</span>
          </button>
          <button class="offer-ai-close" type="button" aria-label="Close" @click="emit('back')">
            <AppIcon name="close" :size="18" />
          </button>
        </div>
      </header>

      <nav class="offer-ai-stepper">
        <div class="offer-ai-step is-done">
          <span><AppIcon name="checkCircle" :size="13" /></span>
          <div><strong>Offer Foundation</strong><small>Basic information</small></div>
        </div>
        <i class="offer-ai-stepper__line" />
        <div class="offer-ai-step is-done">
          <span><AppIcon name="checkCircle" :size="13" /></span>
          <div><strong>Compensation</strong><small>Salary, bonus, equity</small></div>
        </div>
        <i class="offer-ai-stepper__line" />
        <div class="offer-ai-step is-done">
          <span><AppIcon name="checkCircle" :size="13" /></span>
          <div><strong>Benefits &amp; Terms</strong><small>Benefits and conditions</small></div>
        </div>
        <i class="offer-ai-stepper__line" />
        <div class="offer-ai-step is-active">
          <span>4</span>
          <div><strong>AI Review</strong><small>Offer intelligence</small></div>
        </div>
        <i class="offer-ai-stepper__line" />
        <div class="offer-ai-step">
          <span>5</span>
          <div><strong>Offer Package</strong><small>Documents &amp; experience</small></div>
        </div>
        <i class="offer-ai-stepper__line" />
        <div class="offer-ai-step">
          <span>6</span>
          <div><strong>Final Review</strong><small>Review before launch</small></div>
        </div>
        <i class="offer-ai-stepper__line" />
        <div class="offer-ai-step">
          <span>7</span>
          <div><strong>Launch</strong><small>Send offer</small></div>
        </div>
      </nav>

      <section class="offer-ai-layout">
        <section class="offer-ai-main">
          <article class="offer-ai-card offer-ai-intro">
            <div>
              <h2>AI Review &amp; Offer Intelligence</h2>
              <p>Nitro has analyzed all data to ensure this offer is competitive, fair and aligned with your company guidelines.</p>
            </div>
            <button type="button" class="offer-ai-intro__action">
              <AppIcon name="sparkles" :size="14" />
              <span>Recalculate with AI</span>
            </button>
          </article>

          <section class="offer-ai-metrics">
            <article
              v-for="item in reviewMetrics"
              :key="item[0]"
              class="offer-ai-card offer-ai-metric"
              :class="`is-${item[4]}`"
            >
              <small>{{ item[0] }}</small>
              <div v-if="item[4] === 'ring'" class="offer-ai-metric__ring">
                <div><strong>{{ item[1] }}</strong></div>
              </div>
              <strong v-else>{{ item[1] }}</strong>
              <em v-if="item[2]">{{ item[2] }}</em>
              <span>{{ item[3] }}</span>
            </article>
          </section>

          <section class="offer-ai-panels">
            <article class="offer-ai-card offer-ai-insights">
              <div class="offer-ai-section-title">
                <AppIcon name="sparkles" :size="14" />
                <strong>AI Insights</strong>
              </div>
              <p>Key insights and recommendations to optimize your offer.</p>

              <div class="offer-ai-insights__list">
                <article v-for="item in aiInsights" :key="item[0]">
                  <span><AppIcon :name="item[4]" :size="15" /></span>
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                  <em v-if="item[2]">{{ item[2] }}</em>
                  <button v-if="item[3]" type="button">{{ item[3] }}</button>
                </article>
              </div>

              <div class="offer-ai-note">
                <AppIcon name="info" :size="14" />
                <span>These insights are based on market data, internal benchmarks and candidate profile.</span>
              </div>
            </article>

            <article class="offer-ai-card offer-ai-score">
              <strong>Offer Score Breakdown</strong>

              <div class="offer-ai-score__summary">
                <div class="offer-ai-score__ring">
                  <div>
                    <strong>92</strong>
                    <small>Overall Score</small>
                    <em>Excellent</em>
                  </div>
                </div>

                <div class="offer-ai-score__list">
                  <article v-for="item in scoreRows" :key="item[0]">
                    <span class="dot" :class="`is-${item[2]}`" />
                    <span>{{ item[0] }}</span>
                    <strong>{{ item[1] }}</strong>
                  </article>
                </div>
              </div>

              <div class="offer-ai-score__sources">
                <strong>Data Sources</strong>
                <small>This offer intelligence is based on:</small>
                <article><AppIcon name="document" :size="13" /> Live market data (San Francisco, CA)</article>
                <article><AppIcon name="document" :size="13" /> Internal compensation benchmarks</article>
                <article><AppIcon name="document" :size="13" /> Similar offers for Senior Frontend Developer</article>
                <article><AppIcon name="document" :size="13" /> Company budget &amp; equity guidelines</article>
                <article><AppIcon name="document" :size="13" /> Candidate profile &amp; experience</article>
              </div>
            </article>
          </section>
        </section>

        <aside class="offer-ai-side">
          <article class="offer-ai-card offer-ai-summary">
            <div class="offer-ai-summary__head">
              <strong>Offer Summary</strong>
              <button type="button">Edit</button>
            </div>

            <div class="offer-ai-summary__candidate">
              <span class="offer-ai-summary__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <small>{{ candidateRole }}</small>
                <small>{{ job.department }} <span>&bull;</span> Full-time</small>
                <small>San Francisco, CA (Hybrid)</small>
              </div>
            </div>

            <div class="offer-ai-summary__package">
              <div>
                <small>Total Annual Compensation</small>
                <strong>$165,000</strong>
                <span>$145,000 base + $20,000 variable</span>
              </div>
              <div class="offer-ai-summary__badge">
                <strong>P62</strong>
                <small>Market Position</small>
              </div>
            </div>

            <div class="offer-ai-summary__stats">
              <article><span>AI Confidence</span><strong>95%</strong></article>
              <article><span>Est. Acceptance</span><strong>94%</strong></article>
              <article><span>Offer Health</span><em>Excellent</em></article>
            </div>
          </article>

          <article class="offer-ai-card offer-ai-included">
            <div class="offer-ai-summary__head">
              <strong>What's Included</strong>
              <button type="button">Edit</button>
            </div>

            <div class="offer-ai-included__list">
              <article v-for="item in includedRows" :key="item[0]">
                <span><AppIcon name="document" :size="13" /> {{ item[0] }}</span>
                <strong>{{ item[1] }}</strong>
              </article>
            </div>

            <button type="button" class="offer-ai-outline">
              <span>View full offer details</span>
              <AppIcon name="external-link" :size="13" />
            </button>
          </article>
        </aside>
      </section>

      <footer class="offer-ai-footer">
        <button type="button" class="offer-ai-footer__button" @click="emit('open-source')">Back</button>
        <div class="offer-ai-footer__actions">
          <button type="button" class="offer-ai-footer__button">Save draft</button>
          <a class="offer-ai-footer__button is-primary" :href="packageHref">
            <span>Continue</span>
            <AppIcon name="chevronRight" :size="15" />
          </a>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.offer-ai-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(255, 77, 155, 0.1), transparent 24%),
    linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.offer-ai-shell {
  width: min(100%, 1800px);
  margin: 0 auto;
  padding: 18px 20px 22px;
}

.offer-ai-card,
.offer-ai-header,
.offer-ai-stepper {
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 36px rgba(255, 76, 146, 0.06);
}

.offer-ai-header,
.offer-ai-header__actions,
.offer-ai-save,
.offer-ai-header__title,
.offer-ai-stepper,
.offer-ai-step,
.offer-ai-intro,
.offer-ai-intro__action,
.offer-ai-section-title,
.offer-ai-insights__list article,
.offer-ai-score__summary,
.offer-ai-score__list article,
.offer-ai-score__sources article,
.offer-ai-summary__head,
.offer-ai-summary__candidate,
.offer-ai-summary__package,
.offer-ai-summary__stats,
.offer-ai-included__list article,
.offer-ai-note,
.offer-ai-footer,
.offer-ai-footer__actions,
.offer-ai-footer__button,
.offer-ai-outline {
  display: flex;
  align-items: center;
}

.offer-ai-header {
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
}

.offer-ai-breadcrumb {
  color: #96a2b6;
  font-size: 0.78rem;
  font-weight: 700;
}

.offer-ai-breadcrumb span {
  padding: 0 6px;
}

.offer-ai-header__title {
  gap: 8px;
  margin-top: 4px;
  color: #ff3a95;
}

.offer-ai-header__title h1,
.offer-ai-intro h2,
.offer-ai-summary__head strong,
.offer-ai-included strong,
.offer-ai-score > strong {
  margin: 0;
  color: #1c2b4a;
  font-weight: 800;
}

.offer-ai-header__title h1 {
  font-size: 2.2rem;
  line-height: 1.04;
}

.offer-ai-header__copy p,
.offer-ai-intro p,
.offer-ai-metric span,
.offer-ai-insights > p,
.offer-ai-insights__list small,
.offer-ai-summary__candidate small,
.offer-ai-summary__package small,
.offer-ai-summary__package span,
.offer-ai-summary__stats span,
.offer-ai-score__sources small,
.offer-ai-note span,
.offer-ai-step small {
  color: #8490a8;
}

.offer-ai-header__actions {
  gap: 12px;
}

.offer-ai-save {
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  color: #1d2b49;
  background: #fff;
  font-weight: 800;
}

.offer-ai-close {
  width: 42px;
  min-height: 42px;
  border: 0;
  border-radius: 12px;
  color: #8794ab;
  background: transparent;
}

.offer-ai-stepper {
  gap: 12px;
  margin-top: 14px;
  padding: 10px 12px;
  overflow-x: auto;
}

.offer-ai-step {
  position: relative;
  gap: 10px;
  min-width: max-content;
  color: #94a1b8;
}

.offer-ai-step span {
  width: 28px;
  height: 28px;
  border: 1px solid #d9e1ef;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-ai-step strong {
  display: block;
  font-size: 0.82rem;
}

.offer-ai-step small {
  display: block;
  margin-top: 2px;
  font-size: 0.68rem;
}

.offer-ai-step.is-done span {
  border-color: #caefd9;
  color: #1db16f;
  background: #f2fcf7;
}

.offer-ai-step.is-active {
  color: #ff2d87;
}

.offer-ai-step.is-active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -11px;
  left: 0;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff4299 0%, #ff1f7c 100%);
}

.offer-ai-step.is-active span {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
}

.offer-ai-step.is-active strong,
.offer-ai-step.is-active small {
  color: #ff2d87;
}

.offer-ai-stepper__line {
  width: 34px;
  height: 1px;
  flex: 0 0 auto;
  background: #dfe5f0;
}

.offer-ai-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.62fr) 360px;
  gap: 18px;
  margin-top: 18px;
  align-items: start;
}

.offer-ai-main,
.offer-ai-side {
  display: grid;
  gap: 16px;
}

.offer-ai-intro,
.offer-ai-summary,
.offer-ai-included,
.offer-ai-insights,
.offer-ai-score {
  padding: 16px;
}

.offer-ai-intro {
  justify-content: space-between;
  gap: 14px;
}

.offer-ai-intro h2 {
  font-size: 1.24rem;
}

.offer-ai-intro__action {
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #e5e9f5;
  border-radius: 12px;
  color: #6f59fa;
  background: #fff;
  font-weight: 800;
}

.offer-ai-metrics {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.offer-ai-metric {
  min-height: 190px;
  padding: 14px 12px;
  display: grid;
  align-content: start;
  justify-items: center;
  text-align: center;
}

.offer-ai-metric small {
  color: #7284a3;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-ai-metric strong {
  margin-top: 14px;
  color: #16a765;
  font-size: 1.95rem;
  font-weight: 800;
}

.offer-ai-metric.is-violet strong {
  color: #6f59fa;
}

.offer-ai-metric.is-ring strong {
  color: #16a765;
  font-size: 1.6rem;
}

.offer-ai-metric em {
  margin-top: 6px;
  color: #16a765;
  font-style: normal;
  font-size: 0.74rem;
  font-weight: 800;
}

.offer-ai-metric span {
  display: block;
  margin-top: 10px;
  font-size: 0.74rem;
  line-height: 1.5;
}

.offer-ai-metric__ring {
  width: 100px;
  height: 100px;
  margin-top: 14px;
  padding: 6px;
  border-radius: 50%;
  background: conic-gradient(#1db16f 0 338deg, #edf7f1 338deg 360deg);
}

.offer-ai-metric__ring div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.offer-ai-panels {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 16px;
}

.offer-ai-section-title {
  gap: 8px;
  color: #6f59fa;
}

.offer-ai-section-title strong {
  color: #1c2b4a;
}

.offer-ai-insights > p {
  margin: 6px 0 0;
  font-size: 0.78rem;
}

.offer-ai-insights__list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.offer-ai-insights__list article {
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #edf1f8;
}

.offer-ai-insights__list article:first-child {
  border-top: 0;
  padding-top: 0;
}

.offer-ai-insights__list span {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6f59fa;
  background: #f5f1ff;
}

.offer-ai-insights__list strong {
  display: block;
  color: #1c2b4a;
  font-size: 0.86rem;
}

.offer-ai-insights__list small {
  display: block;
  margin-top: 4px;
  font-size: 0.72rem;
  line-height: 1.45;
}

.offer-ai-insights__list em {
  margin-left: auto;
  color: #16a765;
  font-style: normal;
  font-size: 0.76rem;
  font-weight: 800;
  white-space: nowrap;
}

.offer-ai-insights__list button {
  min-width: 88px;
  min-height: 34px;
  border: 1px solid #dfe6f2;
  border-radius: 10px;
  color: #4f6290;
  background: #fff;
  font-weight: 800;
}

.offer-ai-note {
  gap: 8px;
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  color: #6f59fa;
  background: #f7f4ff;
}

.offer-ai-note span {
  font-size: 0.76rem;
}

.offer-ai-score__summary {
  gap: 18px;
  margin-top: 16px;
}

.offer-ai-score__ring {
  width: 142px;
  height: 142px;
  padding: 8px;
  border-radius: 50%;
  flex: 0 0 auto;
  background: conic-gradient(#16a765 0 70deg, #6f59fa 70deg 150deg, #3384ff 150deg 220deg, #ffb000 220deg 290deg, #ff2d87 290deg 360deg);
}

.offer-ai-score__ring div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-content: center;
  text-align: center;
  background: #fff;
}

.offer-ai-score__ring strong {
  color: #16a765;
  font-size: 2rem;
}

.offer-ai-score__ring small,
.offer-ai-score__ring em {
  display: block;
}

.offer-ai-score__ring small {
  color: #7284a3;
  font-size: 0.72rem;
}

.offer-ai-score__ring em {
  color: #16a765;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-ai-score__list {
  flex: 1 1 auto;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
}

.offer-ai-score__list article {
  gap: 8px;
}

.offer-ai-score__list .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.is-green { background: #16a765; }
.dot.is-violet { background: #6f59fa; }
.dot.is-blue { background: #3384ff; }
.dot.is-orange { background: #ffb000; }
.dot.is-pink { background: #ff2d87; }

.offer-ai-score__list span {
  color: #51627f;
  font-size: 0.8rem;
}

.offer-ai-score__list strong {
  margin-left: auto;
  color: #1c2b4a;
  font-size: 0.8rem;
}

.offer-ai-score__sources {
  margin-top: 18px;
}

.offer-ai-score__sources strong,
.offer-ai-score__sources small {
  display: block;
}

.offer-ai-score__sources strong {
  color: #1c2b4a;
  font-size: 0.84rem;
}

.offer-ai-score__sources small {
  margin-top: 4px;
  font-size: 0.72rem;
}

.offer-ai-score__sources article {
  gap: 8px;
  margin-top: 10px;
  color: #51627f;
  font-size: 0.76rem;
}

.offer-ai-summary__head {
  justify-content: space-between;
}

.offer-ai-summary__head button {
  border: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.76rem;
  font-weight: 800;
}

.offer-ai-summary__candidate {
  gap: 12px;
  margin-top: 14px;
}

.offer-ai-summary__avatar {
  width: 54px;
  height: 54px;
  flex: 0 0 auto;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffdcbc 0%, #ffc68d 100%);
  color: #5c3812;
  font-size: 1rem;
  font-weight: 800;
}

.offer-ai-summary__candidate strong {
  display: block;
  font-size: 1rem;
  color: #1c2b4a;
}

.offer-ai-summary__candidate small {
  display: block;
  margin-top: 3px;
  font-size: 0.74rem;
}

.offer-ai-summary__candidate small span {
  padding: 0 5px;
}

.offer-ai-summary__package {
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #edf1f8;
}

.offer-ai-summary__package strong {
  display: block;
  margin-top: 6px;
  color: #ff2d87;
  font-size: 2rem;
}

.offer-ai-summary__package small,
.offer-ai-summary__package span {
  display: block;
  font-size: 0.72rem;
}

.offer-ai-summary__badge {
  width: 108px;
  min-height: 92px;
  padding: 12px 10px;
  border: 1px solid #ffd4e6;
  border-radius: 18px;
  display: grid;
  place-content: center;
  text-align: center;
  background: #fff;
}

.offer-ai-summary__badge strong {
  color: #ff2d87;
  font-size: 1.5rem;
}

.offer-ai-summary__badge small {
  margin-top: 4px;
  font-size: 0.66rem;
}

.offer-ai-summary__stats {
  gap: 0;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #edf1f8;
}

.offer-ai-summary__stats article {
  flex: 1 1 0;
}

.offer-ai-summary__stats span,
.offer-ai-summary__stats strong,
.offer-ai-summary__stats em {
  display: block;
  font-size: 0.72rem;
}

.offer-ai-summary__stats strong {
  margin-top: 4px;
  color: #16a765;
  font-size: 1.1rem;
}

.offer-ai-summary__stats em {
  margin-top: 4px;
  color: #16a765;
  font-style: normal;
  font-weight: 800;
}

.offer-ai-included__list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.offer-ai-included__list article {
  justify-content: space-between;
  gap: 12px;
}

.offer-ai-included__list span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #51627f;
  font-size: 0.8rem;
}

.offer-ai-included__list strong {
  color: #1c2b4a;
  font-size: 0.8rem;
}

.offer-ai-outline {
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 40px;
  margin-top: 16px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  color: #4c5f82;
  background: #fff;
  font-weight: 800;
}

.offer-ai-footer {
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.offer-ai-footer__actions {
  gap: 12px;
  margin-left: auto;
}

.offer-ai-footer__button {
  min-height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  color: #1d2b49;
  background: #fff;
  box-shadow: inset 0 0 0 1px #dfe6f2;
  font-weight: 800;
  gap: 8px;
  text-decoration: none;
}

.offer-ai-footer__button.is-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
  box-shadow: 0 18px 30px rgba(255, 31, 124, 0.22);
}

@media (max-width: 1320px) {
  .offer-ai-layout,
  .offer-ai-panels,
  .offer-ai-metrics {
    grid-template-columns: 1fr 1fr;
  }

  .offer-ai-side {
    grid-column: 1 / -1;
  }
}

@media (max-width: 920px) {
  .offer-ai-shell {
    padding: 12px;
  }

  .offer-ai-header,
  .offer-ai-intro,
  .offer-ai-footer,
  .offer-ai-footer__actions,
  .offer-ai-summary__stats,
  .offer-ai-layout,
  .offer-ai-panels,
  .offer-ai-metrics,
  .offer-ai-score__summary {
    display: grid;
    grid-template-columns: 1fr;
  }

  .offer-ai-save,
  .offer-ai-footer__button,
  .offer-ai-intro__action {
    width: 100%;
    justify-content: center;
  }
}
</style>
