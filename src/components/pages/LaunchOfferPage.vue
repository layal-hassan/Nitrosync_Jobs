<script setup>
import { computed, ref } from 'vue'
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

const emit = defineEmits(['back', 'open-review-send', 'open-candidate-profile', 'open-offer-activity'])

const selectedDeliveryMethod = ref('email')

const job = computed(() => getJobById(props.jobId))
const candidateFirstName = computed(() => props.candidateName.split(' ')[0] || 'Marvin')
const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))
const candidateEmail = computed(() => (
  (props.candidateName || 'marvin mckinney')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .join('.')
))
const offerLocation = computed(() => job.value?.location || 'San Francisco, CA (Hybrid)')
const offerDepartment = computed(() => job.value?.department || 'Engineering')

const breadcrumbRows = ['Offers', 'Create Offer', 'Final Review', 'Launch Offer']

const launchStageRows = [
  { label: 'Offer Foundation', state: 'done' },
  { label: 'Compensation', state: 'done' },
  { label: 'Benefits & Terms', state: 'done' },
  { label: 'AI Review', state: 'done' },
  { label: 'Offer Package', state: 'done' },
  { label: 'Final Review', state: 'done' },
  { label: 'Launch Offer', state: 'active', note: 'Send offer' },
]

const deliveryMethodRows = [
  {
    id: 'email',
    title: 'Email with DocuSign',
    description: 'Send a secure email with the offer documents for e-signature.',
    icon: 'mail',
    badge: 'Recommended',
  },
  {
    id: 'manual',
    title: 'Manual Delivery',
    description: 'You will deliver the offer and documents manually outside the system.',
    icon: 'share',
    badge: '',
  },
]

const selectedDeliveryCopy = computed(() => (
  deliveryMethodRows.find((item) => item.id === selectedDeliveryMethod.value) ?? deliveryMethodRows[0]
))

const manualDeliverySteps = computed(() => ([
  'Download the offer documents',
  `Share the documents with ${candidateFirstName.value}`,
  'Update the status once the offer is accepted',
]))

const launchSettingsRows = [
  { label: 'Offer Expiry Date', value: 'May 29, 2025 (14 days)', icon: 'calendar' },
  { label: 'Reminder Schedule', value: 'In 3 days and 1 day before expiry', icon: 'bell' },
  { label: 'Candidate Timezone', value: 'PDT (Los Angeles)', icon: 'clock' },
]

const ccTeamRows = ['TL', 'SJ', 'HR', '+2']

const afterLaunchChecks = [
  'You will receive an email confirmation.',
  'Reminders will be sent automatically.',
  "You'll be notified when the offer is accepted.",
]

const launchSummaryStats = [
  { label: 'AI Confidence', value: '95%', tone: 'pink', note: 'Excellent' },
  { label: 'Est. Acceptance', value: '94%', tone: 'green', note: 'Very likely' },
  { label: 'Offer Health', value: 'Excellent', tone: 'green', note: 'Strong offer' },
]

const launchIncludedRows = [
  ['Base Salary', '$145,000'],
  ['Signing Bonus', '$5,000'],
  ['Equity (RSUs)', '750'],
  ['Performance Bonus', '12% of base'],
  ['Benefits Package', 'Standard US Benefits'],
  ['Work Arrangement', 'Hybrid'],
  ['Start Date', 'June 16, 2025'],
]

function confirmLaunchOffer() {
  emit('open-offer-activity')
}
</script>

