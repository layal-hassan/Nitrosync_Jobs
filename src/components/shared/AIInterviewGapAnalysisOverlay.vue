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
    default: 'Sarah Johnson',
  },
  candidateRole: {
    type: String,
    default: 'Senior Product Designer',
  },
  candidateStage: {
    type: String,
    default: 'Shortlisted',
  },
  hasInterviewPlanConfigured: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close', 'apply-updates', 'generate-process'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const viewState = ref('summary')
const expandedGapId = ref('leadership')
const selectedGapIds = ref(['leadership', 'design-system'])
const selectAll = ref(true)

const gapCards = [
  {
    id: 'leadership',
    title: 'Leadership',
    icon: 'team-gear',
    tone: 'pink',
    why: 'Current interview plan evaluates communication and collaboration but does not sufficiently validate leadership scope, decision making and impact.',
    stage: 'Hiring Manager Interview',
    duration: '45 min',
    bullets: ['Add 2 leadership questions', 'Add leadership evaluation criteria'],
    questions: [
      'Tell me about a time you led a team through a complex challenge.',
      'How do you define success for your team and measure it?',
    ],
  },
  {
    id: 'design-system',
    title: 'Design System Ownership',
    icon: 'briefcase',
    tone: 'violet',
    why: 'Current plan evaluates technical skills but does not validate ownership level, adoption impact and long-term system thinking.',
    stage: 'Team Interview',
    duration: '60 min',
    bullets: ['Add 3 ownership questions', 'Add design system criteria'],
    questions: [
      'What was your role in the design system?',
      'How did you drive adoption across teams?',
      'How do you balance consistency with innovation?',
    ],
  },
]

const noProcessEvidence = [
  { title: 'Leadership', level: 'High importance', icon: 'briefcase', tone: 'orange' },
  { title: 'Design System Ownership', level: 'High importance', icon: 'spark', tone: 'orange' },
  { title: 'Cross-functional Collaboration', level: 'Medium importance', icon: 'users', tone: 'yellow' },
]

const recommendedStages = [
  {
    order: 1,
    title: 'Hiring Manager Interview',
    duration: '45 min',
    purpose: ['Leadership', 'Cross-functional Collaboration'],
    includes: ['6 Questions', 'Scorecard', 'Evaluation Criteria'],
    icon: 'users',
    tone: 'violet',
  },
  {
    order: 2,
    title: 'Team Interview',
    duration: '60 min',
    purpose: ['Design System Ownership', 'Technical Evaluation'],
    includes: ['8 Questions', 'Scorecard', 'Evaluation Criteria'],
    icon: 'team-gear',
    tone: 'orange',
  },
]

const activeGap = computed(() => (
  gapCards.find((item) => item.id === expandedGapId.value) ?? gapCards[0]
))

const selectedCount = computed(() => selectedGapIds.value.length)

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function resetView() {
  viewState.value = props.hasInterviewPlanConfigured ? 'summary' : 'no-process'
  expandedGapId.value = 'leadership'
  selectedGapIds.value = ['leadership', 'design-system']
  selectAll.value = true
}

function closeOverlay() {
  emit('close')
}

function toggleGap(gapId) {
  if (selectedGapIds.value.includes(gapId)) {
    selectedGapIds.value = selectedGapIds.value.filter((id) => id !== gapId)
  } else {
    selectedGapIds.value = [...selectedGapIds.value, gapId]
  }

  selectAll.value = selectedGapIds.value.length === gapCards.length
}

function toggleAll() {
  selectAll.value = !selectAll.value
  selectedGapIds.value = selectAll.value ? gapCards.map((item) => item.id) : []
}

function openDetail(gapId = selectedGapIds.value[0] ?? 'leadership') {
  expandedGapId.value = gapId
  viewState.value = 'detail'
}

function cancelDetail() {
  viewState.value = 'summary'
}

function saveDetail() {
  viewState.value = 'summary'
}

function applySummary() {
  if (!selectedGapIds.value.length) {
    return
  }

  openDetail(selectedGapIds.value[0])
}

function applyUpdates() {
  emit('apply-updates')
  emit('close')
}

