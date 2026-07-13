<script setup>
import { computed, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import SubmitOfferApprovalOverlay from '../shared/SubmitOfferApprovalOverlay.vue'
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
    default: 'Validation',
  },
})

const emit = defineEmits(['back', 'open-source', 'open-offer-details', 'open-offer-package', 'open-review-send', 'open-candidate-profile'])

const job = computed(() => getJobById(props.jobId))
const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const reviewRows = [
  {
    id: 'compensation',
    icon: 'wallet',
    tone: 'pink',
    title: 'Compensation',
    subtitle: 'Base pay, bonus, equity and benefits.',
    meta: ['$145,000'],
    actionLabel: 'Edit section',
    badge: 'AI approved',
    badgeTone: 'green',
  },
  {
    id: 'employment',
    icon: 'briefcase',
    tone: 'violet',
    title: 'Employment',
    subtitle: 'Job title, department, type and location.',
    meta: ['Senior Frontend Developer', 'Engineering', 'San Francisco, CA'],
    actionLabel: 'Edit',
    badge: 'Complete',
    badgeTone: 'green',
  },
  {
    id: 'timeline',
    icon: 'calendar',
    tone: 'blue',
    title: 'Start Date & Timeline',
    subtitle: 'Important dates and milestones.',
    meta: ['Start: Jun 16, 2026', 'Expires: Jun 23, 2026'],
    actionLabel: 'Edit',
    badge: 'Complete',
    badgeTone: 'green',
  },
  {
    id: 'documents',
    icon: 'document',
    tone: 'violet',
    title: 'Documents to be Generated',
    subtitle: 'Offer letter, contracts and other documents.',
    meta: [],
    actionLabel: 'Edit',
    badge: 'Attention',
    badgeTone: 'orange',
    badges: [
      ['4 ready', 'green'],
      ['1 action required', 'orange'],
    ],
  },
  {
    id: 'terms',
    icon: 'document',
    tone: 'violet',
    title: 'Additional Terms',
    subtitle: 'Notice period, probation, benefits and more.',
    meta: ['Notice: 2 weeks', 'Probation: 3 months'],
    actionLabel: 'Edit',
    badge: 'Complete',
    badgeTone: 'green',
  },
  {
    id: 'approvals',
    icon: 'users',
    tone: 'violet',
    title: 'Approval Requirements',
    subtitle: 'Internal approvals needed before sending.',
    meta: [],
    avatars: ['SJ', 'TL', 'HR', '+1'],
    badge: 'In Progress',
    badgeTone: 'orange',
  },
  {
    id: 'notes',
    icon: 'clipboard-check',
    tone: 'violet',
    title: 'Internal Notes',
    subtitle: 'Visible only to internal team.',
    meta: [],
    badge: '2 notes',
    badgeTone: 'violet',
  },
  {
    id: 'conditions',
    icon: 'heart',
    tone: 'pink',
    title: 'Candidate Acceptance Conditions',
    subtitle: 'What the candidate expects and what we\'re offering.',
    meta: [],
    badge: 'Aligned',
    badgeTone: 'green',
  },
  {
    id: 'compliance',
    icon: 'shield',
    tone: 'violet',
    title: 'Offer Compliance',
    subtitle: 'Compliance & policy checks.',
    meta: [],
    badge: 'No issues',
    badgeTone: 'green',
  },
]

const expandedSections = ref({
  compensation: true,
  employment: true,
  timeline: true,
  documents: true,
  terms: true,
  approvals: true,
  notes: true,
  conditions: true,
  compliance: true,
})

const compensationItems = [
  { label: 'Base Salary', value: '$145,000', note: 'Annual base pay', editable: true },
  { label: 'Bonus', value: '12%', note: 'Target annual bonus', editable: true },
  { label: 'Equity (RSUs)', value: '750', note: 'Vests over 4 years', editable: true },
  { label: 'Signing Bonus', value: 'One-time payment', note: '', action: 'Add' },
  { label: 'Benefits Package', value: 'Standard - US', note: 'Health, Vision, 401(k)', editable: true },
]

const employmentItems = [
  { label: 'Job Title', value: 'Senior Frontend Developer' },
  { label: 'Department', value: 'Engineering' },
  { label: 'Reports To', value: 'Thomas Lee' },
  { label: 'Employment Type', value: 'Full-time' },
  { label: 'Work Location', value: 'San Francisco, CA\nHybrid' },
]

const timelineItems = [
  { label: 'Proposed Start Date', value: 'June 16, 2026' },
  { label: 'Offer Expires', value: 'Jun 23, 2026' },
  { label: 'Notice Period', value: '2 weeks' },
  { label: 'Expected Last Day', value: 'May 30, 2026' },
  { label: 'Onboarding Plan', value: 'Jun 17, 2026', actionIcon: true },
]

const documentItems = [
  { label: 'Offer Letter', state: 'Ready', tone: 'green' },
  { label: 'Employment Agreement', state: 'Ready', tone: 'green' },
  { label: 'NDA', state: 'Requires signature', tone: 'orange' },
  { label: 'Benefits Summary', state: 'Ready', tone: 'green' },
  { label: 'Generate Missing', state: '', tone: 'violet', ghost: true },
]

const termItems = [
  { label: 'Notice Period', value: '2 weeks' },
  { label: 'Probation Period', value: '3 months' },
  { label: 'Vacation', value: '30 days / year' },
  { label: 'Relocation', value: 'Included' },
  { label: 'Stock Vesting', value: '4 years', actionIcon: true },
]

const approvalItems = [
  { name: 'Hiring Manager', status: 'Approved', tone: 'green', initials: 'HM' },
  { name: 'HR', status: 'Approved', tone: 'green', initials: 'HR' },
  { name: 'Finance', status: 'Pending', tone: 'orange', initials: 'FN' },
  { name: 'Legal', status: 'Not required', tone: 'slate', initials: 'LG' },
]

const noteItems = [
  'Finance approved salary adjustment of +$3,000.',
  'Manager requested June 16 start date to align with project kickoff.',
]

