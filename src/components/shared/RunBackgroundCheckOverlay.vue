<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
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
  flowType: {
    type: String,
    default: 'ai',
  },
  provider: {
    type: String,
    default: 'Checker',
  },
  template: {
    type: String,
    default: 'Software Engineer (US)',
  },
  completion: {
    type: String,
    default: '2-3 business days',
  },
  cost: {
    type: String,
    default: '$39.00',
  },
  checks: {
    type: Array,
    default: () => [
      'Identity Verification',
      'Employment Verification',
      'Criminal Records (County)',
      'Education Verification',
      'Global Watchlist',
      'Professional License Check',
      'Reference Verification',
    ],
  },
})

const emit = defineEmits(['close', 'complete'])

const phase = ref('confirm')
let progressTimer = null

const isIntegratedFlow = computed(() => props.flowType === 'integrated')

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateEmail = computed(() => {
  const normalized = (props.candidateName || 'marvin mckinney')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .join('.')

  return `${normalized || 'marvin.mckinney'}@email.com`
})

const aiSummaryFacts = [
  ['Role', 'Software Engineer (US)', 'briefcase'],
  ['Location', 'San Francisco, CA, US', 'mapPin'],
  ['Department', 'Engineering', 'building'],
]

const aiPackageFacts = computed(() => [
  ['Provider', props.provider, 'copy'],
  ['Package', props.template, 'sparkles'],
  ['Estimated completion', props.completion, 'clock'],
  ['Estimated cost', props.cost, 'wallet'],
])

const notifications = [
  'Notify hiring manager when completed',
  'Notify recruiter when completed',
]

const aiCreatingSteps = [
  ['AI recommendation validated', 'done'],
  ['Background check package assigned', 'done'],
  ['Candidate profile verified', 'done'],
  ['Creating provider request...', 'active', "Please don't close this window."],
  ['Sending consent email to candidate', 'pending'],
  ['Finalizing request', 'pending'],
]

const integratedWhatNext = [
  ['Consent email will be sent to the candidate', 'The candidate will receive an email from Checker to provide consent and complete the background check.', 'mail'],
  ["You'll be notified of progress", "We'll keep you updated on the status at every important step.", 'clock'],
  ['Results will be available in NitroSync', 'Once completed, you can review the full report and results here.', 'document'],
]

const integratedCompliance = [
  ['Provider connection', 'Connected'],
  ['Candidate supported', 'Yes'],
  ['Template valid', 'Yes'],
  ['API & permissions', 'All good'],
  ['Data security', 'Compliant'],
  ['Policy alignment', 'Compliant'],
]

const integratedCreatingSteps = [
  ['Connecting to Checker', 'Establishing secure connection...', 'done', '00:01'],
  ['Validating template and checks', 'Ensuring template is available and valid...', 'done', '00:01'],
  ['Validating candidate information', 'Checking required candidate data...', 'done', '00:01'],
  ['Compliance and policy check', 'Verifying permissions and policy rules...', 'done', '00:01'],
  ['Creating request in Checker', 'Submitting background check request...', 'active', '00:02'],
  ['Sending consent email to candidate', 'Preparing and sending consent email...', 'pending', ''],
  ['Finalizing request', 'Almost done!', 'pending', ''],
]

const aiSuccessFacts = computed(() => [
  ['Candidate', props.candidateName || 'Marvin McKinney', 'user'],
  ['Status', 'Waiting for Consent', 'clock', 'pill'],
  ['Provider', props.provider, 'copy'],
  ['Estimated completion', props.completion, 'calendar'],
  ['Package', props.template, 'grid'],
  ['Tracking ID', 'BC-2026-00291', 'hash'],
])

const integratedSuccessFacts = computed(() => [
  ['Candidate', props.candidateName || 'Marvin McKinney', 'user'],
  ['Provider', props.provider, 'copy'],
  ['Template', props.template, 'document'],
  ['Estimated Completion', props.completion, 'clock'],
  ['Request ID', 'CHK-394820', 'hash'],
  ['Status', 'Waiting for Candidate Consent', 'clock', 'pill'],
  ['Consent Email', candidateEmail.value, 'mail'],
  ['Country', 'United States', 'mapPin'],
])

function clearProgressTimer() {
  if (progressTimer) {
    clearTimeout(progressTimer)
    progressTimer = null
  }
}

function closeOverlay() {
  clearProgressTimer()
  phase.value = 'confirm'
  emit('close')
}

function startBackgroundCheck() {
  clearProgressTimer()
  phase.value = 'creating'
  progressTimer = setTimeout(() => {
    phase.value = 'success'
    progressTimer = null
  }, 1800)
}

function finishFlow() {
  clearProgressTimer()
  phase.value = 'confirm'
  emit('complete')
}