function generateProcess() {
  emit('generate-process')
  emit('close')
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow
    previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousHtmlOverflow
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      resetView()
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="gap-overlay" @click.self="closeOverlay">
      <section class="gap-modal">
        <header class="gap-modal__header">
          <div class="gap-modal__title">
            <span class="gap-modal__icon">
              <AppIcon :name="viewState === 'no-process' ? 'sparkles' : 'spark'" :size="18" />
            </span>
            <div>
              <div class="gap-modal__title-row">
                <h2>AI Interview Gap Analysis</h2>
                <span class="gap-badge">Beta</span>
              </div>

              <template v-if="viewState === 'no-process'">
                <div class="gap-modal__subtitle-row">
                  <span class="gap-inline-alert"><AppIcon name="alert" :size="12" /> No Interview Process Configured</span>
                  <p>We'll generate a recommended interview plan based on AI analysis.</p>
                </div>
              </template>
              <p v-else>Identify missing hiring evidence and optimize your existing interview plan.</p>
            </div>
          </div>

          <button class="gap-modal__close" type="button" aria-label="Close AI interview gap analysis" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="gap-modal__body">
          <template v-if="viewState === 'summary'">
            <section class="gap-summary-top">
              <article class="gap-card gap-card--candidate">
                <div class="gap-candidate">
                  <span class="gap-candidate__avatar">{{ candidateInitials }}</span>
                  <div>
                    <div class="gap-candidate__row">
                      <strong>{{ candidateName }}</strong>
                      <span>{{ candidateStage }}</span>
                    </div>
                    <p>{{ candidateRole }}</p>
                    <small><AppIcon name="mapPin" :size="13" /> New York, NY (Hybrid)</small>
                    <small><AppIcon name="briefcase" :size="13" /> 6+ years experience</small>
                  </div>
                </div>
              </article>

              <article class="gap-card gap-card--coverage">
                <p>Interview Plan Coverage</p>
                <div class="gap-card--coverage__row">
                  <strong>3 of 5</strong>
                  <span>60%</span>
                </div>
                <small>required areas covered</small>
              </article>

              <article class="gap-card gap-card--found">
                <span class="gap-card--found__icon"><AppIcon name="clipboard-check" :size="18" /></span>
                <div>
                  <strong>Interview Plan Found</strong>
                  <p>NitroSync analyzed your existing interview plan and identified gaps in the evidence we'll collect.</p>
                </div>
              </article>
            </section>

            <section class="gap-plan-grid">
              <article class="gap-card">
                <div class="gap-section-title">
                  <AppIcon name="calendar" :size="16" />
                  <h3>Current Interview Plan</h3>
                </div>

                <div class="gap-plan-list">
                  <article>
                    <strong>Recruiter Screen</strong>
                    <small>30 min</small>
                  </article>
                  <article>
                    <strong>Hiring Manager Interview</strong>
                    <small>45 min</small>
                  </article>
                  <article>
                    <strong>Team Interview</strong>
                    <small>60 min</small>
                  </article>
                  <article>
                    <strong>Final Interview</strong>
                    <small>45 min</small>
                  </article>
                </div>
              </article>

              <article class="gap-card">
                <div class="gap-section-title is-orange">
                  <AppIcon name="alert" :size="16" />
                  <h3>Missing Evidence</h3>
                </div>

                <ul class="gap-bullet-list">
                  <li>Leadership</li>
                  <li>Design System Ownership</li>
                </ul>
              </article>
            </section>

            <section class="gap-heading-row">
              <div>
                <div class="gap-section-title is-orange">
                  <AppIcon name="alert" :size="16" />
                  <h3>Missing Hiring Evidence</h3>
                </div>
                <p>AI has identified areas that are not sufficiently covered by your current interview plan.</p>
              </div>

              <div class="gap-heading-row__actions">
                <strong>2 gaps found</strong>
                <button type="button" @click="toggleAll">
                  <span>Select all</span>
                  <span class="gap-checkbox" :class="{ 'is-active': selectAll }"><AppIcon name="check" :size="11" /></span>
                </button>
              </div>
            </section>

            <div class="gap-summary-list">
              <article v-for="item in gapCards" :key="item.id" class="gap-summary-item">
                <button type="button" class="gap-summary-item__check" @click="toggleGap(item.id)">
                  <span class="gap-checkbox" :class="{ 'is-active': selectedGapIds.includes(item.id) }"><AppIcon name="check" :size="11" /></span>
                </button>

                <span class="gap-summary-item__icon" :class="`is-${item.tone}`">
                  <AppIcon :name="item.icon" :size="18" />
                </span>

                <div class="gap-summary-item__why">
                  <strong>{{ item.title }}</strong>
                  <small>Why this matters</small>
                  <p>{{ item.why }}</p>
                </div>

                <div class="gap-summary-item__update">
                  <small>Recommended Update</small>
                  <div>
                    <strong>{{ item.stage }}</strong>
                    <em>{{ item.duration }}</em>
                  </div>
                  <ul>
                    <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
                  </ul>
                </div>

                <div class="gap-summary-item__impact">
                  <small>Impact</small>
                  <ul>
                    <li>Interview Kit will be updated</li>
                    <li>Scorecard will be updated</li>
                    <li>Interviewer responsibilities will be updated</li>
                  </ul>
                </div>

                <div class="gap-summary-item__preview">
                  <small>Preview of Questions ({{ item.questions.length }})</small>
                  <p v-for="question in item.questions" :key="question">{{ question }}</p>
                  <button type="button" @click="openDetail(item.id)">Adjust <AppIcon name="chevronDown" :size="14" /></button>
                </div>
              </article>
            </div>

            <footer class="gap-footer-bar">
              <div class="gap-footer-bar__left">
                <div class="gap-section-title is-green">
                  <AppIcon name="checkCircle" :size="16" />
                  <h3>After Applying Updates</h3>
                </div>
                <div class="gap-footer-bar__metrics">
                  <span><strong>Leadership</strong><small>Will be covered</small></span>
                  <span><strong>Design System Ownership</strong><small>Will be covered</small></span>
                  <span><strong>Interview Coverage</strong><small>3 of 5 -> 5 of 5 areas covered</small></span>
                </div>
              </div>

              <div class="gap-footer-bar__actions">
                <button class="gap-button gap-button--ghost" type="button" @click="closeOverlay">Cancel</button>
                <button class="gap-button gap-button--primary" type="button" :disabled="!selectedCount" @click="applySummary">
                  <AppIcon name="spark" :size="15" />
                  <span>Apply Recommended Updates ({{ selectedCount }})</span>
                </button>
              </div>
            </footer>
          </template>

          <template v-else-if="viewState === 'detail'">
            <section class="gap-detail-top">
              <article class="gap-card gap-card--candidate">
                <div class="gap-candidate">
                  <span class="gap-candidate__avatar">{{ candidateInitials }}</span>
                  <div>
                    <div class="gap-candidate__row">
                      <strong>{{ candidateName }}</strong>
                      <span>{{ candidateStage }}</span>
                    </div>
                    <p>{{ candidateRole }}</p>
                    <small><AppIcon name="mapPin" :size="13" /> New York, NY (Hybrid)</small>
                    <small><AppIcon name="briefcase" :size="13" /> 6+ years experience</small>
                  </div>
                </div>
              </article>

              <article class="gap-card gap-card--coverage">
                <p>Interview Plan Coverage</p>
                <div class="gap-card--coverage__row">
                  <strong>3 of 5</strong>
                  <span>60%</span>
                </div>
                <small>required areas covered</small>
              </article>

              <article class="gap-card gap-card--found">
                <span class="gap-card--found__icon"><AppIcon name="clipboard-check" :size="18" /></span>
                <div>
                  <strong>Interview Plan Found</strong>
                  <p>NitroSync analyzed your existing interview plan and identified gaps in the evidence we'll collect.</p>
                </div>
              </article>
            </section>

            <section class="gap-card gap-card--plan">
              <div class="gap-section-title">
                <AppIcon name="calendar" :size="16" />
                <h3>Current Interview Plan</h3>
              </div>
              <div class="gap-plan-list is-inline">
                <article><strong>Recruiter Screen</strong><small>30 min</small></article>
                <article><strong>Hiring Manager Interview</strong><small>45 min</small></article>
                <article><strong>Team Interview</strong><small>60 min</small></article>
                <article><strong>Final Interview</strong><small>45 min</small></article>
              </div>
            </section>

            <section class="gap-heading-row">
              <div>
                <div class="gap-section-title is-orange">
                  <AppIcon name="alert" :size="16" />
                  <h3>Missing Hiring Evidence</h3>
                </div>
                <p>AI has identified areas that are not sufficiently covered by your current interview plan.</p>
              </div>
              <div class="gap-heading-row__actions">
                <strong>2 gaps found</strong>
                <button type="button" @click="toggleAll">
                  <span>Select all</span>
                  <span class="gap-checkbox" :class="{ 'is-active': selectAll }"><AppIcon name="check" :size="11" /></span>
                </button>
              </div>
            </section>

            <article class="gap-detail-card">
              <div class="gap-detail-card__head">
                <div class="gap-detail-card__identity">
                  <button type="button" class="gap-summary-item__check" @click="toggleGap(activeGap.id)">
                    <span class="gap-checkbox is-active"><AppIcon name="check" :size="11" /></span>
                  </button>
                  <span class="gap-summary-item__icon" :class="`is-${activeGap.tone}`">
                    <AppIcon :name="activeGap.icon" :size="18" />
                  </span>
                  <div>
                    <strong>{{ activeGap.title }}</strong>
                    <small>Why this matters</small>
                  </div>
                </div>
                <button type="button" class="gap-detail-card__collapse">Hide details <AppIcon name="chevronUp" :size="14" /></button>
              </div>

              <div class="gap-detail-grid">
                <section>
                  <small>Questions to add ({{ activeGap.questions.length }})</small>
                  <div class="gap-chip-list">
                    <article v-for="question in activeGap.questions" :key="question">{{ question }}</article>
                    <button type="button">+ Add Question</button>
                  </div>
                </section>

                <section>
                  <small>Evaluation criteria to add (2)</small>
                  <div class="gap-chip-list">
                    <article>Leadership</article>
                    <article>Decision Making</article>
                    <button type="button">+ Add Criterion</button>
                  </div>
                </section>

                <section>
                  <small>Apply to</small>
                  <div class="gap-radio-list">
                    <label><input checked type="radio" name="apply-stage"> <span>Hiring Manager Interview (45 min)</span></label>
                    <label><input type="radio" name="apply-stage"> <span>Team Interview (60 min)</span></label>
                    <label><input type="radio" name="apply-stage"> <span>Final Interview (45 min)</span></label>
                  </div>
                </section>

                <section>
                  <small>Suggested evaluator</small>
                  <div class="gap-evaluator-list">
                    <label><input checked type="radio" name="evaluator"> <span>Emma Wilson <i>Hiring Manager</i></span></label>
                    <label><input type="radio" name="evaluator"> <span>Michael Chen <i>Design Lead</i></span></label>
                    <label><input type="radio" name="evaluator"> <span>David Park <i>Principal Designer</i></span></label>
                  </div>
                </section>
              </div>

              <div class="gap-live-preview">
                <div>
                  <strong>Live impact preview</strong>
                  <small>After saving this update</small>
                </div>
                <span>Questions added <b>2</b></span>
                <span>Criteria added <b>2</b></span>
                <span>Coverage <b>3 of 5 -> 4 of 5</b></span>
                <div class="gap-live-preview__actions">
                  <button class="gap-button gap-button--ghost" type="button" @click="cancelDetail">Cancel Changes</button>
                  <button class="gap-button gap-button--primary" type="button" @click="saveDetail">Save Changes</button>
                </div>
              </div>
            </article>

            <article class="gap-summary-item is-compact">
              <button type="button" class="gap-summary-item__check" @click="toggleGap('design-system')">
                <span class="gap-checkbox" :class="{ 'is-active': selectedGapIds.includes('design-system') }"><AppIcon name="check" :size="11" /></span>
              </button>
              <span class="gap-summary-item__icon is-violet"><AppIcon name="briefcase" :size="18" /></span>
              <div class="gap-summary-item__why">
                <strong>Design System Ownership</strong>
                <small>Why this matters</small>
                <p>{{ gapCards[1].why }}</p>
              </div>
              <div class="gap-summary-item__update">
                <small>Recommended Update</small>
                <div><strong>Team Interview</strong><em>60 min</em></div>
              </div>
              <div class="gap-summary-item__impact">
                <small>Impact</small>
                <ul>
                  <li>Interview Kit will be updated</li>
                  <li>Scorecard will be updated</li>
                  <li>Interviewer responsibilities will be updated</li>
                </ul>
              </div>
              <div class="gap-summary-item__preview">
                <small>Preview of Questions (3)</small>
                <p>What was your role in the design system?</p>
                <p>How did you drive adoption across teams?</p>
                <p>How do you balance consistency with innovation?</p>
                <button type="button" @click="openDetail('design-system')">Adjust <AppIcon name="chevronDown" :size="14" /></button>
              </div>
            </article>

            <footer class="gap-footer-bar">
              <div class="gap-footer-bar__left">
                <div class="gap-section-title is-green">
                  <AppIcon name="checkCircle" :size="16" />
                  <h3>After Applying Updates</h3>
                </div>
                <div class="gap-footer-bar__metrics">
                  <span><strong>Leadership</strong><small>Will be covered</small></span>
                  <span><strong>Design System Ownership</strong><small>Will be covered</small></span>
                  <span><strong>Interview Coverage</strong><small>3 of 5 -> 5 of 5 areas covered</small></span>
                </div>
              </div>

              <div class="gap-footer-bar__actions">
                <button class="gap-button gap-button--ghost" type="button" @click="closeOverlay">Cancel</button>
                <button class="gap-button gap-button--primary" type="button" @click="applyUpdates">
                  <AppIcon name="spark" :size="15" />
                  <span>Apply Recommended Updates (2)</span>
                </button>
              </div>
            </footer>
          </template>

          <template v-else>
            <section class="gap-no-process">
              <aside class="gap-no-process__side">
                <article class="gap-card gap-card--candidate is-column">
                  <small>Candidate</small>
                  <div class="gap-candidate">
                    <span class="gap-candidate__avatar">{{ candidateInitials }}</span>
                    <div>
                      <div class="gap-candidate__row">
                        <strong>{{ candidateName }}</strong>
                      </div>
                      <p>{{ candidateRole }}</p>
                    </div>
                  </div>
                  <div class="gap-no-process__meta">
                    <span><AppIcon name="mapPin" :size="14" /> New York, NY (Hybrid)</span>
                    <span><AppIcon name="briefcase" :size="14" /> 6+ years experience</span>
                  </div>
                </article>

                <article class="gap-card">
                  <div class="gap-section-title is-orange">
                    <AppIcon name="alert" :size="16" />
                    <h3>Missing Hiring Evidence</h3>
                  </div>
                  <p class="gap-card__body-copy">AI has identified the following areas that should be validated before making a hiring decision.</p>
                  <div class="gap-no-process__evidence">
                    <article v-for="item in noProcessEvidence" :key="item.title">
                      <span class="gap-no-process__evidence-icon"><AppIcon :name="item.icon" :size="16" /></span>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <small>{{ item.level }}</small>
                      </div>
                    </article>
                  </div>
                  <div class="gap-no-process__tip">
                    <strong>Why this matters</strong>
                    <p>Strong evidence in these areas increases hiring confidence and long-term success likelihood.</p>
                  </div>
                </article>
              </aside>

              <div class="gap-no-process__main">
                <article class="gap-card">
                  <div class="gap-section-title">
                    <AppIcon name="spark" :size="16" />
                    <h3>AI Recommendation</h3>
                  </div>
                  <p class="gap-card__body-copy">We recommend creating the following interview process to validate the missing evidence.</p>

                  <div class="gap-generated-plan">
                    <div class="gap-generated-plan__based">
                      <strong>Recommended Interview Plan</strong>
                      <small>Based on:</small>
                      <ul>
                        <li>Job Requirements</li>
                        <li>Candidate Profile</li>
                        <li>Required Competencies</li>
                        <li>Success Profile</li>
                      </ul>
                    </div>

                    <div class="gap-generated-plan__stages">
                      <article v-for="stage in recommendedStages" :key="stage.title" class="gap-stage-card">
                        <span class="gap-stage-card__order">{{ stage.order }}</span>
                        <div class="gap-stage-card__head">
                          <span class="gap-summary-item__icon" :class="`is-${stage.tone}`"><AppIcon :name="stage.icon" :size="17" /></span>
                          <div>
                            <strong>{{ stage.title }}</strong>
                            <small>{{ stage.duration }}</small>
                          </div>
                        </div>
                        <div class="gap-stage-card__group">
                          <small>Purpose</small>
                          <ul>
                            <li v-for="item in stage.purpose" :key="item">{{ item }}</li>
                          </ul>
                        </div>
                        <div class="gap-stage-card__group">
                          <small>Includes</small>
                          <ul>
                            <li v-for="item in stage.includes" :key="item">{{ item }}</li>
                          </ul>
                        </div>
                      </article>
                      <div class="gap-stage-card gap-stage-card--empty">+<span>Add Stage (Optional)</span></div>
                    </div>
                  </div>
                </article>

                <section class="gap-no-process__bottom">
                  <article class="gap-card">
                    <div class="gap-section-title">
                      <AppIcon name="clock" :size="16" />
                      <h3>What will be generated</h3>
                    </div>
                    <ul class="gap-no-process__generated-list">
                      <li>2 Interview Stages</li>
                      <li>14 Questions</li>
                      <li>2 Scorecards</li>
                      <li>Interviewer Responsibilities</li>
                      <li>Focus Areas</li>
                    </ul>
                  </article>

                  <article class="gap-card">
                    <div class="gap-section-title">
                      <AppIcon name="eye" :size="16" />
                      <h3>Preview of what will be created</h3>
                    </div>
                    <div class="gap-no-process__preview-grid">
                      <article>
                        <strong>Hiring Manager Interview</strong>
                        <small>Questions</small>
                        <em>6</em>
                        <span>Scorecard Included</span>
                      </article>
                      <article>
                        <strong>Team Interview</strong>
                        <small>Questions</small>
                        <em>8</em>
                        <span>Scorecard Included</span>
                      </article>
                    </div>
                  </article>
                </section>

                <footer class="gap-no-process__footer">
                  <div class="gap-no-process__note">
                    <strong>AI Tip</strong>
                    <p>You can review and edit all questions, scorecards, and responsibilities after the interview process is created.</p>
                  </div>
                  <div class="gap-footer-bar__actions">
                    <button class="gap-button gap-button--ghost" type="button" @click="closeOverlay">Cancel</button>
                    <button class="gap-button gap-button--primary" type="button" @click="generateProcess">
                      <AppIcon name="spark" :size="15" />
                      <span>Generate Interview Process</span>
                    </button>
                  </div>
                </footer>
              </div>
            </section>
          </template>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.gap-overlay {
  position: fixed;
  inset: 0;
  z-index: 1715;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(10px);
}

.gap-modal {
  width: min(1280px, calc(100vw - 28px));
  max-height: calc(100vh - 24px);
  overflow: auto;
  border: 1px solid #e5ebf6;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.16);
}

.gap-modal__header,
.gap-modal__body {
  padding-left: 26px;
  padding-right: 26px;
}

.gap-modal__header,
.gap-modal__title,
.gap-summary-top,
.gap-candidate,
.gap-candidate__row,
.gap-card--coverage__row,
.gap-section-title,
.gap-heading-row,
.gap-heading-row__actions,
.gap-heading-row__actions button,
.gap-summary-item,
.gap-summary-item__check,
.gap-detail-card__head,
.gap-detail-card__identity,
.gap-live-preview,
.gap-live-preview__actions,
.gap-footer-bar,
.gap-footer-bar__actions,
.gap-modal__title-row,
.gap-modal__subtitle-row,
.gap-no-process,
.gap-no-process__meta,
.gap-stage-card__head,
.gap-no-process__footer,
.gap-button {
  display: flex;
}

.gap-modal__header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
  padding-bottom: 22px;
  border-bottom: 1px solid #edf1f7;
}

