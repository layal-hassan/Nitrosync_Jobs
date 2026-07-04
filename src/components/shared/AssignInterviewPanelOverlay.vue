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
  hasAssignedPanel: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'panel-assigned'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const initialPanelMembers = [
  {
    slotKey: 'hm',
    slotLabel: 'Hiring Manager',
    badge: 'HM',
    name: 'Emma Wilson',
    role: 'Hiring Manager',
    panelRole: 'Design Director',
    initials: 'EW',
    avatarTone: 'rose',
    tags: ['Product Thinking', 'Leadership'],
  },
  {
    slotKey: 'design-lead',
    slotLabel: 'Design Lead',
    badge: '',
    name: 'Michael Chen',
    role: 'Design Lead',
    panelRole: 'Design Lead',
    initials: 'MC',
    avatarTone: 'slate',
    tags: ['UX Design', 'Design Systems'],
  },
  {
    slotKey: 'principal',
    slotLabel: 'Principal Designer',
    badge: '',
    name: 'David Park',
    role: 'Principal Designer',
    panelRole: 'Principal Designer',
    initials: 'DP',
    avatarTone: 'midnight',
    tags: ['Portfolio Review', 'Case Studies'],
  },
]

const alternativesMap = {
  hm: [
    {
      name: 'Emma Wilson',
      role: 'Hiring Manager',
      initials: 'EW',
      avatarTone: 'rose',
      match: '92% Match',
      bullets: ['Product Thinking', 'Leadership', 'Available this week'],
      cta: 'Keep Emma',
      highlight: true,
    },
    {
      name: 'Rachel Green',
      role: 'Design Manager',
      initials: 'RG',
      avatarTone: 'amber',
      match: '89% Match',
      bullets: ['Cross-functional delivery', 'Team leadership', 'Available in 2 days'],
      cta: 'Replace with Rachel',
    },
    {
      name: 'Mark Evans',
      role: 'Product Director',
      initials: 'ME',
      avatarTone: 'violet',
      match: '86% Match',
      bullets: ['Strategic hiring', 'Executive calibration', 'Available in 3 days'],
      cta: 'Replace with Mark',
    },
  ],
  'design-lead': [
    {
      name: 'Anna Smith',
      role: 'Senior UX Designer',
      initials: 'AS',
      avatarTone: 'rose',
      match: '93% Match',
      bullets: ['UX Design', 'Design Systems', 'Available this week'],
      cta: 'Replace with Anna',
      highlight: true,
    },
    {
      name: 'Kevin Jones',
      role: 'Product Designer',
      initials: 'KJ',
      avatarTone: 'midnight',
      match: '89% Match',
      bullets: ['Product Thinking', 'Design Leadership', 'Available in 2 days'],
      cta: 'Replace with Kevin',
    },
    {
      name: 'Lisa Chen',
      role: 'UX Researcher',
      initials: 'LC',
      avatarTone: 'violet',
      match: '87% Match',
      bullets: ['UX Research', 'Portfolio Evaluation', 'Available this week'],
      cta: 'Replace with Lisa',
    },
  ],
  principal: [
    {
      name: 'Noah Rivera',
      role: 'Principal Product Designer',
      initials: 'NR',
      avatarTone: 'slate',
      match: '91% Match',
      bullets: ['Portfolio Review', 'System thinking', 'Available in 1 day'],
      cta: 'Replace with Noah',
      highlight: true,
    },
    {
      name: 'Jade Cooper',
      role: 'Staff Designer',
      initials: 'JC',
      avatarTone: 'rose',
      match: '88% Match',
      bullets: ['Case study review', 'Mentorship', 'Available this week'],
      cta: 'Replace with Jade',
    },
    {
      name: 'Omar Khalid',
      role: 'Design Strategist',
      initials: 'OK',
      avatarTone: 'amber',
      match: '85% Match',
      bullets: ['Design strategy', 'Stakeholder alignment', 'Available in 3 days'],
      cta: 'Replace with Omar',
    },
  ],
}

const flowState = ref('assign')
const panelMembers = ref([])
const selectedSlotKey = ref('design-lead')
const saveAsDefault = ref(false)

const displayStage = computed(() => (
  props.candidateStage.toLowerCase() === 'interview' ? 'Shortlisted' : props.candidateStage
))

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const selectedMember = computed(() => (
  panelMembers.value.find((member) => member.slotKey === selectedSlotKey.value) ?? panelMembers.value[0]
))

const selectedAlternatives = computed(() => alternativesMap[selectedSlotKey.value] ?? [])
const selectedSlotLabel = computed(() => selectedMember.value?.slotLabel ?? 'Panel Member')
const designLeadMember = computed(() => panelMembers.value.find((member) => member.slotKey === 'design-lead') ?? panelMembers.value[1])
const principalMember = computed(() => panelMembers.value.find((member) => member.slotKey === 'principal') ?? panelMembers.value[2])
const hiringManagerMember = computed(() => panelMembers.value.find((member) => member.slotKey === 'hm') ?? panelMembers.value[0])

const coverageRows = computed(() => ([
  {
    area: 'Leadership',
    detail: 'Evaluate ability to lead and influence teams to achieve results',
    coveredBy: hiringManagerMember.value?.name ?? 'Emma Wilson',
    coveredByRole: hiringManagerMember.value?.role ?? 'Hiring Manager',
    avatarTone: hiringManagerMember.value?.avatarTone ?? 'rose',
    status: 'Covered',
    statusTone: 'green',
    icon: 'userPlus',
  },
  {
    area: 'Product Thinking',
    detail: 'Assess product sense and user-centric problem solving',
    coveredBy: hiringManagerMember.value?.name ?? 'Emma Wilson',
    coveredByRole: hiringManagerMember.value?.role ?? 'Hiring Manager',
    avatarTone: hiringManagerMember.value?.avatarTone ?? 'rose',
    status: 'Covered',
    statusTone: 'green',
    icon: 'spark',
  },
  {
    area: 'Design Systems',
    detail: 'Validate experience building and scaling design systems',
    coveredBy: principalMember.value?.name ?? 'David Park',
    coveredByRole: principalMember.value?.role ?? 'Principal Designer',
    avatarTone: principalMember.value?.avatarTone ?? 'midnight',
    status: 'Covered',
    statusTone: 'green',
    icon: 'document',
  },
  {
    area: 'Portfolio Evaluation',
    detail: 'Review quality of work and design thinking in past projects',
    coveredBy: principalMember.value?.name ?? 'David Park',
    coveredByRole: principalMember.value?.role ?? 'Principal Designer',
    avatarTone: principalMember.value?.avatarTone ?? 'midnight',
    status: 'Covered',
    statusTone: 'green',
    icon: 'eye',
  },
  {
    area: 'Stakeholder Management',
    detail: 'Evaluate ability to collaborate and influence cross-functional stakeholders',
    coveredBy: 'Not Covered',
    coveredByRole: 'Gap Identified',
    avatarTone: '',
    status: 'Missing',
    statusTone: 'orange',
    icon: 'users',
  },
]))