function viewProgress() {
  clearProgressTimer()
  phase.value = 'confirm'

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams({
      candidateName: props.candidateName || 'Marvin McKinney',
      candidateRole: props.candidateRole || 'Senior Frontend Developer',
    })

    window.location.hash = `#job/${props.jobId}/background-check-progress/${props.candidateId || 'candidate'}?${params.toString()}`
  }

  emit('complete')
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      clearProgressTimer()
      phase.value = 'confirm'
    }
  },
)

onBeforeUnmount(() => {
  clearProgressTimer()
})
</script>

<template>
  <div v-if="open" class="run-background-overlay" @click.self="closeOverlay">
    <section v-if="phase === 'confirm' && !isIntegratedFlow" class="run-background-modal">
      <header class="run-background-modal__head">
        <div class="run-background-modal__title">
          <span class="run-background-modal__icon">
            <AppIcon name="shield" :size="18" />
          </span>
          <div>
            <h2>Run Background Check</h2>
            <p>Review and confirm the details before we start.</p>
          </div>
        </div>

        <button type="button" aria-label="Close run background check" @click="closeOverlay">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="run-background-modal__body">
        <section class="run-background-candidate">
          <div class="run-background-candidate__identity">
            <span class="run-background-avatar">{{ candidateInitials }}</span>
            <div>
              <strong>{{ candidateName }}</strong>
              <p>{{ candidateRole }}</p>
              <span>98% match for this role</span>
            </div>
          </div>

          <div class="run-background-candidate__facts">
            <article v-for="[label, value, icon] in aiSummaryFacts" :key="label">
              <small>{{ label }}</small>
              <strong>
                <AppIcon :name="icon" :size="13" />
                {{ value }}
              </strong>
            </article>
          </div>
        </section>

        <section class="run-background-package">
          <div class="run-background-package__facts">
            <article v-for="[label, value, icon] in aiPackageFacts" :key="label">
              <small>{{ label }}</small>
              <strong>
                <AppIcon :name="icon" :size="13" />
                {{ value }}
              </strong>
              <span v-if="label === 'Provider'" class="run-background-pill">Integrated</span>
              <span v-if="label === 'Package'" class="run-background-pill is-soft">Recommended by AI</span>
              <em v-if="label === 'Estimated cost'">(3 credits)</em>
            </article>
          </div>

          <div class="run-background-package__checks">
            <small>Checks Included ({{ checks.length }})</small>
            <div class="run-background-package__check-list">
              <span v-for="item in checks" :key="item">
                <AppIcon name="checkCircle" :size="12" />
                {{ item }}
              </span>
            </div>
          </div>
        </section>

        <section class="run-background-options">
          <article class="run-background-option-card">
            <h3>Candidate consent</h3>
            <div class="run-background-option-card__item">
              <span class="run-background-option-card__icon is-green">
                <AppIcon name="checkCircle" :size="12" />
              </span>
              <div>
                <strong>Consent email will be sent automatically</strong>
                <p>The candidate will be asked to review and authorize.</p>
              </div>
            </div>
          </article>

          <article class="run-background-option-card">
            <h3>Notifications</h3>
            <div
              v-for="item in notifications"
              :key="item"
              class="run-background-option-card__item"
            >
              <span class="run-background-option-card__icon is-pink">
                <AppIcon name="check" :size="12" />
              </span>
              <div>
                <strong>{{ item }}</strong>
              </div>
            </div>
          </article>
        </section>
      </div>

      <footer class="run-background-modal__foot">
        <div class="run-background-modal__note">
          <AppIcon name="lock" :size="13" />
          <span>You can cancel or stop the check at any time.</span>
        </div>

        <div class="run-background-modal__actions">
          <button type="button" class="run-background-button run-background-button--ghost" @click="closeOverlay">
            Cancel
          </button>
          <button type="button" class="run-background-button run-background-button--primary" @click="startBackgroundCheck">
            Start Background Check
          </button>
        </div>
      </footer>
    </section>

    <section v-else-if="phase === 'confirm'" class="run-background-integrated-modal">
      <header class="run-background-modal__head">
        <div class="run-background-modal__title">
          <span class="run-background-modal__icon">
            <AppIcon name="shield" :size="18" />
          </span>
          <div>
            <h2>Run Background Check</h2>
            <p>Please review the details below before sending the background check request.</p>
          </div>
        </div>

        <button type="button" aria-label="Close run background check" @click="closeOverlay">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="run-background-modal__body">
        <div class="run-background-integrated-shell">
          <section class="run-background-source">
            <div class="run-background-source__copy">
              <span class="run-background-source__icon">
                <AppIcon name="sparkles" :size="16" />
              </span>
              <div>
                <small>Source</small>
                <strong>AI Recommendation</strong>
                <p>Recommended by NitroSync AI</p>
              </div>
            </div>

            <div class="run-background-source__score">
              <strong>98% Match</strong>
              <span>High Confidence</span>
            </div>
          </section>

          <section class="run-background-integrated-candidate">
            <div class="run-background-integrated-candidate__identity">
              <span class="run-background-avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
              </div>
            </div>

            <div class="run-background-integrated-candidate__facts">
              <article>
                <AppIcon name="mail" :size="13" />
                <strong>{{ candidateEmail }}</strong>
              </article>
              <article>
                <AppIcon name="mapPin" :size="13" />
                <strong>San Francisco, CA, United States</strong>
              </article>
            </div>
          </section>

          <div class="run-background-integrated-grid">
            <section class="run-background-integrated-details">
              <div class="run-background-integrated-details__facts">
                <article>
                  <small>Provider</small>
                  <strong>{{ provider }}</strong>
                </article>
                <article>
                  <small>Template</small>
                  <strong>{{ template }}</strong>
                </article>
                <article>
                  <small>Included Checks</small>
                  <strong>{{ checks.length }} checks</strong>
                </article>
                <article>
                  <small>Estimated Cost</small>
                  <strong>{{ cost }}</strong>
                </article>
                <article>
                  <small>Estimated Completion</small>
                  <strong>{{ completion }}</strong>
                </article>
                <article>
                  <small>Country</small>
                  <strong>United States</strong>
                </article>
              </div>

              <div class="run-background-integrated-details__checks">
                <small>Included Checks ({{ checks.length }})</small>
                <div class="run-background-integrated-details__check-list">
                  <span v-for="item in checks" :key="item">
                    <AppIcon name="checkCircle" :size="12" />
                    {{ item }}
                  </span>
                </div>
              </div>
            </section>

            <div class="run-background-integrated-stack">
              <section class="run-background-integrated-block">
                <h3>What happens next?</h3>
                <div class="run-background-integrated-block__list">
                  <article v-for="[title, detail, icon] in integratedWhatNext" :key="title">
                    <span>
                      <AppIcon :name="icon" :size="13" />
                    </span>
                    <div>
                      <strong>{{ title }}</strong>
                      <p>{{ detail }}</p>
                    </div>
                  </article>
                </div>
              </section>

              <section class="run-background-integrated-block">
                <h3>Provider &amp; Compliance</h3>
                <div class="run-background-compliance-grid">
                  <article v-for="[label, value] in integratedCompliance" :key="label">
                    <small>{{ label }}</small>
                    <strong>
                      <AppIcon name="checkCircle" :size="12" />
                      {{ value }}
                    </strong>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <footer class="run-background-modal__foot">
        <div class="run-background-modal__actions run-background-modal__actions--full">
          <button type="button" class="run-background-button run-background-button--ghost" @click="closeOverlay">
            Cancel
          </button>
          <button type="button" class="run-background-button run-background-button--primary" @click="startBackgroundCheck">
            Send Background Check
            <AppIcon name="chevronRight" :size="14" />
          </button>
        </div>
      </footer>
    </section>

    <section v-else-if="phase === 'creating' && !isIntegratedFlow" class="run-background-status-modal">
      <header class="run-background-status-modal__head">
        <div class="run-background-status-modal__title">
          <span class="run-background-status-modal__loader">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <div>
            <h2>Creating Background Check...</h2>
            <p>This usually takes a few seconds.</p>
          </div>
        </div>

        <button type="button" aria-label="Close creating background check" @click="closeOverlay">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="run-background-status-modal__body">
        <div class="run-background-status-modal__grid">
          <div class="run-background-status-steps">
            <article
              v-for="step in aiCreatingSteps"
              :key="step[0]"
              class="run-background-status-step"
              :class="`is-${step[1]}`"
            >
              <span class="run-background-status-step__dot">
                <AppIcon v-if="step[1] === 'done'" name="check" :size="12" />
              </span>
              <div>
                <strong>{{ step[0] }}</strong>
                <p v-if="step[2]">{{ step[2] }}</p>
              </div>
            </article>
          </div>

          <div class="run-background-status-illustration">
            <div class="run-background-status-illustration__orb" />
            <div class="run-background-status-illustration__card">
              <div class="run-background-status-illustration__badge">
                <AppIcon name="shield" :size="18" />
              </div>
              <div class="run-background-status-illustration__lines">
                <span />
                <span />
                <span />
              </div>
              <div class="run-background-status-illustration__avatar">
                <AppIcon name="user" :size="14" />
              </div>
            </div>
          </div>
        </div>

        <div class="run-background-secure">
          <span class="run-background-secure__icon">
            <AppIcon name="lock" :size="16" />
          </span>
          <div>
            <strong>Your data is secure</strong>
            <p>We are securely communicating with Checker to create the background check request.</p>
          </div>
        </div>
      </div>

      <footer class="run-background-status-modal__foot">
        <div class="run-background-status-dots">
          <i />
          <i class="is-active" />
          <i />
          <i />
        </div>

        <button type="button" class="run-background-button run-background-button--ghost" @click="closeOverlay">
          Cancel
        </button>
      </footer>
    </section>

    <section v-else-if="phase === 'creating'" class="run-background-integrated-status-modal">
      <header class="run-background-status-modal__head run-background-status-modal__head--centered">
        <button type="button" aria-label="Close creating background check" @click="closeOverlay">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="run-background-status-modal__body run-background-status-modal__body--centered">
        <div class="run-background-integrated-hero">
          <div class="run-background-integrated-hero__orb" />
          <div class="run-background-integrated-hero__doc">
            <div class="run-background-integrated-hero__badge">
              <AppIcon name="shield" :size="16" />
            </div>
            <span />
            <span />
            <span />
          </div>
          <h2>Creating Background Check...</h2>
          <p>We're setting everything up with Checker. This will only take a few seconds.</p>
        </div>

        <div class="run-background-integrated-steps">
          <article
            v-for="[title, detail, state, duration] in integratedCreatingSteps"
            :key="title"
            class="run-background-status-step"
            :class="`is-${state}`"
          >
            <span class="run-background-status-step__dot">
              <AppIcon v-if="state === 'done'" name="check" :size="12" />
            </span>
            <div class="run-background-status-step__content">
              <div>
                <strong>{{ title }}</strong>
                <p>{{ detail }}</p>
              </div>
              <small v-if="duration">{{ duration }}</small>
            </div>
          </article>
        </div>

        <div class="run-background-integrated-note">
          <AppIcon name="info" :size="15" />
          <div>
            <strong>Please don't close this window</strong>
            <p>We'll notify you once the background check has been started.</p>
          </div>
        </div>
      </div>
    </section>

    <section v-else-if="!isIntegratedFlow" class="run-background-success-modal">
      <header class="run-background-success-modal__head">
        <button type="button" aria-label="Close background check started" @click="finishFlow">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="run-background-success-modal__body">
        <div class="run-background-success-shell">
          <div class="run-background-success-hero">
            <div class="run-background-success-hero__sparkles">
              <i class="is-pink" />
              <i class="is-green" />
              <i class="is-violet" />
              <i class="is-muted" />
              <i class="is-pink-alt" />
            </div>
            <div class="run-background-success-hero__check">
              <AppIcon name="check" :size="28" />
            </div>
            <h2>Background Check Started!</h2>
            <p>A consent email has been sent to the candidate.</p>
          </div>

          <section class="run-background-success-summary">
            <article
              v-for="[label, value, icon, kind] in aiSuccessFacts"
              :key="label"
              :class="{ 'is-padded': kind === 'pill' }"
            >
              <div class="run-background-success-summary__icon">
                <AppIcon :name="icon" :size="13" />
              </div>
              <div>
                <small>{{ label }}</small>
                <strong :class="{ 'is-status': kind === 'pill' }">{{ value }}</strong>
              </div>
            </article>
          </section>

          <div class="run-background-success-next">
            <span class="run-background-success-next__icon">
              <AppIcon name="mail" :size="16" />
            </span>
            <div>
              <strong>What happens next?</strong>
              <p>The candidate will receive an email to review and authorize the background check.</p>
              <p>You will be notified once the consent is received.</p>
            </div>
          </div>
        </div>
      </div>

      <footer class="run-background-success-modal__foot">
        <div class="run-background-success-modal__actions">
          <button type="button" class="run-background-button run-background-button--ghost" @click="finishFlow">
            Close
          </button>
          <button type="button" class="run-background-button run-background-button--primary" @click="viewProgress">
            View Progress
          </button>
        </div>

        <div class="run-background-modal__note">
          <AppIcon name="lock" :size="13" />
          <span>You can view the progress anytime from the candidate profile.</span>
        </div>
      </footer>
    </section>

    <section v-else class="run-background-integrated-success-modal">
      <header class="run-background-success-modal__head">
        <button type="button" aria-label="Close background check started" @click="finishFlow">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="run-background-success-modal__body run-background-success-modal__body--centered">
        <div class="run-background-integrated-success-hero">
          <div class="run-background-integrated-success-hero__check">
            <AppIcon name="check" :size="30" />
          </div>
          <div class="run-background-integrated-success-hero__sparkles">
            <i class="is-pink" />
            <i class="is-green" />
            <i class="is-violet" />
            <i class="is-muted" />
          </div>
          <h2>Background Check Started!</h2>
          <p>The request has been successfully created.</p>
        </div>

        <section class="run-background-integrated-success-grid">
          <article v-for="[label, value, icon, kind] in integratedSuccessFacts" :key="label">
            <div class="run-background-success-summary__icon">
              <AppIcon :name="icon" :size="13" />
            </div>
            <div>
              <small>{{ label }}</small>
              <strong :class="{ 'is-status': kind === 'pill' }">{{ value }}</strong>
            </div>
          </article>
        </section>

        <section class="run-background-integrated-success-next">
          <h3>What happens next?</h3>
          <div class="run-background-integrated-block__list">
            <article>
              <span>
                <AppIcon name="mail" :size="13" />
              </span>
              <div>
                <strong>Consent email sent</strong>
                <p>The candidate will receive an email from Checker to review and provide consent.</p>
              </div>
            </article>
            <article>
              <span>
                <AppIcon name="shield" :size="13" />
              </span>
              <div>
                <strong>Candidate provides consent</strong>
                <p>Once consent is given, verification will start automatically.</p>
              </div>
            </article>
            <article>
              <span>
                <AppIcon name="search" :size="13" />
              </span>
              <div>
                <strong>Verification in progress</strong>
                <p>Checker will run the selected checks and collect the information.</p>
              </div>
            </article>
            <article>
              <span>
                <AppIcon name="document" :size="13" />
              </span>
              <div>
                <strong>Results synced to NitroSync</strong>
                <p>Results will be available here and in the candidate profile.</p>
              </div>
            </article>
          </div>
        </section>
      </div>

      <footer class="run-background-success-modal__foot">
        <div class="run-background-success-modal__actions">
          <button type="button" class="run-background-button run-background-button--ghost" @click="finishFlow">
            Close
          </button>
          <button type="button" class="run-background-button run-background-button--primary" @click="viewProgress">
            View Progress
            <AppIcon name="chevronRight" :size="14" />
          </button>
        </div>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.run-background-overlay {
  position: fixed;
  inset: 0;
  z-index: 2220;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(17, 24, 39, 0.34);
  backdrop-filter: blur(10px);
}

