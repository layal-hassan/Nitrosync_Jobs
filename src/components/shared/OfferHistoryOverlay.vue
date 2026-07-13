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

const emit = defineEmits(['close', 'view-offer', 'send-reminder', 'withdraw-offer'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MM'
))

const offerRows = [
  { title: 'Offer #2', state: 'Current', status: 'Waiting for Signature', date: 'Sent Jun 2, 2026', owner: 'By Majda R.', tone: 'pink' },
  { title: 'Offer #1', state: 'Withdrawn', status: 'Withdrawn', date: 'May 28, 2026', owner: 'By Majda R.', tone: 'orange' },
  { title: 'Amendment #1', state: 'Draft', status: 'Draft', date: 'May 22, 2026', owner: 'By Majda R.', tone: 'blue' },
  { title: 'Original Offer', state: 'Accepted', status: 'Accepted', date: 'May 20, 2026', owner: 'By Majda R.', tone: 'green' },
]

const comparisonRows = [
  ['Base Salary', '$135,000', '$142,000', '+$7,000'],
  ['Bonus', '—', '10% of base', 'Added'],
  ['Equity (RSU)', '—', '$20,000', 'Added'],
  ['Start Date', 'Jun 10, 2026', 'Jun 16, 2026', '+6 days'],
  ['Reporting Manager', 'Thomas B.', 'Sarah Johnson', 'Changed'],
  ['Employment Type', 'Full-time', 'Full-time', '—'],
]

const documentRows = [
  ['Offer Letter', 'PDF • 4 pages', 'Updated'],
  ['Employment Agreement', 'PDF • 10 pages', 'Updated'],
  ['Benefits Guide', 'PDF • 8 pages', 'Updated'],
  ['NDA', 'PDF • 4 pages', 'Unchanged'],
]

