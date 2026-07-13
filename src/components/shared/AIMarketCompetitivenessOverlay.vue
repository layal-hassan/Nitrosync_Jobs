<script setup>
import { onBeforeUnmount, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Alex Morgan',
  },
  candidateRole: {
    type: String,
    default: 'Senior Product Designer',
  },
})

const emit = defineEmits(['close'])

const comparisonRows = [
  ['Base Salary', '$120,000', '$105,000 - $130,000', '72nd', 'Competitive', 'green'],
  ['Total Cash', '$126,000', '$110,000 - $135,000', '69th', 'Competitive', 'green'],
  ['Equity / RSU', '$20,000 (est.)', '$15,000 - $28,000', '65th', 'Competitive', 'green'],
  ['Bonus', '10%', '8% - 15%', '58th', 'Average', 'amber'],
  ['Benefits Value', '$15,000 (est.)', '$12,000 - $18,000', '60th', 'Average', 'amber'],
]

const competitorRows = [
  ['Google', 92],
  ['Meta', 88],
  ['Amazon', 82],
  ['Your Offer', 87, true],
  ['Microsoft', 85],
]

const signalRows = [
  ['Demand for this role', 'High', 'green'],
  ['Available talent', 'Moderate', 'amber'],
  ['Salaries trend (last 6 months)', '+4.7%', 'green'],
  ['Job openings (similar roles)', '1,247', 'slate'],
]

const expectationRows = [
  ['Salary', 'Aligned', 'green'],
  ['Work Flexibility', 'Aligned', 'green'],
  ['Career Growth', 'Aligned', 'green'],
  ['Signing Bonus', 'Below expected', 'amber'],
  ['Equity', 'Aligned', 'green'],
]

