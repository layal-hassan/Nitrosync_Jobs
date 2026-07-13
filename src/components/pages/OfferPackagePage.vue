<script setup>
import { computed } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import NitroSyncLogo from '../shared/NitroSyncLogo.vue'

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

const emit = defineEmits(['back', 'open-source', 'open-review-ai-offer', 'open-offer-details', 'open-review-send'])

const candidateFirstName = computed(() => props.candidateName.split(' ')[0] || 'Marvin')
const candidateEmail = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .join('.')
))

const communicationFlow = [
  { title: 'Offer Email', subtitle: 'Instantly', action: 'Preview', icon: 'mail', tone: 'pink' },
  { title: 'Secure Link', subtitle: 'Candidate clicks', action: 'Preview', icon: 'link', tone: 'violet' },
  { title: 'Secure Signing', subtitle: 'DocuSign', action: 'Configured', icon: 'edit', tone: 'blue' },
  { title: 'Confirmation', subtitle: 'After signing', action: 'Preview', icon: 'checkCircle', tone: 'green' },
  { title: 'Welcome Email', subtitle: 'Onboarding info', action: 'Preview', icon: 'users', tone: 'orange' },
]

const documentsRows = [
  { title: 'Offer Letter', type: 'PDF', status: 'Required' },
  { title: 'Employment Contract', type: 'DOC', status: 'Required' },
  { title: 'Benefits Guide', type: 'PDF', status: 'Optional' },
  { title: 'NDA', type: 'PDF', status: 'Required' },
  { title: 'Equity Agreement', type: 'PDF', status: 'Optional' },
]

const reminderRows = [
  { title: 'Reminder emails', value: 'Enabled', icon: 'bell', control: 'toggle' },
  { title: 'Reminder cadence', value: 'Every 48 hours', icon: 'clock', control: 'dropdown' },
  { title: 'Offer expires in', value: '7 days', icon: 'calendar', control: 'dropdown' },
  { title: 'Time zone', value: 'Candidate time zone', icon: 'clock', control: 'dropdown' },
]

const recipientsRows = computed(() => [
  {
    name: `${props.candidateName} (Candidate)`,
    detail: 'Receives full offer package',
    badge: 'Primary',
    tone: 'pink',
    initials: candidateFirstName.value.slice(0, 1) + (props.candidateName.split(' ')[1]?.[0] || 'C'),
  },
  { name: 'HR Team', detail: 'Receives signed package', badge: 'Internal', tone: 'violet', initials: 'HR' },
  { name: 'Finance Team', detail: 'Receives compensation summary', badge: 'Internal', tone: 'orange', initials: 'FN' },
  { name: 'Hiring Manager (Sarah Johnson)', detail: 'Receives copy of signed offer', badge: 'CC', tone: 'green', initials: 'SJ' },
])

const deliverySummaryRows = [
  { label: 'Delivery method', value: 'Email + DocuSign', icon: 'mail' },
  { label: 'Estimated completion', value: '1-2 days', icon: 'clock' },
  { label: 'Offer expires', value: 'May 24, 2025 (7 days)', icon: 'calendar' },
  { label: 'Language', value: 'English', icon: 'message' },
  { label: 'Recipients', value: '4', icon: 'users' },
  { label: 'Documents', value: '5', icon: 'document' },
]

const integrationRows = [
  ['Account', 'NitroSync Inc.'],
  ['Envelope type', 'Standard'],
  ['Signing order', '1 signer'],
  ['Authentication', 'Email'],
]

const complianceRows = [
  'Electronic signatures compliant',
  'Data encrypted in transit and at rest',
  'GDPR compliant',
  'Audit trail enabled',
]

const validationRows = [
  'All required documents included',
  'Signatures configured correctly',
  'Compensation matches offer details',
  'Company branding applied',
  'Country compliance verified',
  'Candidate information verified',
]
</script>

