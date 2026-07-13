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

const emit = defineEmits(['back', 'open-source', 'open-review-ai-offer', 'open-offer-details', 'open-offer-package', 'open-launch-offer', 'open-candidate-profile'])
const launchSuccessOpen = ref(false)

function openLaunchOffer() {
  emit('open-launch-offer')
}

function closeLaunchSuccess() {
  launchSuccessOpen.value = false
}

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

const statRows = [
  ['AI Confidence', '95%'],
  ['Est. Acceptance', '94%'],
  ['Offer Health', '98%', 'Excellent'],
]

const offerSummaryRows = [
  ['Base Salary', '$145,000', 'wallet', 'pink'],
  ['Bonus', '12%', 'gift', 'violet'],
  ['Equity', '750 RSUs', 'chart-bars', 'orange'],
  ['Benefits', 'Standard US Package', 'heart', 'green'],
  ['Start Date', 'June 16, 2025', 'calendar', 'green'],
  ['Offer Expires', 'May 24, 2025 (7 days)', 'clock', 'pink'],
  ['Work Schedule', 'Full-time (Hybrid)', 'briefcase', 'blue'],
  ['Reports To', 'Sarah Johnson', 'user', 'violet'],
  ['Department', job.value.department, 'building', 'orange'],
]

const experienceRows = [
  ['Offer Letter', 'pink'],
  ['Employment Contract', 'blue'],
  ['Benefits Guide', 'green'],
  ['Ask a Question', 'violet'],
]

const deliveryRows = [
  ['Delivery method', 'Email + DocuSign', 'mail', 'pink'],
  ['Estimated completion', '1-2 days', 'clock', 'violet'],
  ['Offer expires', 'May 24, 2025 (7 days)', 'calendar', 'pink'],
  ['Reminder cadence', 'Every 48 hours', 'bell', 'orange'],
  ['Timezone', 'Candidate timezone', 'clock', 'blue'],
  ['Language', 'English', 'message', 'green'],
]

const documentRows = [
  ['Offer Letter', 'PDF'],
  ['Employment Contract', 'PDF'],
  ['Benefits Guide', 'PDF'],
  ['NDA', 'PDF'],
  ['Equity Agreement', 'PDF'],
]

const approvalRows = [
  ['Hiring Manager', 'Sarah Johnson', 'Approved', 'May 18, 2025', 'green'],
  ['HR Director', 'Daniel Lee', 'Approved', 'May 18, 2025', 'green'],
  ['Finance Manager', 'Priya Patel', 'Approved', 'May 18, 2025', 'green'],
]

const checklistRows = [
  'All sections completed',
  'All required documents included',
  'Signatures configured correctly',
  'Compensation matches offer details',
  'Company branding applied',
  'Country compliance verified',
  'Candidate information verified',
]

const flowRows = [
  ['Offer Email', 'Instant', 'mail', 'pink'],
  ['Secure Link', 'Candidate clicks', 'link', 'violet'],
  ['Secure Signing', 'Digital signature', 'edit', 'blue'],
  ['Confirmation', 'After signing', 'checkCircle', 'green'],
  ['Welcome Email', 'Onboarding info', 'users', 'orange'],
]

const successJourneyRows = [
  ['Offer Email Sent', 'May 18, 2025 10:24 AM', 'Completed', 'checkCircle', 'green'],
  ['Secure Link Delivered', 'Email opened', 'Completed', 'checkCircle', 'green'],
  ['Offer Viewed', 'May 18, 2025 10:32 AM', 'Completed', 'eye', 'green'],
  ['Offer Signing', 'Pending', 'In progress', 'edit', 'violet'],
  ['Completed', 'Waiting for signature', 'Pending', 'sparkles', 'pink'],
]

const successRecipientRows = [
  [`${props.candidateName} (Candidate)`, 'Offer email sent', 'May 18, 2025 10:24 AM', 'pink'],
  ['Sarah Johnson (Hiring Manager)', 'Notification sent', 'May 18, 2025 10:24 AM', 'orange'],
  ['Daniel Lee (HR Director)', 'Notification sent', 'May 18, 2025 10:24 AM', 'violet'],
  ['Priya Patel (Finance Manager)', 'Notification sent', 'May 18, 2025 10:24 AM', 'green'],
  ['IT Team', 'Onboarding alert sent', 'May 18, 2025 10:24 AM', 'blue'],
]

const successDocumentRows = [
  ['Offer Letter', 'PDF', 'Sent'],
  ['Employment Contract', 'PDF', 'Sent'],
  ['Benefits Guide', 'PDF', 'Sent'],
  ['NDA', 'PDF', 'Sent'],
  ['Equity Agreement', 'PDF', 'Sent'],
]

const successNextRows = [
  [`We will notify you when ${candidateFirstName.value}:`, 'Opens, reviews, signs, or has questions', 'bell', 'pink'],
  ['Onboarding will start automatically', 'Once the offer is signed', 'calendar', 'violet'],
  ['Prepare for Day 1', 'You can manage onboarding tasks in the candidate profile', 'briefcase', 'orange'],
]

const successActionRows = [
  ['Resend offer email', 'Send the offer email again', 'mail'],
  ['Preview offer email', `See what ${candidateFirstName.value} received`, 'eye'],
  ['Download offer package', 'Download all offer documents', 'document'],
]
</script>