const impactRows = [
  ['Current Offer', '87%', '', 'pink'],
  ['Remote / Hybrid', '94%', '+7%', 'green'],
  ['Signing Bonus', '93%', '+6%', 'green'],
  ['Salary +3%', '90%', '+3%', 'green'],
  ['Extra PTO', '92%', '+5%', 'green'],
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
    <div v-if="open" class="ai-market-overlay" @click.self="emit('close')">
      <section class="ai-market-modal" @click.stop>
        <header class="ai-market-header">
          <div class="ai-market-header__title">
            <span class="ai-market-header__icon">
              <AppIcon name="sparkles" :size="18" />
            </span>

            <div>
              <div class="ai-market-header__heading">
                <h2>AI Market Competitiveness</h2>
                <b>AI INSIGHT</b>
              </div>
              <p>How your offer compares to the current market for similar roles in New York, NY.</p>
            </div>
          </div>

          <div class="ai-market-header__actions">
            <button type="button" class="ai-market-button">
              <AppIcon name="document" :size="13" />
              <span>Export report</span>
            </button>
            <button type="button" class="ai-market-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <section class="ai-market-summary">
          <article class="ai-market-candidate">
            <span>AM</span>
            <div>
              <strong>Alex Morgan</strong>
              <div class="ai-market-candidate__badges">
                <em>Top Choice</em>
                <i><AppIcon name="star" :size="10" /></i>
              </div>
              <small>Senior Product Designer | Product Team</small>
              <small>New York, NY | Full-time | 5+ years experience</small>
            </div>
          </article>

          <article class="ai-market-summary__stat">
            <span><AppIcon name="wallet" :size="12" /> Offer amount</span>
            <strong>$120,000</strong>
            <small>Base Salary</small>
          </article>

          <article class="ai-market-summary__stat">
            <span><AppIcon name="calendar" :size="12" /> Offer sent</span>
            <strong>May 16, 2024</strong>
            <small>9:21 AM</small>
          </article>

          <article class="ai-market-summary__stat">
            <span><AppIcon name="document" :size="12" /> Notice Period</span>
            <strong>30 Days</strong>
            <small>&nbsp;</small>
          </article>

          <article class="ai-market-summary__stat">
            <span><AppIcon name="clock" :size="12" /> Offer expires</span>
            <strong>May 23, 2024</strong>
            <small class="is-pink">5 days left</small>
          </article>
        </section>

        <div class="ai-market-layout">
          <div class="ai-market-main">
            <article class="ai-market-card ai-market-overview">
              <div class="ai-market-card__head">
                <div>
                  <h3>Market Position Overview</h3>
                  <small>Your offer is very competitive in the current market.</small>
                </div>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="ai-market-overview__top">
                <div class="ai-market-score">
                  <div class="ai-market-score__ring">
                    <div class="ai-market-score__inner">
                      <strong>87</strong>
                      <small>/100</small>
                    </div>
                  </div>

                  <div class="ai-market-score__text">
                    <h4>Very Competitive</h4>
                    <div class="ai-market-score__stars">
                      <AppIcon v-for="star in 5" :key="star" name="star" :size="12" />
                    </div>
                    <p>Top 13% of similar offers</p>
                    <small>vs. market median: +8.7%</small>
                  </div>
                </div>

                <div class="ai-market-chart">
                  <div class="ai-market-chart__label">87th</div>
                  <div class="ai-market-chart__dot"></div>
                  <div class="ai-market-chart__area"></div>
                  <div class="ai-market-chart__line"></div>
                  <div class="ai-market-chart__baseline"></div>
                  <div class="ai-market-chart__ticks">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                  <div class="ai-market-chart__caption">Market median</div>
                </div>
              </div>

              <div class="ai-market-overview__stats">
                <article>
                  <small>Stronger than</small>
                  <strong>87%</strong>
                  <span>of similar offers</span>
                </article>
                <article>
                  <small>Market Percentile</small>
                  <strong>Top 13%</strong>
                </article>
                <article>
                  <small>vs. Market Median</small>
                  <strong>+8.7%</strong>
                </article>
                <article>
                  <small>Talent Availability</small>
                  <strong>Medium</strong>
                </article>
              </div>
            </article>

            <div class="ai-market-subgrid">
              <article class="ai-market-card">
                <div class="ai-market-card__head">
                  <div>
                    <h3>Key Offer Comparison</h3>
                    <small>Compare to similar roles in New York, NY</small>
                  </div>
                  <AppIcon name="info" :size="13" />
                </div>

                <div class="ai-market-table">
                  <div class="ai-market-table__head">
                    <span>Component</span>
                    <span>Your Offer</span>
                    <span>Market Range (50%)</span>
                    <span>Percentile</span>
                    <span>Competitiveness</span>
                  </div>

                  <article v-for="item in comparisonRows" :key="item[0]">
                    <span>{{ item[0] }}</span>
                    <strong>{{ item[1] }}</strong>
                    <span>{{ item[2] }}</span>
                    <span>{{ item[3] }}</span>
                    <b :class="`is-${item[5]}`">{{ item[4] }}</b>
                  </article>
                </div>
              </article>

              <article class="ai-market-card">
                <div class="ai-market-card__head">
                  <div>
                    <h3>Competitor Benchmark</h3>
                    <small>Market positioning vs top companies</small>
                  </div>
                </div>

                <div class="ai-market-benchmark">
                  <article v-for="item in competitorRows" :key="item[0]">
                    <span :class="{ 'is-highlight': item[2] }">{{ item[0] }}</span>
                    <div><i :class="{ 'is-highlight': item[2] }" :style="{ width: `${item[1]}%` }"></i></div>
                    <strong :class="{ 'is-highlight': item[2] }">{{ item[1] }}</strong>
                  </article>
                </div>

                <small class="ai-market-scale-note">Percentile (higher is better)</small>
                <div class="ai-market-scale-axis">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </article>

              <article class="ai-market-card">
                <div class="ai-market-card__head">
                  <div>
                    <h3>Candidate Expectation Alignment</h3>
                    <small>How your offer aligns with Alex's stated expectations</small>
                  </div>
                </div>

                <div class="ai-market-alignment">
                  <article v-for="item in expectationRows" :key="item[0]">
                    <span :class="`is-${item[2]}`">
                      <AppIcon :name="item[2] === 'amber' ? 'alert' : 'checkCircle'" :size="13" />
                    </span>
                    <strong>{{ item[0] }}</strong>
                    <small :class="`is-${item[2]}`">{{ item[1] }}</small>
                  </article>
                </div>
              </article>

              <article class="ai-market-card">
                <div class="ai-market-card__head">
                  <div>
                    <h3>Offer Impact Simulator</h3>
                    <small>See how changes could impact acceptance probability</small>
                  </div>
                </div>

                <div class="ai-market-impact">
                  <article v-for="item in impactRows" :key="item[0]">
                    <span>{{ item[0] }}</span>
                    <strong :class="`is-${item[3]}`">{{ item[1] }}</strong>
                    <small v-if="item[2]" class="is-green">{{ item[2] }}</small>
                  </article>
                </div>
              </article>
            </div>
          </div>

          <aside class="ai-market-side">
            <article class="ai-market-card">
              <div class="ai-market-card__head">
                <div class="ai-market-side__title">
                  <AppIcon name="sparkles" :size="14" />
                  <h3>AI Insight</h3>
                </div>
              </div>

              <div class="ai-market-insight">
                <strong>Your offer is stronger than 87% of similar offers.</strong>
                <p>Candidates in this market prioritize work flexibility and growth opportunities alongside compensation.</p>
              </div>
            </article>

            <article class="ai-market-card">
              <div class="ai-market-card__head">
                <div class="ai-market-side__title">
                  <AppIcon name="trend-up" :size="14" />
                  <h3>Market Signals</h3>
                </div>
              </div>

              <div class="ai-market-signals">
                <article v-for="item in signalRows" :key="item[0]">
                  <span>{{ item[0] }}</span>
                  <strong :class="`is-${item[2]}`">{{ item[1] }}</strong>
                </article>
              </div>
            </article>

            <article class="ai-market-card">
              <div class="ai-market-card__head">
                <div class="ai-market-side__title">
                  <AppIcon name="sparkles" :size="14" />
                  <h3>AI Recommendation</h3>
                </div>
                <small class="ai-market-tag">High Impact</small>
              </div>

              <div class="ai-market-recommendation">
                <strong>Add a signing bonus of $3,000 - $5,000</strong>
                <p>This could increase acceptance probability by +6-8%.</p>

                <div class="ai-market-recommendation__lift">
                  <article>
                    <small>Current probability</small>
                    <strong>87%</strong>
                  </article>
                  <AppIcon name="chevronRight" :size="16" />
                  <article>
                    <small>With recommendation</small>
                    <strong class="is-green">93%</strong>
                  </article>
                </div>

                <button type="button" class="ai-market-button is-primary">Apply Recommendation</button>
              </div>
            </article>
          </aside>
        </div>

        <footer class="ai-market-footer">
          <div class="ai-market-footer__data">
            <strong>Data source</strong>
            <small>2,341 similar offers | Radford Global Tech Survey</small>
            <small>May 2024 | Confidence level: 96%</small>
          </div>

          <div class="ai-market-footer__actions">
            <button type="button" class="ai-market-button is-muted">
              <span>How we calculate this</span>
              <AppIcon name="info" :size="13" />
            </button>
            <button type="button" class="ai-market-button is-primary is-close" @click="emit('close')">Close</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-market-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.44);
  backdrop-filter: blur(10px);
}

