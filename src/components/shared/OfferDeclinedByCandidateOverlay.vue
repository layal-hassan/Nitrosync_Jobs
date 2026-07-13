<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Marvin McKinney',
  },
  candidateRole: {
    type: String,
    default: 'Senior Frontend Developer',
  },
})

const emit = defineEmits(['close', 'submit'])

const selectedReason = ref('Compensation')
const selectedAction = ref('Send personalized email')
const bodyOverflow = typeof document !== 'undefined' ? document.body.style.overflow : ''

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MM'
))

const reasonRows = [
  ['Compensation', 'Salary, bonus, equity or compensation package', 'wallet', true],
  ['Accepted another offer', 'They decided to move forward with another company', 'building', true],
  ['Role misalignment', "The role, responsibilities or level doesn't match expectations", 'briefcase', false],
  ['Career goals', 'Not aligned with their long-term career goals', 'spark', false],
  ['Company / Culture fit', 'Not a good fit with our culture or values', 'users', false],
  ['Location / Work model', 'Location, relocation or work arrangement is not suitable', 'mapPin', false],
  ['Other (specify)', 'Different reason not listed above', 'more', false],
]

const nextActionRows = [
  ['Send personalized email', 'Thank the candidate and keep the door open', 'mail', true],
  ['Schedule a follow-up', 'Discuss again or explore future opportunities', 'calendar', false],
  ['Add to talent pool', 'Keep their profile for future roles', 'userPlus', false],
  ['No further action', 'Close this offer and move forward', 'document', false],
]

