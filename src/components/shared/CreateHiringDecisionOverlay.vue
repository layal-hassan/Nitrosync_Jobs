<script setup>
import { computed, ref, watch } from 'vue'
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

const emit = defineEmits(['close', 'save-draft', 'save-decision', 'create-offer'])

const decisionOptions = [
  {
    id: 'offer',
    title: 'Proceed to Offer',
    copy: 'We will extend an offer to this candidate.',
    icon: 'checkCircle',
    tone: 'pink',
  },
  {
    id: 'hold',
    title: 'Hold Candidate',
    copy: 'Need more information or revisit later.',
    icon: 'clock',
    tone: 'orange',
  },
  {
    id: 'reject',
    title: 'Reject Candidate',
    copy: 'We will not move forward with this candidate.',
    icon: 'close',
    tone: 'red',
  },
]

const evidenceItems = [
  ['Final feedback reviewed', 'Completed', 'checkCircle', 'green'],
  ['All scorecards submitted', 'Completed', 'checkCircle', 'green'],
  ['AI recommendation reviewed', 'Completed', 'checkCircle', 'green'],
  ['Hiring committee approval', 'Completed', 'checkCircle', 'green'],
  ['Reference checks', 'Completed', 'checkCircle', 'green'],
  ['Executive approval', 'Pending', 'alert', 'orange'],
]

const approvals = [
  ['Sarah Johnson', 'Engineering Manager', 'Approved', 'Apr 24, 2025', 'green'],
  ['David Kim', 'Hiring Manager', 'Approved', 'Apr 24, 2025', 'green'],
  ['Priya Patel', 'Product Manager', 'Approved', 'Apr 24, 2025', 'green'],
  ['James Lee', 'Recruiter', 'Pending', 'Waiting for your approval', 'pink'],
]

const impactItems = [
  ['Candidate will move to Offer stage', 'mail'],
  ['Offer workflow will begin', 'users'],
  ['Notifications will be sent', 'bell'],
]

const selectedDecision = ref('offer')
const reasonText = ref('')

const initials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function resetForm() {
  selectedDecision.value = 'offer'
  reasonText.value = 'The candidate consistently demonstrated strong technical capabilities, leadership potential, and a collaborative mindset throughout the interview process. The hiring team reached strong consensus across all evaluations and no significant concerns remain.'
}

