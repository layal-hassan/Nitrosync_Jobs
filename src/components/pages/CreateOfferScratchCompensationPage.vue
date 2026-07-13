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

const roleLocation = computed(() => {
  if (job.value.location === 'Hybrid') {
    return 'San Francisco, CA (Hybrid)'
  }

  if (job.value.location === 'On-site') {
    return 'New York, NY (On-site)'
  }

  if (job.value.location === 'Remote') {
    return 'Remote, United States'
  }

  return `${job.value.location}, United States`
})

const offerSteps = [
  ['Offer Foundation', 'Basic information'],
  ['Compensation', 'Salary, bonus, equity'],
  ['Benefits & Terms', 'Benefits and conditions'],
  ['AI Review', 'Offer intelligence'],
  ['Offer Package', 'Documents & experience'],
  ['Final Review', 'Review before launch'],
  ['Launch', 'Send offer'],
]

const compensationRows = [
  {
    title: 'Base Salary',
    subtitle: 'Annual pay',
    badge: 'Recommended',
    icon: 'wallet',
    tone: 'pink',
    recommendation: '$142,000',
    meta: 'P62',
    range: 'Market Range: $132,000 - $152,000',
    offer: '$145,000',
    fieldType: 'text',
  },
  {
    title: 'Annual Bonus',
    subtitle: 'Performance based',
    badge: 'Recommended',
    icon: 'chart-bars',
    tone: 'violet',
    recommendation: '12%',
    meta: 'P60',
    range: 'Market Range: 8% - 15%',
    offer: '12%',
    fieldType: 'select',
  },
  {
    title: 'Equity (RSUs)',
    subtitle: '4-year vesting',
    badge: 'Recommended',
    icon: 'trend-up',
    tone: 'mint',
    recommendation: '750 RSUs',
    meta: 'P55',
    range: 'Market Range: 500 - 1,000 RSUs',
    offer: '750 RSUs',
    fieldType: 'select',
  },
  {
    title: 'Signing Bonus',
    subtitle: 'One-time payment',
    badge: 'Optional',
    icon: 'gift',
    tone: 'orange',
    recommendation: '$10,000',
    meta: '',
    range: 'Market Range: $5,000 - $15,000',
    offer: '$10,000',
    fieldType: 'text',
  },
  {
    title: 'Relocation Package',
    subtitle: 'Relocation support',
    badge: 'Optional',
    icon: 'mapPin',
    tone: 'blue',
    recommendation: '$5,000',
    meta: '',
    range: 'Market Range: $0 - $10,000',
    offer: '$5,000',
    fieldType: 'select',
  },
]

const healthRows = [
  ['Market competitive', 'P62'],
  ['Internal equity', 'Aligned'],
  ['Budget check', 'Approved'],
  ['Acceptance prediction', 'High (94%)'],
]

