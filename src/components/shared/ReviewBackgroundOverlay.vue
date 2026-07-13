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
  reviewMode: {
    type: String,
    default: 'hybrid',
  },
})

const emit = defineEmits(['close'])

const isManualMode = computed(() => props.reviewMode === 'manual')
const activeFilter = ref('all')
const expandedCheckId = ref('employment')

const progressPercentage = computed(() => (isManualMode.value ? 43 : 58))

const filterTabs = [
  ['all', 'All'],
  ['completed', 'Completed'],
  ['inProgress', 'In progress'],
  ['waiting', 'Waiting'],
  ['notStarted', 'Not started'],
  ['na', 'N/A'],
]

const hybridRequestMeta = [
  { label: 'Request ID', value: 'BC-2025-0521' },
  { label: 'Requested on', value: 'May 12, 2025' },
  { label: 'Method', value: 'Hybrid', tags: [{ label: 'External', count: 4 }, { label: 'Manual', count: 3 }] },
  { label: 'Expected completion', value: 'May 15 - May 19, 2025' },
]

const manualRequestMeta = [
  { label: 'Request ID', value: 'BC-2025-0521' },
  { label: 'Requested on', value: 'May 12, 2025' },
  { label: 'Method', value: 'Manual Verification', note: 'People Operations' },
  { label: 'Expected completion', value: 'May 15 - May 19, 2025' },
]

const statusLabelMap = {
  completed: 'Completed',
  inProgress: 'In progress',
  waiting: 'Waiting',
  notStarted: 'Not started',
  na: 'N/A',
}

const statusToneMap = {
  completed: 'success',
  inProgress: 'violet',
  waiting: 'warning',
  notStarted: 'muted',
  na: 'muted',
}

const externalChecks = [
  {
    id: 'identity',
    title: 'Identity Verification',
    status: 'completed',
    progress: 100,
    date: 'May 12, 2025',
    icon: 'shield',
    actionLabel: 'View details',
  },
  {
    id: 'employment',
    title: 'Employment Verification',
    status: 'inProgress',
    progress: 60,
    date: 'May 13, 2025',
    icon: 'briefcase',
    detailPanel: true,
    checkerFacts: [
      ['Provider', 'Checker'],
      ['Provider request ID', 'CHK-843721'],
      ['Report ID', 'RPT-339201'],
      ['Requested on', 'May 12, 2025'],
      ['Expected by', 'May 15, 2025'],
    ],
    verificationSummary: [
      ['Employer contacted', 'May 12, 2025'],
      ['Information received', 'May 13, 2025'],
      ['Report generated', 'Pending'],
      ['Verification complete', 'Pending'],
    ],
    aiSummary: {
      label: 'Likely to be verified',
      description: 'The employer has confirmed the candidate\'s employment and job title. Dates of employment match the candidate\'s provided information.',
      confidence: '87%',
      verifiedFields: '3 / 4',
    },
    documents: [
      ['Verification Report (Draft)', 'PDF • Generated May 13, 2025'],
      ['Raw Provider Report', 'PDF • Received May 13, 2025'],
    ],
  },
  {
    id: 'criminal',
    title: 'Criminal Records Search',
    status: 'completed',
    progress: 100,
    date: 'May 12, 2025',
    icon: 'document',
    actionLabel: 'View details',
  },
  {
    id: 'watchlist',
    title: 'Global Watchlist',
    status: 'completed',
    progress: 100,
    date: 'May 12, 2025',
    icon: 'alert',
    actionLabel: 'View details',
  },
]

const manualChecks = [
  {
    id: 'education',
    title: 'Education Verification',
    status: 'inProgress',
    date: 'May 13, 2025',
    owner: 'Sarah Johnson',
    icon: 'document',
    actionLabel: 'View details',
  },
  {
    id: 'reference',
    title: 'Reference Check (2 contacts)',
    status: 'waiting',
    date: 'May 12, 2025',
    owner: 'David Miller',
    icon: 'users',
    actionLabel: 'View details',
  },
  {
    id: 'license',
    title: 'Professional License Check',
    status: 'waiting',
    date: 'May 12, 2025',
    owner: 'Lisa Brown',
    icon: 'document',
    actionLabel: 'View details',
  },
]

const documentViewerCatalog = {
  employment: {
    title: 'Verification Documents',
    subtitle: 'Employment Verification',
    provider: 'Checker',
    reportId: 'CHK-394820',
    documents: [
      {
        id: 'employment-report',
        name: 'Employment Verification Report',
        format: 'PDF',
        size: '245 KB',
        timestamp: 'May 12, 2025 - 02:32 PM',
        status: 'Verified',
        preview: {
          reportTitle: 'Employment Verification Report',
          badge: 'VERIFIED',
          badgeNote: 'No discrepancies detected.',
          leftFacts: [
            ['Report ID', 'CHK-394820'],
            ['Completed On', 'May 12, 2025 - 02:32 PM'],
          ],
          candidateSection: [
            ['Full Name', 'Marvin McKinney'],
            ['Date of Birth', 'Apr 12, 1990'],
            ['Email', 'marvin.mckinney@email.com'],
          ],
          employmentSection: [
            ['Company', 'TechNova Inc.'],
            ['Position', 'Senior Frontend Developer'],
            ['Employment Period', 'Mar 2022 - Apr 2024'],
            ['Employment Status', 'Full-time'],
            ['Verification Method', 'HR Department Confirmation'],
          ],
          verifierSection: [
            ['Name', 'Jessica Lee'],
            ['Title', 'HR Manager'],
            ['Email', 'jessica.lee@technova.com'],
            ['Phone', '+1 (415) 555-0198'],
          ],
        },
      },
      { id: 'hr-letter', name: 'HR Confirmation Letter', format: 'DOCX', size: '156 KB', timestamp: 'May 12, 2025 - 02:18 PM', status: 'Verified' },
      { id: 'paystub', name: 'Pay Stub (Mar 2024)', format: 'PDF', size: '312 KB', timestamp: 'May 12, 2025 - 02:10 PM', status: 'Verified' },
      { id: 'offer-letter', name: 'Offer Letter', format: 'PDF', size: '198 KB', timestamp: 'May 12, 2025 - 02:05 PM', status: 'Verified' },
      { id: 'employment-summary', name: 'Employment History Summary', format: 'XLSX', size: '88 KB', timestamp: 'May 12, 2025 - 02:02 PM', status: 'Verified' },
      { id: 'company-site', name: 'Company Website Screenshot', format: 'JPG', size: '420 KB', timestamp: 'May 12, 2025 - 01:58 PM', status: 'Verified' },
    ],
  },
  education: {
    title: 'Verification Documents',
    subtitle: 'Education Verification',
    provider: 'People Operations',
    reportId: 'EDU-502183',
    documents: [
      {
        id: 'diploma',
        name: 'Diploma - University of Washington.pdf',
        format: 'PDF',
        size: '184 KB',
        timestamp: 'May 12, 2025 - 10:15 AM',
        status: 'Verified',
        preview: {
          reportTitle: 'Education Verification Document',
          badge: 'UNDER REVIEW',
          badgeNote: 'Registrar confirmation still in progress.',
          leftFacts: [
            ['Document ID', 'EDU-502183'],
            ['Uploaded On', 'May 12, 2025 - 10:15 AM'],
          ],
          candidateSection: [
            ['Candidate', 'Marvin McKinney'],
            ['Degree', 'Bachelor of Science in Computer Science'],
            ['Graduation', 'May 2022'],
          ],
          employmentSection: [
            ['Institution', 'University of Washington'],
            ['Verification Type', 'Degree and Dates'],
            ['Requested By', 'Sarah Johnson'],
            ['Status', 'Waiting on registrar'],
          ],
          verifierSection: [
            ['Owner', 'People Operations'],
            ['Assigned To', 'Sarah Johnson'],
            ['Last Update', 'May 13, 2025'],
            ['Next Action', 'Follow up with registrar office'],
          ],
        },
      },
      { id: 'transcript', name: 'Academic Transcript.pdf', format: 'PDF', size: '268 KB', timestamp: 'May 12, 2025 - 10:17 AM', status: 'Verified' },
      { id: 'consent-form', name: 'Candidate Consent Form.pdf', format: 'PDF', size: '124 KB', timestamp: 'May 12, 2025 - 10:19 AM', status: 'Verified' },
    ],
  },
}

