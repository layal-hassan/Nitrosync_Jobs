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

const emit = defineEmits(['back', 'open-source', 'open-review-ai-offer', 'open-offer-package', 'open-review-send'])

const job = computed(() => getJobById(props.jobId))
const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const detailsRows = [
  ['1. Compensation', 'Salary, bonus, equity and benefits', '$145,000 base', '750 RSUs', 'No bonus', 'AI Modified', 'pink', 'wallet'],
  ['2. Employment', 'Role, department and work details', 'Senior Frontend Developer', 'Engineering', 'Full-time • Reports to Sarah Johnson', 'Completed', 'green', 'briefcase'],
  ['3. Start & Duration', 'Start date, probation and work schedule', 'Start date: June 16, 2025', 'Probation: 3 months', 'Working hours: Full-time • Remote: Hybrid', 'Completed', 'green', 'calendar'],
  ['4. Compensation Extras', 'Allowances, perks and reimbursements', 'Internet allowance', 'Gym membership', 'Relocation support', 'Completed', 'green', 'gift'],
  ['5. Attachments', 'Documents to be included in the offer', '6 documents', 'PDF • DOC • XLS', '+2', 'Completed', 'green', 'document'],
  ['6. Candidate Experience', 'Personalization and candidate experience', 'Personal message', 'Welcome video', 'Hiring manager note • Onboarding intro', 'Needs review', 'orange', 'heart'],
]

const summaryRows = [
  ['Total Annual Compensation', '$165,000'],
  ['AI Confidence', '95%'],
  ['Est. Acceptance', '94%'],
]

const healthRows = [
  ['Acceptance prediction', '94%'],
  ['Market competitiveness', 'P62'],
  ['Budget status', 'Approved'],
  ['Compliance check', 'Passed'],
  ['Approval workflow', '3 approvers'],
]
</script>