.run-background-modal,
.run-background-status-modal,
.run-background-success-modal,
.run-background-integrated-modal,
.run-background-integrated-status-modal,
.run-background-integrated-success-modal {
  width: min(1180px, calc(100vw - 40px));
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dfe6fb;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(28, 39, 63, 0.24);
}

.run-background-integrated-modal {
  width: min(980px, calc(100vw - 40px));
}

.run-background-integrated-status-modal,
.run-background-integrated-success-modal {
  width: min(720px, calc(100vw - 40px));
}

.run-background-modal__head,
.run-background-modal__foot,
.run-background-status-modal__head,
.run-background-status-modal__foot,
.run-background-success-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
}

.run-background-modal__head,
.run-background-status-modal__head {
  border-bottom: 1px solid #edf1fb;
}

.run-background-status-modal__head--centered {
  justify-content: flex-end;
}

.run-background-modal__title,
.run-background-status-modal__title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.run-background-modal__icon,
.run-background-status-modal__loader {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.run-background-modal__icon {
  color: #ef4fa0;
  background: #fff1f8;
}

.run-background-status-modal__loader {
  position: relative;
  background: #fff5fa;
}

.run-background-status-modal__loader i {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ef4fa0;
  animation: run-background-pulse 1.2s infinite ease-in-out;
}

.run-background-status-modal__loader i:nth-child(1) { top: 8px; left: 20px; animation-delay: 0s; }
.run-background-status-modal__loader i:nth-child(2) { top: 14px; right: 9px; animation-delay: 0.1s; }
.run-background-status-modal__loader i:nth-child(3) { bottom: 10px; right: 12px; animation-delay: 0.2s; }
.run-background-status-modal__loader i:nth-child(4) { bottom: 8px; left: 20px; animation-delay: 0.3s; }
.run-background-status-modal__loader i:nth-child(5) { bottom: 15px; left: 9px; animation-delay: 0.4s; }
.run-background-status-modal__loader i:nth-child(6) { top: 14px; left: 9px; animation-delay: 0.5s; }

.run-background-modal__title h2,
.run-background-status-modal__title h2,
.run-background-success-hero h2,
.run-background-integrated-hero h2,
.run-background-integrated-success-hero h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.05rem;
}