<template>
  <main class="launch-offer-page" @click.self="emit('back')">
    <section class="launch-offer-shell" @click.stop>
      <header class="launch-offer-topbar">
        <nav class="launch-offer-breadcrumbs" aria-label="Breadcrumb">
          <span
            v-for="(item, index) in breadcrumbRows"
            :key="item"
            class="launch-offer-breadcrumbs__item"
          >
            <i v-if="index > 0" aria-hidden="true">/</i>
            <strong v-if="index === breadcrumbRows.length - 1">{{ item }}</strong>
            <span v-else>{{ item }}</span>
          </span>
        </nav>

        <div class="launch-offer-topbar__actions">
          <button class="launch-offer-ghost" type="button">
            <AppIcon name="document" :size="13" />
            <span>Save draft</span>
          </button>
          <button class="launch-offer-icon" type="button" aria-label="More actions">
            <AppIcon name="more" :size="15" />
          </button>
          <button class="launch-offer-icon" type="button" aria-label="Close" @click="emit('back')">
            <AppIcon name="close" :size="15" />
          </button>
        </div>
      </header>

      <header class="launch-offer-heading">
        <h1>Launch Offer <span aria-hidden="true">&#128640;</span></h1>
        <p>Step 7 of 7 - Choose how you want to send the offer to {{ candidateFirstName }}.</p>
      </header>

      <section class="launch-offer-steps" aria-label="Offer steps">
        <article
          v-for="(item, index) in launchStageRows"
          :key="item.label"
          class="launch-offer-step"
          :class="`is-${item.state}`"
        >
          <span>{{ index + 1 }}</span>
          <strong>{{ item.label }}</strong>
          <small v-if="item.note">{{ item.note }}</small>
          <i v-if="index < launchStageRows.length - 1" aria-hidden="true" />
        </article>
      </section>

      <div class="launch-offer-layout">
        <section class="launch-offer-column launch-offer-column--wide">
          <article class="launch-offer-card">
            <div class="launch-offer-card__head">
              <h3>1. Choose Delivery Method</h3>
              <small>Select how you want to deliver the offer to {{ candidateFirstName }}.</small>
            </div>

            <div class="launch-offer-methods">
              <article
                v-for="item in deliveryMethodRows"
                :key="item.id"
                class="launch-offer-method"
                :class="{ 'is-active': selectedDeliveryMethod === item.id }"
                tabindex="0"
                role="button"
                @click="selectedDeliveryMethod = item.id"
                @keydown.enter.prevent="selectedDeliveryMethod = item.id"
                @keydown.space.prevent="selectedDeliveryMethod = item.id"
              >
                <span class="launch-offer-method__radio" :class="{ 'is-active': selectedDeliveryMethod === item.id }" />
                <span class="launch-offer-method__icon" :class="{ 'is-active': selectedDeliveryMethod === item.id }">
                  <AppIcon :name="item.icon" :size="16" />
                </span>

                <div class="launch-offer-method__copy">
                  <div class="launch-offer-method__title">
                    <strong>{{ item.title }}</strong>
                    <em v-if="item.badge">{{ item.badge }}</em>
                  </div>
                  <small>{{ item.description }}</small>
                </div>
              </article>
            </div>

            <div class="launch-offer-helpbox">
              <strong>How it works</strong>
              <ol>
                <li v-for="item in manualDeliverySteps" :key="item">{{ item }}</li>
              </ol>
            </div>
          </article>

          <article class="launch-offer-card">
            <div class="launch-offer-card__head">
              <h3>2. Email Preview <small>(Optional)</small></h3>
              <small>Add a message that you say when sending the offer manually.</small>
            </div>

            <label class="launch-offer-field">
              <span>Subject (Suggested)</span>
              <div>Your Offer from NitroSync - {{ candidateRole }}</div>
            </label>

            <div class="launch-offer-editor">
              <div class="launch-offer-editor__toolbar">
                <button type="button"><strong>B</strong></button>
                <button type="button"><em>I</em></button>
                <button type="button"><u>U</u></button>
                <button type="button">List</button>
                <span>Insert placeholder</span>
              </div>

              <div class="launch-offer-editor__body">
                <p>Hi {{ candidateFirstName }},</p>
                <p>We are excited to extend this offer for the {{ candidateRole }} role.</p>
                <p>Please find the offer documents attached.</p>
                <p>Feel free to reach out if you have any questions.</p>
                <p>We look forward to welcoming you to the team!</p>
              </div>
            </div>
          </article>
        </section>

        <section class="launch-offer-column">
          <article class="launch-offer-card">
            <div class="launch-offer-card__head">
              <h3>3. Delivery Settings</h3>
            </div>

            <div class="launch-offer-settings">
              <label
                v-for="item in launchSettingsRows"
                :key="item.label"
                class="launch-offer-field"
              >
                <span><AppIcon :name="item.icon" :size="13" /> {{ item.label }}</span>
                <div>{{ item.value }}</div>
              </label>

              <div class="launch-offer-team">
                <span><AppIcon name="users" :size="13" /> CC Team Members <em>(optional)</em></span>
                <div class="launch-offer-team__avatars">
                  <span v-for="item in ccTeamRows" :key="item">{{ item }}</span>
                </div>
                <small>They will receive updates about offer activity.</small>
              </div>

              <div class="launch-offer-after">
                <div class="launch-offer-after__title">
                  <AppIcon name="sparkles" :size="14" />
                  <strong>After you launch</strong>
                </div>

                <div v-for="item in afterLaunchChecks" :key="item" class="launch-offer-after__item">
                  <span class="launch-offer-after__dot" aria-hidden="true" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>
          </article>
        </section>

        <aside class="launch-offer-column">
          <article class="launch-offer-card">
            <div class="launch-offer-card__head is-spread">
              <h3>Offer Summary</h3>
              <button type="button">Edit</button>
            </div>

            <div class="launch-offer-summary-candidate">
              <div class="launch-offer-summary-candidate__avatar">{{ candidateInitials }}</div>
              <div>
                <strong>{{ candidateName }}</strong>
                <small>{{ candidateRole }}</small>
                <small>{{ offerDepartment }} &bull; Full-time</small>
                <small>{{ offerLocation }}</small>
              </div>
            </div>

            <div class="launch-offer-market">
              <strong>P62</strong>
              <span>Market Position</span>
            </div>

            <div class="launch-offer-comp">
              <span>Total Annual Compensation</span>
              <strong>$218,000</strong>
              <small>$145,000 base &bull; $70,000 variable</small>
            </div>

            <div class="launch-offer-summary-stats">
              <article v-for="item in launchSummaryStats" :key="item.label">
                <span>{{ item.label }}</span>
                <strong :class="`is-${item.tone}`">{{ item.value }}</strong>
                <small>{{ item.note }}</small>
              </article>
            </div>

            <div class="launch-offer-included">
              <div class="launch-offer-card__head is-spread">
                <h3>What's Included</h3>
                <button type="button">Edit</button>
              </div>

              <div class="launch-offer-included__list">
                <article v-for="item in launchIncludedRows" :key="item[0]">
                  <span><AppIcon name="document" :size="12" /> {{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                </article>
              </div>

              <button class="launch-offer-link" type="button" @click="emit('open-candidate-profile')">
                <span>View full offer details</span>
                <AppIcon name="external-link" :size="13" />
              </button>
            </div>
          </article>
        </aside>
      </div>

      <footer class="launch-offer-footer">
        <button class="launch-offer-button" type="button" @click="emit('open-review-send')">Back</button>

        <div class="launch-offer-footer__end">
          <button class="launch-offer-button" type="button">Save draft</button>
          <button class="launch-offer-button is-primary" type="button" @click="confirmLaunchOffer">
            <span>Launch Offer</span>
            <AppIcon name="share" :size="14" />
          </button>
        </div>
      </footer>

    </section>
  </main>
</template>

<style scoped>
.launch-offer-page {
  position: fixed;
  inset: 0;
  z-index: 60;
  padding: 18px;
  overflow-y: auto;
  background: rgba(17, 24, 39, 0.38);
  backdrop-filter: blur(10px);
}

.launch-offer-shell {
  width: min(1520px, calc(100vw - 36px));
  margin: 0 auto;
  padding: 16px 18px 22px;
  border: 1px solid rgba(231, 237, 245, 0.96);
  border-radius: 28px;
  background:
    radial-gradient(circle at top center, rgba(255, 92, 162, 0.08), transparent 38%),
    linear-gradient(180deg, #fff 0%, #fffdfd 100%);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.22);
}

.launch-offer-card {
  border: 1px solid #edf1f8;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16px 34px rgba(255, 70, 146, 0.06);
  padding: 18px;
}

.launch-offer-topbar,
.launch-offer-topbar__actions,
.launch-offer-ghost,
.launch-offer-icon,
.launch-offer-method,
.launch-offer-method__title,
.launch-offer-method__icon,
.launch-offer-team__avatars,
.launch-offer-summary-candidate,
.launch-offer-link,
.launch-offer-footer,
.launch-offer-footer__end,
.launch-offer-button,
.launch-offer-modal__header,
.launch-offer-modal__footer,
.launch-offer-success__hero {
  display: flex;
  align-items: center;
}

.launch-offer-topbar {
  justify-content: space-between;
  gap: 16px;
}

.launch-offer-breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  color: #8b97ad;
  font-size: 0.76rem;
  font-weight: 700;
}

.launch-offer-breadcrumbs__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.launch-offer-breadcrumbs i {
  font-style: normal;
  color: #bcc5d5;
}

.launch-offer-breadcrumbs strong {
  color: #1d2b49;
}

.launch-offer-topbar__actions {
  gap: 10px;
}

.launch-offer-ghost,
.launch-offer-icon {
  border: 1px solid #dfe6f2;
  background: #fff;
  color: #223251;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.launch-offer-ghost,
.launch-offer-icon,
.launch-offer-card__head button,
.launch-offer-link,
.launch-offer-button,
.launch-offer-method {
  cursor: pointer;
}

.launch-offer-ghost:hover,
.launch-offer-icon:hover,
.launch-offer-card__head button:hover,
.launch-offer-link:hover,
.launch-offer-button:hover,
.launch-offer-method:hover {
  transform: translateY(-1px);
}

.launch-offer-ghost {
  min-height: 38px;
  padding: 0 14px;
  gap: 8px;
  border-radius: 12px;
  font-size: 0.76rem;
  font-weight: 800;
}

.launch-offer-icon {
  width: 38px;
  height: 38px;
  justify-content: center;
  border-radius: 12px;
}

.launch-offer-heading {
  margin-top: 10px;
}

.launch-offer-heading h1,
.launch-offer-card__head h3,
.launch-offer-modal__header h2,
.launch-offer-success__hero h2 {
  margin: 0;
  color: #1d2b49;
}

.launch-offer-heading h1 {
  font-size: 2rem;
  font-weight: 800;
}

.launch-offer-heading h1 span {
  margin-left: 4px;
}

.launch-offer-heading p,
.launch-offer-card__head small,
.launch-offer-method small,
.launch-offer-helpbox li,
.launch-offer-field span,
.launch-offer-team small,
.launch-offer-after span,
.launch-offer-summary-candidate small,
.launch-offer-market span,
.launch-offer-comp small,
.launch-offer-summary-stats span,
.launch-offer-summary-stats small,
.launch-offer-included__list span,
.launch-offer-modal__header p,
.launch-offer-modal__summary span,
.launch-offer-modal__summary small,
.launch-offer-success__hero small,
.launch-offer-success__hero p,
.launch-offer-success__meta span {
  color: #8694ab;
}

.launch-offer-heading p {
  margin: 8px 0 0;
  font-size: 0.92rem;
}

.launch-offer-steps {
  margin-top: 16px;
  padding: 16px 18px;
  border: 1px solid #edf1f8;
  border-radius: 20px;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16px 34px rgba(255, 70, 146, 0.06);
}

.launch-offer-step {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 6px;
  text-align: center;
}

.launch-offer-step span {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #effcf4;
  box-shadow: inset 0 0 0 1px #94dfb8;
  color: #10a86b;
  font-size: 0.72rem;
  font-weight: 800;
}

.launch-offer-step strong {
  color: #1d2b49;
  font-size: 0.67rem;
  font-weight: 800;
  line-height: 1.32;
}

.launch-offer-step small {
  color: #ff2d87;
  font-size: 0.62rem;
  font-weight: 800;
}

.launch-offer-step i {
  position: absolute;
  top: 12px;
  right: -8px;
  width: 16px;
  border-top: 1px solid #dbe3ef;
}

.launch-offer-step.is-active span {
  color: #fff;
  background: linear-gradient(180deg, #ff4098 0%, #ff1f7c 100%);
  box-shadow: none;
}

.launch-offer-step.is-active strong {
  color: #ff2d87;
}

.launch-offer-layout {
  margin-top: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(290px, 0.74fr) minmax(320px, 0.86fr);
  gap: 14px;
  align-items: start;
}

.launch-offer-column {
  display: grid;
  gap: 14px;
}

.launch-offer-column--wide {
  min-width: 0;
}

.launch-offer-card__head,
.launch-offer-card__head.is-spread {
  display: flex;
  align-items: flex-start;
}

.launch-offer-card__head {
  flex-direction: column;
  gap: 6px;
}

.launch-offer-card__head.is-spread {
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
}

.launch-offer-card__head h3 {
  font-size: 0.98rem;
  font-weight: 800;
}

.launch-offer-card__head h3 small {
  font-size: 0.85em;
}

.launch-offer-card__head button {
  border: 0;
  padding: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.74rem;
  font-weight: 800;
}

.launch-offer-methods {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.launch-offer-method {
  min-height: 76px;
  padding: 14px;
  border: 1px solid #e7edf7;
  border-radius: 14px;
  gap: 12px;
  align-items: flex-start;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.launch-offer-method:hover {
  border-color: #d8e1ef;
  box-shadow: 0 12px 24px rgba(17, 24, 39, 0.05);
}

.launch-offer-method.is-active {
  border-color: #ffc5df;
  background: linear-gradient(180deg, #fff8fc 0%, #fff 100%);
  box-shadow: 0 12px 28px rgba(255, 45, 135, 0.08);
}

.launch-offer-method__radio {
  width: 14px;
  height: 14px;
  margin-top: 5px;
  border: 1.5px solid #cfd8e8;
  border-radius: 50%;
  flex: 0 0 auto;
}

.launch-offer-method__radio.is-active {
  border-color: #ff2d87;
  box-shadow: inset 0 0 0 3px #fff, inset 0 0 0 9px #ff2d87;
}

.launch-offer-method__icon {
  width: 30px;
  height: 30px;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 10px;
  color: #6f57ff;
  background: #f1efff;
}

.launch-offer-method__icon.is-active {
  color: #ff2d87;
  background: #fff0f7;
}

.launch-offer-method__copy {
  min-width: 0;
}

.launch-offer-method__title {
  gap: 8px;
  flex-wrap: wrap;
}

.launch-offer-method__title strong,
.launch-offer-summary-candidate strong,
.launch-offer-comp strong,
.launch-offer-summary-stats strong,
.launch-offer-included__list strong,
.launch-offer-modal__summary strong,
.launch-offer-success__meta strong {
  color: #1d2b49;
}

.launch-offer-method__title strong {
  font-size: 0.84rem;
  font-weight: 800;
}

.launch-offer-method__title em {
  padding: 3px 8px;
  border-radius: 999px;
  color: #6f57ff;
  background: #f1efff;
  font-style: normal;
  font-size: 0.64rem;
  font-weight: 800;
}

.launch-offer-method small {
  display: block;
  margin-top: 4px;
  font-size: 0.72rem;
  line-height: 1.42;
}

.launch-offer-helpbox {
  margin-top: 12px;
  padding: 14px;
  border-radius: 14px;
  background: linear-gradient(180deg, #fbf8ff 0%, #fff 100%);
  box-shadow: inset 0 0 0 1px #eee7ff;
}

.launch-offer-helpbox strong {
  color: #6f57ff;
  font-size: 0.76rem;
  font-weight: 800;
}

.launch-offer-helpbox ol {
  margin: 10px 0 0;
  padding-left: 18px;
}

.launch-offer-helpbox li {
  margin-top: 6px;
  font-size: 0.72rem;
}

.launch-offer-field,
.launch-offer-team {
  display: grid;
  gap: 8px;
}

.launch-offer-field {
  margin-top: 14px;
}

.launch-offer-field span,
.launch-offer-team span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 700;
}

.launch-offer-field div {
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  color: #1d2b49;
  background: #fff;
  font-size: 0.78rem;
  font-weight: 700;
}

.launch-offer-editor {
  margin-top: 12px;
  border: 1px solid #e8edf6;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
}

.launch-offer-editor__toolbar {
  min-height: 40px;
  padding: 0 10px;
  border-bottom: 1px solid #edf1f8;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8a96ad;
  font-size: 0.7rem;
  font-weight: 700;
}

.launch-offer-editor__toolbar button {
  min-width: 26px;
  height: 24px;
  padding: 0 6px;
  border: 0;
  border-radius: 8px;
  color: #1d2b49;
  background: transparent;
  font-size: 0.66rem;
  font-weight: 700;
}

.launch-offer-editor__toolbar span {
  margin-left: auto;
  color: #ff2d87;
}

.launch-offer-editor__body {
  min-height: 160px;
  padding: 14px;
  color: #445470;
  font-size: 0.78rem;
  line-height: 1.55;
}

.launch-offer-editor__body p {
  margin: 0 0 10px;
}

.launch-offer-settings {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.launch-offer-team {
  padding: 14px;
  border-radius: 14px;
  background: linear-gradient(180deg, #fcfdff 0%, #fff 100%);
  box-shadow: inset 0 0 0 1px #edf1f8;
}

.launch-offer-team em {
  color: #8a96ad;
  font-style: normal;
}

.launch-offer-team__avatars {
  gap: 0;
}

.launch-offer-team__avatars span {
  width: 30px;
  height: 30px;
  margin-left: -4px;
  border: 2px solid #fff;
  justify-content: center;
  border-radius: 999px;
  color: #523111;
  background: linear-gradient(180deg, #ffd8b5 0%, #ffbc82 100%);
  font-size: 0.64rem;
  font-weight: 800;
}

.launch-offer-team__avatars span:first-child {
  margin-left: 0;
}

.launch-offer-after {
  padding: 14px;
  border-radius: 14px;
  background: linear-gradient(180deg, #fcf9ff 0%, #fff 100%);
  box-shadow: inset 0 0 0 1px #eee7ff;
  display: grid;
  gap: 12px;
}

.launch-offer-after__title,
.launch-offer-after__item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.launch-offer-after__title {
  color: #6f57ff;
}

.launch-offer-after__title strong {
  color: #6f57ff;
  font-size: 0.8rem;
  font-weight: 800;
}

.launch-offer-after__item {
  align-items: flex-start;
  gap: 12px;
}

.launch-offer-after__dot {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  margin-top: 1px;
  border: 2px solid #4acb73;
  border-radius: 999px;
  background: transparent;
}

.launch-offer-summary-candidate {
  gap: 12px;
  margin-top: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf1f8;
}

.launch-offer-summary-candidate__avatar {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #523111;
  background: linear-gradient(180deg, #ffd8b5 0%, #ffbc82 100%);
  font-weight: 800;
}

.launch-offer-summary-candidate strong {
  display: block;
  font-size: 0.84rem;
  font-weight: 800;
}

.launch-offer-summary-candidate small {
  display: block;
  margin-top: 3px;
  font-size: 0.7rem;
}

.launch-offer-market,
.launch-offer-comp {
  margin-top: 14px;
  padding: 14px;
  border-radius: 14px;
}

.launch-offer-market {
  width: 84px;
  text-align: center;
  border: 1px solid #ffd9ea;
  background: #fff8fc;
}

.launch-offer-market strong {
  display: block;
  color: #ff2d87;
  font-size: 1rem;
  font-weight: 800;
}

.launch-offer-market span {
  display: block;
  margin-top: 4px;
  font-size: 0.64rem;
  line-height: 1.35;
}

.launch-offer-comp {
  border: 1px solid #f3ddea;
  background: linear-gradient(180deg, rgba(255, 248, 251, 0.92), #fff);
}

.launch-offer-comp > span {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
}

.launch-offer-comp strong {
  display: block;
  margin-top: 6px;
  font-size: 1.46rem;
  font-weight: 800;
}

.launch-offer-comp small {
  display: block;
  margin-top: 4px;
  font-size: 0.68rem;
}

.launch-offer-summary-stats {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.launch-offer-summary-stats article {
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  display: grid;
  gap: 4px;
  background: #fff;
}

.launch-offer-summary-stats span {
  font-size: 0.66rem;
  font-weight: 700;
}

.launch-offer-summary-stats strong {
  font-size: 0.9rem;
  font-weight: 800;
}

.launch-offer-summary-stats strong.is-pink {
  color: #ff2d87;
}

.launch-offer-summary-stats strong.is-green {
  color: #10a86b;
}

.launch-offer-summary-stats small {
  font-size: 0.64rem;
  font-weight: 700;
}

.launch-offer-included {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #edf1f8;
}

.launch-offer-included__list {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.launch-offer-included__list article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.launch-offer-included__list span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 700;
}

.launch-offer-included__list strong {
  font-size: 0.72rem;
  font-weight: 800;
  text-align: right;
}

.launch-offer-link {
  margin-top: 14px;
  gap: 8px;
  border: 0;
  padding: 0;
  color: #5b49ff;
  background: transparent;
  font-size: 0.76rem;
  font-weight: 800;
}

.launch-offer-footer {
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  padding-top: 2px;
}

.launch-offer-footer__end {
  gap: 10px;
}

.launch-offer-button {
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  justify-content: center;
  gap: 8px;
  color: #243351;
  background: #fff;
  box-shadow: inset 0 0 0 1px #dde4ef;
  font-size: 0.78rem;
  font-weight: 800;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.launch-offer-button.is-primary {
  color: #fff;
  background: linear-gradient(180deg, #ff4098 0%, #ff1f7c 100%);
  box-shadow: 0 18px 28px rgba(255, 31, 124, 0.2);
}

.launch-offer-modal,
.launch-offer-success {
  position: fixed;
  inset: 0;
  z-index: 70;
  padding: 20px;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.36);
  backdrop-filter: blur(8px);
}

.launch-offer-modal__dialog,
.launch-offer-success__dialog {
  width: min(100%, 720px);
  padding: 18px;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 28px 60px rgba(12, 18, 38, 0.22);
}

.launch-offer-modal__header {
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.launch-offer-modal__summary,
.launch-offer-success__meta {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.launch-offer-modal__summary div,
.launch-offer-success__meta div {
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  background: linear-gradient(180deg, #fcfdff 0%, #fff 100%);
  display: grid;
  gap: 6px;
}

.launch-offer-modal__summary span,
.launch-offer-success__meta span {
  font-size: 0.7rem;
  font-weight: 700;
}

.launch-offer-modal__summary strong,
.launch-offer-success__meta strong {
  font-size: 0.82rem;
  font-weight: 800;
}

.launch-offer-modal__summary small {
  font-size: 0.68rem;
}

.launch-offer-modal__footer {
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.launch-offer-success__hero {
  align-items: flex-start;
  gap: 14px;
}

.launch-offer-success__mark {
  width: 56px;
  height: 56px;
  flex: 0 0 auto;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #10a86b;
  background: #effcf4;
}

.launch-offer-success__hero small {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
}

.launch-offer-success__hero h2 {
  margin-top: 4px;
  font-size: 1.35rem;
  font-weight: 800;
}

.launch-offer-success__hero p {
  margin: 8px 0 0;
  font-size: 0.8rem;
}

.launch-offer-ghost:focus-visible,
.launch-offer-icon:focus-visible,
.launch-offer-button:focus-visible,
.launch-offer-link:focus-visible,
.launch-offer-method:focus-visible {
  outline: 2px solid rgba(91, 73, 255, 0.35);
  outline-offset: 2px;
}

@media (max-width: 1180px) {
  .launch-offer-steps,
  .launch-offer-layout {
    grid-template-columns: 1fr;
  }

  .launch-offer-step i {
    display: none;
  }

  .launch-offer-summary-stats,
  .launch-offer-modal__summary,
  .launch-offer-success__meta {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 840px) {
  .launch-offer-shell {
    width: min(100%, calc(100vw - 20px));
    padding: 12px;
  }

  .launch-offer-topbar,
  .launch-offer-footer,
  .launch-offer-footer__end,
  .launch-offer-method,
  .launch-offer-modal__summary,
  .launch-offer-success__meta,
  .launch-offer-summary-stats {
    display: grid;
    grid-template-columns: 1fr;
  }

  .launch-offer-topbar__actions {
    justify-content: flex-start;
  }

  .launch-offer-button,
  .launch-offer-ghost,
  .launch-offer-icon {
    width: 100%;
  }

  .launch-offer-included__list article {
    grid-template-columns: 1fr;
  }

  .launch-offer-included__list strong {
    text-align: left;
  }

  .launch-offer-modal,
  .launch-offer-success {
    padding: 12px;
  }
}
</style>