const aiCoverageList = [
  { label: 'Leadership', tone: 'green' },
  { label: 'Product Thinking', tone: 'green' },
  { label: 'Design Systems', tone: 'green' },
  { label: 'Portfolio Evaluation', tone: 'green' },
  { label: 'Stakeholder Management', tone: 'orange' },
]

const analysisSummaryChips = [
  { label: 'Complete Coverage', tone: 'green', icon: 'check' },
  { label: 'Hiring Manager Included', tone: 'green', icon: 'check' },
  { label: 'Available Within 3 Days', tone: 'green', icon: 'check' },
  { label: 'No Scheduling Conflicts', tone: 'slate', icon: 'check' },
]

const ringStyle = computed(() => ({
  background: 'conic-gradient(from -42deg, #ef63ad 0deg 54deg, #ffffff 54deg 72deg, #ef63ad 72deg 126deg, #ffffff 126deg 144deg, #ef63ad 144deg 198deg, #ffffff 198deg 216deg, #ef63ad 216deg 270deg, #ffffff 270deg 288deg, #f7d9e8 288deg 342deg, #ffffff 342deg 360deg)',
}))

function resetState() {
  flowState.value = props.hasAssignedPanel ? 'analysis' : 'assign'
  panelMembers.value = initialPanelMembers.map((member) => ({ ...member, tags: [...member.tags] }))
  selectedSlotKey.value = 'design-lead'
  saveAsDefault.value = false
}

function closeOverlay() {
  emit('close')
}

function replaceMember(alternative) {
  panelMembers.value = panelMembers.value.map((member) => (
    member.slotKey === selectedSlotKey.value
      ? {
          ...member,
          name: alternative.name,
          role: alternative.role,
          panelRole: alternative.role,
          initials: alternative.initials,
          avatarTone: alternative.avatarTone,
          tags: alternative.bullets.slice(0, 2),
        }
      : member
  ))
}

function assignPanel() {
  emit('panel-assigned')
  flowState.value = 'analysis'
}

function useSelectedPanel() {
  emit('close')
}

