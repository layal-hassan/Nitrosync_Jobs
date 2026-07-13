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
    default: 'Marvin McKinney',
  },
  candidateRole: {
    type: String,
    default: 'Senior Frontend Developer',
  },
})

const emit = defineEmits(['close'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MM'
))

const recommendationRows = [
  'Matches candidate expectations',
  'Within your approved salary band',
  'Above market median (P62)',
  'Similar accepted offers were $140K - $146K',
  'No internal equity risk detected',
]

const dataSourceRows = [
  'Company salary bands',
  'Past accepted offers (142)',
  'Candidate expectations',
  'Market benchmark data (Payscale)',
  'Location & cost-of-living adjustment',
  'Level & role calibration',
]

const scenarioRows = [
  {
    title: 'Safe Offer',
    amount: '$138,000',
    probability: '64%',
    budget: 'Low',
    cost: '$4,000',
    approval: 'None',
    overall: 'Good',
    tone: 'blue',
  },
  {
    title: 'Recommended',
    amount: '$142,000',
    probability: '78%',
    budget: 'Medium',
    cost: 'None',
    approval: 'None',
    overall: 'Best balance',
    tone: 'pink',
    recommended: true,
  },
  {
    title: 'Strong Close',
    amount: '$148,000',
    probability: '89%',
    budget: 'High',
    cost: '$6,000',
    approval: 'Finance',
    overall: 'High acceptance',
    tone: 'green',
  },
]

