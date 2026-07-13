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

const benefitsPackage = [
  'Health insurance',
  'Dental insurance',
  'Vision insurance',
  '401(k) with company match',
  'Life & disability insurance',
  'Paid time off',
]

const aiSuggestions = [
  ['Internet allowance', 'Popular for hybrid roles in this location', 'wallet'],
  ['Gym membership', 'Frequently offered to similar level', 'gift'],
  ['Learning & development budget', 'Helps improve acceptance rate by 6%', 'sparkles'],
]

const employmentTerms = [
  ['Probation Period', '3 months', 'Standard for this role', 'calendar'],
  ['Work Arrangement', 'Hybrid', '2 days in office / 3 days remote', 'home'],
  ['Notice Period', '2 weeks', 'Standard in the United States', 'clock'],
  ['Relocation Support', 'Not offered', '-', 'mapPin'],
  ['Visa / Work Authorization', 'Not required', '-', 'document'],
  ['Confidentiality / IP Agreement', 'Standard agreement', 'Included in offer documents', 'lock'],
]

const benefitsOverview = [
  ['Standard US Benefits', 'Selected', 'Health, Dental, Vision, 401(k), PTO & more'],
  ['Internet allowance', 'AI Suggested', ''],
  ['Gym membership', 'AI Suggested', ''],
  ['Learning & development budget', 'AI Suggested', ''],
]

const keyTerms = [
  ['Probation Period', '3 months'],
  ['Work Arrangement', 'Hybrid'],
  ['Notice Period', '2 weeks'],
  ['Relocation Support', 'Not offered'],
  ['Work Authorization', 'Not required'],
]

