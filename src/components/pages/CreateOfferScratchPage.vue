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

const emit = defineEmits(['back', 'open-source', 'open-offer-details'])

const job = computed(() => getJobById(props.jobId))

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const locationLabel = computed(() => {
  if (job.value.location === 'Hybrid') {
    return 'San Francisco, CA, United States'
  }

  if (job.value.location === 'On-site') {
    return 'New York, NY, United States'
  }

  if (job.value.location === 'Remote') {
    return 'Remote, United States'
  }

  return `${job.value.location}, United States`
})

const locationSummary = computed(() => {
  if (job.value.location === 'Hybrid') {
    return 'San Francisco, CA (Hybrid)'
  }

  if (job.value.location === 'On-site') {
    return 'New York, NY (On-site)'
  }

  if (job.value.location === 'Remote') {
    return 'Remote'
  }

  return job.value.location
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

const foundationFields = computed(() => [
  { label: 'Candidate', value: props.candidateName, icon: 'user', avatar: candidateInitials.value },
  { label: 'Position', value: props.candidateRole, icon: 'briefcase' },
  { label: 'Department', value: job.value.department, icon: 'building' },
  { label: 'Location', value: locationLabel.value, icon: 'mapPin' },
  { label: 'Employment Type', value: 'Full-time', icon: 'briefcase' },
  { label: 'Start Date', value: 'June 16, 2025', icon: 'calendar' },
  { label: 'Reporting Manager', value: 'Sarah Johnson', icon: 'users', avatar: 'SJ' },
  { label: 'Offer Currency', value: 'USD - US Dollar', icon: 'wallet' },
])

const summaryRows = computed(() => [
  ['Location', locationSummary.value, 'mapPin'],
  ['Start Date', 'June 16, 2025', 'calendar'],
  ['Reports To', 'Sarah Johnson', 'users'],
  ['Employment Type', 'Full-time', 'briefcase'],
  ['Salary Structure', 'Annual', 'wallet'],
  ['Offer Currency', 'USD - US Dollar', 'wallet'],
])

const assistantRows = [
  'Competitive salary',
  'Equity & bonus structure',
  'Benefits package',
  'Offer documents',
  'Approval workflow',
]

const smartRows = [
  ['Market data', 'Updated today'],
  ['Internal equity', 'Balanced'],
  ['Budget check', 'Pre-approved'],
]

const recommendedDocuments = [
  'Offer letter',
  'Compensation summary',
  'Benefits overview',
  'Equity agreement',
]

const scratchCompensationHref = computed(() => {
  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'scratch-compensation',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  return `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
})
</script>

<template>
  <main class="offer-scratch-page">
    <section class="offer-scratch-shell">
      <header class="offer-scratch-card offer-scratch-header">
        <div class="offer-scratch-header__title">
          <button class="offer-scratch-back-icon" type="button" aria-label="Back" @click="emit('open-source')">
            <AppIcon name="chevronLeft" :size="18" />
          </button>

          <div>
            <h1>Create Offer from Scratch</h1>
            <p>We'll guide you step by step to build a competitive and compliant offer.</p>
          </div>
        </div>

        <div class="offer-scratch-header__actions">
          <button class="offer-scratch-save-top" type="button">
            <AppIcon name="document" :size="15" />
            <span>Save draft</span>
          </button>

          <button class="offer-scratch-close" type="button" aria-label="Close" @click="emit('back')">
            <AppIcon name="close" :size="18" />
          </button>
        </div>
      </header>

      <nav class="offer-scratch-stepper">
        <article
          v-for="(step, index) in offerSteps"
          :key="step[0]"
          class="offer-scratch-step"
          :class="{ 'is-active': index === 0 }"
        >
          <span>{{ index + 1 }}</span>
          <div>
            <strong>{{ step[0] }}</strong>
            <small>{{ step[1] }}</small>
          </div>
        </article>
      </nav>

      <section class="offer-scratch-content">
        <div class="offer-scratch-main">
          <article class="offer-scratch-card offer-scratch-intro">
            <h2>Let's start with the basics</h2>
            <p>Tell us about the role and offer details. Nitro will take care of the rest.</p>
          </article>

          <article class="offer-scratch-card offer-scratch-form">
            <div class="offer-scratch-grid">
              <label
                v-for="field in foundationFields"
                :key="field.label"
                class="offer-scratch-field"
              >
                <span>{{ field.label }} <em>*</em></span>

                <button type="button">
                  <i v-if="field.avatar" class="offer-scratch-avatar-chip">{{ field.avatar }}</i>
                  <i v-else class="offer-scratch-icon-chip">
                    <AppIcon :name="field.icon" :size="15" />
                  </i>
                  <strong>{{ field.value }}</strong>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </label>
            </div>

            <div class="offer-scratch-structure">
              <span>Salary Structure <em>*</em></span>

              <div class="offer-scratch-structure__options">
                <button type="button" class="is-active">Annual</button>
                <button type="button">Monthly</button>
                <button type="button">Hourly</button>
              </div>
            </div>

            <div class="offer-scratch-note">
              <AppIcon name="info" :size="14" />
              <span>You can always edit these details later.</span>
            </div>
          </article>

          <article class="offer-scratch-card offer-scratch-smart">
            <div class="offer-scratch-smart__lead">
              <span class="offer-scratch-smart__icon">
                <AppIcon name="sparkles" :size="16" />
              </span>
              <div>
                <strong>Smart start</strong>
                <small>Offers created with AI recommendations have 18% higher acceptance rates.</small>
              </div>
            </div>

            <div
              v-for="row in smartRows"
              :key="row[0]"
              class="offer-scratch-smart__item"
            >
              <AppIcon name="checkCircle" :size="15" />
              <div>
                <strong>{{ row[0] }}</strong>
                <small>{{ row[1] }}</small>
              </div>
            </div>
          </article>
        </div>

        <div class="offer-scratch-middle">
          <article class="offer-scratch-card offer-scratch-summary">
            <div class="offer-scratch-summary__top">
              <strong>Role Summary</strong>
              <button type="button">Edit</button>
            </div>

            <div class="offer-scratch-summary__hero">
              <span class="offer-scratch-summary__role-icon">
                <AppIcon name="spark" :size="17" />
              </span>

              <div class="offer-scratch-summary__hero-copy">
                <div class="offer-scratch-summary__role-line">
                  <strong>{{ props.candidateRole }}</strong>
                  <em>P62</em>
                </div>
                <small>{{ job.department }} <span>&bull;</span> Full-time</small>
              </div>
            </div>

            <div class="offer-scratch-summary__rows">
              <article v-for="row in summaryRows" :key="row[0]">
                <span><AppIcon :name="row[2]" :size="13" /> {{ row[0] }}</span>
                <strong>{{ row[1] }}</strong>
              </article>
            </div>

            <button type="button" class="offer-scratch-link">
              <span>View job details</span>
              <AppIcon name="external-link" :size="13" />
            </button>
          </article>

          <article class="offer-scratch-card offer-scratch-documents">
            <div class="offer-scratch-documents__head">
              <strong>Documents</strong>
              <small>AI Recommendation</small>
            </div>

            <p>Based on this role, we recommend these essential documents.</p>

            <div class="offer-scratch-documents__chips">
              <span
                v-for="document in recommendedDocuments"
                :key="document"
                class="offer-scratch-documents__chip"
              >
                <AppIcon name="document" :size="14" />
              </span>
              <span class="offer-scratch-documents__more">+2</span>
            </div>

            <button type="button" class="offer-scratch-link">
              <span>View recommended documents</span>
            </button>
          </article>
        </div>

        <aside class="offer-scratch-side">
          <article class="offer-scratch-card offer-scratch-assistant">
            <div class="offer-scratch-assistant__head">
              <AppIcon name="sparkles" :size="16" />
              <strong>AI Assistant</strong>
            </div>

            <small>Nitro is ready to help you.</small>

            <div class="offer-scratch-bot" aria-hidden="true">
              <div class="offer-scratch-bot__halo" />
              <div class="offer-scratch-bot__face">
                <span />
              </div>
            </div>

            <div class="offer-scratch-assistant__copy">As you build this offer, I'll recommend:</div>

            <div class="offer-scratch-assistant__list">
              <div v-for="row in assistantRows" :key="row">
                <AppIcon name="checkCircle" :size="14" />
                <span>{{ row }}</span>
              </div>
            </div>
          </article>

          <article class="offer-scratch-card offer-scratch-side-meta">
            <small>Estimated completion time</small>
            <strong>~3 min</strong>

            <div class="offer-scratch-progress" aria-hidden="true">
              <span />
            </div>

            <p>Step 1 of 7</p>
          </article>

          <article class="offer-scratch-card offer-scratch-help">
            <div>
              <strong>Need help?</strong>
              <small>Ask me anything about building this offer.</small>
            </div>

            <button type="button">
              <AppIcon name="sparkles" :size="14" />
              <span>Ask Nitro AI</span>
            </button>
          </article>
        </aside>
      </section>

      <footer class="offer-scratch-footer">
        <button class="offer-scratch-button" type="button" @click="emit('open-source')">Cancel</button>

        <a class="offer-scratch-button is-primary" :href="scratchCompensationHref">
          <span>Continue</span>
          <AppIcon name="chevronRight" :size="16" />
        </a>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.offer-scratch-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(255, 77, 155, 0.14), transparent 24%),
    linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.offer-scratch-shell {
  width: min(100%, 1880px);
  margin: 0 auto;
  padding: 22px 22px 28px;
}

.offer-scratch-card {
  border: 1px solid #edf1f7;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 40px rgba(255, 76, 146, 0.06);
}

.offer-scratch-header,
.offer-scratch-header__title,
.offer-scratch-header__actions,
.offer-scratch-save-top,
.offer-scratch-step,
.offer-scratch-link,
.offer-scratch-assistant__head,
.offer-scratch-assistant__list div,
.offer-scratch-footer,
.offer-scratch-button,
.offer-scratch-help button {
  display: flex;
  align-items: center;
}

.offer-scratch-header {
  justify-content: space-between;
  gap: 18px;
  padding: 34px 42px;
}

.offer-scratch-header__title {
  gap: 18px;
}

.offer-scratch-header__title h1,
.offer-scratch-intro h2,
.offer-scratch-summary__top strong,
.offer-scratch-documents__head strong,
.offer-scratch-assistant strong,
.offer-scratch-help strong {
  margin: 0;
  color: #1d2b4c;
  font-weight: 800;
}

.offer-scratch-header__title h1 {
  font-size: clamp(2.2rem, 2vw + 1.6rem, 3.15rem);
  line-height: 1.04;
}

.offer-scratch-header__title p,
.offer-scratch-intro p,
.offer-scratch-field span,
.offer-scratch-summary__hero-copy small,
.offer-scratch-assistant > small,
.offer-scratch-assistant__copy,
.offer-scratch-help small,
.offer-scratch-documents p,
.offer-scratch-documents__head small,
.offer-scratch-note span,
.offer-scratch-smart small,
.offer-scratch-side-meta small,
.offer-scratch-side-meta p,
.offer-scratch-step small {
  color: #8a97b0;
  line-height: 1.5;
}

.offer-scratch-header__title p {
  margin: 12px 0 0;
  font-size: 1.05rem;
}

.offer-scratch-back-icon,
.offer-scratch-close {
  width: 44px;
  height: 44px;
  justify-content: center;
  border: 0;
  border-radius: 14px;
  color: #8290aa;
  background: transparent;
}

.offer-scratch-save-top {
  gap: 8px;
  min-height: 50px;
  padding: 0 20px;
  border: 1px solid #dce4f3;
  border-radius: 16px;
  color: #213252;
  background: #fff;
  font-size: 1rem;
  font-weight: 800;
}

.offer-scratch-stepper {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.offer-scratch-step {
  position: relative;
  gap: 12px;
  padding: 16px 18px;
  border: 1px solid #ebf0f8;
  border-radius: 20px;
  color: #91a0bb;
  background: rgba(255, 255, 255, 0.88);
}

.offer-scratch-step span {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border: 1px solid #d6dfef;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a1b9;
  background: #fff;
  font-size: 0.9rem;
  font-weight: 800;
}

.offer-scratch-step strong {
  display: block;
  color: #8797b3;
  font-size: 0.95rem;
  font-weight: 800;
}

.offer-scratch-step small {
  display: block;
  margin-top: 4px;
  font-size: 0.82rem;
}

.offer-scratch-step.is-active {
  color: #ff2d87;
  border-color: #ffd7e9;
  background: linear-gradient(180deg, #fff7fb 0%, #ffffff 100%);
}

.offer-scratch-step.is-active::after {
  content: '';
  position: absolute;
  right: 18px;
  bottom: 0;
  left: 18px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff469d 0%, #ff1f7c 100%);
}

.offer-scratch-step.is-active span {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff4ba0 0%, #ff1f7c 100%);
}

.offer-scratch-step.is-active strong {
  color: #ff2d87;
}

.offer-scratch-content {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(300px, 0.92fr) minmax(290px, 0.88fr);
  gap: 18px;
  margin-top: 22px;
  align-items: start;
}

.offer-scratch-main,
.offer-scratch-middle,
.offer-scratch-side {
  display: grid;
  gap: 18px;
}

.offer-scratch-intro,
.offer-scratch-form,
.offer-scratch-summary,
.offer-scratch-documents,
.offer-scratch-assistant,
.offer-scratch-side-meta,
.offer-scratch-help {
  padding: 22px;
}

.offer-scratch-intro {
  min-height: 146px;
}

.offer-scratch-intro h2 {
  font-size: 1.55rem;
}

.offer-scratch-intro p {
  margin: 14px 0 0;
  font-size: 1rem;
}

.offer-scratch-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.offer-scratch-field {
  display: grid;
  gap: 10px;
}

.offer-scratch-field span,
.offer-scratch-structure > span {
  font-size: 0.98rem;
}

.offer-scratch-field em,
.offer-scratch-structure em {
  color: #ff2d87;
  font-style: normal;
}

.offer-scratch-field button,
.offer-scratch-button,
.offer-scratch-help button,
.offer-scratch-structure__options button {
  border: 0;
}

.offer-scratch-field button {
  min-height: 56px;
  padding: 0 16px;
  border-radius: 16px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  color: #1d2b4c;
  background: #fff;
  box-shadow: inset 0 0 0 1px #dce4f3;
  text-align: left;
}

.offer-scratch-avatar-chip,
.offer-scratch-icon-chip {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 800;
}

.offer-scratch-avatar-chip {
  border-radius: 50%;
  color: #5d3813;
  background: linear-gradient(180deg, #ffd8b5 0%, #ffc58d 100%);
  font-size: 0.82rem;
}

.offer-scratch-icon-chip {
  color: #6e5af9;
  background: #f3f0ff;
}

.offer-scratch-field strong,
.offer-scratch-structure__options button,
.offer-scratch-summary__rows strong,
.offer-scratch-link,
.offer-scratch-help button {
  font-size: 0.95rem;
  font-weight: 800;
}

.offer-scratch-structure {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.offer-scratch-structure__options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.offer-scratch-structure__options button {
  min-height: 54px;
  border-radius: 16px;
  color: #7383a3;
  background: #fff;
  box-shadow: inset 0 0 0 1px #dce4f3;
}

.offer-scratch-structure__options button.is-active {
  color: #ff2d87;
  background: #fff6fb;
  box-shadow: inset 0 0 0 1px #ffd7e9;
}

.offer-scratch-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 16px;
  color: #6e5af9;
  background: #f7f4ff;
}

.offer-scratch-smart {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
  gap: 14px;
  padding: 20px 22px;
}

.offer-scratch-smart__lead,
.offer-scratch-smart__item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.offer-scratch-smart__lead strong,
.offer-scratch-smart__item strong,
.offer-scratch-summary__hero-copy strong,
.offer-scratch-summary__rows strong,
.offer-scratch-documents__head strong,
.offer-scratch-side-meta strong {
  color: #1d2b4c;
}

.offer-scratch-smart__icon {
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f8;
}

.offer-scratch-smart__lead strong,
.offer-scratch-smart__item strong {
  display: block;
  font-size: 0.95rem;
  font-weight: 800;
}

.offer-scratch-smart__item :deep(svg) {
  color: #18b573;
}

.offer-scratch-summary__top,
.offer-scratch-documents__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.offer-scratch-summary__top button {
  border: 0;
  padding: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.86rem;
  font-weight: 800;
}

.offer-scratch-summary__hero {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  margin-top: 18px;
  align-items: start;
}

.offer-scratch-summary__role-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6e5af9;
  background: #f3f0ff;
}

.offer-scratch-summary__role-line {
  display: flex;
  align-items: center;
  gap: 10px;
}

.offer-scratch-summary__role-line strong {
  font-size: 1.1rem;
  font-weight: 800;
}

.offer-scratch-summary__role-line em {
  padding: 4px 8px;
  border-radius: 999px;
  color: #16a765;
  background: #eaf9f1;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-scratch-summary__hero-copy small {
  display: block;
  margin-top: 8px;
  font-size: 0.88rem;
}

.offer-scratch-summary__hero-copy small span {
  padding: 0 6px;
}

.offer-scratch-summary__rows {
  display: grid;
  gap: 14px;
  margin-top: 20px;
}

.offer-scratch-summary__rows article {
  display: grid;
  gap: 4px;
}

.offer-scratch-summary__rows article span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8a97b0;
  font-size: 0.84rem;
}

.offer-scratch-link {
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 48px;
  margin-top: 20px;
  border: 1px solid #dce4f3;
  border-radius: 16px;
  color: #5f708f;
  background: #fff;
}

.offer-scratch-documents p {
  margin: 10px 0 0;
  font-size: 0.9rem;
}

.offer-scratch-documents__head small {
  font-size: 0.78rem;
  font-weight: 800;
}

.offer-scratch-documents__chips {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.offer-scratch-documents__chip,
.offer-scratch-documents__more {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-scratch-documents__chip {
  color: #ff2d87;
  background: #fff0f7;
}

.offer-scratch-documents__more {
  color: #6b7892;
  font-size: 0.82rem;
  font-weight: 800;
  background: #f5f7fc;
}

.offer-scratch-assistant__head {
  gap: 8px;
  color: #6e5af9;
}

.offer-scratch-assistant > small {
  display: block;
  margin-top: 8px;
  font-size: 0.94rem;
}

.offer-scratch-bot {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 170px;
  margin-top: 10px;
}

.offer-scratch-bot__halo {
  position: absolute;
  width: 164px;
  height: 164px;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, rgba(255, 120, 181, 0.28) 0%, rgba(255, 120, 181, 0.1) 38%, transparent 62%),
    radial-gradient(circle at center, rgba(110, 90, 249, 0.12) 0%, transparent 72%);
}

.offer-scratch-bot__face {
  position: relative;
  width: 92px;
  height: 72px;
  border-radius: 28px;
  background: linear-gradient(180deg, #272744 0%, #111525 100%);
  box-shadow: 0 16px 34px rgba(110, 90, 249, 0.18);
}

.offer-scratch-bot__face::before,
.offer-scratch-bot__face::after {
  content: '';
  position: absolute;
  top: 27px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff56a4;
  box-shadow: 0 0 16px rgba(255, 86, 164, 0.75);
}

.offer-scratch-bot__face::before {
  left: 24px;
}

.offer-scratch-bot__face::after {
  right: 24px;
}

.offer-scratch-bot__face span {
  position: absolute;
  bottom: 18px;
  left: 50%;
  width: 22px;
  height: 10px;
  border-bottom: 3px solid #ff56a4;
  border-radius: 0 0 20px 20px;
  transform: translateX(-50%);
}

.offer-scratch-assistant__copy {
  margin-top: 2px;
  font-size: 0.92rem;
}

.offer-scratch-assistant__list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.offer-scratch-assistant__list div {
  gap: 8px;
}

.offer-scratch-assistant__list :deep(svg) {
  color: #18b573;
}

.offer-scratch-side-meta strong {
  display: block;
  margin-top: 6px;
  font-size: 2rem;
  font-weight: 800;
}

.offer-scratch-progress {
  height: 8px;
  margin-top: 18px;
  overflow: hidden;
  border-radius: 999px;
  background: #f2dce8;
}

.offer-scratch-progress span {
  display: block;
  width: 68%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff4ba0 0%, #ff1f7c 58%, #f9c5e2 100%);
}

.offer-scratch-side-meta p {
  margin: 10px 0 0;
  font-size: 0.86rem;
  font-weight: 700;
}

.offer-scratch-help {
  display: grid;
  gap: 16px;
}

.offer-scratch-help small {
  display: block;
  margin-top: 8px;
  font-size: 0.92rem;
}

.offer-scratch-help button {
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 48px;
  border-radius: 16px;
  color: #6e5af9;
  background: #f7f4ff;
}

.offer-scratch-footer {
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
}

.offer-scratch-button {
  gap: 8px;
  min-height: 50px;
  padding: 0 22px;
  border-radius: 16px;
  color: #243352;
  background: #fff;
  box-shadow: inset 0 0 0 1px #dce4f3;
  font-weight: 800;
  text-decoration: none;
}

.offer-scratch-button.is-primary {
  min-width: 180px;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #ff469d 0%, #ff1f7c 100%);
  box-shadow: 0 18px 28px rgba(255, 31, 124, 0.22);
}

@media (max-width: 1480px) {
  .offer-scratch-content {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.92fr);
  }

  .offer-scratch-side {
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1180px) {
  .offer-scratch-stepper,
  .offer-scratch-content,
  .offer-scratch-smart,
  .offer-scratch-side {
    grid-template-columns: 1fr 1fr;
  }

  .offer-scratch-main,
  .offer-scratch-middle {
    grid-column: 1 / -1;
  }
}

@media (max-width: 860px) {
  .offer-scratch-shell {
    padding: 14px;
  }

  .offer-scratch-header {
    padding: 22px 18px;
  }

  .offer-scratch-header,
  .offer-scratch-footer,
  .offer-scratch-stepper,
  .offer-scratch-content,
  .offer-scratch-grid,
  .offer-scratch-smart,
  .offer-scratch-side,
  .offer-scratch-structure__options {
    grid-template-columns: 1fr;
    display: grid;
  }

  .offer-scratch-header__actions {
    justify-content: flex-start;
  }

  .offer-scratch-button,
  .offer-scratch-save-top {
    width: 100%;
    justify-content: center;
  }
}
</style>