<template>
  <Teleport to="body">
    <main class="offer-delivery-page" @click.self="emit('back')">
      <section class="offer-delivery-shell" @click.stop>
        <header class="offer-delivery-card offer-delivery-header">
          <div class="offer-delivery-header__top">
            <div class="offer-delivery-header__title">
              <button class="offer-delivery-back-icon" type="button" @click="emit('open-offer-details')" aria-label="Back">
                <AppIcon name="chevronLeft" :size="16" />
              </button>
              <div>
                <h1>Create Offer</h1>
                <h2>Offer Package</h2>
                <p>Review the documents, candidate experience, and delivery setup before sending the offer.</p>
              </div>
            </div>

            <div class="offer-delivery-header__actions">
              <button class="offer-delivery-save-top" type="button">
                <AppIcon name="document" :size="14" />
                <span>Save draft</span>
              </button>
              <button class="offer-delivery-close" type="button" aria-label="Close" @click="emit('back')">
                <AppIcon name="close" :size="18" />
              </button>
            </div>
          </div>

          <div class="offer-delivery-stepper">
            <button class="offer-delivery-step is-done" type="button" @click="emit('open-source')">
              <span><AppIcon name="checkCircle" :size="13" /></span>
              <div><strong>Template</strong><small>Senior Frontend Engineer</small></div>
            </button>
            <div class="offer-delivery-step-line" />
            <button class="offer-delivery-step is-done" type="button" @click="emit('open-source')">
              <span><AppIcon name="checkCircle" :size="13" /></span>
              <div><strong>AI Mapping</strong><small>97% match</small></div>
            </button>
            <div class="offer-delivery-step-line" />
            <button class="offer-delivery-step is-done" type="button" @click="emit('open-review-ai-offer')">
              <span><AppIcon name="checkCircle" :size="13" /></span>
              <div><strong>Review &amp; Edit</strong><small>8 sections</small></div>
            </button>
            <div class="offer-delivery-step-line" />
            <button class="offer-delivery-step is-done" type="button" @click="emit('open-offer-details')">
              <span><AppIcon name="checkCircle" :size="13" /></span>
              <div><strong>Offer Details</strong><small>Completed</small></div>
            </button>
            <div class="offer-delivery-step-line" />
            <div class="offer-delivery-step is-active">
              <span>5</span>
              <div><strong>Offer Package</strong><small>Documents &amp; experience</small></div>
            </div>
            <div class="offer-delivery-step-line" />
            <button class="offer-delivery-step" type="button" @click="emit('open-review-send')">
              <span>6</span>
              <div><strong>Final Review</strong><small>Last step</small></div>
            </button>
          </div>
        </header>

        <div class="offer-delivery-layout">
          <section class="offer-delivery-workspace">
            <article class="offer-delivery-card offer-delivery-panel offer-delivery-panel--flow">
              <div class="offer-delivery-panel__head">
                <h3>1. Candidate Communication Flow</h3>
                <small>This is the journey {{ candidateFirstName }} will experience.</small>
              </div>

              <div class="offer-delivery-flow">
                <article v-for="(item, index) in communicationFlow" :key="item.title" class="offer-delivery-flow__item">
                  <span class="offer-delivery-flow__icon" :class="`is-${item.tone}`">
                    <AppIcon :name="item.icon" :size="16" />
                  </span>
                  <i v-if="index < communicationFlow.length - 1" class="offer-delivery-flow__dash" />
                  <strong>{{ index + 1 }}</strong>
                  <span class="offer-delivery-flow__label">{{ item.title }}</span>
                  <small>{{ item.subtitle }}</small>
                  <button type="button" :class="{ 'is-ready': item.action === 'Configured' }">{{ item.action }}</button>
                </article>
              </div>

              <div class="offer-delivery-note">
                <AppIcon name="info" :size="14" />
                <span>The signing step is handled by DocuSign. NitroSync will manage all communications before and after signing.</span>
              </div>
            </article>

            <div class="offer-delivery-detail-grid">
              <article class="offer-delivery-card offer-delivery-panel">
                <div class="offer-delivery-panel__head">
                  <h3>3. Documents &amp; Signing</h3>
                  <small>Documents will be sent to DocuSign for secure signing.</small>
                </div>

                <div class="offer-delivery-docs">
                  <article v-for="row in documentsRows" :key="row.title">
                    <div class="offer-delivery-docs__left">
                      <AppIcon name="document" :size="14" />
                      <div>
                        <strong>{{ row.title }}</strong>
                        <small>{{ row.type }}</small>
                      </div>
                    </div>
                    <span>{{ row.status }}</span>
                    <AppIcon name="checkCircle" :size="14" />
                  </article>
                </div>

                <button class="offer-delivery-link-button" type="button">
                  <span>View all documents</span>
                  <AppIcon name="external-link" :size="13" />
                </button>
              </article>

              <article class="offer-delivery-card offer-delivery-panel">
                <div class="offer-delivery-panel__head">
                  <h3>4. Reminders &amp; Expiration</h3>
                  <small>Auto follow-ups and expiration rules.</small>
                </div>

                <div class="offer-delivery-reminders">
                  <article v-for="row in reminderRows" :key="row.title">
                    <div class="offer-delivery-reminders__left">
                      <span class="offer-delivery-reminders__icon">
                        <AppIcon :name="row.icon" :size="14" />
                      </span>
                      <div>
                        <strong>{{ row.title }}</strong>
                        <small>{{ row.value }}</small>
                      </div>
                    </div>
                    <span v-if="row.control === 'toggle'" class="offer-delivery-toggle"><i /></span>
                    <button v-else type="button">
                      <AppIcon name="chevronDown" :size="14" />
                    </button>
                  </article>
                </div>

                <div class="offer-delivery-reminder-note">
                  <AppIcon name="bell" :size="13" />
                  <span>{{ candidateFirstName }} will receive a reminder every 48 hours until the offer is signed or expires.</span>
                </div>
              </article>

              <article class="offer-delivery-card offer-delivery-panel">
                <div class="offer-delivery-panel__head is-spread">
                  <div>
                    <h3>5. Recipients</h3>
                    <small>4 recipients</small>
                  </div>
                </div>

                <div class="offer-delivery-recipients">
                  <article v-for="row in recipientsRows" :key="row.name">
                    <div class="offer-delivery-recipients__head">
                      <span class="offer-delivery-recipient-avatar" :class="`is-${row.tone}`">{{ row.initials }}</span>
                      <div>
                        <strong>{{ row.name }}</strong>
                        <small>{{ row.detail }}</small>
                      </div>
                    </div>
                    <em :class="`is-${row.tone}`">{{ row.badge }}</em>
                    <button type="button"><AppIcon name="more" :size="14" /></button>
                  </article>
                </div>
              </article>
            </div>

            <article class="offer-delivery-card offer-delivery-validation">
              <div class="offer-delivery-validation__score">
                <div class="offer-delivery-validation__ring">
                  <div>
                    <strong>98%</strong>
                    <small>Excellent</small>
                  </div>
                </div>
                <span>Package Validation</span>
              </div>

              <div class="offer-delivery-validation__list">
                <article v-for="row in validationRows" :key="row">
                  <AppIcon name="checkCircle" :size="14" />
                  <span>{{ row }}</span>
                </article>
              </div>

              <div class="offer-delivery-validation__status">
                <AppIcon name="shield" :size="18" />
                <strong>No issues detected.</strong>
                <small>Your offer is ready to send!</small>
              </div>
            </article>
          </section>

          <aside class="offer-delivery-sidebar">
            <article class="offer-delivery-card offer-delivery-panel offer-delivery-panel--preview">
              <div class="offer-delivery-panel__head is-spread">
                <div>
                  <h3>2. Offer Email Preview</h3>
                  <small>This is the email {{ candidateFirstName }} will receive.</small>
                </div>
                <button class="offer-delivery-mini-select" type="button">
                  <span>Desktop</span>
                  <AppIcon name="chevronDown" :size="13" />
                </button>
              </div>

              <div class="offer-delivery-preview">
                <div class="offer-delivery-preview__brand">
                  <NitroSyncLogo size="xs" :show-tagline="false" />
                  <div>
                    <small>To: {{ candidateEmail }}@email.com</small>
                    <small>Subject: Your offer from NitroSync</small>
                  </div>
                </div>

                <div class="offer-delivery-preview__email">
                  <div class="offer-delivery-preview__hero">
                    <strong>Hello {{ candidateFirstName }},</strong>
                    <p>We are excited to extend an offer to join NitroSync as {{ candidateRole }}.</p>
                  </div>

                  <div class="offer-delivery-preview__meta">
                    <span>Position</span>
                    <strong>{{ candidateRole }}</strong>
                    <span>Start Date</span>
                    <strong>June 16, 2025</strong>
                    <span>Offer Expires</span>
                    <strong>May 24, 2025 (7 days)</strong>
                  </div>

                  <button type="button">Review your offer</button>
                  <small>This link is unique to you and expires in 7 days.</small>
                </div>
              </div>
            </article>

            <article class="offer-delivery-card offer-delivery-panel">
              <div class="offer-delivery-panel__head">
                <h3>Delivery Summary</h3>
              </div>

              <div class="offer-delivery-summary">
                <div v-for="row in deliverySummaryRows" :key="row.label">
                  <div class="offer-delivery-summary__label">
                    <AppIcon :name="row.icon" :size="14" />
                    <span>{{ row.label }}</span>
                  </div>
                  <strong>{{ row.value }}</strong>
                </div>
                <em>Ready to send</em>
              </div>
            </article>

            <article class="offer-delivery-card offer-delivery-panel">
              <div class="offer-delivery-panel__head">
                <h3>Third-Party Integration</h3>
              </div>

              <div class="offer-delivery-integration">
                <div class="offer-delivery-integration__title">
                  <strong>DocuSign</strong>
                  <em>Configured</em>
                </div>
                <div v-for="row in integrationRows" :key="row[0]">
                  <span>{{ row[0] }}</span>
                  <strong>{{ row[1] }}</strong>
                </div>
                <button type="button">
                  <span>Manage in DocuSign</span>
                  <AppIcon name="external-link" :size="13" />
                </button>
              </div>
            </article>

            <article class="offer-delivery-card offer-delivery-panel">
              <div class="offer-delivery-panel__head">
                <h3>Compliance &amp; Security</h3>
              </div>

              <div class="offer-delivery-compliance">
                <article v-for="row in complianceRows" :key="row">
                  <AppIcon name="checkCircle" :size="14" />
                  <span>{{ row }}</span>
                </article>
              </div>
            </article>

            <article class="offer-delivery-card offer-delivery-panel">
              <div class="offer-delivery-panel__head">
                <h3>Test Before Sending</h3>
                <small>Send a test offer to yourself or a colleague to experience the full candidate journey.</small>
              </div>

              <button class="offer-delivery-test-button" type="button">
                <AppIcon name="mail" :size="14" />
                <span>Send test email</span>
              </button>
            </article>
          </aside>
        </div>

        <footer class="offer-delivery-footer">
          <button class="offer-delivery-button" type="button" @click="emit('open-offer-details')">Back</button>

          <div class="offer-delivery-footer__end">
            <button class="offer-delivery-button is-outline" type="button">
              <AppIcon name="mail" :size="14" />
              <span>Send test package</span>
            </button>
            <button class="offer-delivery-button is-primary" type="button" @click="emit('open-review-send')">
              <span>Continue to Final Review</span>
              <AppIcon name="chevronRight" :size="15" />
            </button>
          </div>
        </footer>
      </section>
    </main>
  </Teleport>