const conditionItems = [
  { label: 'Expected Salary', state: 'Matched' },
  { label: 'Preferred Start Date', state: 'Matched' },
  { label: 'Remote Preference', state: 'Matched' },
  { label: 'Relocation', state: 'Not required' },
  { label: 'Work Authorization', state: 'Verified' },
]

const complianceItems = [
  { label: 'Salary Band', state: 'Compliant' },
  { label: 'Internal Equity', state: 'Compliant' },
  { label: 'Country Law', state: 'Compliant' },
  { label: 'Company Policy', state: 'Compliant' },
  { label: 'Benefits Policy', state: 'Compliant' },
  { label: 'Budget', state: 'Within range' },
]

const whyAiRows = [
  'Matches candidate expected range ($135K - $145K)',
  'Competitive for Senior Frontend Developer in SF',
  'Aligned with internal pay equity',
  'Within approved budget',
  'Strong interview & assessment feedback',
]

const changesRows = [
  ['Base Salary', '$142,000', '$145,000', '+ $3,000', 'green'],
  ['Bonus', '10%', '12%', '+ 2%', 'green'],
  ['Equity (RSUs)', '1,000', '750', '- 250', 'red'],
  ['Benefits', 'Standard', 'Standard', 'No change', 'slate'],
]

const overallImpactRows = [
  ['Acceptance', '+3%', 'positive'],
  ['Level', 'P62 → P67', 'neutral'],
  ['Budget', 'Within range', 'approved'],
]

const workflowRows = [
  ['TL', 'Thomas Lee', 'Hiring Manager', 'Approved', 'Yesterday, 2:25 PM', 'green'],
  ['SC', 'Sarah Chen', 'HR Director', 'Pending', 'Waiting for approval', 'orange'],
  ['MA', 'Michael Adams', 'Finance Director', 'Pending', 'Waiting for approval', 'orange'],
  ['LT', 'Legal Team', 'Legal', 'Not required', '', 'slate'],
]

const historyRows = [
  ['AI Recommended', '$142,000', 'May 20, 10:30 AM', ''],
  ['Current Offer', '$145,000', 'May 20, 11:02 AM', '+2.1%'],
]

const approvalOverlayOpen = ref(false)
const approvalSubmitted = ref(false)

function isExpanded(sectionId) {
  return Boolean(expandedSections.value[sectionId])
}

function toggleSection(sectionId) {
  expandedSections.value = {
    ...expandedSections.value,
    [sectionId]: !expandedSections.value[sectionId],
  }
}

function openApprovalOverlay() {
  approvalOverlayOpen.value = true
}

function closeApprovalOverlay() {
  approvalOverlayOpen.value = false
}

function markApprovalSubmitted() {
  approvalSubmitted.value = true
}
</script>

