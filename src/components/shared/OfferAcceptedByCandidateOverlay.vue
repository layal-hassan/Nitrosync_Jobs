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

const emit = defineEmits(['close', 'move-to-hired'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MM'
))

const timelineRows = [
  ['Offer sent', 'May 10', '10:30 AM', 'pink'],
  ['Viewed', 'May 16', '3:42 PM', 'pink'],
  ['Benefits viewed', 'May 17', '11:05 AM', 'violet'],
  ['Downloaded', 'May 17', '4:45 PM', 'green'],
  ['Accepted', 'May 18', '2:30 PM', 'green'],
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
    <div v-if="open" class="offer-accepted-by-candidate-overlay" @click.self="emit('close')">
      <section class="offer-accepted-by-candidate-modal" @click.stop>
        <header class="offer-accepted-by-candidate-header">
          <div class="offer-accepted-by-candidate-header__title">
            <span class="offer-accepted-by-candidate-header__icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <div class="offer-accepted-by-candidate-header__heading">
                <h2>Offer accepted by candidate!</h2>
              </div>
              <p>Great news! {{ candidateName.split(' ')[0] || 'Marvin' }} has accepted the offer. Let's move forward with onboarding.</p>
            </div>
          </div>

          <div class="offer-accepted-by-candidate-header__actions">
            <button type="button" class="offer-accepted-by-candidate-button is-link">
              <span>View offer</span>
              <AppIcon name="external-link" :size="12" />
            </button>
            <button type="button" class="offer-accepted-by-candidate-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <section class="offer-accepted-by-candidate-progress">
          <article><i></i><span>Draft</span></article>
          <b></b>
          <article class="is-green"><i></i><span>Approved</span></article>
          <b></b>
          <article class="is-green"><i></i><span>Sent</span></article>
          <b></b>
          <article class="is-green"><i></i><span>Viewed</span></article>
          <b></b>
          <article class="is-active"><i></i><span>Accepted</span></article>
          <b></b>
          <article><i></i><span>Completed</span></article>
        </section>

        <div class="offer-accepted-by-candidate-grid offer-accepted-by-candidate-grid--top">
          <article class="offer-accepted-by-candidate-card offer-accepted-by-candidate-health">
            <h3>Offer Accepted</h3>
            <small>{{ candidateName }} has accepted the offer.</small>

            <div class="offer-accepted-by-candidate-health__hero">
              <div class="offer-accepted-by-candidate-health__icon">
                <AppIcon name="checkCircle" :size="26" />
              </div>
              <div>
                <strong>Offer Accepted</strong>
                <em>Accepted as proposed</em>
              </div>
            </div>

            <div class="offer-accepted-by-candidate-health__stats">
              <article><span>Accepted on</span><strong>May 18, 2024</strong></article>
              <article><span>At</span><strong>2:30 PM</strong></article>
              <article><span>Accepted via</span><strong>Email</strong></article>
              <article><span>Accepted after</span><strong>2 days</strong></article>
            </div>

            <div class="offer-accepted-by-candidate-insight">
              <div class="offer-accepted-by-candidate-card__head is-left">
                <AppIcon name="sparkles" :size="14" />
                <strong>AI Insight</strong>
              </div>
              <p>Acceptance happened <b>1.8 days faster</b> than similar candidates. No negotiation required. Strong positive hiring signal.</p>
            </div>
          </article>

          <article class="offer-accepted-by-candidate-card">
            <h3>Offer summary</h3>
            <div class="offer-accepted-by-candidate-summary">
              <div class="offer-accepted-by-candidate-summary__candidate">
                <span>{{ candidateInitials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <small>{{ candidateRole }}</small>
                  <em>Offer sent</em>
                </div>
              </div>

              <article><span>Offered on</span><strong>May 10, 2024</strong></article>
              <article><span>Base salary</span><strong>$142,000</strong></article>
              <article><span>Annual bonus</span><strong>10%</strong></article>
              <article><span>Equity</span><strong>1,000 RSUs</strong></article>
              <article><span>Proposed start date</span><strong>June 16, 2024</strong></article>
              <article><span>Offer expires</span><strong class="is-pink">May 24, 2024 (Expired)</strong></article>
            </div>

            <button type="button" class="offer-accepted-by-candidate-panel-button">
              <AppIcon name="eye" :size="12" />
              <span>View full offer details</span>
            </button>
          </article>
        </div>

        <div class="offer-accepted-by-candidate-grid offer-accepted-by-candidate-grid--middle">
          <article class="offer-accepted-by-candidate-card">
            <h3>Acceptance timeline</h3>
            <div class="offer-accepted-by-candidate-timeline">
              <article v-for="item in timelineRows" :key="item[0]">
                <span :class="`is-${item[3]}`"><AppIcon name="checkCircle" :size="12" /></span>
                <div>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                  <em>{{ item[2] }}</em>
                </div>
              </article>
            </div>
            <div class="offer-accepted-by-candidate-chip-row">
              <small>Total time: 2 days</small>
              <small>Faster than 78% of similar candidates</small>
            </div>
          </article>

          <article class="offer-accepted-by-candidate-card">
            <div class="offer-accepted-by-candidate-card__head is-left">
              <AppIcon name="sparkles" :size="14" />
              <h3>AI Observations</h3>
            </div>

            <div class="offer-accepted-by-candidate-note is-positive">
              <strong>Positive Signals</strong>
              <ul>
                <li v-for="item in observationRows" :key="item">
                  <AppIcon name="checkCircle" :size="12" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="offer-accepted-by-candidate-note is-warning">
              <strong>Watch Items</strong>
              <p>No signature yet (normal at this stage)</p>
            </div>

            <div class="offer-accepted-by-candidate-note is-interpretation">
              <strong>AI Interpretation</strong>
              <p>The candidate is highly engaged and showing strong intent to accept. Behavior is similar to candidates who accepted within 3 days.</p>
            </div>
          </article>

          <article class="offer-accepted-by-candidate-card">
            <div class="offer-accepted-by-candidate-card__head is-left">
              <AppIcon name="sparkles" :size="14" />
              <h3>Recommended Next Action</h3>
            </div>

            <div class="offer-accepted-by-candidate-recommendation">
              <div class="offer-accepted-by-candidate-recommendation__top">
                <span><AppIcon name="message" :size="14" /></span>
                <div>
                  <strong>Wait one more day</strong>
                  <small>Candidate is showing strong interest. Best to wait before following up.</small>
                </div>
                <em>Recommended</em>
              </div>
              <p>If no signature after tomorrow</p>
              <button type="button" class="offer-accepted-by-candidate-panel-button is-ghost">
                <AppIcon name="mail" :size="12" />
                <span>Send a friendly reminder</span>
              </button>
            </div>

            <div class="offer-accepted-by-candidate-breakdown">
              <h4>Offer Health Breakdown</h4>
              <article v-for="item in breakdownRows" :key="item[0]">
                <span>{{ item[0] }}</span>
                <strong :class="`is-${item[2]}`">{{ item[1] }}</strong>
              </article>
            </div>

            <div class="offer-accepted-by-candidate-status">
              <span>Overall status</span>
              <b>Healthy</b>
            </div>
          </article>
        </div>

        <div class="offer-accepted-by-candidate-grid offer-accepted-by-candidate-grid--bottom">
          <article class="offer-accepted-by-candidate-card">
            <div class="offer-accepted-by-candidate-card__head">
              <div>
                <h3>What happens next?</h3>
                <small>AI simulation based on similar candidate behavior</small>
              </div>
            </div>

            <div class="offer-accepted-by-candidate-next">
              <article v-for="item in nextRows" :key="item[0]" :class="`is-${item[3]}`">
                <span>{{ item[0] }}</span>
                <strong>{{ item[1] }}</strong>
                <small>{{ item[2] }}</small>
              </article>
            </div>
          </article>

          <article class="offer-accepted-by-candidate-card offer-accepted-by-candidate-intent">
            <div class="offer-accepted-by-candidate-card__head">
              <div>
                <h3>Candidate Intent</h3>
                <small>High</small>
              </div>
              <span class="offer-accepted-by-candidate-intent__icon"><AppIcon name="heart" :size="16" /></span>
            </div>
            <p>Strong positive intent signals detected</p>
            <button type="button" class="offer-accepted-by-candidate-panel-button is-wide">
              <span>View intent details</span>
              <AppIcon name="chevronRight" :size="12" />
            </button>
          </article>
        </div>

        <div class="offer-accepted-by-candidate-grid offer-accepted-by-candidate-grid--last">
          <article class="offer-accepted-by-candidate-card">
            <h3>Onboarding readiness</h3>
            <div class="offer-accepted-by-candidate-readiness">
              <article><span class="is-green"><AppIcon name="checkCircle" :size="12" /></span><div><strong>Start date</strong><small>June 16, 2024</small></div></article>
              <article><span class="is-green"><AppIcon name="user-check" :size="12" /></span><div><strong>Manager</strong><small>Brooklyn Simmons</small></div></article>
              <article><span class="is-amber"><AppIcon name="document" :size="12" /></span><div><strong>Documents</strong><small>Pending</small></div></article>
              <article><span class="is-amber"><AppIcon name="gift" :size="12" /></span><div><strong>Equipment</strong><small>Not requested</small></div></article>
            </div>
            <button type="button" class="offer-accepted-by-candidate-panel-button is-wide">
              <span>Go to onboarding center</span>
              <AppIcon name="chevronRight" :size="12" />
            </button>
          </article>

          <article class="offer-accepted-by-candidate-card">
            <h3>Automation preview</h3>
            <small>When you confirm, the following will happen automatically:</small>
            <ul class="offer-accepted-by-candidate-list">
              <li>Move candidate to Hired stage</li>
              <li>Create employee profile</li>
              <li>Trigger onboarding workflow</li>
              <li>Notify IT, Payroll & Manager</li>
              <li>Archive requisition</li>
            </ul>
          </article>

          <article class="offer-accepted-by-candidate-card">
            <h3>Candidate sentiment</h3>
            <div class="offer-accepted-by-candidate-sentiment">
              <strong>Highly positive</strong>
              <div class="offer-accepted-by-candidate-stars">
                <AppIcon v-for="star in 5" :key="star" name="star" :size="12" />
              </div>
              <p>"Excited to join the team and contribute to the amazing work you're doing."</p>
              <small>— {{ candidateName }}</small>
            </div>
          </article>
        </div>

        <section class="offer-accepted-by-candidate-notes">
          <div class="offer-accepted-by-candidate-card__head is-left">
            <AppIcon name="document" :size="14" />
            <div>
              <h3>Internal notes</h3>
              <small>Add any notes about the acceptance, conversation highlights, or next steps...</small>
            </div>
          </div>
          <small>Only visible to your team</small>
        </section>

        <footer class="offer-accepted-by-candidate-footer">
          <div class="offer-accepted-by-candidate-footer__left">
            <button type="button" class="offer-accepted-by-candidate-button is-subtle"><AppIcon name="mail" :size="12" /><span>Send reminder email</span></button>
            <button type="button" class="offer-accepted-by-candidate-button is-subtle"><AppIcon name="phone" :size="12" /><span>Call candidate</span></button>
            <button type="button" class="offer-accepted-by-candidate-button is-subtle"><AppIcon name="document" :size="12" /><span>Download offer PDF</span></button>
          </div>

          <div class="offer-accepted-by-candidate-footer__right">
            <button type="button" class="offer-accepted-by-candidate-button is-danger"><AppIcon name="trash" :size="12" /><span>Withdraw offer</span></button>
            <button type="button" class="offer-accepted-by-candidate-button" @click="emit('close')">Close</button>
            <button type="button" class="offer-accepted-by-candidate-button is-primary" @click="emit('move-to-hired')">Move to Hired</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.offer-accepted-by-candidate-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.44);
  backdrop-filter: blur(10px);
}

.offer-accepted-by-candidate-modal {
  width: min(1220px, calc(100vw - 36px));
  margin: 0 auto;
  max-height: calc(100vh - 36px);
  overflow-y: auto;
  border: 1px solid #e8edf6;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
}

.offer-accepted-by-candidate-header,
.offer-accepted-by-candidate-header__title,
.offer-accepted-by-candidate-header__heading,
.offer-accepted-by-candidate-header__actions,
.offer-accepted-by-candidate-progress,
.offer-accepted-by-candidate-progress article,
.offer-accepted-by-candidate-card__head,
.offer-accepted-by-candidate-card__head.is-left,
.offer-accepted-by-candidate-health__heading,
.offer-accepted-by-candidate-health__stats article,
.offer-accepted-by-candidate-notes,
.offer-accepted-by-candidate-footer,
.offer-accepted-by-candidate-footer__left,
.offer-accepted-by-candidate-footer__right,
.offer-accepted-by-candidate-status,
.offer-accepted-by-candidate-recommendation__top {
  display: flex;
  align-items: center;
}

.offer-accepted-by-candidate-header,
.offer-accepted-by-candidate-progress,
.offer-accepted-by-candidate-grid,
.offer-accepted-by-candidate-notes,
.offer-accepted-by-candidate-footer {
  padding: 16px 18px;
}

.offer-accepted-by-candidate-header {
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #edf1f8;
}

.offer-accepted-by-candidate-header__title,
.offer-accepted-by-candidate-header__actions,
.offer-accepted-by-candidate-footer,
.offer-accepted-by-candidate-footer__left,
.offer-accepted-by-candidate-footer__right,
.offer-accepted-by-candidate-notes {
  gap: 12px;
}

.offer-accepted-by-candidate-header__icon,
.offer-accepted-by-candidate-intent__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4b9b;
  background: #fff0f7;
}

