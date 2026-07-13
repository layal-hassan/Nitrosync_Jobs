<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Michael Chen',
  },
  candidateRole: {
    type: String,
    default: 'Senior Software Engineer',
  },
})

const emit = defineEmits(['close'])

const evidenceRows = [
  {
    title: 'Assessment Evidence',
    subtitle: 'Technical & Behavioral Assessments',
    score: '92%',
    status: 'Strong Evidence',
    tone: 'green',
    details: ['4 assessments completed', 'Avg. score: 90 / 100', 'No critical gaps'],
  },
  {
    title: 'Final Feedback',
    subtitle: 'Interviews & Scorecards',
    score: '96%',
    status: 'Very Strong Agreement',
    tone: 'blue',
    details: ['4 / 4 feedback submitted', 'Avg. rating: 4.6 / 5', 'All recommend hire'],
  },
  {
    title: 'Hiring Committee Consensus',
    subtitle: 'Committee Decision',
    score: '94%',
    status: 'High Consensus',
    tone: 'green',
    details: ['3 of 3 approvals', 'Unanimous decision'],
  },
  {
    title: 'AI Recommendation',
    subtitle: 'AI Analysis & Role Fit',
    score: '93%',
    status: 'Supports Offer',
    tone: 'purple',
    details: ['Strong role alignment', 'High success probability', 'Low risk'],
  },
  {
    title: 'Reference Check',
    subtitle: 'Professional References',
    score: 'Pending',
    status: '1 of 2 completed',
    tone: 'orange',
    details: ['1 positive reference received', '1 reference pending'],
  },
]

const snapshotItems = [
  ['Assessments', '4 / 4 completed', 'checkCircle', 'green'],
  ['Final Feedback', '4 / 4 submitted', 'users', 'green'],
  ['Interviewer Consensus', '94% agreement', 'user-check', 'green'],
  ['AI Recommendation', 'Supports offer', 'spark', 'green'],
  ['Reference Check', '1 / 2 completed', 'clock', 'orange'],
  ['Bias & Compliance', 'No issues detected', 'shield', 'green'],
]

const confidenceBreakdown = [
  ['30%', 'Assessment Evidence'],
  ['30%', 'Final Feedback'],
  ['20%', 'Committee Consensus'],
  ['10%', 'AI Recommendation'],
  ['10%', 'Compliance & Checks'],
  ['93%', 'Overall Confidence'],
]

