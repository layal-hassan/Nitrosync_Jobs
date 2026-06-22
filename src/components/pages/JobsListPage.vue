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
const reschedulePublicationModalOpen = ref(false)
const reschedulePublicationSuccessModalOpen = ref(false)
const pauseJobModalOpen = ref(false)
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
const shareJobTarget = ref(null)
const shareJobCopied = ref(false)

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
  closePauseJobModal()
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

  if (actionId === 'copy-link') {
    await copyText(getShareJobUrl(job))
  }

  closeRowMenu()
}

function handleDocumentPointerDown(event) {
  if (event.target.closest('.row-action')) {
    return
  }

  if (!actionMenuRef.value) {
    return
  }

  if (!actionMenuRef.value.contains(event.target)) {
    closeRowMenu()
  }
}

function handleEscape(event) {
  if (event.key === 'Escape') {
    closeRowMenu()
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
  }
}

function syncRowMenuPosition() {
  if (!actionMenu.value) {
    return
  }

  if (actionMenuRaf) {
    cancelAnimationFrame(actionMenuRaf)
  }

  actionMenuRaf = requestAnimationFrame(() => {
    actionMenuRaf = 0
    positionRowMenu()
  })
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
              <button type="button">View all</button>
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
      <div v-if="reviewFeedbackModalOpen" class="review-modal-layer" @click="closeReviewFeedbackModal">
        <div class="review-modal" @click.stop>
          <div class="review-modal__head">
            <div class="review-modal__title-wrap">
              <div class="review-modal__title-icon">
                <AppIcon name="mail" :size="18" />
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
                <button class="closing-soon-row__button" :class="`is-${job.actionTone}`" type="button">
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
  padding: 10px 0;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.14);
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