.run-background-modal__title p,
.run-background-status-modal__title p,
.run-background-success-hero p,
.run-background-integrated-hero p,
.run-background-integrated-success-hero p {
  margin: 4px 0 0;
  color: #7b8ba7;
  font-size: 0.8rem;
}

.run-background-modal__head button,
.run-background-status-modal__head button,
.run-background-success-modal__head button {
  width: 36px;
  height: 36px;
  border: 1px solid #dde4f7;
  border-radius: 50%;
  background: #fff;
  color: #8394b5;
  cursor: pointer;
}

.run-background-modal__body,
.run-background-status-modal__body,
.run-background-success-modal__body {
  flex: 1;
  overflow: auto;
  padding: 14px 18px 18px;
  display: grid;
  gap: 12px;
  background: linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.run-background-integrated-shell,
.run-background-integrated-stack {
  display: grid;
  gap: 12px;
}

.run-background-integrated-shell {
  width: min(100%, 920px);
  margin: 0 auto;
  gap: 14px;
}

.run-background-success-modal__body--centered,
.run-background-status-modal__body--centered {
  padding: 18px 20px 22px;
}

.run-background-candidate,
.run-background-package,
.run-background-option-card,
.run-background-secure,
.run-background-success-summary,
.run-background-success-next,
.run-background-source,
.run-background-integrated-candidate,
.run-background-integrated-details,
.run-background-integrated-block,
.run-background-integrated-success-grid,
.run-background-integrated-success-next,
.run-background-integrated-note {
  border: 1px solid #e5ebfb;
  border-radius: 14px;
  background: #fff;
}

.run-background-candidate {
  display: grid;
  grid-template-columns: minmax(260px, 340px) 1fr;
  gap: 14px;
  padding: 14px 16px;
}

.run-background-candidate__identity,
.run-background-integrated-candidate__identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.run-background-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd8ec 0%, #f4f6ff 100%);
  color: #ef4fa0;
  font-weight: 800;
}