<template>
  <main class="offer-details-page" @click.self="emit('back')">
    <section class="offer-details-shell">
      <header class="offer-details-card offer-details-header">
        <div class="offer-details-header__top">
          <div class="offer-details-header__title">
            <button class="offer-details-back-icon" type="button" @click="emit('open-source')" aria-label="Back">
              <AppIcon name="chevronLeft" :size="16" />
            </button>
            <div>
              <h1>Create Offer</h1>
            </div>
          </div>

          <div class="offer-details-header__actions">
            <button class="offer-details-save-top" type="button">Save draft</button>
            <button class="offer-details-close" type="button" aria-label="Close" @click="emit('back')">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </div>

        <div class="offer-details-stepper">
          <button class="offer-details-step is-done" type="button" @click="emit('open-source')">
            <span><AppIcon name="checkCircle" :size="13" /></span>
            <div>
              <strong>Template</strong>
              <small>Senior Frontend Engineer</small>
            </div>
          </button>
          <div class="offer-details-step-line" />
          <button class="offer-details-step is-done" type="button" @click="emit('open-source')">
            <span><AppIcon name="checkCircle" :size="13" /></span>
            <div>
              <strong>AI Mapping</strong>
              <small>97% match</small>
            </div>
          </button>
          <div class="offer-details-step-line" />
          <button class="offer-details-step is-done" type="button" @click="emit('open-review-ai-offer')">
            <span><AppIcon name="checkCircle" :size="13" /></span>
            <div>
              <strong>Review &amp; Edit</strong>
              <small>8 sections</small>
            </div>
          </button>
          <div class="offer-details-step-line" />
          <div class="offer-details-step is-active">
            <span>4</span>
            <div>
              <strong>Offer Details</strong>
              <small>Configure offer details</small>
            </div>
          </div>
          <div class="offer-details-step-line" />
          <button class="offer-details-step" type="button" @click="emit('open-offer-package')">
            <span>5</span>
            <div>
              <strong>Offer Package</strong>
              <small>Documents &amp; experience</small>
            </div>
          </button>
          <div class="offer-details-step-line" />
          <button class="offer-details-step" type="button" @click="emit('open-review-send')">
            <span>6</span>
            <div>
              <strong>Review &amp; Send</strong>
              <small>Final review</small>
            </div>
          </button>
        </div>
      </header>

      <div class="offer-details-main">
        <section class="offer-details-left">
          <article class="offer-details-card offer-details-intro">
            <div class="offer-details-intro__mark">
              <AppIcon name="document" :size="20" />
            </div>
            <div>
              <h2>Offer Details</h2>
              <p>Review and complete the details of the offer. Most fields are pre-filled by AI and can be updated.</p>
            </div>
          </article>

          <article class="offer-details-card offer-details-list-card">
            <div class="offer-details-ai-strip">
              <div class="offer-details-ai-strip__title">
                <AppIcon name="sparkles" :size="14" />
                <strong>AI Generated</strong>
              </div>
              <div class="offer-details-ai-strip__metrics">
                <div><strong>8</strong><small>Sections</small></div>
                <div><strong>7</strong><small>Completed</small></div>
                <div><strong>1</strong><small>Needs review</small></div>
                <div><strong>~2 min</strong><small>Review time</small></div>
              </div>
            </div>

            <div class="offer-details-list">
              <article v-for="row in detailsRows" :key="row[0]" class="offer-details-row">
                <div class="offer-details-row__left">
                  <span class="offer-details-row__icon" :class="`is-${row[6]}`">
                    <AppIcon :name="row[7]" :size="16" />
                  </span>
                  <div class="offer-details-row__copy">
                    <strong>{{ row[0] }}</strong>
                    <small>{{ row[1] }}</small>
                  </div>
                </div>

                <div class="offer-details-row__meta">
                  <span>{{ row[2] }}</span>
                  <span>{{ row[3] }}</span>
                  <span>{{ row[4] }}</span>
                </div>

                <div class="offer-details-row__actions">
                  <button type="button" aria-label="Edit section">
                    <AppIcon name="edit" :size="14" />
                  </button>
                  <em :class="`is-${row[6]}`">{{ row[5] }}</em>
                  <button type="button" aria-label="Expand section">
                    <AppIcon name="chevronDown" :size="16" />
                  </button>
                </div>
              </article>
            </div>

            <div class="offer-details-recommendation">
              <div class="offer-details-recommendation__title">
                <AppIcon name="sparkles" :size="14" />
                <strong>AI Recommendation</strong>
                <em>New</em>
              </div>
              <p>We increased the salary by $3,000 and equity by 250 RSUs based on interview performance.</p>
              <button type="button">
                <span>View reasoning</span>
                <AppIcon name="chevronRight" :size="14" />
              </button>
            </div>
          </article>
        </section>

        <aside class="offer-details-side">
          <article class="offer-details-card offer-details-summary">
            <small>Offer Summary</small>
            <div class="offer-details-summary__head">
              <div class="offer-details-avatar">{{ candidateInitials }}</div>
              <div>
                <strong>{{ candidateName }}</strong>
                <span>{{ candidateRole }}</span>
                <em>{{ job.location }} • Full-time</em>
              </div>
            </div>

            <div class="offer-details-summary__panel">
              <span>{{ summaryRows[0][0] }}</span>
              <strong>{{ summaryRows[0][1] }}</strong>
              <small>$145,000 base + $20,000 equity value</small>
              <div class="offer-details-summary__market">
                <strong>P62</strong>
                <span>Market Position</span>
              </div>
            </div>

            <div class="offer-details-summary__footer">
              <span>{{ summaryRows[1][0] }} <strong>{{ summaryRows[1][1] }}</strong></span>
              <i />
              <span>{{ summaryRows[2][0] }} <strong>{{ summaryRows[2][1] }}</strong></span>
            </div>
          </article>

          <article class="offer-details-card offer-details-health">
            <h3>Offer Health</h3>
            <div class="offer-details-health__list">
              <div v-for="row in healthRows" :key="row[0]">
                <span>{{ row[0] }}</span>
                <strong>{{ row[1] }}</strong>
              </div>
            </div>
          </article>

          <article class="offer-details-card offer-details-help">
            <small>Need help?</small>
            <p>Ask Nitro AI anything about this offer.</p>
            <button type="button">
              <AppIcon name="sparkles" :size="14" />
              <span>Ask Nitro AI</span>
            </button>
          </article>
        </aside>
      </div>

      <footer class="offer-details-footer">
        <button class="offer-details-button" type="button" @click="emit('open-source')">Back</button>
        <div class="offer-details-footer__end">
          <button class="offer-details-button" type="button">Save draft</button>
          <button class="offer-details-button is-primary" type="button" @click="emit('open-offer-package')">
            <span>Continue to Offer Package</span>
            <AppIcon name="chevronRight" :size="15" />
          </button>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.offer-details-page {
  position: fixed;
  inset: 0;
  z-index: 50;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 27, 45, 0.34);
  backdrop-filter: blur(10px);
}