watch(() => props.open, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : bodyOverflow
  }

  if (!isOpen) {
    selectedReason.value = 'Compensation'
    selectedAction.value = 'Send personalized email'
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = bodyOverflow
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="offer-declined-by-candidate-overlay" @click.self="emit('close')">
      <section class="offer-declined-by-candidate-modal" @click.stop>
        <header class="offer-declined-by-candidate-header">
          <div class="offer-declined-by-candidate-header__title">
            <span class="offer-declined-by-candidate-header__icon">
              <AppIcon name="close" :size="18" />
            </span>
            <div>
              <h2>Offer declined by candidate</h2>
              <p>{{ candidateName }} has declined the offer. Let's capture the reason and decide next steps.</p>
            </div>
          </div>

          <button class="offer-declined-by-candidate-close" type="button" aria-label="Close" @click="emit('close')">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="offer-declined-by-candidate-layout">
          <section class="offer-declined-by-candidate-main">
            <article class="offer-declined-by-candidate-section">
              <div class="offer-declined-by-candidate-section__title">
                <span>1</span>
                <div>
                  <h3>Why did the candidate decline?</h3>
                  <p>Select all that apply and choose the primary reason.</p>
                </div>
              </div>

              <div class="offer-declined-by-candidate-reasons">
                <button
                  v-for="item in reasonRows"
                  :key="item[0]"
                  type="button"
                  class="offer-declined-by-candidate-reason"
                  :class="{ 'is-selected': selectedReason === item[0], 'is-checked': item[3] }"
                  @click="selectedReason = item[0]"
                >
                  <div class="offer-declined-by-candidate-reason__head">
                    <span><AppIcon :name="item[2]" :size="14" /></span>
                    <i :class="{ 'is-filled': selectedReason === item[0] || item[3] }" />
                  </div>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                  <input v-if="item[0] === 'Other (specify)'" type="text" placeholder="Please specify..." @click.stop>
                </button>
              </div>

              <div class="offer-declined-by-candidate-field">
                <label>Primary reason</label>
                <button type="button" class="offer-declined-by-candidate-select">
                  <span><i></i>{{ selectedReason }}</span>
                  <AppIcon name="chevronDown" :size="14" />
                </button>
              </div>
            </article>

            <article class="offer-declined-by-candidate-section">
              <div class="offer-declined-by-candidate-section__title">
                <span>2</span>
                <div>
                  <h3>Additional details (optional)</h3>
                  <p>Add more context to help us understand and improve.</p>
                </div>
              </div>

              <div class="offer-declined-by-candidate-editor">
                <textarea>Marvin mentioned the base salary was below his expectations and the equity package was not competitive for his experience level.</textarea>
                <small>124/500</small>
              </div>
            </article>

            <article class="offer-declined-by-candidate-section">
              <div class="offer-declined-by-candidate-section__title">
                <span>3</span>
                <div>
                  <h3>What would you like to do next?</h3>
                  <p>Choose how you'd like to proceed.</p>
                </div>
              </div>

              <div class="offer-declined-by-candidate-actions">
                <button
                  v-for="item in nextActionRows"
                  :key="item[0]"
                  type="button"
                  class="offer-declined-by-candidate-action"
                  :class="{ 'is-selected': selectedAction === item[0], 'is-default': item[3] }"
                  @click="selectedAction = item[0]"
                >
                  <div class="offer-declined-by-candidate-action__head">
                    <span><AppIcon :name="item[2]" :size="14" /></span>
                    <i :class="{ 'is-filled': selectedAction === item[0] || item[3] }" />
                  </div>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </button>
              </div>
            </article>

            <footer class="offer-declined-by-candidate-footer">
              <button type="button" class="offer-declined-by-candidate-button" @click="emit('close')">Cancel</button>
              <button type="button" class="offer-declined-by-candidate-button is-primary" @click="emit('submit')">Mark as declined</button>
            </footer>
          </section>

          <aside class="offer-declined-by-candidate-side">
            <article class="offer-declined-by-candidate-card">
              <h3>Offer summary</h3>
              <div class="offer-declined-by-candidate-summary__candidate">
                <span>{{ candidateInitials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <small>{{ candidateRole }}</small>
                  <em>Offer sent</em>
                </div>
              </div>
              <article><span>Offered on</span><strong>May 10, 2024</strong></article>
              <article><span>Base salary</span><strong>$142,000</strong></article>
              <article><span>Annual bonus</span><strong>10%</strong></article>
              <article><span>Equity</span><strong>1,000 RSUs</strong></article>
              <article><span>Proposed start date</span><strong>June 16, 2024</strong></article>
              <article><span>Offer expires</span><strong class="is-pink">May 24, 2024 (7 days left)</strong></article>
            </article>

            <article class="offer-declined-by-candidate-card is-comment">
              <h3>Candidate's comment</h3>
              <p>Thank you so much for the offer and the time you and the team have invested in me. After careful consideration, I've decided to move forward with another opportunity that is closer to my long-term goals at this time.</p>
              <p>I truly appreciate your support and hope we can stay in touch for the future.</p>
              <strong>— Marvin</strong>
              <small>Received on May 18, 2024 at 2:30 PM</small>
            </article>

            <article class="offer-declined-by-candidate-card is-insight">
              <div class="offer-declined-by-candidate-card__head">
                <div class="offer-declined-by-candidate-card__head-left">
                  <AppIcon name="sparkles" :size="14" />
                  <h3>AI Insight</h3>
                </div>
                <em>Beta</em>
              </div>
              <div class="offer-declined-by-candidate-metrics">
                <article><span>Primary reason</span><strong>Compensation</strong></article>
                <article><span>Confidence</span><strong>92%</strong></article>
                <article><span>Risk of losing similar candidates</span><strong class="is-pink">High</strong></article>
                <article><span>Suggested improvement</span><strong>Increase salary benchmark by 5–8% for similar future offers.</strong></article>
              </div>
              <button type="button" class="offer-declined-by-candidate-panel-button">
                <span>View full analysis</span>
                <AppIcon name="chevronRight" :size="12" />
              </button>
            </article>

            <article class="offer-declined-by-candidate-card">
              <div class="offer-declined-by-candidate-card__head">
                <div class="offer-declined-by-candidate-card__head-left">
                  <h3>Recovery potential</h3>
                  <AppIcon name="info" :size="13" />
                </div>
                <b>High</b>
              </div>
              <p>Candidate liked the company and team. Compensation was the main blocker.</p>
              <div class="offer-declined-by-candidate-recovery">
                <span>Estimated recovery success</span>
                <strong>+ 68%</strong>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.offer-declined-by-candidate-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  padding: 20px;
  overflow-y: auto;
  background: rgba(32, 35, 47, 0.56);
  backdrop-filter: blur(6px);
}

.offer-declined-by-candidate-modal {
  width: min(100%, 1160px);
  margin: 0 auto;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.26);
}

.offer-declined-by-candidate-header,
.offer-declined-by-candidate-header__title,
.offer-declined-by-candidate-section__title,
.offer-declined-by-candidate-reason__head,
.offer-declined-by-candidate-action__head,
.offer-declined-by-candidate-card__head,
.offer-declined-by-candidate-card__head-left,
.offer-declined-by-candidate-footer {
  display: flex;
  align-items: center;
}

.offer-declined-by-candidate-header {
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid #edf1f8;
}

.offer-declined-by-candidate-header__title {
  gap: 14px;
}

.offer-declined-by-candidate-header__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff5a76;
  background: #fff1f4;
}

.offer-declined-by-candidate-header h2,
.offer-declined-by-candidate-section h3,
.offer-declined-by-candidate-card h3,
.offer-declined-by-candidate-reason strong,
.offer-declined-by-candidate-action strong,
.offer-declined-by-candidate-card strong,
.offer-declined-by-candidate-card b {
  margin: 0;
  color: #1f2c4f;
}

.offer-declined-by-candidate-header p,
.offer-declined-by-candidate-section p,
.offer-declined-by-candidate-reason small,
.offer-declined-by-candidate-action small,
.offer-declined-by-candidate-card p,
.offer-declined-by-candidate-card span,
.offer-declined-by-candidate-card small,
.offer-declined-by-candidate-editor small {
  margin: 0;
  color: #738199;
}

.offer-declined-by-candidate-close,
.offer-declined-by-candidate-button,
.offer-declined-by-candidate-select,
.offer-declined-by-candidate-panel-button {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #223251;
  background: #fff;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 800;
}