function applyAiImprovements() {
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
    if (isOpen) {
      resetState()
    }

    syncDocumentScrollLock(isOpen)
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="panel-flow-overlay" @click.self="closeOverlay">
      <section class="panel-flow-modal">
        <header class="panel-flow-modal__head">
          <div class="panel-flow-modal__title">
            <span class="panel-flow-modal__title-icon">
              <AppIcon :name="flowState === 'analysis' ? 'sparkles' : 'userPlus'" :size="18" />
            </span>
            <div>
              <div class="panel-flow-modal__title-row">
                <h2>{{ flowState === 'analysis' ? 'Interview Panel Analysis' : 'Assign Interview Panel' }}</h2>
                <span v-if="flowState === 'analysis'" class="panel-flow-modal__badge">Beta</span>
              </div>
              <p>
                {{
                  flowState === 'analysis'
                    ? 'AI is analyzing your selected panel to ensure complete hiring coverage.'
                    : 'NitroSync recommends the best interview panel for this stage.'
                }}
              </p>
            </div>
          </div>

          <button class="panel-flow-modal__close" type="button" aria-label="Close panel flow" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="panel-flow-modal__body">
          <section class="panel-flow-candidate">
            <div class="panel-flow-candidate__identity">
              <span class="panel-flow-candidate__avatar">{{ candidateInitials }}</span>
              <div>
                <div class="panel-flow-candidate__name-row">
                  <strong>{{ candidateName }}</strong>
                  <span class="panel-flow-candidate__stage">{{ displayStage.toUpperCase() }}</span>
                </div>
                <span>{{ candidateRole }}</span>
                <div class="panel-flow-candidate__meta">
                  <small><AppIcon name="mapPin" :size="12" /> New York, NY (Hybrid)</small>
                  <small><AppIcon name="briefcase" :size="12" /> 6+ years experience</small>
                  <small><AppIcon name="calendar" :size="12" /> Applied on 10 May 2026</small>
                </div>
              </div>
            </div>

            <div class="panel-flow-candidate__ownership">
              <article>
                <small>HIRING MANAGER</small>
                <div>
                  <span class="panel-flow-mini-avatar is-rose">EW</span>
                  <div>
                    <strong>Emma Wilson</strong>
                    <span>Design Director</span>
                  </div>
                </div>
              </article>

              <article>
                <small>RECRUITER</small>
                <div>
                  <span class="panel-flow-mini-avatar is-violet">SC</span>
                  <div>
                    <strong>Sophia Carter</strong>
                    <span>Talent Partner</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <template v-if="flowState === 'assign'">
            <section class="panel-flow-section">
              <div class="panel-flow-section__head">
                <h3><AppIcon name="sparkles" :size="16" /> Recommended Interview Panel</h3>
                <div class="panel-flow-section__badge">
                  <span>AI Recommended</span>
                  <small>92% Match Confidence <AppIcon name="info" :size="12" /></small>
                </div>
              </div>

              <div class="panel-flow-recommendation-grid">
                <article v-for="member in panelMembers" :key="member.slotKey" class="panel-flow-member-card">
                  <div class="panel-flow-member-card__head">
                    <span class="panel-flow-mini-avatar" :class="`is-${member.avatarTone}`">{{ member.initials }}</span>
                    <div>
                      <strong>{{ member.name }}</strong>
                      <span>{{ member.role }}</span>
                    </div>
                    <em v-if="member.badge">{{ member.badge }}</em>
                  </div>

                  <div class="panel-flow-member-card__tags">
                    <span v-for="tag in member.tags" :key="tag">{{ tag }}</span>
                  </div>
                </article>
              </div>

              <div class="panel-flow-chip-row">
                <span><AppIcon name="checkCircle" :size="13" /> Complete Interview Coverage</span>
                <span><AppIcon name="checkCircle" :size="13" /> Hiring Manager Included</span>
                <span><AppIcon name="checkCircle" :size="13" /> Available Within 3 Days</span>
                <span class="is-neutral"><AppIcon name="shield" :size="13" /> No Scheduling Conflicts</span>
              </div>
            </section>

            <section class="panel-flow-accordion">
              <div class="panel-flow-accordion__head">
                <div>
                  <span class="panel-flow-accordion__icon"><AppIcon name="document" :size="14" /></span>
                  <strong>Why This Panel?</strong>
                </div>
                <AppIcon name="chevronUp" :size="16" />
              </div>

              <div class="panel-flow-accordion__body">
                <div class="panel-flow-why-grid">
                  <article>
                    <small>Coverage Analysis</small>
                    <ul>
                      <li>UX Design covered by {{ designLeadMember?.name }}</li>
                      <li>Product Thinking covered by {{ hiringManagerMember?.name }}</li>
                      <li>Portfolio Review covered by {{ principalMember?.name }}</li>
                      <li>Leadership Assessment covered by {{ hiringManagerMember?.name }}</li>
                    </ul>
                  </article>

                  <article>
                    <small>Panel Quality</small>
                    <ul class="is-green">
                      <li>Hiring Manager included</li>
                      <li>No scheduling conflicts detected</li>
                      <li>Available within 3 days</li>
                      <li>Balanced interviewer experience</li>
                    </ul>
                  </article>

                  <article>
                    <small>Historical Insight</small>
                    <p>This panel structure was used in 14 successful hires for similar Senior Product Designer roles.</p>
                    <div class="panel-flow-insight-bar">87% offer acceptance rate</div>
                  </article>

                  <article>
                    <small>AI Reasoning</small>
                    <p>NitroSync selected this panel because it provides full competency coverage while minimizing scheduling delays and interviewer overload.</p>
                  </article>
                </div>
              </div>
            </section>

            <section class="panel-flow-accordion">
              <div class="panel-flow-accordion__head">
                <div>
                  <span class="panel-flow-accordion__icon"><AppIcon name="userPlus" :size="14" /></span>
                  <div>
                    <strong>Quick Adjustments (Optional)</strong>
                    <small>Need to make a change? We'll suggest the best alternatives.</small>
                  </div>
                </div>
                <AppIcon name="chevronUp" :size="16" />
              </div>

              <div class="panel-flow-accordion__body">
                <div class="panel-flow-adjustments">
                  <aside class="panel-flow-adjustments__members">
                    <article
                      v-for="member in panelMembers"
                      :key="member.slotKey"
                      class="panel-flow-adjust-member"
                      :class="{ 'is-selected': selectedSlotKey === member.slotKey }"
                    >
                      <button type="button" class="panel-flow-adjust-member__main" @click="selectedSlotKey = member.slotKey">
                        <span class="panel-flow-mini-avatar" :class="`is-${member.avatarTone}`">{{ member.initials }}</span>
                        <div>
                          <div class="panel-flow-adjust-member__name-row">
                            <strong>{{ member.name }}</strong>
                            <em v-if="member.badge">{{ member.badge }}</em>
                          </div>
                          <span>{{ member.role }}</span>
                        </div>
                      </button>

                      <div class="panel-flow-adjust-member__actions">
                        <button type="button" aria-label="Remove interviewer">
                          <AppIcon name="trash" :size="12" />
                        </button>
                        <button type="button" @click="selectedSlotKey = member.slotKey">
                          <AppIcon name="refresh" :size="12" />
                          <span>Replace</span>
                        </button>
                      </div>
                    </article>

                    <button class="panel-flow-add-member" type="button">
                      <AppIcon name="plus" :size="14" />
                      <span>Add Interviewer</span>
                    </button>
                  </aside>

                  <section class="panel-flow-alternatives">
                    <div class="panel-flow-alternatives__head">
                      <strong>AI Recommended Alternatives for {{ selectedSlotLabel }}</strong>
                      <button type="button">Why these suggestions? <AppIcon name="info" :size="12" /></button>
                    </div>

                    <div class="panel-flow-alternatives__grid">
                      <article
                        v-for="alternative in selectedAlternatives"
                        :key="`${selectedSlotKey}-${alternative.name}`"
                        class="panel-flow-alternative-card"
                        :class="{ 'is-highlighted': alternative.highlight }"
                      >
                        <span v-if="alternative.highlight" class="panel-flow-alternative-card__badge">Best Match</span>
                        <div class="panel-flow-alternative-card__head">
                          <span class="panel-flow-mini-avatar" :class="`is-${alternative.avatarTone}`">{{ alternative.initials }}</span>
                          <div>
                            <strong>{{ alternative.name }}</strong>
                            <span>{{ alternative.role }}</span>
                          </div>
                          <em>{{ alternative.match }}</em>
                        </div>

                        <ul>
                          <li v-for="bullet in alternative.bullets" :key="bullet">{{ bullet }}</li>
                        </ul>

                        <button type="button" @click="replaceMember(alternative)">{{ alternative.cta }}</button>
                      </article>
                    </div>

                    <p>Can't find the right person? <button type="button">Search Interviewers</button></p>
                  </section>
                </div>
              </div>
            </section>
          </template>

          <template v-else>
            <div class="panel-flow-analysis-top">
              <section class="panel-flow-analysis-card panel-flow-analysis-card--review">
                <div class="panel-flow-analysis-card__head">
                  <h3><AppIcon name="userPlus" :size="16" /> Selected Interview Panel</h3>
                  <span class="panel-flow-analysis-card__label is-green">Recruiter Selected</span>
                </div>

                <div class="panel-flow-selected-panel">
                  <article v-for="member in panelMembers" :key="`analysis-${member.slotKey}`" class="panel-flow-selected-panel__row">
                    <span class="panel-flow-mini-avatar" :class="`is-${member.avatarTone}`">{{ member.initials }}</span>
                    <div class="panel-flow-selected-panel__copy">
                      <div class="panel-flow-selected-panel__name">
                        <strong>{{ member.name }}</strong>
                        <em v-if="member.badge">{{ member.badge }}</em>
                      </div>
                      <span>{{ member.role }}</span>
                      <div class="panel-flow-member-card__tags">
                        <span v-for="tag in member.tags" :key="`${member.slotKey}-${tag}`">{{ tag }}</span>
                      </div>
                    </div>
                    <button type="button" aria-label="More panel options">
                      <AppIcon name="more" :size="16" />
                    </button>
                  </article>
                </div>
              </section>

              <section class="panel-flow-analysis-card panel-flow-analysis-card--review">
                <div class="panel-flow-analysis-card__head">
                  <h3><AppIcon name="spark" :size="16" /> AI Review</h3>
                  <span class="panel-flow-analysis-card__label is-pink">AI Recommended</span>
                </div>

                <div class="panel-flow-ai-review">
                  <div class="panel-flow-ai-review__gauge">
                    <small>Panel Coverage</small>
                    <div class="panel-flow-ring" :style="ringStyle">
                      <div class="panel-flow-ring__inner">
                        <strong>4 of 5</strong>
                        <span>Required Areas</span>
                      </div>
                    </div>
                  </div>

                  <ul class="panel-flow-ai-review__list">
                    <li v-for="item in aiCoverageList" :key="item.label" :class="`is-${item.tone}`">
                      <AppIcon :name="item.tone === 'orange' ? 'alert' : 'checkCircle'" :size="14" />
                      <span>{{ item.label }}</span>
                    </li>
                  </ul>
                </div>

                <article class="panel-flow-overall-assessment">
                  <span><AppIcon name="document" :size="14" /></span>
                  <div>
                    <strong>Overall Assessment</strong>
                    <p>Good panel with one critical gap.</p>
                  </div>
                </article>
              </section>
            </div>

            <div class="panel-flow-analysis-summary">
              <div class="panel-flow-analysis-summary__meta">
                <span><AppIcon name="clock" :size="14" /> 3 interviewers • 2 interview stages <AppIcon name="info" :size="12" /></span>
              </div>

              <div class="panel-flow-chip-row panel-flow-analysis-summary__chips">
                <span v-for="chip in analysisSummaryChips" :key="chip.label" :class="{ 'is-neutral': chip.tone === 'slate' }">
                  <AppIcon :name="chip.icon" :size="13" />
                  <span>{{ chip.label }}</span>
                </span>
              </div>
            </div>

            <div class="panel-flow-analysis-main">
              <section class="panel-flow-coverage-panel">
                <h3>Coverage by Required Area</h3>

                <div class="panel-flow-coverage-table">
                  <div class="panel-flow-coverage-table__head">
                    <span>Required Area</span>
                    <span>Why It's Important</span>
                    <span>Covered By</span>
                    <span>Coverage</span>
                  </div>

                  <article v-for="row in coverageRows" :key="row.area" class="panel-flow-coverage-row">
                    <div class="panel-flow-coverage-area" :class="`is-${row.statusTone}`">
                      <span class="panel-flow-coverage-area__icon">
                        <AppIcon :name="row.icon" :size="13" />
                      </span>
                      <strong>{{ row.area }}</strong>
                    </div>
                    <p>{{ row.detail }}</p>
                    <div class="panel-flow-coverage-by" :class="{ 'is-missing': row.statusTone === 'orange' }">
                      <template v-if="row.statusTone !== 'orange'">
                        <span class="panel-flow-mini-avatar" :class="`is-${row.avatarTone}`">{{ row.coveredBy.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() }}</span>
                      </template>
                      <div>
                        <strong>{{ row.coveredBy }}</strong>
                        <span>{{ row.coveredByRole }}</span>
                      </div>
                    </div>
                    <span class="panel-flow-coverage-status" :class="`is-${row.statusTone}`">{{ row.status }}</span>
                  </article>
                </div>
              </section>

              <aside class="panel-flow-recommendations-panel">
                <h3>AI Recommendations</h3>

                <article class="panel-flow-recommendation-card is-critical">
                  <small>Critical Gap</small>
                  <strong>Stakeholder Management</strong>
                  <p>This area is not fully validated in your current panel.</p>

                  <section class="panel-flow-recommendation-card__action">
                    <div>
                      <strong>Add stakeholder evaluation to the {{ designLeadMember?.name }} interview.</strong>
                      <p>We will add 2 targeted questions and evaluation criteria.</p>
                    </div>
                    <button type="button">Apply to {{ designLeadMember?.name }}</button>
                  </section>
                </article>

                <article class="panel-flow-recommendation-card is-success">
                  <small>Optional Improvement</small>
                  <strong>Add external design perspective to strengthen portfolio evaluation.</strong>
                  <button type="button">View Alternative Panel</button>
                </article>
              </aside>
            </div>
          </template>
        </div>

        <footer class="panel-flow-modal__footer">
          <template v-if="flowState === 'assign'">
            <label class="panel-flow-checkbox">
              <input v-model="saveAsDefault" type="checkbox">
              <span>Save as default panel for this role</span>
              <AppIcon name="info" :size="12" />
            </label>

            <div class="panel-flow-modal__actions">
              <button class="panel-flow-button panel-flow-button--ghost" type="button" @click="closeOverlay">Cancel</button>
              <button class="panel-flow-button panel-flow-button--primary" type="button" @click="assignPanel">
                <AppIcon name="users" :size="14" />
                <span>Assign Recommended Panel</span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="panel-flow-analysis-footer">
              <button class="panel-flow-analysis-footer__link" type="button" @click="closeOverlay">Cancel</button>
              <div class="panel-flow-modal__actions">
                <button class="panel-flow-button panel-flow-button--ghost-accent" type="button" @click="useSelectedPanel">Use Selected Panel</button>
                <button class="panel-flow-button panel-flow-button--primary" type="button" @click="applyAiImprovements">
                  <AppIcon name="spark" :size="14" />
                  <span>Apply AI Improvements</span>
                </button>
              </div>
            </div>
          </template>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.panel-flow-overlay,
.panel-flow-overlay *,
.panel-flow-overlay *::before,
.panel-flow-overlay *::after {
  box-sizing: border-box;
}

.panel-flow-overlay button,
.panel-flow-overlay input {
  font: inherit;
}

.panel-flow-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: grid;
  place-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  background: rgba(19, 27, 42, 0.56);
  backdrop-filter: blur(7px);
}

