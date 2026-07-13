<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import NitroSyncLogo from './NitroSyncLogo.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  row: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const fallbackDetails = {
  title: 'Manual Email Details',
  subtitle: 'Reference by David Wilson',
  subtitleMeta: 'Part of 3 of 3 references',
  referenceType: 'Manual Email',
  requesterName: 'Sarah Johnson',
  requesterRole: 'Director of Engineering',
  requestedOn: 'May 13, 2026',
  dueDate: 'May 27, 2026',
  questionTemplate: 'Standard Reference Template',
  questionCount: 10,
  confidentialityTitle: 'Responses are confidential',
  confidentialityCopy: 'References are only visible to authorized hiring team members.',
  status: 'Completed',
  completedText: 'Reference submitted on May 20, 2026',
  sentAt: 'May 13, 2026 at 10:24 AM',
  sentBy: 'Sarah Johnson',
  toEmail: 'david.wilson@gmail.com',
  subject: 'Reference request for Marvin McKinney – Product Designer',
  relationship: 'Worked together',
  period: 'Jan 2021 - Dec 2022 (1 yr 11 mo)',
  teamSize: '8 designers',
  reportingLine: 'Same Manager',
  phone: '+1 (415) 555-0178',
  referenceId: 'REF-MAN-77432',
  buttonLabel: 'View original reference',
  completionNote: 'David Wilson has submitted the reference.',
  timeline: [
    ['Request sent', 'May 13, 2026', 'clock'],
    ['Reminder sent', 'May 16, 2026', 'bell'],
    ['Completed', 'May 20, 2026', 'checkCircle'],
  ],
  body: [
    'Hi David,',
    "I hope you're doing well.",
    "I'm reaching out to ask if you would be willing to provide a reference for Marvin McKinney, who is applying for the Product Designer role at Acme Inc.",
    'Your insights about your experience working with Marvin will help us better understand their skills, impact, and potential.',
    'The reference will take approximately 8–10 minutes to complete and your responses will remain confidential.',
  ],
}

const currentRow = computed(() => props.row ?? {})
const details = computed(() => ({
  ...fallbackDetails,
  subtitle: `Reference by ${currentRow.value.name || 'David Wilson'}`,
  referenceType: currentRow.value.source || fallbackDetails.referenceType,
  status: currentRow.value.sourceKind === 'uploaded' ? 'Uploaded' : fallbackDetails.status,
  completedText: currentRow.value.sourceKind === 'uploaded'
    ? `Reference uploaded on ${currentRow.value.completed || 'May 20, 2026'}`
    : fallbackDetails.completedText,
  buttonLabel: currentRow.value.sourceKind === 'uploaded' ? 'View uploaded reference' : fallbackDetails.buttonLabel,
  ...((currentRow.value && currentRow.value.requestDetails) ? currentRow.value.requestDetails : {}),
}))