const benefitsHref = computed(() => {
  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'scratch-benefits',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  return `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
})
</script>

<template>
  <main class="offer-comp-page">
    <section class="offer-comp-shell">
      <header class="offer-comp-header">
        <div class="offer-comp-header__copy">
          <div class="offer-comp-breadcrumb">Offers <span>&gt;</span> Create Offer</div>
          <div class="offer-comp-header__title">
            <h1>Create Offer from Scratch</h1>
            <AppIcon name="sparkles" :size="17" />
          </div>
          <p>Step 2 of 7 - Configure compensation</p>
        </div>

        <div class="offer-comp-header__actions">
          <button class="offer-comp-save" type="button">
            <AppIcon name="document" :size="14" />
            <span>Save draft</span>
          </button>

          <button class="offer-comp-close" type="button" aria-label="Close" @click="emit('back')">
            <AppIcon name="close" :size="18" />
          </button>
        </div>
      </header>

      <nav class="offer-comp-stepper">
        <button
          type="button"
          class="offer-comp-step is-done"
          @click="emit('open-source')"
        >
          <span><AppIcon name="checkCircle" :size="13" /></span>
          <div>
            <strong>{{ offerSteps[0][0] }}</strong>
            <small>{{ offerSteps[0][1] }}</small>
          </div>
        </button>

        <i class="offer-comp-stepper__line" />

        <div class="offer-comp-step is-active">
          <span>2</span>
          <div>
            <strong>{{ offerSteps[1][0] }}</strong>
            <small>{{ offerSteps[1][1] }}</small>
          </div>
        </div>

        <i class="offer-comp-stepper__line" />

        <div
          v-for="(step, index) in offerSteps.slice(2)"
          :key="step[0]"
          class="offer-comp-step"
        >
          <span>{{ index + 3 }}</span>
          <div>
            <strong>{{ step[0] }}</strong>
            <small>{{ step[1] }}</small>
          </div>
        </div>
      </nav>

      <section class="offer-comp-layout">
        <section class="offer-comp-main">
          <article class="offer-comp-card offer-comp-builder">
            <div class="offer-comp-builder__head">
              <div>
                <h2>Compensation Builder</h2>
                <p>Nitro AI has analyzed market data and internal equity to recommend a competitive offer.</p>
              </div>

              <button type="button" class="offer-comp-builder__recalc">
                <AppIcon name="sparkles" :size="14" />
                <span>Recalculate with AI</span>
              </button>
            </div>

            <div class="offer-comp-list">
              <article
                v-for="item in compensationRows"
                :key="item.title"
                class="offer-comp-row"
              >
                <div class="offer-comp-row__identity">
                  <span class="offer-comp-row__icon" :class="`is-${item.tone}`">
                    <AppIcon :name="item.icon" :size="18" />
                  </span>

                  <div class="offer-comp-row__copy">
                    <div class="offer-comp-row__title">
                      <strong>{{ item.title }}</strong>
                      <em>{{ item.badge }}</em>
                    </div>
                    <small>{{ item.subtitle }}</small>
                  </div>
                </div>

                <div class="offer-comp-row__recommendation">
                  <small>AI Recommendation</small>
                  <div class="offer-comp-row__value">
                    <strong>{{ item.recommendation }}</strong>
                    <em v-if="item.meta">{{ item.meta }}</em>
                  </div>
                  <span>{{ item.range }}</span>
                </div>

                <div class="offer-comp-row__offer">
                  <small>Your Offer</small>
                  <button type="button" class="offer-comp-input">
                    <strong>{{ item.offer }}</strong>
                    <AppIcon v-if="item.fieldType === 'select'" name="chevronDown" :size="15" />
                    <AppIcon v-else name="edit" :size="14" />
                  </button>
                </div>

                <div class="offer-comp-row__actions">
                  <button type="button" class="is-primary">Accept</button>
                  <button type="button">Modify</button>
                  <button type="button">Skip</button>
                </div>
              </article>
            </div>

            <button type="button" class="offer-comp-add-more">
              <AppIcon name="plus" :size="16" />
              <div>
                <strong>Add other compensation</strong>
                <small>Car allowance, stock options, performance incentives and more.</small>
              </div>
            </button>

            <div class="offer-comp-note">
              <div>
                <AppIcon name="info" :size="14" />
                <span>AI recommendations are based on market data, company equity and candidate profile.</span>
              </div>
              <button type="button">Learn more</button>
            </div>
          </article>
        </section>

        <aside class="offer-comp-side">
          <article class="offer-comp-card offer-comp-summary">
            <div class="offer-comp-summary__head">
              <strong>Offer Summary</strong>
              <button type="button">Edit</button>
            </div>

            <div class="offer-comp-summary__candidate">
              <span class="offer-comp-summary__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <small>{{ candidateRole }}</small>
                <small>{{ job.department }} <span>&bull;</span> Full-time</small>
                <small>{{ roleLocation }}</small>
              </div>
            </div>

            <div class="offer-comp-summary__package">
              <div>
                <small>Total Annual Compensation</small>
                <strong>$165,000</strong>
                <span>$145,000 base + $20,000 variable</span>
              </div>

              <div class="offer-comp-summary__badge">
                <strong>P62</strong>
                <small>Market Position</small>
              </div>
            </div>
          </article>

          <article class="offer-comp-card offer-comp-health">
            <div class="offer-comp-health__top">
              <div class="offer-comp-health__ring">
                <div>
                  <strong>94%</strong>
                </div>
              </div>

              <div class="offer-comp-health__copy">
                <strong>Excellent</strong>
                <p>This offer is competitive and aligned with your compensation philosophy.</p>
              </div>
            </div>

            <div class="offer-comp-health__list">
              <article v-for="row in healthRows" :key="row[0]">
                <span>
                  <AppIcon name="checkCircle" :size="14" />
                  {{ row[0] }}
                </span>
                <strong>{{ row[1] }}</strong>
                <AppIcon name="chevronRight" :size="14" />
              </article>
            </div>
          </article>

          <article class="offer-comp-card offer-comp-insight">
            <div class="offer-comp-insight__title">
              <AppIcon name="sparkles" :size="15" />
              <strong>AI Insight</strong>
            </div>

            <p>Increasing base salary by $3,000 could improve acceptance prediction from 94% to 97%.</p>

            <button type="button">
              <AppIcon name="trend-up" :size="14" />
              <span>Apply $3,000 increase</span>
            </button>
          </article>
        </aside>
      </section>

      <footer class="offer-comp-footer">
        <button type="button" class="offer-comp-footer__button" @click="emit('open-source')">Back</button>

        <div class="offer-comp-footer__actions">
          <button type="button" class="offer-comp-footer__button">Save draft</button>
          <a class="offer-comp-footer__button is-primary" :href="benefitsHref">
            <span>Continue</span>
            <AppIcon name="chevronRight" :size="15" />
          </a>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.offer-comp-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(255, 77, 155, 0.1), transparent 24%),
    linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.offer-comp-shell {
  width: min(100%, 1800px);
  margin: 0 auto;
  padding: 18px 20px 22px;
}

.offer-comp-card,
.offer-comp-header,
.offer-comp-stepper {
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 36px rgba(255, 76, 146, 0.06);
}

.offer-comp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
}

.offer-comp-breadcrumb {
  color: #96a2b6;
  font-size: 0.78rem;
  font-weight: 700;
}

.offer-comp-breadcrumb span {
  padding: 0 6px;
}

.offer-comp-header__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  color: #ff3a95;
}

.offer-comp-header__title h1,
.offer-comp-builder h2,
.offer-comp-summary__head strong,
.offer-comp-health__copy strong,
.offer-comp-insight__title strong {
  margin: 0;
  color: #1c2b4a;
  font-weight: 800;
}

.offer-comp-header__title h1 {
  font-size: 2.2rem;
  line-height: 1.04;
}

.offer-comp-header__copy p,
.offer-comp-builder__head p,
.offer-comp-health__copy p,
.offer-comp-insight p {
  margin: 6px 0 0;
  color: #8490a8;
  font-size: 0.9rem;
  line-height: 1.55;
}

.offer-comp-header__actions,
.offer-comp-save,
.offer-comp-builder__head,
.offer-comp-builder__recalc,
.offer-comp-row__identity,
.offer-comp-row__title,
.offer-comp-row__actions,
.offer-comp-note,
.offer-comp-note > div,
.offer-comp-summary__head,
.offer-comp-summary__candidate,
.offer-comp-summary__package,
.offer-comp-health__top,
.offer-comp-health__list article,
.offer-comp-insight__title,
.offer-comp-insight button,
.offer-comp-footer,
.offer-comp-footer__actions,
.offer-comp-footer__button,
.offer-comp-step {
  display: flex;
  align-items: center;
}

.offer-comp-header__actions {
  gap: 12px;
}

.offer-comp-save,
.offer-comp-close {
  min-height: 42px;
  border-radius: 12px;
}

.offer-comp-save {
  gap: 8px;
  padding: 0 16px;
  border: 1px solid #dfe6f2;
  color: #1d2b49;
  background: #fff;
  font-weight: 800;
}

.offer-comp-close {
  width: 42px;
  justify-content: center;
  border: 0;
  color: #8794ab;
  background: transparent;
}

.offer-comp-stepper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  padding: 10px 12px;
  overflow-x: auto;
}

.offer-comp-step {
  position: relative;
  gap: 10px;
  min-width: max-content;
  padding: 0;
  border: 0;
  color: #94a1b8;
  background: transparent;
  text-align: left;
}

.offer-comp-step span {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  border: 1px solid #d9e1ef;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #92a0b8;
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-comp-step strong {
  display: block;
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-comp-step small {
  display: block;
  margin-top: 2px;
  color: #94a1b8;
  font-size: 0.68rem;
}

.offer-comp-step.is-done span {
  border-color: #ffcde2;
  color: #ff2d87;
  background: #fff2f8;
}

.offer-comp-step.is-active {
  color: #ff2d87;
}

.offer-comp-step.is-active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -11px;
  left: 0;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff4299 0%, #ff1f7c 100%);
}

.offer-comp-step.is-active span {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
}

.offer-comp-step.is-active strong,
.offer-comp-step.is-active small {
  color: #ff2d87;
}

.offer-comp-stepper__line {
  width: 34px;
  height: 1px;
  flex: 0 0 auto;
  background: #dfe5f0;
}

.offer-comp-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) 370px;
  gap: 18px;
  margin-top: 18px;
  align-items: start;
}

.offer-comp-builder,
.offer-comp-summary,
.offer-comp-health,
.offer-comp-insight {
  padding: 16px;
}

.offer-comp-builder__head {
  justify-content: space-between;
  gap: 14px;
}

.offer-comp-builder h2 {
  font-size: 1.28rem;
}

.offer-comp-builder__recalc {
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #e5e9f5;
  border-radius: 12px;
  color: #6f59fa;
  background: #fff;
  font-weight: 800;
}

.offer-comp-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.offer-comp-row {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(210px, 0.82fr) minmax(150px, 0.72fr) auto;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid #ebeff8;
  border-radius: 16px;
}

.offer-comp-row__identity {
  gap: 12px;
}

.offer-comp-row__icon {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-comp-row__icon.is-pink {
  color: #ff2d87;
  background: #fff1f8;
}

.offer-comp-row__icon.is-violet {
  color: #725cf9;
  background: #f4f1ff;
}

.offer-comp-row__icon.is-mint {
  color: #13b26d;
  background: #ebfaf2;
}

.offer-comp-row__icon.is-orange {
  color: #ff972d;
  background: #fff4e8;
}

.offer-comp-row__icon.is-blue {
  color: #3384ff;
  background: #edf5ff;
}

.offer-comp-row__title {
  gap: 8px;
}

.offer-comp-row__title strong,
.offer-comp-row__recommendation strong,
.offer-comp-row__offer strong,
.offer-comp-summary__candidate strong,
.offer-comp-summary__package strong,
.offer-comp-health__list strong,
.offer-comp-add-more strong {
  color: #1d2b49;
  font-weight: 800;
}

.offer-comp-row__title strong {
  font-size: 0.95rem;
}

.offer-comp-row__title em {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a765;
  background: #eaf9f1;
  font-style: normal;
  font-size: 0.66rem;
  font-weight: 800;
}

.offer-comp-row__copy small,
.offer-comp-row__recommendation small,
.offer-comp-row__recommendation span,
.offer-comp-row__offer small,
.offer-comp-summary__candidate small,
.offer-comp-summary__package small,
.offer-comp-summary__package span,
.offer-comp-add-more small,
.offer-comp-note span {
  color: #90a0b8;
}

.offer-comp-row__copy small,
.offer-comp-row__recommendation small,
.offer-comp-row__offer small {
  display: block;
  font-size: 0.74rem;
}

.offer-comp-row__recommendation {
  display: grid;
  gap: 4px;
}

.offer-comp-row__value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.offer-comp-row__value strong {
  font-size: 1.05rem;
}

.offer-comp-row__value em {
  min-height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a765;
  background: #eaf9f1;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.offer-comp-row__recommendation span {
  font-size: 0.72rem;
}

.offer-comp-row__offer {
  display: grid;
  gap: 6px;
}

.offer-comp-input {
  min-height: 46px;
  padding: 0 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #243351;
  background: #fff;
}

.offer-comp-row__actions {
  gap: 8px;
}

.offer-comp-row__actions button,
.offer-comp-add-more,
.offer-comp-note button,
.offer-comp-summary__head button,
.offer-comp-insight button,
.offer-comp-footer__button {
  border: 0;
}

.offer-comp-row__actions button {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  color: #30425f;
  background: #fff;
  box-shadow: inset 0 0 0 1px #dfe6f2;
  font-size: 0.74rem;
  font-weight: 800;
}

.offer-comp-row__actions button.is-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
  box-shadow: none;
}

.offer-comp-add-more {
  width: 100%;
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ff2d87;
  background: linear-gradient(180deg, #fff7fb 0%, #fff 100%);
  box-shadow: inset 0 0 0 1px #ffd6e8;
  text-align: left;
}

.offer-comp-add-more strong {
  display: block;
  color: #ff2d87;
  font-size: 0.92rem;
}

.offer-comp-add-more small {
  display: block;
  margin-top: 3px;
  font-size: 0.72rem;
}

.offer-comp-note {
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  color: #6f59fa;
  background: #f7f4ff;
}

.offer-comp-note span {
  font-size: 0.76rem;
}

.offer-comp-note button {
  color: #6f59fa;
  background: transparent;
  font-size: 0.76rem;
  font-weight: 800;
}

.offer-comp-side {
  display: grid;
  gap: 14px;
}

.offer-comp-summary__head {
  justify-content: space-between;
  gap: 10px;
}

.offer-comp-summary__head button {
  color: #ff2d87;
  background: transparent;
  font-size: 0.8rem;
  font-weight: 800;
}

.offer-comp-summary__candidate {
  gap: 12px;
  margin-top: 14px;
}

.offer-comp-summary__avatar {
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

.offer-comp-summary__candidate strong {
  display: block;
  font-size: 1rem;
}

.offer-comp-summary__candidate small {
  display: block;
  margin-top: 3px;
  font-size: 0.74rem;
}

.offer-comp-summary__candidate small span {
  padding: 0 5px;
}

.offer-comp-summary__package {
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #edf1f8;
}

.offer-comp-summary__package small {
  display: block;
  font-size: 0.72rem;
}

.offer-comp-summary__package strong {
  display: block;
  margin-top: 6px;
  color: #ff2d87;
  font-size: 2rem;
}

.offer-comp-summary__package span {
  display: block;
  margin-top: 6px;
  font-size: 0.72rem;
}

.offer-comp-summary__badge {
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

.offer-comp-summary__badge strong {
  color: #ff2d87;
  font-size: 1.5rem;
}

.offer-comp-summary__badge small {
  margin-top: 4px;
  color: #8a97b0;
  font-size: 0.66rem;
}

.offer-comp-health__top {
  gap: 14px;
}

.offer-comp-health__ring {
  width: 92px;
  height: 92px;
  padding: 6px;
  border-radius: 50%;
  flex: 0 0 auto;
  background: conic-gradient(#16b16f 0 338deg, #edf7f1 338deg 360deg);
}

.offer-comp-health__ring div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.offer-comp-health__ring strong {
  color: #16a765;
  font-size: 1.5rem;
  font-weight: 800;
}

.offer-comp-health__copy strong {
  display: block;
  font-size: 1rem;
}

.offer-comp-health__copy p {
  font-size: 0.78rem;
}

.offer-comp-health__list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.offer-comp-health__list article {
  justify-content: space-between;
  gap: 10px;
}

.offer-comp-health__list span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #51627f;
  font-size: 0.8rem;
}

.offer-comp-health__list strong {
  margin-left: auto;
  color: #16a765;
  font-size: 0.78rem;
}

.offer-comp-health__list :deep(svg:first-child),
.offer-comp-health__list span :deep(svg) {
  color: #16a765;
}

.offer-comp-health__list article > :deep(svg:last-child) {
  color: #99a5bb;
}

.offer-comp-insight {
  background: linear-gradient(180deg, #faf6ff 0%, #fff 100%);
}

.offer-comp-insight__title {
  gap: 8px;
  color: #6f59fa;
}

.offer-comp-insight p {
  margin-top: 12px;
  font-size: 0.82rem;
}

.offer-comp-insight button {
  width: 100%;
  min-height: 42px;
  margin-top: 14px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6f59fa;
  background: #fff;
  box-shadow: inset 0 0 0 1px #ddd8ff;
  font-weight: 800;
}

.offer-comp-footer {
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.offer-comp-footer__actions {
  gap: 12px;
  margin-left: auto;
}

.offer-comp-footer__button {
  min-height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  color: #1d2b49;
  background: #fff;
  box-shadow: inset 0 0 0 1px #dfe6f2;
  font-weight: 800;
  gap: 8px;
  text-decoration: none;
}

.offer-comp-footer__button.is-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
  box-shadow: 0 18px 30px rgba(255, 31, 124, 0.22);
}

@media (max-width: 1280px) {
  .offer-comp-layout {
    grid-template-columns: 1fr;
  }

  .offer-comp-row {
    grid-template-columns: 1fr 1fr;
  }

  .offer-comp-row__actions {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .offer-comp-shell {
    padding: 12px;
  }

  .offer-comp-header,
  .offer-comp-footer {
    display: grid;
  }

  .offer-comp-row,
  .offer-comp-footer__actions {
    grid-template-columns: 1fr;
    display: grid;
  }

  .offer-comp-save,
  .offer-comp-footer__button,
  .offer-comp-builder__recalc {
    width: 100%;
    justify-content: center;
  }

  .offer-comp-note,
  .offer-comp-builder__head {
    display: grid;
  }
}
</style>