<template>
  <main class="review-ai-offer-page">
    <section class="review-ai-offer-shell">
      <header class="review-ai-offer-card review-ai-offer-header">
        <div class="review-ai-offer-header__title">
          <span class="review-ai-offer-header__mark">
            <AppIcon name="spark" :size="18" />
          </span>
          <div>
            <h1>Review &amp; Edit</h1>
            <p>Review, adjust, and confirm the generated offer before moving to offer details.</p>
          </div>
        </div>

        <div class="review-ai-offer-header__flow">
          <div class="review-ai-offer-steps">
            <button class="review-ai-offer-step" type="button" @click="emit('open-source')">
              <span><AppIcon name="checkCircle" :size="13" /></span>
              <div>
                <strong>Template</strong>
                <small>Senior Frontend Engineer</small>
              </div>
            </button>
            <div class="review-ai-offer-step-line" />
            <button class="review-ai-offer-step" type="button" @click="emit('open-source')">
              <span><AppIcon name="checkCircle" :size="13" /></span>
              <div>
                <strong>AI Mapping</strong>
                <small>97% match</small>
              </div>
            </button>
            <div class="review-ai-offer-step-line" />
            <div class="review-ai-offer-step is-active">
              <span>3</span>
              <div>
                <strong>Review &amp; Edit</strong>
                <small>8 sections</small>
              </div>
            </div>
            <div class="review-ai-offer-step-line" />
            <button class="review-ai-offer-step" type="button" @click="emit('open-offer-details')">
              <span>4</span>
              <div>
                <strong>Offer Details</strong>
                <small>Configure offer details</small>
              </div>
            </button>
            <div class="review-ai-offer-step-line" />
            <button class="review-ai-offer-step" type="button" @click="emit('open-offer-package')">
              <span>5</span>
              <div>
                <strong>Offer Package</strong>
                <small>Documents &amp; experience</small>
              </div>
            </button>
            <div class="review-ai-offer-step-line" />
            <button class="review-ai-offer-step" type="button" @click="emit('open-review-send')">
              <span>6</span>
              <div>
                <strong>Review &amp; Send</strong>
                <small>Final review</small>
              </div>
            </button>
          </div>

          <button class="review-ai-offer-close" type="button" aria-label="Close" @click="emit('back')">
            <AppIcon name="close" :size="18" />
          </button>
        </div>
      </header>

      <section class="review-ai-offer-card review-ai-offer-hero">
        <div class="review-ai-offer-hero__candidate">
          <div class="review-ai-offer-avatar">
            <span>{{ candidateInitials }}</span>
            <i />
          </div>

          <div class="review-ai-offer-profile">
            <div class="review-ai-offer-profile__head">
              <strong>{{ candidateName }}</strong>
              <em>Validated</em>
            </div>
            <span>{{ candidateRole }}</span>
            <div class="review-ai-offer-profile__meta">
              <small><AppIcon name="briefcase" :size="12" /> {{ job.department }}</small>
              <small><AppIcon name="mapPin" :size="12" /> San Francisco, CA</small>
              <small><AppIcon name="user-check" :size="12" /> Full-time</small>
            </div>
            <button class="review-ai-offer-link" type="button" @click="emit('open-candidate-profile')">
              <span>View full profile</span>
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </div>
        </div>

        <div class="review-ai-offer-hero__metrics">
          <article class="review-ai-offer-metric">
            <span>AI confidence</span>
            <div class="review-ai-offer-ring">
              <div class="review-ai-offer-ring__inner"><strong>95%</strong></div>
            </div>
            <small>Very high</small>
          </article>

          <article class="review-ai-offer-metric">
            <span>Salary position</span>
            <strong class="is-primary">P62</strong>
            <small>Above market</small>
          </article>

          <article class="review-ai-offer-metric">
            <span>Acceptance prediction</span>
            <strong class="is-success">94%</strong>
            <small>If sent today</small>
            <svg
              class="review-ai-offer-trend"
              viewBox="0 0 118 48"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 39L34 29L54 29L75 15L95 15L108 8"
                pathLength="100"
              />
              <circle cx="10" cy="39" r="2.5" />
              <circle cx="34" cy="29" r="2.5" />
              <circle cx="54" cy="29" r="2.5" />
              <circle cx="75" cy="15" r="2.5" />
              <circle cx="95" cy="15" r="2.5" />
              <circle cx="108" cy="8" r="3" />
            </svg>
          </article>

          <article class="review-ai-offer-metric is-recommendation">
            <span>Recommendation</span>
            <strong><AppIcon name="checkCircle" :size="14" /> Proceed to offer</strong>
            <small>Strong match</small>
            <div class="review-ai-offer-meta-row">
              <em>Last updated</em>
              <span><AppIcon name="clock" :size="12" /> 2 min ago</span>
            </div>
          </article>
        </div>
      </section>

      <div class="review-ai-offer-main">
        <section class="review-ai-offer-list">
          <article
            v-for="row in reviewRows"
            :key="row.id"
            class="review-ai-offer-card review-ai-offer-row"
            :class="{ 'is-expanded': isExpanded(row.id) }"
          >
            <button class="review-ai-offer-row__summary" type="button" @click="toggleSection(row.id)">
              <div class="review-ai-offer-row__left">
                <span class="review-ai-offer-row__icon" :class="`is-${row.tone}`">
                  <AppIcon :name="row.icon" :size="16" />
                </span>
                <div class="review-ai-offer-row__copy">
                  <div class="review-ai-offer-row__title-line">
                    <strong>{{ row.title }}</strong>
                    <em
                      v-if="isExpanded(row.id) && row.badge && row.id === 'compensation'"
                      class="review-ai-offer-badge"
                      :class="`is-${row.badgeTone}`"
                    >
                      {{ row.badge }}
                    </em>
                  </div>
                  <span>{{ row.subtitle }}</span>
                </div>
              </div>

              <div class="review-ai-offer-row__right">
                <template v-if="isExpanded(row.id)">
                  <button
                    v-if="row.actionLabel"
                    class="review-ai-offer-row__action"
                    type="button"
                    @click.stop
                  >
                    {{ row.actionLabel }}
                  </button>

                  <em
                    v-if="row.badge && row.id !== 'compensation'"
                    class="review-ai-offer-badge"
                    :class="`is-${row.badgeTone}`"
                  >
                    {{ row.badge }}
                  </em>
                </template>

                <div v-else-if="row.avatars" class="review-ai-offer-avatars">
                  <span v-for="avatar in row.avatars" :key="avatar">{{ avatar }}</span>
                </div>

                <div v-else-if="row.meta.length" class="review-ai-offer-row__meta">
                  <span v-for="item in row.meta" :key="item">{{ item }}</span>
                </div>

                <div v-else-if="row.badges" class="review-ai-offer-badges">
                  <em v-for="badge in row.badges" :key="badge[0]" :class="`is-${badge[1]}`">{{ badge[0] }}</em>
                </div>

                <em v-else-if="row.badge" class="review-ai-offer-badge" :class="`is-${row.badgeTone}`">{{ row.badge }}</em>

                <span class="review-ai-offer-row__go" aria-hidden="true">
                  <AppIcon :name="isExpanded(row.id) ? 'chevronUp' : 'chevronRight'" :size="16" />
                </span>
              </div>
            </button>

            <div v-if="isExpanded(row.id)" class="review-ai-offer-row__details">
              <div v-if="row.id === 'compensation'" class="review-ai-offer-detail-grid is-five">
                <article v-for="item in compensationItems" :key="item.label" class="review-ai-offer-detail-cell">
                  <small>{{ item.label }}</small>
                  <strong>{{ item.value }}</strong>
                  <span v-if="item.note">{{ item.note }}</span>
                  <button v-if="item.editable" type="button" class="review-ai-offer-inline-edit">
                    <AppIcon name="edit" :size="12" />
                  </button>
                  <button v-if="item.action" type="button" class="review-ai-offer-inline-add">
                    <AppIcon name="plus" :size="12" />
                    <span>{{ item.action }}</span>
                  </button>
                </article>
              </div>

              <div v-else-if="row.id === 'employment'" class="review-ai-offer-detail-grid is-five">
                <article v-for="item in employmentItems" :key="item.label" class="review-ai-offer-detail-cell">
                  <small>{{ item.label }}</small>
                  <strong class="is-wrap">{{ item.value }}</strong>
                </article>
              </div>

              <div v-else-if="row.id === 'timeline'" class="review-ai-offer-detail-grid is-five">
                <article v-for="item in timelineItems" :key="item.label" class="review-ai-offer-detail-cell">
                  <small>{{ item.label }}</small>
                  <strong>{{ item.value }}</strong>
                  <button v-if="item.actionIcon" type="button" class="review-ai-offer-inline-edit">
                    <AppIcon name="chevronRight" :size="12" />
                  </button>
                </article>
              </div>

              <div v-else-if="row.id === 'documents'" class="review-ai-offer-doc-grid">
                <article
                  v-for="item in documentItems"
                  :key="item.label"
                  class="review-ai-offer-doc-card"
                  :class="{ 'is-ghost': item.ghost }"
                >
                  <span class="review-ai-offer-doc-card__icon" :class="`is-${item.tone}`">
                    <AppIcon :name="item.ghost ? 'plus' : item.tone === 'orange' ? 'alert' : 'checkCircle'" :size="13" />
                  </span>
                  <div>
                    <strong>{{ item.label }}</strong>
                    <small v-if="item.state">{{ item.state }}</small>
                  </div>
                </article>
              </div>

              <div v-else-if="row.id === 'terms'" class="review-ai-offer-detail-grid is-five">
                <article v-for="item in termItems" :key="item.label" class="review-ai-offer-detail-cell">
                  <small>{{ item.label }}</small>
                  <strong>{{ item.value }}</strong>
                  <button v-if="item.actionIcon" type="button" class="review-ai-offer-inline-edit">
                    <AppIcon name="chevronRight" :size="12" />
                  </button>
                </article>
              </div>

              <div v-else-if="row.id === 'approvals'" class="review-ai-offer-approval-grid">
                <article v-for="item in approvalItems" :key="item.name" class="review-ai-offer-approval-cell">
                  <div class="review-ai-offer-approval-cell__head">
                    <span class="review-ai-offer-approval-cell__avatar">{{ item.initials }}</span>
                    <strong>{{ item.name }}</strong>
                  </div>
                  <small :class="`is-${item.tone}`">{{ item.status }}</small>
                </article>
              </div>

              <div v-else-if="row.id === 'notes'" class="review-ai-offer-notes">
                <div class="review-ai-offer-notes__list">
                  <article v-for="item in noteItems" :key="item" class="review-ai-offer-note">
                    <AppIcon name="message" :size="13" />
                    <span>{{ item }}</span>
                  </article>
                </div>
                <button type="button" class="review-ai-offer-link accent">
                  <span>View all notes</span>
                  <AppIcon name="chevronRight" :size="14" />
                </button>
              </div>

              <div v-else-if="row.id === 'conditions'" class="review-ai-offer-condition-grid">
                <article v-for="item in conditionItems" :key="item.label" class="review-ai-offer-condition-cell">
                  <small>{{ item.label }}</small>
                  <strong>
                    <AppIcon name="check" :size="12" />
                    <span>{{ item.state }}</span>
                  </strong>
                </article>
              </div>

              <div v-else-if="row.id === 'compliance'" class="review-ai-offer-compliance-grid">
                <article v-for="item in complianceItems" :key="item.label" class="review-ai-offer-compliance-cell">
                  <strong><AppIcon name="checkCircle" :size="12" /> {{ item.label }}</strong>
                  <small>{{ item.state }}</small>
                </article>
              </div>
            </div>
          </article>
        </section>

        <aside class="review-ai-offer-side">
          <article class="review-ai-offer-card review-ai-offer-summary">
            <div class="review-ai-offer-side-head">
              <span><AppIcon name="sparkles" :size="14" /> AI Executive Summary</span>
            </div>
            <p>We analyzed 20+ data points to create a competitive and fair offer.</p>

            <div class="review-ai-offer-summary__rows">
              <div>
                <span><AppIcon name="checkCircle" :size="12" /> Estimated acceptance</span>
                <strong class="review-ai-offer-mini-ring">88%</strong>
              </div>
              <div>
                <span><AppIcon name="trend-up" :size="12" /> Negotiation risk</span>
                <strong>Low (22% chance)</strong>
              </div>
              <div>
                <span><AppIcon name="users" :size="12" /> Approval required</span>
                <strong>3 people</strong>
              </div>
              <div>
                <span><AppIcon name="clock" :size="12" /> Time to review</span>
                <strong>~2 min</strong>
              </div>
            </div>
          </article>

          <article class="review-ai-offer-card review-ai-offer-why">
            <div class="review-ai-offer-panel-title">
              <h3>Why AI created this offer</h3>
              <em>Strong match</em>
            </div>

            <div class="review-ai-offer-checks">
              <div v-for="item in whyAiRows" :key="item">
                <AppIcon name="checkCircle" :size="13" />
                <span>{{ item }}</span>
              </div>
            </div>

            <button class="review-ai-offer-link accent" type="button">
              <span>View full AI insights</span>
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </article>

          <article class="review-ai-offer-card review-ai-offer-changes">
            <div class="review-ai-offer-panel-title is-spread">
              <h3>Changes from AI Recommendation</h3>
              <button type="button">View comparison</button>
            </div>

            <div class="review-ai-offer-changes__table">
              <div class="review-ai-offer-changes__head">
                <span>Component</span>
                <span>AI offer</span>
                <span>Your offer</span>
                <span>Impact</span>
              </div>

              <div
                v-for="row in changesRows"
                :key="row[0]"
                class="review-ai-offer-changes__row"
              >
                <strong>{{ row[0] }}</strong>
                <span>{{ row[1] }}</span>
                <span>{{ row[2] }}</span>
                <em :class="`is-${row[4]}`">{{ row[3] }}</em>
              </div>
            </div>
          </article>

          <article class="review-ai-offer-card review-ai-offer-impact">
            <h3>Overall Impact</h3>
            <div class="review-ai-offer-impact__grid">
              <div v-for="row in overallImpactRows" :key="row[0]" class="review-ai-offer-impact__cell">
                <span>{{ row[0] }}</span>
                <strong :class="`is-${row[2]}`">{{ row[1] }}</strong>
              </div>
            </div>
          </article>

          <article class="review-ai-offer-card review-ai-offer-workflow">
            <div class="review-ai-offer-panel-title is-spread">
              <h3>Approval Workflow</h3>
              <button type="button">View policy</button>
            </div>
            <p>3 of 4 approvals required</p>

            <div class="review-ai-offer-workflow__list">
              <article
                v-for="row in workflowRows"
                :key="row[1]"
                class="review-ai-offer-workflow__item"
              >
                <span class="review-ai-offer-workflow__dot" :class="`is-${row[5]}`" />
                <span class="review-ai-offer-workflow__avatar">{{ row[0] }}</span>
                <div class="review-ai-offer-workflow__copy">
                  <strong>{{ row[1] }}</strong>
                  <small>{{ row[2] }}</small>
                </div>
                <div class="review-ai-offer-workflow__status">
                  <strong :class="`is-${row[5]}`">{{ row[3] }}</strong>
                  <small v-if="row[4]">{{ row[4] }}</small>
                </div>
              </article>
            </div>
          </article>

          <article class="review-ai-offer-card review-ai-offer-history">
            <div class="review-ai-offer-panel-title is-spread">
              <h3>Offer History</h3>
              <button type="button">View full history</button>
            </div>

            <div class="review-ai-offer-history__grid">
              <article
                v-for="row in historyRows"
                :key="row[0]"
                class="review-ai-offer-history__card"
                :class="{ 'is-current': row[0] === 'Current Offer' }"
              >
                <span>{{ row[0] }}</span>
                <strong>{{ row[1] }}</strong>
                <small>{{ row[2] }}</small>
                <em v-if="row[3]">{{ row[3] }}</em>
              </article>
            </div>

            <div class="review-ai-offer-history__reason">
              <span>Reason for change</span>
              <strong>Market adjustment &amp; manager feedback</strong>
            </div>
          </article>
        </aside>
      </div>

      <footer class="review-ai-offer-footer">
        <div class="review-ai-offer-footer__actions">
          <button class="review-ai-offer-button" type="button" @click="emit('back')">Cancel</button>
          <button class="review-ai-offer-button" type="button">Save draft</button>
        </div>

        <div class="review-ai-offer-footer__status">
          <AppIcon name="checkCircle" :size="14" />
          <span>All changes saved</span>
        </div>

        <div class="review-ai-offer-footer__actions is-end">
          <button class="review-ai-offer-button is-outline" type="button" @click="openApprovalOverlay">
            <AppIcon name="share" :size="14" />
            <span>Submit for approval</span>
          </button>
          <button class="review-ai-offer-button is-primary" type="button" @click="emit('open-offer-details')">
            <span>Next: Offer Details</span>
            <AppIcon name="chevronRight" :size="15" />
          </button>
        </div>
      </footer>
    </section>

    <SubmitOfferApprovalOverlay
      :open="approvalOverlayOpen"
      :submitted="approvalSubmitted"
      :candidate-name="candidateName"
      :candidate-role="candidateRole"
      :department="job.department"
      :location="job.location"
      @close="closeApprovalOverlay"
      @submitted="markApprovalSubmitted"
    />
  </main>