const initials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function closeOverlay() {
  emit('close')
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : ''
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="decision-review-overlay" @click.self="closeOverlay">
      <section class="decision-review-modal">
        <header class="decision-review-modal__head">
          <div class="decision-review-modal__title">
            <span class="decision-review-modal__title-icon">
              <AppIcon name="message" :size="20" />
            </span>

            <div>
              <h2>Decision Review</h2>
              <p>Review the proposed hiring decision and supporting evidence.</p>
            </div>
          </div>

          <div class="decision-review-modal__head-actions">
            <span class="decision-review-modal__status">
              <AppIcon name="clock" :size="14" />
              Pending Your Review
            </span>

            <button type="button" aria-label="Close decision review" @click="closeOverlay">
              <AppIcon name="close" :size="20" />
            </button>
          </div>
        </header>

        <div class="decision-review-modal__body">
          <aside class="decision-review-sidebar">
            <article class="decision-review-profile">
              <span class="decision-review-profile__avatar">{{ initials }}</span>

              <div>
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
                <em>Validation Stage</em>
              </div>
            </article>

            <article class="decision-review-card decision-review-card--decision">
              <div class="decision-review-card__label-row">
                <small>Proposed Decision</small>
                <span class="decision-review-card__check">
                  <AppIcon name="checkCircle" :size="16" />
                </span>
              </div>

              <h3>Proceed to Offer</h3>

              <div class="decision-review-card__requester">
                <div>
                  <small>Requested By</small>
                  <strong>James Lee</strong>
                  <span>Recruiter</span>
                </div>

                <div class="decision-review-card__request-time">
                  <strong>Apr 24, 2025</strong>
                  <span>10:30 AM</span>
                </div>
              </div>
            </article>

            <article class="decision-review-card decision-review-card--confidence">
              <small>Overall Decision Confidence</small>

              <div class="decision-review-gauge">
                <div class="decision-review-gauge__ring">
                  <span>93%</span>
                </div>
              </div>

              <p>High confidence based on strong evidence across assessments, feedback, consensus, and AI analysis.</p>

              <button type="button" class="decision-review-link">
                <AppIcon name="info" :size="14" />
                <span>How this score is calculated</span>
                <AppIcon name="chevronRight" :size="14" />
              </button>
            </article>

            <article class="decision-review-card decision-review-card--snapshot">
              <h3>Decision Snapshot</h3>

              <div class="decision-review-snapshot-list">
                <div v-for="item in snapshotItems" :key="item[0]" class="decision-review-snapshot-item">
                  <span class="decision-review-snapshot-item__icon" :class="`tone-${item[3]}`">
                    <AppIcon :name="item[2]" :size="15" />
                  </span>

                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>

                  <AppIcon :name="item[3] === 'orange' ? 'clock' : 'checkCircle'" :size="16" :class="`tone-${item[3]}`" />
                </div>
              </div>
            </article>
          </aside>

          <section class="decision-review-main">
            <section class="decision-review-section">
              <h3>Decision Summary</h3>
              <p>
                The candidate has consistently demonstrated strong technical expertise, problem-solving ability,
                clear communication, and ownership. The hiring team unanimously recommends proceeding with an offer.
              </p>
            </section>

            <section class="decision-review-section">
              <h3>Supporting Evidence</h3>

              <div class="decision-review-evidence-table">
                <div class="decision-review-evidence-table__head">
                  <span>Evidence</span>
                  <span>Confidence / Status</span>
                  <span>Details</span>
                  <span>Action</span>
                </div>

                <article
                  v-for="row in evidenceRows"
                  :key="row.title"
                  class="decision-review-evidence-row"
                >
                  <div class="decision-review-evidence-row__identity">
                    <span class="decision-review-evidence-row__icon" :class="`tone-${row.tone}`">
                      <AppIcon
                        :name="row.title === 'Assessment Evidence'
                          ? 'clipboard-check'
                          : row.title === 'Final Feedback'
                            ? 'users'
                            : row.title === 'Hiring Committee Consensus'
                              ? 'user-check'
                              : row.title === 'AI Recommendation'
                                ? 'spark'
                                : 'link'"
                        :size="18"
                      />
                    </span>

                    <div>
                      <strong>{{ row.title }}</strong>
                      <small>{{ row.subtitle }}</small>
                    </div>
                  </div>

                  <div class="decision-review-evidence-row__status" :class="`tone-${row.tone}`">
                    <template v-if="row.score === 'Pending'">
                      <div class="decision-review-evidence-row__status-copy is-pending">
                        <span class="decision-review-evidence-row__pending-icon">
                          <AppIcon name="clock" :size="16" />
                        </span>
                        <strong>{{ row.status }}</strong>
                        <small>{{ row.score === 'Pending' ? '1 of 2 completed' : '' }}</small>
                      </div>
                    </template>
                    <template v-else>
                      <span class="decision-review-evidence-row__score">{{ row.score }}</span>
                      <strong>{{ row.status }}</strong>
                    </template>
                  </div>

                  <ul class="decision-review-evidence-row__details">
                    <li v-for="detail in row.details" :key="detail">{{ detail }}</li>
                  </ul>

                  <button type="button" class="decision-review-evidence-row__view">
                    View
                  </button>
                </article>
              </div>
            </section>

            <section class="decision-review-calculation">
              <div class="decision-review-calculation__title">
                <AppIcon name="info" :size="15" />
                <strong>Decision Confidence Calculation</strong>
              </div>

              <div class="decision-review-calculation__grid">
                <div v-for="item in confidenceBreakdown" :key="item[1]" class="decision-review-calculation__item">
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </div>
              </div>
            </section>

            <section class="decision-review-section">
              <div class="decision-review-section__heading">
                <h3>Approver Comment <small>(optional)</small></h3>
              </div>

              <div class="decision-review-comment">
                <textarea
                  rows="5"
                  maxlength="500"
                  placeholder="Share your feedback or add any notes about this decision..."
                />
                <small>0 / 500</small>
              </div>
            </section>

            <footer class="decision-review-actions">
              <button type="button" class="decision-review-actions__button tone-orange">
                <AppIcon name="chevronRight" :size="18" />
                <div>
                  <strong>Request Changes</strong>
                  <span>Need more information or changes</span>
                </div>
              </button>

              <button type="button" class="decision-review-actions__button tone-red">
                <AppIcon name="close" :size="18" />
                <div>
                  <strong>Reject Decision</strong>
                  <span>I do not agree</span>
                </div>
              </button>

              <button type="button" class="decision-review-actions__button tone-pink">
                <AppIcon name="checkCircle" :size="18" />
                <div>
                  <strong>Approve Decision</strong>
                  <span>I agree with this decision</span>
                </div>
              </button>
            </footer>
          </section>
        </div>

        <div class="decision-review-modal__footnote">
          <AppIcon name="lock" :size="14" />
          <span>Your review and comments are confidential and will be recorded in the audit trail.</span>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.decision-review-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(6px);
}

