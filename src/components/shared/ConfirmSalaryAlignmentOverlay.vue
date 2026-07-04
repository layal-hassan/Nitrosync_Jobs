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
    default: 'Sarah Johnson',
  },
  candidateRole: {
    type: String,
    default: 'Senior Product Designer',
  },
  candidateStage: {
    type: String,
    default: 'Qualified',
  },
  candidateAppliedOn: {
    type: String,
    default: '10 May 2025',
  },
})

const emit = defineEmits(['close'])

const flowState = ref('review')
const recruiterNotes = ref('Candidate indicated flexibility for the right opportunity.')
const selectedCollectionMode = ref('candidate')
const selectedManualSource = ref('phone')
const desiredSalary = ref('')
const currentSalary = ref('')
const noticePeriod = ref('')
const employmentType = ref('Full-Time')

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const noteCount = computed(() => recruiterNotes.value.length)
const modalSubtitle = computed(() => (
  flowState.value === 'review'
    ? 'Review compensation expectations and confirm alignment with role budget.'
    : 'Compensation information is required to confirm alignment with role budget.'
))

function resetForm() {
  flowState.value = 'review'
  recruiterNotes.value = 'Candidate indicated flexibility for the right opportunity.'
  selectedCollectionMode.value = 'candidate'
  selectedManualSource.value = 'phone'
  desiredSalary.value = ''
  currentSalary.value = ''
  noticePeriod.value = ''
  employmentType.value = 'Full-Time'
}

function closeOverlay() {
  emit('close')
}

