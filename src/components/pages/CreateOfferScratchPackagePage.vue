<script setup>
import { computed } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import NitroSyncLogo from '../shared/NitroSyncLogo.vue'
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

const emit = defineEmits(['back', 'open-source', 'open-review-send'])

const job = computed(() => getJobById(props.jobId))

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const finalReviewHref = computed(() => {
  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'scratch-final-review',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  return `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
})

const documents = [
  ['Offer Letter', 'Required'],
  ['Employment Agreement', 'Required'],
  ['Benefits Summary', 'Required'],
  ['Equity Agreement', 'Required'],
  ['Company Policies', 'Optional'],
  ['Welcome Guide', 'Optional'],
]

const experienceItems = [
  'Review offer details',
  'Review & sign documents',
  'Provide feedback',
]

const approvers = [
  ['Hiring Manager', 'Sarah Johnson', 'Approved'],
  ['Finance', 'Daniel Lee', 'Pending'],
  ['Legal', 'Priya Patel', 'Pending'],
]

const includedRows = [
  ['Base Salary', '$145,000'],
  ['Annual Bonus', '12%'],
  ['Equity (RSUs)', '750 RSUs'],
  ['Signing Bonus', '$10,000'],
  ['Benefits Package', 'Standard US Benefits'],
  ['Relocation Support', '$5,000'],
  ['Work Arrangement', 'Hybrid'],
  ['Start Date', 'June 16, 2025'],
]
</script>

<template>
  <main class="offer-package-scratch-page">
    <section class="offer-package-scratch-shell">
      <header class="offer-package-scratch-header">
        <div class="offer-package-scratch-header__copy">
          <div class="offer-package-scratch-breadcrumb">Offers <span>&gt;</span> Create Offer</div>
          <div class="offer-package-scratch-header__title">
            <h1>Create Offer from Scratch</h1>
            <AppIcon name="sparkles" :size="17" />
          </div>
          <p>Step 5 of 7 - Build your offer package</p>
        </div>

        <div class="offer-package-scratch-header__actions">
          <button class="offer-package-scratch-save" type="button">
            <AppIcon name="document" :size="14" />
            <span>Save draft</span>
          </button>
          <button class="offer-package-scratch-close" type="button" aria-label="Close" @click="emit('back')">
            <AppIcon name="close" :size="18" />
          </button>
        </div>
      </header>

      <nav class="offer-package-scratch-stepper">
        <div class="offer-package-scratch-step is-done"><span><AppIcon name="checkCircle" :size="13" /></span><div><strong>Offer Foundation</strong><small>Basic information</small></div></div>
        <i class="offer-package-scratch-stepper__line" />
        <div class="offer-package-scratch-step is-done"><span><AppIcon name="checkCircle" :size="13" /></span><div><strong>Compensation</strong><small>Salary, bonus, equity</small></div></div>
        <i class="offer-package-scratch-stepper__line" />
        <div class="offer-package-scratch-step is-done"><span><AppIcon name="checkCircle" :size="13" /></span><div><strong>Benefits &amp; Terms</strong><small>Benefits and conditions</small></div></div>
        <i class="offer-package-scratch-stepper__line" />
        <div class="offer-package-scratch-step is-done"><span><AppIcon name="checkCircle" :size="13" /></span><div><strong>AI Review</strong><small>Offer intelligence</small></div></div>
        <i class="offer-package-scratch-stepper__line" />
        <div class="offer-package-scratch-step is-active"><span>5</span><div><strong>Offer Package</strong><small>Documents &amp; experience</small></div></div>
        <i class="offer-package-scratch-stepper__line" />
        <div class="offer-package-scratch-step"><span>6</span><div><strong>Final Review</strong><small>Review before launch</small></div></div>
        <i class="offer-package-scratch-stepper__line" />
        <div class="offer-package-scratch-step"><span>7</span><div><strong>Launch</strong><small>Send offer</small></div></div>
      </nav>

      <section class="offer-package-scratch-layout">
        <section class="offer-package-scratch-main">
          <article class="offer-package-scratch-card offer-package-scratch-intro">
            <h2>Build Offer Package</h2>
            <p>Review and customize the documents and candidate experience.</p>
          </article>

          <section class="offer-package-scratch-grid">
            <article class="offer-package-scratch-card offer-package-scratch-documents">
              <div class="offer-package-scratch-panel-head">
                <div>
                  <strong>Documents in Offer Package (6)</strong>
                  <small>These documents will be shared with {{ props.candidateName.split(' ')[0] }} for review and e-signature.</small>
                </div>
                <button type="button">Manage documents</button>
              </div>

              <div class="offer-package-scratch-documents__list">
                <article v-for="item in documents" :key="item[0]">
                  <div class="offer-package-scratch-documents__name">
                    <AppIcon name="document" :size="14" />
                    <strong>{{ item[0] }}</strong>
                    <em>{{ item[1] }}</em>
                  </div>
                  <button type="button" class="offer-package-scratch-inline-link">
                    <AppIcon name="eye" :size="13" />
                    <span>Preview</span>
                  </button>
                  <button type="button" class="offer-package-scratch-icon-button">
                    <AppIcon name="more" :size="14" />
                  </button>
                </article>
              </div>

              <button type="button" class="offer-package-scratch-add-doc">
                <AppIcon name="plus" :size="16" />
                <div>
                  <strong>Add document</strong>
                  <small>Upload or choose from templates</small>
                </div>
              </button>
            </article>

            <article class="offer-package-scratch-card offer-package-scratch-preview">
              <div class="offer-package-scratch-panel-head">
                <div>
                  <strong>Candidate Experience Preview</strong>
                  <small>This is how Marvin will experience the offer.</small>
                </div>
              </div>

              <div class="offer-package-scratch-preview__mail">
                <NitroSyncLogo size="xs" :show-tagline="false" />
                <div>
                  <small>to marvin.mckinney@email.com</small>
                </div>
              </div>

              <div class="offer-package-scratch-preview__message">
                <strong>Hi Marvin,</strong>
                <p>We're excited to extend this offer to you! Please review the offer details and documents. You can sign electronically and let us know if you have any questions.</p>
              </div>

              <div class="offer-package-scratch-preview__steps">
                <article v-for="item in experienceItems" :key="item">
                  <span><AppIcon name="document" :size="14" /></span>
                  <div>
                    <strong>{{ item }}</strong>
                    <small v-if="item === 'Review offer details'">See your compensation, benefits and terms</small>
                    <small v-else-if="item === 'Review & sign documents'">All documents can be signed electronically</small>
                    <small v-else>Ask questions or request changes if needed</small>
                  </div>
                </article>
              </div>

              <button type="button" class="offer-package-scratch-preview__cta">
                <span>View full candidate experience</span>
                <AppIcon name="external-link" :size="13" />
              </button>
            </article>
          </section>

          <section class="offer-package-scratch-bottom">
            <article class="offer-package-scratch-card offer-package-scratch-approvals">
              <div class="offer-package-scratch-panel-head">
                <div>
                  <strong>Approval Workflow</strong>
                  <small>This offer will be sent for approval before it's sent to Marvin.</small>
                </div>
                <button type="button">View workflow</button>
              </div>

              <div class="offer-package-scratch-approvals__list">
                <article v-for="item in approvers" :key="item[0]">
                  <div class="offer-package-scratch-approvals__avatar">{{ item[1].split(' ').map((word) => word[0]).join('').slice(0, 2) }}</div>
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                  <em :class="{ 'is-approved': item[2] === 'Approved', 'is-pending': item[2] === 'Pending' }">{{ item[2] }}</em>
                </article>
              </div>
            </article>

            <article class="offer-package-scratch-card offer-package-scratch-notes">
              <strong>Notes to Approvers</strong>
              <small>Add a note that will be visible to approvers.</small>
              <textarea rows="4" placeholder="Write your note here..." />
            </article>
          </section>
        </section>

        <aside class="offer-package-scratch-side">
          <article class="offer-package-scratch-card offer-package-scratch-summary">
            <div class="offer-package-scratch-summary__head">
              <strong>Offer Summary</strong>
              <button type="button">Edit</button>
            </div>

            <div class="offer-package-scratch-summary__candidate">
              <span class="offer-package-scratch-summary__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <small>{{ candidateRole }}</small>
                <small>{{ job.department }} <span>&bull;</span> Full-time</small>
                <small>San Francisco, CA (Hybrid)</small>
              </div>
            </div>

            <div class="offer-package-scratch-summary__package">
              <div>
                <small>Total Annual Compensation</small>
                <strong>$165,000</strong>
                <span>$145,000 base + $20,000 variable</span>
              </div>
              <div class="offer-package-scratch-summary__badge">
                <strong>P62</strong>
                <small>Market Position</small>
              </div>
            </div>

            <div class="offer-package-scratch-summary__stats">
              <article><span>AI Confidence</span><strong>95%</strong></article>
              <article><span>Est. Acceptance</span><strong>94%</strong></article>
              <article><span>Offer Health</span><em>Excellent</em></article>
            </div>
          </article>

          <article class="offer-package-scratch-card offer-package-scratch-included">
            <div class="offer-package-scratch-summary__head">
              <strong>What's Included</strong>
              <button type="button">Edit</button>
            </div>

            <div class="offer-package-scratch-included__list">
              <article v-for="item in includedRows" :key="item[0]">
                <span><AppIcon name="document" :size="13" /> {{ item[0] }}</span>
                <strong>{{ item[1] }}</strong>
              </article>
            </div>

            <button type="button" class="offer-package-scratch-outline">
              <span>View full offer details</span>
              <AppIcon name="external-link" :size="13" />
            </button>
          </article>
        </aside>
      </section>

      <footer class="offer-package-scratch-footer">
        <button type="button" class="offer-package-scratch-footer__button" @click="emit('open-source')">Back</button>
        <div class="offer-package-scratch-footer__actions">
          <button type="button" class="offer-package-scratch-footer__button">Save draft</button>
          <a class="offer-package-scratch-footer__button is-primary" :href="finalReviewHref">
            <span>Continue</span>
            <AppIcon name="chevronRight" :size="15" />
          </a>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.offer-package-scratch-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(255, 77, 155, 0.1), transparent 24%),
    linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.offer-package-scratch-shell {
  width: min(100%, 1800px);
  margin: 0 auto;
  padding: 18px 20px 22px;
}

.offer-package-scratch-card,
.offer-package-scratch-header,
.offer-package-scratch-stepper {
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 36px rgba(255, 76, 146, 0.06);
}

.offer-package-scratch-header,
.offer-package-scratch-header__actions,
.offer-package-scratch-save,
.offer-package-scratch-header__title,
.offer-package-scratch-stepper,
.offer-package-scratch-step,
.offer-package-scratch-panel-head,
.offer-package-scratch-documents__list article,
.offer-package-scratch-documents__name,
.offer-package-scratch-inline-link,
.offer-package-scratch-preview__mail,
.offer-package-scratch-preview__steps article,
.offer-package-scratch-preview__cta,
.offer-package-scratch-approvals__list article,
.offer-package-scratch-summary__head,
.offer-package-scratch-summary__candidate,
.offer-package-scratch-summary__package,
.offer-package-scratch-summary__stats,
.offer-package-scratch-included__list article,
.offer-package-scratch-footer,
.offer-package-scratch-footer__actions,
.offer-package-scratch-footer__button,
.offer-package-scratch-outline {
  display: flex;
  align-items: center;
}

.offer-package-scratch-header {
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
}

.offer-package-scratch-breadcrumb {
  color: #96a2b6;
  font-size: 0.78rem;
  font-weight: 700;
}

.offer-package-scratch-breadcrumb span {
  padding: 0 6px;
}

.offer-package-scratch-header__title {
  gap: 8px;
  margin-top: 4px;
  color: #ff3a95;
}

.offer-package-scratch-header__title h1,
.offer-package-scratch-intro h2,
.offer-package-scratch-panel-head strong,
.offer-package-scratch-summary__head strong {
  margin: 0;
  color: #1c2b4a;
  font-weight: 800;
}

.offer-package-scratch-header__title h1 {
  font-size: 2.2rem;
  line-height: 1.04;
}

.offer-package-scratch-header__copy p,
.offer-package-scratch-intro p,
.offer-package-scratch-panel-head small,
.offer-package-scratch-preview__mail small,
.offer-package-scratch-preview__message p,
.offer-package-scratch-preview__steps small,
.offer-package-scratch-notes small,
.offer-package-scratch-summary__candidate small,
.offer-package-scratch-summary__package small,
.offer-package-scratch-summary__package span,
.offer-package-scratch-summary__stats span,
.offer-package-scratch-step small {
  color: #8490a8;
}

.offer-package-scratch-header__actions {
  gap: 12px;
}

.offer-package-scratch-save {
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  color: #1d2b49;
  background: #fff;
  font-weight: 800;
}

.offer-package-scratch-close {
  width: 42px;
  min-height: 42px;
  border: 0;
  border-radius: 12px;
  color: #8794ab;
  background: transparent;
}

.offer-package-scratch-stepper {
  gap: 12px;
  margin-top: 14px;
  padding: 10px 12px;
  overflow-x: auto;
}

.offer-package-scratch-step {
  position: relative;
  gap: 10px;
  min-width: max-content;
  color: #94a1b8;
}

.offer-package-scratch-step span {
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

.offer-package-scratch-step strong {
  display: block;
  font-size: 0.82rem;
}

.offer-package-scratch-step small {
  display: block;
  margin-top: 2px;
  font-size: 0.68rem;
}

.offer-package-scratch-step.is-done span {
  border-color: #caefd9;
  color: #1db16f;
  background: #f2fcf7;
}

.offer-package-scratch-step.is-active {
  color: #ff2d87;
}

.offer-package-scratch-step.is-active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -11px;
  left: 0;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff4299 0%, #ff1f7c 100%);
}

.offer-package-scratch-step.is-active span {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
}

.offer-package-scratch-step.is-active strong,
.offer-package-scratch-step.is-active small {
  color: #ff2d87;
}

.offer-package-scratch-stepper__line {
  width: 34px;
  height: 1px;
  flex: 0 0 auto;
  background: #dfe5f0;
}

.offer-package-scratch-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.62fr) 360px;
  gap: 18px;
  margin-top: 18px;
  align-items: start;
}

.offer-package-scratch-main,
.offer-package-scratch-side {
  display: grid;
  gap: 16px;
}

.offer-package-scratch-intro,
.offer-package-scratch-documents,
.offer-package-scratch-preview,
.offer-package-scratch-approvals,
.offer-package-scratch-notes,
.offer-package-scratch-summary,
.offer-package-scratch-included {
  padding: 16px;
}

.offer-package-scratch-intro h2 {
  font-size: 1.24rem;
}

.offer-package-scratch-grid,
.offer-package-scratch-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 16px;
}

.offer-package-scratch-panel-head {
  justify-content: space-between;
  gap: 12px;
}

.offer-package-scratch-panel-head button {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  color: #4f6290;
  background: #fff;
  font-weight: 800;
}

.offer-package-scratch-documents__list {
  display: grid;
  gap: 0;
  margin-top: 14px;
}

.offer-package-scratch-documents__list article {
  gap: 10px;
  justify-content: space-between;
  padding: 14px 0;
  border-top: 1px solid #edf1f8;
}

.offer-package-scratch-documents__list article:first-child {
  border-top: 0;
  padding-top: 0;
}

.offer-package-scratch-documents__name {
  gap: 8px;
}

.offer-package-scratch-documents__name strong,
.offer-package-scratch-preview__message strong,
.offer-package-scratch-preview__steps strong,
.offer-package-scratch-approvals__list strong,
.offer-package-scratch-included__list strong {
  color: #1c2b4a;
}

.offer-package-scratch-documents__name em {
  min-height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #7f8ea6;
  background: #f4f6fb;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.offer-package-scratch-inline-link,
.offer-package-scratch-icon-button {
  border: 0;
  color: #687896;
  background: transparent;
}

.offer-package-scratch-inline-link {
  gap: 6px;
  font-weight: 700;
}

.offer-package-scratch-icon-button {
  width: 28px;
  height: 28px;
  border-radius: 10px;
}

.offer-package-scratch-add-doc {
  width: 100%;
  margin-top: 14px;
  padding: 16px;
  border: 1px solid #ffd6e8;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ff2d87;
  background: linear-gradient(180deg, #fff9fc 0%, #fff 100%);
  text-align: left;
}

.offer-package-scratch-add-doc strong {
  display: block;
  font-size: 0.92rem;
}

.offer-package-scratch-add-doc small {
  display: block;
  margin-top: 4px;
  color: #8da0bb;
  font-size: 0.72rem;
}

.offer-package-scratch-preview__mail {
  gap: 10px;
  align-items: flex-start;
  margin-top: 14px;
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
}

.offer-package-scratch-preview__message {
  margin-top: 14px;
}

.offer-package-scratch-preview__message p {
  margin: 8px 0 0;
  font-size: 0.78rem;
  line-height: 1.55;
}

.offer-package-scratch-preview__steps {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.offer-package-scratch-preview__steps article {
  gap: 10px;
}

.offer-package-scratch-preview__steps span {
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6f59fa;
  background: #f5f1ff;
}

.offer-package-scratch-preview__steps strong {
  display: block;
  font-size: 0.84rem;
}

.offer-package-scratch-preview__steps small {
  display: block;
  margin-top: 4px;
  color: #8da0bb;
  font-size: 0.72rem;
}

.offer-package-scratch-preview__cta {
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 42px;
  margin-top: 16px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
  font-weight: 800;
}

.offer-package-scratch-approvals__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.offer-package-scratch-approvals__list article {
  gap: 10px;
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
}

.offer-package-scratch-approvals__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffe0ba 0%, #ffc781 100%);
  color: #5c3812;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-package-scratch-approvals__list strong {
  display: block;
  font-size: 0.82rem;
}

.offer-package-scratch-approvals__list small {
  display: block;
  margin-top: 3px;
  color: #8da0bb;
  font-size: 0.7rem;
}

.offer-package-scratch-approvals__list em {
  margin-left: auto;
  font-style: normal;
  font-size: 0.66rem;
  font-weight: 800;
}

.offer-package-scratch-approvals__list em.is-approved {
  color: #16a765;
}

.offer-package-scratch-approvals__list em.is-pending {
  color: #f59e0b;
}

.offer-package-scratch-notes textarea {
  width: 100%;
  margin-top: 14px;
  padding: 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  resize: vertical;
  color: #1c2b4a;
  background: #fff;
}

.offer-package-scratch-summary__head {
  justify-content: space-between;
}

.offer-package-scratch-summary__head button {
  border: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.76rem;
  font-weight: 800;
}

.offer-package-scratch-summary__candidate {
  gap: 12px;
  margin-top: 14px;
}

.offer-package-scratch-summary__avatar {
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

.offer-package-scratch-summary__candidate strong {
  display: block;
  font-size: 1rem;
  color: #1c2b4a;
}

.offer-package-scratch-summary__candidate small {
  display: block;
  margin-top: 3px;
  font-size: 0.74rem;
}

.offer-package-scratch-summary__candidate small span {
  padding: 0 5px;
}

.offer-package-scratch-summary__package {
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #edf1f8;
}

.offer-package-scratch-summary__package strong {
  display: block;
  margin-top: 6px;
  color: #ff2d87;
  font-size: 2rem;
}

.offer-package-scratch-summary__package small,
.offer-package-scratch-summary__package span {
  display: block;
  font-size: 0.72rem;
}

.offer-package-scratch-summary__badge {
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

.offer-package-scratch-summary__badge strong {
  color: #ff2d87;
  font-size: 1.5rem;
}

.offer-package-scratch-summary__badge small {
  margin-top: 4px;
  font-size: 0.66rem;
}

.offer-package-scratch-summary__stats {
  gap: 0;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #edf1f8;
}

.offer-package-scratch-summary__stats article {
  flex: 1 1 0;
}

.offer-package-scratch-summary__stats span,
.offer-package-scratch-summary__stats strong,
.offer-package-scratch-summary__stats em {
  display: block;
  font-size: 0.72rem;
}

.offer-package-scratch-summary__stats strong {
  margin-top: 4px;
  color: #16a765;
  font-size: 1.1rem;
}

.offer-package-scratch-summary__stats em {
  margin-top: 4px;
  color: #16a765;
  font-style: normal;
  font-weight: 800;
}

.offer-package-scratch-included__list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.offer-package-scratch-included__list article {
  justify-content: space-between;
  gap: 12px;
}

.offer-package-scratch-included__list span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #51627f;
  font-size: 0.8rem;
}

.offer-package-scratch-included__list strong {
  color: #1c2b4a;
  font-size: 0.8rem;
}

.offer-package-scratch-outline {
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 40px;
  margin-top: 16px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  color: #4c5f82;
  background: #fff;
  font-weight: 800;
}

.offer-package-scratch-footer {
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.offer-package-scratch-footer__actions {
  gap: 12px;
  margin-left: auto;
}

.offer-package-scratch-footer__button {
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

.offer-package-scratch-footer__button.is-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
  box-shadow: 0 18px 30px rgba(255, 31, 124, 0.22);
}

@media (max-width: 1320px) {
  .offer-package-scratch-layout,
  .offer-package-scratch-grid,
  .offer-package-scratch-bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 920px) {
  .offer-package-scratch-shell {
    padding: 12px;
  }

  .offer-package-scratch-header,
  .offer-package-scratch-footer,
  .offer-package-scratch-footer__actions,
  .offer-package-scratch-summary__stats,
  .offer-package-scratch-approvals__list {
    display: grid;
    grid-template-columns: 1fr;
  }

  .offer-package-scratch-save,
  .offer-package-scratch-footer__button {
    width: 100%;
    justify-content: center;
  }
}
</style>