const statusRows = [
  ['Created', 'May 20, 2026'],
  ['Approved', 'May 29, 2026'],
  ['Sent', 'Jun 2, 2026'],
  ['Waiting Signature', ''],
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
    <div v-if="open" class="offer-history-overlay" @click.self="emit('close')">
      <section class="offer-history-modal" @click.stop>
        <header class="offer-history-header">
          <div>
            <div class="offer-history-title">
              <span><AppIcon name="document" :size="14" /></span>
              <strong>Offer History</strong>
            </div>
            <p>Track all offers and amendments for this candidate.</p>
          </div>

          <div class="offer-history-header__actions">
            <button type="button">
              <AppIcon name="document" :size="13" />
              <span>Download all offers</span>
            </button>
            <button type="button" class="offer-history-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="15" />
            </button>
          </div>
        </header>

        <section class="offer-history-summary">
          <article class="offer-history-candidate">
            <span class="offer-history-candidate__avatar">{{ candidateInitials }}</span>
            <div>
              <strong>{{ candidateName }}</strong>
              <small>{{ candidateRole }}</small>
            </div>
          </article>

          <article>
            <span>Department</span>
            <strong>Engineering</strong>
          </article>
          <article>
            <span>Location</span>
            <strong>San Francisco, CA</strong>
          </article>
          <article>
            <span>Employment Type</span>
            <strong>Full-time</strong>
          </article>

          <button type="button" class="offer-history-summary__profile">
            <span>View candidate profile</span>
            <AppIcon name="external-link" :size="12" />
          </button>
        </section>

        <div class="offer-history-layout">
          <aside class="offer-history-list">
            <article
              v-for="item in offerRows"
              :key="item.title"
              class="offer-history-list__item"
              :class="`is-${item.tone}`"
            >
              <span class="offer-history-list__dot" />
              <div>
                <div class="offer-history-list__headline">
                  <strong>{{ item.title }}</strong>
                  <em>{{ item.state }}</em>
                </div>
                <small>{{ item.status }}</small>
                <span>{{ item.date }}</span>
                <span>{{ item.owner }}</span>
              </div>
            </article>

            <button type="button" class="offer-history-list__create">+ Create new offer</button>
          </aside>

          <section class="offer-history-main">
            <article class="offer-history-card">
              <div class="offer-history-card__head">
                <div>
                  <h3>Offer Comparison</h3>
                  <small>Offer #1</small>
                </div>
                <div class="offer-history-card__compare">
                  <strong>Offer #2 (Current)</strong>
                  <button type="button" @click="emit('view-offer')">
                    <span>Offer details</span>
                    <AppIcon name="chevronDown" :size="13" />
                  </button>
                </div>
              </div>

              <div class="offer-history-table">
                <div class="offer-history-table__head">
                  <span>Attribute</span>
                  <span>From (Offer #1)</span>
                  <span>To (Offer #2)</span>
                  <span>Change</span>
                </div>

                <article v-for="item in comparisonRows" :key="item[0]">
                  <strong>{{ item[0] }}</strong>
                  <span>{{ item[1] }}</span>
                  <span>{{ item[2] }}</span>
                  <em>{{ item[3] }}</em>
                </article>
              </div>
            </article>

            <article class="offer-history-card">
              <div class="offer-history-card__section-head">
                <h3>Documents (4)</h3>
                <button type="button">View all</button>
              </div>

              <div class="offer-history-documents">
                <article v-for="item in documentRows" :key="item[0]">
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                  <em>{{ item[2] }}</em>
                </article>
              </div>
            </article>

            <article class="offer-history-card offer-history-ai">
              <div class="offer-history-ai__head">
                <strong>AI Insight</strong>
                <em>High match</em>
              </div>
              <p>This offer shows improved compensation and alignment with market data for similar roles in San Francisco.</p>
              <div class="offer-history-ai__metrics">
                <article>
                  <span>Market Salary</span>
                  <strong>$140K - $155K</strong>
                </article>
                <article>
                  <span>Competitiveness</span>
                  <strong>92%</strong>
                </article>
                <article>
                  <span>Acceptance likelihood</span>
                  <strong>89%</strong>
                </article>
              </div>
            </article>
          </section>

          <aside class="offer-history-side">
            <article class="offer-history-card">
              <div class="offer-history-card__section-head">
                <h3>Current Status</h3>
              </div>

              <div class="offer-history-status">
                <strong>Waiting for Signature</strong>
                <p>The candidate has viewed the offer.</p>
              </div>

              <div class="offer-history-steps">
                <article v-for="item in statusRows" :key="item[0]">
                  <span />
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </article>
              </div>
            </article>

            <article class="offer-history-card">
              <div class="offer-history-actions">
                <button type="button" @click="emit('send-reminder')">
                  <AppIcon name="bell" :size="13" />
                  <span>Send reminder</span>
                </button>
                <button type="button" @click="emit('view-offer')">
                  <AppIcon name="document" :size="13" />
                  <span>View Offer</span>
                </button>
                <button type="button">
                  <AppIcon name="document" :size="13" />
                  <span>Download PDF</span>
                </button>
                <button type="button" class="is-danger" @click="emit('withdraw-offer')">
                  <AppIcon name="close" :size="13" />
                  <span>Withdraw offer</span>
                </button>
                <button type="button">
                  <AppIcon name="edit" :size="13" />
                  <span>Create amendment</span>
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
.offer-history-overlay {
  position: fixed;
  inset: 0;
  z-index: 96;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(10px);
}

.offer-history-modal {
  width: min(1360px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
}

.offer-history-header,
.offer-history-title,
.offer-history-header__actions,
.offer-history-candidate,
.offer-history-summary,
.offer-history-card__head,
.offer-history-card__compare,
.offer-history-card__section-head,
.offer-history-actions button,
.offer-history-ai__head {
  display: flex;
  align-items: center;
}

.offer-history-header,
.offer-history-summary,
.offer-history-layout {
  padding: 18px 22px;
}

.offer-history-header {
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #edf1f8;
}

.offer-history-title {
  gap: 10px;
}

.offer-history-title span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
}

.offer-history-title strong,
.offer-history-card h3,
.offer-history-candidate strong,
.offer-history-table strong,
.offer-history-status strong,
.offer-history-ai strong {
  margin: 0;
  color: #1f2c4f;
}

.offer-history-header p,
.offer-history-summary span,
.offer-history-summary small,
.offer-history-list__item small,
.offer-history-list__item span,
.offer-history-table span,
.offer-history-card small,
.offer-history-status p,
.offer-history-ai p {
  margin: 0;
  color: #7d8cab;
}

.offer-history-header__actions {
  gap: 10px;
}

.offer-history-header__actions button,
.offer-history-card__compare button,
.offer-history-summary__profile,
.offer-history-card__section-head button {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #223251;
  background: #fff;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-history-close {
  width: 36px;
  padding: 0;
  justify-content: center;
}

.offer-history-summary {
  gap: 14px;
  border-bottom: 1px solid #edf1f8;
}

.offer-history-summary > article,
.offer-history-summary__profile {
  min-height: 74px;
  padding: 12px 16px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
}

.offer-history-summary > article {
  min-width: 0;
  flex: 1 1 0;
  display: grid;
  gap: 4px;
}

.offer-history-candidate {
  flex: 1.4 1 0;
  gap: 12px;
}

.offer-history-candidate__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.95rem;
  font-weight: 800;
}

.offer-history-summary__profile {
  justify-content: center;
  color: #ff2d87;
}

.offer-history-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr) 250px;
  gap: 16px;
  align-items: start;
}

