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
    default: 'Alex Morgan',
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
    .join('') || 'AM'
))

const summaryRows = [
  ['Acceptance probability', '82%', 'pink'],
  ['Potential probability', '91%', 'green'],
  ['Estimated improvement', '+9%', 'green'],
  ['Counteroffer risk', 'Medium', 'amber'],
  ['Time sensitivity', 'High', 'pink'],
]

const actionRows = [
  ['Offer 2 remote days per week', 'Addresses flexibility concerns', '+8%', 'Low', 'Immediate'],
  ['Schedule a hiring manager call', 'Builds confidence and connection', '+7%', 'Low', '1-2 days'],
  ['Add a signing bonus', 'Improves perceived value', '+5%', 'Medium', '2-3 days'],
  ['Move the start date forward', 'Shows flexibility and urgency', '+3%', 'Low', 'Immediate'],
  ['Increase salary by 3%', 'Useful only if other options fail', '+2%', 'High', '3-5 days'],
]

const talkingPointRows = [
  ['Reinforce the impact and ownership they\'ll have in this role.', 'High impact'],
  ['Highlight the team\'s growth plans and how they\'ll be part of it.', 'High impact'],
  ['Emphasize the flexible work culture and trust-based environment.', 'Medium impact'],
  ['Share our learning & development budget and mentorship program.', 'Medium impact'],
  ['Acknowledge their concerns before discussing compensation.', 'High impact'],
]

const simulationRows = [
  ['Current', '82%'],
  ['+ 2 remote days', '90%'],
  ['+ Manager call', '89%'],
  ['+ Signing bonus', '87%'],
  ['+ Salary +3%', '84%'],
]

const motivationRows = [
  ['Work flexibility', '93%'],
  ['Career growth', '87%'],
  ['Team / People', '78%'],
  ['Impact & Ownership', '72%'],
  ['Compensation', '65%'],
  ['Company brand', '51%'],
]