const referenceInitials = computed(() => (
  (currentRow.value.name || 'David Wilson')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const title = computed(() => {
  if (currentRow.value?.requestDetails?.title) {
    return currentRow.value.requestDetails.title
  }

  if (currentRow.value.sourceKind === 'uploaded') {
    return 'Uploaded Reference Details'
  }

  if (currentRow.value.sourceKind === 'integrated') {
    return 'Integrated Reference Details'
  }

  return 'Manual Email Details'
})

function closeOverlay() {
  emit('close')
}
</script>

<template>
  <div v-if="open" class="original-reference-overlay" @click.self="closeOverlay">
    <section class="original-reference-modal">
      <header class="original-reference-modal__head">
        <div>
          <h2>{{ title }}</h2>
          <p>{{ details.subtitle }} &middot; {{ details.subtitleMeta }}</p>
        </div>

        <button type="button" aria-label="Close original reference details" @click="closeOverlay">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="original-reference-modal__body">
        <aside class="original-reference-panel">
          <section class="original-reference-section">
            <h3>Reference Information</h3>

            <div class="original-reference-person">
              <span class="original-reference-person__avatar">{{ referenceInitials }}</span>
              <div>
                <strong>{{ currentRow.name }}</strong>
                <p>{{ currentRow.role }}</p>
                <em>{{ currentRow.tag }}</em>
              </div>
            </div>
          </section>

          <section class="original-reference-section">
            <h4>Relationship</h4>
            <dl class="original-reference-meta-list">
              <div>
                <dt>Relationship</dt>
                <dd>{{ details.relationship }}</dd>
              </div>
              <div>
                <dt>Worked together</dt>
                <dd>{{ details.period }}</dd>
              </div>
              <div>
                <dt>Team size</dt>
                <dd>{{ details.teamSize }}</dd>
              </div>
              <div>
                <dt>Reporting line</dt>
                <dd>{{ details.reportingLine }}</dd>
              </div>
            </dl>
          </section>

          <section class="original-reference-section">
            <h4>Contact &amp; Source</h4>
            <dl class="original-reference-meta-list">
              <div>
                <dt>Source</dt>
                <dd class="original-reference-source">
                  <AppIcon name="mail" :size="12" />
                  {{ details.referenceType }}
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd class="original-reference-copy">
                  {{ details.toEmail }}
                  <AppIcon name="external-link" :size="12" />
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd class="original-reference-copy">
                  {{ details.phone }}
                  <AppIcon name="external-link" :size="12" />
                </dd>
              </div>
              <div>
                <dt>Reference ID</dt>
                <dd>{{ details.referenceId }}</dd>
              </div>
            </dl>

            <button type="button" class="original-reference-inline">
              {{ details.buttonLabel }}
              <AppIcon name="external-link" :size="12" />
            </button>
          </section>
        </aside>

        <main class="original-reference-main">
          <section class="original-reference-panel">
            <div class="original-reference-section__head">
              <h3>Email Conversation</h3>
            </div>

            <div class="original-reference-conversation">
              <div class="original-reference-conversation__meta">
                <span class="original-reference-badge">Sent</span>
                <strong>{{ details.sentAt }}</strong>
                <span>Sent by <b>{{ details.sentBy }}</b></span>
              </div>

              <dl class="original-reference-message-meta">
                <div>
                  <dt>To</dt>
                  <dd>{{ details.toEmail }}</dd>
                </div>
                <div>
                  <dt>Subject</dt>
                  <dd>{{ details.subject }}</dd>
                </div>
              </dl>

              <article class="original-reference-message">
                <header>
                  <NitroSyncLogo size="xs" :show-tagline="false" />
                </header>

                <div class="original-reference-message__body">
                  <p v-for="paragraph in details.body" :key="paragraph">{{ paragraph }}</p>
                </div>

                <div class="original-reference-message__action">
                  <button type="button">Provide Reference</button>
                  <small>This link will expire on {{ details.dueDate }}</small>
                </div>
              </article>

              <article class="original-reference-status">
                <div class="original-reference-status__top">
                  <span class="original-reference-badge is-success">Completed</span>
                  <strong>{{ currentRow.completed }} at 02:18 PM</strong>
                  <span>1 reminder sent</span>
                </div>

                <div class="original-reference-status__body">
                  <div>
                    <strong><AppIcon name="checkCircle" :size="14" /> Reference completed</strong>
                    <p>{{ details.completionNote }}</p>
                  </div>

                  <button type="button" class="original-reference-inline">
                    View submitted reference
                    <AppIcon name="external-link" :size="12" />
                  </button>
                </div>
              </article>

              <div class="original-reference-timeline">
                <article v-for="[label, date, icon] in details.timeline" :key="label">
                  <span><AppIcon :name="icon" :size="12" /></span>
                  <strong>{{ label }}</strong>
                  <small>{{ date }}</small>
                </article>
              </div>
            </div>
          </section>
        </main>

        <aside class="original-reference-panel">
          <section class="original-reference-section">
            <h3>Request Settings</h3>

            <dl class="original-reference-meta-list">
              <div>
                <dt>Reference Type</dt>
                <dd class="original-reference-source">
                  <AppIcon name="calendar" :size="12" />
                  {{ details.referenceType }}
                </dd>
              </div>
              <div>
                <dt>Requested by</dt>
                <dd class="original-reference-requester">
                  <span>{{ details.requesterName.slice(0, 2).toUpperCase() }}</span>
                  <div>
                    <strong>{{ details.requesterName }}</strong>
                    <small>{{ details.requesterRole }}</small>
                  </div>
                </dd>
              </div>
              <div>
                <dt>Requested on</dt>
                <dd class="original-reference-source">
                  <AppIcon name="calendar" :size="12" />
                  {{ details.requestedOn }}
                </dd>
              </div>
              <div>
                <dt>Due date</dt>
                <dd class="original-reference-source">
                  <AppIcon name="calendar" :size="12" />
                  {{ details.dueDate }}
                </dd>
              </div>
            </dl>
          </section>

          <section class="original-reference-section">
            <h4>Questions included</h4>
            <p class="original-reference-note">{{ details.questionTemplate }}</p>
            <div class="original-reference-check">
              <AppIcon name="check" :size="12" />
              {{ details.questionCount }} questions
            </div>
          </section>

          <section class="original-reference-section">
            <h4>Confidentiality</h4>
            <div class="original-reference-check is-green">
              <AppIcon name="shield" :size="12" />
              {{ details.confidentialityTitle }}
            </div>
            <p class="original-reference-note">{{ details.confidentialityCopy }}</p>
          </section>

          <section class="original-reference-section">
            <h4>Status</h4>
            <span class="original-reference-status-pill">{{ details.status }}</span>
            <p class="original-reference-note">{{ details.completedText }}</p>
          </section>
        </aside>
      </div>

      <footer class="original-reference-modal__foot">
        <button type="button" class="original-reference-button original-reference-button--ghost" @click="closeOverlay">
          Back
        </button>

        <div class="original-reference-modal__actions">
          <button type="button" class="original-reference-button original-reference-button--ghost">
            <AppIcon name="mail" :size="13" />
            Resend request
          </button>
          <button type="button" class="original-reference-button original-reference-button--primary" @click="closeOverlay">
            Close
          </button>
        </div>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.original-reference-overlay {
  position: fixed;
  inset: 0;
  z-index: 1720;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(17, 24, 39, 0.34);
  backdrop-filter: blur(10px);
}

.original-reference-modal {
  width: min(1260px, calc(100vw - 40px));
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dfe6fb;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(41, 58, 92, 0.24);
}

.original-reference-modal__head,
.original-reference-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
}

.original-reference-modal__head {
  border-bottom: 1px solid #edf1fb;
}

.original-reference-modal__head h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.15rem;
}