.run-background-candidate__identity strong,
.run-background-integrated-candidate__identity strong {
  display: block;
  color: #233253;
  font-size: 0.92rem;
}

.run-background-candidate__identity p,
.run-background-integrated-candidate__identity p {
  margin: 4px 0 0;
  color: #6e80a1;
  font-size: 0.78rem;
}

.run-background-candidate__identity span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #21a85c;
  font-size: 0.72rem;
  font-weight: 700;
}

.run-background-candidate__identity span::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #21a85c;
}

.run-background-candidate__facts,
.run-background-package__facts,
.run-background-integrated-candidate__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.run-background-candidate__facts article,
.run-background-package__facts article,
.run-background-integrated-candidate__facts article {
  min-width: 0;
  padding-left: 12px;
  border-left: 1px solid #eef2fb;
}

.run-background-candidate__facts small,
.run-background-package__facts small,
.run-background-package__checks > small,
.run-background-success-summary small,
.run-background-source small,
.run-background-integrated-details small,
.run-background-integrated-block h3 {
  display: block;
  color: #95a3bf;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.run-background-candidate__facts strong,
.run-background-package__facts strong,
.run-background-integrated-candidate__facts strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  color: #243454;
  font-size: 0.78rem;
}

.run-background-package,
.run-background-source,
.run-background-integrated-candidate,
.run-background-integrated-details,
.run-background-integrated-block,
.run-background-integrated-success-grid,
.run-background-integrated-success-next,
.run-background-integrated-note {
  padding: 14px 16px;
}

