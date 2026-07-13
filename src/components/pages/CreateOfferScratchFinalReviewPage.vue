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

const emit = defineEmits(['back', 'open-source'])

const job = computed(() => getJobById(props.jobId))

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const launchHref = computed(() => {
  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'scratch-launch',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  return `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
})

const snapshotRows = [
  ['Reports to', 'Jacob Jones', 'users'],
  ['Work arrangement', 'Hybrid', 'briefcase'],
  ['Employment Type', 'Full-time', 'briefcase'],
  ['Offer Expiry', 'May 29, 2025', 'calendar'],
  ['Start Date', 'June 16, 2025', 'calendar'],
  ['Notice Period', '2 weeks', 'clock'],
]

const compensationRows = [
  ['Base Salary', '$145,000 / year'],
  ['Signing Bonus', '$15,000'],
  ['Equity (RSUs)', '$50,000'],
  ['Performance Bonus', '20% of base'],
  ['Relocation Support', '$8,000'],
  ['Total Annual Compensation', '$218,000'],
]

const benefitsRows = [
  ['Benefits Package', 'Standard US Benefits'],
  ['Work Arrangement', 'Hybrid'],
  ['Probation Period', '3 months'],
  ['Notice Period', '30 days'],
]

const packageRows = [
  ['Offer Letter', 'document'],
  ['Employment Agreement', 'document'],
  ['NDA', 'document'],
  ['Equity Agreement', 'document'],
  ['Company Benefits Guide', 'document'],
]

const approvalRows = [
  ['Approved by all', 'This offer has been approved and is ready to send.', 'checkCircle'],
  ['Lisa Chen', 'HR Manager', 'user'],
  ['Daniel Lee', 'Engineering Director', 'user'],
  ['Finance Team', 'Compensation Approval', 'building'],
]

const experienceRows = [
  ['1. Email Invitation', 'Personalized email with offer details', 'mail'],
  ['2. Review Offer', 'Secure link to review offer details', 'eye'],
  ['3. Sign Documents', 'E-sign all required documents', 'edit'],
  ['4. Accept Offer', 'Accept and complete the process', 'checkCircle'],
]

const includedRows = [
  ['Base Salary', '$145,000'],
  ['Signing Bonus', '$15,000'],
  ['Equity (RSUs)', '$50,000'],
  ['Performance Bonus', '20% of base'],
  ['Relocation Support', '$8,000'],
  ['Benefits Package', 'Standard US Benefits'],
  ['Work Arrangement', 'Hybrid'],
  ['Start Date', 'June 16, 2025'],
]

const statRows = [
  ['Attractive', '95%', 'Excellent'],
  ['Est. Acceptance', '94%', 'High'],
  ['Offer Health', 'Excellent', 'Strong offer'],
]
</script>

<template>
  <main class="scratch-final-review-page">
    <section class="scratch-final-review-shell">
      <header class="scratch-final-review-card scratch-final-review-header">
        <div class="scratch-final-review-header__copy">
          <div class="scratch-final-review-breadcrumb">Offers <span>&gt;</span> Create Offer</div>
          <div class="scratch-final-review-header__title">
            <h1>Final Review</h1>
            <AppIcon name="sparkles" :size="17" />
          </div>
          <p>Step 6 of 7 - Review all details before sending to Marvin.</p>
        </div>

        <div class="scratch-final-review-header__actions">
          <button class="scratch-final-review-save" type="button">
            <AppIcon name="document" :size="14" />
            <span>Save draft</span>
          </button>
          <button class="scratch-final-review-more" type="button" aria-label="More actions">
            <AppIcon name="more" :size="16" />
          </button>
          <button class="scratch-final-review-close" type="button" aria-label="Close" @click="emit('back')">
            <AppIcon name="close" :size="18" />
          </button>
        </div>
      </header>

      <nav class="scratch-final-review-stepper">
        <div class="scratch-final-review-step is-done"><span><AppIcon name="checkCircle" :size="13" /></span><div><strong>Offer Foundation</strong><small>Basic information</small></div></div>
        <i class="scratch-final-review-stepper__line" />
        <div class="scratch-final-review-step is-done"><span><AppIcon name="checkCircle" :size="13" /></span><div><strong>Compensation</strong><small>Salary, bonus, equity</small></div></div>
        <i class="scratch-final-review-stepper__line" />
        <div class="scratch-final-review-step is-done"><span><AppIcon name="checkCircle" :size="13" /></span><div><strong>Benefits &amp; Terms</strong><small>Benefits and conditions</small></div></div>
        <i class="scratch-final-review-stepper__line" />
        <div class="scratch-final-review-step is-done"><span><AppIcon name="checkCircle" :size="13" /></span><div><strong>AI Review</strong><small>Offer intelligence</small></div></div>
        <i class="scratch-final-review-stepper__line" />
        <div class="scratch-final-review-step is-done"><span><AppIcon name="checkCircle" :size="13" /></span><div><strong>Offer Package</strong><small>Documents &amp; experience</small></div></div>
        <i class="scratch-final-review-stepper__line" />
        <div class="scratch-final-review-step is-active"><span>6</span><div><strong>Final Review</strong><small>You're here</small></div></div>
        <i class="scratch-final-review-stepper__line" />
        <div class="scratch-final-review-step"><span>7</span><div><strong>Launch Offer</strong><small>Send offer</small></div></div>
      </nav>

      <section class="scratch-final-review-layout">
        <section class="scratch-final-review-main">
          <article class="scratch-final-review-card scratch-final-review-panel scratch-final-review-snapshot">
            <strong class="scratch-final-review-panel__title">Offer Snapshot</strong>

            <div class="scratch-final-review-snapshot__grid">
              <div class="scratch-final-review-snapshot__candidate">
                <span class="scratch-final-review-avatar">{{ candidateInitials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <small>{{ candidateRole }}</small>
                  <small>{{ job.department }}</small>
                  <small>San Francisco, CA (Hybrid)</small>
                </div>
              </div>

              <article v-for="item in snapshotRows" :key="item[0]">
                <span><AppIcon :name="item[2]" :size="13" /> {{ item[0] }}</span>
                <strong>{{ item[1] }}</strong>
              </article>

              <div class="scratch-final-review-check">
                <div>
                  <strong>AI Check</strong>
                  <small>Looks good</small>
                  <span>No issues found</span>
                </div>
                <button type="button">View details</button>
              </div>
            </div>
          </article>

          <section class="scratch-final-review-summary-grid">
            <article class="scratch-final-review-card scratch-final-review-panel">
              <div class="scratch-final-review-panel__head">
                <strong>Compensation Summary</strong>
                <button type="button">Edit</button>
              </div>

              <div class="scratch-final-review-list">
                <article v-for="item in compensationRows" :key="item[0]">
                  <span>{{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                </article>
              </div>

              <button type="button" class="scratch-final-review-link">
                <span>View full compensation</span>
                <AppIcon name="chevronRight" :size="13" />
              </button>
            </article>

            <article class="scratch-final-review-card scratch-final-review-panel">
              <div class="scratch-final-review-panel__head">
                <strong>Benefits &amp; Terms Summary</strong>
                <button type="button">Edit</button>
              </div>

              <div class="scratch-final-review-list">
                <article v-for="item in benefitsRows" :key="item[0]">
                  <span>{{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                </article>
              </div>

              <button type="button" class="scratch-final-review-link">
                <span>View all benefits &amp; terms (12)</span>
                <AppIcon name="chevronRight" :size="13" />
              </button>
            </article>

            <article class="scratch-final-review-card scratch-final-review-panel">
              <div class="scratch-final-review-panel__head">
                <strong>Offer Package Summary</strong>
                <button type="button">Edit</button>
              </div>

              <div class="scratch-final-review-docs">
                <small>Included Documents <em>5 Documents</em></small>
                <article v-for="item in packageRows" :key="item[0]">
                  <span><AppIcon :name="item[1]" :size="13" /> {{ item[0] }}</span>
                </article>
              </div>

              <button type="button" class="scratch-final-review-link">
                <span>View all documents</span>
                <AppIcon name="chevronRight" :size="13" />
              </button>
            </article>
          </section>

          <section class="scratch-final-review-bottom-grid">
            <article class="scratch-final-review-card scratch-final-review-panel">
              <strong class="scratch-final-review-panel__title">Approval Summary</strong>

              <div class="scratch-final-review-approval-lead">
                <AppIcon :name="approvalRows[0][2]" :size="16" />
                <div>
                  <strong>{{ approvalRows[0][0] }}</strong>
                  <small>{{ approvalRows[0][1] }}</small>
                </div>
              </div>

              <div class="scratch-final-review-approvals">
                <article v-for="item in approvalRows.slice(1)" :key="item[0]">
                  <span><AppIcon :name="item[2]" :size="13" /></span>
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                  <small>May 12, 2025</small>
                </article>
              </div>

              <button type="button" class="scratch-final-review-link">
                <span>View approval workflow</span>
                <AppIcon name="chevronRight" :size="13" />
              </button>
            </article>

            <article class="scratch-final-review-card scratch-final-review-panel">
              <div class="scratch-final-review-panel__head">
                <strong>Candidate Experience Preview</strong>
                <button type="button">View as candidate</button>
              </div>

              <div class="scratch-final-review-experience">
                <article v-for="item in experienceRows" :key="item[0]">
                  <span><AppIcon :name="item[2]" :size="14" /></span>
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                </article>
              </div>
            </article>
          </section>
        </section>

        <aside class="scratch-final-review-side">
          <article class="scratch-final-review-card scratch-final-review-panel">
            <div class="scratch-final-review-panel__head">
              <strong>Offer Summary</strong>
              <button type="button">Edit</button>
            </div>

            <div class="scratch-final-review-side__market">
              <strong>P62</strong>
              <span>Market Position</span>
            </div>

            <div class="scratch-final-review-side__comp">
              <small>Total Annual Compensation</small>
              <strong>
                <span>$218,000</span>
                <AppIcon name="info" :size="14" />
              </strong>
              <span class="scratch-final-review-side__comp-line">$145,000 Base <em>&bull;</em> $73,000 Variable</span>
              <span>$145,000 base • $73,000 variable</span>
            </div>

            <div class="scratch-final-review-side__stats">
              <article v-for="item in statRows" :key="item[0]">
                <span>{{ item[0] }}</span>
                <strong>{{ item[1] }}</strong>
                <small>{{ item[2] }}</small>
              </article>
            </div>
          </article>

          <article class="scratch-final-review-card scratch-final-review-panel">
            <div class="scratch-final-review-panel__head">
              <strong>What's Included</strong>
              <button type="button">Edit</button>
            </div>

            <div class="scratch-final-review-list">
              <article v-for="item in includedRows" :key="item[0]">
                <span><AppIcon name="document" :size="12" /> {{ item[0] }}</span>
                <strong>{{ item[1] }}</strong>
              </article>
            </div>

            <button type="button" class="scratch-final-review-outline">
              <span>View full offer details</span>
              <AppIcon name="external-link" :size="13" />
            </button>
          </article>
        </aside>
      </section>

      <footer class="scratch-final-review-footer">
        <button type="button" class="scratch-final-review-button" @click="emit('open-source')">Back</button>
        <div class="scratch-final-review-footer__actions">
          <button type="button" class="scratch-final-review-button">
            <AppIcon name="document" :size="14" />
            <span>Save draft</span>
          </button>
          <a class="scratch-final-review-button is-primary" :href="launchHref">
            <span>Continue to Launch</span>
            <AppIcon name="chevronRight" :size="15" />
          </a>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.scratch-final-review-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(255, 77, 155, 0.1), transparent 24%),
    linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.scratch-final-review-shell {
  width: min(100%, 1800px);
  margin: 0 auto;
  padding: 18px 20px 22px;
}

.scratch-final-review-card,
.scratch-final-review-header,
.scratch-final-review-stepper {
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 36px rgba(255, 76, 146, 0.06);
}

.scratch-final-review-header,
.scratch-final-review-header__actions,
.scratch-final-review-save,
.scratch-final-review-header__title,
.scratch-final-review-stepper,
.scratch-final-review-step,
.scratch-final-review-panel__head,
.scratch-final-review-snapshot__candidate,
.scratch-final-review-snapshot__grid article,
.scratch-final-review-check,
.scratch-final-review-list article,
.scratch-final-review-docs article,
.scratch-final-review-approval-lead,
.scratch-final-review-approvals article,
.scratch-final-review-experience article,
.scratch-final-review-side__stats,
.scratch-final-review-footer,
.scratch-final-review-footer__actions,
.scratch-final-review-button,
.scratch-final-review-outline,
.scratch-final-review-link {
  display: flex;
  align-items: center;
}

.scratch-final-review-header {
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
}

.scratch-final-review-breadcrumb {
  color: #96a2b6;
  font-size: 0.78rem;
  font-weight: 700;
}

.scratch-final-review-breadcrumb span {
  padding: 0 6px;
}

.scratch-final-review-header__title {
  gap: 8px;
  margin-top: 4px;
  color: #ff3a95;
}

.scratch-final-review-header__title h1,
.scratch-final-review-panel__title,
.scratch-final-review-panel__head strong,
.scratch-final-review-snapshot__candidate strong,
.scratch-final-review-side__comp strong {
  margin: 0;
  color: #1c2b4a;
  font-weight: 800;
}

.scratch-final-review-header__title h1 {
  font-size: 2.1rem;
  line-height: 1.04;
}

.scratch-final-review-header__copy p,
.scratch-final-review-step small,
.scratch-final-review-snapshot__candidate small,
.scratch-final-review-snapshot__grid article span,
.scratch-final-review-check small,
.scratch-final-review-check span,
.scratch-final-review-list span,
.scratch-final-review-docs small,
.scratch-final-review-approval-lead small,
.scratch-final-review-approvals small,
.scratch-final-review-experience small,
.scratch-final-review-side__comp small,
.scratch-final-review-side__comp span,
.scratch-final-review-side__stats span,
.scratch-final-review-side__stats small {
  color: #8490a8;
}

.scratch-final-review-header__actions {
  gap: 10px;
}

.scratch-final-review-save,
.scratch-final-review-more,
.scratch-final-review-close {
  min-height: 42px;
  border-radius: 12px;
  background: #fff;
}

.scratch-final-review-save {
  gap: 8px;
  padding: 0 16px;
  border: 1px solid #dfe6f2;
  color: #1d2b49;
  font-weight: 800;
}

.scratch-final-review-more,
.scratch-final-review-close {
  width: 42px;
  justify-content: center;
  border: 1px solid #e6ebf5;
  color: #8794ab;
}

.scratch-final-review-stepper {
  gap: 12px;
  margin-top: 14px;
  padding: 10px 12px;
  overflow-x: auto;
}

.scratch-final-review-step {
  position: relative;
  gap: 10px;
  min-width: max-content;
  color: #94a1b8;
}

.scratch-final-review-step span {
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

.scratch-final-review-step strong {
  display: block;
  font-size: 0.82rem;
}

.scratch-final-review-step small {
  display: block;
  margin-top: 2px;
  font-size: 0.68rem;
}

.scratch-final-review-step.is-done span {
  border-color: #caefd9;
  color: #1db16f;
  background: #f2fcf7;
}

.scratch-final-review-step.is-active {
  color: #ff2d87;
}

.scratch-final-review-step.is-active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -11px;
  left: 0;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff4299 0%, #ff1f7c 100%);
}

.scratch-final-review-step.is-active span {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
}

.scratch-final-review-step.is-active strong,
.scratch-final-review-step.is-active small {
  color: #ff2d87;
}

.scratch-final-review-stepper__line {
  width: 34px;
  height: 1px;
  flex: 0 0 auto;
  background: #dfe5f0;
}

.scratch-final-review-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) 360px;
  gap: 18px;
  margin-top: 18px;
  align-items: start;
}

.scratch-final-review-main,
.scratch-final-review-side {
  display: grid;
  gap: 16px;
}

.scratch-final-review-panel {
  padding: 16px;
}

.scratch-final-review-panel__head {
  justify-content: space-between;
  gap: 12px;
}

.scratch-final-review-panel__head button {
  border: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.76rem;
  font-weight: 800;
}

.scratch-final-review-snapshot__grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1.2fr repeat(3, minmax(0, 0.8fr));
  gap: 12px;
}

.scratch-final-review-snapshot__candidate,
.scratch-final-review-snapshot__grid article,
.scratch-final-review-check {
  min-height: 92px;
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.scratch-final-review-snapshot__candidate {
  gap: 12px;
  grid-row: span 2;
}

.scratch-final-review-avatar {
  width: 56px;
  height: 56px;
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

.scratch-final-review-snapshot__candidate strong {
  display: block;
  font-size: 1rem;
}

.scratch-final-review-snapshot__candidate small {
  display: block;
  margin-top: 4px;
  font-size: 0.74rem;
}

.scratch-final-review-snapshot__grid article {
  display: grid;
  align-content: center;
  gap: 8px;
}

.scratch-final-review-snapshot__grid article span,
.scratch-final-review-list span,
.scratch-final-review-docs article span,
.scratch-final-review-side__comp small,
.scratch-final-review-side__stats span {
  font-size: 0.72rem;
  font-weight: 700;
}

.scratch-final-review-snapshot__grid article strong,
.scratch-final-review-list strong,
.scratch-final-review-docs small em,
.scratch-final-review-approval-lead strong,
.scratch-final-review-approvals strong,
.scratch-final-review-experience strong,
.scratch-final-review-side__market,
.scratch-final-review-side__stats strong {
  color: #1c2b4a;
  font-weight: 800;
}

.scratch-final-review-check {
  justify-content: space-between;
  grid-column: span 3;
  background: linear-gradient(180deg, #f8fff9 0%, #fff 100%);
}

.scratch-final-review-check strong {
  display: block;
  color: #1db16f;
  font-size: 0.84rem;
}

.scratch-final-review-check small,
.scratch-final-review-check span {
  display: block;
  margin-top: 4px;
  font-size: 0.72rem;
}

.scratch-final-review-check button {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #dcefe3;
  border-radius: 12px;
  color: #1db16f;
  background: #fff;
  font-weight: 800;
}

.scratch-final-review-summary-grid,
.scratch-final-review-bottom-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.scratch-final-review-bottom-grid {
  grid-template-columns: minmax(0, 1fr) minmax(320px, 1fr);
}

.scratch-final-review-list,
.scratch-final-review-docs,
.scratch-final-review-approvals,
.scratch-final-review-experience {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.scratch-final-review-list article,
.scratch-final-review-docs article,
.scratch-final-review-approvals article,
.scratch-final-review-experience article,
.scratch-final-review-side__stats article {
  justify-content: space-between;
  gap: 12px;
}

.scratch-final-review-list article,
.scratch-final-review-side__stats article {
  padding-bottom: 10px;
  border-bottom: 1px solid #edf1f8;
}

.scratch-final-review-list article:last-child,
.scratch-final-review-side__stats article:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.scratch-final-review-list article,
.scratch-final-review-docs article,
.scratch-final-review-approvals article,
.scratch-final-review-experience article {
  display: flex;
  align-items: center;
}

.scratch-final-review-link,
.scratch-final-review-outline {
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 40px;
  margin-top: 16px;
  border-radius: 12px;
  font-weight: 800;
}

.scratch-final-review-link {
  border: 0;
  color: #4e60ff;
  background: #fff;
}

.scratch-final-review-docs small {
  display: block;
  margin-bottom: 6px;
}

.scratch-final-review-docs small em {
  padding-left: 6px;
  color: #16a765;
  font-style: normal;
}

.scratch-final-review-docs article span,
.scratch-final-review-experience article {
  color: #51627f;
  font-size: 0.8rem;
}

.scratch-final-review-approval-lead {
  gap: 10px;
  margin-top: 14px;
  padding: 14px;
  border-radius: 16px;
  color: #16a765;
  background: #effcf4;
}

.scratch-final-review-approval-lead strong,
.scratch-final-review-experience strong {
  display: block;
  font-size: 0.84rem;
}

.scratch-final-review-approval-lead small,
.scratch-final-review-approvals small,
.scratch-final-review-experience small {
  display: block;
  margin-top: 4px;
  font-size: 0.72rem;
}

.scratch-final-review-approvals article span,
.scratch-final-review-experience article span {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6f59fa;
  background: #f5f1ff;
}

.scratch-final-review-approvals article > div,
.scratch-final-review-experience article > div {
  min-width: 0;
}

.scratch-final-review-approvals article > small {
  margin-left: auto;
}

.scratch-final-review-side__market {
  width: 94px;
  min-height: 88px;
  margin-top: 14px;
  border: 1px solid #ffd6e6;
  border-radius: 18px;
  display: grid;
  place-content: center;
  color: #ff2d87;
  background: linear-gradient(180deg, #fff8fb 0%, #fff 100%);
  text-align: center;
}

.scratch-final-review-side__market strong {
  color: #ff2d87;
  font-size: 2rem;
  font-weight: 800;
}

.scratch-final-review-side__market span {
  display: block;
  margin-top: 4px;
  color: #ff5aa6;
  font-size: 0.72rem;
  font-weight: 700;
}

.scratch-final-review-side__comp {
  margin-top: 18px;
}

.scratch-final-review-side__comp strong {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  color: #1d2b49;
}

.scratch-final-review-side__comp strong span {
  color: #1d2b49;
  font-size: 2.1rem;
  font-weight: 800;
}

.scratch-final-review-side__comp strong svg {
  color: #7d8ba4;
}

.scratch-final-review-side__comp > span {
  display: block;
  margin-top: 8px;
  font-size: 0.88rem;
  font-weight: 700;
}

.scratch-final-review-side__comp-line em {
  padding: 0 8px;
  color: #9eabc1;
  font-style: normal;
}

.scratch-final-review-side__comp > span:last-child {
  display: none;
}

.scratch-final-review-side__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.scratch-final-review-side__stats article {
  display: grid;
  align-items: start;
  gap: 6px;
  min-height: 94px;
  padding: 14px 12px;
  border: 1px solid #edf6ef;
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfffc 0%, #f5fdf7 100%);
}

.scratch-final-review-side__stats strong {
  margin-top: 2px;
  color: #16a765;
  font-size: 1.8rem;
  line-height: 1;
}

.scratch-final-review-side__stats small {
  color: #16a765;
  font-size: 0.82rem;
  font-weight: 800;
}

.scratch-final-review-outline {
  border: 1px solid #dfe6f2;
  color: #4c5f82;
  background: #fff;
}

.scratch-final-review-footer {
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.scratch-final-review-footer__actions {
  gap: 12px;
  margin-left: auto;
}

.scratch-final-review-button {
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

.scratch-final-review-button.is-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
  box-shadow: 0 18px 30px rgba(255, 31, 124, 0.22);
}

@media (max-width: 1420px) {
  .scratch-final-review-layout,
  .scratch-final-review-summary-grid,
  .scratch-final-review-bottom-grid {
    grid-template-columns: 1fr;
  }

  .scratch-final-review-snapshot__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .scratch-final-review-snapshot__candidate,
  .scratch-final-review-check {
    grid-column: span 2;
    grid-row: auto;
  }
}

@media (max-width: 920px) {
  .scratch-final-review-shell {
    padding: 12px;
  }

  .scratch-final-review-header,
  .scratch-final-review-footer,
  .scratch-final-review-footer__actions,
  .scratch-final-review-header__actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .scratch-final-review-snapshot__grid {
    grid-template-columns: 1fr;
  }

  .scratch-final-review-snapshot__candidate,
  .scratch-final-review-check {
    grid-column: auto;
  }

  .scratch-final-review-save,
  .scratch-final-review-more,
  .scratch-final-review-close,
  .scratch-final-review-button {
    width: 100%;
    justify-content: center;
  }

  .scratch-final-review-list article,
  .scratch-final-review-docs article,
  .scratch-final-review-approvals article,
  .scratch-final-review-experience article {
    align-items: flex-start;
  }
}
</style>