.offer-accepted-by-candidate-header__heading {
  margin-bottom: 4px;
}

.offer-accepted-by-candidate-header__heading h2,
.offer-accepted-by-candidate-card h3,
.offer-accepted-by-candidate-card h4,
.offer-accepted-by-candidate-card strong,
.offer-accepted-by-candidate-card b,
.offer-accepted-by-candidate-notes h3 {
  margin: 0;
  color: #1f2c4f;
}

.offer-accepted-by-candidate-header p,
.offer-accepted-by-candidate-card p,
.offer-accepted-by-candidate-card span,
.offer-accepted-by-candidate-card small,
.offer-accepted-by-candidate-card em,
.offer-accepted-by-candidate-notes small {
  margin: 0;
  color: #7d8cab;
}

.offer-accepted-by-candidate-button,
.offer-accepted-by-candidate-close,
.offer-accepted-by-candidate-panel-button {
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

.offer-accepted-by-candidate-close {
  width: 38px;
  padding: 0;
}

.offer-accepted-by-candidate-button.is-link {
  color: #ff2d87;
  background: #fff8fb;
}

.offer-accepted-by-candidate-progress {
  gap: 8px;
  border-bottom: 1px solid #edf1f8;
}

.offer-accepted-by-candidate-progress article {
  gap: 8px;
  color: #a0aac0;
  font-size: 0.72rem;
  font-weight: 700;
}

.offer-accepted-by-candidate-progress article i {
  width: 16px;
  height: 16px;
  border: 1.5px solid #d4dceb;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.offer-accepted-by-candidate-progress article.is-green i,
.offer-accepted-by-candidate-progress article.is-active i {
  background: #16a34a;
  border-color: #16a34a;
}

.offer-accepted-by-candidate-progress article.is-active i {
  background: #ff2d87;
  border-color: #ff2d87;
}

.offer-accepted-by-candidate-progress article.is-green i::after,
.offer-accepted-by-candidate-progress article.is-active i::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
}

.offer-accepted-by-candidate-progress b {
  width: 32px;
  height: 1px;
  background: #e6ecf6;
}

.offer-accepted-by-candidate-grid {
  display: grid;
  gap: 14px;
  align-items: start;
}

.offer-accepted-by-candidate-grid--top {
  grid-template-columns: minmax(0, 1.18fr) 560px;
}

.offer-accepted-by-candidate-grid--middle {
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1fr) minmax(0, 1.02fr);
  padding-top: 0;
}

