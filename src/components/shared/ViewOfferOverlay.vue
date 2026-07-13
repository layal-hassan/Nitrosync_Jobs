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

const emit = defineEmits(['close', 'withdraw-offer', 'send-reminder', 'contact-candidate'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MM'
))

const candidateFirstName = computed(() => props.candidateName.split(' ')[0] || 'Marvin')
const candidateEmail = computed(() => `${candidateFirstName.value.toLowerCase()}.mckinney@email.com`)
const candidatePhone = '(415) 555-0198'

const summaryRows = [
  ['Department', 'Engineering'],
  ['Level', 'Mid-level'],
  ['Employment Type', 'Full-time'],
  ['Start Date', 'June 16, 2026'],
  ['Reporting Manager', 'Thomas B.'],
  ['Offer Expiry', 'June 13, 2026 (14 days)'],
  ['Work Location', 'San Francisco, CA (On-site)'],
  ['Offer ID', 'OFF-2026-1287'],
]

const compensationRows = [
  ['Base Salary', '$142,000', 'per year', 'green'],
  ['Bonus', '$15,000', '10% of base', 'amber'],
  ['Equity', '$20,000', '(4 years cliff)', 'violet'],
  ['Sign-on Bonus', '$10,000', 'One-time', 'blue'],
  ['Relocation', '$5,000', 'One-time', 'pink'],
]

const employmentRows = [
  ['Probation Period', '3 months'],
  ['Notice Period', '30 days'],
  ['Working Hours', '40 hrs / week'],
  ['Contract Type', 'Permanent'],
  ['Benefits Eligibility', 'Full eligibility'],
]

const documentRows = [
  ['Offer Letter', 'PDF • 4 pages', 'Viewed'],
  ['Employment Agreement', 'PDF • 14 pages', 'Not opened'],
  ['NDA', 'PDF • 4 pages', 'Signed'],
  ['Benefits Guide', 'PDF • 8 pages', 'Viewed'],
]

const signatureRows = [
  ['Viewed', 'Yesterday, 11:18 AM'],
  ['Documents Opened', '3 / 4'],
  ['Offer Expires', 'Jun 13, 2026 (14 days)'],
  ['Reminder', 'Never sent'],
]

const candidateActivityRows = [
  ['Email Opened', 'May 30, 10:40 AM'],
  ['Offer Viewed', 'May 30, 11:18 AM'],
  ['Time on Offer', '6 min'],
  ['Last Activity', 'Yesterday, 11:18 AM'],
]