function openCollectionStep() {
  flowState.value = 'collect'
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
    <div v-if="open" class="salary-alignment-overlay" @click.self="closeOverlay">
      <section class="salary-alignment-modal">
        <header class="salary-alignment-modal__header">
          <div class="salary-alignment-modal__title">
            <span class="salary-alignment-modal__icon">
              <AppIcon name="wallet" :size="18" />
            </span>
            <div>
              <h2>Confirm Salary Alignment</h2>
              <p>{{ modalSubtitle }}</p>
            </div>
          </div>

          <button class="salary-alignment-modal__close" type="button" aria-label="Close salary alignment" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div v-if="flowState === 'review'" class="salary-alignment-modal__body">
          <section class="salary-alignment-profile">
            <div class="salary-alignment-profile__identity">
              <span class="salary-alignment-profile__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <span>{{ candidateRole }}</span>
                <em>{{ candidateStage }}</em>
              </div>
            </div>

            <div class="salary-alignment-profile__meta">
              <AppIcon name="calendar" :size="13" />
              <div>
                <small>Applied on</small>
                <strong>{{ candidateAppliedOn }}</strong>
              </div>
            </div>
          </section>

          <section class="salary-alignment-section">
            <h3>Candidate Expectation</h3>
            <dl class="salary-alignment-list">
              <div><dt>Desired Salary</dt><dd>85,000 SEK / month</dd></div>
              <div><dt>Current Salary</dt><dd>78,000 SEK / month</dd></div>
              <div><dt>Notice Availability</dt><dd>1 Month</dd></div>
              <div><dt>Employment Type</dt><dd>Full-Time</dd></div>
            </dl>
          </section>

          <section class="salary-alignment-section">
            <h3>Position Budget</h3>
            <dl class="salary-alignment-list">
              <div><dt>Approved Range</dt><dd>75,000 - 90,000 SEK / month</dd></div>
              <div><dt>Target Range</dt><dd>80,000 - 85,000 SEK / month</dd></div>
            </dl>
          </section>

          <section class="salary-alignment-banner">
            <div class="salary-alignment-banner__left">
              <span class="salary-alignment-banner__icon">
                <AppIcon name="checkCircle" :size="16" />
              </span>
              <div>
                <strong>Salary Aligned</strong>
                <p>Candidate expectation falls within approved compensation range.</p>
              </div>
            </div>
            <span class="salary-alignment-banner__tag">Within Target Range</span>
          </section>

          <section class="salary-alignment-section">
            <h3>Hiring Intelligence</h3>
            <div class="salary-alignment-insights">
              <article class="salary-alignment-insight-card">
                <span class="salary-alignment-insight-card__icon is-green"><AppIcon name="trend-up" :size="14" /></span>
                <div>
                  <small>Market Position</small>
                  <strong>Competitive</strong>
                </div>
              </article>
              <article class="salary-alignment-insight-card">
                <span class="salary-alignment-insight-card__icon is-blue"><AppIcon name="wallet" :size="14" /></span>
                <div>
                  <small>Budget Impact</small>
                  <strong>Within Target Range</strong>
                </div>
              </article>
              <article class="salary-alignment-insight-card">
                <span class="salary-alignment-insight-card__icon is-green"><AppIcon name="sparkles" :size="14" /></span>
                <div>
                  <small>Negotiation Risk</small>
                  <strong>Low</strong>
                </div>
              </article>
            </div>
          </section>

          <section class="salary-alignment-section">
            <h3>Recruiter Notes <small>(Optional)</small></h3>
            <div class="salary-alignment-notes">
              <textarea v-model="recruiterNotes" maxlength="500" rows="4" />
              <small>{{ noteCount }}/500</small>
            </div>
          </section>
        </div>

        <div v-else class="salary-alignment-modal__body">
          <section class="salary-align-collect-profile">
            <div class="salary-align-collect-profile__identity">
              <span class="salary-align-collect-profile__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <span>{{ candidateRole }}</span>
                <em>{{ candidateStage }}</em>
              </div>
            </div>

            <div class="salary-align-collect-profile__meta">
              <AppIcon name="calendar" :size="13" />
              <div>
                <small>Applied On</small>
                <strong>19 May 2025</strong>
              </div>
            </div>
          </section>

          <section class="salary-align-collect-warning">
            <span class="salary-align-collect-warning__icon">
              <AppIcon name="alert" :size="15" />
            </span>
            <div>
              <strong>Salary Information Not Available</strong>
              <p>This candidate has not submitted salary expectations yet. Choose how you'd like to collect compensation information.</p>
            </div>
            <span class="salary-align-collect-warning__badge">?</span>
          </section>

          <section class="salary-align-collect-section">
            <h3>How would you like to proceed?</h3>

            <div class="salary-align-collect-grid">
              <article
                class="salary-align-collect-card salary-align-collect-card--candidate"
                :class="{ 'is-active': selectedCollectionMode === 'candidate' }"
                @click="selectedCollectionMode = 'candidate'"
              >
                <div class="salary-align-collect-card__header">
                  <span class="salary-align-collect-card__icon is-pink">
                    <AppIcon name="mail" :size="14" />
                  </span>
                  <span class="salary-align-collect-card__tag">Recommended</span>
                </div>

                <strong>Request from Candidate</strong>
                <p>Send a request to collect:</p>

                <ul class="salary-align-collect-checklist">
                  <li><AppIcon name="check" :size="12" /> Desired Salary</li>
                  <li><AppIcon name="check" :size="12" /> Current Salary <small>(Optional)</small></li>
                  <li><AppIcon name="check" :size="12" /> Notice Period</li>
                  <li><AppIcon name="check" :size="12" /> Employment Type</li>
                </ul>

                <div class="salary-align-collect-card__footer">
                  <small>Send Via</small>
                  <div class="salary-align-collect-card__channels">
                    <span><AppIcon name="mail" :size="12" /> Email</span>
                    <span><AppIcon name="message" :size="12" /> SMS</span>
                  </div>
                  <button class="salary-align-collect-card__action" type="button">Send Request</button>
                </div>
              </article>

              <article
                class="salary-align-collect-card salary-align-collect-card--manual"
                :class="{ 'is-active': selectedCollectionMode === 'manual' }"
                @click="selectedCollectionMode = 'manual'"
              >
                <div class="salary-align-collect-card__header">
                  <span class="salary-align-collect-card__icon is-green">
                    <AppIcon name="edit" :size="14" />
                  </span>
                </div>

                <strong>Enter Manually</strong>
                <p>Information gathered through:</p>

                <div class="salary-align-collect-radios">
                  <label>
                    <input v-model="selectedManualSource" type="radio" value="phone">
                    <span>Phone Screening</span>
                  </label>
                  <label>
                    <input v-model="selectedManualSource" type="radio" value="recruiter">
                    <span>Recruiter Conversation</span>
                  </label>
                  <label>
                    <input v-model="selectedManualSource" type="radio" value="email">
                    <span>Email Exchange</span>
                  </label>
                </div>

                <div class="salary-align-collect-form">
                  <label>
                    <small>Desired Salary</small>
                    <div class="salary-align-collect-input">
                      <input v-model="desiredSalary" type="text" placeholder="Enter amount">
                      <span>SEK / month</span>
                    </div>
                  </label>

                  <label>
                    <small>Current Salary <em>(Optional)</em></small>
                    <div class="salary-align-collect-input">
                      <input v-model="currentSalary" type="text" placeholder="Enter amount">
                      <span>SEK / month</span>
                    </div>
                  </label>

                  <div class="salary-align-collect-form__row">
                    <label>
                      <small>Notice Period</small>
                      <select v-model="noticePeriod">
                        <option value="">Select notice period</option>
                        <option>Immediate</option>
                        <option>2 Weeks</option>
                        <option>1 Month</option>
                      </select>
                    </label>

                    <label>
                      <small>Employment Type</small>
                      <select v-model="employmentType">
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                        <option>Contract</option>
                      </select>
                    </label>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <div class="salary-align-collect-bottom">
            <section class="salary-align-collect-panel">
              <h3>Position Budget</h3>
              <dl class="salary-align-collect-budget">
                <div><dt>Approved Range</dt><dd>76,000 - 90,000 SEK / month</dd></div>
                <div><dt>Target Range</dt><dd>80,000 - 85,000 SEK / month</dd></div>
              </dl>
            </section>

            <section class="salary-align-collect-panel">
              <div class="salary-align-collect-panel__head">
                <h3>Hiring Intelligence</h3>
                <small>Will appear after data is entered</small>
              </div>

              <div class="salary-align-collect-intelligence">
                <article><span>Salary Alignment</span><i /></article>
                <article><span>Market Position</span><i /></article>
                <article><span>Negotiation Risk</span><i /></article>
              </div>
            </section>
          </div>
        </div>

        <footer v-if="flowState === 'review'" class="salary-alignment-modal__footer">
          <button class="salary-alignment-button salary-alignment-button--ghost" type="button" @click="closeOverlay">
            <AppIcon name="pause" :size="14" />
            <span>Put On Hold</span>
          </button>

          <div class="salary-alignment-modal__actions">
            <button class="salary-alignment-button salary-alignment-button--outline" type="button" @click="openCollectionStep">
              <span>Confirm Alignment</span>
            </button>
            <button class="salary-alignment-button salary-alignment-button--primary" type="button" @click="closeOverlay">
              <span>Move Forward</span>
            </button>
          </div>
        </footer>

        <footer v-else class="salary-align-collect-footer">
          <button class="salary-align-collect-footer__cancel" type="button" @click="closeOverlay">Cancel</button>

          <div class="salary-align-collect-footer__actions">
            <button class="salary-align-collect-footer__outline" type="button" @click="closeOverlay">
              <AppIcon name="mail" :size="13" />
              <span>Send Request</span>
            </button>
            <button class="salary-align-collect-footer__soft" type="button" @click="closeOverlay">
              <span>Save &amp; Analyze</span>
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style>
.salary-alignment-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(17, 24, 39, 0.38);
  backdrop-filter: blur(4px);
}

