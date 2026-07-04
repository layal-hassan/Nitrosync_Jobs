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
  hasAssignedSequence: {
    type: Boolean,
    default: false,
  },
  initialView: {
    type: String,
    default: 'auto',
  },
})

const emit = defineEmits(['close', 'sequence-assigned'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const flowState = ref('recommend')
const expandedImprovementId = ref('')
const activeImprovementTab = ref('preview')

const sequenceSteps = [
  {
    id: 'screening',
    order: 1,
    tone: 'pink',
    title: 'Recruiter Screening',
    summary: 'Initial screening to align on motivation, role expectations and basic qualifications.',
    interviewerLabel: 'Interviewer',
    interviewerName: 'Sophia Carter',
    interviewerRole: 'Talent Partner',
    interviewerInitials: 'SC',
    interviewerTone: 'rose',
    duration: '20 min',
    focusAreas: ['Motivation', 'Salary Expectations', 'Availability'],
    icon: 'phone',
  },
  {
    id: 'portfolio',
    order: 2,
    tone: 'violet',
    title: 'Portfolio Review',
    summary: 'Deep dive into portfolio and case studies to evaluate design thinking and impact.',
    interviewerLabel: 'Interviewer',
    interviewerName: 'David Park',
    interviewerRole: 'Principal Designer',
    interviewerInitials: 'DP',
    interviewerTone: 'midnight',
    duration: '45 min',
    focusAreas: ['Case Studies', 'Design Process', 'Problem Solving'],
    icon: 'briefcase',
  },
  {
    id: 'technical',
    order: 3,
    tone: 'blue',
    title: 'Technical Interview',
    summary: 'Evaluate technical skills, product sense, systems thinking and execution.',
    interviewerLabel: 'Interviewer',
    interviewerName: 'Michael Chen',
    interviewerRole: 'Design Lead',
    interviewerInitials: 'MC',
    interviewerTone: 'slate',
    duration: '60 min',
    focusAreas: ['UX Design', 'Systems Thinking', 'Execution'],
    icon: 'spark',
  },
  {
    id: 'hm',
    order: 4,
    tone: 'green',
    title: 'Hiring Manager Interview',
    summary: 'Assess leadership potential, stakeholder management and product thinking.',
    interviewerLabel: 'Interviewer',
    interviewerName: 'Emma Wilson',
    interviewerRole: 'Design Director',
    interviewerInitials: 'EW',
    interviewerTone: 'amber',
    duration: '45 min',
    focusAreas: ['Leadership', 'Stakeholder Management', 'Product Thinking'],
    icon: 'users',
    badge: 'HM',
  },
  {
    id: 'validation',
    order: 5,
    tone: 'orange',
    title: 'Final Validation',
    summary: 'Panel debrief and final alignment for decision and offer readiness.',
    interviewerLabel: 'Owner',
    interviewerName: 'Hiring Team',
    interviewerRole: 'Panel',
    interviewerInitials: 'HT',
    interviewerTone: 'cloud',
    duration: '-',
    focusAreas: ['Decision Alignment', 'Offer Readiness', 'Risk Review'],
    icon: 'shield',
  },
]

const whySequenceItems = [
  {
    title: 'Eliminates duplicate assessments',
    description: 'Each stage builds on the previous one without repeating the same topics.',
    icon: 'checkCircle',
    tone: 'green',
  },
  {
    title: 'Covers all required competencies',
    description: 'Full coverage of role competencies across the right experts.',
    icon: 'briefcase',
    tone: 'violet',
  },
  {
    title: 'Reduces interview fatigue',
    description: 'Balanced flow designed for the best candidate experience.',
    icon: 'clock',
    tone: 'blue',
  },
  {
    title: 'Proven for similar hires',
    description: 'Used in 24 successful hires for similar Senior Product Design roles.',
    icon: 'chart-bars',
    tone: 'orange',
  },
  {
    title: 'Faster time-to-decision',
    description: 'Typically reduces time-to-decision by 2-3 days.',
    icon: 'calendar',
    tone: 'pink',
  },
]

const coverageItems = [
  { label: 'Technical Skills', tone: 'green' },
  { label: 'Product Thinking', tone: 'green' },
  { label: 'Design Systems', tone: 'green' },
  { label: 'Leadership', tone: 'green' },
  { label: 'Stakeholder Management', tone: 'orange' },
  { label: 'Communication', tone: 'green' },
]

const findingItems = [
  {
    title: 'No duplicate evaluations',
    description: 'Great! Each area is evaluated appropriately.',
    tone: 'green',
  },
  {
    title: 'Good interview progression',
    description: 'Sequence flows from general to specific well.',
    tone: 'green',
  },
  {
    title: 'Balanced interviewer workload',
    description: 'No interviewer is over-allocated.',
    tone: 'green',
  },
  {
    title: 'Leadership evaluated twice',
    description: 'Consider reducing duplication.',
    tone: 'orange',
  },
  {
    title: 'Stakeholder Management only evaluated once',
    description: 'Add more depth to this area.',
    tone: 'orange',
  },
]

const improvementItems = [
  {
    id: 'stakeholder',
    title: 'Stakeholder Management',
    badge: 'Low Coverage',
    issue: 'Add stakeholder management evaluation to strengthen this area.',
    current: 'Hiring Manager Interview (Once)',
    recommendation: 'Add 1 stakeholder scenario question to Technical Interview',
    action: 'Apply Fix',
    accent: 'pink',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    badge: 'Duplicated',
    issue: 'Leadership is evaluated in two consecutive interviews.',
    current: 'Technical Interview, Hiring Manager Interview (Twice)',
    recommendation: 'Reduce duplication by focusing on leadership in Hiring Manager Interview only',
    action: 'Apply Fix',
    accent: 'violet',
  },
]

const customizeAreas = ref(['Stakeholder Management', 'Influence', 'Communication', 'Decision Alignment'])
const customizeQuestion = ref('Tell me about a time you had to align multiple stakeholders with conflicting priorities.')
const customizeStage = ref('Technical Interview')
const customizeEvaluator = ref('Michael Chen')

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const displayStage = computed(() => (
  props.candidateStage.toLowerCase() === 'interview' ? 'Shortlisted' : props.candidateStage
))

function resetState() {
  if (props.initialView === 'review') {
    flowState.value = 'review'
  } else if (props.initialView === 'recommend') {
    flowState.value = 'recommend'
  } else {
    flowState.value = props.hasAssignedSequence ? 'review' : 'recommend'
  }

  expandedImprovementId.value = ''
  activeImprovementTab.value = 'preview'
  customizeAreas.value = ['Stakeholder Management', 'Influence', 'Communication', 'Decision Alignment']
  customizeQuestion.value = 'Tell me about a time you had to align multiple stakeholders with conflicting priorities.'
  customizeStage.value = 'Technical Interview'
  customizeEvaluator.value = 'Michael Chen'
}

function closeOverlay() {
  emit('close')
}

function applyInterviewPlan() {
  emit('sequence-assigned')
  flowState.value = 'review'
}

function openImprovement(id) {
  expandedImprovementId.value = id
  activeImprovementTab.value = 'preview'
}

function startCustomize(id) {
  expandedImprovementId.value = id
  activeImprovementTab.value = 'customize'
}

function closeImprovement() {
  expandedImprovementId.value = ''
  activeImprovementTab.value = 'preview'
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
    if (isOpen) {
      resetState()
    }

    syncDocumentScrollLock(isOpen)
  },
)

watch(
  () => props.hasAssignedSequence,
  (assigned) => {
    if (props.open && assigned) {
      flowState.value = 'review'
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="sequence-overlay" @click.self="closeOverlay">
      <section class="sequence-modal">
        <header class="sequence-modal__header">
          <div class="sequence-modal__title">
            <span class="sequence-modal__icon" :class="{ 'is-review': flowState === 'review' }">
              <AppIcon :name="flowState === 'review' ? 'clipboard-check' : 'document'" :size="20" />
            </span>
            <div>
              <div class="sequence-modal__title-row">
                <h2>{{ flowState === 'review' ? 'Interview Sequence Review' : 'Recommended Interview Plan & Sequence' }}</h2>
                <span class="sequence-modal__badge" :class="{ 'is-green': flowState === 'review' }">
                  {{ flowState === 'review' ? 'Assigned' : 'AI Optimized' }}
                </span>
              </div>
              <p>
                {{
                  flowState === 'review'
                    ? 'AI is reviewing your assigned interview sequence to ensure complete and efficient evaluation.'
                    : 'NitroSync recommends the most effective interview sequence for this role.'
                }}
              </p>
            </div>
          </div>

          <button class="sequence-modal__close" type="button" aria-label="Close interview plan and sequence" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="sequence-modal__body">
          <section class="sequence-candidate">
            <div class="sequence-candidate__identity">
              <span class="sequence-candidate__avatar">{{ candidateInitials }}</span>
              <div class="sequence-candidate__copy">
                <div class="sequence-candidate__name-row">
                  <strong>{{ candidateName }}</strong>
                  <em>{{ displayStage.toUpperCase() }}</em>
                </div>
                <span>{{ candidateRole }}</span>
                <div class="sequence-candidate__meta">
                  <small><AppIcon name="mapPin" :size="12" /> New York, NY (Hybrid)</small>
                  <small><AppIcon name="briefcase" :size="12" /> 6+ years experience</small>
                  <small><AppIcon name="calendar" :size="12" /> Applied on 10 May 2026</small>
                </div>
              </div>
            </div>

            <div class="sequence-candidate__stage">
              <small>Current Stage</small>
              <strong>Round 1 - Technical Interview</strong>
              <span><AppIcon name="clock" :size="12" /> 60 Minutes</span>
            </div>
          </section>

          <section class="sequence-ownership">
            <article>
              <strong>Interview Panel (3)</strong>
              <div class="sequence-ownership__avatars">
                <span class="tone-sand">SC</span>
                <span class="tone-amber">EW</span>
                <span class="tone-midnight">MC</span>
                <button type="button">View panel</button>
              </div>
            </article>

            <article>
              <strong>Hiring Manager</strong>
              <div class="sequence-ownership__manager">
                <span class="sequence-mini-avatar tone-amber">EW</span>
                <div>
                  <b>Emma Wilson</b>
                  <span>Design Director</span>
                </div>
              </div>
            </article>
          </section>

          <template v-if="flowState === 'recommend'">
            <section class="sequence-section">
              <div class="sequence-section__head">
                <h3><AppIcon name="spark" :size="16" /> AI Recommended Interview Sequence</h3>
                <div class="sequence-section__meta-pills">
                  <span><AppIcon name="clock" :size="13" /> Estimated total time: <b>3h 30m</b></span>
                  <span><AppIcon name="calendar" :size="13" /> Estimated time-to-decision: <b>8 days</b></span>
                </div>
              </div>

              <div class="sequence-steps">
                <div class="sequence-steps__line" />
                <article v-for="step in sequenceSteps" :key="step.id" class="sequence-step-card">
                  <span class="sequence-step-card__order" :class="`is-${step.tone}`">{{ step.order }}</span>

                  <div class="sequence-step-card__body">
                    <div class="sequence-step-card__identity">
                      <span class="sequence-step-card__icon" :class="`is-${step.tone}`">
                        <AppIcon :name="step.icon" :size="18" />
                      </span>

                      <div>
                        <strong>{{ step.title }}</strong>
                        <p>{{ step.summary }}</p>
                      </div>
                    </div>

                    <div class="sequence-step-card__meta">
                      <div>
                        <small>{{ step.interviewerLabel }}</small>
                        <div class="sequence-step-card__person">
                          <span class="sequence-mini-avatar" :class="`tone-${step.interviewerTone}`">{{ step.interviewerInitials }}</span>
                          <div>
                            <b>{{ step.interviewerName }}</b>
                            <span>{{ step.interviewerRole }}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <small>Duration</small>
                        <strong class="sequence-step-card__duration"><AppIcon name="clock" :size="12" /> {{ step.duration }}</strong>
                      </div>

                      <div>
                        <small>Focus Areas</small>
                        <ul>
                          <li v-for="focus in step.focusAreas" :key="focus">{{ focus }}</li>
                        </ul>
                      </div>

                      <button type="button" aria-label="Expand stage details">
                        <AppIcon name="chevronDown" :size="16" />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section class="sequence-why">
              <div class="sequence-why__head">
                <h3><AppIcon name="spark" :size="16" /> Why This Sequence?</h3>
                <button type="button" aria-label="Collapse why this sequence">
                  <AppIcon name="chevronUp" :size="16" />
                </button>
              </div>

              <div class="sequence-why__grid">
                <article v-for="item in whySequenceItems" :key="item.title">
                  <span class="sequence-why__icon" :class="`is-${item.tone}`">
                    <AppIcon :name="item.icon" :size="16" />
                  </span>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.description }}</p>
                </article>
              </div>
            </section>

            <section class="sequence-adjustments">
              <div class="sequence-adjustments__copy">
                <h3><AppIcon name="refresh" :size="16" /> Quick Adjustments (Optional)</h3>
                <p>Make quick changes to personalize this plan.</p>
              </div>

              <div class="sequence-adjustments__actions">
                <button type="button"><AppIcon name="refresh" :size="14" /> Replace Technical Interview</button>
                <button type="button"><AppIcon name="refresh" :size="14" /> Replace Hiring Manager Review</button>
                <button type="button"><AppIcon name="plus" :size="14" /> Add Optional Stage <AppIcon name="chevronDown" :size="14" /></button>
              </div>
            </section>
          </template>

          <template v-else>
            <section class="sequence-review-top">
              <div class="sequence-review-main">
                <div class="sequence-section__head is-review">
                  <h3>Current Interview Sequence <span>(Assigned)</span></h3>
                  <div class="sequence-section__meta-pills">
                    <span><AppIcon name="clock" :size="13" /> Total time: <b>3h 30m</b></span>
                    <span><AppIcon name="calendar" :size="13" /> Time to decision: <b>8 days</b></span>
                  </div>
                </div>

                <div class="sequence-steps is-review">
                  <div class="sequence-steps__line" />
                  <article
                    v-for="step in sequenceSteps"
                    :key="`review-${step.id}`"
                    class="sequence-step-card is-review"
                    :class="{ 'is-highlighted': step.id === 'technical' && !expandedImprovementId }"
                  >
                    <span class="sequence-step-card__order" :class="`is-${step.tone}`">{{ step.order }}</span>

                    <div class="sequence-step-card__body">
                      <div class="sequence-step-card__identity">
                        <span class="sequence-step-card__icon" :class="`is-${step.tone}`">
                          <AppIcon :name="step.icon" :size="18" />
                        </span>

                        <div>
                          <strong>{{ step.title }}</strong>
                          <p>{{ step.summary }}</p>
                        </div>
                      </div>

                      <div class="sequence-step-card__meta">
                        <div>
                          <small>{{ step.interviewerLabel }}</small>
                          <div class="sequence-step-card__person">
                            <span class="sequence-mini-avatar" :class="`tone-${step.interviewerTone}`">{{ step.interviewerInitials }}</span>
                            <div>
                              <b>{{ step.interviewerName }}</b>
                              <span>{{ step.interviewerRole }}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <small>Duration</small>
                          <strong class="sequence-step-card__duration"><AppIcon name="clock" :size="12" /> {{ step.duration }}</strong>
                        </div>

                        <div>
                          <small>Focus Areas</small>
                          <ul>
                            <li v-for="focus in step.focusAreas" :key="`${step.id}-${focus}`">{{ focus }}</li>
                          </ul>
                        </div>

                        <button type="button" aria-label="Expand stage details">
                          <AppIcon name="chevronDown" :size="16" />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>

              <aside class="sequence-review-side">
                <section class="sequence-side-card">
                  <div class="sequence-side-card__head">
                    <h3><AppIcon name="spark" :size="16" /> AI Coverage Review</h3>
                    <AppIcon name="info" :size="14" />
                  </div>

                  <div class="sequence-side-card__ring">
                    <div>
                      <strong>5 of 6</strong>
                      <span>Areas Covered</span>
                    </div>
                  </div>

                  <ul class="sequence-side-card__list">
                    <li v-for="item in coverageItems" :key="item.label" :class="`is-${item.tone}`">
                      <AppIcon :name="item.tone === 'orange' ? 'alert' : 'checkCircle'" :size="13" />
                      <span>{{ item.label }}</span>
                    </li>
                  </ul>

                  <div class="sequence-side-card__notice">
                    <span><AppIcon name="info" :size="13" /></span>
                    <div>
                      <strong>1 gap detected</strong>
                      <p>Some areas need more comprehensive evaluation.</p>
                    </div>
                  </div>
                </section>

                <section class="sequence-side-card">
                  <div class="sequence-side-card__head">
                    <h3><AppIcon name="spark" :size="16" /> AI Findings</h3>
                  </div>

                  <ul class="sequence-findings">
                    <li v-for="item in findingItems" :key="item.title" :class="`is-${item.tone}`">
                      <AppIcon :name="item.tone === 'orange' ? 'alert' : 'checkCircle'" :size="13" />
                      <div>
                        <strong>{{ item.title }}</strong>
                        <p>{{ item.description }}</p>
                      </div>
                    </li>
                  </ul>
                </section>
              </aside>
            </section>

            <section class="sequence-improvements">
              <div class="sequence-improvements__head">
                <div>
                  <h3><AppIcon name="spark" :size="16" /> Recommended Improvements <span>(2)</span></h3>
                  <p>AI suggests small changes to improve coverage without extending the process.</p>
                </div>

                <button v-if="expandedImprovementId" type="button" @click="closeImprovement">Collapse All <AppIcon name="chevronUp" :size="14" /></button>
              </div>

              <div class="sequence-improvements__list">
                <article
                  v-for="item in improvementItems"
                  :key="item.id"
                  class="sequence-improvement-card"
                  :class="{ 'is-expanded': expandedImprovementId === item.id }"
                >
                  <div class="sequence-improvement-card__row">
                    <div class="sequence-improvement-card__topic">
                      <span class="sequence-improvement-card__topic-icon" :class="`is-${item.accent}`">
                        <AppIcon :name="item.id === 'stakeholder' ? 'users' : 'user'" :size="18" />
                      </span>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <p>{{ item.issue }}</p>
                      </div>
                      <em>{{ item.badge }}</em>
                    </div>

                    <div class="sequence-improvement-card__current">
                      <small>Current</small>
                      <span>{{ item.current }}</span>
                    </div>

                    <span class="sequence-improvement-card__arrow"><AppIcon name="chevrons-right" :size="16" /></span>

                    <div class="sequence-improvement-card__recommendation">
                      <small>Recommendation</small>
                      <span>{{ item.recommendation }}</span>
                    </div>

                    <button
                      class="sequence-improvement-card__action"
                      type="button"
                      :class="{ 'is-active': expandedImprovementId === item.id }"
                      @click="item.id === 'stakeholder' ? startCustomize(item.id) : openImprovement(item.id)"
                    >
                      <template v-if="expandedImprovementId === item.id && item.id === 'stakeholder'">
                        <AppIcon name="edit" :size="14" />
                        <span>Customizing</span>
                      </template>
                      <template v-else>
                        <span>{{ item.action }}</span>
                      </template>
                    </button>

                    <button
                      class="sequence-improvement-card__toggle"
                      type="button"
                      aria-label="Toggle improvement details"
                      @click="expandedImprovementId === item.id ? closeImprovement() : openImprovement(item.id)"
                    >
                      <AppIcon :name="expandedImprovementId === item.id ? 'chevronUp' : 'chevronDown'" :size="16" />
                    </button>
                  </div>

                  <div v-if="expandedImprovementId === item.id && item.id === 'stakeholder'" class="sequence-improvement-card__body">
                    <div class="sequence-improvement-card__tabs">
                      <button type="button" :class="{ 'is-active': activeImprovementTab === 'preview' }" @click="activeImprovementTab = 'preview'">Preview</button>
                      <button type="button" :class="{ 'is-active': activeImprovementTab === 'customize' }" @click="activeImprovementTab = 'customize'">Customize</button>
                    </div>

                    <template v-if="activeImprovementTab === 'preview'">
                      <div class="sequence-preview-grid">
                        <article>
                          <small>Current Coverage</small>
                          <div class="sequence-preview-card">
                            <strong>Hiring Manager Interview</strong>
                            <span>1 stakeholder question</span>
                          </div>
                        </article>

                        <article>
                          <small>Recommended Change</small>
                          <div class="sequence-preview-card is-accent">
                            <strong>Technical Interview</strong>
                            <span>+ Add 1 Stakeholder Scenario Question</span>
                          </div>
                        </article>

                        <article>
                          <small>Question Preview</small>
                          <div class="sequence-preview-card">
                            <p>"Tell me about a time you had to align multiple stakeholders with conflicting priorities."</p>
                            <button type="button">View full question</button>
                          </div>
                        </article>

                        <article>
                          <small>Apply To (Stage)</small>
                          <div class="sequence-preview-options">
                            <label><input v-model="customizeStage" type="radio" value="Technical Interview"> <span>Technical Interview</span></label>
                            <label><input v-model="customizeStage" type="radio" value="Hiring Manager Interview"> <span>Hiring Manager Interview</span></label>
                            <label><input v-model="customizeStage" type="radio" value="Final Validation"> <span>Final Validation</span></label>
                          </div>
                        </article>
                      </div>

                      <div class="sequence-improvement-impact">
                        <div>
                          <strong>Impact</strong>
                          <span>Coverage <b>5 of 6</b> → <b>6 of 6</b></span>
                        </div>
                        <div>
                          <span>Total Time <b>No change</b></span>
                          <span>Stages <b>No change</b></span>
                        </div>
                        <div class="sequence-improvement-impact__actions">
                          <button type="button" @click="openImprovement('stakeholder')">Reset to AI Recommendation</button>
                          <button type="button" @click="closeImprovement">Cancel</button>
                          <button type="button">Confirm Fix</button>
                        </div>
                      </div>
                    </template>

                    <template v-else>
                      <div class="sequence-customize-grid">
                        <article>
                          <small>1 Questions to Add (1)</small>
                          <div class="sequence-customize-question">
                            <textarea v-model="customizeQuestion" />
                            <div class="sequence-customize-question__tools">
                              <button type="button" aria-label="Edit question"><AppIcon name="edit" :size="14" /></button>
                              <button type="button" aria-label="Delete question"><AppIcon name="trash" :size="14" /></button>
                            </div>
                          </div>
                          <button type="button" class="sequence-customize-add">+ Add Question</button>
                          <button type="button" class="sequence-customize-secondary"><AppIcon name="refresh" :size="14" /> Regenerate Questions</button>
                        </article>

                        <article>
                          <small>2 Evaluation Areas</small>
                          <div class="sequence-customize-checks">
                            <label v-for="area in ['Stakeholder Management', 'Influence', 'Communication', 'Decision Alignment']" :key="area">
                              <input v-model="customizeAreas" type="checkbox" :value="area">
                              <span>{{ area }}</span>
                            </label>
                          </div>
                          <button type="button" class="sequence-customize-link">+ Add Area</button>
                        </article>

                        <article>
                          <small>3 Apply To Interview</small>
                          <div class="sequence-preview-options">
                            <label><input v-model="customizeStage" type="radio" value="Technical Interview"> <span>Technical Interview</span></label>
                            <label><input v-model="customizeStage" type="radio" value="Hiring Manager Interview"> <span>Hiring Manager Interview</span></label>
                            <label><input v-model="customizeStage" type="radio" value="Final Validation"> <span>Final Validation</span></label>
                          </div>
                        </article>

                        <article>
                          <small>4 Suggested Evaluator</small>
                          <div class="sequence-preview-options">
                            <label><input v-model="customizeEvaluator" type="radio" value="Michael Chen"> <span>Michael Chen <i>Design Lead</i></span></label>
                            <label><input v-model="customizeEvaluator" type="radio" value="Emma Wilson"> <span>Emma Wilson <i>Design Director</i></span></label>
                            <label><input v-model="customizeEvaluator" type="radio" value="David Park"> <span>David Park <i>Principal Designer</i></span></label>
                          </div>
                        </article>

                        <article class="sequence-customize-note">
                          <small>Why AI suggested this</small>
                          <p>Stakeholder Management is currently evaluated only once. Adding one scenario question to Technical Interview improves coverage without extending the interview process.</p>
                          <div class="sequence-customize-note__impact">
                            <small>5 Impact</small>
                            <span>Coverage <b>5 of 6</b> → <b>6 of 6</b></span>
                            <span>Time Added <b>0 min</b></span>
                            <span>New Interviews <b>0</b></span>
                          </div>
                        </article>
                      </div>

                      <div class="sequence-customize-footer">
                        <button type="button" @click="openImprovement('stakeholder')">Reset to AI Recommendation</button>
                        <div>
                          <button type="button" @click="closeImprovement">Cancel</button>
                          <button type="button">Save Custom Fix</button>
                        </div>
                      </div>
                    </template>
                  </div>
                </article>
              </div>
            </section>

            <section class="sequence-impact">
              <h3>Sequence Impact Summary</h3>

              <div class="sequence-impact__grid">
                <article>
                  <small>Current Sequence</small>
                  <strong>3h 30m</strong>
                  <span>Total Interview Time</span>
                </article>

                <article>
                  <small>Current Sequence</small>
                  <strong>5</strong>
                  <span>Stages</span>
                </article>

                <span class="sequence-impact__arrow"><AppIcon name="chevrons-right" :size="18" /></span>

                <article class="is-green">
                  <small>After Improvements</small>
                  <strong>3h 30m</strong>
                  <span>Total Interview Time</span>
                </article>

                <article class="is-green">
                  <small>After Improvements</small>
                  <strong>5</strong>
                  <span>Stages</span>
                </article>

                <div class="sequence-impact__result">
                  <AppIcon name="checkCircle" :size="16" />
                  <span>No additional interviews required</span>
                </div>
              </div>
            </section>
          </template>
        </div>

        <footer class="sequence-modal__footer">
          <template v-if="flowState === 'recommend'">
            <div />
            <div class="sequence-modal__actions">
              <button class="sequence-button sequence-button--ghost" type="button" @click="closeOverlay">Cancel</button>
              <button class="sequence-button sequence-button--primary" type="button" @click="applyInterviewPlan">
                <AppIcon name="calendar" :size="14" />
                <span>Apply Interview Plan</span>
              </button>
            </div>
          </template>

          <template v-else>
            <button class="sequence-reset" type="button">
              <AppIcon name="refresh" :size="15" />
              <div>
                <strong>Reset to original sequence</strong>
                <span>Revert all changes to the assigned sequence.</span>
              </div>
            </button>

            <div class="sequence-modal__actions">
              <button class="sequence-button sequence-button--ghost" type="button" @click="closeOverlay">Keep Current Sequence</button>
              <button class="sequence-button sequence-button--primary is-violet" type="button">
                <AppIcon name="spark" :size="14" />
                <span>Apply Improvements (2)</span>
              </button>
            </div>
          </template>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.sequence-overlay,
.sequence-overlay *,
.sequence-overlay *::before,
.sequence-overlay *::after {
  box-sizing: border-box;
}

.sequence-overlay button,
.sequence-overlay textarea,
.sequence-overlay input {
  font: inherit;
}

.sequence-overlay {
  position: fixed;
  inset: 0;
  z-index: 1510;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(12, 18, 31, 0.5);
  backdrop-filter: blur(8px);
}

.sequence-modal {
  width: min(1480px, 100%);
  max-height: calc(100vh - 36px);
  overflow: auto;
  border: 1px solid #dfe6f2;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 34px 80px rgba(15, 23, 42, 0.18);
}

.sequence-modal__header,
.sequence-modal__title,
.sequence-modal__title-row,
.sequence-candidate,
.sequence-candidate__identity,
.sequence-candidate__name-row,
.sequence-candidate__meta,
.sequence-ownership,
.sequence-ownership__avatars,
.sequence-ownership__manager,
.sequence-section__head,
.sequence-section__meta-pills,
.sequence-step-card,
.sequence-step-card__body,
.sequence-step-card__identity,
.sequence-step-card__meta,
.sequence-step-card__person,
.sequence-why__head,
.sequence-why__grid,
.sequence-adjustments,
.sequence-adjustments__actions,
.sequence-review-top,
.sequence-side-card__head,
.sequence-side-card__list li,
.sequence-side-card__notice,
.sequence-findings li,
.sequence-improvements__head,
.sequence-improvement-card__row,
.sequence-improvement-card__topic,
.sequence-improvement-card__tabs,
.sequence-preview-grid,
.sequence-preview-options label,
.sequence-improvement-impact,
.sequence-improvement-impact__actions,
.sequence-customize-grid,
.sequence-customize-question__tools,
.sequence-customize-checks label,
.sequence-customize-footer,
.sequence-impact__grid,
.sequence-modal__footer,
.sequence-modal__actions,
.sequence-button,
.sequence-reset {
  display: flex;
  align-items: center;
}

.sequence-modal__header,
.sequence-candidate,
.sequence-ownership,
.sequence-section__head,
.sequence-why__head,
.sequence-adjustments,
.sequence-improvements__head,
.sequence-modal__footer {
  justify-content: space-between;
}

.sequence-modal__header {
  gap: 18px;
  padding: 18px 26px;
  border-bottom: 1px solid #e8eef7;
}

.sequence-modal__title {
  gap: 16px;
}

.sequence-modal__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #ef5da8;
  background: #fff0f7;
}

.sequence-modal__icon.is-review {
  color: #5b62f6;
  background: #eff1ff;
}

.sequence-modal__title-row {
  gap: 12px;
}

.sequence-modal__title h2,
.sequence-candidate__name-row strong,
.sequence-section__head h3,
.sequence-side-card__head h3,
.sequence-improvements__head h3,
.sequence-impact h3 {
  margin: 0;
  color: #1f2b45;
}

.sequence-modal__title h2 {
  font-size: 17px;
}

.sequence-modal__title p,
.sequence-candidate__copy > span,
.sequence-step-card__identity p,
.sequence-why__grid p,
.sequence-adjustments__copy p,
.sequence-findings p,
.sequence-improvements__head p,
.sequence-improvement-card__topic p,
.sequence-customize-note p,
.sequence-reset span {
  margin: 4px 0 0;
  color: #70809a;
  font-size: 13px;
  line-height: 1.6;
}

.sequence-modal__badge {
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #169957;
  background: #e9fbef;
  font-size: 12px;
  font-weight: 800;
}

.sequence-modal__badge.is-green {
  background: #e9fbef;
  color: #169957;
}

.sequence-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #97a2b4;
  background: transparent;
}

