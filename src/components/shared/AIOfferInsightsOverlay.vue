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
    default: 'Senior Frontend Developer',
  },
  candidateRole: {
    type: String,
    default: 'Senior Frontend Developer',
  },
})

const emit = defineEmits(['close'])

const timelineRows = [
  ['Offer sent', 'May 20, 2024 at 10:30 AM', '', 'checkCircle', 'pink'],
  ['Offer opened', 'May 20, 2024 at 2:15 PM', '3 times', 'eye', 'pink'],
  ['Viewed Benefits Guide', 'May 21, 2024 at 10:03 AM', '2 times', 'document', 'pink'],
  ['Downloaded Contract', 'May 21, 2024 at 4:45 PM', '', 'document', 'green'],
  ['Signature pending', 'Waiting for candidate', '', 'edit', 'slate'],
]

const observationRows = [
  'Opened the offer 3 times',
  'Downloaded the contract',
  'Viewed compensation details',
  'High engagement pattern',
]

const breakdownRows = [
  ['Acceptance probability', '89%', 'green'],
  ['Expiry risk', 'Low', 'green'],
  ['Ghosting risk', 'Low', 'green'],
  ['Negotiation risk', 'Low', 'green'],
]

const nextRows = [
  ['Current (No action)', '89%', 'In 2-4 days', 'pink'],
  ['Wait 1 more day', '91%', 'In 2-3 days', 'green'],
  ['Send reminder', '94%', 'In 1-2 days', 'green'],
  ['Call candidate', '97%', 'Within 24h', 'green'],
  ['Add small incentive', '98%', 'Within 24h', 'green'],
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
    <div v-if="open" class="ai-offer-insights-overlay" @click.self="emit('close')">
      <section class="ai-offer-insights-modal" @click.stop>
        <header class="ai-offer-insights-header">
          <div class="ai-offer-insights-header__title">
            <span class="ai-offer-insights-header__icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <div class="ai-offer-insights-header__heading">
                <h2>AI Offer Insights</h2>
                <b>LIVE</b>
              </div>
              <p>Senior Frontend Developer • San Francisco, CA • Full-time</p>
            </div>
          </div>

          <div class="ai-offer-insights-header__actions">
            <button type="button" class="ai-offer-insights-button is-link">
              <span>View offer</span>
              <AppIcon name="external-link" :size="12" />
            </button>
            <button type="button" class="ai-offer-insights-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <section class="ai-offer-insights-progress">
          <article class="is-pink"><i></i><span>Draft</span></article>
          <b></b>
          <article class="is-green"><i></i><span>Approved</span></article>
          <b></b>
          <article class="is-active"><i></i><span>Sent</span></article>
          <b></b>
          <article><i></i><span>Viewed</span></article>
          <b></b>
          <article><i></i><span>Accepted</span></article>
          <b></b>
          <article><i></i><span>Completed</span></article>
        </section>

        <div class="ai-offer-insights-grid ai-offer-insights-grid--top">
          <article class="ai-offer-insights-card ai-offer-insights-health">
            <h3>Offer Health</h3>

            <div class="ai-offer-insights-health__body">
              <div class="ai-offer-insights-health__ring">
                <div>
                  <strong>89%</strong>
                </div>
              </div>

              <div class="ai-offer-insights-health__text">
                <div class="ai-offer-insights-health__heading">
                  <strong>Likely to Accept</strong>
                  <em>Healthy</em>
                </div>
                <p>AI predicts a high chance of acceptance.</p>

                <div class="ai-offer-insights-health__stats">
                  <article>
                    <AppIcon name="calendar" :size="13" />
                    <div>
                      <small>Expected decision</small>
                      <strong>In 2-4 days</strong>
                    </div>
                  </article>
                  <article>
                    <AppIcon name="alert" :size="13" />
                    <div>
                      <small>Confidence</small>
                      <strong>95%</strong>
                    </div>
                  </article>
                  <article>
                    <AppIcon name="chart-bars" :size="13" />
                    <div>
                      <small>Compared to similar offers</small>
                      <strong>Top 18%</strong>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </article>

          <article class="ai-offer-insights-card">
            <div class="ai-offer-insights-card__head">
              <h3>Engagement Score</h3>
              <AppIcon name="info" :size="13" />
            </div>

            <div class="ai-offer-insights-score">
              <strong>95</strong>
              <span>/100</span>
              <em>Very High</em>
            </div>

            <div class="ai-offer-insights-score__rows">
              <article><span>Offer viewed</span><strong>3 times</strong></article>
              <article><span>Time spent on offer</span><strong>12 min</strong></article>
              <article><span>Benefits guide</span><strong>Viewed</strong></article>
              <article><span>Contract downloaded</span><strong>Yes</strong></article>
              <article><span>Shared with others</span><strong>Yes</strong></article>
            </div>
          </article>

          <article class="ai-offer-insights-card">
            <div class="ai-offer-insights-card__head">
              <h3>AI Prediction</h3>
              <AppIcon name="info" :size="13" />
            </div>

            <div class="ai-offer-insights-prediction">
              <strong>89%</strong>
              <small>Likelihood to accept</small>
            </div>

            <div class="ai-offer-insights-mini-chart">
              <div class="ai-offer-insights-mini-chart__curve"></div>
              <i></i>
            </div>

            <div class="ai-offer-insights-score__rows">
              <article><span>Expected decision window</span><strong>May 21 - May 23</strong></article>
              <article><span>Model confidence</span><strong>95%</strong></article>
              <article><span>Based on 123 similar accepted offers</span><strong>&nbsp;</strong></article>
            </div>
          </article>
        </div>

        <div class="ai-offer-insights-grid ai-offer-insights-grid--middle">
          <article class="ai-offer-insights-card">
            <h3>Candidate Timeline</h3>

            <div class="ai-offer-insights-timeline">
              <article v-for="item in timelineRows" :key="item[0]">
                <span :class="`is-${item[4]}`"><AppIcon :name="item[3]" :size="12" /></span>
                <div>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </div>
                <em v-if="item[2]">{{ item[2] }}</em>
              </article>
            </div>

            <button type="button" class="ai-offer-insights-panel-button">
              <span>View full activity</span>
              <AppIcon name="external-link" :size="12" />
            </button>
          </article>

          <article class="ai-offer-insights-card">
            <div class="ai-offer-insights-card__head is-left">
              <AppIcon name="sparkles" :size="14" />
              <h3>AI Observations</h3>
            </div>

            <div class="ai-offer-insights-note is-positive">
              <strong>Positive Signals</strong>
              <ul>
                <li v-for="item in observationRows" :key="item">
                  <AppIcon name="checkCircle" :size="12" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="ai-offer-insights-note is-warning">
              <strong>Watch Items</strong>
              <p>No signature yet (normal at this stage)</p>
            </div>

            <div class="ai-offer-insights-note is-interpretation">
              <strong>AI Interpretation</strong>
              <p>The candidate is highly engaged and showing strong intent to accept. Behavior is similar to candidates who accepted within 3 days.</p>
            </div>
          </article>

          <article class="ai-offer-insights-card">
            <div class="ai-offer-insights-card__head is-left">
              <AppIcon name="sparkles" :size="14" />
              <h3>Recommended Next Action</h3>
            </div>

            <div class="ai-offer-insights-recommendation">
              <div class="ai-offer-insights-recommendation__top">
                <span><AppIcon name="message" :size="14" /></span>
                <div>
                  <strong>Wait one more day</strong>
                  <small>Candidate is showing strong interest. Best to wait before following up.</small>
                </div>
                <em>Recommended</em>
              </div>
              <p>If no signature after tomorrow</p>
              <button type="button" class="ai-offer-insights-panel-button is-ghost">
                <AppIcon name="mail" :size="12" />
                <span>Send a friendly reminder</span>
              </button>
            </div>

            <div class="ai-offer-insights-breakdown">
              <h4>Offer Health Breakdown</h4>
              <article v-for="item in breakdownRows" :key="item[0]">
                <span>{{ item[0] }}</span>
                <strong :class="`is-${item[2]}`">{{ item[1] }}</strong>
              </article>
            </div>

            <div class="ai-offer-insights-status">
              <span>Overall status</span>
              <b>Healthy</b>
            </div>
          </article>
        </div>

        <div class="ai-offer-insights-journey">
          <div class="ai-offer-insights-card">
            <div class="ai-offer-insights-card__head">
              <div>
                <h3>What happens next?</h3>
                <small>AI simulation based on similar candidate behavior</small>
              </div>
            </div>

            <div class="ai-offer-insights-journey__grid">
              <article v-for="item in nextRows" :key="item[0]" :class="`is-${item[3]}`">
                <span>{{ item[0] }}</span>
                <strong>{{ item[1] }}</strong>
                <small>{{ item[2] }}</small>
              </article>
            </div>
          </div>

          <article class="ai-offer-insights-card ai-offer-insights-intent">
            <div class="ai-offer-insights-card__head">
              <div>
                <h3>Candidate Intent</h3>
                <small>High</small>
              </div>
              <span class="ai-offer-insights-intent__icon"><AppIcon name="heart" :size="16" /></span>
            </div>
            <p>Strong positive intent signals detected</p>
            <button type="button" class="ai-offer-insights-panel-button is-wide">
              <span>View intent details</span>
              <AppIcon name="chevronRight" :size="12" />
            </button>
          </article>
        </div>

        <section class="ai-offer-insights-notes">
          <div class="ai-offer-insights-card__head is-left">
            <AppIcon name="document" :size="14" />
            <div>
              <h3>Internal Notes</h3>
              <small>Add internal notes about this offer...</small>
            </div>
          </div>
          <small>Only visible to your team</small>
        </section>

        <footer class="ai-offer-insights-footer">
          <div class="ai-offer-insights-footer__left">
            <button type="button" class="ai-offer-insights-button is-subtle">
              <AppIcon name="mail" :size="12" />
              <span>Send reminder email</span>
            </button>
            <button type="button" class="ai-offer-insights-button is-subtle">
              <AppIcon name="phone" :size="12" />
              <span>Call candidate</span>
            </button>
            <button type="button" class="ai-offer-insights-button is-subtle">
              <AppIcon name="document" :size="12" />
              <span>Download offer PDF</span>
            </button>
          </div>

          <div class="ai-offer-insights-footer__right">
            <button type="button" class="ai-offer-insights-button is-danger">
              <AppIcon name="trash" :size="12" />
              <span>Withdraw offer</span>
            </button>
            <button type="button" class="ai-offer-insights-button is-primary" @click="emit('close')">Close</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-offer-insights-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.44);
  backdrop-filter: blur(10px);
}