.salary-alignment-modal {
  width: min(100%, 780px);
  max-height: calc(100vh - 40px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border: 1px solid #eef2f8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.salary-alignment-modal__header,
.salary-alignment-modal__title,
.salary-alignment-profile,
.salary-alignment-profile__identity,
.salary-alignment-profile__meta,
.salary-alignment-banner,
.salary-alignment-banner__left,
.salary-alignment-insights,
.salary-alignment-insight-card,
.salary-alignment-button,
.salary-alignment-modal__actions {
  display: flex;
  align-items: center;
}

.salary-alignment-modal__header,
.salary-alignment-banner,
.salary-alignment-modal__footer {
  justify-content: space-between;
}

.salary-alignment-modal__header {
  padding: 18px 20px;
  border-bottom: 1px solid #eef2f8;
}

.salary-alignment-modal__title {
  gap: 12px;
}

.salary-alignment-modal__icon {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #ff5da9;
  background: #fff1f8;
}

.salary-alignment-modal__title h2,
.salary-alignment-profile strong,
.salary-alignment-section h3,
.salary-alignment-list dd,
.salary-alignment-banner strong,
.salary-alignment-insight-card strong {
  margin: 0;
  color: #1f2940;
}

.salary-alignment-modal__title h2 {
  font-size: 18px;
  font-weight: 700;
}

.salary-alignment-modal__title p,
.salary-alignment-profile span,
.salary-alignment-profile small,
.salary-alignment-list dt,
.salary-alignment-banner p,
.salary-alignment-insight-card small,
.salary-alignment-notes small {
  margin: 0;
  color: #7b879d;
  font-size: 12px;
  line-height: 1.45;
}

.salary-alignment-modal__close {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 10px;
  color: #97a5bb;
  background: transparent;
  cursor: pointer;
}

.salary-alignment-modal__body {
  overflow: auto;
  padding: 18px 20px 20px;
}

.salary-alignment-profile {
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
  background: #fbfcff;
}

.salary-alignment-profile__identity {
  gap: 12px;
}

.salary-alignment-profile__avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
}

.salary-alignment-profile strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
}