const manualReviewChecks = [
  {
    id: 'education',
    title: 'Education Verification',
    status: 'inProgress',
    date: 'May 13, 2025',
    due: 'May 13, 2025',
    owner: 'Sarah Johnson',
    icon: 'document',
    detailPanel: true,
    taskOverview: [
      ['Task overview', 'Highest education degree'],
      ['Institution', 'University of Washington'],
      ['Verification type', 'Degree & Dates'],
      ['Candidate provided', 'Bachelor of Science in Computer Science\nMay 2018 - May 2022'],
    ],
    progressChecklist: [
      ['Document received from candidate', 'May 12, 2025'],
      ['Document review', 'May 12, 2025'],
      ['Contact institution', 'In progress'],
      ['Confirm degree & dates', '--'],
      ['Mark as complete', '--'],
    ],
    activity: [
      ['Task created', 'May 12, 2025 9:30 AM'],
      ['Document uploaded by candidate', 'May 12, 2025 10:05 AM'],
      ['Review started by Sarah Johnson', 'May 12, 2025 10:15 AM'],
    ],
    documents: [
      ['Diploma - University of Washington.pdf', 'Uploaded May 12, 2025'],
    ],
    actionItems: [
      ['Send reminder', 'mail'],
      ['Mark as complete', 'checkCircle'],
    ],
    reviewerNotes: [
      'Sarah Johnson - May 12, 2025 11:05 AM',
      'Diploma received. Will contact registrar office to confirm degree and dates.',
    ],
  },
  {
    id: 'employment',
    title: 'Employment Verification (Current)',
    status: 'inProgress',
    date: 'May 14, 2025',
    due: 'May 14, 2025',
    owner: 'David Miller',
    icon: 'briefcase',
    actionLabel: 'View details',
  },
  {
    id: 'reference',
    title: 'Reference Check (2 contacts)',
    status: 'waiting',
    date: 'May 15, 2025',
    due: 'May 15, 2025',
    owner: 'David Miller',
    icon: 'users',
    actionLabel: 'View details',
  },
  {
    id: 'license',
    title: 'Professional License Verification',
    status: 'waiting',
    date: 'May 15, 2025',
    due: 'May 15, 2025',
    owner: 'Lisa Brown',
    icon: 'document',
    actionLabel: 'View details',
  },
  {
    id: 'identity',
    title: 'Identity Document Verification',
    status: 'completed',
    date: 'May 12, 2025',
    due: 'May 12, 2025',
    owner: 'Completed',
    icon: 'shield',
    actionLabel: 'View details',
  },
  {
    id: 'address',
    title: 'Address History Verification',
    status: 'completed',
    date: 'May 12, 2025',
    due: 'May 12, 2025',
    owner: 'Completed',
    icon: 'mapPin',
    actionLabel: 'View details',
  },
]

const nextSteps = [
  {
    id: 'references',
    title: 'Waiting on references',
    description: 'David is waiting for 2 reference responses.',
    actionLabel: 'Send reminder',
    icon: 'clock',
    tone: 'warning',
  },
  {
    id: 'manual',
    title: 'Manual checks in progress',
    description: '2 verification tasks are currently being reviewed.',
    icon: 'refresh',
    tone: 'violet',
  },
  {
    id: 'review',
    title: 'Review & decide',
    description: 'We\'ll notify you when everything is complete.',
    icon: 'checkCircle',
    tone: 'muted',
  },
]

const actionItems = [
  ['Resend candidate consent', 'mail', 'default'],
  ['Add note', 'document', 'default'],
  ['Cancel background check', 'alert', 'danger'],
]

const currentRequestMeta = computed(() => (
  isManualMode.value ? manualRequestMeta : hybridRequestMeta
))

const currentNextSteps = computed(() => (
  isManualMode.value
    ? nextSteps
    : nextSteps
))

const currentActionItems = computed(() => (
  isManualMode.value
    ? [
        ['Add note', 'document', 'default'],
        ['Send general reminder', 'mail', 'default'],
        ['View candidate profile', 'user', 'default'],
        ['Cancel background check', 'alert', 'danger'],
      ]
    : actionItems
))

const documentViewerOpen = ref(false)
const activeDocumentViewerId = ref('employment')
const activeDocumentId = ref('employment-report')

const allChecks = computed(() => (
  isManualMode.value ? manualReviewChecks : [...externalChecks, ...manualChecks]
))

const counts = computed(() => {
  const summary = {
    all: allChecks.value.length,
    completed: 0,
    inProgress: 0,
    waiting: 0,
    notStarted: 0,
    na: 0,
  }

  allChecks.value.forEach((item) => {
    summary[item.status] += 1
  })

  return summary
})

const statusSummaryItems = computed(() => ([
  ['Completed', counts.value.completed, '#22c55e'],
  ['In progress', counts.value.inProgress, '#5b55ff'],
  ['Waiting', counts.value.waiting, '#fb923c'],
  ['Not started', counts.value.notStarted, '#cbd5e1'],
  ['N/A', counts.value.na, '#e2e8f0'],
]))

const summaryRingStyle = computed(() => {
  const total = statusSummaryItems.value.reduce((sum, item) => sum + item[1], 0) || 1
  let current = 0

  const stops = statusSummaryItems.value
    .filter((item) => item[1] > 0)
    .map((item) => {
      const start = (current / total) * 360
      current += item[1]
      const end = (current / total) * 360
      return `${item[2]} ${start}deg ${end}deg`
    })
    .join(', ')

  return {
    background: `conic-gradient(${stops || '#e2e8f0 0deg 360deg'})`,
  }
})

const visibleExternalChecks = computed(() => externalChecks.filter(matchesFilter))
const visibleManualChecks = computed(() => manualChecks.filter(matchesFilter))
const visibleManualReviewChecks = computed(() => manualReviewChecks.filter(matchesFilter))
const activeDocumentViewer = computed(() => (
  documentViewerCatalog[activeDocumentViewerId.value] ?? documentViewerCatalog.employment
))
const activeDocument = computed(() => (
  activeDocumentViewer.value.documents.find((item) => item.id === activeDocumentId.value)
  ?? activeDocumentViewer.value.documents[0]
))