.ai-market-modal {
  width: min(1220px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
}

.ai-market-header,
.ai-market-header__title,
.ai-market-header__actions,
.ai-market-header__heading,
.ai-market-summary,
.ai-market-candidate,
.ai-market-candidate__badges,
.ai-market-card__head,
.ai-market-side__title,
.ai-market-footer,
.ai-market-footer__actions,
.ai-market-recommendation__lift {
  display: flex;
  align-items: center;
}

.ai-market-header,
.ai-market-summary,
.ai-market-layout,
.ai-market-footer {
  padding: 16px 18px;
}

.ai-market-header {
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #edf1f8;
}

.ai-market-header__title,
.ai-market-header__actions,
.ai-market-summary,
.ai-market-overview__top,
.ai-market-overview__stats,
.ai-market-layout,
.ai-market-footer {
  gap: 14px;
}

.ai-market-header__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4b9b;
  background: #fff0f7;
}

.ai-market-header__heading {
  gap: 10px;
  margin-bottom: 4px;
}

.ai-market-header__heading h2,
.ai-market-card h3,
.ai-market-card h4,
.ai-market-card strong,
.ai-market-card b,
.ai-market-footer__data strong {
  margin: 0;
  color: #1f2c4f;
}

.ai-market-header p,
.ai-market-card p,
.ai-market-card small,
.ai-market-card span,
.ai-market-footer small {
  margin: 0;
  color: #7d8cab;
}