.run-background-package__facts {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.run-background-pill {
  display: inline-flex;
  margin-top: 10px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #eef1ff;
  color: #6a5cff;
  font-size: 0.65rem;
  font-weight: 700;
}

.run-background-pill.is-soft {
  background: #f5efff;
}

.run-background-package__facts em {
  display: block;
  margin-top: 6px;
  color: #6e80a1;
  font-size: 0.7rem;
  font-style: normal;
}

.run-background-package__checks {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #eef2fb;
}

.run-background-package__check-list,
.run-background-integrated-details__check-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-top: 10px;
  align-items: stretch;
}

.run-background-package__check-list span,
.run-background-integrated-details__check-list span {
  display: inline-flex;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
  min-height: 0;
  padding: 10px 12px;
  border: 1px solid #e8edfb;
  border-radius: 10px;
  color: #43587b;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.run-background-package__check-list span :deep(svg),
.run-background-integrated-details__check-list span :deep(svg),
.run-background-success-summary__icon :deep(svg),
.run-background-integrated-block__list span :deep(svg),
.run-background-compliance-grid strong :deep(svg) {
  color: #22aa5d;
  flex: 0 0 auto;
}

.run-background-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.run-background-option-card {
  padding: 14px 16px;
}

.run-background-option-card h3,
.run-background-integrated-block h3 {
  margin: 0 0 12px;
  color: #243454;
  font-size: 0.84rem;
}

.run-background-option-card__item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.run-background-option-card__item + .run-background-option-card__item {
  margin-top: 12px;
}

.run-background-option-card__icon {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.run-background-option-card__icon.is-green {
  background: #e9f9ef;
  color: #21a85c;
}

.run-background-option-card__icon.is-pink {
  background: #fff0f7;
  color: #ef4fa0;
}

.run-background-option-card__item strong {
  display: block;
  color: #243454;
  font-size: 0.78rem;
}

.run-background-option-card__item p {
  margin: 4px 0 0;
  color: #6d7f9f;
  font-size: 0.73rem;
  line-height: 1.55;
}

.run-background-modal__foot,
.run-background-success-modal__foot {
  border-top: 1px solid #edf1fb;
}

.run-background-modal__note {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7d8ba7;
  font-size: 0.73rem;
}

.run-background-modal__actions,
.run-background-success-modal__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.run-background-modal__actions--full {
  width: 100%;
  justify-content: flex-end;
}

.run-background-success-modal__actions {
  width: min(100%, 640px);
  margin: 0 auto;
}

.run-background-success-modal__actions .run-background-button {
  flex: 1 1 0;
}

.run-background-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 150px;
  min-height: 38px;
  padding: 9px 14px;
  border-radius: 10px;
  font-size: 0.77rem;
  font-weight: 700;
  cursor: pointer;
}

.run-background-button--ghost {
  border: 1px solid #dce4f8;
  background: #fff;
  color: #33425f;
}

.run-background-button--primary {
  border: 0;
  background: #ff4fa2;
  color: #fff;
}

.run-background-status-modal__body {
  padding-top: 18px;
}

.run-background-status-modal__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) 0.85fr;
  gap: 14px;
  align-items: center;
}