const healthRows = [
  ['Candidate fit', 'Good', 'green'],
  ['Internal equity', 'Healthy', 'green'],
  ['Budget impact', 'Within plan', 'green'],
  ['Approval path', 'Standard', 'green'],
  ['Counter risk', 'Low', 'green'],
]

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
    <div v-if="open" class="ai-salary-benchmark-overlay" @click.self="emit('close')">
      <section class="ai-salary-benchmark-modal" @click.stop>
        <header class="ai-salary-benchmark-header">
          <div class="ai-salary-benchmark-header__title">
            <span class="ai-salary-benchmark-header__icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <div class="ai-salary-benchmark-header__heading">
                <h2>AI Salary Benchmark</h2>
                <b>BETA</b>
              </div>
              <div class="ai-salary-benchmark-header__meta">
                <span>{{ candidateRole }}</span>
                <i></i>
                <span>San Francisco, CA</span>
                <i></i>
                <span>Full-time</span>
                <i></i>
                <span>5+ years experience</span>
              </div>
            </div>
          </div>

          <div class="ai-salary-benchmark-header__actions">
            <button type="button" class="ai-salary-benchmark-button">
              <AppIcon name="document" :size="13" />
              <span>Export report</span>
            </button>
            <button type="button" class="ai-salary-benchmark-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <div class="ai-salary-benchmark-grid">
          <article class="ai-salary-benchmark-card is-recommendation">
            <small>AI Recommendation</small>
            <h3>Recommended Offer</h3>
            <div class="ai-salary-benchmark-card__top">
              <div>
                <strong>$142,000</strong>
                <span class="ai-salary-benchmark-pill">Recommended</span>
              </div>

              <div class="ai-salary-benchmark-ring">
                <div class="ai-salary-benchmark-ring__circle">
                  <span>78%</span>
                </div>
                <small>Acceptance probability</small>
              </div>
            </div>

            <div class="ai-salary-benchmark-confidence">
              <span>Confidence 95%</span>
              <i></i>
              <span>Above market</span>
              <i></i>
              <span>P62</span>
            </div>

            <div class="ai-salary-benchmark-compare">
              <h4>How this compares</h4>

              <article>
                <span>Comp range</span>
                <div class="ai-salary-benchmark-compare__line">
                  <i style="left: 52%;"></i>
                </div>
                <b>$132K</b>
                <em>$150K</em>
                <strong>Within range</strong>
              </article>

              <article>
                <span>Market range</span>
                <div class="ai-salary-benchmark-compare__line is-green">
                  <i style="left: 68%;"></i>
                </div>
                <b>$138K</b>
                <em>$145K</em>
                <strong class="is-green">Above market</strong>
              </article>

              <article>
                <span>Candidate expected</span>
                <div class="ai-salary-benchmark-compare__line is-blue">
                  <i style="left: 61%;"></i>
                </div>
                <b>$138K</b>
                <em>$143K</em>
                <strong class="is-blue">Slightly above</strong>
              </article>
            </div>

            <div class="ai-salary-benchmark-offer-now">
              <span>Your offer</span>
              <strong>$142K</strong>
            </div>
          </article>

          <article class="ai-salary-benchmark-card">
            <h3>Why this recommendation?</h3>

            <div class="ai-salary-benchmark-list">
              <article v-for="item in recommendationRows" :key="item">
                <span class="is-green"><AppIcon name="checkCircle" :size="13" /></span>
                <strong>{{ item }}</strong>
              </article>
            </div>

            <div class="ai-salary-benchmark-section">
              <h4>Data sources used</h4>
              <ul>
                <li v-for="item in dataSourceRows" :key="item">{{ item }}</li>
              </ul>
            </div>
          </article>

          <article class="ai-salary-benchmark-card">
            <div class="ai-salary-benchmark-card__head">
              <h3>Internal pay equity</h3>
              <AppIcon name="info" :size="13" />
            </div>

            <div class="ai-salary-benchmark-role-select">
              <span>Employees in similar roles</span>
              <button type="button">
                <span>Senior Frontend Engineer</span>
                <AppIcon name="chevronDown" :size="14" />
              </button>
            </div>

            <div class="ai-salary-benchmark-scale">
              <div class="ai-salary-benchmark-scale__labels">
                <span>Lowest<br>$136,000</span>
                <span>Median<br>$141,500</span>
                <span>Highest<br>$149,000</span>
              </div>

              <div class="ai-salary-benchmark-scale__track">
                <i class="is-low"></i>
                <i class="is-mid"></i>
                <i class="is-high"></i>
                <b>Your offer<br>$142,000</b>
              </div>
            </div>

            <div class="ai-salary-benchmark-safe-note">
              <AppIcon name="checkCircle" :size="14" />
              <div>
                <strong>No internal pay equity concerns</strong>
                <small>Your offer is within the internal range.</small>
              </div>
            </div>
          </article>

          <article class="ai-salary-benchmark-card is-scenarios">
            <div class="ai-salary-benchmark-card__head">
              <h3>Offer scenarios</h3>
              <AppIcon name="info" :size="13" />
            </div>

            <div class="ai-salary-benchmark-scenarios">
              <article
                v-for="item in scenarioRows"
                :key="item.title"
                :class="[`is-${item.tone}`, { 'is-recommended': item.recommended }]"
              >
                <em v-if="item.recommended">Best balance</em>
                <span>{{ item.title }}</span>
                <strong>{{ item.amount }}</strong>

                <div class="ai-salary-benchmark-scenarios__rows">
                  <div><small>Acceptance probability</small><b>{{ item.probability }}</b></div>
                  <div><small>Budget impact</small><b>{{ item.budget }}</b></div>
                  <div><small>Cost vs recommended</small><b>{{ item.cost }}</b></div>
                  <div><small>Approval required</small><b>{{ item.approval }}</b></div>
                </div>

                <footer>{{ item.overall }}</footer>
              </article>
            </div>
          </article>

          <article class="ai-salary-benchmark-card">
            <div class="ai-salary-benchmark-card__head">
              <h3>Approval impact</h3>
              <AppIcon name="info" :size="13" />
            </div>

            <div class="ai-salary-benchmark-approval">
              <div>
                <small>Current salary</small>
                <strong>$142,000</strong>
              </div>

              <div class="ai-salary-benchmark-approval__badge">
                <AppIcon name="checkCircle" :size="13" />
                <span>Uses Standard Approval Workflow</span>
              </div>

              <div class="ai-salary-benchmark-approval__warning">
                <AppIcon name="document" :size="13" />
                <div>
                  <strong>Finance approval required</strong>
                  <small>Estimated approval delay</small>
                </div>
                <b>+1 business day</b>
              </div>

              <p>Tip: Keep at or below $150,000 to avoid extra approvals.</p>
            </div>
          </article>

          <article class="ai-salary-benchmark-card">
            <div class="ai-salary-benchmark-card__head">
              <h3>Market positioning</h3>
              <AppIcon name="info" :size="13" />
            </div>

            <div class="ai-salary-benchmark-market">
              <div class="ai-salary-benchmark-market__labels">
                <span>25%<br>$135K</span>
                <span>50%<br>$138K</span>
                <span class="is-highlight">Your offer<br>$142K</span>
                <span>75%<br>$148K</span>
              </div>
              <div class="ai-salary-benchmark-market__track">
                <i></i>
              </div>
            </div>
          </article>

          <article class="ai-salary-benchmark-card is-health">
            <h3>Offer health check</h3>

            <div class="ai-salary-benchmark-health">
              <article v-for="item in healthRows" :key="item[0]">
                <span :class="`is-${item[2]}`"><AppIcon name="checkCircle" :size="13" /></span>
                <div>
                  <small>{{ item[0] }}</small>
                  <strong>{{ item[1] }}</strong>
                </div>
              </article>
            </div>
          </article>

          <article class="ai-salary-benchmark-card">
            <div class="ai-salary-benchmark-card__head">
              <h3>AI explanation</h3>
              <AppIcon name="spark" :size="13" />
            </div>

            <p class="ai-salary-benchmark-explanation">
              Based on market data, internal equity, and candidate signals, $142,000 offers the best balance
              between competitiveness and budget, while keeping approval risk low.
            </p>
          </article>
        </div>

        <footer class="ai-salary-benchmark-footer">
          <button type="button" class="ai-salary-benchmark-button is-secondary">
            <AppIcon name="spark" :size="13" />
            <span>Ask AI</span>
          </button>

          <div class="ai-salary-benchmark-footer__actions">
            <button type="button" class="ai-salary-benchmark-button is-primary">Apply $142,000</button>
            <small>Will update compensation</small>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-salary-benchmark-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.44);
  backdrop-filter: blur(10px);
}