const reviewHref = computed(() => {
  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'scratch-ai-review',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  return `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
})
</script>

<template>
  <main class="offer-benefits-page">
    <section class="offer-benefits-shell">
      <header class="offer-benefits-header">
        <div class="offer-benefits-header__copy">
          <div class="offer-benefits-breadcrumb">Offers <span>&gt;</span> Create Offer</div>
          <div class="offer-benefits-header__title">
            <h1>Create Offer from Scratch</h1>
            <AppIcon name="sparkles" :size="17" />
          </div>
          <p>Step 3 of 7 - Define benefits and terms</p>
        </div>

        <div class="offer-benefits-header__actions">
          <button class="offer-benefits-save" type="button">
            <AppIcon name="document" :size="14" />
            <span>Save draft</span>
          </button>

          <button class="offer-benefits-close" type="button" aria-label="Close" @click="emit('back')">
            <AppIcon name="close" :size="18" />
          </button>
        </div>
      </header>

      <nav class="offer-benefits-stepper">
        <div class="offer-benefits-step is-done">
          <span><AppIcon name="checkCircle" :size="13" /></span>
          <div>
            <strong>Offer Foundation</strong>
            <small>Basic information</small>
          </div>
        </div>

        <i class="offer-benefits-stepper__line" />

        <div class="offer-benefits-step is-done">
          <span><AppIcon name="checkCircle" :size="13" /></span>
          <div>
            <strong>Compensation</strong>
            <small>Salary, bonus, equity</small>
          </div>
        </div>

        <i class="offer-benefits-stepper__line" />

        <div class="offer-benefits-step is-active">
          <span>3</span>
          <div>
            <strong>Benefits &amp; Terms</strong>
            <small>Benefits and conditions</small>
          </div>
        </div>

        <i class="offer-benefits-stepper__line" />

        <div class="offer-benefits-step">
          <span>4</span>
          <div>
            <strong>AI Review</strong>
            <small>Offer intelligence</small>
          </div>
        </div>

        <i class="offer-benefits-stepper__line" />

        <div class="offer-benefits-step">
          <span>5</span>
          <div>
            <strong>Offer Package</strong>
            <small>Documents &amp; experience</small>
          </div>
        </div>

        <i class="offer-benefits-stepper__line" />

        <div class="offer-benefits-step">
          <span>6</span>
          <div>
            <strong>Final Review</strong>
            <small>Review before launch</small>
          </div>
        </div>

        <i class="offer-benefits-stepper__line" />

        <div class="offer-benefits-step">
          <span>7</span>
          <div>
            <strong>Launch</strong>
            <small>Send offer</small>
          </div>
        </div>
      </nav>

      <section class="offer-benefits-layout">
        <section class="offer-benefits-main">
          <article class="offer-benefits-card offer-benefits-intro">
            <div>
              <h2>Benefits &amp; Terms</h2>
              <p>Configure the benefits package and important terms of employment.</p>
            </div>

            <button type="button" class="offer-benefits-intro__suggest">
              <AppIcon name="sparkles" :size="14" />
              <span>Suggest with AI</span>
            </button>
          </article>

          <section class="offer-benefits-package-grid">
            <article class="offer-benefits-card offer-benefits-package">
              <div class="offer-benefits-package__head">
                <strong>Benefits Package</strong>
                <button type="button">Use template</button>
              </div>

              <div class="offer-benefits-package__featured">
                <div class="offer-benefits-package__title">
                  <span><AppIcon name="shield" :size="18" /></span>
                  <div>
                    <strong>Standard US Benefits</strong>
                    <small>Our most selected package for this role</small>
                  </div>
                  <em>Recommended</em>
                </div>

                <div class="offer-benefits-package__list">
                  <article v-for="item in benefitsPackage" :key="item">
                    <AppIcon name="checkCircle" :size="13" />
                    <span>{{ item }}</span>
                  </article>
                </div>

                <button type="button" class="offer-benefits-outline">Customize package</button>
              </div>
            </article>

            <article class="offer-benefits-card offer-benefits-suggestions">
              <strong>AI Suggestions for this role</strong>

              <div class="offer-benefits-suggestions__list">
                <article v-for="item in aiSuggestions" :key="item[0]">
                  <span><AppIcon :name="item[2]" :size="15" /></span>
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                  <button type="button">Add</button>
                </article>
              </div>

              <button type="button" class="offer-benefits-suggestions__more">
                <span>View more suggestions (5)</span>
                <AppIcon name="chevronDown" :size="14" />
              </button>
            </article>
          </section>

          <section class="offer-benefits-terms">
            <strong>Employment Terms</strong>

            <div class="offer-benefits-terms__grid">
              <label v-for="item in employmentTerms" :key="item[0]" class="offer-benefits-term">
                <span>{{ item[0] }}</span>
                <button type="button">
                  <i><AppIcon :name="item[3]" :size="14" /></i>
                  <strong>{{ item[1] }}</strong>
                  <AppIcon name="chevronDown" :size="14" />
                </button>
                <small>{{ item[2] }}</small>
              </label>
            </div>

            <div class="offer-benefits-note">
              <AppIcon name="info" :size="14" />
              <span>These terms will be included in the employment contract.</span>
            </div>
          </section>
        </section>

        <aside class="offer-benefits-side">
          <article class="offer-benefits-card offer-benefits-summary">
            <div class="offer-benefits-summary__head">
              <strong>Offer Summary</strong>
              <button type="button">Edit</button>
            </div>

            <div class="offer-benefits-summary__candidate">
              <span class="offer-benefits-summary__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <small>{{ candidateRole }}</small>
                <small>{{ job.department }} <span>&bull;</span> Full-time</small>
                <small>San Francisco, CA (Hybrid)</small>
              </div>
            </div>

            <div class="offer-benefits-summary__package">
              <div>
                <small>Total Annual Compensation</small>
                <strong>$165,000</strong>
                <span>$145,000 base + $20,000 variable</span>
              </div>

              <div class="offer-benefits-summary__badge">
                <strong>P62</strong>
                <small>Market Position</small>
              </div>
            </div>

            <div class="offer-benefits-summary__stats">
              <article><span>AI Confidence</span><strong>95%</strong></article>
              <article><span>Est. Acceptance</span><strong>94%</strong></article>
              <article><span>Offer Health</span><em>Excellent</em></article>
            </div>
          </article>

          <article class="offer-benefits-card offer-benefits-overview">
            <div class="offer-benefits-summary__head">
              <strong>Benefits Overview</strong>
              <button type="button">Edit</button>
            </div>

            <div class="offer-benefits-overview__list">
              <article v-for="item in benefitsOverview" :key="item[0]">
                <span><AppIcon name="document" :size="13" /> {{ item[0] }}</span>
                <em>{{ item[1] }}</em>
                <small>{{ item[2] }}</small>
                <AppIcon name="chevronRight" :size="13" />
              </article>
            </div>

            <button type="button" class="offer-benefits-outline">
              <span>View full benefits</span>
              <AppIcon name="external-link" :size="13" />
            </button>
          </article>

          <article class="offer-benefits-card offer-benefits-keys">
            <div class="offer-benefits-summary__head">
              <strong>Key Terms Summary</strong>
              <button type="button">Edit</button>
            </div>

            <div class="offer-benefits-keys__list">
              <article v-for="item in keyTerms" :key="item[0]">
                <span>{{ item[0] }}</span>
                <strong>{{ item[1] }}</strong>
              </article>
            </div>
          </article>
        </aside>
      </section>

      <footer class="offer-benefits-footer">
        <button type="button" class="offer-benefits-footer__button" @click="emit('open-source')">Back</button>

        <div class="offer-benefits-footer__actions">
          <button type="button" class="offer-benefits-footer__button">Save draft</button>
          <a class="offer-benefits-footer__button is-primary" :href="reviewHref">
            <span>Continue</span>
            <AppIcon name="chevronRight" :size="15" />
          </a>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.offer-benefits-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(255, 77, 155, 0.1), transparent 24%),
    linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.offer-benefits-shell {
  width: min(100%, 1800px);
  margin: 0 auto;
  padding: 18px 20px 22px;
}

.offer-benefits-card,
.offer-benefits-header,
.offer-benefits-stepper {
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 36px rgba(255, 76, 146, 0.06);
}

.offer-benefits-header,
.offer-benefits-header__actions,
.offer-benefits-save,
.offer-benefits-header__title,
.offer-benefits-stepper,
.offer-benefits-step,
.offer-benefits-intro,
.offer-benefits-intro__suggest,
.offer-benefits-package__head,
.offer-benefits-package__title,
.offer-benefits-package__list article,
.offer-benefits-suggestions__list article,
.offer-benefits-suggestions__more,
.offer-benefits-summary__head,
.offer-benefits-summary__candidate,
.offer-benefits-summary__package,
.offer-benefits-summary__stats,
.offer-benefits-overview__list article,
.offer-benefits-keys__list article,
.offer-benefits-note,
.offer-benefits-footer,
.offer-benefits-footer__actions,
.offer-benefits-footer__button {
  display: flex;
  align-items: center;
}

.offer-benefits-header {
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
}

.offer-benefits-breadcrumb {
  color: #96a2b6;
  font-size: 0.78rem;
  font-weight: 700;
}

.offer-benefits-breadcrumb span {
  padding: 0 6px;
}

.offer-benefits-header__title {
  gap: 8px;
  margin-top: 4px;
  color: #ff3a95;
}

.offer-benefits-header__title h1,
.offer-benefits-intro h2,
.offer-benefits-package strong,
.offer-benefits-suggestions strong,
.offer-benefits-terms > strong,
.offer-benefits-summary__head strong,
.offer-benefits-keys strong {
  margin: 0;
  color: #1c2b4a;
  font-weight: 800;
}

.offer-benefits-header__title h1 {
  font-size: 2.2rem;
  line-height: 1.04;
}

.offer-benefits-header__copy p,
.offer-benefits-intro p,
.offer-benefits-package__title small,
.offer-benefits-suggestions__list small,
.offer-benefits-term span,
.offer-benefits-term small,
.offer-benefits-summary__candidate small,
.offer-benefits-summary__package small,
.offer-benefits-summary__package span,
.offer-benefits-summary__stats span,
.offer-benefits-overview__list small,
.offer-benefits-note span,
.offer-benefits-step small {
  color: #8490a8;
}

.offer-benefits-header__actions {
  gap: 12px;
}

.offer-benefits-save {
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  color: #1d2b49;
  background: #fff;
  font-weight: 800;
}

.offer-benefits-close {
  width: 42px;
  min-height: 42px;
  border: 0;
  border-radius: 12px;
  color: #8794ab;
  background: transparent;
}

.offer-benefits-stepper {
  gap: 12px;
  margin-top: 14px;
  padding: 10px 12px;
  overflow-x: auto;
}

.offer-benefits-step {
  position: relative;
  gap: 10px;
  min-width: max-content;
  color: #94a1b8;
}

.offer-benefits-step span {
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

.offer-benefits-step strong {
  display: block;
  font-size: 0.82rem;
}

.offer-benefits-step small {
  display: block;
  margin-top: 2px;
  font-size: 0.68rem;
}

.offer-benefits-step.is-done span {
  border-color: #caefd9;
  color: #1db16f;
  background: #f2fcf7;
}

.offer-benefits-step.is-active {
  color: #ff2d87;
}

.offer-benefits-step.is-active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -11px;
  left: 0;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff4299 0%, #ff1f7c 100%);
}

.offer-benefits-step.is-active span {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
}

.offer-benefits-step.is-active strong,
.offer-benefits-step.is-active small {
  color: #ff2d87;
}

.offer-benefits-stepper__line {
  width: 34px;
  height: 1px;
  flex: 0 0 auto;
  background: #dfe5f0;
}

.offer-benefits-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.62fr) 360px;
  gap: 18px;
  margin-top: 18px;
  align-items: start;
}

.offer-benefits-main,
.offer-benefits-side {
  display: grid;
  gap: 16px;
}

.offer-benefits-intro,
.offer-benefits-package,
.offer-benefits-suggestions,
.offer-benefits-summary,
.offer-benefits-overview,
.offer-benefits-keys {
  padding: 16px;
}

.offer-benefits-intro {
  justify-content: space-between;
  gap: 14px;
}

.offer-benefits-intro h2 {
  font-size: 1.24rem;
}

.offer-benefits-intro__suggest {
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #e5e9f5;
  border-radius: 12px;
  color: #6f59fa;
  background: #fff;
  font-weight: 800;
}

.offer-benefits-package-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.38fr);
  gap: 16px;
}

.offer-benefits-package__head,
.offer-benefits-summary__head {
  justify-content: space-between;
}

.offer-benefits-package__head button,
.offer-benefits-summary__head button {
  border: 0;
  color: #6f59fa;
  background: transparent;
  font-size: 0.76rem;
  font-weight: 800;
}

.offer-benefits-package__featured {
  margin-top: 14px;
  padding: 16px;
  border: 1px solid #d7f0df;
  border-radius: 18px;
  background: linear-gradient(180deg, #fcfffd 0%, #fff 100%);
}

.offer-benefits-package__title {
  gap: 10px;
  align-items: flex-start;
}

.offer-benefits-package__title span {
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1db16f;
  background: #effbf4;
}

.offer-benefits-package__title strong {
  display: block;
  font-size: 0.95rem;
}

.offer-benefits-package__title small {
  display: block;
  margin-top: 3px;
  font-size: 0.74rem;
}

.offer-benefits-package__title em {
  margin-left: auto;
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

.offer-benefits-package__list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.offer-benefits-package__list article {
  gap: 8px;
  color: #51627f;
  font-size: 0.82rem;
}

.offer-benefits-package__list :deep(svg) {
  color: #16a765;
}

.offer-benefits-outline {
  width: 100%;
  min-height: 40px;
  margin-top: 16px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  color: #4c5f82;
  background: #fff;
  font-weight: 800;
}

.offer-benefits-suggestions__list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.offer-benefits-suggestions__list article {
  gap: 12px;
  padding: 14px;
  border: 1px solid #eceff8;
  border-radius: 14px;
}

.offer-benefits-suggestions__list span {
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

.offer-benefits-suggestions__list strong {
  display: block;
  font-size: 0.86rem;
}

.offer-benefits-suggestions__list small {
  display: block;
  margin-top: 3px;
  font-size: 0.72rem;
}

.offer-benefits-suggestions__list button {
  min-width: 54px;
  min-height: 34px;
  margin-left: auto;
  border: 1px solid #dfe6f2;
  border-radius: 10px;
  color: #4f6290;
  background: #fff;
  font-weight: 800;
}

.offer-benefits-suggestions__more {
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 40px;
  margin-top: 12px;
  border: 1px solid #eceff8;
  border-radius: 12px;
  color: #6f59fa;
  background: #fff;
  font-weight: 800;
}

.offer-benefits-terms > strong {
  display: block;
  font-size: 0.96rem;
}

.offer-benefits-terms__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.offer-benefits-term {
  display: grid;
  gap: 8px;
}

.offer-benefits-term span {
  font-size: 0.82rem;
}

.offer-benefits-term button {
  min-height: 48px;
  padding: 0 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  color: #243351;
  background: #fff;
  text-align: left;
}

.offer-benefits-term i {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6f59fa;
  background: #f5f1ff;
  font-style: normal;
}

.offer-benefits-term strong {
  font-size: 0.84rem;
}

.offer-benefits-term small {
  font-size: 0.72rem;
}

.offer-benefits-note {
  gap: 8px;
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  color: #6f59fa;
  background: #f7f4ff;
}

.offer-benefits-note span {
  font-size: 0.76rem;
}

.offer-benefits-summary__candidate {
  gap: 12px;
  margin-top: 14px;
}

.offer-benefits-summary__avatar {
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

.offer-benefits-summary__candidate strong {
  display: block;
  font-size: 1rem;
}

.offer-benefits-summary__candidate small {
  display: block;
  margin-top: 3px;
  font-size: 0.74rem;
}

.offer-benefits-summary__candidate small span {
  padding: 0 5px;
}

.offer-benefits-summary__package {
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #edf1f8;
}

.offer-benefits-summary__package strong {
  display: block;
  margin-top: 6px;
  color: #ff2d87;
  font-size: 2rem;
}

.offer-benefits-summary__package small,
.offer-benefits-summary__package span {
  display: block;
  font-size: 0.72rem;
}

.offer-benefits-summary__badge {
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

.offer-benefits-summary__badge strong {
  color: #ff2d87;
  font-size: 1.5rem;
}

.offer-benefits-summary__badge small {
  margin-top: 4px;
  font-size: 0.66rem;
}

.offer-benefits-summary__stats {
  gap: 0;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #edf1f8;
}

.offer-benefits-summary__stats article {
  flex: 1 1 0;
}

.offer-benefits-summary__stats span,
.offer-benefits-summary__stats strong,
.offer-benefits-summary__stats em {
  display: block;
  font-size: 0.72rem;
}

.offer-benefits-summary__stats strong {
  margin-top: 4px;
  color: #16a765;
  font-size: 1.1rem;
}

.offer-benefits-summary__stats em {
  margin-top: 4px;
  color: #16a765;
  font-style: normal;
  font-weight: 800;
}

.offer-benefits-overview__list,
.offer-benefits-keys__list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.offer-benefits-overview__list article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 8px;
  align-items: center;
}

.offer-benefits-overview__list span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #243351;
  font-size: 0.82rem;
  font-weight: 700;
}

.offer-benefits-overview__list em {
  color: #16a765;
  font-style: normal;
  font-size: 0.66rem;
  font-weight: 800;
}

.offer-benefits-overview__list small {
  grid-column: 1 / 2;
  font-size: 0.7rem;
}

.offer-benefits-overview__list article > :deep(svg:last-child) {
  color: #98a4bb;
}

.offer-benefits-keys__list article {
  justify-content: space-between;
  gap: 12px;
}

.offer-benefits-keys__list span {
  color: #7b88a2;
  font-size: 0.78rem;
}

.offer-benefits-keys__list strong {
  font-size: 0.8rem;
}

.offer-benefits-footer {
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.offer-benefits-footer__actions {
  gap: 12px;
  margin-left: auto;
}

.offer-benefits-footer__button {
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

.offer-benefits-footer__button.is-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
  box-shadow: 0 18px 30px rgba(255, 31, 124, 0.22);
}

@media (max-width: 1280px) {
  .offer-benefits-layout,
  .offer-benefits-package-grid,
  .offer-benefits-terms__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .offer-benefits-shell {
    padding: 12px;
  }

  .offer-benefits-header,
  .offer-benefits-intro,
  .offer-benefits-footer,
  .offer-benefits-footer__actions,
  .offer-benefits-summary__stats {
    display: grid;
  }

  .offer-benefits-save,
  .offer-benefits-footer__button,
  .offer-benefits-intro__suggest {
    width: 100%;
    justify-content: center;
  }
}
</style>