.offer-history-list,
.offer-history-main,
.offer-history-side,
.offer-history-documents,
.offer-history-steps,
.offer-history-actions,
.offer-history-ai__metrics {
  display: grid;
  gap: 14px;
}

.offer-history-list__item,
.offer-history-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.offer-history-list__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
}

.offer-history-list__item.is-pink {
  border-color: #ffb8d6;
  box-shadow: inset 0 0 0 1px #ffe2ee;
}

.offer-history-list__dot {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 999px;
  background: #ff2d87;
}

.offer-history-list__item.is-orange .offer-history-list__dot {
  background: #f59e0b;
}

.offer-history-list__item.is-blue .offer-history-list__dot {
  background: #3b82f6;
}

.offer-history-list__item.is-green .offer-history-list__dot {
  background: #16a34a;
}

.offer-history-list__headline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.offer-history-list__headline em {
  padding: 4px 8px;
  border-radius: 999px;
  color: #ff2d87;
  background: #fff1f7;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.offer-history-list__create {
  min-height: 40px;
  border: 1px dashed #d9e1ef;
  border-radius: 14px;
  color: #60708f;
  background: #fff;
  font-size: 0.74rem;
  font-weight: 800;
}

.offer-history-card__head,
.offer-history-card__section-head,
.offer-history-ai__head {
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.offer-history-card__compare {
  gap: 12px;
}

.offer-history-table {
  border: 1px solid #edf1f8;
  border-radius: 14px;
  overflow: hidden;
}

.offer-history-table__head,
.offer-history-table article {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 0.85fr;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
}

.offer-history-table__head {
  background: #fbfcfe;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.offer-history-table article {
  border-top: 1px solid #edf1f8;
}

.offer-history-table article em {
  color: #16a34a;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-history-documents {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.offer-history-documents article {
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  display: grid;
  gap: 4px;
}

.offer-history-documents article em {
  width: fit-content;
  padding: 4px 8px;
  border-radius: 999px;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.offer-history-ai {
  background: linear-gradient(180deg, #fff8fb 0%, #fff 100%);
}

.offer-history-ai__head em {
  padding: 4px 8px;
  border-radius: 999px;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.offer-history-ai__metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 12px;
}

.offer-history-ai__metrics article {
  display: grid;
  gap: 4px;
}

.offer-history-status {
  padding: 14px;
  border: 1px solid #ffdce9;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff4f9 0%, #fff 100%);
}

.offer-history-status strong {
  display: block;
  font-size: 0.94rem;
  font-weight: 800;
}

.offer-history-status p {
  margin-top: 6px;
  font-size: 0.72rem;
}

.offer-history-steps article {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
}

.offer-history-steps article span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #16a34a;
}

.offer-history-steps article:last-child span {
  background: #cbd5e1;
}

.offer-history-actions button {
  justify-content: space-between;
  gap: 10px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  color: #223251;
  background: #fff;
  font-size: 0.74rem;
  font-weight: 700;
}

.offer-history-actions button.is-danger {
  color: #ff2d87;
}

@media (max-width: 1180px) {
  .offer-history-layout {
    grid-template-columns: 1fr;
  }

  .offer-history-documents,
  .offer-history-ai__metrics {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .offer-history-overlay {
    padding: 12px;
  }

  .offer-history-modal {
    width: min(100%, calc(100vw - 24px));
  }

  .offer-history-header,
  .offer-history-summary {
    display: grid;
    grid-template-columns: 1fr;
  }

  .offer-history-documents,
  .offer-history-ai__metrics,
  .offer-history-table__head,
  .offer-history-table article,
  .offer-history-steps article {
    grid-template-columns: 1fr;
  }
}
</style>