.original-reference-modal__head p {
  margin: 6px 0 0;
  color: #7a89a8;
  font-size: 0.78rem;
}

.original-reference-modal__head button {
  width: 36px;
  height: 36px;
  border: 1px solid #dde5f8;
  border-radius: 50%;
  background: #fff;
  color: #8192b5;
  cursor: pointer;
}

.original-reference-modal__body {
  flex: 1;
  overflow: auto;
  padding: 14px;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 260px;
  gap: 14px;
  background: linear-gradient(180deg, #fff 0%, #fbfcff 100%);
}

.original-reference-panel {
  border: 1px solid #e7ecfb;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
}

.original-reference-section + .original-reference-section {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #eef2fb;
}

.original-reference-section h3,
.original-reference-section__head h3 {
  margin: 0 0 14px;
  color: #1f2a44;
  font-size: 0.92rem;
}

.original-reference-section h4 {
  margin: 0 0 12px;
  color: #2e3d5d;
  font-size: 0.78rem;
}

.original-reference-person {
  display: flex;
  align-items: center;
  gap: 12px;
}

.original-reference-person__avatar {
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

.original-reference-person strong {
  display: block;
  color: #243454;
  font-size: 0.96rem;
}

.original-reference-person p,
.original-reference-note {
  margin: 4px 0 0;
  color: #677a9f;
  font-size: 0.75rem;
  line-height: 1.6;
}

.original-reference-person em {
  display: inline-flex;
  margin-top: 8px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #f1efff;
  color: #695dff;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 700;
}

.original-reference-meta-list {
  display: grid;
  gap: 12px;
  margin: 0;
}

.original-reference-meta-list dt {
  margin-bottom: 4px;
  color: #97a5bf;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.original-reference-meta-list dd {
  margin: 0;
  color: #253555;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.55;
}

.original-reference-source,
.original-reference-copy {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.original-reference-copy :deep(svg) {
  color: #8fa0c2;
}

.original-reference-inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 12px;
  border: 1px solid #dbe3f8;
  border-radius: 10px;
  background: #fff;
  color: #33425f;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.original-reference-conversation {
  display: grid;
  gap: 12px;
}

.original-reference-conversation__meta,
.original-reference-status__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  color: #6d7c99;
  font-size: 0.72rem;
}

.original-reference-conversation__meta strong,
.original-reference-status__top strong {
  color: #243454;
  font-size: 0.74rem;
}

.original-reference-conversation__meta b {
  color: #6b5cff;
}

.original-reference-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f1efff;
  color: #695dff;
  font-size: 0.64rem;
  font-weight: 800;
  text-transform: uppercase;
}