const candidateInitials = computed(() => getInitials(props.candidateName || 'Marvin McKinney'))

function matchesFilter(item) {
  if (activeFilter.value === 'all') {
    return true
  }

  return item.status === activeFilter.value
}

function filterCount(filterId) {
  return counts.value[filterId]
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function isExpanded(checkId) {
  return expandedCheckId.value === checkId
}

function toggleExpandedCheck(checkId) {
  expandedCheckId.value = expandedCheckId.value === checkId ? '' : checkId
}

function openDocumentViewer(checkId, documentLabel = '') {
  const nextViewerId = documentViewerCatalog[checkId] ? checkId : 'employment'
  const nextViewer = documentViewerCatalog[nextViewerId]
  const matchingDocument = nextViewer.documents.find((item) => item.name === documentLabel)

  activeDocumentViewerId.value = nextViewerId
  activeDocumentId.value = matchingDocument?.id ?? nextViewer.documents[0]?.id ?? ''
  documentViewerOpen.value = true
}

function closeDocumentViewer() {
  documentViewerOpen.value = false
}

function closeOverlay() {
  closeDocumentViewer()
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

      if (isOpen) {
        activeFilter.value = 'all'
        expandedCheckId.value = isManualMode.value ? 'education' : 'employment'
        closeDocumentViewer()
      }
    },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="review-background-overlay" @click.self="closeOverlay">
      <section class="review-background-modal">
        <header class="review-background-head">
          <div class="review-background-head__title">
            <div>
              <div class="review-background-head__label">
                <h2>Background Verification</h2>
                <span>In progress</span>
              </div>
              <p>Track and review the progress of {{ candidateName }}'s background verification.</p>
            </div>
          </div>

          <div class="review-background-head__actions">
            <button type="button" class="review-background-ghost-button">
              <AppIcon name="document" :size="14" />
              <span>Download all</span>
            </button>
            <button type="button" class="review-background-ghost-button">
              <AppIcon name="document" :size="14" />
              <span>Add note</span>
            </button>
            <button type="button" class="review-background-icon-button" aria-label="More actions">
              <AppIcon name="more" :size="16" />
            </button>
            <button type="button" class="review-background-icon-button" aria-label="Close review background" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="review-background-body">
          <div class="review-background-layout">
            <main class="review-background-main">
              <section class="review-background-card review-background-candidate">
                <div class="review-background-candidate__identity">
                  <span class="review-background-avatar">{{ candidateInitials }}</span>

                  <div class="review-background-candidate__copy">
                    <strong>{{ candidateName }}</strong>
                    <p>{{ candidateRole }}</p>
                    <span>Software Engineering</span>
                    <button type="button" class="review-background-inline-link">
                      View candidate profile
                      <AppIcon name="external-link" :size="13" />
                    </button>
                  </div>
                </div>

                <div class="review-background-candidate__meta">
                  <div>
                    <small>{{ currentRequestMeta[0].label }}</small>
                    <strong>{{ currentRequestMeta[0].value }}</strong>
                  </div>
                  <div>
                    <small>{{ currentRequestMeta[1].label }}</small>
                    <strong>{{ currentRequestMeta[1].value }}</strong>
                  </div>
                  <div>
                    <small>{{ currentRequestMeta[2].label }}</small>
                    <strong>{{ currentRequestMeta[2].value }}</strong>
                    <div v-if="currentRequestMeta[2].tags" class="review-background-method-tags">
                      <span v-for="item in currentRequestMeta[2].tags" :key="item.label" :class="{ 'is-manual': item.label === 'Manual' }">
                        {{ item.label }} ({{ item.count }})
                      </span>
                    </div>
                    <p v-else-if="currentRequestMeta[2].note" class="review-background-method-note">{{ currentRequestMeta[2].note }}</p>
                  </div>
                  <div>
                    <small>{{ currentRequestMeta[3].label }}</small>
                    <strong>{{ currentRequestMeta[3].value }}</strong>
                  </div>
                </div>
              </section>

              <section class="review-background-card review-background-progress">
                <div class="review-background-progress__head">
                  <div>
                    <h3>Overall progress</h3>
                  </div>
                  <strong>{{ progressPercentage }}% completed</strong>
                </div>

                <div class="review-background-progress__bar">
                  <span :style="{ width: `${progressPercentage}%` }" />
                </div>

                <div class="review-background-progress__stats">
                  <article v-for="item in statusSummaryItems" :key="item[0]">
                    <strong>{{ item[1] }}</strong>
                    <small>{{ item[0] }}</small>
                  </article>
                </div>
              </section>

              <section class="review-background-filters">
                <button
                  v-for="tab in filterTabs"
                  :key="tab[0]"
                  type="button"
                  :class="{ 'is-active': activeFilter === tab[0] }"
                  @click="activeFilter = tab[0]"
                >
                  {{ tab[1] }} <small>({{ filterCount(tab[0]) }})</small>
                </button>
              </section>

              <section v-if="!isManualMode" class="review-background-card review-background-section">
                <div class="review-background-section__head">
                  <strong>External checks (via Checker)</strong>
                  <span>{{ externalChecks.length }}</span>
                </div>

                <div class="review-background-check-list">
                  <article
                    v-for="check in visibleExternalChecks"
                    :key="check.id"
                    class="review-background-check"
                    :class="{ 'is-expanded': isExpanded(check.id) }"
                  >
                    <div class="review-background-check__row">
                      <div class="review-background-check__identity">
                        <span class="review-background-check__icon" :class="`is-${statusToneMap[check.status]}`">
                          <AppIcon :name="check.icon" :size="14" />
                        </span>

                        <div>
                          <strong>{{ check.title }}</strong>
                        </div>
                      </div>

                      <span class="review-background-status-chip" :class="`is-${statusToneMap[check.status]}`">
                        {{ statusLabelMap[check.status] }}
                      </span>

                      <strong class="review-background-check__percent">{{ check.progress }}%</strong>

                      <div class="review-background-check__track">
                        <span :class="`is-${statusToneMap[check.status]}`" :style="{ width: `${check.progress}%` }" />
                      </div>

                      <small class="review-background-check__date">{{ check.date }}</small>

                      <div class="review-background-check__actions">
                        <button
                          v-if="check.detailPanel"
                          type="button"
                          class="review-background-mini-button"
                          @click="toggleExpandedCheck(check.id)"
                        >
                          {{ isExpanded(check.id) ? 'Hide details' : 'View details' }}
                        </button>
                        <button
                          v-else
                          type="button"
                          class="review-background-mini-button"
                        >
                          {{ check.actionLabel }}
                        </button>
                        <button
                          v-if="check.detailPanel"
                          type="button"
                          class="review-background-mini-icon"
                          :aria-label="isExpanded(check.id) ? 'Collapse details' : 'Expand details'"
                          @click="toggleExpandedCheck(check.id)"
                        >
                          <AppIcon :name="isExpanded(check.id) ? 'chevronUp' : 'chevronDown'" :size="14" />
                        </button>
                      </div>
                    </div>

                    <div v-if="check.detailPanel && isExpanded(check.id)" class="review-background-check__details">
                      <div class="review-background-detail-grid">
                        <section class="review-background-detail-card">
                          <strong>Integrated via Checker</strong>
                          <dl>
                            <div v-for="item in check.checkerFacts" :key="`${check.id}-${item[0]}`">
                              <dt>{{ item[0] }}</dt>
                              <dd>{{ item[1] }}</dd>
                            </div>
                          </dl>
                        </section>

                        <section class="review-background-detail-card">
                          <strong>Verification summary</strong>
                          <ul class="review-background-detail-list">
                            <li v-for="item in check.verificationSummary" :key="`${check.id}-${item[0]}`">
                              <span>{{ item[0] }}</span>
                              <strong>{{ item[1] }}</strong>
                            </li>
                          </ul>
                        </section>

                        <section class="review-background-detail-card">
                          <div class="review-background-detail-card__head">
                            <strong>AI summary (from provider report)</strong>
                            <span>Beta</span>
                          </div>
                          <em>{{ check.aiSummary.label }}</em>
                          <p>{{ check.aiSummary.description }}</p>
                          <div class="review-background-score-row">
                            <span>Confidence score</span>
                            <strong>{{ check.aiSummary.confidence }}</strong>
                          </div>
                          <div class="review-background-score-row">
                            <span>Verified fields</span>
                            <strong>{{ check.aiSummary.verifiedFields }}</strong>
                          </div>
                        </section>

                        <section class="review-background-detail-card">
                          <strong>Documents</strong>
                          <div class="review-background-document-list">
                            <article v-for="item in check.documents" :key="`${check.id}-${item[0]}`">
                              <div>
                                <strong>{{ item[0] }}</strong>
                                <small>{{ item[1] }}</small>
                              </div>
                              <button type="button" @click="openDocumentViewer(check.id, item[0])">View document</button>
                            </article>
                          </div>
                        </section>
                      </div>

                      <div class="review-background-detail-actions">
                        <span>Actions</span>
                        <div>
                          <button type="button" class="review-background-text-link">
                            Open in Checker
                            <AppIcon name="external-link" :size="12" />
                          </button>
                          <button type="button" class="review-background-text-link">
                            Download provider report
                            <AppIcon name="document" :size="12" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </section>

              <section v-if="!isManualMode" class="review-background-card review-background-section">
                <div class="review-background-section__head">
                  <strong>Manual checks (People Operations)</strong>
                  <span>{{ manualChecks.length }}</span>
                </div>

                <div class="review-background-check-list">
                  <article
                    v-for="check in visibleManualChecks"
                    :key="check.id"
                    class="review-background-check review-background-check--manual"
                  >
                    <div class="review-background-check__row">
                      <div class="review-background-check__identity">
                        <span class="review-background-check__icon" :class="`is-${statusToneMap[check.status]}`">
                          <AppIcon :name="check.icon" :size="14" />
                        </span>

                        <div>
                          <strong>{{ check.title }}</strong>
                        </div>
                      </div>

                      <span class="review-background-status-chip" :class="`is-${statusToneMap[check.status]}`">
                        {{ statusLabelMap[check.status] }}
                      </span>

                      <div class="review-background-assignee">
                        <small>Assigned to</small>
                        <strong>{{ check.owner }}</strong>
                      </div>

                      <small class="review-background-check__date">{{ check.date }}</small>

                      <div class="review-background-check__actions">
                        <button type="button" class="review-background-mini-button">
                          {{ check.actionLabel }}
                        </button>
                        <button type="button" class="review-background-mini-icon" aria-label="Expand details">
                          <AppIcon name="chevronDown" :size="14" />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </section>

              <section v-if="isManualMode" class="review-background-card review-background-section">
                <div class="review-background-section__head">
                  <strong>Manual Verification Tasks</strong>
                  <span>{{ manualReviewChecks.length }}</span>
                </div>

                <div class="review-background-check-list">
                  <article
                    v-for="check in visibleManualReviewChecks"
                    :key="check.id"
                    class="review-background-check review-background-check--manual"
                    :class="{ 'is-expanded': check.detailPanel && isExpanded(check.id) }"
                  >
                    <div class="review-background-check__row review-background-check__row--manual-review">
                      <div class="review-background-check__identity">
                        <span class="review-background-check__icon" :class="`is-${statusToneMap[check.status]}`">
                          <AppIcon :name="check.icon" :size="14" />
                        </span>

                        <div>
                          <strong>{{ check.title }}</strong>
                        </div>
                      </div>

                      <span class="review-background-status-chip" :class="`is-${statusToneMap[check.status]}`">
                        {{ statusLabelMap[check.status] }}
                      </span>

                      <div class="review-background-assignee">
                        <small>Assigned to</small>
                        <strong>{{ check.owner }}</strong>
                      </div>

                      <div class="review-background-assignee">
                        <small>Due</small>
                        <strong>{{ check.due }}</strong>
                      </div>

                      <div class="review-background-check__actions">
                        <button
                          type="button"
                          class="review-background-mini-button"
                          @click="check.detailPanel ? toggleExpandedCheck(check.id) : null"
                        >
                          {{ check.detailPanel ? (isExpanded(check.id) ? 'Hide details' : 'View details') : check.actionLabel }}
                        </button>
                        <button
                          type="button"
                          class="review-background-mini-icon"
                          :aria-label="check.detailPanel && isExpanded(check.id) ? 'Collapse details' : 'Expand details'"
                          @click="check.detailPanel ? toggleExpandedCheck(check.id) : null"
                        >
                          <AppIcon :name="check.detailPanel && isExpanded(check.id) ? 'chevronUp' : 'chevronDown'" :size="14" />
                        </button>
                      </div>
                    </div>

                    <div v-if="check.detailPanel && isExpanded(check.id)" class="review-background-check__details">
                      <div class="review-background-manual-detail-grid">
                        <section class="review-background-detail-card">
                          <strong>Task overview</strong>
                          <dl>
                            <div v-for="item in check.taskOverview" :key="`${check.id}-${item[0]}`">
                              <dt>{{ item[0] }}</dt>
                              <dd class="review-background-detail-card__multiline">{{ item[1] }}</dd>
                            </div>
                          </dl>
                          <div class="review-background-manual-note">
                            <strong>{{ check.reviewerNotes[0] }}</strong>
                            <p>{{ check.reviewerNotes[1] }}</p>
                          </div>
                        </section>

                        <section class="review-background-detail-card">
                          <strong>Progress & checklist</strong>
                          <ul class="review-background-detail-list">
                            <li v-for="item in check.progressChecklist" :key="`${check.id}-${item[0]}`">
                              <span>{{ item[0] }}</span>
                              <strong>{{ item[1] }}</strong>
                            </li>
                          </ul>
                        </section>

                        <section class="review-background-detail-card">
                          <strong>Documents</strong>
                          <div class="review-background-document-list">
                            <article v-for="item in check.documents" :key="`${check.id}-${item[0]}`">
                              <div>
                                <strong>{{ item[0] }}</strong>
                                <small>{{ item[1] }}</small>
                              </div>
                              <button type="button" @click="openDocumentViewer(check.id, item[0])">View document</button>
                            </article>
                          </div>

                          <strong class="review-background-manual-subhead">Activity</strong>
                          <ul class="review-background-detail-list">
                            <li v-for="item in check.activity" :key="`${check.id}-${item[0]}`">
                              <span>{{ item[0] }}</span>
                              <strong>{{ item[1] }}</strong>
                            </li>
                          </ul>
                        </section>
                      </div>

                      <div class="review-background-detail-actions">
                        <span>Actions</span>
                        <div>
                          <button
                            v-for="item in check.actionItems"
                            :key="`${check.id}-${item[0]}`"
                            type="button"
                            class="review-background-text-link"
                          >
                            <AppIcon :name="item[1]" :size="12" />
                            {{ item[0] }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </section>

              <footer class="review-background-footnote">
                <span>Last updated: May 13, 2025 at 10:30 AM</span>
              </footer>
            </main>

            <aside class="review-background-sidebar">
              <section class="review-background-card review-background-side-card">
                <h3>Status summary</h3>
                <div class="review-background-ring" :style="summaryRingStyle">
                  <div>
                    <strong>{{ counts.all }}</strong>
                    <small>Total</small>
                  </div>
                </div>

                <ul class="review-background-side-statuses">
                  <li v-for="item in statusSummaryItems" :key="item[0]">
                    <span :style="{ background: item[2] }" />
                    <strong>{{ item[1] }}</strong>
                    <small>{{ item[0] }}</small>
                  </li>
                </ul>
              </section>

              <section class="review-background-card review-background-side-card">
                <h3>What happens next?</h3>
                <div class="review-background-next-list">
                  <article v-for="item in currentNextSteps" :key="item.id">
                    <span class="review-background-next-icon" :class="`is-${item.tone}`">
                      <AppIcon :name="item.icon" :size="12" />
                    </span>
                    <div>
                      <strong>{{ item.title }}</strong>
                      <p>{{ item.description }}</p>
                      <button v-if="item.actionLabel" type="button">{{ item.actionLabel }}</button>
                    </div>
                  </article>
                </div>
              </section>

              <section class="review-background-card review-background-side-card">
                <h3>Actions</h3>
                <div class="review-background-action-list">
                  <button
                    v-for="item in currentActionItems"
                    :key="item[0]"
                    type="button"
                    :class="{ 'is-danger': item[2] === 'danger' }"
                  >
                    <AppIcon :name="item[1]" :size="14" />
                    <span>{{ item[0] }}</span>
                  </button>
                </div>
              </section>

              <section class="review-background-card review-background-side-card review-background-side-card--security">
                <AppIcon name="lock" :size="16" />
                <div>
                  <strong>Secure and confidential</strong>
                  <p>All verification data is encrypted and access is restricted.</p>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="review-background-foot">
          <button type="button" class="review-background-secondary" @click="closeOverlay">Close</button>
          <button type="button" class="review-background-primary">View full report</button>
        </footer>
      </section>

      <div v-if="documentViewerOpen" class="review-background-document-overlay" @click.self="closeDocumentViewer">
        <section class="review-background-document-modal">
          <header class="review-background-document-modal__head">
            <div>
              <h3>{{ activeDocumentViewer.title }}</h3>
              <p>{{ activeDocumentViewer.subtitle }} · Provider: {{ activeDocumentViewer.provider }} · Report ID: {{ activeDocumentViewer.reportId }}</p>
            </div>

            <button type="button" class="review-background-icon-button" aria-label="Close document viewer" @click="closeDocumentViewer">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <div class="review-background-document-modal__body">
            <aside class="review-background-document-sidebar">
              <strong>All Documents ({{ activeDocumentViewer.documents.length }})</strong>
              <p>All documents collected for this verification.</p>

              <div class="review-background-document-sidebar__list">
                <button
                  v-for="item in activeDocumentViewer.documents"
                  :key="item.id"
                  type="button"
                  class="review-background-document-sidebar__item"
                  :class="{ 'is-active': activeDocument?.id === item.id }"
                  @click="activeDocumentId = item.id"
                >
                  <span class="review-background-document-sidebar__icon">
                    <AppIcon name="document" :size="14" />
                  </span>
                  <div>
                    <strong>{{ item.name }}</strong>
                    <small>{{ item.format }} · {{ item.size }}</small>
                    <small>{{ item.timestamp }}</small>
                  </div>
                  <em>{{ item.status }}</em>
                </button>
              </div>

              <div class="review-background-document-sidebar__note">
                <AppIcon name="shield" :size="14" />
                <p>All documents are securely stored and encrypted. Access is logged and monitored.</p>
              </div>
            </aside>

            <main class="review-background-document-preview">
              <div class="review-background-document-preview__toolbar">
                <div>
                  <strong>{{ activeDocument?.name }}</strong>
                  <small>{{ activeDocument?.format }} · {{ activeDocument?.size }}</small>
                </div>

                <div class="review-background-document-preview__actions">
                  <button type="button" class="review-background-ghost-button">
                    <AppIcon name="document" :size="14" />
                    <span>Download</span>
                  </button>
                  <button type="button" class="review-background-icon-button" aria-label="Open in new window">
                    <AppIcon name="external-link" :size="16" />
                  </button>
                  <button type="button" class="review-background-icon-button" aria-label="More document actions">
                    <AppIcon name="more" :size="16" />
                  </button>
                </div>
              </div>

              <div class="review-background-document-preview__sheet">
                <div class="review-background-document-preview__sheet-head">
                  <span class="review-background-document-preview__provider">{{ activeDocumentViewer.provider }}</span>
                  <strong>{{ activeDocument?.preview?.reportTitle ?? activeDocument?.name }}</strong>
                  <div class="review-background-document-preview__status">
                    <strong>{{ activeDocument?.preview?.badge ?? activeDocument?.status }}</strong>
                    <small>{{ activeDocument?.preview?.badgeNote ?? 'No discrepancies detected.' }}</small>
                  </div>
                </div>

                <div class="review-background-document-preview__facts">
                  <div v-for="item in activeDocument?.preview?.leftFacts ?? []" :key="item[0]">
                    <small>{{ item[0] }}</small>
                    <strong>{{ item[1] }}</strong>
                  </div>
                </div>

                <div class="review-background-document-preview__grid">
                  <section>
                    <h4>Candidate Information</h4>
                    <div v-for="item in activeDocument?.preview?.candidateSection ?? []" :key="item[0]">
                      <small>{{ item[0] }}</small>
                      <strong>{{ item[1] }}</strong>
                    </div>
                  </section>

                  <section>
                    <h4>{{ isManualMode ? 'Verification Information' : 'Employment Information' }}</h4>
                    <div v-for="item in activeDocument?.preview?.employmentSection ?? []" :key="item[0]">
                      <small>{{ item[0] }}</small>
                      <strong>{{ item[1] }}</strong>
                    </div>
                  </section>

                  <section class="is-full">
                    <h4>Verifier Information</h4>
                    <div class="review-background-document-preview__grid is-compact">
                      <div v-for="item in activeDocument?.preview?.verifierSection ?? []" :key="item[0]">
                        <small>{{ item[0] }}</small>
                        <strong>{{ item[1] }}</strong>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </main>
          </div>

          <footer class="review-background-document-modal__foot">
            <div class="review-background-document-modal__footnote">
              <AppIcon name="shield" :size="14" />
              <span>This report has been generated by {{ activeDocumentViewer.provider }} and is considered the official source.</span>
            </div>
            <button type="button" class="review-background-secondary" @click="closeDocumentViewer">Close</button>
          </footer>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.review-background-overlay {
  position: fixed;
  inset: 0;
  z-index: 2200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(3px);
}

.review-background-modal {
  width: min(1460px, calc(100vw - 40px));
  max-height: calc(100vh - 24px);
  display: flex;
  flex-direction: column;
  border: 1px solid #e4eaf8;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 34px 90px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.review-background-head,
.review-background-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid #edf1fa;
}

.review-background-foot {
  border-top: 1px solid #edf1fa;
  border-bottom: 0;
}

.review-background-head__label,
.review-background-head__actions,
.review-background-check__row,
.review-background-check__identity,
.review-background-check__actions,
.review-background-detail-card__head,
.review-background-detail-actions,
.review-background-detail-actions div,
.review-background-foot,
.review-background-side-card--security {
  display: flex;
  align-items: center;
}

.review-background-head__label {
  gap: 10px;
}

.review-background-head__label h2 {
  margin: 0;
  font-size: 1.65rem;
  font-weight: 800;
  color: #243454;
}

.review-background-head__label span {
  padding: 5px 10px;
  border-radius: 999px;
  background: #eafbf2;
  color: #16a34a;
  font-size: 0.75rem;
  font-weight: 700;
}

.review-background-head p {
  margin: 4px 0 0;
  color: #7f8ca8;
  font-size: 0.88rem;
}

.review-background-head__actions {
  gap: 8px;
}

.review-background-ghost-button,
.review-background-icon-button,
.review-background-mini-button,
.review-background-mini-icon,
.review-background-document-list button,
.review-background-next-list button,
.review-background-action-list button,
.review-background-secondary,
.review-background-primary {
  border: 1px solid #dfe6f5;
  background: #fff;
  font: inherit;
  cursor: pointer;
}

.review-background-ghost-button,
.review-background-icon-button,
.review-background-mini-button,
.review-background-text-link,
.review-background-document-list button,
.review-background-next-list button,
.review-background-action-list button,
.review-background-secondary,
.review-background-primary,
.review-background-inline-link {
  transition: 160ms ease;
}

.review-background-ghost-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  color: #334155;
}

.review-background-icon-button,
.review-background-mini-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: #64748b;
}