.decision-review-modal {
  width: min(1240px, 100%);
  max-height: calc(100vh - 36px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 24px;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
}

.decision-review-modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 30px;
  border-bottom: 1px solid #e8eef7;
}

.decision-review-modal__title {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.decision-review-modal__title-icon {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #f768b6 0%, #ef5da8 100%);
  color: #ffffff;
  flex-shrink: 0;
}

.decision-review-modal__title h2 {
  margin: 0;
  font-size: 2.1rem;
  font-weight: 800;
  color: #1f2a44;
}

.decision-review-modal__title p {
  margin: 4px 0 0;
  font-size: 1.05rem;
  color: #7183a6;
}

.decision-review-modal__head-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.decision-review-modal__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(249, 115, 22, 0.2);
  background: #fff5ec;
  color: #f97316;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
}

.decision-review-modal__head-actions button {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbe4f0;
  border-radius: 14px;
  background: #ffffff;
  color: #7c8cab;
  cursor: pointer;
}

.decision-review-modal__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: 332px minmax(0, 1fr);
}

.decision-review-sidebar {
  padding: 30px 24px;
  background: linear-gradient(180deg, #f8fbff 0%, #f3f7fd 100%);
  border-right: 1px solid #e8eef7;
}

.decision-review-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}

.decision-review-profile__avatar {
  width: 60px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1c27d 0%, #c77d36 100%);
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 800;
  flex-shrink: 0;
}

.decision-review-profile strong {
  display: block;
  font-size: 1.55rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1f2a44;
}

.decision-review-profile p,
.decision-review-profile em {
  display: block;
  margin-top: 6px;
  font-style: normal;
  color: #7183a6;
}

.decision-review-profile em {
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  background: #d7f7e8;
  color: #16a34a;
  font-size: 0.82rem;
  font-weight: 700;
}

.decision-review-card {
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 14px 32px rgba(148, 163, 184, 0.08);
}

.decision-review-card + .decision-review-card {
  margin-top: 18px;
}

.decision-review-card__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.decision-review-card__label-row small,
.decision-review-card--confidence small {
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7f8faf;
}

.decision-review-card__check {
  color: #16a34a;
}

.decision-review-card--decision h3 {
  margin: 14px 0 20px;
  font-size: 1.9rem;
  line-height: 1.12;
  color: #0f9a5f;
}

.decision-review-card__requester {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  padding-top: 18px;
  border-top: 1px solid #edf2f9;
}

.decision-review-card__requester strong {
  display: block;
  font-size: 1.05rem;
  color: #1f2a44;
}

.decision-review-card__requester span {
  display: block;
  margin-top: 4px;
  color: #7183a6;
  font-size: 0.92rem;
}

.decision-review-card__request-time {
  text-align: right;
}

.decision-review-gauge {
  display: flex;
  justify-content: center;
  margin: 18px 0 14px;
}