function closeOverlay() {
  emit('close')
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="create-hiring-decision-overlay" @click.self="closeOverlay">
      <section class="create-hiring-decision-modal">
        <header class="create-hiring-decision-modal__head">
          <div class="create-hiring-decision-modal__title">
            <span>
              <AppIcon name="document" :size="20" />
            </span>
            <div>
              <h2>Create Hiring Decision</h2>
              <p>Record the final hiring decision for this candidate</p>
            </div>
          </div>

          <button type="button" aria-label="Close create hiring decision" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="create-hiring-decision-modal__body">
          <section class="create-hiring-decision-main">
            <article class="decision-candidate-card">
              <div class="decision-candidate-card__identity">
                <span class="decision-candidate-card__avatar">{{ initials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <p>{{ candidateRole }}</p>
                  <em>Validation Stage</em>
                </div>
              </div>

              <div class="decision-candidate-card__stats">
                <div>
                  <small>Applied On</small>
                  <strong>Mar 10, 2025</strong>
                </div>
                <div>
                  <small>Current Stage</small>
                  <strong>Validation</strong>
                </div>
                <div>
                  <small>Final Interviews</small>
                  <strong>4 / 4 Completed</strong>
                </div>
                <div>
                  <small>Overall Rating</small>
                  <strong>4.7 / 5</strong>
                </div>
              </div>
            </article>

            <section class="decision-section">
              <h3>1. Final Decision</h3>
              <p>Select and record the official hiring decision.</p>

              <div class="decision-options">
                <button
                  v-for="item in decisionOptions"
                  :key="item.id"
                  type="button"
                  class="decision-option"
                  :class="[{ 'is-active': selectedDecision === item.id }, `tone-${item.tone}`]"
                  @click="selectedDecision = item.id"
                >
                  <i />
                  <span class="decision-option__icon">
                    <AppIcon :name="item.icon" :size="20" />
                  </span>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.copy }}</p>
                  <em v-if="selectedDecision === item.id">
                    <AppIcon name="checkCircle" :size="14" />
                  </em>
                </button>
              </div>
            </section>

            <section class="decision-section">
              <h3>2. Reason for Decision</h3>
              <p>Provide a concise justification for this decision.</p>

              <div class="decision-reason-card">
                <span class="decision-reason-card__draft">
                  <AppIcon name="sparkles" :size="14" />
                  AI Draft
                </span>

                <textarea v-model="reasonText" rows="5" maxlength="1000" />

                <div class="decision-reason-card__foot">
                  <button type="button">
                    <AppIcon name="edit" :size="14" />
                    <span>Edit Reason</span>
                  </button>
                  <small>{{ reasonText.length }} / 1000</small>
                </div>
              </div>
            </section>

            <section class="decision-section">
              <h3>3. Decision Summary <small>(Auto-generated)</small></h3>

              <article class="decision-summary-card">
                <span class="decision-summary-card__icon">
                  <AppIcon name="clipboard-check" :size="22" />
                </span>

                <div class="decision-summary-card__copy">
                  <strong>Why we are proceeding with an offer</strong>

                  <div class="decision-summary-card__grid">
                    <span><AppIcon name="checkCircle" :size="14" /> Strong technical competency validated</span>
                    <span><AppIcon name="checkCircle" :size="14" /> High consensus from all interviewers</span>
                    <span><AppIcon name="checkCircle" :size="14" /> Strong leadership potential</span>
                    <span><AppIcon name="checkCircle" :size="14" /> No unresolved hiring risks</span>
                  </div>
                </div>

                <button type="button">
                  <AppIcon name="document" :size="14" />
                  <span>View Evidence</span>
                </button>
              </article>
            </section>
          </section>

          <aside class="create-hiring-decision-side">
            <section class="decision-side-section">
              <h3>4. Decision Evidence</h3>
              <p>All critical information has been reviewed.</p>

              <div class="decision-checklist">
                <article v-for="item in evidenceItems" :key="item[0]">
                  <span :class="`is-${item[3]}`">
                    <AppIcon :name="item[2]" :size="14" />
                  </span>
                  <strong>{{ item[0] }}</strong>
                  <em :class="`is-${item[3]}`">{{ item[1] }}</em>
                  <i><AppIcon name="chevronRight" :size="13" /></i>
                </article>
              </div>
            </section>

            <section class="decision-side-section">
              <h3>5. Approvals</h3>
              <p>Confirm approvals from the hiring committee.</p>

              <div class="decision-approvals">
                <article v-for="item in approvals" :key="item[0]">
                  <span class="decision-approvals__avatar">{{ item[0].slice(0, 2).toUpperCase() }}</span>
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                  <div class="decision-approvals__status">
                    <em :class="`is-${item[4]}`">{{ item[2] }}</em>
                    <small>{{ item[3] }}</small>
                  </div>
                </article>
              </div>
            </section>

            <section class="decision-side-section">
              <h3>6. Impact</h3>
              <p>What happens next once this decision is saved.</p>

              <div class="decision-impact">
                <article v-for="item in impactItems" :key="item[0]">
                  <span><AppIcon :name="item[1]" :size="16" /></span>
                  <p>{{ item[0] }}</p>
                </article>
              </div>
            </section>
          </aside>
        </div>

        <footer class="create-hiring-decision-modal__footer">
          <button class="is-ghost" type="button" @click="closeOverlay">Cancel</button>

          <div class="create-hiring-decision-modal__footer-actions">
            <button type="button" @click="emit('save-draft')">
              <AppIcon name="document" :size="14" />
              <span>Save as Draft</span>
            </button>

            <button class="is-dark" type="button" @click="emit('save-decision')">
              <AppIcon name="checkCircle" :size="16" />
              <div>
                <strong>Save Decision</strong>
                <small>Record this decision</small>
              </div>
            </button>

            <button class="is-primary" type="button" @click="emit('create-offer')">
              <AppIcon name="chevronRight" :size="16" />
              <div>
                <strong>Create Offer</strong>
                <small>Start offer workflow</small>
              </div>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.create-hiring-decision-overlay {
  position: fixed;
  inset: 0;
  z-index: 1725;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(18, 24, 38, 0.38);
  backdrop-filter: blur(8px);
}

.create-hiring-decision-modal {
  width: min(1220px, calc(100vw - 36px));
  max-height: calc(100vh - 36px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.28);
}

.create-hiring-decision-modal__head,
.create-hiring-decision-modal__title,
.decision-candidate-card__identity,
.decision-option,
.decision-reason-card__draft,
.decision-reason-card__foot,
.decision-summary-card,
.decision-summary-card__grid span,
.decision-checklist article,
.decision-impact,
.decision-impact article,
.create-hiring-decision-modal__footer,
.create-hiring-decision-modal__footer-actions,
.create-hiring-decision-modal__footer-actions button {
  display: flex;
  align-items: center;
}

.create-hiring-decision-modal__head,
.decision-checklist article,
.decision-reason-card__foot,
.create-hiring-decision-modal__footer {
  justify-content: space-between;
}

.create-hiring-decision-modal__head {
  padding: 20px 28px;
  border-bottom: 1px solid #edf1f7;
}

.create-hiring-decision-modal__title {
  gap: 16px;
}

.create-hiring-decision-modal__title > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #ffedf6;
  color: #f456a2;
}