.review-background-mini-icon {
  width: 34px;
  height: 34px;
}

.review-background-body {
  flex: 1;
  overflow: auto;
  background:
    radial-gradient(circle at top left, rgba(255, 92, 168, 0.06), transparent 18%),
    linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

.review-background-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.78fr) 310px;
  gap: 18px;
  padding: 18px 20px 22px;
}

.review-background-main,
.review-background-sidebar,
.review-background-check-list,
.review-background-progress__stats,
.review-background-detail-grid,
.review-background-document-list,
.review-background-next-list,
.review-background-action-list {
  display: grid;
  gap: 14px;
}

.review-background-card {
  border: 1px solid #e7ecf8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.04);
}

.review-background-candidate {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(520px, 1.25fr);
  gap: 18px;
  padding: 18px;
}

.review-background-candidate__identity {
  display: flex;
  gap: 14px;
  align-items: center;
}

.review-background-avatar {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1f2937 0%, #64748b 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
}

.review-background-candidate__copy strong {
  display: block;
  color: #243454;
  font-size: 1rem;
}

.review-background-candidate__copy p,
.review-background-candidate__copy span {
  display: block;
  margin: 3px 0 0;
  color: #7c8aa8;
  font-size: 0.84rem;
}

.review-background-method-note {
  margin: 6px 0 0;
  color: #f97316;
  font-size: 0.73rem;
  font-weight: 700;
}