.gap-modal__title {
  align-items: flex-start;
  gap: 14px;
}

.gap-modal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 13px;
  background: #eef1ff;
  color: #5d66f5;
}

.gap-modal__title-row {
  align-items: center;
  gap: 10px;
}

.gap-modal__title-row h2,
.gap-section-title h3,
.gap-candidate strong,
.gap-card--coverage strong,
.gap-card--found strong,
.gap-summary-item strong,
.gap-stage-card strong,
.gap-no-process__note strong {
  margin: 0;
  color: #1f2a44;
  font-weight: 800;
}

.gap-modal__title-row h2 {
  font-size: 1.05rem;
}

.gap-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: #eef1ff;
  color: #5d66f5;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.gap-modal__title p,
.gap-modal__subtitle-row p {
  margin: 6px 0 0;
  color: #7c889e;
  font-size: 0.95rem;
}

.gap-modal__subtitle-row {
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.gap-inline-alert {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ea580c;
  font-size: 0.82rem;
  font-weight: 800;
}

.gap-modal__close {
  border: 0;
  background: transparent;
  color: #9aa4b8;
  cursor: pointer;
}

.gap-modal__body {
  padding-top: 24px;
  padding-bottom: 26px;
}

.gap-card,
.gap-summary-item,
.gap-detail-card,
.gap-stage-card,
.gap-no-process__note {
  border: 1px solid #e8edf6;
  border-radius: 16px;
  background: #fff;
}

.gap-summary-top {
  gap: 18px;
}

.gap-card {
  padding: 18px;
}

.gap-card--candidate {
  flex: 1.25;
}

.gap-card--candidate.is-column {
  display: grid;
  gap: 18px;
}

.gap-card--candidate > small {
  color: #96a0b4;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
}

.gap-card--coverage {
  flex: 0 0 260px;
}

.gap-card--coverage p,
.gap-card--coverage small,
.gap-card__body-copy,
.gap-heading-row p,
.gap-summary-item p,
.gap-summary-item small,
.gap-no-process__note p {
  margin: 0;
  color: #7b879b;
  line-height: 1.6;
}

.gap-card--coverage__row {
  align-items: baseline;
  justify-content: space-between;
  margin-top: 14px;
}

.gap-card--coverage strong {
  font-size: 2rem;
}

.gap-card--coverage span {
  color: #1f2a44;
  font-size: 1.4rem;
  font-weight: 800;
}

.gap-card--found {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #fff7fb;
}

.gap-card--found__icon {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #fff;
  color: #ef69b3;
}

.gap-card--found p {
  margin: 6px 0 0;
  color: #6f7b92;
  line-height: 1.6;
}

.gap-candidate {
  align-items: center;
  gap: 16px;
}

.gap-candidate__avatar {
  width: 82px;
  height: 82px;
  flex: 0 0 82px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff6fb 0%, #f3efff 100%);
  color: #ef69b3;
  font-size: 1.2rem;
  font-weight: 800;
  box-shadow: inset 0 0 0 2px #ffd9eb;
}

.gap-candidate__row {
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.gap-candidate__row span {
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffeaf4;
  color: #ef69b3;
  font-size: 0.72rem;
  font-weight: 800;
}

.gap-candidate p {
  margin: 6px 0 0;
  color: #58657d;
  font-size: 0.98rem;
}

.gap-candidate small,
.gap-no-process__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  margin-right: 14px;
  color: #7c889c;
}

.gap-plan-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-top: 18px;
}