.ai-offer-insights-modal {
  width: min(1220px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
}

.ai-offer-insights-header,
.ai-offer-insights-header__title,
.ai-offer-insights-header__heading,
.ai-offer-insights-header__actions,
.ai-offer-insights-progress,
.ai-offer-insights-progress article,
.ai-offer-insights-card__head,
.ai-offer-insights-card__head.is-left,
.ai-offer-insights-health__heading,
.ai-offer-insights-health__stats article,
.ai-offer-insights-footer,
.ai-offer-insights-footer__left,
.ai-offer-insights-footer__right,
.ai-offer-insights-status,
.ai-offer-insights-notes,
.ai-offer-insights-recommendation__top {
  display: flex;
  align-items: center;
}

.ai-offer-insights-header,
.ai-offer-insights-progress,
.ai-offer-insights-grid,
.ai-offer-insights-journey,
.ai-offer-insights-notes,
.ai-offer-insights-footer {
  padding: 16px 18px;
}

.ai-offer-insights-header {
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #edf1f8;
}

.ai-offer-insights-header__title,
.ai-offer-insights-header__actions,
.ai-offer-insights-footer,
.ai-offer-insights-footer__left,
.ai-offer-insights-footer__right {
  gap: 12px;
}

.ai-offer-insights-header__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4b9b;
  background: #fff0f7;
}