.review-background-inline-link,
.review-background-text-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5b55ff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.review-background-candidate__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.review-background-candidate__meta small,
.review-background-detail-card dt,
.review-background-assignee small {
  display: block;
  margin-bottom: 4px;
  color: #98a5bf;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.review-background-candidate__meta strong,
.review-background-assignee strong {
  color: #243454;
  font-size: 0.86rem;
}

.review-background-method-tags {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.review-background-method-tags span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #efecff;
  color: #5b55ff;
  font-size: 0.72rem;
  font-weight: 700;
}

.review-background-method-tags span.is-manual {
  background: #fff2e8;
  color: #f97316;
}

.review-background-progress {
  padding: 16px 18px;
}

.review-background-progress__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.review-background-progress__head h3,
.review-background-section__head strong,
.review-background-side-card h3 {
  margin: 0;
  color: #243454;
  font-size: 0.92rem;
}

.review-background-progress__head strong {
  color: #94a3b8;
  font-size: 0.8rem;
}

.review-background-progress__bar {
  height: 6px;
  margin-top: 14px;
  border-radius: 999px;
  background: #edf2fb;
  overflow: hidden;
}

.review-background-progress__bar span {
  display: block;
  width: 58%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #5b55ff 0%, #5b55ff 40%, #fb923c 100%);
}

.review-background-progress__stats {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-top: 14px;
}

.review-background-progress__stats article {
  padding-top: 10px;
  border-top: 1px solid #f1f5fb;
}

.review-background-progress__stats strong {
  display: block;
  color: #243454;
  font-size: 1.15rem;
}

.review-background-progress__stats small {
  color: #94a3b8;
  font-size: 0.75rem;
}

.review-background-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.review-background-filters button {
  height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #7c8aa8;
  font: inherit;
  font-size: 0.81rem;
  font-weight: 700;
  cursor: pointer;
}

.review-background-filters button small {
  color: #a3afc7;
}

.review-background-filters button.is-active {
  color: #5b55ff;
  background: #f3f1ff;
}

.review-background-section {
  padding: 14px;
}

.review-background-section__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.review-background-section__head span {
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f1ff;
  color: #5b55ff;
  font-size: 0.72rem;
  font-weight: 800;
}

.review-background-check {
  border: 1px solid #ebf0f8;
  border-radius: 16px;
  overflow: hidden;
}

.review-background-check.is-expanded {
  border-color: #dfe5f6;
  box-shadow: inset 0 0 0 1px rgba(91, 85, 255, 0.05);
}

.review-background-check__row {
  display: grid;
  grid-template-columns: minmax(230px, 1.2fr) auto 56px minmax(120px, 1fr) 110px auto;
  gap: 14px;
  padding: 14px;
}

.review-background-check__identity {
  gap: 12px;
  min-width: 0;
}

.review-background-check__identity strong {
  color: #243454;
  font-size: 0.88rem;
}

.review-background-check__icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eff4fb;
}