.gap-section-title {
  align-items: center;
  gap: 8px;
  color: #5666f6;
}

.gap-section-title.is-orange {
  color: #f97316;
}

.gap-section-title.is-green {
  color: #16a34a;
}

.gap-plan-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 26px;
  margin-top: 18px;
}

.gap-plan-list.is-inline {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.gap-plan-list article strong {
  display: block;
  color: #1f2a44;
}

.gap-plan-list article small {
  display: block;
  margin-top: 5px;
  color: #8692a8;
}

.gap-bullet-list {
  margin: 20px 0 0;
  padding-left: 18px;
  color: #1f2a44;
  line-height: 1.9;
}

.gap-heading-row {
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-top: 24px;
}

.gap-heading-row__actions {
  align-items: center;
  gap: 16px;
}

.gap-heading-row__actions strong {
  color: #5d66f5;
}

.gap-heading-row__actions button {
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  color: #7c889c;
  cursor: pointer;
}

.gap-checkbox {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d7deec;
  border-radius: 6px;
  background: #fff;
  color: transparent;
}

.gap-checkbox.is-active {
  border-color: #ef69b3;
  background: #ef69b3;
  color: #fff;
}

.gap-summary-list {
  display: grid;
  gap: 16px;
  margin-top: 18px;
}

.gap-summary-item {
  align-items: flex-start;
  gap: 18px;
  padding: 22px;
}

.gap-summary-item.is-compact {
  margin-top: 18px;
}

.gap-summary-item__check {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.gap-summary-item__icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.gap-summary-item__icon.is-pink {
  color: #ef69b3;
  background: #fff1f7;
}

.gap-summary-item__icon.is-violet {
  color: #5d66f5;
  background: #eef1ff;
}

.gap-summary-item__why,
.gap-summary-item__update,
.gap-summary-item__impact,
.gap-summary-item__preview {
  min-width: 0;
}

.gap-summary-item__why {
  flex: 1.1;
}

.gap-summary-item__update,
.gap-summary-item__impact,
.gap-summary-item__preview {
  flex: 0.9;
}

.gap-summary-item__why small,
.gap-summary-item__update small,
.gap-summary-item__impact small,
.gap-summary-item__preview small,
.gap-detail-grid small,
.gap-stage-card__group small {
  display: block;
  color: #97a2b6;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
}

.gap-summary-item__why p,
.gap-summary-item__preview p {
  margin-top: 10px;
}

.gap-summary-item__update div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
  padding: 14px;
  border-radius: 14px;
  background: #f4f6ff;
}

.gap-summary-item__update em {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 30px;
  border-radius: 9px;
  background: #fff;
  color: #5d66f5;
  font-size: 0.82rem;
  font-style: normal;
  font-weight: 800;
}

.gap-summary-item__update ul,
.gap-summary-item__impact ul {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #62708a;
  line-height: 1.75;
}

.gap-summary-item__preview button,
.gap-detail-card__collapse {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  border: 1px solid #d5dcf7;
  padding: 10px 14px;
  border-radius: 12px;
  background: #fff;
  color: #5d66f5;
  font-weight: 700;
  cursor: pointer;
}

.gap-footer-bar {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 22px;
  padding: 20px 0 0;
  border-top: 1px solid #edf1f7;
}

.gap-footer-bar__left {
  min-width: 0;
}

.gap-footer-bar__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 12px;
}