.decision-review-gauge__ring {
  width: 148px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #ffffff 58%, transparent 59%),
    conic-gradient(#ef5da8 0 334deg, #e5ecf7 334deg 360deg);
  display: grid;
  place-items: center;
}

.decision-review-gauge__ring span {
  font-size: 2.4rem;
  font-weight: 800;
  color: #1f2a44;
}

.decision-review-card--confidence p {
  margin: 0;
  color: #7183a6;
  line-height: 1.65;
}

.decision-review-link {
  margin-top: 16px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: #ef5da8;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
}

.decision-review-card--snapshot h3 {
  margin: 0 0 16px;
  font-size: 1.08rem;
  font-weight: 800;
  color: #1f2a44;
}

.decision-review-snapshot-list {
  display: grid;
  gap: 14px;
}

.decision-review-snapshot-item {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 18px;
  align-items: start;
  gap: 14px;
}

.decision-review-snapshot-item__icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #f5f7ff;
}

.decision-review-snapshot-item > div {
  min-width: 0;
}

.decision-review-snapshot-item strong {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.28;
  color: #1f2a44;
}

.decision-review-snapshot-item small {
  display: block;
  margin-top: 5px;
  font-size: 0.9rem;
  line-height: 1.45;
  color: #7183a6;
}

.decision-review-snapshot-item > :last-child {
  justify-self: end;
  margin-top: 2px;
}

.decision-review-main {
  padding: 26px 30px 30px;
}

.decision-review-section + .decision-review-section {
  margin-top: 26px;
}

.decision-review-section h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1f2a44;
}

.decision-review-section h3 small {
  font-size: 0.92rem;
  font-weight: 600;
  color: #94a3bd;
}

.decision-review-section p {
  margin: 10px 0 0;
  color: #5f708f;
  line-height: 1.75;
}

.decision-review-evidence-table {
  margin-top: 14px;
  border: 1px solid #e3ebf6;
  border-radius: 22px;
  overflow: hidden;
  background: #ffffff;
}

.decision-review-evidence-table__head {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(200px, 0.95fr) minmax(0, 1.45fr) 84px;
  gap: 20px;
  padding: 16px 20px;
  background: #fbfcff;
  border-bottom: 1px solid #edf2f9;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8d9cb8;
}

.decision-review-evidence-row {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(200px, 0.95fr) minmax(0, 1.45fr) 84px;
  gap: 20px;
  align-items: center;
  padding: 18px 20px;
}

.decision-review-evidence-row + .decision-review-evidence-row {
  border-top: 1px solid #edf2f9;
}

.decision-review-evidence-row__identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.decision-review-evidence-row__icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #f5f7ff;
  flex-shrink: 0;
}

.decision-review-evidence-row__identity strong {
  display: block;
  font-size: 1rem;
  font-weight: 800;
  color: #1f2a44;
}

.decision-review-evidence-row__identity small {
  display: block;
  margin-top: 4px;
  color: #8a99b5;
}

.decision-review-evidence-row__status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.decision-review-evidence-row__status-copy {
  display: grid;
  gap: 4px;
}

.decision-review-evidence-row__status-copy strong {
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.3;
}

.decision-review-evidence-row__status-copy.is-pending {
  grid-template-columns: 56px minmax(0, 1fr);
  align-items: center;
  column-gap: 14px;
  row-gap: 4px;
  justify-items: start;
}

.decision-review-evidence-row__pending-icon {
  grid-row: 1 / span 2;
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 5px solid currentColor;
  background: #ffffff;
  box-sizing: border-box;
}

.decision-review-evidence-row__status-copy.is-pending strong {
  margin: 0;
  color: inherit;
}

.decision-review-evidence-row__status-copy.is-pending small {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.3;
  color: #94a3bd;
}

.decision-review-evidence-row__score {
  min-width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 4px solid currentColor;
  background: #ffffff;
  font-size: 0.95rem;
  font-weight: 800;
}

.decision-review-evidence-row__status strong {
  font-size: 1rem;
  font-weight: 800;
}

.decision-review-evidence-row__details {
  margin: 0;
  padding-left: 18px;
  color: #5f708f;
  line-height: 1.65;
}

.decision-review-evidence-row__view {
  height: 40px;
  border: 1px solid #d7e0ee;
  border-radius: 12px;
  background: #ffffff;
  color: #44526d;
  font-weight: 700;
  cursor: pointer;
}