</template>

<style scoped>
.offer-delivery-page {
  position: fixed;
  inset: 0;
  z-index: 55;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(20, 27, 45, 0.34);
  backdrop-filter: blur(10px);
}

.offer-delivery-shell {
  width: min(1560px, calc(100vw - 36px));
  max-height: calc(100vh - 36px);
  overflow: auto;
  padding: 18px;
  border: 1px solid rgba(233, 239, 247, 0.92);
  border-radius: 30px;
  background:
    radial-gradient(circle at top center, rgba(255, 110, 173, 0.09), transparent 28%),
    linear-gradient(180deg, #fffafc 0%, #ffffff 100%);
  box-shadow: 0 28px 80px rgba(16, 24, 40, 0.22);
  display: grid;
  gap: 18px;
}

.offer-delivery-card {
  border: 1px solid #ebeff7;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14px 34px rgba(255, 70, 146, 0.05);
}

.offer-delivery-header {
  padding: 18px 20px;
}

.offer-delivery-header__top,
.offer-delivery-header__title,
.offer-delivery-header__actions,
.offer-delivery-stepper,
.offer-delivery-step,
.offer-delivery-panel__head.is-spread,
.offer-delivery-note,
.offer-delivery-preview__brand,
.offer-delivery-link-button,
.offer-delivery-mini-select,
.offer-delivery-footer,
.offer-delivery-footer__end,
.offer-delivery-button,
.offer-delivery-test-button,
.offer-delivery-validation {
  display: flex;
  align-items: center;
}

.offer-delivery-header__top {
  justify-content: space-between;
  gap: 16px;
}

.offer-delivery-header__title {
  gap: 12px;
}

.offer-delivery-back-icon,
.offer-delivery-close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #7f8ea5;
}