.ai-offer-insights-header__heading {
  gap: 10px;
  margin-bottom: 4px;
}

.ai-offer-insights-header__heading h2,
.ai-offer-insights-card h3,
.ai-offer-insights-card h4,
.ai-offer-insights-card strong,
.ai-offer-insights-card b,
.ai-offer-insights-notes h3 {
  margin: 0;
  color: #1f2c4f;
}

.ai-offer-insights-header p,
.ai-offer-insights-card p,
.ai-offer-insights-card span,
.ai-offer-insights-card small,
.ai-offer-insights-notes small {
  margin: 0;
  color: #7d8cab;
}

.ai-offer-insights-header__heading b {
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #ff2d87;
  background: #fff0f7;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-offer-insights-button,
.ai-offer-insights-close,
.ai-offer-insights-panel-button {
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

.ai-offer-insights-close {
  width: 38px;
  padding: 0;
}

.ai-offer-insights-button.is-link {
  color: #ff2d87;
  background: #fff8fb;
}

.ai-offer-insights-progress {
  gap: 8px;
  border-bottom: 1px solid #edf1f8;
}

.ai-offer-insights-progress article {
  gap: 8px;
  color: #a0aac0;
  font-size: 0.72rem;
  font-weight: 700;
}

.ai-offer-insights-progress article i {
  width: 16px;
  height: 16px;
  border: 1.5px solid #d4dceb;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.ai-offer-insights-progress article.is-green i {
  border-color: #22c55e;
  background: #22c55e;
}

.ai-offer-insights-progress article.is-pink i,
.ai-offer-insights-progress article.is-active i {
  border-color: #ff2d87;
}

.ai-offer-insights-progress article.is-active i {
  background: #ff2d87;
}

.ai-offer-insights-progress article.is-green i::after,
.ai-offer-insights-progress article.is-active i::after,
.ai-offer-insights-progress article.is-pink i::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
}

.ai-offer-insights-progress article.is-pink i::after {
  background: #ff2d87;
}

.ai-offer-insights-progress b {
  width: 32px;
  height: 1px;
  background: #e6ecf6;
}

.ai-offer-insights-grid {
  display: grid;
  gap: 14px;
}

.ai-offer-insights-grid--top {
  grid-template-columns: 1.55fr 0.72fr 0.72fr;
}

.ai-offer-insights-grid--middle {
  grid-template-columns: 1fr 1fr 1fr;
  padding-top: 0;
}

.ai-offer-insights-card,
.ai-offer-insights-notes {
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.ai-offer-insights-card {
  padding: 14px;
}

.ai-offer-insights-card__head {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.ai-offer-insights-card__head.is-left {
  justify-content: flex-start;
}

.ai-offer-insights-health__body {
  display: grid;
  grid-template-columns: 94px 1fr;
  gap: 14px;
  align-items: start;
}

.ai-offer-insights-health__ring {
  width: 90px;
  height: 90px;
  padding: 7px;
  border-radius: 50%;
  background: conic-gradient(#ff4b9b 0 320deg, #f1f5fb 320deg 360deg);
}

.ai-offer-insights-health__ring > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
}

.ai-offer-insights-health__ring strong {
  font-size: 1.9rem;
}

.ai-offer-insights-health__heading {
  gap: 8px;
  margin-bottom: 6px;
}

.ai-offer-insights-health__heading em {
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-offer-insights-health__stats {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.ai-offer-insights-health__stats article {
  gap: 8px;
}

.ai-offer-insights-health__stats strong {
  display: block;
  margin-top: 2px;
  font-size: 0.8rem;
}

.ai-offer-insights-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}

.ai-offer-insights-score strong,
.ai-offer-insights-prediction strong {
  font-size: 2.2rem;
  line-height: 1;
}

.ai-offer-insights-score em {
  margin-left: 8px;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-offer-insights-score__rows,
.ai-offer-insights-breakdown,
.ai-offer-insights-timeline {
  display: grid;
  gap: 10px;
}

.ai-offer-insights-score__rows article,
.ai-offer-insights-breakdown article {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.ai-offer-insights-prediction small {
  display: block;
  margin-top: 4px;
}

.ai-offer-insights-mini-chart {
  position: relative;
  height: 82px;
  margin: 8px 0 12px;
}

.ai-offer-insights-mini-chart__curve {
  position: absolute;
  inset: 18px 0 8px;
  background: linear-gradient(180deg, rgba(255, 75, 155, 0.15) 0%, rgba(255, 75, 155, 0.03) 100%);
  clip-path: polygon(0 92%, 10% 90%, 22% 88%, 34% 86%, 46% 78%, 58% 66%, 70% 52%, 80% 30%, 90% 12%, 100% 0, 100% 100%, 0 100%);
}

.ai-offer-insights-mini-chart i {
  position: absolute;
  right: 2px;
  top: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff2d87;
  box-shadow: 0 0 0 5px rgba(255, 45, 135, 0.12);
}

.ai-offer-insights-timeline article {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
}

.ai-offer-insights-timeline article > span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.ai-offer-insights-timeline article > span.is-pink {
  color: #ff2d87;
  background: #fff0f7;
}

.ai-offer-insights-timeline article > span.is-green {
  color: #16a34a;
  background: #effcf4;
}

.ai-offer-insights-timeline article > span.is-slate {
  color: #7d8cab;
  background: #f5f7fb;
}

.ai-offer-insights-timeline strong,
.ai-offer-insights-breakdown h4,
.ai-offer-insights-intent p {
  display: block;
}

.ai-offer-insights-timeline em {
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #ff2d87;
  background: #fff0f7;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-offer-insights-panel-button {
  width: 100%;
  margin-top: 14px;
}

.ai-offer-insights-panel-button.is-ghost {
  min-height: 34px;
  margin-top: 10px;
}

.ai-offer-insights-panel-button.is-wide {
  margin-top: 10px;
}

.ai-offer-insights-note {
  padding: 12px;
  border-radius: 14px;
  margin-top: 12px;
}

.ai-offer-insights-note.is-positive {
  border: 1px solid #e4f6ea;
  background: linear-gradient(180deg, #f9fffb 0%, #fff 100%);
}

.ai-offer-insights-note.is-warning {
  border: 1px solid #ffedd5;
  background: #fffdf8;
}

.ai-offer-insights-note.is-interpretation {
  border: 1px solid #eee7ff;
  background: #faf8ff;
}

.ai-offer-insights-note strong {
  display: block;
  margin-bottom: 8px;
}

.ai-offer-insights-note ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.ai-offer-insights-note li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-offer-insights-note li :deep(svg) {
  color: #16a34a;
  flex: 0 0 auto;
}

.ai-offer-insights-recommendation {
  padding: 12px;
  border: 1px solid #e4f6ea;
  border-radius: 14px;
  background: linear-gradient(180deg, #f9fffb 0%, #fff 100%);
}

.ai-offer-insights-recommendation__top {
  align-items: flex-start;
  gap: 10px;
}

.ai-offer-insights-recommendation__top > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #effcf4;
}

.ai-offer-insights-recommendation__top em {
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-offer-insights-breakdown {
  margin-top: 14px;
}

.ai-offer-insights-breakdown article {
  padding-bottom: 8px;
  border-bottom: 1px solid #edf1f8;
}

.ai-offer-insights-breakdown article:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.ai-offer-insights-breakdown strong.is-green,
.ai-offer-insights-status b {
  color: #16a34a;
}

.ai-offer-insights-status {
  justify-content: space-between;
  margin-top: 14px;
}

.ai-offer-insights-status b {
  min-height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: #effcf4;
}

.ai-offer-insights-journey {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  gap: 14px;
  padding-top: 0;
}

.ai-offer-insights-journey__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.ai-offer-insights-journey__grid article {
  padding: 12px 10px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  text-align: center;
}

.ai-offer-insights-journey__grid article.is-pink {
  border-color: #ffd6e7;
  background: #fff8fb;
}

.ai-offer-insights-journey__grid strong {
  display: block;
  margin: 8px 0 4px;
}

.ai-offer-insights-journey__grid article.is-pink strong {
  color: #ff2d87;
}

.ai-offer-insights-journey__grid article.is-green strong {
  color: #16a34a;
}

.ai-offer-insights-intent__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4b9b;
  background: #fff0f7;
}

.ai-offer-insights-notes {
  justify-content: space-between;
  gap: 16px;
  margin: 0 18px 16px;
  padding: 14px;
}

.ai-offer-insights-footer {
  justify-content: space-between;
  gap: 14px;
  border-top: 1px solid #edf1f8;
}

.ai-offer-insights-button.is-subtle {
  color: #6f7fa3;
}

.ai-offer-insights-button.is-danger {
  color: #ff5a76;
  background: #fff5f7;
}

.ai-offer-insights-button.is-primary {
  min-width: 110px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff5cab 0%, #ff2d87 45%, #ff4b9b 100%);
}

@media (max-width: 1240px) {
  .ai-offer-insights-grid--top,
  .ai-offer-insights-grid--middle,
  .ai-offer-insights-journey {
    grid-template-columns: 1fr;
  }

  .ai-offer-insights-journey__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .ai-offer-insights-header,
  .ai-offer-insights-footer,
  .ai-offer-insights-footer__left,
  .ai-offer-insights-footer__right,
  .ai-offer-insights-notes {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-offer-insights-progress {
    flex-wrap: wrap;
  }

  .ai-offer-insights-health__body,
  .ai-offer-insights-health__stats,
  .ai-offer-insights-journey__grid {
    grid-template-columns: 1fr;
  }
}
</style>