.offer-details-shell {
  width: min(1840px, calc(100vw - 36px));
  max-height: calc(100vh - 36px);
  overflow: auto;
  padding: 18px;
  border: 1px solid rgba(233, 239, 247, 0.92);
  border-radius: 30px;
  background:
    radial-gradient(circle at top, rgba(255, 110, 173, 0.08), transparent 36%),
    #fff;
  box-shadow: 0 28px 80px rgba(16, 24, 40, 0.22);
  display: grid;
  gap: 20px;
}

.offer-details-card {
  border: 1px solid #ebeff7;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 20px 60px rgba(255, 46, 135, 0.06);
}

.offer-details-header {
  padding: 16px 18px;
}

.offer-details-header__top,
.offer-details-header__title,
.offer-details-header__actions,
.offer-details-stepper,
.offer-details-step,
.offer-details-main,
.offer-details-intro,
.offer-details-ai-strip,
.offer-details-ai-strip__title,
.offer-details-ai-strip__metrics,
.offer-details-row,
.offer-details-row__left,
.offer-details-row__meta,
.offer-details-row__actions,
.offer-details-recommendation__title,
.offer-details-summary__head,
.offer-details-summary__footer,
.offer-details-help button,
.offer-details-footer,
.offer-details-footer__end,
.offer-details-button {
  display: flex;
  align-items: center;
}

.offer-details-header__top {
  justify-content: space-between;
  gap: 16px;
}

.offer-details-header__title {
  gap: 12px;
  color: #1d2b49;
}

.offer-details-back-icon,
.offer-details-close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #7f8ea5;
}

.offer-details-header h1,
.offer-details-intro h2,
.offer-details-health h3 {
  margin: 0;
  color: #1d2b49;
  font-size: 1.05rem;
  font-weight: 800;
}

.offer-details-save-top {
  min-height: 40px;
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  padding: 0 16px;
  background: #fff;
  color: #1d2b49;
  font-weight: 700;
}

.offer-details-stepper {
  margin-top: 14px;
  gap: 12px;
  overflow-x: auto;
}

.offer-details-step {
  min-width: max-content;
  padding: 0;
  border: 0;
  background: transparent;
  gap: 10px;
  color: #97a4ba;
  text-align: left;
}

.offer-details-step span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9e2ef;
  background: #fff;
  font-size: 0.84rem;
  font-weight: 800;
}

.offer-details-step strong {
  display: block;
  font-size: 0.84rem;
  font-weight: 800;
}

.offer-details-step small {
  display: block;
  margin-top: 2px;
  font-size: 0.68rem;
  color: #97a4ba;
}

.offer-details-step.is-done span {
  border-color: #ffd2e4;
  color: #ff2d87;
  background: #fff2f8;
}

.offer-details-step.is-active {
  color: #ff2d87;
}