.run-background-status-steps,
.run-background-integrated-steps {
  display: grid;
  gap: 4px;
}

.run-background-status-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #edf1fb;
}

.run-background-status-step__content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.run-background-status-step__content small {
  color: #95a3bf;
  font-size: 0.72rem;
  font-weight: 700;
}

.run-background-status-step__dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #d7dfef;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: transparent;
}

.run-background-status-step.is-done .run-background-status-step__dot {
  border-color: #22aa5d;
  background: #22aa5d;
  color: #fff;
}

.run-background-status-step.is-active .run-background-status-step__dot {
  border-color: #ef4fa0;
  background: #fff;
}

.run-background-status-step strong {
  display: block;
  color: #243454;
  font-size: 0.8rem;
}

.run-background-status-step p {
  margin: 5px 0 0;
  color: #6d7f9f;
  font-size: 0.74rem;
}

.run-background-status-illustration {
  position: relative;
  min-height: 320px;
  display: grid;
  place-items: center;
}

.run-background-status-illustration__orb,
.run-background-integrated-hero__orb {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 118, 181, 0.12), rgba(255, 118, 181, 0.02));
}

.run-background-status-illustration__card {
  position: relative;
  width: 180px;
  height: 140px;
  border: 1px solid #f3e4ef;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 20px 50px rgba(239, 79, 160, 0.08);
}

.run-background-status-illustration__badge,
.run-background-integrated-hero__badge {
  position: absolute;
  top: 22px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff4fa2;
  color: #fff;
}

.run-background-status-illustration__avatar {
  position: absolute;
  left: 18px;
  bottom: 18px;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ef4fa0;
}

.run-background-status-illustration__lines {
  position: absolute;
  left: 66px;
  bottom: 22px;
  display: grid;
  gap: 8px;
}

.run-background-status-illustration__lines span,
.run-background-integrated-hero__doc span {
  width: 70px;
  height: 7px;
  border-radius: 999px;
  background: #d9dfef;
}

.run-background-status-illustration__lines span:first-child,
.run-background-integrated-hero__doc span:first-child {
  width: 54px;
}

.run-background-secure {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(180deg, #f8f5ff 0%, #fff 100%);
}

.run-background-secure__icon,
.run-background-success-next__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3efff;
  color: #6b57ff;
  flex: 0 0 auto;
}

.run-background-secure strong,
.run-background-success-next strong,
.run-background-source strong,
.run-background-integrated-success-next strong {
  display: block;
  color: #243454;
  font-size: 0.8rem;
}

.run-background-secure p,
.run-background-success-next p,
.run-background-source p,
.run-background-integrated-block__list p,
.run-background-integrated-note p {
  margin: 4px 0 0;
  color: #6d7f9f;
  font-size: 0.74rem;
  line-height: 1.55;
}

.run-background-status-dots {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.run-background-status-dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e1e7f4;
}

.run-background-status-dots i.is-active {
  background: #ef4fa0;
}

.run-background-success-modal__head {
  display: flex;
  justify-content: flex-end;
  padding: 16px 18px 0;
}

.run-background-success-shell {
  width: min(100%, 760px);
  margin: 0 auto;
  display: grid;
  gap: 18px;
}

.run-background-success-hero,
.run-background-integrated-hero,
.run-background-integrated-success-hero {
  position: relative;
  display: grid;
  justify-items: center;
  text-align: center;
}

.run-background-success-hero__sparkles,
.run-background-integrated-success-hero__sparkles {
  position: absolute;
  inset: 0 auto auto 50%;
  width: 220px;
  height: 120px;
  transform: translateX(-50%);
  pointer-events: none;
}

.run-background-success-hero__sparkles i,
.run-background-integrated-success-hero__sparkles i {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.run-background-success-hero__sparkles i.is-pink,
.run-background-integrated-success-hero__sparkles i.is-pink {
  top: 18px;
  left: 30px;
  background: #ff4fa2;
}

.run-background-success-hero__sparkles i.is-green,
.run-background-integrated-success-hero__sparkles i.is-green {
  top: 44px;
  right: 40px;
  background: #24b05f;
}

.run-background-success-hero__sparkles i.is-violet,
.run-background-integrated-success-hero__sparkles i.is-violet {
  top: 8px;
  right: 80px;
  background: #7f63ff;
}

.run-background-success-hero__sparkles i.is-muted,
.run-background-integrated-success-hero__sparkles i.is-muted {
  top: 24px;
  left: 92px;
  background: #d0d8ec;
}

.run-background-success-hero__sparkles i.is-pink-alt {
  top: 58px;
  left: 64px;
  background: #ff8cc1;
}

.run-background-success-hero__check,
.run-background-integrated-success-hero__check {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eefaf2;
  color: #20aa5b;
}

.run-background-success-hero h2,
.run-background-integrated-success-hero h2 {
  margin-top: 18px;
}

.run-background-success-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
  padding: 16px;
}