</template>

<style>
.review-ai-offer-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(255, 73, 157, 0.08), transparent 24%),
    linear-gradient(180deg, #fff8fc 0%, #fff 100%);
}

.review-ai-offer-shell {
  width: min(100%, 1540px);
  margin: 0 auto;
  padding: 18px 20px 22px;
}

.review-ai-offer-card {
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 34px rgba(255, 70, 146, 0.06);
}

.review-ai-offer-header {
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22px;
}

.review-ai-offer-header__title {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.review-ai-offer-header__mark {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: linear-gradient(180deg, #fff4fa 0%, #ffeef7 100%);
}

.review-ai-offer-header h1,
.review-ai-offer-panel-title h3,
.review-ai-offer-why h3,
.review-ai-offer-changes h3,
.review-ai-offer-impact h3,
.review-ai-offer-workflow h3,
.review-ai-offer-history h3 {
  margin: 0;
  color: #1d2b49;
}

.review-ai-offer-header h1 {
  font-size: 1.18rem;
  font-weight: 800;
}

.review-ai-offer-header p,
.review-ai-offer-summary p {
  margin: 5px 0 0;
  color: #8692a9;
  font-size: 0.88rem;
  line-height: 1.45;
}

.review-ai-offer-header__flow {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  gap: 16px;
}

.review-ai-offer-steps {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
}

.review-ai-offer-step {
  position: relative;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  min-width: 126px;
  color: #8f9ab0;
  font-size: 0.82rem;
  font-weight: 800;
  flex: 0 0 auto;
}

.review-ai-offer-step strong {
  white-space: nowrap;
}

.review-ai-offer-step span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f4f6fb;
  box-shadow: inset 0 0 0 1px #dfe4ef;
}

.review-ai-offer-step.is-active {
  color: #1d2b49;
  position: relative;
}

.review-ai-offer-step.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -12px;
  width: 112px;
  height: 3px;
  border-radius: 999px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #ff4098 0%, #ff1f7c 100%);
}