.salary-alignment-profile span {
  display: block;
  margin-top: 2px;
}

.salary-alignment-profile em {
  display: inline-block;
  margin-top: 5px;
  color: #ff5da9;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
}

.salary-alignment-profile__meta {
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #eef2f8;
  border-radius: 12px;
  background: #fff;
  color: #8b97ab;
}

.salary-alignment-section {
  margin-top: 18px;
}

.salary-alignment-section h3 {
  margin-bottom: 10px;
  color: #ff5da9;
  font-size: 12px;
  font-weight: 700;
}

.salary-alignment-section h3 small {
  color: #a0acbf;
  font-size: 11px;
  font-weight: 600;
}

.salary-alignment-list {
  margin: 0;
  padding: 0;
}

.salary-alignment-list div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0;
}

.salary-alignment-list dd {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  text-align: right;
}

.salary-alignment-banner {
  gap: 18px;
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #e9fbf0;
}

.salary-alignment-banner__left {
  gap: 10px;
}

.salary-alignment-banner__icon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #16a34a;
  background: #fff;
  flex: 0 0 22px;
}

.salary-alignment-banner strong {
  display: block;
  color: #10945d;
  font-size: 13px;
  font-weight: 700;
}

.salary-alignment-banner__tag {
  padding: 5px 8px;
  border-radius: 999px;
  color: #10945d;
  font-size: 10px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.88);
}

.salary-alignment-insights {
  gap: 12px;
}

.salary-alignment-insight-card {
  flex: 1 1 0;
  gap: 10px;
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  background: #fbfcff;
}

.salary-alignment-insight-card__icon {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  flex: 0 0 24px;
}

.salary-alignment-insight-card__icon.is-green {
  color: #16a34a;
  background: #eaf8ef;
}

.salary-alignment-insight-card__icon.is-blue {
  color: #5b67ff;
  background: #eef0ff;
}

.salary-alignment-insight-card strong {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  font-weight: 700;
}

.salary-alignment-notes {
  border: 1px solid #e4ebf6;
  border-radius: 12px;
  background: #fff;
}

.salary-alignment-notes textarea {
  width: 100%;
  min-height: 92px;
  padding: 14px;
  border: 0;
  resize: none;
  outline: 0;
  color: #2b3550;
  font: inherit;
  box-sizing: border-box;
}

.salary-alignment-notes small {
  display: block;
  padding: 0 14px 10px;
  text-align: right;
}

.salary-alignment-modal__footer {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 20px 18px;
  border-top: 1px solid #eef2f8;
}

.salary-alignment-button {
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.salary-alignment-button--ghost {
  border: 1px solid #dce5f2;
  color: #42506d;
  background: #fff;
}

.salary-alignment-button--outline {
  border: 1px solid #f5c6dd;
  color: #ff5da9;
  background: #fff;
}

.salary-alignment-button--primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.2);
}

.salary-alignment-modal__actions {
  gap: 12px;
}