.offer-details-step.is-active span {
  border-color: transparent;
  background: linear-gradient(135deg, #ff3f98 0%, #ff1f7c 100%);
  color: #fff;
}

.offer-details-step-line {
  width: 38px;
  height: 1px;
  background: #dfe6f1;
  flex: 0 0 auto;
}

.offer-details-main {
  align-items: flex-start;
  gap: 20px;
}

.offer-details-left {
  flex: 1 1 auto;
  min-width: 0;
  display: grid;
  gap: 18px;
}

.offer-details-side {
  width: 344px;
  max-width: 100%;
  display: grid;
  gap: 18px;
}

.offer-details-intro {
  gap: 14px;
  padding: 14px 18px;
}

.offer-details-intro__mark {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: linear-gradient(180deg, #fff1f7 0%, #fff 100%);
}

.offer-details-intro p,
.offer-details-help p {
  margin: 6px 0 0;
  color: #8694ab;
  font-size: 0.88rem;
  line-height: 1.6;
}

.offer-details-list-card {
  padding: 16px 18px 18px;
}

.offer-details-ai-strip {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  border: 1px solid #eceff8;
  border-radius: 18px;
  padding: 14px 16px;
  background: linear-gradient(180deg, rgba(255, 245, 250, 0.9), #fff);
}

.offer-details-ai-strip__title {
  gap: 8px;
  color: #7b68ff;
}

.offer-details-ai-strip__title strong {
  color: #7b68ff;
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-details-ai-strip__metrics {
  gap: 20px;
}

.offer-details-ai-strip__metrics div strong {
  display: block;
  color: #1d2b49;
  font-size: 1.02rem;
  font-weight: 800;
}

.offer-details-ai-strip__metrics div small {
  display: block;
  margin-top: 3px;
  color: #97a4ba;
  font-size: 0.7rem;
}

.offer-details-list {
  display: grid;
  gap: 10px;
}

.offer-details-row {
  justify-content: space-between;
  gap: 14px;
  border: 1px solid #ecf0f8;
  border-radius: 18px;
  padding: 14px 16px;
}

.offer-details-row__left {
  width: 260px;
  max-width: 100%;
  gap: 12px;
}

.offer-details-row__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.offer-details-row__icon.is-pink {
  color: #ff2d87;
  background: #fff1f7;
}

.offer-details-row__icon.is-green {
  color: #17b26a;
  background: #ebfaf2;
}

.offer-details-row__icon.is-orange {
  color: #ff9d1e;
  background: #fff5e8;
}

.offer-details-row__copy strong {
  display: block;
  color: #1d2b49;
  font-size: 0.93rem;
  font-weight: 800;
}

.offer-details-row__copy small,
.offer-details-summary small,
.offer-details-summary span,
.offer-details-summary em,
.offer-details-help small {
  color: #95a2b8;
  font-size: 0.74rem;
}

.offer-details-row__copy small {
  display: block;
  margin-top: 4px;
}

.offer-details-row__meta {
  flex: 1 1 auto;
  min-width: 0;
  gap: 14px;
  justify-content: flex-start;
  color: #5f6f89;
  font-size: 0.78rem;
  flex-wrap: wrap;
}

.offer-details-row__meta span {
  white-space: nowrap;
}

.offer-details-row__actions {
  gap: 10px;
}

.offer-details-row__actions button {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #8190a7;
}

.offer-details-row__actions em {
  min-height: 24px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  font-style: normal;
  font-size: 0.7rem;
  font-weight: 800;
}

.offer-details-row__actions em.is-pink {
  color: #ff2d87;
  background: #fff1f7;
}

.offer-details-row__actions em.is-green {
  color: #17b26a;
  background: #ebfaf2;
}

.offer-details-row__actions em.is-orange {
  color: #ff9d1e;
  background: #fff5e8;
}

.offer-details-recommendation {
  margin-top: 16px;
  border-radius: 18px;
  padding: 16px;
  background: linear-gradient(180deg, rgba(245, 242, 255, 0.85), #fff);
}

.offer-details-recommendation__title {
  gap: 8px;
  color: #7b68ff;
}

.offer-details-recommendation__title strong {
  color: #1d2b49;
  font-size: 0.86rem;
  font-weight: 800;
}

.offer-details-recommendation__title em {
  min-height: 22px;
  border-radius: 999px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  font-style: normal;
  color: #7b68ff;
  background: #f1eeff;
  font-size: 0.68rem;
  font-weight: 800;
}

.offer-details-recommendation p {
  margin: 10px 0 0;
  color: #6e7c93;
  font-size: 0.82rem;
}

.offer-details-recommendation button {
  margin-top: 12px;
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #695cff;
  background: transparent;
  font-weight: 800;
}

.offer-details-summary,
.offer-details-health,
.offer-details-help {
  padding: 18px;
}

.offer-details-summary > small {
  display: block;
  color: #ff2d87;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.offer-details-summary__head {
  gap: 12px;
  margin-top: 12px;
}

.offer-details-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffe0ba 0%, #ffc781 100%);
  color: #5a3712;
  font-size: 1rem;
  font-weight: 800;
}

.offer-details-summary__head strong {
  display: block;
  color: #1d2b49;
  font-size: 1rem;
  font-weight: 800;
}

.offer-details-summary__head span,
.offer-details-summary__head em {
  display: block;
  margin-top: 4px;
  font-style: normal;
}

.offer-details-summary__panel {
  position: relative;
  margin-top: 18px;
  border-radius: 18px;
  padding: 16px 126px 16px 16px;
  border: 1px solid #f3ddea;
  background: linear-gradient(180deg, rgba(255, 248, 251, 0.92), #fff);
}

.offer-details-summary__panel span {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
}

.offer-details-summary__panel strong {
  display: block;
  margin-top: 4px;
  color: #ff2d87;
  font-size: 2.05rem;
  font-weight: 800;
}

.offer-details-summary__panel small {
  display: block;
  margin-top: 6px;
}

.offer-details-summary__market {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 94px;
  min-height: 94px;
  border-radius: 22px;
  border: 1px solid #ffd4e5;
  padding: 12px 10px;
  display: grid;
  align-content: center;
  justify-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.88);
}

.offer-details-summary__market strong {
  margin: 0;
  color: #6e56ff;
  font-size: 1.15rem;
}

.offer-details-summary__market span {
  margin-top: 4px;
  color: #7f8ea4;
  font-size: 0.68rem;
  line-height: 1.35;
}

.offer-details-summary__footer {
  gap: 10px;
  margin-top: 14px;
}

.offer-details-summary__footer strong {
  color: #ff2d87;
}

.offer-details-summary__footer i {
  width: 1px;
  height: 12px;
  background: #dbe4ef;
}

.offer-details-health__list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.offer-details-health__list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.offer-details-health__list span {
  color: #7f8ea4;
  font-size: 0.78rem;
}

.offer-details-health__list strong {
  color: #16a665;
  font-size: 0.8rem;
  font-weight: 800;
}

.offer-details-help button {
  width: 100%;
  min-height: 46px;
  margin-top: 12px;
  justify-content: center;
  gap: 8px;
  border: 1px solid #e8ddff;
  border-radius: 14px;
  background: #fff;
  color: #7b68ff;
  font-weight: 800;
}

.offer-details-footer {
  justify-content: space-between;
  gap: 16px;
}

.offer-details-footer__end {
  gap: 12px;
  margin-left: auto;
}

.offer-details-button {
  min-height: 46px;
  border: 0;
  border-radius: 14px;
  padding: 0 18px;
  background: #fff;
  color: #1d2b49;
  box-shadow: inset 0 0 0 1px #dde5f1;
  font-weight: 800;
  gap: 8px;
}

.offer-details-button.is-primary {
  color: #fff;
  background: linear-gradient(135deg, #ff3f98 0%, #ff1f7c 100%);
  box-shadow: 0 18px 36px rgba(255, 46, 135, 0.22);
}

@media (max-width: 1180px) {
  .offer-details-main {
    display: grid;
    grid-template-columns: 1fr;
  }

  .offer-details-side {
    width: 100%;
  }

  .offer-details-ai-strip,
  .offer-details-row {
    display: grid;
    grid-template-columns: 1fr;
    align-items: start;
  }
}

@media (max-width: 840px) {
  .offer-details-page {
    padding: 12px;
  }

  .offer-details-shell {
    width: min(100vw - 24px, 1840px);
    max-height: calc(100vh - 24px);
    padding: 14px;
  }

  .offer-details-footer,
  .offer-details-footer__end {
    display: grid;
    grid-template-columns: 1fr;
  }

  .offer-details-button,
  .offer-details-save-top {
    width: 100%;
    justify-content: center;
  }
}
</style>