.ai-market-header__heading b {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #ff4b9b;
  background: #fff0f7;
  font-size: 0.64rem;
  font-weight: 800;
}

.ai-market-button,
.ai-market-close {
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

.ai-market-close {
  width: 38px;
  padding: 0;
}

.ai-market-summary {
  display: grid;
  grid-template-columns: minmax(260px, 1.5fr) repeat(4, minmax(120px, 1fr));
  align-items: center;
  border-bottom: 1px solid #edf1f8;
}

.ai-market-summary > article {
  min-width: 0;
  padding: 8px 14px;
}

.ai-market-candidate {
  gap: 12px;
}

.ai-market-candidate > span {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.82rem;
  font-weight: 800;
  flex: 0 0 44px;
}

.ai-market-candidate strong {
  display: block;
  margin-bottom: 4px;
}

.ai-market-candidate__badges {
  gap: 8px;
  margin-bottom: 6px;
}

.ai-market-candidate__badges em,
.ai-market-candidate__badges i {
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
}

.ai-market-candidate__badges em {
  color: #16a34a;
  background: #effcf4;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-market-candidate__badges i {
  color: #ffb800;
  background: #fff8db;
}

.ai-market-candidate small {
  display: block;
  line-height: 1.45;
}

.ai-market-summary__stat {
  display: grid;
  gap: 8px;
  border-left: 1px solid #edf1f8;
}

.ai-market-summary__stat > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #97a4be;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ai-market-summary__stat > strong {
  font-size: 1.1rem;
  line-height: 1.15;
}

.ai-market-summary__stat small.is-pink {
  color: #ff2d87;
  font-weight: 800;
}

.ai-market-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 290px;
  align-items: start;
}

.ai-market-main {
  flex: 1 1 auto;
  min-width: 0;
  display: grid;
  gap: 14px;
}

.ai-market-side {
  width: 290px;
  flex: 0 0 290px;
  display: grid;
  gap: 14px;
}

.ai-market-subgrid {
  display: grid;
  grid-template-columns: 1.18fr 0.88fr;
  gap: 14px;
}