.offer-delivery-header h1,
.offer-delivery-header h2,
.offer-delivery-panel__head h3 {
  margin: 0;
  color: #1d2b49;
  font-weight: 800;
}

.offer-delivery-header h1 {
  font-size: 0.82rem;
}

.offer-delivery-header h2 {
  margin-top: 4px;
  font-size: 1.9rem;
}

.offer-delivery-header p,
.offer-delivery-panel__head small,
.offer-delivery-flow__item small,
.offer-delivery-preview__brand small,
.offer-delivery-preview__email p,
.offer-delivery-preview__email small,
.offer-delivery-docs small,
.offer-delivery-reminders small,
.offer-delivery-recipients small,
.offer-delivery-summary span,
.offer-delivery-integration span,
.offer-delivery-compliance span,
.offer-delivery-reminder-note span,
.offer-delivery-validation__score span,
.offer-delivery-validation__status small {
  color: #8b98af;
  font-size: 0.78rem;
  line-height: 1.5;
}

.offer-delivery-save-top {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: #1d2b49;
  font-weight: 700;
}

.offer-delivery-stepper {
  margin-top: 16px;
  gap: 12px;
  overflow-x: auto;
}

.offer-delivery-step {
  min-width: max-content;
  padding: 0;
  border: 0;
  background: transparent;
  gap: 10px;
  color: #97a4ba;
  text-align: left;
}