.review-background-status-chip {
  align-self: center;
  justify-self: start;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.review-background-check__percent {
  align-self: center;
  color: #243454;
  font-size: 0.8rem;
}

.review-background-check__track {
  align-self: center;
  height: 6px;
  border-radius: 999px;
  background: #edf2fb;
  overflow: hidden;
}

.review-background-check__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.review-background-check__track span.is-success,
.review-background-check__icon.is-success,
.review-background-status-chip.is-success {
  background-color: #eafbf2;
  color: #16a34a;
}

.review-background-check__track span.is-success {
  background-image: linear-gradient(90deg, #22c55e 0%, #34d399 100%);
}

.review-background-check__track span.is-violet,
.review-background-check__icon.is-violet,
.review-background-status-chip.is-violet {
  background-color: #efecff;
  color: #5b55ff;
}

.review-background-check__track span.is-violet {
  background-image: linear-gradient(90deg, #5b55ff 0%, #7c6cff 100%);
}

.review-background-check__track span.is-warning,
.review-background-check__icon.is-warning,
.review-background-status-chip.is-warning {
  background-color: #fff3e9;
  color: #f97316;
}

.review-background-check__track span.is-warning {
  background-image: linear-gradient(90deg, #fb923c 0%, #fdba74 100%);
}

.review-background-check__track span.is-muted,
.review-background-check__icon.is-muted,
.review-background-status-chip.is-muted {
  background-color: #f1f5f9;
  color: #94a3b8;
}

.review-background-check__track span.is-muted {
  background-image: linear-gradient(90deg, #cbd5e1 0%, #e2e8f0 100%);
}

.review-background-check__date {
  align-self: center;
  color: #94a3b8;
  font-size: 0.76rem;
}

.review-background-check__actions {
  justify-content: flex-end;
  gap: 8px;
}

.review-background-mini-button,
.review-background-document-list button,
.review-background-next-list button {
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  color: #334155;
  font-size: 0.76rem;
  font-weight: 700;
}

.review-background-check__details {
  padding: 0 14px 14px;
}

.review-background-detail-grid {
  grid-template-columns: 1.05fr 1.1fr 1.05fr 0.9fr;
}

.review-background-detail-card {
  min-width: 0;
  padding: 14px;
  border-radius: 14px;
  background: #fbfcff;
  border: 1px solid #edf2fb;
}

.review-background-detail-card > strong,
.review-background-detail-card__head strong {
  color: #243454;
  font-size: 0.78rem;
}

.review-background-detail-card__head {
  justify-content: space-between;
  gap: 8px;
}

.review-background-detail-card__head span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #efecff;
  color: #5b55ff;
  font-size: 0.65rem;
  font-weight: 800;
}

.review-background-detail-card dl,
.review-background-detail-list,
.review-background-document-list {
  margin: 12px 0 0;
}

.review-background-detail-card dl {
  display: grid;
  gap: 10px;
}

.review-background-detail-card dd,
.review-background-detail-list strong,
.review-background-detail-list span,
.review-background-document-list strong,
.review-background-score-row strong,
.review-background-score-row span {
  margin: 0;
  font-size: 0.76rem;
  color: #334155;
}

.review-background-detail-list {
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.review-background-detail-list li,
.review-background-score-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.review-background-detail-card em {
  display: inline-flex;
  align-items: center;
  margin-top: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #16a34a;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
}

.review-background-detail-card p {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 0.76rem;
  line-height: 1.55;
}

.review-background-score-row {
  margin-top: 10px;
}

.review-background-document-list article {
  display: grid;
  gap: 8px;
  padding: 10px;
  border: 1px solid #edf2fb;
  border-radius: 12px;
  background: #fff;
}

.review-background-document-list small {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 0.7rem;
}

.review-background-detail-actions {
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
  padding: 0 2px;
}

.review-background-detail-actions > span {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
}

.review-background-detail-actions div {
  gap: 14px;
}

.review-background-check--manual .review-background-check__row {
  grid-template-columns: minmax(250px, 1.3fr) auto minmax(130px, 0.9fr) 110px auto;
}

.review-background-check__row--manual-review {
  grid-template-columns: minmax(250px, 1.35fr) auto minmax(130px, 0.85fr) minmax(120px, 0.85fr) auto;
}

.review-background-manual-detail-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr 0.95fr;
  gap: 12px;
}

.review-background-detail-card__multiline {
  white-space: pre-line;
}

.review-background-manual-note {
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: #fbfcff;
  border: 1px solid #edf2fb;
}

.review-background-manual-note strong {
  display: block;
  color: #475569;
  font-size: 0.72rem;
}

.review-background-manual-note p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 0.74rem;
  line-height: 1.5;
}

.review-background-manual-subhead {
  display: block;
  margin-top: 14px;
}

.review-background-footnote {
  color: #94a3b8;
  font-size: 0.75rem;
}

.review-background-side-card {
  padding: 16px;
}

.review-background-side-card h3 {
  margin: 0;
}

.review-background-ring {
  width: 116px;
  height: 116px;
  margin: 14px auto 0;
  padding: 10px;
  border-radius: 50%;
}

.review-background-ring > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
  box-shadow: inset 0 0 0 1px #eef2fb;
  text-align: center;
}

.review-background-ring strong {
  display: block;
  color: #243454;
  font-size: 1.7rem;
}

.review-background-ring small {
  color: #94a3b8;
  font-size: 0.72rem;
}

.review-background-side-statuses,
.review-background-next-list,
.review-background-action-list {
  margin-top: 14px;
}

.review-background-side-statuses {
  display: grid;
  gap: 8px;
}

.review-background-side-statuses li {
  display: grid;
  grid-template-columns: 8px auto 1fr;
  align-items: center;
  gap: 10px;
}

.review-background-side-statuses li span {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.review-background-side-statuses li strong {
  color: #243454;
  font-size: 0.8rem;
}

.review-background-side-statuses li small {
  justify-self: end;
  color: #94a3b8;
  font-size: 0.75rem;
}

.review-background-next-list article {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 10px;
}

.review-background-next-icon {
  width: 24px;
  height: 24px;
  margin-top: 2px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #cbd5e1;
  color: #64748b;
}

.review-background-next-icon.is-warning {
  background: #fff3e9;
  color: #fb923c;
}

.review-background-next-icon.is-violet {
  background: #efecff;
  color: #5b55ff;
}

.review-background-next-icon.is-muted {
  background: #f1f5f9;
  color: #94a3b8;
}

.review-background-next-list strong,
.review-background-side-card--security strong {
  color: #243454;
  font-size: 0.83rem;
}

.review-background-next-list p,
.review-background-side-card--security p {
  margin: 4px 0 0;
  color: #7c8aa8;
  font-size: 0.77rem;
  line-height: 1.5;
}

.review-background-next-list button {
  margin-top: 10px;
  color: #5b55ff;
}

.review-background-action-list button {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  color: #334155;
}

.review-background-action-list button.is-danger {
  color: #dc2626;
  border-color: #fee2e2;
  background: #fff8f8;
}

.review-background-side-card--security {
  gap: 12px;
  align-items: flex-start;
  background: #fcfdff;
}

.review-background-side-card--security :deep(svg) {
  color: #94a3b8;
}

.review-background-secondary,
.review-background-primary {
  min-width: 132px;
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-size: 0.84rem;
  font-weight: 800;
}

.review-background-secondary {
  color: #334155;
}

.review-background-primary {
  border-color: transparent;
  background: linear-gradient(135deg, #5b55ff 0%, #4338ca 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(67, 56, 202, 0.22);
}

.review-background-ghost-button:hover,
.review-background-icon-button:hover,
.review-background-mini-button:hover,
.review-background-mini-icon:hover,
.review-background-document-list button:hover,
.review-background-next-list button:hover,
.review-background-action-list button:hover,
.review-background-secondary:hover,
.review-background-inline-link:hover,
.review-background-text-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.07);
}

.review-background-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 32px rgba(67, 56, 202, 0.28);
}

.review-background-document-overlay {
  position: fixed;
  inset: 0;
  z-index: 2300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(6px);
}

.review-background-document-modal {
  width: min(1280px, calc(100vw - 48px));
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  border: 1px solid #e6ebf8;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 34px 80px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.review-background-document-modal__head,
.review-background-document-modal__foot,
.review-background-document-preview__toolbar,
.review-background-document-preview__actions,
.review-background-document-modal__footnote {
  display: flex;
  align-items: center;
}

.review-background-document-modal__head,
.review-background-document-modal__foot {
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid #edf2fb;
}

.review-background-document-modal__foot {
  border-top: 1px solid #edf2fb;
  border-bottom: 0;
}

.review-background-document-modal__head h3 {
  margin: 0;
  color: #243454;
  font-size: 1.1rem;
}

.review-background-document-modal__head p {
  margin: 4px 0 0;
  color: #7c8aa8;
  font-size: 0.78rem;
}

.review-background-document-modal__body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 0;
  overflow: hidden;
}

.review-background-document-sidebar {
  min-height: 0;
  padding: 18px;
  border-right: 1px solid #edf2fb;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  background: #fbfcff;
  overflow: hidden;
}

.review-background-document-sidebar > strong {
  color: #243454;
  font-size: 0.9rem;
}

.review-background-document-sidebar > p {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 0.74rem;
}

.review-background-document-sidebar__list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

.review-background-document-sidebar__item {
  padding: 12px;
  border: 1px solid #e6ecf8;
  border-radius: 14px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: start;
  background: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.review-background-document-sidebar__item.is-active {
  border-color: #cfc8ff;
  background: #faf8ff;
  box-shadow: inset 0 0 0 1px rgba(91, 85, 255, 0.08);
}

.review-background-document-sidebar__icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff1f7;
  color: #ff5aa7;
}

.review-background-document-sidebar__item strong {
  display: block;
  color: #243454;
  font-size: 0.78rem;
}

.review-background-document-sidebar__item small {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 0.68rem;
}

.review-background-document-sidebar__item em {
  align-self: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: #ecfbf3;
  color: #16a34a;
  font-size: 0.66rem;
  font-style: normal;
  font-weight: 800;
}

.review-background-document-sidebar__note {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #edf2fb;
  border-radius: 14px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  background: #fff;
  color: #7c8aa8;
  font-size: 0.72rem;
  line-height: 1.5;
}

.review-background-document-sidebar__note p {
  margin: 0;
}

.review-background-document-preview {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0;
  background: #fff;
  overflow: hidden;
}

.review-background-document-preview__toolbar {
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid #edf2fb;
}

.review-background-document-preview__toolbar strong {
  display: block;
  color: #243454;
  font-size: 0.86rem;
}

.review-background-document-preview__toolbar small {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 0.7rem;
}

.review-background-document-preview__actions {
  gap: 8px;
}

.review-background-document-preview__sheet {
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 22px;
  background:
    linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
}

.review-background-document-preview__sheet-head {
  padding: 18px;
  border: 1px solid #e6ecf8;
  border-radius: 18px;
  background: #fff;
}

.review-background-document-preview__provider {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 74px;
  height: 28px;
  padding: 0 10px;
  border-radius: 10px;
  background: #edf4ff;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 800;
}

.review-background-document-preview__sheet-head > strong {
  display: block;
  margin-top: 12px;
  color: #243454;
  font-size: 1.02rem;
}

.review-background-document-preview__status {
  margin-top: 14px;
  padding: 14px;
  border-radius: 14px;
  background: #f7fff9;
  border: 1px solid #dbf5e5;
}

.review-background-document-preview__status strong {
  display: block;
  color: #16a34a;
  font-size: 0.84rem;
}

.review-background-document-preview__status small {
  display: block;
  margin-top: 4px;
  color: #64748b;
  font-size: 0.72rem;
}

.review-background-document-preview__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.review-background-document-preview__facts div,
.review-background-document-preview__grid section,
.review-background-document-preview__grid.is-compact > div {
  padding: 14px;
  border: 1px solid #e6ecf8;
  border-radius: 16px;
  background: #fff;
}

.review-background-document-preview__facts small,
.review-background-document-preview__grid small {
  display: block;
  color: #94a3b8;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.review-background-document-preview__facts strong,
.review-background-document-preview__grid strong {
  display: block;
  margin-top: 6px;
  color: #243454;
  font-size: 0.78rem;
}

.review-background-document-preview__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.review-background-document-preview__grid section.is-full {
  grid-column: 1 / -1;
}

.review-background-document-preview__grid h4 {
  margin: 0 0 12px;
  color: #243454;
  font-size: 0.84rem;
}

.review-background-document-preview__grid section > div + div,
.review-background-document-preview__grid.is-compact > div + div {
  margin-top: 10px;
}

.review-background-document-preview__grid.is-compact {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.review-background-document-modal__footnote {
  gap: 8px;
  color: #7c8aa8;
  font-size: 0.74rem;
}

@media (max-width: 1380px) {
  .review-background-layout {
    grid-template-columns: 1fr;
  }

  .review-background-sidebar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .review-background-side-card--security {
    grid-column: 1 / -1;
  }

  .review-background-detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .review-background-manual-detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .review-background-document-modal__body {
    grid-template-columns: 280px minmax(0, 1fr);
  }
}

@media (max-width: 1180px) {
  .review-background-candidate {
    grid-template-columns: 1fr;
  }

  .review-background-candidate__meta,
  .review-background-progress__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .review-background-check__row,
  .review-background-check__row--manual-review,
  .review-background-check--manual .review-background-check__row {
    grid-template-columns: 1fr;
  }

  .review-background-check__actions {
    justify-content: flex-start;
  }

  .review-background-document-modal__body {
    grid-template-columns: 1fr;
  }

  .review-background-document-sidebar {
    border-right: 0;
    border-bottom: 1px solid #edf2fb;
  }
}

@media (max-width: 860px) {
  .review-background-overlay {
    padding: 10px;
  }

  .review-background-modal {
    width: 100%;
    max-height: calc(100vh - 12px);
    border-radius: 20px;
  }

  .review-background-head,
  .review-background-foot {
    flex-wrap: wrap;
  }

  .review-background-head__actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .review-background-ghost-button {
    flex: 1 1 180px;
  }

  .review-background-layout,
  .review-background-candidate__meta,
  .review-background-detail-grid,
  .review-background-manual-detail-grid,
  .review-background-progress__stats,
  .review-background-sidebar {
    grid-template-columns: 1fr;
  }

  .review-background-document-overlay {
    padding: 10px;
  }

  .review-background-document-modal {
    width: 100%;
    max-height: calc(100vh - 12px);
    border-radius: 18px;
  }

  .review-background-document-modal__head,
  .review-background-document-modal__foot,
  .review-background-document-preview__toolbar {
    flex-wrap: wrap;
  }

  .review-background-document-preview__facts,
  .review-background-document-preview__grid,
  .review-background-document-preview__grid.is-compact {
    grid-template-columns: 1fr;
  }

  .review-background-detail-actions,
  .review-background-detail-actions div,
  .review-background-foot,
  .review-background-document-modal__foot {
    flex-direction: column;
    align-items: stretch;
  }

  .review-background-secondary,
  .review-background-primary {
    width: 100%;
  }
}
</style>