.ai-market-card {
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.ai-market-card__head {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.ai-market-overview__top,
.ai-market-overview__stats,
.ai-market-score,
.ai-market-impact,
.ai-market-alignment,
.ai-market-signals {
  display: grid;
  gap: 12px;
}

.ai-market-overview__top {
  grid-template-columns: 272px 1fr;
  align-items: center;
}

.ai-market-score {
  grid-template-columns: 96px 1fr;
  align-items: center;
}

.ai-market-score__ring {
  width: 86px;
  height: 86px;
  padding: 7px;
  border-radius: 50%;
  background: conic-gradient(#ff4b9b 0 313deg, #f2f5fb 313deg 360deg);
}

.ai-market-score__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
  text-align: center;
}

.ai-market-score__inner strong {
  font-size: 2rem;
  line-height: 1;
}

.ai-market-score__inner small {
  margin-top: -6px;
  font-size: 0.8rem;
}

.ai-market-score__text h4 {
  color: #ff4b9b;
  font-size: 1.7rem;
  line-height: 1.05;
}

.ai-market-score__stars {
  margin: 8px 0;
  display: inline-flex;
  gap: 4px;
  color: #ff4b9b;
}

.ai-market-score__text p {
  font-weight: 700;
  color: #1f2c4f;
}

.ai-market-score__text small {
  display: block;
  margin-top: 6px;
  color: #7d8cab;
  font-weight: 700;
}

.ai-market-chart {
  position: relative;
  min-height: 190px;
}

.ai-market-chart__area,
.ai-market-chart__line,
.ai-market-chart__baseline {
  position: absolute;
  left: 4%;
  right: 4%;
}

.ai-market-chart__area {
  bottom: 48px;
  height: 92px;
  background: linear-gradient(180deg, rgba(255, 75, 155, 0.22) 0%, rgba(255, 75, 155, 0.05) 100%);
  clip-path: polygon(0 88%, 10% 86%, 20% 82%, 30% 70%, 40% 55%, 50% 46%, 60% 49%, 70% 38%, 80% 34%, 90% 44%, 100% 86%, 100% 100%, 0 100%);
}

.ai-market-chart__line {
  bottom: 48px;
  height: 92px;
  border-bottom: 2px solid transparent;
}

.ai-market-chart__line::before {
  content: '';
  position: absolute;
  inset: 0;
  border-top: 2px solid #ff6aa8;
  clip-path: polygon(0 88%, 10% 86%, 20% 82%, 30% 70%, 40% 55%, 50% 46%, 60% 49%, 70% 38%, 80% 34%, 90% 44%, 100% 86%);
}

.ai-market-chart__dot {
  position: absolute;
  right: 14%;
  bottom: 130px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff4b9b;
  box-shadow: 0 0 0 6px rgba(255, 75, 155, 0.12);
}

.ai-market-chart__label {
  position: absolute;
  right: 11%;
  bottom: 142px;
  color: #ff4b9b;
  font-size: 0.9rem;
  font-weight: 800;
}

.ai-market-chart__baseline {
  bottom: 48px;
  height: 1px;
  background: #dbe4f1;
}

.ai-market-chart__ticks,
.ai-market-scale-axis {
  display: flex;
  justify-content: space-between;
}

.ai-market-chart__ticks {
  position: absolute;
  left: 4%;
  right: 4%;
  bottom: 18px;
  font-size: 0.72rem;
  color: #94a3b8;
}

.ai-market-chart__caption {
  position: absolute;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  color: #94a3b8;
  font-size: 0.7rem;
}

.ai-market-overview__stats {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 12px;
}

.ai-market-overview__stats article {
  padding: 10px 12px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  background: #fff;
}

.ai-market-overview__stats strong {
  display: block;
  margin: 4px 0;
}

.ai-market-overview__stats article:nth-child(1) strong,
.ai-market-overview__stats article:nth-child(3) strong {
  color: #16a34a;
}

.ai-market-table {
  display: grid;
}

.ai-market-table__head,
.ai-market-table article {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 1.15fr 0.7fr 0.9fr;
  gap: 10px;
  align-items: center;
}

.ai-market-table__head {
  padding: 0 0 10px;
  border-bottom: 1px solid #edf1f8;
  color: #97a4be;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ai-market-table article {
  padding: 12px 0;
  border-bottom: 1px solid #edf1f8;
}

.ai-market-table article:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.ai-market-table b.is-green,
.ai-market-signals strong.is-green,
.ai-market-recommendation__lift strong.is-green,
.ai-market-impact strong.is-green,
.ai-market-alignment small.is-green {
  color: #16a34a;
}

.ai-market-table b.is-amber,
.ai-market-signals strong.is-amber,
.ai-market-alignment small.is-amber {
  color: #ff8a00;
}

.ai-market-benchmark {
  display: grid;
  gap: 12px;
}

.ai-market-benchmark article {
  display: grid;
  grid-template-columns: 88px 1fr 28px;
  gap: 10px;
  align-items: center;
}

.ai-market-benchmark article div {
  height: 4px;
  border-radius: 999px;
  background: #edf1f8;
  overflow: hidden;
}

.ai-market-benchmark article i {
  height: 100%;
  display: block;
  border-radius: inherit;
  background: #cfd7e7;
}

.ai-market-benchmark article i.is-highlight {
  background: linear-gradient(90deg, #ff6aa8 0%, #ff2d87 100%);
}

.ai-market-benchmark article span.is-highlight,
.ai-market-benchmark article strong.is-highlight,
.ai-market-impact strong.is-pink {
  color: #ff2d87;
}

.ai-market-scale-note {
  display: block;
  margin-top: 12px;
  font-size: 0.68rem;
}

.ai-market-scale-axis {
  margin-top: 6px;
  color: #94a3b8;
  font-size: 0.72rem;
}

.ai-market-alignment {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.ai-market-alignment article {
  text-align: center;
}

.ai-market-alignment article span {
  width: 22px;
  height: 22px;
  margin: 0 auto 8px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ai-market-alignment article span.is-green {
  color: #16a34a;
  background: #effcf4;
}

.ai-market-alignment article span.is-amber {
  color: #ff8a00;
  background: #fff5e9;
}

.ai-market-alignment article strong {
  display: block;
  margin-bottom: 4px;
  font-size: 0.78rem;
}

.ai-market-impact {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.ai-market-impact article {
  padding: 10px 8px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  text-align: center;
}

.ai-market-impact article:first-child {
  background: #fff7fb;
}

.ai-market-impact strong {
  display: block;
  margin: 8px 0 4px;
}

.ai-market-insight {
  padding: 14px;
  border: 1px solid #ffdce9;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff8fb 0%, #fff 100%);
}

.ai-market-insight strong,
.ai-market-recommendation strong {
  display: block;
  margin-bottom: 8px;
}

.ai-market-signals,
.ai-market-recommendation__lift {
  margin-top: 6px;
}

.ai-market-signals article {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf1f8;
}

.ai-market-signals article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.ai-market-recommendation__lift {
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  background: #fff;
}

.ai-market-tag {
  color: #ff2d87;
  font-size: 0.64rem;
  font-weight: 800;
}

.ai-market-recommendation .ai-market-button.is-primary {
  width: 100%;
  margin-top: 12px;
}

.ai-market-button.is-primary {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff5cab 0%, #ff2d87 45%, #ff4b9b 100%);
}

.ai-market-button.is-muted {
  color: #7d8cab;
  background: #fff;
}

.ai-market-button.is-close {
  min-width: 110px;
}

.ai-market-footer {
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #edf1f8;
}

.ai-market-footer__data {
  display: grid;
  gap: 4px;
}

@media (max-width: 1240px) {
  .ai-market-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ai-market-candidate {
    grid-column: 1 / -1;
  }

  .ai-market-layout {
    grid-template-columns: 1fr;
  }

  .ai-market-side {
    width: 100%;
    flex-basis: auto;
  }
}

@media (max-width: 980px) {
  .ai-market-header,
  .ai-market-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-market-overview__top,
  .ai-market-overview__stats,
  .ai-market-subgrid,
  .ai-market-alignment,
  .ai-market-impact {
    grid-template-columns: 1fr;
  }

  .ai-market-table__head,
  .ai-market-table article {
    grid-template-columns: 1fr;
  }
}
</style>