.offer-delivery-step span {
  width: 28px;
  height: 28px;
  border: 1px solid #d9e2ef;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-size: 0.84rem;
  font-weight: 800;
}

.offer-delivery-step strong {
  display: block;
  font-size: 0.84rem;
  font-weight: 800;
}

.offer-delivery-step small {
  display: block;
  margin-top: 2px;
  color: #97a4ba;
  font-size: 0.68rem;
}

.offer-delivery-step.is-done span {
  border-color: #ffd2e4;
  color: #ff2d87;
  background: #fff2f8;
}

.offer-delivery-step.is-active {
  color: #ff2d87;
}

.offer-delivery-step.is-active span {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff3f98 0%, #ff1f7c 100%);
}

.offer-delivery-step-line {
  width: 34px;
  height: 1px;
  background: #dfe6f1;
  flex: 0 0 auto;
}

.offer-delivery-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 18px;
  align-items: start;
}

.offer-delivery-workspace {
  display: grid;
  gap: 18px;
  align-items: start;
}

.offer-delivery-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  align-items: start;
}

.offer-delivery-sidebar {
  display: grid;
  gap: 18px;
}

.offer-delivery-panel {
  padding: 16px;
}

.offer-delivery-panel__head h3 {
  font-size: 1rem;
}

.offer-delivery-mini-select {
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid #dfe5f0;
  border-radius: 10px;
  gap: 6px;
  background: #fff;
  color: #5c6d88;
  font-size: 0.76rem;
  font-weight: 700;
}