.decision-review-calculation {
  margin-top: 24px;
  padding: 18px 20px;
  border: 1px solid #dfe7f5;
  border-radius: 18px;
  background: #f7f9ff;
}

.decision-review-calculation__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #5267cf;
}

.decision-review-calculation__grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
}

.decision-review-calculation__item {
  display: grid;
  gap: 6px;
  justify-items: center;
  text-align: center;
}

.decision-review-calculation__item strong {
  font-size: 1.15rem;
  font-weight: 800;
  color: #2b3783;
}

.decision-review-calculation__item small {
  color: #7183a6;
  line-height: 1.45;
}

.decision-review-section__heading {
  margin-top: 26px;
}

.decision-review-comment {
  margin-top: 14px;
  position: relative;
}

.decision-review-comment textarea {
  width: 100%;
  min-height: 112px;
  padding: 16px 18px 34px;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  outline: none;
  resize: vertical;
  font: inherit;
  color: #1f2a44;
  background: #ffffff;
}

.decision-review-comment textarea:focus {
  border-color: #ef5da8;
  box-shadow: 0 0 0 4px rgba(239, 93, 168, 0.12);
}

.decision-review-comment small {
  position: absolute;
  right: 16px;
  bottom: 12px;
  color: #94a3bd;
}

.decision-review-actions {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.decision-review-actions__button {
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 16px;
  border: 1px solid #dbe4f0;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
}

.decision-review-actions__button :deep(svg) {
  flex-shrink: 0;
}

.decision-review-actions__button strong {
  display: block;
  font-size: 0.92rem;
  font-weight: 800;
  line-height: 1.2;
}

.decision-review-actions__button span {
  display: block;
  margin-top: 2px;
  font-size: 0.85rem;
  line-height: 1.35;
  color: inherit;
  opacity: 0.9;
}

.decision-review-actions__button.tone-orange {
  border-color: rgba(249, 115, 22, 0.28);
  background: #fff8f2;
  color: #f97316;
}

.decision-review-actions__button.tone-red {
  border-color: rgba(244, 63, 94, 0.28);
  background: #fff7f8;
  color: #ef4444;
}

.decision-review-actions__button.tone-pink {
  border: none;
  background: linear-gradient(135deg, #f65aa7 0%, #ef5da8 100%);
  color: #ffffff;
  box-shadow: 0 18px 34px rgba(239, 93, 168, 0.24);
}

.decision-review-modal__footnote {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #e8eef7;
  color: #7183a6;
  background: #fbfcff;
  font-size: 0.92rem;
}

.tone-green {
  color: #16a34a;
}

.tone-blue {
  color: #2563eb;
}

.tone-purple {
  color: #7c3aed;
}

.tone-orange {
  color: #f97316;
}

@media (max-width: 1180px) {
  .decision-review-modal {
    width: min(1080px, 100%);
  }

  .decision-review-modal__body {
    grid-template-columns: 1fr;
  }

  .decision-review-sidebar {
    border-right: none;
    border-bottom: 1px solid #e8eef7;
  }

  .decision-review-evidence-table__head,
  .decision-review-evidence-row {
    grid-template-columns: minmax(0, 1.25fr) minmax(170px, 0.9fr) minmax(0, 1.2fr) 72px;
  }
}

@media (max-width: 900px) {
  .decision-review-overlay {
    padding: 10px;
  }

  .decision-review-modal {
    max-height: calc(100vh - 20px);
    border-radius: 20px;
  }

  .decision-review-modal__head {
    flex-direction: column;
    align-items: stretch;
    padding: 18px;
  }

  .decision-review-modal__head-actions {
    justify-content: space-between;
  }

  .decision-review-sidebar,
  .decision-review-main {
    padding: 18px;
  }

  .decision-review-evidence-table {
    border-radius: 18px;
  }

  .decision-review-evidence-table__head {
    display: none;
  }

  .decision-review-evidence-row {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .decision-review-calculation__grid,
  .decision-review-actions {
    grid-template-columns: 1fr;
  }
}
</style>