const dontDoRows = [
  ['Increasing salary first', 'Only +2% impact'],
  ['Waiting too long', 'Probability drops 5% per day'],
  ['Overloading with benefits', 'Lower perceived value'],
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
    <div v-if="open" class="ai-negotiation-overlay" @click.self="emit('close')">
      <section class="ai-negotiation-modal" @click.stop>
        <header class="ai-negotiation-header">
          <div class="ai-negotiation-header__title">
            <span class="ai-negotiation-header__icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <div class="ai-negotiation-header__heading">
                <h2>AI Negotiation &amp; Offer Strategy</h2>
                <b>BETA</b>
              </div>
              <p>AI recommendations to increase acceptance probability and successfully manage negotiations.</p>
            </div>
          </div>

          <div class="ai-negotiation-header__actions">
            <button type="button" class="ai-negotiation-button">
              <AppIcon name="document" :size="13" />
              <span>Export report</span>
            </button>
            <button type="button" class="ai-negotiation-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <section class="ai-negotiation-top">
          <article class="ai-negotiation-summary-card">
            <div class="ai-negotiation-summary">
              <article class="ai-negotiation-summary__candidate">
                <span>{{ candidateInitials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <div class="ai-negotiation-summary__badges">
                    <em>Top Choice</em>
                    <em class="is-green">Flexible</em>
                  </div>
                  <small>{{ candidateRole }} | Product Team</small>
                  <small>New York, NY | Full-time | 5+ years experience</small>
                </div>
              </article>

              <article class="ai-negotiation-summary__stat">
                <span class="ai-negotiation-summary__label">
                  <AppIcon name="wallet" :size="13" />
                  <span>Offer amount</span>
                </span>
                <strong>$120,000</strong>
                <small>Base Salary</small>
              </article>
              <article class="ai-negotiation-summary__stat">
                <span class="ai-negotiation-summary__label">
                  <AppIcon name="calendar" :size="13" />
                  <span>Offer sent</span>
                </span>
                <strong>May 16, 2024</strong>
                <small>9:21 AM</small>
              </article>
              <article class="ai-negotiation-summary__stat">
                <span class="ai-negotiation-summary__label">
                  <AppIcon name="clock" :size="13" />
                  <span>Offer expires</span>
                </span>
                <strong>May 23, 2024</strong>
                <small class="is-pink">5 days left</small>
              </article>
            </div>
          </article>

          <article class="ai-negotiation-glance-card">
            <div class="ai-negotiation-card__head">
              <h3>At a glance</h3>
            </div>

            <div class="ai-negotiation-glance">
              <article v-for="item in summaryRows" :key="item[0]">
                <span>{{ item[0] }}</span>
                <strong :class="`is-${item[2]}`">{{ item[1] }}</strong>
              </article>
            </div>

            <div class="ai-negotiation-best">
              <div>
                <strong>Best next step</strong>
                <small>Offer 2 remote days per week</small>
              </div>
              <b>+8% impact · Low effort</b>
            </div>
          </article>
        </section>

        <section class="ai-negotiation-banner">
          <div class="ai-negotiation-banner__insight">
            <span><AppIcon name="info" :size="14" /></span>
            <div>
              <strong>AI Insight: Acceptance probability is declining.</strong>
              <small>The candidate has shown concerns about flexibility and growth opportunities. Addressing these could significantly improve your chances.</small>
            </div>
          </div>

          <div class="ai-negotiation-banner__probabilities">
            <article>
              <small>Current probability</small>
              <strong>82%</strong>
            </article>
            <AppIcon name="chevronRight" :size="18" />
            <article>
              <small>Potential probability</small>
              <strong class="is-green">91%</strong>
              <em>With recommended actions</em>
            </article>
          </div>
        </section>

        <div class="ai-negotiation-grid">
          <article class="ai-negotiation-card">
            <h3>AI Strategy Recommendation</h3>
            <small class="ai-negotiation-eyebrow">Primary recommendation</small>

            <div class="ai-negotiation-callout">
              <strong>Do not increase salary first.</strong>
              <p>Focus on flexibility and growth. These matter more to this candidate than compensation.</p>
            </div>

            <div class="ai-negotiation-focus">
              <span>Focus on:</span>
              <ul>
                <li>Work flexibility</li>
                <li>Career growth & learning</li>
                <li>Team impact & ownership</li>
              </ul>
            </div>

            <div class="ai-negotiation-why">
              <strong>Why this works</strong>
              <p>Based on candidate behavior and similar successful negotiations, these factors have the highest impact on acceptance probability.</p>
            </div>
          </article>

          <article class="ai-negotiation-card">
            <div class="ai-negotiation-card__head">
              <h3>Recommended Actions</h3>
              <span>Ranked by impact</span>
            </div>

            <div class="ai-negotiation-actions">
              <article v-for="(item, index) in actionRows" :key="item[0]">
                <span class="ai-negotiation-actions__index">{{ index + 1 }}</span>
                <div>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </div>
                <b class="is-green">{{ item[2] }}</b>
                <em :class="item[3] === 'High' ? 'is-pink' : item[3] === 'Medium' ? 'is-amber' : 'is-green'">{{ item[3] }}</em>
                <span>{{ item[4] }}</span>
              </article>
            </div>

            <small class="ai-negotiation-actions__note">Showing actions ranked by estimated impact on acceptance probability.</small>
          </article>

          <article class="ai-negotiation-card">
            <div class="ai-negotiation-card__head">
              <h3>Negotiation Talking Points</h3>
              <button type="button" class="ai-negotiation-copy">
                <AppIcon name="document" :size="12" />
                <span>Copy all</span>
              </button>
            </div>

            <div class="ai-negotiation-points">
              <article v-for="item in talkingPointRows" :key="item[0]">
                <strong>{{ item[0] }}</strong>
                <em :class="item[1].startsWith('High') ? 'is-pink' : 'is-amber'">{{ item[1] }}</em>
              </article>
            </div>
          </article>

          <article class="ai-negotiation-card">
            <h3>Impact Simulation</h3>
            <small>See how different actions could change the acceptance probability.</small>

            <div class="ai-negotiation-simulation">
              <div class="ai-negotiation-simulation__line"></div>
              <article v-for="item in simulationRows" :key="item[0]">
                <span>{{ item[0] }}</span>
                <i></i>
                <strong>{{ item[1] }}</strong>
              </article>
            </div>
          </article>

          <article class="ai-negotiation-card">
            <h3>Candidate Motivation</h3>

            <div class="ai-negotiation-motivation">
              <article v-for="item in motivationRows" :key="item[0]">
                <span>{{ item[0] }}</span>
                <div><i :style="{ width: item[1] }"></i></div>
                <strong>{{ item[1] }}</strong>
              </article>
            </div>

            <small class="ai-negotiation-motivation__note">Based on candidate signals &amp; past behavior</small>
          </article>

          <article class="ai-negotiation-card">
            <h3>Negotiation Risk</h3>
            <small>If no action taken</small>

            <div class="ai-negotiation-risk">
              <article>
                <span>Current acceptance probability</span>
                <strong>82%</strong>
              </article>
              <article class="is-green">
                <span>With recommended strategy</span>
                <strong>91%</strong>
              </article>
            </div>

            <p>Risk level: <b class="is-amber">Medium</b></p>
          </article>

          <article class="ai-negotiation-card">
            <h3>What NOT to do</h3>

            <ul class="ai-negotiation-donts">
              <li v-for="item in dontDoRows" :key="item[0]">
                <AppIcon name="close" :size="12" />
                <div>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </div>
              </li>
            </ul>
          </article>

          <article class="ai-negotiation-card is-compact">
            <h3>Data sources</h3>
            <p>247 similar offers | Candidate behavior</p>
            <p>Market data | Internal benchmarks</p>
          </article>

          <article class="ai-negotiation-card ai-negotiation-summary-panel is-summary">
            <div>
              <h3>AI Recommendation Summary</h3>
              <p>Focus on flexibility and a personal connection. These will significantly increase your chances of acceptance without additional cost or approval risk.</p>
            </div>

            <div class="ai-negotiation-summary-panel__action">
              <button type="button" class="ai-negotiation-footer__primary">
                <AppIcon name="spark" :size="14" />
                <span>Take Recommended Action</span>
              </button>
              <small>Apply the top recommended action</small>
            </div>
          </article>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-negotiation-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.44);
  backdrop-filter: blur(10px);
}

.ai-negotiation-modal {
  width: min(1220px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
}

.ai-negotiation-header,
.ai-negotiation-header__title,
.ai-negotiation-header__actions,
.ai-negotiation-header__heading,
.ai-negotiation-top,
.ai-negotiation-summary,
.ai-negotiation-summary__candidate,
.ai-negotiation-summary__badges,
.ai-negotiation-banner,
.ai-negotiation-banner__insight,
.ai-negotiation-banner__probabilities,
.ai-negotiation-card__head,
.ai-negotiation-glance article,
.ai-negotiation-best,
.ai-negotiation-points article,
.ai-negotiation-footer {
  display: flex;
  align-items: center;
}

.ai-negotiation-header,
.ai-negotiation-top,
.ai-negotiation-banner,
.ai-negotiation-grid,
.ai-negotiation-footer {
  padding: 18px 22px;
}

.ai-negotiation-header {
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #edf1f8;
}

.ai-negotiation-header__title {
  gap: 12px;
}

.ai-negotiation-header__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
}

.ai-negotiation-header__heading {
  gap: 10px;
  margin-bottom: 6px;
}

.ai-negotiation-header__heading h2,
.ai-negotiation-card h3,
.ai-negotiation-card strong,
.ai-negotiation-card b,
.ai-negotiation-glance-card h3 {
  margin: 0;
  color: #1f2c4f;
}

.ai-negotiation-header p,
.ai-negotiation-summary small,
.ai-negotiation-summary span,
.ai-negotiation-banner small,
.ai-negotiation-card small,
.ai-negotiation-card span,
.ai-negotiation-card p,
.ai-negotiation-card em,
.ai-negotiation-card li,
.ai-negotiation-glance-card small,
.ai-negotiation-glance-card span {
  margin: 0;
  color: #7d8cab;
}

.ai-negotiation-header__heading b {
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

.ai-negotiation-button,
.ai-negotiation-close,
.ai-negotiation-copy,
.ai-negotiation-footer__primary {
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

.ai-negotiation-close {
  width: 38px;
  padding: 0;
}

.ai-negotiation-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 248px;
  align-items: start;
  gap: 14px;
  border-bottom: 1px solid #edf1f8;
}

.ai-negotiation-summary-card {
  width: 100%;
  align-self: start;
  padding: 10px 16px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
}

.ai-negotiation-summary {
  display: grid;
  grid-template-columns: minmax(280px, 1.45fr) repeat(3, minmax(128px, 1fr));
  align-items: center;
  gap: 0;
}

.ai-negotiation-summary > article {
  min-width: 0;
  min-height: auto;
  padding: 10px 18px;
  border: 0;
  background: transparent;
  flex: initial;
}

.ai-negotiation-summary__candidate {
  gap: 14px;
  padding-left: 4px;
}

.ai-negotiation-summary__candidate > div {
  min-width: 0;
}

.ai-negotiation-summary__candidate > span {
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

.ai-negotiation-summary__candidate strong {
  display: block;
  margin-bottom: 4px;
}

.ai-negotiation-summary__badges {
  gap: 8px;
  margin-bottom: 6px;
}

.ai-negotiation-summary__badges em {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #ff2d87;
  background: #fff0f7;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.ai-negotiation-summary__badges em.is-green {
  color: #16a34a;
  background: #effcf4;
}

.ai-negotiation-summary__candidate small {
  display: block;
  line-height: 1.45;
}

.ai-negotiation-summary__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #97a4be;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ai-negotiation-summary__label :deep(svg) {
  color: #a6b0c4;
}

.ai-negotiation-summary__stat {
  display: grid;
  align-content: center;
  gap: 8px;
  padding-left: 22px;
  border-left: 1px solid #edf1f8;
}

.ai-negotiation-summary__stat > strong {
  font-size: 1.1rem;
  line-height: 1.2;
}

.ai-negotiation-summary__stat small.is-pink {
  color: #ff2d87;
  font-weight: 700;
}

.ai-negotiation-glance-card {
  align-self: start;
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.ai-negotiation-banner {
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #edf1f8;
}

.ai-negotiation-banner__insight {
  gap: 12px;
  min-width: 0;
}

.ai-negotiation-banner__insight > span {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4b9b;
  background: #fff0f7;
  flex: 0 0 30px;
}

.ai-negotiation-banner__insight strong {
  display: block;
  margin-bottom: 4px;
}

.ai-negotiation-banner__probabilities {
  gap: 18px;
  padding-left: 18px;
  border-left: 1px solid #edf1f8;
}

.ai-negotiation-banner__probabilities article {
  display: grid;
  gap: 4px;
}

.ai-negotiation-banner__probabilities strong {
  font-size: 2rem;
  line-height: 1;
}

.ai-negotiation-banner__probabilities strong.is-green {
  color: #16a34a;
}

.ai-negotiation-banner__probabilities em {
  color: #16a34a;
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 700;
}

.ai-negotiation-grid {
  display: grid;
  grid-template-columns: 0.92fr 1.18fr 1fr;
  gap: 16px;
}

.ai-negotiation-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.ai-negotiation-card.is-compact {
  min-height: 118px;
}

.ai-negotiation-card.is-summary {
  grid-column: span 2;
}

.ai-negotiation-summary-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background: linear-gradient(180deg, #fff8fb 0%, #fff 100%);
}

.ai-negotiation-summary-panel > div:first-child {
  max-width: 420px;
}

.ai-negotiation-summary-panel__action {
  min-width: 280px;
  display: grid;
  justify-items: end;
  gap: 10px;
}

.ai-negotiation-eyebrow {
  display: block;
  margin-top: 6px;
  color: #ff5a9d;
  font-weight: 800;
}

.ai-negotiation-callout {
  margin-top: 14px;
  padding: 14px;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff7fb 0%, #fff 100%);
  border: 1px solid #ffd9e9;
}

.ai-negotiation-callout strong {
  display: block;
  margin-bottom: 6px;
}

.ai-negotiation-focus,
.ai-negotiation-why {
  margin-top: 16px;
}

.ai-negotiation-focus ul {
  margin: 8px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
}

.ai-negotiation-why strong {
  display: block;
  margin-bottom: 6px;
}

.ai-negotiation-card__head {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.ai-negotiation-actions,
.ai-negotiation-points,
.ai-negotiation-glance,
.ai-negotiation-motivation,
.ai-negotiation-risk {
  display: grid;
  gap: 10px;
}

.ai-negotiation-actions article {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto auto auto;
  gap: 10px;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf1f8;
}

.ai-negotiation-actions article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.ai-negotiation-actions__index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff0f7;
  font-size: 0.7rem;
  font-weight: 800;
}

.ai-negotiation-actions b.is-green,
.ai-negotiation-glance strong.is-green {
  color: #16a34a;
}

.ai-negotiation-glance strong.is-pink {
  color: #ff2d87;
}

.ai-negotiation-glance strong.is-amber {
  color: #ff8a00;
}

.ai-negotiation-actions em,
.ai-negotiation-points em {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.ai-negotiation-actions em.is-green {
  color: #16a34a;
  background: #effcf4;
}

.ai-negotiation-actions em.is-amber,
.ai-negotiation-points em.is-amber {
  color: #ff8a00;
  background: #fff5e9;
}

.ai-negotiation-actions em.is-pink,
.ai-negotiation-points em.is-pink {
  color: #ff2d87;
  background: #fff0f7;
}

.ai-negotiation-actions__note,
.ai-negotiation-motivation__note {
  display: block;
  margin-top: 12px;
  font-size: 0.7rem;
}

.ai-negotiation-glance article {
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #edf1f8;
}

.ai-negotiation-glance article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.ai-negotiation-best {
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #effcf4;
}

.ai-negotiation-best strong,
.ai-negotiation-best b {
  color: #16a34a;
}

.ai-negotiation-copy {
  min-height: 30px;
  padding: 0 10px;
  font-size: 0.68rem;
}

.ai-negotiation-points article {
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf1f8;
}

.ai-negotiation-points article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.ai-negotiation-points strong {
  max-width: 78%;
  line-height: 1.45;
}

.ai-negotiation-simulation {
  position: relative;
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.ai-negotiation-simulation__line {
  position: absolute;
  left: 7%;
  right: 7%;
  top: 40px;
  height: 3px;
  border-radius: 999px;
  background: #ffb8d3;
}

.ai-negotiation-simulation article {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;
}

.ai-negotiation-simulation article span {
  font-size: 0.72rem;
  line-height: 1.35;
}

.ai-negotiation-simulation article i {
  width: 12px;
  height: 12px;
  border: 3px solid #ff4b9b;
  border-radius: 50%;
  background: #fff;
  z-index: 1;
}

.ai-negotiation-motivation article {
  display: grid;
  grid-template-columns: 116px 1fr 44px;
  gap: 10px;
  align-items: center;
}

.ai-negotiation-motivation div {
  height: 6px;
  border-radius: 999px;
  background: #edf1f8;
  overflow: hidden;
}

.ai-negotiation-motivation div i {
  height: 100%;
  display: block;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff6aa8 0%, #ff2d87 100%);
}

.ai-negotiation-risk article {
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff7fb;
}

.ai-negotiation-risk article.is-green {
  background: #effcf4;
}

.ai-negotiation-risk article strong {
  display: block;
  margin-top: 4px;
}

.ai-negotiation-risk article.is-green strong {
  color: #16a34a;
}

.ai-negotiation-risk + p {
  margin-top: 12px;
}

.ai-negotiation-risk + p b.is-amber {
  color: #ff8a00;
}

.ai-negotiation-donts {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.ai-negotiation-donts li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.ai-negotiation-donts li :deep(svg) {
  color: #ff5a9d;
  flex: 0 0 auto;
  margin-top: 4px;
}

.ai-negotiation-donts li strong {
  display: block;
  margin-bottom: 4px;
}

.ai-negotiation-footer {
  justify-content: space-between;
  gap: 14px;
  border-top: 1px solid #edf1f8;
}

.ai-negotiation-footer__primary {
  min-width: 220px;
  border-color: #6d5cff;
  color: #fff;
  background: linear-gradient(135deg, #ff4b9b 0%, #ff2d87 45%, #6d5cff 100%);
}

.ai-negotiation-footer small {
  color: #ff5a9d;
  font-weight: 700;
}

@media (max-width: 1240px) {
  .ai-negotiation-top {
    grid-template-columns: 1fr;
  }

  .ai-negotiation-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ai-negotiation-card.is-summary {
    grid-column: auto;
  }
}

@media (max-width: 900px) {
  .ai-negotiation-overlay {
    padding: 12px;
  }

  .ai-negotiation-modal {
    width: min(100%, calc(100vw - 24px));
  }

  .ai-negotiation-header,
  .ai-negotiation-banner,
  .ai-negotiation-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-negotiation-summary {
    grid-template-columns: 1fr;
  }

  .ai-negotiation-summary-card {
    padding: 10px 14px;
  }

  .ai-negotiation-summary > article {
    padding: 12px 4px;
  }

  .ai-negotiation-summary__stat {
    padding-left: 4px;
    border-left: 0;
    border-top: 1px solid #edf1f8;
    padding-top: 12px;
  }

  .ai-negotiation-banner__probabilities {
    padding-left: 0;
    border-left: 0;
    border-top: 1px solid #edf1f8;
    padding-top: 12px;
  }

  .ai-negotiation-grid,
  .ai-negotiation-simulation {
    grid-template-columns: 1fr;
  }

  .ai-negotiation-summary-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-negotiation-summary-panel > div:first-child,
  .ai-negotiation-summary-panel__action {
    max-width: none;
    min-width: 0;
    width: 100%;
  }

  .ai-negotiation-summary-panel__action {
    justify-items: stretch;
  }

  .ai-negotiation-actions article,
  .ai-negotiation-motivation article {
    grid-template-columns: 1fr;
  }

  .ai-negotiation-points strong {
    max-width: none;
  }

  .ai-negotiation-footer {
    align-items: stretch;
  }
}
</style>