.offer-delivery-flow {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.offer-delivery-flow__item {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 6px;
  text-align: center;
}

.offer-delivery-flow__icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-delivery-flow__icon.is-pink { color: #ff2d87; background: #fff1f7; }
.offer-delivery-flow__icon.is-violet { color: #7b68ff; background: #f3efff; }
.offer-delivery-flow__icon.is-blue { color: #4b84ff; background: #edf4ff; }
.offer-delivery-flow__icon.is-green { color: #16a665; background: #ebfaf2; }
.offer-delivery-flow__icon.is-orange { color: #ff9d1e; background: #fff5e8; }

.offer-delivery-flow__dash {
  position: absolute;
  top: 22px;
  left: calc(100% - 8px);
  width: 34px;
  border-top: 2px dotted #dfe5f0;
}

.offer-delivery-flow__item strong {
  color: #1d2b49;
  font-size: 0.88rem;
  font-weight: 800;
}

.offer-delivery-flow__label {
  color: #1d2b49;
  font-size: 0.74rem;
  font-weight: 700;
}

.offer-delivery-flow__item button {
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid #dfe5f0;
  border-radius: 10px;
  background: #fff;
  color: #6f7f99;
  font-size: 0.7rem;
  font-weight: 700;
}

.offer-delivery-flow__item button.is-ready {
  border-color: transparent;
  color: #16a665;
  background: #ebfaf2;
}

.offer-delivery-note,
.offer-delivery-reminder-note {
  gap: 10px;
  margin-top: 18px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f6f4ff;
  color: #7261ff;
}

.offer-delivery-preview {
  margin-top: 14px;
  display: grid;
  gap: 14px;
}

.offer-delivery-preview__brand {
  align-items: flex-start;
  gap: 10px;
}

.offer-delivery-preview__email {
  overflow: hidden;
  border: 1px solid #e7ecf6;
  border-radius: 18px;
  background: #fff;
}

.offer-delivery-preview__hero {
  padding: 18px 18px 16px;
  background: #16223e;
}

.offer-delivery-preview__hero strong {
  display: block;
  color: #fff;
  font-size: 1.35rem;
}

.offer-delivery-preview__hero p {
  margin: 10px 0 0;
  color: #d8ddef;
}

.offer-delivery-preview__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
  padding: 14px 16px;
}

.offer-delivery-preview__meta span {
  color: #8b98af;
  font-size: 0.7rem;
}

.offer-delivery-preview__meta strong {
  color: #1d2b49;
  font-size: 0.76rem;
}

.offer-delivery-preview__email button {
  width: calc(100% - 32px);
  min-height: 40px;
  margin: 0 16px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff3f98 0%, #ff1f7c 100%);
  color: #fff;
  font-weight: 800;
}

.offer-delivery-preview__email > small {
  display: block;
  padding: 10px 16px 14px;
  text-align: center;
}

.offer-delivery-docs,
.offer-delivery-reminders,
.offer-delivery-recipients,
.offer-delivery-summary,
.offer-delivery-integration,
.offer-delivery-compliance,
.offer-delivery-validation__list {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.offer-delivery-docs article,
.offer-delivery-reminders article,
.offer-delivery-recipients article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 13px 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
}

.offer-delivery-docs strong,
.offer-delivery-reminders strong,
.offer-delivery-recipients strong,
.offer-delivery-preview__brand strong,
.offer-delivery-summary strong,
.offer-delivery-integration strong,
.offer-delivery-validation__status strong {
  color: #1d2b49;
}

.offer-delivery-docs strong,
.offer-delivery-reminders strong,
.offer-delivery-recipients strong,
.offer-delivery-summary strong,
.offer-delivery-integration strong {
  font-size: 0.8rem;
  font-weight: 800;
}

.offer-delivery-docs__left,
.offer-delivery-reminders__left,
.offer-delivery-recipients__head,
.offer-delivery-summary__label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}

.offer-delivery-docs__left,
.offer-delivery-summary__label {
  align-items: center;
}

.offer-delivery-docs__left > div,
.offer-delivery-reminders__left > div,
.offer-delivery-recipients__head > div {
  min-width: 0;
}

.offer-delivery-docs__left strong,
.offer-delivery-reminders__left strong,
.offer-delivery-recipients__head strong {
  display: block;
  line-height: 1.3;
}

.offer-delivery-docs__left small,
.offer-delivery-reminders__left small,
.offer-delivery-recipients__head small {
  display: block;
  margin-top: 4px;
  line-height: 1.45;
}

.offer-delivery-docs__left svg,
.offer-delivery-docs article > svg,
.offer-delivery-compliance svg,
.offer-delivery-validation__list svg {
  color: #16a665;
}

.offer-delivery-docs span {
  color: #7f8ea4;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

.offer-delivery-link-button {
  gap: 8px;
  margin-top: 14px;
  border: 0;
  padding: 0;
  color: #5442ff;
  background: transparent;
  font-weight: 800;
}

.offer-delivery-reminders__icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #7261ff;
  background: #f4f2ff;
  flex: 0 0 auto;
}

.offer-delivery-reminders article button,
.offer-delivery-recipients article button {
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

.offer-delivery-recipients article {
  grid-template-columns: minmax(0, 1fr) auto 20px;
}

.offer-delivery-recipients article button,
.offer-delivery-recipients em {
  justify-self: end;
}

.offer-delivery-toggle {
  width: 38px;
  height: 22px;
  padding: 2px;
  border-radius: 999px;
  display: inline-flex;
  justify-content: flex-end;
  background: #18b46f;
}

.offer-delivery-toggle i {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
}

.offer-delivery-reminders article {
  grid-template-columns: minmax(0, 1fr) auto;
}

.offer-delivery-reminders__left {
  align-items: center;
}

.offer-delivery-recipient-avatar {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
  flex: 0 0 auto;
}

.offer-delivery-recipient-avatar.is-pink { color: #ff2d87; background: #fff1f7; }
.offer-delivery-recipient-avatar.is-violet { color: #7b68ff; background: #f3efff; }
.offer-delivery-recipient-avatar.is-orange { color: #ff9d1e; background: #fff5e8; }
.offer-delivery-recipient-avatar.is-green { color: #16a665; background: #ebfaf2; }

.offer-delivery-recipients em {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 800;
  white-space: nowrap;
}

.offer-delivery-recipients em.is-pink { color: #ff2d87; background: #fff1f7; }
.offer-delivery-recipients em.is-violet { color: #7b68ff; background: #f3efff; }
.offer-delivery-recipients em.is-orange { color: #ff9d1e; background: #fff5e8; }
.offer-delivery-recipients em.is-green { color: #16a665; background: #ebfaf2; }

.offer-delivery-summary > div,
.offer-delivery-integration > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.offer-delivery-summary__label {
  min-width: 0;
  justify-content: flex-start;
  color: #6f7f99;
}

.offer-delivery-summary__label svg {
  color: #7261ff;
}

.offer-delivery-summary em {
  width: fit-content;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a665;
  background: #ebfaf2;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 800;
}

.offer-delivery-integration__title {
  margin-top: 12px;
  margin-bottom: 12px;
}

.offer-delivery-integration__title em {
  color: #16a665;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 800;
}

.offer-delivery-integration button,
.offer-delivery-test-button {
  width: 100%;
  min-height: 40px;
  margin-top: 12px;
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  justify-content: center;
  gap: 8px;
  background: #fff;
  color: #5c6d88;
  font-weight: 800;
}

.offer-delivery-compliance article,
.offer-delivery-validation__list article {
  display: flex;
  align-items: center;
  gap: 10px;
}

.offer-delivery-validation {
  grid-column: 1 / -1;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  background: linear-gradient(180deg, rgba(241, 255, 246, 0.78), #fff);
}

.offer-delivery-validation__score {
  width: 180px;
  max-width: 100%;
  display: grid;
  justify-items: center;
  gap: 10px;
}

.offer-delivery-validation__ring {
  width: 92px;
  height: 92px;
  padding: 6px;
  border-radius: 50%;
  background: conic-gradient(#18b46f 0 352deg, #d7f6e4 352deg 360deg);
}

.offer-delivery-validation__ring > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
}

.offer-delivery-validation__ring strong {
  color: #16a665;
  font-size: 1.3rem;
  font-weight: 800;
}

.offer-delivery-validation__list {
  flex: 1 1 auto;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.offer-delivery-validation__status {
  width: 200px;
  max-width: 100%;
  min-height: 120px;
  padding: 18px;
  border-radius: 18px;
  display: grid;
  justify-items: center;
  align-content: center;
  text-align: center;
  background: #effcf4;
  color: #16a665;
}

.offer-delivery-validation__status strong {
  margin-top: 8px;
  font-size: 0.88rem;
  font-weight: 800;
}

.offer-delivery-footer {
  justify-content: space-between;
  gap: 16px;
}

.offer-delivery-footer__end {
  gap: 12px;
  margin-left: auto;
}

.offer-delivery-button {
  min-height: 46px;
  padding: 0 18px;
  border: 0;
  border-radius: 14px;
  gap: 8px;
  background: #fff;
  color: #1d2b49;
  box-shadow: inset 0 0 0 1px #dde5f1;
  font-weight: 800;
}

.offer-delivery-button.is-outline {
  color: #ff2d87;
  background: #fff8fc;
  box-shadow: inset 0 0 0 1px #ffd5e7;
}

.offer-delivery-button.is-primary {
  color: #fff;
  background: linear-gradient(135deg, #ff3f98 0%, #ff1f7c 100%);
  box-shadow: 0 18px 36px rgba(255, 46, 135, 0.22);
}

@media (max-width: 1460px) {
  .offer-delivery-layout {
    grid-template-columns: 1fr;
  }

  .offer-delivery-sidebar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1360px) {
  .offer-delivery-detail-grid {
    grid-template-columns: 1fr 1fr;
  }

  .offer-delivery-flow {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .offer-delivery-validation {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: stretch;
  }

  .offer-delivery-validation__score,
  .offer-delivery-validation__status {
    width: 100%;
    justify-items: center;
  }
}

@media (max-width: 1260px) {
  .offer-delivery-detail-grid {
    grid-template-columns: 1fr 1fr;
  }

  .offer-delivery-validation {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1024px) {
  .offer-delivery-detail-grid,
  .offer-delivery-sidebar,
  .offer-delivery-validation {
    grid-template-columns: 1fr;
  }

  .offer-delivery-validation {
    display: grid;
  }

  .offer-delivery-flow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .offer-delivery-flow__dash {
    display: none;
  }

  .offer-delivery-validation__list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 840px) {
  .offer-delivery-page {
    padding: 12px;
  }

  .offer-delivery-shell {
    width: min(100vw - 24px, 1560px);
    max-height: calc(100vh - 24px);
    padding: 14px;
  }

  .offer-delivery-header,
  .offer-delivery-panel,
  .offer-delivery-validation {
    padding: 16px;
  }

  .offer-delivery-header__top,
  .offer-delivery-footer,
  .offer-delivery-footer__end,
  .offer-delivery-preview__meta {
    display: grid;
    grid-template-columns: 1fr;
  }

  .offer-delivery-header__actions {
    justify-content: flex-start;
  }

  .offer-delivery-docs article,
  .offer-delivery-reminders article,
  .offer-delivery-recipients article {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .offer-delivery-button,
  .offer-delivery-save-top {
    width: 100%;
    justify-content: center;
  }
}
</style>