.gap-footer-bar__metrics span {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
}

.gap-footer-bar__metrics strong {
  color: #1f2a44;
}

.gap-footer-bar__metrics small {
  color: #7f8ba0;
}

.gap-footer-bar__actions {
  align-items: center;
  gap: 12px;
}

.gap-button {
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 14px;
  font-size: 0.94rem;
  font-weight: 800;
  cursor: pointer;
}

.gap-button--ghost {
  border: 1px solid #d7deeb;
  background: #fff;
  color: #334155;
}

.gap-button--primary {
  border: 0;
  color: #fff;
  background: linear-gradient(135deg, #f05daa 0%, #ee7bbb 100%);
  box-shadow: 0 16px 30px rgba(240, 93, 170, 0.22);
}

.gap-button--primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.gap-detail-top {
  display: grid;
  grid-template-columns: 1.1fr 260px 1fr;
  gap: 18px;
}

.gap-card--plan {
  margin-top: 18px;
}

.gap-detail-card {
  margin-top: 18px;
  padding: 22px;
}

.gap-detail-card__head {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.gap-detail-card__identity {
  align-items: center;
  gap: 14px;
}

.gap-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 0.9fr 0.9fr;
  gap: 22px;
  margin-top: 20px;
}

.gap-chip-list,
.gap-radio-list,
.gap-evaluator-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.gap-chip-list article,
.gap-chip-list button {
  min-height: 62px;
  border: 1px solid #dce3ef;
  border-radius: 12px;
  background: #f9fbff;
  color: #334155;
  text-align: left;
}

.gap-chip-list article {
  padding: 14px;
  line-height: 1.55;
}

.gap-chip-list button {
  border-style: dashed;
  background: #fff;
  color: #ef69b3;
  font-weight: 700;
}

.gap-radio-list label,
.gap-evaluator-list label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #4e5b72;
}