.sequence-modal__body {
  padding: 18px 24px 26px;
  display: grid;
  gap: 20px;
}

.sequence-candidate {
  gap: 18px;
  padding: 14px 0 18px;
  border-bottom: 1px solid #e8eef7;
}

.sequence-candidate__identity {
  gap: 16px;
  min-width: 0;
}

.sequence-candidate__avatar,
.sequence-mini-avatar,
.sequence-ownership__avatars span {
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-weight: 800;
}

.sequence-candidate__avatar {
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
  font-size: 24px;
  background: linear-gradient(135deg, #f2b587 0%, #d96d7a 42%, #8e5568 100%);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.88);
}

.sequence-candidate__copy {
  min-width: 0;
}

.sequence-candidate__name-row {
  gap: 12px;
}

.sequence-candidate__name-row strong {
  font-size: 22px;
}

.sequence-candidate__name-row em {
  padding: 4px 10px;
  border-radius: 999px;
  color: #ef5da8;
  background: #fff0f6;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.sequence-candidate__copy > span {
  display: block;
  font-size: 16px;
}

.sequence-candidate__meta {
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.sequence-candidate__meta small,
.sequence-candidate__stage span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7c889d;
  font-size: 13px;
}

.sequence-candidate__stage {
  text-align: right;
}

.sequence-candidate__stage small,
.sequence-step-card__meta small,
.sequence-improvement-card__current small,
.sequence-improvement-card__recommendation small,
.sequence-preview-grid small,
.sequence-impact__grid small {
  display: block;
  color: #9aa5b8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.sequence-candidate__stage strong {
  display: block;
  margin-top: 8px;
  color: #ff69b3;
  font-size: 15px;
}

.sequence-candidate__stage span {
  margin-top: 10px;
  justify-content: flex-end;
}

.sequence-ownership {
  border-bottom: 1px solid #e8eef7;
}

.sequence-ownership article {
  flex: 1;
  padding: 14px 0 18px;
}

.sequence-ownership article + article {
  padding-left: 24px;
  border-left: 1px solid #e8eef7;
}

.sequence-ownership strong {
  display: block;
  color: #1f2b45;
  font-size: 15px;
}

.sequence-ownership__avatars,
.sequence-ownership__manager {
  gap: 10px;
  margin-top: 12px;
}

.sequence-ownership__avatars span,
.sequence-mini-avatar {
  width: 30px;
  height: 30px;
  font-size: 11px;
}

.tone-sand {
  background: linear-gradient(135deg, #4b4120 0%, #a17d45 100%);
}

.tone-amber {
  background: linear-gradient(135deg, #5a2100 0%, #b26b2d 100%);
}

.tone-midnight {
  background: linear-gradient(135deg, #151f2a 0%, #4b5966 100%);
}

.tone-rose {
  background: linear-gradient(135deg, #9a5a76 0%, #eaa2b9 100%);
}

.tone-slate {
  background: linear-gradient(135deg, #1e293b 0%, #64748b 100%);
}

.tone-cloud {
  background: linear-gradient(135deg, #d9dee8 0%, #a9b4c8 100%);
}

.sequence-ownership__avatars button {
  border: 0;
  padding: 0;
  color: #3b69f2;
  background: transparent;
  font-weight: 700;
}

.sequence-ownership__manager b {
  display: block;
  color: #1f2b45;
  font-size: 14px;
}

.sequence-ownership__manager span {
  color: #97a2b4;
  font-size: 12px;
}

.sequence-section__head h3,
.sequence-why__head h3,
.sequence-adjustments__copy h3,
.sequence-improvements__head h3 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.sequence-section__head.is-review h3 span {
  color: #16a34a;
}

.sequence-section__meta-pills {
  gap: 12px;
  flex-wrap: wrap;
}

.sequence-section__meta-pills span {
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid #e6ebf4;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #66748c;
  background: #fff;
  font-size: 13px;
}

.sequence-section__meta-pills span b {
  color: #1f2b45;
}

.sequence-steps {
  position: relative;
  margin-top: 18px;
  display: grid;
  gap: 16px;
  padding-left: 70px;
}

.sequence-steps.is-review {
  margin-top: 18px;
}

.sequence-steps__line {
  position: absolute;
  left: 28px;
  top: 20px;
  bottom: 20px;
  width: 2px;
  border-radius: 999px;
  background: repeating-linear-gradient(
    to bottom,
    #d7deea 0 8px,
    transparent 8px 14px
  );
}

.sequence-step-card {
  position: relative;
  gap: 16px;
}

.sequence-step-card__order {
  position: absolute;
  left: -64px;
  top: 0;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
}

.sequence-step-card__order.is-pink {
  background: #ef5da8;
}

.sequence-step-card__order.is-violet {
  background: #5b62f6;
}

.sequence-step-card__order.is-blue {
  background: #4183ff;
}

.sequence-step-card__order.is-green {
  background: #22c55e;
}

.sequence-step-card__order.is-orange {
  background: #fb923c;
}

.sequence-step-card__body {
  width: 100%;
  gap: 18px;
  padding: 18px 18px 18px 16px;
  border: 1px solid #e4ebf5;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.03);
}

.sequence-step-card.is-review .sequence-step-card__body {
  min-height: 122px;
}

.sequence-step-card.is-highlighted .sequence-step-card__body {
  border-color: #d6ddff;
  box-shadow: 0 0 0 1px rgba(114, 107, 255, 0.14);
}

.sequence-step-card__identity {
  width: 270px;
  flex: 0 0 270px;
  align-items: flex-start;
  gap: 14px;
}

.sequence-step-card__icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  flex: 0 0 50px;
}

.sequence-step-card__icon.is-pink {
  color: #ef5da8;
  background: #fff0f7;
}

.sequence-step-card__icon.is-violet,
.sequence-step-card__icon.is-blue {
  color: #5b62f6;
  background: #eff1ff;
}

.sequence-step-card__icon.is-green {
  color: #22c55e;
  background: #effcf4;
}

.sequence-step-card__icon.is-orange {
  color: #fb923c;
  background: #fff5eb;
}

.sequence-step-card__identity strong {
  display: block;
  color: #1f2b45;
  font-size: 16px;
}

.sequence-step-card__meta {
  flex: 1;
  min-width: 0;
  align-items: flex-start;
  gap: 22px;
}

.sequence-step-card__meta > div {
  min-width: 0;
}

.sequence-step-card__person {
  gap: 10px;
  margin-top: 8px;
}

.sequence-step-card__person b {
  display: block;
  color: #1f2b45;
  font-size: 14px;
}

.sequence-step-card__person span {
  display: block;
  margin-top: 2px;
  color: #97a2b4;
  font-size: 12px;
}

.sequence-step-card__duration {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #31415e;
  font-size: 14px;
}

.sequence-step-card__meta ul {
  margin: 8px 0 0;
  padding-left: 16px;
  color: #55657d;
  font-size: 13px;
  line-height: 1.6;
}

.sequence-step-card__meta ul li::marker {
  color: #ef5da8;
}

.sequence-step-card__meta button {
  margin-left: auto;
  border: 0;
  padding: 0;
  color: #a2adbf;
  background: transparent;
}

.sequence-why,
.sequence-impact {
  border: 1px solid #e6ebf4;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
}

.sequence-why__head {
  padding: 18px 20px;
  border-bottom: 1px solid #edf1f8;
}

.sequence-why__head button {
  border: 0;
  padding: 0;
  color: #98a3b5;
  background: transparent;
}

.sequence-why__grid {
  gap: 18px;
  padding: 24px 20px;
  align-items: stretch;
}

.sequence-why__grid article {
  flex: 1;
}

.sequence-why__icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
}

.sequence-why__icon.is-green {
  color: #22c55e;
}

.sequence-why__icon.is-violet {
  color: #5b62f6;
}

.sequence-why__icon.is-blue {
  color: #3b82f6;
}

.sequence-why__icon.is-orange {
  color: #fb923c;
}

.sequence-why__icon.is-pink {
  color: #ef5da8;
}

.sequence-why__grid strong {
  display: block;
  margin-top: 12px;
  color: #1f2b45;
  font-size: 15px;
}

.sequence-adjustments {
  gap: 16px;
  padding-top: 4px;
}

.sequence-adjustments__actions {
  gap: 12px;
  flex-wrap: wrap;
}

.sequence-adjustments__actions button {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dce4ef;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #3b69f2;
  background: #fff;
  font-weight: 700;
}

.sequence-review-top {
  align-items: flex-start;
  gap: 24px;
}

.sequence-review-main {
  flex: 1;
  min-width: 0;
}

.sequence-review-side {
  width: 390px;
  flex: 0 0 390px;
  display: grid;
  gap: 20px;
}

.sequence-side-card {
  padding: 0 0 20px;
  border-left: 1px solid #e8eef7;
  padding-left: 24px;
}

.sequence-side-card__head {
  gap: 8px;
}

.sequence-side-card__head h3 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.sequence-side-card__ring {
  width: 108px;
  height: 108px;
  margin: 28px auto 22px;
  border-radius: 50%;
  padding: 8px;
  background: conic-gradient(from -22deg, #22c55e 0deg 300deg, #d9f6e2 300deg 360deg);
}

.sequence-side-card__ring > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
  text-align: center;
}

.sequence-side-card__ring strong {
  color: #1f2b45;
  font-size: 18px;
}

.sequence-side-card__ring span {
  max-width: 68px;
  color: #97a2b4;
  font-size: 11px;
  line-height: 1.35;
}

.sequence-side-card__list,
.sequence-findings {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.sequence-side-card__list li,
.sequence-findings li {
  gap: 10px;
  align-items: flex-start;
}

.sequence-side-card__list li.is-green .app-icon,
.sequence-findings li.is-green .app-icon {
  color: #22c55e;
}

.sequence-side-card__list li.is-orange .app-icon,
.sequence-findings li.is-orange .app-icon {
  color: #f59e0b;
}

.sequence-side-card__notice {
  gap: 12px;
  margin-top: 18px;
  padding: 14px 14px;
  border: 1px solid #d7e2ff;
  border-radius: 12px;
  color: #5b62f6;
  background: #f7f9ff;
}

.sequence-side-card__notice span {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: inline-grid;
  place-items: center;
  background: #fff;
}

.sequence-side-card__notice strong,
.sequence-findings strong {
  display: block;
  color: #1f2b45;
  font-size: 14px;
}

.sequence-side-card__notice p,
.sequence-findings p {
  margin: 3px 0 0;
  color: #7c889d;
  font-size: 12px;
  line-height: 1.55;
}

.sequence-findings {
  margin-top: 18px;
}

.sequence-improvements__head span {
  color: #97a2b4;
}

.sequence-improvements__head button {
  border: 0;
  padding: 0;
  color: #5b62f6;
  background: transparent;
  font-weight: 700;
}

.sequence-improvements__list {
  margin-top: 18px;
  display: grid;
  gap: 18px;
}

.sequence-improvement-card {
  border: 1px solid #e6ebf4;
  border-radius: 18px;
  background: #fff;
  overflow: hidden;
}

.sequence-improvement-card.is-expanded {
  border-color: #dce3f5;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

.sequence-improvement-card__row {
  gap: 16px;
  padding: 18px 20px;
}

.sequence-improvement-card__topic {
  flex: 1.2;
  min-width: 0;
  align-items: flex-start;
  gap: 14px;
}

.sequence-improvement-card__topic-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
}

.sequence-improvement-card__topic-icon.is-pink {
  color: #fb923c;
  background: #fff4eb;
}

.sequence-improvement-card__topic-icon.is-violet {
  color: #5b62f6;
  background: #eff1ff;
}

.sequence-improvement-card__topic strong {
  display: block;
  color: #1f2b45;
  font-size: 18px;
}

.sequence-improvement-card__topic em {
  min-height: 26px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  color: #fb923c;
  background: #fff4eb;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
}

.sequence-improvement-card__current,
.sequence-improvement-card__recommendation {
  flex: 0.9;
  min-width: 0;
}

.sequence-improvement-card__current span,
.sequence-improvement-card__recommendation span {
  display: block;
  margin-top: 8px;
  color: #1f2b45;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
}

.sequence-improvement-card__recommendation span {
  color: #5b62f6;
}

.sequence-improvement-card__arrow {
  color: #c2cada;
}

.sequence-improvement-card__action,
.sequence-improvement-card__toggle {
  min-height: 42px;
  border: 1px solid #ecdfff;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-weight: 800;
}

.sequence-improvement-card__action {
  min-width: 120px;
  padding: 0 16px;
  color: #ef5da8;
}

.sequence-improvement-card__action.is-active {
  color: #5b62f6;
  background: #f5f6ff;
}

.sequence-improvement-card__toggle {
  width: 42px;
  flex: 0 0 42px;
  border-color: transparent;
  color: #a3aec0;
}

.sequence-improvement-card__body {
  padding: 0 20px 20px;
  border-top: 1px solid #edf1f8;
}

.sequence-improvement-card__tabs {
  gap: 18px;
  padding: 16px 0 14px;
}

.sequence-improvement-card__tabs button {
  border: 0;
  padding: 0 0 8px;
  color: #8c98ad;
  background: transparent;
  font-weight: 800;
}

.sequence-improvement-card__tabs button.is-active {
  color: #ef5da8;
  border-bottom: 2px solid #ef5da8;
}

.sequence-preview-grid,
.sequence-customize-grid {
  gap: 18px;
  align-items: flex-start;
}

.sequence-preview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.sequence-preview-card {
  min-height: 122px;
  margin-top: 12px;
  padding: 14px;
  border: 1px solid #e4ebf5;
  border-radius: 14px;
  background: #fff;
}

.sequence-preview-card strong {
  display: block;
  color: #1f2b45;
  font-size: 15px;
}

.sequence-preview-card span,
.sequence-improvement-impact span,
.sequence-customize-note__impact span {
  display: block;
  margin-top: 8px;
  color: #63728c;
  font-size: 13px;
}

.sequence-preview-card.is-accent {
  border-color: #cfd7ff;
}

.sequence-preview-card p {
  margin: 0;
  color: #1f2b45;
  font-size: 13px;
  line-height: 1.6;
  font-style: italic;
}

.sequence-preview-card button {
  margin-top: 16px;
  border: 0;
  padding: 0;
  color: #3b69f2;
  background: transparent;
  font-weight: 700;
}

.sequence-preview-options {
  margin-top: 12px;
  display: grid;
  gap: 12px;
}

.sequence-preview-options label {
  gap: 10px;
  color: #49576f;
}

.sequence-preview-options input {
  margin: 0;
}

.sequence-preview-options span i {
  margin-left: 4px;
  color: #9aa5b8;
  font-style: normal;
}

.sequence-improvement-impact {
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #edf1f8;
}

.sequence-improvement-impact strong,
.sequence-customize-note__impact small {
  display: block;
  color: #1f2b45;
  font-size: 14px;
}

.sequence-improvement-impact span b,
.sequence-customize-note__impact span b {
  color: #1f2b45;
}

.sequence-improvement-impact__actions {
  gap: 10px;
}

.sequence-improvement-impact__actions button,
.sequence-customize-footer button,
.sequence-customize-add,
.sequence-customize-secondary {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #dce4ef;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #405068;
  background: #fff;
  font-weight: 700;
}

.sequence-improvement-impact__actions button:last-child,
.sequence-customize-footer div button:last-child {
  color: #fff;
  border-color: transparent;
  background: #5b51e8;
}

.sequence-customize-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr 0.95fr 0.95fr 1fr;
}

.sequence-customize-question {
  position: relative;
  margin-top: 12px;
  border: 2px solid #f8b4d9;
  border-radius: 14px;
  background: #fff;
}

.sequence-customize-question textarea {
  width: 100%;
  min-height: 106px;
  padding: 16px 52px 16px 14px;
  border: 0;
  resize: none;
  outline: none;
  color: #1f2b45;
  background: transparent;
  line-height: 1.6;
}

.sequence-customize-question__tools {
  position: absolute;
  top: 12px;
  right: 12px;
  gap: 8px;
}

.sequence-customize-question__tools button {
  border: 0;
  padding: 0;
  color: #a0abc0;
  background: transparent;
}

.sequence-customize-add,
.sequence-customize-secondary {
  width: 100%;
  margin-top: 10px;
}

.sequence-customize-add {
  border-style: dashed;
  color: #5b62f6;
}

.sequence-customize-secondary {
  color: #5b62f6;
  background: #f3f4ff;
  border-color: transparent;
}

.sequence-customize-checks {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.sequence-customize-checks label {
  gap: 10px;
}

.sequence-customize-link {
  margin-top: 10px;
  border: 0;
  padding: 0;
  color: #5b62f6;
  background: transparent;
  font-weight: 700;
}

.sequence-customize-note {
  padding: 14px;
  border: 1px solid #eef2f8;
  border-radius: 14px;
  background: #fafbff;
}

.sequence-customize-note__impact {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #edf1f8;
}

.sequence-customize-footer {
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #edf1f8;
}

.sequence-customize-footer > div {
  display: flex;
  gap: 10px;
}

.sequence-impact {
  margin-top: 2px;
  padding: 20px;
}

.sequence-impact__grid {
  gap: 18px;
  margin-top: 18px;
  padding: 22px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  justify-content: space-between;
}

.sequence-impact__grid article {
  min-width: 120px;
}

.sequence-impact__grid article strong {
  display: block;
  margin-top: 8px;
  color: #1f2b45;
  font-size: 30px;
}

.sequence-impact__grid article span {
  display: block;
  margin-top: 4px;
  color: #8f9aae;
  font-size: 12px;
  line-height: 1.45;
}

.sequence-impact__grid article.is-green strong,
.sequence-impact__grid article.is-green small {
  color: #16a34a;
}

.sequence-impact__arrow {
  color: #c1cad9;
}

.sequence-impact__result {
  min-height: 64px;
  padding: 0 18px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #16a34a;
  background: #ebfaef;
  font-weight: 800;
}

.sequence-modal__footer {
  gap: 16px;
  padding: 18px 24px;
  border-top: 1px solid #e8eef7;
}

.sequence-modal__actions {
  gap: 12px;
  margin-left: auto;
}

.sequence-button {
  min-height: 48px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 14px;
  gap: 8px;
  font-size: 15px;
  font-weight: 800;
}

.sequence-button--ghost {
  color: #425168;
  border-color: #dce4ef;
  background: #fff;
}

.sequence-button--primary {
  color: #fff;
  background: linear-gradient(180deg, #f06bae 0%, #ea56a4 100%);
  box-shadow: 0 16px 28px rgba(236, 94, 166, 0.24);
}

.sequence-button--primary.is-violet {
  background: linear-gradient(180deg, #6955f6 0%, #5647e8 100%);
  box-shadow: 0 16px 28px rgba(91, 81, 232, 0.24);
}

.sequence-reset {
  gap: 12px;
  border: 0;
  padding: 0;
  color: #506078;
  background: transparent;
}

.sequence-reset strong {
  display: block;
  color: #47556d;
  font-size: 14px;
  text-align: left;
}

@media (max-width: 1360px) {
  .sequence-review-top {
    display: grid;
  }

  .sequence-review-side {
    width: auto;
  }

  .sequence-side-card {
    border-left: 0;
    padding-left: 0;
  }

  .sequence-preview-grid,
  .sequence-customize-grid,
  .sequence-why__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1080px) {
  .sequence-candidate,
  .sequence-ownership,
  .sequence-step-card__body,
  .sequence-step-card__meta,
  .sequence-adjustments,
  .sequence-impact__grid,
  .sequence-improvement-card__row,
  .sequence-improvement-impact,
  .sequence-customize-footer {
    display: grid;
  }

  .sequence-steps,
  .sequence-preview-grid,
  .sequence-customize-grid,
  .sequence-why__grid {
    grid-template-columns: 1fr;
  }

  .sequence-step-card__identity,
  .sequence-review-side {
    width: auto;
  }
}

@media (max-width: 760px) {
  .sequence-overlay {
    padding: 10px;
  }

  .sequence-modal {
    max-height: calc(100vh - 20px);
  }

  .sequence-modal__body,
  .sequence-modal__footer,
  .sequence-modal__actions {
    display: grid;
  }

  .sequence-modal__actions {
    margin-left: 0;
  }
}
</style>