.review-ai-offer-step.is-active span {
  color: #fff;
  background: linear-gradient(180deg, #ff4098 0%, #ff1f7c 100%);
  box-shadow: none;
}

.review-ai-offer-step-line {
  width: 24px;
  height: 1px;
  background: #dfe4ef;
  flex: 0 0 auto;
}

.review-ai-offer-steps::-webkit-scrollbar {
  display: none;
}

.review-ai-offer-close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  color: #7f8ba2;
  background: transparent;
}

.review-ai-offer-hero {
  margin-top: 16px;
  padding: 20px 22px;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 2fr);
  gap: 18px;
}

.review-ai-offer-hero__candidate {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.review-ai-offer-avatar {
  position: relative;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #644019;
  background: linear-gradient(180deg, #ffe1c5 0%, #ffc58f 100%);
  font-size: 1.7rem;
  font-weight: 800;
}

.review-ai-offer-avatar i {
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #10b981;
}

.review-ai-offer-profile__head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-ai-offer-profile__head strong {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1d2b49;
}

.review-ai-offer-profile__head em {
  padding: 4px 10px;
  border-radius: 999px;
  color: #12a86c;
  background: #eaf9f1;
  font-style: normal;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
}

.review-ai-offer-profile > span {
  display: block;
  margin-top: 6px;
  color: #445470;
  font-size: 0.98rem;
  font-weight: 600;
}

.review-ai-offer-profile__meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.review-ai-offer-profile__meta small,
.review-ai-offer-metric span,
.review-ai-offer-metric small,
.review-ai-offer-row__copy span,
.review-ai-offer-row__meta span,
.review-ai-offer-summary__rows span,
.review-ai-offer-changes__head span {
  color: #8190a8;
  font-size: 0.8rem;
}

.review-ai-offer-profile__meta small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.review-ai-offer-link {
  margin-top: 16px;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #5442ff;
  font-size: 0.88rem;
  font-weight: 800;
}

.review-ai-offer-link.accent {
  color: #ff2d87;
}

.review-ai-offer-hero__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;
  border-left: 1px solid #edf1f8;
}

.review-ai-offer-metric {
  padding: 0 28px;
  display: grid;
  align-content: start;
  gap: 10px;
}

.review-ai-offer-metric + .review-ai-offer-metric {
  border-left: 1px solid #edf1f8;
}

.review-ai-offer-metric span {
  margin-top: 2px;
  text-transform: uppercase;
  font-weight: 800;
}

.review-ai-offer-ring {
  width: 76px;
  height: 76px;
  padding: 6px;
  border-radius: 50%;
  background: conic-gradient(#ff3f97 0 342deg, #ffe7f2 342deg 360deg);
}

.review-ai-offer-ring__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.review-ai-offer-ring__inner strong,
.review-ai-offer-metric strong.is-primary,
.review-ai-offer-metric strong.is-success {
  font-size: 1.12rem;
  font-weight: 800;
}

.review-ai-offer-metric strong.is-primary {
  color: #3432d5;
}

.review-ai-offer-metric strong.is-success,
.review-ai-offer-metric.is-recommendation strong {
  color: #10a76a;
}

.review-ai-offer-trend {
  width: 118px;
  height: 48px;
  margin-top: 4px;
  overflow: visible;
}

.review-ai-offer-trend path {
  stroke: #10a86b;
  stroke-width: 2.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.review-ai-offer-trend circle {
  fill: #10a86b;
}

.review-ai-offer-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.review-ai-offer-meta-row em {
  color: #8d9ab0;
  font-style: normal;
  font-size: 0.78rem;
}

.review-ai-offer-meta-row span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #4b5770;
  font-size: 0.8rem;
  font-weight: 700;
}

.review-ai-offer-main {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 18px;
  align-items: start;
}

.review-ai-offer-list,
.review-ai-offer-side {
  display: grid;
  gap: 12px;
}

.review-ai-offer-row {
  overflow: hidden;
}

.review-ai-offer-row__summary {
  width: 100%;
  min-height: 72px;
  padding: 0 16px;
  border: 0;
  background: transparent;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  text-align: left;
}

.review-ai-offer-row__left,
.review-ai-offer-row__right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.review-ai-offer-row__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.review-ai-offer-row__icon.is-pink {
  color: #ff2d87;
  background: #fff1f8;
}

.review-ai-offer-row__icon.is-violet {
  color: #5b49ff;
  background: #f3f1ff;
}

.review-ai-offer-row__icon.is-blue {
  color: #3b82f6;
  background: #eef6ff;
}

.review-ai-offer-row__copy strong {
  display: block;
  color: #1d2b49;
  font-size: 0.98rem;
  font-weight: 800;
}

.review-ai-offer-row__title-line {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.review-ai-offer-row__copy span {
  display: block;
  margin-top: 3px;
}

.review-ai-offer-row__right {
  margin-left: auto;
  gap: 16px;
}

.review-ai-offer-row__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.review-ai-offer-row__meta span {
  position: relative;
  color: #445470;
  font-size: 0.86rem;
  font-weight: 600;
}

.review-ai-offer-row__meta span + span::before {
  content: '•';
  position: absolute;
  left: -10px;
  color: #a2aec2;
}

.review-ai-offer-badge,
.review-ai-offer-badges em {
  padding: 7px 11px;
  border-radius: 999px;
  font-style: normal;
  font-size: 0.76rem;
  font-weight: 800;
  white-space: nowrap;
}

.review-ai-offer-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-ai-offer-row__action {
  border: 0;
  background: transparent;
  color: #5442ff;
  font-size: 0.8rem;
  font-weight: 800;
}

.review-ai-offer-badge.is-green,
.review-ai-offer-badges em.is-green {
  color: #10a86b;
  background: #ebfaf1;
}

.review-ai-offer-badge.is-orange,
.review-ai-offer-badges em.is-orange {
  color: #f59e0b;
  background: #fff6e8;
}

.review-ai-offer-badge.is-violet {
  color: #5b49ff;
  background: #f3f1ff;
}

.review-ai-offer-row__go {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  color: #7f8ba2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f8faff;
}

.review-ai-offer-avatars {
  display: flex;
  align-items: center;
}

.review-ai-offer-avatars span {
  width: 30px;
  height: 30px;
  margin-left: -8px;
  border: 2px solid #fff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffd8b5 0%, #ffbc82 100%);
  color: #523111;
  font-size: 0.66rem;
  font-weight: 800;
}

.review-ai-offer-summary,
.review-ai-offer-why,
.review-ai-offer-changes,
.review-ai-offer-impact,
.review-ai-offer-workflow,
.review-ai-offer-history {
  padding: 16px 18px 18px;
}

.review-ai-offer-row__details {
  padding: 0 16px 16px;
  border-top: 1px solid #edf1f8;
}

.review-ai-offer-row.is-expanded .review-ai-offer-row__summary {
  min-height: 78px;
}

.review-ai-offer-detail-grid,
.review-ai-offer-doc-grid,
.review-ai-offer-approval-grid,
.review-ai-offer-condition-grid,
.review-ai-offer-compliance-grid {
  display: grid;
  gap: 0;
  margin-top: 16px;
}

.review-ai-offer-detail-grid.is-five,
.review-ai-offer-doc-grid,
.review-ai-offer-approval-grid,
.review-ai-offer-condition-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.review-ai-offer-compliance-grid {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.review-ai-offer-detail-cell,
.review-ai-offer-approval-cell,
.review-ai-offer-condition-cell,
.review-ai-offer-compliance-cell {
  min-height: 86px;
  padding: 10px 14px;
  position: relative;
}

.review-ai-offer-detail-cell + .review-ai-offer-detail-cell,
.review-ai-offer-approval-cell + .review-ai-offer-approval-cell,
.review-ai-offer-condition-cell + .review-ai-offer-condition-cell,
.review-ai-offer-compliance-cell + .review-ai-offer-compliance-cell {
  border-left: 1px solid #edf1f8;
}

.review-ai-offer-detail-cell small,
.review-ai-offer-condition-cell small,
.review-ai-offer-compliance-cell small {
  display: block;
  color: #8d99b0;
  font-size: 0.72rem;
  font-weight: 700;
}

.review-ai-offer-detail-cell strong,
.review-ai-offer-approval-cell strong,
.review-ai-offer-condition-cell strong,
.review-ai-offer-compliance-cell strong {
  display: block;
  margin-top: 10px;
  color: #1d2b49;
  font-size: 0.92rem;
  font-weight: 800;
}

.review-ai-offer-detail-cell strong.is-wrap {
  white-space: pre-line;
}

.review-ai-offer-detail-cell span {
  display: block;
  margin-top: 6px;
  color: #6f7f97;
  font-size: 0.76rem;
}

.review-ai-offer-inline-edit,
.review-ai-offer-inline-add {
  position: absolute;
  right: 12px;
  top: 38px;
  border: 0;
  background: #f7f9ff;
  color: #66748f;
}

.review-ai-offer-inline-edit {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.review-ai-offer-inline-add {
  min-height: 26px;
  padding: 0 8px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #5b49ff;
  font-size: 0.72rem;
  font-weight: 800;
}

.review-ai-offer-doc-card {
  min-height: 78px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  background: #fff;
}

.review-ai-offer-doc-card.is-ghost {
  justify-content: center;
  color: #5b49ff;
  border-style: dashed;
  background: #fbfbff;
}

.review-ai-offer-doc-card__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.review-ai-offer-doc-card__icon.is-green {
  color: #10a86b;
  background: #ebfaf1;
}

.review-ai-offer-doc-card__icon.is-orange {
  color: #f59e0b;
  background: #fff6e8;
}

.review-ai-offer-doc-card__icon.is-violet {
  color: #5b49ff;
  background: #f3f1ff;
}

.review-ai-offer-doc-card strong {
  display: block;
  color: #243351;
  font-size: 0.84rem;
  font-weight: 800;
}

.review-ai-offer-doc-card small {
  display: block;
  margin-top: 3px;
  color: #7f8ca2;
  font-size: 0.74rem;
}

.review-ai-offer-approval-cell__head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-ai-offer-approval-cell__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffd8b5 0%, #ffbc82 100%);
  color: #523111;
  font-size: 0.66rem;
  font-weight: 800;
}

.review-ai-offer-approval-cell small {
  display: inline-block;
  margin-top: 8px;
  font-size: 0.74rem;
  font-weight: 800;
}

.review-ai-offer-approval-cell small.is-green {
  color: #10a86b;
}

.review-ai-offer-approval-cell small.is-orange {
  color: #f59e0b;
}

.review-ai-offer-approval-cell small.is-slate {
  color: #94a1b7;
}

.review-ai-offer-notes {
  margin-top: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
}

.review-ai-offer-notes__list {
  display: grid;
  gap: 10px;
}

.review-ai-offer-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #455472;
  font-size: 0.84rem;
}

.review-ai-offer-note svg {
  margin-top: 2px;
  color: #ff2d87;
}

.review-ai-offer-condition-cell strong,
.review-ai-offer-compliance-cell strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.review-ai-offer-condition-cell strong svg,
.review-ai-offer-compliance-cell strong svg {
  color: #10a86b;
}

.review-ai-offer-side-head,
.review-ai-offer-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-ai-offer-side-head span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1d2b49;
  font-size: 0.98rem;
  font-weight: 800;
}

.review-ai-offer-summary__rows {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.review-ai-offer-summary__rows div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.review-ai-offer-summary__rows span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.review-ai-offer-summary__rows strong {
  color: #263654;
  font-size: 0.86rem;
  font-weight: 800;
  text-align: right;
}

.review-ai-offer-mini-ring {
  min-width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #12a86c;
  box-shadow: inset 0 0 0 3px #12a86c;
}

.review-ai-offer-panel-title {
  justify-content: space-between;
}

.review-ai-offer-panel-title em {
  padding: 6px 10px;
  border-radius: 999px;
  color: #10a86b;
  background: #ebfaf1;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.review-ai-offer-checks {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.review-ai-offer-checks div {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #415170;
  font-size: 0.84rem;
}

.review-ai-offer-checks svg {
  color: #10a86b;
}

.review-ai-offer-panel-title.is-spread button {
  border: 0;
  background: transparent;
  color: #ff2d87;
  font-size: 0.78rem;
  font-weight: 800;
}

.review-ai-offer-workflow p {
  margin: 5px 0 0;
  color: #8692a9;
  font-size: 0.82rem;
}

.review-ai-offer-changes__table {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.review-ai-offer-changes__head,
.review-ai-offer-changes__row {
  display: grid;
  grid-template-columns: minmax(120px, 1.15fr) repeat(3, minmax(0, 1fr));
  gap: 10px;
  align-items: center;
}

.review-ai-offer-changes__head span {
  text-transform: uppercase;
  font-weight: 800;
}

.review-ai-offer-changes__row strong,
.review-ai-offer-changes__row span,
.review-ai-offer-changes__row em {
  color: #263654;
  font-size: 0.82rem;
  font-style: normal;
  font-weight: 700;
}

.review-ai-offer-changes__row em.is-green {
  color: #10a86b;
}

.review-ai-offer-changes__row em.is-red {
  color: #ef4444;
}

.review-ai-offer-changes__row em.is-slate {
  color: #94a1b7;
}

.review-ai-offer-impact__grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.review-ai-offer-impact__cell {
  min-height: 78px;
  padding: 12px 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfcff 0%, #fff 100%);
  box-shadow: inset 0 0 0 1px #edf1f8;
}

.review-ai-offer-impact__cell span,
.review-ai-offer-history__card span,
.review-ai-offer-history__reason span,
.review-ai-offer-workflow__copy small,
.review-ai-offer-workflow__status small {
  display: block;
  color: #8b98ae;
  font-size: 0.76rem;
}

.review-ai-offer-impact__cell strong {
  display: block;
  margin-top: 12px;
  color: #1d2b49;
  font-size: 0.95rem;
  font-weight: 800;
}

.review-ai-offer-impact__cell strong.is-positive,
.review-ai-offer-history__card em {
  color: #10a86b;
}

.review-ai-offer-impact__cell strong.is-approved {
  color: #12a86c;
}

.review-ai-offer-impact__cell strong.is-neutral {
  color: #5b49ff;
}

.review-ai-offer-workflow__list {
  margin-top: 16px;
  display: grid;
  gap: 14px;
}

.review-ai-offer-workflow__item {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.review-ai-offer-workflow__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px #d6ddeb;
}

.review-ai-offer-workflow__dot.is-green {
  background: #10a86b;
  box-shadow: none;
}

.review-ai-offer-workflow__dot.is-orange {
  background: #fff;
  box-shadow: inset 0 0 0 3px #f59e0b;
}

.review-ai-offer-workflow__dot.is-slate {
  background: #fff;
}

.review-ai-offer-workflow__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffd8b5 0%, #ffbc82 100%);
  color: #523111;
  font-size: 0.72rem;
  font-weight: 800;
}

.review-ai-offer-workflow__copy strong,
.review-ai-offer-history__reason strong {
  display: block;
  color: #1d2b49;
  font-size: 0.84rem;
  font-weight: 800;
}

.review-ai-offer-workflow__status {
  text-align: right;
}

.review-ai-offer-workflow__status strong {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
}

.review-ai-offer-workflow__status strong.is-green {
  color: #10a86b;
}

.review-ai-offer-workflow__status strong.is-orange {
  color: #f59e0b;
}

.review-ai-offer-workflow__status strong.is-slate {
  color: #94a1b7;
}

.review-ai-offer-history__grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.review-ai-offer-history__card {
  min-height: 108px;
  padding: 14px;
  border-radius: 16px;
  background: #fff;
  box-shadow: inset 0 0 0 1px #edf1f8;
}

.review-ai-offer-history__card.is-current {
  background: linear-gradient(180deg, #fbfbff 0%, #fff 100%);
  box-shadow: inset 0 0 0 1px #dfddff;
}

.review-ai-offer-history__card strong {
  display: block;
  margin-top: 8px;
  color: #253452;
  font-size: 1.12rem;
  font-weight: 800;
}

.review-ai-offer-history__card small {
  display: block;
  margin-top: 5px;
  color: #8692a9;
  font-size: 0.74rem;
}

.review-ai-offer-history__card em {
  display: inline-block;
  margin-top: 10px;
  font-style: normal;
  font-size: 0.76rem;
  font-weight: 800;
}

.review-ai-offer-history__reason {
  margin-top: 14px;
}

.review-ai-offer-footer {
  margin-top: 18px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: center;
}

.review-ai-offer-footer__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-ai-offer-footer__actions.is-end {
  justify-content: flex-end;
}

.review-ai-offer-footer__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6e7b92;
  font-size: 0.84rem;
  font-weight: 700;
}

.review-ai-offer-button {
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #243351;
  background: #fff;
  box-shadow: inset 0 0 0 1px #dde4ef;
  font-weight: 800;
}

.review-ai-offer-button.is-outline {
  color: #ff2d87;
  background: #fff8fc;
  box-shadow: inset 0 0 0 1px #ffd5e7;
}

.review-ai-offer-button.is-primary {
  min-width: 190px;
  color: #fff;
  background: linear-gradient(180deg, #ff4098 0%, #ff1f7c 100%);
  box-shadow: 0 18px 28px rgba(255, 31, 124, 0.2);
}

@media (max-width: 1380px) {
  .review-ai-offer-hero,
  .review-ai-offer-main,
  .review-ai-offer-footer {
    grid-template-columns: 1fr;
  }

  .review-ai-offer-footer__actions.is-end {
    justify-content: flex-start;
  }
}

@media (max-width: 1080px) {
  .review-ai-offer-hero__metrics {
    grid-template-columns: 1fr 1fr;
    border-left: 0;
  }

  .review-ai-offer-metric:nth-child(3),
  .review-ai-offer-metric:nth-child(4) {
    border-top: 1px solid #edf1f8;
    padding-top: 18px;
  }

  .review-ai-offer-metric:nth-child(3) {
    border-left: 0;
  }
}

@media (max-width: 860px) {
  .review-ai-offer-shell {
    padding: 14px 12px 20px;
  }

  .review-ai-offer-header,
  .review-ai-offer-hero,
  .review-ai-offer-row,
  .review-ai-offer-summary,
  .review-ai-offer-why,
  .review-ai-offer-changes,
  .review-ai-offer-impact,
  .review-ai-offer-workflow,
  .review-ai-offer-history {
    padding: 16px;
  }

  .review-ai-offer-header,
  .review-ai-offer-hero {
    display: grid;
  }

  .review-ai-offer-header__flow,
  .review-ai-offer-row,
  .review-ai-offer-row__right {
    justify-content: flex-start;
  }

  .review-ai-offer-hero__metrics,
  .review-ai-offer-changes__head,
  .review-ai-offer-changes__row,
  .review-ai-offer-impact__grid,
  .review-ai-offer-history__grid {
    grid-template-columns: 1fr;
  }

  .review-ai-offer-detail-grid.is-five,
  .review-ai-offer-doc-grid,
  .review-ai-offer-approval-grid,
  .review-ai-offer-condition-grid,
  .review-ai-offer-compliance-grid {
    grid-template-columns: 1fr;
  }

  .review-ai-offer-detail-cell + .review-ai-offer-detail-cell,
  .review-ai-offer-approval-cell + .review-ai-offer-approval-cell,
  .review-ai-offer-condition-cell + .review-ai-offer-condition-cell,
  .review-ai-offer-compliance-cell + .review-ai-offer-compliance-cell {
    border-left: 0;
    border-top: 1px solid #edf1f8;
  }

  .review-ai-offer-notes {
    display: grid;
  }

  .review-ai-offer-workflow__item {
    grid-template-columns: auto auto minmax(0, 1fr);
  }

  .review-ai-offer-workflow__status {
    grid-column: 2 / -1;
    text-align: left;
  }

  .review-ai-offer-metric + .review-ai-offer-metric {
    border-left: 0;
    border-top: 1px solid #edf1f8;
    padding-top: 18px;
  }
}
</style>