.gap-evaluator-list i {
  display: block;
  margin-top: 3px;
  color: #9aa5b8;
  font-style: normal;
}

.gap-live-preview {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 22px;
  padding: 18px;
  border-radius: 14px;
  background: linear-gradient(180deg, #f3fff6 0%, #effcf3 100%);
  color: #15803d;
}

.gap-live-preview strong {
  display: block;
}

.gap-live-preview small {
  display: block;
  margin-top: 4px;
  color: #259b56;
}

.gap-live-preview span {
  color: #4b5563;
}

.gap-live-preview__actions {
  gap: 10px;
}

.gap-no-process {
  gap: 24px;
}

.gap-no-process__side {
  width: 320px;
  flex: 0 0 320px;
  display: grid;
  gap: 22px;
}

.gap-no-process__main {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 22px;
}

.gap-no-process__evidence {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.gap-no-process__evidence article {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  background: #f8fbff;
}

.gap-no-process__evidence-icon {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #fff;
  color: #5d66f5;
}

.gap-no-process__evidence article small {
  display: block;
  margin-top: 4px;
  color: #98a3b6;
}

.gap-no-process__tip {
  margin-top: 22px;
  padding: 16px;
  border: 1px solid #d8e0fb;
  border-radius: 12px;
  background: #f7f9ff;
}

.gap-no-process__tip p {
  margin: 8px 0 0;
  color: #5d66f5;
  line-height: 1.7;
}

.gap-generated-plan {
  margin-top: 16px;
  padding: 22px;
  border: 1px solid #ebeff7;
  border-radius: 16px;
  background: linear-gradient(180deg, #fafcff 0%, #f7f9fd 100%);
}

.gap-generated-plan__based {
  display: grid;
  gap: 10px;
}

.gap-generated-plan__based strong {
  color: #5d66f5;
}

.gap-generated-plan__based small {
  color: #9aa5b8;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
}

.gap-generated-plan__based ul,
.gap-stage-card__group ul,
.gap-no-process__generated-list {
  margin: 0;
  padding-left: 18px;
  color: #506079;
  line-height: 1.8;
}

.gap-generated-plan__stages {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.gap-stage-card {
  position: relative;
  padding: 16px;
  min-height: 268px;
}

.gap-stage-card__order {
  position: absolute;
  top: -10px;
  left: 14px;
  min-width: 24px;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #eef1ff;
  color: #5d66f5;
  font-size: 0.76rem;
  font-weight: 800;
}

.gap-stage-card__head {
  align-items: center;
  gap: 10px;
}

.gap-stage-card__head small {
  display: inline-flex;
  margin-top: 5px;
  padding: 4px 8px;
  border-radius: 8px;
  background: #fff2ea;
  color: #f97316;
  font-size: 0.7rem;
  font-weight: 800;
}

.gap-stage-card__group {
  margin-top: 18px;
}

.gap-stage-card--empty {
  display: grid;
  place-items: center;
  border-style: dashed;
  color: #9aa5b8;
  font-size: 2rem;
}

.gap-stage-card--empty span {
  display: block;
  margin-top: 10px;
  font-size: 0.92rem;
  font-weight: 700;
}

.gap-no-process__bottom {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 22px;
}

.gap-no-process__preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.gap-no-process__preview-grid article {
  min-height: 160px;
  padding: 18px;
  border: 1px solid #e8edf6;
  border-radius: 14px;
  background: #f8fbff;
}

.gap-no-process__preview-grid strong {
  display: block;
}

.gap-no-process__preview-grid small,
.gap-no-process__preview-grid span,
.gap-no-process__generated-list li,
.gap-card__body-copy {
  color: #718099;
}

.gap-no-process__preview-grid em {
  display: inline-flex;
  margin-top: 12px;
  color: #5d66f5;
  font-size: 1.1rem;
  font-style: normal;
  font-weight: 800;
}

.gap-no-process__preview-grid span {
  display: block;
  margin-top: 18px;
}

.gap-no-process__footer {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.gap-no-process__note {
  max-width: 380px;
  padding: 18px;
  border-color: #ffe2d4;
  background: #fff8f3;
}

.gap-no-process__note p {
  margin: 8px 0 0;
  color: #ea580c;
  line-height: 1.7;
}

@media (max-width: 1180px) {
  .gap-summary-top,
  .gap-no-process,
  .gap-footer-bar,
  .gap-detail-top {
    flex-direction: column;
    display: flex;
  }

  .gap-plan-grid,
  .gap-no-process__bottom,
  .gap-detail-grid,
  .gap-generated-plan__stages {
    grid-template-columns: 1fr;
  }

  .gap-no-process__side {
    width: 100%;
    flex-basis: auto;
  }
}

@media (max-width: 900px) {
  .gap-summary-item,
  .gap-live-preview,
  .gap-no-process__footer,
  .gap-footer-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .gap-plan-list,
  .gap-plan-list.is-inline,
  .gap-no-process__preview-grid {
    grid-template-columns: 1fr;
  }

  .gap-heading-row {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (max-width: 760px) {
  .gap-overlay {
    padding: 10px;
  }

  .gap-modal {
    width: min(100vw - 8px, 100%);
    max-height: calc(100vh - 12px);
  }

  .gap-modal__header,
  .gap-modal__body {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