.offer-declined-by-candidate-close {
  width: 40px;
  padding: 0;
}

.offer-declined-by-candidate-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  padding: 18px 20px 20px;
}

.offer-declined-by-candidate-main,
.offer-declined-by-candidate-side {
  display: grid;
  gap: 16px;
}

.offer-declined-by-candidate-section,
.offer-declined-by-candidate-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.offer-declined-by-candidate-section__title {
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
}

.offer-declined-by-candidate-section__title > span {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff0f7;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-declined-by-candidate-reasons,
.offer-declined-by-candidate-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.offer-declined-by-candidate-reason,
.offer-declined-by-candidate-action {
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  display: grid;
  gap: 10px;
  text-align: left;
  background: #fff;
}

.offer-declined-by-candidate-reason.is-selected,
.offer-declined-by-candidate-action.is-selected,
.offer-declined-by-candidate-action.is-default {
  border-color: #ffcadd;
  box-shadow: inset 0 0 0 1px rgba(255, 45, 135, 0.18);
}

.offer-declined-by-candidate-reason__head,
.offer-declined-by-candidate-action__head {
  justify-content: space-between;
}

.offer-declined-by-candidate-reason__head span,
.offer-declined-by-candidate-action__head span {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff0f7;
}

.offer-declined-by-candidate-reason__head i,
.offer-declined-by-candidate-action__head i {
  width: 16px;
  height: 16px;
  border: 1.5px solid #d4dceb;
  border-radius: 4px;
}

.offer-declined-by-candidate-reason__head i.is-filled,
.offer-declined-by-candidate-action__head i.is-filled {
  border-color: #ff2d87;
  background: linear-gradient(135deg, #ff5cab 0%, #ff2d87 100%);
}

.offer-declined-by-candidate-reason input {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #edf1f8;
  border-radius: 10px;
  font: inherit;
}

.offer-declined-by-candidate-field {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.offer-declined-by-candidate-field label {
  color: #1f2c4f;
  font-size: 0.78rem;
  font-weight: 800;
}

.offer-declined-by-candidate-select {
  justify-content: space-between;
}

.offer-declined-by-candidate-select span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.offer-declined-by-candidate-select span i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff2d87;
}

.offer-declined-by-candidate-editor {
  border: 1px solid #edf1f8;
  border-radius: 14px;
  overflow: hidden;
}

.offer-declined-by-candidate-editor textarea {
  width: 100%;
  min-height: 150px;
  padding: 14px;
  border: 0;
  resize: none;
  font: inherit;
  color: #475569;
}

.offer-declined-by-candidate-editor small {
  display: block;
  padding: 0 14px 12px;
  text-align: right;
}

.offer-declined-by-candidate-footer {
  justify-content: space-between;
  margin-top: 16px;
}

.offer-declined-by-candidate-button.is-primary {
  min-width: 170px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff5cab 0%, #ff2d87 45%, #ff4b9b 100%);
}

.offer-declined-by-candidate-summary__candidate {
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.offer-declined-by-candidate-summary__candidate > span {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #de3d2e 0%, #7c1d1d 100%);
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-declined-by-candidate-summary__candidate em {
  margin-top: 6px;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #effcf4;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.offer-declined-by-candidate-card > article {
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #edf1f8;
}

.offer-declined-by-candidate-card > article:last-of-type {
  border-bottom: 0;
}

.offer-declined-by-candidate-card strong.is-pink,
.offer-declined-by-candidate-recovery strong,
.offer-declined-by-candidate-card b {
  color: #16a34a;
}

.offer-declined-by-candidate-card.is-comment {
  background: linear-gradient(180deg, #fff7fb 0%, #fff 100%);
}

.offer-declined-by-candidate-card.is-comment strong {
  margin: 10px 0 6px;
  display: block;
}

.offer-declined-by-candidate-card__head {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.offer-declined-by-candidate-card__head-left {
  gap: 8px;
}

.offer-declined-by-candidate-card__head em {
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #8b5cf6;
  background: #f3e8ff;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.offer-declined-by-candidate-metrics {
  display: grid;
  gap: 10px;
}

.offer-declined-by-candidate-metrics article {
  display: grid;
  gap: 4px;
  border-bottom: 1px solid #edf1f8;
  padding-bottom: 10px;
}

.offer-declined-by-candidate-metrics article:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.offer-declined-by-candidate-metrics strong.is-pink {
  color: #ff2d87;
}

.offer-declined-by-candidate-panel-button {
  width: 100%;
  margin-top: 14px;
}

.offer-declined-by-candidate-recovery {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

@media (max-width: 1080px) {
  .offer-declined-by-candidate-layout {
    grid-template-columns: 1fr;
  }

  .offer-declined-by-candidate-reasons,
  .offer-declined-by-candidate-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .offer-declined-by-candidate-reasons,
  .offer-declined-by-candidate-actions {
    grid-template-columns: 1fr;
  }

  .offer-declined-by-candidate-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}
</style>