.create-hiring-decision-modal__title h2,
.decision-section h3,
.decision-side-section h3 {
  margin: 0;
  color: #1f2940;
}

.create-hiring-decision-modal__title p,
.decision-section p,
.decision-side-section p,
.decision-option p,
.decision-summary-card__copy span,
.decision-impact p {
  margin: 6px 0 0;
  color: #748197;
}

.create-hiring-decision-modal__head button {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #99a5b9;
}

.create-hiring-decision-modal__body {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 388px;
  overflow: auto;
}

.create-hiring-decision-main,
.create-hiring-decision-side {
  padding: 24px;
}

.create-hiring-decision-side {
  border-left: 1px solid #edf1f7;
}

.decision-candidate-card,
.decision-reason-card,
.decision-summary-card,
.decision-side-section,
.decision-option {
  border: 1px solid #e7edf6;
  border-radius: 18px;
  background: #fff;
}

.decision-candidate-card {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1.85fr);
  gap: 20px;
  padding: 18px;
  background: #fcfdff;
}

.decision-candidate-card__avatar,
.decision-approvals__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, #d9a54b 0%, #2a354f 100%);
}

.decision-candidate-card__avatar {
  width: 62px;
  height: 62px;
  font-size: 1.15rem;
}

.decision-candidate-card__identity {
  gap: 14px;
}

.decision-candidate-card__identity strong {
  display: block;
  color: #1f2940;
  font-size: 1.05rem;
  line-height: 1.2;
}

.decision-candidate-card__identity p {
  margin: 4px 0 0;
  color: #76849a;
}

.decision-candidate-card__identity em {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  margin-top: 12px;
  padding: 0 14px;
  border-radius: 999px;
  background: #dff8e8;
  color: #209e58;
  font-size: 0.82rem;
  font-style: normal;
  font-weight: 700;
}

.decision-candidate-card__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.decision-candidate-card__stats small {
  display: block;
  color: #97a4b8;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.decision-candidate-card__stats strong {
  display: block;
  margin-top: 6px;
  color: #1f2940;
  font-size: 0.84rem;
  line-height: 1.45;
}

.decision-section {
  margin-top: 24px;
}

.decision-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.decision-option {
  position: relative;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  min-height: 184px;
  padding: 18px;
  text-align: center;
}

.decision-option i,
.decision-option em {
  position: absolute;
  top: 14px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.decision-option i {
  left: 14px;
  border: 2px solid #cbd6e5;
}

.decision-option em {
  right: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff5faa;
  color: #fff;
  font-style: normal;
}

.decision-option__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.decision-option strong {
  color: #1f2940;
  font-size: 0.9rem;
}

.decision-option p {
  font-size: 0.78rem;
  line-height: 1.5;
}

.decision-option.tone-pink.is-active {
  border-color: #ff6bb2;
  box-shadow: inset 0 0 0 1px #ff6bb2;
}

.decision-option.tone-pink .decision-option__icon {
  background: #ff74b6;
  color: #fff;
}

.decision-option.tone-orange .decision-option__icon {
  background: #fff4e7;
  color: #ef9718;
}

.decision-option.tone-red .decision-option__icon {
  background: #fff1f1;
  color: #f14f61;
}

.decision-reason-card {
  margin-top: 14px;
  padding: 16px 18px;
  background: #fbfcff;
}

.decision-reason-card__draft {
  gap: 8px;
  color: #f75cab;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.decision-reason-card textarea {
  width: 100%;
  margin-top: 14px;
  padding: 0;
  border: 0;
  resize: none;
  outline: none;
  background: transparent;
  color: #31415d;
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.7;
}

.decision-reason-card__foot {
  margin-top: 18px;
}

.decision-reason-card__foot button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #f2d7e7;
  border-radius: 12px;
  background: #fff;
  color: #ff5ca9;
  font-size: 0.82rem;
  font-weight: 700;
}

.decision-reason-card__foot small {
  color: #97a4b8;
  font-size: 0.78rem;
}

.decision-section h3 small {
  color: #9aa6ba;
  font-size: 0.9em;
  font-weight: 500;
}

.decision-summary-card {
  gap: 18px;
  margin-top: 14px;
  padding: 22px;
  align-items: flex-start;
  background: linear-gradient(180deg, #f6fff9 0%, #ffffff 100%);
  border-color: #c8efd7;
}

.decision-summary-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: #18ab56;
  color: #fff;
  flex: 0 0 56px;
}