const timelineRows = [
  ['Created', 'May 28, 2026 • 09:15 AM', 'green'],
  ['Approved', 'May 29, 2026 • 03:44 PM', 'green'],
  ['Sent', 'May 30, 2026 • 10:42 AM', 'pink'],
  ['Viewed', 'Yesterday • 11:18 AM', 'pink'],
  ['Waiting for Signature', 'Pending', 'amber'],
  ['Completed', '—', 'slate'],
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
    <div v-if="open" class="view-offer-overlay" @click.self="emit('close')">
      <section class="view-offer-modal" @click.stop>
        <header class="view-offer-header">
          <div class="view-offer-header__title">
            <span class="view-offer-header__icon">
              <AppIcon name="document" :size="15" />
            </span>
            <strong>View Offer</strong>
          </div>

          <button type="button" class="view-offer-close" aria-label="Close" @click="emit('close')">
            <AppIcon name="close" :size="16" />
          </button>
        </header>

        <section class="view-offer-hero">
          <div class="view-offer-hero__copy">
            <div class="view-offer-hero__headline">
              <h2>Offer #OFF-2026-1287</h2>
              <span>Waiting for Signature</span>
            </div>
            <p>{{ candidateRole }} • Full-time • San Francisco, CA (On-site)</p>
          </div>

          <div class="view-offer-hero__actions">
            <button type="button">
              <AppIcon name="document" :size="13" />
              <span>Download PDF</span>
            </button>
            <button type="button">
              <span>More actions</span>
              <AppIcon name="chevronDown" :size="14" />
            </button>
          </div>
        </section>

        <section class="view-offer-meta">
          <article class="view-offer-meta__candidate">
            <span class="view-offer-meta__avatar">{{ candidateInitials }}</span>
            <div>
              <strong>{{ candidateName }}</strong>
              <small>{{ candidateEmail }}</small>
              <small>{{ candidatePhone }}</small>
              <em>95% AI Match</em>
            </div>
          </article>

          <article>
            <span>Created by</span>
            <strong>Majda R.</strong>
            <small>May 28, 2026</small>
          </article>

          <article>
            <span>Approved by</span>
            <strong>Thomas B.</strong>
            <small>May 29, 2026</small>
          </article>

          <article>
            <span>Current Status</span>
            <strong>Waiting for Signature</strong>
            <small>The offer is awaiting action from {{ candidateFirstName }}.</small>
          </article>

          <article>
            <span>Sent via</span>
            <strong class="view-offer-provider">
              <em>DS</em>
              <span>DocuSign</span>
            </strong>
            <small>May 30, 2026 • 10:42 AM</small>
          </article>
        </section>

        <div class="view-offer-layout">
          <section class="view-offer-main">
            <article class="view-offer-card">
              <div class="view-offer-card__head">
                <span class="view-offer-card__icon is-pink">
                  <AppIcon name="document" :size="13" />
                </span>
                <h3>Offer Summary</h3>
              </div>

              <div class="view-offer-summary-grid">
                <article v-for="item in summaryRows" :key="item[0]">
                  <span>{{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                </article>
              </div>
            </article>

            <article class="view-offer-card">
              <div class="view-offer-card__head">
                <span class="view-offer-card__icon is-green">
                  <AppIcon name="wallet" :size="13" />
                </span>
                <h3>Compensation</h3>
              </div>

              <div class="view-offer-compensation">
                <article v-for="item in compensationRows" :key="item[0]">
                  <span class="view-offer-compensation__label">{{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                  <small>{{ item[2] }}</small>
                </article>
              </div>
            </article>

            <article class="view-offer-card">
              <div class="view-offer-card__head">
                <span class="view-offer-card__icon is-violet">
                  <AppIcon name="briefcase" :size="13" />
                </span>
                <h3>Employment Terms</h3>
              </div>

              <div class="view-offer-summary-grid is-terms">
                <article v-for="item in employmentRows" :key="item[0]">
                  <span>{{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                </article>
              </div>
            </article>

            <article class="view-offer-card">
              <div class="view-offer-card__head">
                <span class="view-offer-card__icon is-blue">
                  <AppIcon name="document" :size="13" />
                </span>
                <h3>Documents (4)</h3>
              </div>

              <div class="view-offer-documents">
                <article v-for="item in documentRows" :key="item[0]">
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                  <em>{{ item[2] }}</em>
                  <button type="button" aria-label="Download document">
                    <AppIcon name="document" :size="12" />
                  </button>
                </article>
              </div>
            </article>
          </section>

          <aside class="view-offer-side">
            <article class="view-offer-card">
              <div class="view-offer-card__head">
                <span class="view-offer-card__icon is-pink">
                  <AppIcon name="edit" :size="13" />
                </span>
                <h3>Signature Status</h3>
              </div>

              <div class="view-offer-signature">
                <strong>Waiting for Signature</strong>
                <p>The offer is awaiting action from {{ candidateFirstName }}.</p>
              </div>

              <div class="view-offer-detail-list">
                <article v-for="item in signatureRows" :key="item[0]">
                  <span>{{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                </article>
              </div>

              <div class="view-offer-detail-list is-activity">
                <h4>Candidate Activity</h4>
                <article v-for="item in candidateActivityRows" :key="item[0]">
                  <span>{{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                </article>
              </div>
            </article>

            <article class="view-offer-card">
              <div class="view-offer-card__head">
                <span class="view-offer-card__icon is-pink">
                  <AppIcon name="clock" :size="13" />
                </span>
                <h3>Offer Timeline</h3>
              </div>

              <div class="view-offer-timeline">
                <article v-for="item in timelineRows" :key="item[0]">
                  <span :class="`is-${item[2]}`" />
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                </article>
              </div>
            </article>

            <article class="view-offer-card">
              <div class="view-offer-card__head">
                <span class="view-offer-card__icon is-pink">
                  <AppIcon name="spark" :size="13" />
                </span>
                <h3>Quick Actions</h3>
              </div>

              <div class="view-offer-actions">
                <button type="button" @click="emit('send-reminder')">
                  <AppIcon name="bell" :size="13" />
                  <span>Send Reminder</span>
                </button>
                <button type="button" @click="emit('contact-candidate')">
                  <AppIcon name="phone" :size="13" />
                  <span>Contact Candidate</span>
                </button>
                <button type="button">
                  <AppIcon name="document" :size="13" />
                  <span>Download PDF</span>
                </button>
                <button type="button" class="is-danger" @click="emit('withdraw-offer')">
                  <AppIcon name="close" :size="13" />
                  <span>Withdraw Offer</span>
                </button>
                <button type="button">
                  <AppIcon name="edit" :size="13" />
                  <span>Create Amendment</span>
                </button>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.view-offer-overlay {
  position: fixed;
  inset: 0;
  z-index: 95;
  padding: 20px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(10px);
}

.view-offer-modal {
  width: min(1320px, calc(100vw - 40px));
  margin: 0 auto;
  border: 1px solid rgba(230, 236, 245, 0.94);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
}

.view-offer-header,
.view-offer-header__title,
.view-offer-hero,
.view-offer-hero__headline,
.view-offer-hero__actions,
.view-offer-card__head,
.view-offer-provider,
.view-offer-actions button {
  display: flex;
  align-items: center;
}

.view-offer-header,
.view-offer-hero,
.view-offer-meta,
.view-offer-layout {
  padding: 18px 22px;
}

.view-offer-header {
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #edf1f8;
}

.view-offer-header__title {
  gap: 10px;
}

.view-offer-header__title strong,
.view-offer-hero__headline h2,
.view-offer-card h3,
.view-offer-signature strong,
.view-offer-timeline strong,
.view-offer-documents strong,
.view-offer-summary-grid strong,
.view-offer-detail-list strong,
.view-offer-meta strong {
  margin: 0;
  color: #1e2b4d;
}

.view-offer-header__icon,
.view-offer-card__icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.view-offer-header__icon,
.view-offer-card__icon.is-pink {
  color: #ff2d87;
  background: #fff1f7;
}

.view-offer-card__icon.is-green {
  color: #16a34a;
  background: #effcf4;
}

.view-offer-card__icon.is-violet {
  color: #6d5cff;
  background: #f1efff;
}

.view-offer-card__icon.is-blue {
  color: #2563eb;
  background: #eef5ff;
}

.view-offer-close,
.view-offer-hero__actions button,
.view-offer-documents button,
.view-offer-actions button {
  border: 1px solid #dfe6f2;
  background: #fff;
}

.view-offer-close {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #60708f;
}

.view-offer-hero {
  justify-content: space-between;
  gap: 18px;
}

.view-offer-hero__headline {
  gap: 10px;
  flex-wrap: wrap;
}

.view-offer-hero__headline h2 {
  font-size: 1.55rem;
  font-weight: 800;
}

.view-offer-hero__headline span {
  padding: 6px 10px;
  border-radius: 999px;
  color: #ff2d87;
  background: #fff1f7;
  font-size: 0.7rem;
  font-weight: 800;
}

.view-offer-hero p,
.view-offer-meta span,
.view-offer-meta small,
.view-offer-summary-grid span,
.view-offer-detail-list span,
.view-offer-detail-list h4,
.view-offer-signature p,
.view-offer-timeline small,
.view-offer-documents small {
  margin: 0;
  color: #7d8cab;
}

.view-offer-hero p {
  margin-top: 8px;
  font-size: 0.82rem;
}

.view-offer-hero__actions {
  gap: 10px;
}

.view-offer-hero__actions button {
  min-height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  gap: 8px;
  color: #223251;
  font-size: 0.72rem;
  font-weight: 800;
}

.view-offer-meta {
  display: grid;
  grid-template-columns: 1.35fr repeat(4, minmax(0, 1fr));
  gap: 0;
}

.view-offer-meta > article {
  min-width: 0;
  padding: 12px 16px;
  border: 1px solid #edf1f8;
  border-left: 0;
  display: grid;
  gap: 5px;
}

.view-offer-meta > article:first-child {
  border-left: 1px solid #edf1f8;
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
}

.view-offer-meta > article:last-child {
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
}

.view-offer-meta__candidate {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
}

.view-offer-meta__avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #25345a 0%, #111827 100%);
  font-size: 1rem;
  font-weight: 800;
}

.view-offer-meta__candidate em {
  width: fit-content;
  padding: 4px 8px;
  border-radius: 999px;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.view-offer-provider {
  gap: 8px;
}

.view-offer-provider em {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #111827;
  font-style: normal;
  font-size: 0.58rem;
  font-weight: 800;
}

.view-offer-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.95fr);
  gap: 16px;
  align-items: start;
}

.view-offer-main,
.view-offer-side,
.view-offer-summary-grid,
.view-offer-compensation,
.view-offer-documents,
.view-offer-detail-list,
.view-offer-timeline,
.view-offer-actions {
  display: grid;
  gap: 14px;
}

.view-offer-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.view-offer-card__head {
  gap: 10px;
  margin-bottom: 14px;
}

.view-offer-summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.view-offer-summary-grid.is-terms {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.view-offer-summary-grid article,
.view-offer-compensation article {
  min-width: 0;
  display: grid;
  gap: 5px;
}

.view-offer-summary-grid span,
.view-offer-compensation__label,
.view-offer-detail-list span {
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.view-offer-summary-grid strong,
.view-offer-compensation strong,
.view-offer-documents strong,
.view-offer-timeline strong,
.view-offer-detail-list strong {
  font-size: 0.82rem;
  font-weight: 800;
}

.view-offer-compensation {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.view-offer-compensation article {
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
}

.view-offer-compensation small,
.view-offer-summary-grid small,
.view-offer-documents small,
.view-offer-timeline small,
.view-offer-detail-list h4,
.view-offer-signature p {
  font-size: 0.72rem;
}

.view-offer-documents article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #edf1f8;
}

.view-offer-documents article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.view-offer-documents article > div {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.view-offer-documents strong,
.view-offer-documents small {
  display: block;
}

.view-offer-documents em {
  padding: 5px 9px;
  border-radius: 999px;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.66rem;
  font-weight: 800;
}

.view-offer-documents button {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #60708f;
}

.view-offer-signature {
  padding: 14px;
  border: 1px solid #ffd7e8;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff4f9 0%, #fff 100%);
}

.view-offer-signature strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 800;
}

.view-offer-signature p {
  margin-top: 6px;
  line-height: 1.45;
}

.view-offer-detail-list h4 {
  color: #ff2d87;
  font-weight: 800;
}

.view-offer-detail-list article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.view-offer-timeline article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  padding: 10px 0;
  border-bottom: 1px solid #edf1f8;
}

.view-offer-timeline article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.view-offer-timeline article > div {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.view-offer-timeline strong,
.view-offer-timeline small {
  display: block;
}

.view-offer-timeline span {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 999px;
  display: inline-block;
}

.view-offer-timeline span.is-green {
  background: #16a34a;
}

.view-offer-timeline span.is-pink {
  background: #ff2d87;
}

.view-offer-timeline span.is-amber {
  background: #f59e0b;
}

.view-offer-timeline span.is-slate {
  background: #cbd5e1;
}

.view-offer-actions button {
  justify-content: space-between;
  gap: 10px;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  color: #223251;
  font-size: 0.74rem;
  font-weight: 700;
}

.view-offer-actions button.is-danger {
  color: #ff2d87;
}

@media (max-width: 1180px) {
  .view-offer-meta,
  .view-offer-summary-grid,
  .view-offer-summary-grid.is-terms,
  .view-offer-compensation,
  .view-offer-layout {
    grid-template-columns: 1fr 1fr;
  }

  .view-offer-meta__candidate {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .view-offer-overlay {
    padding: 12px;
  }

  .view-offer-modal {
    width: min(100%, calc(100vw - 24px));
  }

  .view-offer-header,
  .view-offer-hero,
  .view-offer-layout,
  .view-offer-meta,
  .view-offer-summary-grid,
  .view-offer-summary-grid.is-terms,
  .view-offer-compensation {
    grid-template-columns: 1fr;
    display: grid;
  }

  .view-offer-hero__actions {
    flex-wrap: wrap;
  }

  .view-offer-hero__actions button {
    width: 100%;
    justify-content: center;
  }

  .view-offer-meta > article {
    border-left: 1px solid #edf1f8;
    border-radius: 14px;
  }

  .view-offer-documents article,
  .view-offer-detail-list article {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .view-offer-documents button,
  .view-offer-actions button {
    width: 100%;
  }
}
</style>