.original-reference-badge.is-success,
.original-reference-status-pill {
  background: #e9f9ef;
  color: #21a95d;
}

.original-reference-message-meta {
  display: grid;
  gap: 12px;
  margin: 0;
}

.original-reference-message-meta dt {
  color: #94a3bf;
  font-size: 0.68rem;
  font-weight: 700;
}

.original-reference-message-meta dd {
  margin: 4px 0 0;
  color: #243454;
  font-size: 0.78rem;
  font-weight: 600;
}

.original-reference-message {
  border: 1px solid #e8edfb;
  border-radius: 12px;
  padding: 14px;
  background: linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.original-reference-message header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}


.original-reference-message__body {
  display: grid;
  gap: 10px;
}

.original-reference-message__body p,
.original-reference-status__body p {
  margin: 0;
  color: #5e7191;
  font-size: 0.76rem;
  line-height: 1.7;
}

.original-reference-message__action {
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-top: 16px;
}

.original-reference-message__action button,
.original-reference-button--primary {
  min-width: 180px;
  min-height: 38px;
  padding: 9px 16px;
  border: 0;
  border-radius: 8px;
  background: #ff4fa2;
  color: #fff;
  font-size: 0.76rem;
  font-weight: 800;
  cursor: pointer;
}

.original-reference-message__action small {
  color: #9aa7bf;
  font-size: 0.68rem;
}

.original-reference-status {
  border: 1px solid #e8edfb;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

.original-reference-status__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 12px;
}

.original-reference-status__body strong {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #243454;
  font-size: 0.78rem;
}

.original-reference-status__body strong :deep(svg),
.original-reference-check.is-green :deep(svg) {
  color: #21a95d;
}

.original-reference-timeline {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  padding: 14px 10px;
  border: 1px solid #edf1fb;
  border-radius: 12px;
  background: #fcfdff;
}

.original-reference-timeline article {
  display: grid;
  justify-items: center;
  gap: 5px;
  text-align: center;
}

.original-reference-timeline article span {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f7ff;
  color: #8b98b5;
}

.original-reference-timeline article:last-child span {
  background: #e9f9ef;
  color: #21a95d;
}

.original-reference-timeline strong {
  color: #31415f;
  font-size: 0.72rem;
}

.original-reference-timeline small,
.original-reference-check,
.original-reference-requester small {
  color: #6e7e9d;
  font-size: 0.7rem;
}

.original-reference-requester {
  display: flex;
  align-items: center;
  gap: 10px;
}

.original-reference-requester span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd7eb 0%, #f4f6ff 100%);
  color: #ef4fa0;
  font-size: 0.72rem;
  font-weight: 800;
}

.original-reference-requester strong {
  display: block;
  color: #243454;
  font-size: 0.76rem;
}

.original-reference-check {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  font-weight: 700;
}

.original-reference-check :deep(svg) {
  color: #21a95d;
}

.original-reference-status-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.original-reference-modal__foot {
  border-top: 1px solid #edf1fb;
}

.original-reference-modal__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.original-reference-button {
  min-width: 108px;
  min-height: 38px;
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.original-reference-button--ghost {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #dbe3f8;
  background: #fff;
  color: #33425f;
}

@media (max-width: 1180px) {
  .original-reference-modal__body {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .original-reference-overlay {
    padding: 10px;
  }

  .original-reference-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
  }

  .original-reference-status__body,
  .original-reference-modal__foot {
    flex-direction: column;
    align-items: stretch;
  }

  .original-reference-modal__actions,
  .original-reference-timeline {
    grid-template-columns: 1fr;
  }
}
</style>