.decision-summary-card__copy {
  min-width: 0;
}

.decision-summary-card__copy strong {
  display: block;
  color: #1f2940;
  font-size: 0.95rem;
}

.decision-summary-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 20px;
  margin-top: 14px;
}

.decision-summary-card__grid span {
  gap: 8px;
  color: #44566f;
  font-size: 0.8rem;
  line-height: 1.5;
}

.decision-summary-card__grid :deep(svg) {
  color: #18ab56;
  flex: 0 0 auto;
}

.decision-summary-card > button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #dce6f3;
  border-radius: 12px;
  background: #fff;
  color: #425574;
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.decision-side-section + .decision-side-section {
  margin-top: 24px;
}

.decision-checklist,
.decision-approvals {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.decision-checklist article {
  gap: 12px;
}

.decision-checklist article > span,
.decision-impact span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e6f7ed;
  color: #1ab05c;
  flex: 0 0 28px;
}

.decision-checklist article > span.is-orange {
  background: #fff4e6;
  color: #f29d1a;
}

.decision-checklist strong,
.decision-approvals strong {
  color: #1f2940;
  font-size: 0.86rem;
}

.decision-checklist em {
  margin-left: auto;
  color: #18a45e;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
}

.decision-checklist em.is-orange {
  color: #ef9718;
}

.decision-checklist i {
  color: #9aa6ba;
}

.decision-approvals article {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.decision-approvals__avatar {
  width: 44px;
  height: 44px;
  font-size: 0.84rem;
}

.decision-approvals small {
  display: block;
  margin-top: 4px;
  color: #8090a7;
  font-size: 0.72rem;
}

.decision-approvals__status {
  text-align: right;
}

.decision-approvals__status em {
  display: block;
  font-style: normal;
  font-size: 0.82rem;
  font-weight: 800;
}

.decision-approvals__status em.is-green {
  color: #18a45e;
}

.decision-approvals__status em.is-pink {
  color: #ff5ca9;
}

.decision-impact {
  gap: 18px;
  margin-top: 16px;
}

.decision-impact article {
  flex: 1;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}

.decision-impact span {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fff0f7;
  color: #ff5ca9;
}

.decision-impact p {
  font-size: 0.76rem;
  line-height: 1.5;
}

.create-hiring-decision-modal__footer {
  padding: 18px 24px;
  border-top: 1px solid #edf1f7;
}

.create-hiring-decision-modal__footer > button,
.create-hiring-decision-modal__footer-actions button {
  min-height: 48px;
  border: 1px solid #dce4f1;
  border-radius: 12px;
  background: #fff;
  color: #44566f;
  font: inherit;
  font-weight: 700;
}

.create-hiring-decision-modal__footer > button {
  min-width: 90px;
}

.create-hiring-decision-modal__footer-actions {
  gap: 14px;
}

.create-hiring-decision-modal__footer-actions button {
  gap: 10px;
  padding: 0 18px;
}

.create-hiring-decision-modal__footer-actions button div {
  display: grid;
  text-align: left;
}

.create-hiring-decision-modal__footer-actions button strong {
  color: inherit;
  font-size: 0.88rem;
}

.create-hiring-decision-modal__footer-actions button small {
  color: inherit;
  opacity: 0.75;
  font-size: 0.72rem;
}

.create-hiring-decision-modal__footer-actions .is-dark {
  background: #131d34;
  border-color: #131d34;
  color: #fff;
}

.create-hiring-decision-modal__footer-actions .is-primary {
  background: linear-gradient(90deg, #ff62af 0%, #f157a3 100%);
  border-color: transparent;
  color: #fff;
}

@media (max-width: 1200px) {
  .create-hiring-decision-modal__body {
    grid-template-columns: 1fr;
  }

  .create-hiring-decision-side {
    border-left: 0;
    border-top: 1px solid #edf1f7;
  }
}

@media (max-width: 920px) {
  .decision-candidate-card,
  .decision-candidate-card__stats,
  .decision-options,
  .decision-summary-card__grid {
    grid-template-columns: 1fr;
  }

  .decision-summary-card {
    display: grid;
  }

  .decision-impact {
    flex-direction: column;
  }
}

@media (max-width: 720px) {
  .create-hiring-decision-overlay {
    padding: 10px;
  }

  .create-hiring-decision-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
  }

  .create-hiring-decision-modal__head,
  .create-hiring-decision-main,
  .create-hiring-decision-side,
  .create-hiring-decision-modal__footer {
    padding-left: 14px;
    padding-right: 14px;
  }

  .create-hiring-decision-modal__footer,
  .create-hiring-decision-modal__footer-actions {
    display: grid;
  }
}
</style>
