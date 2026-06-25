<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import AppSelect from '../shared/AppSelect.vue'
import { jobs, jobsAttention, jobsSummary, pipelineHealth, quickFilters } from '../../data/jobs'

const emit = defineEmits(['open-job', 'create-job', 'open-pipeline'])

const viewTabs = [
  { id: 'list', label: 'List View', icon: 'list' },
  { id: 'board', label: 'Board View', icon: 'grid' },
  { id: 'brief', label: 'Brief View', icon: 'briefcase' },
  { id: 'analytics', label: 'Analytics', icon: 'chart-bars' },
]

const activeView = ref('board')
const searchQuery = ref('')
const jobsPerPage = ref('10')
const actionMenu = ref(null)
const actionMenuRef = ref(null)
let actionMenuRaf = 0
const reviewCandidatesActionMenu = ref(null)
const reviewCandidatesActionMenuRef = ref(null)
let reviewCandidatesActionMenuRaf = 0
const filterModalOpen = ref(false)
const reviewFeedbackModalOpen = ref(false)
const sendReminderModalOpen = ref(false)
const completeFeedbackModalOpen = ref(false)
const feedbackSuccessModalOpen = ref(false)
const duplicateJobModalOpen = ref(false)
const duplicateJobSuccessModalOpen = ref(false)
const shareJobModalOpen = ref(false)
const scheduleInterviewsModalOpen = ref(false)
const closingSoonJobsModalOpen = ref(false)
const reviewCandidatesModalOpen = ref(false)
const jobsAttentionModalOpen = ref(false)
const actionPlanModalOpen = ref(false)
const actionPlanFeedbackModalOpen = ref(false)
const actionPlanFeedbackView = ref('list')
const actionPlanApprovalModalOpen = ref(false)
const reschedulePublicationModalOpen = ref(false)
const reschedulePublicationSuccessModalOpen = ref(false)
const pauseJobModalOpen = ref(false)
const pauseJobSuccessModalOpen = ref(false)
const closeJobModalOpen = ref(false)
const closeJobInfoOpen = ref(false)
const archiveJobModalOpen = ref(false)
const archiveJobInfoOpen = ref(false)
const copilotJobModalOpen = ref(false)
const copilotJobBodyRef = ref(null)
const actionPlanBodyRef = ref(null)
const actionPlanFeedbackBodyRef = ref(null)
const actionPlanApprovalBodyRef = ref(null)
const basicFiltersOpen = ref(true)
const advancedFiltersOpen = ref(true)
const scheduleInterviewTab = ref('All')
const scheduleInterviewSort = ref('Soonest')
const duplicateJobTarget = ref(null)
const duplicateJobBodyRef = ref(null)
const duplicateJobView = ref('basic')
const duplicateJobForm = ref({
  title: '',
  department: 'Engineering',
  location: 'Remote',
  employmentType: 'Full-time',
  openPositions: '1',
  status: 'Draft',
  openingDate: 'May 14, 2024',
  applicationDeadline: 'May 30, 2024',
  targetStartDate: 'June 15, 2024',
  salaryMin: '45,000',
  salaryMax: '60,000',
  currency: 'SEK',
  salaryVisible: true,
  hiringPriority: 'medium',
  hiringManager: 'Sarah Ahmed',
  recruiter: 'Majda Razzouqia',
  copyInterviewPanel: true,
  workflowStages: true,
  approvalWorkflow: true,
  permissions: true,
  autoCandidateMatching: true,
  autoInterviewScheduling: true,
  autoFeedbackReminders: true,
  autoFollowUps: true,
  publishCareerSite: true,
  publishLinkedIn: true,
  publishIndeed: true,
  publishInternalPortal: true,
  publishGlassdoor: false,
  publishMonster: false,
  visibility: 'public',
  publishSetting: 'draft',
  internalCode: '',
})
const duplicateJobAdvancedPanels = ref({
  hiringDetails: true,
  compensation: true,
  publishing: true,
  hiringTeam: true,
  workflow: true,
  automation: true,
})
const duplicateJobSuccessData = ref(null)
const reschedulePublicationTarget = ref(null)
const reschedulePublicationSuccessData = ref(null)
const pauseJobTarget = ref(null)
const pauseJobSuccessData = ref(null)
const closeJobTarget = ref(null)
const archiveJobTarget = ref(null)
const copilotJobTarget = ref(null)
const actionPlanFeedbackTarget = ref(null)
const actionPlanFeedbackActiveCandidate = ref(null)
const actionPlanFeedbackSelected = ref([])
const actionPlanApprovalTarget = ref(null)
const actionPlanApprovalSelected = ref([])
const actionPlanApprovalExpandedId = ref('')
const actionPlanApprovalSort = ref('Oldest waiting')
const actionPlanApprovalComments = ref('')
const actionPlanApprovalAssignBack = ref('Sarah Johnson (Recruiter)')
const actionPlanApprovalDueDate = ref('Within 3 business days')
const actionPlanApprovalReason = ref('Salary adjustment')
const actionPlanFeedbackType = ref('advance')
const actionPlanFeedbackTemplate = ref('Interview - Advance to Next Round')
const actionPlanFeedbackMessage = ref('')
const actionPlanFeedbackInternalNote = ref('')
const actionPlanFeedbackMoveToNextStage = ref(true)
const actionPlanFeedbackAddToTalentPool = ref(false)
const actionPlanFeedbackNextStage = ref('Interview - Round 3')
const reschedulePublicationForm = ref({
  closeDate: '31 Aug 2025',
  republishDate: '15 Sep 2025',
  careerSite: true,
  linkedIn: true,
  indeed: true,
  glassdoor: true,
  keepVisibility: true,
})
const pauseJobForm = ref({
  reason: 'freeze',
  autoResume: false,
  resumeDate: '',
})
const closeJobForm = ref({
  candidateAction: 'keep',
  closingReason: '',
  internalNote: '',
})
const archiveJobForm = ref({
  note: '',
})
const copilotJobMode = ref('default')
const copilotJobQuestion = ref('')
const copilotJobAsked = ref('')
const shareJobTarget = ref(null)
const shareJobCopied = ref(false)
const attentionActiveFilter = ref('all')
const reviewCandidatesTarget = ref(null)
const reviewCandidatesSearch = ref('')
const reviewCandidatesSort = ref('Newest')
const reviewCandidatesSelectedIds = ref([])
const reviewCandidatesActiveId = ref('')
const reviewCandidatesEmailModalOpen = ref(false)
const reviewCandidatesEmailTarget = ref(null)
const reviewCandidatesEmailTemplate = ref('')
const reviewCandidatesEmailTemplateModalOpen = ref(false)
const reviewCandidatesEmailTemplateSearch = ref('')
const reviewCandidatesEmailTemplateCategory = ref('All')
const reviewCandidatesEmailSelectedTemplateId = ref('interview-invitation')
const reviewCandidatesEmailTemplateDraftSubject = ref('')
const reviewCandidatesEmailTemplateDraftBody = ref('')
const reviewCandidatesEmailSendOption = ref('Schedule email')
const reviewCandidatesEmailSubject = ref('')
const reviewCandidatesEmailMessage = ref('')
const reviewCandidatesEmailDate = ref('22 Jul 2024')
const reviewCandidatesEmailTime = ref('09:00 AM')
const reviewCandidatesEmailTimezone = ref('Europe/Stockholm (GMT+2)')
const reviewCandidatesNoteModalOpen = ref(false)
const reviewCandidatesNoteTarget = ref(null)
const reviewCandidatesNoteVisibility = ref('Hiring Team')
const reviewCandidatesNoteBody = ref('')
const reviewCandidatesNoteReminderDate = ref('22 May, 2024')
const reviewCandidatesNoteReminderTime = ref('10:00 AM')
const reviewCandidatesNoteFollowUpTask = ref(true)
const reviewCandidatesNoteTags = ref([])
const reviewCandidatesTalentPoolModalOpen = ref(false)
const reviewCandidatesTalentPoolTarget = ref(null)
const reviewCandidatesTalentPoolSuccessOpen = ref(false)
const reviewCandidatesTalentPoolSuccessData = ref(null)
const reviewCandidatesTalentPoolName = ref('UX Designers')
const reviewCandidatesTalentPoolReason = ref('Strong candidate')
const reviewCandidatesTalentPoolTags = ref([])
const reviewCandidatesTalentPoolNote = ref('')
const reviewCandidatesTalentPoolRemindLater = ref(true)
const reviewCandidatesTalentPoolReminderDate = ref('22 Jul 2026')
const reviewCandidatesTalentPoolReminderTime = ref('09:00 AM')
const reviewCandidatesTalentPoolVisibility = ref('Hiring team')
const reviewCandidatesMenuActions = [
  { id: 'message', label: 'Message Candidate', icon: 'mail' },
  { id: 'schedule', label: 'Schedule Interview', icon: 'calendar' },
  { id: 'note', label: 'Add Note', icon: 'edit' },
  { id: 'talent-pool', label: 'Add to Talent Pool', icon: 'userPlus' },
]
const reviewCandidatesEmailTemplateCategories = ['All', 'Interview', 'Assessment', 'Offer', 'Rejection', 'Follow-up']
const reviewCandidatesEmailTemplates = [
  {
    id: 'interview-invitation',
    title: 'Interview Invitation',
    description: 'Invite candidate to an interview for the next step.',
    category: 'Interview',
    icon: 'mail',
    tone: 'violet',
    lastUsed: 'Last used: 2 days ago',
    updated: 'Last updated: 5 days ago',
    createdBy: 'Olivia Rhye',
    variables: ['{%candidateName%}', '{%jobTitle%}', '{%companyName%}', '{%interviewDate%}', '{%interviewTime%}', '{%recruiterName%}'],
    subject: 'Interview invitation for {%jobTitle%}',
    body: [
      'Hi {%candidateName%},',
      '',
      'Thank you for your interest in the {%jobTitle%} position at {%companyName%}.',
      '',
      'We were impressed with your background and would like to invite you for an interview to learn more about your experience and discuss the role in detail.',
      '',
      'Please let us know your availability for the upcoming days.',
      '',
      'Best regards,',
      '{%recruiterName%}',
      'Talent Acquisition Specialist',
      '{%companyName%}',
    ].join('\n'),
  },
  {
    id: 'interview-reminder',
    title: 'Interview Reminder',
    description: 'Remind candidate about upcoming interview.',
    category: 'Interview',
    icon: 'calendar',
    tone: 'blue',
    lastUsed: 'Last used: 7 days ago',
    updated: 'Last updated: 7 days ago',
    createdBy: 'Olivia Rhye',
    variables: ['{%candidateName%}', '{%jobTitle%}', '{%interviewDate%}', '{%interviewTime%}'],
    subject: 'Reminder: your interview for {%jobTitle%}',
    body: [
      'Hi {%candidateName%},',
      '',
      'This is a reminder about your upcoming interview for the {%jobTitle%} role.',
      '',
      'Interview date: {%interviewDate%}',
      'Interview time: {%interviewTime%}',
      '',
      'Please reply if you need to reschedule.',
      '',
      'Best regards,',
      '{%recruiterName%}',
    ].join('\n'),
  },
  {
    id: 'assessment-invitation',
    title: 'Assessment Invitation',
    description: 'Send assessment or test invitation to candidate.',
    category: 'Assessment',
    icon: 'document',
    tone: 'green',
    lastUsed: 'Last used: 11 days ago',
    updated: 'Last updated: 11 days ago',
    createdBy: 'Olivia Rhye',
    variables: ['{%candidateName%}', '{%jobTitle%}', '{%companyName%}'],
    subject: 'Assessment invitation for {%jobTitle%}',
    body: [
      'Hi {%candidateName%},',
      '',
      'We would like to invite you to complete the next assessment step for the {%jobTitle%} position at {%companyName%}.',
      '',
      'Please complete it at your earliest convenience.',
      '',
      'Best regards,',
      '{%recruiterName%}',
    ].join('\n'),
  },
  {
    id: 'follow-up-email',
    title: 'Follow-up Email',
    description: 'Follow up with candidate after previous communication.',
    category: 'Follow-up',
    icon: 'alert',
    tone: 'orange',
    lastUsed: 'Last used: 14 days ago',
    updated: 'Last updated: 14 days ago',
    createdBy: 'Olivia Rhye',
    variables: ['{%candidateName%}', '{%jobTitle%}', '{%companyName%}'],
    subject: 'Following up on your {%jobTitle%} application',
    body: [
      'Hi {%candidateName%},',
      '',
      'We wanted to follow up regarding your application for the {%jobTitle%} position at {%companyName%}.',
      '',
      'Please let us know if you have any questions.',
      '',
      'Best regards,',
      '{%recruiterName%}',
    ].join('\n'),
  },
]
const reviewCandidatesEmailTimeOptions = [
  '09:00 AM',
  '10:30 AM',
  '01:00 PM',
  '03:30 PM',
]
const reviewCandidatesEmailTimezoneOptions = [
  'Europe/Stockholm (GMT+2)',
  'Europe/Berlin (GMT+2)',
  'Europe/London (GMT+1)',
]
const reviewCandidatesNoteVisibilityOptions = ['Hiring Team', 'Recruiters Only', 'Private Note']
const reviewCandidatesNoteTimeOptions = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM']
const reviewCandidatesTalentPoolOptions = ['UX Designers', 'Product Designers', 'Design Systems', 'Research Bench']
const reviewCandidatesTalentPoolReasonOptions = [
  'Strong candidate',
  'Future opportunity',
  'Position already filled',
  'Not selected',
  'Other',
]
const reviewCandidatesTalentPoolVisibilityOptions = ['Hiring team', 'Recruiters only']
const reviewCandidatesTalentPoolReminderTimeOptions = ['09:00 AM', '10:00 AM', '01:30 PM', '03:00 PM']
const reviewCandidatesEmailVariables = [
  '{{CandidateName}}',
  '{{JobTitle}}',
  '{{CompanyName}}',
  '{{InterviewDate}}',
  '{{InterviewTime}}',
]

const actionPlanFeedbackCandidates = computed(() => actionPlanFeedbackTarget.value?.candidates ?? [])
const actionPlanFeedbackSelectedCount = computed(() => actionPlanFeedbackSelected.value.length)
const actionPlanFeedbackAllSelected = computed(() => {
  return actionPlanFeedbackCandidates.value.length > 0 && actionPlanFeedbackSelected.value.length === actionPlanFeedbackCandidates.value.length
})
const actionPlanFeedbackSendLabel = computed(() => {
  const count = actionPlanFeedbackSelectedCount.value
  const noun = count === 1 ? 'candidate' : 'candidates'
  return `Send feedback to ${count} ${noun}`
})
const actionPlanApprovalCandidates = computed(() => actionPlanApprovalTarget.value?.candidates ?? [])
const actionPlanApprovalSelectedCount = computed(() => actionPlanApprovalSelected.value.length)
const actionPlanApprovalAllSelected = computed(() => {
  return actionPlanApprovalCandidates.value.length > 0 && actionPlanApprovalSelected.value.length === actionPlanApprovalCandidates.value.length
})
const actionPlanApprovalExpandedCandidate = computed(() => {
  return actionPlanApprovalCandidates.value.find((candidate) => candidate.id === actionPlanApprovalExpandedId.value) ?? null
})
const actionPlanApprovalRequestChangesLabel = computed(() => `Request changes for selected (${actionPlanApprovalSelectedCount.value})`)
const actionPlanApprovalRejectLabel = computed(() => `Reject selected (${actionPlanApprovalSelectedCount.value})`)
const actionPlanApprovalApproveLabel = computed(() => `Approve selected (${actionPlanApprovalSelectedCount.value})`)
const actionPlanFeedbackActiveRole = computed(() => actionPlanFeedbackTarget.value?.job ?? 'Candidate')
const actionPlanFeedbackActiveStage = computed(() => {
  if (!actionPlanFeedbackActiveCandidate.value) {
    return ''
  }

  return `${actionPlanFeedbackActiveCandidate.value.stage} - ${actionPlanFeedbackActiveCandidate.value.stageDetail}`
})
const actionPlanFeedbackAppliedDate = computed(() => {
  if (!actionPlanFeedbackActiveCandidate.value) {
    return ''
  }

  return `${actionPlanFeedbackActiveCandidate.value.appliedOn} 2024`
})
const actionPlanFeedbackSubmitLabel = computed(() => {
  const candidateName = actionPlanFeedbackActiveCandidate.value?.name?.split(' ')[0] ?? 'candidate'
  return `Send feedback to ${candidateName}`
})
const filteredReviewCandidates = computed(() => {
  const query = reviewCandidatesSearch.value.trim().toLowerCase()
  const sourceCandidates = reviewCandidatesTarget.value?.candidates ?? []
  let candidates = !query
    ? [...sourceCandidates]
    : sourceCandidates.filter((candidate) => (
      `${candidate.name} ${candidate.role} ${candidate.location} ${candidate.source}`.toLowerCase().includes(query)
    ))

  if (reviewCandidatesSort.value === 'Highest match') {
    candidates.sort((left, right) => right.aiMatch - left.aiMatch)
  } else if (reviewCandidatesSort.value === 'Oldest') {
    candidates.sort((left, right) => right.appliedHoursAgo - left.appliedHoursAgo)
  } else {
    candidates.sort((left, right) => left.appliedHoursAgo - right.appliedHoursAgo)
  }

  return candidates
})
const reviewCandidatesSelectedCount = computed(() => reviewCandidatesSelectedIds.value.length)
const reviewCandidatesActiveCandidate = computed(() => {
  const candidates = reviewCandidatesTarget.value?.candidates ?? []

  return candidates.find((candidate) => candidate.id === reviewCandidatesActiveId.value) ?? candidates[0] ?? null
})
const reviewCandidatesEmailWordCount = computed(() => {
  const content = reviewCandidatesEmailMessage.value.trim()

  if (!content) {
    return 0
  }

  return content.split(/\s+/).length
})
const filteredReviewCandidatesEmailTemplates = computed(() => {
  const query = reviewCandidatesEmailTemplateSearch.value.trim().toLowerCase()

  return reviewCandidatesEmailTemplates.filter((template) => {
    const categoryMatch = reviewCandidatesEmailTemplateCategory.value === 'All' || template.category === reviewCandidatesEmailTemplateCategory.value
    const queryMatch = !query || `${template.title} ${template.description} ${template.category}`.toLowerCase().includes(query)
    return categoryMatch && queryMatch
  })
})
const selectedReviewCandidatesEmailTemplate = computed(() => {
  return reviewCandidatesEmailTemplates.find((template) => template.id === reviewCandidatesEmailSelectedTemplateId.value) ?? reviewCandidatesEmailTemplates[0]
})
const reviewCandidatesEmailDraftVariables = computed(() => {
  const source = `${reviewCandidatesEmailTemplateDraftSubject.value}\n${reviewCandidatesEmailTemplateDraftBody.value}`
  const matches = source.match(/\{%\s*[^%]+?\s*%\}/g) ?? []
  return [...new Set(matches)]
})
const reviewCandidatesNoteCharacterCount = computed(() => reviewCandidatesNoteBody.value.length)
const reviewCandidatesTalentPoolNoteCharacterCount = computed(() => reviewCandidatesTalentPoolNote.value.length)
const reviewCandidatesSuggestedTalentPools = computed(() => {
  const candidate = reviewCandidatesTalentPoolTarget.value

  if (!candidate) {
    return []
  }

  return [
    { id: 'ux', name: candidate.role.includes('Designer') ? 'UX Designers' : 'Product Candidates', match: '95% match', tone: 'green' },
    { id: 'product', name: 'Product Designers', match: `${Math.max(candidate.aiMatch - 7, 78)}% match`, tone: 'pink' },
  ]
})

const actionPlanFeedbackTypeOptions = [
  { id: 'advance', title: 'Advance candidate', note: 'Move to next stage', icon: 'mail' },
  { id: 'reject', title: 'Reject candidate', note: 'Not moving forward', icon: 'thumbsDown' },
  { id: 'request', title: 'Request more info', note: 'Need additional details', icon: 'info' },
  { id: 'hold', title: 'Put on hold', note: 'Pause for now', icon: 'pause' },
]

const actionPlanFeedbackTemplateOptions = [
  'Interview - Advance to Next Round',
  'Interview - Request More Information',
  'Assessment - Move Forward',
  'General - Candidate Update',
]

const actionPlanFeedbackNextStageOptions = [
  'Interview - Round 3',
  'Portfolio Review',
  'Final Interview',
  'Offer Discussion',
]

const actionPlanFeedbackSuggestions = [
  'Highlight portfolio strengths',
  'Add feedback from scorecard',
  'Mention team and next steps',
]

const actionPlanApprovalAssignBackOptions = [
  'Sarah Johnson (Recruiter)',
  'David Lee (Recruiter)',
  'Emma Wilson (Hiring Manager)',
  'John Smith (Director)',
]

const actionPlanApprovalDueDateOptions = [
  'Within 3 business days',
  'Within 5 business days',
  'By end of this week',
]

const actionPlanApprovalReasonOptions = [
  'Salary adjustment',
  'Bonus structure',
  'Start date',
  'Offer terms',
  'Missing information',
  'Other',
]

function getDefaultFilterState() {
  return {
    status: 'Active',
    hiringHealth: 'All',
    pipelineStage: 'Interview',
    attention: 'All',
    department: 'Marketing',
    hiringManager: 'Any',
    recruiter: 'Any',
    jobType: 'All',
    daysOpen: '15 - 30 days',
    expectedHire: 'At Risk',
    location: 'Any',
    workLocation: 'All',
  }
}

const filterForm = ref(getDefaultFilterState())

const quickFilterOptions = [
  { label: 'At Risk', icon: 'alert', tone: 'orange' },
  { label: 'Needs Attention', icon: 'target', tone: 'orange' },
  { label: 'Closing Soon', icon: 'clock', tone: 'pink' },
  { label: 'Feedback Overdue', icon: 'mail', tone: 'orange' },
  { label: 'Low Applications', icon: 'user', tone: 'violet' },
]

const filterSelectOptions = {
  status: ['Active', 'Closing Soon', 'Draft', 'All'],
  hiringHealth: ['All', 'Excellent', 'Good', 'Needs Attention', 'At Risk', 'No Data'],
  pipelineStage: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'All'],
  attention: ['All', 'No action needed', 'Feedback delayed', 'Low applications', 'Closing soon'],
  department: ['Marketing', 'Engineering', 'Design', 'Finance', 'Product', 'People', 'Data', 'All'],
  hiringManager: ['Any', 'Tanya Ahmed', 'Sarah Parker', 'Emma Lund', 'John Smith', 'Maya Lewis'],
  recruiter: ['Any', 'Sarah Parker', 'Emma Lund', 'Lina Omar'],
  jobType: ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'],
  daysOpen: ['Any', '0 - 7 days', '8 - 14 days', '15 - 30 days', '30+ days'],
  expectedHire: ['Any', 'On track', 'At Risk', 'Likely delayed'],
  location: ['Any', 'Remote', 'Hybrid', 'On-site'],
  workLocation: ['All', 'Remote', 'Hybrid', 'On-site'],
}

const rowMenuSections = [
  {
    title: 'Quick Actions',
    items: [
      { id: 'open', label: 'Open Job', icon: 'eye' },
      { id: 'candidates', label: 'View Candidates', icon: 'users' },
      { id: 'schedule', label: 'Schedule Interview', icon: 'calendar' },
    ],
  },
  {
    title: 'Job Management',
    items: [
      { id: 'edit', label: 'Edit Job', icon: 'edit' },
      { id: 'duplicate', label: 'Duplicate Job', icon: 'copy' },
      { id: 'copy-link', label: 'Copy Job Link', icon: 'link' },
      { id: 'share', label: 'Share Job', icon: 'share' },
    ],
  },
  {
    title: 'Publishing',
    items: [
      { id: 'publish', label: 'Publish / Refresh', icon: 'megaphone' },
      { id: 'pause', label: 'Pause Job', icon: 'pause' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { id: 'ask-ai', label: 'Ask AI About This Job', icon: 'sparkles', accent: 'pink' },
      { id: 'insights', label: 'Hiring Insights', icon: 'chart-bars' },
      { id: 'compare', label: 'Compare Similar Jobs', icon: 'compare' },
    ],
  },
  {
    title: 'Lifecycle',
    items: [
      { id: 'filled', label: 'Mark as Filled', icon: 'checkCircle' },
      { id: 'close', label: 'Close Job', icon: 'lock' },
      { id: 'archive', label: 'Archive Job', icon: 'archive' },
    ],
  },
]

const visibleJobs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return jobs
  }

  return jobs.filter((job) => (
    `${job.title} ${job.department} ${job.location} ${job.owner}`.toLowerCase().includes(query)
  ))
})

const boardCards = computed(() => visibleJobs.value)
const filteredJobsAttentionCards = computed(() => (
  attentionActiveFilter.value === 'all'
    ? jobsAttentionActionCards
    : jobsAttentionActionCards.filter((card) => card.filterId === attentionActiveFilter.value)
))

const jobLookup = Object.fromEntries(jobs.map((job) => [job.id, job]))

const briefingSummary = {
  attentionCount: 4,
  atRisk: 2,
  needAction: 2,
  progressingWell: 17,
  totalOpenJobs: 21,
}

const briefingSummaryMetrics = [
  { label: 'At risk', value: 2, tone: 'pink' },
  { label: 'Need action', value: 2, tone: 'orange' },
  { label: 'Progressing well', value: 17, tone: 'green' },
  { label: 'Total open jobs', value: 21, tone: 'slate' },
]

function buildBriefingCard(jobId, config) {
  return {
    ...config,
    job: jobLookup[jobId],
  }
}

const briefingNeedsAttention = [
  buildBriefingCard('pm-3094', {
    badge: 'At Risk',
    tone: 'pink',
    linkLabel: 'Refresh posting',
    metrics: [
      { label: 'Applied', value: 54, delta: '-35%', deltaTone: 'pink' },
      { label: 'Interviews', value: 9, delta: '-28%', deltaTone: 'pink' },
      { label: 'Offers', value: 0 },
      { label: 'Hired', value: 0 },
    ],
    notes: [
      { label: 'Applications dropped', value: '35%', note: 'in the last 7 days', tone: 'pink' },
      { label: 'Expected hire delayed', value: 'by 8 days', tone: 'pink' },
    ],
    expectedHire: '22 Mar 2025',
  }),
  buildBriefingCard('ac-7714', {
    badge: 'Needs Action',
    tone: 'orange',
    linkLabel: 'Review feedback',
    metrics: [
      { label: 'Applied', value: 76 },
      { label: 'Interviews', value: 11 },
      { label: 'Offers', value: 2 },
      { label: 'Hired', value: 0 },
    ],
    notes: [
      { label: '3 candidates waiting', value: 'for feedback', tone: 'orange' },
      { label: 'Oldest waiting', value: '4 days', tone: 'orange' },
    ],
    expectedHire: '28 Mar 2025',
  }),
]

const briefingReadyForAction = [
  buildBriefingCard('gd-2041', {
    badge: 'On Track',
    tone: 'green',
    linkLabel: 'Review final shortlist',
    metrics: [
      { label: 'Applied', value: 98 },
      { label: 'Interviews', value: 16 },
      { label: 'Offers', value: 3 },
      { label: 'Hired', value: 1 },
    ],
    notes: [
      { label: '12 candidates interviewed', value: 'in the last 3 days', tone: 'green' },
      { label: '2 offer-ready candidates', tone: 'green' },
    ],
    expectedHire: '15 Mar 2025',
  }),
  buildBriefingCard('ac-1187', {
    badge: 'On Track',
    tone: 'green',
    linkLabel: 'Complete onboarding',
    metrics: [
      { label: 'Applied', value: 120 },
      { label: 'Interviews', value: 18 },
      { label: 'Offers', value: 4 },
      { label: 'Hired', value: 2 },
    ],
    notes: [
      { label: 'Offer accepted by', value: '1 candidate', tone: 'green' },
      { label: 'Background check', value: 'in progress', tone: 'green' },
    ],
    expectedHire: '18 Mar 2025',
  }),
]

const briefingUpcomingRisks = [
  {
    title: 'HR Manager',
    department: 'People',
    location: 'On-site',
    badge: 'Closing Soon',
    tone: 'pink',
    daysOpen: 21,
    issue: 'No candidates in offer stage',
    note: 'No candidates in offer stage',
    expectedHire: '10 Dec 2024',
    job: jobLookup['hr-4410'],
  },
  {
    title: 'Marketing Lead',
    department: 'Marketing',
    location: 'Hybrid',
    badge: 'At Risk',
    tone: 'orange',
    daysOpen: 17,
    issue: 'Interview panel not assigned',
    note: '1 week since last activity',
    expectedHire: '19 Mar 2025',
    job: null,
  },
]

const briefingRecentWins = [
  { tag: 'Hired', title: 'Senior Frontend Developer', note: 'Filled in 4 days', age: '2 days ago', owner: 'Tanya Ahmed' },
  { tag: 'Offer Accepted', title: 'Backend Engineer', note: 'Offer accepted by candidate', age: '3 days ago', owner: 'Sarah Parker' },
  { tag: 'Hired', title: 'UI/UX Designer', note: 'Filled in 22 days', age: '1 week ago', owner: 'Maya Lewis' },
]

const briefingWeekProgress = [
  { label: 'New jobs opened', value: 3, delta: '+50%', tone: 'blue', progress: 64, icon: 'calendar' },
  { label: 'Offers sent', value: 4, delta: '+33%', tone: 'violet', progress: 84, icon: 'target' },
  { label: 'Hires', value: 2, delta: '+100%', tone: 'pink', progress: 46, icon: 'briefcase' },
]

const briefingQuickActions = [
  { title: 'Create a new job', note: 'Start hiring for a new role', count: null, icon: 'plus' },
  { title: 'Review feedback', note: '5 candidates waiting', count: 5, icon: 'mail' },
  { title: 'Schedule interviews', note: '2 interviews to schedule', count: 2, icon: 'calendar' },
  { title: 'View closing soon jobs', note: '3 jobs closing within 7 days', count: 3, icon: 'alert' },
]

const jobsAttentionOverviewStats = [
  { id: 'low-applications', icon: 'chart-bars', value: 14, label: 'Low Applications', delta: '15% vs last month', tone: 'pink' },
  { id: 'feedback-overdue', icon: 'mail', value: 16, label: 'Feedback Overdue', delta: '20% vs last month', tone: 'orange' },
  { id: 'interviews-needed', icon: 'calendar', value: 21, label: 'Interviews Needed', delta: '10% vs last month', tone: 'violet' },
  { id: 'assessment-pending', icon: 'clipboard-check', value: 8, label: 'Assessment Pending', delta: '5% vs last month', tone: 'blue' },
  { id: 'closing-soon', icon: 'clock', value: 18, label: 'Closing Soon', delta: '8% vs last month', tone: 'yellow' },
  { id: 'approvals-needed', icon: 'check', value: 9, label: 'Approvals Needed', delta: '12% vs last month', tone: 'green' },
  { id: 'candidate-stuck', icon: 'user', value: 6, label: 'Candidate Stuck', delta: '5% vs last month', tone: 'red' },
]

const jobsAttentionFilters = [
  { id: 'all', label: 'All', count: 86 },
  { id: 'low-applications', label: 'Low Applications', count: 14 },
  { id: 'feedback-overdue', label: 'Feedback Overdue', count: 16 },
  { id: 'interviews-needed', label: 'Interviews Needed', count: 21 },
  { id: 'assessment-pending', label: 'Assessment Pending', count: 8 },
  { id: 'closing-soon', label: 'Closing Soon', count: 18 },
  { id: 'approvals-needed', label: 'Approvals Needed', count: 9 },
]

const jobsAttentionActionCards = [
  {
    id: 'graphic-designer',
    filterId: 'low-applications',
    tone: 'pink',
    toneLabel: 'Low Applications',
    severity: 'HIGH',
    title: 'Graphic Designer',
    meta: 'Design • Remote',
    stats: [
      { label: 'Applications', value: '3', subvalue: '/ 10 expected' },
      { label: 'Open', value: '16 days' },
    ],
    insight: 'Applications are 62% below target. Salary range may be limiting conversions.',
    actions: ['Boost Job', 'Share Job'],
  },
  {
    id: 'frontend-developer',
    filterId: 'feedback-overdue',
    tone: 'orange',
    toneLabel: 'Feedback Overdue',
    severity: 'HIGH',
    title: 'Frontend Developer',
    meta: 'Engineering • Remote',
    stats: [
      { label: 'Interviewers pending', value: '3' },
      { label: 'Last interview', value: '4 days ago' },
    ],
    insight: 'Candidate progression is blocked. Timely feedback can keep candidates engaged.',
    actions: ['Send Reminder', 'View Candidate'],
  },
  {
    id: 'product-manager',
    filterId: 'interviews-needed',
    tone: 'violet',
    toneLabel: 'Interviews Needed',
    severity: 'MEDIUM',
    title: 'Product Manager',
    meta: 'Product • New York, USA',
    stats: [
      { label: 'Qualified candidates', value: '5', subvalue: 'waiting' },
      { label: 'Avg. wait time', value: '6 days' },
    ],
    insight: 'Schedule interviews now to reduce time-to-hire by 4 days.',
    actions: ['Schedule Interview', 'View Candidates'],
  },
  {
    id: 'accountant',
    filterId: 'assessment-pending',
    tone: 'blue',
    toneLabel: 'Assessment Pending',
    severity: 'MEDIUM',
    title: 'Accountant',
    meta: 'Finance • Stockholm, Sweden',
    stats: [
      { label: 'Assigned', value: '8' },
      { label: 'Completed', value: '4', subvalue: '(50%)' },
    ],
    insight: 'Assessment completion rate is below benchmark (65%).',
    actions: ['Send Reminder', 'Extend Deadline'],
  },
  {
    id: 'hr-manager',
    filterId: 'closing-soon',
    tone: 'yellow',
    toneLabel: 'Closing Soon',
    severity: 'HIGH',
    title: 'HR Manager',
    meta: 'People • Berlin, Germany',
    stats: [
      { label: 'Closes in', value: '5 days' },
      { label: 'Pipeline health', value: 'Weak' },
    ],
    insight: 'Current pipeline is unlikely to produce a hire.',
    actions: ['Extend Deadline', 'Boost Job'],
  },
  {
    id: 'sales-director',
    filterId: 'approvals-needed',
    tone: 'green',
    toneLabel: 'Approvals Needed',
    severity: 'HIGH',
    title: 'Sales Director',
    meta: 'Sales • London, UK',
    stats: [
      { label: 'Offer approval pending', value: 'Waiting 3 days' },
    ],
    insight: 'Approval delay may push start date by 1 week.',
    actions: ['Approve', 'View Request'],
  },
]

const jobsAttentionBulkActions = [
  'Send All Reminders',
  'Boost Selected Jobs',
  'Extend Selected Jobs',
  'Mark Selected as Reviewed',
]

const actionPlanImpactCards = [
  { icon: 'users', value: '+4', label: 'Potential Hires', note: 'Additional hires likely', tone: 'green' },
  { icon: 'clock', value: '-8 days', label: 'Time-to-Hire', note: 'Faster hiring cycle', tone: 'blue' },
  { icon: 'clipboard-check', value: '14', label: 'Candidates Re-engaged', note: 'Candidates who can move forward again', tone: 'violet' },
]

const actionPlanFilters = [
  { id: 'all', label: 'All Actions', count: 16 },
  { id: 'high', label: 'High Priority', count: 7 },
  { id: 'feedback', label: 'Feedback', count: 6 },
  { id: 'approvals', label: 'Approvals', count: 2 },
  { id: 'scheduling', label: 'Scheduling', count: 1 },
]

const actionPlanRows = [
  { id: 'feedback-5', icon: 'mail', tone: 'pink', title: 'Send feedback to 5 candidates', note: 'Feedback is overdue and candidates are waiting.', job: 'Graphic Designer', jobMeta: '5 candidates', impact: 'Reduce delay', impactMeta: 'by 4 days', priority: 'High', priorityTone: 'pink', action: 'Send Feedback' },
  { id: 'approvals-4', icon: 'user', tone: 'orange', title: 'Review 4 pending approvals', note: 'Offer approvals are waiting.', job: 'Sales Director', jobMeta: '4 candidates', impact: 'Prevent delays', impactMeta: 'in offers', priority: 'High', priorityTone: 'pink', action: 'Review Approvals' },
  { id: 'schedule-3', icon: 'calendar', tone: 'violet', title: 'Schedule 3 pending interviews', note: 'Candidates are waiting for interview slots.', job: 'Product Manager', jobMeta: '3 candidates', impact: 'Reduce delay', impactMeta: 'by 3 days', priority: 'Medium', priorityTone: 'orange', action: 'Schedule Interviews' },
  { id: 'feedback-6', icon: 'mail', tone: 'blue', title: 'Send feedback to 6 candidates', note: 'Feedback is overdue and candidates are waiting.', job: 'Frontend Developer', jobMeta: '6 candidates', impact: 'Reduce delay', impactMeta: 'by 5 days', priority: 'Medium', priorityTone: 'orange', action: 'Send Feedback' },
  { id: 'approve-2', icon: 'check', tone: 'green', title: 'Approve 2 offers', note: 'Offers are waiting for final approval.', job: 'HR Manager', jobMeta: '2 candidates', impact: 'Move offers', impactMeta: 'forward', priority: 'Medium', priorityTone: 'orange', action: 'Review Approvals' },
]

const actionPlanFeedbackScenarios = {
  'feedback-5': {
    why: 'These candidates are waiting for your feedback. Providing feedback will help move them forward and reduce time-to-hire.',
    candidates: [
      { id: 'ethan-miller', name: 'Ethan Miller', appliedOn: '12 May', source: 'LinkedIn', sourceTone: 'blue', stage: 'Interview', stageDetail: '2nd Round', waiting: '5 days', lastActivity: '5 days ago', stageTone: 'violet', avatarTone: 'brown' },
      { id: 'olivia-smith', name: 'Olivia Smith', appliedOn: '14 May', source: 'Careers Page', sourceTone: 'green', stage: 'Interview', stageDetail: '2nd Round', waiting: '6 days', lastActivity: '6 days ago', stageTone: 'violet', avatarTone: 'sand' },
      { id: 'liam-johnson', name: 'Liam Johnson', appliedOn: '15 May', source: 'eReferral', sourceTone: 'orange', stage: 'Assessment', stageDetail: 'Design Test', waiting: '7 days', lastActivity: '7 days ago', stageTone: 'yellow', avatarTone: 'amber' },
      { id: 'ava-brown', name: 'Ava Brown', appliedOn: '16 May', source: 'LinkedIn', sourceTone: 'blue', stage: 'Assessment', stageDetail: 'Design Test', waiting: '8 days', lastActivity: '8 days ago', stageTone: 'yellow', avatarTone: 'rose' },
      { id: 'noah-davis', name: 'Noah Davis', appliedOn: '16 May', source: 'Careers Page', sourceTone: 'green', stage: 'Interview', stageDetail: '1st Round', waiting: '9 days', lastActivity: '9 days ago', stageTone: 'violet', avatarTone: 'olive' },
    ],
    impactCards: [
      { icon: 'users', tone: 'green', value: '+4', label: 'Potential hires', note: 'Additional hires likely' },
      { icon: 'clock', tone: 'blue', value: '-4 days', label: 'Time-to-hire', note: 'Faster hiring cycle' },
      { icon: 'user-check', tone: 'violet', value: '5', label: 'Candidates', note: 'will move forward' },
    ],
    tip: 'Provide feedback as specific as possible. It helps candidates improve and speeds up the hiring process.',
  },
  'feedback-6': {
    why: 'These frontend candidates are waiting for your feedback. Sending feedback now will keep momentum and reduce decision delay.',
    candidates: [
      { id: 'maya-green', name: 'Maya Green', appliedOn: '09 May', source: 'LinkedIn', sourceTone: 'blue', stage: 'Interview', stageDetail: 'Technical Round', waiting: '4 days', lastActivity: '4 days ago', stageTone: 'violet', avatarTone: 'rose' },
      { id: 'adam-ross', name: 'Adam Ross', appliedOn: '10 May', source: 'Indeed', sourceTone: 'blue', stage: 'Screening', stageDetail: 'Recruiter Review', waiting: '5 days', lastActivity: '5 days ago', stageTone: 'blue', avatarTone: 'brown' },
      { id: 'nora-hill', name: 'Nora Hill', appliedOn: '11 May', source: 'Careers Page', sourceTone: 'green', stage: 'Interview', stageDetail: 'Hiring Manager', waiting: '5 days', lastActivity: '5 days ago', stageTone: 'violet', avatarTone: 'sand' },
      { id: 'leo-clark', name: 'Leo Clark', appliedOn: '12 May', source: 'LinkedIn', sourceTone: 'blue', stage: 'Assessment', stageDetail: 'Code Exercise', waiting: '6 days', lastActivity: '6 days ago', stageTone: 'yellow', avatarTone: 'amber' },
      { id: 'sara-bell', name: 'Sara Bell', appliedOn: '13 May', source: 'Indeed', sourceTone: 'blue', stage: 'Interview', stageDetail: 'Final Round', waiting: '7 days', lastActivity: '7 days ago', stageTone: 'violet', avatarTone: 'olive' },
      { id: 'omar-khan', name: 'Omar Khan', appliedOn: '13 May', source: 'Careers Page', sourceTone: 'green', stage: 'Screening', stageDetail: 'Pending Review', waiting: '8 days', lastActivity: '8 days ago', stageTone: 'blue', avatarTone: 'brown' },
    ],
    impactCards: [
      { icon: 'users', tone: 'green', value: '+3', label: 'Potential hires', note: 'Additional hires likely' },
      { icon: 'clock', tone: 'blue', value: '-5 days', label: 'Time-to-hire', note: 'Faster hiring cycle' },
      { icon: 'user-check', tone: 'violet', value: '6', label: 'Candidates', note: 'will move forward' },
    ],
    tip: 'Batch similar feedback together first. It reduces context switching and speeds up final decisions.',
  },
}

const actionPlanApprovalScenarios = {
  'approvals-4': {
    title: 'Review pending approvals',
    note: 'Sales Director • 4 candidates waiting for offer approval',
    summaryLabel: '4 candidates',
    impactLabel: 'Prevent delays in offers',
    priorityIcon: 'flag',
    candidates: [
      {
        id: 'john-smith',
        name: 'John Smith',
        role: 'Sales Director',
        requestedBy: 'Sarah Johnson',
        waiting: '3 days',
        since: 'Since 12 May 2025',
        offerSummary: 'SEK 55,000 / year',
        bonus: 'Bonus 10% (SEK 5,500)',
        budgetStatus: 'Within range',
        budgetTone: 'green',
        range: 'Range: SEK 50,000 - 60,000',
        badge: 'Internal',
        avatarTone: 'brown',
      },
      {
        id: 'emma-wilson',
        name: 'Emma Wilson',
        role: 'Senior Account Executive',
        requestedBy: 'Sarah Johnson',
        waiting: '2 days',
        since: 'Since 13 May 2025',
        offerSummary: 'SEK 58,000 / year',
        bonus: 'Bonus 10% (SEK 5,800)',
        budgetStatus: 'Within range',
        budgetTone: 'green',
        range: 'Range: SEK 50,000 - 60,000',
        badge: 'Internal',
        avatarTone: 'sand',
        expanded: true,
      },
      {
        id: 'michael-brown',
        name: 'Michael Brown',
        role: 'Account Manager',
        requestedBy: 'David Lee',
        waiting: '4 days',
        since: 'Since 11 May 2025',
        offerSummary: 'SEK 52,000 / year',
        bonus: 'Bonus 8% (SEK 4,160)',
        budgetStatus: 'Within range',
        budgetTone: 'green',
        range: 'Range: SEK 50,000 - 60,000',
        badge: 'Internal',
        avatarTone: 'olive',
      },
      {
        id: 'sophia-davis',
        name: 'Sophia Davis',
        role: 'Business Development Manager',
        requestedBy: 'David Lee',
        waiting: '5 days',
        since: 'Since 10 May 2025',
        offerSummary: 'SEK 50,000 / year',
        bonus: 'Bonus 8% (SEK 4,000)',
        budgetStatus: 'Above range',
        budgetTone: 'orange',
        range: 'Range: SEK 50,000 - 60,000',
        budgetDetail: 'Above by: SEK 0',
        badge: 'Internal',
        avatarTone: 'rose',
      },
    ],
    history: [
      { time: '12 May 2025, 10:20 AM', note: 'Sarah Johnson requested approval' },
      { time: '13 May 2025, 09:15 AM', note: 'Emma Wilson submitted offer' },
      { time: '13 May 2025, 11:30 AM', note: 'Pending your decision', tone: 'pink' },
    ],
    documents: ['Offer Letter', 'Compensation Package', 'Interview Feedback'],
    aiSuggestion: 'The proposed salary exceeds the approved range by 12%. Recommended action: Reduce salary to SEK 52,000 or provide additional business justification.',
  },
  'approve-2': {
    title: 'Review pending approvals',
    note: 'HR Manager • 2 candidates waiting for offer approval',
    summaryLabel: '2 candidates',
    impactLabel: 'Move offers forward',
    priorityIcon: 'flag',
    candidates: [
      {
        id: 'amelia-ford',
        name: 'Amelia Ford',
        role: 'HR Manager',
        requestedBy: 'Maya Patel',
        waiting: '2 days',
        since: 'Since 15 May 2025',
        offerSummary: 'SEK 49,000 / year',
        bonus: 'Bonus 6% (SEK 2,940)',
        budgetStatus: 'Within range',
        budgetTone: 'green',
        range: 'Range: SEK 45,000 - 55,000',
        badge: 'Internal',
        avatarTone: 'rose',
        expanded: true,
      },
      {
        id: 'nathan-reed',
        name: 'Nathan Reed',
        role: 'People Operations Lead',
        requestedBy: 'Maya Patel',
        waiting: '3 days',
        since: 'Since 14 May 2025',
        offerSummary: 'SEK 53,000 / year',
        bonus: 'Bonus 7% (SEK 3,710)',
        budgetStatus: 'Within range',
        budgetTone: 'green',
        range: 'Range: SEK 45,000 - 55,000',
        badge: 'Internal',
        avatarTone: 'brown',
      },
    ],
    history: [
      { time: '14 May 2025, 02:20 PM', note: 'Maya Patel requested approval' },
      { time: '15 May 2025, 09:15 AM', note: 'Offer package updated' },
      { time: '15 May 2025, 03:10 PM', note: 'Pending your decision', tone: 'pink' },
    ],
    documents: ['Offer Letter', 'Compensation Package', 'Interview Feedback'],
    aiSuggestion: 'Offer package is aligned with budget. Approval can move both candidates forward this week.',
  },
}

const reviewFeedbackSummary = [
  { label: 'Candidates waiting', value: '5', icon: 'users', tone: 'pink' },
  { label: 'Average overdue', value: '4 days', icon: 'clock', tone: 'orange' },
  { label: 'Potential hire delay', value: '7 days', icon: 'calendar', tone: 'violet' },
  { label: 'Jobs affected', value: '3', icon: 'trend-up', tone: 'green' },
]

const reviewFeedbackCandidates = [
  {
    initials: 'SJ',
    name: 'Sarah Johnson',
    role: 'Frontend Developer',
    department: 'Engineering',
    departmentTone: 'pink',
    missingFrom: 'Priya Singh',
    missingRole: 'Interviewer',
    overdue: '3 days overdue',
    overdueTone: 'orange',
  },
  {
    initials: 'DB',
    name: 'Daniel Brown',
    role: 'Product Manager',
    department: 'Product',
    departmentTone: 'orange',
    missingFrom: 'Alex Rivera',
    missingRole: 'Interviewer',
    overdue: '2 days overdue',
    overdueTone: 'orange',
  },
  {
    initials: 'ES',
    name: 'Emily Smith',
    role: 'Graphic Designer',
    department: 'Design',
    departmentTone: 'violet',
    missingFrom: 'Hiring Manager',
    missingRole: 'Hiring Manager',
    overdue: '5 days overdue',
    overdueTone: 'violet',
  },
  {
    initials: 'LW',
    name: 'Liam Wilson',
    role: 'Account Executive',
    department: 'Sales',
    departmentTone: 'green',
    missingFrom: 'Maya Patel',
    missingRole: 'Interviewer',
    overdue: '1 day overdue',
    overdueTone: 'green',
  },
  {
    initials: 'AC',
    name: 'Ava Carter',
    role: 'Marketing Specialist',
    department: 'Marketing',
    departmentTone: 'orange',
    missingFrom: 'John Lee',
    missingRole: 'Interviewer',
    overdue: '6 days overdue',
    overdueTone: 'orange',
  },
]

const sharePlatformOptions = [
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', tone: 'linkedin' },
  { id: 'email', label: 'Email', shortLabel: '@', tone: 'slate' },
  { id: 'whatsapp', label: 'WhatsApp', shortLabel: 'WA', tone: 'green' },
  { id: 'slack', label: 'Slack', shortLabel: 'S', tone: 'pink' },
  { id: 'teams', label: 'Teams', shortLabel: 'T', tone: 'indigo' },
  { id: 'facebook', label: 'Facebook', shortLabel: 'f', tone: 'blue' },
  { id: 'x', label: 'X (Twitter)', shortLabel: 'X', tone: 'dark' },
  { id: 'more', label: 'More', icon: 'more', tone: 'muted' },
]

const duplicateJobDepartmentOptions = ['Engineering', 'Design', 'Finance', 'Product', 'People', 'Data', 'Marketing']
const duplicateJobLocationOptions = ['Remote', 'Hybrid', 'On-site', 'Stockholm, Sweden']
const duplicateJobEmploymentOptions = ['Full-time', 'Part-time', 'Contract', 'Internship']
const duplicateJobStatusOptions = ['Draft', 'Published', 'Internal Review']
const duplicateJobCurrencyOptions = ['SEK', 'USD', 'EUR', 'GBP']
const duplicateJobHiringManagerOptions = ['Sarah Ahmed', 'Tanya Ahmed', 'Maya Lewis', 'Sarah Parker', 'Emma Lund']
const duplicateJobRecruiterOptions = ['Majda Razzouqia', 'Lina Omar', 'Emma Lund', 'Sarah Parker']
const duplicateJobCopyOptions = [
  { id: 'description', title: 'Job Description', note: 'The full job description', icon: 'document' },
  { id: 'screening', title: 'Screening Questions', note: 'All screening questions', icon: 'clipboard-check' },
  { id: 'scorecard', title: 'Interview Scorecard', note: 'Scorecards and criteria', icon: 'star' },
  { id: 'workflow', title: 'Hiring Workflow', note: 'Stages and automations', icon: 'git-branch' },
  { id: 'team', title: 'Hiring Team', note: 'Team members and roles', icon: 'users' },
  { id: 'application', title: 'Application Form', note: 'All form fields and settings', icon: 'document' },
  { id: 'boards', title: 'Job Board Settings', note: 'Published job boards', icon: 'megaphone' },
  { id: 'automation', title: 'Nitro Automations', note: 'Auto actions and reminders', icon: 'sparkles' },
]
const duplicateJobWorkflowPreview = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']
const duplicateJobPublishSettingOptions = [
  { id: 'draft', title: 'Save as Draft', note: 'Review and publish later' },
  { id: 'immediate', title: 'Publish Immediately', note: 'Make the job live right away' },
  { id: 'scheduled', title: 'Schedule Publication', note: 'Choose date and time' },
]
const reschedulePublicationChannels = [
  { id: 'careerSite', label: 'Career Site', icon: 'building' },
  { id: 'linkedIn', label: 'LinkedIn', icon: 'linkedin' },
  { id: 'indeed', label: 'Indeed', icon: 'indeed' },
  { id: 'glassdoor', label: 'Glassdoor', icon: 'glassdoor' },
]
const pauseJobReasons = [
  { id: 'freeze', label: 'Hiring Freeze', icon: 'sparkles' },
  { id: 'budget', label: 'Budget Review', icon: 'wallet' },
  { id: 'filled', label: 'Position Filled', icon: 'user' },
  { id: 'other', label: 'Other', icon: 'more' },
]
const copilotJobSuggestions = [
  { id: 'summary', label: 'Summarize this job', icon: 'document' },
  { id: 'requirements', label: 'Key requirements', icon: 'checkCircle' },
  { id: 'skills', label: 'Required skills', icon: 'sparkles' },
  { id: 'interview', label: 'Interview questions', icon: 'info' },
  { id: 'fit', label: 'Candidate fit criteria', icon: 'users' },
  { id: 'rewrite', label: 'Rewrite job ad', icon: 'edit' },
]
const copilotJobThreadSuggestions = [
  { id: 'requirements-thread', label: 'What are the key requirements?', icon: 'shield' },
  { id: 'skills-thread', label: 'What skills are required?', icon: 'user' },
  { id: 'salary-thread', label: 'What is the salary range?', icon: 'wallet' },
  { id: 'process-thread', label: 'What is the hiring process?', icon: 'users' },
  { id: 'benefits-thread', label: 'What are the benefits?', icon: 'briefcase' },
  { id: 'team-thread', label: 'What is the team structure?', icon: 'building' },
  { id: 'interview-thread', label: 'Generate interview questions', icon: 'target' },
  { id: 'fit-thread', label: 'Candidate fit criteria', icon: 'user-check' },
  { id: 'rewrite-thread', label: 'Rewrite this job ad', icon: 'edit' },
]
const copilotJobPreviousQuestions = [
  'Summarize this job',
  'What skills are most important for this role?',
]

const completeFeedbackOptions = [
  { value: 'strong-hire', label: 'Strong Hire', icon: 'star' },
  { value: 'hire', label: 'Hire', icon: 'thumbsUp' },
  { value: 'mixed', label: 'Mixed', icon: 'scale' },
  { value: 'no-hire', label: 'No Hire', icon: 'thumbsDown' },
]

const completeFeedbackRatingsTemplate = [
  { key: 'technical', label: 'Technical Skills', value: 5 },
  { key: 'communication', label: 'Communication', value: 5 },
  { key: 'problem-solving', label: 'Problem Solving', value: 4 },
  { key: 'culture', label: 'Culture Add', value: 5 },
]

const completeFeedbackCandidate = {
  name: 'Sarah Johnson',
  role: 'Frontend Developer',
  round: 'Interview Round 2',
  duration: '45 mins',
  completedAt: 'Completed Yesterday',
}

const completeFeedbackRecommendation = ref('strong-hire')
const completeFeedbackNotes = ref('')
const completeFeedbackRatings = ref(
  completeFeedbackRatingsTemplate.reduce((accumulator, item) => {
    accumulator[item.key] = item.value
    return accumulator
  }, {}),
)

const completeFeedbackRows = computed(() => completeFeedbackRatingsTemplate.map((item) => ({
  ...item,
  value: completeFeedbackRatings.value[item.key] ?? item.value,
})))

const sendReminderJob = {
  initials: 'UX',
  title: 'Senior UX Designer',
  location: 'Remote',
  closing: 'Closes in 4 days',
}

const sendReminderPeople = ref([
  {
    id: 'adam-johnson',
    initials: 'AJ',
    name: 'Adam Johnson',
    role: 'Hiring Manager',
    task: 'Review 8 candidates',
    taskIcon: 'users',
    taskTone: 'pink',
    due: 'Overdue by 8 days',
    reminderMeta: 'Last reminder 3 days ago',
    dueTone: 'pink',
    selected: true,
  },
  {
    id: 'sara-wilson',
    initials: 'SW',
    name: 'Sara Wilson',
    role: 'HR Manager',
    task: 'Approve shortlist',
    taskIcon: 'calendar',
    taskTone: 'orange',
    due: 'Due in 2 days',
    reminderMeta: 'Last reminder 1 day ago',
    dueTone: 'orange',
    selected: true,
  },
  {
    id: 'david-brown',
    initials: 'DB',
    name: 'David Brown',
    role: 'Technical Interviewer',
    task: 'Submit scorecards (4)',
    taskIcon: 'star',
    taskTone: 'yellow',
    due: 'Due in 3 days',
    reminderMeta: 'No reminder sent yet',
    dueTone: 'orange',
    selected: true,
  },
])

const scheduleInterviewSortOptions = ['Soonest', 'Latest']

const scheduleInterviewEntries = [
  {
    id: 'john-smith',
    initials: 'JS',
    initialsTone: 'pink',
    name: 'John Smith',
    role: 'UX Designer',
    statusLabel: 'Pending Scheduling',
    statusTone: 'pink',
    interviewType: 'HR Interview',
    timeLabel: 'Suggested time',
    date: 'Tomorrow',
    timeRange: '10:00 AM — 11:00 AM',
    interviewer: 'Sara Wilson',
    interviewerRole: 'HR Manager',
    state: 'To Schedule',
    footerLabel: 'Suggested time based on interviewer availability',
    footerTone: 'blue',
    primaryAction: 'Schedule',
    secondaryAction: 'Skip',
  },
  {
    id: 'sarah-lee',
    initials: 'SL',
    initialsTone: 'green',
    name: 'Sarah Lee',
    role: 'Frontend Developer',
    statusLabel: 'Scheduled',
    statusTone: 'green',
    interviewType: 'Technical Interview',
    timeLabel: 'Scheduled time',
    date: 'Fri, 16 May 2025',
    timeRange: '02:00 PM — 03:00 PM',
    interviewer: 'Adam Johnson',
    interviewerRole: 'Tech Lead',
    state: 'Scheduled',
    footerLabel: 'Interview confirmed',
    footerTone: 'pink',
    primaryAction: 'Reschedule',
    secondaryAction: 'Edit',
  },
]

const closingSoonSummary = [
  { label: 'Jobs closing soon', value: '3', note: 'within 7 days', icon: 'calendar', tone: 'pink' },
  { label: 'Next closing', value: '2 days', note: 'Store Manager', icon: 'clock', tone: 'orange' },
  { label: 'Total applicants', value: '18', note: 'across these jobs', icon: 'users', tone: 'violet' },
  { label: 'Actions needed', value: '2', note: 'to stay on track', icon: 'trend-up', tone: 'green' },
]

const closingSoonJobs = [
  {
    id: 'store-manager',
    initials: 'SM',
    initialsTone: 'pink',
    title: 'Store Manager',
    brand: 'Nike',
    location: 'New York, NY',
    applicants: 3,
    applicantsNote: 'Low applicants',
    closingIn: '2 days left',
    closingPriority: 'High priority',
    closingTone: 'pink',
    closingDate: '16 May 2025',
    closingDay: 'Friday',
    status: 'Critical',
    statusNote: 'Few applicants',
    statusTone: 'pink',
    actionLabel: 'Extend Job',
    actionTone: 'pink',
  },
  {
    id: 'senior-ux-designer',
    initials: 'UX',
    initialsTone: 'blue',
    title: 'Senior UX Designer',
    brand: 'Behance',
    location: 'Remote',
    applicants: 15,
    applicantsNote: '8 not reviewed',
    closingIn: '4 days left',
    closingPriority: 'Medium priority',
    closingTone: 'orange',
    closingDate: '18 May 2025',
    closingDay: 'Sunday',
    status: 'Attention',
    statusNote: 'Review pending',
    statusTone: 'orange',
    actionLabel: 'Review Candidates',
    actionTone: 'orange',
  },
  {
    id: 'warehouse-lead',
    initials: 'WL',
    initialsTone: 'yellow',
    title: 'Warehouse Lead',
    brand: 'Amazon',
    location: 'Dallas, TX',
    applicants: 0,
    applicantsNote: 'No applicants',
    closingIn: '7 days left',
    closingPriority: 'Low priority',
    closingTone: 'yellow',
    closingDate: '21 May 2025',
    closingDay: 'Wednesday',
    status: 'Urgent',
    statusNote: 'No applications',
    statusTone: 'pink',
    actionLabel: 'Boost Job Ad',
    actionTone: 'blue',
  },
]

function buildReviewCandidatesPayload(job) {
  const roleTitle = job?.title ?? 'Senior UX Designer'
  const totalCandidates = job?.applicants ?? 15
  const newCandidates = Math.min(Math.max(totalCandidates - 7, 3), totalCandidates)
  const recommended = Math.min(6, totalCandidates)

  return {
    roleTitle,
    newCandidates,
    totalCandidates,
    recommended,
    aiInsight: `${recommended} candidates strongly match your priority criteria.`,
    candidates: [
      {
        id: 'sophie-chen',
        name: 'Sophie Chen',
        email: 'sophie.chen@email.com',
        role: roleTitle,
        stage: 'Interview',
        stageLabel: 'Interview stage',
        appliedOn: '12 May, 2024',
        experience: '5 yrs',
        experienceNote: '5 years experience',
        location: 'Stockholm, SE',
        locationNote: 'Stockholm, Sweden',
        source: 'LinkedIn',
        aiMatch: 94,
        appliedLabel: '2 hours ago',
        appliedHoursAgo: 2,
        avatarTone: 'violet',
        badge: 'Top match',
        highlights: [
          'Strong portfolio with relevant case studies',
          'Experience in B2B SaaS products',
          'Excellent match for required skills',
          'Previously worked at similar stage startups',
        ],
        resumeName: 'Sophie_Chen_Resume.pdf',
        resumeMeta: 'PDF • 842 KB',
      },
      {
        id: 'alex-martinez',
        name: 'Alex Martinez',
        email: 'alex.martinez@email.com',
        role: roleTitle,
        stage: 'Portfolio review',
        stageLabel: 'Portfolio stage',
        appliedOn: '11 May, 2024',
        experience: '4 yrs',
        experienceNote: '4 years experience',
        location: 'Berlin, DE',
        locationNote: 'Berlin, Germany',
        source: 'Company Career Page',
        aiMatch: 86,
        appliedLabel: '5 hours ago',
        appliedHoursAgo: 5,
        avatarTone: 'green',
        highlights: [
          'Strong product thinking',
          'Shipped mobile and web experiences',
          'Good communication feedback',
        ],
        resumeName: 'Alex_Martinez_Portfolio.pdf',
        resumeMeta: 'PDF • 775 KB',
      },
      {
        id: 'julia-meier',
        name: 'Julia Meier',
        email: 'julia.meier@email.com',
        role: roleTitle,
        stage: 'Interview',
        stageLabel: 'Interview stage',
        appliedOn: '10 May, 2024',
        experience: '6 yrs',
        experienceNote: '6 years experience',
        location: 'Munich, DE',
        locationNote: 'Munich, Germany',
        source: 'LinkedIn',
        aiMatch: 82,
        appliedLabel: '7 hours ago',
        appliedHoursAgo: 7,
        avatarTone: 'sand',
        highlights: [
          'Leadership experience',
          'Strong visual systems background',
          'Worked across global teams',
        ],
        resumeName: 'Julia_Meier_CV.pdf',
        resumeMeta: 'PDF • 690 KB',
      },
      {
        id: 'rohan-patel',
        name: 'Rohan Patel',
        email: 'rohan.patel@email.com',
        role: roleTitle,
        stage: 'Screening',
        stageLabel: 'Screening stage',
        appliedOn: '09 May, 2024',
        experience: '3 yrs',
        experienceNote: '3 years experience',
        location: 'Amsterdam, NL',
        locationNote: 'Amsterdam, Netherlands',
        source: 'Indeed',
        aiMatch: 78,
        appliedLabel: '9 hours ago',
        appliedHoursAgo: 9,
        avatarTone: 'brown',
        highlights: [
          'Strong interface craft',
          'Fast learner with startup experience',
          'Good collaboration signals',
        ],
        resumeName: 'Rohan_Patel_Resume.pdf',
        resumeMeta: 'PDF • 721 KB',
      },
      {
        id: 'emma-johnson',
        name: 'Emma Johnson',
        email: 'emma.johnson@email.com',
        role: roleTitle,
        stage: 'Interview',
        stageLabel: 'Interview stage',
        appliedOn: '08 May, 2024',
        experience: '4 yrs',
        experienceNote: '4 years experience',
        location: 'London, UK',
        locationNote: 'London, United Kingdom',
        source: 'Referral',
        aiMatch: 74,
        appliedLabel: '11 hours ago',
        appliedHoursAgo: 11,
        avatarTone: 'rose',
        highlights: [
          'Relevant referral source',
          'Strong written communication',
          'Good cross-functional background',
        ],
        resumeName: 'Emma_Johnson_Profile.pdf',
        resumeMeta: 'PDF • 655 KB',
      },
    ],
  }
}

const closingSoonFooterActions = [
  { title: 'Extend 1 job', note: 'Avoid losing candidates', icon: 'calendar', tone: 'pink' },
  { title: 'Review 15 candidates', note: 'Keep your pipeline moving', icon: 'users', tone: 'orange' },
  { title: 'Boost 1 job ad', note: 'Increase visibility', icon: 'megaphone', tone: 'blue' },
]

const selectedReminderCount = computed(() => sendReminderPeople.value.filter((person) => person.selected).length)
const allReminderPeopleSelected = computed({
  get: () => sendReminderPeople.value.length > 0 && sendReminderPeople.value.every((person) => person.selected),
  set: (value) => {
    sendReminderPeople.value = sendReminderPeople.value.map((person) => ({
      ...person,
      selected: value,
    }))
  },
})

const scheduleInterviewTabCounts = computed(() => ({
  All: scheduleInterviewEntries.length,
  'To Schedule': scheduleInterviewEntries.filter((entry) => entry.state === 'To Schedule').length,
  Scheduled: scheduleInterviewEntries.filter((entry) => entry.state === 'Scheduled').length,
}))

const filteredScheduleInterviews = computed(() => {
  let entries = [...scheduleInterviewEntries]

  if (scheduleInterviewTab.value !== 'All') {
    entries = entries.filter((entry) => entry.state === scheduleInterviewTab.value)
  }

  if (scheduleInterviewSort.value === 'Latest') {
    entries.reverse()
  }

  return entries
})

const healthLinePoints = computed(() => {
  const values = pipelineHealth.values
  const min = Math.min(...values)
  const max = Math.max(...values)

  return values
    .map((value, index) => {
      const x = (index * 240) / Math.max(values.length - 1, 1)
      const ratio = (value - min) / Math.max(max - min, 1)
      const y = 58 - (ratio * 24)
      return `${x},${y}`
    })
    .join(' ')
})

const activeFilterChips = computed(() => {
  const chips = []

  if (filterForm.value.pipelineStage !== 'All') {
    chips.push({ key: 'pipelineStage', label: `Pipeline Stage: ${filterForm.value.pipelineStage}` })
  }

  if (filterForm.value.expectedHire !== 'Any') {
    chips.push({ key: 'expectedHire', label: `Expected Hire: ${filterForm.value.expectedHire}` })
  }

  if (filterForm.value.daysOpen !== 'Any') {
    chips.push({ key: 'daysOpen', label: `Days Open: ${filterForm.value.daysOpen}` })
  }

  return chips
})

const duplicateJobSelections = ref(
  duplicateJobCopyOptions.reduce((accumulator, option) => {
    accumulator[option.id] = true
    return accumulator
  }, {}),
)

const duplicateSourceJobMeta = computed(() => {
  if (!duplicateJobTarget.value) {
    return ''
  }

  return `${duplicateJobTarget.value.department} · ${duplicateJobTarget.value.location} · ${getJobEmploymentType(duplicateJobTarget.value)}`
})

const duplicateJobSelectedOptions = computed(() => duplicateJobCopyOptions.filter((option) => duplicateJobSelections.value[option.id]))
const duplicateJobSelectedCount = computed(() => duplicateJobSelectedOptions.value.length)
const duplicateJobChangesCount = computed(() => 3)
const duplicateJobAllPanelsOpen = computed(() => Object.values(duplicateJobAdvancedPanels.value).every(Boolean))
const duplicateJobPreviewPositionsLabel = computed(() => {
  const count = Number(duplicateJobForm.value.openPositions) || 0
  return `${duplicateJobForm.value.openPositions} Open Position${count === 1 ? '' : 's'}`
})
const duplicateJobPreviewStatus = computed(() => {
  if (duplicateJobForm.value.publishSetting === 'immediate') {
    return 'Published'
  }

  if (duplicateJobForm.value.publishSetting === 'scheduled') {
    return 'Scheduled'
  }

  return duplicateJobForm.value.status
})
const reschedulePublicationChannelsSelectedCount = computed(() => (
  reschedulePublicationChannels.filter((channel) => reschedulePublicationForm.value[channel.id]).length
))
const reschedulePublicationSelectedChannels = computed(() => (
  reschedulePublicationChannels.filter((channel) => reschedulePublicationForm.value[channel.id])
))

const shareJobUrl = computed(() => getShareJobUrl(shareJobTarget.value))
const shareJobMeta = computed(() => {
  if (!shareJobTarget.value) {
    return ''
  }

  return `${shareJobTarget.value.department} · ${shareJobTarget.value.location}`
})

function openJob(job) {
  emit('open-job', job)
}

function openPipeline(job, stage = '') {
  emit('open-pipeline', {
    jobId: job.id,
    stage: stage || job.stage,
  })
}

function createJob() {
  emit('create-job')
}

function getJobEmploymentType(job) {
  if (!job) {
    return 'Full-time'
  }

  if (job.id === 'da-5502') {
    return 'Internship'
  }

  return 'Full-time'
}

function getDuplicateSourceStatus(job) {
  if (!job) {
    return 'Published'
  }

  return job.status === 'Draft' ? 'Draft' : 'Published'
}

function buildDuplicateJobForm(job) {
  return {
    title: `${job.title} (Copy)`,
    department: job.department,
    location: job.location,
    employmentType: getJobEmploymentType(job),
    openPositions: '1',
    status: 'Draft',
    openingDate: 'May 14, 2024',
    applicationDeadline: 'May 30, 2024',
    targetStartDate: 'June 15, 2024',
    salaryMin: '45,000',
    salaryMax: '60,000',
    currency: 'SEK',
    salaryVisible: true,
    hiringPriority: 'medium',
    hiringManager: 'Sarah Ahmed',
    recruiter: 'Majda Razzouqia',
    copyInterviewPanel: true,
    workflowStages: true,
    approvalWorkflow: true,
    permissions: true,
    autoCandidateMatching: true,
    autoInterviewScheduling: true,
    autoFeedbackReminders: true,
    autoFollowUps: true,
    publishCareerSite: true,
    publishLinkedIn: true,
    publishIndeed: true,
    publishInternalPortal: true,
    publishGlassdoor: false,
    publishMonster: false,
    visibility: 'public',
    publishSetting: 'draft',
    internalCode: `${job.id.toUpperCase()}-COPY`,
  }
}

function resetDuplicateJobSelections() {
  duplicateJobSelections.value = duplicateJobCopyOptions.reduce((accumulator, option) => {
    accumulator[option.id] = true
    return accumulator
  }, {})
}

function resetDuplicateJobPanels() {
  duplicateJobAdvancedPanels.value = {
    hiringDetails: true,
    compensation: true,
    publishing: true,
    hiringTeam: true,
    workflow: true,
    automation: true,
  }
}

function buildDuplicateJobSuccessData() {
  if (!duplicateJobTarget.value) {
    return null
  }

  return {
    sourceJob: duplicateJobTarget.value,
    title: duplicateJobForm.value.title,
    department: duplicateJobForm.value.department,
    location: duplicateJobForm.value.location,
    employmentType: duplicateJobForm.value.employmentType,
    status: duplicateJobPreviewStatus.value,
    form: { ...duplicateJobForm.value },
  }
}

function buildReschedulePublicationForm() {
  return {
    closeDate: '31 Aug 2025',
    republishDate: '15 Sep 2025',
    careerSite: true,
    linkedIn: true,
    indeed: true,
    glassdoor: true,
    keepVisibility: true,
  }
}

function buildPauseJobForm() {
  return {
    reason: 'freeze',
    autoResume: false,
    resumeDate: '',
  }
}

function buildCloseJobForm() {
  return {
    candidateAction: 'keep',
    closingReason: '',
    internalNote: '',
  }
}

function buildArchiveJobForm() {
  return {
    note: '',
  }
}

function buildPauseJobSuccessData() {
  if (!pauseJobTarget.value) {
    return null
  }

  const reason = pauseJobReasons.find((item) => item.id === pauseJobForm.value.reason)

  return {
    job: pauseJobTarget.value,
    pausedOn: '14 May 2024, 10:30 AM',
    reason: reason?.label ?? 'Other',
    autoResumeDate: pauseJobForm.value.resumeDate || '31 Aug 2025',
    resumeMeta: 'In 108 days',
  }
}

function buildReschedulePublicationSuccessData() {
  if (!reschedulePublicationTarget.value) {
    return null
  }

  return {
    job: reschedulePublicationTarget.value,
    closeDate: reschedulePublicationForm.value.closeDate,
    republishDate: reschedulePublicationForm.value.republishDate,
    channels: reschedulePublicationSelectedChannels.value.map((channel) => ({ ...channel })),
    hiddenFor: '15 days',
    closeMeta: 'In 12 days',
    republishMeta: 'In 27 days',
  }
}

function scrollDuplicateJobToTop() {
  if (!duplicateJobBodyRef.value) {
    return
  }

  duplicateJobBodyRef.value.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  requestAnimationFrame(() => {
    duplicateJobBodyRef.value?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  })
}

function openDuplicateJobModal(job) {
  duplicateJobTarget.value = job
  duplicateJobForm.value = buildDuplicateJobForm(job)
  duplicateJobView.value = 'basic'
  resetDuplicateJobPanels()
  resetDuplicateJobSelections()
  duplicateJobModalOpen.value = true
  nextTick(scrollDuplicateJobToTop)
}

function openDuplicateJobAdvancedView() {
  duplicateJobView.value = 'advanced'
  nextTick(scrollDuplicateJobToTop)
}

function closeDuplicateJobModal() {
  scrollDuplicateJobToTop()
  duplicateJobModalOpen.value = false
  duplicateJobTarget.value = null
  duplicateJobView.value = 'basic'
  resetDuplicateJobPanels()
}

function toggleDuplicateJobSelection(optionId) {
  duplicateJobSelections.value = {
    ...duplicateJobSelections.value,
    [optionId]: !duplicateJobSelections.value[optionId],
  }
}

function toggleDuplicateJobPanel(panelId) {
  duplicateJobAdvancedPanels.value = {
    ...duplicateJobAdvancedPanels.value,
    [panelId]: !duplicateJobAdvancedPanels.value[panelId],
  }
}

function toggleAllDuplicateJobPanels() {
  const nextValue = !duplicateJobAllPanelsOpen.value
  duplicateJobAdvancedPanels.value = Object.keys(duplicateJobAdvancedPanels.value).reduce((accumulator, key) => {
    accumulator[key] = nextValue
    return accumulator
  }, {})
}

function submitDuplicateJob() {
  duplicateJobSuccessData.value = buildDuplicateJobSuccessData()
  closeDuplicateJobModal()
  duplicateJobSuccessModalOpen.value = true
}

function closeDuplicateJobSuccessModal() {
  duplicateJobSuccessModalOpen.value = false
  duplicateJobSuccessData.value = null
}

function openReschedulePublicationModal(job) {
  reschedulePublicationTarget.value = job
  reschedulePublicationForm.value = buildReschedulePublicationForm()
  reschedulePublicationModalOpen.value = true
}

function closeReschedulePublicationModal() {
  reschedulePublicationModalOpen.value = false
  reschedulePublicationTarget.value = null
}

function saveReschedulePublication() {
  reschedulePublicationSuccessData.value = buildReschedulePublicationSuccessData()
  closeReschedulePublicationModal()
  reschedulePublicationSuccessModalOpen.value = true
}

function openPauseJobModal(job) {
  pauseJobTarget.value = job
  pauseJobForm.value = buildPauseJobForm()
  pauseJobModalOpen.value = true
}

function closePauseJobModal() {
  pauseJobModalOpen.value = false
  pauseJobTarget.value = null
}

function submitPauseJob() {
  pauseJobSuccessData.value = buildPauseJobSuccessData()
  closePauseJobModal()
  nextTick(() => {
    pauseJobSuccessModalOpen.value = true
  })
}

function closePauseJobSuccessModal() {
  pauseJobSuccessModalOpen.value = false
  pauseJobSuccessData.value = null
}

function viewPausedJob() {
  const job = pauseJobSuccessData.value?.job
  closePauseJobSuccessModal()

  if (job) {
    openJob(job)
  }
}

function resumePausedJobNow() {
  closePauseJobSuccessModal()
}

function openCloseJobModal(job) {
  closeJobTarget.value = job
  closeJobForm.value = buildCloseJobForm()
  closeJobInfoOpen.value = false
  closeJobModalOpen.value = true
}

function closeCloseJobModal() {
  closeJobModalOpen.value = false
  closeJobTarget.value = null
  closeJobInfoOpen.value = false
}

function submitCloseJob() {
  closeCloseJobModal()
}

function openArchiveJobModal(job) {
  archiveJobTarget.value = job
  archiveJobForm.value = buildArchiveJobForm()
  archiveJobInfoOpen.value = false
  archiveJobModalOpen.value = true
}

function closeArchiveJobModal() {
  archiveJobModalOpen.value = false
  archiveJobTarget.value = null
  archiveJobInfoOpen.value = false
}

function submitArchiveJob() {
  closeArchiveJobModal()
}

function openJobsAttentionModal() {
  attentionActiveFilter.value = 'all'
  jobsAttentionModalOpen.value = true
}

function closeJobsAttentionModal() {
  jobsAttentionModalOpen.value = false
}

function openActionPlanModal() {
  actionPlanModalOpen.value = true
  nextTick(() => {
    if (actionPlanBodyRef.value) {
      actionPlanBodyRef.value.scrollTop = 0
    }
  })
}

function closeActionPlanModal() {
  actionPlanModalOpen.value = false
}

function openActionPlanRow(item) {
  if (item.action === 'Send Feedback') {
    openActionPlanFeedbackModal(item)
    return
  }

  if (item.action === 'Review Approvals') {
    openActionPlanApprovalModal(item)
  }
}

function openActionPlanFeedbackModal(item) {
  const scenario = actionPlanFeedbackScenarios[item.id]

  if (!scenario) {
    return
  }

  actionPlanModalOpen.value = false
  actionPlanFeedbackTarget.value = {
    ...item,
    ...scenario,
  }
  actionPlanFeedbackView.value = 'list'
  actionPlanFeedbackActiveCandidate.value = null
  actionPlanFeedbackSelected.value = scenario.candidates.map((candidate) => candidate.id)
  actionPlanFeedbackModalOpen.value = true

  nextTick(() => {
    if (actionPlanFeedbackBodyRef.value) {
      actionPlanFeedbackBodyRef.value.scrollTop = 0
    }
  })
}

function closeActionPlanFeedbackModal() {
  actionPlanFeedbackModalOpen.value = false
  actionPlanFeedbackView.value = 'list'
  actionPlanFeedbackTarget.value = null
  actionPlanFeedbackActiveCandidate.value = null
  actionPlanFeedbackSelected.value = []
}

function toggleActionPlanFeedbackCandidate(candidateId) {
  if (actionPlanFeedbackSelected.value.includes(candidateId)) {
    actionPlanFeedbackSelected.value = actionPlanFeedbackSelected.value.filter((id) => id !== candidateId)
    return
  }

  actionPlanFeedbackSelected.value = [...actionPlanFeedbackSelected.value, candidateId]
}

function toggleActionPlanFeedbackSelectAll() {
  if (actionPlanFeedbackAllSelected.value) {
    actionPlanFeedbackSelected.value = []
    return
  }

  actionPlanFeedbackSelected.value = actionPlanFeedbackCandidates.value.map((candidate) => candidate.id)
}

function buildActionPlanFeedbackMessage(candidate) {
  return `Hi ${candidate.name.split(' ')[0]},

Thank you for taking the time to interview with us.

We were impressed with your skills and experience. We'd like to move you forward to the next round.

We look forward to speaking with you again.

Best regards,
The Nitro Team`
}

function buildActionPlanFeedbackInternalNote(candidate) {
  return `Strong portfolio and communication skills.\nMove ${candidate.name.split(' ')[0]} to the next stage.`
}

function getActionPlanFeedbackNextStage(candidate) {
  if (candidate.stage === 'Interview') {
    return candidate.stageDetail === '1st Round' ? 'Interview - Round 2' : 'Interview - Round 3'
  }

  if (candidate.stage === 'Assessment') {
    return 'Portfolio Review'
  }

  return 'Final Interview'
}

function openActionPlanFeedbackComposer(candidate) {
  actionPlanFeedbackActiveCandidate.value = candidate
  actionPlanFeedbackView.value = 'compose'
  actionPlanFeedbackType.value = 'advance'
  actionPlanFeedbackTemplate.value = candidate.stage === 'Assessment' ? 'Assessment - Move Forward' : 'Interview - Advance to Next Round'
  actionPlanFeedbackMessage.value = buildActionPlanFeedbackMessage(candidate)
  actionPlanFeedbackInternalNote.value = buildActionPlanFeedbackInternalNote(candidate)
  actionPlanFeedbackMoveToNextStage.value = true
  actionPlanFeedbackAddToTalentPool.value = false
  actionPlanFeedbackNextStage.value = getActionPlanFeedbackNextStage(candidate)

  nextTick(() => {
    if (actionPlanFeedbackBodyRef.value) {
      actionPlanFeedbackBodyRef.value.scrollTop = 0
    }
  })
}

function openPrimaryActionPlanFeedbackComposer() {
  const selectedCandidate = actionPlanFeedbackCandidates.value.find((candidate) => actionPlanFeedbackSelected.value.includes(candidate.id))

  if (!selectedCandidate) {
    return
  }

  openActionPlanFeedbackComposer(selectedCandidate)
}

function backToActionPlanFeedbackList() {
  actionPlanFeedbackView.value = 'list'

  nextTick(() => {
    if (actionPlanFeedbackBodyRef.value) {
      actionPlanFeedbackBodyRef.value.scrollTop = 0
    }
  })
}

function applyActionPlanSuggestion(suggestion) {
  if (!actionPlanFeedbackMessage.value) {
    actionPlanFeedbackMessage.value = buildActionPlanFeedbackMessage(actionPlanFeedbackActiveCandidate.value ?? { name: 'Candidate' })
  }

  actionPlanFeedbackMessage.value = `${actionPlanFeedbackMessage.value}\n\n- ${suggestion}`
}

function submitActionPlanCandidateFeedback() {
  closeActionPlanFeedbackModal()
}

function openActionPlanApprovalModal(item) {
  const scenario = actionPlanApprovalScenarios[item.id]

  if (!scenario) {
    return
  }

  actionPlanModalOpen.value = false
  actionPlanApprovalTarget.value = {
    ...item,
    ...scenario,
  }
  actionPlanApprovalSelected.value = scenario.candidates.map((candidate) => candidate.id)
  actionPlanApprovalExpandedId.value = scenario.candidates.find((candidate) => candidate.expanded)?.id ?? scenario.candidates[0]?.id ?? ''
  actionPlanApprovalComments.value = 'Proposed salary exceeds the approved budget range.\n\nPlease revise the offer to a maximum of SEK 52,000 or provide additional business justification.'
  actionPlanApprovalAssignBack.value = 'Sarah Johnson (Recruiter)'
  actionPlanApprovalDueDate.value = 'Within 3 business days'
  actionPlanApprovalReason.value = 'Salary adjustment'
  actionPlanApprovalModalOpen.value = true

  nextTick(() => {
    if (actionPlanApprovalBodyRef.value) {
      actionPlanApprovalBodyRef.value.scrollTop = 0
    }
  })
}

function closeActionPlanApprovalModal() {
  actionPlanApprovalModalOpen.value = false
  actionPlanApprovalTarget.value = null
  actionPlanApprovalSelected.value = []
  actionPlanApprovalExpandedId.value = ''
}

function toggleActionPlanApprovalCandidate(candidateId) {
  if (actionPlanApprovalSelected.value.includes(candidateId)) {
    actionPlanApprovalSelected.value = actionPlanApprovalSelected.value.filter((id) => id !== candidateId)
    return
  }

  actionPlanApprovalSelected.value = [...actionPlanApprovalSelected.value, candidateId]
}

function toggleActionPlanApprovalSelectAll() {
  if (actionPlanApprovalAllSelected.value) {
    actionPlanApprovalSelected.value = []
    return
  }

  actionPlanApprovalSelected.value = actionPlanApprovalCandidates.value.map((candidate) => candidate.id)
}

function toggleActionPlanApprovalExpanded(candidateId) {
  actionPlanApprovalExpandedId.value = actionPlanApprovalExpandedId.value === candidateId ? '' : candidateId
}

function submitActionPlanApprovalRequest() {
  closeActionPlanApprovalModal()
}

function openCopilotJobModal(job) {
  copilotJobTarget.value = job
  copilotJobMode.value = 'default'
  copilotJobQuestion.value = ''
  copilotJobAsked.value = ''
  copilotJobModalOpen.value = true
  resetCopilotJobScroll()
}

function closeCopilotJobModal() {
  copilotJobModalOpen.value = false
  copilotJobTarget.value = null
  copilotJobMode.value = 'default'
  copilotJobQuestion.value = ''
  copilotJobAsked.value = ''
}

function setCopilotJobQuestion(question, suggestionId = '') {
  copilotJobQuestion.value = question

  if (suggestionId === 'summary') {
    copilotJobAsked.value = question
    copilotJobMode.value = 'summary'
    resetCopilotJobScroll()
  }
}

function submitCopilotJobQuestion() {
  if (!copilotJobQuestion.value.trim()) {
    copilotJobQuestion.value = 'Summarize this job'
  }

  copilotJobAsked.value = copilotJobQuestion.value
  copilotJobMode.value = 'summary'
  resetCopilotJobScroll()
}

function openCopilotThreadMode() {
  copilotJobMode.value = 'thread'
  copilotJobQuestion.value = ''
  resetCopilotJobScroll()
}

function viewCopilotPreviousThread() {
  copilotJobMode.value = 'summary'
  copilotJobAsked.value = copilotJobAsked.value || 'Summarize this job'
  resetCopilotJobScroll()
}

function resetCopilotJobQuestion() {
  copilotJobMode.value = 'default'
  copilotJobQuestion.value = ''
  copilotJobAsked.value = ''
  resetCopilotJobScroll()
}

async function copyCopilotAnswer() {
  await copyText('This role is focused on designing user experiences that are intuitive, accessible and impactful. You will collaborate closely with product, engineering and stakeholders to deliver high-quality digital solutions.')
}

async function copyCopilotChat() {
  await copyText(`Summarize this job\nWhat skills are most important for this role?\n${copilotJobAsked.value || 'Summarize this job'}`)
}

function resetCopilotJobScroll() {
  nextTick(() => {
    copilotJobBodyRef.value?.scrollTo({ top: 0, behavior: 'auto' })
  })
}

function closeReschedulePublicationSuccessModal() {
  reschedulePublicationSuccessModalOpen.value = false
  reschedulePublicationSuccessData.value = null
}

function viewRescheduledJob() {
  const job = reschedulePublicationSuccessData.value?.job
  closeReschedulePublicationSuccessModal()

  if (job) {
    openJob(job)
  }
}

function continueEditingDuplicatedJob() {
  if (!duplicateJobSuccessData.value?.sourceJob) {
    closeDuplicateJobSuccessModal()
    return
  }

  duplicateJobTarget.value = duplicateJobSuccessData.value.sourceJob
  duplicateJobForm.value = { ...duplicateJobSuccessData.value.form }
  duplicateJobView.value = 'advanced'
  duplicateJobModalOpen.value = true
  duplicateJobSuccessModalOpen.value = false
  nextTick(scrollDuplicateJobToTop)
}

function viewDuplicatedJob() {
  const sourceJob = duplicateJobSuccessData.value?.sourceJob
  closeDuplicateJobSuccessModal()

  if (sourceJob) {
    openJob(sourceJob)
  }
}

function getShareJobUrl(job) {
  if (!job || typeof window === 'undefined') {
    return ''
  }

  return `${window.location.origin}${window.location.pathname}#job/${job.id}`
}

async function copyText(value) {
  if (!value || typeof navigator === 'undefined') {
    return false
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {}

  if (typeof document === 'undefined') {
    return false
  }

  const textArea = document.createElement('textarea')
  textArea.value = value
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'absolute'
  textArea.style.left = '-9999px'
  document.body.appendChild(textArea)
  textArea.select()

  let copied = false

  try {
    copied = document.execCommand('copy')
  } catch {}

  document.body.removeChild(textArea)
  return copied
}

function openShareJobModal(job) {
  shareJobTarget.value = job
  shareJobCopied.value = false
  shareJobModalOpen.value = true
}

function closeShareJobModal() {
  shareJobModalOpen.value = false
  shareJobTarget.value = null
  shareJobCopied.value = false
}

async function copyShareJobLink() {
  shareJobCopied.value = await copyText(shareJobUrl.value)
}

function openExternalShareUrl(url) {
  if (!url || typeof window === 'undefined') {
    return
  }

  if (url.startsWith('mailto:')) {
    window.location.href = url
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

async function handleSharePlatform(platformId) {
  if (!shareJobTarget.value) {
    return
  }

  const shareText = `Check out this role: ${shareJobTarget.value.title} (${shareJobTarget.value.department})`
  const jobUrl = shareJobUrl.value
  const encodedUrl = encodeURIComponent(jobUrl)
  const encodedText = encodeURIComponent(shareText)

  if (platformId === 'linkedin') {
    openExternalShareUrl(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)
    return
  }

  if (platformId === 'email') {
    openExternalShareUrl(`mailto:?subject=${encodeURIComponent(shareJobTarget.value.title)}&body=${encodedText}%0A%0A${encodedUrl}`)
    return
  }

  if (platformId === 'whatsapp') {
    openExternalShareUrl(`https://wa.me/?text=${encodedText}%20${encodedUrl}`)
    return
  }

  if (platformId === 'facebook') {
    openExternalShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)
    return
  }

  if (platformId === 'x') {
    openExternalShareUrl(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`)
    return
  }

  if ((platformId === 'slack' || platformId === 'teams' || platformId === 'more') && typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: shareJobTarget.value.title,
        text: shareText,
        url: jobUrl,
      })
      return
    } catch {}
  }

  await copyShareJobLink()
}

function previewSharedJob() {
  openExternalShareUrl(shareJobUrl.value)
}

function downloadShareJobQr() {
  if (!shareJobUrl.value || typeof document === 'undefined') {
    return
  }

  const link = document.createElement('a')
  link.href = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(shareJobUrl.value)}`
  link.download = `${shareJobTarget.value?.id ?? 'job'}-qr.png`
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function openReviewFeedbackModal() {
  reviewFeedbackModalOpen.value = true
}

function closeReviewFeedbackModal() {
  reviewFeedbackModalOpen.value = false
}

function openCompleteFeedbackModal() {
  reviewFeedbackModalOpen.value = false
  completeFeedbackModalOpen.value = true
}

function closeCompleteFeedbackModal() {
  completeFeedbackModalOpen.value = false
}

function submitCompleteFeedback() {
  completeFeedbackModalOpen.value = false
  feedbackSuccessModalOpen.value = true
}

function closeFeedbackSuccessModal() {
  feedbackSuccessModalOpen.value = false
}

function openSendReminderModal() {
  sendReminderModalOpen.value = true
}

function closeSendReminderModal() {
  sendReminderModalOpen.value = false
}

function setCompleteFeedbackRating(key, value) {
  completeFeedbackRatings.value = {
    ...completeFeedbackRatings.value,
    [key]: value,
  }
}

function openScheduleInterviewsModal() {
  scheduleInterviewsModalOpen.value = true
}

function closeScheduleInterviewsModal() {
  scheduleInterviewsModalOpen.value = false
}

function openClosingSoonJobsModal() {
  closingSoonJobsModalOpen.value = true
}

function closeClosingSoonJobsModal() {
  closingSoonJobsModalOpen.value = false
}

function openReviewCandidatesModal(job) {
  const payload = buildReviewCandidatesPayload(job)
  reviewCandidatesTarget.value = payload
  reviewCandidatesSearch.value = ''
  reviewCandidatesSort.value = 'Newest'
  reviewCandidatesSelectedIds.value = payload.candidates.length ? [payload.candidates[0].id] : []
  reviewCandidatesActiveId.value = payload.candidates[0]?.id ?? ''
  closingSoonJobsModalOpen.value = false
  reviewCandidatesModalOpen.value = true
}

function closeReviewCandidatesStandaloneModal() {
  closeReviewCandidatesTalentPoolSuccessModal()
  closeReviewCandidatesTalentPoolModal()
  closeReviewCandidatesNoteModal()
  closeReviewCandidatesEmailModal()
  closeReviewCandidatesActionMenu()
  reviewCandidatesModalOpen.value = false
  reviewCandidatesTarget.value = null
  reviewCandidatesSearch.value = ''
  reviewCandidatesSelectedIds.value = []
  reviewCandidatesActiveId.value = ''
}

function buildReviewCandidatesEmailMessage(candidate) {
  return renderReviewCandidatesEmailTemplate(selectedReviewCandidatesEmailTemplate.value, candidate).body
}

function buildReviewCandidatesNoteDraft(candidate) {
  const intro = candidate.role.includes('Designer')
    ? 'Strong portfolio with great visual design skills.'
    : 'Strong candidate profile with relevant experience.'

  return [
    intro,
    '',
    'Good communication during the interview.',
    '',
    'Showed strong understanding of the role requirements and team fit.',
    '',
    'Would be a good fit for the product team.',
  ].join('\n')
}

function buildReviewCandidatesNoteTags(candidate) {
  const roleTag = candidate.role.includes('Designer') ? 'Design' : 'Hiring'
  return [candidate.stage, roleTag]
}

function buildReviewCandidatesTalentPoolTags(candidate) {
  if (candidate.role.includes('Designer')) {
    return ['Figma', 'UX Research', 'Design Systems', 'User Interface']
  }

  return ['Product Thinking', 'Collaboration', 'Communication']
}

function syncReviewCandidatesEmailTemplateDraft(templateId = reviewCandidatesEmailSelectedTemplateId.value) {
  const template = reviewCandidatesEmailTemplates.find((item) => item.id === templateId) ?? reviewCandidatesEmailTemplates[0]
  reviewCandidatesEmailSelectedTemplateId.value = template.id
  reviewCandidatesEmailTemplateDraftSubject.value = template.subject
  reviewCandidatesEmailTemplateDraftBody.value = template.body
}

function renderReviewCandidatesEmailTemplate(template, candidate) {
  const values = {
    '{%candidateName%}': candidate?.name ?? 'Candidate',
    '{%jobTitle%}': reviewCandidatesTarget.value?.roleTitle ?? candidate?.role ?? 'Role',
    '{%companyName%}': 'NitroSync',
    '{%interviewDate%}': reviewCandidatesEmailDate.value,
    '{%interviewTime%}': reviewCandidatesEmailTime.value,
    '{%recruiterName%}': 'Sarah Johnson',
  }

  const replaceTokens = (text) => Object.entries(values).reduce(
    (result, [token, value]) => result.replaceAll(token, value),
    text,
  )

  return {
    subject: replaceTokens(template.subject),
    body: replaceTokens(template.body),
  }
}

function openReviewCandidatesEmailModal(candidate) {
  reviewCandidatesActiveId.value = candidate.id
  reviewCandidatesEmailTarget.value = candidate
  reviewCandidatesEmailTemplate.value = ''
  reviewCandidatesEmailSelectedTemplateId.value = 'interview-invitation'
  reviewCandidatesEmailTemplateSearch.value = ''
  reviewCandidatesEmailTemplateCategory.value = 'All'
  reviewCandidatesEmailSendOption.value = 'Schedule email'
  reviewCandidatesEmailDate.value = '22 Jul 2024'
  reviewCandidatesEmailTime.value = '09:00 AM'
  reviewCandidatesEmailTimezone.value = candidate.location.startsWith('London')
    ? 'Europe/London (GMT+1)'
    : candidate.location.startsWith('Berlin')
      ? 'Europe/Berlin (GMT+2)'
      : 'Europe/Stockholm (GMT+2)'
  const personalizedTemplate = renderReviewCandidatesEmailTemplate(selectedReviewCandidatesEmailTemplate.value, candidate)
  reviewCandidatesEmailSubject.value = personalizedTemplate.subject
  reviewCandidatesEmailMessage.value = personalizedTemplate.body
  closeReviewCandidatesActionMenu()
  reviewCandidatesEmailModalOpen.value = true
}

function closeReviewCandidatesEmailModal() {
  closeReviewCandidatesEmailTemplateModal()
  reviewCandidatesEmailModalOpen.value = false
  reviewCandidatesEmailTarget.value = null
}

function openReviewCandidatesNoteModal(candidate) {
  reviewCandidatesActiveId.value = candidate.id
  reviewCandidatesNoteTarget.value = candidate
  reviewCandidatesNoteVisibility.value = 'Hiring Team'
  reviewCandidatesNoteBody.value = buildReviewCandidatesNoteDraft(candidate)
  reviewCandidatesNoteReminderDate.value = '22 May, 2024'
  reviewCandidatesNoteReminderTime.value = '10:00 AM'
  reviewCandidatesNoteFollowUpTask.value = true
  reviewCandidatesNoteTags.value = buildReviewCandidatesNoteTags(candidate)
  closeReviewCandidatesActionMenu()
  reviewCandidatesNoteModalOpen.value = true
}

function closeReviewCandidatesNoteModal() {
  reviewCandidatesNoteModalOpen.value = false
  reviewCandidatesNoteTarget.value = null
}

function removeReviewCandidatesNoteTag(tagToRemove) {
  reviewCandidatesNoteTags.value = reviewCandidatesNoteTags.value.filter((tag) => tag !== tagToRemove)
}

function saveReviewCandidatesNote() {
  closeReviewCandidatesNoteModal()
}

function openReviewCandidatesTalentPoolModal(candidate) {
  reviewCandidatesActiveId.value = candidate.id
  reviewCandidatesTalentPoolTarget.value = candidate
  reviewCandidatesTalentPoolName.value = candidate.role.includes('Designer') ? 'UX Designers' : 'Product Candidates'
  reviewCandidatesTalentPoolReason.value = 'Strong candidate'
  reviewCandidatesTalentPoolTags.value = buildReviewCandidatesTalentPoolTags(candidate)
  reviewCandidatesTalentPoolNote.value = `Strong portfolio and good interview performance. Consider for future senior ${candidate.role} roles.`
  reviewCandidatesTalentPoolRemindLater.value = true
  reviewCandidatesTalentPoolReminderDate.value = '22 Jul 2026'
  reviewCandidatesTalentPoolReminderTime.value = '09:00 AM'
  reviewCandidatesTalentPoolVisibility.value = 'Hiring team'
  closeReviewCandidatesActionMenu()
  reviewCandidatesTalentPoolModalOpen.value = true
}

function closeReviewCandidatesTalentPoolModal() {
  reviewCandidatesTalentPoolModalOpen.value = false
  reviewCandidatesTalentPoolTarget.value = null
}

function closeReviewCandidatesTalentPoolSuccessModal() {
  reviewCandidatesTalentPoolSuccessOpen.value = false
  reviewCandidatesTalentPoolSuccessData.value = null
}

function removeReviewCandidatesTalentPoolTag(tagToRemove) {
  reviewCandidatesTalentPoolTags.value = reviewCandidatesTalentPoolTags.value.filter((tag) => tag !== tagToRemove)
}

function saveReviewCandidatesTalentPool() {
  reviewCandidatesTalentPoolSuccessData.value = {
    candidateName: reviewCandidatesTalentPoolTarget.value?.name ?? 'Candidate',
    poolName: reviewCandidatesTalentPoolName.value,
    tags: [...reviewCandidatesTalentPoolTags.value],
    reminder: reviewCandidatesTalentPoolRemindLater.value
      ? `${reviewCandidatesTalentPoolReminderDate.value} • ${reviewCandidatesTalentPoolReminderTime.value}`
      : '',
  }
  closeReviewCandidatesTalentPoolModal()
  reviewCandidatesTalentPoolSuccessOpen.value = true
}

function openReviewCandidatesEmailTemplateModal() {
  reviewCandidatesEmailTemplateSearch.value = ''
  reviewCandidatesEmailTemplateCategory.value = 'All'
  syncReviewCandidatesEmailTemplateDraft()
  reviewCandidatesEmailTemplateModalOpen.value = true
}

function closeReviewCandidatesEmailTemplateModal() {
  reviewCandidatesEmailTemplateModalOpen.value = false
}

function selectReviewCandidatesEmailTemplate(templateId) {
  syncReviewCandidatesEmailTemplateDraft(templateId)
}

function applyReviewCandidatesEmailTemplate() {
  const template = selectedReviewCandidatesEmailTemplate.value
  reviewCandidatesEmailTemplate.value = template.title
  const personalizedTemplate = renderReviewCandidatesEmailTemplate({
    ...template,
    subject: reviewCandidatesEmailTemplateDraftSubject.value,
    body: reviewCandidatesEmailTemplateDraftBody.value,
  }, reviewCandidatesEmailTarget.value)
  reviewCandidatesEmailSubject.value = personalizedTemplate.subject
  reviewCandidatesEmailMessage.value = personalizedTemplate.body
  closeReviewCandidatesEmailTemplateModal()
}

function toggleReviewCandidatesSelection(candidateId) {
  if (reviewCandidatesSelectedIds.value.includes(candidateId)) {
    reviewCandidatesSelectedIds.value = reviewCandidatesSelectedIds.value.filter((id) => id !== candidateId)
    return
  }

  reviewCandidatesSelectedIds.value = [...reviewCandidatesSelectedIds.value, candidateId]
}

function selectReviewCandidate(candidateId) {
  closeReviewCandidatesActionMenu()
  reviewCandidatesActiveId.value = candidateId
}

function clearReviewCandidatesSelection() {
  reviewCandidatesSelectedIds.value = []
}

function toggleReviewCandidatesActionMenu(candidate, event) {
  if (reviewCandidatesActionMenu.value?.candidate.id === candidate.id) {
    closeReviewCandidatesActionMenu()
    return
  }

  reviewCandidatesActiveId.value = candidate.id
  reviewCandidatesActionMenu.value = {
    candidate,
    anchorEl: event.currentTarget,
    top: 0,
    left: 0,
  }

  nextTick(positionReviewCandidatesActionMenu)
}

function positionReviewCandidatesActionMenu() {
  if (!reviewCandidatesActionMenu.value || !reviewCandidatesActionMenuRef.value) {
    return
  }

  const anchorEl = reviewCandidatesActionMenu.value.anchorEl

  if (!(anchorEl instanceof Element) || !document.body.contains(anchorEl)) {
    closeReviewCandidatesActionMenu()
    return
  }

  const rect = anchorEl.getBoundingClientRect()
  const margin = 12
  const menuWidth = reviewCandidatesActionMenuRef.value.offsetWidth
  const menuHeight = reviewCandidatesActionMenuRef.value.offsetHeight
  let left = rect.right - menuWidth
  let top = rect.bottom + 10

  if (left + menuWidth > window.innerWidth - margin) {
    left = window.innerWidth - menuWidth - margin
  }

  if (left < margin) {
    left = margin
  }

  if (top + menuHeight > window.innerHeight - margin) {
    top = rect.top - menuHeight - 10
  }

  if (top < margin) {
    top = margin
  }

  reviewCandidatesActionMenu.value = {
    ...reviewCandidatesActionMenu.value,
    top,
    left,
  }
}

function closeReviewCandidatesActionMenu() {
  if (reviewCandidatesActionMenuRaf) {
    cancelAnimationFrame(reviewCandidatesActionMenuRaf)
    reviewCandidatesActionMenuRaf = 0
  }

  reviewCandidatesActionMenu.value = null
}

function handleReviewCandidatesMenuAction(actionId, candidate) {
  reviewCandidatesActiveId.value = candidate.id

  if (actionId === 'message') {
    openReviewCandidatesEmailModal(candidate)
    return
  }

  if (actionId === 'schedule') {
    closeReviewCandidatesActionMenu()
    openScheduleInterviewsModal()
    return
  }

  if (actionId === 'note') {
    openReviewCandidatesNoteModal(candidate)
    return
  }

  if (actionId === 'talent-pool') {
    openReviewCandidatesTalentPoolModal(candidate)
    return
  }

  closeReviewCandidatesActionMenu()
}

function handleClosingSoonAction(job) {
  if (job.actionLabel === 'Review Candidates') {
    openReviewCandidatesModal(job)
  }
}

function toggleReminderRecipient(personId) {
  sendReminderPeople.value = sendReminderPeople.value.map((person) => (
    person.id === personId
      ? { ...person, selected: !person.selected }
      : person
  ))
}

function handleBriefingQuickAction(item) {
  if (item.title === 'Review feedback') {
    openReviewFeedbackModal()
    return
  }

  if (item.title === 'Schedule interviews') {
    openScheduleInterviewsModal()
    return
  }

  if (item.title === 'View closing soon jobs') {
    openClosingSoonJobsModal()
    return
  }

  if (item.title === 'Create a new job') {
    createJob()
  }
}

function attentionIconName(tone) {
  if (tone === 'green') {
    return 'checkCircle'
  }

  if (tone === 'slate') {
    return 'info'
  }

  return 'alert'
}

function hasPipelineData(job) {
  return job.pipeline.some((stage) => stage.value > 0)
}

function ownerInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function sourceToneClass(tone) {
  return `tone-${tone || 'blue'}`
}

function openFilterModal() {
  filterModalOpen.value = true
}

function closeFilterModal() {
  filterModalOpen.value = false
}

function applyFilters() {
  filterModalOpen.value = false
}

function resetFilters() {
  filterForm.value = {
    status: 'All',
    hiringHealth: 'All',
    pipelineStage: 'All',
    attention: 'All',
    department: 'All',
    hiringManager: 'Any',
    recruiter: 'Any',
    jobType: 'All',
    daysOpen: 'Any',
    expectedHire: 'Any',
    location: 'Any',
    workLocation: 'All',
  }
}

function restoreDefaultFilters() {
  filterForm.value = getDefaultFilterState()
}

function removeFilterChip(key) {
  if (key === 'pipelineStage') {
    filterForm.value.pipelineStage = 'All'
  }

  if (key === 'expectedHire') {
    filterForm.value.expectedHire = 'Any'
  }

  if (key === 'daysOpen') {
    filterForm.value.daysOpen = 'Any'
  }
}

function toggleRowMenu(job, event) {
  if (actionMenu.value?.job.id === job.id) {
    closeRowMenu()
    return
  }

  actionMenu.value = {
    job,
    anchorEl: event.currentTarget,
    top: 0,
    left: 0,
  }

  nextTick(positionRowMenu)
}

function positionRowMenu() {
  if (!actionMenu.value || !actionMenuRef.value) {
    return
  }

  const anchorEl = actionMenu.value.anchorEl

  if (!(anchorEl instanceof Element) || !document.body.contains(anchorEl)) {
    closeRowMenu()
    return
  }

  const rect = anchorEl.getBoundingClientRect()

  const margin = 12
  const menuWidth = actionMenuRef.value.offsetWidth
  const menuHeight = actionMenuRef.value.offsetHeight
  let left = rect.right - menuWidth
  let top = rect.bottom + 8

  if (left + menuWidth > window.innerWidth - margin) {
    left = window.innerWidth - menuWidth - margin
  }

  if (left < margin) {
    left = margin
  }

  if (top + menuHeight > window.innerHeight - margin) {
    top = rect.top - menuHeight - 8
  }

  if (top < margin) {
    top = margin
  }

  actionMenu.value = {
    ...actionMenu.value,
    top,
    left,
  }
}

function closeRowMenu() {
  if (actionMenuRaf) {
    cancelAnimationFrame(actionMenuRaf)
    actionMenuRaf = 0
  }

  actionMenu.value = null
}

async function handleRowMenuAction(actionId, job) {
  if (actionId === 'open') {
    closeRowMenu()
    openJob(job)
    return
  }

  if (actionId === 'candidates') {
    closeRowMenu()
    openPipeline(job)
    return
  }

  if (actionId === 'schedule') {
    closeRowMenu()
    openScheduleInterviewsModal()
    return
  }

  if (actionId === 'duplicate') {
    openDuplicateJobModal(job)
    closeRowMenu()
    return
  }

  if (actionId === 'share') {
    openShareJobModal(job)
    closeRowMenu()
    return
  }

  if (actionId === 'publish') {
    openReschedulePublicationModal(job)
    closeRowMenu()
    return
  }

  if (actionId === 'pause') {
    openPauseJobModal(job)
    closeRowMenu()
    return
  }

  if (actionId === 'close') {
    openCloseJobModal(job)
    closeRowMenu()
    return
  }

  if (actionId === 'archive') {
    openArchiveJobModal(job)
    closeRowMenu()
    return
  }

  if (actionId === 'ask-ai') {
    openCopilotJobModal(job)
    closeRowMenu()
    return
  }

  if (actionId === 'copy-link') {
    await copyText(getShareJobUrl(job))
  }

  closeRowMenu()
}

function handleDocumentPointerDown(event) {
  if (!event.target.closest('.row-action')) {
    if (!actionMenuRef.value || !actionMenuRef.value.contains(event.target)) {
      closeRowMenu()
    }
  }

  if (!event.target.closest('.review-candidates-row__more')) {
    if (!reviewCandidatesActionMenuRef.value || !reviewCandidatesActionMenuRef.value.contains(event.target)) {
      closeReviewCandidatesActionMenu()
    }
  }
}

function handleEscape(event) {
  if (event.key === 'Escape') {
    closeRowMenu()
    closeReviewCandidatesActionMenu()
    closeReviewCandidatesEmailTemplateModal()
    closeReviewCandidatesEmailModal()
    closeReviewCandidatesNoteModal()
    closeReviewCandidatesTalentPoolModal()
    closeReviewCandidatesTalentPoolSuccessModal()
    closeFilterModal()
    closeReviewFeedbackModal()
    closeSendReminderModal()
    closeDuplicateJobModal()
    closeDuplicateJobSuccessModal()
    closeShareJobModal()
    closeScheduleInterviewsModal()
    closeClosingSoonJobsModal()
    closeReschedulePublicationModal()
    closeReschedulePublicationSuccessModal()
    closePauseJobModal()
    closePauseJobSuccessModal()
    closeCloseJobModal()
    closeArchiveJobModal()
    closeJobsAttentionModal()
    closeActionPlanModal()
    closeActionPlanFeedbackModal()
    closeCopilotJobModal()
  }
}

function syncRowMenuPosition() {
  if (actionMenu.value) {
    if (actionMenuRaf) {
      cancelAnimationFrame(actionMenuRaf)
    }

    actionMenuRaf = requestAnimationFrame(() => {
      actionMenuRaf = 0
      positionRowMenu()
    })
  }

  if (reviewCandidatesActionMenu.value) {
    if (reviewCandidatesActionMenuRaf) {
      cancelAnimationFrame(reviewCandidatesActionMenuRaf)
    }

    reviewCandidatesActionMenuRaf = requestAnimationFrame(() => {
      reviewCandidatesActionMenuRaf = 0
      positionReviewCandidatesActionMenu()
    })
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  window.addEventListener('keydown', handleEscape)
  window.addEventListener('resize', syncRowMenuPosition)
  window.addEventListener('scroll', syncRowMenuPosition, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  window.removeEventListener('keydown', handleEscape)
  window.removeEventListener('resize', syncRowMenuPosition)
  window.removeEventListener('scroll', syncRowMenuPosition, true)
})
</script>

<template>
  <main class="jobs-page">
    <section class="jobs-page__top">
      <section class="jobs-hero">
        <div class="jobs-hero__copy">
          <div class="jobs-hero__title-row">
            <h1>Jobs</h1>
            <span v-if="activeView === 'brief'" class="hero-mode-pill">
              <AppIcon name="sparkles" :size="12" />
              Briefing View
            </span>
          </div>
          <p>{{ activeView === 'brief' ? 'Your daily briefing of what matters most.' : 'Manage your open roles and pipeline in one place.' }}</p>
        </div>

        <button v-if="activeView !== 'brief'" class="create-button" type="button" @click="createJob">
          <AppIcon name="plus" :size="14" />
          Create Job
          <AppIcon name="chevronDown" :size="14" />
        </button>
      </section>

      <section class="stats-grid">
        <article v-for="card in jobsSummary" :key="card.label" class="stat-card panel">
          <div class="stat-card__icon" :class="`tone-${card.tone}`">
            <AppIcon :name="card.icon" :size="18" />
          </div>
          <strong class="stat-card__value">{{ card.value }}</strong>
          <span class="stat-card__label">{{ card.label }}</span>
          <small class="stat-card__delta" :class="{ negative: card.negative }">
            <AppIcon :name="card.negative ? 'chevronDown' : 'chevronUp'" :size="11" />
            {{ card.delta }}
          </small>
        </article>
      </section>
    </section>

    <section class="jobs-page__content">
      <section class="jobs-board panel">
        <div class="jobs-board__top">
          <div class="view-tabs">
            <button
              v-for="tab in viewTabs"
              :key="tab.id"
              class="view-tab"
              :class="{ 'is-active': activeView === tab.id }"
              type="button"
              @click="activeView = tab.id"
            >
              <AppIcon :name="tab.icon" :size="14" />
              {{ tab.label }}
            </button>
          </div>

          <div class="board-tools">
            <label class="board-search">
              <AppIcon name="search" :size="15" />
              <input v-model="searchQuery" type="text" placeholder="Search jobs..." />
            </label>
            <button class="tool-button" type="button" @click="openFilterModal">
              <AppIcon name="filter" :size="14" />
              Filters
            </button>
            <button class="tool-button" type="button">Save View</button>
          </div>
        </div>

        <div v-if="activeView === 'list'" class="jobs-table-wrap">
          <table class="jobs-table">
            <colgroup>
              <col class="jobs-table__col jobs-table__col--role">
              <col class="jobs-table__col jobs-table__col--pipeline">
              <col class="jobs-table__col jobs-table__col--health">
              <col class="jobs-table__col jobs-table__col--attention">
              <col class="jobs-table__col jobs-table__col--forecast">
              <col class="jobs-table__col jobs-table__col--days">
              <col class="jobs-table__col jobs-table__col--actions">
            </colgroup>
            <thead>
              <tr>
                <th>JOB / DEPARTMENT</th>
                <th>PIPELINE (STAGES)</th>
                <th>HEALTH</th>
                <th>ATTENTION</th>
                <th>FORECAST</th>
                <th>DAYS OPEN</th>
                <th class="sort-cell">&#8597;</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="job in visibleJobs" :key="job.id">
                <td>
                  <div class="job-role-cell">
                    <input type="checkbox" />
                    <button class="job-role-button" type="button" @click="openJob(job)">
                      <div class="job-role-top">
                        <strong>{{ job.title }}</strong>
                        <AppIcon v-if="job.isStarred" name="star" :size="12" />
                      </div>
                      <span>{{ job.department }} &middot; {{ job.location }}</span>
                      <small class="job-status-pill" :class="`job-status-pill--${job.status.toLowerCase().replace(/ /g, '-')}`">
                        {{ job.status }}
                      </small>
                    </button>
                  </div>
                </td>

                <td>
                  <div v-if="hasPipelineData(job)" class="pipeline-cell">
                    <button class="pipeline-open-button" type="button" @click="openPipeline(job)">
                      <div class="pipeline-track">
                        <div
                          v-for="stage in job.pipeline"
                          :key="`${job.id}-${stage.label}-segment`"
                          class="pipeline-track__segment"
                          :class="[`tone-${stage.tone}`, { 'is-empty': stage.value === 0 }]"
                        />
                      </div>
                      <div class="pipeline-values">
                        <span v-for="stage in job.pipeline" :key="`${job.id}-${stage.label}-value`">{{ stage.value }}</span>
                      </div>
                    </button>
                  </div>
                  <div v-else class="pipeline-empty">&mdash;</div>
                </td>

                <td>
                  <div class="status-cell">
                    <div class="status-cell__badge" :class="`status-cell__badge--${job.health.tone}`">
                      {{ job.health.score }}
                    </div>
                    <div class="status-copy">
                      <strong>{{ job.health.label }}</strong>
                      <span>{{ job.health.note }}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="status-cell">
                    <div class="status-cell__icon-wrap" :class="`tone-${job.attention.tone}`">
                      <AppIcon :name="attentionIconName(job.attention.tone)" :size="14" />
                    </div>
                    <div class="status-copy">
                      <strong>{{ job.attention.label }}</strong>
                      <span>{{ job.attention.note }}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="forecast-cell">
                    <strong>{{ job.forecast.label }}</strong>
                    <span class="forecast-note" :class="`forecast-note--${job.forecast.tone}`">
                      {{ job.forecast.note }}
                    </span>
                  </div>
                </td>

                <td>
                  <div class="days-cell">
                    <strong>{{ job.daysOpen }}</strong>
                    <span>days</span>
                  </div>
                </td>

                <td class="row-action-cell">
                  <button
                    class="row-action"
                    :class="{ 'is-open': actionMenu?.job.id === job.id }"
                    type="button"
                    @click.stop="toggleRowMenu(job, $event)"
                  >
                    <AppIcon name="more" :size="15" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="activeView === 'brief'" class="briefing-view">
          <section class="briefing-glance">
            <div class="briefing-glance__copy">
              <span>Today at a glance</span>
              <h2>You have <mark>{{ briefingSummary.attentionCount }} jobs</mark> requiring attention</h2>
            </div>

            <div class="briefing-glance__stats">
              <div v-for="metric in briefingSummaryMetrics" :key="metric.label" class="briefing-glance__stat">
                <strong :class="`is-${metric.tone}`">{{ metric.value }}</strong>
                <span>{{ metric.label }}</span>
              </div>

              <div class="briefing-glance__ring">
                <AppIcon name="checkCircle" :size="24" />
              </div>
            </div>
          </section>

          <section class="briefing-section">
            <div class="briefing-section__head">
              <div class="briefing-section__title">
                <AppIcon name="alert" :size="16" class="is-orange" />
                <h3>Needs Attention</h3>
                <p>Jobs that need your immediate focus</p>
              </div>
              <button type="button">View all (4)</button>
            </div>

            <div class="briefing-highlight-grid">
              <article
                v-for="card in briefingNeedsAttention"
                :key="`${card.job.id}-briefing-risk`"
                class="briefing-highlight-card"
                :class="`briefing-highlight-card--${card.tone}`"
              >
                <div class="briefing-highlight-card__top">
                  <div>
                    <span class="briefing-badge" :class="`briefing-badge--${card.tone}`">{{ card.badge }}</span>
                    <strong>{{ card.job.title }}</strong>
                    <p>{{ card.job.department }} &middot; {{ card.job.location }}</p>
                  </div>

                  <div class="briefing-highlight-card__actions">
                    <button class="briefing-open-button" type="button" @click="openJob(card.job)">Open Job</button>
                    <button class="briefing-link-button" type="button">
                      {{ card.linkLabel }}
                      <AppIcon name="chevronRight" :size="13" />
                    </button>
                  </div>
                </div>

                <div class="briefing-metrics">
                  <div v-for="metric in card.metrics" :key="`${card.job.id}-${metric.label}`" class="briefing-metric">
                    <strong>{{ metric.value }}</strong>
                    <span>{{ metric.label }}</span>
                    <small v-if="metric.delta" :class="`is-${metric.deltaTone}`">{{ metric.delta }}</small>
                  </div>
                </div>

                <div class="briefing-highlight-card__notes">
                  <div v-for="note in card.notes" :key="`${card.job.id}-${note.label}`" class="briefing-note-row">
                    <div class="briefing-note-row__copy">
                      <span>{{ note.label }}</span>
                      <small v-if="note.note">{{ note.note }}</small>
                    </div>
                    <strong :class="`is-${note.tone}`">{{ note.value }}</strong>
                  </div>
                </div>

                <div class="briefing-highlight-card__footer">
                  <div class="briefing-highlight-card__footer-stat">
                    <strong>{{ card.job.daysOpen }}</strong>
                    <span>Days open</span>
                  </div>
                  <div class="briefing-highlight-card__footer-stat briefing-highlight-card__footer-stat--wide">
                    <strong>{{ card.expectedHire }}</strong>
                    <span>Current expected hire</span>
                  </div>
                  <div class="briefing-owner-avatar">{{ ownerInitials(card.job.owner) }}</div>
                </div>
              </article>
            </div>
          </section>

          <section class="briefing-section">
            <div class="briefing-section__head">
              <div class="briefing-section__title">
                <AppIcon name="checkCircle" :size="16" class="is-green" />
                <h3>Ready For Action</h3>
                <p>Jobs with momentum that need your next step</p>
              </div>
              <button type="button">View all (6)</button>
            </div>

            <div class="briefing-highlight-grid">
              <article
                v-for="card in briefingReadyForAction"
                :key="`${card.job.id}-briefing-ready`"
                class="briefing-highlight-card"
                :class="`briefing-highlight-card--${card.tone}`"
              >
                <div class="briefing-highlight-card__top">
                  <div>
                    <span class="briefing-badge" :class="`briefing-badge--${card.tone}`">{{ card.badge }}</span>
                    <strong>{{ card.job.title }}</strong>
                    <p>{{ card.job.department }} &middot; {{ card.job.location }}</p>
                  </div>

                  <div class="briefing-highlight-card__actions">
                    <button class="briefing-open-button" type="button" @click="openJob(card.job)">Open Job</button>
                    <button class="briefing-link-button" type="button">
                      {{ card.linkLabel }}
                      <AppIcon name="chevronRight" :size="13" />
                    </button>
                  </div>
                </div>

                <div class="briefing-metrics">
                  <div v-for="metric in card.metrics" :key="`${card.job.id}-${metric.label}`" class="briefing-metric">
                    <strong>{{ metric.value }}</strong>
                    <span>{{ metric.label }}</span>
                  </div>
                </div>

                <div class="briefing-highlight-card__notes">
                  <div v-for="note in card.notes" :key="`${card.job.id}-${note.label}`" class="briefing-note-row">
                    <div class="briefing-note-row__copy">
                      <span>{{ note.label }}</span>
                    </div>
                    <strong :class="`is-${note.tone}`">{{ note.value }}</strong>
                  </div>
                </div>

                <div class="briefing-highlight-card__footer">
                  <div class="briefing-highlight-card__footer-stat">
                    <strong>{{ card.job.daysOpen }}</strong>
                    <span>Days open</span>
                  </div>
                  <div class="briefing-highlight-card__footer-stat briefing-highlight-card__footer-stat--wide">
                    <strong>{{ card.expectedHire }}</strong>
                    <span>Expected hire</span>
                  </div>
                  <div class="briefing-owner-avatar">{{ ownerInitials(card.job.owner) }}</div>
                </div>
              </article>
            </div>
          </section>

          <section class="briefing-section">
            <div class="briefing-section__head">
              <div class="briefing-section__title">
                <AppIcon name="alert" :size="16" class="is-orange" />
                <h3>Upcoming Risks</h3>
                <p>Jobs that may become problematic soon</p>
              </div>
              <button type="button">View all (5)</button>
            </div>

            <div class="briefing-risk-grid">
              <article
                v-for="risk in briefingUpcomingRisks"
                :key="risk.title"
                class="briefing-risk-card"
                :class="`briefing-risk-card--${risk.tone}`"
              >
                <div class="briefing-risk-card__job">
                  <strong>{{ risk.title }}</strong>
                  <p>{{ risk.department }} &middot; {{ risk.location }}</p>
                  <span class="briefing-badge" :class="`briefing-badge--${risk.tone}`">{{ risk.badge }}</span>
                </div>

                <div class="briefing-risk-card__stat">
                  <strong>{{ risk.daysOpen }}</strong>
                  <span>Days open</span>
                </div>

                <div class="briefing-risk-card__issue">
                  <strong>{{ risk.issue }}</strong>
                  <span>{{ risk.note }}</span>
                </div>

                <div class="briefing-risk-card__stat">
                  <strong>{{ risk.expectedHire }}</strong>
                  <span>Expected hire</span>
                </div>

                <button class="briefing-open-button" type="button" @click="risk.job && openJob(risk.job)">Open Job</button>
              </article>
            </div>
          </section>

          <div class="briefing-good-row">
            <div class="briefing-good-row__copy">
              <AppIcon name="checkCircle" :size="18" />
              <strong>All Good</strong>
              <span>{{ briefingSummary.progressingWell }} jobs are progressing well</span>
            </div>
            <button type="button">View all</button>
          </div>
        </div>

        <div v-else-if="activeView === 'board'" class="board-view">
          <article
            v-for="job in boardCards"
            :key="`${job.id}-board-card`"
            class="board-job-card"
            :class="`board-job-card--${job.board.tone}`"
            @click="openJob(job)"
          >
            <div class="board-job-card__top">
              <div>
                <div class="board-job-card__title-row">
                  <strong>{{ job.title }}</strong>
                  <AppIcon v-if="job.isStarred" name="star" :size="14" />
                </div>
                <p>{{ job.department }} &middot; {{ job.location }}</p>
              </div>

              <button
                class="board-job-card__menu"
                :class="{ 'is-open': actionMenu?.job.id === job.id }"
                type="button"
                @click.stop="toggleRowMenu(job, $event)"
              >
                <AppIcon name="more" :size="15" />
              </button>
            </div>

            <div class="board-job-card__status-row">
              <div class="board-job-card__pills">
                <span class="board-pill" :class="`board-pill--${job.board.tone}`">
                  <AppIcon :name="job.board.tone === 'green' ? 'checkCircle' : job.board.tone === 'slate' ? 'info' : 'alert'" :size="12" />
                  {{ job.board.pillLabel }}
                </span>
                <span v-if="job.board.pillMeta" class="board-pill board-pill--subtle">{{ job.board.pillMeta }}</span>
              </div>

              <div class="board-score" :class="`board-score--${job.board.tone}`">
                <span>{{ job.board.score ?? '-' }}</span>
              </div>
            </div>

            <button class="board-pipeline pipeline-open-button" type="button" @click="openPipeline(job)">
              <div class="board-pipeline__labels">
                <span v-for="stage in job.pipeline" :key="`${job.id}-${stage.label}-board-label`">{{ stage.label }}</span>
              </div>
              <div class="board-pipeline__segments">
                <div
                  v-for="stage in job.pipeline"
                  :key="`${job.id}-${stage.label}-board-segment`"
                  class="board-pipeline__segment"
                  :class="[`tone-${stage.tone}`, { 'is-empty': stage.value === 0 }]"
                />
              </div>
              <div class="board-pipeline__values">
                <span v-for="stage in job.pipeline" :key="`${job.id}-${stage.label}-board-value`">{{ stage.value > 0 ? stage.value : '-' }}</span>
              </div>
            </button>

            <div class="board-job-card__footer">
              <div class="board-job-card__meta board-job-card__meta--left">
                <div class="board-job-card__meta-line" :class="`is-${job.attention.tone}`">
                  <AppIcon :name="attentionIconName(job.attention.tone)" :size="12" />
                  <strong>{{ job.attention.label }}</strong>
                </div>
                <span>{{ job.attention.note }}</span>
              </div>

              <div class="board-job-card__meta board-job-card__meta--right">
                <div class="board-job-card__meta-line">
                  <strong>{{ job.forecast.label }}</strong>
                  <span class="board-job-card__avatar">{{ ownerInitials(job.owner) }}</span>
                </div>
                <span>Expected hire</span>
              </div>
            </div>

            <small class="board-job-card__days">{{ job.daysOpen }} days open</small>
          </article>
        </div>

        <div v-else-if="activeView === '__briefLegacy'" class="brief-view">
          <article v-for="job in visibleJobs" :key="`${job.id}-brief`" class="brief-card" @click="openJob(job)">
            <div class="brief-card__top">
              <div>
                <div class="brief-card__title-row">
                  <strong>{{ job.title }}</strong>
                  <AppIcon v-if="job.isStarred" name="star" :size="13" />
                </div>
                <span class="brief-card__location">{{ job.department }} &middot; {{ job.location }}</span>
              </div>

              <button
                class="brief-card__menu"
                :class="{ 'is-open': actionMenu?.job.id === job.id }"
                type="button"
                @click.stop="toggleRowMenu(job, $event)"
              >
                <AppIcon name="more" :size="14" />
              </button>
            </div>

            <div class="brief-card__summary">
              <div class="brief-card__pills">
                <span class="board-pill" :class="`board-pill--${job.board.tone}`">
                  <AppIcon :name="job.board.tone === 'green' ? 'checkCircle' : job.board.tone === 'slate' ? 'info' : 'alert'" :size="11" />
                  {{ job.board.pillLabel }}
                </span>
                <span v-if="job.board.pillMeta" class="board-pill board-pill--subtle">{{ job.board.pillMeta }}</span>
              </div>

              <div class="brief-score" :class="`board-score--${job.board.tone}`">
                <span>{{ job.board.score ?? '-' }}</span>
              </div>
            </div>

            <button class="brief-pipeline pipeline-open-button" type="button" @click="openPipeline(job)">
              <div class="brief-pipeline__segments">
                <div
                  v-for="stage in job.pipeline"
                  :key="`${job.id}-${stage.label}-brief-segment`"
                  class="brief-pipeline__segment"
                  :class="[`tone-${stage.tone}`, { 'is-empty': stage.value === 0 }]"
                />
              </div>
              <div class="brief-pipeline__values">
                <span v-for="stage in job.pipeline" :key="`${job.id}-${stage.label}-brief-value`">{{ stage.value > 0 ? stage.value : '-' }}</span>
              </div>
            </button>

            <div class="brief-card__meta">
              <div class="brief-card__meta-block">
                <strong>{{ job.attention.label }}</strong>
                <span>{{ job.attention.note }}</span>
              </div>
              <div class="brief-card__meta-block brief-card__meta-block--right">
                <strong>{{ job.forecast.label }}</strong>
                <span>{{ job.forecast.note }}</span>
              </div>
            </div>

            <small class="brief-card__days">{{ job.daysOpen }} days open</small>
          </article>
        </div>

        <div v-else class="analytics-view">
          <article v-for="job in visibleJobs" :key="`${job.id}-analytics`" class="analytics-row">
            <div>
              <strong>{{ job.title }}</strong>
              <span>{{ job.department }} &middot; {{ job.location }}</span>
            </div>
            <div>
              <strong>{{ job.applicants }}</strong>
              <span>Applicants</span>
            </div>
            <div>
              <strong>{{ job.health.label }}</strong>
              <span>Health</span>
            </div>
            <div>
              <strong>{{ job.daysOpen }}</strong>
              <span>Days Open</span>
            </div>
          </article>
        </div>

        <div v-if="activeView === 'list' || activeView === 'analytics'" class="jobs-board__footer">
          <span>Showing 1-6 of 24 jobs</span>

          <div class="pagination">
            <button class="pagination__button" type="button">
              <AppIcon name="chevronLeft" :size="13" />
            </button>
            <button class="pagination__button is-active" type="button">1</button>
            <button class="pagination__button" type="button">2</button>
            <button class="pagination__button" type="button">3</button>
            <button class="pagination__button pagination__button--dots" type="button">...</button>
            <button class="pagination__button" type="button">5</button>
            <button class="pagination__button" type="button">
              <AppIcon name="chevronRight" :size="13" />
            </button>
          </div>

          <div class="jobs-board__footer-select">
            <span>Jobs per page</span>
            <AppSelect v-model="jobsPerPage" :options="['10', '20', '50']" />
          </div>
        </div>
      </section>

      <aside class="jobs-page__side">
        <template v-if="activeView === 'brief'">
          <section class="side-panel panel">
            <div class="side-panel__head">
              <h3>Recent Wins</h3>
              <button type="button">View all</button>
            </div>

            <article v-for="item in briefingRecentWins" :key="item.title" class="win-card">
              <div class="win-card__avatar">{{ ownerInitials(item.owner) }}</div>
              <div class="win-card__body">
                <span class="win-card__tag" :class="{ 'is-green': item.tag === 'Offer Accepted' }">{{ item.tag }}</span>
                <strong>{{ item.title }}</strong>
                <small>{{ item.note }}</small>
              </div>
              <span class="win-card__age">{{ item.age }}</span>
            </article>
          </section>

          <section class="side-panel panel">
            <h3>This Week's Progress</h3>

            <div class="briefing-progress-list">
              <article v-for="item in briefingWeekProgress" :key="item.label" class="briefing-progress-card">
                <div class="briefing-progress-card__head">
                  <div class="briefing-progress-card__label">
                    <AppIcon :name="item.icon" :size="14" />
                    <span>{{ item.label }}</span>
                  </div>
                  <div class="briefing-progress-card__meta">
                    <strong>{{ item.value }}</strong>
                    <small :class="`is-${item.tone}`">{{ item.delta }}</small>
                  </div>
                </div>
                <div class="briefing-progress-card__track">
                  <span :class="`is-${item.tone}`" :style="{ width: `${item.progress}%` }" />
                </div>
              </article>
            </div>
          </section>

          <section class="side-panel panel">
            <h3>Quick Actions</h3>

            <div class="briefing-actions">
              <button
                v-for="item in briefingQuickActions"
                :key="item.title"
                class="briefing-action"
                type="button"
                @click="handleBriefingQuickAction(item)"
              >
                <div class="briefing-action__icon">
                  <AppIcon :name="item.icon" :size="15" />
                </div>
                <div class="briefing-action__copy">
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.note }}</span>
                </div>
                <strong v-if="item.count !== null" class="briefing-action__count">{{ item.count }}</strong>
                <AppIcon v-else name="chevronRight" :size="14" class="briefing-action__arrow" />
              </button>
            </div>
          </section>
        </template>

        <template v-else>
          <section class="side-panel panel">
            <div class="side-panel__head">
              <h3>Jobs needing attention</h3>
              <button type="button" @click="openJobsAttentionModal">View all</button>
            </div>

            <article v-for="item in jobsAttention" :key="item.title" class="attention-card">
              <div class="attention-card__icon" :class="`tone-${item.tone}`">
                <AppIcon name="alert" :size="14" />
              </div>
              <div class="attention-card__body">
                <strong>{{ item.title }}</strong>
                <span>{{ item.note }}</span>
              </div>
              <div class="attention-card__days">
                <strong>{{ item.days }}</strong>
                <span>days open</span>
              </div>
            </article>
          </section>

          <section class="side-panel panel">
            <h3>Pipeline health</h3>

            <div class="health-panel">
              <div class="health-panel__copy">
                <span>OVERALL</span>
                <strong>{{ pipelineHealth.label }}</strong>
                <small>{{ pipelineHealth.delta }}</small>
              </div>
              <div class="health-score">{{ pipelineHealth.score }}</div>
            </div>

            <div class="health-chart">
              <svg viewBox="0 0 240 72" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 58 H240" />
                <polyline :points="healthLinePoints" />
              </svg>
            </div>
          </section>

          <section class="side-panel panel">
            <h3>Quick filters</h3>

            <div class="quick-filters">
              <button v-for="item in quickFilters" :key="item.label" class="quick-filter" type="button">
                <span>{{ item.label }}</span>
                <strong>{{ item.count }}</strong>
              </button>
            </div>

            <button class="view-filters" type="button">View all filters</button>
          </section>
        </template>
      </aside>
    </section>

    <Teleport to="body">
      <div
        v-if="actionMenu"
        ref="actionMenuRef"
        class="row-menu"
        :style="{ top: `${actionMenu.top}px`, left: `${actionMenu.left}px` }"
        @click.stop
      >
        <section v-for="section in rowMenuSections" :key="section.title" class="row-menu__section">
          <strong class="row-menu__title">{{ section.title }}</strong>
          <button
            v-for="item in section.items"
            :key="item.id"
            class="row-menu__item"
            type="button"
            @click="handleRowMenuAction(item.id, actionMenu.job)"
          >
            <AppIcon :name="item.icon" :size="16" :class="['row-menu__icon', { 'is-pink': item.accent === 'pink' }]" />
            <span>{{ item.label }}</span>
          </button>
        </section>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="jobsAttentionModalOpen" class="attention-overview-layer" @click="closeJobsAttentionModal">
        <div class="attention-overview-modal" @click.stop>
          <div class="attention-overview-modal__head">
            <div class="attention-overview-modal__title-wrap">
              <div class="attention-overview-modal__title-icon">
                <AppIcon name="alert" :size="20" />
              </div>
              <div>
                <div class="attention-overview-modal__title-row">
                  <h2>Jobs Requiring Attention</h2>
                  <span class="attention-overview-modal__count">14</span>
                </div>
                <p>These jobs need your attention to keep your pipeline healthy and moving forward.</p>
              </div>
            </div>

            <div class="attention-overview-modal__head-actions">
              <button class="attention-overview-modal__primary" type="button">
                <AppIcon name="sparkles" :size="15" />
                <span>AI Prioritize</span>
              </button>
              <button class="attention-overview-modal__secondary" type="button">Mark All Reviewed</button>
              <button class="attention-overview-modal__close" type="button" @click="closeJobsAttentionModal">
                <AppIcon name="close" :size="18" />
              </button>
            </div>
          </div>

          <div class="attention-overview-modal__body">
            <section class="attention-overview-stats">
              <article
                v-for="item in jobsAttentionOverviewStats"
                :key="item.id"
                class="attention-overview-stat"
              >
                <span class="attention-overview-stat__icon" :class="`tone-${item.tone}`">
                  <AppIcon :name="item.icon" :size="16" />
                </span>
                <strong>{{ item.value }}</strong>
                <span>{{ item.label }}</span>
                <small :class="`tone-${item.tone}`">{{ item.delta }}</small>
              </article>
            </section>

            <section class="attention-overview-filters">
              <button
                v-for="item in jobsAttentionFilters"
                :key="item.id"
                class="attention-overview-filter"
                :class="{ 'is-active': attentionActiveFilter === item.id }"
                type="button"
                @click="attentionActiveFilter = item.id"
              >
                {{ item.label }} ({{ item.count }})
              </button>
            </section>

            <div class="attention-overview-content">
              <section class="attention-overview-cards">
                <article
                  v-for="item in filteredJobsAttentionCards"
                  :key="item.id"
                  class="attention-overview-card"
                >
                  <div class="attention-overview-card__top">
                    <div class="attention-overview-card__tone" :class="`tone-${item.tone}`">
                      <AppIcon :name="item.tone === 'orange' ? 'mail' : item.tone === 'violet' ? 'calendar' : item.tone === 'blue' ? 'clipboard-check' : item.tone === 'yellow' ? 'clock' : item.tone === 'green' ? 'check' : 'chart-bars'" :size="14" />
                      <span>{{ item.toneLabel }}</span>
                    </div>
                    <span class="attention-overview-card__severity" :class="`tone-${item.tone}`">{{ item.severity }}</span>
                  </div>

                  <div class="attention-overview-card__copy">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.meta }}</p>
                  </div>

                  <div class="attention-overview-card__stats">
                    <div v-for="stat in item.stats" :key="stat.label">
                      <span>{{ stat.label }}</span>
                      <strong>{{ stat.value }} <small v-if="stat.subvalue">{{ stat.subvalue }}</small></strong>
                    </div>
                  </div>

                  <div class="attention-overview-card__insight">
                    <strong>AI Insight</strong>
                    <p>{{ item.insight }}</p>
                  </div>

                  <div class="attention-overview-card__actions">
                    <button class="attention-overview-card__primary" type="button">{{ item.actions[0] }}</button>
                    <button class="attention-overview-card__secondary" type="button">{{ item.actions[1] }}</button>
                    <button class="attention-overview-card__more" type="button" aria-label="More actions">
                      <AppIcon name="more" :size="16" />
                    </button>
                  </div>
                </article>

                <div class="attention-overview-cards__footer">
                  <span>Showing 1 to 6 of 86 jobs</span>
                  <div class="attention-overview-pagination">
                    <button type="button">
                      <AppIcon name="chevronLeft" :size="14" />
                    </button>
                    <button class="is-active" type="button">1</button>
                    <button type="button">2</button>
                    <button type="button">3</button>
                    <button type="button">4</button>
                    <button type="button">5</button>
                    <button type="button">
                      <AppIcon name="chevronRight" :size="14" />
                    </button>
                  </div>
                </div>
              </section>

              <aside class="attention-overview-sidebar">
                <section class="attention-overview-sidecard">
                  <div class="attention-overview-sidecard__head">
                    <h3>AI Attention Summary</h3>
                    <AppIcon name="sparkles" :size="14" />
                  </div>
                  <span class="attention-overview-sidecard__label">Most Critical</span>
                  <div class="attention-overview-sidecard__job">
                    <strong>Graphic Designer</strong>
                    <span>High Risk</span>
                  </div>
                  <div class="attention-overview-sidecard__list">
                    <div><span>Risk:</span><strong>Time-to-fill delay</strong></div>
                    <div><span>Impact:</span><strong>+12 days</strong></div>
                  </div>
                  <div class="attention-overview-sidecard__recommend">
                    <span>Recommended:</span>
                    <div>
                      <button type="button">Boost Job</button>
                      <button type="button">Refresh Description</button>
                    </div>
                  </div>
                  <button class="attention-overview-sidecard__apply" type="button">Apply Recommendation</button>
                </section>

                <section class="attention-overview-sidecard">
                  <h3>Hiring Impact</h3>
                  <div class="attention-overview-impact-list">
                    <div><span>Potential Delayed Hires</span><strong>6</strong></div>
                    <div><span>Blocked Candidates</span><strong>14</strong></div>
                    <div><span>Pending Feedback</span><strong>16</strong></div>
                    <div><span>Expected Recovery</span><strong>4 Actions</strong></div>
                  </div>
                  <button class="attention-overview-sidecard__outline" type="button" @click="openActionPlanModal">View Action Plan</button>
                </section>

                <section class="attention-overview-sidecard">
                  <h3>Bulk Actions</h3>
                  <div class="attention-overview-bulk">
                    <button v-for="item in jobsAttentionBulkActions" :key="item" type="button">
                      <span>{{ item }}</span>
                      <AppIcon name="chevronRight" :size="14" />
                    </button>
                  </div>
                </section>
              </aside>
            </div>
          </div>

          <div class="attention-overview-modal__footer">
            <button class="attention-overview-modal__secondary" type="button" @click="closeJobsAttentionModal">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="actionPlanModalOpen" class="action-plan-layer" @click="closeActionPlanModal">
        <div class="action-plan-modal" @click.stop>
          <div class="action-plan-modal__head">
            <div class="action-plan-modal__title-wrap">
              <div class="action-plan-modal__title-icon">
                <AppIcon name="sparkles" :size="18" />
              </div>
              <div>
                <h2>Action Plan</h2>
                <p>Take these actions to improve your hiring outcomes.</p>
              </div>
            </div>

            <button class="action-plan-modal__close" type="button" @click="closeActionPlanModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div ref="actionPlanBodyRef" class="action-plan-modal__body">
            <section class="action-plan-impact">
              <div class="action-plan-impact__head">
                <h3>Expected Impact if you take these actions</h3>
                <span>Confidence: 78% <AppIcon name="info" :size="13" /></span>
              </div>

              <div class="action-plan-impact__grid">
                <article v-for="item in actionPlanImpactCards" :key="item.label" class="action-plan-impact__card">
                  <span class="action-plan-impact__icon" :class="`tone-${item.tone}`">
                    <AppIcon :name="item.icon" :size="18" />
                  </span>
                  <div>
                    <strong :class="`tone-${item.tone}`">{{ item.value }}</strong>
                    <h4>{{ item.label }}</h4>
                    <p>{{ item.note }}</p>
                  </div>
                </article>
              </div>
            </section>

            <div class="action-plan-toolbar">
              <div class="action-plan-filters">
                <button v-for="item in actionPlanFilters" :key="item.id" :class="{ 'is-active': item.id === 'all' }" type="button">
                  {{ item.label }} ({{ item.count }})
                </button>
              </div>

              <div class="action-plan-sort">
                <span>Sort by:</span>
                <button type="button">
                  <span>Priority</span>
                  <AppIcon name="chevronDown" :size="14" />
                </button>
              </div>
            </div>

            <section class="action-plan-list">
              <div class="action-plan-list__head">
                <span />
                <span>Action</span>
                <span>Job</span>
                <span>Impact</span>
                <span>Priority</span>
                <span />
              </div>

              <article v-for="item in actionPlanRows" :key="item.id" class="action-plan-row">
                <span class="action-plan-row__icon" :class="`tone-${item.tone}`">
                  <AppIcon :name="item.icon" :size="16" />
                </span>

                <div class="action-plan-row__action">
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.note }}</p>
                </div>

                <div class="action-plan-row__meta">
                  <span>Job</span>
                  <strong>{{ item.job }}</strong>
                  <p>{{ item.jobMeta }}</p>
                </div>

                <div class="action-plan-row__meta">
                  <span>Impact</span>
                  <strong>{{ item.impact }}</strong>
                  <p>{{ item.impactMeta }}</p>
                </div>

                <div class="action-plan-row__meta">
                  <span>Priority</span>
                  <em :class="`tone-${item.priorityTone}`">{{ item.priority }}</em>
                </div>

                <button class="action-plan-row__button" type="button" @click="openActionPlanRow(item)">{{ item.action }}</button>
              </article>
            </section>
          </div>

          <div class="action-plan-modal__footer">
            <div class="action-plan-pagination">
              <span>Showing 1 to 5 of 16 actions</span>
              <div class="action-plan-pagination__controls">
                <button type="button"><AppIcon name="chevronLeft" :size="14" /></button>
                <button class="is-active" type="button">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button"><AppIcon name="chevronRight" :size="14" /></button>
              </div>
            </div>

            <button class="action-plan-modal__primary" type="button">
              <AppIcon name="spark" :size="15" />
              <span>Take All Recommended Actions</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="actionPlanFeedbackModalOpen && actionPlanFeedbackTarget" class="action-plan-feedback-layer" @click="closeActionPlanFeedbackModal">
        <div
          class="action-plan-feedback-modal"
          :class="{ 'action-plan-feedback-modal--compose': actionPlanFeedbackView === 'compose' }"
          @click.stop
        >
          <template v-if="actionPlanFeedbackView === 'list'">
            <div class="action-plan-feedback-modal__head">
              <div class="action-plan-feedback-modal__title-wrap">
                <div class="action-plan-feedback-modal__title-icon">
                  <AppIcon name="mail" :size="18" />
                </div>
                <div>
                  <h2>{{ actionPlanFeedbackTarget.title }}</h2>
                  <p>{{ actionPlanFeedbackTarget.note }}</p>
                </div>
              </div>

              <button class="action-plan-feedback-modal__close" type="button" @click="closeActionPlanFeedbackModal">
                <AppIcon name="close" :size="18" />
              </button>
            </div>

            <div ref="actionPlanFeedbackBodyRef" class="action-plan-feedback-modal__body">
              <section class="action-plan-feedback-summary">
                <div class="action-plan-feedback-summary__item">
                  <span class="action-plan-feedback-summary__icon">
                    <AppIcon name="briefcase" :size="18" />
                  </span>
                  <div>
                    <small>Job</small>
                    <strong>{{ actionPlanFeedbackTarget.job }}</strong>
                  </div>
                </div>

                <div class="action-plan-feedback-summary__item">
                  <span class="action-plan-feedback-summary__icon">
                    <AppIcon name="users" :size="18" />
                  </span>
                  <div>
                    <small>Candidates</small>
                    <strong>{{ actionPlanFeedbackTarget.jobMeta.replace(' candidates', '') }}</strong>
                  </div>
                </div>

                <div class="action-plan-feedback-summary__item">
                  <span class="action-plan-feedback-summary__icon">
                    <AppIcon name="clock" :size="18" />
                  </span>
                  <div>
                    <small>Impact</small>
                    <strong>{{ actionPlanFeedbackTarget.impact }} {{ actionPlanFeedbackTarget.impactMeta }}</strong>
                  </div>
                </div>

                <div class="action-plan-feedback-summary__priority">
                  <small>Priority</small>
                  <strong :class="`tone-${actionPlanFeedbackTarget.priorityTone}`">{{ actionPlanFeedbackTarget.priority }}</strong>
                </div>
              </section>

              <div class="action-plan-feedback-layout">
                <section class="action-plan-feedback-candidates">
                  <div class="action-plan-feedback-candidates__head">
                    <label class="action-plan-feedback-check">
                      <input :checked="actionPlanFeedbackAllSelected" type="checkbox" @change="toggleActionPlanFeedbackSelectAll" />
                      <span class="action-plan-feedback-check__box">
                        <AppIcon name="check" :size="12" />
                      </span>
                      <strong>Candidates ({{ actionPlanFeedbackCandidates.length }})</strong>
                    </label>
                  </div>

                  <div class="action-plan-feedback-candidates__list">
                    <article v-for="candidate in actionPlanFeedbackCandidates" :key="candidate.id" class="action-plan-feedback-candidate">
                      <label class="action-plan-feedback-check action-plan-feedback-check--row">
                        <input :checked="actionPlanFeedbackSelected.includes(candidate.id)" type="checkbox" @change="toggleActionPlanFeedbackCandidate(candidate.id)" />
                        <span class="action-plan-feedback-check__box">
                          <AppIcon name="check" :size="12" />
                        </span>
                      </label>

                      <div class="action-plan-feedback-candidate__avatar" :class="`tone-${candidate.avatarTone}`">
                        {{ ownerInitials(candidate.name) }}
                      </div>

                      <div class="action-plan-feedback-candidate__identity">
                        <strong>{{ candidate.name }}</strong>
                        <div class="action-plan-feedback-candidate__identity-meta">
                          <div class="action-plan-feedback-candidate__mini-stack">
                            <span>Applied on</span>
                            <p>{{ candidate.appliedOn }}</p>
                          </div>
                          <div class="action-plan-feedback-candidate__mini-stack">
                            <span>via</span>
                            <span :class="['action-plan-feedback-candidate__source', sourceToneClass(candidate.sourceTone)]">{{ candidate.source }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="action-plan-feedback-candidate__stage">
                        <strong>
                          <span :class="['action-plan-feedback-candidate__dot', `tone-${candidate.stageTone}`]" />
                          {{ candidate.stage }}
                        </strong>
                        <p>{{ candidate.stageDetail }}</p>
                      </div>

                      <div class="action-plan-feedback-candidate__meta">
                        <span>Last activity</span>
                        <strong>{{ candidate.lastActivity }}</strong>
                      </div>

                      <div class="action-plan-feedback-candidate__meta">
                        <span>Waiting</span>
                        <strong class="tone-red">{{ candidate.waiting }}</strong>
                      </div>

                      <div class="action-plan-feedback-candidate__actions">
                        <button class="action-plan-feedback-candidate__button" type="button" @click="openActionPlanFeedbackComposer(candidate)">
                          <AppIcon name="mail" :size="13" />
                          <span>Send feedback</span>
                        </button>
                        <button class="action-plan-feedback-candidate__caret" type="button" aria-label="More feedback actions">
                          <AppIcon name="chevronDown" :size="13" />
                        </button>
                      </div>
                    </article>
                  </div>
                </section>

                <aside class="action-plan-feedback-aside">
                  <section class="action-plan-feedback-aside__card">
                    <div class="action-plan-feedback-aside__head">
                      <h3>Why this is recommended</h3>
                      <AppIcon name="info" :size="15" />
                    </div>
                    <p>{{ actionPlanFeedbackTarget.why }}</p>
                  </section>

                  <section class="action-plan-feedback-aside__card">
                    <span class="action-plan-feedback-aside__label">Expected impact</span>
                    <div class="action-plan-feedback-impact">
                      <div v-for="impact in actionPlanFeedbackTarget.impactCards" :key="impact.label" class="action-plan-feedback-impact__item">
                        <span class="action-plan-feedback-impact__icon" :class="`tone-${impact.tone}`">
                          <AppIcon :name="impact.icon" :size="17" />
                        </span>
                        <div>
                          <strong :class="`tone-${impact.tone}`">{{ impact.value }}</strong>
                          <h4>{{ impact.label }}</h4>
                          <p>{{ impact.note }}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section class="action-plan-feedback-tip">
                    <div class="action-plan-feedback-tip__head">
                      <AppIcon name="sparkles" :size="15" />
                      <strong>AI tip</strong>
                    </div>
                    <p>{{ actionPlanFeedbackTarget.tip }}</p>
                  </section>
                </aside>
              </div>
            </div>

            <div class="action-plan-feedback-modal__footer">
              <div class="action-plan-feedback-modal__note">
                <AppIcon name="info" :size="14" />
                <span>Feedback helps candidates move forward and improves your hiring outcomes.</span>
              </div>

              <div class="action-plan-feedback-modal__actions">
                <button class="action-plan-feedback-modal__secondary" type="button" @click="closeActionPlanFeedbackModal">Cancel</button>
                <button class="action-plan-feedback-modal__primary" type="button" @click="openPrimaryActionPlanFeedbackComposer">
                  <AppIcon name="mail" :size="15" />
                  <span>{{ actionPlanFeedbackSendLabel }}</span>
                </button>
              </div>
            </div>
          </template>

          <template v-else-if="actionPlanFeedbackActiveCandidate">
            <div class="action-plan-compose__topbar">
              <button class="action-plan-compose__back" type="button" @click="backToActionPlanFeedbackList">
                <AppIcon name="chevronLeft" :size="16" />
                <span>Back to Action Plan</span>
              </button>

              <div class="action-plan-compose__topbar-actions">
                <button class="action-plan-compose__ghost" type="button">
                  <span>View candidate profile</span>
                  <AppIcon name="external-link" :size="14" />
                </button>
                <button class="action-plan-compose__icon" type="button" aria-label="More actions">
                  <AppIcon name="more" :size="16" />
                </button>
              </div>
            </div>

            <div ref="actionPlanFeedbackBodyRef" class="action-plan-compose__body">
              <div class="action-plan-compose__title">
                <div class="action-plan-compose__title-icon">
                  <AppIcon name="mail" :size="18" />
                </div>
                <div>
                  <h2>Send feedback to {{ actionPlanFeedbackActiveCandidate.name }}</h2>
                  <p>Share your feedback and move the candidate forward.</p>
                </div>
              </div>

              <div class="action-plan-compose__layout">
                <aside class="action-plan-compose__sidebar">
                  <section class="action-plan-compose__candidate-card">
                    <div class="action-plan-compose__candidate-avatar" :class="`tone-${actionPlanFeedbackActiveCandidate.avatarTone}`">
                      {{ ownerInitials(actionPlanFeedbackActiveCandidate.name) }}
                    </div>
                    <strong>{{ actionPlanFeedbackActiveCandidate.name }}</strong>
                    <p>{{ actionPlanFeedbackActiveRole }}</p>

                    <div class="action-plan-compose__candidate-meta">
                      <div>
                        <span>Current stage</span>
                        <strong>{{ actionPlanFeedbackActiveStage }}</strong>
                      </div>
                      <div>
                        <span>Applied on</span>
                        <strong>{{ actionPlanFeedbackAppliedDate }}</strong>
                      </div>
                      <div>
                        <span>Last activity</span>
                        <strong>{{ actionPlanFeedbackActiveCandidate.lastActivity }}</strong>
                      </div>
                      <div>
                        <span>Source</span>
                        <strong>{{ actionPlanFeedbackActiveCandidate.source }}</strong>
                      </div>
                    </div>

                    <div class="action-plan-compose__progress">
                      <span>Hiring progress</span>
                      <div class="action-plan-compose__progress-track">
                        <i class="is-active" />
                        <i class="is-active" />
                        <i class="is-active" />
                        <i />
                        <i />
                      </div>
                      <div class="action-plan-compose__progress-labels">
                        <small>Applied</small>
                        <small>Screen</small>
                        <small>Interview</small>
                        <small>Assessment</small>
                        <small>Offer</small>
                      </div>
                    </div>
                  </section>

                  <section class="action-plan-compose__summary-card">
                    <div class="action-plan-compose__summary-head">
                      <strong>AI summary</strong>
                      <span>Strong match</span>
                    </div>
                    <p>Ethan has a strong portfolio and design fundamentals. Good communication and problem-solving skills.</p>
                    <div class="action-plan-compose__score">
                      <span>Overall score</span>
                      <strong>82%</strong>
                    </div>
                  </section>
                </aside>

                <div class="action-plan-compose__main">
                  <section class="action-plan-compose__section">
                    <h3><em>1.</em> Feedback type</h3>
                    <div class="action-plan-compose__type-grid">
                      <button
                        v-for="option in actionPlanFeedbackTypeOptions"
                        :key="option.id"
                        class="action-plan-compose__type-card"
                        :class="{ 'is-active': actionPlanFeedbackType === option.id }"
                        type="button"
                        @click="actionPlanFeedbackType = option.id"
                      >
                        <span class="action-plan-compose__type-icon">
                          <AppIcon :name="option.icon" :size="18" />
                        </span>
                        <strong>{{ option.title }}</strong>
                        <small>{{ option.note }}</small>
                      </button>
                    </div>
                  </section>

                  <section class="action-plan-compose__section">
                    <div class="action-plan-compose__section-head">
                      <h3><em>2.</em> Feedback template</h3>
                      <button class="action-plan-compose__manage" type="button">
                        <AppIcon name="settings" :size="13" />
                        <span>Manage templates</span>
                      </button>
                    </div>
                    <AppSelect v-model="actionPlanFeedbackTemplate" :options="actionPlanFeedbackTemplateOptions" />
                  </section>

                  <section class="action-plan-compose__section">
                    <h3><em>3.</em> Message to candidate</h3>
                    <div class="action-plan-compose__editor-layout">
                      <div class="action-plan-compose__editor">
                        <div class="action-plan-compose__editor-toolbar">
                          <span>Normal</span>
                          <span>B</span>
                          <span>I</span>
                          <span>U</span>
                          <span>Variables</span>
                        </div>
                        <textarea v-model="actionPlanFeedbackMessage" />
                      </div>
                      <aside class="action-plan-compose__suggestions">
                        <div class="action-plan-compose__suggestions-head">
                          <strong>AI suggestions</strong>
                          <button type="button">Insert all</button>
                        </div>
                        <button
                          v-for="suggestion in actionPlanFeedbackSuggestions"
                          :key="suggestion"
                          class="action-plan-compose__suggestion"
                          type="button"
                          @click="applyActionPlanSuggestion(suggestion)"
                        >
                          <span>{{ suggestion }}</span>
                          <AppIcon name="plus" :size="14" />
                        </button>
                      </aside>
                    </div>
                  </section>

                  <div class="action-plan-compose__bottom">
                    <section class="action-plan-compose__section">
                      <h3><em>4.</em> Internal note <small>(for your team only)</small></h3>
                      <textarea class="action-plan-compose__note" v-model="actionPlanFeedbackInternalNote" />
                    </section>

                    <section class="action-plan-compose__section">
                      <h3><em>5.</em> Update candidate status</h3>
                      <div class="action-plan-compose__status">
                        <label class="action-plan-compose__checkbox">
                          <input v-model="actionPlanFeedbackMoveToNextStage" type="checkbox" />
                          <span>Move candidate to next stage</span>
                        </label>
                        <AppSelect v-model="actionPlanFeedbackNextStage" :options="actionPlanFeedbackNextStageOptions" />
                        <label class="action-plan-compose__checkbox">
                          <input v-model="actionPlanFeedbackAddToTalentPool" type="checkbox" />
                          <span>Add to talent pool</span>
                        </label>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-plan-compose__footer">
              <button class="action-plan-compose__secondary" type="button" @click="closeActionPlanFeedbackModal">Cancel</button>
              <div class="action-plan-compose__footer-actions">
                <button class="action-plan-compose__ghost" type="button">Save draft</button>
                <button class="action-plan-compose__primary" type="button" @click="submitActionPlanCandidateFeedback">
                  <AppIcon name="mail" :size="15" />
                  <span>{{ actionPlanFeedbackSubmitLabel }}</span>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="actionPlanApprovalModalOpen && actionPlanApprovalTarget" class="action-plan-approval-layer" @click="closeActionPlanApprovalModal">
        <div class="action-plan-approval-modal" @click.stop>
          <div class="action-plan-approval-modal__head">
            <div class="action-plan-approval-modal__title-wrap">
              <div class="action-plan-approval-modal__title-icon">
                <AppIcon name="user" :size="18" />
              </div>
              <div>
                <h2>{{ actionPlanApprovalTarget.title }}</h2>
                <p>{{ actionPlanApprovalTarget.note }}</p>
              </div>
            </div>

            <button class="action-plan-approval-modal__close" type="button" @click="closeActionPlanApprovalModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div ref="actionPlanApprovalBodyRef" class="action-plan-approval-modal__body">
            <section class="action-plan-approval-summary">
              <div class="action-plan-approval-summary__item">
                <span class="action-plan-approval-summary__icon tone-pink">
                  <AppIcon name="briefcase" :size="18" />
                </span>
                <div>
                  <small>Job</small>
                  <strong>{{ actionPlanApprovalTarget.job }}</strong>
                </div>
              </div>

              <div class="action-plan-approval-summary__item">
                <span class="action-plan-approval-summary__icon tone-blue">
                  <AppIcon name="users" :size="18" />
                </span>
                <div>
                  <small>Pending approvals</small>
                  <strong>{{ actionPlanApprovalTarget.summaryLabel }}</strong>
                </div>
              </div>

              <div class="action-plan-approval-summary__item">
                <span class="action-plan-approval-summary__icon tone-green">
                  <AppIcon name="trend-up" :size="18" />
                </span>
                <div>
                  <small>Impact</small>
                  <strong>{{ actionPlanApprovalTarget.impactLabel }}</strong>
                </div>
              </div>

              <div class="action-plan-approval-summary__item">
                <span class="action-plan-approval-summary__icon tone-red">
                  <AppIcon name="alert" :size="18" />
                </span>
                <div>
                  <small>Priority</small>
                  <strong class="tone-pink">{{ actionPlanApprovalTarget.priority }}</strong>
                </div>
              </div>
            </section>

            <div class="action-plan-approval-toolbar">
              <div class="action-plan-approval-toolbar__copy">
                <strong>{{ actionPlanApprovalCandidates.length }} candidates</strong>
                <p>Review each offer and take action.</p>
              </div>

              <div class="action-plan-approval-toolbar__actions">
                <label class="action-plan-approval-check action-plan-approval-check--inline">
                  <input :checked="actionPlanApprovalAllSelected" type="checkbox" @change="toggleActionPlanApprovalSelectAll" />
                  <span class="action-plan-approval-check__box">
                    <AppIcon name="check" :size="12" />
                  </span>
                  <span>Select all</span>
                </label>

                <div class="action-plan-approval-toolbar__sort">
                  <span>Sort by:</span>
                  <AppSelect v-model="actionPlanApprovalSort" :options="['Oldest waiting', 'Newest waiting', 'Highest value']" />
                </div>
              </div>
            </div>

            <div class="action-plan-approval-list">
              <article
                v-for="candidate in actionPlanApprovalCandidates"
                :key="candidate.id"
                class="action-plan-approval-card"
                :class="{ 'is-expanded': actionPlanApprovalExpandedId === candidate.id }"
              >
                <div class="action-plan-approval-card__row">
                  <label class="action-plan-approval-check">
                    <input :checked="actionPlanApprovalSelected.includes(candidate.id)" type="checkbox" @change="toggleActionPlanApprovalCandidate(candidate.id)" />
                    <span class="action-plan-approval-check__box">
                      <AppIcon name="check" :size="12" />
                    </span>
                  </label>

                  <div class="action-plan-approval-card__person">
                    <div class="action-plan-approval-card__avatar" :class="`tone-${candidate.avatarTone}`">
                      {{ ownerInitials(candidate.name) }}
                    </div>
                    <div>
                      <strong>{{ candidate.name }}</strong>
                      <p>{{ candidate.role }}</p>
                      <small>Requested by {{ candidate.requestedBy }}</small>
                    </div>
                    <span class="action-plan-approval-card__badge">{{ candidate.badge }}</span>
                  </div>

                  <div class="action-plan-approval-card__meta">
                    <span>Waiting</span>
                    <strong class="tone-red">{{ candidate.waiting }}</strong>
                    <small>{{ candidate.since }}</small>
                  </div>

                  <div class="action-plan-approval-card__meta">
                    <span>Offer summary</span>
                    <strong>{{ candidate.offerSummary }}</strong>
                    <small>{{ candidate.bonus }}</small>
                  </div>

                  <div class="action-plan-approval-card__meta">
                    <span>Budget status</span>
                    <strong :class="`tone-${candidate.budgetTone}`">{{ candidate.budgetStatus }}</strong>
                    <small>{{ candidate.range }}</small>
                    <small v-if="candidate.budgetDetail" class="tone-red">{{ candidate.budgetDetail }}</small>
                  </div>

                  <div class="action-plan-approval-card__decision">
                    <button class="action-plan-approval-card__decision-button is-approve" type="button">Approve</button>
                    <button class="action-plan-approval-card__decision-button is-request" type="button" @click="toggleActionPlanApprovalExpanded(candidate.id)">Request changes</button>
                    <button class="action-plan-approval-card__decision-button is-reject" type="button">Reject</button>
                  </div>

                  <button class="action-plan-approval-card__expand" type="button" @click="toggleActionPlanApprovalExpanded(candidate.id)">
                    <AppIcon :name="actionPlanApprovalExpandedId === candidate.id ? 'chevronUp' : 'chevronDown'" :size="16" />
                  </button>
                </div>

                <div v-if="actionPlanApprovalExpandedId === candidate.id" class="action-plan-approval-card__expanded">
                  <div class="action-plan-approval-card__expanded-main">
                    <div class="action-plan-approval-card__reason-grid">
                      <div>
                        <span>Reason for changes <i>*</i></span>
                        <div class="action-plan-approval-card__reason-options">
                          <button
                            v-for="reason in actionPlanApprovalReasonOptions"
                            :key="reason"
                            class="action-plan-approval-card__reason-option"
                            :class="{ 'is-active': actionPlanApprovalReason === reason }"
                            type="button"
                            @click="actionPlanApprovalReason = reason"
                          >
                            {{ reason }}
                          </button>
                        </div>
                        <div class="action-plan-approval-card__ai">
                          <div class="action-plan-approval-card__ai-head">
                            <strong>AI suggestion</strong>
                            <span class="action-plan-approval-card__ai-badge">New</span>
                          </div>
                          <p>{{ actionPlanApprovalTarget.aiSuggestion }}</p>
                          <button type="button">Insert suggestion</button>
                        </div>
                      </div>

                      <div>
                        <span>Comments <i>*</i></span>
                        <div class="action-plan-approval-card__comments">
                          <textarea
                            v-model="actionPlanApprovalComments"
                            maxlength="500"
                            placeholder="Explain what needs to change before this offer can be approved."
                          />
                          <small>{{ actionPlanApprovalComments.length }}/500</small>
                        </div>
                      </div>

                      <div class="action-plan-approval-card__side">
                        <div>
                          <span>Approval history</span>
                          <div class="action-plan-approval-card__history">
                            <div v-for="item in actionPlanApprovalTarget.history" :key="item.time" class="action-plan-approval-card__history-item">
                              <i :class="{ 'tone-pink': item.tone === 'pink' }" />
                              <div>
                                <strong>{{ item.time }}</strong>
                                <small :class="{ 'tone-pink': item.tone === 'pink' }">{{ item.note }}</small>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <span>Related documents</span>
                          <div class="action-plan-approval-card__docs">
                            <button v-for="doc in actionPlanApprovalTarget.documents" :key="doc" type="button">
                              <span>{{ doc }}</span>
                              <AppIcon name="external-link" :size="13" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="action-plan-approval-card__assignments">
                      <div>
                        <span>Assign back to <i>*</i></span>
                        <AppSelect v-model="actionPlanApprovalAssignBack" :options="actionPlanApprovalAssignBackOptions" />
                      </div>
                      <div>
                        <span>Due date <i>*</i></span>
                        <AppSelect v-model="actionPlanApprovalDueDate" :options="actionPlanApprovalDueDateOptions" />
                      </div>
                    </div>
                  </div>

                  <div class="action-plan-approval-card__expanded-footer">
                    <button class="action-plan-approval-card__ghost" type="button" @click="toggleActionPlanApprovalExpanded(candidate.id)">Cancel</button>
                    <button class="action-plan-approval-card__primary" type="button" @click="submitActionPlanApprovalRequest">Send change request</button>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div class="action-plan-approval-modal__footer">
            <strong>{{ actionPlanApprovalSelectedCount }} of {{ actionPlanApprovalCandidates.length }} selected</strong>
            <div class="action-plan-approval-modal__footer-actions">
              <button class="action-plan-approval-modal__secondary" type="button" @click="closeActionPlanApprovalModal">Cancel</button>
              <button class="action-plan-approval-modal__warning" type="button">{{ actionPlanApprovalRequestChangesLabel }}</button>
              <button class="action-plan-approval-modal__danger" type="button">{{ actionPlanApprovalRejectLabel }}</button>
              <button class="action-plan-approval-modal__primary" type="button">{{ actionPlanApprovalApproveLabel }}</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="duplicateJobModalOpen" ref="duplicateJobBodyRef" class="duplicate-job-layer" @click="closeDuplicateJobModal">
        <div class="duplicate-job-modal" :class="{ 'duplicate-job-modal--advanced': duplicateJobView === 'advanced' }" @click.stop>
          <div class="duplicate-job-modal__head">
            <div class="duplicate-job-modal__title-wrap">
              <div class="duplicate-job-modal__title-icon">
                <AppIcon name="copy" :size="18" />
              </div>
              <div>
                <h2>Duplicate Job</h2>
                <p>Create a copy of this job and customize the details as needed.</p>
              </div>
            </div>

            <button class="duplicate-job-modal__close" type="button" @click="closeDuplicateJobModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="duplicate-job-modal__body" :class="{ 'duplicate-job-modal__body--advanced': duplicateJobView === 'advanced' }">
            <template v-if="duplicateJobView === 'basic'">
              <section v-if="duplicateJobTarget" class="duplicate-job-source">
                <div class="duplicate-job-source__icon">
                  <AppIcon name="copy" :size="18" />
                </div>
                <div class="duplicate-job-source__copy">
                  <span>SOURCE JOB</span>
                  <strong>{{ duplicateJobTarget.title }}</strong>
                  <small class="duplicate-job-source__meta">
                    <span>{{ duplicateJobTarget.department }}</span>
                    <span>{{ duplicateJobTarget.location }}</span>
                    <span>{{ getJobEmploymentType(duplicateJobTarget) }}</span>
                  </small>
                </div>
              </section>

              <section class="duplicate-job-form">
                <label class="duplicate-job-field">
                  <span>New Job Title <i>*</i></span>
                  <input v-model="duplicateJobForm.title" type="text" />
                </label>

                <label class="duplicate-job-field">
                  <span>Department</span>
                  <AppSelect v-model="duplicateJobForm.department" :options="duplicateJobDepartmentOptions" />
                </label>

                <label class="duplicate-job-field">
                  <span>Location</span>
                  <div class="duplicate-job-select duplicate-job-select--icon">
                    <span class="duplicate-job-select__icon">
                      <AppIcon name="mapPin" :size="15" />
                    </span>
                    <AppSelect v-model="duplicateJobForm.location" :options="duplicateJobLocationOptions" />
                  </div>
                </label>

                <label class="duplicate-job-field">
                  <span>Employment Type</span>
                  <div class="duplicate-job-select duplicate-job-select--icon">
                    <span class="duplicate-job-select__icon">
                      <AppIcon name="briefcase" :size="15" />
                    </span>
                    <AppSelect v-model="duplicateJobForm.employmentType" :options="duplicateJobEmploymentOptions" />
                  </div>
                </label>
              </section>

              <section class="duplicate-job-copy">
                <h3>What would you like to copy?</h3>

                <div class="duplicate-job-copy__grid">
                  <button
                    v-for="option in duplicateJobCopyOptions"
                    :key="option.id"
                    class="duplicate-job-copy-card"
                    :class="{ 'is-selected': duplicateJobSelections[option.id] }"
                    type="button"
                    @click="toggleDuplicateJobSelection(option.id)"
                  >
                    <span class="duplicate-job-copy-card__icon">
                      <AppIcon :name="option.icon" :size="18" />
                    </span>
                    <span class="duplicate-job-copy-card__copy">
                      <strong>{{ option.title }}</strong>
                      <small>{{ option.note }}</small>
                    </span>
                    <span class="duplicate-job-copy-card__check" :class="{ 'is-selected': duplicateJobSelections[option.id] }">
                      <AppIcon v-if="duplicateJobSelections[option.id]" name="check" :size="13" />
                    </span>
                  </button>
                </div>
              </section>

              <section class="duplicate-job-advanced">
                <button class="duplicate-job-advanced__toggle" type="button" @click="openDuplicateJobAdvancedView">
                  <span class="duplicate-job-advanced__copy">
                    <strong>Advanced Options</strong>
                    <small>Set different dates, salary range, or additional settings</small>
                  </span>
                  <AppIcon name="chevronDown" :size="18" />
                </button>
              </section>
            </template>

            <div v-else-if="duplicateJobTarget" class="duplicate-job-advanced-screen">
              <div class="duplicate-job-advanced-screen__main">
                <section class="duplicate-job-source duplicate-job-source--advanced">
                  <div class="duplicate-job-source__summary">
                    <div class="duplicate-job-source__icon">
                      <AppIcon name="copy" :size="18" />
                    </div>
                    <div class="duplicate-job-source__copy">
                      <span>SOURCE JOB</span>
                      <strong>{{ duplicateJobTarget.title }}</strong>
                      <small class="duplicate-job-source__meta">
                        <span>{{ duplicateJobTarget.department }}</span>
                        <span>{{ duplicateJobTarget.location }}</span>
                        <span>{{ getJobEmploymentType(duplicateJobTarget) }}</span>
                        <span>{{ getDuplicateSourceStatus(duplicateJobTarget) }}</span>
                      </small>
                    </div>
                  </div>

                  <button class="duplicate-job-source__action" type="button" @click="openJob(duplicateJobTarget)">
                    View Job
                    <AppIcon name="external-link" :size="14" />
                  </button>
                </section>

                <section class="duplicate-job-advanced-section">
                  <div class="duplicate-job-section__head">
                    <span class="duplicate-job-section__step">1</span>
                    <h3>New job details</h3>
                  </div>

                  <div class="duplicate-job-form duplicate-job-form--advanced">
                    <label class="duplicate-job-field">
                      <span>New Job Title <i>*</i></span>
                      <input v-model="duplicateJobForm.title" type="text" />
                    </label>

                    <label class="duplicate-job-field">
                      <span>Department</span>
                      <AppSelect v-model="duplicateJobForm.department" :options="duplicateJobDepartmentOptions" />
                    </label>

                    <label class="duplicate-job-field">
                      <span>Location</span>
                      <div class="duplicate-job-select duplicate-job-select--icon">
                        <span class="duplicate-job-select__icon">
                          <AppIcon name="mapPin" :size="15" />
                        </span>
                        <AppSelect v-model="duplicateJobForm.location" :options="duplicateJobLocationOptions" />
                      </div>
                    </label>

                    <label class="duplicate-job-field">
                      <span>Employment Type</span>
                      <div class="duplicate-job-select duplicate-job-select--icon">
                        <span class="duplicate-job-select__icon">
                          <AppIcon name="briefcase" :size="15" />
                        </span>
                        <AppSelect v-model="duplicateJobForm.employmentType" :options="duplicateJobEmploymentOptions" />
                      </div>
                    </label>

                    <label class="duplicate-job-field">
                      <span>Open Positions</span>
                      <div class="duplicate-job-input duplicate-job-input--icon">
                        <span class="duplicate-job-input__icon">
                          <AppIcon name="users" :size="15" />
                        </span>
                        <input v-model="duplicateJobForm.openPositions" type="text" />
                      </div>
                    </label>

                    <label class="duplicate-job-field">
                      <span>Job Status</span>
                      <div class="duplicate-job-select duplicate-job-select--icon">
                        <span class="duplicate-job-select__icon">
                          <AppIcon name="target" :size="15" />
                        </span>
                        <AppSelect v-model="duplicateJobForm.status" :options="duplicateJobStatusOptions" />
                      </div>
                    </label>
                  </div>
                </section>

                <section class="duplicate-job-advanced-section">
                  <div class="duplicate-job-section__head">
                    <span class="duplicate-job-section__step">2</span>
                    <h3>What would you like to reuse from the original job?</h3>
                  </div>

                  <div class="duplicate-job-copy__grid duplicate-job-copy__grid--advanced">
                    <button
                      v-for="option in duplicateJobCopyOptions"
                      :key="option.id"
                      class="duplicate-job-copy-card"
                      :class="{ 'is-selected': duplicateJobSelections[option.id] }"
                      type="button"
                      @click="toggleDuplicateJobSelection(option.id)"
                    >
                      <span class="duplicate-job-copy-card__icon">
                        <AppIcon :name="option.icon" :size="18" />
                      </span>
                      <span class="duplicate-job-copy-card__copy">
                        <strong>{{ option.title }}</strong>
                        <small>{{ option.note }}</small>
                      </span>
                      <span class="duplicate-job-copy-card__check" :class="{ 'is-selected': duplicateJobSelections[option.id] }">
                        <AppIcon v-if="duplicateJobSelections[option.id]" name="check" :size="13" />
                      </span>
                    </button>
                  </div>
                </section>

                <section class="duplicate-job-advanced-section">
                  <div class="duplicate-job-section__head duplicate-job-section__head--with-action">
                    <div class="duplicate-job-section__title">
                      <span class="duplicate-job-section__step">3</span>
                      <h3>Advanced options</h3>
                    </div>

                    <button class="duplicate-job-collapse-all" type="button" @click="toggleAllDuplicateJobPanels">
                      {{ duplicateJobAllPanelsOpen ? 'Collapse All' : 'Expand All' }}
                      <AppIcon :name="duplicateJobAllPanelsOpen ? 'chevronUp' : 'chevronDown'" :size="14" />
                    </button>
                  </div>

                  <div class="duplicate-job-advanced-panels">
                    <section class="duplicate-job-panel">
                      <button class="duplicate-job-panel__head" type="button" @click="toggleDuplicateJobPanel('hiringDetails')">
                        <span class="duplicate-job-panel__title">
                          <AppIcon name="calendar" :size="16" />
                          Hiring Details
                        </span>
                        <AppIcon :name="duplicateJobAdvancedPanels.hiringDetails ? 'chevronUp' : 'chevronDown'" :size="16" />
                      </button>

                      <div v-if="duplicateJobAdvancedPanels.hiringDetails" class="duplicate-job-panel__body">
                        <div class="duplicate-job-panel__grid duplicate-job-panel__grid--four">
                          <label class="duplicate-job-field">
                            <span>Opening Date</span>
                            <div class="duplicate-job-input duplicate-job-input--icon">
                              <span class="duplicate-job-input__icon">
                                <AppIcon name="calendar" :size="15" />
                              </span>
                              <input v-model="duplicateJobForm.openingDate" type="text" />
                            </div>
                          </label>

                          <label class="duplicate-job-field">
                            <span>Application Deadline</span>
                            <div class="duplicate-job-input duplicate-job-input--icon">
                              <span class="duplicate-job-input__icon">
                                <AppIcon name="calendar" :size="15" />
                              </span>
                              <input v-model="duplicateJobForm.applicationDeadline" type="text" />
                            </div>
                          </label>

                          <label class="duplicate-job-field">
                            <span>Target Start Date</span>
                            <div class="duplicate-job-input duplicate-job-input--icon">
                              <span class="duplicate-job-input__icon">
                                <AppIcon name="calendar" :size="15" />
                              </span>
                              <input v-model="duplicateJobForm.targetStartDate" type="text" />
                            </div>
                          </label>

                          <div class="duplicate-job-field">
                            <span>Hiring Priority</span>
                            <div class="duplicate-job-radio-row">
                              <label class="duplicate-job-radio">
                                <input v-model="duplicateJobForm.hiringPriority" type="radio" value="low" />
                                <span>Low</span>
                              </label>
                              <label class="duplicate-job-radio">
                                <input v-model="duplicateJobForm.hiringPriority" type="radio" value="medium" />
                                <span>Medium</span>
                              </label>
                              <label class="duplicate-job-radio">
                                <input v-model="duplicateJobForm.hiringPriority" type="radio" value="high" />
                                <span>High</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section class="duplicate-job-panel">
                      <button class="duplicate-job-panel__head" type="button" @click="toggleDuplicateJobPanel('compensation')">
                        <span class="duplicate-job-panel__title">
                          <AppIcon name="wallet" :size="16" />
                          Compensation
                        </span>
                        <AppIcon :name="duplicateJobAdvancedPanels.compensation ? 'chevronUp' : 'chevronDown'" :size="16" />
                      </button>

                      <div v-if="duplicateJobAdvancedPanels.compensation" class="duplicate-job-panel__body">
                        <div class="duplicate-job-panel__grid duplicate-job-panel__grid--four">
                          <label class="duplicate-job-field">
                            <span>Minimum</span>
                            <input v-model="duplicateJobForm.salaryMin" type="text" />
                          </label>

                          <label class="duplicate-job-field">
                            <span>Maximum</span>
                            <input v-model="duplicateJobForm.salaryMax" type="text" />
                          </label>

                          <label class="duplicate-job-field">
                            <span>Currency</span>
                            <AppSelect v-model="duplicateJobForm.currency" :options="duplicateJobCurrencyOptions" />
                          </label>

                          <label class="duplicate-job-checkbox duplicate-job-checkbox--stacked">
                            <span>Salary Visibility</span>
                            <span class="duplicate-job-checkbox__row">
                              <input v-model="duplicateJobForm.salaryVisible" type="checkbox" />
                              <span>Show salary in job ad</span>
                            </span>
                          </label>
                        </div>
                      </div>
                    </section>

                    <section class="duplicate-job-panel">
                      <button class="duplicate-job-panel__head" type="button" @click="toggleDuplicateJobPanel('publishing')">
                        <span class="duplicate-job-panel__title">
                          <AppIcon name="megaphone" :size="16" />
                          Publishing
                        </span>
                        <AppIcon :name="duplicateJobAdvancedPanels.publishing ? 'chevronUp' : 'chevronDown'" :size="16" />
                      </button>

                      <div v-if="duplicateJobAdvancedPanels.publishing" class="duplicate-job-panel__body">
                        <div class="duplicate-job-panel__split">
                          <div class="duplicate-job-checkbox-group">
                            <span class="duplicate-job-panel__label">Publish on</span>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.publishCareerSite" type="checkbox" /><span>Career Site</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.publishLinkedIn" type="checkbox" /><span>LinkedIn</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.publishIndeed" type="checkbox" /><span>Indeed</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.publishInternalPortal" type="checkbox" /><span>Internal Portal</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.publishGlassdoor" type="checkbox" /><span>Glassdoor</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.publishMonster" type="checkbox" /><span>Monster</span></label>
                          </div>

                          <div class="duplicate-job-visibility">
                            <span class="duplicate-job-panel__label">Visibility</span>
                            <label class="duplicate-job-radio duplicate-job-radio--stacked">
                              <input v-model="duplicateJobForm.visibility" type="radio" value="public" />
                              <span>Public</span>
                            </label>
                            <label class="duplicate-job-radio duplicate-job-radio--stacked">
                              <input v-model="duplicateJobForm.visibility" type="radio" value="internal" />
                              <span>Internal Only</span>
                            </label>
                            <label class="duplicate-job-radio duplicate-job-radio--stacked">
                              <input v-model="duplicateJobForm.visibility" type="radio" value="confidential" />
                              <span>Confidential</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section class="duplicate-job-panel">
                      <button class="duplicate-job-panel__head" type="button" @click="toggleDuplicateJobPanel('hiringTeam')">
                        <span class="duplicate-job-panel__title">
                          <AppIcon name="users" :size="16" />
                          Hiring Team
                        </span>
                        <AppIcon :name="duplicateJobAdvancedPanels.hiringTeam ? 'chevronUp' : 'chevronDown'" :size="16" />
                      </button>

                      <div v-if="duplicateJobAdvancedPanels.hiringTeam" class="duplicate-job-panel__body">
                        <div class="duplicate-job-panel__grid duplicate-job-panel__grid--three">
                          <label class="duplicate-job-field">
                            <span>Hiring Manager</span>
                            <AppSelect v-model="duplicateJobForm.hiringManager" :options="duplicateJobHiringManagerOptions" />
                          </label>

                          <label class="duplicate-job-field">
                            <span>Recruiter</span>
                            <AppSelect v-model="duplicateJobForm.recruiter" :options="duplicateJobRecruiterOptions" />
                          </label>

                          <div class="duplicate-job-field">
                            <span>Interview Panel</span>
                            <div class="duplicate-job-panel-box">
                              <label class="duplicate-job-checkbox duplicate-job-panel-box__toggle">
                                <input v-model="duplicateJobForm.copyInterviewPanel" type="checkbox" />
                                <span class="duplicate-job-panel-box__copy">Copy existing panel</span>
                              </label>
                              <button class="duplicate-job-panel-box__button" type="button">Edit Panel</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section class="duplicate-job-panel">
                      <button class="duplicate-job-panel__head" type="button" @click="toggleDuplicateJobPanel('workflow')">
                        <span class="duplicate-job-panel__title">
                          <AppIcon name="settings" :size="16" />
                          Workflow &amp; Permissions
                        </span>
                        <AppIcon :name="duplicateJobAdvancedPanels.workflow ? 'chevronUp' : 'chevronDown'" :size="16" />
                      </button>

                      <div v-if="duplicateJobAdvancedPanels.workflow" class="duplicate-job-panel__body">
                        <div class="duplicate-job-panel__split">
                          <div class="duplicate-job-checkbox-group">
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.workflowStages" type="checkbox" /><span>Copy workflow stages</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.approvalWorkflow" type="checkbox" /><span>Copy approval workflow</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.permissions" type="checkbox" /><span>Copy permissions</span></label>
                          </div>

                          <div class="duplicate-job-workflow">
                            <span class="duplicate-job-panel__label">Workflow Preview</span>
                            <div class="duplicate-job-workflow__chips">
                              <span v-for="stage in duplicateJobWorkflowPreview" :key="stage" class="duplicate-job-workflow__chip">{{ stage }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section class="duplicate-job-panel">
                      <button class="duplicate-job-panel__head" type="button" @click="toggleDuplicateJobPanel('automation')">
                        <span class="duplicate-job-panel__title">
                          <AppIcon name="sparkles" :size="16" />
                          Nitro Automation
                        </span>
                        <AppIcon :name="duplicateJobAdvancedPanels.automation ? 'chevronUp' : 'chevronDown'" :size="16" />
                      </button>

                      <div v-if="duplicateJobAdvancedPanels.automation" class="duplicate-job-panel__body">
                        <div class="duplicate-job-panel__split">
                          <div class="duplicate-job-checkbox-group duplicate-job-checkbox-group--two">
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.autoCandidateMatching" type="checkbox" /><span>Auto candidate matching</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.autoInterviewScheduling" type="checkbox" /><span>Auto interview scheduling</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.autoFeedbackReminders" type="checkbox" /><span>Auto feedback reminders</span></label>
                            <label class="duplicate-job-checkbox"><input v-model="duplicateJobForm.autoFollowUps" type="checkbox" /><span>Auto candidate follow-ups</span></label>
                          </div>

                          <div class="duplicate-job-time-saved">
                            <span>Estimated time saved</span>
                            <strong>4.2 hrs / month</strong>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </section>

                <section class="duplicate-job-advanced-section">
                  <div class="duplicate-job-section__head">
                    <span class="duplicate-job-section__step">4</span>
                    <h3>Publish settings</h3>
                  </div>

                  <div class="duplicate-job-publish-grid">
                    <label
                      v-for="option in duplicateJobPublishSettingOptions"
                      :key="option.id"
                      class="duplicate-job-publish-card"
                      :class="{ 'is-selected': duplicateJobForm.publishSetting === option.id }"
                    >
                      <input v-model="duplicateJobForm.publishSetting" type="radio" :value="option.id" />
                      <span class="duplicate-job-publish-card__copy">
                        <strong>{{ option.title }}</strong>
                        <small>{{ option.note }}</small>
                      </span>
                    </label>
                  </div>
                </section>

                <section class="duplicate-job-bottom-note">
                  <div class="duplicate-job-bottom-note__status">
                    <span class="duplicate-job-bottom-note__dot">
                      <AppIcon name="checkCircle" :size="14" />
                    </span>
                    <strong>{{ duplicateJobSelectedCount }} sections selected</strong>
                    <span>{{ duplicateJobChangesCount }} changes made</span>
                  </div>
                  <small>Source: {{ duplicateJobTarget.title }}</small>
                </section>
              </div>

              <aside class="duplicate-job-advanced-screen__aside">
                <section class="duplicate-job-summary-card">
                  <h3>Duplicate Summary</h3>

                  <div class="duplicate-job-summary-card__group">
                    <span class="duplicate-job-summary-card__label">Source Job</span>
                    <strong>{{ duplicateJobTarget.title }}</strong>
                    <small>{{ duplicateJobTarget.department }}</small>
                    <small>{{ duplicateJobTarget.location }}</small>
                    <small>{{ getJobEmploymentType(duplicateJobTarget) }} آ· {{ getDuplicateSourceStatus(duplicateJobTarget) }}</small>
                  </div>

                  <div class="duplicate-job-summary-card__group">
                    <span class="duplicate-job-summary-card__label duplicate-job-summary-card__label--pink">New Job (Preview)</span>
                    <ul class="duplicate-job-preview-list">
                      <li><AppIcon name="document" :size="14" /> <span>{{ duplicateJobForm.title }}</span></li>
                      <li><AppIcon name="building" :size="14" /> <span>{{ duplicateJobForm.department }}</span></li>
                      <li><AppIcon name="mapPin" :size="14" /> <span>{{ duplicateJobForm.location }}</span></li>
                      <li><AppIcon name="briefcase" :size="14" /> <span>{{ duplicateJobForm.employmentType }}</span></li>
                      <li><AppIcon name="users" :size="14" /> <span>{{ duplicateJobPreviewPositionsLabel }}</span></li>
                      <li><AppIcon name="target" :size="14" /> <span>{{ duplicateJobPreviewStatus }}</span></li>
                    </ul>
                  </div>

                  <div class="duplicate-job-summary-card__group">
                    <div class="duplicate-job-summary-card__row">
                      <span class="duplicate-job-summary-card__label">What will be duplicated</span>
                      <span class="duplicate-job-summary-card__badge">{{ duplicateJobSelectedCount }}</span>
                    </div>

                    <ul class="duplicate-job-duplicate-list">
                      <li v-for="option in duplicateJobSelectedOptions" :key="option.id">
                        <span class="duplicate-job-duplicate-list__dot"></span>
                        <span>{{ option.title }}</span>
                      </li>
                    </ul>
                  </div>

                  <div class="duplicate-job-insight">
                    <div class="duplicate-job-insight__head">
                      <AppIcon name="sparkles" :size="14" />
                      <span>Nitro Insight</span>
                    </div>
                    <p>This role received 42 applicants on average and has a high conversion rate.</p>
                  </div>
                </section>
              </aside>
            </div>
          </div>

          <div class="duplicate-job-modal__footer">
            <button class="duplicate-job-modal__secondary" type="button" @click="closeDuplicateJobModal">Cancel</button>
            <button class="duplicate-job-modal__primary" type="button" @click="submitDuplicateJob">
              <AppIcon name="copy" :size="15" />
              Duplicate Job
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="shareJobModalOpen" class="share-job-layer" @click="closeShareJobModal">
        <div class="share-job-modal" @click.stop>
          <div class="share-job-modal__head">
            <div class="share-job-modal__title-wrap">
              <div class="share-job-modal__title-icon">
                <AppIcon name="share" :size="18" />
              </div>
              <div>
                <h2>Share Job</h2>
                <p>Share this job with your network and find the best talent faster.</p>
              </div>
            </div>

            <button class="share-job-modal__close" type="button" @click="closeShareJobModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="share-job-modal__body">
            <section class="share-job-section">
              <div class="share-job-section__head">
                <h3>
                  Public Job Link
                  <AppIcon name="info" :size="13" />
                </h3>
                <span>{{ shareJobMeta }}</span>
              </div>

              <p>Anyone with this link can view and apply to this job.</p>

              <div class="share-job-linkbox">
                <label class="share-job-linkfield">
                  <AppIcon name="link" :size="15" />
                  <input :value="shareJobUrl" readonly @focus="$event.target.select()" />
                </label>

                <button class="share-job-copy" type="button" @click="copyShareJobLink">
                  <AppIcon name="external-link" :size="14" />
                  {{ shareJobCopied ? 'Copied' : 'Copy Link' }}
                </button>
              </div>

              <div v-if="shareJobCopied" class="share-job-alert">
                <AppIcon name="checkCircle" :size="16" />
                <span>Link copied to clipboard!</span>
              </div>
            </section>

            <section class="share-job-section">
              <h3>Share via</h3>

              <div class="share-job-grid">
                <button
                  v-for="platform in sharePlatformOptions"
                  :key="platform.id"
                  class="share-job-channel"
                  type="button"
                  @click="handleSharePlatform(platform.id)"
                >
                  <span class="share-job-channel__badge" :class="`is-${platform.tone}`">
                    <AppIcon v-if="platform.icon" :name="platform.icon" :size="20" />
                    <span v-else>{{ platform.shortLabel }}</span>
                  </span>
                  <span>{{ platform.label }}</span>
                </button>
              </div>
            </section>

            <section class="share-job-section">
              <h3>Other options</h3>

              <div class="share-job-options">
                <button class="share-job-option" type="button" @click="previewSharedJob">
                  <span class="share-job-option__icon">
                    <AppIcon name="eye" :size="18" />
                  </span>
                  <span class="share-job-option__copy">
                    <strong>Preview Job Page</strong>
                    <small>Open the job page in a new tab to see how it looks.</small>
                  </span>
                  <AppIcon name="chevronRight" :size="16" />
                </button>

                <button class="share-job-option" type="button" @click="downloadShareJobQr">
                  <span class="share-job-option__icon">
                    <AppIcon name="qr" :size="18" />
                  </span>
                  <span class="share-job-option__copy">
                    <strong>Download QR Code</strong>
                    <small>Download QR code to share offline or on posters.</small>
                  </span>
                  <AppIcon name="chevronRight" :size="16" />
                </button>
              </div>
            </section>
          </div>

          <div class="share-job-modal__footer">
            <button class="share-job-modal__secondary" type="button" @click="closeShareJobModal">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="duplicateJobSuccessModalOpen" class="duplicate-success-layer" @click="closeDuplicateJobSuccessModal">
        <div v-if="duplicateJobSuccessData" class="duplicate-success-modal" @click.stop>
          <button class="duplicate-success-modal__close" type="button" @click="closeDuplicateJobSuccessModal">
            <AppIcon name="close" :size="18" />
          </button>

          <div class="duplicate-success-modal__hero">
            <span class="duplicate-success-modal__spark is-one">+</span>
            <span class="duplicate-success-modal__spark is-two">✦</span>
            <span class="duplicate-success-modal__spark is-three">•</span>
            <span class="duplicate-success-modal__spark is-four">+</span>
            <span class="duplicate-success-modal__spark is-five">•</span>

            <div class="duplicate-success-modal__icon">
              <div class="duplicate-success-modal__icon-ring">
                <AppIcon name="checkCircle" :size="34" />
              </div>
            </div>

            <h2>Job Duplicated Successfully!</h2>
            <p>A copy of the job has been created and saved as a draft.</p>
          </div>

          <section class="duplicate-success-card">
            <div class="duplicate-success-card__head">
              <div class="duplicate-success-card__icon">
                <AppIcon name="briefcase" :size="20" />
              </div>

              <div class="duplicate-success-card__copy">
                <strong>{{ duplicateJobSuccessData.title }}</strong>
                <div class="duplicate-success-card__meta">
                  <span><AppIcon name="building" :size="13" /> {{ duplicateJobSuccessData.department }}</span>
                  <span><AppIcon name="mapPin" :size="13" /> {{ duplicateJobSuccessData.location }}</span>
                  <span><AppIcon name="clock" :size="13" /> {{ duplicateJobSuccessData.employmentType }}</span>
                </div>
              </div>
            </div>

            <div class="duplicate-success-card__details">
              <div class="duplicate-success-card__row">
                <span>Copied from:</span>
                <strong>{{ duplicateJobSuccessData.sourceJob.title }}</strong>
              </div>

              <div class="duplicate-success-card__row">
                <span>Status:</span>
                <label class="duplicate-success-card__status">{{ duplicateJobSuccessData.status }}</label>
              </div>
            </div>
          </section>

          <section class="duplicate-success-next">
            <div class="duplicate-success-next__icon">
              <AppIcon name="checkCircle" :size="18" />
            </div>
            <div>
              <strong>What's next?</strong>
              <p>You can review and edit the job before publishing.</p>
            </div>
          </section>

          <div class="duplicate-success-actions">
            <button class="duplicate-success-actions__secondary" type="button" @click="viewDuplicatedJob">
              <AppIcon name="eye" :size="16" />
              View Duplicated Job
            </button>

            <button class="duplicate-success-actions__primary" type="button" @click="continueEditingDuplicatedJob">
              <AppIcon name="edit" :size="16" />
              Continue Editing
            </button>
          </div>

          <button class="duplicate-success-modal__dismiss" type="button" @click="closeDuplicateJobSuccessModal">Close</button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="reschedulePublicationModalOpen" class="reschedule-publication-layer" @click="closeReschedulePublicationModal">
        <div v-if="reschedulePublicationTarget" class="reschedule-publication-modal" @click.stop>
          <div class="reschedule-publication-modal__head">
            <div class="reschedule-publication-modal__title-wrap">
              <div class="reschedule-publication-modal__title-icon">
                <AppIcon name="calendar" :size="18" />
              </div>
              <div>
                <h2>Reschedule Publication</h2>
                <p>Change when this job will close and be published again.</p>
              </div>
            </div>

            <button class="reschedule-publication-modal__close" type="button" @click="closeReschedulePublicationModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="reschedule-publication-modal__body">
            <section class="reschedule-publication-source">
              <div class="reschedule-publication-source__icon">
                <AppIcon name="briefcase" :size="18" />
              </div>

              <div class="reschedule-publication-source__copy">
                <strong>{{ reschedulePublicationTarget.title }}</strong>
                <small>
                  <span>{{ reschedulePublicationTarget.department }}</span>
                  <span>{{ reschedulePublicationTarget.location }}</span>
                  <span>{{ getJobEmploymentType(reschedulePublicationTarget) }}</span>
                </small>
              </div>

              <div class="reschedule-publication-source__status">
                <label>PUBLISHED</label>
                <span>Published on May 12, 2024</span>
              </div>
            </section>

            <div class="reschedule-publication-content">
              <div class="reschedule-publication-main">
                <section class="reschedule-publication-block">
                  <h3>1. When should this job close?</h3>
                  <p>The job will be hidden from all channels on this date.</p>

                  <label class="reschedule-publication-input">
                    <span class="reschedule-publication-input__icon">
                      <AppIcon name="calendar" :size="16" />
                    </span>
                    <input v-model="reschedulePublicationForm.closeDate" type="text" />
                    <button type="button" tabindex="-1">
                      <AppIcon name="close" :size="14" />
                    </button>
                    <button type="button" tabindex="-1">
                      <AppIcon name="chevronDown" :size="16" />
                    </button>
                  </label>
                </section>

                <section class="reschedule-publication-block">
                  <h3>2. When should this job be republished?</h3>
                  <p>The job will be visible again on the selected date.</p>

                  <label class="reschedule-publication-input">
                    <span class="reschedule-publication-input__icon">
                      <AppIcon name="calendar" :size="16" />
                    </span>
                    <input v-model="reschedulePublicationForm.republishDate" type="text" />
                    <button type="button" tabindex="-1">
                      <AppIcon name="close" :size="14" />
                    </button>
                    <button type="button" tabindex="-1">
                      <AppIcon name="chevronDown" :size="16" />
                    </button>
                  </label>
                </section>

                <section class="reschedule-publication-block">
                  <h3>3. Publishing channels</h3>
                  <p>Choose where this job will be republished.</p>

                  <div class="reschedule-publication-channels">
                    <label
                      v-for="channel in reschedulePublicationChannels"
                      :key="channel.id"
                      class="reschedule-publication-channel"
                    >
                      <div class="reschedule-publication-channel__head">
                        <span class="reschedule-publication-channel__icon">
                          <AppIcon :name="channel.icon" :size="18" />
                        </span>
                        <span>{{ channel.label }}</span>
                        <input v-model="reschedulePublicationForm[channel.id]" type="checkbox" />
                      </div>
                      <small>Live</small>
                    </label>
                  </div>

                  <label class="reschedule-publication-visibility">
                    <input v-model="reschedulePublicationForm.keepVisibility" type="checkbox" />
                    <span>Keep current visibility settings (Public)</span>
                    <AppIcon name="info" :size="14" />
                  </label>
                </section>

                <section class="reschedule-publication-note">
                  <AppIcon name="info" :size="16" />
                  <span>Candidates will still see the job and can continue applying until it closes.</span>
                </section>
              </div>

              <aside class="reschedule-publication-summary">
                <h3>Schedule summary</h3>

                <div class="reschedule-publication-summary__item">
                  <span class="reschedule-publication-summary__badge is-pink">
                    <AppIcon name="calendar" :size="16" />
                  </span>
                  <div>
                    <label>Closes on</label>
                    <strong>{{ reschedulePublicationForm.closeDate }}</strong>
                    <small>In 12 days</small>
                  </div>
                </div>

                <div class="reschedule-publication-summary__item">
                  <span class="reschedule-publication-summary__badge is-green">
                    <AppIcon name="calendar" :size="16" />
                  </span>
                  <div>
                    <label>Republishes on</label>
                    <strong>{{ reschedulePublicationForm.republishDate }}</strong>
                    <small class="is-green">In 27 days</small>
                  </div>
                </div>

                <div class="reschedule-publication-summary__divider"></div>

                <div class="reschedule-publication-summary__what">
                  <h4>WHAT HAPPENS?</h4>
                  <ul>
                    <li>
                      <AppIcon name="check" :size="14" />
                      <span>The job will be removed from all channels on Aug 31, 2025.</span>
                    </li>
                    <li>
                      <AppIcon name="check" :size="14" />
                      <span>It will be republished on Sep 15, 2025 to the selected channels.</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>

          <div class="reschedule-publication-modal__footer">
            <button class="reschedule-publication-modal__secondary" type="button" @click="closeReschedulePublicationModal">Cancel</button>
            <button class="reschedule-publication-modal__primary" type="button" @click="saveReschedulePublication">
              <AppIcon name="calendar" :size="15" />
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="reschedulePublicationSuccessModalOpen"
        class="reschedule-success-layer"
        @click="closeReschedulePublicationSuccessModal"
      >
        <div v-if="reschedulePublicationSuccessData" class="reschedule-success-modal" @click.stop>
          <button class="reschedule-success-modal__close" type="button" @click="closeReschedulePublicationSuccessModal">
            <AppIcon name="close" :size="18" />
          </button>

          <div class="reschedule-success-modal__hero">
            <span class="reschedule-success-modal__spark is-one">+</span>
            <span class="reschedule-success-modal__spark is-two">✦</span>
            <span class="reschedule-success-modal__spark is-three">•</span>
            <span class="reschedule-success-modal__spark is-four">+</span>
            <span class="reschedule-success-modal__spark is-five">✦</span>

            <div class="reschedule-success-modal__icon">
              <div class="reschedule-success-modal__icon-ring">
                <AppIcon name="check" :size="34" />
              </div>
            </div>

            <h2>Schedule saved successfully!</h2>
            <p>This job will close and be republished as per your schedule.</p>
          </div>

          <section class="reschedule-success-job">
            <div class="reschedule-success-job__head">
              <span class="reschedule-success-job__icon">
                <AppIcon name="briefcase" :size="18" />
              </span>

              <div class="reschedule-success-job__copy">
                <strong>{{ reschedulePublicationSuccessData.job.title }}</strong>
                <small>
                  <span>{{ reschedulePublicationSuccessData.job.department }}</span>
                  <span>{{ reschedulePublicationSuccessData.job.location }}</span>
                  <span>{{ getJobEmploymentType(reschedulePublicationSuccessData.job) }}</span>
                </small>
              </div>

              <div class="reschedule-success-job__status">
                <label>PUBLISHED</label>
                <span>Published on May 12, 2024</span>
              </div>
            </div>
          </section>

          <section class="reschedule-success-timeline">
            <article class="reschedule-success-timeline__step">
              <span class="reschedule-success-timeline__badge is-pink">
                <AppIcon name="calendar" :size="16" />
              </span>
              <label>CLOSES ON</label>
              <strong>{{ reschedulePublicationSuccessData.closeDate }}</strong>
              <small>{{ reschedulePublicationSuccessData.closeMeta }}</small>
            </article>

            <span class="reschedule-success-timeline__line"></span>

            <article class="reschedule-success-timeline__step">
              <span class="reschedule-success-timeline__badge is-slate">
                <AppIcon name="eye" :size="16" />
              </span>
              <label>HIDDEN FOR</label>
              <strong>{{ reschedulePublicationSuccessData.hiddenFor }}</strong>
              <p>Job will be hidden from all channels</p>
            </article>

            <span class="reschedule-success-timeline__line"></span>

            <article class="reschedule-success-timeline__step">
              <span class="reschedule-success-timeline__badge is-green">
                <AppIcon name="calendar" :size="16" />
              </span>
              <label>REPUBLISHES ON</label>
              <strong>{{ reschedulePublicationSuccessData.republishDate }}</strong>
              <small class="is-green">{{ reschedulePublicationSuccessData.republishMeta }}</small>
            </article>
          </section>

          <section class="reschedule-success-channels">
            <h3>Publishing channels</h3>

            <div class="reschedule-success-channels__grid">
              <article
                v-for="channel in reschedulePublicationSuccessData.channels"
                :key="channel.id"
                class="reschedule-success-channel"
              >
                <span class="reschedule-success-channel__icon">
                  <AppIcon :name="channel.icon" :size="18" />
                </span>

                <div class="reschedule-success-channel__copy">
                  <strong>{{ channel.label }}</strong>
                  <small>Live</small>
                </div>
              </article>
            </div>
          </section>

          <section class="reschedule-success-note">
            <AppIcon name="info" :size="16" />
            <div>
              <strong>Candidates can continue applying until {{ reschedulePublicationSuccessData.closeDate }}.</strong>
              <p>Current applicants will not be affected.</p>
            </div>
          </section>

          <div class="reschedule-success-actions">
            <button class="reschedule-success-actions__secondary" type="button" @click="viewRescheduledJob">
              <AppIcon name="eye" :size="16" />
              View Job
            </button>

            <button class="reschedule-success-actions__primary" type="button" @click="closeReschedulePublicationSuccessModal">
              Done
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="pauseJobModalOpen" class="pause-job-layer" @click="closePauseJobModal">
        <div v-if="pauseJobTarget" class="pause-job-modal" @click.stop>
          <div class="pause-job-modal__head">
            <div class="pause-job-modal__title-wrap">
              <div class="pause-job-modal__title-icon">
                <AppIcon name="pause" :size="18" />
              </div>
              <div>
                <h2>Pause Job</h2>
                <p>Temporarily stop accepting applications without closing the job.</p>
              </div>
            </div>

            <button class="pause-job-modal__close" type="button" @click="closePauseJobModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="pause-job-modal__body">
            <section class="pause-job-source">
              <div class="pause-job-source__icon">
                <AppIcon name="briefcase" :size="18" />
              </div>

              <div class="pause-job-source__copy">
                <div class="pause-job-source__title">
                  <strong>{{ pauseJobTarget.title }}</strong>
                  <label>PUBLISHED</label>
                </div>

                <small>
                  <span>{{ pauseJobTarget.department }}</span>
                  <span>{{ pauseJobTarget.location }}</span>
                  <span>{{ getJobEmploymentType(pauseJobTarget) }}</span>
                </small>
              </div>

              <div class="pause-job-source__meta">
                <strong>{{ pauseJobTarget.applicants }} applicants</strong>
              </div>
            </section>

            <section class="pause-job-section">
              <h3>Reason <span>(optional)</span></h3>

              <div class="pause-job-reasons">
                <button
                  v-for="reason in pauseJobReasons"
                  :key="reason.id"
                  class="pause-job-reason"
                  :class="{ 'is-selected': pauseJobForm.reason === reason.id }"
                  type="button"
                  @click="pauseJobForm.reason = reason.id"
                >
                  <span class="pause-job-reason__icon">
                    <AppIcon :name="reason.icon" :size="18" />
                  </span>
                  <span>{{ reason.label }}</span>
                </button>
              </div>
            </section>

            <section class="pause-job-section pause-job-section--resume">
              <label class="pause-job-checkbox">
                <input v-model="pauseJobForm.autoResume" type="checkbox" />
                <span>Automatically resume later</span>
              </label>

              <p>The job will resume and accept applications automatically.</p>

              <label class="pause-job-date">
                <span>Resume Date</span>
                <div class="pause-job-date__field" :class="{ 'is-disabled': !pauseJobForm.autoResume }">
                  <span class="pause-job-date__icon">
                    <AppIcon name="calendar" :size="16" />
                  </span>
                  <input
                    v-model="pauseJobForm.resumeDate"
                    type="text"
                    placeholder="Select date"
                    :disabled="!pauseJobForm.autoResume"
                  />
                  <AppIcon name="chevronDown" :size="16" />
                </div>
              </label>
            </section>

            <section class="pause-job-note">
              <div class="pause-job-note__head">
                <AppIcon name="info" :size="18" />
                <strong>After pausing:</strong>
              </div>

              <ul>
                <li><AppIcon name="check" :size="14" /> <span>Job will be hidden from candidates</span></li>
                <li><AppIcon name="check" :size="14" /> <span>New applications will be blocked</span></li>
                <li><AppIcon name="check" :size="14" /> <span>Existing candidates and hiring activities remain active</span></li>
              </ul>
            </section>
          </div>

          <div class="pause-job-modal__footer">
            <button class="pause-job-modal__secondary" type="button" @click="closePauseJobModal">Cancel</button>
            <button class="pause-job-modal__primary" type="button" @click="submitPauseJob">
              <AppIcon name="pause" :size="15" />
              Pause Job
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="pauseJobSuccessModalOpen" class="pause-success-layer" @click="closePauseJobSuccessModal">
        <div v-if="pauseJobSuccessData" class="pause-success-modal" @click.stop>
          <button class="pause-success-modal__close" type="button" @click="closePauseJobSuccessModal">
            <AppIcon name="close" :size="18" />
          </button>

          <div class="pause-success-modal__hero">
            <span class="pause-success-modal__dot is-left"></span>
            <span class="pause-success-modal__dot is-left-alt"></span>
            <span class="pause-success-modal__dot is-right"></span>
            <span class="pause-success-modal__dot is-right-alt"></span>

            <div class="pause-success-modal__icon">
              <AppIcon name="pause" :size="34" />
            </div>

            <h2>Job Paused Successfully!</h2>
            <p>New applications are temporarily disabled. You can resume the job anytime.</p>
          </div>

          <section class="pause-success-job">
            <div class="pause-success-job__head">
              <span class="pause-success-job__icon">
                <AppIcon name="briefcase" :size="18" />
              </span>

              <div class="pause-success-job__copy">
                <strong>{{ pauseJobSuccessData.job.title }}</strong>
                <small>
                  <span>{{ pauseJobSuccessData.job.department }}</span>
                  <span>{{ pauseJobSuccessData.job.location }}</span>
                  <span>{{ getJobEmploymentType(pauseJobSuccessData.job) }}</span>
                </small>
              </div>

              <label class="pause-success-job__status">PAUSED</label>
            </div>
          </section>

          <section class="pause-success-summary">
            <div class="pause-success-summary__cell">
              <span class="pause-success-summary__icon is-pink">
                <AppIcon name="calendar" :size="16" />
              </span>
              <div>
                <strong>Paused On</strong>
                <p>{{ pauseJobSuccessData.pausedOn }}</p>
              </div>
            </div>

            <div class="pause-success-summary__cell">
              <span class="pause-success-summary__icon is-blue">
                <AppIcon name="document" :size="16" />
              </span>
              <div>
                <strong>Reason</strong>
                <p>{{ pauseJobSuccessData.reason }}</p>
              </div>
            </div>

            <div class="pause-success-summary__cell pause-success-summary__cell--resume">
              <span class="pause-success-summary__icon is-green">
                <AppIcon name="calendar" :size="16" />
              </span>
              <div>
                <strong>Automatically Resume On</strong>
                <p>{{ pauseJobSuccessData.autoResumeDate }}</p>
                <small>{{ pauseJobSuccessData.resumeMeta }}</small>
              </div>
            </div>
          </section>

          <section class="pause-success-note">
            <div class="pause-success-note__head">
              <AppIcon name="info" :size="18" />
              <strong>What happens while the job is paused?</strong>
            </div>

            <ul>
              <li><AppIcon name="check" :size="14" /> <span>New applications will be blocked.</span></li>
              <li><AppIcon name="check" :size="14" /> <span>Existing applicants remain active in the pipeline.</span></li>
              <li><AppIcon name="check" :size="14" /> <span>Interviews, evaluations, and notes remain accessible.</span></li>
            </ul>
          </section>

          <div class="pause-success-actions">
            <button class="pause-success-actions__secondary" type="button" @click="viewPausedJob">
              <AppIcon name="eye" :size="16" />
              View Job
            </button>

            <button class="pause-success-actions__secondary" type="button" @click="resumePausedJobNow">
              <AppIcon name="play" :size="16" />
              Resume Now
            </button>

            <button class="pause-success-actions__primary" type="button" @click="closePauseJobSuccessModal">
              Done
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="closeJobModalOpen" class="close-job-layer" @click="closeCloseJobModal">
        <div v-if="closeJobTarget" class="close-job-modal" @click.stop>
          <div class="close-job-modal__head">
            <div class="close-job-modal__title-wrap">
              <div class="close-job-modal__title-icon">
                <AppIcon name="lock" :size="18" />
              </div>
              <div>
                <h2>Close Job</h2>
                <p>Close this job and stop accepting new applications.</p>
              </div>
            </div>

            <button class="close-job-modal__close" type="button" @click="closeCloseJobModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="close-job-modal__body">
            <section class="close-job-source">
              <div class="close-job-source__icon">
                <AppIcon name="briefcase" :size="18" />
              </div>

              <div class="close-job-source__copy">
                <strong>{{ closeJobTarget.title }}</strong>
                <small>
                  <span>{{ closeJobTarget.location }}</span>
                  <span>{{ getJobEmploymentType(closeJobTarget) }}</span>
                  <span>{{ closeJobTarget.location === 'Remote' ? 'Hybrid' : closeJobTarget.location }}</span>
                  <span>ID: {{ String(closeJobTarget.id).toUpperCase() }}</span>
                </small>
              </div>
            </section>

            <button
              class="close-job-info"
              :class="{ 'is-open': closeJobInfoOpen }"
              type="button"
              @click="closeJobInfoOpen = !closeJobInfoOpen"
            >
              <span class="close-job-info__copy">
                <span class="close-job-info__icon">
                  <AppIcon name="clock" :size="16" />
                </span>
                <strong>What happens when you close this job?</strong>
              </span>
              <AppIcon :name="closeJobInfoOpen ? 'chevronUp' : 'chevronDown'" :size="16" />
            </button>

            <section v-if="closeJobInfoOpen" class="close-job-info-panel">
              <ul class="close-job-info-panel__menu">
                <li>
                  <span class="close-job-info-panel__icon">
                    <AppIcon name="close" :size="14" />
                  </span>
                  <span>The job posting will be closed and removed from all job boards</span>
                </li>
                <li>
                  <span class="close-job-info-panel__icon">
                    <AppIcon name="userPlus" :size="14" />
                  </span>
                  <span>No new applications will be accepted</span>
                </li>
                <li>
                  <span class="close-job-info-panel__icon">
                    <AppIcon name="users" :size="14" />
                  </span>
                  <span>All candidates will remain in the system</span>
                </li>
                <li>
                  <span class="close-job-info-panel__icon">
                    <AppIcon name="refresh" :size="14" />
                  </span>
                  <span>You can reopen the job anytime</span>
                </li>
              </ul>
            </section>

            <section class="close-job-section">
              <h3>Choose what to do with current candidates <span>(optional)</span></h3>

              <div class="close-job-options">
                <button
                  class="close-job-option"
                  :class="{ 'is-selected': closeJobForm.candidateAction === 'keep' }"
                  type="button"
                  @click="closeJobForm.candidateAction = 'keep'"
                >
                  <div class="close-job-option__copy">
                    <strong>Keep candidates in current stages</strong>
                    <p>Candidates will remain in their current pipeline stages.</p>
                  </div>
                  <span class="close-job-option__radio"></span>
                </button>

                <button
                  class="close-job-option"
                  :class="{ 'is-selected': closeJobForm.candidateAction === 'move' }"
                  type="button"
                  @click="closeJobForm.candidateAction = 'move'"
                >
                  <div class="close-job-option__copy">
                    <strong>Move candidates to Closed stage</strong>
                    <p>All candidates will be moved to the Closed stage.</p>
                  </div>
                  <span class="close-job-option__radio"></span>
                </button>
              </div>
            </section>

            <label class="close-job-field">
              <span>Closing reason <em>(optional)</em></span>
              <textarea
                v-model="closeJobForm.closingReason"
                maxlength="500"
                placeholder="Explain why this job is being closed..."
              ></textarea>
              <small>{{ closeJobForm.closingReason.length }} / 500</small>
            </label>

            <label class="close-job-field">
              <span>Internal note <em>(optional)</em></span>
              <textarea
                v-model="closeJobForm.internalNote"
                maxlength="500"
                placeholder="Add an internal note for your team..."
              ></textarea>
              <small>{{ closeJobForm.internalNote.length }} / 500</small>
            </label>
          </div>

          <div class="close-job-modal__footer">
            <button class="close-job-modal__secondary" type="button" @click="closeCloseJobModal">Cancel</button>
            <button class="close-job-modal__primary" type="button" @click="submitCloseJob">
              <AppIcon name="lock" :size="15" />
              Close Job
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="archiveJobModalOpen" class="archive-job-layer" @click="closeArchiveJobModal">
        <div v-if="archiveJobTarget" class="archive-job-modal" @click.stop>
          <div class="archive-job-modal__head">
            <div class="archive-job-modal__title-wrap">
              <div class="archive-job-modal__title-icon">
                <AppIcon name="archive" :size="18" />
              </div>
              <div>
                <h2>Archive Job</h2>
                <p>Move this job to the archive?</p>
              </div>
            </div>

            <button class="archive-job-modal__close" type="button" @click="closeArchiveJobModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="archive-job-modal__body">
            <section class="archive-job-source">
              <div class="archive-job-source__icon">
                <AppIcon name="briefcase" :size="18" />
              </div>

              <div class="archive-job-source__copy">
                <strong>{{ archiveJobTarget.title }}</strong>
                <small>
                  <span>{{ archiveJobTarget.location }}</span>
                  <span>{{ getJobEmploymentType(archiveJobTarget) }}</span>
                  <span>{{ archiveJobTarget.location === 'Remote' ? 'Hybrid' : archiveJobTarget.location }}</span>
                </small>
                <label>ID: {{ String(archiveJobTarget.id).toUpperCase() }}</label>
              </div>
            </section>

            <button
              class="archive-job-banner"
              :class="{ 'is-open': archiveJobInfoOpen }"
              type="button"
              @click="archiveJobInfoOpen = !archiveJobInfoOpen"
            >
              <span class="archive-job-banner__icon">
                <AppIcon name="clock" :size="16" />
              </span>
              <span>Archived jobs are removed from active views but can be restored at any time.</span>
              <AppIcon :name="archiveJobInfoOpen ? 'chevronUp' : 'chevronDown'" :size="16" />
            </button>

            <section v-if="archiveJobInfoOpen" class="archive-job-info-panel">
              <ul>
                <li>
                  <span class="archive-job-info-panel__icon">
                    <AppIcon name="checkCircle" :size="14" />
                  </span>
                  <span>Removed from active job lists and dashboards</span>
                </li>
                <li>
                  <span class="archive-job-info-panel__icon">
                    <AppIcon name="checkCircle" :size="14" />
                  </span>
                  <span>Candidates and data remain safely stored</span>
                </li>
                <li>
                  <span class="archive-job-info-panel__icon">
                    <AppIcon name="checkCircle" :size="14" />
                  </span>
                  <span>Hiring history is preserved</span>
                </li>
                <li>
                  <span class="archive-job-info-panel__icon">
                    <AppIcon name="checkCircle" :size="14" />
                  </span>
                  <span>Reports and analytics remain available</span>
                </li>
                <li>
                  <span class="archive-job-info-panel__icon">
                    <AppIcon name="checkCircle" :size="14" />
                  </span>
                  <span>You can restore this job anytime</span>
                </li>
              </ul>
            </section>

            <section class="archive-job-section">
              <div class="archive-job-section__head">
                <h3>Summary</h3>
              </div>

              <div class="archive-job-summary">
                <article class="archive-job-summary__item">
                  <AppIcon name="users" :size="18" />
                  <strong>{{ archiveJobTarget.applicants }}</strong>
                  <span>APPLICATIONS</span>
                </article>
                <article class="archive-job-summary__item">
                  <AppIcon name="calendar" :size="18" />
                  <strong>{{ archiveJobTarget.pipeline.find((stage) => stage.label === 'Interview')?.value ?? 0 }}</strong>
                  <span>INTERVIEWS</span>
                </article>
                <article class="archive-job-summary__item">
                  <AppIcon name="lock" :size="18" />
                  <strong>{{ archiveJobTarget.pipeline.find((stage) => stage.label === 'Offer')?.value ?? 0 }}</strong>
                  <span>OFFERS</span>
                </article>
                <article class="archive-job-summary__item">
                  <AppIcon name="checkCircle" :size="18" />
                  <strong>{{ archiveJobTarget.pipeline.find((stage) => stage.label === 'Hired')?.value ?? 0 }}</strong>
                  <span>HIRED</span>
                </article>
              </div>
            </section>

            <label class="archive-job-field">
              <span>Archive note <em>(optional)</em></span>
              <textarea
                v-model="archiveJobForm.note"
                maxlength="500"
                placeholder="Add a note about why this job is being archived..."
              ></textarea>
              <small>{{ archiveJobForm.note.length }} / 500</small>
            </label>
          </div>

          <div class="archive-job-modal__footer">
            <button class="archive-job-modal__secondary" type="button" @click="closeArchiveJobModal">Cancel</button>
            <button class="archive-job-modal__primary" type="button" @click="submitArchiveJob">
              <AppIcon name="archive" :size="15" />
              Archive Job
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="copilotJobModalOpen" class="copilot-job-layer" @click="closeCopilotJobModal">
        <div
          v-if="copilotJobTarget"
          class="copilot-job-modal"
          :class="{
            'copilot-job-modal--summary': copilotJobMode === 'summary',
            'copilot-job-modal--thread': copilotJobMode === 'thread',
          }"
          @click.stop
        >
          <div class="copilot-job-modal__head">
            <div class="copilot-job-modal__title-wrap">
              <div class="copilot-job-modal__title-icon">
                <AppIcon name="sparkles" :size="18" />
              </div>
              <div>
                <h2>Copilot Nitro</h2>
                <p>Ask about this job</p>
              </div>
            </div>

            <div class="copilot-job-modal__head-actions">
              <button
                v-if="copilotJobMode === 'thread'"
                class="copilot-job-modal__more"
                type="button"
                aria-label="More options"
              >
                <AppIcon name="more" :size="18" />
              </button>

              <button class="copilot-job-modal__close" type="button" @click="closeCopilotJobModal">
                <AppIcon name="close" :size="18" />
              </button>
            </div>
          </div>

          <div :key="copilotJobMode" ref="copilotJobBodyRef" class="copilot-job-modal__body">
            <section class="copilot-job-card">
              <div class="copilot-job-card__icon">
                <AppIcon name="briefcase" :size="18" />
              </div>

              <div class="copilot-job-card__copy">
                <strong>{{ copilotJobTarget.title }}</strong>
                <small>
                  <span>{{ copilotJobTarget.location }}</span>
                  <span>{{ getJobEmploymentType(copilotJobTarget) }}</span>
                  <span>{{ copilotJobTarget.location === 'Remote' ? 'Remote' : 'Hybrid' }}</span>
                </small>
              </div>

              <button
                v-if="copilotJobMode === 'thread'"
                class="copilot-job-card__action"
                type="button"
                @click="openJob(copilotJobTarget)"
              >
                View job
                <AppIcon name="external-link" :size="14" />
              </button>
            </section>

            <template v-if="copilotJobMode === 'default'">
              <section class="copilot-job-section">
                <h3>What would you like to know?</h3>

                <div class="copilot-job-input">
                  <input
                    v-model="copilotJobQuestion"
                    type="text"
                    placeholder="Ask anything about this job..."
                  >
                  <button type="button" @click="submitCopilotJobQuestion">
                    <AppIcon name="share" :size="16" />
                  </button>
                </div>
              </section>

              <section class="copilot-job-section">
                <h3>Suggested questions</h3>

                <div class="copilot-job-suggestions">
                  <button
                    v-for="item in copilotJobSuggestions"
                    :key="item.id"
                    class="copilot-job-suggestion"
                    type="button"
                    @click="setCopilotJobQuestion(item.label, item.id)"
                  >
                    <AppIcon :name="item.icon" :size="15" />
                    <span>{{ item.label }}</span>
                  </button>
                </div>
              </section>

              <section class="copilot-job-section">
                <h3>Example answer</h3>

                <div class="copilot-job-answer">
                  <span class="copilot-job-answer__icon">
                    <AppIcon name="sparkles" :size="14" />
                  </span>
                  <p>This role is focused on designing user flows, improving product usability, and collaborating with product and engineering teams to deliver great user experiences.</p>
                </div>
              </section>
            </template>

            <template v-else-if="copilotJobMode === 'thread'">
              <section class="copilot-job-section">
                <h3>What would you like to know?</h3>

                <div class="copilot-job-input">
                  <input
                    v-model="copilotJobQuestion"
                    type="text"
                    placeholder="Ask a new question about this job..."
                  >
                  <button type="button" @click="submitCopilotJobQuestion">
                    <AppIcon name="share" :size="16" />
                  </button>
                </div>
              </section>

              <section class="copilot-job-thread-banner">
                <div class="copilot-job-thread-banner__copy">
                  <span class="copilot-job-thread-banner__icon">
                    <AppIcon name="sparkles" :size="14" />
                  </span>
                  <div>
                    <strong>Start a new question to get fresh insights about this role.</strong>
                    <p>Your previous conversation is saved and can be viewed anytime.</p>
                  </div>
                </div>

                <button class="copilot-job-thread-banner__button" type="button" @click="viewCopilotPreviousThread">
                  View previous thread
                  <AppIcon name="chevronRight" :size="14" />
                </button>
              </section>

              <section class="copilot-job-section">
                <h3>Suggested questions</h3>

                <div class="copilot-job-suggestions copilot-job-suggestions--thread">
                  <button
                    v-for="item in copilotJobThreadSuggestions"
                    :key="item.id"
                    class="copilot-job-suggestion"
                    type="button"
                    @click="setCopilotJobQuestion(item.label, item.id)"
                  >
                    <AppIcon :name="item.icon" :size="15" />
                    <span>{{ item.label }}</span>
                  </button>
                </div>
              </section>

            </template>

            <template v-else>
              <section class="copilot-job-section">
                <h3>What would you like to know?</h3>
                <div class="copilot-job-input">
                  <input
                    v-model="copilotJobQuestion"
                    type="text"
                    placeholder="Ask anything about this job..."
                  >
                  <button type="button" @click="submitCopilotJobQuestion">
                    <AppIcon name="share" :size="16" />
                  </button>
                </div>
              </section>

              <section class="copilot-job-section">
                <h3>Suggested questions</h3>

                <div class="copilot-job-suggestions">
                  <button
                    v-for="item in copilotJobSuggestions"
                    :key="item.id"
                    class="copilot-job-suggestion"
                    :class="{ 'is-selected': item.label === copilotJobAsked }"
                    type="button"
                    @click="setCopilotJobQuestion(item.label, item.id)"
                  >
                    <AppIcon :name="item.icon" :size="15" />
                    <span>{{ item.label }}</span>
                  </button>
                </div>
              </section>

              <section class="copilot-job-section">
                <h3>You asked</h3>

                <div class="copilot-job-asked">
                  <span class="copilot-job-asked__icon">
                    <AppIcon name="sparkles" :size="14" />
                  </span>
                  <strong>{{ copilotJobAsked }}</strong>
                  <small>Just now</small>
                </div>
              </section>

              <section class="copilot-job-section">
                <h3>Copilot answer</h3>

                <div class="copilot-job-summary">
                  <div class="copilot-job-summary__columns">
                    <article class="copilot-job-summary__column">
                      <div class="copilot-job-summary__head">
                        <span class="copilot-job-summary__head-icon">
                          <AppIcon name="sparkles" :size="14" />
                        </span>
                        <strong>Job summary</strong>
                      </div>
                      <p>This role is focused on designing user experiences that are intuitive, accessible and impactful. You'll collaborate closely with product, engineering and stakeholders to deliver high-quality digital solutions.</p>
                    </article>

                    <article class="copilot-job-summary__column">
                      <div class="copilot-job-summary__head">
                        <strong>Key responsibilities</strong>
                      </div>
                      <ul>
                        <li>Design end-to-end user flows</li>
                        <li>Create wireframes and prototypes</li>
                        <li>Conduct user research and testing</li>
                        <li>Collaborate with cross-functional teams</li>
                        <li>Contribute to design systems</li>
                      </ul>
                    </article>

                    <article class="copilot-job-summary__column">
                      <div class="copilot-job-summary__head">
                        <strong>Required skills</strong>
                      </div>
                      <ul>
                        <li>5+ years of UX/UI design experience</li>
                        <li>Advanced Figma skills</li>
                        <li>Strong user research skills</li>
                        <li>Experience with design systems</li>
                        <li>Excellent communication skills</li>
                      </ul>
                    </article>
                  </div>

                  <div class="copilot-job-summary__metrics">
                    <div class="copilot-job-summary__metric">
                      <AppIcon name="chart-bars" :size="16" />
                      <div>
                        <label>EXPERIENCE LEVEL</label>
                        <strong>Senior (5+ years)</strong>
                      </div>
                    </div>
                    <div class="copilot-job-summary__metric">
                      <AppIcon name="briefcase" :size="16" />
                      <div>
                        <label>EMPLOYMENT TYPE</label>
                        <strong>Full-time</strong>
                      </div>
                    </div>
                    <div class="copilot-job-summary__metric">
                      <AppIcon name="lock" :size="16" />
                      <div>
                        <label>WORK MODEL</label>
                        <strong>{{ copilotJobTarget.location === 'Remote' ? 'Remote' : 'Hybrid' }}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="copilot-job-summary__note">
                    <AppIcon name="sparkles" :size="14" />
                    <span>AI-generated summary. Please review the full job description for complete details.</span>
                  </div>
                </div>
              </section>
            </template>
          </div>

          <div
            class="copilot-job-modal__footer"
            :class="{
              'is-summary': copilotJobMode === 'summary',
              'is-thread': copilotJobMode === 'thread',
            }"
          >
            <template v-if="copilotJobMode === 'default'">
              <button class="copilot-job-modal__primary" type="button" @click="submitCopilotJobQuestion">
                <AppIcon name="sparkles" :size="16" />
                Ask
              </button>
              <small>COPILOT NITRO CAN MAKE MISTAKES. CHECK IMPORTANT INFO.</small>
            </template>

            <template v-else-if="copilotJobMode === 'summary'">
              <div class="copilot-job-modal__summary-actions">
                <button class="copilot-job-modal__secondary" type="button" @click="openCopilotThreadMode">
                  <AppIcon name="refresh" :size="16" />
                  New question
                </button>
                <button class="copilot-job-modal__secondary" type="button" @click="copyCopilotAnswer">
                  <AppIcon name="copy" :size="16" />
                  Copy
                </button>
                <button class="copilot-job-modal__primary" type="button" @click="openCopilotThreadMode">
                  <AppIcon name="share" :size="16" />
                  Ask follow-up
                </button>
              </div>
            </template>

            <template v-else>
              <div class="copilot-job-modal__thread-layout">
                <section class="copilot-job-history">
                  <div class="copilot-job-history__head">
                    <div class="copilot-job-history__title">
                      <strong>Previous conversation</strong>
                      <AppIcon name="chevronUp" :size="14" />
                    </div>
                    <div>
                      <span>2 questions</span>
                      <span>10:35 AM</span>
                    </div>
                  </div>

                  <div class="copilot-job-history__list">
                    <div v-for="question in copilotJobPreviousQuestions" :key="question" class="copilot-job-history__item">
                      <AppIcon name="checkCircle" :size="16" />
                      <span>{{ question }}</span>
                    </div>
                  </div>

                  <div class="copilot-job-history__footer">
                    <button class="copilot-job-history__action" type="button" @click="viewCopilotPreviousThread">
                      View full conversation
                      <AppIcon name="external-link" :size="14" />
                    </button>
                  </div>
                </section>

                <div class="copilot-job-modal__thread-actions">
                  <button class="copilot-job-modal__secondary copilot-job-modal__thread-button" type="button" @click="openCopilotThreadMode">
                    <AppIcon name="plus" :size="16" />
                    New question
                  </button>

                  <div class="copilot-job-modal__footer-actions">
                    <button class="copilot-job-modal__secondary copilot-job-modal__thread-button" type="button" @click="copyCopilotChat">
                      <AppIcon name="copy" :size="16" />
                      Copy chat
                    </button>
                    <button class="copilot-job-modal__secondary copilot-job-modal__secondary--accent copilot-job-modal__thread-button" type="button" @click="closeCopilotJobModal">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="reviewFeedbackModalOpen" class="review-modal-layer" @click="closeReviewFeedbackModal">
        <div class="review-modal" @click.stop>
          <div class="review-modal__head">
            <div class="review-modal__title-wrap">
              <div class="review-modal__title-icon">
                <AppIcon name="share" :size="17" />
              </div>
              <div>
                <h2>Review feedback</h2>
                <p>5 candidates are waiting for feedback</p>
              </div>
            </div>

            <button class="review-modal__close" type="button" @click="closeReviewFeedbackModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <section class="review-summary">
            <article v-for="item in reviewFeedbackSummary" :key="item.label" class="review-summary__card">
              <div class="review-summary__icon" :class="`tone-${item.tone}`">
                <AppIcon :name="item.icon" :size="16" />
              </div>
              <div class="review-summary__copy">
                <strong>{{ item.value }}</strong>
                <span>{{ item.label }}</span>
              </div>
            </article>
          </section>

          <section class="review-list">
            <article v-for="candidate in reviewFeedbackCandidates" :key="candidate.name" class="review-row">
              <div class="review-row__candidate">
                <div class="review-row__avatar" :class="`tone-${candidate.departmentTone}`">
                  {{ candidate.initials }}
                </div>
                <div class="review-row__copy">
                  <strong>{{ candidate.name }}</strong>
                  <span>{{ candidate.role }}</span>
                  <small :class="`is-${candidate.departmentTone}`">
                    <AppIcon name="briefcase" :size="11" />
                    {{ candidate.department.toUpperCase() }}
                  </small>
                </div>
              </div>

              <div class="review-row__missing">
                <span>Missing feedback from</span>
                <strong>{{ candidate.missingFrom }}</strong>
                <small>{{ candidate.missingRole }}</small>
              </div>

              <div class="review-row__actions">
                <span class="review-row__badge" :class="`review-row__badge--${candidate.overdueTone}`">{{ candidate.overdue }}</span>
                <button class="review-row__button" type="button" @click="openSendReminderModal">
                  <AppIcon name="share" :size="12" />
                  Send reminder
                </button>
              </div>
            </article>
          </section>

          <div class="review-modal__footer">
            <button class="review-modal__ghost" type="button">
              <AppIcon name="document" :size="14" />
              Export list
            </button>

            <div class="review-modal__footer-actions">
              <button class="review-modal__ghost review-modal__ghost--accent" type="button" @click="openSendReminderModal">
                <AppIcon name="share" :size="14" />
                Send reminders (3)
              </button>

              <button class="review-modal__primary" type="button" @click="openCompleteFeedbackModal">
                <AppIcon name="edit" :size="14" />
                Complete my feedback (2)
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="completeFeedbackModalOpen" class="complete-feedback-layer" @click="closeCompleteFeedbackModal">
        <div class="complete-feedback-modal" @click.stop>
          <div class="complete-feedback-modal__head">
            <div class="complete-feedback-modal__title-wrap">
              <div class="complete-feedback-modal__title-icon">
                <AppIcon name="mail" :size="18" />
              </div>
              <div>
                <h2>Complete Feedback</h2>
                <p>{{ completeFeedbackCandidate.name }} <span>&bull;</span> {{ completeFeedbackCandidate.role }}</p>
              </div>
            </div>

            <button class="complete-feedback-modal__close" type="button" @click="closeCompleteFeedbackModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="complete-feedback-modal__meta">
            <span class="complete-feedback-modal__pill is-pink">{{ completeFeedbackCandidate.round }}</span>
            <span class="complete-feedback-modal__chip"><AppIcon name="clock" :size="13" /> {{ completeFeedbackCandidate.duration }}</span>
            <span class="complete-feedback-modal__chip"><AppIcon name="calendar" :size="13" /> {{ completeFeedbackCandidate.completedAt }}</span>
          </div>

          <section class="complete-feedback-section">
            <h3>Overall Recommendation</h3>
            <div class="complete-feedback-options">
              <button
                v-for="option in completeFeedbackOptions"
                :key="option.value"
                class="complete-feedback-option"
                :class="{ 'is-active': completeFeedbackRecommendation === option.value }"
                type="button"
                @click="completeFeedbackRecommendation = option.value"
              >
                <AppIcon :name="option.icon" :size="30" />
                <strong>{{ option.label }}</strong>
                <i />
              </button>
            </div>
          </section>

          <section class="complete-feedback-section">
            <h3>Quick Evaluation</h3>
            <div class="complete-feedback-ratings">
              <article v-for="item in completeFeedbackRows" :key="item.key" class="complete-feedback-rating-row">
                <div>
                  <strong>{{ item.label }}</strong>
                  <AppIcon name="info" :size="12" />
                </div>
                <div class="complete-feedback-stars">
                  <button
                    v-for="star in 5"
                    :key="star"
                    class="complete-feedback-star"
                    :class="{ 'is-active': star <= item.value }"
                    type="button"
                    @click="setCompleteFeedbackRating(item.key, star)"
                  >★</button>
                </div>
              </article>
            </div>
          </section>

          <section class="complete-feedback-section">
            <h3>Feedback Notes</h3>
            <div class="complete-feedback-notes">
              <textarea v-model="completeFeedbackNotes" maxlength="1000" placeholder="What stood out during the interview?" />
              <small>{{ completeFeedbackNotes.length }}/1000</small>
            </div>
          </section>

          <div class="complete-feedback-modal__footer">
            <button class="complete-feedback-modal__secondary" type="button">
              <AppIcon name="document" :size="14" />
              Save Draft
            </button>
            <div class="complete-feedback-modal__footer-actions">
              <button class="complete-feedback-modal__secondary" type="button" @click="closeCompleteFeedbackModal">Cancel</button>
              <button class="complete-feedback-modal__primary" type="button" @click="submitCompleteFeedback">Submit &amp; Move Forward</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="feedbackSuccessModalOpen" class="feedback-success-layer" @click="closeFeedbackSuccessModal">
        <div class="feedback-success-modal" @click.stop>
          <div class="feedback-success-modal__icon">
            <div class="feedback-success-modal__icon-core">
              <AppIcon name="checkCircle" :size="26" />
            </div>
          </div>

          <h2>Feedback Submitted Successfully</h2>
          <p>Sarah Johnson has been moved to the next stage of the pipeline for the Frontend Developer role.</p>

          <div class="feedback-success-modal__actions">
            <button class="feedback-success-modal__primary" type="button" @click="closeFeedbackSuccessModal">Return to Dashboard</button>
            <button class="feedback-success-modal__secondary" type="button" @click="closeFeedbackSuccessModal">View Candidate Profile</button>
          </div>

          <small>
            <AppIcon name="info" :size="13" />
            A notification email has been sent to the hiring team.
          </small>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="filterModalOpen" class="filter-modal-layer" @click="closeFilterModal">
        <div class="filter-modal" @click.stop>
          <div class="filter-modal__head">
            <div class="filter-modal__title-wrap">
              <div class="filter-modal__title-icon">
                <AppIcon name="filter" :size="18" />
              </div>
              <div>
                <h2>Filters</h2>
                <p>Find the jobs you need</p>
              </div>
            </div>

            <button class="filter-modal__close" type="button" @click="closeFilterModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="filter-modal__body">
            <section class="filter-block">
              <h3>Quick Filters</h3>
              <div class="filter-quick-row">
                <button
                  v-for="item in quickFilterOptions"
                  :key="item.label"
                  class="filter-quick-chip"
                  type="button"
                >
                  <AppIcon :name="item.icon" :size="14" :class="`tone-${item.tone}`" />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </section>

            <section class="filter-block">
              <div class="filter-block__head">
                <h3>Basic Filters</h3>
                <button class="filter-collapse" type="button" @click="basicFiltersOpen = !basicFiltersOpen">
                  <AppIcon :name="basicFiltersOpen ? 'chevronUp' : 'chevronDown'" :size="16" />
                </button>
              </div>

              <div v-if="basicFiltersOpen" class="filter-grid">
                <div class="filter-field">
                  <label><AppIcon name="briefcase" :size="13" /> Status</label>
                  <AppSelect v-model="filterForm.status" :options="filterSelectOptions.status" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="heart" :size="13" /> Hiring Health</label>
                  <AppSelect v-model="filterForm.hiringHealth" :options="filterSelectOptions.hiringHealth" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="git-branch" :size="13" /> Pipeline Stage</label>
                  <AppSelect v-model="filterForm.pipelineStage" :options="filterSelectOptions.pipelineStage" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="bell" :size="13" /> Attention</label>
                  <AppSelect v-model="filterForm.attention" :options="filterSelectOptions.attention" />
                </div>
              </div>
            </section>

            <section class="filter-block">
              <div class="filter-block__head">
                <h3>Advanced Filters</h3>
                <button class="filter-collapse" type="button" @click="advancedFiltersOpen = !advancedFiltersOpen">
                  <AppIcon :name="advancedFiltersOpen ? 'chevronUp' : 'chevronDown'" :size="16" />
                </button>
              </div>

              <div v-if="advancedFiltersOpen" class="filter-grid">
                <div class="filter-field">
                  <label><AppIcon name="building" :size="13" /> Department</label>
                  <AppSelect v-model="filterForm.department" :options="filterSelectOptions.department" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="user" :size="13" /> Hiring Manager</label>
                  <AppSelect v-model="filterForm.hiringManager" :options="filterSelectOptions.hiringManager" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="users" :size="13" /> Recruiter</label>
                  <AppSelect v-model="filterForm.recruiter" :options="filterSelectOptions.recruiter" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="briefcase" :size="13" /> Job Type</label>
                  <AppSelect v-model="filterForm.jobType" :options="filterSelectOptions.jobType" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="calendar" :size="13" /> Days Open</label>
                  <AppSelect v-model="filterForm.daysOpen" :options="filterSelectOptions.daysOpen" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="chart-bars" :size="13" /> Expected Hire</label>
                  <AppSelect v-model="filterForm.expectedHire" :options="filterSelectOptions.expectedHire" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="mapPin" :size="13" /> Location</label>
                  <AppSelect v-model="filterForm.location" :options="filterSelectOptions.location" />
                </div>
                <div class="filter-field">
                  <label><AppIcon name="home" :size="13" /> Work Location</label>
                  <AppSelect v-model="filterForm.workLocation" :options="filterSelectOptions.workLocation" />
                </div>
              </div>

              <button class="filter-add" type="button" @click="restoreDefaultFilters">
                <AppIcon name="plus" :size="14" />
                Add Filter
              </button>
            </section>

            <section class="filter-block">
              <div class="filter-block__head">
                <h3>Active Filters ({{ activeFilterChips.length }})</h3>
                <button class="filter-clear" type="button" @click="resetFilters">Clear all</button>
              </div>

              <div class="filter-active-row">
                <button
                  v-for="chip in activeFilterChips"
                  :key="chip.key"
                  class="filter-active-chip"
                  type="button"
                  @click="removeFilterChip(chip.key)"
                >
                  <span>{{ chip.label }}</span>
                  <AppIcon name="close" :size="12" />
                </button>
              </div>
            </section>
          </div>

          <div class="filter-modal__footer">
            <button class="filter-footer-button" type="button" @click="resetFilters">Reset</button>
            <div class="filter-modal__footer-actions">
              <button class="filter-footer-button" type="button" @click="closeFilterModal">Cancel</button>
              <button class="filter-footer-button filter-footer-button--primary" type="button" @click="applyFilters">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="reviewCandidatesModalOpen && reviewCandidatesTarget && reviewCandidatesActiveCandidate"
        class="review-candidates-layer"
        @click="closeReviewCandidatesStandaloneModal"
      >
        <div class="review-candidates-modal" @click.stop>
          <header class="review-candidates-modal__head">
            <div class="review-candidates-modal__title-wrap">
              <div class="review-candidates-modal__title-icon">
                <AppIcon name="users" :size="18" />
              </div>
              <div>
                <h2>Review Candidates</h2>
                <p>Review and take action on candidates who need your attention.</p>
              </div>
            </div>

            <button class="review-candidates-modal__close" type="button" @click="closeReviewCandidatesStandaloneModal">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <section class="review-candidates-modal__summary">
            <article class="review-candidates-stat">
              <span class="review-candidates-stat__icon tone-green"><AppIcon name="briefcase" :size="17" /></span>
              <div>
                <small>Job</small>
                <strong>{{ reviewCandidatesTarget.roleTitle }}</strong>
              </div>
            </article>

            <article class="review-candidates-stat">
              <span class="review-candidates-stat__icon tone-blue"><AppIcon name="user" :size="17" /></span>
              <div>
                <small>New candidates</small>
                <strong>{{ reviewCandidatesTarget.newCandidates }}</strong>
              </div>
            </article>

            <article class="review-candidates-stat">
              <span class="review-candidates-stat__icon tone-violet"><AppIcon name="users" :size="17" /></span>
              <div>
                <small>Total candidates</small>
                <strong>{{ reviewCandidatesTarget.totalCandidates }}</strong>
              </div>
            </article>

            <article class="review-candidates-stat">
              <span class="review-candidates-stat__icon tone-pink"><AppIcon name="star" :size="17" /></span>
              <div>
                <small>Recommended</small>
                <strong>{{ reviewCandidatesTarget.recommended }}</strong>
              </div>
            </article>

            <article class="review-candidates-stat review-candidates-stat--insight">
              <span class="review-candidates-stat__icon tone-indigo"><AppIcon name="heart" :size="16" /></span>
              <div>
                <small>AI insight</small>
                <p>{{ reviewCandidatesTarget.aiInsight }}</p>
              </div>
            </article>
          </section>

          <div class="review-candidates-modal__content">
            <div class="review-candidates-layout">
              <section class="review-candidates-main">
                <div class="review-candidates-toolbar">
                  <label class="review-candidates-search">
                    <AppIcon name="search" :size="18" />
                    <input v-model="reviewCandidatesSearch" type="text" placeholder="Search candidates..." />
                  </label>

                  <div class="review-candidates-toolbar__bottom">
                    <div class="review-candidates-toolbar__filters">
                      <button type="button">Stage: Applied</button>
                      <button type="button">Experience</button>
                      <button type="button">Location</button>
                      <button type="button">Source</button>
                      <button type="button">More filters</button>
                    </div>

                    <div class="review-candidates-toolbar__sort">
                      <span>Sort by</span>
                      <AppSelect v-model="reviewCandidatesSort" :options="['Newest', 'Highest match', 'Oldest']" />
                    </div>
                  </div>
                </div>

                <div class="review-candidates-table-card">
                  <div class="review-candidates-table-card__head">
                    <strong>{{ filteredReviewCandidates.length }} candidates</strong>
                    <span>{{ reviewCandidatesSelectedCount }} selected</span>
                  </div>

                  <div class="review-candidates-table">
                  <div class="review-candidates-table__head">
                      <span></span>
                      <span>Applicant</span>
                      <span>Experience</span>
                      <span>Location</span>
                      <span>Source</span>
                      <span>AI match</span>
                      <span>Applied</span>
                      <span>Actions</span>
                    </div>

                    <article
                      v-for="candidate in filteredReviewCandidates"
                      :key="candidate.id"
                      class="review-candidates-row"
                      :class="{ 'is-active': reviewCandidatesActiveId === candidate.id }"
                      @click="selectReviewCandidate(candidate.id)"
                    >
                      <label class="review-candidates-row__check" @click.stop>
                        <input
                          :checked="reviewCandidatesSelectedIds.includes(candidate.id)"
                          type="checkbox"
                          @change="toggleReviewCandidatesSelection(candidate.id)"
                        />
                        <span>
                          <AppIcon name="check" :size="12" />
                        </span>
                      </label>

                      <div class="review-candidates-row__candidate">
                        <div class="review-candidates-row__avatar" :class="`tone-${candidate.avatarTone}`">
                          {{ ownerInitials(candidate.name) }}
                        </div>
                        <div>
                          <strong>{{ candidate.name }}</strong>
                          <small>{{ candidate.role }}</small>
                          <em v-if="candidate.badge">{{ candidate.badge }}</em>
                        </div>
                      </div>

                      <span class="review-candidates-row__value">{{ candidate.experience }}</span>
                      <span class="review-candidates-row__value">{{ candidate.location }}</span>
                      <span class="review-candidates-row__value is-source">{{ candidate.source }}</span>
                      <span class="review-candidates-row__match">{{ candidate.aiMatch }}%</span>
                      <span class="review-candidates-row__value">{{ candidate.appliedLabel }}</span>
                      <button
                        class="review-candidates-row__more"
                        type="button"
                        @click.stop="toggleReviewCandidatesActionMenu(candidate, $event)"
                      >
                        <AppIcon name="more" :size="16" />
                      </button>
                    </article>
                  </div>
                </div>
              </section>

              <aside class="review-candidates-aside">
                <div class="review-candidates-aside__card">
                  <div class="review-candidates-side__profile">
                    <div class="review-candidates-side__avatar" :class="`tone-${reviewCandidatesActiveCandidate.avatarTone}`">
                      {{ ownerInitials(reviewCandidatesActiveCandidate.name) }}
                    </div>
                    <div>
                      <h3>{{ reviewCandidatesActiveCandidate.name }}</h3>
                      <p>{{ reviewCandidatesActiveCandidate.role }}</p>
                    </div>
                  </div>

                  <div class="review-candidates-side__score">
                    <div>
                      <span>AI Match Score</span>
                      <strong>{{ reviewCandidatesActiveCandidate.aiMatch }}%</strong>
                    </div>
                    <div class="review-candidates-side__bar">
                      <i :style="{ width: `${reviewCandidatesActiveCandidate.aiMatch}%` }"></i>
                    </div>
                  </div>

                  <div class="review-candidates-side__meta">
                    <span><AppIcon name="mapPin" :size="15" /> {{ reviewCandidatesActiveCandidate.locationNote }}</span>
                    <span><AppIcon name="briefcase" :size="15" /> {{ reviewCandidatesActiveCandidate.experienceNote }}</span>
                    <span><AppIcon name="clock" :size="15" /> Applied {{ reviewCandidatesActiveCandidate.appliedLabel }}</span>
                    <span><AppIcon name="link" :size="15" /> {{ reviewCandidatesActiveCandidate.source }}</span>
                  </div>

                  <div class="review-candidates-side__quick-actions">
                    <button
                      v-for="action in reviewCandidatesMenuActions"
                      :key="action.id"
                      type="button"
                      @click="handleReviewCandidatesMenuAction(action.id, reviewCandidatesActiveCandidate)"
                    >
                      {{ action.label }}
                    </button>
                  </div>

                  <div class="review-candidates-side__section">
                    <span>Highlights</span>
                    <ul>
                      <li v-for="highlight in reviewCandidatesActiveCandidate.highlights" :key="highlight">
                        <AppIcon name="check" :size="14" />
                        {{ highlight }}
                      </li>
                    </ul>
                  </div>

                  <div class="review-candidates-side__section">
                    <span>Resume</span>
                    <button class="review-candidates-side__resume" type="button">
                      <div>
                        <strong>{{ reviewCandidatesActiveCandidate.resumeName }}</strong>
                        <small>{{ reviewCandidatesActiveCandidate.resumeMeta }}</small>
                      </div>
                      <AppIcon name="document" :size="16" />
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <footer class="review-candidates-modal__footer">
            <div class="review-candidates-footer__selection">
              <strong>{{ reviewCandidatesSelectedCount }} selected</strong>
              <button type="button" @click="clearReviewCandidatesSelection">Clear selection</button>
            </div>

            <div class="review-candidates-footer__actions">
              <button class="review-candidates-footer__ghost" type="button" @click="openReviewCandidatesTalentPoolModal(reviewCandidatesActiveCandidate)">
                <AppIcon name="plus" :size="15" />
                Add to Talent Pool
              </button>
              <button class="review-candidates-footer__danger" type="button">Reject Selected</button>
              <button class="review-candidates-footer__primary" type="button">Move to Next Stage</button>
            </div>
          </footer>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="reviewCandidatesActionMenu"
        ref="reviewCandidatesActionMenuRef"
        class="review-candidates-action-menu"
        :style="{
          top: `${reviewCandidatesActionMenu.top}px`,
          left: `${reviewCandidatesActionMenu.left}px`,
        }"
        @click.stop
      >
        <button
          v-for="action in reviewCandidatesMenuActions"
          :key="action.id"
          class="review-candidates-action-menu__item"
          type="button"
          @click="handleReviewCandidatesMenuAction(action.id, reviewCandidatesActionMenu.candidate)"
        >
          <AppIcon :name="action.icon" :size="17" class="review-candidates-action-menu__icon" />
          <span>{{ action.label }}</span>
        </button>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="reviewCandidatesEmailModalOpen && reviewCandidatesEmailTarget"
        class="review-candidates-email-layer"
        @click="closeReviewCandidatesEmailModal"
      >
        <div class="review-candidates-email-modal" @click.stop>
          <header class="review-candidates-email-modal__head">
            <div class="review-candidates-email-modal__title-wrap">
              <div class="review-candidates-email-modal__title-icon">
                <AppIcon name="mail" :size="18" />
              </div>
              <h2>Send Email to Candidate</h2>
            </div>

            <button class="review-candidates-email-modal__close" type="button" @click="closeReviewCandidatesEmailModal">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <div class="review-candidates-email-modal__body">
            <section class="review-candidates-email-profile">
              <div class="review-candidates-email-profile__main">
                <div class="review-candidates-email-profile__avatar" :class="`tone-${reviewCandidatesEmailTarget.avatarTone}`">
                  {{ ownerInitials(reviewCandidatesEmailTarget.name) }}
                </div>

                <div class="review-candidates-email-profile__copy">
                  <strong>{{ reviewCandidatesEmailTarget.name }}</strong>
                  <span>{{ reviewCandidatesEmailTarget.email }}</span>
                  <small>{{ reviewCandidatesEmailTarget.role }} &bull; {{ reviewCandidatesEmailTarget.stageLabel }}</small>
                </div>
              </div>

              <div class="review-candidates-email-profile__meta">
                <div>
                  <small>Applied on</small>
                  <strong>{{ reviewCandidatesEmailTarget.appliedOn }}</strong>
                </div>
                <div>
                  <small>Current stage</small>
                  <span class="review-candidates-email-profile__stage">{{ reviewCandidatesEmailTarget.stage }}</span>
                </div>
                <button type="button">
                  View Profile
                  <AppIcon name="external-link" :size="15" />
                </button>
              </div>
            </section>

            <div class="review-candidates-email-layout">
              <section class="review-candidates-email-compose">
                <div class="review-candidates-email-compose__template-row">
                  <button class="review-candidates-email-template-trigger" type="button" @click="openReviewCandidatesEmailTemplateModal">
                    <span>{{ reviewCandidatesEmailTemplate || 'Use Template' }}</span>
                    <AppIcon name="chevronDown" :size="16" />
                  </button>
                </div>

                <label class="review-candidates-email-field">
                  <div class="review-candidates-email-field__head">
                    <span>To</span>
                    <div class="review-candidates-email-field__links">
                      <small>CC</small>
                      <small>BCC</small>
                    </div>
                  </div>
                  <input :value="reviewCandidatesEmailTarget.email" type="text" readonly>
                </label>

                <label class="review-candidates-email-field">
                  <div class="review-candidates-email-field__head">
                    <span>Subject</span>
                    <small>*</small>
                  </div>
                  <input v-model="reviewCandidatesEmailSubject" type="text">
                </label>

                <div class="review-candidates-email-editor">
                  <div class="review-candidates-email-field__head">
                    <span>Message</span>
                    <small>*</small>
                  </div>

                  <div class="review-candidates-email-editor__toolbar">
                    <div class="review-candidates-email-editor__tools">
                      <button type="button">Paragraph</button>
                      <button type="button"><strong>B</strong></button>
                      <button type="button"><em>I</em></button>
                      <button type="button"><u>U</u></button>
                      <button type="button">≡</button>
                      <button type="button">
                        <AppIcon name="link" :size="14" />
                      </button>
                    </div>

                    <button class="review-candidates-email-editor__insert" type="button">
                      Insert Variable
                      <AppIcon name="chevronDown" :size="14" />
                    </button>
                  </div>

                  <textarea v-model="reviewCandidatesEmailMessage" rows="12"></textarea>

                  <div class="review-candidates-email-editor__footer">
                    <span>Words: {{ reviewCandidatesEmailWordCount }}</span>
                  </div>
                </div>

                <div class="review-candidates-email-attachments">
                  <span>Attachments</span>
                  <div class="review-candidates-email-attachments__bar">
                    <button class="review-candidates-email-attachments__cancel" type="button" @click="closeReviewCandidatesEmailModal">
                      Cancel
                    </button>
                    <button class="review-candidates-email-attachments__upload" type="button">
                      <AppIcon name="plus" :size="15" />
                      <strong>Upload files</strong>
                      <small>or drag and drop</small>
                    </button>
                  </div>
                </div>
              </section>

              <aside class="review-candidates-email-side">
                <section class="review-candidates-email-panel">
                  <strong>Send Options</strong>

                  <label class="review-candidates-email-option">
                    <input v-model="reviewCandidatesEmailSendOption" type="radio" value="Send now">
                    <span></span>
                    <div>
                      <b>Send now</b>
                      <small>Send email immediately</small>
                    </div>
                  </label>

                  <label class="review-candidates-email-option">
                    <input v-model="reviewCandidatesEmailSendOption" type="radio" value="Schedule email">
                    <span></span>
                    <div>
                      <b>Schedule email</b>
                      <small>Choose date and time to send</small>
                    </div>
                  </label>

                  <div v-if="reviewCandidatesEmailSendOption === 'Schedule email'" class="review-candidates-email-side__fields">
                    <label class="review-candidates-email-field">
                      <div class="review-candidates-email-field__head">
                        <span>Date</span>
                      </div>
                      <input v-model="reviewCandidatesEmailDate" type="text">
                    </label>

                    <label class="review-candidates-email-field">
                      <div class="review-candidates-email-field__head">
                        <span>Time</span>
                      </div>
                      <AppSelect v-model="reviewCandidatesEmailTime" :options="reviewCandidatesEmailTimeOptions" />
                    </label>

                    <label class="review-candidates-email-field">
                      <div class="review-candidates-email-field__head">
                        <span>Time zone</span>
                      </div>
                      <AppSelect v-model="reviewCandidatesEmailTimezone" :options="reviewCandidatesEmailTimezoneOptions" />
                    </label>

                    <div class="review-candidates-email-side__notice">
                      <AppIcon name="calendar" :size="16" />
                      <div>
                        <span>Email will be sent on</span>
                        <strong>{{ reviewCandidatesEmailDate }} at {{ reviewCandidatesEmailTime }}</strong>
                        <small>{{ reviewCandidatesEmailTimezone }}</small>
                      </div>
                    </div>
                  </div>
                </section>

                <section class="review-candidates-email-panel">
                  <div class="review-candidates-email-panel__head">
                    <strong>Insert Variables</strong>
                    <AppIcon name="info" :size="15" />
                  </div>

                  <div class="review-candidates-email-variables">
                    <button v-for="variable in reviewCandidatesEmailVariables" :key="variable" type="button">
                      {{ variable }}
                    </button>
                  </div>
                </section>
              </aside>
            </div>
          </div>

          <footer class="review-candidates-email-modal__footer">
            <div class="review-candidates-email-modal__footer-actions">
              <button class="review-candidates-email-modal__ghost" type="button">
                <AppIcon name="eye" :size="15" />
                Preview Email
              </button>
              <button class="review-candidates-email-modal__primary" type="button">
                <AppIcon name="mail" :size="15" />
                {{ reviewCandidatesEmailSendOption === 'Schedule email' ? 'Schedule Email' : 'Send Email' }}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="reviewCandidatesEmailTemplateModalOpen"
        class="review-candidates-template-layer"
        @click="closeReviewCandidatesEmailTemplateModal"
      >
        <div class="review-candidates-template-modal" @click.stop>
          <header class="review-candidates-template-modal__head">
            <h2>Select Email Template</h2>

            <button class="review-candidates-template-modal__close" type="button" @click="closeReviewCandidatesEmailTemplateModal">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <div class="review-candidates-template-modal__body">
            <section class="review-candidates-template-browser">
              <label class="review-candidates-template-search">
                <AppIcon name="search" :size="18" />
                <input v-model="reviewCandidatesEmailTemplateSearch" type="text" placeholder="Search templates...">
              </label>

              <div class="review-candidates-template-group">
                <span>Categories</span>
                <div class="review-candidates-template-categories">
                  <button
                    v-for="category in reviewCandidatesEmailTemplateCategories"
                    :key="category"
                    type="button"
                    :class="{ 'is-active': reviewCandidatesEmailTemplateCategory === category }"
                    @click="reviewCandidatesEmailTemplateCategory = category"
                  >
                    {{ category }}
                  </button>
                </div>
              </div>

              <div class="review-candidates-template-group">
                <span>Templates</span>
                <div class="review-candidates-template-list">
                  <button
                    v-for="template in filteredReviewCandidatesEmailTemplates"
                    :key="template.id"
                    class="review-candidates-template-card"
                    :class="{ 'is-active': reviewCandidatesEmailSelectedTemplateId === template.id }"
                    type="button"
                    @click="selectReviewCandidatesEmailTemplate(template.id)"
                  >
                    <i class="review-candidates-template-card__radio"></i>
                    <span class="review-candidates-template-card__icon" :class="`tone-${template.tone}`">
                      <AppIcon :name="template.icon" :size="18" />
                    </span>
                    <div class="review-candidates-template-card__copy">
                      <strong>{{ template.title }}</strong>
                      <small>{{ template.description }}</small>
                      <em>{{ template.lastUsed }}</em>
                    </div>
                  </button>
                </div>
              </div>
            </section>

            <section class="review-candidates-template-preview">
              <span>Template Preview</span>
              <article class="review-candidates-template-preview__card">
                <label class="review-candidates-template-preview__subject">
                  <strong>Subject:</strong>
                  <input v-model="reviewCandidatesEmailTemplateDraftSubject" type="text">
                </label>

                <div class="review-candidates-template-preview__body">
                  <textarea v-model="reviewCandidatesEmailTemplateDraftBody" rows="14"></textarea>
                </div>

                <div class="review-candidates-template-preview__meta">
                  <div>
                    <span>Template Details</span>
                    <small><AppIcon name="document" :size="14" /> Category: {{ selectedReviewCandidatesEmailTemplate.category }}</small>
                    <small><AppIcon name="user" :size="14" /> Created by: {{ selectedReviewCandidatesEmailTemplate.createdBy }}</small>
                  </div>
                  <div>
                    <span>Variables Used ({{ reviewCandidatesEmailDraftVariables.length }})</span>
                    <div class="review-candidates-template-preview__chips">
                      <i v-for="variable in reviewCandidatesEmailDraftVariables" :key="variable">{{ variable }}</i>
                      <small v-if="!reviewCandidatesEmailDraftVariables.length">No variables left in this draft.</small>
                    </div>
                    <small><AppIcon name="clock" :size="14" /> {{ selectedReviewCandidatesEmailTemplate.updated }}</small>
                  </div>
                </div>
              </article>
            </section>
          </div>

          <footer class="review-candidates-template-modal__footer">
            <button class="review-candidates-template-modal__secondary" type="button" @click="closeReviewCandidatesEmailTemplateModal">
              Cancel
            </button>
            <button class="review-candidates-template-modal__primary" type="button" @click="applyReviewCandidatesEmailTemplate">
              Apply Template
            </button>
          </footer>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="reviewCandidatesNoteModalOpen && reviewCandidatesNoteTarget"
        class="review-candidates-note-layer"
        @click="closeReviewCandidatesNoteModal"
      >
        <div class="review-candidates-note-modal" @click.stop>
          <header class="review-candidates-note-modal__head">
            <div class="review-candidates-note-modal__title-wrap">
              <div class="review-candidates-note-modal__title-icon">
                <AppIcon name="edit" :size="18" />
              </div>
              <div>
                <h2>Add Note</h2>
                <p>Add a note about {{ reviewCandidatesNoteTarget.name }}</p>
              </div>
            </div>

            <button class="review-candidates-note-modal__close" type="button" @click="closeReviewCandidatesNoteModal">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <div class="review-candidates-note-modal__body">
            <div class="review-candidates-note-grid">
              <label class="review-candidates-note-field">
                <span>Note about</span>
                <button class="review-candidates-note-field__candidate" type="button">
                  <div class="review-candidates-note-field__candidate-main">
                    <div class="review-candidates-note-field__avatar" :class="`tone-${reviewCandidatesNoteTarget.avatarTone}`">
                      {{ ownerInitials(reviewCandidatesNoteTarget.name) }}
                    </div>
                    <div>
                      <strong>{{ reviewCandidatesNoteTarget.name }}</strong>
                      <small>{{ reviewCandidatesNoteTarget.role }} &bull; {{ reviewCandidatesNoteTarget.stage }}</small>
                    </div>
                  </div>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </label>

              <label class="review-candidates-note-field">
                <span>Note visibility</span>
                <div class="review-candidates-note-field__stack">
                  <AppSelect v-model="reviewCandidatesNoteVisibility" :options="reviewCandidatesNoteVisibilityOptions" />
                  <small>
                    {{ reviewCandidatesNoteVisibility === 'Hiring Team' ? 'Visible to all hiring team members' : reviewCandidatesNoteVisibility === 'Recruiters Only' ? 'Only recruiters can view this note' : 'Only you can view this note' }}
                  </small>
                </div>
              </label>
            </div>

            <label class="review-candidates-note-field">
              <span>Note <em>*</em></span>
              <div class="review-candidates-note-editor">
                <div class="review-candidates-note-editor__toolbar">
                  <div class="review-candidates-note-editor__tools">
                    <button type="button">Normal</button>
                    <button type="button"><strong>B</strong></button>
                    <button type="button"><em>I</em></button>
                    <button type="button"><u>U</u></button>
                    <button type="button">List</button>
                    <button type="button">
                      <AppIcon name="link" :size="14" />
                    </button>
                  </div>

                  <button type="button">
                    <AppIcon name="share" :size="14" />
                  </button>
                </div>

                <textarea v-model="reviewCandidatesNoteBody" rows="9"></textarea>

                <div class="review-candidates-note-editor__footer">
                  <span>Characters: {{ reviewCandidatesNoteCharacterCount }}</span>
                </div>
              </div>
            </label>

            <div class="review-candidates-note-grid">
              <label class="review-candidates-note-field">
                <span>Add tags <small>(optional)</small></span>
                <div class="review-candidates-note-tags">
                  <div class="review-candidates-note-tags__items">
                    <button
                      v-for="tag in reviewCandidatesNoteTags"
                      :key="tag"
                      class="review-candidates-note-tags__chip"
                      type="button"
                      @click="removeReviewCandidatesNoteTag(tag)"
                    >
                      <span>{{ tag }}</span>
                      <AppIcon name="close" :size="12" />
                    </button>
                  </div>
                  <button class="review-candidates-note-tags__toggle" type="button">
                    <AppIcon name="chevronDown" :size="16" />
                  </button>
                </div>
              </label>

              <label class="review-candidates-note-field">
                <span>Set reminder <small>(optional)</small></span>
                <div class="review-candidates-note-reminder">
                  <input v-model="reviewCandidatesNoteReminderDate" type="text">
                  <AppSelect v-model="reviewCandidatesNoteReminderTime" :options="reviewCandidatesNoteTimeOptions" />
                </div>
                <small>We'll remind you on Slack and email</small>
              </label>
            </div>

            <label class="review-candidates-note-followup">
              <input v-model="reviewCandidatesNoteFollowUpTask" type="checkbox">
              <span>
                <AppIcon name="check" :size="12" />
              </span>
              <div>
                <strong>Also create a follow-up task</strong>
                <small>This will create a task to follow up on this note</small>
              </div>
            </label>
          </div>

          <footer class="review-candidates-note-modal__footer">
            <button class="review-candidates-note-modal__secondary" type="button" @click="closeReviewCandidatesNoteModal">
              Cancel
            </button>
            <button class="review-candidates-note-modal__primary" type="button" @click="saveReviewCandidatesNote">
              <AppIcon name="document" :size="15" />
              Save Note
            </button>
          </footer>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="reviewCandidatesTalentPoolModalOpen && reviewCandidatesTalentPoolTarget"
        class="review-candidates-talent-layer"
        @click="closeReviewCandidatesTalentPoolModal"
      >
        <div class="review-candidates-talent-modal" @click.stop>
          <header class="review-candidates-talent-modal__head">
            <div class="review-candidates-talent-modal__title-wrap">
              <div class="review-candidates-talent-modal__title-icon">
                <AppIcon name="userPlus" :size="18" />
              </div>
              <div>
                <h2>Add to Talent Pool</h2>
                <p>Save this candidate for future opportunities</p>
              </div>
            </div>

            <button class="review-candidates-talent-modal__close" type="button" @click="closeReviewCandidatesTalentPoolModal">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <div class="review-candidates-talent-modal__body">
            <section class="review-candidates-talent-summary">
              <div class="review-candidates-talent-summary__profile">
                <div class="review-candidates-talent-summary__avatar" :class="`tone-${reviewCandidatesTalentPoolTarget.avatarTone}`">
                  {{ ownerInitials(reviewCandidatesTalentPoolTarget.name) }}
                </div>
                <div>
                  <div class="review-candidates-talent-summary__name-row">
                    <strong>{{ reviewCandidatesTalentPoolTarget.name }}</strong>
                    <span>{{ reviewCandidatesTalentPoolTarget.stage.toUpperCase() }} STAGE</span>
                  </div>
                  <p>{{ reviewCandidatesTalentPoolTarget.role }}</p>
                  <small>
                    <i><AppIcon name="mapPin" :size="13" /></i>{{ reviewCandidatesTalentPoolTarget.locationNote }}
                    <i><AppIcon name="mail" :size="13" /></i>{{ reviewCandidatesTalentPoolTarget.email }}
                  </small>
                </div>
              </div>

              <div class="review-candidates-talent-summary__score">
                <span>Match Score</span>
                <strong>{{ reviewCandidatesTalentPoolTarget.aiMatch }}%</strong>
                <div><i :style="{ width: `${reviewCandidatesTalentPoolTarget.aiMatch}%` }"></i></div>
              </div>
            </section>

            <div class="review-candidates-talent-grid">
              <label class="review-candidates-talent-field">
                <span>Talent Pool <em>*</em></span>
                <AppSelect v-model="reviewCandidatesTalentPoolName" :options="reviewCandidatesTalentPoolOptions" />
                <button class="review-candidates-talent-field__link" type="button">+ Create New Talent Pool</button>
              </label>

              <section class="review-candidates-talent-field">
                <span>Suggested Pools <i><AppIcon name="info" :size="14" /></i></span>
                <div class="review-candidates-talent-suggestions">
                  <button
                    v-for="pool in reviewCandidatesSuggestedTalentPools"
                    :key="pool.id"
                    type="button"
                    @click="reviewCandidatesTalentPoolName = pool.name"
                  >
                    <div>
                      <AppIcon name="userPlus" :size="15" />
                      <strong>{{ pool.name }}</strong>
                    </div>
                    <small :class="`tone-${pool.tone}`">{{ pool.match }}</small>
                  </button>
                </div>
              </section>
            </div>

            <section class="review-candidates-talent-field">
              <span>Reason for Adding <em>*</em></span>
              <div class="review-candidates-talent-reasons">
                <button
                  v-for="reason in reviewCandidatesTalentPoolReasonOptions"
                  :key="reason"
                  type="button"
                  :class="{ 'is-active': reviewCandidatesTalentPoolReason === reason }"
                  @click="reviewCandidatesTalentPoolReason = reason"
                >
                  <i></i>
                  <span>{{ reason }}</span>
                </button>
              </div>
            </section>

            <section class="review-candidates-talent-field">
              <span>Skills &amp; Tags</span>
              <div class="review-candidates-talent-tags">
                <button
                  v-for="tag in reviewCandidatesTalentPoolTags"
                  :key="tag"
                  class="review-candidates-talent-tags__chip"
                  type="button"
                  @click="removeReviewCandidatesTalentPoolTag(tag)"
                >
                  <span>{{ tag }}</span>
                  <AppIcon name="close" :size="12" />
                </button>
                <button class="review-candidates-talent-tags__add" type="button">+ Add tag</button>
              </div>
            </section>

            <label class="review-candidates-talent-field">
              <span>Note</span>
              <div class="review-candidates-talent-note">
                <textarea v-model="reviewCandidatesTalentPoolNote" rows="4"></textarea>
                <small>{{ reviewCandidatesTalentPoolNoteCharacterCount }}/1000</small>
              </div>
            </label>

            <div class="review-candidates-talent-bottom">
              <div class="review-candidates-talent-bottom__column">
                <label class="review-candidates-talent-toggle">
                  <input v-model="reviewCandidatesTalentPoolRemindLater" type="checkbox">
                  <span>
                    <AppIcon name="check" :size="12" />
                  </span>
                  <strong>Remind me later</strong>
                </label>

                <div class="review-candidates-talent-reminder">
                  <input v-model="reviewCandidatesTalentPoolReminderDate" type="text">
                  <AppSelect v-model="reviewCandidatesTalentPoolReminderTime" :options="reviewCandidatesTalentPoolReminderTimeOptions" />
                </div>
              </div>

              <div class="review-candidates-talent-bottom__column">
                <span>Visibility <i><AppIcon name="info" :size="14" /></i></span>
                <div class="review-candidates-talent-visibility">
                  <label v-for="visibility in reviewCandidatesTalentPoolVisibilityOptions" :key="visibility">
                    <input v-model="reviewCandidatesTalentPoolVisibility" type="radio" :value="visibility">
                    <i></i>
                    <div>
                      <strong>{{ visibility === 'Hiring team' ? 'Hiring team' : 'Recruiters only' }}</strong>
                      <small>{{ visibility === 'Hiring team' ? 'Visible to all hiring team members' : 'Only visible to recruiters' }}</small>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <footer class="review-candidates-talent-modal__footer">
            <button class="review-candidates-talent-modal__secondary" type="button" @click="closeReviewCandidatesTalentPoolModal">
              Cancel
            </button>
            <button class="review-candidates-talent-modal__primary" type="button" @click="saveReviewCandidatesTalentPool">
              <AppIcon name="userPlus" :size="15" />
              Add to Talent Pool
            </button>
          </footer>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="reviewCandidatesTalentPoolSuccessOpen && reviewCandidatesTalentPoolSuccessData"
        class="review-candidates-talent-success-layer"
        @click="closeReviewCandidatesTalentPoolSuccessModal"
      >
        <div class="review-candidates-talent-success-modal" @click.stop>
          <button class="review-candidates-talent-success-modal__close" type="button" @click="closeReviewCandidatesTalentPoolSuccessModal">
            <AppIcon name="close" :size="18" />
          </button>

          <div class="review-candidates-talent-success-modal__hero">
            <i class="dot dot-pink"></i>
            <i class="dot dot-green"></i>
            <i class="dot dot-violet"></i>
            <i class="dot dot-blue"></i>
            <i class="dot dot-yellow"></i>
            <i class="dot dot-pink small"></i>
            <div class="review-candidates-talent-success-modal__badge">
              <AppIcon name="check" :size="28" />
            </div>
            <h2>Added to Talent Pool</h2>
            <p>
              {{ reviewCandidatesTalentPoolSuccessData.candidateName }} has been added to
              <strong>{{ reviewCandidatesTalentPoolSuccessData.poolName }}</strong>
              Talent Pool.
            </p>
          </div>

          <div class="review-candidates-talent-success-modal__body">
            <section class="review-candidates-talent-success-modal__item">
              <span class="review-candidates-talent-success-modal__icon tone-green">
                <AppIcon name="userPlus" :size="16" />
              </span>
              <div>
                <small>Talent Pool</small>
                <strong>{{ reviewCandidatesTalentPoolSuccessData.poolName }}</strong>
              </div>
            </section>

            <section class="review-candidates-talent-success-modal__item">
              <span class="review-candidates-talent-success-modal__icon tone-violet">
                <AppIcon name="heart" :size="16" />
              </span>
              <div>
                <small>Tags Added</small>
                <div class="review-candidates-talent-success-modal__chips">
                  <i v-for="tag in reviewCandidatesTalentPoolSuccessData.tags" :key="tag">{{ tag }}</i>
                </div>
              </div>
            </section>

            <section v-if="reviewCandidatesTalentPoolSuccessData.reminder" class="review-candidates-talent-success-modal__item">
              <span class="review-candidates-talent-success-modal__icon tone-blue">
                <AppIcon name="calendar" :size="16" />
              </span>
              <div>
                <small>Follow-up Reminder</small>
                <strong>{{ reviewCandidatesTalentPoolSuccessData.reminder }}</strong>
                <p>We'll remind you on Slack and email</p>
              </div>
            </section>
          </div>

          <footer class="review-candidates-talent-success-modal__footer">
            <button class="review-candidates-talent-success-modal__secondary" type="button" @click="closeReviewCandidatesTalentPoolSuccessModal">
              View Talent Pool
            </button>
            <button class="review-candidates-talent-success-modal__primary" type="button" @click="closeReviewCandidatesTalentPoolSuccessModal">
              Done
            </button>
          </footer>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="sendReminderModalOpen" class="send-reminder-layer" @click="closeSendReminderModal">
        <div class="send-reminder-modal" @click.stop>
          <div class="send-reminder-modal__head">
            <div class="send-reminder-modal__title-wrap">
              <div class="send-reminder-modal__title-icon">
                <AppIcon name="bell" :size="18" />
              </div>
              <div>
                <h2>Send reminders</h2>
                <p>We'll send reminders to people with pending actions for this job.</p>
              </div>
            </div>

            <button class="send-reminder-modal__close" type="button" @click="closeSendReminderModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <section class="send-reminder-job">
            <div class="send-reminder-job__avatar">{{ sendReminderJob.initials }}</div>
            <div class="send-reminder-job__copy">
              <strong>{{ sendReminderJob.title }}</strong>
              <div class="send-reminder-job__meta">
                <span><AppIcon name="mapPin" :size="12" /> {{ sendReminderJob.location }}</span>
                <em>&bull;</em>
                <small>{{ sendReminderJob.closing }}</small>
              </div>
            </div>
          </section>

          <div class="send-reminder-section__head">
            <div class="send-reminder-section__copy">
              <h3>People with pending actions ({{ sendReminderPeople.length }})</h3>
              <p>These team members have outstanding tasks for this role.</p>
            </div>

            <label class="send-reminder-select-all">
              <input v-model="allReminderPeopleSelected" type="checkbox">
              <span>Select all</span>
            </label>
          </div>

          <section class="send-reminder-list">
            <article v-for="person in sendReminderPeople" :key="person.id" class="send-reminder-row">
              <div class="send-reminder-row__person">
                <label class="send-reminder-row__toggle">
                  <input :checked="person.selected" type="checkbox" tabindex="-1" @change="toggleReminderRecipient(person.id)">
                  <span></span>
                </label>
                <div class="send-reminder-row__avatar">{{ person.initials }}</div>
                <div class="send-reminder-row__copy">
                  <strong>{{ person.name }}</strong>
                  <span>{{ person.role }}</span>
                </div>
              </div>

              <div class="send-reminder-row__task">
                <span class="send-reminder-task" :class="`send-reminder-task--${person.taskTone}`">
                  <AppIcon :name="person.taskIcon" :size="14" />
                  {{ person.task }}
                </span>
              </div>

              <div class="send-reminder-row__status">
                <strong :class="`is-${person.dueTone}`">{{ person.due }}</strong>
                <span>{{ person.reminderMeta }}</span>
              </div>

              <button class="send-reminder-row__mail" type="button" aria-label="Send reminder">
                <AppIcon name="mail" :size="16" />
              </button>
            </article>
          </section>

          <section class="send-reminder-add">
            <div class="send-reminder-add__copy">
              <div class="send-reminder-add__icon">
                <AppIcon name="userPlus" :size="18" />
              </div>
              <div>
                <strong>Can't find the recipient?</strong>
                <p>Add someone who should receive a reminder.</p>
              </div>
            </div>

            <button class="send-reminder-add__button" type="button">
              <AppIcon name="plus" :size="14" />
              Add recipient
            </button>
          </section>

          <div class="send-reminder-modal__footer">
            <button class="send-reminder-modal__ghost" type="button" @click="closeSendReminderModal">Cancel</button>
            <button class="send-reminder-modal__primary" type="button">
              <AppIcon name="share" :size="14" />
              Send {{ selectedReminderCount }} reminders
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="scheduleInterviewsModalOpen" class="schedule-modal-layer" @click="closeScheduleInterviewsModal">
        <div class="schedule-modal" @click.stop>
          <div class="schedule-modal__head">
            <div class="schedule-modal__title-wrap">
              <div class="schedule-modal__title-icon">
                <AppIcon name="calendar" :size="18" />
              </div>
              <div>
                <h2>Schedule Interviews ({{ scheduleInterviewTabCounts.All }})</h2>
                <p>View and manage interviews in one place.</p>
              </div>
            </div>

            <button class="schedule-modal__close" type="button" @click="closeScheduleInterviewsModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="schedule-toolbar">
            <div class="schedule-tabs">
              <button
                class="schedule-tab"
                :class="{ 'is-active': scheduleInterviewTab === 'All' }"
                type="button"
                @click="scheduleInterviewTab = 'All'"
              >
                All ({{ scheduleInterviewTabCounts.All }})
              </button>
              <button
                class="schedule-tab"
                :class="{ 'is-active': scheduleInterviewTab === 'To Schedule' }"
                type="button"
                @click="scheduleInterviewTab = 'To Schedule'"
              >
                To Schedule ({{ scheduleInterviewTabCounts['To Schedule'] }})
                <span class="schedule-tab__dot is-orange"></span>
              </button>
              <button
                class="schedule-tab"
                :class="{ 'is-active': scheduleInterviewTab === 'Scheduled' }"
                type="button"
                @click="scheduleInterviewTab = 'Scheduled'"
              >
                Scheduled ({{ scheduleInterviewTabCounts.Scheduled }})
                <span class="schedule-tab__dot is-green"></span>
              </button>
            </div>

            <div class="schedule-sort">
              <span>Sort by:</span>
              <AppSelect v-model="scheduleInterviewSort" :options="scheduleInterviewSortOptions" />
            </div>
          </div>

          <section class="schedule-list">
            <article v-for="entry in filteredScheduleInterviews" :key="entry.id" class="schedule-card">
              <div class="schedule-card__main">
                <div class="schedule-card__person">
                  <div class="schedule-card__avatar" :class="`tone-${entry.initialsTone}`">{{ entry.initials }}</div>
                  <div class="schedule-card__copy">
                    <strong>{{ entry.name }}</strong>
                    <span>{{ entry.role }}</span>
                    <small :class="`is-${entry.statusTone}`">
                      <AppIcon :name="entry.state === 'Scheduled' ? 'check' : 'clock'" :size="11" />
                      {{ entry.statusLabel }}
                    </small>
                  </div>
                </div>

                <div class="schedule-card__meta-grid">
                  <div class="schedule-card__meta">
                    <label><AppIcon name="users" :size="13" /> Interview type</label>
                    <strong>{{ entry.interviewType }}</strong>
                  </div>
                  <div class="schedule-card__meta">
                    <label><AppIcon name="calendar" :size="13" /> {{ entry.timeLabel }}</label>
                    <strong>{{ entry.date }}</strong>
                    <span>{{ entry.timeRange }}</span>
                  </div>
                  <div class="schedule-card__meta">
                    <label><AppIcon name="user" :size="13" /> Interviewer</label>
                    <strong>{{ entry.interviewer }}</strong>
                    <span>{{ entry.interviewerRole }}</span>
                  </div>
                </div>
              </div>

              <div class="schedule-card__footer">
                <span class="schedule-card__note" :class="`schedule-card__note--${entry.footerTone}`">
                  <AppIcon :name="entry.state === 'Scheduled' ? 'calendar' : 'sparkles'" :size="13" />
                  {{ entry.footerLabel }}
                </span>

                <div class="schedule-card__actions">
                  <button class="schedule-card__ghost" type="button">{{ entry.secondaryAction }}</button>
                  <button class="schedule-card__primary" :class="{ 'is-outline': entry.state === 'Scheduled' }" type="button">
                    {{ entry.primaryAction }}
                  </button>
                </div>
              </div>
            </article>
          </section>

          <div class="schedule-modal__footer">
            <div class="schedule-modal__summary">
              <div class="schedule-modal__summary-icon">
                <AppIcon name="users" :size="16" />
              </div>
              <div>
                <strong>{{ scheduleInterviewTabCounts.All }} interviews</strong>
                <span>{{ scheduleInterviewTabCounts['To Schedule'] }} to schedule • {{ scheduleInterviewTabCounts.Scheduled }} scheduled</span>
              </div>
            </div>

            <button class="schedule-modal__ghost" type="button" @click="closeScheduleInterviewsModal">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="closingSoonJobsModalOpen" class="closing-soon-layer" @click="closeClosingSoonJobsModal">
        <div class="closing-soon-modal" @click.stop>
          <div class="closing-soon-modal__head">
            <div class="closing-soon-modal__title-wrap">
              <div class="closing-soon-modal__title-icon">
                <AppIcon name="alert" :size="18" />
              </div>
              <div>
                <h2>Closing Soon Jobs ({{ closingSoonJobs.length }})</h2>
                <p>These jobs will close within the next 7 days.</p>
              </div>
            </div>

            <button class="closing-soon-modal__close" type="button" @click="closeClosingSoonJobsModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <section class="closing-soon-summary">
            <article v-for="item in closingSoonSummary" :key="item.label" class="closing-soon-summary__card">
              <div class="closing-soon-summary__icon" :class="`tone-${item.tone}`">
                <AppIcon :name="item.icon" :size="16" />
              </div>
              <div class="closing-soon-summary__copy">
                <strong :class="`is-${item.tone}`">{{ item.value }}</strong>
                <span>{{ item.label }}</span>
                <small>{{ item.note }}</small>
              </div>
            </article>
          </section>

          <section class="closing-soon-table">
            <header class="closing-soon-table__head">
              <span>Job</span>
              <span>Applicants</span>
              <span>Closing in</span>
              <span>Closing date</span>
              <span>Status</span>
              <span>Action</span>
            </header>

            <article v-for="job in closingSoonJobs" :key="job.id" class="closing-soon-row">
              <div class="closing-soon-row__job">
                <div class="closing-soon-row__avatar" :class="`tone-${job.initialsTone}`">{{ job.initials }}</div>
                <div class="closing-soon-row__copy">
                  <strong>{{ job.title }}</strong>
                  <span>{{ job.brand }} &bull; {{ job.location }}</span>
                </div>
              </div>

              <div class="closing-soon-row__metric">
                <strong>{{ job.applicants }}</strong>
                <small>{{ job.applicantsNote }}</small>
              </div>

              <div class="closing-soon-row__metric">
                <span class="closing-soon-row__pill" :class="`closing-soon-row__pill--${job.closingTone}`">{{ job.closingIn }}</span>
                <small>{{ job.closingPriority }}</small>
              </div>

              <div class="closing-soon-row__metric">
                <strong>{{ job.closingDate }}</strong>
                <small>{{ job.closingDay }}</small>
              </div>

              <div class="closing-soon-row__status">
                <strong :class="`is-${job.statusTone}`">{{ job.status }}</strong>
                <small>{{ job.statusNote }}</small>
              </div>

              <div class="closing-soon-row__actions">
                <button class="closing-soon-row__button" :class="`is-${job.actionTone}`" type="button" @click="handleClosingSoonAction(job)">
                  <AppIcon :name="job.actionTone === 'blue' ? 'megaphone' : job.actionTone === 'orange' ? 'users' : 'calendar'" :size="14" />
                  {{ job.actionLabel }}
                </button>
                <button class="closing-soon-row__more" type="button" aria-label="More actions">
                  <AppIcon name="more" :size="16" />
                </button>
              </div>
            </article>
          </section>

          <div class="closing-soon-note">
            <AppIcon name="info" :size="15" />
            <span>After the closing date, candidates will no longer be able to apply.</span>
          </div>

          <div class="closing-soon-modal__footer">
            <div class="closing-soon-footer-actions">
              <article v-for="item in closingSoonFooterActions" :key="item.title" class="closing-soon-footer-card">
                <div class="closing-soon-footer-card__icon" :class="`tone-${item.tone}`">
                  <AppIcon :name="item.icon" :size="16" />
                </div>
                <div class="closing-soon-footer-card__copy">
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.note }}</span>
                </div>
              </article>
            </div>

            <div class="closing-soon-footer-buttons">
              <button class="closing-soon-footer-buttons__ghost" type="button">View All Jobs</button>
              <button class="closing-soon-footer-buttons__primary" type="button">Take All Actions</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.panel {
  background: #fff;
  border: 1px solid #edf1f8;
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.jobs-page {
  padding: 18px 24px 28px;
  display: grid;
  gap: 18px;
  background:
    radial-gradient(circle at top left, rgba(242, 95, 179, 0.05), transparent 20%),
    linear-gradient(180deg, #fcfdff 0%, #f7f9fd 100%);
}

.jobs-page__top,
.jobs-page__content,
.jobs-page__side {
  min-width: 0;
  display: grid;
  gap: 18px;
}

.jobs-page__content {
  grid-template-columns: minmax(0, 1fr) 288px;
  gap: 20px;
  align-items: start;
}

.jobs-page__side {
  align-self: start;
}

.jobs-hero,
.jobs-board__top,
.jobs-board__footer,
.side-panel__head,
.view-tabs,
.board-tools,
.status-cell,
.attention-card,
.health-panel {
  display: flex;
  align-items: center;
}

.jobs-hero,
.jobs-board__top,
.jobs-board__footer,
.side-panel__head,
.health-panel {
  justify-content: space-between;
}

.jobs-hero {
  padding: 8px 0 2px;
  gap: 18px;
}

.jobs-hero__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.jobs-hero__copy h1 {
  margin: 0 0 6px;
  color: #17213f;
  font-size: 23px;
  font-weight: 800;
  line-height: 1.1;
}

.jobs-hero__copy p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
}

.hero-mode-pill {
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7267f6;
  background: #f3efff;
  font-size: 11px;
  font-weight: 700;
}

.create-button,
.tool-button,
.view-filters,
.quick-filter,
.pagination__button,
.row-action {
  border: 1px solid #e6ecf5;
  background: #fff;
}

.create-button,
.tool-button,
.view-filters {
  height: 38px;
  padding: 0 16px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #31415d;
  font-size: 12px;
  font-weight: 700;
}

.create-button {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 10px 20px rgba(241, 88, 173, 0.24);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  min-width: 0;
  min-height: 174px;
  padding: 20px 20px 18px;
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  gap: 12px;
}

.stat-card__icon,
.attention-card__icon,
.status-cell__icon-wrap,
.tone-pink,
.tone-violet,
.tone-orange,
.tone-blue,
.tone-blue-soft,
.tone-green,
.tone-slate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.stat-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
}

.stat-card__value {
  color: #17213f;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.05;
}

.stat-card__label {
  color: #5f6d86;
  font-size: 12px;
  line-height: 1.35;
}

.stat-card__delta {
  align-self: end;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #18b863;
  font-size: 11px;
  font-weight: 700;
}

.stat-card__delta.negative {
  color: #ff5f74;
}

.jobs-board,
.side-panel {
  padding: 16px 18px;
}

.jobs-board {
  min-width: 0;
}

.jobs-board__top {
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.view-tabs,
.board-tools {
  gap: 14px;
}

.view-tab {
  position: relative;
  height: 34px;
  padding: 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #5f6d86;
  font-size: 12px;
  font-weight: 700;
}

.view-tab::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -11px;
  left: 0;
  height: 2px;
  border-radius: 999px;
  background: transparent;
}

.view-tab.is-active {
  color: #f24193;
}

.view-tab.is-active::after {
  background: #f24193;
}

.board-search {
  min-width: 258px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #e3eaf4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9aa6bb;
  background: #fff;
}

.board-search input {
  flex: 1;
  border: 0;
  outline: none;
  color: #1f2d49;
  background: transparent;
  font-size: 12px;
}

.tool-button {
  height: 32px;
  padding: 0 14px;
  border-radius: 10px;
}

.jobs-table-wrap {
  max-width: 100%;
  overflow-x: hidden;
}

.jobs-table {
  width: 100%;
  min-width: 0;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.jobs-table__col--role {
  width: 27%;
}

.jobs-table__col--pipeline {
  width: 16%;
}

.jobs-table__col--health {
  width: 15%;
}

.jobs-table__col--attention {
  width: 16%;
}

.jobs-table__col--forecast {
  width: 14%;
}

.jobs-table__col--days {
  width: 8%;
}

.jobs-table__col--actions {
  width: 4%;
}

.jobs-table th,
.jobs-table td {
  padding: 14px 12px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #edf1f7;
}

.jobs-table th {
  color: #9aa6bb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  line-height: 1.25;
  background: #fafbfd;
}

.jobs-table th:nth-child(2),
.jobs-table th:nth-child(3),
.jobs-table th:nth-child(4),
.jobs-table th:nth-child(5),
.jobs-table th:nth-child(6) {
  text-align: center;
}

.jobs-table td:nth-child(2),
.jobs-table td:nth-child(6),
.jobs-table td:nth-child(7) {
  text-align: center;
}

.jobs-table thead th:first-child {
  border-top-left-radius: 14px;
}

.jobs-table thead th:last-child {
  border-top-right-radius: 14px;
}

.sort-cell {
  text-align: center;
  font-size: 13px;
}

.job-role-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.job-role-cell input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #f24a98;
  flex-shrink: 0;
}

.job-role-button {
  border: 0;
  padding: 0;
  background: transparent;
  text-align: left;
}

.job-role-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  color: #8a58ff;
}

.job-role-top strong,
.status-copy strong,
.forecast-cell strong,
.attention-card__body strong,
.board-column__head strong,
.brief-card strong,
.analytics-row strong {
  color: #17213f;
}

.job-role-top strong {
  font-size: 13px;
  line-height: 1.35;
}

.job-role-button > span,
.status-copy span,
.attention-card__body span,
.forecast-note,
.days-cell span,
.brief-card span,
.analytics-row span {
  color: #7d8aa1;
  font-size: 11px;
}

.job-status-pill {
  width: fit-content;
  margin-top: 8px;
  padding: 5px 9px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
}

.job-status-pill--active {
  color: #18a75f;
  background: #ebfaef;
}

.job-status-pill--closing-soon {
  color: #f23d93;
  background: #fff0f7;
}

.job-status-pill--draft {
  color: #7d8797;
  background: #f4f6fa;
}

.pipeline-cell {
  min-width: 0;
}

.pipeline-open-button {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
}

.pipeline-track,
.pipeline-values {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.pipeline-track {
  gap: 4px;
  margin-bottom: 8px;
}

.pipeline-track__segment {
  height: 4px;
  border-radius: 999px;
}

.pipeline-track__segment.is-empty {
  color: #edf2f7;
  background: #edf2f7;
}

.pipeline-track__segment.tone-blue {
  color: #4b84f5;
  background: #4b84f5;
}

.pipeline-track__segment.tone-blue-soft {
  color: #7bb1ff;
  background: #7bb1ff;
}

.pipeline-track__segment.tone-orange {
  color: #f4c24f;
  background: #f4c24f;
}

.pipeline-track__segment.tone-orange-soft {
  color: #ff9e34;
  background: #ff9e34;
}

.pipeline-track__segment.tone-green {
  color: #59d18c;
  background: #59d18c;
}

.pipeline-values {
  gap: 6px;
}

.pipeline-values span,
.pipeline-empty {
  color: #97a3b8;
  font-size: 11px;
  font-weight: 700;
}

.pipeline-empty {
  text-align: center;
}

.status-cell {
  gap: 8px;
  min-width: 0;
}

.status-cell__badge,
.health-score {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 4px solid currentColor;
  background: #fff;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.status-cell__badge--green,
.health-score {
  color: #20b25d;
}

.status-cell__badge--orange {
  color: #ff9b35;
}

.status-cell__badge--pink {
  color: #ff6580;
}

.status-cell__badge--slate {
  color: #e3e8f0;
}

.status-cell__icon-wrap {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-copy strong {
  display: block;
  margin-bottom: 3px;
  font-size: 12px;
  line-height: 1.35;
}

.status-copy span {
  line-height: 1.45;
}

.forecast-cell {
  display: grid;
  gap: 4px;
}

.forecast-cell strong {
  font-size: 12px;
  line-height: 1.35;
}

.forecast-note {
  font-weight: 600;
  line-height: 1.45;
}

.forecast-note--green {
  color: #16a95c;
}

.forecast-note--orange {
  color: #ff8f34;
}

.forecast-note--pink {
  color: #ff5e80;
}

.forecast-note--slate {
  color: #96a1b4;
}

.days-cell strong {
  display: block;
  margin-bottom: 2px;
  color: #17213f;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.1;
}

.row-action {
  width: 32px;
  height: 32px;
  padding: 0;
  border-color: transparent;
  color: #98a4b9;
}

.row-action.is-open {
  border-color: #d9e3f0;
  color: #4c5a75;
  background: #fff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.jobs-board__footer {
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.jobs-board__footer > span,
.jobs-board__footer-select > span {
  color: #6f7d94;
  font-size: 11px;
}

.jobs-board__footer-select {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.jobs-board__footer-select :deep(.app-select-trigger) {
  min-width: 72px;
  min-height: 30px;
  border-radius: 8px;
  font-size: 11px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination__button {
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #7b879c;
  font-size: 12px;
  font-weight: 700;
}

.pagination__button--dots {
  width: 34px;
}

.pagination__button.is-active {
  color: #fff;
  border-color: transparent;
  background: #f24193;
}

.briefing-view {
  display: grid;
  gap: 18px;
}

.briefing-glance,
.briefing-highlight-card,
.briefing-risk-card {
  border: 1px solid #edf1f7;
  background: #fff;
  border-radius: 18px;
}

.briefing-glance {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.briefing-glance__copy {
  display: grid;
  gap: 8px;
}

.briefing-glance__copy > span {
  color: #8d99af;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.briefing-glance__copy h2 {
  margin: 0;
  max-width: 400px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.2;
}

.briefing-glance__copy mark {
  color: #f24193;
  background: transparent;
}

.briefing-glance__stats {
  display: flex;
  align-items: center;
  gap: 26px;
}

.briefing-glance__stat {
  display: grid;
  gap: 4px;
  min-width: 68px;
}

.briefing-glance__stat strong {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}

.briefing-glance__stat span {
  color: #7b879d;
  font-size: 12px;
  line-height: 1.35;
}

.briefing-glance__ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f062af;
  border: 6px solid #f48bc6;
  background: #fff7fb;
  flex-shrink: 0;
}

.briefing-section {
  display: grid;
  gap: 12px;
}

.briefing-section__head,
.briefing-highlight-card__top,
.briefing-highlight-card__footer,
.briefing-good-row,
.briefing-progress-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.briefing-section__title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.briefing-section__title h3 {
  margin: 0;
  color: #20284c;
  font-size: 15px;
}

.briefing-section__title p {
  margin: 0;
  color: #7d8aa1;
  font-size: 13px;
}

.briefing-section__head > button,
.briefing-good-row > button {
  border: 0;
  background: transparent;
  color: #f24193;
  font-size: 12px;
  font-weight: 700;
}

.briefing-highlight-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.briefing-highlight-card {
  position: relative;
  padding: 18px 20px;
  display: grid;
  gap: 16px;
  overflow: hidden;
}

.briefing-highlight-card::before,
.briefing-risk-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 2px;
  background: #edf1f7;
}

.briefing-highlight-card--pink::before,
.briefing-risk-card--pink::before {
  background: #ff6b86;
}

.briefing-highlight-card--orange::before,
.briefing-risk-card--orange::before {
  background: #ff9b35;
}

.briefing-highlight-card--green::before {
  background: #21b764;
}

.briefing-highlight-card__top {
  align-items: flex-start;
}

.briefing-highlight-card__top strong,
.briefing-risk-card__job strong {
  display: block;
  margin: 10px 0 4px;
  color: #1b2647;
  font-size: 17px;
  line-height: 1.25;
}

.briefing-highlight-card__top p,
.briefing-risk-card__job p {
  margin: 0;
  color: #7d8aa1;
  font-size: 13px;
}

.briefing-badge {
  min-height: 22px;
  padding: 0 9px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.briefing-badge--pink {
  color: #f45479;
  background: #fff0f4;
}

.briefing-badge--orange {
  color: #ef7d23;
  background: #fff4ea;
}

.briefing-badge--green {
  color: #1aaa5d;
  background: #ecfbf3;
}

.briefing-highlight-card__actions {
  display: grid;
  justify-items: end;
  gap: 10px;
}

.briefing-open-button,
.briefing-link-button {
  border: 0;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
}

.briefing-open-button {
  min-width: 102px;
  height: 34px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid #e3eaf5;
  color: #f24193;
  background: #fff;
}

.briefing-link-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b63f5;
}

.briefing-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.briefing-metric {
  display: grid;
  gap: 4px;
}

.briefing-metric strong,
.briefing-risk-card__stat strong {
  color: #1b2647;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
}

.briefing-metric span,
.briefing-risk-card__stat span {
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.briefing-metric small {
  font-size: 11px;
  font-weight: 700;
}

.briefing-highlight-card__notes {
  padding-top: 14px;
  border-top: 1px solid #edf1f7;
  display: grid;
  gap: 10px;
}

.briefing-note-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}

.briefing-note-row__copy {
  display: grid;
  gap: 4px;
}

.briefing-note-row__copy span,
.briefing-note-row__copy small {
  color: #7d8aa1;
  font-size: 12px;
  line-height: 1.4;
}

.briefing-note-row strong {
  font-size: 12px;
  font-weight: 800;
}

.briefing-highlight-card__footer {
  padding-top: 14px;
  border-top: 1px solid #edf1f7;
  align-items: end;
}

.briefing-highlight-card__footer-stat {
  display: grid;
  gap: 4px;
}

.briefing-highlight-card__footer-stat strong {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.briefing-highlight-card__footer-stat span {
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.briefing-highlight-card__footer-stat--wide {
  flex: 1;
}

.briefing-owner-avatar,
.win-card__avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(145deg, #0f172a, #2680eb);
  font-size: 10px;
  font-weight: 800;
  flex-shrink: 0;
}

.briefing-risk-grid {
  display: grid;
  gap: 12px;
}

.briefing-risk-card {
  position: relative;
  padding: 16px 18px;
  display: grid;
  grid-template-columns: 1.35fr 0.6fr 1fr 0.8fr auto;
  gap: 16px;
  align-items: center;
}

.briefing-risk-card__job,
.briefing-risk-card__issue {
  display: grid;
  gap: 6px;
}

.briefing-risk-card__issue span {
  color: #7d8aa1;
  font-size: 12px;
  line-height: 1.45;
}

.briefing-risk-card__job .briefing-badge {
  margin-top: 2px;
}

.briefing-good-row {
  padding: 4px 0 2px;
}

.briefing-good-row__copy {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1bad5f;
}

.briefing-good-row__copy strong {
  color: #1b2647;
}

.briefing-good-row__copy span {
  color: #7d8aa1;
  font-size: 13px;
}

.win-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}

.win-card + .win-card {
  margin-top: 14px;
}

.win-card__body {
  display: grid;
  gap: 4px;
}

.win-card__tag {
  width: fit-content;
  min-height: 18px;
  padding: 0 7px;
  border-radius: 999px;
  color: #4b84f5;
  background: #edf4ff;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}

.win-card__tag.is-green {
  color: #16ab5e;
  background: #ecfbf3;
}

.win-card__body strong {
  color: #1b2647;
  font-size: 13px;
  line-height: 1.35;
}

.win-card__body small,
.win-card__age {
  color: #8d99af;
  font-size: 11px;
  line-height: 1.45;
}

.briefing-progress-list,
.briefing-actions {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.briefing-progress-card {
  display: grid;
  gap: 10px;
}

.briefing-progress-card__label,
.briefing-action {
  display: flex;
  align-items: center;
}

.briefing-progress-card__label {
  gap: 8px;
  color: #42506a;
  font-size: 12px;
  font-weight: 600;
}

.briefing-progress-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.briefing-progress-card__meta strong {
  color: #1b2647;
  font-size: 14px;
}

.briefing-progress-card__meta small {
  font-size: 11px;
  font-weight: 700;
}

.briefing-progress-card__track {
  height: 6px;
  border-radius: 999px;
  background: #edf1f7;
  overflow: hidden;
}

.briefing-progress-card__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: currentColor;
}

.briefing-action {
  width: 100%;
  padding: 14px 12px;
  border: 1px solid #edf1f7;
  border-radius: 14px;
  justify-content: space-between;
  gap: 12px;
  background: #fff;
}

.briefing-action__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #7a879c;
  background: #f7f9fd;
  flex-shrink: 0;
}

.briefing-action__copy {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 3px;
  text-align: left;
}

.briefing-action__copy strong {
  color: #1b2647;
  font-size: 12px;
  line-height: 1.35;
}

.briefing-action__copy span,
.briefing-action__arrow {
  color: #8d99af;
  font-size: 11px;
}

.briefing-action__count {
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f24193;
  background: #fff1f8;
  font-size: 11px;
  font-weight: 800;
}

.is-pink {
  color: #ff5e80;
}

.is-orange {
  color: #ff9232;
}

.is-green {
  color: #18b863;
}

.is-blue {
  color: #4b84f5;
}

.is-violet {
  color: #8b52ff;
}

.is-slate {
  color: #7d8aa1;
}

.board-view {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.board-job-card,
.brief-card,
.analytics-row {
  border: 1px solid #edf1f7;
  background: #fff;
  border-radius: 16px;
}

.board-job-card {
  position: relative;
  min-height: 340px;
  padding: 18px 20px 16px;
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  gap: 18px;
  cursor: pointer;
  overflow: hidden;
}

.board-job-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  background: #e8eef6;
}

.board-job-card--green::before {
  background: #18c46f;
}

.board-job-card--orange::before {
  background: #ff9b35;
}

.board-job-card--pink::before {
  background: #ff5077;
}

.board-job-card--slate::before {
  background: #dfe7f2;
}

.board-job-card__top,
.board-job-card__title-row,
.board-job-card__status-row,
.board-job-card__meta-line,
.board-job-card__footer {
  display: flex;
  align-items: center;
}

.board-job-card__top,
.board-job-card__status-row,
.board-job-card__footer {
  justify-content: space-between;
  gap: 14px;
}

.board-job-card__title-row {
  gap: 8px;
  margin-bottom: 6px;
  color: #8896b1;
}

.board-job-card__title-row strong {
  margin: 0;
  color: #1f294a;
  font-size: 16px;
  line-height: 1.35;
}

.board-job-card__top p {
  margin: 0;
  color: #7c89a1;
  font-size: 12px;
}

.board-job-card__menu {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #93a0b5;
  background: transparent;
}

.board-job-card__menu.is-open {
  background: #f7f9fd;
  color: #4f5d78;
}

.board-job-card__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.board-pill {
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
}

.board-pill--green {
  color: #17a95d;
  background: #ecfbf3;
}

.board-pill--orange {
  color: #ef7d23;
  background: #fff4ea;
}

.board-pill--pink {
  color: #f24673;
  background: #fff0f4;
}

.board-pill--slate {
  color: #7f8ca3;
  background: #f4f7fb;
}

.board-pill--subtle {
  color: #8c98ac;
  background: #f7f9fc;
  font-weight: 600;
}

.board-score {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 5px solid currentColor;
  background: #fff;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

.board-score--green {
  color: #18b968;
}

.board-score--orange {
  color: #ff9734;
}

.board-score--pink {
  color: #ff5d82;
}

.board-score--slate {
  color: #e4ebf4;
}

.board-pipeline {
  display: grid;
  gap: 12px;
  padding-top: 4px;
}

.board-pipeline__labels,
.board-pipeline__segments,
.board-pipeline__values {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 5px;
}

.board-pipeline__labels span {
  display: block;
  color: #a0acc0;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-align: center;
  text-transform: uppercase;
  white-space: normal;
  overflow-wrap: anywhere;
}

.board-pipeline__segments {
  gap: 5px;
}

.board-pipeline__segment {
  height: 4px;
  border-radius: 999px;
}

.board-pipeline__segment.is-empty {
  background: #eef2f7;
}

.board-pipeline__segment.tone-blue {
  background: #4b84f5;
}

.board-pipeline__segment.tone-blue-soft {
  background: #7b74f6;
}

.board-pipeline__segment.tone-orange {
  background: #b35fff;
}

.board-pipeline__segment.tone-orange-soft {
  background: #ff9e34;
}

.board-pipeline__segment.tone-green {
  background: #25c46e;
}

.board-pipeline__values span {
  display: block;
  color: #1d2748;
  font-size: 14px;
  font-weight: 800;
  text-align: center;
}

.board-job-card__footer {
  padding-top: 16px;
  border-top: 1px solid #edf1f7;
  align-items: flex-start;
}

.board-job-card__meta {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.board-job-card__meta--left {
  justify-items: start;
}

.board-job-card__meta--right {
  justify-items: end;
  text-align: right;
}

.board-job-card__meta-line {
  gap: 6px;
}

.board-job-card__meta-line strong {
  color: #1f294a;
  font-size: 13px;
}

.board-job-card__meta span {
  color: #8a97ac;
  font-size: 11px;
  line-height: 1.35;
}

.board-job-card__meta-line.is-green {
  color: #16ab5e;
}

.board-job-card__meta-line.is-orange {
  color: #ff8d2e;
}

.board-job-card__meta-line.is-pink {
  color: #ff5d82;
}

.board-job-card__meta-line.is-slate {
  color: #9aa6bb;
}

.board-job-card__avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(145deg, #0f172a, #2680eb);
  font-size: 9px;
  font-weight: 800;
}

.board-job-card__days {
  color: #98a4b9;
  font-size: 11px;
}

.brief-view {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.brief-card {
  padding: 18px;
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  gap: 16px;
  cursor: pointer;
}

.brief-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.brief-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #8e9bb0;
}

.brief-card__title-row strong {
  display: block;
  margin: 0;
  color: #1f294a;
  font-size: 15px;
  line-height: 1.35;
}

.brief-card__location {
  color: #7d8aa1;
  font-size: 12px;
}

.brief-card__menu {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #93a0b5;
  background: transparent;
}

.brief-card__menu.is-open {
  background: #f7f9fd;
  color: #4f5d78;
}

.brief-card__summary,
.brief-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.brief-card__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.brief-score {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 4px solid currentColor;
  background: #fff;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}

.brief-pipeline {
  display: grid;
  gap: 10px;
}

.brief-pipeline__segments,
.brief-pipeline__values {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.brief-pipeline__segment {
  height: 4px;
  border-radius: 999px;
}

.brief-pipeline__segment.is-empty {
  background: #eef2f7;
}

.brief-pipeline__segment.tone-blue {
  background: #4b84f5;
}

.brief-pipeline__segment.tone-blue-soft {
  background: #7b74f6;
}

.brief-pipeline__segment.tone-orange {
  background: #b35fff;
}

.brief-pipeline__segment.tone-orange-soft {
  background: #ff9e34;
}

.brief-pipeline__segment.tone-green {
  background: #25c46e;
}

.brief-pipeline__values span {
  color: #1d2748;
  font-size: 13px;
  font-weight: 800;
}

.brief-card__meta {
  padding-top: 14px;
  border-top: 1px solid #edf1f7;
  align-items: flex-start;
}

.brief-card__meta-block {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.brief-card__meta-block strong {
  color: #1f294a;
  font-size: 12px;
}

.brief-card__meta-block span {
  color: #8a97ac;
  font-size: 11px;
  line-height: 1.35;
}

.brief-card__meta-block--right {
  text-align: right;
}

.brief-card__days {
  color: #98a4b9;
  font-size: 11px;
}

.analytics-view {
  display: grid;
  gap: 12px;
}

.analytics-row {
  padding: 14px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
}

.side-panel h3 {
  margin: 0;
  color: #20284c;
  font-size: 14px;
}

.side-panel__head {
  margin-bottom: 12px;
}

.side-panel__head button {
  border: 0;
  background: transparent;
  color: #f24193;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.attention-card {
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #edf1f7;
}

.attention-card + .attention-card {
  margin-top: 10px;
}

.attention-card__icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  flex-shrink: 0;
}

.attention-card__body {
  flex: 1;
}

.attention-card__body strong {
  display: block;
  margin-bottom: 2px;
  font-size: 12px;
}

.attention-card__days {
  text-align: right;
}

.attention-card__days strong {
  display: block;
  color: #17213f;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.1;
}

.attention-card__days span {
  color: #8a97ac;
  font-size: 10px;
  text-transform: uppercase;
}

.health-panel {
  margin: 14px 0 18px;
}

.health-panel__copy span,
.health-panel__copy small {
  color: #8491a6;
  font-size: 11px;
}

.health-panel__copy strong {
  display: block;
  margin: 8px 0 6px;
  color: #1fb55a;
  font-size: 18px;
}

.health-chart {
  height: 72px;
}

.health-chart svg {
  width: 100%;
  height: 100%;
}

.health-chart path {
  stroke: #edf1f7;
  stroke-width: 1;
}

.health-chart polyline {
  fill: none;
  stroke: #24b85f;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.quick-filters {
  display: grid;
  gap: 10px;
  margin: 16px 0;
}

.quick-filter {
  min-height: 42px;
  padding: 0 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #34415f;
  font-size: 12px;
}

.quick-filter strong {
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #3a465d;
  background: #fff;
  border: 1px solid #edf1f7;
  font-size: 11px;
}

.view-filters {
  width: 100%;
  justify-content: center;
  color: #f24193;
}

.tone-pink {
  color: #ff4d9d;
  background: #fff1f8;
}

.tone-violet {
  color: #8b52ff;
  background: #f5efff;
}

.tone-orange {
  color: #ff9130;
  background: #fff4e9;
}

.tone-blue {
  color: #498df7;
  background: #edf4ff;
}

.tone-blue-soft {
  color: #7eaef8;
  background: #f3f7ff;
}

.tone-green {
  color: #1db863;
  background: #ebfaef;
}

.tone-slate {
  color: #a8b3c4;
  background: #f4f6fa;
}

.row-menu {
  position: fixed;
  z-index: 80;
  width: 228px;
  max-height: calc(100vh - 24px);
  padding: 10px 0;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.14);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d5ddeb transparent;
}

.row-menu__section + .row-menu__section {
  border-top: 1px solid #edf1f7;
}

.row-menu__section {
  padding: 8px 0;
}

.row-menu__title {
  display: block;
  padding: 0 18px 8px;
  color: #6f7d94;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.row-menu__item {
  width: 100%;
  padding: 9px 18px;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #253354;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
}

.row-menu__item:hover {
  background: #f8fbff;
}

.row-menu__icon {
  color: #63728d;
  flex-shrink: 0;
}

.row-menu__icon.is-pink {
  color: #f24193;
}

.review-candidates-action-menu {
  position: fixed;
  z-index: 110;
  width: 274px;
  padding: 6px 0;
  border: 1px solid #e6edf7;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.review-candidates-action-menu__item {
  width: 100%;
  min-height: 50px;
  padding: 0 18px;
  border: 0;
  border-top: 1px solid #edf2f8;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #31405d;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}

.review-candidates-action-menu__item:first-child {
  border-top: 0;
}

.review-candidates-action-menu__item:hover {
  background: #f8fbff;
}

.review-candidates-action-menu__icon {
  color: #8ea1bf;
}

.review-candidates-email-layer {
  position: fixed;
  inset: 0;
  z-index: 118;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

.review-candidates-email-modal {
  width: min(1220px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  border: 1px solid #e8edf5;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 32px 72px rgba(15, 23, 42, 0.34);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.review-candidates-email-modal__head,
.review-candidates-email-modal__title-wrap,
.review-candidates-email-profile,
.review-candidates-email-profile__main,
.review-candidates-email-profile__meta,
.review-candidates-email-field__head,
.review-candidates-email-editor__toolbar,
.review-candidates-email-editor__tools,
.review-candidates-email-attachments,
.review-candidates-email-option,
.review-candidates-email-side__notice,
.review-candidates-email-panel__head,
.review-candidates-email-modal__footer,
.review-candidates-email-modal__footer-actions {
  display: flex;
  align-items: center;
}

.review-candidates-email-modal__head,
.review-candidates-email-profile,
.review-candidates-email-editor__toolbar,
.review-candidates-email-panel__head,
.review-candidates-email-modal__footer {
  justify-content: space-between;
}

.review-candidates-email-modal__head {
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid #edf2f8;
}

.review-candidates-email-modal__title-wrap {
  gap: 12px;
}

.review-candidates-email-modal__title-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #ef5da8;
  background: #fff1f7;
}

.review-candidates-email-modal__title-wrap h2 {
  margin: 0;
  color: #1f2b45;
  font-size: 16px;
  font-weight: 800;
}

.review-candidates-email-modal__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  background: transparent;
}

.review-candidates-email-modal__body {
  min-height: 0;
  padding: 20px 22px 18px;
  overflow-y: auto;
  display: grid;
  gap: 16px;
}

.review-candidates-email-profile {
  gap: 18px;
  padding: 16px 18px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
}

.review-candidates-email-profile__main {
  min-width: 0;
  gap: 14px;
}

.review-candidates-email-profile__avatar {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

.review-candidates-email-profile__avatar.tone-violet {
  background: linear-gradient(135deg, #5f50f6 0%, #8f7cf8 100%);
}

.review-candidates-email-profile__avatar.tone-green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.review-candidates-email-profile__avatar.tone-sand {
  background: linear-gradient(135deg, #c69b6d 0%, #8f6b46 100%);
}

.review-candidates-email-profile__avatar.tone-brown {
  background: linear-gradient(135deg, #584134 0%, #9c7453 100%);
}

.review-candidates-email-profile__avatar.tone-rose {
  background: linear-gradient(135deg, #9f4d65 0%, #ec7ea6 100%);
}

.review-candidates-email-profile__copy {
  min-width: 0;
}

.review-candidates-email-profile__copy strong,
.review-candidates-email-profile__meta strong {
  display: block;
  color: #1f2b45;
  font-size: 14px;
  font-weight: 800;
}

.review-candidates-email-profile__copy span,
.review-candidates-email-profile__copy small,
.review-candidates-email-profile__meta small {
  display: block;
  margin-top: 4px;
  color: #6f7d94;
  font-size: 11px;
}

.review-candidates-email-profile__copy small {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.review-candidates-email-profile__meta {
  margin-left: auto;
  gap: 22px;
}

.review-candidates-email-profile__meta > div {
  min-width: 88px;
}

.review-candidates-email-profile__stage {
  display: inline-flex;
  margin-top: 8px;
  padding: 5px 10px;
  border-radius: 999px;
  color: #ef5da8;
  background: #fff1f7;
  font-size: 10px;
  font-weight: 700;
}

.review-candidates-email-profile__meta button {
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid #dfe6f2;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #1f2b45;
  background: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
}

.review-candidates-email-layout {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 28px;
}

.review-candidates-email-compose,
.review-candidates-email-side {
  min-width: 0;
  display: grid;
  gap: 14px;
  align-content: start;
}

.review-candidates-email-compose__template-row {
  max-width: 154px;
}

.review-candidates-email-template-trigger,
.review-candidates-email-field :deep(.app-select-trigger) {
  min-height: 44px;
  font-size: 13px;
}

.review-candidates-email-template-trigger {
  width: 100%;
  padding: 0 16px;
  border: 1px solid #dfe7f3;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #253354;
  background: #fff;
  font: inherit;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.review-candidates-email-template-trigger :deep(svg) {
  color: #9aa8bc;
  flex-shrink: 0;
}

.review-candidates-email-field,
.review-candidates-email-editor,
.review-candidates-email-panel {
  display: grid;
  gap: 10px;
}

.review-candidates-email-field__head span,
.review-candidates-email-panel strong {
  color: #1f2b45;
  font-size: 12px;
  font-weight: 700;
}

.review-candidates-email-field__head {
  justify-content: space-between;
  gap: 12px;
}

.review-candidates-email-field__head small {
  color: #ef5da8;
  font-size: 10px;
  font-weight: 700;
}

.review-candidates-email-field__links {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.review-candidates-email-field__links small {
  letter-spacing: 0.04em;
}

.review-candidates-email-field input,
.review-candidates-email-editor textarea {
  width: 100%;
  border: 1px solid #dfe7f3;
  border-radius: 10px;
  color: #334155;
  background: #fff;
  font: inherit;
  font-size: 13px;
}

.review-candidates-email-field input {
  min-height: 40px;
  padding: 0 14px;
}

.review-candidates-email-editor {
  border: 1px solid #dfe7f3;
  border-radius: 12px;
  overflow: hidden;
}

.review-candidates-email-editor > .review-candidates-email-field__head {
  padding: 12px 14px 0;
}

.review-candidates-email-editor__toolbar {
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #edf2f8;
}

.review-candidates-email-editor__tools {
  gap: 6px;
  flex-wrap: wrap;
}

.review-candidates-email-editor__tools button,
.review-candidates-email-editor__insert,
.review-candidates-email-variables button {
  font: inherit;
}

.review-candidates-email-editor__tools button {
  min-height: 28px;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  color: #475569;
  background: transparent;
  font-size: 11px;
}

.review-candidates-email-editor__tools button:first-child {
  padding: 0 10px;
  border: 1px solid #e3e9f2;
  background: #fff;
}

.review-candidates-email-editor__insert {
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid #e3e9f2;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #34425e;
  background: #fff;
  font-size: 11px;
  font-weight: 600;
}

.review-candidates-email-editor textarea {
  min-height: 300px;
  padding: 16px;
  border: 0;
  border-radius: 0;
  resize: vertical;
  line-height: 1.75;
  outline: none;
}

.review-candidates-email-editor__footer {
  padding: 0 14px 12px;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: right;
}

.review-candidates-email-attachments {
  display: grid;
  gap: 8px;
}

.review-candidates-email-attachments span {
  color: #6f7d94;
  font-size: 12px;
  font-weight: 700;
}

.review-candidates-email-attachments__bar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
}

.review-candidates-email-attachments__cancel,
.review-candidates-email-attachments__upload {
  min-height: 38px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
}

.review-candidates-email-attachments__cancel {
  padding: 0 16px;
  border: 1px solid #dfe7f3;
  color: #475569;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
}

.review-candidates-email-attachments__upload {
  padding: 0 16px;
  border: 1px dashed #f4bfd8;
  gap: 8px;
  color: #ef5da8;
  background: #fff8fc;
  justify-content: center;
}

.review-candidates-email-attachments__upload strong,
.review-candidates-email-attachments__upload small {
  font-size: 12px;
  font-weight: 700;
}

.review-candidates-email-attachments__upload small {
  color: #9aa8bc;
  font-weight: 500;
}

.review-candidates-email-panel {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.review-candidates-email-option {
  align-items: flex-start;
  gap: 12px;
}

.review-candidates-email-option + .review-candidates-email-option {
  margin-top: 10px;
}

.review-candidates-email-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.review-candidates-email-option > span {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  border: 1px solid #d7deea;
  border-radius: 999px;
  display: inline-block;
  background: #fff;
  box-shadow: inset 0 0 0 4px transparent;
  flex-shrink: 0;
}

.review-candidates-email-option input:checked + span {
  border-color: #ef5da8;
  background: #ef5da8;
  box-shadow: inset 0 0 0 4px #fff;
}

.review-candidates-email-option b {
  display: block;
  color: #1f2b45;
  font-size: 13px;
}

.review-candidates-email-option small,
.review-candidates-email-side__notice span,
.review-candidates-email-side__notice small {
  display: block;
  margin-top: 4px;
  color: #6f7d94;
  font-size: 12px;
}

.review-candidates-email-side__fields {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.review-candidates-email-side__notice {
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1px solid #ffdce9;
  border-radius: 12px;
  color: #ef5da8;
  background: #fff7fb;
}

.review-candidates-email-side__notice strong {
  display: block;
  margin-top: 6px;
  color: #ef5da8;
  font-size: 14px;
  font-weight: 800;
}

.review-candidates-email-variables {
  display: grid;
  gap: 8px;
}

.review-candidates-email-variables button {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  color: #5b677d;
  background: #f8faff;
  text-align: left;
  font-size: 12px;
}

.review-candidates-email-modal__footer {
  justify-content: flex-end;
  gap: 16px;
  padding: 8px 24px 18px;
}

.review-candidates-email-modal__footer-actions {
  gap: 12px;
}

.review-candidates-email-modal__secondary,
.review-candidates-email-modal__ghost,
.review-candidates-email-modal__primary {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
}

.review-candidates-email-modal__secondary,
.review-candidates-email-modal__ghost {
  border: 1px solid #dfe7f3;
  color: #334155;
  background: #fff;
}

.review-candidates-email-modal__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.18);
}

.review-candidates-template-layer {
  position: fixed;
  inset: 0;
  z-index: 125;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

.review-candidates-template-modal {
  width: min(1020px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  border: 1px solid #e7edf6;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 32px 72px rgba(15, 23, 42, 0.32);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.review-candidates-template-modal__head,
.review-candidates-template-modal__footer,
.review-candidates-template-search,
.review-candidates-template-categories,
.review-candidates-template-card,
.review-candidates-template-preview__meta,
.review-candidates-template-preview__chips {
  display: flex;
  align-items: center;
}

.review-candidates-template-modal__head,
.review-candidates-template-modal__footer {
  justify-content: space-between;
  gap: 16px;
  padding: 24px 32px;
}

.review-candidates-template-modal__head {
  border-bottom: 1px solid #edf2f8;
}

.review-candidates-template-modal__head h2 {
  margin: 0;
  color: #1f2b45;
  font-size: 20px;
  font-weight: 800;
}

.review-candidates-template-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  background: transparent;
}

.review-candidates-template-modal__body {
  min-height: 0;
  padding: 28px 32px;
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  gap: 32px;
  overflow: auto;
}

.review-candidates-template-browser,
.review-candidates-template-preview {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 20px;
}

.review-candidates-template-search {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dfe7f3;
  border-radius: 10px;
  gap: 10px;
  color: #9aa8bc;
  background: #fff;
}

.review-candidates-template-search input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #334155;
  background: transparent;
  font: inherit;
  font-size: 13px;
}

.review-candidates-template-group {
  display: grid;
  gap: 12px;
}

.review-candidates-template-group > span,
.review-candidates-template-preview > span {
  color: #7f8ca2;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.review-candidates-template-categories {
  gap: 8px;
  flex-wrap: wrap;
}

.review-candidates-template-categories button {
  min-height: 36px;
  padding: 0 16px;
  border: 1px solid #dfe7f3;
  border-radius: 10px;
  color: #475569;
  background: #fff;
  font: inherit;
  font-size: 13px;
}

.review-candidates-template-categories button.is-active {
  border-color: #ef5da8;
  color: #fff;
  background: #ef5da8;
}

.review-candidates-template-list {
  display: grid;
  gap: 14px;
}

.review-candidates-template-card {
  width: 100%;
  padding: 16px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
  gap: 14px;
  color: inherit;
  background: #fff;
  text-align: left;
}

.review-candidates-template-card.is-active {
  border-color: #ef5da8;
  box-shadow: inset 0 0 0 1px #ef5da8;
}

.review-candidates-template-card__radio {
  width: 18px;
  height: 18px;
  border: 1px solid #d7deea;
  border-radius: 999px;
  display: inline-block;
  background: #fff;
  box-shadow: inset 0 0 0 4px transparent;
  flex-shrink: 0;
}

.review-candidates-template-card.is-active .review-candidates-template-card__radio {
  border-color: #ef5da8;
  background: #ef5da8;
  box-shadow: inset 0 0 0 4px #fff;
}

.review-candidates-template-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
}

.review-candidates-template-card__copy {
  display: grid;
  gap: 5px;
}

.review-candidates-template-card__copy strong {
  color: #1f2b45;
  font-size: 14px;
  font-weight: 800;
}

.review-candidates-template-card__copy small,
.review-candidates-template-preview__meta small {
  color: #6f7d94;
  font-size: 12px;
  line-height: 1.5;
}

.review-candidates-template-card__copy em {
  color: #5b5cf0;
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
  text-transform: uppercase;
}

.review-candidates-template-preview__card {
  padding: 22px 24px;
  border: 1px solid #e7edf6;
  border-radius: 18px;
  display: grid;
  gap: 22px;
  background: #fff;
}

.review-candidates-template-preview__subject {
  display: grid;
  gap: 10px;
}

.review-candidates-template-preview__card > strong,
.review-candidates-template-preview__subject strong {
  color: #1f2b45;
  font-size: 13px;
}

.review-candidates-template-preview__subject input,
.review-candidates-template-preview__body textarea {
  width: 100%;
  border: 1px solid #dfe7f3;
  border-radius: 10px;
  color: #334155;
  background: #fff;
  font: inherit;
  font-size: 14px;
}

.review-candidates-template-preview__subject input {
  min-height: 42px;
  padding: 0 14px;
}

.review-candidates-template-preview__body {
  padding: 18px 0;
  border-top: 1px solid #edf2f8;
  border-bottom: 1px solid #edf2f8;
}

.review-candidates-template-preview__body textarea {
  min-height: 360px;
  padding: 16px;
  border-color: #e7edf6;
  resize: vertical;
  line-height: 1.75;
  outline: none;
}

.review-candidates-template-preview__meta {
  align-items: flex-start;
  gap: 28px;
}

.review-candidates-template-preview__meta > div {
  flex: 1;
  display: grid;
  gap: 10px;
}

.review-candidates-template-preview__meta span {
  color: #7f8ca2;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.review-candidates-template-preview__meta small {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-candidates-template-preview__chips {
  gap: 8px;
  flex-wrap: wrap;
}

.review-candidates-template-preview__chips small {
  color: #8a97ac;
  font-size: 12px;
}

.review-candidates-template-preview__chips i {
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  color: #55657d;
  background: #fbfcff;
  font-size: 12px;
  font-style: normal;
}

.review-candidates-template-modal__footer {
  justify-content: flex-end;
  border-top: 1px solid #edf2f8;
}

.review-candidates-template-modal__secondary,
.review-candidates-template-modal__primary {
  min-height: 42px;
  padding: 0 22px;
  border-radius: 12px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
}

.review-candidates-template-modal__secondary {
  border: 1px solid #dfe7f3;
  color: #34425e;
  background: #fff;
}

.review-candidates-template-modal__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

.review-candidates-note-layer {
  position: fixed;
  inset: 0;
  z-index: 128;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

.review-candidates-note-modal {
  width: min(820px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  border: 1px solid #e7edf6;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 32px 72px rgba(15, 23, 42, 0.32);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.review-candidates-note-modal__head,
.review-candidates-note-modal__title-wrap,
.review-candidates-note-grid,
.review-candidates-note-editor__toolbar,
.review-candidates-note-editor__tools,
.review-candidates-note-tags,
.review-candidates-note-tags__items,
.review-candidates-note-reminder,
.review-candidates-note-followup,
.review-candidates-note-modal__footer {
  display: flex;
  align-items: center;
}

.review-candidates-note-modal__head,
.review-candidates-note-modal__footer {
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px;
}

.review-candidates-note-modal__head {
  border-bottom: 1px solid #edf2f8;
}

.review-candidates-note-modal__title-wrap {
  gap: 14px;
}

.review-candidates-note-modal__title-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #ef5da8;
  background: #fff1f7;
}

.review-candidates-note-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1f2b45;
  font-size: 18px;
  font-weight: 800;
}

.review-candidates-note-modal__title-wrap p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
}

.review-candidates-note-modal__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  background: transparent;
}

.review-candidates-note-modal__body {
  min-height: 0;
  padding: 24px;
  overflow-y: auto;
  display: grid;
  gap: 18px;
}

.review-candidates-note-grid {
  align-items: flex-start;
  gap: 18px;
}

.review-candidates-note-grid > * {
  flex: 1;
}

.review-candidates-note-field {
  display: grid;
  gap: 10px;
}

.review-candidates-note-field > span {
  color: #1f2b45;
  font-size: 13px;
  font-weight: 700;
}

.review-candidates-note-field > span em {
  color: #ef5da8;
  font-style: normal;
}

.review-candidates-note-field > span small,
.review-candidates-note-field > small,
.review-candidates-note-field__stack small,
.review-candidates-note-followup small {
  color: #9aa8bc;
  font-size: 12px;
  font-weight: 500;
}

.review-candidates-note-field__candidate,
.review-candidates-note-tags,
.review-candidates-note-reminder input {
  border: 1px solid #dfe7f3;
  border-radius: 14px;
  background: #fff;
}

.review-candidates-note-field__candidate {
  min-height: 58px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font: inherit;
  text-align: left;
}

.review-candidates-note-field__candidate-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-candidates-note-field__avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}

.review-candidates-note-field__avatar.tone-violet { background: linear-gradient(135deg, #5f50f6 0%, #8f7cf8 100%); }
.review-candidates-note-field__avatar.tone-green { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.review-candidates-note-field__avatar.tone-sand { background: linear-gradient(135deg, #c69b6d 0%, #8f6b46 100%); }
.review-candidates-note-field__avatar.tone-brown { background: linear-gradient(135deg, #584134 0%, #9c7453 100%); }
.review-candidates-note-field__avatar.tone-rose { background: linear-gradient(135deg, #9f4d65 0%, #ec7ea6 100%); }

.review-candidates-note-field__candidate strong {
  display: block;
  color: #1f2b45;
  font-size: 14px;
  font-weight: 800;
}

.review-candidates-note-field__candidate small {
  display: block;
  margin-top: 4px;
  color: #6f7d94;
  font-size: 12px;
}

.review-candidates-note-field__stack {
  display: grid;
  gap: 8px;
}

.review-candidates-note-field__stack :deep(.app-select-trigger),
.review-candidates-note-reminder :deep(.app-select-trigger) {
  min-height: 58px;
  border-radius: 14px;
  font-size: 14px;
}

.review-candidates-note-editor {
  border: 1px solid #dfe7f3;
  border-radius: 14px;
  overflow: hidden;
}

.review-candidates-note-editor__toolbar {
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid #edf2f8;
}

.review-candidates-note-editor__tools {
  gap: 8px;
  flex-wrap: wrap;
}

.review-candidates-note-editor__tools button,
.review-candidates-note-editor__toolbar > button {
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid #edf2f8;
  border-radius: 9px;
  color: #475569;
  background: #fff;
  font: inherit;
  font-size: 12px;
}

.review-candidates-note-editor textarea {
  width: 100%;
  min-height: 210px;
  padding: 16px;
  border: 0;
  color: #334155;
  background: #fff;
  font: inherit;
  font-size: 14px;
  line-height: 1.75;
  resize: vertical;
  outline: none;
}

.review-candidates-note-editor__footer {
  padding: 0 14px 14px;
  color: #9aa8bc;
  font-size: 12px;
  text-align: right;
}

.review-candidates-note-tags {
  min-height: 44px;
  padding: 8px 12px;
  justify-content: space-between;
  gap: 12px;
}

.review-candidates-note-tags__items {
  gap: 8px;
  flex-wrap: wrap;
}

.review-candidates-note-tags__chip {
  min-height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ef5da8;
  background: #fff1f7;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
}

.review-candidates-note-tags__toggle {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  background: transparent;
  flex-shrink: 0;
}

.review-candidates-note-reminder {
  gap: 8px;
}

.review-candidates-note-reminder input {
  min-height: 44px;
  padding: 0 14px;
  color: #334155;
  font: inherit;
  font-size: 14px;
  outline: none;
  flex: 1;
}

.review-candidates-note-reminder :deep(.app-select) {
  width: 130px;
  flex: 0 0 130px;
}

.review-candidates-note-followup {
  gap: 12px;
  padding: 16px 14px;
  border: 1px dashed #dfe7f3;
  border-radius: 14px;
}

.review-candidates-note-followup input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.review-candidates-note-followup > span {
  width: 20px;
  height: 20px;
  border: 1px solid #d7deea;
  border-radius: 7px;
  display: inline-grid;
  place-items: center;
  color: transparent;
  background: #fff;
  flex-shrink: 0;
}

.review-candidates-note-followup input:checked + span {
  border-color: #ef5da8;
  color: #fff;
  background: #ef5da8;
}

.review-candidates-note-followup strong {
  display: block;
  color: #1f2b45;
  font-size: 14px;
  font-weight: 800;
}

.review-candidates-note-followup small {
  display: block;
  margin-top: 4px;
}

.review-candidates-note-modal__footer {
  border-top: 1px solid #edf2f8;
}

.review-candidates-note-modal__secondary,
.review-candidates-note-modal__primary {
  min-height: 42px;
  padding: 0 22px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
}

.review-candidates-note-modal__secondary {
  border: 1px solid #dfe7f3;
  color: #34425e;
  background: #fff;
}

.review-candidates-note-modal__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

.review-candidates-talent-layer {
  position: fixed;
  inset: 0;
  z-index: 130;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

.review-candidates-talent-modal {
  width: min(800px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  border: 1px solid #e7edf6;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 32px 72px rgba(15, 23, 42, 0.32);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.review-candidates-talent-modal__head,
.review-candidates-talent-modal__title-wrap,
.review-candidates-talent-summary,
.review-candidates-talent-summary__profile,
.review-candidates-talent-summary__name-row,
.review-candidates-talent-grid,
.review-candidates-talent-suggestions button,
.review-candidates-talent-reasons,
.review-candidates-talent-reasons button,
.review-candidates-talent-tags,
.review-candidates-talent-bottom,
.review-candidates-talent-toggle,
.review-candidates-talent-reminder,
.review-candidates-talent-visibility label,
.review-candidates-talent-modal__footer {
  display: flex;
  align-items: center;
}

.review-candidates-talent-modal__head,
.review-candidates-talent-modal__footer {
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px;
}

.review-candidates-talent-modal__head {
  border-bottom: 1px solid #edf2f8;
}

.review-candidates-talent-modal__title-wrap {
  gap: 14px;
}

.review-candidates-talent-modal__title-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #ef5da8;
  background: #fff1f7;
}

.review-candidates-talent-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1f2b45;
  font-size: 18px;
  font-weight: 800;
}

.review-candidates-talent-modal__title-wrap p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
}

.review-candidates-talent-modal__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  background: transparent;
}

.review-candidates-talent-modal__body {
  min-height: 0;
  padding: 24px;
  overflow-y: auto;
  display: grid;
  gap: 18px;
}

.review-candidates-talent-summary {
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
  border: 1px solid #e8edf8;
  border-radius: 18px;
  background: #f8faff;
}

.review-candidates-talent-summary__profile {
  gap: 14px;
}

.review-candidates-talent-summary__avatar {
  width: 58px;
  height: 58px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  flex-shrink: 0;
}

.review-candidates-talent-summary__avatar.tone-violet { background: linear-gradient(135deg, #5f50f6 0%, #8f7cf8 100%); }
.review-candidates-talent-summary__avatar.tone-green { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.review-candidates-talent-summary__avatar.tone-sand { background: linear-gradient(135deg, #c69b6d 0%, #8f6b46 100%); }
.review-candidates-talent-summary__avatar.tone-brown { background: linear-gradient(135deg, #584134 0%, #9c7453 100%); }
.review-candidates-talent-summary__avatar.tone-rose { background: linear-gradient(135deg, #9f4d65 0%, #ec7ea6 100%); }

.review-candidates-talent-summary__name-row {
  gap: 10px;
  margin-bottom: 4px;
}

.review-candidates-talent-summary__name-row strong {
  color: #1f2b45;
  font-size: 15px;
  font-weight: 800;
}

.review-candidates-talent-summary__name-row span {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #ef5da8;
  background: #fff1f7;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.review-candidates-talent-summary p {
  margin: 0 0 4px;
  color: #475569;
  font-size: 14px;
}

.review-candidates-talent-summary small {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #55657d;
  font-size: 12px;
  flex-wrap: wrap;
}

.review-candidates-talent-summary small i {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-style: normal;
}

.review-candidates-talent-summary__score {
  min-width: 120px;
  text-align: right;
}

.review-candidates-talent-summary__score span {
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.review-candidates-talent-summary__score strong {
  display: block;
  margin: 6px 0 10px;
  color: #10b981;
  font-size: 18px;
  font-weight: 800;
}

.review-candidates-talent-summary__score div {
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  background: #d8f3e8;
}

.review-candidates-talent-summary__score div i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.review-candidates-talent-grid,
.review-candidates-talent-bottom {
  align-items: flex-start;
  gap: 18px;
}

.review-candidates-talent-grid > *,
.review-candidates-talent-bottom > * {
  flex: 1;
}

.review-candidates-talent-field {
  display: grid;
  gap: 10px;
}

.review-candidates-talent-field > span {
  color: #1f2b45;
  font-size: 13px;
  font-weight: 700;
}

.review-candidates-talent-field > span em {
  color: #ef5da8;
  font-style: normal;
}

.review-candidates-talent-field > span i {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 4px;
  color: #94a3b8;
}

.review-candidates-talent-field :deep(.app-select-trigger),
.review-candidates-talent-reminder :deep(.app-select-trigger) {
  min-height: 46px;
  border-radius: 14px;
  font-size: 14px;
}

.review-candidates-talent-field__link {
  width: fit-content;
  border: 0;
  padding: 0;
  color: #ef5da8;
  background: transparent;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
}

.review-candidates-talent-suggestions {
  display: grid;
  gap: 12px;
}

.review-candidates-talent-suggestions button {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid #e7edf6;
  border-radius: 14px;
  justify-content: space-between;
  gap: 12px;
  background: #f5f8ff;
  font: inherit;
}

.review-candidates-talent-suggestions button > div {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #334155;
}

.review-candidates-talent-suggestions button > div strong {
  font-size: 14px;
}

.review-candidates-talent-suggestions button small {
  font-size: 13px;
  font-weight: 800;
}

.review-candidates-talent-suggestions button small.tone-green {
  color: #10b981;
}

.review-candidates-talent-suggestions button small.tone-pink {
  color: #ef5da8;
}

.review-candidates-talent-reasons {
  gap: 8px;
  flex-wrap: wrap;
}

.review-candidates-talent-reasons button {
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #efc4d6;
  border-radius: 14px;
  gap: 10px;
  color: #1f2b45;
  background: #fff;
  font: inherit;
  font-size: 13px;
}

.review-candidates-talent-reasons button i,
.review-candidates-talent-visibility label i {
  width: 16px;
  height: 16px;
  border: 1px solid #d7deea;
  border-radius: 999px;
  display: inline-block;
  box-shadow: inset 0 0 0 4px transparent;
  background: #fff;
  flex-shrink: 0;
}

.review-candidates-talent-reasons button.is-active {
  border-color: #ef5da8;
  color: #ef5da8;
}

.review-candidates-talent-reasons button.is-active i,
.review-candidates-talent-visibility label input:checked + i {
  border-color: #ef5da8;
  background: #ef5da8;
  box-shadow: inset 0 0 0 4px #fff;
}

.review-candidates-talent-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.review-candidates-talent-tags__chip {
  min-height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #5f6a82;
  background: #e9efff;
  font: inherit;
  font-size: 12px;
}

.review-candidates-talent-tags__add {
  min-height: 30px;
  padding: 0 12px;
  border: 1px dashed #ef8fbc;
  border-radius: 10px;
  color: #ef5da8;
  background: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
}

.review-candidates-talent-note {
  border: 1px solid #efc4d6;
  border-radius: 14px;
  overflow: hidden;
}

.review-candidates-talent-note textarea {
  width: 100%;
  min-height: 96px;
  padding: 16px;
  border: 0;
  color: #334155;
  background: #fff;
  font: inherit;
  font-size: 14px;
  line-height: 1.7;
  resize: vertical;
  outline: none;
}

.review-candidates-talent-note small {
  display: block;
  padding: 0 14px 12px;
  color: #9aa8bc;
  font-size: 12px;
  text-align: right;
}

.review-candidates-talent-toggle {
  gap: 10px;
}

.review-candidates-talent-toggle input,
.review-candidates-talent-visibility label input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.review-candidates-talent-toggle span {
  width: 22px;
  height: 22px;
  border: 1px solid #d7deea;
  border-radius: 7px;
  display: inline-grid;
  place-items: center;
  color: transparent;
  background: #fff;
  flex-shrink: 0;
}

.review-candidates-talent-toggle input:checked + span {
  border-color: #ef5da8;
  color: #fff;
  background: #ef5da8;
}

.review-candidates-talent-toggle strong,
.review-candidates-talent-visibility label strong {
  color: #1f2b45;
  font-size: 14px;
  font-weight: 800;
}

.review-candidates-talent-reminder {
  gap: 8px;
  margin-top: 10px;
}

.review-candidates-talent-reminder input {
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #dfe7f3;
  border-radius: 14px;
  color: #334155;
  background: #eef3ff;
  font: inherit;
  font-size: 14px;
  outline: none;
  flex: 1;
}

.review-candidates-talent-reminder :deep(.app-select) {
  width: 150px;
  flex: 0 0 150px;
}

.review-candidates-talent-visibility {
  display: grid;
  gap: 14px;
  margin-top: 8px;
}

.review-candidates-talent-visibility label {
  align-items: flex-start;
  gap: 10px;
}

.review-candidates-talent-visibility label small {
  display: block;
  margin-top: 4px;
  color: #6f7d94;
  font-size: 12px;
}

.review-candidates-talent-modal__footer {
  justify-content: flex-end;
  border-top: 1px solid #edf2f8;
}

.review-candidates-talent-modal__secondary,
.review-candidates-talent-modal__primary {
  min-height: 42px;
  padding: 0 22px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
}

.review-candidates-talent-modal__secondary {
  border: 0;
  color: #34425e;
  background: transparent;
}

.review-candidates-talent-modal__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

.review-candidates-talent-success-layer {
  position: fixed;
  inset: 0;
  z-index: 132;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
}

.review-candidates-talent-success-modal {
  width: min(540px, calc(100vw - 32px));
  border: 1px solid #e7edf6;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 32px 72px rgba(15, 23, 42, 0.32);
  position: relative;
  overflow: hidden;
}

.review-candidates-talent-success-modal__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  background: transparent;
}

.review-candidates-talent-success-modal__hero {
  padding: 28px 32px 22px;
  text-align: center;
  position: relative;
}

.review-candidates-talent-success-modal__hero .dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 999px;
}

.review-candidates-talent-success-modal__hero .dot.small {
  width: 5px;
  height: 5px;
}

.review-candidates-talent-success-modal__hero .dot-pink { background: #ef5da8; top: 22px; left: 34%; }
.review-candidates-talent-success-modal__hero .dot-green { background: #10b981; top: 16px; right: 38%; }
.review-candidates-talent-success-modal__hero .dot-violet { background: #8b5cf6; top: 40px; right: 35%; transform: rotate(45deg); border-radius: 2px; }
.review-candidates-talent-success-modal__hero .dot-blue { background: #60a5fa; top: 76px; right: 30%; }
.review-candidates-talent-success-modal__hero .dot-yellow { background: #fbbf24; top: 92px; left: 30%; transform: rotate(45deg); border-radius: 2px; }
.review-candidates-talent-success-modal__hero .dot.small.dot-pink { top: 102px; left: 38%; }

.review-candidates-talent-success-modal__badge {
  width: 78px;
  height: 78px;
  margin: 10px auto 22px;
  border: 4px solid #22c55e;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #22c55e;
}

.review-candidates-talent-success-modal__hero h2 {
  margin: 0 0 10px;
  color: #1f2b45;
  font-size: 22px;
  font-weight: 800;
}

.review-candidates-talent-success-modal__hero p {
  margin: 0 auto;
  max-width: 340px;
  color: #55657d;
  font-size: 15px;
  line-height: 1.65;
}

.review-candidates-talent-success-modal__hero p strong {
  color: #ef5da8;
}

.review-candidates-talent-success-modal__body {
  padding: 0 32px 22px;
  display: grid;
  gap: 0;
}

.review-candidates-talent-success-modal__item {
  padding: 18px 0;
  border-top: 1px solid #edf2f8;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 14px;
}

.review-candidates-talent-success-modal__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
}

.review-candidates-talent-success-modal__icon.tone-green {
  color: #10b981;
  background: #ecfbf3;
}

.review-candidates-talent-success-modal__icon.tone-violet {
  color: #5b5cf0;
  background: #eef0ff;
}

.review-candidates-talent-success-modal__icon.tone-blue {
  color: #3b82f6;
  background: #edf4ff;
}

.review-candidates-talent-success-modal__item small {
  display: block;
  margin-bottom: 6px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.review-candidates-talent-success-modal__item strong {
  color: #1f2b45;
  font-size: 14px;
  font-weight: 800;
}

.review-candidates-talent-success-modal__item p {
  margin: 6px 0 0;
  color: #6f7d94;
  font-size: 12px;
}

.review-candidates-talent-success-modal__chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.review-candidates-talent-success-modal__chips i {
  min-height: 26px;
  padding: 0 10px;
  border: 1px solid #dfe7f3;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  color: #5f6a82;
  background: #f8faff;
  font-size: 12px;
  font-style: normal;
}

.review-candidates-talent-success-modal__footer {
  padding: 12px 32px 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.review-candidates-talent-success-modal__secondary,
.review-candidates-talent-success-modal__primary {
  min-height: 50px;
  border-radius: 12px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
}

.review-candidates-talent-success-modal__secondary {
  border: 1px solid #dfe7f3;
  color: #34425e;
  background: #fff;
}

.review-candidates-talent-success-modal__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

.review-modal-layer {
  position: fixed;
  inset: 0;
  z-index: 88;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(242, 245, 251, 0.88);
  backdrop-filter: blur(4px);
}

.review-modal {
  width: min(900px, 100%);
  max-height: calc(100vh - 64px);
  padding: 28px 32px 30px;
  border: 1px solid #edf1f8;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
  display: grid;
  gap: 22px;
  overflow-y: auto;
}

.review-modal__head,
.review-modal__footer,
.review-modal__footer-actions,
.review-row,
.review-row__candidate,
.review-row__actions,
.review-modal__title-wrap,
.review-summary__card {
  display: flex;
  align-items: center;
}

.review-modal__head,
.review-modal__footer,
.review-row {
  justify-content: space-between;
  gap: 18px;
}

.review-modal__title-wrap,
.review-row__candidate,
.review-summary__card {
  gap: 14px;
}

.review-modal__footer-actions {
  gap: 12px;
  margin-left: auto;
}

.review-modal__title-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4d9d;
  background: #fff0f7;
}

.review-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.review-modal__title-wrap p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
}

.review-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a0abc0;
  background: transparent;
}

.review-summary,
.review-list {
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: #fff;
  overflow: hidden;
}

.review-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.review-summary__card {
  min-width: 0;
  padding: 24px 20px;
}

.review-summary__card + .review-summary__card {
  border-left: 1px solid #edf1f8;
}

.review-summary__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.review-summary__copy {
  display: grid;
  gap: 4px;
}

.review-summary__copy strong {
  color: #1b2647;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}

.review-summary__copy span {
  color: #6f7d94;
  font-size: 12px;
  line-height: 1.4;
}

.review-row {
  padding: 22px 20px;
}

.review-row + .review-row {
  border-top: 1px solid #edf1f8;
}

.review-row__avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  flex-shrink: 0;
}

.review-row__copy,
.review-row__missing {
  display: grid;
  gap: 4px;
}

.review-row__copy strong,
.review-row__missing strong {
  color: #1b2647;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.3;
}

.review-row__copy span,
.review-row__missing span,
.review-row__copy small,
.review-row__missing small {
  color: #8a97ac;
  font-size: 12px;
  line-height: 1.4;
}

.review-row__copy small {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
}

.review-row__missing {
  min-width: 200px;
}

.review-row__actions {
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.review-row__badge {
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
}

.review-row__badge--orange {
  color: #ef7d23;
  background: #fff4ea;
}

.review-row__badge--violet {
  color: #8b52ff;
  background: #f5efff;
}

.review-row__badge--green {
  color: #18b863;
  background: #ebfaef;
}

.review-row__button,
.review-modal__ghost,
.review-modal__primary {
  height: 40px;
  padding: 0 18px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}

.review-row__button,
.review-modal__ghost {
  border: 1px solid #e3eaf5;
  color: #34425e;
  background: #fff;
}

.review-modal__ghost--accent {
  border-color: #ffc7df;
  color: #f24193;
}

.review-row__button {
  color: #f24193;
}

.review-modal__primary {
  min-width: 180px;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.complete-feedback-layer {
  position: fixed;
  inset: 0;
  z-index: 90;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(242, 245, 251, 0.92);
  backdrop-filter: blur(5px);
}

.complete-feedback-modal {
  width: min(736px, 100%);
  max-height: calc(100vh - 64px);
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
  display: grid;
  gap: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.complete-feedback-modal__head,
.complete-feedback-modal__title-wrap,
.complete-feedback-modal__meta,
.complete-feedback-options,
.complete-feedback-rating-row,
.complete-feedback-rating-row > div:first-child,
.complete-feedback-stars,
.complete-feedback-modal__footer,
.complete-feedback-modal__footer-actions {
  display: flex;
  align-items: center;
}

.complete-feedback-modal__head,
.complete-feedback-modal__footer {
  justify-content: space-between;
  gap: 18px;
}

.complete-feedback-modal__head {
  padding: 22px 32px 18px;
}

.complete-feedback-modal__title-wrap {
  gap: 14px;
}

.complete-feedback-modal__title-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4d9d;
  background: #fff0f7;
}

.complete-feedback-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 19px;
  font-weight: 800;
}

.complete-feedback-modal__title-wrap p {
  margin: 0;
  color: #6f7d94;
  font-size: 12px;
}

.complete-feedback-modal__title-wrap p span {
  margin: 0 6px;
}

.complete-feedback-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a0abc0;
  background: transparent;
}

.complete-feedback-modal__meta {
  gap: 12px;
  flex-wrap: wrap;
  padding: 0 32px 14px;
  border-bottom: 1px solid #edf1f8;
}

.complete-feedback-modal__pill,
.complete-feedback-modal__chip {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
}

.complete-feedback-modal__pill.is-pink {
  color: #f24193;
  background: #fff0f7;
}

.complete-feedback-modal__chip {
  color: #4f5f79;
  background: #f4f7fb;
}

.complete-feedback-section {
  padding: 24px 32px 0;
}

.complete-feedback-section h3 {
  margin: 0 0 16px;
  color: #1b2647;
  font-size: 13px;
  font-weight: 800;
}

.complete-feedback-options {
  gap: 12px;
}

.complete-feedback-option {
  flex: 1;
  min-height: 142px;
  border: 1px solid #e3eaf5;
  border-radius: 14px;
  background: #fff;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 12px;
  color: #9aa5b8;
  font: inherit;
  padding: 10px 8px;
}

.complete-feedback-option strong {
  color: #4f5f79;
  font-size: 12px;
  font-weight: 600;
}

.complete-feedback-option i {
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 999px;
}

.complete-feedback-option.is-active {
  border-color: #ff6cb3;
  background: #fff5fa;
  color: #f24193;
  box-shadow: inset 0 0 0 1px rgba(242, 65, 147, 0.12);
}

.complete-feedback-option.is-active strong {
  color: #f24193;
}

.complete-feedback-option.is-active i {
  border-color: #f24193;
  box-shadow: inset 0 0 0 5px #f24193;
}

.complete-feedback-ratings {
  border-top: 1px solid #edf1f8;
}

.complete-feedback-rating-row {
  justify-content: space-between;
  gap: 18px;
  padding: 14px 0;
  border-bottom: 1px solid #edf1f8;
}

.complete-feedback-rating-row > div:first-child {
  gap: 6px;
  color: #97a3b6;
}

.complete-feedback-rating-row strong {
  color: #33415d;
  font-size: 12px;
  font-weight: 700;
}

.complete-feedback-stars {
  gap: 4px;
}

.complete-feedback-star {
  border: 0;
  background: transparent;
  padding: 0;
  color: #d7dfe9;
  font-size: 22px;
  line-height: 1;
}

.complete-feedback-star.is-active {
  color: #f26aad;
}

.complete-feedback-notes {
  position: relative;
}

.complete-feedback-notes textarea {
  width: 100%;
  min-height: 112px;
  resize: none;
  padding: 14px 16px 34px;
  border: 1px solid #dde5f0;
  border-radius: 14px;
  outline: none;
  color: #4e5d78;
  font: inherit;
  font-size: 12px;
  background: #fff;
}

.complete-feedback-notes textarea::placeholder {
  color: #a0abbd;
}

.complete-feedback-notes small {
  position: absolute;
  right: 16px;
  bottom: 14px;
  color: #97a3b6;
  font-size: 11px;
}

.complete-feedback-modal__footer {
  padding: 22px 32px;
  margin-top: 24px;
  border-top: 1px solid #edf1f8;
}

.complete-feedback-modal__footer-actions {
  gap: 14px;
  margin-left: auto;
}

.complete-feedback-modal__secondary,
.complete-feedback-modal__primary {
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  font: inherit;
}

.complete-feedback-modal__secondary {
  border: 1px solid #dfe6f1;
  color: #34425e;
  background: #fff;
}

.complete-feedback-modal__primary {
  min-width: 250px;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.feedback-success-layer {
  position: fixed;
  inset: 0;
  z-index: 91;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(149, 159, 176, 0.88);
  backdrop-filter: blur(4px);
}

.feedback-success-modal {
  width: min(540px, 100%);
  padding: 40px 40px 36px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.24);
  display: grid;
  justify-items: center;
  text-align: center;
}

.feedback-success-modal__icon {
  position: relative;
  width: 82px;
  height: 82px;
  margin-bottom: 22px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #f8deed;
}

.feedback-success-modal__icon::before,
.feedback-success-modal__icon::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  background: #f7c0dd;
}

.feedback-success-modal__icon::before {
  width: 10px;
  height: 10px;
  right: -4px;
  top: -4px;
}

.feedback-success-modal__icon::after {
  width: 8px;
  height: 8px;
  left: -4px;
  bottom: -4px;
  background: #c8dcff;
}

.feedback-success-modal__icon-core {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #ad347d;
}

.feedback-success-modal h2 {
  margin: 0;
  color: #1b2647;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.45;
}

.feedback-success-modal p {
  max-width: 420px;
  margin: 10px 0 0;
  color: #574854;
  font-size: 16px;
  line-height: 1.55;
}

.feedback-success-modal__actions {
  width: 100%;
  margin-top: 36px;
  display: grid;
  gap: 16px;
}

.feedback-success-modal__primary,
.feedback-success-modal__secondary {
  width: 100%;
  min-height: 48px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
}

.feedback-success-modal__primary {
  border: 0;
  color: #fff;
  background: #ea66b0;
}

.feedback-success-modal__secondary {
  border: 1px solid #d4dbe6;
  color: #1b2647;
  background: #fff;
}

.feedback-success-modal small {
  margin-top: 22px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #9a9aa5;
  font-size: 13px;
}

.review-candidates-layer {
  position: fixed;
  inset: 0;
  z-index: 92;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(10px);
}

.review-candidates-modal {
  width: min(1320px, calc(100vw - 24px));
  height: min(900px, calc(100vh - 24px));
  max-height: min(900px, calc(100vh - 24px));
  border: 1px solid #e6edf7;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.18);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.review-candidates-modal__head,
.review-candidates-modal__title-wrap,
.review-candidates-modal__summary,
.review-candidates-toolbar__filters,
.review-candidates-toolbar__bottom,
.review-candidates-toolbar__sort,
.review-candidates-footer__selection,
.review-candidates-footer__actions,
.review-candidates-side__profile,
.review-candidates-side__score > div:first-child {
  display: flex;
  align-items: center;
}

.review-candidates-modal__head {
  justify-content: space-between;
  gap: 18px;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #edf2f8;
}

.review-candidates-modal__title-wrap {
  gap: 16px;
}

.review-candidates-modal__title-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-grid;
  place-items: center;
  color: #5b5cf0;
  background: #eef0ff;
}

.review-candidates-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 21px;
  font-weight: 800;
}

.review-candidates-modal__title-wrap p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
}

.review-candidates-modal__close {
  width: 42px;
  height: 42px;
  border: 1px solid #dfe6f2;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #90a0b7;
  background: #fff;
  cursor: pointer;
}

.review-candidates-modal__summary {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  padding: 18px 28px 20px;
  border-bottom: 1px solid #edf2f8;
}

.review-candidates-stat {
  min-width: 0;
  padding: 18px 18px;
  border: 1px solid #e6edf7;
  border-radius: 18px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 12px;
  background: #fff;
}

.review-candidates-stat--insight {
  background: linear-gradient(180deg, #f6f8ff 0%, #f0f3ff 100%);
}

.review-candidates-stat__icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
}

.review-candidates-stat__icon.tone-green {
  color: #10b981;
  background: #ecfbf3;
}

.review-candidates-stat__icon.tone-blue {
  color: #4f7cff;
  background: #eef4ff;
}

.review-candidates-stat__icon.tone-violet {
  color: #8b5cf6;
  background: #f2ebff;
}

.review-candidates-stat__icon.tone-pink {
  color: #ef5da8;
  background: #fff1f7;
}

.review-candidates-stat__icon.tone-indigo {
  color: #5146e5;
  background: #e9ecff;
}

.review-candidates-stat small,
.review-candidates-side__section > span {
  display: block;
  margin-bottom: 6px;
  color: #9aa8bc;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.review-candidates-stat strong {
  color: #1f2b45;
  font-size: 18px;
  font-weight: 800;
}

.review-candidates-stat p {
  margin: 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.5;
}

.review-candidates-modal__content {
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
}

.review-candidates-layout {
  min-height: 100%;
  padding: 24px 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 28px;
  align-items: start;
}

.review-candidates-main {
  min-width: 0;
  display: grid;
  gap: 18px;
}

.review-candidates-toolbar {
  padding: 20px;
  border: 1px solid #e6edf7;
  border-radius: 20px;
  background: #fff;
  display: grid;
  gap: 16px;
}

.review-candidates-search {
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid #dfe7f3;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #9aa8bc;
  background: #fbfcff;
}

.review-candidates-search input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #334155;
  background: transparent;
  font: inherit;
  font-size: 14px;
}

.review-candidates-toolbar__bottom {
  justify-content: space-between;
  align-items: flex-end;
  gap: 18px;
}

.review-candidates-toolbar__filters button,
.review-candidates-side__quick-actions button {
  font: inherit;
}

.review-candidates-toolbar__filters {
  gap: 10px;
  flex-wrap: wrap;
}

.review-candidates-toolbar__filters button {
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid #dfe7f3;
  border-radius: 12px;
  color: #334155;
  background: #fff;
  font-size: 13px;
}

.review-candidates-toolbar__sort {
  justify-content: flex-end;
  gap: 12px;
  flex: 0 0 auto;
}

.review-candidates-toolbar__sort span {
  color: #6f7d94;
  font-size: 13px;
}

.review-candidates-toolbar__sort :deep(.app-select-trigger) {
  min-width: 168px;
  min-height: 42px;
  font-size: 13px;
}

.review-candidates-table-card {
  border: 1px solid #e6edf7;
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
}

.review-candidates-table-card__head {
  padding: 18px 22px;
  border-bottom: 1px solid #edf2f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.review-candidates-table-card__head strong,
.review-candidates-table-card__head span {
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.review-candidates-table {
  overflow-x: auto;
  overflow-y: hidden;
}

.review-candidates-table__head,
.review-candidates-row {
  padding: 0 22px;
  display: grid;
  grid-template-columns: 34px minmax(180px, 1.45fr) 72px 104px 112px 72px 92px 34px;
  gap: 10px;
  align-items: center;
}

.review-candidates-table__head {
  min-height: 50px;
  border-bottom: 1px solid #edf2f8;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.review-candidates-row {
  min-height: 94px;
  border-bottom: 1px solid #edf2f8;
  color: #445166;
  font-size: 12px;
  cursor: pointer;
  transition: background 140ms ease;
}

.review-candidates-row:last-child {
  border-bottom: 0;
}

.review-candidates-row.is-active {
  background: linear-gradient(90deg, rgba(239, 93, 168, 0.08) 0, rgba(239, 93, 168, 0.08) 4px, #fcfdff 4px, #fcfdff 100%);
}

.review-candidates-row:hover {
  background: #fbfcff;
}

.review-candidates-row__check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.review-candidates-row__check span {
  width: 22px;
  height: 22px;
  border: 1px solid #d9e1ed;
  border-radius: 7px;
  display: inline-grid;
  place-items: center;
  color: transparent;
  background: #fff;
}

.review-candidates-row__check input:checked + span {
  border-color: #ef5da8;
  color: #fff;
  background: #ef5da8;
}

.review-candidates-row__candidate {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-candidates-row__avatar,
.review-candidates-side__avatar {
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-weight: 800;
}

.review-candidates-row__avatar {
  width: 44px;
  height: 44px;
  font-size: 13px;
}

.review-candidates-side__avatar {
  width: 58px;
  height: 58px;
  font-size: 17px;
}

.review-candidates-row__avatar.tone-violet,
.review-candidates-side__avatar.tone-violet {
  background: linear-gradient(135deg, #5f50f6 0%, #8f7cf8 100%);
}

.review-candidates-row__avatar.tone-green,
.review-candidates-side__avatar.tone-green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.review-candidates-row__avatar.tone-sand,
.review-candidates-side__avatar.tone-sand {
  background: linear-gradient(135deg, #c69b6d 0%, #8f6b46 100%);
}

.review-candidates-row__avatar.tone-brown,
.review-candidates-side__avatar.tone-brown {
  background: linear-gradient(135deg, #584134 0%, #9c7453 100%);
}

.review-candidates-row__avatar.tone-rose,
.review-candidates-side__avatar.tone-rose {
  background: linear-gradient(135deg, #9f4d65 0%, #ec7ea6 100%);
}

.review-candidates-row__candidate strong,
.review-candidates-side__profile h3 {
  display: block;
  margin: 0;
  color: #1f2b45;
  font-size: 14px;
  font-weight: 800;
}

.review-candidates-row__candidate small,
.review-candidates-side__profile p {
  display: block;
  margin-top: 4px;
  color: #6f7d94;
  font-size: 11px;
}

.review-candidates-row__candidate em {
  display: inline-flex;
  margin-top: 6px;
  color: #5b5cf0;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
}

.review-candidates-row__value {
  color: #55657d;
  font-size: 12px;
  line-height: 1.4;
}

.review-candidates-row__value.is-source {
  overflow-wrap: anywhere;
}

.review-candidates-row__match {
  width: fit-content;
  min-height: 28px;
  padding: 0 11px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  color: #10b981;
  background: #eafaf2;
  font-size: 12px;
  font-weight: 800;
}

.review-candidates-row__more {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  background: transparent;
  justify-self: end;
}

.review-candidates-row__more:hover {
  color: #64748b;
  background: #f8fbff;
}

.review-candidates-modal__footer {
  justify-content: space-between;
  gap: 16px;
  padding: 18px 28px;
  border-top: 1px solid #edf2f8;
  background: #fff;
}

.review-candidates-footer__selection {
  gap: 14px;
}

.review-candidates-footer__selection strong {
  color: #1f2b45;
  font-size: 14px;
}

.review-candidates-footer__selection button {
  border: 0;
  padding: 0;
  color: #5b5cf0;
  background: transparent;
  font: inherit;
  font-weight: 700;
}

.review-candidates-footer__actions {
  gap: 12px;
}

.review-candidates-footer__ghost,
.review-candidates-footer__danger,
.review-candidates-footer__primary {
  min-height: 46px;
  padding: 0 20px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
}

.review-candidates-footer__ghost {
  border: 1px solid #dde6f2;
  color: #34425e;
  background: #fff;
}

.review-candidates-footer__danger {
  border: 1px solid #fecdd3;
  color: #ef5da8;
  background: #fff7fb;
}

.review-candidates-footer__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.18);
}

.review-candidates-aside {
  min-width: 0;
}

.review-candidates-aside__card {
  min-width: 0;
  min-height: 0;
  padding: 22px 22px 24px;
  border: 1px solid #edf2f8;
  border-radius: 24px;
  display: grid;
  align-content: start;
  gap: 18px;
  background: #fff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
  position: sticky;
  top: 0;
}

.review-candidates-side__profile {
  gap: 14px;
}

.review-candidates-side__score {
  padding: 18px 18px 16px;
  border: 1px solid #ccefe1;
  border-radius: 18px;
  background: #f3fffa;
  display: grid;
  gap: 12px;
}

.review-candidates-side__score > div:first-child {
  justify-content: space-between;
  gap: 12px;
}

.review-candidates-side__score span {
  color: #047857;
  font-size: 12px;
  font-weight: 700;
}

.review-candidates-side__score strong {
  color: #10b981;
  font-size: 28px;
  font-weight: 800;
}

.review-candidates-side__bar {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: #d8f3e8;
}

.review-candidates-side__bar i {
  height: 100%;
  border-radius: inherit;
  display: block;
  background: linear-gradient(90deg, #ef5da8 0%, #7c3aed 100%);
}

.review-candidates-side__meta {
  display: grid;
  gap: 12px;
}

.review-candidates-side__meta span {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #55657d;
  font-size: 13px;
}

.review-candidates-side__quick-actions {
  border: 1px solid #e6edf7;
  border-radius: 16px;
  overflow: hidden;
  display: grid;
}

.review-candidates-side__quick-actions button {
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-bottom: 1px solid #edf2f8;
  color: #334155;
  background: #fff;
  text-align: left;
  font-size: 13px;
}

.review-candidates-side__quick-actions button:last-child {
  border-bottom: 0;
}

.review-candidates-side__section {
  display: grid;
  gap: 12px;
}

.review-candidates-side__section ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.review-candidates-side__section li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #445166;
  font-size: 13px;
  line-height: 1.5;
}

.review-candidates-side__section li :deep(svg) {
  color: #5b5cf0;
  flex-shrink: 0;
  margin-top: 3px;
}

.review-candidates-side__resume {
  padding: 16px;
  border: 1px solid #e6edf7;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #334155;
  background: #fff;
  font: inherit;
  text-align: left;
}

.review-candidates-side__resume strong {
  display: block;
  color: #1f2b45;
  font-size: 14px;
}

.review-candidates-side__resume small {
  display: block;
  margin-top: 4px;
  color: #6f7d94;
  font-size: 12px;
}

@media (max-width: 1260px) {
  .review-candidates-modal__summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .review-candidates-stat--insight {
    grid-column: span 3;
  }

  .review-candidates-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .review-candidates-aside__card {
    position: static;
  }
}

@media (max-width: 920px) {
  .review-candidates-layer {
    padding: 12px;
  }

  .review-candidates-modal {
    width: min(100%, calc(100vw - 8px));
    height: calc(100vh - 8px);
    max-height: calc(100vh - 8px);
    border-radius: 20px;
  }

  .review-candidates-modal__head,
  .review-candidates-modal__summary,
  .review-candidates-modal__footer {
    padding-left: 14px;
    padding-right: 14px;
  }

  .review-candidates-layout {
    padding-left: 14px;
    padding-right: 14px;
    padding-top: 14px;
    padding-bottom: 14px;
  }

  .review-candidates-modal__summary {
    grid-template-columns: 1fr;
  }

  .review-candidates-stat--insight {
    grid-column: auto;
  }

  .review-candidates-toolbar {
    padding: 16px;
  }

  .review-candidates-toolbar__bottom,
  .review-candidates-modal__footer,
  .review-candidates-footer__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .review-candidates-table__head,
  .review-candidates-row {
    grid-template-columns: 30px minmax(150px, 1.25fr) 68px 92px 102px 68px 84px 30px;
    gap: 8px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .review-candidates-table-card__head {
    padding-left: 16px;
    padding-right: 16px;
  }

  .review-candidates-footer__ghost,
  .review-candidates-footer__danger,
  .review-candidates-footer__primary {
    width: 100%;
  }
}

.send-reminder-layer {
  position: fixed;
  inset: 0;
  z-index: 89;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(242, 245, 251, 0.92);
  backdrop-filter: blur(5px);
}

.send-reminder-modal {
  width: min(900px, 100%);
  max-height: calc(100vh - 64px);
  padding: 28px 32px 30px;
  border: 1px solid #edf1f8;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
  display: grid;
  gap: 22px;
  overflow-y: auto;
}

.send-reminder-modal__head,
.send-reminder-modal__footer,
.send-reminder-section__head,
.send-reminder-row,
.send-reminder-row__person,
.send-reminder-add,
.send-reminder-add__copy,
.send-reminder-modal__title-wrap,
.send-reminder-job {
  display: flex;
  align-items: center;
}

.send-reminder-modal__head,
.send-reminder-modal__footer,
.send-reminder-section__head,
.send-reminder-row,
.send-reminder-add {
  justify-content: space-between;
  gap: 18px;
}

.send-reminder-modal__title-wrap,
.send-reminder-job,
.send-reminder-row__person,
.send-reminder-add__copy {
  gap: 14px;
}

.send-reminder-modal__title-icon,
.send-reminder-add__icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4d9d;
  background: #fff0f7;
}

.send-reminder-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.send-reminder-modal__title-wrap p,
.send-reminder-section__copy p,
.send-reminder-add__copy p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
}

.send-reminder-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a0abc0;
  background: transparent;
}

.send-reminder-job,
.send-reminder-list,
.send-reminder-add {
  border: 1px solid #edf1f8;
  border-radius: 20px;
  background: #fff;
}

.send-reminder-job {
  padding: 22px 24px;
  justify-content: flex-start;
}

.send-reminder-job__avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #f36db0, #ea58b4);
  font-size: 17px;
  font-weight: 800;
  flex-shrink: 0;
}

.send-reminder-job__copy {
  display: grid;
  gap: 6px;
}

.send-reminder-job__copy strong,
.send-reminder-section__copy h3,
.send-reminder-add__copy strong {
  margin: 0;
  color: #1b2647;
  font-size: 16px;
  font-weight: 800;
}

.send-reminder-job__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #7d8aa1;
  font-size: 12px;
}

.send-reminder-job__meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.send-reminder-job__meta em {
  color: #cad3e1;
  font-style: normal;
}

.send-reminder-job__meta small {
  color: #ff3f87;
  font-size: 12px;
  font-weight: 700;
}

.send-reminder-section__copy {
  display: grid;
  gap: 8px;
}

.send-reminder-select-all {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #1b2647;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.send-reminder-select-all input,
.send-reminder-row__toggle input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #f24193;
}

.send-reminder-list {
  overflow: hidden;
}

.send-reminder-row {
  padding: 20px 0;
  margin: 0 24px;
}

.send-reminder-row + .send-reminder-row {
  border-top: 1px solid #edf1f8;
}

.send-reminder-row__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.send-reminder-row__toggle span {
  display: none;
}

.send-reminder-row__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(145deg, #1f2937, #475569);
  font-size: 15px;
  font-weight: 800;
  flex-shrink: 0;
}

.send-reminder-row__copy,
.send-reminder-row__status {
  display: grid;
  gap: 4px;
}

.send-reminder-row__copy strong {
  color: #1b2647;
  font-size: 14px;
  font-weight: 800;
}

.send-reminder-row__copy span,
.send-reminder-row__status span {
  color: #8a97ac;
  font-size: 12px;
}

.send-reminder-row__task {
  min-width: 230px;
  display: flex;
  justify-content: center;
}

.send-reminder-task {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid currentColor;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
}

.send-reminder-task--pink {
  color: #ff3f87;
  background: #fff0f7;
}

.send-reminder-task--orange {
  color: #ef6c1a;
  background: #fff5ea;
}

.send-reminder-task--yellow {
  color: #c77a00;
  background: #fff8e7;
}

.send-reminder-row__status {
  min-width: 160px;
  text-align: right;
}

.send-reminder-row__status strong {
  font-size: 13px;
  font-weight: 800;
}

.send-reminder-row__mail {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f24193;
  background: transparent;
}

.send-reminder-add {
  padding: 24px 26px;
  border-style: dashed;
  border-color: #f5bfd7;
  background: #fffafb;
}

.send-reminder-add__button,
.send-reminder-modal__ghost,
.send-reminder-modal__primary {
  height: 48px;
  padding: 0 22px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}

.send-reminder-add__button,
.send-reminder-modal__ghost {
  border: 1px solid #e3eaf5;
  color: #34425e;
  background: #fff;
}

.send-reminder-add__button {
  color: #f24193;
  border-color: #f5bfd7;
}

.send-reminder-modal__primary {
  min-width: 220px;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.duplicate-job-layer {
  position: fixed;
  inset: 0;
  z-index: 90;
  padding: 24px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: rgba(242, 245, 251, 0.78);
  backdrop-filter: blur(8px);
  overflow-y: auto;
}

.duplicate-job-modal {
  width: min(768px, 100%);
  border: 1px solid #edf1f8;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
  display: grid;
  grid-template-rows: auto auto auto;
  overflow: hidden;
}

.duplicate-job-modal__head,
.duplicate-job-modal__footer,
.duplicate-job-modal__title-wrap,
.duplicate-job-source,
.duplicate-job-copy-card,
.duplicate-job-advanced__toggle {
  display: flex;
  align-items: center;
}

.duplicate-job-modal__head,
.duplicate-job-modal__footer,
.duplicate-job-copy-card,
.duplicate-job-advanced__toggle {
  justify-content: space-between;
}

.duplicate-job-modal__head,
.duplicate-job-modal__body,
.duplicate-job-modal__footer {
  padding-left: 32px;
  padding-right: 32px;
}

.duplicate-job-modal__head {
  padding-top: 30px;
  padding-bottom: 24px;
  border-bottom: 1px solid #edf1f8;
}

.duplicate-job-modal__body {
  padding-top: 26px;
  padding-bottom: 24px;
  display: grid;
  gap: 20px;
  overflow: visible;
}

.duplicate-job-modal__footer {
  padding-top: 24px;
  padding-bottom: 22px;
  border-top: 1px solid #edf1f8;
  justify-content: flex-end;
  gap: 12px;
}

.duplicate-job-modal__title-wrap {
  gap: 14px;
}

.duplicate-job-modal__title-icon,
.duplicate-job-source__icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4d9d;
  background: #fff0f7;
  flex-shrink: 0;
}

.duplicate-job-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.duplicate-job-modal__title-wrap p,
.duplicate-job-copy-card__copy small,
.duplicate-job-advanced__copy small {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.55;
}

.duplicate-job-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
}

.duplicate-job-source {
  gap: 16px;
  padding: 18px 16px;
  border: 1px solid #f8d8e6;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.duplicate-job-source__copy {
  display: grid;
  gap: 4px;
}

.duplicate-job-source__copy span {
  color: #ff4d9d;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.duplicate-job-source__copy strong {
  color: #1b2647;
  font-size: 16px;
  font-weight: 800;
}

.duplicate-job-source__copy small {
  margin: 0;
  color: #7a879d;
  font-size: 13px;
  line-height: 1.45;
}

.duplicate-job-source__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.duplicate-job-source__meta > span + span::before {
  content: '\2022';
  margin: 0 10px;
  color: #b3bfd3;
}

.duplicate-job-source__icon {
  border: 1px solid #f8d8e6;
  border-radius: 12px;
  color: #ff4d9d;
  background: #fff;
}

.duplicate-job-form,
.duplicate-job-advanced__body,
.duplicate-job-copy__grid {
  display: grid;
  gap: 14px 20px;
}

.duplicate-job-form,
.duplicate-job-advanced__body {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.duplicate-job-copy h3 {
  margin: 0 0 12px;
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.duplicate-job-copy__grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.duplicate-job-field {
  display: grid;
  gap: 6px;
}

.duplicate-job-field--wide {
  grid-column: span 2;
}

.duplicate-job-field > span {
  color: #1b2647;
  font-size: 14px;
  font-weight: 700;
}

.duplicate-job-field > span i {
  color: #ff4d9d;
  font-style: normal;
}

.duplicate-job-field input {
  width: 100%;
  min-height: 46px;
  padding: 0 16px;
  border: 1px solid #dbe4ef;
  border-radius: 12px;
  color: #445166;
  font-size: 14px;
  font-weight: 500;
  background: #fff;
  outline: 0;
}

.duplicate-job-field input:focus {
  border-color: #bfd2ef;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
}

.duplicate-job-field :deep(.app-select-trigger) {
  min-height: 46px;
  border-radius: 12px;
  font-size: 14px;
  color: #445166;
}

.duplicate-job-select {
  position: relative;
}

.duplicate-job-select__icon {
  position: absolute;
  top: 50%;
  left: 14px;
  z-index: 2;
  color: #ff4d9d;
  transform: translateY(-50%);
  pointer-events: none;
}

.duplicate-job-select--icon :deep(.app-select-trigger) {
  padding-left: 42px;
}

.duplicate-job-copy-card {
  min-height: 92px;
  padding: 14px;
  border: 1px solid #dde6f2;
  border-radius: 16px;
  background: #fff;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: flex-start;
}

.duplicate-job-copy-card.is-selected {
  border-color: #f5bfd7;
  box-shadow: 0 8px 18px rgba(241, 88, 173, 0.06);
}

.duplicate-job-copy-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4d9d;
  flex-shrink: 0;
}

.duplicate-job-copy-card__copy {
  min-width: 0;
  flex: 1 1 auto;
  display: grid;
  gap: 3px;
  text-align: left;
}

.duplicate-job-copy-card__copy strong,
.duplicate-job-advanced__copy strong {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.duplicate-job-copy-card__copy small {
  font-size: 12px;
  line-height: 1.45;
}

.duplicate-job-copy-card__check {
  width: 22px;
  height: 22px;
  border: 1px solid #d6deea;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  background: #fff;
  flex-shrink: 0;
}

.duplicate-job-copy-card__check.is-selected {
  border-color: #f472b6;
  color: #fff;
  background: #f472b6;
}

.duplicate-job-advanced {
  border: 1px solid #dde6f2;
  border-radius: 16px;
  overflow: hidden;
}

.duplicate-job-advanced__toggle {
  width: 100%;
  padding: 14px 16px;
  border: 0;
  background: #fff;
  color: #627189;
  text-align: left;
}

.duplicate-job-advanced__copy {
  display: grid;
  gap: 4px;
}

.duplicate-job-advanced__body {
  padding: 0 16px 16px;
}

.duplicate-job-modal__secondary,
.duplicate-job-modal__primary {
  min-height: 46px;
  padding: 0 20px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.duplicate-job-modal__secondary {
  min-width: 100px;
  border: 1px solid #dde6f2;
  color: #34425e;
  background: #fff;
}

.duplicate-job-modal__primary {
  min-width: 168px;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.duplicate-success-layer {
  position: fixed;
  inset: 0;
  z-index: 92;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(135, 144, 161, 0.44);
  backdrop-filter: blur(4px);
}

.duplicate-success-modal {
  width: min(602px, 100%);
  position: relative;
  padding: 28px 32px 30px;
  border: 1px solid #edf1f8;
  border-radius: 30px;
  display: grid;
  gap: 24px;
  background: #fff;
  box-shadow: 0 36px 80px rgba(15, 23, 42, 0.22);
}

.duplicate-success-modal__close {
  position: absolute;
  top: 22px;
  right: 22px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9aa6bb;
  background: transparent;
}

.duplicate-success-modal__hero {
  position: relative;
  padding-top: 8px;
  display: grid;
  justify-items: center;
  text-align: center;
}

.duplicate-success-modal__spark {
  position: absolute;
  color: #22c55e;
  opacity: 0.85;
  pointer-events: none;
}

.duplicate-success-modal__spark.is-one {
  top: 10px;
  left: 30%;
  font-size: 28px;
}

.duplicate-success-modal__spark.is-two {
  top: -2px;
  left: 36%;
  font-size: 16px;
}

.duplicate-success-modal__spark.is-three {
  top: 26px;
  right: 29%;
  font-size: 26px;
}

.duplicate-success-modal__spark.is-four {
  top: 118px;
  right: 34%;
  font-size: 28px;
}

.duplicate-success-modal__spark.is-five {
  top: 142px;
  left: 40%;
  font-size: 26px;
}

.duplicate-success-modal__icon {
  width: 120px;
  height: 120px;
  margin-bottom: 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.12) 58%, rgba(34, 197, 94, 0.04) 58%, rgba(34, 197, 94, 0.04) 100%);
}

.duplicate-success-modal__icon-ring {
  width: 98px;
  height: 98px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #22c55e;
  box-shadow: 0 18px 36px rgba(34, 197, 94, 0.22);
}

.duplicate-success-modal__hero h2 {
  margin: 0 0 10px;
  color: #1b2647;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}

.duplicate-success-modal__hero p,
.duplicate-success-next p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.6;
}

.duplicate-success-card {
  padding: 24px 22px 20px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  display: grid;
  gap: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.duplicate-success-card__head,
.duplicate-success-card__details,
.duplicate-success-card__row,
.duplicate-success-card__meta,
.duplicate-success-next,
.duplicate-success-actions {
  display: flex;
  align-items: center;
}

.duplicate-success-card__head {
  gap: 16px;
  align-items: flex-start;
}

.duplicate-success-card__icon {
  width: 60px;
  height: 56px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff0f7;
  flex-shrink: 0;
}

.duplicate-success-card__copy {
  display: grid;
  gap: 8px;
}

.duplicate-success-card__copy strong {
  color: #1b2647;
  font-size: 18px;
  font-weight: 800;
}

.duplicate-success-card__meta {
  flex-wrap: wrap;
  gap: 0;
}

.duplicate-success-card__meta > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6f7d94;
  font-size: 13px;
  font-weight: 500;
}

.duplicate-success-card__meta > span + span::before {
  content: '|';
  margin: 0 12px;
  color: #c3ccda;
}

.duplicate-success-card__meta :deep(svg) {
  color: #7f8aa1;
}

.duplicate-success-card__details {
  padding-top: 16px;
  border-top: 1px solid #edf1f8;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.duplicate-success-card__row {
  gap: 8px;
  flex-wrap: wrap;
}

.duplicate-success-card__row > span {
  color: #93a0b6;
  font-size: 14px;
}

.duplicate-success-card__row > strong {
  color: #1b2647;
  font-size: 14px;
  font-weight: 700;
}

.duplicate-success-card__status {
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #4f7cff;
  background: #edf3ff;
  font-size: 13px;
  font-weight: 700;
}

.duplicate-success-next {
  gap: 16px;
  padding: 18px 16px;
  border: 1px solid #d7f5df;
  border-radius: 16px;
  background: linear-gradient(180deg, #f8fff9 0%, #f5fff8 100%);
  align-items: flex-start;
}

.duplicate-success-next__icon {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
  background: #fff;
  box-shadow: 0 8px 18px rgba(34, 197, 94, 0.12);
  flex-shrink: 0;
}

.duplicate-success-next strong {
  display: block;
  margin-bottom: 4px;
  color: #17a34a;
  font-size: 14px;
  font-weight: 800;
}

.duplicate-success-next p {
  color: #31b95a;
}

.duplicate-success-actions {
  gap: 16px;
}

.duplicate-success-actions__secondary,
.duplicate-success-actions__primary {
  min-height: 56px;
  padding: 0 18px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
  flex: 1 1 0;
}

.duplicate-success-actions__secondary {
  border: 1px solid #e3eaf4;
  color: #34425e;
  background: #fff;
}

.duplicate-success-actions__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.duplicate-success-modal__dismiss {
  justify-self: center;
  border: 0;
  color: #627189;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
}

.reschedule-publication-layer {
  position: fixed;
  inset: 0;
  z-index: 92;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(135, 144, 161, 0.44);
  backdrop-filter: blur(4px);
}

.reschedule-publication-modal {
  width: min(1100px, 100%);
  max-height: calc(100vh - 48px);
  border: 1px solid #edf1f8;
  border-radius: 28px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: #fff;
  box-shadow: 0 36px 80px rgba(15, 23, 42, 0.22);
  overflow: hidden;
}

.reschedule-publication-modal__head,
.reschedule-publication-modal__body,
.reschedule-publication-modal__footer {
  padding-left: 24px;
  padding-right: 24px;
}

.reschedule-publication-modal__head,
.reschedule-publication-modal__footer,
.reschedule-publication-modal__title-wrap,
.reschedule-publication-source,
.reschedule-publication-channel__head,
.reschedule-publication-summary__item,
.reschedule-publication-summary__row {
  display: flex;
  align-items: center;
}

.reschedule-publication-modal__head,
.reschedule-publication-modal__footer,
.reschedule-publication-source,
.reschedule-publication-channel__head {
  justify-content: space-between;
}

.reschedule-publication-modal__head {
  padding-top: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf1f8;
}

.reschedule-publication-modal__title-wrap {
  gap: 14px;
}

.reschedule-publication-modal__title-icon,
.reschedule-publication-source__icon,
.reschedule-publication-summary__badge {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reschedule-publication-modal__title-icon,
.reschedule-publication-source__icon {
  color: #f05ba8;
  background: #fff0f7;
}

.reschedule-publication-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.reschedule-publication-modal__title-wrap p,
.reschedule-publication-block p,
.reschedule-publication-note span {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.55;
}

.reschedule-publication-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
}

.reschedule-publication-modal__body {
  min-height: 0;
  padding-top: 18px;
  padding-bottom: 22px;
  display: grid;
  gap: 18px;
  overflow-y: auto;
}

.reschedule-publication-source {
  gap: 16px;
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: linear-gradient(180deg, #fafcff 0%, #ffffff 100%);
}

.reschedule-publication-source__copy {
  display: grid;
  gap: 5px;
  flex: 1 1 auto;
}

.reschedule-publication-source__copy strong {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.reschedule-publication-source__copy small {
  display: flex;
  flex-wrap: wrap;
  color: #7a879d;
  font-size: 13px;
}

.reschedule-publication-source__copy small span + span::before {
  content: '•';
  margin: 0 10px;
  color: #c1cad8;
}

.reschedule-publication-source__status {
  display: grid;
  gap: 6px;
  justify-items: end;
}

.reschedule-publication-source__status label {
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #eafbf0;
  font-size: 12px;
  font-weight: 800;
}

.reschedule-publication-source__status span {
  color: #94a3b8;
  font-size: 13px;
}

.reschedule-publication-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 294px;
  gap: 28px;
  align-items: start;
}

.reschedule-publication-main {
  display: grid;
  gap: 26px;
}

.reschedule-publication-block {
  display: grid;
  gap: 12px;
}

.reschedule-publication-block h3,
.reschedule-publication-summary h3,
.reschedule-publication-summary h4 {
  margin: 0;
  color: #1b2647;
  font-weight: 800;
}

.reschedule-publication-block h3 {
  font-size: 15px;
}

.reschedule-publication-input {
  min-height: 50px;
  padding: 0 12px 0 42px;
  border: 1px solid #dde6f2;
  border-radius: 14px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
}

.reschedule-publication-input__icon {
  position: absolute;
  top: 50%;
  left: 14px;
  color: #94a3b8;
  transform: translateY(-50%);
}

.reschedule-publication-input input {
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  color: #34425e;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  outline: 0;
}

.reschedule-publication-input button {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
  flex-shrink: 0;
}

.reschedule-publication-channels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.reschedule-publication-channel {
  padding: 14px 14px 12px;
  border: 1px solid #dde6f2;
  border-radius: 16px;
  display: grid;
  gap: 8px;
  background: #fff;
}

.reschedule-publication-channel__head {
  gap: 10px;
}

.reschedule-publication-channel__icon {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff0f7;
}

.reschedule-publication-channel__head > span {
  color: #1b2647;
  font-size: 14px;
  font-weight: 700;
}

.reschedule-publication-channel input,
.reschedule-publication-visibility input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #f35ba7;
}

.reschedule-publication-channel small {
  color: #16a34a;
  font-size: 12px;
  font-weight: 700;
}

.reschedule-publication-channel small::before {
  content: '';
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  display: inline-block;
  background: #22c55e;
}

.reschedule-publication-visibility {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1b2647;
  font-size: 14px;
  font-weight: 700;
}

.reschedule-publication-visibility :deep(svg) {
  color: #94a3b8;
}

.reschedule-publication-note {
  min-height: 56px;
  padding: 0 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4f46e5;
  background: #eef2ff;
}

.reschedule-publication-summary {
  padding: 24px 20px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  display: grid;
  gap: 18px;
  background: #fff;
}

.reschedule-publication-summary h3 {
  font-size: 15px;
}

.reschedule-publication-summary__item {
  align-items: flex-start;
  gap: 12px;
}

.reschedule-publication-summary__badge.is-pink {
  color: #f05ba8;
  background: #fff0f7;
}

.reschedule-publication-summary__badge.is-green {
  color: #22c55e;
  background: #ecfdf3;
}

.reschedule-publication-summary__item div {
  display: grid;
  gap: 4px;
}

.reschedule-publication-summary__item label {
  color: #7a879d;
  font-size: 13px;
}

.reschedule-publication-summary__item strong {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.reschedule-publication-summary__item small {
  width: fit-content;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
  background: #fff4eb;
  font-size: 11px;
  font-weight: 800;
}

.reschedule-publication-summary__item small.is-green {
  color: #16a34a;
  background: #ecfdf3;
}

.reschedule-publication-summary__divider {
  height: 1px;
  background: #edf1f8;
}

.reschedule-publication-summary h4 {
  font-size: 13px;
}

.reschedule-publication-summary__what {
  display: grid;
  gap: 12px;
}

.reschedule-publication-summary__what ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.reschedule-publication-summary__what li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #5f6d84;
  font-size: 13px;
  line-height: 1.55;
}

.reschedule-publication-summary__what li :deep(svg) {
  color: #22c55e;
  margin-top: 2px;
  flex-shrink: 0;
}

.reschedule-publication-modal__footer {
  padding-top: 18px;
  padding-bottom: 22px;
  border-top: 1px solid #edf1f8;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.reschedule-publication-modal__secondary,
.reschedule-publication-modal__primary {
  min-height: 46px;
  padding: 0 20px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.reschedule-publication-modal__secondary {
  min-width: 116px;
  border: 1px solid #dde6f2;
  color: #34425e;
  background: #fff;
}

.reschedule-publication-modal__primary {
  min-width: 198px;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.reschedule-success-layer {
  position: fixed;
  inset: 0;
  z-index: 93;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(135, 144, 161, 0.44);
  backdrop-filter: blur(4px);
}

.reschedule-success-modal {
  width: min(770px, 100%);
  max-height: calc(100vh - 48px);
  position: relative;
  padding: 30px 46px 34px;
  border: 1px solid #edf1f8;
  border-radius: 30px;
  display: grid;
  gap: 24px;
  background: #fff;
  box-shadow: 0 36px 80px rgba(15, 23, 42, 0.22);
  overflow-y: auto;
}

.reschedule-success-modal__close {
  position: absolute;
  top: 22px;
  right: 22px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9aa6bb;
  background: transparent;
}

.reschedule-success-modal__hero {
  position: relative;
  padding-top: 8px;
  display: grid;
  justify-items: center;
  text-align: center;
}

.reschedule-success-modal__spark {
  position: absolute;
  color: #7dd3b0;
  opacity: 0.9;
  pointer-events: none;
}

.reschedule-success-modal__spark.is-one {
  top: 18px;
  left: 36%;
  font-size: 24px;
}

.reschedule-success-modal__spark.is-two {
  top: -4px;
  left: 42%;
  font-size: 16px;
}

.reschedule-success-modal__spark.is-three {
  top: 36px;
  left: 39%;
  font-size: 24px;
}

.reschedule-success-modal__spark.is-four {
  top: 8px;
  right: 39%;
  font-size: 24px;
}

.reschedule-success-modal__spark.is-five {
  top: 82px;
  right: 40%;
  font-size: 16px;
}

.reschedule-success-modal__icon {
  width: 112px;
  height: 112px;
  margin-bottom: 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(34, 197, 94, 0.18) 0%, rgba(34, 197, 94, 0.18) 52%, rgba(34, 197, 94, 0.04) 52%, rgba(34, 197, 94, 0.04) 100%);
}

.reschedule-success-modal__icon-ring {
  width: 80px;
  height: 80px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  background: #d8f7e4;
}

.reschedule-success-modal__hero h2 {
  margin: 0 0 8px;
  color: #182033;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}

.reschedule-success-modal__hero p,
.reschedule-success-timeline__step p,
.reschedule-success-note p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.6;
}

.reschedule-success-job,
.reschedule-success-timeline,
.reschedule-success-channels {
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: #fff;
}

.reschedule-success-job {
  padding: 20px 22px;
}

.reschedule-success-job__head,
.reschedule-success-job__copy small,
.reschedule-success-actions,
.reschedule-success-channel,
.reschedule-success-note {
  display: flex;
  align-items: center;
}

.reschedule-success-job__head {
  gap: 16px;
}

.reschedule-success-job__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff0f7;
  flex-shrink: 0;
}

.reschedule-success-job__copy {
  display: grid;
  gap: 6px;
  flex: 1 1 auto;
}

.reschedule-success-job__copy strong {
  color: #1b2647;
  font-size: 17px;
  font-weight: 800;
}

.reschedule-success-job__copy small {
  flex-wrap: wrap;
  color: #7a879d;
  font-size: 13px;
}

.reschedule-success-job__copy small span + span::before {
  content: '•';
  margin: 0 10px;
  color: #c1cad8;
}

.reschedule-success-job__status {
  display: grid;
  gap: 6px;
  justify-items: end;
}

.reschedule-success-job__status label {
  min-height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #eafbf0;
  font-size: 11px;
  font-weight: 800;
}

.reschedule-success-job__status span {
  color: #94a3b8;
  font-size: 13px;
}

.reschedule-success-timeline {
  padding: 26px 26px 22px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1fr) 120px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.reschedule-success-timeline__step {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 8px;
}

.reschedule-success-timeline__badge {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.reschedule-success-timeline__badge.is-pink {
  color: #f05ba8;
  background: #fff0f7;
}

.reschedule-success-timeline__badge.is-slate {
  color: #64748b;
  background: #eef2f7;
}

.reschedule-success-timeline__badge.is-green {
  color: #22c55e;
  background: #ecfdf3;
}

.reschedule-success-timeline__step label {
  color: #6f7d94;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.reschedule-success-timeline__step strong {
  color: #1b2647;
  font-size: 17px;
  font-weight: 800;
}

.reschedule-success-timeline__step small {
  min-height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
  background: #fff4eb;
  font-size: 11px;
  font-weight: 800;
}

.reschedule-success-timeline__step small.is-green {
  color: #16a34a;
  background: #ecfdf3;
}

.reschedule-success-timeline__line {
  align-self: start;
  margin-top: 70px;
  height: 2px;
  border-radius: 999px;
  background: repeating-linear-gradient(90deg, #dbe4ef 0 8px, transparent 8px 14px);
}

.reschedule-success-channels {
  padding: 20px;
  display: grid;
  gap: 16px;
}

.reschedule-success-channels h3 {
  margin: 0;
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.reschedule-success-channels__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.reschedule-success-channel {
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
}

.reschedule-success-channel__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff0f7;
  flex-shrink: 0;
}

.reschedule-success-channel__copy {
  display: grid;
  gap: 3px;
}

.reschedule-success-channel__copy strong {
  color: #1b2647;
  font-size: 14px;
  font-weight: 700;
}

.reschedule-success-channel__copy small {
  color: #16a34a;
  font-size: 12px;
  font-weight: 700;
}

.reschedule-success-channel__copy small::before {
  content: '•';
  margin-right: 5px;
}

.reschedule-success-note {
  gap: 12px;
  padding: 18px 20px;
  border-radius: 16px;
  color: #1d4ed8;
  background: #eaf2ff;
  align-items: flex-start;
}

.reschedule-success-note :deep(svg) {
  flex-shrink: 0;
  margin-top: 2px;
}

.reschedule-success-note strong {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}

.reschedule-success-actions {
  justify-content: flex-end;
  gap: 16px;
}

.reschedule-success-actions__secondary,
.reschedule-success-actions__primary {
  min-width: 154px;
  min-height: 46px;
  padding: 0 22px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.reschedule-success-actions__secondary {
  border: 1px solid #dde6f2;
  color: #34425e;
  background: #fff;
}

.reschedule-success-actions__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.pause-job-layer {
  position: fixed;
  inset: 0;
  z-index: 93;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(135, 144, 161, 0.44);
  backdrop-filter: blur(4px);
}

.pause-job-modal {
  width: min(704px, 100%);
  max-height: calc(100vh - 48px);
  border: 1px solid #edf1f8;
  border-radius: 26px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: #fff;
  box-shadow: 0 36px 80px rgba(15, 23, 42, 0.22);
  overflow: hidden;
}

.pause-job-modal__head,
.pause-job-modal__body,
.pause-job-modal__footer {
  padding-left: 24px;
  padding-right: 24px;
}

.pause-job-modal__head,
.pause-job-modal__footer,
.pause-job-modal__title-wrap,
.pause-job-source,
.pause-job-source__title,
.pause-job-checkbox,
.pause-job-note__head {
  display: flex;
  align-items: center;
}

.pause-job-modal__head,
.pause-job-modal__footer,
.pause-job-source {
  justify-content: space-between;
}

.pause-job-modal__head {
  padding-top: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf1f8;
}

.pause-job-modal__title-wrap {
  gap: 14px;
}

.pause-job-modal__title-icon,
.pause-job-source__icon,
.pause-job-reason__icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pause-job-modal__title-icon,
.pause-job-source__icon,
.pause-job-reason__icon {
  color: #f05ba8;
  background: #fff0f7;
}

.pause-job-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.pause-job-modal__title-wrap p,
.pause-job-section p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.55;
}

.pause-job-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
}

.pause-job-modal__body {
  min-height: 0;
  padding-top: 18px;
  padding-bottom: 22px;
  display: grid;
  gap: 22px;
  overflow-y: auto;
}

.pause-job-source {
  gap: 16px;
  padding: 18px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: linear-gradient(180deg, #fafcff 0%, #ffffff 100%);
}

.pause-job-source__copy {
  display: grid;
  gap: 6px;
  flex: 1 1 auto;
}

.pause-job-source__title {
  gap: 10px;
}

.pause-job-source__title strong,
.pause-job-source__meta strong {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.pause-job-source__title label {
  min-height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #eafbf0;
  font-size: 11px;
  font-weight: 800;
}

.pause-job-source__copy small {
  display: flex;
  flex-wrap: wrap;
  color: #7a879d;
  font-size: 13px;
}

.pause-job-source__copy small span + span::before {
  content: '•';
  margin: 0 10px;
  color: #c1cad8;
}

.pause-job-section {
  display: grid;
  gap: 14px;
}

.pause-job-section h3 {
  margin: 0;
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.pause-job-section h3 span {
  color: #94a3b8;
}

.pause-job-reasons {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.pause-job-reason {
  min-height: 84px;
  padding: 14px 12px;
  border: 1px solid #dde6f2;
  border-radius: 16px;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: #34425e;
  background: #fff;
  text-align: center;
}

.pause-job-reason.is-selected {
  border-color: #f472b6;
  box-shadow: inset 0 0 0 1px #f472b6;
}

.pause-job-reason span:last-child {
  font-size: 13px;
  font-weight: 700;
}

.pause-job-section--resume {
  gap: 12px;
}

.pause-job-checkbox {
  gap: 12px;
  color: #1b2647;
  font-size: 16px;
  font-weight: 800;
}

.pause-job-checkbox input,
.pause-job-date input {
  accent-color: #f35ba7;
}

.pause-job-checkbox input {
  width: 20px;
  height: 20px;
  margin: 0;
}

.pause-job-date {
  display: grid;
  gap: 10px;
}

.pause-job-date > span {
  color: #34425e;
  font-size: 13px;
  font-weight: 700;
}

.pause-job-date__field {
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid #dde6f2;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
  background: #fff;
}

.pause-job-date__field.is-disabled {
  background: #f8fbff;
}

.pause-job-date__icon {
  color: #94a3b8;
}

.pause-job-date__field input {
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  color: #34425e;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  outline: 0;
}

.pause-job-date__field input:disabled {
  color: #94a3b8;
}

.pause-job-note {
  padding: 18px 16px;
  border: 1px solid #d9e9ff;
  border-radius: 16px;
  display: grid;
  gap: 12px;
  background: #f5f9ff;
}

.pause-job-note__head {
  gap: 10px;
  color: #1b2647;
}

.pause-job-note__head :deep(svg) {
  color: #2563eb;
}

.pause-job-note__head strong {
  font-size: 15px;
}

.pause-job-note ul {
  margin: 0;
  padding: 0 0 0 38px;
  list-style: none;
  display: grid;
  gap: 10px;
}

.pause-job-note li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4e5d76;
  font-size: 14px;
}

.pause-job-note li :deep(svg) {
  color: #22c55e;
  flex-shrink: 0;
}

.pause-job-modal__footer {
  padding-top: 18px;
  padding-bottom: 22px;
  border-top: 1px solid #edf1f8;
  gap: 12px;
}

.pause-job-modal__secondary,
.pause-job-modal__primary {
  min-height: 46px;
  padding: 0 20px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.pause-job-modal__secondary {
  min-width: 122px;
  border: 1px solid #dde6f2;
  color: #34425e;
  background: #fff;
}

.pause-job-modal__primary {
  min-width: 172px;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.close-job-layer {
  position: fixed;
  inset: 0;
  z-index: 94;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(135, 144, 161, 0.44);
  backdrop-filter: blur(4px);
}

.close-job-modal {
  width: min(640px, 100%);
  max-height: calc(100vh - 48px);
  border: 1px solid #edf1f8;
  border-radius: 24px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: #fff;
  box-shadow: 0 36px 80px rgba(15, 23, 42, 0.22);
  overflow: hidden;
}

.close-job-modal__head,
.close-job-modal__body,
.close-job-modal__footer {
  padding-left: 24px;
  padding-right: 24px;
}

.close-job-modal__head,
.close-job-modal__footer,
.close-job-modal__title-wrap,
.close-job-source,
.close-job-info,
.close-job-info__copy,
.close-job-option {
  display: flex;
  align-items: center;
}

.close-job-modal__head,
.close-job-modal__footer,
.close-job-info,
.close-job-option {
  justify-content: space-between;
}

.close-job-modal__head {
  padding-top: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf1f8;
}

.close-job-modal__title-wrap {
  gap: 14px;
}

.close-job-modal__title-icon,
.close-job-source__icon,
.close-job-info__icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff0f7;
  flex-shrink: 0;
}

.close-job-info__icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #fff5fb;
}

.close-job-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.close-job-modal__title-wrap p,
.close-job-source__copy small,
.close-job-option__copy p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.55;
}

.close-job-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
}

.close-job-modal__body {
  min-height: 0;
  padding-top: 18px;
  padding-bottom: 22px;
  display: grid;
  gap: 18px;
  overflow-y: auto;
}

.close-job-source {
  gap: 16px;
  padding: 18px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  background: linear-gradient(180deg, #fafcff 0%, #ffffff 100%);
}

.close-job-source__copy {
  display: grid;
  gap: 6px;
  flex: 1 1 auto;
}

.close-job-source__copy strong,
.close-job-info strong,
.close-job-section h3,
.close-job-option__copy strong {
  color: #1b2647;
}

.close-job-source__copy strong {
  font-size: 15px;
  font-weight: 800;
}

.close-job-source__copy small {
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
}

.close-job-source__copy small span + span::before {
  content: '•';
  margin: 0 10px;
  color: #c1cad8;
}

.close-job-info {
  width: 100%;
  min-height: 56px;
  padding: 0 18px;
  border: 1px solid #f6d7e7;
  border-radius: 12px;
  color: #5e6b82;
  background: #fff8fc;
}

.close-job-info.is-open {
  border-color: #f2bfd8;
}

.close-job-info__copy {
  gap: 12px;
}

.close-job-info strong {
  font-size: 14px;
  font-weight: 700;
}

.close-job-info-panel {
  padding: 8px 18px 2px;
  display: grid;
  gap: 0;
}

.close-job-info-panel__menu {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 18px;
}

.close-job-info-panel li {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #55637b;
  font-size: 14px;
  line-height: 1.55;
}

.close-job-info-panel__icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff5fb;
  flex-shrink: 0;
}

.close-job-section {
  display: grid;
  gap: 12px;
}

.close-job-section h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
}

.close-job-section h3 span,
.close-job-field > span em {
  color: #94a3b8;
  font-style: normal;
}

.close-job-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.close-job-option {
  min-height: 96px;
  padding: 16px;
  border: 1px solid #dde6f2;
  border-radius: 14px;
  align-items: flex-start;
  gap: 14px;
  background: #fff;
  text-align: left;
}

.close-job-option.is-selected {
  border-color: #f472b6;
  box-shadow: inset 0 0 0 1px #f472b6;
}

.close-job-option__copy {
  display: grid;
  gap: 8px;
}

.close-job-option__copy strong {
  font-size: 14px;
  font-weight: 800;
}

.close-job-option__copy p {
  font-size: 13px;
}

.close-job-option__radio {
  width: 22px;
  height: 22px;
  margin-left: auto;
  border: 1.5px solid #cdd7e5;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.close-job-option.is-selected .close-job-option__radio {
  border-color: #ef69c2;
  background: #ef69c2;
}

.close-job-option.is-selected .close-job-option__radio::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #fff;
}

.close-job-field {
  display: grid;
  gap: 10px;
}

.close-job-field > span {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.close-job-field textarea {
  min-height: 92px;
  padding: 16px;
  border: 1px solid #dde6f2;
  border-radius: 12px;
  resize: none;
  color: #34425e;
  background: #fff;
  font-size: 14px;
  line-height: 1.55;
  outline: 0;
}

.close-job-field textarea::placeholder {
  color: #9aa6bb;
}

.close-job-field small {
  justify-self: end;
  color: #9aa6bb;
  font-size: 12px;
}

.close-job-modal__footer {
  padding-top: 18px;
  padding-bottom: 22px;
  border-top: 1px solid #edf1f8;
  gap: 12px;
}

.close-job-modal__secondary,
.close-job-modal__primary {
  min-height: 42px;
  padding: 0 20px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.close-job-modal__secondary {
  min-width: 110px;
  border: 1px solid #dde6f2;
  color: #34425e;
  background: #fff;
}

.close-job-modal__primary {
  min-width: 152px;
  border: 0;
  color: #fff;
  background: #162033;
}

.archive-job-layer {
  position: fixed;
  inset: 0;
  z-index: 94;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(135, 144, 161, 0.44);
  backdrop-filter: blur(4px);
}

.archive-job-modal {
  width: min(674px, 100%);
  max-height: calc(100vh - 48px);
  border: 1px solid #edf1f8;
  border-radius: 24px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: #fff;
  box-shadow: 0 36px 80px rgba(15, 23, 42, 0.22);
  overflow: hidden;
}

.archive-job-modal__head,
.archive-job-modal__body,
.archive-job-modal__footer {
  padding-left: 24px;
  padding-right: 24px;
}

.archive-job-modal__head,
.archive-job-modal__footer,
.archive-job-modal__title-wrap,
.archive-job-source,
.archive-job-banner,
.archive-job-section__head {
  display: flex;
  align-items: center;
}

.archive-job-modal__head,
.archive-job-modal__footer,
.archive-job-banner,
.archive-job-section__head {
  justify-content: space-between;
}

.archive-job-modal__head {
  padding-top: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf1f8;
}

.archive-job-modal__title-wrap {
  gap: 14px;
}

.archive-job-modal__title-icon,
.archive-job-source__icon,
.archive-job-banner__icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff0f7;
  flex-shrink: 0;
}

.archive-job-banner__icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #fff5fb;
}

.archive-job-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.archive-job-modal__title-wrap p,
.archive-job-source__copy small,
.archive-job-banner span,
.archive-job-field textarea {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.55;
}

.archive-job-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
}

.archive-job-modal__body {
  min-height: 0;
  padding-top: 18px;
  padding-bottom: 22px;
  display: grid;
  gap: 18px;
  overflow-y: auto;
}

.archive-job-source {
  gap: 16px;
  padding: 18px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: linear-gradient(180deg, #fafcff 0%, #ffffff 100%);
}

.archive-job-source__copy {
  display: grid;
  gap: 4px;
}

.archive-job-source__copy strong,
.archive-job-section h3 {
  color: #1b2647;
}

.archive-job-source__copy strong {
  font-size: 15px;
  font-weight: 800;
}

.archive-job-source__copy small {
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
}

.archive-job-source__copy small span + span::before {
  content: '•';
  margin: 0 10px;
  color: #c1cad8;
}

.archive-job-source__copy label {
  color: #9aa6bb;
  font-size: 13px;
}

.archive-job-banner {
  gap: 14px;
  min-height: 52px;
  padding: 0 16px;
  border: 1px solid #f6d7e7;
  border-radius: 14px;
  color: #55637b;
  background: #fff8fc;
}

.archive-job-banner.is-open {
  border-color: #f2bfd8;
}

.archive-job-banner span {
  flex: 1 1 auto;
}

.archive-job-info-panel {
  padding: 4px 4px 2px;
}

.archive-job-info-panel ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 14px;
}

.archive-job-info-panel li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #55637b;
  font-size: 14px;
  line-height: 1.55;
}

.archive-job-info-panel__icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff5fb;
  flex-shrink: 0;
}

.archive-job-section {
  display: grid;
  gap: 14px;
}

.archive-job-section__head h3 {
  margin: 0;
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.archive-job-summary {
  border: 1px solid #edf1f8;
  border-radius: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  background: #fff;
}

.archive-job-summary__item {
  min-height: 118px;
  padding: 18px 14px 16px;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 8px;
  text-align: center;
}

.archive-job-summary__item + .archive-job-summary__item {
  border-left: 1px solid #edf1f8;
}

.archive-job-summary__item :deep(svg) {
  color: #f05ba8;
}

.archive-job-summary__item strong {
  color: #1b2647;
  font-size: 18px;
  font-weight: 800;
}

.archive-job-summary__item span {
  color: #7e8ba1;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.archive-job-field {
  display: grid;
  gap: 10px;
}

.archive-job-field > span {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.archive-job-field > span em {
  color: #94a3b8;
  font-style: normal;
}

.archive-job-field textarea {
  min-height: 128px;
  padding: 16px;
  border: 1px solid #dde6f2;
  border-radius: 14px;
  resize: none;
  color: #34425e;
  background: #fff;
  outline: 0;
}

.archive-job-field textarea::placeholder {
  color: #9aa6bb;
}

.archive-job-field small {
  justify-self: end;
  color: #9aa6bb;
  font-size: 12px;
}

.archive-job-modal__footer {
  padding-top: 18px;
  padding-bottom: 22px;
  border-top: 1px solid #edf1f8;
  gap: 12px;
}

.archive-job-modal__secondary,
.archive-job-modal__primary {
  min-height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.archive-job-modal__secondary {
  min-width: 120px;
  border: 1px solid #dde6f2;
  color: #34425e;
  background: #fff;
}

.archive-job-modal__primary {
  min-width: 178px;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.pause-success-layer {
  position: fixed;
  inset: 0;
  z-index: 94;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(135, 144, 161, 0.44);
  backdrop-filter: blur(4px);
}

.pause-success-modal {
  width: min(672px, 100%);
  max-height: calc(100vh - 48px);
  position: relative;
  padding: 28px 32px 30px;
  border: 1px solid #edf1f8;
  border-radius: 30px;
  display: grid;
  gap: 24px;
  background: #fff;
  box-shadow: 0 36px 80px rgba(15, 23, 42, 0.22);
  overflow-y: auto;
}

.pause-success-modal__close {
  position: absolute;
  top: 22px;
  right: 22px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9aa6bb;
  background: transparent;
}

.pause-success-modal__hero {
  position: relative;
  padding-top: 18px;
  display: grid;
  justify-items: center;
  text-align: center;
}

.pause-success-modal__dot {
  position: absolute;
  top: 60px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #fb923c;
}

.pause-success-modal__dot.is-left {
  left: 34%;
}

.pause-success-modal__dot.is-left-alt {
  left: 37%;
  width: 6px;
  height: 6px;
}

.pause-success-modal__dot.is-right {
  right: 34%;
}

.pause-success-modal__dot.is-right-alt {
  right: 37%;
  width: 6px;
  height: 6px;
}

.pause-success-modal__icon {
  width: 98px;
  height: 98px;
  margin-bottom: 20px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #ff8b2b 0%, #ff7a1a 100%);
  box-shadow: 0 18px 36px rgba(255, 122, 26, 0.24);
}

.pause-success-modal__hero h2 {
  margin: 0 0 8px;
  color: #1b2647;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}

.pause-success-modal__hero p,
.pause-success-summary__cell p,
.pause-success-note p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.6;
}

.pause-success-job,
.pause-success-summary {
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: #fff;
}

.pause-success-job {
  padding: 20px 18px;
}

.pause-success-job__head,
.pause-success-job__copy small,
.pause-success-note__head,
.pause-success-actions {
  display: flex;
  align-items: center;
}

.pause-success-job__head {
  gap: 16px;
}

.pause-success-job__icon {
  width: 58px;
  height: 52px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff0f7;
  flex-shrink: 0;
}

.pause-success-job__copy {
  display: grid;
  gap: 6px;
  flex: 1 1 auto;
}

.pause-success-job__copy strong,
.pause-success-summary__cell strong {
  color: #1b2647;
  font-size: 17px;
  font-weight: 800;
}

.pause-success-job__copy small {
  flex-wrap: wrap;
  color: #7a879d;
  font-size: 13px;
}

.pause-success-job__copy small span + span::before {
  content: '•';
  margin: 0 10px;
  color: #c1cad8;
}

.pause-success-job__status {
  min-height: 28px;
  padding: 0 12px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
  background: #fff3e8;
  font-size: 12px;
  font-weight: 800;
}

.pause-success-summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1.1fr;
  overflow: hidden;
}

.pause-success-summary__cell {
  min-height: 148px;
  padding: 22px 22px 18px;
  display: grid;
  align-content: start;
  gap: 8px;
}

.pause-success-summary__cell + .pause-success-summary__cell {
  border-left: 1px solid #edf1f8;
}

.pause-success-summary__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pause-success-summary__icon.is-pink {
  color: #f05ba8;
  background: #fff0f7;
}

.pause-success-summary__icon.is-blue {
  color: #4f7cff;
  background: #eef3ff;
}

.pause-success-summary__icon.is-green {
  color: #22c55e;
  background: #ecfdf3;
}

.pause-success-summary__cell p {
  color: #607089;
  font-size: 13px;
}

.pause-success-summary__cell small {
  width: fit-content;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
  background: #fff4eb;
  font-size: 12px;
  font-weight: 800;
}

.pause-success-note {
  padding: 20px 22px;
  border: 1px solid #cfe1ff;
  border-radius: 16px;
  display: grid;
  gap: 14px;
  background: #f4f8ff;
}

.pause-success-note__head {
  gap: 10px;
  color: #2554e4;
}

.pause-success-note__head strong {
  font-size: 15px;
}

.pause-success-note ul {
  margin: 0;
  padding: 0 0 0 28px;
  list-style: none;
  display: grid;
  gap: 10px;
}

.pause-success-note li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #42526d;
  font-size: 14px;
}

.pause-success-note li :deep(svg) {
  color: #22c55e;
  flex-shrink: 0;
}

.pause-success-actions {
  gap: 16px;
}

.pause-success-actions__secondary,
.pause-success-actions__primary {
  min-height: 50px;
  padding: 0 22px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.pause-success-actions__secondary {
  min-width: 150px;
  border: 1px solid #dde6f2;
  color: #34425e;
  background: #fff;
}

.pause-success-actions__primary {
  min-width: 176px;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
  margin-left: auto;
}

.copilot-job-layer {
  position: fixed;
  inset: 0;
  z-index: 95;
  padding: 24px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: rgba(66, 78, 102, 0.42);
  backdrop-filter: blur(6px);
  overflow-y: auto;
}

.copilot-job-modal {
  width: min(672px, 100%);
  border: 1px solid #edf1f8;
  border-radius: 24px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  max-height: calc(100vh - 48px);
  background: #fff;
  box-shadow: 0 36px 80px rgba(15, 23, 42, 0.22);
  overflow: hidden;
}

.copilot-job-modal--summary {
  width: min(900px, 100%);
}

.copilot-job-modal--thread {
  width: min(960px, 100%);
}

.copilot-job-modal__head,
.copilot-job-modal__body,
.copilot-job-modal__footer {
  padding-left: 32px;
  padding-right: 32px;
}

.copilot-job-modal__head,
.copilot-job-modal__title-wrap,
.copilot-job-card,
.copilot-job-suggestion,
.copilot-job-answer,
.copilot-job-modal__footer {
  display: flex;
  align-items: center;
}

.copilot-job-modal__head,
.copilot-job-modal__footer {
  justify-content: space-between;
}

.copilot-job-modal__head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copilot-job-modal__head {
  padding-top: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid #edf1f8;
}

.copilot-job-modal__title-wrap {
  gap: 14px;
}

.copilot-job-modal__title-icon,
.copilot-job-answer__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #f05ba8 0%, #ef69c2 100%);
  flex-shrink: 0;
}

.copilot-job-modal__title-wrap h2 {
  margin: 0 0 2px;
  color: #1b2647;
  font-size: 20px;
  font-weight: 800;
}

.copilot-job-modal__title-wrap p,
.copilot-job-card__copy small,
.copilot-job-answer p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.55;
}

.copilot-job-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
}

.copilot-job-modal__more {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
}

.copilot-job-modal__body {
  padding-top: 18px;
  padding-bottom: 20px;
  display: grid;
  gap: 18px;
  min-height: 0;
  overflow-y: auto;
}

.copilot-job-card {
  gap: 16px;
  padding: 18px 16px;
  border: 1px solid #dde6f2;
  border-radius: 14px;
  justify-content: space-between;
  background: #fbfcff;
}

.copilot-job-card__icon {
  width: 52px;
  height: 52px;
  border: 1px solid #dde6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  background: #fff;
  flex-shrink: 0;
}

.copilot-job-card__copy {
  display: grid;
  gap: 4px;
  margin-right: auto;
}

.copilot-job-card__copy strong,
.copilot-job-section h3 {
  color: #1b2647;
  font-weight: 800;
}

.copilot-job-card__copy strong {
  font-size: 16px;
}

.copilot-job-card__copy small {
  display: flex;
  flex-wrap: wrap;
}

.copilot-job-card__action,
.copilot-job-thread-banner__button,
.copilot-job-history__footer button {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dde6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #34425e;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.copilot-job-card__copy small span + span::before {
  content: '•';
  margin: 0 8px;
  color: #c3ccda;
}

.copilot-job-section {
  display: grid;
  gap: 12px;
}

.copilot-job-section h3 {
  margin: 0;
  font-size: 14px;
}

.copilot-job-input {
  min-height: 54px;
  padding: 0 8px 0 16px;
  border: 1px solid #dde6f2;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
}

.copilot-job-input input {
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  color: #34425e;
  background: transparent;
  font-size: 14px;
  outline: 0;
}

.copilot-job-input button {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #f05ba8 0%, #ef69c2 100%);
  flex-shrink: 0;
}

.copilot-job-suggestions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.copilot-job-suggestions--thread {
  gap: 12px;
}

.copilot-job-suggestion {
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid #dde6f2;
  border-radius: 12px;
  justify-content: flex-start;
  gap: 10px;
  color: #55637b;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
}

.copilot-job-suggestions--thread .copilot-job-suggestion {
  min-height: 64px;
  padding: 14px 16px;
  align-items: center;
}

.copilot-job-suggestion.is-selected {
  border-color: #f472b6;
  box-shadow: inset 0 0 0 1px #f472b6;
  color: #1b2647;
}

.copilot-job-answer {
  gap: 14px;
  padding: 18px 16px;
  border: 1px solid #dbe4ff;
  border-radius: 14px;
  align-items: flex-start;
  background: #f8faff;
}

.copilot-job-answer__icon {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #fde7f3;
  color: #f05ba8;
}

.copilot-job-asked {
  padding: 14px 16px;
  border: 1px solid #f7c8df;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
}

.copilot-job-asked__icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff0f7;
  flex-shrink: 0;
}

.copilot-job-asked strong {
  color: #1b2647;
  font-size: 14px;
  font-weight: 700;
}

.copilot-job-asked small {
  margin-left: auto;
  color: #9aa6bb;
  font-size: 12px;
}

.copilot-job-thread-banner {
  padding: 20px 18px;
  border: 1px solid #f6d7e7;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(180deg, #fff8fc 0%, #fff3f9 100%);
}

.copilot-job-thread-banner__copy {
  display: flex;
  align-items: center;
  gap: 14px;
}

.copilot-job-thread-banner__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff;
  box-shadow: 0 12px 24px rgba(240, 91, 168, 0.12);
  flex-shrink: 0;
}

.copilot-job-thread-banner__copy strong,
.copilot-job-history__head strong {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.copilot-job-thread-banner__copy p {
  margin: 4px 0 0;
  color: #7a889f;
  font-size: 14px;
}

.copilot-job-history {
  border: 1px solid #dde6f2;
  border-radius: 16px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  background: #fff;
}

.copilot-job-history__head,
.copilot-job-history__footer {
  padding: 18px 24px;
}

.copilot-job-history__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.copilot-job-history__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.copilot-job-history__title :deep(svg) {
  color: #94a3b8;
}

.copilot-job-history__head div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 13px;
}

.copilot-job-history__list {
  padding: 4px 24px 18px;
  display: grid;
  align-content: start;
  gap: 14px;
  min-height: 112px;
}

.copilot-job-history__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  color: #34425e;
  font-size: 15px;
  font-weight: 700;
}

.copilot-job-history__item :deep(svg) {
  color: #86d69c;
  flex-shrink: 0;
}

.copilot-job-history__footer {
  border-top: 1px solid #edf1f8;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: #fff;
}

.copilot-job-history__action {
  min-height: 38px;
  padding: 0 18px;
  border: 1px solid #f5d7e7;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #f05ba8;
  border-color: #f6d7e7;
  background: #fff8fc;
  font-size: 13px;
  font-weight: 700;
}

.copilot-job-summary {
  border: 1px solid #edf1f8;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.copilot-job-summary__columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.copilot-job-summary__column {
  min-height: 268px;
  padding: 18px 18px 16px;
  display: grid;
  align-content: start;
  gap: 12px;
}

.copilot-job-summary__column + .copilot-job-summary__column {
  border-left: 1px solid #edf1f8;
}

.copilot-job-summary__head {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1b2647;
}

.copilot-job-summary__head strong {
  font-size: 14px;
  font-weight: 800;
}

.copilot-job-summary__head-icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f05ba8;
  background: #fff0f7;
  flex-shrink: 0;
}

.copilot-job-summary__column p,
.copilot-job-summary__column li,
.copilot-job-summary__note span {
  margin: 0;
  color: #55637b;
  font-size: 14px;
  line-height: 1.65;
}

.copilot-job-summary__column ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.copilot-job-summary__column li {
  position: relative;
  padding-left: 14px;
}

.copilot-job-summary__column li::before {
  content: '';
  position: absolute;
  top: 9px;
  left: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #f472b6;
}

.copilot-job-summary__metrics {
  padding: 16px 18px;
  border-top: 1px solid #edf1f8;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.copilot-job-summary__metric {
  display: flex;
  align-items: center;
  gap: 12px;
}

.copilot-job-summary__metric :deep(svg) {
  width: 38px;
  height: 38px;
  padding: 10px;
  border: 1px solid #edf1f8;
  border-radius: 10px;
  color: #64748b;
  background: #fbfcff;
  box-sizing: border-box;
  flex-shrink: 0;
}

.copilot-job-summary__metric div {
  display: grid;
  gap: 4px;
}

.copilot-job-summary__metric label {
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.copilot-job-summary__metric strong {
  color: #1b2647;
  font-size: 14px;
  font-weight: 700;
}

.copilot-job-summary__note {
  padding: 12px 18px;
  border-top: 1px solid #f2ddea;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff8fc;
}

.copilot-job-summary__note :deep(svg) {
  color: #f05ba8;
  flex-shrink: 0;
}

.copilot-job-modal__footer {
  padding-top: 18px;
  padding-bottom: 20px;
  border-top: 1px solid #edf1f8;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
}

.copilot-job-modal__footer.is-summary {
  display: block;
}

.copilot-job-modal__footer.is-thread {
  display: block;
  padding-top: 16px;
  padding-bottom: 16px;
}

.copilot-job-modal__primary {
  min-width: 296px;
  min-height: 48px;
  padding: 0 20px;
  border: 0;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
  font-size: 14px;
  font-weight: 700;
}

.copilot-job-modal__secondary {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dde6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #34425e;
  background: #fff;
  font-size: 14px;
  font-weight: 700;
}

.copilot-job-modal__footer-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.copilot-job-modal__summary-actions {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.copilot-job-modal__summary-actions .copilot-job-modal__footer-actions {
  margin-left: auto;
}

.copilot-job-modal__thread-actions {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.copilot-job-modal__thread-layout {
  width: 100%;
  display: grid;
  gap: 18px;
}

.copilot-job-modal__thread-button {
  min-height: 40px;
  padding: 0 18px;
  border-radius: 12px;
  font-size: 13px;
}

.copilot-job-modal__secondary--accent {
  color: #f05ba8;
  border-color: #f6d7e7;
  background: #fff4fa;
}

.copilot-job-modal__footer small {
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.attention-overview-layer {
  position: fixed;
  inset: 0;
  z-index: 95;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

.attention-overview-modal {
  width: min(1200px, calc(100vw - 40px));
  max-height: calc(100vh - 40px);
  border: 1px solid #e8edf6;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.attention-overview-modal__head,
.attention-overview-modal__body,
.attention-overview-modal__footer {
  padding-left: 30px;
  padding-right: 30px;
}

.attention-overview-modal__head,
.attention-overview-modal__footer,
.attention-overview-modal__title-wrap,
.attention-overview-modal__head-actions,
.attention-overview-modal__title-row,
.attention-overview-card__top,
.attention-overview-card__actions,
.attention-overview-cards__footer,
.attention-overview-pagination,
.attention-overview-sidecard__head,
.attention-overview-sidecard__job,
.attention-overview-bulk button {
  display: flex;
  align-items: center;
}

.attention-overview-modal__head,
.attention-overview-modal__footer {
  justify-content: space-between;
  gap: 20px;
}

.attention-overview-modal__head {
  padding-top: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2f8;
}

.attention-overview-modal__title-wrap {
  align-items: flex-start;
  gap: 14px;
  min-width: 0;
}

.attention-overview-modal__title-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  flex: 0 0 44px;
  color: #ff7da5;
  background: linear-gradient(180deg, #fff1f6 0%, #ffe7ef 100%);
}

.attention-overview-modal__title-row {
  justify-content: flex-start;
  gap: 10px;
}

.attention-overview-modal__title-row h2 {
  margin: 0;
  color: #162447;
  font-size: 1rem;
  line-height: 1.2;
}

.attention-overview-modal__count {
  min-width: 26px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffe9f2;
  color: #f06292;
  font-size: 0.68rem;
  font-weight: 700;
}

.attention-overview-modal__title-wrap p {
  margin: 5px 0 0;
  color: #70809a;
  font-size: 0.78rem;
  line-height: 1.5;
}

.attention-overview-modal__head-actions {
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.attention-overview-modal__primary,
.attention-overview-modal__secondary,
.attention-overview-modal__close,
.attention-overview-card__primary,
.attention-overview-card__secondary,
.attention-overview-card__more,
.attention-overview-sidecard__apply,
.attention-overview-sidecard__outline,
.attention-overview-sidecard__recommend button,
.attention-overview-pagination button,
.attention-overview-bulk button,
.attention-overview-filter {
  border: 1px solid #e2e8f3;
  border-radius: 12px;
  background: #fff;
  font: inherit;
}

.attention-overview-modal__primary,
.attention-overview-modal__secondary {
  height: 42px;
  padding: 0 16px;
  color: #24324d;
  cursor: pointer;
}

.attention-overview-modal__primary {
  gap: 8px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff6aaa 0%, #eb5ea6 100%);
  box-shadow: 0 12px 24px rgba(235, 94, 166, 0.22);
}

.attention-overview-modal__close {
  width: 42px;
  height: 42px;
  display: inline-grid;
  place-items: center;
  color: #8da0bd;
  cursor: pointer;
}

.attention-overview-modal__body {
  padding-top: 16px;
  padding-bottom: 16px;
  overflow: auto;
  display: grid;
  gap: 16px;
}

.attention-overview-stats {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 14px;
}

.attention-overview-stat {
  min-width: 0;
  padding: 14px 12px;
  border: 1px solid #edf2f8;
  border-radius: 18px;
  background: #fff;
  display: grid;
  justify-items: center;
  gap: 6px;
  text-align: center;
}

.attention-overview-stat__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
}

.attention-overview-stat strong {
  color: #162447;
  font-size: 0.96rem;
}

.attention-overview-stat span {
  color: #64748b;
  font-size: 0.72rem;
  line-height: 1.35;
}

.attention-overview-stat small {
  font-size: 0.62rem;
  font-weight: 700;
}

.attention-overview-filters {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.attention-overview-filter {
  flex: 0 0 auto;
  height: 36px;
  padding: 0 14px;
  color: #5c6981;
  cursor: pointer;
}

.attention-overview-filter.is-active {
  border-color: transparent;
  background: linear-gradient(135deg, #f3a2a6 0%, #ee8f8b 100%);
  color: #fff;
}

.attention-overview-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 290px;
  gap: 18px;
  align-items: start;
}

.attention-overview-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.attention-overview-card {
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 18px;
  background: #fff;
  display: grid;
  gap: 14px;
}

.attention-overview-card__top {
  justify-content: space-between;
  gap: 10px;
}

.attention-overview-card__tone {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.7rem;
  font-weight: 700;
}

.attention-overview-card__severity {
  min-width: 54px;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.62rem;
  font-weight: 700;
  background: #fff2f2;
}

.attention-overview-card__copy h3,
.attention-overview-sidecard h3 {
  margin: 0;
  color: #162447;
  font-size: 0.98rem;
  line-height: 1.2;
}

.attention-overview-card__copy p {
  margin: 5px 0 0;
  color: #7b879a;
  font-size: 0.72rem;
}

.attention-overview-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.attention-overview-card__stats div {
  display: grid;
  gap: 4px;
}

.attention-overview-card__stats span {
  color: #97a4b8;
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
}

.attention-overview-card__stats strong {
  color: #162447;
  font-size: 0.86rem;
  line-height: 1.25;
}

.attention-overview-card__stats small {
  color: #94a3b8;
  font-size: 0.74rem;
}

.attention-overview-card__insight {
  padding: 12px;
  border-radius: 14px;
  background: #f8fafc;
}

.attention-overview-card__insight strong {
  display: block;
  color: #162447;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
}

.attention-overview-card__insight p {
  margin: 7px 0 0;
  color: #5f6b80;
  font-size: 0.7rem;
  line-height: 1.45;
}

.attention-overview-card__actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 44px;
  gap: 8px;
  align-items: stretch;
}

.attention-overview-card__primary,
.attention-overview-card__secondary {
  width: 100%;
  min-height: 56px;
  padding: 10px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.25;
  white-space: normal;
  word-break: normal;
  overflow-wrap: break-word;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
}

.attention-overview-card__primary,
.attention-overview-sidecard__apply {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff6aaa 0%, #ea5ca4 100%);
}

.attention-overview-card__secondary,
.attention-overview-sidecard__outline {
  color: #334155;
  background: #fff;
}

.attention-overview-card__more {
  width: 44px;
  height: 56px;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
}

.attention-overview-cards__footer {
  grid-column: 1 / -1;
  justify-content: space-between;
  gap: 16px;
  padding-top: 8px;
}

.attention-overview-cards__footer > span {
  color: #64748b;
  font-size: 0.76rem;
}

.attention-overview-pagination {
  gap: 8px;
}

.attention-overview-pagination button {
  width: 34px;
  height: 34px;
  display: inline-grid;
  place-items: center;
  color: #516072;
  cursor: pointer;
}

.attention-overview-pagination button.is-active {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff6aaa 0%, #ea5ca4 100%);
}

.attention-overview-sidebar {
  display: grid;
  gap: 16px;
}

.attention-overview-sidecard {
  padding: 18px;
  border: 1px solid #edf2f8;
  border-radius: 18px;
  background: #fff;
  display: grid;
  gap: 14px;
}

.attention-overview-sidecard__head {
  justify-content: space-between;
  gap: 10px;
}

.attention-overview-sidecard__label {
  color: #ff5f96;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
}

.attention-overview-sidecard__job {
  justify-content: space-between;
  gap: 12px;
}

.attention-overview-sidecard__job strong {
  color: #162447;
  font-size: 0.9rem;
}

.attention-overview-sidecard__job span {
  min-width: 72px;
  height: 28px;
  padding: 0 10px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff5f73;
  background: #fff1f2;
  font-size: 0.64rem;
  font-weight: 700;
}

.attention-overview-sidecard__list,
.attention-overview-impact-list,
.attention-overview-bulk {
  display: grid;
  gap: 10px;
}

.attention-overview-sidecard__list div,
.attention-overview-impact-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #64748b;
  font-size: 0.74rem;
}

.attention-overview-sidecard__list strong,
.attention-overview-impact-list strong {
  color: #ff5f73;
  font-size: 0.76rem;
}

.attention-overview-sidecard__recommend {
  display: grid;
  gap: 10px;
}

.attention-overview-sidecard__recommend span {
  color: #64748b;
  font-size: 0.74rem;
}

.attention-overview-sidecard__recommend div {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.attention-overview-sidecard__recommend button {
  height: 30px;
  padding: 0 10px;
  color: #475569;
  cursor: pointer;
}

.attention-overview-sidecard__apply,
.attention-overview-sidecard__outline {
  height: 44px;
  justify-content: center;
  cursor: pointer;
}

.attention-overview-bulk button {
  justify-content: space-between;
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  color: #334155;
  cursor: pointer;
}

.attention-overview-modal__footer {
  padding-top: 12px;
  padding-bottom: 18px;
  border-top: 1px solid #edf2f8;
  justify-content: flex-end;
}

.attention-overview-stat__icon.tone-pink,
.attention-overview-card__severity.tone-pink,
.attention-overview-card__tone.tone-pink {
  color: #ef5da8;
}

.attention-overview-stat__icon.tone-pink {
  background: #fff1f7;
}

.attention-overview-stat__icon.tone-orange,
.attention-overview-card__severity.tone-orange,
.attention-overview-card__tone.tone-orange {
  color: #ff8a34;
}

.attention-overview-stat__icon.tone-orange {
  background: #fff4ea;
}

.attention-overview-stat__icon.tone-violet,
.attention-overview-card__severity.tone-violet,
.attention-overview-card__tone.tone-violet {
  color: #9b67ff;
}

.attention-overview-stat__icon.tone-violet {
  background: #f6efff;
}

.attention-overview-stat__icon.tone-blue,
.attention-overview-card__severity.tone-blue,
.attention-overview-card__tone.tone-blue {
  color: #5f8fff;
}

.attention-overview-stat__icon.tone-blue {
  background: #edf4ff;
}

.attention-overview-stat__icon.tone-yellow,
.attention-overview-card__severity.tone-yellow,
.attention-overview-card__tone.tone-yellow {
  color: #e3a900;
}

.attention-overview-stat__icon.tone-yellow {
  background: #fff8da;
}

.attention-overview-stat__icon.tone-green,
.attention-overview-card__severity.tone-green,
.attention-overview-card__tone.tone-green {
  color: #22b161;
}

.attention-overview-stat__icon.tone-green {
  background: #ecfbf3;
}

.attention-overview-stat__icon.tone-red,
.attention-overview-card__severity.tone-red,
.attention-overview-card__tone.tone-red {
  color: #f05c67;
}

.attention-overview-stat__icon.tone-red {
  background: #fff0f2;
}

.action-plan-layer {
  position: fixed;
  inset: 0;
  z-index: 96;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

.action-plan-modal {
  width: min(1220px, calc(100vw - 40px));
  max-height: calc(100vh - 40px);
  border: 1px solid #e8edf6;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.action-plan-modal__head,
.action-plan-modal__body,
.action-plan-modal__footer,
.action-plan-modal__title-wrap,
.action-plan-modal__head,
.action-plan-modal__footer,
.action-plan-impact__head,
.action-plan-toolbar,
.action-plan-filters,
.action-plan-sort,
.action-plan-list__head,
.action-plan-row,
.action-plan-pagination,
.action-plan-pagination__controls {
  display: flex;
  align-items: center;
}

.action-plan-modal__head,
.action-plan-modal__body,
.action-plan-modal__footer {
  padding-left: 30px;
  padding-right: 30px;
}

.action-plan-modal__head,
.action-plan-modal__footer,
.action-plan-toolbar {
  justify-content: space-between;
  gap: 18px;
}

.action-plan-modal__head {
  padding-top: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2f8;
}

.action-plan-modal__title-wrap {
  gap: 14px;
}

.action-plan-modal__title-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #f15da8;
  background: linear-gradient(180deg, #fff1f7 0%, #ffe8f2 100%);
}

.action-plan-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #162447;
  font-size: 0.98rem;
  line-height: 1.2;
}

.action-plan-modal__title-wrap p {
  margin: 0;
  color: #7b879a;
  font-size: 0.76rem;
}

.action-plan-modal__close,
.action-plan-sort button,
.action-plan-filters button,
.action-plan-row__button,
.action-plan-pagination__controls button,
.action-plan-modal__primary {
  border: 1px solid #e2e8f3;
  border-radius: 12px;
  background: #fff;
  font: inherit;
}

.action-plan-modal__close {
  width: 42px;
  height: 42px;
  display: inline-grid;
  place-items: center;
  color: #8da0bd;
  cursor: pointer;
}

.action-plan-modal__body {
  padding-top: 22px;
  padding-bottom: 22px;
  overflow: auto;
  display: grid;
  gap: 22px;
}

.action-plan-impact {
  padding: 22px 24px;
  border: 1px solid #edf2f8;
  border-radius: 18px;
  display: grid;
  gap: 18px;
}

.action-plan-impact__head {
  justify-content: space-between;
  gap: 16px;
}

.action-plan-impact__head h3 {
  margin: 0;
  color: #162447;
  font-size: 0.86rem;
}

.action-plan-impact__head span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6f7d94;
  font-size: 0.74rem;
}

.action-plan-impact__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.action-plan-impact__card {
  min-height: 102px;
  padding: 18px 20px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
  display: flex;
  gap: 14px;
  align-items: center;
}

.action-plan-impact__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
}

.action-plan-impact__card strong {
  display: block;
  font-size: 1.12rem;
  line-height: 1.1;
}

.action-plan-impact__card h4 {
  margin: 5px 0 3px;
  color: #162447;
  font-size: 0.82rem;
}

.action-plan-impact__card p {
  margin: 0;
  color: #8a97ac;
  font-size: 0.72rem;
}

.action-plan-filters {
  gap: 10px;
  flex-wrap: wrap;
}

.action-plan-filters button {
  min-height: 36px;
  padding: 0 14px;
  color: #58657d;
  cursor: pointer;
  border-radius: 999px;
  background: #f8fafc;
}

.action-plan-filters button.is-active {
  border-color: transparent;
  color: #ff5fa1;
  background: #ffeef5;
}

.action-plan-sort {
  gap: 12px;
}

.action-plan-sort span {
  color: #6f7d94;
  font-size: 0.74rem;
}

.action-plan-sort button {
  min-height: 38px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  cursor: pointer;
}

.action-plan-list {
  display: grid;
  gap: 12px;
}

.action-plan-list__head,
.action-plan-row {
  display: grid;
  grid-template-columns: 52px minmax(280px, 2fr) minmax(160px, 1fr) minmax(160px, 1fr) minmax(120px, 0.7fr) 160px;
  gap: 12px;
  align-items: center;
}

.action-plan-list__head {
  padding: 0 18px;
  color: #9aa6bb;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
}

.action-plan-row {
  padding: 18px 18px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
  background: #fff;
}

.action-plan-row__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
}

.action-plan-row__action strong,
.action-plan-row__meta strong {
  display: block;
  color: #162447;
  font-size: 0.82rem;
  line-height: 1.25;
}

.action-plan-row__action p,
.action-plan-row__meta p {
  margin: 4px 0 0;
  color: #7c889d;
  font-size: 0.72rem;
  line-height: 1.45;
}

.action-plan-row__meta span {
  display: block;
  margin-bottom: 4px;
  color: #9aa6bb;
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
}

.action-plan-row__meta em {
  width: fit-content;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 700;
  background: #fff4f4;
}

.action-plan-row__button {
  min-height: 42px;
  padding: 0 14px;
  color: #f05ba8;
  border-color: #f6cfe0;
  background: #fff;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 14px;
}

.action-plan-modal__footer {
  padding-top: 14px;
  padding-bottom: 18px;
  border-top: 1px solid #edf2f8;
  justify-content: space-between;
}

.action-plan-pagination {
  gap: 14px;
}

.action-plan-pagination > span {
  color: #6f7d94;
  font-size: 0.74rem;
}

.action-plan-pagination__controls {
  gap: 8px;
}

.action-plan-pagination__controls button {
  width: 34px;
  height: 34px;
  display: inline-grid;
  place-items: center;
  color: #5b6981;
  cursor: pointer;
}

.action-plan-pagination__controls button.is-active {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff6aaa 0%, #ea5ca4 100%);
}

.action-plan-modal__primary {
  min-width: 274px;
  min-height: 42px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff6aaa 0%, #ea5ca4 100%);
  box-shadow: 0 12px 24px rgba(235, 94, 166, 0.18);
  cursor: pointer;
}

.action-plan-impact__icon.tone-green,
.action-plan-impact__card strong.tone-green,
.action-plan-row__icon.tone-green,
.action-plan-row__meta em.tone-green {
  color: #22b161;
}

.action-plan-impact__icon.tone-green,
.action-plan-row__icon.tone-green {
  background: #ecfbf3;
}

.action-plan-impact__icon.tone-blue,
.action-plan-impact__card strong.tone-blue,
.action-plan-row__icon.tone-blue {
  color: #3b82f6;
}

.action-plan-impact__icon.tone-blue,
.action-plan-row__icon.tone-blue {
  background: #edf4ff;
}

.action-plan-impact__icon.tone-violet,
.action-plan-impact__card strong.tone-violet,
.action-plan-row__icon.tone-violet {
  color: #9b67ff;
}

.action-plan-impact__icon.tone-violet,
.action-plan-row__icon.tone-violet {
  background: #f6efff;
}

.action-plan-row__icon.tone-pink,
.action-plan-row__meta em.tone-pink {
  color: #ef5da8;
}

.action-plan-row__icon.tone-pink {
  background: #fff1f7;
}

.action-plan-row__icon.tone-orange,
.action-plan-row__meta em.tone-orange {
  color: #ff8a34;
}

.action-plan-row__icon.tone-orange {
  background: #fff4ea;
}

.action-plan-feedback-layer {
  position: fixed;
  inset: 0;
  z-index: 97;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

.action-plan-feedback-modal {
  width: min(1160px, calc(100vw - 36px));
  max-height: calc(100vh - 36px);
  border: 1px solid #e8edf6;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.action-plan-feedback-modal--compose {
  width: min(1280px, calc(100vw - 32px));
}

.action-plan-feedback-modal__head,
.action-plan-feedback-modal__body,
.action-plan-feedback-modal__footer,
.action-plan-feedback-modal__title-wrap,
.action-plan-feedback-summary,
.action-plan-feedback-candidates__head,
.action-plan-feedback-aside__head,
.action-plan-feedback-tip__head,
.action-plan-feedback-modal__actions,
.action-plan-feedback-candidate {
  display: flex;
  align-items: center;
}

.action-plan-feedback-modal__head,
.action-plan-feedback-modal__body,
.action-plan-feedback-modal__footer {
  padding-left: 34px;
  padding-right: 34px;
}

.action-plan-feedback-modal__head,
.action-plan-feedback-modal__footer,
.action-plan-feedback-candidates__head,
.action-plan-feedback-modal__actions {
  justify-content: space-between;
  gap: 18px;
}

.action-plan-feedback-modal__head {
  padding-top: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid #edf2f8;
}

.action-plan-feedback-modal__title-wrap {
  gap: 16px;
}

.action-plan-feedback-modal__title-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #f15da8;
  background: linear-gradient(180deg, #fff1f7 0%, #ffe8f2 100%);
}

.action-plan-feedback-modal__title-wrap h2 {
  margin: 0 0 6px;
  color: #162447;
  font-size: 1rem;
  line-height: 1.2;
}

.action-plan-feedback-modal__title-wrap p {
  margin: 0;
  color: #7b879a;
  font-size: 0.76rem;
}

.action-plan-feedback-modal__close,
.action-plan-feedback-modal__secondary,
.action-plan-feedback-modal__primary {
  border: 1px solid #e2e8f3;
  border-radius: 12px;
  background: #fff;
  font: inherit;
}

.action-plan-feedback-modal__close {
  width: 42px;
  height: 42px;
  display: inline-grid;
  place-items: center;
  color: #8da0bd;
  cursor: pointer;
}

.action-plan-feedback-modal__body {
  padding-top: 16px;
  padding-bottom: 16px;
  overflow: auto;
  display: grid;
  gap: 16px;
}

.action-plan-feedback-summary {
  padding: 14px 20px;
  border: 1px solid #edf2f8;
  border-radius: 18px;
  gap: 0;
}

.action-plan-feedback-summary__item {
  flex: 1;
  min-width: 0;
  padding-right: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-plan-feedback-summary__item + .action-plan-feedback-summary__item {
  padding-left: 18px;
  border-left: 1px solid #edf2f8;
}

.action-plan-feedback-summary__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  color: #94a3b8;
  background: #f8fafc;
}

.action-plan-feedback-summary small,
.action-plan-feedback-summary__priority small {
  display: block;
  margin-bottom: 4px;
  color: #a0abc0;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.action-plan-feedback-summary strong,
.action-plan-feedback-summary__priority strong {
  color: #162447;
  font-size: 0.88rem;
  line-height: 1.3;
}

.action-plan-feedback-summary__priority {
  min-width: 120px;
  align-self: stretch;
  padding-left: 20px;
  border-left: 1px solid #edf2f8;
  display: grid;
  align-content: center;
}

.action-plan-feedback-summary__priority strong.tone-pink {
  width: fit-content;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  color: #ef5da8;
  background: #fff1f6;
}

.action-plan-feedback-summary__priority strong.tone-orange {
  width: fit-content;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  color: #ff8a34;
  background: #fff4ea;
}

.action-plan-feedback-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 22px;
  align-items: start;
}

.action-plan-feedback-candidates {
  min-width: 0;
  border-right: 1px solid #edf2f8;
  padding-right: 20px;
  display: grid;
  gap: 10px;
  overflow: hidden;
}

.action-plan-feedback-candidates__head {
  display: flex;
  align-items: center;
}

.action-plan-feedback-candidates__head strong {
  font-size: 0.8rem;
}

.action-plan-feedback-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #162447;
  font-size: 0.78rem;
  font-weight: 700;
}

.action-plan-feedback-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.action-plan-feedback-check__box {
  width: 20px;
  height: 20px;
  border: 1px solid #f0b8cf;
  border-radius: 6px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  color: transparent;
  background: #fff;
  transition: 0.2s ease;
}

.action-plan-feedback-check input:checked + .action-plan-feedback-check__box {
  border-color: #ef5da8;
  color: #fff;
  background: #ef5da8;
}

.action-plan-feedback-candidates__list {
  display: grid;
  gap: 10px;
}

.action-plan-feedback-candidate {
  display: grid;
  grid-template-columns: 20px 48px minmax(170px, 1.42fr) minmax(126px, 0.92fr) minmax(92px, 0.6fr) minmax(72px, 0.5fr) auto;
  padding: 11px 12px 11px 10px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  gap: 10px;
  align-items: center;
}

.action-plan-feedback-check--row {
  align-self: center;
  margin-top: 0;
}

.action-plan-feedback-candidate__avatar {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  color: #fff;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.action-plan-feedback-candidate__avatar.tone-brown {
  background: linear-gradient(135deg, #2b211e 0%, #8e6749 100%);
}

.action-plan-feedback-candidate__avatar.tone-sand {
  background: linear-gradient(135deg, #d7b68f 0%, #6e5841 100%);
}

.action-plan-feedback-candidate__avatar.tone-amber {
  background: linear-gradient(135deg, #4f382a 0%, #b88348 100%);
}

.action-plan-feedback-candidate__avatar.tone-rose {
  background: linear-gradient(135deg, #5f3533 0%, #cf857d 100%);
}

.action-plan-feedback-candidate__avatar.tone-olive {
  background: linear-gradient(135deg, #41372e 0%, #8d7749 100%);
}

.action-plan-feedback-candidate__identity,
.action-plan-feedback-candidate__stage,
.action-plan-feedback-candidate__meta {
  min-width: 0;
}

.action-plan-feedback-candidate__identity strong,
.action-plan-feedback-candidate__stage strong,
.action-plan-feedback-candidate__meta strong {
  display: block;
  color: #162447;
  font-size: 0.7rem;
  line-height: 1.25;
}

.action-plan-feedback-candidate__stage p,
.action-plan-feedback-candidate__meta p {
  margin: 3px 0 0;
  color: #7b879a;
  font-size: 0.61rem;
  line-height: 1.28;
}

.action-plan-feedback-candidate__identity-meta {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 4px;
}

.action-plan-feedback-candidate__mini-stack {
  display: grid;
  gap: 2px;
}

.action-plan-feedback-candidate__mini-stack span {
  color: #97a4ba;
  font-size: 0.53rem;
  line-height: 1.1;
}

.action-plan-feedback-candidate__mini-stack p {
  margin: 0;
  color: #6d7b94;
  font-size: 0.6rem;
  line-height: 1.2;
}

.action-plan-feedback-candidate__source {
  width: fit-content;
  padding: 2px 7px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  font-size: 0.54rem;
  font-weight: 700;
  line-height: 1.1;
}

.action-plan-feedback-candidate__source.tone-blue {
  color: #3b82f6;
  background: #eef4ff;
}

.action-plan-feedback-candidate__source.tone-green {
  color: #22b161;
  background: #ecfbf3;
}

.action-plan-feedback-candidate__source.tone-orange {
  color: #ff8a34;
  background: #fff4ea;
}

.action-plan-feedback-candidate__dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}

.action-plan-feedback-candidate__dot.tone-violet {
  background: #9b67ff;
}

.action-plan-feedback-candidate__dot.tone-yellow {
  background: #eab308;
}

.action-plan-feedback-candidate__dot.tone-blue {
  background: #3b82f6;
}

.action-plan-feedback-candidate__meta span {
  display: block;
  margin-bottom: 3px;
  color: #9aa6bb;
  font-size: 0.56rem;
}

.action-plan-feedback-candidate__meta strong.tone-red {
  color: #ef4444;
}

.action-plan-feedback-candidate__actions {
  display: inline-flex;
  align-items: center;
  justify-self: end;
  gap: 0;
  flex-shrink: 0;
}

.action-plan-feedback-candidate__button,
.action-plan-feedback-candidate__caret {
  min-height: 30px;
  border: 1px solid #f1bfd6;
  background: #fff;
  color: #ef5da8;
  font: inherit;
  cursor: pointer;
}

.action-plan-feedback-candidate__button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  border-radius: 9px 0 0 9px;
  border-right: 0;
  font-size: 0.58rem;
  font-weight: 700;
  white-space: nowrap;
}

.action-plan-feedback-candidate__caret {
  width: 28px;
  border-radius: 0 9px 9px 0;
  display: inline-grid;
  place-items: center;
}

.action-plan-feedback-aside {
  display: grid;
  padding-left: 8px;
  gap: 18px;
  min-width: 0;
  position: sticky;
  top: 0;
  align-content: start;
}

.action-plan-feedback-aside__card {
  display: grid;
  gap: 14px;
  padding: 22px 22px 20px;
  border: 1px solid #edf2f8;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
}

.action-plan-feedback-aside__head {
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}

.action-plan-feedback-aside__head h3 {
  margin: 0;
  color: #162447;
  font-size: 0.92rem;
  line-height: 1.25;
}

.action-plan-feedback-aside__head :deep(svg) {
  color: #94a3b8;
  flex-shrink: 0;
}

.action-plan-feedback-aside__card p {
  margin: 0;
  color: #5b6981;
  font-size: 0.76rem;
  line-height: 1.65;
}

.action-plan-feedback-aside__label {
  color: #a0abc0;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.action-plan-feedback-impact {
  display: grid;
  gap: 0;
}

.action-plan-feedback-impact__item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 12px 0;
}

.action-plan-feedback-impact__item + .action-plan-feedback-impact__item {
  border-top: 1px solid #eef2f8;
}

.action-plan-feedback-impact__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
}

.action-plan-feedback-impact__icon.tone-green {
  color: #22b161;
  background: #ecfbf3;
}

.action-plan-feedback-impact__icon.tone-blue {
  color: #3b82f6;
  background: #edf4ff;
}

.action-plan-feedback-impact__icon.tone-violet {
  color: #9b67ff;
  background: #f6efff;
}

.action-plan-feedback-impact__item strong {
  display: block;
  font-size: 1rem;
  line-height: 1.1;
}

.action-plan-feedback-impact__item strong.tone-green {
  color: #22b161;
}

.action-plan-feedback-impact__item strong.tone-blue {
  color: #3b82f6;
}

.action-plan-feedback-impact__item strong.tone-violet {
  color: #9b67ff;
}

.action-plan-feedback-impact__item h4 {
  margin: 4px 0 3px;
  color: #162447;
  font-size: 0.84rem;
}

.action-plan-feedback-impact__item p {
  margin: 0;
  color: #7c889d;
  font-size: 0.72rem;
}

.action-plan-feedback-tip {
  padding: 18px 20px;
  border: 1px solid #d8e6ff;
  border-radius: 18px;
  background: linear-gradient(180deg, #f7fbff 0%, #f2f8ff 100%);
  box-shadow: 0 10px 22px rgba(59, 130, 246, 0.06);
  display: grid;
  gap: 12px;
}

.action-plan-feedback-tip__head {
  justify-content: flex-start;
  gap: 8px;
  color: #2e6cf6;
}

.action-plan-feedback-tip p {
  margin: 0;
  color: #5b6981;
  font-size: 0.74rem;
  line-height: 1.65;
}

.action-plan-feedback-modal__footer {
  padding-top: 16px;
  padding-bottom: 20px;
  border-top: 1px solid #edf2f8;
}

.action-plan-feedback-modal__note {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6f7d94;
  font-size: 0.72rem;
}

.action-plan-feedback-modal__actions {
  margin-left: auto;
}

.action-plan-feedback-modal__secondary {
  min-width: 104px;
  min-height: 42px;
  padding: 0 18px;
  color: #334155;
  cursor: pointer;
}

.action-plan-feedback-modal__primary {
  min-width: 282px;
  min-height: 42px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff6aaa 0%, #ea5ca4 100%);
  box-shadow: 0 12px 24px rgba(235, 94, 166, 0.18);
  cursor: pointer;
}

.action-plan-compose__topbar,
.action-plan-compose__topbar-actions,
.action-plan-compose__title,
.action-plan-compose__section-head,
.action-plan-compose__editor-toolbar,
.action-plan-compose__suggestions-head,
.action-plan-compose__bottom,
.action-plan-compose__status,
.action-plan-compose__footer,
.action-plan-compose__footer-actions,
.action-plan-compose__checkbox,
.action-plan-compose__score,
.action-plan-compose__summary-head {
  display: flex;
  align-items: center;
}

.action-plan-compose__topbar,
.action-plan-compose__body,
.action-plan-compose__footer {
  padding-left: 28px;
  padding-right: 28px;
}

.action-plan-compose__topbar,
.action-plan-compose__footer,
.action-plan-compose__section-head,
.action-plan-compose__suggestions-head,
.action-plan-compose__score {
  justify-content: space-between;
}

.action-plan-compose__topbar {
  min-height: 74px;
  border-bottom: 1px solid #edf2f8;
}

.action-plan-compose__back,
.action-plan-compose__ghost,
.action-plan-compose__icon,
.action-plan-compose__manage,
.action-plan-compose__primary,
.action-plan-compose__secondary,
.action-plan-compose__type-card,
.action-plan-compose__suggestion {
  font: inherit;
}

.action-plan-compose__back,
.action-plan-compose__manage {
  border: 0;
  padding: 0;
  color: #6f7d94;
  background: transparent;
}

.action-plan-compose__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.action-plan-compose__topbar-actions {
  gap: 12px;
}

.action-plan-compose__ghost,
.action-plan-compose__icon,
.action-plan-compose__manage,
.action-plan-compose__secondary {
  border: 1px solid #dde6f1;
  border-radius: 12px;
  background: #fff;
}

.action-plan-compose__ghost,
.action-plan-compose__manage,
.action-plan-compose__secondary {
  min-height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #334155;
  cursor: pointer;
}

.action-plan-compose__icon {
  width: 40px;
  height: 40px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  cursor: pointer;
}

.action-plan-compose__body {
  padding-top: 14px;
  padding-bottom: 18px;
  overflow: auto;
  display: grid;
  gap: 18px;
}

.action-plan-compose__title {
  gap: 14px;
}

.action-plan-compose__title-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #ff5da8;
  background: #fff1f7;
}

.action-plan-compose__title h2 {
  margin: 0 0 4px;
  color: #162447;
  font-size: 1.05rem;
}

.action-plan-compose__title p {
  margin: 0;
  color: #74829a;
  font-size: 0.8rem;
}

.action-plan-compose__layout {
  display: grid;
  grid-template-columns: 306px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.action-plan-compose__sidebar,
.action-plan-compose__main {
  display: grid;
  gap: 18px;
}

.action-plan-compose__candidate-card,
.action-plan-compose__summary-card,
.action-plan-compose__section,
.action-plan-compose__editor,
.action-plan-compose__suggestions {
  border: 1px solid #e7edf6;
  border-radius: 18px;
  background: #fff;
}

.action-plan-compose__candidate-card,
.action-plan-compose__summary-card {
  padding: 20px 22px;
}

.action-plan-compose__candidate-card {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.action-plan-compose__candidate-avatar {
  width: 74px;
  height: 74px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
}

.action-plan-compose__candidate-avatar.tone-brown {
  background: linear-gradient(135deg, #2b211e 0%, #8e6749 100%);
}

.action-plan-compose__candidate-avatar.tone-sand {
  background: linear-gradient(135deg, #d7b68f 0%, #6e5841 100%);
}

.action-plan-compose__candidate-avatar.tone-amber {
  background: linear-gradient(135deg, #4f382a 0%, #b88348 100%);
}

.action-plan-compose__candidate-avatar.tone-rose {
  background: linear-gradient(135deg, #5f3533 0%, #cf857d 100%);
}

.action-plan-compose__candidate-avatar.tone-olive {
  background: linear-gradient(135deg, #41372e 0%, #8d7749 100%);
}

.action-plan-compose__candidate-card > strong {
  color: #162447;
  font-size: 0.98rem;
}

.action-plan-compose__candidate-card > p {
  margin: -4px 0 0;
  color: #6f7d94;
  font-size: 0.8rem;
}

.action-plan-compose__candidate-meta {
  width: 100%;
  display: grid;
  gap: 12px;
  padding-top: 8px;
}

.action-plan-compose__candidate-meta div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.action-plan-compose__candidate-meta span {
  color: #8fa0b8;
  font-size: 0.72rem;
}

.action-plan-compose__candidate-meta strong {
  color: #24324c;
  font-size: 0.76rem;
  text-align: right;
}

.action-plan-compose__progress {
  width: 100%;
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid #edf2f8;
  display: grid;
  gap: 12px;
}

.action-plan-compose__progress > span {
  color: #9aa8bc;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.action-plan-compose__progress-track {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  align-items: center;
}

.action-plan-compose__progress-track i {
  height: 10px;
  border: 2px solid #d8e1ee;
  border-radius: 999px;
  background: #fff;
}

.action-plan-compose__progress-track i.is-active {
  border-color: #b88af9;
  background: #9b67ff;
}

.action-plan-compose__progress-labels {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.action-plan-compose__progress-labels small {
  color: #9aa8bc;
  font-size: 0.58rem;
  text-align: center;
}

.action-plan-compose__summary-head strong {
  color: #25314a;
  font-size: 0.84rem;
}

.action-plan-compose__summary-head span {
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #19a55a;
  background: #ecfbf3;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
}

.action-plan-compose__summary-card p {
  margin: 16px 0 0;
  color: #5d6a82;
  font-size: 0.78rem;
  line-height: 1.75;
}

.action-plan-compose__score {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #edf2f8;
}

.action-plan-compose__score span {
  color: #8492a8;
  font-size: 0.76rem;
}

.action-plan-compose__score strong {
  width: 50px;
  height: 50px;
  border: 4px solid #16b364;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  color: #24324c;
  font-size: 0.74rem;
}

.action-plan-compose__section {
  padding: 18px;
}

.action-plan-compose__section h3 {
  margin: 0 0 14px;
  color: #1f2b45;
  font-size: 0.88rem;
}

.action-plan-compose__section h3 em {
  color: #ff5da8;
  font-style: normal;
  margin-right: 6px;
}

.action-plan-compose__section h3 small {
  color: #96a3b8;
  font-size: 0.8em;
}

.action-plan-compose__type-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.action-plan-compose__type-card {
  min-height: 124px;
  padding: 14px;
  border: 1px solid #e3eaf5;
  border-radius: 14px;
  background: #fff;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 10px;
  cursor: pointer;
}

.action-plan-compose__type-card.is-active {
  border-color: #ff70b7;
  background: #fff5fa;
  box-shadow: inset 0 0 0 1px rgba(255, 93, 168, 0.14);
}

.action-plan-compose__type-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  background: #f5f8fc;
}

.action-plan-compose__type-card.is-active .action-plan-compose__type-icon {
  color: #ff5da8;
  background: #fff1f7;
}

.action-plan-compose__type-card strong {
  color: #24324c;
  font-size: 0.78rem;
}

.action-plan-compose__type-card small {
  color: #8392a9;
  font-size: 0.7rem;
  text-align: center;
}

.action-plan-compose__manage {
  min-height: 34px;
  padding: 0 12px;
  font-size: 0.72rem;
}

.action-plan-compose__editor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 14px;
}

.action-plan-compose__editor {
  overflow: hidden;
}

.action-plan-compose__editor-toolbar {
  min-height: 42px;
  padding: 0 14px;
  gap: 12px;
  border-bottom: 1px solid #edf2f8;
  color: #73839b;
  font-size: 0.74rem;
}

.action-plan-compose__editor textarea,
.action-plan-compose__note {
  width: 100%;
  border: 0;
  outline: none;
  resize: none;
  color: #334155;
  font: inherit;
  background: transparent;
}

.action-plan-compose__editor textarea {
  min-height: 210px;
  padding: 16px;
  font-size: 0.82rem;
  line-height: 1.75;
}

.action-plan-compose__suggestions {
  padding: 14px;
  display: grid;
  align-content: start;
  gap: 10px;
}

.action-plan-compose__suggestions-head strong {
  color: #ff5da8;
  font-size: 0.74rem;
  text-transform: uppercase;
}

.action-plan-compose__suggestions-head button {
  border: 0;
  padding: 0;
  color: #ff5da8;
  background: transparent;
  font: inherit;
  font-size: 0.72rem;
}

.action-plan-compose__suggestion {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #334155;
  background: #fbfcff;
  cursor: pointer;
}

.action-plan-compose__bottom {
  align-items: start;
  gap: 14px;
}

.action-plan-compose__bottom > * {
  flex: 1;
  min-width: 0;
}

.action-plan-compose__note {
  min-height: 96px;
  padding: 14px 16px;
  border: 1px solid #dde6f1;
  border-radius: 14px;
  font-size: 0.8rem;
  line-height: 1.65;
}

.action-plan-compose__status {
  align-items: stretch;
  flex-direction: column;
  gap: 14px;
}

.action-plan-compose__checkbox {
  gap: 10px;
  color: #334155;
  font-size: 0.82rem;
}

.action-plan-compose__checkbox input {
  width: 18px;
  height: 18px;
  accent-color: #ef5da8;
}

.action-plan-compose__footer {
  min-height: 84px;
  border-top: 1px solid #edf2f8;
}

.action-plan-compose__footer-actions {
  gap: 12px;
}

.action-plan-compose__primary {
  min-width: 240px;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
  cursor: pointer;
}

.action-plan-approval-layer {
  position: fixed;
  inset: 0;
  z-index: 95;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.22);
  backdrop-filter: blur(8px);
}

.action-plan-approval-modal {
  width: min(1180px, calc(100vw - 40px));
  max-height: min(880px, calc(100vh - 40px));
  border: 1px solid #e5ebf5;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 28px 90px rgba(15, 23, 42, 0.2);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.action-plan-approval-modal__head,
.action-plan-approval-modal__body,
.action-plan-approval-modal__footer,
.action-plan-approval-modal__title-wrap,
.action-plan-approval-summary,
.action-plan-approval-toolbar,
.action-plan-approval-toolbar__actions,
.action-plan-approval-card__row,
.action-plan-approval-card__person,
.action-plan-approval-card__decision,
.action-plan-approval-card__history-item,
.action-plan-approval-card__assignments,
.action-plan-approval-modal__footer-actions,
.action-plan-approval-check,
.action-plan-approval-check--inline,
.action-plan-approval-card__ai-head {
  display: flex;
  align-items: center;
}

.action-plan-approval-modal__head,
.action-plan-approval-modal__body,
.action-plan-approval-modal__footer {
  padding-left: 24px;
  padding-right: 24px;
}

.action-plan-approval-modal__head,
.action-plan-approval-modal__footer,
.action-plan-approval-toolbar,
.action-plan-approval-modal__footer-actions {
  justify-content: space-between;
  gap: 16px;
}

.action-plan-approval-modal__head {
  padding-top: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #edf2f8;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
}

.action-plan-approval-modal__title-wrap {
  gap: 16px;
}

.action-plan-approval-modal__title-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #ff7a1a;
  background: #fff4ea;
}

.action-plan-approval-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #162447;
  font-size: 1.02rem;
}

.action-plan-approval-modal__title-wrap p {
  margin: 0;
  color: #73839b;
  font-size: 0.8rem;
}

.action-plan-approval-modal__close,
.action-plan-approval-modal__secondary,
.action-plan-approval-modal__warning,
.action-plan-approval-modal__danger,
.action-plan-approval-modal__primary,
.action-plan-approval-card__decision-button,
.action-plan-approval-card__expand,
.action-plan-approval-card__reason-option,
.action-plan-approval-card__ghost,
.action-plan-approval-card__primary {
  font: inherit;
}

.action-plan-approval-modal__close {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f3;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #94a3b8;
  background: #fff;
  cursor: pointer;
}

.action-plan-approval-modal__body {
  padding-top: 20px;
  padding-bottom: 24px;
  overflow: auto;
  display: grid;
  gap: 20px;
  background: linear-gradient(180deg, #fcfdff 0%, #ffffff 14%);
}

.action-plan-approval-summary {
  padding: 0;
  border-bottom: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.action-plan-approval-summary__item {
  min-width: 0;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(148, 163, 184, 0.08);
}

.action-plan-approval-summary__item + .action-plan-approval-summary__item {
  border-left: 0;
}

.action-plan-approval-summary__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
}

.action-plan-approval-summary__icon.tone-pink {
  color: #ef5da8;
  background: #fff1f7;
}

.action-plan-approval-summary__icon.tone-blue {
  color: #3b82f6;
  background: #eef4ff;
}

.action-plan-approval-summary__icon.tone-green {
  color: #22b161;
  background: #ecfbf3;
}

.action-plan-approval-summary__icon.tone-red {
  color: #ef4444;
  background: #fff1f2;
}

.action-plan-approval-summary small,
.action-plan-approval-card__meta span,
.action-plan-approval-card__side > div > span,
.action-plan-approval-card__assignments span {
  display: block;
  color: #9aa8bc;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.action-plan-approval-summary strong {
  display: block;
  margin-top: 4px;
  color: #162447;
  font-size: 0.84rem;
}

.action-plan-approval-toolbar {
  padding-top: 2px;
}

.action-plan-approval-toolbar__copy strong {
  display: block;
  color: #1f2b45;
  font-size: 0.92rem;
}

.action-plan-approval-toolbar__copy p {
  margin: 4px 0 0;
  color: #6f7d94;
  font-size: 0.76rem;
}

.action-plan-approval-toolbar__actions {
  gap: 16px;
}

.action-plan-approval-check {
  gap: 8px;
  color: #334155;
  font-size: 0.78rem;
}

.action-plan-approval-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.action-plan-approval-check__box {
  width: 20px;
  height: 20px;
  border: 1px solid #f0b8cf;
  border-radius: 6px;
  display: inline-grid;
  place-items: center;
  color: transparent;
  background: #fff;
}

.action-plan-approval-check input:checked + .action-plan-approval-check__box {
  border-color: #ef5da8;
  color: #fff;
  background: #ef5da8;
}

.action-plan-approval-toolbar__sort {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6f7d94;
  font-size: 0.78rem;
}

.action-plan-approval-toolbar__sort :deep(.app-select-trigger) {
  min-width: 190px;
  min-height: 38px;
}

.action-plan-approval-list {
  display: grid;
  gap: 16px;
}

.action-plan-approval-card {
  border: 1px solid #e6edf7;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.action-plan-approval-card.is-expanded {
  border-color: #f3c6dc;
  box-shadow: 0 0 0 1px rgba(239, 93, 168, 0.08), 0 18px 40px rgba(239, 93, 168, 0.08);
}

.action-plan-approval-card__row {
  padding: 18px;
  gap: 14px;
  display: grid;
  grid-template-columns: auto minmax(220px, 1.1fr) minmax(92px, 0.6fr) minmax(150px, 0.8fr) minmax(180px, 0.95fr) max-content auto;
  align-items: center;
}

.action-plan-approval-card__person {
  min-width: 0;
  gap: 12px;
}

.action-plan-approval-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
}

.action-plan-approval-card__avatar.tone-brown {
  background: linear-gradient(135deg, #2b211e 0%, #8e6749 100%);
}

.action-plan-approval-card__avatar.tone-sand {
  background: linear-gradient(135deg, #d7b68f 0%, #6e5841 100%);
}

.action-plan-approval-card__avatar.tone-olive {
  background: linear-gradient(135deg, #41372e 0%, #8d7749 100%);
}

.action-plan-approval-card__avatar.tone-rose {
  background: linear-gradient(135deg, #5f3533 0%, #cf857d 100%);
}

.action-plan-approval-card__person strong,
.action-plan-approval-card__meta strong {
  display: block;
  color: #1f2b45;
  font-size: 0.8rem;
}

.action-plan-approval-card__person p,
.action-plan-approval-card__person small,
.action-plan-approval-card__meta small {
  display: block;
  margin-top: 4px;
  color: #7a879c;
  font-size: 0.68rem;
  line-height: 1.35;
}

.action-plan-approval-card__badge {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #19a55a;
  background: #ecfbf3;
  font-size: 0.6rem;
  font-weight: 700;
}

.action-plan-approval-card__meta {
  min-width: 0;
}

.action-plan-approval-card__meta strong.tone-red {
  color: #ef4444;
}

.action-plan-approval-card__meta strong.tone-green {
  color: #22b161;
}

.action-plan-approval-card__meta strong.tone-orange {
  color: #f97316;
}

.action-plan-approval-card__decision {
  min-width: 0;
  justify-self: end;
  justify-content: flex-end;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
}

.action-plan-approval-card__decision-button {
  flex: 0 0 auto;
  min-width: 0;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  background: #fff;
  font-size: 0.74rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}

.action-plan-approval-card__decision-button:hover,
.action-plan-approval-card__expand:hover,
.action-plan-approval-modal__close:hover,
.action-plan-approval-card__reason-option:hover,
.action-plan-approval-card__docs button:hover {
  transform: translateY(-1px);
}

.action-plan-approval-card__decision-button:hover {
  box-shadow: 0 10px 20px rgba(148, 163, 184, 0.12);
}

.action-plan-approval-card__decision-button.is-approve {
  border: 1px solid #9ae6b4;
  color: #16a34a;
  background: #ffffff;
}

.action-plan-approval-card__decision-button.is-request {
  border: 1px solid #fdba74;
  color: #f97316;
  background: #fffdf9;
}

.action-plan-approval-card__decision-button.is-reject {
  border: 1px solid #fbcaca;
  color: #ef4444;
  background: #fffdfd;
}

.action-plan-approval-card__expand {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f3;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  color: #8ea0b8;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}

.action-plan-approval-card__expanded {
  border-top: 1px solid #edf2f8;
  padding: 20px 22px 22px;
  display: grid;
  gap: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
}

.action-plan-approval-card__reason-grid {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr) minmax(240px, 280px);
  gap: 20px;
  align-items: start;
}

.action-plan-approval-card__reason-grid > div > span {
  display: block;
  margin-bottom: 12px;
  color: #9aa8bc;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
}

.action-plan-approval-card__reason-grid i,
.action-plan-approval-card__assignments i {
  color: #ef5da8;
  font-style: normal;
}

.action-plan-approval-card__reason-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.action-plan-approval-card__reason-option {
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid #dfe7f2;
  border-radius: 10px;
  color: #526279;
  background: #fff;
  text-align: left;
  cursor: pointer;
}

.action-plan-approval-card__reason-option.is-active {
  border-color: #ef5da8;
  color: #ef5da8;
  background: #fff5fa;
}

.action-plan-approval-card__ai {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #e3e7ff;
  border-radius: 16px;
  background: linear-gradient(180deg, #f8f9ff 0%, #f4f6ff 100%);
}

.action-plan-approval-card__ai-head {
  justify-content: flex-start;
  gap: 8px;
}

.action-plan-approval-card__ai-head strong {
  color: #f055a4;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.action-plan-approval-card__ai-badge {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #fff;
  background: linear-gradient(135deg, #6d5ef6 0%, #7b6dff 100%);
  font-size: 0.62rem;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 8px 16px rgba(109, 94, 246, 0.18);
}

.action-plan-approval-card__ai p {
  margin: 12px 0;
  color: #4e5d78;
  font-size: 0.74rem;
  line-height: 1.7;
}

.action-plan-approval-card__ai button {
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid #ffc8df;
  border-radius: 8px;
  color: #ef5da8;
  background: #fff;
  font: inherit;
}

.action-plan-approval-card__comments {
  position: relative;
}

.action-plan-approval-card__comments textarea {
  width: 100%;
  min-height: 260px;
  padding: 14px 16px 32px;
  border: 1px solid #dde6f1;
  border-radius: 14px;
  resize: none;
  outline: none;
  color: #334155;
  font: inherit;
  font-size: 0.8rem;
  line-height: 1.75;
  background: #fff;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.action-plan-approval-card__comments textarea:focus {
  border-color: #ef5da8;
  box-shadow: 0 0 0 4px rgba(239, 93, 168, 0.12);
}

.action-plan-approval-card__comments small {
  position: absolute;
  right: 12px;
  bottom: 10px;
  color: #9aa8bc;
  font-size: 0.66rem;
}

.action-plan-approval-card__side {
  display: grid;
  gap: 16px;
}

.action-plan-approval-card__side > div {
  padding: 16px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
  background: #fff;
}

.action-plan-approval-card__history {
  display: grid;
  gap: 12px;
}

.action-plan-approval-card__history-item {
  align-items: flex-start;
  gap: 10px;
}

.action-plan-approval-card__history-item i {
  width: 12px;
  height: 12px;
  margin-top: 4px;
  border-radius: 999px;
  background: #a3acb9;
  flex-shrink: 0;
}

.action-plan-approval-card__history-item i.tone-pink {
  background: #ef5da8;
}

.action-plan-approval-card__history-item strong {
  display: block;
  color: #4f5f79;
  font-size: 0.66rem;
}

.action-plan-approval-card__history-item small {
  display: block;
  margin-top: 3px;
  color: #66768e;
  font-size: 0.66rem;
}

.action-plan-approval-card__history-item small.tone-pink {
  color: #ef5da8;
}

.action-plan-approval-card__docs {
  display: grid;
  gap: 8px;
}

.action-plan-approval-card__docs button {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #445166;
  background: #fff;
  font: inherit;
  cursor: pointer;
  transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
}

.action-plan-approval-card__docs button:hover {
  border-color: #dce5f3;
  background: #fbfcff;
}

.action-plan-approval-card__assignments {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.action-plan-approval-card__assignments > div {
  flex: 1;
  min-width: 0;
}

.action-plan-approval-card__assignments span {
  margin-bottom: 8px;
}

.action-plan-approval-card__expanded-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
  border-top: 1px solid #edf2f8;
}

.action-plan-approval-card__ghost,
.action-plan-approval-card__primary,
.action-plan-approval-modal__secondary,
.action-plan-approval-modal__warning,
.action-plan-approval-modal__danger,
.action-plan-approval-modal__primary {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
}

.action-plan-approval-card__ghost,
.action-plan-approval-modal__secondary {
  border: 1px solid #dfe6f1;
  color: #34425e;
  background: #fff;
}

.action-plan-approval-card__primary,
.action-plan-approval-modal__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.18);
}

.action-plan-approval-modal__warning {
  border: 1px solid #fdba74;
  color: #f97316;
  background: #fff;
}

.action-plan-approval-modal__danger {
  border: 1px solid #f7b4b4;
  color: #ef4444;
  background: #fff;
}

.action-plan-approval-modal__footer {
  min-height: 88px;
  padding-top: 18px;
  padding-bottom: 18px;
  border-top: 1px solid #edf2f8;
  background: rgba(255, 255, 255, 0.96);
}

.action-plan-approval-modal__footer strong {
  color: #1f2b45;
  font-size: 0.86rem;
}

.duplicate-job-modal--advanced {
  width: min(1160px, 100%);
}

.duplicate-job-modal__body--advanced {
  display: block;
}

.duplicate-job-advanced-screen {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 290px;
  gap: 24px;
  align-items: start;
}

.duplicate-job-advanced-screen__main {
  display: grid;
  gap: 18px;
}

.duplicate-job-advanced-screen__aside {
  position: sticky;
  top: 0;
}

.duplicate-job-source--advanced {
  justify-content: space-between;
  align-items: center;
  padding: 18px;
}

.duplicate-job-source__summary,
.duplicate-job-section__head,
.duplicate-job-section__title,
.duplicate-job-panel__head,
.duplicate-job-radio,
.duplicate-job-checkbox,
.duplicate-job-summary-card__row,
.duplicate-job-insight__head,
.duplicate-job-bottom-note__status,
.duplicate-job-publish-card {
  display: flex;
  align-items: center;
}

.duplicate-job-source__summary {
  gap: 16px;
}

.duplicate-job-source__action,
.duplicate-job-panel-box__button,
.duplicate-job-collapse-all {
  border: 1px solid #f5bfd7;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ff4d9d;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
}

.duplicate-job-source__action {
  min-height: 40px;
  padding: 0 14px;
}

.duplicate-job-advanced-section {
  display: grid;
  gap: 14px;
}

.duplicate-job-section__head {
  gap: 10px;
}

.duplicate-job-section__head--with-action {
  justify-content: space-between;
}

.duplicate-job-section__title {
  gap: 10px;
}

.duplicate-job-section__head h3 {
  margin: 0;
  color: #1b2647;
  font-size: 17px;
  font-weight: 800;
}

.duplicate-job-section__step {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #ff5ca8 0%, #f472b6 100%);
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.duplicate-job-collapse-all {
  min-height: 32px;
  padding: 0 10px;
  border-color: transparent;
  color: #f056a4;
  background: transparent;
}

.duplicate-job-form--advanced {
  gap: 16px 22px;
}

.duplicate-job-copy__grid--advanced {
  gap: 16px;
}

.duplicate-job-input {
  position: relative;
}

.duplicate-job-input__icon {
  position: absolute;
  top: 50%;
  left: 14px;
  z-index: 2;
  color: #94a3b8;
  transform: translateY(-50%);
  pointer-events: none;
}

.duplicate-job-input--icon input {
  padding-left: 40px;
}

.duplicate-job-advanced-panels {
  display: grid;
  gap: 12px;
}

.duplicate-job-panel {
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: #fff;
  overflow: hidden;
}

.duplicate-job-panel__head {
  width: 100%;
  padding: 16px 18px;
  border: 0;
  justify-content: space-between;
  color: #1b2647;
  background: #fff;
  text-align: left;
}

.duplicate-job-panel__title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 800;
}

.duplicate-job-panel__title :deep(svg) {
  color: #ff4d9d;
}

.duplicate-job-panel__body {
  padding: 0 18px 18px;
  border-top: 1px solid #f3f5fa;
}

.duplicate-job-panel__grid {
  display: grid;
  gap: 14px 16px;
  padding-top: 16px;
}

.duplicate-job-panel__grid--four {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.duplicate-job-panel__grid--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.duplicate-job-radio-row {
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 2px;
}

.duplicate-job-radio,
.duplicate-job-checkbox {
  gap: 8px;
  color: #445166;
  font-size: 13px;
  font-weight: 600;
}

.duplicate-job-radio input,
.duplicate-job-checkbox input,
.duplicate-job-publish-card input {
  accent-color: #f35ba7;
}

.duplicate-job-radio--stacked,
.duplicate-job-checkbox--stacked {
  align-items: flex-start;
}

.duplicate-job-checkbox--stacked {
  display: grid;
  gap: 8px;
}

.duplicate-job-checkbox__row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.duplicate-job-panel__split {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(220px, 1fr);
  gap: 18px;
  padding-top: 16px;
}

.duplicate-job-checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
}

.duplicate-job-checkbox-group--two {
  align-items: start;
}

.duplicate-job-panel__label {
  display: block;
  margin-bottom: 8px;
  color: #1b2647;
  font-size: 13px;
  font-weight: 800;
}

.duplicate-job-visibility {
  padding-left: 18px;
  border-left: 1px solid #edf1f8;
}

.duplicate-job-visibility .duplicate-job-radio {
  margin-bottom: 10px;
}

.duplicate-job-panel-box {
  min-height: 68px;
  padding: 12px 14px;
  border: 1px solid #dde6f2;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.duplicate-job-panel-box__toggle {
  flex: 1 1 auto;
  min-width: 0;
}

.duplicate-job-panel-box__toggle input {
  width: 18px;
  height: 18px;
  margin: 0;
  flex: 0 0 auto;
}

.duplicate-job-panel-box__copy {
  color: #445166;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
}

.duplicate-job-panel-box__button {
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid #dde6f2;
  border-radius: 12px;
  background: #fff;
  border-color: #dde6f2;
  color: #445166;
  flex-shrink: 0;
}

.duplicate-job-workflow {
  padding-left: 18px;
  border-left: 1px solid #edf1f8;
}

.duplicate-job-workflow__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.duplicate-job-workflow__chip {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #7b6ca8;
  background: #fdf0f8;
  font-size: 12px;
  font-weight: 700;
}

.duplicate-job-time-saved {
  padding: 18px;
  border: 1px solid #f1d8e6;
  border-radius: 16px;
  display: grid;
  gap: 6px;
  align-content: center;
  color: #7a879d;
  background: linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.duplicate-job-time-saved span {
  font-size: 12px;
  font-weight: 700;
}

.duplicate-job-time-saved strong {
  color: #ff4d9d;
  font-size: 24px;
  font-weight: 800;
}

.duplicate-job-publish-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.duplicate-job-publish-card {
  min-height: 76px;
  gap: 12px;
  padding: 16px;
  border: 1px solid #dde6f2;
  border-radius: 16px;
  cursor: pointer;
}

.duplicate-job-publish-card.is-selected {
  border-color: #f5bfd7;
  background: linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.duplicate-job-publish-card__copy {
  display: grid;
  gap: 4px;
}

.duplicate-job-publish-card__copy strong {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.duplicate-job-publish-card__copy small {
  color: #7a879d;
  font-size: 12px;
  line-height: 1.5;
}

.duplicate-job-bottom-note {
  padding: 16px 18px;
  border: 1px solid #f1d8e6;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #7a879d;
  background: linear-gradient(180deg, #fff8fb 0%, #ffffff 100%);
}

.duplicate-job-bottom-note__status {
  gap: 10px;
  flex-wrap: wrap;
}

.duplicate-job-bottom-note__status strong {
  color: #1b2647;
  font-size: 14px;
}

.duplicate-job-bottom-note__dot {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
  background: #ecfdf3;
}

.duplicate-job-summary-card {
  padding: 18px;
  border: 1px solid #f1d8e6;
  border-radius: 18px;
  display: grid;
  gap: 18px;
  background: linear-gradient(180deg, #fffafb 0%, #ffffff 100%);
}

.duplicate-job-summary-card h3 {
  margin: 0;
  color: #1b2647;
  font-size: 16px;
  font-weight: 800;
}

.duplicate-job-summary-card__group {
  display: grid;
  gap: 6px;
}

.duplicate-job-summary-card__group + .duplicate-job-summary-card__group {
  padding-top: 16px;
  border-top: 1px solid #f1e4ec;
}

.duplicate-job-summary-card__label {
  color: #1b2647;
  font-size: 13px;
  font-weight: 800;
}

.duplicate-job-summary-card__label--pink {
  color: #ff4d9d;
}

.duplicate-job-summary-card__group strong {
  color: #1b2647;
  font-size: 15px;
  font-weight: 800;
}

.duplicate-job-summary-card__group small {
  color: #7a879d;
  font-size: 13px;
}

.duplicate-job-summary-card__badge {
  min-width: 24px;
  height: 24px;
  padding: 0 7px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #ecfdf3;
  font-size: 12px;
  font-weight: 800;
}

.duplicate-job-preview-list,
.duplicate-job-duplicate-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.duplicate-job-preview-list li,
.duplicate-job-duplicate-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #445166;
  font-size: 13px;
  font-weight: 600;
}

.duplicate-job-preview-list li :deep(svg) {
  color: #f472b6;
  flex-shrink: 0;
}

.duplicate-job-duplicate-list__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
  flex-shrink: 0;
}

.duplicate-job-insight {
  padding: 14px;
  border: 1px solid #f1d8e6;
  border-radius: 16px;
  display: grid;
  gap: 8px;
  background: #fff8fb;
}

.duplicate-job-insight__head {
  gap: 8px;
  color: #ff4d9d;
  font-size: 13px;
  font-weight: 800;
}

.duplicate-job-insight p {
  margin: 0;
  color: #6f7d94;
  font-size: 13px;
  line-height: 1.55;
}

.share-job-layer {
  position: fixed;
  inset: 0;
  z-index: 90;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(242, 245, 251, 0.78);
  backdrop-filter: blur(8px);
}

.share-job-modal {
  width: min(680px, 100%);
  max-height: calc(100vh - 64px);
  border: 1px solid #edf1f8;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.share-job-modal__head,
.share-job-modal__footer,
.share-job-modal__title-wrap,
.share-job-linkbox,
.share-job-section__head,
.share-job-option,
.share-job-option__copy,
.share-job-alert {
  display: flex;
  align-items: center;
}

.share-job-modal__head,
.share-job-modal__footer,
.share-job-linkbox,
.share-job-section__head,
.share-job-option {
  justify-content: space-between;
}

.share-job-modal__head,
.share-job-modal__body,
.share-job-modal__footer {
  padding-left: 24px;
  padding-right: 24px;
}

.share-job-modal__head {
  padding-top: 24px;
  padding-bottom: 22px;
  border-bottom: 1px solid #edf1f8;
}

.share-job-modal__body {
  min-height: 0;
  padding-top: 24px;
  padding-bottom: 24px;
  display: grid;
  gap: 28px;
  overflow-y: auto;
}

.share-job-modal__footer {
  padding-top: 22px;
  padding-bottom: 22px;
  border-top: 1px solid #edf1f8;
  justify-content: flex-end;
}

.share-job-modal__title-wrap {
  gap: 14px;
}

.share-job-modal__title-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4d9d;
  background: #fff0f7;
}

.share-job-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.share-job-modal__title-wrap p,
.share-job-section > p,
.share-job-option__copy small {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
  line-height: 1.6;
}

.share-job-modal__close,
.share-job-modal__secondary {
  border: 1px solid #dde6f2;
  background: #fff;
  color: #627189;
}

.share-job-modal__close {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.share-job-section {
  display: grid;
  gap: 16px;
}

.share-job-section h3 {
  margin: 0;
  color: #1b2647;
  font-size: 18px;
  font-weight: 800;
}

.share-job-section__head h3 {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 17px;
}

.share-job-section__head span {
  color: #8a97ab;
  font-size: 12px;
  font-weight: 700;
}

.share-job-linkbox {
  gap: 10px;
}

.share-job-linkfield {
  min-width: 0;
  flex: 1 1 auto;
  border: 1px solid #dde6f2;
  border-radius: 14px;
  background: #fbfcff;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8a97ab;
}

.share-job-linkfield input {
  width: 100%;
  border: 0;
  background: transparent;
  color: #45536d;
  font-size: 14px;
  line-height: 1.4;
  padding: 14px 0;
  outline: 0;
}

.share-job-copy,
.share-job-modal__secondary {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
}

.share-job-copy {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.22);
}

.share-job-alert {
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #d8f2df;
  border-radius: 14px;
  color: #179c56;
  background: #effcf3;
  font-size: 14px;
  font-weight: 700;
}

.share-job-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.share-job-channel {
  border: 1px solid #e6edf6;
  border-radius: 16px;
  background: #fff;
  padding: 16px 14px;
  display: grid;
  place-items: center;
  gap: 12px;
  color: #45536d;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}

.share-job-channel__badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
}

.share-job-channel__badge.is-linkedin {
  color: #0a66c2;
  background: #eef6ff;
}

.share-job-channel__badge.is-green {
  color: #16a34a;
  background: #eefcf3;
}

.share-job-channel__badge.is-pink {
  color: #f24193;
  background: #fff0f7;
}

.share-job-channel__badge.is-indigo {
  color: #4f46e5;
  background: #eef2ff;
}

.share-job-channel__badge.is-blue {
  color: #2563eb;
  background: #eff6ff;
}

.share-job-channel__badge.is-dark {
  color: #111827;
  background: #f3f4f6;
}

.share-job-channel__badge.is-muted,
.share-job-channel__badge.is-slate {
  color: #64748b;
  background: #f8fafc;
}

.share-job-options {
  display: grid;
  gap: 12px;
}

.share-job-option {
  gap: 14px;
  border: 1px solid #e6edf6;
  border-radius: 16px;
  background: #fff;
  padding: 16px;
  color: #1b2647;
}

.share-job-option__icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #5b6cf5;
  background: #eef2ff;
}

.share-job-option__copy {
  min-width: 0;
  flex: 1 1 auto;
  align-items: flex-start;
  gap: 4px;
  flex-direction: column;
}

.share-job-option__copy strong {
  color: #1b2647;
  font-size: 16px;
  font-weight: 800;
}

.schedule-modal-layer {
  position: fixed;
  inset: 0;
  z-index: 90;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(242, 245, 251, 0.92);
  backdrop-filter: blur(5px);
}

.schedule-modal {
  width: min(900px, 100%);
  max-height: calc(100vh - 64px);
  border: 1px solid #edf1f8;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.schedule-modal__head,
.schedule-modal__footer,
.schedule-toolbar,
.schedule-card__main,
.schedule-card__footer,
.schedule-card__person,
.schedule-card__actions,
.schedule-modal__title-wrap,
.schedule-modal__summary {
  display: flex;
  align-items: center;
}

.schedule-modal__head,
.schedule-modal__footer,
.schedule-toolbar,
.schedule-card__footer {
  justify-content: space-between;
  gap: 18px;
}

.schedule-modal__title-wrap,
.schedule-card__person,
.schedule-modal__summary {
  gap: 14px;
}

.schedule-modal__head,
.schedule-toolbar,
.schedule-list,
.schedule-modal__footer {
  padding-left: 32px;
  padding-right: 32px;
}

.schedule-modal__head {
  padding-top: 30px;
  padding-bottom: 22px;
}

.schedule-modal__title-icon,
.schedule-modal__summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4d9d;
  background: #fff0f7;
}

.schedule-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.schedule-modal__title-wrap p,
.schedule-modal__summary span {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
}

.schedule-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a0abc0;
  background: transparent;
}

.schedule-toolbar {
  padding-top: 18px;
  padding-bottom: 6px;
  border-top: 1px solid #edf1f8;
  border-bottom: 1px solid #edf1f8;
}

.schedule-tabs {
  display: flex;
  align-items: center;
  gap: 28px;
}

.schedule-tab {
  position: relative;
  padding: 0 0 14px;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #627189;
  font-size: 12px;
  font-weight: 700;
}

.schedule-tab::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  border-radius: 999px;
  background: transparent;
}

.schedule-tab.is-active {
  color: #ff2f7d;
}

.schedule-tab.is-active::after {
  background: #ff2f7d;
}

.schedule-tab__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.schedule-tab__dot.is-orange {
  background: #ff9734;
}

.schedule-tab__dot.is-green {
  background: #22c55e;
}

.schedule-sort {
  min-width: 220px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.schedule-sort > span {
  color: #6f7d94;
  font-size: 12px;
  font-weight: 700;
}

.schedule-sort :deep(.app-select-trigger) {
  min-width: 150px;
  min-height: 42px;
  border-radius: 12px;
  font-size: 13px;
}

.schedule-list {
  min-height: 0;
  padding-top: 22px;
  padding-bottom: 22px;
  display: grid;
  gap: 18px;
  overflow-y: auto;
}

.schedule-card {
  border: 1px solid #dde6f2;
  border-radius: 18px;
  background: #fff;
  padding: 24px;
  display: grid;
  gap: 20px;
}

.schedule-card__main {
  align-items: flex-start;
  justify-content: space-between;
  gap: 22px;
}

.schedule-card__avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  flex-shrink: 0;
}

.schedule-card__copy {
  display: grid;
  gap: 6px;
}

.schedule-card__copy strong,
.schedule-card__meta strong,
.schedule-modal__summary strong {
  color: #1b2647;
  font-size: 14px;
  font-weight: 800;
}

.schedule-card__copy span,
.schedule-card__meta span {
  color: #627189;
  font-size: 12px;
}

.schedule-card__copy small,
.schedule-card__meta label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
}

.schedule-card__meta label {
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.schedule-card__meta-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.schedule-card__meta {
  display: grid;
  gap: 5px;
}

.schedule-card__footer {
  padding-top: 20px;
  border-top: 1px solid #edf1f8;
}

.schedule-card__note {
  min-height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}

.schedule-card__note--blue {
  color: #315edb;
  background: #edf4ff;
}

.schedule-card__note--pink {
  color: #f24193;
  background: #fff0f7;
}

.schedule-card__actions {
  gap: 12px;
}

.schedule-card__ghost,
.schedule-card__primary,
.schedule-modal__ghost {
  min-width: 100px;
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.schedule-card__ghost,
.schedule-modal__ghost {
  border: 1px solid #dde6f2;
  color: #1b2647;
  background: #fff;
}

.schedule-card__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

.schedule-card__primary.is-outline {
  border: 1px solid #f5bfd7;
  color: #f24193;
  background: #fff;
}

.schedule-modal__footer {
  padding-top: 22px;
  padding-bottom: 30px;
  border-top: 1px solid #edf1f8;
}

.closing-soon-layer {
  position: fixed;
  inset: 0;
  z-index: 91;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(242, 245, 251, 0.92);
  backdrop-filter: blur(5px);
}

.closing-soon-modal {
  width: min(1120px, 100%);
  max-height: calc(100vh - 64px);
  border: 1px solid #edf1f8;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
  display: grid;
  gap: 20px;
  overflow-y: auto;
}

.closing-soon-modal__head,
.closing-soon-modal__footer,
.closing-soon-row,
.closing-soon-row__job,
.closing-soon-row__actions,
.closing-soon-modal__title-wrap,
.closing-soon-footer-buttons,
.closing-soon-footer-actions,
.closing-soon-footer-card,
.closing-soon-note,
.closing-soon-summary__card {
  display: flex;
  align-items: center;
}

.closing-soon-modal__head,
.closing-soon-modal__footer,
.closing-soon-row {
  justify-content: space-between;
  gap: 18px;
}

.closing-soon-modal__title-wrap,
.closing-soon-row__job,
.closing-soon-footer-card,
.closing-soon-note,
.closing-soon-summary__card {
  gap: 14px;
}

.closing-soon-modal__head,
.closing-soon-summary,
.closing-soon-table,
.closing-soon-note,
.closing-soon-modal__footer {
  margin: 0 32px;
}

.closing-soon-modal__head {
  padding-top: 30px;
}

.closing-soon-modal__title-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4d9d;
  background: #fff0f7;
}

.closing-soon-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1b2647;
  font-size: 22px;
  font-weight: 800;
}

.closing-soon-modal__title-wrap p {
  margin: 0;
  color: #6f7d94;
  font-size: 14px;
}

.closing-soon-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a0abc0;
  background: transparent;
}

.closing-soon-summary {
  padding: 18px;
  border: 1px solid #edf1f8;
  border-radius: 22px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.closing-soon-summary__card {
  min-width: 0;
  padding: 18px 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
}

.closing-soon-summary__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.closing-soon-summary__copy {
  display: grid;
  gap: 3px;
}

.closing-soon-summary__copy strong {
  font-size: 18px;
  font-weight: 800;
}

.closing-soon-summary__copy span {
  color: #1b2647;
  font-size: 13px;
  font-weight: 700;
}

.closing-soon-summary__copy small {
  color: #8a97ac;
  font-size: 12px;
}

.closing-soon-table {
  display: grid;
}

.closing-soon-table__head,
.closing-soon-row {
  display: grid;
  grid-template-columns: 2.1fr 1.1fr 1.3fr 1.1fr 1.1fr 1.6fr;
  gap: 18px;
}

.closing-soon-table__head {
  padding: 0 0 14px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
}

.closing-soon-row {
  padding: 24px 0;
  border-top: 1px solid #edf1f8;
}

.closing-soon-row__avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  flex-shrink: 0;
}

.closing-soon-row__copy,
.closing-soon-row__metric,
.closing-soon-row__status,
.closing-soon-footer-card__copy {
  display: grid;
  gap: 4px;
}

.closing-soon-row__copy strong,
.closing-soon-row__metric strong,
.closing-soon-row__status strong,
.closing-soon-footer-card__copy strong {
  color: #1b2647;
  font-size: 14px;
  font-weight: 800;
}

.closing-soon-row__copy span,
.closing-soon-row__metric small,
.closing-soon-row__status small,
.closing-soon-footer-card__copy span {
  color: #8a97ac;
  font-size: 12px;
}

.closing-soon-row__metric strong.is-pink,
.closing-soon-row__status strong.is-pink {
  color: #ef4444;
}

.closing-soon-row__metric strong.is-orange,
.closing-soon-row__status strong.is-orange {
  color: #f97316;
}

.closing-soon-row__pill {
  width: fit-content;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
}

.closing-soon-row__pill--pink {
  color: #c0266d;
  background: #fae0ee;
}

.closing-soon-row__pill--orange {
  color: #c76a00;
  background: #fde9c8;
}

.closing-soon-row__pill--yellow {
  color: #a16207;
  background: #fef3c7;
}

.closing-soon-row__actions {
  justify-content: flex-end;
  gap: 10px;
}

.closing-soon-row__button {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  background: #fff;
}

.closing-soon-row__button.is-pink {
  color: #f24193;
  border-color: #f5bfd7;
}

.closing-soon-row__button.is-orange {
  color: #f97316;
  border-color: #fdba74;
}

.closing-soon-row__button.is-blue {
  color: #2563eb;
  border-color: #93c5fd;
}

.closing-soon-row__more {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
}

.closing-soon-note {
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid #dbe5ff;
  border-radius: 12px;
  color: #4f46e5;
  background: #f5f7ff;
  font-size: 13px;
  font-weight: 600;
}

.closing-soon-modal__footer {
  padding: 22px 0 30px;
  border-top: 1px solid #edf1f8;
}

.closing-soon-footer-actions {
  gap: 16px;
}

.closing-soon-footer-card {
  min-width: 180px;
  padding: 14px 16px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
}

.closing-soon-footer-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.closing-soon-footer-buttons {
  gap: 14px;
}

.closing-soon-footer-buttons__ghost,
.closing-soon-footer-buttons__primary {
  min-width: 160px;
  height: 48px;
  padding: 0 20px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.closing-soon-footer-buttons__ghost {
  border: 1px solid #dde6f2;
  color: #1b2647;
  background: #fff;
}

.closing-soon-footer-buttons__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

.filter-modal-layer {
  position: fixed;
  inset: 0;
  z-index: 90;
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(135, 144, 161, 0.38);
  backdrop-filter: blur(4px);
}

.filter-modal {
  width: min(860px, 100%);
  max-height: calc(100vh - 56px);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.filter-modal__head,
.filter-modal__footer,
.filter-block__head,
.filter-modal__footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-modal__head {
  padding: 22px 30px;
  border-bottom: 1px solid #eef2f8;
}

.filter-modal__title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.filter-modal__title-icon {
  color: #f24193;
}

.filter-modal__title-wrap h2 {
  margin: 0 0 4px;
  color: #1c2648;
  font-size: 22px;
  font-weight: 800;
}

.filter-modal__title-wrap p {
  margin: 0;
  color: #6f7d94;
  font-size: 13px;
}

.filter-modal__close {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9aa6bb;
  background: transparent;
}

.filter-modal__body {
  min-height: 0;
  padding: 22px 30px 24px;
  overflow-y: auto;
  display: grid;
  gap: 28px;
}

.filter-block {
  display: grid;
  gap: 14px;
}

.filter-block h3 {
  margin: 0;
  color: #1f294a;
  font-size: 14px;
  font-weight: 800;
}

.filter-collapse,
.filter-clear {
  border: 0;
  background: transparent;
  color: #95a1b6;
  font-size: 12px;
  font-weight: 700;
}

.filter-clear {
  color: #f268b1;
}

.filter-quick-row,
.filter-active-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-quick-chip,
.filter-active-chip {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dde6f1;
  border-radius: 10px;
  background: #fff;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #384660;
  font-size: 12px;
}

.filter-active-chip {
  min-height: 30px;
  padding: 0 12px;
  color: #2563eb;
  background: #eef5ff;
  border-color: #d4e5ff;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px 16px;
}

.filter-field {
  display: grid;
  gap: 8px;
}

.filter-field label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #44526b;
  font-size: 12px;
  font-weight: 600;
}

.filter-field label :deep(svg) {
  color: #9aa6bb;
}

.filter-field :deep(.app-select-trigger) {
  min-height: 44px;
  border-radius: 10px;
  font-size: 13px;
}

.filter-add {
  width: fit-content;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f268b1;
  font-size: 13px;
  font-weight: 700;
}

.filter-modal__footer {
  padding: 22px 30px;
  border-top: 1px solid #eef2f8;
}

.filter-modal__footer-actions {
  gap: 10px;
}

.filter-footer-button {
  min-width: 90px;
  height: 42px;
  padding: 0 18px;
  border: 1px solid #dbe4ef;
  border-radius: 10px;
  background: #fff;
  color: #34425e;
  font-size: 13px;
  font-weight: 700;
}

.filter-footer-button--primary {
  min-width: 150px;
  color: #fff;
  border-color: transparent;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1220px) {
  .jobs-page__content {
    grid-template-columns: 1fr;
  }

  .jobs-page__side {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .briefing-glance,
  .briefing-section__head,
  .briefing-highlight-card__top,
  .briefing-highlight-card__footer,
  .briefing-good-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .briefing-highlight-grid {
    grid-template-columns: 1fr;
  }

  .briefing-risk-card {
    grid-template-columns: 1fr 1fr;
  }

  .board-view {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 960px) {
  .stats-grid,
  .jobs-page__side,
  .brief-view,
  .board-view {
    grid-template-columns: 1fr 1fr;
  }

  .briefing-glance__stats,
  .briefing-metrics {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .briefing-glance__ring {
    justify-self: start;
  }

  .briefing-risk-card {
    grid-template-columns: 1fr;
  }

  .filter-grid {
    grid-template-columns: 1fr 1fr;
  }

  .jobs-hero,
  .jobs-board__footer,
  .jobs-board__top,
  .health-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .jobs-board__footer-select {
    margin-left: 0;
  }

  .review-summary {
    grid-template-columns: 1fr 1fr;
  }

  .review-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .review-row__actions {
    width: 100%;
    align-items: flex-start;
  }

  .send-reminder-section__head,
  .send-reminder-row,
  .send-reminder-add,
  .send-reminder-modal__footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .send-reminder-row__task,
  .send-reminder-row__status {
    min-width: 0;
    width: 100%;
    justify-content: flex-start;
    text-align: left;
  }

  .duplicate-job-form,
  .duplicate-job-advanced__body,
  .duplicate-job-copy__grid {
    grid-template-columns: 1fr 1fr;
  }

  .duplicate-job-advanced-screen {
    grid-template-columns: 1fr;
  }

  .duplicate-job-advanced-screen__aside {
    position: static;
  }

  .reschedule-publication-content {
    grid-template-columns: 1fr;
  }

  .reschedule-publication-channels {
    grid-template-columns: 1fr 1fr;
  }

  .reschedule-success-timeline {
    grid-template-columns: 1fr;
  }

  .reschedule-success-timeline__line {
    display: none;
  }

  .reschedule-success-channels__grid {
    grid-template-columns: 1fr 1fr;
  }

  .pause-job-reasons {
    grid-template-columns: 1fr 1fr;
  }

  .pause-success-summary {
    grid-template-columns: 1fr;
  }

  .pause-success-summary__cell + .pause-success-summary__cell {
    border-top: 1px solid #edf1f8;
    border-left: 0;
  }

  .attention-overview-modal {
    width: min(1100px, calc(100vw - 32px));
  }

  .attention-overview-stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .attention-overview-content {
    grid-template-columns: 1fr;
  }

  .attention-overview-cards {
    grid-template-columns: 1fr 1fr;
  }

  .action-plan-impact__grid {
    grid-template-columns: 1fr;
  }

  .action-plan-toolbar,
  .action-plan-modal__footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .action-plan-list__head {
    display: none;
  }

  .action-plan-row {
    grid-template-columns: 38px 1fr;
  }

  .action-plan-row__action,
  .action-plan-row__meta,
  .action-plan-row__button {
    grid-column: 2;
  }

  .action-plan-feedback-layout {
    grid-template-columns: 1fr;
  }

  .action-plan-feedback-candidates {
    border-right: 0;
    border-bottom: 1px solid #edf2f8;
    padding-right: 0;
    padding-bottom: 18px;
  }

  .action-plan-feedback-aside {
    padding-left: 0;
  }

  .action-plan-compose__layout,
  .action-plan-compose__editor-layout {
    grid-template-columns: 1fr;
  }

  .action-plan-compose__bottom {
    flex-direction: column;
  }

  .action-plan-compose__type-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .action-plan-approval-card__reason-grid {
    grid-template-columns: 1fr;
  }

  .action-plan-approval-card__assignments {
    grid-template-columns: 1fr;
  }

  .action-plan-feedback-candidate {
    flex-wrap: wrap;
  }

  .action-plan-feedback-candidate__actions {
    width: 100%;
    margin-left: 0;
  }

  .copilot-job-suggestions {
    grid-template-columns: 1fr 1fr;
  }

  .copilot-job-summary__columns,
  .copilot-job-summary__metrics {
    grid-template-columns: 1fr;
  }

  .copilot-job-summary__column + .copilot-job-summary__column {
    border-top: 1px solid #edf1f8;
    border-left: 0;
  }

  .duplicate-job-panel__grid--four,
  .duplicate-job-panel__grid--three,
  .duplicate-job-publish-grid {
    grid-template-columns: 1fr 1fr;
  }

  .duplicate-job-panel__split,
  .duplicate-job-checkbox-group {
    grid-template-columns: 1fr;
  }

  .duplicate-job-visibility,
  .duplicate-job-workflow {
    padding-left: 0;
    border-left: 0;
    border-top: 1px solid #edf1f8;
    padding-top: 16px;
  }

  .schedule-toolbar,
  .schedule-card__main,
  .schedule-card__footer,
  .schedule-modal__footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .schedule-sort {
    min-width: 0;
    width: 100%;
    justify-content: flex-start;
  }

  .schedule-card__meta-grid {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .closing-soon-summary {
    grid-template-columns: 1fr 1fr;
  }

  .closing-soon-table__head {
    display: none;
  }

  .closing-soon-row {
    grid-template-columns: 1fr;
  }

  .closing-soon-modal__footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .closing-soon-footer-actions,
  .closing-soon-footer-buttons {
    width: 100%;
    flex-wrap: wrap;
  }

  .feedback-success-modal {
    padding: 28px 20px 24px;
  }

  .feedback-success-modal h2 {
    font-size: 22px;
  }

  .feedback-success-modal p {
    font-size: 14px;
  }
}

@media (max-width: 720px) {
  .jobs-page {
    padding: 14px;
  }

  .stats-grid,
  .jobs-page__side,
  .brief-view,
  .board-view {
    grid-template-columns: 1fr;
  }

  .briefing-glance__stats,
  .briefing-metrics {
    grid-template-columns: 1fr;
  }

  .board-tools {
    width: 100%;
    flex-wrap: wrap;
  }

  .attention-overview-layer {
    padding: 12px;
  }

  .attention-overview-modal {
    width: min(100%, calc(100vw - 24px));
    max-height: calc(100vh - 24px);
    border-radius: 22px;
  }

  .attention-overview-modal__head,
  .attention-overview-modal__body,
  .attention-overview-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .attention-overview-modal__head,
  .attention-overview-modal__footer,
  .attention-overview-modal__title-wrap,
  .attention-overview-modal__head-actions,
  .attention-overview-cards__footer,
  .attention-overview-card__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .attention-overview-modal__primary,
  .attention-overview-modal__secondary,
  .attention-overview-sidecard__apply,
  .attention-overview-sidecard__outline {
    width: 100%;
    justify-content: center;
  }

  .attention-overview-stats,
  .attention-overview-cards,
  .attention-overview-card__stats {
    grid-template-columns: 1fr;
  }

  .attention-overview-pagination {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .action-plan-layer {
    padding: 12px;
  }

  .action-plan-modal {
    width: min(100%, calc(100vw - 24px));
    max-height: calc(100vh - 24px);
    border-radius: 22px;
  }

  .action-plan-modal__head,
  .action-plan-modal__body,
  .action-plan-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .action-plan-modal__head,
  .action-plan-modal__title-wrap,
  .action-plan-impact__head,
  .action-plan-toolbar,
  .action-plan-filters,
  .action-plan-pagination {
    align-items: stretch;
    flex-direction: column;
  }

  .action-plan-filters {
    width: 100%;
  }

  .action-plan-list__head {
    display: none;
  }

  .action-plan-row {
    grid-template-columns: 1fr;
  }

  .action-plan-row__icon,
  .action-plan-row__action,
  .action-plan-row__meta,
  .action-plan-row__button {
    grid-column: auto;
  }

  .action-plan-modal__primary {
    width: 100%;
    justify-content: center;
  }

  .action-plan-feedback-layer {
    padding: 12px;
  }

  .action-plan-feedback-modal {
    width: min(100%, calc(100vw - 24px));
    max-height: calc(100vh - 24px);
    border-radius: 22px;
  }

  .action-plan-feedback-modal--compose {
    width: min(100%, calc(100vw - 20px));
  }

  .action-plan-feedback-modal__head,
  .action-plan-feedback-modal__body,
  .action-plan-feedback-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .action-plan-feedback-modal__head,
  .action-plan-feedback-modal__title-wrap,
  .action-plan-feedback-summary,
  .action-plan-feedback-candidates__head,
  .action-plan-feedback-candidates__controls,
  .action-plan-feedback-modal__footer,
  .action-plan-feedback-modal__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .action-plan-feedback-summary__item,
  .action-plan-feedback-summary__priority {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    border-left: 0;
  }

  .action-plan-feedback-summary__item + .action-plan-feedback-summary__item,
  .action-plan-feedback-summary__priority {
    border-top: 1px solid #edf2f8;
    margin-top: 12px;
    padding-top: 12px;
  }

  .action-plan-feedback-candidate {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr);
    align-items: start;
  }

  .action-plan-feedback-check--row {
    margin-top: 14px;
  }

  .action-plan-feedback-candidate__identity,
  .action-plan-feedback-candidate__stage,
  .action-plan-feedback-candidate__meta,
  .action-plan-feedback-candidate__actions {
    width: 100%;
  }

  .action-plan-feedback-candidate__stage,
  .action-plan-feedback-candidate__meta,
  .action-plan-feedback-candidate__actions {
    grid-column: 1 / -1;
  }

  .action-plan-feedback-candidate__actions {
    margin-top: 10px;
  }

  .action-plan-feedback-candidate__button,
  .action-plan-feedback-modal__secondary,
  .action-plan-feedback-modal__primary,
  .action-plan-feedback-candidates__sort {
    width: 100%;
    justify-content: center;
  }

  .action-plan-compose__topbar,
  .action-plan-compose__body,
  .action-plan-compose__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .action-plan-compose__topbar,
  .action-plan-compose__topbar-actions,
  .action-plan-compose__footer,
  .action-plan-compose__footer-actions,
  .action-plan-compose__section-head {
    align-items: stretch;
    flex-direction: column;
  }

  .action-plan-compose__ghost,
  .action-plan-compose__primary,
  .action-plan-compose__secondary,
  .action-plan-compose__manage {
    width: 100%;
  }

  .action-plan-compose__type-grid {
    grid-template-columns: 1fr;
  }

  .action-plan-approval-layer {
    padding: 12px;
  }

  .action-plan-approval-modal {
    width: min(100%, calc(100vw - 24px));
    max-height: calc(100vh - 24px);
    border-radius: 22px;
  }

  .action-plan-approval-modal__head,
  .action-plan-approval-modal__body,
  .action-plan-approval-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .action-plan-approval-modal__head,
  .action-plan-approval-modal__footer,
  .action-plan-approval-toolbar,
  .action-plan-approval-toolbar__actions,
  .action-plan-approval-modal__footer-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .action-plan-approval-summary {
    display: grid;
    grid-template-columns: 1fr;
  }

  .action-plan-approval-summary__item + .action-plan-approval-summary__item {
    border-top: 0;
  }

  .action-plan-approval-card__row {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr);
    align-items: start;
  }

  .action-plan-approval-card__meta,
  .action-plan-approval-card__decision {
    grid-column: 2 / -1;
  }

  .action-plan-approval-card__expand {
    grid-column: 1 / -1;
    justify-self: end;
  }

  .action-plan-approval-card__decision-button,
  .action-plan-approval-modal__secondary,
  .action-plan-approval-modal__warning,
  .action-plan-approval-modal__danger,
  .action-plan-approval-modal__primary {
    width: 100%;
  }

  .board-search {
    width: 100%;
  }

  .filter-modal-layer {
    padding: 14px;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .filter-modal__head,
  .filter-modal__body,
  .filter-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .filter-modal__footer {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }

  .filter-modal__footer-actions {
    width: 100%;
    justify-content: stretch;
    flex-direction: column;
  }

  .review-modal {
    padding: 20px 18px 22px;
    border-radius: 22px;
  }

  .review-summary {
    grid-template-columns: 1fr;
  }

  .review-summary__card + .review-summary__card {
    border-left: 0;
    border-top: 1px solid #edf1f8;
  }

  .review-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .review-modal__footer-actions {
    flex-direction: column;
    margin-left: 0;
  }

  .review-modal__ghost,
  .review-modal__primary,
  .review-modal__footer-actions .review-modal__ghost {
    width: 100%;
  }

  .complete-feedback-modal {
    border-radius: 22px;
  }

  .complete-feedback-modal__head,
  .complete-feedback-section,
  .complete-feedback-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .complete-feedback-modal__meta {
    padding-left: 18px;
    padding-right: 18px;
  }

  .complete-feedback-options,
  .complete-feedback-rating-row,
  .complete-feedback-modal__footer,
  .complete-feedback-modal__footer-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .complete-feedback-modal__secondary,
  .complete-feedback-modal__primary {
    width: 100%;
  }

  .send-reminder-modal {
    padding: 20px 18px 22px;
    border-radius: 22px;
  }

  .send-reminder-job,
  .send-reminder-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .send-reminder-row {
    margin: 0 18px;
  }

  .send-reminder-row__person {
    width: 100%;
  }

  .send-reminder-add__button,
  .send-reminder-modal__ghost,
  .send-reminder-modal__primary {
    width: 100%;
  }

  .review-candidates-email-layer {
    padding: 12px;
  }

  .review-candidates-email-modal {
    width: calc(100vw - 12px);
    max-height: calc(100vh - 12px);
    border-radius: 22px;
  }

  .review-candidates-email-modal__head,
  .review-candidates-email-modal__body,
  .review-candidates-email-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .review-candidates-email-profile,
  .review-candidates-email-profile__meta,
  .review-candidates-email-layout,
  .review-candidates-email-modal__footer,
  .review-candidates-email-modal__footer-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .review-candidates-email-layout {
    display: grid;
    grid-template-columns: 1fr;
  }

  .review-candidates-email-profile__meta {
    margin-left: 0;
    gap: 14px;
  }

  .review-candidates-email-compose__template-row {
    max-width: none;
  }

  .review-candidates-email-modal__ghost,
  .review-candidates-email-modal__primary {
    width: 100%;
  }

  .review-candidates-email-attachments__bar {
    grid-template-columns: 1fr;
  }

  .review-candidates-template-layer {
    padding: 12px;
  }

  .review-candidates-template-modal {
    width: calc(100vw - 12px);
    max-height: calc(100vh - 12px);
  }

  .review-candidates-template-modal__head,
  .review-candidates-template-modal__body,
  .review-candidates-template-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .review-candidates-template-modal__body {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .review-candidates-template-preview__meta {
    flex-direction: column;
  }

  .review-candidates-note-layer {
    padding: 12px;
  }

  .review-candidates-note-modal {
    width: calc(100vw - 12px);
    max-height: calc(100vh - 12px);
  }

  .review-candidates-note-modal__head,
  .review-candidates-note-modal__body,
  .review-candidates-note-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .review-candidates-note-grid,
  .review-candidates-note-reminder,
  .review-candidates-note-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .review-candidates-note-reminder :deep(.app-select) {
    width: 100%;
    flex: 1 1 auto;
  }

  .review-candidates-note-modal__secondary,
  .review-candidates-note-modal__primary {
    width: 100%;
  }

  .review-candidates-talent-layer {
    padding: 12px;
  }

  .review-candidates-talent-modal {
    width: calc(100vw - 12px);
    max-height: calc(100vh - 12px);
  }

  .review-candidates-talent-modal__head,
  .review-candidates-talent-modal__body,
  .review-candidates-talent-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .review-candidates-talent-summary,
  .review-candidates-talent-grid,
  .review-candidates-talent-bottom,
  .review-candidates-talent-reminder,
  .review-candidates-talent-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .review-candidates-talent-reminder :deep(.app-select) {
    width: 100%;
    flex: 1 1 auto;
  }

  .review-candidates-talent-modal__secondary,
  .review-candidates-talent-modal__primary {
    width: 100%;
  }

  .review-candidates-talent-success-layer {
    padding: 12px;
  }

  .review-candidates-talent-success-modal {
    width: calc(100vw - 12px);
  }

  .review-candidates-talent-success-modal__hero,
  .review-candidates-talent-success-modal__body,
  .review-candidates-talent-success-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .review-candidates-talent-success-modal__footer {
    grid-template-columns: 1fr;
  }

  .duplicate-job-modal {
    max-height: calc(100vh - 32px);
    border-radius: 22px;
  }

  .duplicate-job-modal__head,
  .duplicate-job-modal__body,
  .duplicate-job-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .duplicate-job-form,
  .duplicate-job-advanced__body {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .duplicate-job-copy__grid {
    grid-template-columns: 1fr;
  }

  .duplicate-job-source--advanced,
  .duplicate-job-section__head--with-action,
  .duplicate-job-bottom-note {
    align-items: flex-start;
    flex-direction: column;
  }

  .duplicate-job-source__action {
    width: 100%;
  }

  .duplicate-job-panel__grid--four,
  .duplicate-job-panel__grid--three,
  .duplicate-job-publish-grid {
    grid-template-columns: 1fr;
  }

  .duplicate-job-radio-row {
    min-height: 0;
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .duplicate-job-field--wide {
    grid-column: auto;
  }

  .duplicate-job-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .duplicate-job-modal__secondary,
  .duplicate-job-modal__primary {
    width: 100%;
  }

  .reschedule-publication-modal {
    max-height: calc(100vh - 32px);
    border-radius: 22px;
  }

  .reschedule-publication-modal__head,
  .reschedule-publication-modal__body,
  .reschedule-publication-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .reschedule-publication-source,
  .reschedule-publication-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .reschedule-publication-source__status {
    justify-items: start;
  }

  .reschedule-publication-modal__secondary,
  .reschedule-publication-modal__primary {
    width: 100%;
  }

  .reschedule-success-modal {
    padding: 24px 18px 22px;
    border-radius: 24px;
  }

  .reschedule-success-job__head,
  .reschedule-success-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .reschedule-success-job__status {
    justify-items: start;
  }

  .reschedule-success-actions__secondary,
  .reschedule-success-actions__primary {
    width: 100%;
  }

  .pause-job-modal {
    max-height: calc(100vh - 32px);
    border-radius: 22px;
  }

  .pause-job-modal__head,
  .pause-job-modal__body,
  .pause-job-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .pause-job-source,
  .pause-job-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .pause-job-modal__secondary,
  .pause-job-modal__primary {
    width: 100%;
  }

  .close-job-modal {
    max-height: calc(100vh - 32px);
    border-radius: 22px;
  }

  .close-job-modal__head,
  .close-job-modal__body,
  .close-job-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .close-job-source,
  .close-job-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .close-job-options {
    grid-template-columns: 1fr;
  }

  .close-job-modal__secondary,
  .close-job-modal__primary {
    width: 100%;
  }

  .archive-job-modal {
    max-height: calc(100vh - 32px);
    border-radius: 22px;
  }

  .archive-job-modal__head,
  .archive-job-modal__body,
  .archive-job-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .archive-job-source,
  .archive-job-banner,
  .archive-job-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .archive-job-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .archive-job-modal__secondary,
  .archive-job-modal__primary {
    width: 100%;
  }

  .pause-success-modal {
    padding: 24px 18px 22px;
    border-radius: 24px;
  }

  .pause-success-job__head,
  .pause-success-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .pause-success-actions__secondary,
  .pause-success-actions__primary {
    width: 100%;
  }

  .pause-success-actions__primary {
    margin-left: 0;
  }

  .copilot-job-modal {
    border-radius: 22px;
  }

  .copilot-job-modal__head,
  .copilot-job-modal__body,
  .copilot-job-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .copilot-job-modal__primary {
    width: 100%;
    min-width: 0;
  }

  .copilot-job-modal__footer.is-summary,
  .copilot-job-modal__summary-actions,
  .copilot-job-modal__footer-actions {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }

  .copilot-job-modal__secondary {
    width: 100%;
  }

  .duplicate-success-modal {
    padding: 24px 18px 22px;
    border-radius: 24px;
  }

  .duplicate-success-actions,
  .duplicate-success-card__head {
    align-items: stretch;
    flex-direction: column;
  }

  .duplicate-success-actions__secondary,
  .duplicate-success-actions__primary {
    width: 100%;
  }

  .share-job-modal {
    max-height: calc(100vh - 32px);
    border-radius: 22px;
  }

  .share-job-modal__head,
  .share-job-modal__body,
  .share-job-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .share-job-linkbox,
  .share-job-section__head {
    align-items: stretch;
    flex-direction: column;
  }

  .share-job-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .share-job-copy,
  .share-job-modal__secondary {
    width: 100%;
  }

  .share-job-option {
    align-items: flex-start;
  }

  .share-job-modal__footer {
    justify-content: stretch;
  }

  .schedule-modal {
    border-radius: 22px;
  }

  .schedule-modal__head,
  .schedule-toolbar,
  .schedule-list,
  .schedule-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .schedule-tabs {
    width: 100%;
    flex-wrap: wrap;
    gap: 14px 18px;
  }

  .schedule-card {
    padding: 18px;
  }

  .schedule-card__actions,
  .schedule-card__ghost,
  .schedule-card__primary,
  .schedule-modal__ghost {
    width: 100%;
  }

  .closing-soon-modal__head,
  .closing-soon-summary,
  .closing-soon-table,
  .closing-soon-note,
  .closing-soon-modal__footer {
    margin-left: 18px;
    margin-right: 18px;
  }

  .closing-soon-summary {
    grid-template-columns: 1fr;
  }

  .closing-soon-footer-card,
  .closing-soon-footer-buttons__ghost,
  .closing-soon-footer-buttons__primary {
    width: 100%;
  }

  .filter-footer-button,
  .filter-footer-button--primary {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 560px) {
  .duplicate-job-form,
  .duplicate-job-advanced__body,
  .duplicate-job-form--advanced {
    grid-template-columns: 1fr;
  }

  .duplicate-job-modal__title-wrap {
    align-items: flex-start;
  }

  .reschedule-publication-channels {
    grid-template-columns: 1fr;
  }

  .reschedule-publication-modal__title-wrap {
    align-items: flex-start;
  }

  .reschedule-success-modal__hero h2 {
    font-size: 22px;
  }

  .reschedule-success-channels__grid {
    grid-template-columns: 1fr;
  }

  .reschedule-success-job__copy small {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .reschedule-success-job__copy small span + span::before {
    display: none;
  }

  .pause-job-reasons {
    grid-template-columns: 1fr;
  }

  .pause-job-modal__title-wrap {
    align-items: flex-start;
  }

  .pause-success-modal__hero h2 {
    font-size: 22px;
  }

  .pause-success-job__copy small {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .pause-success-job__copy small span + span::before {
    display: none;
  }

  .copilot-job-suggestions {
    grid-template-columns: 1fr;
  }

  .copilot-job-modal__title-wrap {
    align-items: flex-start;
  }

  .copilot-job-asked {
    align-items: flex-start;
    flex-direction: column;
  }

  .copilot-job-asked small {
    margin-left: 0;
  }

  .duplicate-success-modal__hero h2 {
    font-size: 22px;
  }

  .duplicate-success-card__meta > span + span::before {
    display: none;
  }

  .duplicate-success-card__meta {
    gap: 8px 14px;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