<template>
  <Teleport to="body">
    <main class="final-review-page" @click.self="emit('back')">
      <section class="final-review-shell" @click.stop>
      <header class="final-review-card final-review-header">
        <div class="final-review-header__top">
          <div class="final-review-header__title">
            <button class="final-review-back-icon" type="button" @click="emit('open-offer-package')" aria-label="Back">
              <AppIcon name="chevronLeft" :size="16" />
            </button>
            <div>
              <h1>Create Offer</h1>
              <h2>Final Review</h2>
              <p>Review everything one last time before launching the offer to {{ candidateFirstName }}.</p>
            </div>
          </div>

          <div class="final-review-header__actions">
            <button class="final-review-save-top" type="button">
              <AppIcon name="document" :size="14" />
              <span>Save draft</span>
            </button>
            <button class="final-review-close" type="button" aria-label="Close" @click="emit('back')">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </div>

        <div class="final-review-stepper">
          <button class="final-review-step is-done" type="button" @click="emit('open-source')">
            <span><AppIcon name="checkCircle" :size="13" /></span>
            <div><strong>Template</strong><small>Senior Frontend Engineer</small></div>
          </button>
          <div class="final-review-step-line" />
          <button class="final-review-step is-done" type="button" @click="emit('open-source')">
            <span><AppIcon name="checkCircle" :size="13" /></span>
            <div><strong>AI Mapping</strong><small>97% match</small></div>
          </button>
          <div class="final-review-step-line" />
          <button class="final-review-step is-done" type="button" @click="emit('open-review-ai-offer')">
            <span><AppIcon name="checkCircle" :size="13" /></span>
            <div><strong>Review &amp; Edit</strong><small>8 sections</small></div>
          </button>
          <div class="final-review-step-line" />
          <button class="final-review-step is-done" type="button" @click="emit('open-offer-details')">
            <span><AppIcon name="checkCircle" :size="13" /></span>
            <div><strong>Offer Details</strong><small>Completed</small></div>
          </button>
          <div class="final-review-step-line" />
          <button class="final-review-step is-done" type="button" @click="emit('open-offer-package')">
            <span><AppIcon name="checkCircle" :size="13" /></span>
            <div><strong>Offer Package</strong><small>Documents &amp; experience</small></div>
          </button>
          <div class="final-review-step-line" />
          <div class="final-review-step is-active">
            <span>6</span>
            <div><strong>Final Review</strong><small>Last step</small></div>
          </div>
        </div>
      </header>

      <section class="final-review-card final-review-hero">
        <div class="final-review-hero__status">
          <span class="final-review-hero__check">
            <AppIcon name="checkCircle" :size="22" />
          </span>
          <div>
            <h3>Everything looks perfect!</h3>
            <p>Your offer is complete and ready to be sent to {{ candidateFirstName }}.</p>
          </div>
        </div>

        <div class="final-review-hero__stats">
          <article v-for="row in statRows" :key="row[0]" class="final-review-stat">
            <span>{{ row[0] }}</span>
            <div>
              <strong>{{ row[1] }}</strong>
              <em v-if="row[2]">
                <AppIcon name="checkCircle" :size="12" />
                <span>{{ row[2] }}</span>
              </em>
            </div>
          </article>
        </div>
      </section>

      <div class="final-review-main">
        <section class="final-review-content">
          <div class="final-review-top-grid">
            <article class="final-review-card final-review-panel">
              <div class="final-review-panel__head is-spread">
                <div>
                  <h3>1. Offer Summary</h3>
                </div>
                <button type="button">Edit</button>
              </div>

              <div class="final-review-summary__candidate">
                <div class="final-review-avatar">
                  <span>{{ candidateInitials }}</span>
                </div>
                <div>
                  <strong>{{ props.candidateName }}</strong>
                  <small>{{ props.candidateRole }}</small>
                  <small>{{ job.location }} - Full-time</small>
                </div>
              </div>

              <div class="final-review-summary__list">
                <article v-for="row in offerSummaryRows" :key="row[0]">
                  <span>
                    <i :class="`is-${row[3]}`">
                      <AppIcon :name="row[2]" :size="12" />
                    </i>
                    {{ row[0] }}
                  </span>
                  <strong>{{ row[1] }}</strong>
                </article>
              </div>

              <button class="final-review-outline-link" type="button">
                <span>View full offer details</span>
                <AppIcon name="external-link" :size="13" />
              </button>
            </article>

            <article class="final-review-card final-review-panel">
              <div class="final-review-panel__head is-spread">
                <div>
                  <h3>2. Candidate Experience</h3>
                </div>
                <button type="button">Preview</button>
              </div>

              <div class="final-review-experience">
                <div class="final-review-experience__frame">
                  <div class="final-review-experience__top">
                    <span>N</span>
                    <strong>NitroSync</strong>
                    <AppIcon name="sparkles" :size="12" />
                  </div>
                  <div class="final-review-experience__body">
                    <h4>Hello {{ candidateFirstName }}</h4>
                    <p>We're excited to extend an offer.</p>
                    <div class="final-review-experience__items">
                      <div v-for="row in experienceRows" :key="row[0]">
                        <i :class="`is-${row[1]}`">
                          <AppIcon name="document" :size="12" />
                        </i>
                        <span>{{ row[0] }}</span>
                      </div>
                    </div>
                    <button type="button">Review Offer</button>
                  </div>
                </div>

                <button class="final-review-experience__ghost" type="button">
                  <span>Preview full experience</span>
                  <AppIcon name="external-link" :size="13" />
                </button>
              </div>
            </article>

            <article class="final-review-card final-review-panel">
              <div class="final-review-panel__head is-spread">
                <div>
                  <h3>3. Delivery &amp; Documents</h3>
                </div>
                <button type="button">Edit</button>
              </div>

              <div class="final-review-delivery">
                <div class="final-review-delivery__meta">
                  <article v-for="row in deliveryRows" :key="row[0]">
                    <span>
                      <i :class="`is-${row[3]}`">
                        <AppIcon :name="row[2]" :size="12" />
                      </i>
                      {{ row[0] }}
                    </span>
                    <strong>{{ row[1] }}</strong>
                  </article>
                </div>

                <div class="final-review-delivery__docs">
                  <strong>Documents Included (5)</strong>
                  <article v-for="row in documentRows" :key="row[0]">
                    <div>
                      <span class="doc-icon"><AppIcon name="document" :size="12" /></span>
                      <span>{{ row[0] }}</span>
                    </div>
                    <small>{{ row[1] }}</small>
                    <em>Ready</em>
                  </article>
                </div>
              </div>

              <button class="final-review-outline-link" type="button">
                <span>View all documents</span>
                <AppIcon name="external-link" :size="13" />
              </button>
            </article>
          </div>

          <article class="final-review-card final-review-panel final-review-timeline">
            <div class="final-review-panel__head">
              <h3>5. Communication Flow Timeline</h3>
            </div>

            <div class="final-review-flow">
              <article v-for="(row, index) in flowRows" :key="row[0]" class="final-review-flow__item">
                <span class="final-review-flow__icon" :class="`is-${row[3]}`">
                  <AppIcon :name="row[2]" :size="16" />
                </span>
                <i v-if="index < flowRows.length - 1" class="final-review-flow__dash" />
                <strong>{{ row[0] }}</strong>
                <small>{{ row[1] }}</small>
              </article>
            </div>

            <div class="final-review-flow__note">
              <AppIcon name="info" :size="13" />
              <span>NitroSync will manage all communications before and after signing.</span>
            </div>
          </article>
        </section>

        <aside class="final-review-side">
          <article class="final-review-card final-review-panel">
            <div class="final-review-panel__head is-spread">
              <div>
                <h3>4. Approvals</h3>
              </div>
              <button type="button">Edit</button>
            </div>

            <div class="final-review-approvals">
              <article v-for="row in approvalRows" :key="row[0]">
                <div class="final-review-approvals__main">
                  <span class="final-review-approvals__icon">
                    <AppIcon name="lock" :size="12" />
                  </span>
                  <div>
                    <strong>{{ row[0] }}</strong>
                    <small>{{ row[1] }}</small>
                  </div>
                </div>
                <div class="final-review-approvals__status">
                  <strong>{{ row[2] }}</strong>
                  <small>{{ row[3] }}</small>
                </div>
              </article>
            </div>

            <button class="final-review-outline-link" type="button">
              <span>View approval details</span>
              <AppIcon name="external-link" :size="13" />
            </button>
          </article>

          <article class="final-review-card final-review-panel">
            <div class="final-review-panel__head">
              <h3>Final Checklist</h3>
            </div>

            <div class="final-review-checklist">
              <article v-for="row in checklistRows" :key="row">
                <AppIcon name="checkCircle" :size="14" />
                <span>{{ row }}</span>
              </article>
            </div>

            <div class="final-review-checklist__note">
              <AppIcon name="checkCircle" :size="14" />
              <span>No issues detected. You're ready to launch!</span>
            </div>
          </article>

          <article class="final-review-card final-review-panel">
            <div class="final-review-panel__head">
              <h3>Next Step</h3>
            </div>

            <div class="final-review-next">
              <strong>Launch the offer</strong>
              <p>Once launched, {{ candidateFirstName }} will receive the offer via email with a secure link to review and sign.</p>
            </div>
          </article>
        </aside>
      </div>

      <footer class="final-review-footer">
        <button class="final-review-button" type="button" @click="emit('open-offer-package')">Back</button>

        <div class="final-review-footer__end">
          <button class="final-review-button is-outline" type="button">
            <AppIcon name="mail" :size="14" />
            <span>Send test package</span>
          </button>
          <button class="final-review-button is-primary" type="button" @click="openLaunchOffer">
            <AppIcon name="share" :size="14" />
            <span>Launch Offer</span>
          </button>
        </div>
      </footer>

      <div class="final-review-footer__hint">
        <AppIcon name="lock" :size="12" />
        <span>You can't make changes after launching the offer.</span>
      </div>

      <div v-if="launchSuccessOpen" class="final-review-success" @click.self="closeLaunchSuccess">
        <div class="final-review-success__dialog final-review-card">
          <header class="final-review-success__header">
            <div>
              <small>Offer launched successfully!</small>
              <h2>Your offer has been launched to {{ props.candidateName }}.</h2>
              <p>The offer email has been sent with a secure link to review and sign.</p>
            </div>

            <div class="final-review-success__header-actions">
              <button type="button" class="final-review-success__ghost">
                <span>View offer details</span>
                <AppIcon name="external-link" :size="14" />
              </button>
              <button type="button" class="final-review-success__close" aria-label="Close" @click="closeLaunchSuccess">
                <AppIcon name="close" :size="18" />
              </button>
            </div>
          </header>

          <div class="final-review-success__layout">
            <section class="final-review-success__main">
              <article class="final-review-success__panel is-hero">
                <div class="final-review-success__hero">
                  <div class="final-review-success__hero-mark">
                    <AppIcon name="share" :size="28" />
                  </div>

                  <div class="final-review-success__hero-copy">
                    <em>Sent</em>
                    <strong>Offer sent!</strong>
                    <p>{{ candidateFirstName }} will receive the offer email in a few seconds.</p>
                  </div>
                </div>

                <div class="final-review-success__meta">
                  <article>
                    <span><AppIcon name="mail" :size="14" /> Sent to</span>
                    <strong>{{ candidateEmail }}@email.com</strong>
                  </article>
                  <article>
                    <span><AppIcon name="clock" :size="14" /> Sent at</span>
                    <strong>May 18, 2025 - 10:24 AM PDT</strong>
                  </article>
                  <article>
                    <span><AppIcon name="link" :size="14" /> Secure link expires</span>
                    <strong>May 25, 2025 (7 days)</strong>
                  </article>
                </div>

                <div class="final-review-success__journey">
                  <div class="final-review-success__section-head">
                    <h3>Offer Journey</h3>
                    <small>Real-time status of the offer journey.</small>
                  </div>

                  <div class="final-review-success__journey-flow">
                    <article
                      v-for="(row, index) in successJourneyRows"
                      :key="row[0]"
                      class="final-review-success__journey-step"
                      :class="`is-${row[4]}`"
                    >
                      <span class="step-icon">
                        <AppIcon :name="row[3]" :size="15" />
                      </span>
                      <i v-if="index < successJourneyRows.length - 1" class="step-line" />
                      <strong>{{ index + 1 }}. {{ row[0] }}</strong>
                      <small>{{ row[1] }}</small>
                      <em :class="{ 'is-progress': row[2] === 'In progress', 'is-pending': row[2] === 'Pending' }">{{ row[2] }}</em>
                    </article>
                  </div>

                  <div class="final-review-success__journey-note">
                    <AppIcon name="info" :size="13" />
                    <span>We'll notify you as {{ candidateFirstName }} reviews, signs, or has any questions about the offer.</span>
                  </div>
                </div>
              </article>

              <div class="final-review-success__bottom-grid">
                <article class="final-review-success__panel">
                  <div class="final-review-success__section-head">
                    <h3>Recipients Notified</h3>
                    <small>All relevant stakeholders have been notified.</small>
                  </div>

                  <div class="final-review-success__list">
                    <article v-for="row in successRecipientRows" :key="row[0]">
                      <div class="final-review-success__list-main">
                        <span class="final-review-success__list-icon" :class="`is-${row[3]}`">
                          <AppIcon name="users" :size="13" />
                        </span>
                        <div>
                          <strong>{{ row[0] }}</strong>
                          <small>{{ row[1] }}</small>
                        </div>
                      </div>
                      <div class="final-review-success__list-side">
                        <AppIcon name="checkCircle" :size="13" />
                        <small>{{ row[2] }}</small>
                      </div>
                    </article>
                  </div>
                </article>

                <article class="final-review-success__panel">
                  <div class="final-review-success__section-head">
                    <h3>Offer Documents</h3>
                    <small>5 documents included in the offer package.</small>
                  </div>

                  <div class="final-review-success__documents">
                    <article v-for="row in successDocumentRows" :key="row[0]">
                      <div>
                        <span class="final-review-success__doc-icon"><AppIcon name="document" :size="12" /></span>
                        <strong>{{ row[0] }}</strong>
                      </div>
                      <small>{{ row[1] }}</small>
                      <em>{{ row[2] }}</em>
                    </article>
                  </div>

                  <button type="button" class="final-review-success__subtle-link">
                    <span>View all documents</span>
                    <AppIcon name="external-link" :size="13" />
                  </button>
                </article>
              </div>

              <div class="final-review-success__footer-banner">
                <AppIcon name="shield" :size="18" />
                <div>
                  <strong>Your offer is live and secure.</strong>
                  <small>NitroSync is managing all communications and will keep you updated.</small>
                </div>
              </div>
            </section>

            <aside class="final-review-success__side">
              <article class="final-review-success__panel">
                <div class="final-review-success__side-head">
                  <h3>Offer Summary</h3>
                  <button type="button">Edit</button>
                </div>

                <div class="final-review-success__candidate">
                  <div class="final-review-success__avatar">
                    <span>{{ candidateInitials }}</span>
                  </div>
                  <div>
                    <strong>{{ props.candidateName }}</strong>
                    <small>{{ props.candidateRole }}</small>
                    <small>{{ job.location }} - Full-time</small>
                  </div>
                </div>

                <div class="final-review-success__comp">
                  <span>Total Annual Compensation</span>
                  <strong>$165,000</strong>
                  <small>$145,000 base + $20,000 equity value</small>
                  <div class="final-review-success__market-box">
                    <strong>P62</strong>
                    <span>Market Position</span>
                  </div>
                </div>

                <div class="final-review-success__stats">
                  <article v-for="row in statRows" :key="row[0]">
                    <span>{{ row[0] }}</span>
                    <strong>{{ row[1] }}</strong>
                    <em v-if="row[2]">{{ row[2] }}</em>
                  </article>
                </div>
              </article>

              <article class="final-review-success__panel">
                <div class="final-review-success__section-head">
                  <h3>Next Steps</h3>
                </div>

                <div class="final-review-success__next">
                  <article v-for="row in successNextRows" :key="row[0]">
                    <span class="final-review-success__list-icon" :class="`is-${row[3]}`">
                      <AppIcon :name="row[2]" :size="13" />
                    </span>
                    <div>
                      <strong>{{ row[0] }}</strong>
                      <small>{{ row[1] }}</small>
                    </div>
                  </article>
                </div>

                <button type="button" class="final-review-success__subtle-link">
                  <span>View candidate profile</span>
                  <AppIcon name="external-link" :size="13" />
                </button>
              </article>

              <article class="final-review-success__panel">
                <div class="final-review-success__section-head">
                  <h3>Actions</h3>
                </div>

                <div class="final-review-success__actions">
                  <button v-for="row in successActionRows" :key="row[0]" type="button">
                    <span class="final-review-success__list-main">
                      <span class="final-review-success__list-icon is-violet">
                        <AppIcon :name="row[2]" :size="13" />
                      </span>
                      <span class="final-review-success__action-copy">
                        <strong>{{ row[0] }}</strong>
                        <small>{{ row[1] }}</small>
                      </span>
                    </span>
                    <AppIcon name="chevronRight" :size="14" />
                  </button>
                </div>
              </article>
            </aside>
          </div>

          <footer class="final-review-success__footer">
            <button type="button" class="final-review-button is-primary" @click="closeLaunchSuccess">
              <AppIcon name="check" :size="15" />
              <span>Done</span>
            </button>
          </footer>
        </div>
      </div>
      </section>
    </main>
  </Teleport>