.ai-salary-benchmark-modal {
  width: min(1380px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
}

.ai-salary-benchmark-header,
.ai-salary-benchmark-header__title,
.ai-salary-benchmark-header__actions,
.ai-salary-benchmark-header__heading,
.ai-salary-benchmark-header__meta,
.ai-salary-benchmark-card__top,
.ai-salary-benchmark-confidence,
.ai-salary-benchmark-card__head,
.ai-salary-benchmark-list article,
.ai-salary-benchmark-safe-note,
.ai-salary-benchmark-footer,
.ai-salary-benchmark-footer__actions {
  display: flex;
  align-items: center;
}

.ai-salary-benchmark-header,
.ai-salary-benchmark-grid,
.ai-salary-benchmark-footer {
  padding: 18px 22px;
}

.ai-salary-benchmark-header {
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #edf1f8;
}

.ai-salary-benchmark-header__title {
  gap: 12px;
}

.ai-salary-benchmark-header__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
}

.ai-salary-benchmark-header__heading {
  gap: 10px;
  margin-bottom: 6px;
}

.ai-salary-benchmark-header__heading h2,
.ai-salary-benchmark-card h3,
.ai-salary-benchmark-card h4,
.ai-salary-benchmark-card strong,
.ai-salary-benchmark-card b {
  margin: 0;
  color: #1f2c4f;
}

.ai-salary-benchmark-header__heading b {
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

.ai-salary-benchmark-header__meta {
  flex-wrap: wrap;
  gap: 8px;
  color: #7d8cab;
  font-size: 0.76rem;
}

.ai-salary-benchmark-header__meta i,
.ai-salary-benchmark-confidence i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ccd5e5;
}

.ai-salary-benchmark-header__actions {
  gap: 10px;
}

.ai-salary-benchmark-button,
.ai-salary-benchmark-close,
.ai-salary-benchmark-role-select button {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #223251;
  background: #fff;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 800;
}

.ai-salary-benchmark-close {
  width: 38px;
  padding: 0;
}

.ai-salary-benchmark-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr 0.92fr;
  gap: 16px;
}