.run-background-success-summary article,
.run-background-integrated-success-grid article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.run-background-success-summary__icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f4f7ff;
}

.run-background-success-summary strong,
.run-background-integrated-success-grid strong {
  display: block;
  margin-top: 4px;
  color: #243454;
  font-size: 0.78rem;
}

.run-background-success-summary strong.is-status,
.run-background-integrated-success-grid strong.is-status {
  display: inline-flex;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 999px;
  background: #e9f9ef;
  color: #1fa859;
}

.run-background-success-next {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(180deg, #f8f5ff 0%, #fff 100%);
}

.run-background-source {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: linear-gradient(180deg, #fff7fb 0%, #fff 100%);
}

.run-background-source__copy {
  display: flex;
  align-items: center;
  gap: 12px;
}

.run-background-source__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ef4fa0;
}

.run-background-source__score {
  text-align: right;
}

.run-background-source__score strong {
  color: #ef4fa0;
  font-size: 0.92rem;
}

.run-background-source__score span {
  display: inline-flex;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #fff0f7;
  color: #ef4fa0;
  font-size: 0.66rem;
  font-weight: 800;
}

.run-background-integrated-candidate__facts {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.run-background-integrated-candidate {
  display: grid;
  gap: 14px;
}

.run-background-integrated-candidate__facts article {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 12px 14px;
  border: 1px solid #eef2fb;
  border-radius: 12px;
  background: #fcfdff;
}

.run-background-integrated-details {
  display: grid;
  gap: 16px;
  align-content: start;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
}

.run-background-integrated-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: 12px;
  align-items: start;
}

.run-background-integrated-details__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.run-background-integrated-details__facts article {
  min-width: 0;
  padding: 14px;
  border: 1px solid #eef2fb;
  border-radius: 12px;
  background: #fcfdff;
}

.run-background-integrated-details__facts strong,
.run-background-compliance-grid strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  color: #243454;
  font-size: 0.78rem;
}

.run-background-integrated-details__checks {
  padding-top: 16px;
  border-top: 1px solid #eef2fb;
}

.run-background-integrated-block__list {
  display: grid;
  gap: 12px;
}

.run-background-integrated-block__list article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.run-background-integrated-block__list span {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3efff;
  color: #6a57ff;
}

.run-background-integrated-block {
  display: grid;
  gap: 14px;
}

.run-background-compliance-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.run-background-compliance-grid article {
  min-width: 0;
  padding: 12px;
  border: 1px solid #eef2fb;
  border-radius: 12px;
  background: #fcfdff;
}

.run-background-integrated-hero {
  gap: 14px;
  padding-top: 8px;
}

.run-background-integrated-hero__doc {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 26px;
  display: grid;
  gap: 10px;
  align-content: center;
  justify-items: start;
  padding: 28px 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 54px rgba(239, 79, 160, 0.12);
}

.run-background-integrated-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: linear-gradient(180deg, #f8f2ff 0%, #fff 100%);
}

.run-background-integrated-note strong {
  display: block;
  color: #6b57ff;
  font-size: 0.8rem;
}

.run-background-integrated-success-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
}

.run-background-integrated-success-next {
  display: grid;
  gap: 12px;
  background: linear-gradient(180deg, #f4fbf7 0%, #fff 100%);
}

.run-background-integrated-success-next h3 {
  margin: 0;
  color: #243454;
  font-size: 0.84rem;
}

@keyframes run-background-pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.2); opacity: 1; }
}

@media (max-width: 960px) {
  .run-background-candidate,
  .run-background-options,
  .run-background-status-modal__grid,
  .run-background-integrated-grid,
  .run-background-integrated-details__facts,
  .run-background-compliance-grid,
  .run-background-success-summary,
  .run-background-integrated-success-grid {
    grid-template-columns: 1fr;
  }

  .run-background-candidate__facts,
  .run-background-package__facts,
  .run-background-package__check-list,
  .run-background-integrated-details__check-list,
  .run-background-integrated-candidate__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .run-background-overlay {
    padding: 12px;
  }

  .run-background-modal,
  .run-background-status-modal,
  .run-background-success-modal,
  .run-background-integrated-modal,
  .run-background-integrated-status-modal,
  .run-background-integrated-success-modal {
    width: 100%;
    max-height: calc(100vh - 24px);
  }

  .run-background-modal__foot,
  .run-background-success-modal__foot,
  .run-background-source,
  .run-background-source__copy,
  .run-background-modal__actions,
  .run-background-success-modal__actions,
  .run-background-modal__actions--full {
    flex-direction: column;
    align-items: stretch;
  }

  .run-background-candidate__facts,
  .run-background-package__facts,
  .run-background-package__check-list,
  .run-background-integrated-details__check-list,
  .run-background-integrated-candidate__facts {
    grid-template-columns: 1fr;
  }

  .run-background-button {
    width: 100%;
  }
}
</style>