.offer-accepted-by-candidate-grid--bottom {
  grid-template-columns: minmax(0, 1fr) 270px;
  padding-top: 0;
}

.offer-accepted-by-candidate-grid--last {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding-top: 0;
}

.offer-accepted-by-candidate-card,
.offer-accepted-by-candidate-notes {
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.offer-accepted-by-candidate-card { padding: 16px; }
.offer-accepted-by-candidate-card__head { justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.offer-accepted-by-candidate-card__head.is-left { justify-content: flex-start; }

.offer-accepted-by-candidate-health__hero {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #e4f6ea;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(180deg, #f9fffb 0%, #fff 100%);
}

.offer-accepted-by-candidate-health__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #effcf4;
}

.offer-accepted-by-candidate-health__hero em {
  min-height: 20px;
  margin-top: 6px;
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

.offer-accepted-by-candidate-health__stats {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.offer-accepted-by-candidate-health__stats article,
.offer-accepted-by-candidate-summary article {
  padding: 10px 12px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  display: grid;
  align-content: start;
  gap: 4px;
}

.offer-accepted-by-candidate-insight,
.offer-accepted-by-candidate-note,
.offer-accepted-by-candidate-recommendation {
  margin-top: 12px;
  padding: 12px;
  border-radius: 14px;
}

.offer-accepted-by-candidate-insight,
.offer-accepted-by-candidate-note.is-interpretation {
  border: 1px solid #eee7ff;
  background: #faf8ff;
}

.offer-accepted-by-candidate-summary {
  display: grid;
  gap: 10px;
}

.offer-accepted-by-candidate-summary__candidate {
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.offer-accepted-by-candidate-summary__candidate span {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #3d7a36 0%, #94c973 100%);
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-accepted-by-candidate-summary__candidate em {
  margin-top: 6px;
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

.offer-accepted-by-candidate-summary strong.is-pink { color: #ff2d87; }

.offer-accepted-by-candidate-timeline,
.offer-accepted-by-candidate-breakdown,
.offer-accepted-by-candidate-readiness,
.offer-accepted-by-candidate-list,
.offer-accepted-by-candidate-next {
  display: grid;
  gap: 10px;
}

.offer-accepted-by-candidate-timeline {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px 8px;
}

.offer-accepted-by-candidate-timeline article {
  min-width: 0;
  text-align: center;
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 4px;
}

.offer-accepted-by-candidate-timeline span,
.offer-accepted-by-candidate-readiness span {
  width: 26px;
  height: 26px;
  margin: 0 auto 8px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-accepted-by-candidate-timeline span.is-pink { color: #ff2d87; background: #fff0f7; }
.offer-accepted-by-candidate-timeline span.is-violet { color: #8b5cf6; background: #f3e8ff; }
.offer-accepted-by-candidate-timeline span.is-green,
.offer-accepted-by-candidate-readiness span.is-green { color: #16a34a; background: #effcf4; }
.offer-accepted-by-candidate-readiness span.is-amber { color: #ff8a00; background: #fff5e9; }

.offer-accepted-by-candidate-timeline strong {
  display: block;
  font-size: 0.74rem;
  line-height: 1.35;
}

.offer-accepted-by-candidate-timeline small,
.offer-accepted-by-candidate-timeline em {
  display: block;
  font-size: 0.7rem;
  line-height: 1.25;
  font-style: normal;
}

.offer-accepted-by-candidate-chip-row {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.offer-accepted-by-candidate-chip-row small {
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: #f7f9fc;
}

.offer-accepted-by-candidate-note.is-positive { border: 1px solid #e4f6ea; background: linear-gradient(180deg, #f9fffb 0%, #fff 100%); }
.offer-accepted-by-candidate-note.is-warning { border: 1px solid #ffedd5; background: #fffdf8; }

.offer-accepted-by-candidate-note strong,
.offer-accepted-by-candidate-recommendation strong,
.offer-accepted-by-candidate-sentiment strong { display: block; margin-bottom: 8px; }

.offer-accepted-by-candidate-note ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.offer-accepted-by-candidate-note li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.offer-accepted-by-candidate-note li :deep(svg) { color: #16a34a; }

.offer-accepted-by-candidate-recommendation { border: 1px solid #e4f6ea; background: linear-gradient(180deg, #f9fffb 0%, #fff 100%); }
.offer-accepted-by-candidate-recommendation__top { align-items: flex-start; gap: 10px; }
.offer-accepted-by-candidate-recommendation__top > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #effcf4;
}
.offer-accepted-by-candidate-recommendation__top em {
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

.offer-accepted-by-candidate-breakdown article,
.offer-accepted-by-candidate-status,
.offer-accepted-by-candidate-readiness article {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.offer-accepted-by-candidate-breakdown strong.is-green,
.offer-accepted-by-candidate-status b { color: #16a34a; }
.offer-accepted-by-candidate-status { margin-top: 14px; }
.offer-accepted-by-candidate-status b {
  min-height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: #effcf4;
}

.offer-accepted-by-candidate-next { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.offer-accepted-by-candidate-next article {
  padding: 12px 10px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  text-align: center;
  min-width: 0;
}
.offer-accepted-by-candidate-next article.is-pink { border-color: #ffd6e7; background: #fff8fb; }
.offer-accepted-by-candidate-next article.is-pink strong { color: #ff2d87; }
.offer-accepted-by-candidate-next article.is-green strong { color: #16a34a; }
.offer-accepted-by-candidate-next strong { display: block; margin: 8px 0 4px; }

.offer-accepted-by-candidate-readiness article {
  padding: 10px 12px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  align-items: center;
}

.offer-accepted-by-candidate-readiness article > div {
  flex: 1 1 auto;
}

.offer-accepted-by-candidate-panel-button {
  width: 100%;
  margin-top: 12px;
}

.offer-accepted-by-candidate-panel-button.is-ghost,
.offer-accepted-by-candidate-panel-button.is-wide { margin-top: 10px; }

.offer-accepted-by-candidate-list {
  margin: 12px 0 0;
  padding-left: 18px;
}

.offer-accepted-by-candidate-stars {
  margin: 8px 0;
  display: inline-flex;
  gap: 4px;
  color: #ff2d87;
}

.offer-accepted-by-candidate-sentiment p { min-height: 72px; }

.offer-accepted-by-candidate-notes {
  justify-content: space-between;
  margin: 0 18px 16px;
  padding: 14px;
}

.offer-accepted-by-candidate-footer {
  justify-content: space-between;
  gap: 14px;
  border-top: 1px solid #edf1f8;
}

.offer-accepted-by-candidate-button.is-subtle { color: #6f7fa3; }
.offer-accepted-by-candidate-button.is-danger { color: #ff5a76; background: #fff5f7; }
.offer-accepted-by-candidate-button.is-primary {
  min-width: 110px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff5cab 0%, #ff2d87 45%, #ff4b9b 100%);
}

@media (max-width: 1240px) {
  .offer-accepted-by-candidate-grid--top,
  .offer-accepted-by-candidate-grid--middle,
  .offer-accepted-by-candidate-grid--bottom,
  .offer-accepted-by-candidate-grid--last {
    grid-template-columns: 1fr;
  }

  .offer-accepted-by-candidate-next,
  .offer-accepted-by-candidate-timeline,
  .offer-accepted-by-candidate-health__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .offer-accepted-by-candidate-header,
  .offer-accepted-by-candidate-footer,
  .offer-accepted-by-candidate-footer__left,
  .offer-accepted-by-candidate-footer__right,
  .offer-accepted-by-candidate-notes {
    flex-direction: column;
    align-items: stretch;
  }

  .offer-accepted-by-candidate-progress {
    flex-wrap: wrap;
  }

  .offer-accepted-by-candidate-health__stats,
  .offer-accepted-by-candidate-next,
  .offer-accepted-by-candidate-timeline {
    grid-template-columns: 1fr;
  }

  .offer-accepted-by-candidate-summary__candidate {
    align-items: flex-start;
  }
}
</style>