.salary-align-collect-profile,
.salary-align-collect-profile__identity,
.salary-align-collect-profile__meta,
.salary-align-collect-warning,
.salary-align-collect-warning__icon,
.salary-align-collect-grid,
.salary-align-collect-card__header,
.salary-align-collect-card__channels,
.salary-align-collect-input,
.salary-align-collect-form__row,
.salary-align-collect-bottom,
.salary-align-collect-panel__head,
.salary-align-collect-intelligence,
.salary-align-collect-footer,
.salary-align-collect-footer__actions,
.salary-align-collect-footer__outline,
.salary-align-collect-footer__soft {
  display: flex;
  align-items: center;
}

.salary-align-collect-profile,
.salary-align-collect-warning,
.salary-align-collect-footer {
  justify-content: space-between;
}

.salary-align-collect-profile {
  gap: 16px;
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
  background: #fbfcff;
}

.salary-align-collect-profile__identity {
  gap: 12px;
}

.salary-align-collect-profile__avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
}

.salary-align-collect-profile strong {
  display: block;
  margin: 0;
  color: #1f2940;
  font-size: 14px;
  font-weight: 700;
}

.salary-align-collect-profile span,
.salary-align-collect-profile small,
.salary-align-collect-warning p,
.salary-align-collect-card p,
.salary-align-collect-card__footer small,
.salary-align-collect-form small,
.salary-align-collect-panel__head small,
.salary-align-collect-budget dt,
.salary-align-collect-intelligence span {
  margin: 0;
  color: #7b879d;
  font-size: 12px;
  line-height: 1.45;
}

.salary-align-collect-profile span {
  display: block;
  margin-top: 2px;
}

.salary-align-collect-profile em {
  display: inline-block;
  margin-top: 5px;
  color: #ff5da9;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
}

.salary-align-collect-profile__meta {
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  background: #fff;
}

.salary-align-collect-warning {
  gap: 14px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #f7e3ce;
  border-radius: 14px;
  background: #fff7ef;
}

.salary-align-collect-warning__icon {
  width: 24px;
  height: 24px;
  justify-content: center;
  border-radius: 8px;
  color: #ff9e43;
  background: rgba(255, 255, 255, 0.82);
  flex: 0 0 24px;
}

.salary-align-collect-warning strong,
.salary-align-collect-section h3,
.salary-align-collect-card strong,
.salary-align-collect-panel h3,
.salary-align-collect-budget dd {
  margin: 0;
  color: #1f2940;
}

.salary-align-collect-warning strong {
  display: block;
  font-size: 13px;
  font-weight: 700;
}

.salary-align-collect-warning__badge {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  background: #ffbb45;
}

.salary-align-collect-section,
.salary-align-collect-panel {
  margin-top: 18px;
}

.salary-align-collect-section h3,
.salary-align-collect-panel h3 {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
}

.salary-align-collect-grid,
.salary-align-collect-bottom,
.salary-align-collect-intelligence {
  gap: 14px;
  align-items: stretch;
}

.salary-align-collect-grid > *,
.salary-align-collect-bottom > * {
  flex: 1 1 0;
}

.salary-align-collect-card,
.salary-align-collect-panel {
  padding: 16px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
  background: #fff;
}

.salary-align-collect-card.is-active {
  border-color: #ff68b3;
  box-shadow: inset 0 0 0 1px #ff68b3;
}

.salary-align-collect-card__header {
  justify-content: space-between;
  margin-bottom: 14px;
}

.salary-align-collect-card__icon {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 8px;
}

.salary-align-collect-card__icon.is-pink {
  color: #ff5da9;
  background: #fff1f8;
}

.salary-align-collect-card__icon.is-green {
  color: #22a15f;
  background: #eefbf3;
}

.salary-align-collect-card__tag {
  padding: 3px 6px;
  border-radius: 999px;
  color: #6d62ff;
  font-size: 9px;
  font-weight: 700;
  background: #eff0ff;
}

.salary-align-collect-card strong {
  display: block;
  font-size: 14px;
  font-weight: 700;
}

.salary-align-collect-card p {
  margin-top: 4px;
}

.salary-align-collect-checklist {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.salary-align-collect-checklist li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #44506b;
  font-size: 12px;
  font-weight: 600;
}

.salary-align-collect-checklist svg {
  color: #ff5da9;
}