</template>

<style scoped>
.final-review-page {
  position: fixed;
  inset: 0;
  z-index: 56;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(20, 27, 45, 0.34);
  backdrop-filter: blur(10px);
}

.final-review-shell {
  width: min(1840px, calc(100vw - 36px));
  max-height: calc(100vh - 36px);
  overflow: auto;
  padding: 18px;
  border: 1px solid rgba(233, 239, 247, 0.92);
  border-radius: 30px;
  background:
    radial-gradient(circle at top center, rgba(255, 110, 173, 0.09), transparent 28%),
    linear-gradient(180deg, #fffafc 0%, #ffffff 100%);
  box-shadow: 0 28px 80px rgba(16, 24, 40, 0.22);
}

.final-review-card {
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 34px rgba(255, 70, 146, 0.06);
}

.final-review-header {
  padding: 18px 20px;
}

.final-review-header__top,
.final-review-header__title,
.final-review-header__actions,
.final-review-stepper,
.final-review-step,
.final-review-hero,
.final-review-hero__status,
.final-review-panel__head.is-spread,
.final-review-outline-link,
.final-review-footer,
.final-review-footer__end,
.final-review-button,
.final-review-flow__note {
  display: flex;
  align-items: center;
}

.final-review-header__top {
  justify-content: space-between;
  gap: 16px;
}

.final-review-header__title {
  gap: 12px;
}

.final-review-back-icon,
.final-review-close {
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

.final-review-header h1,
.final-review-header h2,
.final-review-panel__head h3,
.final-review-hero__status h3 {
  margin: 0;
  color: #1d2b49;
  font-weight: 800;
}

.final-review-header h1 {
  font-size: 0.82rem;
}

.final-review-header h2 {
  margin-top: 4px;
  font-size: 1.9rem;
}

.final-review-header p,
.final-review-panel__head small,
.final-review-hero__status p,
.final-review-summary__candidate small,
.final-review-experience__body p,
.final-review-approvals small,
.final-review-next p,
.final-review-footer__hint,
.final-review-flow__item small,
.final-review-flow__note span {
  color: #8b98af;
  font-size: 0.78rem;
  line-height: 1.5;
}

.final-review-save-top {
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

.final-review-stepper {
  margin-top: 16px;
  gap: 12px;
  overflow-x: auto;
}

.final-review-step {
  min-width: max-content;
  padding: 0;
  border: 0;
  background: transparent;
  gap: 10px;
  color: #97a4ba;
  text-align: left;
}

.final-review-step span {
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

.final-review-step strong {
  display: block;
  font-size: 0.84rem;
  font-weight: 800;
}

.final-review-step small {
  display: block;
  margin-top: 2px;
  color: #97a4ba;
  font-size: 0.68rem;
}

.final-review-step.is-done span {
  border-color: #ffd2e4;
  color: #ff2d87;
  background: #fff2f8;
}

.final-review-step.is-active {
  color: #ff2d87;
}

.final-review-step.is-active span {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff3f98 0%, #ff1f7c 100%);
}

.final-review-step-line {
  width: 34px;
  height: 1px;
  background: #dfe6f1;
  flex: 0 0 auto;
}

.final-review-hero {
  justify-content: space-between;
  gap: 18px;
  margin-top: 16px;
  padding: 14px 18px;
}

.final-review-hero__status {
  gap: 14px;
}

.final-review-hero__check {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a665;
  background: #effcf4;
  box-shadow: inset 0 0 0 2px #2ac173;
}

.final-review-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  min-width: 520px;
}

.final-review-stat {
  padding: 10px 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  background: #fff;
}

.final-review-stat span {
  display: block;
  color: #8b98af;
  font-size: 0.72rem;
  font-weight: 700;
}

.final-review-stat div {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.final-review-stat strong {
  color: #1d2b49;
  font-size: 1.45rem;
  font-weight: 800;
}

.final-review-stat em {
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #16a665;
  background: #ebfaf2;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 800;
}

.final-review-main {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 18px;
  align-items: start;
}

.final-review-content {
  display: grid;
  gap: 18px;
  min-width: 0;
}

.final-review-top-grid {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr) 350px;
  gap: 18px;
  align-items: start;
}

.final-review-side {
  display: grid;
  gap: 18px;
  align-content: start;
}

.final-review-panel {
  padding: 16px;
}

.final-review-panel__head h3 {
  font-size: 1rem;
}

.final-review-panel__head.is-spread {
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.final-review-panel__head button {
  border: 0;
  padding: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.76rem;
  font-weight: 800;
}

.final-review-summary__candidate {
  margin-top: 14px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.final-review-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffd8b5 0%, #ffbc82 100%);
  color: #523111;
  font-weight: 800;
}

.final-review-summary__candidate strong,
.final-review-delivery strong,
.final-review-approvals strong,
.final-review-checklist__note span,
.final-review-next strong,
.final-review-flow__item strong {
  color: #1d2b49;
}

.final-review-summary__candidate strong {
  display: block;
  font-size: 0.92rem;
  font-weight: 800;
}

.final-review-summary__candidate small {
  display: block;
}

.final-review-summary__list,
.final-review-checklist,
.final-review-approvals {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.final-review-summary__list article,
.final-review-delivery__meta article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.final-review-summary__list span,
.final-review-delivery__meta span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7f8ea4;
  font-size: 0.78rem;
}

.final-review-summary__list i,
.final-review-delivery__meta i,
.final-review-experience__items i {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  flex: 0 0 auto;
}

.is-pink { color: #ff2d87; background: #fff0f7; }
.is-violet { color: #5b49ff; background: #f1efff; }
.is-blue { color: #3b82f6; background: #eef6ff; }
.is-green { color: #10a86b; background: #ebfaf1; }
.is-orange { color: #f59e0b; background: #fff6e8; }

.final-review-summary__list strong,
.final-review-delivery__meta strong {
  font-size: 0.8rem;
  font-weight: 800;
  text-align: right;
}

.final-review-outline-link,
.final-review-experience__ghost {
  width: 100%;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  min-height: 40px;
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  color: #5c6d88;
  background: #fff;
  font-weight: 800;
}

.final-review-experience {
  margin-top: 16px;
}

.final-review-experience__frame {
  width: min(100%, 248px);
  margin: 0 auto;
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: #fff;
}

.final-review-experience__top {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: center;
  gap: 8px;
}

.final-review-experience__top > span {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #ff4098 0%, #ff1f7c 100%);
  font-size: 0.76rem;
  font-weight: 800;
}

.final-review-experience__top strong {
  color: #1d2b49;
  font-size: 0.74rem;
  font-weight: 800;
}

.final-review-experience__body {
  margin-top: 14px;
  padding: 18px 14px 14px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  text-align: center;
  background: linear-gradient(180deg, #fff 0%, #fbfcff 100%);
}

.final-review-experience__body h4 {
  margin: 0;
  color: #1d2b49;
  font-size: 1.1rem;
  font-weight: 800;
}

.final-review-experience__items {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.final-review-experience__items div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #46546e;
  font-size: 0.76rem;
  font-weight: 700;
  text-align: left;
}

.final-review-experience__body button {
  width: 100%;
  min-height: 38px;
  margin-top: 16px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(180deg, #ff4b9f 0%, #ff267f 100%);
  font-weight: 800;
}

.final-review-delivery {
  margin-top: 16px;
  display: grid;
  gap: 18px;
}

.final-review-delivery__meta {
  display: grid;
  gap: 10px;
}

.final-review-delivery__docs {
  padding-top: 14px;
  border-top: 1px solid #edf1f8;
  display: grid;
  gap: 10px;
}

.final-review-delivery__docs > strong {
  font-size: 0.84rem;
  font-weight: 800;
}

.final-review-delivery__docs article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
}

.final-review-delivery__docs article > div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #46546e;
  font-size: 0.76rem;
  font-weight: 700;
}

.doc-icon {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6f57ff;
  background: #f1efff;
}

.final-review-delivery__docs small {
  color: #8b98af;
  font-size: 0.7rem;
  font-weight: 700;
}

.final-review-delivery__docs em {
  color: #16a665;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 800;
}

.final-review-approvals article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.final-review-approvals__main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.final-review-approvals__icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6f57ff;
  background: #f1efff;
  flex: 0 0 auto;
}

.final-review-approvals__main strong,
.final-review-approvals__status strong {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
}

.final-review-approvals__status {
  text-align: right;
}

.final-review-approvals__status strong {
  color: #16a665;
}

.final-review-checklist article {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #7f8ea4;
  font-size: 0.76rem;
}

.final-review-checklist article svg,
.final-review-checklist__note svg {
  color: #16a665;
  flex: 0 0 auto;
}

.final-review-checklist__note {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #16a665;
  background: #effcf4;
  font-size: 0.74rem;
  font-weight: 800;
}

.final-review-next {
  margin-top: 14px;
}

.final-review-next strong {
  display: block;
  font-size: 0.92rem;
  font-weight: 800;
}

.final-review-next p {
  margin: 8px 0 0;
}

.final-review-timeline {
  margin-top: 0;
}

.final-review-flow {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.final-review-flow__item {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;
}

.final-review-flow__icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.final-review-flow__dash {
  position: absolute;
  top: 21px;
  left: calc(100% - 8px);
  width: 42px;
  border-top: 2px dotted #dfe5f0;
}

.final-review-flow__item strong {
  font-size: 0.74rem;
  font-weight: 800;
}

.final-review-flow__item small {
  font-size: 0.7rem;
}

.final-review-flow__note {
  gap: 8px;
  margin-top: 16px;
  padding: 10px 12px;
  border-radius: 12px;
  color: #7261ff;
  background: #f6f4ff;
}

.final-review-footer {
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
}

.final-review-footer__end {
  gap: 12px;
  margin-left: auto;
}

.final-review-button {
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 14px;
  gap: 8px;
  background: #fff;
  color: #243351;
  box-shadow: inset 0 0 0 1px #dde4ef;
  font-weight: 800;
}

.final-review-button.is-outline {
  color: #ff2d87;
  background: #fff8fc;
  box-shadow: inset 0 0 0 1px #ffd5e7;
}

.final-review-button.is-primary {
  min-width: 186px;
  color: #fff;
  background: linear-gradient(180deg, #ff4098 0%, #ff1f7c 100%);
  box-shadow: 0 18px 28px rgba(255, 31, 124, 0.2);
}

.final-review-footer__hint {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.final-review-success {
  position: fixed;
  inset: 0;
  z-index: 70;
  padding: 24px;
  display: grid;
  place-items: center;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
}

.final-review-success__dialog {
  width: min(100%, 1480px);
  max-height: calc(100vh - 48px);
  padding: 22px;
  border-radius: 28px;
  overflow-y: auto;
  box-shadow: 0 28px 60px rgba(12, 18, 38, 0.22);
}

.final-review-success__header,
.final-review-success__header-actions,
.final-review-success__ghost,
.final-review-success__hero,
.final-review-success__journey-note,
.final-review-success__footer-banner,
.final-review-success__footer,
.final-review-success__list-main,
.final-review-success__list-side {
  display: flex;
  align-items: center;
}

.final-review-success__header {
  justify-content: space-between;
  gap: 18px;
}

.final-review-success__header small,
.final-review-success__section-head small,
.final-review-success__hero-copy p,
.final-review-success__meta span,
.final-review-success__journey-step small,
.final-review-success__journey-note span,
.final-review-success__candidate small,
.final-review-success__comp span,
.final-review-success__comp small,
.final-review-success__stats span,
.final-review-success__next small,
.final-review-success__actions small,
.final-review-success__footer-banner small,
.final-review-success__list small,
.final-review-success__documents small {
  color: #8190a8;
  font-size: 0.8rem;
  line-height: 1.45;
}

.final-review-success__header > div:first-child > small {
  display: block;
  color: #1f2b4d;
  font-weight: 700;
}

.final-review-success__header h2,
.final-review-success__section-head h3,
.final-review-success__hero-copy strong,
.final-review-success__candidate strong,
.final-review-success__comp strong,
.final-review-success__next strong,
.final-review-success__actions strong,
.final-review-success__documents strong,
.final-review-success__footer-banner strong,
.final-review-success__journey-step strong,
.final-review-success__side-head h3 {
  margin: 0;
  color: #1d2b49;
}

.final-review-success__header h2 {
  margin-top: 4px;
  font-size: 2rem;
  font-weight: 800;
}

.final-review-success__header p {
  margin: 8px 0 0;
  color: #8190a8;
  font-size: 0.84rem;
}

.final-review-success__header-actions {
  align-items: flex-start;
  gap: 12px;
}

.final-review-success__ghost {
  min-height: 42px;
  padding: 0 16px;
  gap: 8px;
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  background: #fff;
  color: #1d2b49;
  font-weight: 800;
}

.final-review-success__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  color: #7f8ba2;
  background: transparent;
}

.final-review-success__layout {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 18px;
  align-items: start;
}

.final-review-success__main,
.final-review-success__side {
  display: grid;
  gap: 18px;
}

.final-review-success__panel {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: #fff;
}

.final-review-success__panel.is-hero {
  padding: 18px;
}

.final-review-success__hero {
  align-items: flex-start;
  gap: 18px;
}

.final-review-success__hero-mark {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: linear-gradient(180deg, #fff3f8 0%, #fff 100%);
  box-shadow: inset 0 0 0 2px #ffd7e8;
  flex: 0 0 auto;
}

.final-review-success__hero-copy em,
.final-review-success__journey-step em,
.final-review-success__stats em {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #10a86b;
  background: #ebfaf1;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 800;
}

.final-review-success__hero-copy strong {
  display: block;
  margin-top: 10px;
  font-size: 1.5rem;
  font-weight: 800;
}

.final-review-success__hero-copy p {
  margin: 8px 0 0;
}

.final-review-success__meta {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.final-review-success__meta article {
  display: grid;
  gap: 8px;
}

.final-review-success__meta span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.final-review-success__meta strong {
  color: #1d2b49;
  font-size: 0.82rem;
  font-weight: 800;
}

.final-review-success__journey {
  margin-top: 18px;
}

.final-review-success__section-head h3 {
  font-size: 0.98rem;
  font-weight: 800;
}

.final-review-success__section-head small {
  display: block;
  margin-top: 4px;
}

.final-review-success__journey-flow {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.final-review-success__journey-step {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;
}

.final-review-success__journey-step .step-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: inset 0 0 0 2px #dfe7f3;
  color: #94a3b8;
}

.final-review-success__journey-step.is-green .step-icon {
  color: #10a86b;
  box-shadow: inset 0 0 0 2px #9ae6b4;
  background: #effcf4;
}

.final-review-success__journey-step.is-violet .step-icon {
  color: #6f57ff;
  box-shadow: inset 0 0 0 2px #cfc6ff;
  background: #f5f2ff;
}

.final-review-success__journey-step.is-pink .step-icon {
  color: #ff2d87;
  box-shadow: inset 0 0 0 2px #ffd7e8;
  background: #fff4fa;
}

.final-review-success__journey-step .step-line {
  position: absolute;
  top: 18px;
  left: calc(100% - 6px);
  width: calc(100% - 12px);
  border-top: 2px dotted #dfe5f0;
}

.final-review-success__journey-step strong {
  font-size: 0.76rem;
  font-weight: 800;
  line-height: 1.35;
}

.final-review-success__journey-step small {
  font-size: 0.7rem;
}

.final-review-success__journey-step em.is-progress {
  color: #6f57ff;
  background: #f1efff;
}

.final-review-success__journey-step em.is-pending {
  color: #94a3b8;
  background: #f5f7fd;
}

.final-review-success__journey-note {
  gap: 8px;
  margin-top: 16px;
  padding: 10px 12px;
  border-radius: 12px;
  color: #7261ff;
  background: #f6f4ff;
}

.final-review-success__bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.84fr);
  gap: 18px;
}

.final-review-success__list,
.final-review-success__documents,
.final-review-success__next,
.final-review-success__actions,
.final-review-success__stats {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.final-review-success__list article,
.final-review-success__next article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.final-review-success__documents article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
}

.final-review-success__list-main,
.final-review-success__list-side {
  gap: 10px;
  min-width: 0;
}

.final-review-success__action-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.final-review-success__list-icon,
.final-review-success__doc-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.final-review-success__doc-icon {
  border-radius: 10px;
  color: #6f57ff;
  background: #f1efff;
}

.final-review-success__list strong,
.final-review-success__documents strong,
.final-review-success__next strong,
.final-review-success__actions strong {
  display: block;
  color: #1d2b49;
  font-size: 0.8rem;
  font-weight: 800;
}

.final-review-success__list small,
.final-review-success__next small,
.final-review-success__actions small {
  display: block;
  margin-top: 4px;
}

.final-review-success__list-side {
  color: #10a86b;
}

.final-review-success__documents article > div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.final-review-success__documents small {
  font-weight: 700;
}

.final-review-success__documents em {
  color: #10a86b;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 800;
}

.final-review-success__subtle-link {
  width: 100%;
  min-height: 40px;
  margin-top: 14px;
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #5c6d88;
  background: #fff;
  font-weight: 800;
}

.final-review-success__footer-banner {
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, #f6fffa 0%, #fff 100%);
  box-shadow: inset 0 0 0 1px #dff5e8;
  color: #10a86b;
}

.final-review-success__footer-banner strong {
  display: block;
  color: #1d2b49;
  font-size: 0.88rem;
  font-weight: 800;
}

.final-review-success__footer-banner small {
  display: block;
  margin-top: 4px;
}

.final-review-success__side-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.final-review-success__side-head button {
  border: 0;
  padding: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.76rem;
  font-weight: 800;
}

.final-review-success__candidate {
  margin-top: 14px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.final-review-success__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffd8b5 0%, #ffbc82 100%);
  color: #523111;
  font-weight: 800;
}

.final-review-success__candidate strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 800;
}

.final-review-success__candidate small {
  display: block;
}

.final-review-success__comp {
  position: relative;
  margin-top: 16px;
  padding: 14px 110px 14px 14px;
  border-radius: 16px;
  border: 1px solid #f3ddea;
  background: linear-gradient(180deg, rgba(255, 248, 251, 0.92), #fff);
}

.final-review-success__comp > span {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
}

.final-review-success__comp > strong {
  display: block;
  margin-top: 6px;
  color: #ff2d87;
  font-size: 1.8rem;
  font-weight: 800;
}

.final-review-success__comp > small {
  display: block;
  margin-top: 4px;
}

.final-review-success__market-box {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 84px;
  min-height: 84px;
  padding: 10px 8px;
  border: 1px solid #ffd4e5;
  border-radius: 18px;
  display: grid;
  align-content: center;
  justify-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
}

.final-review-success__market-box strong {
  color: #ff2d87;
  font-size: 1rem;
  font-weight: 800;
}

.final-review-success__market-box span {
  margin-top: 4px;
  font-size: 0.64rem;
}

.final-review-success__stats {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.final-review-success__stats article {
  display: grid;
  gap: 4px;
}

.final-review-success__stats strong {
  color: #1d2b49;
  font-size: 1rem;
  font-weight: 800;
}

.final-review-success__actions button {
  width: 100%;
  padding: 10px 0;
  border: 0;
  border-bottom: 1px solid #edf1f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #1d2b49;
  background: transparent;
  text-align: left;
}

.final-review-success__actions button:last-child {
  border-bottom: 0;
}

.final-review-success__footer {
  justify-content: flex-end;
  margin-top: 18px;
}

@media (max-width: 1460px) {
  .final-review-main {
    grid-template-columns: 1fr;
  }

  .final-review-side {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .final-review-success__layout,
  .final-review-success__bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1180px) {
  .final-review-hero,
  .final-review-main,
  .final-review-top-grid,
  .final-review-side {
    display: grid;
    grid-template-columns: 1fr;
  }

  .final-review-hero__stats {
    min-width: 0;
  }

  .final-review-flow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .final-review-flow__dash {
    display: none;
  }

  .final-review-success__journey-flow {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .final-review-success__meta,
  .final-review-success__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 840px) {
  .final-review-page {
    padding: 12px;
  }

  .final-review-shell {
    width: min(100vw - 24px, 1840px);
    max-height: calc(100vh - 24px);
    padding: 14px;
  }

  .final-review-header,
  .final-review-hero,
  .final-review-panel {
    padding: 16px;
  }

  .final-review-header__top,
  .final-review-footer,
  .final-review-footer__end,
  .final-review-hero__stats {
    display: grid;
    grid-template-columns: 1fr;
  }

  .final-review-header__actions {
    justify-content: flex-start;
  }

  .final-review-summary__list article,
  .final-review-delivery__meta article,
  .final-review-delivery__docs article,
  .final-review-approvals article {
    grid-template-columns: 1fr;
  }

  .final-review-summary__list strong,
  .final-review-delivery__meta strong,
  .final-review-approvals__status {
    text-align: left;
  }

  .final-review-button,
  .final-review-save-top {
    width: 100%;
    justify-content: center;
  }

  .final-review-success {
    padding: 12px;
  }

  .final-review-success__dialog {
    max-height: calc(100vh - 24px);
    padding: 14px;
  }

  .final-review-success__header,
  .final-review-success__header-actions,
  .final-review-success__layout,
  .final-review-success__bottom-grid,
  .final-review-success__journey-flow,
  .final-review-success__meta,
  .final-review-success__stats {
    display: grid;
    grid-template-columns: 1fr;
  }

  .final-review-success__journey-step .step-line,
  .final-review-success__market-box {
    display: none;
  }

  .final-review-success__comp {
    padding-right: 14px;
  }

  .final-review-success__list article,
  .final-review-success__documents article,
  .final-review-success__next article {
    grid-template-columns: 1fr;
  }

  .final-review-success__ghost,
  .final-review-success__subtle-link,
  .final-review-success__actions button {
    width: 100%;
  }

  .final-review-success__footer {
    display: grid;
    justify-content: stretch;
  }
}
</style>