.panel-flow-modal {
  width: min(100%, 1440px);
  max-height: calc(100vh - 18px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 34px 90px rgba(15, 23, 42, 0.28);
}

.panel-flow-modal__head,
.panel-flow-modal__title,
.panel-flow-modal__title-row,
.panel-flow-section__head,
.panel-flow-candidate__identity,
.panel-flow-candidate__name-row,
.panel-flow-candidate__meta,
.panel-flow-candidate__ownership,
.panel-flow-candidate__ownership article > div,
.panel-flow-member-card__head,
.panel-flow-member-card__tags,
.panel-flow-chip-row,
.panel-flow-accordion__head,
.panel-flow-accordion__head > div,
.panel-flow-why-grid,
.panel-flow-adjustments,
.panel-flow-adjust-member,
.panel-flow-adjust-member__main,
.panel-flow-adjust-member__actions,
.panel-flow-adjust-member__actions button,
.panel-flow-alternatives__head,
.panel-flow-alternative-card__head,
.panel-flow-modal__footer,
.panel-flow-modal__actions,
.panel-flow-button,
.panel-flow-checkbox,
.panel-flow-analysis-top,
.panel-flow-analysis-card__head,
.panel-flow-selected-panel__row,
.panel-flow-selected-panel__name,
.panel-flow-ai-review,
.panel-flow-ai-review__list li,
.panel-flow-overall-assessment,
.panel-flow-analysis-summary,
.panel-flow-analysis-main,
.panel-flow-coverage-table__head,
.panel-flow-coverage-row,
.panel-flow-coverage-area,
.panel-flow-coverage-by,
.panel-flow-recommendation-card__action,
.panel-flow-metrics,
.panel-flow-metric,
.panel-flow-analysis-footer,
.panel-flow-analysis-summary__meta {
  display: flex;
  align-items: center;
}

.panel-flow-modal__head,
.panel-flow-section__head,
.panel-flow-candidate__ownership,
.panel-flow-accordion__head,
.panel-flow-alternatives__head,
.panel-flow-modal__footer,
.panel-flow-analysis-summary,
.panel-flow-analysis-footer {
  justify-content: space-between;
}

.panel-flow-modal__head {
  padding: 18px 22px;
  border-bottom: 1px solid #edf2fb;
}

.panel-flow-modal__title {
  gap: 14px;
}

.panel-flow-modal__title-icon {
  width: 42px;
  height: 42px;
  display: inline-grid;
  place-items: center;
  border-radius: 14px;
  background: #fff0f7;
  color: #f261a8;
}

.panel-flow-modal__title-row {
  gap: 10px;
}

.panel-flow-modal__title h2,
.panel-flow-section__head h3,
.panel-flow-candidate__identity strong,
.panel-flow-candidate__ownership strong,
.panel-flow-member-card__head strong,
.panel-flow-accordion__head strong,
.panel-flow-adjust-member strong,
.panel-flow-alternatives__head strong,
.panel-flow-alternative-card__head strong,
.panel-flow-analysis-card__head h3,
.panel-flow-coverage-panel h3,
.panel-flow-recommendations-panel h3,
.panel-flow-recommendation-card strong,
.panel-flow-selected-panel__name strong {
  margin: 0;
  color: #25314a;
}

.panel-flow-modal__title h2 {
  font-size: 1rem;
}

.panel-flow-modal__title p,
.panel-flow-candidate__identity > div > span,
.panel-flow-candidate__ownership span,
.panel-flow-member-card__head span,
.panel-flow-accordion__head small,
.panel-flow-adjust-member span,
.panel-flow-alternative-card__head span,
.panel-flow-selected-panel__copy > span,
.panel-flow-overall-assessment p,
.panel-flow-recommendation-card p,
.panel-flow-recommendation-card__action p {
  margin: 4px 0 0;
  color: #7f8aa1;
  font-size: 0.82rem;
}

.panel-flow-modal__badge {
  padding: 4px 9px;
  border-radius: 999px;
  background: linear-gradient(180deg, #f07bbe 0%, #e85aa7 100%);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.panel-flow-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  background: transparent;
  color: #9aa4b8;
}

.panel-flow-modal__body {
  flex: 1 1 auto;
  min-height: auto;
  overflow: visible;
  padding: 18px 28px 22px;
  display: grid;
  gap: 18px;
  align-content: start;
}

.panel-flow-overlay::-webkit-scrollbar {
  width: 10px;
}

.panel-flow-modal::-webkit-scrollbar,
.panel-flow-overlay::-webkit-scrollbar {
  width: 10px;
}

.panel-flow-overlay::-webkit-scrollbar-track {
  background: transparent;
}

.panel-flow-modal::-webkit-scrollbar-track,
.panel-flow-overlay::-webkit-scrollbar-track {
  background: transparent;
}

.panel-flow-modal::-webkit-scrollbar-thumb,
.panel-flow-overlay::-webkit-scrollbar-thumb {
  background: rgba(173, 184, 204, 0.9);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.panel-flow-candidate {
  padding: 22px 24px 18px;
  border-radius: 24px;
  background: linear-gradient(180deg, #f7f9fe 0%, #f8fbff 100%);
  border: 1px solid #e8eef8;
}

.panel-flow-candidate__identity {
  align-items: flex-start;
  gap: 14px;
}

.panel-flow-candidate__avatar,
.panel-flow-mini-avatar {
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-weight: 800;
}

.panel-flow-candidate__avatar {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #231526 0%, #a47b54 52%, #f1d2a2 100%);
  font-size: 0.94rem;
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.9);
}

.panel-flow-candidate__name-row {
  gap: 12px;
}

.panel-flow-candidate__name-row strong {
  font-size: 1.08rem;
  line-height: 1.08;
}

.panel-flow-candidate__stage {
  color: #ff74b4;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.panel-flow-candidate__meta {
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.panel-flow-candidate__meta small,
.panel-flow-analysis-summary__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6f7a91;
  font-size: 0.76rem;
}

.panel-flow-candidate__ownership {
  gap: 0;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #dbe3ef;
}

.panel-flow-candidate__ownership article {
  flex: 1;
}

.panel-flow-candidate__ownership article + article {
  padding-left: 40px;
  border-left: 1px solid #e3e8f1;
}

.panel-flow-candidate__ownership small,
.panel-flow-why-grid small,
.panel-flow-recommendation-card small,
.panel-flow-metric small,
.panel-flow-coverage-table__head span {
  display: block;
  color: #9aa4b8;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.panel-flow-candidate__ownership article > div {
  justify-content: flex-start;
  gap: 10px;
  margin-top: 6px;
}

.panel-flow-mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 0.76rem;
}

.panel-flow-mini-avatar.is-rose {
  background: linear-gradient(135deg, #f7dacb 0%, #d29384 100%);
}

.panel-flow-mini-avatar.is-violet {
  background: linear-gradient(135deg, #25264a 0%, #7b5bd8 100%);
}

.panel-flow-mini-avatar.is-slate {
  background: linear-gradient(135deg, #384154 0%, #7687a7 100%);
}

.panel-flow-mini-avatar.is-midnight {
  background: linear-gradient(135deg, #0b1729 0%, #495e73 100%);
}

.panel-flow-mini-avatar.is-amber {
  background: linear-gradient(135deg, #8b562a 0%, #daa06f 100%);
}

.panel-flow-section,
.panel-flow-analysis-card,
.panel-flow-coverage-panel,
.panel-flow-recommendations-panel {
  padding: 0;
}

.panel-flow-section__head h3,
.panel-flow-analysis-card__head h3 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.panel-flow-section__badge,
.panel-flow-recommendation__badge {
  display: grid;
  justify-items: end;
  gap: 6px;
}

.panel-flow-section__badge span,
.panel-flow-analysis-card__label {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.panel-flow-section__badge span,
.panel-flow-analysis-card__label.is-pink {
  background: linear-gradient(180deg, #f07bbe 0%, #e85aa7 100%);
  color: #fff;
}

.panel-flow-analysis-card__label.is-green {
  background: #ecfbf1;
  color: #18a15d;
}

.panel-flow-section__badge small,
.panel-flow-analysis-summary__meta {
  color: #5e6982;
  font-size: 0.74rem;
}

.panel-flow-recommendation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.panel-flow-member-card,
.panel-flow-analysis-card,
.panel-flow-accordion,
.panel-flow-coverage-table,
.panel-flow-recommendation-card {
  border: 1px solid #e7ecf4;
  border-radius: 16px;
  background: #fff;
}

.panel-flow-member-card {
  padding: 12px;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04);
}

.panel-flow-member-card__head {
  align-items: flex-start;
  gap: 10px;
}

.panel-flow-member-card__head > div,
.panel-flow-alternative-card__head > div,
.panel-flow-selected-panel__copy {
  flex: 1;
}

.panel-flow-member-card__head strong,
.panel-flow-adjust-member strong,
.panel-flow-alternative-card__head strong {
  font-size: 0.86rem;
}

.panel-flow-member-card__head em,
.panel-flow-adjust-member__name-row em {
  padding: 4px 7px;
  border-radius: 8px;
  background: #fff0f6;
  color: #f06aaa;
  font-size: 0.62rem;
  font-style: normal;
  font-weight: 800;
}

.panel-flow-member-card__tags {
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.panel-flow-member-card__tags span,
.panel-flow-chip-row span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #eef2ff;
  color: #5b63ea;
  font-size: 0.66rem;
  font-weight: 700;
}

.panel-flow-chip-row {
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.panel-flow-chip-row span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfbf1;
  color: #169957;
}

.panel-flow-chip-row span.is-neutral {
  background: #f5f7fb;
  color: #556179;
}

.panel-flow-accordion {
  overflow: hidden;
}

.panel-flow-accordion__head {
  width: 100%;
  padding: 10px 14px;
  background: linear-gradient(180deg, #fff 0%, #fcfdff 100%);
  color: #2a3550;
}

.panel-flow-accordion__head > div {
  gap: 12px;
}

.panel-flow-accordion__icon {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: inline-grid;
  place-items: center;
  background: #fff1f7;
  color: #ef67ab;
  flex: 0 0 24px;
}

.panel-flow-accordion__body {
  padding: 0 14px 14px;
  border-top: 1px solid #edf1f6;
}

.panel-flow-why-grid {
  align-items: stretch;
  gap: 12px;
  margin-top: 12px;
}

.panel-flow-why-grid article {
  flex: 1;
}

.panel-flow-why-grid ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #606b81;
  line-height: 1.45;
  font-size: 0.75rem;
}

.panel-flow-why-grid ul.is-green li::marker {
  color: #22b161;
}

.panel-flow-why-grid p {
  margin: 10px 0 0;
  color: #606b81;
  line-height: 1.5;
  font-size: 0.75rem;
}

.panel-flow-insight-bar {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, #fff5fa 0%, #ffedf6 100%);
  color: #ef69ad;
  font-size: 0.72rem;
  font-weight: 800;
  text-align: center;
}

.panel-flow-adjustments {
  align-items: flex-start;
  gap: 16px;
  margin-top: 12px;
}

.panel-flow-adjustments__members {
  width: 34%;
  min-width: 290px;
}

.panel-flow-adjust-member {
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #e7ecf4;
  border-radius: 12px;
  background: #fff;
}

.panel-flow-adjust-member + .panel-flow-adjust-member {
  margin-top: 10px;
}

.panel-flow-adjust-member.is-selected {
  border-color: #f5b8d6;
  box-shadow: 0 0 0 2px rgba(243, 103, 172, 0.08);
}

.panel-flow-adjust-member__main {
  flex: 1;
  gap: 12px;
  border: 0;
  padding: 0;
  background: transparent;
  text-align: left;
}

.panel-flow-adjust-member__name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-flow-adjust-member__actions {
  gap: 10px;
}

.panel-flow-adjust-member__actions button {
  gap: 6px;
  height: 26px;
  padding: 0 8px;
  border: 1px solid #e2e8f2;
  border-radius: 9px;
  background: #fff;
  color: #69758d;
  font-size: 0.72rem;
  font-weight: 700;
}

.panel-flow-add-member {
  width: 100%;
  margin-top: 10px;
  height: 42px;
  border: 2px dashed #ffd0e6;
  border-radius: 14px;
  background: #fffafb;
  color: #f166ab;
  font-weight: 800;
}

.panel-flow-alternatives {
  flex: 1;
  padding: 14px;
  border: 1px dashed #d8deeb;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff 0%, #fdfdff 100%);
}

.panel-flow-alternatives__head button,
.panel-flow-alternatives > p button {
  border: 0;
  padding: 0;
  background: transparent;
  color: #6d5cf5;
  font-size: 0.72rem;
  font-weight: 800;
}

.panel-flow-alternatives__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.panel-flow-alternative-card {
  position: relative;
  padding: 12px;
  border: 1px solid #eceff6;
  border-radius: 12px;
  background: #fff;
}

.panel-flow-alternative-card.is-highlighted {
  border-color: #f4bdd8;
  box-shadow: 0 10px 20px rgba(242, 100, 171, 0.08);
}

.panel-flow-alternative-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f06aaa;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
}

.panel-flow-alternative-card__head {
  align-items: flex-start;
  gap: 8px;
  margin-top: 10px;
}

.panel-flow-alternative-card__head em {
  color: #22b161;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 800;
}

.panel-flow-alternative-card ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #6b7590;
  line-height: 1.45;
  font-size: 0.72rem;
}

.panel-flow-alternative-card ul li::marker {
  color: #ef67ab;
}

.panel-flow-alternative-card button {
  width: 100%;
  height: 34px;
  margin-top: 12px;
  border: 1px solid #f0bfd7;
  border-radius: 10px;
  background: #fff;
  color: #ef67ab;
  font-weight: 800;
  font-size: 0.72rem;
}

.panel-flow-alternative-card.is-highlighted button {
  background: linear-gradient(180deg, #f07bbe 0%, #e95aa8 100%);
  color: #fff;
  border-color: transparent;
}

.panel-flow-alternatives > p {
  margin: 12px 0 0;
  color: #78839b;
  font-size: 0.74rem;
  text-align: center;
}

.panel-flow-analysis-top {
  align-items: stretch;
  gap: 20px;
}

.panel-flow-analysis-top > * {
  flex: 1;
}

.panel-flow-analysis-card {
  padding: 18px;
}

.panel-flow-analysis-card--review {
  min-height: 510px;
  padding: 28px 24px 22px;
  border-color: #e3eaf5;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
}

.panel-flow-analysis-card--review .panel-flow-analysis-card__head {
  align-items: center;
  gap: 16px;
}

.panel-flow-analysis-card--review .panel-flow-analysis-card__head h3 {
  color: #26334d;
  font-size: 1.02rem;
  font-weight: 800;
}

.panel-flow-analysis-card--review .panel-flow-analysis-card__head h3 .app-icon,
.panel-flow-analysis-card--review .panel-flow-analysis-card__head h3 svg {
  color: #f06aaa;
}

.panel-flow-analysis-card__label {
  letter-spacing: 0.04em;
}

.panel-flow-analysis-card--review .panel-flow-analysis-card__label {
  padding: 8px 14px;
  font-size: 0.64rem;
}

.panel-flow-analysis-card--review .panel-flow-analysis-card__label.is-pink {
  background: #fff1f7;
  color: #f06aaa;
}

.panel-flow-selected-panel {
  margin-top: 18px;
  display: grid;
  flex: 1 1 auto;
}

.panel-flow-selected-panel__row {
  gap: 16px;
  align-items: flex-start;
  padding: 20px 6px 20px 0;
}

.panel-flow-selected-panel__row + .panel-flow-selected-panel__row {
  border-top: 1px solid #edf1f6;
}

.panel-flow-selected-panel__row .panel-flow-mini-avatar {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  font-size: 0.86rem;
}

.panel-flow-selected-panel__copy {
  min-width: 0;
}

.panel-flow-selected-panel__name {
  gap: 8px;
}

.panel-flow-selected-panel__name strong {
  font-size: 1.02rem;
}

.panel-flow-selected-panel__name em {
  padding: 4px 7px;
  border-radius: 8px;
  background: #fff0f6;
  color: #f06aaa;
  font-size: 0.62rem;
  font-style: normal;
  font-weight: 800;
}

.panel-flow-analysis-card--review .panel-flow-member-card__tags {
  gap: 10px;
  margin-top: 12px;
}

.panel-flow-analysis-card--review .panel-flow-member-card__tags span {
  padding: 6px 11px;
  border: 1px solid #e6ecff;
  background: #f2f5ff;
  font-size: 0.72rem;
}

.panel-flow-selected-panel__row button {
  width: 36px;
  height: 36px;
  border: 0;
  padding: 0;
  border-radius: 12px;
  background: transparent;
  color: #a0acc0;
}

.panel-flow-selected-panel__row button:hover {
  background: #f6f8fc;
}

.panel-flow-ai-review {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 28px;
  margin-top: 30px;
  align-items: center;
  flex: 1 1 auto;
}

.panel-flow-ai-review__gauge small {
  display: block;
  color: #9aa4b8;
  font-size: 0.88rem;
  font-weight: 700;
}

.panel-flow-ring {
  position: relative;
  width: 154px;
  height: 154px;
  border-radius: 50%;
  padding: 14px;
  margin-top: 16px;
  box-shadow: none;
}

.panel-flow-ring__inner {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.98);
}

.panel-flow-ring__inner strong {
  color: #25314a;
  font-size: 1.18rem;
  font-weight: 800;
  line-height: 1;
}

.panel-flow-ring__inner span {
  color: #8995aa;
  max-width: 72px;
  font-size: 0.72rem;
  line-height: 1.35;
  text-align: center;
}

.panel-flow-ai-review__list {
  flex: 1;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 14px;
}

.panel-flow-ai-review__list li {
  gap: 8px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-size: 0.96rem;
  font-weight: 600;
  line-height: 1.2;
  box-shadow: none;
}

.panel-flow-ai-review__list li.is-green {
  color: #099455;
}

.panel-flow-ai-review__list li.is-orange {
  color: #f97316;
}

.panel-flow-overall-assessment {
  gap: 12px;
  margin-top: auto;
  padding: 22px 20px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff8fc 0%, #fff2f8 100%);
  box-shadow: none;
}

.panel-flow-overall-assessment span {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  background: #fff;
  color: #f06aaa;
  box-shadow: none;
}

.panel-flow-overall-assessment strong {
  display: block;
  margin-bottom: 4px;
  font-size: 1rem;
}

.panel-flow-overall-assessment p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.45;
}

.panel-flow-analysis-summary {
  gap: 18px;
  padding-top: 20px;
  border-top: 1px solid #edf1f6;
  flex-wrap: wrap;
}

.panel-flow-analysis-summary__meta {
  flex: 0 0 auto;
}

.panel-flow-analysis-summary__chips {
  flex: 1 1 720px;
  justify-content: flex-end;
  margin-top: 0;
}

.panel-flow-analysis-summary__chips span {
  min-height: 40px;
  padding: 0 16px;
  font-size: 0.78rem;
}

.panel-flow-analysis-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 320px);
  align-items: flex-start;
  gap: 22px;
}

.panel-flow-coverage-panel {
  min-width: 0;
}

.panel-flow-recommendations-panel {
  width: auto;
  min-width: 0;
}

.panel-flow-coverage-panel h3,
.panel-flow-recommendations-panel h3 {
  font-size: 0.98rem;
  margin-bottom: 14px;
}

.panel-flow-coverage-table {
  overflow: hidden;
}

.panel-flow-coverage-table__head,
.panel-flow-coverage-row {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 2.05fr) minmax(0, 1fr) minmax(132px, 0.72fr);
  column-gap: 18px;
  padding: 14px 18px;
}

.panel-flow-coverage-table__head {
  align-items: center;
  color: #9aa4b8;
  border-bottom: 1px solid #edf1f6;
}

.panel-flow-coverage-table__head span:first-child,
.panel-flow-coverage-row > *:first-child {
  padding-left: 4px;
}

.panel-flow-coverage-table__head span:last-child,
.panel-flow-coverage-row > *:last-child {
  padding-right: 4px;
}

.panel-flow-coverage-table__head span:last-child {
  text-align: left;
}

.panel-flow-coverage-row {
  align-items: center;
  border-bottom: 1px solid #f0f3f9;
}

.panel-flow-coverage-row:last-child {
  border-bottom: 0;
}

.panel-flow-coverage-area {
  gap: 10px;
  min-width: 0;
}

.panel-flow-coverage-area__icon {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  display: inline-grid;
  place-items: center;
  background: #fff0f7;
  color: #f06aaa;
  flex: 0 0 28px;
}

.panel-flow-coverage-area.is-orange .panel-flow-coverage-area__icon {
  background: #fff4eb;
  color: #f28a2f;
}

.panel-flow-coverage-area strong,
.panel-flow-recommendation-card strong {
  font-size: 0.88rem;
}

.panel-flow-coverage-row p {
  margin: 0;
  color: #6f7a91;
  font-size: 0.8rem;
  line-height: 1.55;
}

.panel-flow-coverage-by {
  gap: 10px;
  min-width: 0;
}

.panel-flow-coverage-by.is-missing {
  align-items: flex-start;
}

.panel-flow-coverage-by strong {
  display: block;
  color: #25314a;
  font-size: 0.82rem;
}

.panel-flow-coverage-by span {
  display: block;
  margin-top: 2px;
  color: #8f9aaf;
  font-size: 0.74rem;
}

.panel-flow-coverage-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 156px;
  padding: 5px 16px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  justify-self: start;
}

.panel-flow-coverage-status.is-green {
  background: #ecfbf1;
  color: #169957;
}

.panel-flow-coverage-status.is-orange {
  background: #fff4eb;
  color: #f28a2f;
}

.panel-flow-recommendation-card {
  padding: 18px;
}

.panel-flow-recommendation-card + .panel-flow-recommendation-card {
  margin-top: 14px;
}

.panel-flow-recommendation-card small {
  margin-bottom: 8px;
}

.panel-flow-recommendation-card.is-critical small {
  color: #f06aaa;
}

.panel-flow-recommendation-card.is-success small {
  color: #18a15d;
}

.panel-flow-recommendation-card__action {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: flex-start;
  gap: 14px;
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #edf1f6;
  border-radius: 14px;
  background: #fff;
}

.panel-flow-recommendation-card button {
  width: 100%;
  min-height: 40px;
  margin-top: 14px;
  border: 1px solid #f0bfd7;
  border-radius: 10px;
  background: #fff;
  color: #ef67ab;
  font-size: 0.76rem;
  font-weight: 800;
  white-space: normal;
  text-align: center;
}

.panel-flow-modal__footer {
  flex-shrink: 0;
  gap: 18px;
  padding: 14px 28px 18px;
  border-top: 1px solid #edf2fb;
  background: #fff;
}

.panel-flow-checkbox {
  gap: 8px;
  color: #58657a;
  font-size: 0.76rem;
}

.panel-flow-checkbox input {
  margin: 0;
}

.panel-flow-modal__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.panel-flow-button {
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 800;
  white-space: nowrap;
}

.panel-flow-button--ghost {
  border-color: #dbe2ee;
  background: #fff;
  color: #47556d;
}

.panel-flow-button--ghost-accent {
  border-color: #f0bfd7;
  background: #fff;
  color: #ef67ab;
}

.panel-flow-button--primary {
  background: linear-gradient(180deg, #f07bbe 0%, #e95aa8 100%);
  color: #fff;
  box-shadow: 0 14px 24px rgba(233, 90, 168, 0.18);
}

.panel-flow-analysis-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 0;
  border-top: 0;
  gap: 16px;
}

.panel-flow-analysis-footer__link {
  border: 0;
  padding: 0;
  background: transparent;
  color: #47556d;
  font-size: 0.82rem;
  font-weight: 800;
}

@media (max-width: 1080px) {
  .panel-flow-recommendation-grid,
  .panel-flow-alternatives__grid,
  .panel-flow-why-grid,
  .panel-flow-analysis-top,
  .panel-flow-analysis-main {
    display: grid;
    grid-template-columns: 1fr;
  }

  .panel-flow-adjustments {
    flex-direction: column;
  }

  .panel-flow-adjustments__members,
  .panel-flow-recommendations-panel {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 760px) {
  .panel-flow-overlay {
    padding: 10px;
  }

  .panel-flow-modal {
    max-height: calc(100vh - 20px);
  }

  .panel-flow-analysis-card--review {
    min-height: auto;
    padding: 22px 18px 18px;
  }

  .panel-flow-modal__head,
  .panel-flow-modal__body,
  .panel-flow-modal__footer {
    padding-left: 14px;
    padding-right: 14px;
  }

  .panel-flow-candidate__identity,
  .panel-flow-candidate__ownership,
  .panel-flow-modal__footer,
  .panel-flow-modal__actions,
  .panel-flow-analysis-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .panel-flow-candidate__ownership article + article {
    padding-left: 0;
    border-left: 0;
  }

  .panel-flow-candidate__name-row strong {
    font-size: 1rem;
  }

  .panel-flow-modal__actions,
  .panel-flow-button,
  .panel-flow-analysis-footer {
    width: 100%;
  }

  .panel-flow-button {
    justify-content: center;
  }

  .panel-flow-coverage-table__head {
    display: none;
  }

  .panel-flow-ai-review {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .panel-flow-analysis-summary__chips {
    justify-content: flex-start;
  }

  .panel-flow-coverage-row {
    display: grid;
    gap: 10px;
  }

  .panel-flow-coverage-row > * {
    width: 100% !important;
  }
}
</style>