.ai-salary-benchmark-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.ai-salary-benchmark-card.is-recommendation {
  background: linear-gradient(180deg, #fff7fb 0%, #fff 100%);
  border-color: #ffd9e9;
}

.ai-salary-benchmark-card.is-scenarios {
  grid-column: 1 / span 2;
}

.ai-salary-benchmark-card.is-health {
  grid-column: span 2;
}

.ai-salary-benchmark-card small,
.ai-salary-benchmark-card span,
.ai-salary-benchmark-card p,
.ai-salary-benchmark-card em,
.ai-salary-benchmark-card li {
  color: #7d8cab;
}

.ai-salary-benchmark-card > small {
  display: block;
  margin-bottom: 6px;
  color: #ff5a9d;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-salary-benchmark-card__top {
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-top: 8px;
}

.ai-salary-benchmark-card__top strong {
  display: block;
  color: #ff2d87;
  font-size: 2.2rem;
  line-height: 1;
}

.ai-salary-benchmark-pill {
  min-height: 22px;
  margin-top: 10px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #ff2d87;
  background: #fff0f7;
  font-size: 0.68rem;
  font-weight: 800;
}

.ai-salary-benchmark-ring {
  display: grid;
  justify-items: center;
  gap: 6px;
}

.ai-salary-benchmark-ring__circle {
  width: 104px;
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at center, #fff 61%, transparent 62%),
    conic-gradient(#ff4b9b 0 78%, #e8edf6 78% 100%);
}

.ai-salary-benchmark-ring__circle span {
  color: #223251;
  font-size: 1.55rem;
  font-weight: 900;
}

.ai-salary-benchmark-ring small {
  text-align: center;
  font-size: 0.72rem;
}

.ai-salary-benchmark-confidence {
  gap: 8px;
  margin-top: 12px;
  font-size: 0.76rem;
}

.ai-salary-benchmark-compare {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.ai-salary-benchmark-compare article {
  display: grid;
  grid-template-columns: 110px 1fr auto auto auto;
  gap: 10px;
  align-items: center;
}

.ai-salary-benchmark-compare article strong {
  font-size: 0.72rem;
  font-weight: 800;
}

.ai-salary-benchmark-compare article strong.is-green {
  color: #16a34a;
}

.ai-salary-benchmark-compare article strong.is-blue {
  color: #4c7cff;
}

.ai-salary-benchmark-compare__line {
  position: relative;
  height: 4px;
  border-radius: 999px;
  background: #ffd2e6;
}

.ai-salary-benchmark-compare__line.is-green {
  background: #caedd7;
}

.ai-salary-benchmark-compare__line.is-blue {
  background: #d8e5ff;
}

.ai-salary-benchmark-compare__line i {
  position: absolute;
  top: 50%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff4b9b;
  transform: translate(-50%, -50%);
}

.ai-salary-benchmark-compare__line.is-green i {
  background: #23b26b;
}

.ai-salary-benchmark-compare__line.is-blue i {
  background: #4c7cff;
}

.ai-salary-benchmark-offer-now {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #edf1f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-salary-benchmark-offer-now span {
  color: #ff5a9d;
  font-weight: 800;
}

.ai-salary-benchmark-offer-now strong {
  color: #ff2d87;
  font-size: 1.4rem;
}

.ai-salary-benchmark-list {
  display: grid;
  gap: 10px;
}

.ai-salary-benchmark-list article {
  gap: 10px;
}

.ai-salary-benchmark-list article span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 20px;
}

.ai-salary-benchmark-list article span.is-green {
  color: #16a34a;
  background: #effcf4;
}

.ai-salary-benchmark-section {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #edf1f8;
}

.ai-salary-benchmark-section ul {
  margin: 10px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 7px;
}

.ai-salary-benchmark-card__head {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.ai-salary-benchmark-role-select {
  display: grid;
  gap: 8px;
}

.ai-salary-benchmark-role-select button {
  justify-content: space-between;
}

.ai-salary-benchmark-scale {
  margin-top: 18px;
}

.ai-salary-benchmark-scale__labels {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.68rem;
  text-align: center;
}

.ai-salary-benchmark-scale__track {
  position: relative;
  height: 62px;
  margin-top: 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, #c7efd7 0%, #eef2f8 52%, #dce5ff 100%);
}

.ai-salary-benchmark-scale__track::before {
  content: '';
  position: absolute;
  inset: 28px 12px auto;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
}

.ai-salary-benchmark-scale__track i {
  position: absolute;
  top: 18px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.ai-salary-benchmark-scale__track i.is-low {
  left: 12%;
  background: #23b26b;
}

.ai-salary-benchmark-scale__track i.is-mid {
  left: 50%;
  background: #1f2c4f;
  transform: translateX(-50%);
}

.ai-salary-benchmark-scale__track i.is-high {
  right: 11%;
  background: #4c7cff;
}

.ai-salary-benchmark-scale__track b {
  position: absolute;
  right: 20%;
  bottom: 10px;
  min-width: 92px;
  padding: 8px 10px;
  border-radius: 12px;
  color: #ff2d87;
  background: #fff0f7;
  text-align: center;
  font-size: 0.72rem;
}

.ai-salary-benchmark-safe-note,
.ai-salary-benchmark-approval__badge,
.ai-salary-benchmark-approval__warning {
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
}

.ai-salary-benchmark-safe-note {
  margin-top: 16px;
  color: #16a34a;
  background: #effcf4;
}

.ai-salary-benchmark-safe-note strong {
  color: #16a34a;
}

.ai-salary-benchmark-scenarios {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.ai-salary-benchmark-scenarios article {
  position: relative;
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.ai-salary-benchmark-scenarios article.is-pink {
  border-color: #ffc9df;
  background: linear-gradient(180deg, #fff7fb 0%, #fff 100%);
}

.ai-salary-benchmark-scenarios article.is-blue {
  background: linear-gradient(180deg, #f7faff 0%, #fff 100%);
}

.ai-salary-benchmark-scenarios article.is-green {
  background: linear-gradient(180deg, #f5fff8 0%, #fff 100%);
}

.ai-salary-benchmark-scenarios article em {
  position: absolute;
  top: -10px;
  right: 14px;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #fff;
  background: #ff4b9b;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-salary-benchmark-scenarios article > span {
  display: block;
  margin-bottom: 6px;
  font-weight: 800;
}

.ai-salary-benchmark-scenarios article > strong {
  display: block;
  margin-bottom: 12px;
  font-size: 1.6rem;
}

.ai-salary-benchmark-scenarios__rows {
  display: grid;
  gap: 8px;
}

.ai-salary-benchmark-scenarios__rows div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.ai-salary-benchmark-scenarios footer {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #edf1f8;
  color: #1f2c4f;
  font-weight: 800;
}

.ai-salary-benchmark-approval {
  display: grid;
  gap: 12px;
}

.ai-salary-benchmark-approval > div:first-child strong {
  display: block;
  margin-top: 4px;
  color: #ff2d87;
  font-size: 1.8rem;
}

.ai-salary-benchmark-approval__badge {
  color: #16a34a;
  background: #effcf4;
  font-weight: 800;
}

.ai-salary-benchmark-approval__warning {
  align-items: center;
  display: flex;
  color: #7d8cab;
  background: #fff8fb;
}

.ai-salary-benchmark-approval__warning strong {
  color: #ff7a00;
}

.ai-salary-benchmark-approval__warning b {
  margin-left: auto;
  color: #ff7a00;
}

.ai-salary-benchmark-approval p {
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  color: #6d5cff;
  background: #f6f3ff;
  font-size: 0.75rem;
  font-weight: 700;
}

.ai-salary-benchmark-market__labels {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 0.7rem;
  text-align: center;
}

.ai-salary-benchmark-market__labels .is-highlight {
  color: #ff2d87;
  font-weight: 800;
}

.ai-salary-benchmark-market__track {
  position: relative;
  height: 8px;
  border-radius: 999px;
  background: #edf1f8;
}

.ai-salary-benchmark-market__track i {
  position: absolute;
  left: 59%;
  top: 50%;
  width: 12px;
  height: 12px;
  border: 3px solid #ff4b9b;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
}

.ai-salary-benchmark-health {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.ai-salary-benchmark-health article {
  min-height: 118px;
  padding: 14px 12px;
  border-radius: 14px;
  background: linear-gradient(180deg, #fbfdff 0%, #fff 100%);
  border: 1px solid #edf1f8;
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 10px;
  text-align: center;
}

.ai-salary-benchmark-health article span {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #effcf4;
}

.ai-salary-benchmark-health article small {
  display: block;
  line-height: 1.45;
  font-size: 0.76rem;
}

.ai-salary-benchmark-health article strong {
  display: block;
  margin-top: 4px;
  font-size: 0.96rem;
  line-height: 1.25;
}

.ai-salary-benchmark-explanation {
  margin: 0;
  line-height: 1.7;
}

.ai-salary-benchmark-footer {
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #edf1f8;
}

.ai-salary-benchmark-button.is-secondary {
  color: #ff2d87;
  background: #fff;
}

.ai-salary-benchmark-button.is-primary {
  min-width: 180px;
  border-color: #6d5cff;
  color: #fff;
  background: linear-gradient(135deg, #ff4b9b 0%, #ff2d87 45%, #6d5cff 100%);
}

.ai-salary-benchmark-footer__actions {
  gap: 14px;
}

.ai-salary-benchmark-footer__actions small {
  color: #7d8cab;
}

@media (max-width: 1240px) {
  .ai-salary-benchmark-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ai-salary-benchmark-card.is-scenarios {
    grid-column: auto;
  }

  .ai-salary-benchmark-card.is-health {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .ai-salary-benchmark-overlay {
    padding: 12px;
  }

  .ai-salary-benchmark-modal {
    width: min(100%, calc(100vw - 24px));
  }

  .ai-salary-benchmark-header,
  .ai-salary-benchmark-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-salary-benchmark-header__actions,
  .ai-salary-benchmark-footer__actions {
    justify-content: flex-end;
  }

  .ai-salary-benchmark-grid,
  .ai-salary-benchmark-scenarios,
  .ai-salary-benchmark-health {
    grid-template-columns: 1fr;
  }

  .ai-salary-benchmark-compare article {
    grid-template-columns: 1fr;
  }
}
</style>