.salary-align-collect-checklist small {
  color: #a2aec2;
  font-size: 11px;
}

.salary-align-collect-card__footer {
  margin-top: 16px;
}

.salary-align-collect-card__channels {
  gap: 14px;
  margin-top: 8px;
}

.salary-align-collect-card__channels span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #5f6d88;
  font-size: 12px;
  font-weight: 600;
}

.salary-align-collect-card__action {
  width: 100%;
  min-height: 40px;
  margin-top: 14px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  cursor: pointer;
}

.salary-align-collect-radios {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.salary-align-collect-radios label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #44506b;
  font-size: 12px;
}

.salary-align-collect-radios input {
  margin: 0;
}

.salary-align-collect-form {
  margin-top: 16px;
}

.salary-align-collect-form label {
  display: block;
}

.salary-align-collect-form small em {
  color: #a2aec2;
  font-style: normal;
}

.salary-align-collect-input,
.salary-align-collect-form select {
  width: 100%;
  min-height: 40px;
  margin-top: 6px;
  border: 1px solid #e0e8f3;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
}

.salary-align-collect-input {
  justify-content: space-between;
  gap: 10px;
  padding: 0 12px;
}

.salary-align-collect-input input,
.salary-align-collect-form select {
  color: #2b3550;
  font: inherit;
  font-size: 12px;
}

.salary-align-collect-input input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
}

.salary-align-collect-input span {
  color: #a0acbf;
  font-size: 11px;
  white-space: nowrap;
}

.salary-align-collect-form__row {
  gap: 12px;
  margin-top: 12px;
  align-items: flex-end;
}

.salary-align-collect-form__row label {
  flex: 1 1 0;
}

.salary-align-collect-form select {
  padding: 0 12px;
  outline: 0;
}

.salary-align-collect-budget {
  margin: 0;
}

.salary-align-collect-budget div {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 7px 0;
}

.salary-align-collect-budget dd {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  text-align: right;
}

.salary-align-collect-panel__head {
  justify-content: space-between;
  gap: 10px;
}

.salary-align-collect-intelligence article {
  flex: 1 1 0;
  padding: 12px 10px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  text-align: center;
}

.salary-align-collect-intelligence span {
  display: block;
  color: #97a3b8;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.salary-align-collect-intelligence i {
  width: 18px;
  height: 18px;
  display: inline-block;
  margin-top: 14px;
  border: 1px solid #d8e1ef;
  border-radius: 50%;
}

.salary-align-collect-footer {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 20px 18px;
  border-top: 1px solid #eef2f8;
}

.salary-align-collect-footer__cancel,
.salary-align-collect-footer__outline,
.salary-align-collect-footer__soft {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.salary-align-collect-footer__cancel {
  border: 1px solid #dce5f2;
  color: #42506d;
  background: #fff;
}

.salary-align-collect-footer__actions {
  gap: 10px;
}

.salary-align-collect-footer__outline {
  gap: 8px;
  border: 1px solid #f4d0e2;
  color: #ff5da9;
  background: #fff;
}

.salary-align-collect-footer__soft {
  gap: 8px;
  border: 1px solid #edf2f8;
  color: #97a3b8;
  background: #f8fafc;
}

@media (max-width: 760px) {
  .salary-alignment-overlay {
    padding: 12px;
  }

  .salary-alignment-modal {
    width: 100%;
    max-height: calc(100vh - 24px);
    border-radius: 18px;
  }

  .salary-alignment-profile,
  .salary-alignment-insights,
  .salary-alignment-modal__footer,
  .salary-alignment-modal__actions,
  .salary-align-collect-profile,
  .salary-align-collect-grid,
  .salary-align-collect-bottom,
  .salary-align-collect-intelligence,
  .salary-align-collect-form__row,
  .salary-align-collect-footer,
  .salary-align-collect-footer__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .salary-alignment-list div {
    flex-direction: column;
    gap: 4px;
  }

  .salary-alignment-list dd {
    text-align: left;
  }

  .salary-align-collect-budget div,
  .salary-align-collect-panel__head {
    flex-direction: column;
    align-items: flex-start;
  }

  .salary-align-collect-budget dd {
    text-align: left;
  }
}
</style>
