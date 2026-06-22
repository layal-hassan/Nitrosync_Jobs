<script setup>
import { computed, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import { getJobById } from '../../data/jobs'

const props = defineProps({
  jobId: {
    type: String,
    required: true,
  },
  focusStage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['back'])

const job = computed(() => getJobById(props.jobId))

const stageFocusMap = {
  applied: 'new',
  screening: 'qualified',
  qualified: 'qualified',
  interview: 'shortlisted',
  shortlisted: 'shortlisted',
  assessment: 'assessment',
  validation: 'validation',
  offer: 'validation',
  hired: 'hired',
}

const activeColumnSlug = computed(() => stageFocusMap[props.focusStage] ?? '')
const activeBoardView = ref('board')
const activeAudienceView = ref('recruiter')

const pipelineColumns = computed(() => [
  {
    slug: 'new',
    title: 'New',
    count: job.value.pipeline[0]?.value ?? 12,
    average: '2.1 avg. days',
    health: 'Healthy',
    tone: 'green',
    cards: [
      { name: 'Ava Martinez', role: 'Product Designer', source: 'Dribbble', match: '92% match', note: 'Added 2 days ago' },
      { name: 'Liam Anderson', role: 'UX Designer', source: 'Behance', match: '88% match', note: 'Added 3 days ago' },
      { name: 'Noah Williams', role: 'Product Designer', source: 'LinkedIn', match: '78% match', note: 'Added 5 days ago' },
    ],
  },
  {
    slug: 'qualified',
    title: 'Qualified',
    count: job.value.pipeline[1]?.value ?? 10,
    average: '3.4 avg. days',
    health: 'At risk',
    tone: 'orange',
    cards: [
      { name: 'Isabella Chen', role: 'UX Designer', source: 'Airbnb', match: '90% match', note: 'Review pending' },
      { name: 'James Wilson', role: 'Product Designer', source: 'Google', match: '85% match', note: 'Review pending' },
      { name: 'Mia Brown', role: 'UX Designer', source: 'Meta', match: '80% match', note: 'Review pending' },
    ],
  },
  {
    slug: 'shortlisted',
    title: 'Shortlisted',
    count: job.value.pipeline[2]?.value ?? 8,
    average: '6.2 avg. days',
    health: 'Bottleneck',
    tone: 'pink',
    cards: [
      { name: 'Ethan Johnson', role: 'Senior UX Designer', source: 'Spotify', match: '93% match', note: 'Interview tomorrow' },
      { name: 'Olivia Davis', role: 'UX Designer', source: 'Shopify', match: '91% match', note: 'Interview in 3 days' },
      { name: 'Benjamin Lee', role: 'Product Designer', source: 'Adobe', match: '78% match', note: 'Interview in 3 days' },
    ],
  },
  {
    slug: 'assessment',
    title: 'Assessment',
    count: 5,
    average: '4.3 avg. days',
    health: 'Healthy',
    tone: 'green',
    cards: [
      { name: 'Charlotte Taylor', role: 'UX Designer', source: 'Microsoft', match: '92% match', note: 'Assessment due tomorrow' },
      { name: 'Daniel Harris', role: 'Product Designer', source: 'Amazon', match: '84% match', note: 'Assessment due in 2 days' },
    ],
  },
  {
    slug: 'validation',
    title: 'Validation',
    count: job.value.pipeline[3]?.value ?? 5,
    average: '1.6 avg. days',
    health: 'Good',
    tone: 'green',
    cards: [
      { name: 'Amelia Clark', role: 'Senior UX Designer', source: 'Monzo', match: '95% match', note: 'Offer sent' },
      { name: 'Lucas Rodriguez', role: 'UX Designer', source: 'Revolut', match: '89% match', note: 'Offer sent' },
    ],
  },
  {
    slug: 'hired',
    title: 'Hired',
    count: job.value.pipeline[4]?.value ?? 1,
    average: 'Latest',
    health: 'Completed',
    tone: 'green',
    cards: [
      { name: 'Grace Hall', role: 'Senior UX Designer', source: 'Wise', match: '', note: 'Joined 2 days ago' },
    ],
  },
])

const recruiterTabs = ['Pipeline', 'Candidates', 'Hiring Team', 'Analytics', 'More']
const managerTabs = ['Overview', 'Candidates', 'Interviews', 'Feedback', 'Decisions']
const boardViews = [
  { id: 'board', label: 'Board' },
  { id: 'list', label: 'List' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'workload', label: 'Workload' },
  { id: 'compare', label: 'Compare' },
]
const activeManagerTab = ref('Overview')
const activeAudienceTabs = computed(() => (activeAudienceView.value === 'recruiter' ? recruiterTabs : managerTabs))

const summaryStats = [
  { value: 5, label: 'Candidates need review', tone: 'slate' },
  { value: 3, label: 'Interviews need scheduling', tone: 'orange' },
  { value: 2, label: 'Hiring managers overdue', tone: 'pink' },
  { value: 1, label: 'Candidate ready for offer', tone: 'green' },
]

const copilotCards = [
  {
    tone: 'pink',
    title: 'Interview bottleneck',
    copy: 'Interview stage is taking longer than usual.',
    action: 'Fix bottleneck',
  },
  {
    tone: 'green',
    title: 'Top candidate',
    copy: 'Sarah Johnson\n92% match • High fit',
    action: 'View profile',
  },
  {
    tone: 'orange',
    title: 'Risk of drop-off',
    copy: '3 candidates are at risk of dropping off.',
    action: 'Review at risk',
  },
  {
    tone: 'violet',
    title: 'Move candidates forward',
    copy: '3 candidates are ready to move to the next stage.',
    action: 'Review moves',
  },
]

const recommendationCards = [
  {
    title: 'Move 3 candidates forward',
    copy: 'These candidates are ready for the next stage.',
    metric: '+3',
    footer: 'Review candidates',
  },
  {
    title: 'Speed up interviews',
    copy: 'Suggest earlier availability to reduce wait time.',
    metric: '-2.1 days',
    footer: 'View interview plan',
  },
  {
    title: 'Re-engage cold candidates',
    copy: '12 qualified candidates in your talent pool.',
    metric: '12',
    footer: 'View matches',
  },
  {
    title: 'Optimize job visibility',
    copy: 'Increase views by updating job description.',
    metric: '+32%',
    footer: 'Optimize job',
  },
]

const forecastBars = [
  { label: 'May', value: 5 },
  { label: 'Jun', value: 7 },
  { label: 'Jul', value: 8 },
  { label: 'Aug', value: 6, accent: true },
]

const timelineSummaryCards = [
  { value: 48, label: 'Total candidates' },
  { value: 48, label: 'All candidates', tone: 'pink' },
  { value: 12, label: 'My candidates' },
  { value: 8, label: 'Ready for action' },
  { value: 6, label: 'At risk', tone: 'orange' },
]

const timelineStages = ['Applied', 'Screen', 'Hiring Manager Review', 'Interview', 'Assessment', 'Offer', 'Hired']

const timelineRows = [
  {
    name: 'Sarah Johnson',
    role: 'UX Designer at Shopify',
    match: '92% match',
    currentIndex: 3,
    milestone: 'Final interview',
    milestoneNote: 'Tomorrow',
    nextStep: 'Final interview with Maja A.',
    status: 'Ready for offer',
    statusMeta: '+92% confidence',
    tone: 'green',
  },
  {
    name: 'Daniel Brown',
    role: 'UX Designer at Airbnb',
    match: '89% match',
    currentIndex: 4,
    milestone: 'Waiting feedback',
    milestoneNote: '3 days overdue',
    nextStep: 'Review assessment results',
    status: 'At risk',
    statusMeta: 'Feedback overdue',
    tone: 'orange',
  },
  {
    name: 'Emily Smith',
    role: 'Product Designer at Canva',
    match: '87% match',
    currentIndex: 3,
    milestone: 'Assessment',
    milestoneNote: 'In progress',
    nextStep: 'Complete assessment',
    status: 'On track',
    statusMeta: 'Good progress',
    tone: 'green',
  },
  {
    name: 'James Wilson',
    role: 'Product Designer at Google',
    match: '85% match',
    currentIndex: 2,
    milestone: 'Manager review',
    milestoneNote: 'Overdue',
    nextStep: 'Hiring manager review',
    status: 'At risk',
    statusMeta: 'Waiting review',
    tone: 'orange',
  },
  {
    name: 'Olivia Davis',
    role: 'UX Designer at Figma',
    match: '82% match',
    currentIndex: 3,
    milestone: 'Interview scheduled',
    milestoneNote: 'May 21, 11:00 AM',
    nextStep: 'Interview with Hiring Manager',
    status: 'On track',
    statusMeta: 'Interview upcoming',
    tone: 'green',
  },
  {
    name: 'Benjamin Lee',
    role: 'Product Designer at Adobe',
    match: '78% match',
    currentIndex: 1,
    milestone: 'Screening call started',
    milestoneNote: '2 days overdue',
    nextStep: 'Screening call',
    status: 'At risk',
    statusMeta: 'Screening overdue',
    tone: 'orange',
  },
]

const timelineInsights = [
  { title: '6 candidates are at risk of dropping off', action: 'View at risk', tone: 'orange' },
  { title: '3 candidates ready for offer', action: 'Review offers', tone: 'violet' },
  { title: 'Average time in interview stage is 6.2 days', action: 'View insights', tone: 'pink' },
]

const timelineActivity = [
  { time: '11:02 AM', text: 'Sarah Johnson moved to Final interview', tone: 'violet' },
  { time: '9:15 AM', text: 'Emily Smith assessment completed', tone: 'green' },
  { time: '8:45 AM', text: 'Daniel Brown feedback overdue (3 days)', tone: 'orange' },
  { time: '8:30 AM', text: 'Interview scheduled for Olivia Davis', tone: 'violet' },
  { time: '4:20 PM', text: 'Offer sent to Amelia Clark', tone: 'green' },
]

const timelineQuickActions = [
  { label: 'Schedule interview', icon: 'calendar' },
  { label: 'Send assessment', icon: 'mail' },
  { label: 'Move candidates', icon: 'chevrons-right' },
  { label: 'Bulk update stage', icon: 'list' },
]

const listRows = [
  {
    name: 'Ava Martinez',
    role: 'Product Designer at Dribbble',
    stage: 'Sourced',
    stageTone: 'pink',
    match: '92%',
    status: 'Healthy',
    statusTone: 'green',
    lastActivity: 'Added by Noah Williams',
    lastActivityMeta: '2 days ago',
    nextStep: 'Review profile',
    nextStepMeta: 'Today',
    owner: 'Liam Anderson',
  },
  {
    name: 'Isabella Chen',
    role: 'UX Designer at Airbnb',
    stage: 'Screen',
    stageTone: 'orange',
    match: '90%',
    status: 'At risk',
    statusTone: 'orange',
    lastActivity: 'Screening completed',
    lastActivityMeta: '1 day ago',
    nextStep: 'Schedule interview',
    nextStepMeta: 'Tomorrow',
    owner: 'Mia Brown',
  },
  {
    name: 'Ethan Johnson',
    role: 'Senior UX Designer at Spotify',
    stage: 'Interview',
    stageTone: 'violet',
    match: '93%',
    status: 'Bottleneck',
    statusTone: 'pink',
    lastActivity: 'Interview completed',
    lastActivityMeta: '3 hours ago',
    nextStep: 'Interview tomorrow',
    nextStepMeta: 'Tomorrow 10:00 AM',
    owner: 'Olivia Davis',
  },
  {
    name: 'Charlotte Taylor',
    role: 'UX Designer at Microsoft',
    stage: 'Assessment',
    stageTone: 'violet',
    match: '93%',
    status: 'Healthy',
    statusTone: 'green',
    lastActivity: 'Assessment sent',
    lastActivityMeta: '1 day ago',
    nextStep: 'Assessment due',
    nextStepMeta: 'Tomorrow',
    owner: 'Daniel Harris',
  },
  {
    name: 'Amelia Clark',
    role: 'Senior UX Designer at Monzo',
    stage: 'Offer',
    stageTone: 'green',
    match: '95%',
    status: 'Good',
    statusTone: 'green',
    lastActivity: 'Offer sent',
    lastActivityMeta: '1 day ago',
    nextStep: 'Awaiting response',
    nextStepMeta: '-',
    owner: 'Lucas Rodriguez',
  },
  {
    name: 'Grace Hall',
    role: 'Senior UX Designer at Wise',
    stage: 'Hired',
    stageTone: 'slate',
    match: '-',
    status: 'Completed',
    statusTone: 'green',
    lastActivity: 'Joined the team',
    lastActivityMeta: '2 days ago',
    nextStep: 'Onboarding',
    nextStepMeta: 'In progress',
    owner: 'Grace Hall',
  },
]

const workloadSummaryCards = [
  { title: 'Team capacity', value: '82%', meta: 'Healthy', note: 'Optimal range: 70% - 90%', tone: 'green', icon: 'users' },
  { title: 'Pending reviews', value: '12', meta: '5 overdue', note: 'Avg. response time: 1.6 days', tone: 'orange', icon: 'clipboard-check' },
  { title: 'Overloaded members', value: '2', meta: 'Need attention', note: '> 90% capacity', tone: 'pink', icon: 'alert' },
  { title: 'Estimated delay', value: '4 days', meta: 'High risk', note: 'Impacting 3 roles', tone: 'orange', icon: 'alert' },
]

const recruiterWorkloadRows = [
  { name: 'Majda Ali', role: 'Senior Recruiter', activeJobs: '14', activeJobsMeta: '2', candidates: '156', candidatesMeta: '32', pendingReviews: '5', pendingReviewsMeta: '3 overdue', capacity: '92%', trend: [8, 10, 6, 14, 11], tone: 'pink', status: 'Overloaded' },
  { name: 'Emma Johnson', role: 'Recruiter', activeJobs: '8', activeJobsMeta: '1', candidates: '87', candidatesMeta: '10', pendingReviews: '2', pendingReviewsMeta: '0 overdue', capacity: '58%', trend: [4, 5, 4, 7, 6], tone: 'green', status: 'Balanced' },
  { name: 'Liam Patel', role: 'Senior Recruiter', activeJobs: '12', activeJobsMeta: '-', candidates: '104', candidatesMeta: '5', pendingReviews: '1', pendingReviewsMeta: '0 overdue', capacity: '75%', trend: [3, 2, 3, 4, 5], tone: 'orange', status: 'At capacity' },
  { name: 'Olivia Davis', role: 'Recruiter', activeJobs: '6', activeJobsMeta: '2', candidates: '62', candidatesMeta: '8', pendingReviews: '0', pendingReviewsMeta: '0 overdue', capacity: '45%', trend: [5, 6, 5, 4, 3], tone: 'green', status: 'Balanced' },
  { name: 'Noah Kim', role: 'Coordinator', activeJobs: '4', activeJobsMeta: '-', candidates: '31', candidatesMeta: '3', pendingReviews: '0', pendingReviewsMeta: '0 overdue', capacity: '32%', trend: [4, 3, 3, 2, 2], tone: 'violet', status: 'Under capacity' },
]

const hiringManagerWorkloadRows = [
  { name: 'Sarah Thompson', role: 'Design Director', waiting: '8', waitingMeta: '3', feedbackPending: '3', feedbackMeta: '2 overdue', interviews: '5', response: '2.4 days', tone: 'orange', status: 'At risk' },
  { name: 'Daniel Morgan', role: 'Product Manager', waiting: '2', waitingMeta: '1', feedbackPending: '0', feedbackMeta: '0 overdue', interviews: '2', response: '0.8 days', tone: 'green', status: 'Good' },
  { name: 'Emma Wilson', role: 'UX Lead', waiting: '6', waitingMeta: '2', feedbackPending: '2', feedbackMeta: '1 overdue', interviews: '4', response: '1.9 days', tone: 'orange', status: 'At risk' },
  { name: 'James Lee', role: 'Engineering Manager', waiting: '1', waitingMeta: '-', feedbackPending: '0', feedbackMeta: '0 overdue', interviews: '1', response: '0.6 days', tone: 'green', status: 'Good' },
  { name: 'Mia Anderson', role: 'Marketing Director', waiting: '0', waitingMeta: '-', feedbackPending: '0', feedbackMeta: '0 overdue', interviews: '0', response: '—', tone: 'green', status: 'Good' },
]

const workloadHeatmapRows = [
  { name: 'Majda Ali', cells: ['green', 'orange', 'red', 'red', 'orange'] },
  { name: 'Emma Johnson', cells: ['green', 'green', 'orange', 'orange', 'orange'] },
]

const workloadUpcomingItems = [
  { title: '18', label: 'Interviews', meta: '+6 vs last week', tone: 'green', icon: 'calendar', trend: [3, 8, 6, 10, 9] },
  { title: '12', label: 'Reviews', meta: '+3 vs last week', tone: 'orange', icon: 'clipboard-check', trend: [2, 3, 5, 6, 7] },
  { title: '4', label: 'Offers', meta: '+1 vs last week', tone: 'pink', icon: 'checkCircle', trend: [1, 2, 2, 4, 4] },
]

const workloadDayHeatmapRows = [
  { name: 'Majda Ali', cells: ['green', 'orange', 'orange', 'pink', 'red'] },
  { name: 'Emma Johnson', cells: ['green', 'green', 'orange', 'orange', 'orange'] },
  { name: 'Liam Patel', cells: ['green', 'green', 'orange', 'orange', 'orange'] },
]

const workloadInsights = [
  {
    title: '2 recruiters are overloaded',
    people: 'Majda Ali and Liam Patel',
    copy: 'High number of interviews and reviews may lead to delays.',
    action: 'Reassign job',
    metric: '2.3 days',
    metricLabel: 'Est. time saved',
    tone: 'pink',
  },
  { title: 'Response time improving', copy: 'Average response time decreased by 12% this week.', action: 'View details', tone: 'green' },
  { title: 'Friday may be a bottleneck', copy: '12 interviews scheduled across 5 roles.', action: 'View calendar', tone: 'orange' },
  { title: 'Balance workloads', copy: '3 roles can be redistributed for better balance.', action: 'View suggestions', tone: 'violet' },
]

const compareRecommendation = {
  title: 'AI Hiring Recommendation',
  candidate: 'Sarah Johnson',
  badge: 'Strong Hire',
  match: '92%',
  matchLabel: 'match',
  confidence: 'Confidence: High (92%)',
  basedOn: 'Based on 12 factors',
  reasons: [
    'Highest interview score (9.2/10)',
    'Best skills match (95%)',
    'Strongest portfolio and case studies',
    'Excellent culture fit',
  ],
  tradeoffs: [
    'Salary expectation 5% above budget',
    'Notice period: 1 month',
  ],
}

const compareCandidates = [
  { name: 'Sarah Johnson', match: '92% match', verdict: 'Strong Hire', tone: 'green', rank: 1, selected: true },
  { name: 'Daniel Brown', match: '89% match', verdict: 'Hire', tone: 'violet', rank: 2 },
  { name: 'Emily Smith', match: '87% match', verdict: 'Review', tone: 'orange', rank: 3 },
  { name: 'Emma Wilson', match: '85% match', verdict: 'Review', tone: 'orange', rank: 4 },
  { name: 'Michael Brown', match: '82% match', verdict: 'Review', tone: 'orange', rank: 5 },
]

const compareCriteria = [
  {
    label: 'Experience',
    weight: 'Weight: 20%',
    type: 'text',
    values: ['7 years', '5 years', '6 years', '4 years', '8 years'],
  },
  {
    label: 'Skills match',
    weight: 'Weight: 25%',
    type: 'bar',
    values: [95, 88, 91, 82, 85],
  },
  {
    label: 'Interview score',
    weight: 'Weight: 20%',
    type: 'score',
    values: ['9.2 / 10', '8.6 / 10', '8.8 / 10', '8.1 / 10', '8.4 / 10'],
  },
  {
    label: 'Culture fit',
    weight: 'Weight: 15%',
    type: 'bar',
    values: [90, 85, 87, 80, 83],
  },
  {
    label: 'Availability',
    weight: 'Weight: 10%',
    type: 'tone-text',
    values: [
      { text: 'Available in 4 weeks' },
      { text: 'Available immediately', tone: 'green' },
      { text: 'Available in 2 weeks' },
      { text: 'Available in 4 weeks' },
      { text: 'Available in 3 weeks' },
    ],
  },
  {
    label: 'Salary fit',
    weight: 'Weight: 5%',
    type: 'rating',
    values: [
      { score: 5, note: 'Excellent', tone: 'green' },
      { score: 4, note: 'Good', tone: 'green' },
      { score: 3, note: 'Fair', tone: 'orange' },
      { score: 3, note: 'Fair', tone: 'orange' },
      { score: 4, note: 'Good', tone: 'green' },
    ],
  },
  {
    label: 'Notice period',
    weight: 'Weight: 5%',
    type: 'text',
    values: ['1 month', 'Immediate', '2 weeks', '1 month', '3 weeks'],
  },
]

const compareInsights = [
  { label: 'Offer acceptance', value: '85%', meta: 'High', tone: 'green' },
  { label: 'Retention prediction', value: '(1 year)', meta: 'High', tone: 'green' },
  { label: 'Ramp-up speed', value: 'Fast', meta: '(2-3 weeks)', tone: 'violet' },
  { label: 'Time to productivity', value: '2-3 weeks', meta: '', tone: 'green' },
  { label: 'Hiring risk', value: 'Low', meta: '', tone: 'green' },
  { label: 'Team impact', value: 'Positive', meta: '', tone: 'green' },
]

const compareFeedback = {
  score: '4.8 / 5',
  note: 'Average rating',
  summary: 'Based on feedback from 5 interviewers',
  verdict: 'Strong Hire',
  strengths: [
    'Outstanding portfolio',
    'Excellent communication',
    'Strong UX thinking',
    'Problem solving mindset',
  ],
}

const compareRisks = {
  level: 'Low risk',
  tone: 'green',
  items: [
    'Salary expectation slightly above budget (+5%)',
    'Notice period of 1 month',
  ],
}

const compareInterviewInsights = [
  { label: 'Portfolio review', owner: 'Liam Patel', score: '9.5/10', tone: 'green' },
  { label: 'Design skills interview', owner: 'James Lee', score: '9/10', tone: 'green' },
  { label: 'Culture fit interview', owner: 'Olivia Davis', score: '8/10', tone: 'green' },
]

const hiringManagerActions = [
  { title: 'Review Sarah Johnson', note: 'Final interview completed', meta: 'High priority', tone: 'pink', icon: 'star', action: 'review-feedback' },
  { title: 'Submit feedback', note: 'Interview with Daniel Brown', meta: 'Due tomorrow', tone: 'orange', icon: 'mail', action: 'review-feedback' },
  { title: 'Complete scorecard', note: 'For Emily Smith', meta: 'Due in 2 days', tone: 'orange', icon: 'clipboard-check', action: 'complete-feedback', candidateId: 'emily-smith' },
  { title: 'Approve offer', note: 'For Michael Williams', meta: 'Due in 3 days', tone: 'green', icon: 'checkCircle', action: 'none' },
]

const hiringManagerTopCandidates = [
  { name: 'Sarah Johnson', role: 'Senior UX Designer at Shopify', match: '92% match', status: 'Ready for decision', tone: 'violet' },
  { name: 'Daniel Brown', role: 'UX Designer at Airbnb', match: '89% match', status: 'Waiting for feedback', tone: 'orange' },
  { name: 'Emily Smith', role: 'Product Designer at Canva', match: '87% match', status: '', tone: 'green' },
]

const hiringManagerUpcoming = [
  { month: 'May', day: '20', weekday: 'Tue', name: 'Sarah Johnson', title: 'Final interview', panels: '3 panelists', time: '10:00 AM', duration: '60 min' },
  { month: 'May', day: '21', weekday: 'Wed', name: 'Daniel Brown', title: 'Design interview', panels: '2 panelists', time: '2:00 PM', duration: '60 min' },
  { month: 'May', day: '22', weekday: 'Thu', name: 'Emily Smith', title: 'Culture fit interview', panels: '2 panelists', time: '11:00 AM', duration: '45 min' },
]

const hiringManagerFeedback = {
  score: '4.2 / 5',
  averageLabel: 'Average rating',
  items: [
    { label: '3 feedback submitted', tone: 'green', icon: 'checkCircle' },
    { label: '2 feedback pending', tone: 'orange', icon: 'refresh' },
  ],
  response: '1.8 days',
  footer: '2 feedback forms pending',
}

const hiringManagerRecommendation = {
  candidate: 'Sarah Johnson',
  match: '92% match',
  confidence: '92%',
  reasons: ['Highest interview score', 'Strongest portfolio', 'Best skills & experience', 'Excellent culture fit'],
  tradeoffs: ['Salary exp 8% above range', '1 month notice period', 'Relocation support required'],
}

const hiringManagerProgress = {
  currentStage: 'Interview',
  stages: [
    { label: 'Sourced', tone: 'green', complete: true },
    { label: 'Screen', tone: 'green', complete: true },
    { label: 'Interview', tone: 'pink', current: true },
    { label: 'Assessment' },
    { label: 'Offer' },
    { label: 'Hired' },
  ],
  summary: [
    { label: 'Interview', count: '8 candidates', status: 'Bottleneck', tone: 'pink' },
    { label: 'Assessment', count: '5 candidates', status: 'Healthy', tone: 'green' },
    { label: 'Offer', count: '3 candidates', status: 'Good', tone: 'green' },
  ],
}

const reviewFeedbackStats = [
  { label: 'Need Your Feedback', value: '2', icon: 'user', tone: 'pink' },
  { label: 'Awaiting Others', value: '3', icon: 'users', tone: 'orange' },
  { label: 'Average overdue', value: '4 days', icon: 'info', tone: 'violet' },
  { label: 'Jobs affected', value: '3', icon: 'trend-up', tone: 'green' },
]

const reviewFeedbackCandidates = [
  {
    id: 'sarah-johnson',
    initials: 'SJ',
    name: 'Sarah Johnson',
    role: 'Frontend Developer',
    department: 'Engineering',
    departmentTone: 'pink',
    ownFeedback: true,
    statusLabel: 'Your feedback is required',
    statusTitle: 'Interview completed',
    statusMeta: '2 days ago',
    overdue: '1 day overdue',
    overdueTone: 'green',
  },
  {
    id: 'daniel-brown',
    initials: 'DB',
    name: 'Daniel Brown',
    role: 'Product Manager',
    department: 'Product',
    departmentTone: 'orange',
    ownFeedback: false,
    missingFrom: 'Alex Rivera',
    missingRole: 'Interviewer',
    overdue: '2 days overdue',
    overdueTone: 'orange',
  },
  {
    id: 'emily-smith',
    initials: 'ES',
    name: 'Emily Smith',
    role: 'Graphic Designer',
    department: 'Design',
    departmentTone: 'violet',
    ownFeedback: false,
    missingFrom: 'Hiring Manager',
    missingRole: 'Hiring Manager',
    overdue: '5 days overdue',
    overdueTone: 'violet',
  },
  {
    id: 'liam-wilson',
    initials: 'LW',
    name: 'Liam Wilson',
    role: 'Account Executive',
    department: 'Sales',
    departmentTone: 'green',
    ownFeedback: true,
    statusLabel: 'Your feedback is required',
    statusTitle: 'Interview completed',
    statusMeta: '1 day ago',
    overdue: '1 day overdue',
    overdueTone: 'green',
  },
  {
    id: 'ava-carter',
    initials: 'AC',
    name: 'Ava Carter',
    role: 'Marketing Specialist',
    department: 'Marketing',
    departmentTone: 'orange',
    ownFeedback: false,
    missingFrom: 'John Lee',
    missingRole: 'Interviewer',
    overdue: '6 days overdue',
    overdueTone: 'orange',
  },
]

const feedbackRecommendationOptions = [
  { value: 'strong-hire', label: 'Strong Hire', icon: 'star' },
  { value: 'hire', label: 'Hire', icon: 'user-check' },
  { value: 'mixed', label: 'Mixed', icon: 'compare' },
  { value: 'no-hire', label: 'No Hire', icon: 'close' },
]

const feedbackEvaluationTemplate = [
  { key: 'technical', label: 'Technical Skills', rating: 5 },
  { key: 'communication', label: 'Communication', rating: 5 },
  { key: 'problem-solving', label: 'Problem Solving', rating: 4 },
  { key: 'culture', label: 'Culture Add', rating: 5 },
]

const reviewFeedbackModal = ref('')
const selectedFeedbackCandidateId = ref('sarah-johnson')
const feedbackRecommendation = ref('strong-hire')
const feedbackNotes = ref('')
const feedbackRatings = ref(
  feedbackEvaluationTemplate.reduce((accumulator, item) => {
    accumulator[item.key] = item.rating
    return accumulator
  }, {}),
)

const selectedFeedbackCandidate = computed(
  () => reviewFeedbackCandidates.find((candidate) => candidate.id === selectedFeedbackCandidateId.value) ?? reviewFeedbackCandidates[0],
)

const feedbackEvaluationRows = computed(() =>
  feedbackEvaluationTemplate.map((item) => ({
    ...item,
    rating: feedbackRatings.value[item.key] ?? item.rating,
  })),
)

const feedbackNoteCount = computed(() => feedbackNotes.value.length)

function openReviewFeedbackModal() {
  reviewFeedbackModal.value = 'list'
}

function openCompleteFeedbackModal(candidateId = 'sarah-johnson') {
  selectedFeedbackCandidateId.value = candidateId
  reviewFeedbackModal.value = 'complete'
}

function closeFeedbackModal() {
  reviewFeedbackModal.value = ''
}

function backToReviewFeedbackModal() {
  reviewFeedbackModal.value = 'list'
}

function updateFeedbackRating(key, rating) {
  feedbackRatings.value = {
    ...feedbackRatings.value,
    [key]: rating,
  }
}

function handleManagerAction(item) {
  if (item.action === 'review-feedback') {
    openReviewFeedbackModal()
    return
  }

  if (item.action === 'complete-feedback') {
    openCompleteFeedbackModal(item.candidateId)
  }
}

function toneClass(tone) {
  return tone ? `is-${tone}` : ''
}

function timelineNodeStyle(index, total) {
  const position = total <= 1 ? 0 : (index / (total - 1)) * 100
  return { left: `${position}%` }
}

function goBack() {
  emit('back')
}
</script>

<template>
  <main class="job-pipeline-page">
    <div class="job-pipeline-shell">
      <div class="job-pipeline-topbar">
        <button class="job-pipeline-back" type="button" @click="goBack">
          <AppIcon name="chevronLeft" :size="15" />
          <span>Back to jobs</span>
        </button>

        <div class="job-pipeline-actions">
          <button class="job-pipeline-ghost" type="button">
            <AppIcon name="share" :size="15" />
            <span>Share</span>
          </button>
          <button class="job-pipeline-icon-button" type="button" aria-label="More">
            <AppIcon name="more" :size="15" />
          </button>
          <button class="job-pipeline-outline-accent" type="button">
            <AppIcon name="edit" :size="14" />
            <span>Edit job</span>
          </button>
        </div>
      </div>

      <section class="job-pipeline-hero">
        <div>
          <div class="job-pipeline-title-row">
            <h1>{{ job.title }}</h1>
            <span class="job-pipeline-status">Open</span>
          </div>

          <div class="job-pipeline-meta">
            <span>{{ job.location === 'Remote' ? 'London, UK' : job.location }}</span>
            <span class="job-pipeline-meta-dot" />
            <span>{{ job.department }}</span>
            <span class="job-pipeline-meta-dot" />
            <span>Full-time</span>
            <span class="job-pipeline-meta-dot" />
            <span>ID: {{ job.id.toUpperCase() }}</span>
            <span class="job-pipeline-meta-dot" />
            <span>Created 12 May 2025</span>
          </div>
        </div>

        <div class="job-pipeline-view-switch">
          <button
            class="job-pipeline-view-button"
            :class="{ 'is-active': activeAudienceView === 'recruiter' }"
            type="button"
            @click="activeAudienceView = 'recruiter'"
          >
            <AppIcon name="eye" :size="14" />
            <span>Recruiter View</span>
          </button>
          <button
            class="job-pipeline-view-button"
            :class="{ 'is-active': activeAudienceView === 'hiring-manager' }"
            type="button"
            @click="activeAudienceView = 'hiring-manager'"
          >
            <AppIcon name="user" :size="14" />
            <span>Hiring Manager View</span>
            <AppIcon name="chevronDown" :size="12" />
          </button>
        </div>
      </section>

      <div class="job-pipeline-tabs">
        <button
          v-for="tab in activeAudienceTabs"
          :key="tab"
          class="job-pipeline-tab"
          :class="{ 'is-active': activeAudienceView === 'recruiter' ? tab === 'Pipeline' : tab === activeManagerTab }"
          type="button"
          @click="activeAudienceView === 'hiring-manager' ? (activeManagerTab = tab) : null"
        >
          <span>{{ tab }}</span>
          <AppIcon v-if="activeAudienceView === 'recruiter' && tab === 'More'" name="chevronDown" :size="13" />
        </button>
      </div>

      <div v-if="activeAudienceView === 'recruiter'" class="job-pipeline-content-grid" :class="{ 'is-compare': activeBoardView === 'compare' }">
        <div class="job-pipeline-main-column">
          <section v-if="activeBoardView === 'board' || activeBoardView === 'list'" class="job-pipeline-overview">
            <div class="job-pipeline-summary-grid">
              <article class="job-pipeline-panel job-pipeline-panel--summary">
                <div class="job-pipeline-panel-head">
                  <div class="job-pipeline-panel-title">
                    <span class="job-pipeline-panel-mark is-pink">
                      <AppIcon name="spark" :size="14" />
                    </span>
                    <strong>AI Summary</strong>
                  </div>
                </div>

                <div class="job-pipeline-summary-layout">
                  <div class="job-pipeline-summary-copy">
                    <h2>Hiring is on track</h2>
                    <p>3 candidates are ready for final interview.</p>
                    <p>1 candidate is ready for offer.</p>
                    <button class="job-pipeline-inline-button" type="button">View full summary</button>
                  </div>

                  <div class="job-pipeline-summary-stats">
                    <article v-for="stat in summaryStats" :key="stat.label" class="job-pipeline-stat-card">
                      <strong :class="toneClass(stat.tone)">{{ stat.value }}</strong>
                      <span>{{ stat.label }}</span>
                    </article>
                    <button class="job-pipeline-resolve" type="button">Resolve all</button>
                  </div>
                </div>
              </article>

              <article class="job-pipeline-panel job-pipeline-panel--status">
                <div class="job-pipeline-panel-head">
                  <strong>Hiring status</strong>
                </div>

                <div class="job-pipeline-status-block">
                  <div class="job-pipeline-ring">
                    <div>87</div>
                  </div>
                  <div class="job-pipeline-status-copy">
                    <strong>On track</strong>
                    <span>Great pipeline health</span>
                  </div>
                </div>

                <div class="job-pipeline-status-metrics">
                  <div><strong>48</strong><span>Total candidates</span></div>
                  <div><strong>3</strong><span>Likely hires</span></div>
                  <div><strong>1</strong><span>At risk</span></div>
                </div>

                <button class="job-pipeline-link" type="button">View details</button>
              </article>
            </div>
          </section>

          <section v-else-if="activeBoardView === 'timeline'" class="job-pipeline-overview job-pipeline-overview--timeline">
            <article class="job-pipeline-panel job-pipeline-panel--timeline-summary">
              <div class="job-pipeline-timeline-top">
                <div class="job-pipeline-timeline-summary">
                  <article
                    v-for="card in timelineSummaryCards"
                    :key="card.label"
                    class="job-pipeline-timeline-summary-card"
                    :class="toneClass(card.tone)"
                  >
                    <strong>{{ card.value }}</strong>
                    <span>{{ card.label }}</span>
                  </article>
                </div>

                <div class="job-pipeline-timeline-filters">
                  <label>
                    <span>Offers</span>
                    <select>
                      <option>Next step</option>
                    </select>
                  </label>
                  <label>
                    <span>Group by</span>
                    <select>
                      <option>None</option>
                    </select>
                  </label>
                </div>
              </div>
            </article>
          </section>

          <section class="job-pipeline-panel job-pipeline-board-panel">
            <div class="job-pipeline-board-head">
              <div class="job-pipeline-board-title">
                <h2>{{ activeBoardView === 'timeline' ? 'Timeline' : activeBoardView === 'workload' ? 'Workload' : activeBoardView === 'compare' ? 'Compare' : 'Pipeline' }}</h2>
                <span v-if="activeBoardView === 'compare'">{{ compareCandidates.length }} selected</span>
                <span v-else-if="activeBoardView !== 'workload'">48 candidates</span>
              </div>

              <div class="job-pipeline-board-controls">
                <div class="job-pipeline-board-view-tabs">
                  <button
                    v-for="view in boardViews"
                    :key="view.id"
                    :class="{ 'is-active': activeBoardView === view.id }"
                    type="button"
                    @click="activeBoardView = view.id"
                  >
                    {{ view.label }}
                  </button>
                </div>
                <button class="job-pipeline-ghost" type="button">{{ activeBoardView === 'workload' ? 'Workload view' : activeBoardView === 'compare' ? 'Compare settings' : 'Pipeline settings' }}</button>
                <button class="job-pipeline-icon-button" type="button" aria-label="Filter pipeline">
                  <AppIcon name="filter" :size="15" />
                </button>
              </div>
            </div>

            <div v-if="activeBoardView === 'board'" class="job-pipeline-board-scroll">
              <div class="job-pipeline-board">
                <article
                  v-for="column in pipelineColumns"
                  :key="column.slug"
                  class="job-pipeline-column"
                  :class="[toneClass(column.tone), { 'is-focused': activeColumnSlug === column.slug }]"
                >
                  <div class="job-pipeline-column-head">
                    <div class="job-pipeline-column-heading">
                      <strong>{{ column.title }}</strong>
                      <small>{{ column.count }} candidates</small>
                    </div>
                    <div class="job-pipeline-column-meta">
                      <span>{{ column.average }}</span>
                      <em :class="toneClass(column.tone)">{{ column.health }}</em>
                    </div>
                  </div>

                  <span class="job-pipeline-column-bar" :class="toneClass(column.tone)" />

                  <div class="job-pipeline-column-cards">
                    <article v-for="candidate in column.cards" :key="candidate.name" class="job-pipeline-candidate-card">
                      <div class="job-pipeline-candidate-top">
                        <span class="job-pipeline-candidate-avatar">
                          <span aria-hidden="true" />
                        </span>
                        <div>
                          <strong>{{ candidate.name }}</strong>
                          <span>{{ candidate.role }}</span>
                          <small>{{ candidate.source }}</small>
                        </div>
                      </div>

                      <div class="job-pipeline-candidate-bottom">
                        <strong v-if="candidate.match">{{ candidate.match }}</strong>
                        <small>{{ candidate.note }}</small>
                      </div>
                    </article>
                  </div>

                  <button class="job-pipeline-add-candidate" type="button">+ Add candidate</button>
                </article>
              </div>
            </div>

            <div v-else-if="activeBoardView === 'list'" class="job-pipeline-list-view">
              <div class="job-pipeline-list-table">
                <div class="job-pipeline-list-head">
                  <span class="job-pipeline-list-check">
                    <input type="checkbox">
                  </span>
                  <span>Candidate</span>
                  <span>Stage</span>
                  <span>Match</span>
                  <span>Status</span>
                  <span>Last activity</span>
                  <span>Next step</span>
                  <span>Owner</span>
                  <span class="job-pipeline-list-more-col" />
                </div>

                <article
                  v-for="row in listRows"
                  :key="row.name"
                  class="job-pipeline-list-row"
                >
                  <span class="job-pipeline-list-check">
                    <input type="checkbox">
                  </span>

                  <div class="job-pipeline-list-candidate">
                    <span class="job-pipeline-candidate-avatar"><span aria-hidden="true" /></span>
                    <div>
                      <strong>{{ row.name }}</strong>
                      <span>{{ row.role }}</span>
                    </div>
                  </div>

                  <span class="job-pipeline-list-badge" :class="toneClass(row.stageTone)">{{ row.stage }}</span>

                  <div class="job-pipeline-list-match">
                    <strong>{{ row.match }}</strong>
                    <span>★★★★<small>★</small></span>
                  </div>

                  <span class="job-pipeline-list-status" :class="toneClass(row.statusTone)">{{ row.status }}</span>

                  <div class="job-pipeline-list-meta">
                    <strong>{{ row.lastActivity }}</strong>
                    <span>{{ row.lastActivityMeta }}</span>
                  </div>

                  <div class="job-pipeline-list-meta">
                    <strong>{{ row.nextStep }}</strong>
                    <span>{{ row.nextStepMeta }}</span>
                  </div>

                  <div class="job-pipeline-list-owner">
                    <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--small"><span aria-hidden="true" /></span>
                    <strong>{{ row.owner }}</strong>
                  </div>

                  <button class="job-pipeline-list-more" type="button" aria-label="More actions">
                    <AppIcon name="more" :size="14" />
                  </button>
                </article>
              </div>

              <div class="job-pipeline-list-footer">
                <span>Showing 1 to 8 of 48 candidates</span>
                <div class="job-pipeline-list-pagination">
                  <button type="button">
                    <AppIcon name="chevronLeft" :size="12" />
                  </button>
                  <button class="is-active" type="button">1</button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <span>...</span>
                  <button type="button">6</button>
                  <button type="button">
                    <AppIcon name="chevronRight" :size="12" />
                  </button>
                </div>
                <button class="job-pipeline-timeline-page-size" type="button">10 / page</button>
              </div>
            </div>

            <div v-else-if="activeBoardView === 'workload'" class="job-pipeline-workload-view">
              <div class="job-pipeline-workload-summary">
                <article
                  v-for="card in workloadSummaryCards"
                  :key="card.title"
                  class="job-pipeline-workload-summary-card"
                >
                  <span class="job-pipeline-workload-summary-icon" :class="toneClass(card.tone)">
                    <AppIcon :name="card.icon" :size="14" />
                  </span>
                  <small>{{ card.title }}</small>
                  <div class="job-pipeline-workload-summary-metric">
                    <strong>{{ card.value }}</strong>
                    <span :class="toneClass(card.tone)">{{ card.meta }}</span>
                  </div>
                  <p>{{ card.note }}</p>
                </article>
              </div>

              <div class="job-pipeline-workload-grid">
                <section class="job-pipeline-workload-panel">
                  <div class="job-pipeline-workload-panel-head">
                    <strong>Recruiter workload</strong>
                    <button type="button">View all recruiters</button>
                  </div>
                  <div class="job-pipeline-workload-table">
                    <div class="job-pipeline-workload-table-head recruiter">
                      <span>Recruiter</span>
                      <span>Active jobs</span>
                      <span>Candidates</span>
                      <span>Pending reviews</span>
                      <span>Capacity</span>
                      <span>Trend</span>
                      <span>Status</span>
                    </div>
                    <article
                      v-for="row in recruiterWorkloadRows"
                      :key="row.name"
                      class="job-pipeline-workload-table-row recruiter"
                    >
                      <div class="job-pipeline-workload-person">
                        <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--small"><span aria-hidden="true" /></span>
                        <div>
                          <strong>{{ row.name }}</strong>
                          <span>{{ row.role }}</span>
                        </div>
                      </div>
                      <div class="job-pipeline-workload-cell">
                        <strong>{{ row.activeJobs }}</strong>
                        <small>{{ row.activeJobsMeta }}</small>
                      </div>
                      <div class="job-pipeline-workload-cell">
                        <strong>{{ row.candidates }}</strong>
                        <small>{{ row.candidatesMeta }}</small>
                      </div>
                      <div class="job-pipeline-workload-cell">
                        <strong>{{ row.pendingReviews }}</strong>
                        <small>{{ row.pendingReviewsMeta }}</small>
                      </div>
                      <div class="job-pipeline-workload-cell">
                        <strong>{{ row.capacity }}</strong>
                      </div>
                      <div class="job-pipeline-workload-sparkline" :class="toneClass(row.tone)">
                        <span v-for="(point, index) in row.trend" :key="`${row.name}-${index}`" :style="{ height: `${point}px` }" />
                      </div>
                      <span class="job-pipeline-workload-status" :class="toneClass(row.tone)">{{ row.status }}</span>
                    </article>
                  </div>
                </section>

                <section class="job-pipeline-workload-panel">
                  <div class="job-pipeline-workload-panel-head">
                    <strong>Hiring manager workload</strong>
                    <button type="button">View all managers</button>
                  </div>
                  <div class="job-pipeline-workload-table">
                    <div class="job-pipeline-workload-table-head manager">
                      <span>Manager</span>
                      <span>Candidates waiting</span>
                      <span>Feedback pending</span>
                      <span>Interviews this week</span>
                      <span>Avg. response time</span>
                      <span>Status</span>
                    </div>
                    <article
                      v-for="row in hiringManagerWorkloadRows"
                      :key="row.name"
                      class="job-pipeline-workload-table-row manager"
                    >
                      <div class="job-pipeline-workload-person">
                        <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--small"><span aria-hidden="true" /></span>
                        <div>
                          <strong>{{ row.name }}</strong>
                          <span>{{ row.role }}</span>
                        </div>
                      </div>
                      <div class="job-pipeline-workload-cell">
                        <strong>{{ row.waiting }}</strong>
                        <small>{{ row.waitingMeta }}</small>
                      </div>
                      <div class="job-pipeline-workload-cell">
                        <strong>{{ row.feedbackPending }}</strong>
                        <small>{{ row.feedbackMeta }}</small>
                      </div>
                      <div class="job-pipeline-workload-cell">
                        <strong>{{ row.interviews }}</strong>
                      </div>
                      <div class="job-pipeline-workload-cell">
                        <strong>{{ row.response }}</strong>
                      </div>
                      <span class="job-pipeline-workload-status" :class="toneClass(row.tone)">{{ row.status }}</span>
                    </article>
                  </div>
                </section>
              </div>

              <div class="job-pipeline-workload-bottom">
                <section class="job-pipeline-workload-panel job-pipeline-workload-panel--compact">
                  <div class="job-pipeline-workload-panel-head">
                    <strong>Team workload heatmap</strong>
                  </div>
                  <div class="job-pipeline-workload-heatmap">
                    <div class="job-pipeline-workload-heatmap-head">
                      <span />
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                    </div>
                    <div v-for="row in workloadHeatmapRows" :key="row.name" class="job-pipeline-workload-heatmap-row">
                      <strong>{{ row.name }}</strong>
                      <span
                        v-for="(cell, index) in row.cells"
                        :key="`${row.name}-${index}`"
                        class="job-pipeline-workload-heatmap-cell"
                        :class="`is-${cell}`"
                      />
                    </div>
                  </div>
                </section>

                <section class="job-pipeline-workload-panel job-pipeline-workload-panel--compact">
                  <div class="job-pipeline-workload-panel-head">
                    <strong>Upcoming work</strong>
                    <small>Next 7 days</small>
                  </div>
                  <div class="job-pipeline-workload-upcoming">
                    <article v-for="item in workloadUpcomingItems" :key="item.label" class="job-pipeline-workload-upcoming-item">
                      <span class="job-pipeline-workload-upcoming-icon" :class="toneClass(item.tone)">
                        <AppIcon :name="item.icon" :size="13" />
                      </span>
                      <div class="job-pipeline-workload-upcoming-copy">
                        <strong>{{ item.title }}</strong>
                        <span>{{ item.label }}</span>
                      </div>
                      <div class="job-pipeline-workload-sparkline" :class="toneClass(item.tone)">
                        <span v-for="(point, index) in item.trend" :key="`${item.label}-${index}`" :style="{ height: `${point}px` }" />
                      </div>
                      <small>{{ item.meta }}</small>
                    </article>
                  </div>
                </section>

                <section class="job-pipeline-workload-panel job-pipeline-workload-panel--compact">
                  <div class="job-pipeline-workload-panel-head">
                    <strong>Workload heatmap by day</strong>
                  </div>
                  <div class="job-pipeline-workload-heatmap by-day">
                    <div class="job-pipeline-workload-heatmap-head">
                      <span />
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                    </div>
                    <div v-for="row in workloadDayHeatmapRows" :key="row.name" class="job-pipeline-workload-heatmap-row">
                      <strong>{{ row.name }}</strong>
                      <span
                        v-for="(cell, index) in row.cells"
                        :key="`${row.name}-day-${index}`"
                        class="job-pipeline-workload-heatmap-cell"
                        :class="`is-${cell}`"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div v-else-if="activeBoardView === 'compare'" class="job-pipeline-compare-view">
              <section class="job-pipeline-compare-hero">
                <div class="job-pipeline-compare-hero-main">
                  <div class="job-pipeline-panel-title">
                    <span class="job-pipeline-panel-mark is-violet">
                      <AppIcon name="compare" :size="14" />
                    </span>
                    <strong>{{ compareRecommendation.title }}</strong>
                    <small class="job-pipeline-beta">Beta</small>
                  </div>

                  <div class="job-pipeline-compare-hero-summary">
                    <div class="job-pipeline-compare-highlight">
                      <h3>{{ compareRecommendation.candidate }}</h3>
                      <div class="job-pipeline-compare-highlight-meta">
                        <span class="job-pipeline-compare-badge is-green">{{ compareRecommendation.badge }}</span>
                        <strong>{{ compareRecommendation.match }}</strong>
                        <small>{{ compareRecommendation.matchLabel }}</small>
                      </div>
                    </div>

                    <div class="job-pipeline-compare-confidence">
                      <span>{{ compareRecommendation.confidence }}</span>
                      <small>{{ compareRecommendation.basedOn }}</small>
                    </div>
                  </div>
                </div>

                <div class="job-pipeline-compare-hero-side">
                  <div>
                    <strong>Why we recommend Sarah</strong>
                    <ul class="job-pipeline-compare-points is-positive">
                      <li v-for="reason in compareRecommendation.reasons" :key="reason">{{ reason }}</li>
                    </ul>
                  </div>

                  <div>
                    <strong>Trade-offs to consider</strong>
                    <ul class="job-pipeline-compare-points is-warning">
                      <li v-for="tradeoff in compareRecommendation.tradeoffs" :key="tradeoff">{{ tradeoff }}</li>
                    </ul>
                  </div>

                  <div class="job-pipeline-compare-hero-actions">
                    <button class="job-pipeline-outline-accent is-solid" type="button">Move to Offer</button>
                    <button class="job-pipeline-inline-button is-small" type="button">View full rationale</button>
                  </div>
                </div>
              </section>

              <div class="job-pipeline-compare-candidates">
                <article
                  v-for="candidate in compareCandidates"
                  :key="candidate.name"
                  class="job-pipeline-compare-candidate-card"
                  :class="{ 'is-selected': candidate.selected }"
                >
                  <span class="job-pipeline-compare-rank">{{ candidate.rank }}</span>
                  <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--compare"><span aria-hidden="true" /></span>
                  <strong>{{ candidate.name }}</strong>
                  <small>{{ candidate.match }}</small>
                  <span class="job-pipeline-compare-badge" :class="toneClass(candidate.tone)">{{ candidate.verdict }}</span>
                </article>

                <button class="job-pipeline-compare-add" type="button">
                  <AppIcon name="plus" :size="18" />
                  <span>Add candidate</span>
                </button>
              </div>

              <section class="job-pipeline-compare-table-card">
                <div class="job-pipeline-compare-table-head">
                  <strong>Detailed candidate comparison</strong>
                  <span>Weighted comparison</span>
                </div>

                <div class="job-pipeline-compare-table-scroll">
                  <div class="job-pipeline-compare-table">
                    <div class="job-pipeline-compare-table-header">
                      <div class="job-pipeline-compare-criteria-head">Criteria</div>
                      <div
                        v-for="candidate in compareCandidates"
                        :key="`${candidate.name}-head`"
                        class="job-pipeline-compare-column-head"
                      >
                        <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--tiny"><span aria-hidden="true" /></span>
                        <strong>{{ candidate.name }}</strong>
                      </div>
                    </div>

                    <div
                      v-for="criterion in compareCriteria"
                      :key="criterion.label"
                      class="job-pipeline-compare-table-row"
                    >
                      <div class="job-pipeline-compare-criteria">
                        <strong>{{ criterion.label }}</strong>
                        <small>{{ criterion.weight }}</small>
                      </div>

                      <template v-if="criterion.type === 'bar'">
                        <div
                          v-for="(value, index) in criterion.values"
                          :key="`${criterion.label}-${index}`"
                          class="job-pipeline-compare-bar-cell"
                        >
                          <span>{{ value }}%</span>
                          <div class="job-pipeline-compare-bar-track">
                            <i :class="{ 'is-warning': value < 84 }" :style="{ width: `${value}%` }" />
                          </div>
                        </div>
                      </template>

                      <template v-else-if="criterion.type === 'rating'">
                        <div
                          v-for="(value, index) in criterion.values"
                          :key="`${criterion.label}-${index}`"
                          class="job-pipeline-compare-rating-cell"
                        >
                          <div class="job-pipeline-compare-stars" :class="toneClass(value.tone)">
                            <i v-for="star in 5" :key="star" :class="{ 'is-off': star > value.score }" />
                          </div>
                          <small :class="toneClass(value.tone)">{{ value.note }}</small>
                        </div>
                      </template>

                      <template v-else-if="criterion.type === 'tone-text'">
                        <div
                          v-for="(value, index) in criterion.values"
                          :key="`${criterion.label}-${index}`"
                          class="job-pipeline-compare-text-cell"
                        >
                          <span :class="toneClass(value.tone)">{{ value.text }}</span>
                        </div>
                      </template>

                      <template v-else>
                        <div
                          v-for="(value, index) in criterion.values"
                          :key="`${criterion.label}-${index}`"
                          class="job-pipeline-compare-text-cell"
                        >
                          <span>{{ value }}</span>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </section>

              <div class="job-pipeline-compare-bottom">
                <section class="job-pipeline-compare-mini-card">
                  <strong>Team feedback</strong>
                  <div class="job-pipeline-compare-score-row">
                    <em>{{ compareFeedback.score }}</em>
                    <span>{{ compareFeedback.note }}</span>
                  </div>
                  <p>{{ compareFeedback.summary }}</p>
                  <span class="job-pipeline-compare-badge is-green">{{ compareFeedback.verdict }}</span>
                  <ul class="job-pipeline-compare-mini-list is-positive">
                    <li v-for="item in compareFeedback.strengths" :key="item">{{ item }}</li>
                  </ul>
                </section>

                <section class="job-pipeline-compare-mini-card">
                  <strong>Candidate risks</strong>
                  <span class="job-pipeline-compare-badge" :class="toneClass(compareRisks.tone)">{{ compareRisks.level }}</span>
                  <ul class="job-pipeline-compare-mini-list is-warning">
                    <li v-for="item in compareRisks.items" :key="item">{{ item }}</li>
                  </ul>
                  <button class="job-pipeline-text-link" type="button">View full risk analysis</button>
                </section>

                <section class="job-pipeline-compare-mini-card">
                  <strong>Interview insights</strong>
                  <div class="job-pipeline-compare-insight-list">
                    <article v-for="item in compareInterviewInsights" :key="item.label" class="job-pipeline-compare-insight-item">
                      <div>
                        <strong>{{ item.label }}</strong>
                        <small>by {{ item.owner }}</small>
                      </div>
                      <span class="job-pipeline-compare-score-pill" :class="toneClass(item.tone)">{{ item.score }}</span>
                    </article>
                  </div>
                  <button class="job-pipeline-text-link" type="button">View all interviews</button>
                </section>
              </div>
            </div>

            <div v-else class="job-pipeline-timeline-view">
              <div class="job-pipeline-timeline-layout">
                <div class="job-pipeline-timeline-main">
                  <div class="job-pipeline-timeline-stage-head">
                    <span class="job-pipeline-timeline-stage-title">Timeline</span>
                    <div class="job-pipeline-timeline-stage-grid">
                      <div
                        v-for="(stage, index) in timelineStages"
                        :key="stage"
                        class="job-pipeline-timeline-stage-chip"
                        :style="timelineNodeStyle(index, timelineStages.length)"
                      >
                        <span class="job-pipeline-timeline-stage-dot" />
                        <strong>{{ stage }}</strong>
                      </div>
                    </div>
                    <span class="job-pipeline-timeline-next">Next step</span>
                    <span class="job-pipeline-timeline-status-head">AI status</span>
                  </div>

                  <article
                    v-for="row in timelineRows"
                    :key="row.name"
                    class="job-pipeline-timeline-row"
                  >
                    <div class="job-pipeline-timeline-candidate">
                      <span class="job-pipeline-candidate-avatar"><span aria-hidden="true" /></span>
                      <div>
                        <strong>{{ row.name }}</strong>
                        <span>{{ row.role }}</span>
                        <small>{{ row.match }}</small>
                      </div>
                    </div>

                    <div class="job-pipeline-timeline-track">
                      <span class="job-pipeline-timeline-rail" />
                      <span
                        class="job-pipeline-timeline-progress"
                        :class="toneClass(row.tone)"
                        :style="{ width: `${(row.currentIndex / (timelineStages.length - 1)) * 100}%` }"
                      />
                      <span
                        v-for="(stage, index) in timelineStages"
                        :key="`${row.name}-${stage}`"
                        class="job-pipeline-timeline-node"
                        :class="{
                          'is-complete': index < row.currentIndex,
                          'is-current': index === row.currentIndex,
                          [toneClass(row.tone)]: index === row.currentIndex,
                        }"
                        :style="timelineNodeStyle(index, timelineStages.length)"
                      />

                      <div
                        class="job-pipeline-timeline-callout"
                        :class="toneClass(row.tone)"
                        :style="timelineNodeStyle(row.currentIndex, timelineStages.length)"
                      >
                        <strong>{{ row.milestone }}</strong>
                        <span>{{ row.milestoneNote }}</span>
                      </div>
                    </div>

                    <div class="job-pipeline-timeline-next-step">
                      <span>Next step</span>
                      <strong>{{ row.nextStep }}</strong>
                    </div>

                    <div class="job-pipeline-timeline-status">
                      <span>AI status</span>
                      <strong :class="toneClass(row.tone)">{{ row.status }}</strong>
                      <small>{{ row.statusMeta }}</small>
                    </div>
                  </article>

                  <div class="job-pipeline-timeline-footer">
                    <span>Showing 1 to 6 of 48 candidates</span>
                    <div class="job-pipeline-timeline-pagination">
                      <button type="button">
                        <AppIcon name="chevronLeft" :size="12" />
                      </button>
                      <button class="is-active" type="button">1</button>
                      <button type="button">2</button>
                      <button type="button">3</button>
                      <span>...</span>
                      <button type="button">8</button>
                      <button type="button">
                        <AppIcon name="chevronRight" :size="12" />
                      </button>
                    </div>
                    <button class="job-pipeline-timeline-page-size" type="button">10 / page</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div v-if="activeBoardView === 'board' || activeBoardView === 'list'" class="job-pipeline-bottom-grid">
            <section class="job-pipeline-panel job-pipeline-panel--recommendations">
              <div class="job-pipeline-panel-head">
                <div class="job-pipeline-panel-title">
                  <span class="job-pipeline-panel-mark is-pink">
                    <AppIcon name="spark" :size="14" />
                  </span>
                  <strong>AI Recommendations</strong>
                  <small class="job-pipeline-beta">Beta</small>
                </div>
                <AppIcon name="chevronUp" :size="14" />
              </div>

              <div class="job-pipeline-recommendations">
                <article v-for="card in recommendationCards" :key="card.title" class="job-pipeline-recommendation-card">
                  <strong>{{ card.title }}</strong>
                  <p>{{ card.copy }}</p>
                  <div class="job-pipeline-recommendation-metric">{{ card.metric }}</div>
                  <button type="button">{{ card.footer }}</button>
                </article>
              </div>
            </section>

            <section class="job-pipeline-panel job-pipeline-panel--forecast">
              <div class="job-pipeline-panel-head">
                <div class="job-pipeline-panel-title">
                  <strong>Pipeline forecast</strong>
                  <small class="job-pipeline-beta">Beta</small>
                </div>
              </div>
              <p class="job-pipeline-chart-copy">Forecast based on current pipeline and historical data</p>

              <div class="job-pipeline-chart">
                <div class="job-pipeline-chart-legend">
                  <span><i class="is-green" /> Likely hires</span>
                  <span><i class="is-orange" /> At risk</span>
                  <span><i class="is-slate" /> Actual hires</span>
                </div>

                <div class="job-pipeline-chart-bars">
                  <div v-for="bar in forecastBars" :key="bar.label" class="job-pipeline-chart-bar">
                    <span :class="{ 'is-accent': bar.accent }" :style="{ height: `${bar.value * 14}px` }" />
                    <small>{{ bar.label }}</small>
                  </div>
                </div>

                <div class="job-pipeline-chart-footer">
                  <div><strong>3</strong><span>Likely hires</span></div>
                  <div><strong>1</strong><span>At risk</span></div>
                  <div><strong>-1</strong><span>Shortfall</span></div>
                </div>
              </div>
            </section>
          </div>

          <div class="job-pipeline-tip">
            <span>{{ activeBoardView === 'workload' ? 'Tip: Drag and drop jobs between recruiters to balance workloads' : activeBoardView === 'compare' ? 'Tip: Adjust candidate weights in Compare settings to rebalance the recommendation.' : 'Tip: Drag and drop candidates to move them between stages' }}</span>
            <button type="button">{{ activeBoardView === 'workload' ? 'Learn more about workload' : activeBoardView === 'compare' ? 'Learn more about comparison' : 'Learn more about pipeline' }}</button>
          </div>
        </div>

        <aside class="job-pipeline-sidebar">
          <template v-if="activeBoardView === 'timeline'">
            <section class="job-pipeline-timeline-side-card">
              <div class="job-pipeline-timeline-side-head">
                <strong>AI insights</strong>
                <button type="button">View all</button>
              </div>
              <article
                v-for="item in timelineInsights"
                :key="item.title"
                class="job-pipeline-timeline-side-item"
              >
                <span class="job-pipeline-timeline-side-icon" :class="toneClass(item.tone)">
                  <AppIcon :name="item.tone === 'orange' ? 'alert' : item.tone === 'violet' ? 'spark' : 'info'" :size="12" />
                </span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <button type="button">{{ item.action }}</button>
                </div>
              </article>
            </section>

            <section class="job-pipeline-timeline-side-card">
              <div class="job-pipeline-timeline-side-head">
                <strong>Timeline activity</strong>
                <button type="button">View all</button>
              </div>
              <article
                v-for="item in timelineActivity"
                :key="`${item.time}-${item.text}`"
                class="job-pipeline-timeline-activity"
              >
                <span class="job-pipeline-timeline-activity-dot" :class="toneClass(item.tone)" />
                <div>
                  <small>{{ item.time }}</small>
                  <strong>{{ item.text }}</strong>
                </div>
              </article>
            </section>

            <section class="job-pipeline-timeline-side-card">
              <div class="job-pipeline-timeline-side-head">
                <strong>Quick actions</strong>
              </div>
              <button
                v-for="action in timelineQuickActions"
                :key="action.label"
                class="job-pipeline-timeline-action"
                type="button"
              >
                <AppIcon :name="action.icon" :size="13" />
                <span>{{ action.label }}</span>
              </button>
            </section>
          </template>

          <template v-else-if="activeBoardView === 'workload'">
            <section class="job-pipeline-workload-side-panel job-pipeline-workload-side-panel--highlight">
              <div class="job-pipeline-workload-side-head">
                <div class="job-pipeline-panel-title">
                  <span class="job-pipeline-panel-mark is-pink">
                    <AppIcon name="spark" :size="14" />
                  </span>
                  <strong>AI workload insights</strong>
                  <small class="job-pipeline-beta">Beta</small>
                </div>
              </div>

              <article class="job-pipeline-workload-highlight-card">
                <div class="job-pipeline-workload-highlight-alert">
                  <AppIcon name="alert" :size="14" />
                  <strong>{{ workloadInsights[0].title }}</strong>
                </div>
                <span>{{ workloadInsights[0].people }}</span>
                <p>{{ workloadInsights[0].copy }}</p>
              </article>

              <article class="job-pipeline-workload-highlight-action">
                <small>Recommended action</small>
                <strong>Move Backend Developer role to Emma Johnson</strong>
                <span>{{ workloadInsights[0].metricLabel }}</span>
                <em>{{ workloadInsights[0].metric }}</em>
                <button type="button">{{ workloadInsights[0].action }}</button>
              </article>
            </section>

            <section
              v-for="item in workloadInsights.slice(1)"
              :key="item.title"
              class="job-pipeline-workload-side-panel"
            >
              <div class="job-pipeline-workload-side-item">
                <span class="job-pipeline-workload-side-icon" :class="toneClass(item.tone)">
                  <AppIcon :name="item.tone === 'green' ? 'users' : item.tone === 'orange' ? 'alert' : 'document'" :size="13" />
                </span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.copy }}</p>
                  <button type="button">{{ item.action }}</button>
                </div>
              </div>
            </section>

            <button class="job-pipeline-workload-settings" type="button">
              <span>Workload settings</span>
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </template>

          <template v-else-if="activeBoardView === 'compare'">
            <section class="job-pipeline-compare-side-card">
              <div class="job-pipeline-compare-side-head">
                <strong>AI hiring insights</strong>
                <small class="job-pipeline-beta">Beta</small>
              </div>

              <div class="job-pipeline-compare-metrics">
                <article v-for="item in compareInsights" :key="item.label" class="job-pipeline-compare-metric">
                  <div>
                    <span>{{ item.label }}</span>
                    <strong>{{ item.value }}</strong>
                  </div>
                  <em v-if="item.meta" :class="toneClass(item.tone)">{{ item.meta }}</em>
                </article>
              </div>
            </section>

            <section class="job-pipeline-compare-side-card">
              <small class="job-pipeline-compare-side-label">Recommended action</small>
              <strong class="job-pipeline-compare-side-title">Move Sarah Johnson to Offer</strong>
              <div class="job-pipeline-compare-side-saved">
                <span>Estimated time saved</span>
                <strong>3 days</strong>
              </div>
              <button class="job-pipeline-copilot-button" type="button">Move to Offer</button>
            </section>

            <section class="job-pipeline-compare-side-card">
              <small class="job-pipeline-compare-side-label">Next step</small>
              <strong class="job-pipeline-compare-side-title">Schedule final interview with Sarah Johnson</strong>
              <span class="job-pipeline-compare-side-copy">Suggested: This week</span>
              <button class="job-pipeline-text-link" type="button">Schedule now</button>
            </section>

            <button class="job-pipeline-workload-settings" type="button">
              <span>Compare settings</span>
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </template>

          <section v-else class="job-pipeline-panel job-pipeline-panel--copilot">
          <div class="job-pipeline-panel-head">
            <div class="job-pipeline-panel-title">
              <span class="job-pipeline-panel-mark is-pink">
                <AppIcon name="spark" :size="14" />
              </span>
              <strong>AI Copilot</strong>
            </div>
            <AppIcon name="chevronDown" :size="14" />
          </div>

          <div class="job-pipeline-copilot-list">
            <article
              v-for="card in copilotCards"
              :key="card.title"
              class="job-pipeline-copilot-card"
              :class="toneClass(card.tone)"
            >
              <span class="job-pipeline-copilot-icon" :class="toneClass(card.tone)">
                <AppIcon :name="card.tone === 'green' ? 'checkCircle' : card.tone === 'orange' ? 'alert' : card.tone === 'violet' ? 'spark' : 'clock'" :size="14" />
              </span>
              <strong>{{ card.title }}</strong>
              <p>{{ card.copy }}</p>
              <button type="button">{{ card.action }}</button>
            </article>
          </div>

          <button class="job-pipeline-copilot-button" type="button">Ask AI Copilot</button>
          </section>
        </aside>
      </div>

      <div v-else class="job-pipeline-manager-view">
        <div class="job-pipeline-manager-top">
          <article class="job-pipeline-manager-card job-pipeline-manager-card--status">
            <div class="job-pipeline-manager-ring">
              <div>87</div>
            </div>
            <div class="job-pipeline-manager-status-copy">
              <span>Hiring status</span>
              <strong>On track</strong>
              <small>Great pipeline health</small>
            </div>
          </article>

          <article class="job-pipeline-manager-card job-pipeline-manager-card--metrics">
            <div><strong>3</strong><span>Candidates ready for review</span></div>
            <div><strong>2</strong><span>Interviews this week</span></div>
            <div><strong>1</strong><span>Decision pending</span></div>
          </article>

          <article class="job-pipeline-manager-card job-pipeline-manager-card--date">
            <span>Expected hire date</span>
            <strong>July 14, 2025</strong>
            <small>In 30 days</small>
            <button class="job-pipeline-inline-button job-pipeline-manager-inline" type="button">View full summary</button>
          </article>
        </div>

        <div class="job-pipeline-manager-grid">
          <section class="job-pipeline-manager-panel">
            <div class="job-pipeline-manager-panel-head">
              <div class="job-pipeline-manager-heading">
                <strong>My actions</strong>
                <span>4</span>
              </div>
              <button type="button">View all</button>
            </div>

            <div class="job-pipeline-manager-action-list">
              <article
                v-for="item in hiringManagerActions"
                :key="item.title"
                class="job-pipeline-manager-action-card"
                :class="{ 'is-clickable': item.action !== 'none' }"
                @click="handleManagerAction(item)"
              >
                <span class="job-pipeline-manager-action-icon" :class="toneClass(item.tone)">
                  <AppIcon :name="item.icon" :size="13" />
                </span>
                <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--small"><span aria-hidden="true" /></span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.note }}</small>
                </div>
                <em :class="toneClass(item.tone)">{{ item.meta }}</em>
                <AppIcon name="chevronRight" :size="12" />
              </article>
            </div>
          </section>

          <section class="job-pipeline-manager-panel">
            <div class="job-pipeline-manager-panel-head">
              <strong>Top candidates</strong>
              <button type="button">View all</button>
            </div>

            <div class="job-pipeline-manager-candidate-list">
              <article v-for="(item, index) in hiringManagerTopCandidates" :key="item.name" class="job-pipeline-manager-candidate-row">
                <span class="job-pipeline-manager-rank">{{ index + 1 }}</span>
                <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--small"><span aria-hidden="true" /></span>
                <div class="job-pipeline-manager-candidate-copy">
                  <strong>{{ item.name }}</strong>
                  <small>{{ item.role }}</small>
                  <div class="job-pipeline-manager-chip-row">
                    <span class="job-pipeline-manager-chip is-green">{{ item.match }}</span>
                    <span v-if="item.status" class="job-pipeline-manager-chip" :class="toneClass(item.tone)">{{ item.status }}</span>
                  </div>
                </div>
                <div class="job-pipeline-manager-inline-icons">
                  <AppIcon name="eye" :size="12" />
                  <AppIcon name="mail" :size="12" />
                  <AppIcon name="chart-bars" :size="12" />
                </div>
              </article>
            </div>

            <button class="job-pipeline-manager-primary" type="button">
              <AppIcon name="compare" :size="13" />
              <span>Compare top 3 candidates</span>
            </button>
          </section>

          <section class="job-pipeline-manager-panel">
            <div class="job-pipeline-manager-panel-head">
              <strong>Upcoming interviews</strong>
              <button type="button">View calendar</button>
            </div>

            <div class="job-pipeline-manager-upcoming-list">
              <article v-for="item in hiringManagerUpcoming" :key="`${item.name}-${item.day}`" class="job-pipeline-manager-upcoming-card">
                <div class="job-pipeline-manager-date-badge">
                  <span>{{ item.month }}</span>
                  <strong>{{ item.day }}</strong>
                  <small>{{ item.weekday }}</small>
                </div>
                <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--small"><span aria-hidden="true" /></span>
                <div>
                  <strong>{{ item.name }}</strong>
                  <small>{{ item.title }}</small>
                  <span>{{ item.panels }}</span>
                </div>
                <div class="job-pipeline-manager-time">
                  <strong>{{ item.time }}</strong>
                  <small>{{ item.duration }}</small>
                </div>
              </article>
            </div>

            <button class="job-pipeline-text-link" type="button">View all interviews</button>
          </section>

          <section class="job-pipeline-manager-panel">
            <div class="job-pipeline-manager-panel-head">
              <strong>Team feedback</strong>
              <button type="button" @click="openReviewFeedbackModal">View all feedback</button>
            </div>

            <div class="job-pipeline-manager-feedback-score">
              <strong>{{ hiringManagerFeedback.score }}</strong>
              <span>{{ hiringManagerFeedback.averageLabel }}</span>
            </div>

            <div class="job-pipeline-manager-stars">
              <i v-for="star in 5" :key="star" :class="{ 'is-off': star > 4 }" />
            </div>

            <div class="job-pipeline-manager-feedback-list">
              <article v-for="item in hiringManagerFeedback.items" :key="item.label">
                <span class="job-pipeline-manager-feedback-icon" :class="toneClass(item.tone)">
                  <AppIcon :name="item.icon" :size="12" />
                </span>
                <strong>{{ item.label }}</strong>
              </article>
            </div>

            <div class="job-pipeline-manager-response">
              <span>Average response time</span>
              <strong>{{ hiringManagerFeedback.response }}</strong>
            </div>

            <div class="job-pipeline-manager-feedback-footer">
              <div class="job-pipeline-manager-avatars">
                <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--tiny"><span aria-hidden="true" /></span>
                <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--tiny"><span aria-hidden="true" /></span>
                <span class="job-pipeline-candidate-avatar job-pipeline-candidate-avatar--tiny"><span aria-hidden="true" /></span>
              </div>
              <small>{{ hiringManagerFeedback.footer }}</small>
              <button class="job-pipeline-inline-button job-pipeline-manager-inline" type="button" @click="openReviewFeedbackModal">Send reminder</button>
            </div>
          </section>

          <section class="job-pipeline-manager-panel">
            <div class="job-pipeline-manager-panel-head">
              <div class="job-pipeline-panel-title">
                <strong>AI recommendation</strong>
                <small class="job-pipeline-beta">Beta</small>
              </div>
            </div>

            <div class="job-pipeline-manager-ai-card">
              <small>Recommended candidate</small>
              <div class="job-pipeline-manager-ai-title">
                <strong>{{ hiringManagerRecommendation.candidate }}</strong>
                <span class="job-pipeline-manager-chip is-green">{{ hiringManagerRecommendation.match }}</span>
              </div>
              <div class="job-pipeline-manager-ai-columns">
                <div>
                  <span>Why Sarah ranks #1</span>
                  <ul class="job-pipeline-manager-bullets is-positive">
                    <li v-for="item in hiringManagerRecommendation.reasons" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div>
                  <span>Trade-offs</span>
                  <ul class="job-pipeline-manager-bullets is-warning">
                    <li v-for="item in hiringManagerRecommendation.tradeoffs" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>
              <div class="job-pipeline-manager-confidence">
                <span>Confidence</span>
                <strong>{{ hiringManagerRecommendation.confidence }}</strong>
                <div class="job-pipeline-manager-confidence-bar"><i :style="{ width: hiringManagerRecommendation.confidence }" /></div>
              </div>
              <button class="job-pipeline-inline-button job-pipeline-manager-inline is-wide" type="button">View full AI analysis</button>
            </div>
          </section>

          <section class="job-pipeline-manager-panel">
            <div class="job-pipeline-manager-panel-head">
              <strong>Hiring progress</strong>
              <button type="button">View pipeline</button>
            </div>

            <div class="job-pipeline-manager-progress">
              <div class="job-pipeline-manager-progress-track">
                <span
                  v-for="(stage, index) in hiringManagerProgress.stages"
                  :key="stage.label"
                  class="job-pipeline-manager-stage"
                  :class="[{ 'is-complete': stage.complete, 'is-current': stage.current }, toneClass(stage.tone)]"
                >
                  <i>{{ stage.complete ? '✓' : index + 1 }}</i>
                  <small>{{ stage.label }}</small>
                </span>
              </div>
              <span class="job-pipeline-manager-progress-pill">You are here</span>
            </div>

            <div class="job-pipeline-manager-stage-summary">
              <article v-for="item in hiringManagerProgress.summary" :key="item.label" class="job-pipeline-manager-stage-row">
                <div>
                  <strong>{{ item.label }}</strong>
                  <small>{{ item.count }}</small>
                </div>
                <span class="job-pipeline-manager-chip" :class="toneClass(item.tone)">{{ item.status }}</span>
              </article>
            </div>

            <button class="job-pipeline-text-link" type="button">View full pipeline</button>
          </section>
        </div>

        <div class="job-pipeline-tip">
          <span>Tip: Provide feedback for Daniel Brown's interview</span>
          <button type="button">Learn more about hiring manager view</button>
        </div>
      </div>

      <div v-if="reviewFeedbackModal" class="job-pipeline-feedback-overlay" @click.self="closeFeedbackModal">
        <section v-if="reviewFeedbackModal === 'list'" class="job-pipeline-feedback-modal">
          <header class="job-pipeline-feedback-modal-head">
            <div class="job-pipeline-feedback-modal-title">
              <span class="job-pipeline-feedback-modal-icon is-pink">
                <AppIcon name="mail" :size="18" />
              </span>
              <div>
                <strong>Review feedback</strong>
                <small>5 candidates are waiting for feedback</small>
              </div>
            </div>
            <button class="job-pipeline-feedback-close" type="button" @click="closeFeedbackModal">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <div class="job-pipeline-feedback-stats">
            <article v-for="item in reviewFeedbackStats" :key="item.label" class="job-pipeline-feedback-stat-card">
              <span class="job-pipeline-feedback-stat-icon" :class="toneClass(item.tone)">
                <AppIcon :name="item.icon" :size="16" />
              </span>
              <div>
                <strong>{{ item.value }}</strong>
                <small>{{ item.label }}</small>
              </div>
            </article>
          </div>

          <div class="job-pipeline-feedback-list">
            <article v-for="item in reviewFeedbackCandidates" :key="item.id" class="job-pipeline-feedback-row">
              <div class="job-pipeline-feedback-person">
                <span class="job-pipeline-feedback-avatar" :class="toneClass(item.departmentTone)">{{ item.initials }}</span>
                <div>
                  <strong>{{ item.name }}</strong>
                  <small>{{ item.role }}</small>
                  <span class="job-pipeline-feedback-department" :class="toneClass(item.departmentTone)">
                    <AppIcon name="briefcase" :size="11" />
                    {{ item.department }}
                  </span>
                </div>
              </div>

              <div class="job-pipeline-feedback-status-block">
                <template v-if="item.ownFeedback">
                  <span class="job-pipeline-feedback-pill is-soft-pink">{{ item.statusLabel }}</span>
                  <strong>{{ item.statusTitle }}</strong>
                  <small>{{ item.statusMeta }}</small>
                </template>
                <template v-else>
                  <span>Missing feedback from</span>
                  <strong>{{ item.missingFrom }}</strong>
                  <small>{{ item.missingRole }}</small>
                </template>
              </div>

              <div class="job-pipeline-feedback-actions">
                <span class="job-pipeline-feedback-pill" :class="`is-${item.overdueTone}`">{{ item.overdue }}</span>
                <button
                  class="job-pipeline-feedback-action-button"
                  :class="{ 'is-primary': item.ownFeedback }"
                  type="button"
                  @click="item.ownFeedback ? openCompleteFeedbackModal(item.id) : null"
                >
                  <AppIcon :name="item.ownFeedback ? 'edit' : 'share'" :size="13" />
                  <span>{{ item.ownFeedback ? 'Complete Feedback' : 'Send reminder' }}</span>
                </button>
              </div>
            </article>
          </div>

          <footer class="job-pipeline-feedback-modal-footer">
            <button class="job-pipeline-feedback-secondary-button" type="button">
              <AppIcon name="document" :size="14" />
              <span>Export list</span>
            </button>
            <div class="job-pipeline-feedback-footer-actions">
              <button class="job-pipeline-feedback-secondary-button is-accent" type="button">
                <AppIcon name="share" :size="14" />
                <span>Send reminders (3)</span>
              </button>
              <button class="job-pipeline-feedback-primary-button" type="button" @click="openCompleteFeedbackModal()">
                <AppIcon name="edit" :size="14" />
                <span>Complete my feedback (2)</span>
              </button>
            </div>
          </footer>
        </section>

        <section v-else class="job-pipeline-complete-feedback-modal">
          <header class="job-pipeline-feedback-modal-head">
            <div class="job-pipeline-feedback-modal-title">
              <span class="job-pipeline-feedback-modal-icon is-pink">
                <AppIcon name="clipboard-check" :size="18" />
              </span>
              <div>
                <strong>Complete Feedback</strong>
                <small>{{ selectedFeedbackCandidate.name }} <span class="job-pipeline-feedback-dot" /> {{ selectedFeedbackCandidate.role }}</small>
              </div>
            </div>
            <button class="job-pipeline-feedback-close" type="button" @click="backToReviewFeedbackModal">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <div class="job-pipeline-complete-feedback-meta">
            <span class="job-pipeline-feedback-pill is-soft-pink">Interview Round 2</span>
            <span class="job-pipeline-feedback-chip"><AppIcon name="info" :size="13" /> 45 mins</span>
            <span class="job-pipeline-feedback-chip"><AppIcon name="calendar" :size="13" /> Completed Yesterday</span>
          </div>

          <section class="job-pipeline-complete-feedback-section">
            <h3>Overall Recommendation</h3>
            <div class="job-pipeline-complete-feedback-options">
              <button
                v-for="option in feedbackRecommendationOptions"
                :key="option.value"
                class="job-pipeline-complete-feedback-option"
                :class="{ 'is-active': feedbackRecommendation === option.value }"
                type="button"
                @click="feedbackRecommendation = option.value"
              >
                <AppIcon :name="option.icon" :size="28" />
                <strong>{{ option.label }}</strong>
                <i />
              </button>
            </div>
          </section>

          <section class="job-pipeline-complete-feedback-section">
            <h3>Quick Evaluation</h3>
            <div class="job-pipeline-complete-feedback-ratings">
              <article v-for="item in feedbackEvaluationRows" :key="item.key" class="job-pipeline-complete-feedback-rating-row">
                <div>
                  <strong>{{ item.label }}</strong>
                  <AppIcon name="info" :size="12" />
                </div>
                <div class="job-pipeline-complete-feedback-stars">
                  <button
                    v-for="star in 5"
                    :key="star"
                    class="job-pipeline-complete-feedback-star"
                    :class="{ 'is-active': star <= item.rating }"
                    type="button"
                    @click="updateFeedbackRating(item.key, star)"
                  >
                    ★
                  </button>
                </div>
              </article>
            </div>
          </section>

          <section class="job-pipeline-complete-feedback-section">
            <h3>Feedback Notes</h3>
            <div class="job-pipeline-complete-feedback-notes">
              <textarea v-model="feedbackNotes" maxlength="1000" placeholder="What stood out during the interview?" />
              <small>{{ feedbackNoteCount }}/1000</small>
            </div>
          </section>

          <footer class="job-pipeline-feedback-modal-footer is-complete">
            <button class="job-pipeline-feedback-secondary-button" type="button" @click="closeFeedbackModal">
              <AppIcon name="document" :size="14" />
              <span>Save Draft</span>
            </button>
            <div class="job-pipeline-feedback-footer-actions">
              <button class="job-pipeline-feedback-secondary-button" type="button" @click="backToReviewFeedbackModal">
                <span>Cancel</span>
              </button>
              <button class="job-pipeline-feedback-primary-button" type="button" @click="closeFeedbackModal">
                <span>Submit &amp; Move Forward</span>
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.job-pipeline-page {
  min-height: calc(100vh - 88px);
  background: #fbfcfe;
}

.job-pipeline-shell {
  max-width: 1600px;
  margin: 0 auto;
  padding: 18px 24px 28px;
}

.job-pipeline-topbar,
.job-pipeline-actions,
.job-pipeline-hero,
.job-pipeline-title-row,
.job-pipeline-meta,
.job-pipeline-view-switch,
.job-pipeline-tabs,
.job-pipeline-summary-layout,
.job-pipeline-summary-stats,
.job-pipeline-panel-head,
.job-pipeline-panel-title,
.job-pipeline-status-block,
.job-pipeline-status-metrics,
.job-pipeline-board-head,
.job-pipeline-board-title,
.job-pipeline-board-controls,
.job-pipeline-board-view-tabs,
.job-pipeline-column-head,
.job-pipeline-column-meta,
.job-pipeline-candidate-top,
.job-pipeline-candidate-bottom,
.job-pipeline-bottom-grid,
.job-pipeline-chart-legend,
.job-pipeline-chart-footer,
.job-pipeline-tip {
  display: flex;
  align-items: center;
}

.job-pipeline-topbar,
.job-pipeline-hero,
.job-pipeline-board-head,
.job-pipeline-panel-head,
.job-pipeline-column-head,
.job-pipeline-tip {
  justify-content: space-between;
}

.job-pipeline-back,
.job-pipeline-ghost,
.job-pipeline-outline-accent,
.job-pipeline-icon-button,
.job-pipeline-view-button,
.job-pipeline-tab,
.job-pipeline-inline-button,
.job-pipeline-resolve,
.job-pipeline-link,
.job-pipeline-copilot-card button,
.job-pipeline-copilot-button,
.job-pipeline-add-candidate,
.job-pipeline-recommendation-card button,
.job-pipeline-tip button {
  border: 0;
  background: transparent;
  font: inherit;
}

.job-pipeline-back,
.job-pipeline-ghost,
.job-pipeline-outline-accent,
.job-pipeline-view-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid #e6ebf4;
  border-radius: 12px;
  color: #4e5d78;
  cursor: pointer;
  background: #fff;
}

.job-pipeline-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e6ebf4;
  border-radius: 12px;
  color: #94a0b4;
  background: #fff;
  cursor: pointer;
}

.job-pipeline-outline-accent {
  color: #ff5aa7;
  border-color: #ffd2e7;
}

.job-pipeline-actions,
.job-pipeline-view-switch,
.job-pipeline-board-controls {
  gap: 10px;
}

.job-pipeline-hero {
  margin-top: 14px;
}

.job-pipeline-title-row {
  gap: 12px;
  justify-content: flex-start;
}

.job-pipeline-title-row h1 {
  margin: 0;
  color: #162447;
  font-size: 1.9rem;
}

.job-pipeline-status {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #e8fbef;
  color: #26ad5f;
  font-size: 0.9rem;
  font-weight: 700;
}

.job-pipeline-meta {
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
  color: #7f8ba0;
  font-size: 0.92rem;
}

.job-pipeline-meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c9d3e2;
}

.job-pipeline-view-button.is-active {
  color: #ff5aa7;
  border-color: #ffd8e9;
  background: #fff8fc;
}

.job-pipeline-tabs {
  gap: 24px;
  margin-top: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9eef6;
}

.job-pipeline-content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(204px, 212px);
  gap: 12px;
  align-items: start;
  margin-top: 18px;
}

.job-pipeline-main-column {
  display: grid;
  gap: 14px;
  min-width: 0;
  overflow: hidden;
}

.job-pipeline-sidebar {
  display: grid;
  gap: 10px;
  min-width: 0;
  align-self: start;
}

.job-pipeline-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 0 10px;
  color: #73829a;
  cursor: pointer;
  font-size: 0.84rem;
}

.job-pipeline-tab.is-active {
  color: #ff5aa7;
  border-bottom: 2px solid #ff5aa7;
}

.job-pipeline-overview {
  display: block;
  margin-top: 0;
  min-width: 0;
}

.job-pipeline-overview--timeline {
  margin-top: 0;
}

.job-pipeline-summary-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.95fr) minmax(190px, 0.64fr);
  gap: 12px;
  align-items: start;
}

.job-pipeline-panel {
  border: 1px solid #e6ecf5;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.04);
  padding: 12px;
  height: fit-content;
}

.job-pipeline-panel--summary {
  border-left: 4px solid #ff67ae;
}

.job-pipeline-panel--timeline-summary {
  padding: 14px 16px;
}

.job-pipeline-panel--copilot {
  width: 100%;
  max-width: 212px;
  height: fit-content;
  align-self: start;
}

.job-pipeline-panel--summary,
.job-pipeline-panel--status {
  align-self: start;
}

.job-pipeline-panel-title {
  gap: 10px;
  font-size: 0.84rem;
}

.job-pipeline-panel-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 7px;
}

.job-pipeline-panel-mark.is-pink {
  background: #fff2f9;
  color: #ff5aa7;
}

.job-pipeline-summary-layout {
  align-items: flex-start;
  gap: 12px;
  margin-top: 10px;
}

.job-pipeline-summary-copy {
  flex: 1;
  max-width: 170px;
}

.job-pipeline-summary-copy h2 {
  margin: 0 0 8px;
  color: #22b161;
  font-size: 0.92rem;
  line-height: 1.2;
}

.job-pipeline-summary-copy p {
  margin: 4px 0;
  color: #758298;
  line-height: 1.45;
  font-size: 0.68rem;
}

.job-pipeline-inline-button {
  margin-top: 10px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid #e6ecf5;
  border-radius: 10px;
  color: #30415f;
  background: #fff;
  cursor: pointer;
  font-size: 0.7rem;
}

.job-pipeline-summary-stats {
  gap: 10px;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.job-pipeline-stat-card {
  width: 64px;
  min-height: 66px;
  padding: 8px 6px;
  border-radius: 10px;
  background: #fbfcff;
  text-align: center;
}

.job-pipeline-stat-card strong {
  display: block;
  color: #162447;
  font-size: 0.9rem;
}

.job-pipeline-stat-card strong.is-orange {
  color: #ff922c;
}

.job-pipeline-stat-card strong.is-pink {
  color: #ff5aa7;
}

.job-pipeline-stat-card strong.is-green {
  color: #22b161;
}

.job-pipeline-stat-card span {
  display: block;
  margin-top: 4px;
  color: #7d889b;
  font-size: 0.58rem;
  line-height: 1.35;
}

.job-pipeline-resolve {
  align-self: flex-start;
  height: 28px;
  padding: 0 9px;
  border-radius: 8px;
  background: #fff1f7;
  color: #ff5aa7;
  cursor: pointer;
  font-size: 0.64rem;
}

.job-pipeline-status-block {
  gap: 10px;
  margin-top: 10px;
  justify-content: flex-start;
}

.job-pipeline-ring {
  position: relative;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: conic-gradient(#22c55e 0deg 313deg, #eaf7ef 313deg 360deg);
}

.job-pipeline-ring::before {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: #fff;
}

.job-pipeline-ring div {
  position: relative;
  z-index: 1;
  font-size: 0.88rem;
  font-weight: 800;
  color: #162447;
}

.job-pipeline-status-copy strong {
  display: block;
  color: #22b161;
  font-size: 0.76rem;
}

.job-pipeline-status-copy span {
  color: #7d889b;
  font-size: 0.62rem;
}

.job-pipeline-status-metrics {
  gap: 12px;
  margin-top: 14px;
  justify-content: flex-start;
  align-items: flex-start;
}

.job-pipeline-status-metrics div strong {
  display: block;
  color: #162447;
  font-size: 0.88rem;
}

.job-pipeline-status-metrics div span {
  color: #7d889b;
  font-size: 0.56rem;
}

.job-pipeline-link {
  margin-top: 10px;
  color: #ff5aa7;
  cursor: pointer;
  font-size: 0.62rem;
}

.job-pipeline-copilot-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.job-pipeline-copilot-card {
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #eef2f8;
  background: #fff;
}

.job-pipeline-copilot-card.is-pink {
  background: #fff8fa;
  border-color: #ffd8e8;
}

.job-pipeline-copilot-card.is-green {
  background: #f8fffb;
  border-color: #d8f5e3;
}

.job-pipeline-copilot-card.is-orange {
  background: #fffaf5;
  border-color: #ffe5c7;
}

.job-pipeline-copilot-card.is-violet {
  background: #f8f8ff;
  border-color: #e5e3ff;
}

.job-pipeline-copilot-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 7px;
  background: #fff;
}

.job-pipeline-copilot-icon.is-pink {
  color: #ff6b8f;
}

.job-pipeline-copilot-icon.is-green {
  color: #22b161;
}

.job-pipeline-copilot-icon.is-orange {
  color: #ff922c;
}

.job-pipeline-copilot-icon.is-violet {
  color: #7c6cff;
}

.job-pipeline-copilot-card strong {
  display: block;
  margin-top: 10px;
  color: #162447;
  font-size: 0.74rem;
  line-height: 1.25;
}

.job-pipeline-copilot-card p {
  margin: 7px 0 0;
  color: #7d889b;
  line-height: 1.45;
  font-size: 0.66rem;
  white-space: pre-line;
}

.job-pipeline-copilot-card button {
  width: 100%;
  height: 28px;
  margin-top: 10px;
  border: 1px solid #e6ecf5;
  border-radius: 10px;
  color: #ff5aa7;
  background: #fff;
  cursor: pointer;
  font-size: 0.64rem;
}

.job-pipeline-copilot-button {
  width: 100%;
  height: 30px;
  margin-top: 12px;
  border: 1px solid #ffc3de;
  border-radius: 12px;
  color: #ff5aa7;
  background: #fff;
  cursor: pointer;
  font-size: 0.7rem;
}

.job-pipeline-board-panel,
.job-pipeline-bottom-grid {
  margin-top: 0;
}

.job-pipeline-board-panel {
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

.job-pipeline-board-title {
  gap: 12px;
  min-width: 0;
}

.job-pipeline-board-head {
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.job-pipeline-board-head > * {
  min-width: 0;
}

.job-pipeline-board-title h2 {
  margin: 0;
  color: #162447;
  font-size: 1.12rem;
}

.job-pipeline-board-title span {
  color: #9aa5b7;
  font-size: 0.8rem;
}

.job-pipeline-board-view-tabs {
  gap: 6px;
  padding: 4px;
  border-radius: 12px;
  background: #f6f8fc;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  scrollbar-width: none;
}

.job-pipeline-board-view-tabs::-webkit-scrollbar {
  display: none;
}

.job-pipeline-board-controls {
  min-width: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.job-pipeline-board-controls .job-pipeline-ghost,
.job-pipeline-board-controls .job-pipeline-icon-button {
  height: 32px;
}

.job-pipeline-board-controls .job-pipeline-ghost {
  padding: 0 12px;
  font-size: 0.78rem;
}

.job-pipeline-board-view-tabs button {
  flex: 0 0 auto;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #758298;
  font: inherit;
  cursor: pointer;
  font-size: 0.78rem;
}

.job-pipeline-board-view-tabs .is-active {
  background: #fff;
  color: #ff5aa7;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
}

.job-pipeline-board {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 152px;
  gap: 8px;
  width: max-content;
  min-width: 0;
}

.job-pipeline-board-scroll {
  margin-top: 16px;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: #d18ad7 transparent;
}

.job-pipeline-board-scroll::-webkit-scrollbar {
  height: 10px;
}

.job-pipeline-board-scroll::-webkit-scrollbar-track {
  background: #f3e5f7;
  border-radius: 999px;
}

.job-pipeline-board-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #d18ad7 0%, #c56fcb 100%);
  border-radius: 999px;
}

.job-pipeline-list-view {
  margin-top: 14px;
}

.job-pipeline-list-table {
  border: 1px solid #edf1f7;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  overflow-x: auto;
}

.job-pipeline-list-head,
.job-pipeline-list-row,
.job-pipeline-list-footer,
.job-pipeline-list-candidate,
.job-pipeline-list-owner,
.job-pipeline-list-match,
.job-pipeline-list-pagination {
  display: flex;
  align-items: center;
}

.job-pipeline-list-head,
.job-pipeline-list-row {
  display: grid;
  grid-template-columns: 28px minmax(180px, 2.1fr) minmax(80px, 0.8fr) minmax(70px, 0.7fr) minmax(82px, 0.8fr) minmax(140px, 1.2fr) minmax(130px, 1.1fr) minmax(110px, 1fr) 28px;
  gap: 12px;
  padding: 11px 14px;
}

.job-pipeline-list-head {
  background: #fbfcff;
  border-bottom: 1px solid #edf1f7;
  color: #7c889c;
  font-size: 0.6rem;
  font-weight: 700;
}

.job-pipeline-list-row {
  border-bottom: 1px solid #f1f4f9;
}

.job-pipeline-list-row:last-child {
  border-bottom: 0;
}

.job-pipeline-list-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.job-pipeline-list-check input {
  width: 14px;
  height: 14px;
  margin: 0;
  accent-color: #ff5aa7;
}

.job-pipeline-list-candidate,
.job-pipeline-list-owner {
  gap: 8px;
  min-width: 0;
}

.job-pipeline-list-candidate div,
.job-pipeline-list-meta,
.job-pipeline-list-owner strong {
  min-width: 0;
}

.job-pipeline-candidate-avatar--small {
  width: 22px;
  height: 22px;
  flex-basis: 22px;
}

.job-pipeline-list-candidate strong,
.job-pipeline-list-meta strong,
.job-pipeline-list-owner strong {
  display: block;
  color: #162447;
  font-size: 0.66rem;
  line-height: 1.3;
}

.job-pipeline-list-candidate span,
.job-pipeline-list-meta span {
  display: block;
  color: #98a4b6;
  font-size: 0.56rem;
  line-height: 1.3;
}

.job-pipeline-list-badge,
.job-pipeline-list-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 0.56rem;
  font-weight: 700;
}

.job-pipeline-list-badge.is-pink,
.job-pipeline-list-status.is-pink {
  background: #fff1f7;
  color: #ff5aa7;
}

.job-pipeline-list-badge.is-orange,
.job-pipeline-list-status.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-pipeline-list-badge.is-violet {
  background: #f1efff;
  color: #6f63ff;
}

.job-pipeline-list-badge.is-green,
.job-pipeline-list-status.is-green {
  background: #edf9f1;
  color: #22b161;
}

.job-pipeline-list-badge.is-slate {
  background: #f2f5fa;
  color: #72809a;
}

.job-pipeline-list-match {
  gap: 8px;
}

.job-pipeline-list-match strong {
  color: #162447;
  font-size: 0.66rem;
}

.job-pipeline-list-match span {
  color: #22c55e;
  font-size: 0.56rem;
  letter-spacing: 0.02em;
}

.job-pipeline-list-match span small {
  color: #d5dce7;
  font-size: 0.56rem;
}

.job-pipeline-list-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #9aa5b7;
  cursor: pointer;
}

.job-pipeline-list-footer {
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding: 0 4px;
}

.job-pipeline-list-footer > span {
  color: #98a4b6;
  font-size: 0.56rem;
}

.job-pipeline-list-pagination {
  gap: 4px;
}

.job-pipeline-list-pagination button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border: 1px solid #e6ebf4;
  border-radius: 8px;
  background: #fff;
  color: #77849b;
  font: inherit;
  font-size: 0.58rem;
  cursor: pointer;
}

.job-pipeline-list-pagination button.is-active {
  border-color: #ffc3de;
  color: #ff5aa7;
  background: #fff6fb;
}

.job-pipeline-list-pagination span {
  color: #a2aec0;
  font-size: 0.58rem;
}

.job-pipeline-content-grid.is-compare {
  grid-template-columns: minmax(0, 1fr) minmax(228px, 236px);
}

.job-pipeline-panel-mark.is-violet {
  background: #f3edff;
  color: #8f5cf7;
}

.job-pipeline-outline-accent.is-solid {
  background: #ff5aa7;
  color: #fff;
  border-color: #ff5aa7;
}

.job-pipeline-inline-button.is-small {
  margin-top: 0;
  height: 32px;
  padding: 0 12px;
  font-size: 0.62rem;
}

.job-pipeline-text-link {
  border: 0;
  padding: 0;
  background: transparent;
  color: #ff5aa7;
  font: inherit;
  font-size: 0.56rem;
  font-weight: 600;
  cursor: pointer;
}

.job-pipeline-candidate-avatar--compare {
  width: 38px;
  height: 38px;
  flex-basis: 38px;
}

.job-pipeline-candidate-avatar--tiny {
  width: 18px;
  height: 18px;
  flex-basis: 18px;
}

.job-pipeline-compare-view {
  display: grid;
  gap: 10px;
}

.job-pipeline-compare-hero,
.job-pipeline-compare-hero-summary,
.job-pipeline-compare-highlight-meta,
.job-pipeline-compare-candidates,
.job-pipeline-compare-table-head,
.job-pipeline-compare-table-header,
.job-pipeline-compare-column-head,
.job-pipeline-compare-bar-cell,
.job-pipeline-compare-rating-cell,
.job-pipeline-compare-score-row,
.job-pipeline-compare-insight-item,
.job-pipeline-compare-side-head,
.job-pipeline-compare-metric,
.job-pipeline-compare-side-saved,
.job-pipeline-compare-hero-actions {
  display: flex;
}

.job-pipeline-compare-hero,
.job-pipeline-compare-table-card,
.job-pipeline-compare-mini-card,
.job-pipeline-compare-side-card {
  border: 1px solid #e8edf6;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.04);
}

.job-pipeline-compare-hero {
  padding: 10px 12px;
  gap: 12px;
  align-items: stretch;
}

.job-pipeline-compare-hero-main {
  min-width: 0;
  flex: 1.1;
}

.job-pipeline-compare-hero-summary {
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
}

.job-pipeline-compare-highlight h3 {
  margin: 0;
  color: #162447;
  font-size: 0.9rem;
}

.job-pipeline-compare-highlight-meta {
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.job-pipeline-compare-highlight-meta strong {
  color: #ff5aa7;
  font-size: 1.08rem;
  line-height: 1;
}

.job-pipeline-compare-highlight-meta small,
.job-pipeline-compare-confidence small,
.job-pipeline-compare-table-head span,
.job-pipeline-compare-side-label,
.job-pipeline-compare-side-copy {
  color: #98a4b6;
  font-size: 0.5rem;
}

.job-pipeline-compare-confidence span {
  display: block;
  color: #56667f;
  font-size: 0.56rem;
}

.job-pipeline-compare-confidence small {
  display: block;
  margin-top: 4px;
}

.job-pipeline-compare-hero-side {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr) auto;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.job-pipeline-compare-hero-side > div > strong {
  display: block;
  color: #162447;
  font-size: 0.58rem;
}

.job-pipeline-compare-points,
.job-pipeline-compare-mini-list {
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 5px;
}

.job-pipeline-compare-points li,
.job-pipeline-compare-mini-list li {
  position: relative;
  padding-left: 13px;
  color: #65758d;
  font-size: 0.52rem;
  line-height: 1.35;
}

.job-pipeline-compare-points li::before,
.job-pipeline-compare-mini-list li::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.job-pipeline-compare-points.is-positive li::before,
.job-pipeline-compare-mini-list.is-positive li::before {
  background: #22b161;
}

.job-pipeline-compare-points.is-warning li::before,
.job-pipeline-compare-mini-list.is-warning li::before {
  background: #ff922c;
}

.job-pipeline-compare-hero-actions {
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.job-pipeline-compare-candidates {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.job-pipeline-compare-candidate-card,
.job-pipeline-compare-add {
  position: relative;
  min-width: 0;
  min-height: 88px;
  padding: 9px 8px;
  border: 1px solid #e8edf6;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.03);
  display: grid;
  place-items: center;
  text-align: center;
}

.job-pipeline-compare-candidate-card.is-selected {
  border-color: #ffb7d6;
  box-shadow: 0 14px 30px rgba(255, 90, 167, 0.08);
}

.job-pipeline-compare-rank {
  position: absolute;
  top: 6px;
  right: 7px;
  color: #c1cad8;
  font-size: 0.48rem;
  font-weight: 700;
}

.job-pipeline-compare-candidate-card strong,
.job-pipeline-compare-add span,
.job-pipeline-compare-column-head strong,
.job-pipeline-compare-criteria strong,
.job-pipeline-compare-side-title,
.job-pipeline-compare-insight-item strong,
.job-pipeline-compare-metric strong {
  color: #162447;
}

.job-pipeline-compare-candidate-card strong {
  font-size: 0.58rem;
  line-height: 1.25;
}

.job-pipeline-compare-candidate-card small {
  color: #98a4b6;
  font-size: 0.5rem;
}

.job-pipeline-compare-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 18px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 0.46rem;
  font-weight: 700;
}

.job-pipeline-compare-badge.is-green {
  background: #edf9f1;
  color: #22b161;
}

.job-pipeline-compare-badge.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-pipeline-compare-badge.is-violet {
  background: #eef0ff;
  color: #6f63ff;
}

.job-pipeline-compare-add {
  border-style: dashed;
  color: #95a1b4;
  gap: 8px;
  cursor: pointer;
}

.job-pipeline-compare-table-card {
  padding: 10px;
}

.job-pipeline-compare-table-head {
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.job-pipeline-compare-table-head strong {
  color: #162447;
  font-size: 0.62rem;
}

.job-pipeline-compare-table-scroll {
  margin-top: 8px;
  overflow-x: auto;
}

.job-pipeline-compare-table {
  min-width: 860px;
}

.job-pipeline-compare-table-header,
.job-pipeline-compare-table-row {
  display: grid;
  grid-template-columns: 142px repeat(5, minmax(104px, 1fr));
  gap: 0;
  align-items: center;
}

.job-pipeline-compare-table-header {
  padding: 6px 0 8px;
  border-bottom: 1px solid #eef2f7;
}

.job-pipeline-compare-criteria-head,
.job-pipeline-compare-column-head strong,
.job-pipeline-compare-table-row span,
.job-pipeline-compare-table-row small {
  font-size: 0.5rem;
}

.job-pipeline-compare-criteria-head {
  color: #98a4b6;
  font-weight: 700;
  text-transform: uppercase;
}

.job-pipeline-compare-column-head {
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.job-pipeline-compare-column-head strong {
  line-height: 1.2;
}

.job-pipeline-compare-table-row {
  padding: 7px 0;
  border-bottom: 1px solid #f1f4f9;
}

.job-pipeline-compare-table-row:last-child {
  border-bottom: 0;
}

.job-pipeline-compare-criteria small,
.job-pipeline-compare-text-cell span,
.job-pipeline-compare-insight-item small,
.job-pipeline-compare-metric span {
  color: #98a4b6;
}

.job-pipeline-compare-criteria strong,
.job-pipeline-compare-text-cell span,
.job-pipeline-compare-bar-cell span,
.job-pipeline-compare-rating-cell small {
  display: block;
}

.job-pipeline-compare-criteria strong,
.job-pipeline-compare-bar-cell span,
.job-pipeline-compare-text-cell span {
  font-size: 0.54rem;
}

.job-pipeline-compare-bar-cell,
.job-pipeline-compare-rating-cell {
  flex-direction: column;
  gap: 4px;
}

.job-pipeline-compare-bar-track {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: #eef2f7;
  overflow: hidden;
}

.job-pipeline-compare-bar-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #2ecc71;
}

.job-pipeline-compare-bar-track i.is-warning {
  background: #ff922c;
}

.job-pipeline-compare-stars {
  display: inline-flex;
  gap: 3px;
}

.job-pipeline-compare-stars i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22b161;
}

.job-pipeline-compare-stars.is-orange i {
  background: #ff922c;
}

.job-pipeline-compare-stars i.is-off {
  background: #e5eaf2;
}

.job-pipeline-compare-text-cell span.is-green,
.job-pipeline-compare-rating-cell small.is-green,
.job-pipeline-compare-metric em.is-green,
.job-pipeline-compare-score-pill.is-green {
  color: #22b161;
}

.job-pipeline-compare-bottom {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.job-pipeline-compare-mini-card,
.job-pipeline-compare-side-card {
  padding: 10px;
}

.job-pipeline-compare-mini-card > strong,
.job-pipeline-compare-side-head strong {
  display: block;
  color: #162447;
  font-size: 0.62rem;
}

.job-pipeline-compare-score-row {
  align-items: baseline;
  gap: 6px;
  margin-top: 8px;
}

.job-pipeline-compare-score-row em {
  color: #22b161;
  font-size: 0.96rem;
  font-style: normal;
  font-weight: 800;
}

.job-pipeline-compare-mini-card p {
  margin: 6px 0 8px;
  color: #98a4b6;
  font-size: 0.52rem;
  line-height: 1.4;
}

.job-pipeline-compare-insight-list,
.job-pipeline-compare-metrics {
  display: grid;
  gap: 8px;
  margin-top: 8px;
}

.job-pipeline-compare-insight-item,
.job-pipeline-compare-metric {
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.job-pipeline-compare-score-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 20px;
  border-radius: 999px;
  background: #edf9f1;
  font-size: 0.48rem;
  font-weight: 700;
}

.job-pipeline-compare-side-card {
  display: grid;
  gap: 8px;
}

.job-pipeline-compare-side-head,
.job-pipeline-compare-side-saved {
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.job-pipeline-compare-side-title {
  font-size: 0.66rem;
  line-height: 1.35;
}

.job-pipeline-compare-side-saved strong {
  color: #22b161;
  font-size: 0.9rem;
}

.job-pipeline-compare-metric strong {
  display: block;
  margin-top: 2px;
  font-size: 0.66rem;
}

.job-pipeline-compare-metric em {
  font-style: normal;
  font-size: 0.48rem;
  font-weight: 700;
}

.job-pipeline-manager-view,
.job-pipeline-manager-top,
.job-pipeline-manager-panel-head,
.job-pipeline-manager-heading,
.job-pipeline-manager-action-card,
.job-pipeline-manager-candidate-row,
.job-pipeline-manager-chip-row,
.job-pipeline-manager-inline-icons,
.job-pipeline-manager-upcoming-card,
.job-pipeline-manager-feedback-list article,
.job-pipeline-manager-feedback-footer,
.job-pipeline-manager-ai-title,
.job-pipeline-manager-ai-columns,
.job-pipeline-manager-response,
.job-pipeline-manager-progress-track,
.job-pipeline-manager-stage-row {
  display: flex;
}

.job-pipeline-manager-view {
  display: grid;
  gap: 12px;
}

.job-pipeline-manager-top,
.job-pipeline-manager-grid {
  display: grid;
  gap: 12px;
}

.job-pipeline-manager-top {
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 2.15fr) minmax(220px, 0.95fr);
}

.job-pipeline-manager-card,
.job-pipeline-manager-panel {
  border: 1px solid #e8edf6;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.04);
}

.job-pipeline-manager-card {
  min-width: 0;
  padding: 12px;
}

.job-pipeline-manager-card--status {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.job-pipeline-manager-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #fff 0 27px, transparent 28px),
    conic-gradient(#f05ca8 0 300deg, #f3d2e5 300deg 360deg);
  display: grid;
  place-items: center;
}

.job-pipeline-manager-ring div {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
  color: #162447;
  font-size: 0.9rem;
  font-weight: 800;
}

.job-pipeline-manager-status-copy span,
.job-pipeline-manager-card--date span,
.job-pipeline-manager-ai-card > small,
.job-pipeline-manager-ai-columns span,
.job-pipeline-manager-response span,
.job-pipeline-manager-upcoming-card div span {
  display: block;
  color: #98a4b6;
  font-size: 0.52rem;
}

.job-pipeline-manager-status-copy strong {
  display: block;
  margin-top: 3px;
  color: #f05ca8;
  font-size: 0.84rem;
}

.job-pipeline-manager-status-copy small {
  display: block;
  margin-top: 3px;
  color: #7f8ba0;
  font-size: 0.56rem;
}

.job-pipeline-manager-card--metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
}

.job-pipeline-manager-card--metrics > div {
  padding: 12px 10px;
  text-align: center;
  border-right: 1px solid #edf1f7;
}

.job-pipeline-manager-card--metrics > div:last-child {
  border-right: 0;
}

.job-pipeline-manager-card--metrics strong {
  display: block;
  color: #162447;
  font-size: 1.18rem;
}

.job-pipeline-manager-card--metrics span {
  display: block;
  margin-top: 4px;
  color: #66758c;
  font-size: 0.58rem;
  line-height: 1.35;
}

.job-pipeline-manager-card--date strong {
  display: block;
  margin-top: 6px;
  color: #162447;
  font-size: 0.98rem;
}

.job-pipeline-manager-card--date small {
  display: block;
  margin-top: 4px;
  color: #7f8ba0;
  font-size: 0.56rem;
}

.job-pipeline-manager-inline {
  margin-top: 10px;
  height: 30px;
  font-size: 0.62rem;
}

.job-pipeline-manager-inline.is-wide {
  width: 100%;
}

.job-pipeline-manager-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.job-pipeline-manager-panel {
  min-width: 0;
  padding: 14px;
}

.job-pipeline-manager-panel-head {
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.job-pipeline-manager-panel-head > strong,
.job-pipeline-manager-heading strong {
  color: #162447;
  font-size: 0.8rem;
}

.job-pipeline-manager-panel-head button {
  border: 0;
  background: transparent;
  color: #ff5aa7;
  font: inherit;
  font-size: 0.56rem;
  font-weight: 600;
  cursor: pointer;
}

.job-pipeline-manager-heading {
  align-items: center;
  gap: 8px;
}

.job-pipeline-manager-heading span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f07db8;
  color: #fff;
  font-size: 0.5rem;
  font-weight: 700;
}

.job-pipeline-manager-action-list,
.job-pipeline-manager-candidate-list,
.job-pipeline-manager-upcoming-list,
.job-pipeline-manager-feedback-list,
.job-pipeline-manager-stage-summary {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.job-pipeline-manager-action-card,
.job-pipeline-manager-upcoming-card {
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #edf1f7;
  border-radius: 12px;
}

.job-pipeline-manager-action-card.is-clickable {
  cursor: pointer;
}

.job-pipeline-manager-action-icon,
.job-pipeline-manager-feedback-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #f6f8fc;
  color: #8c99ad;
  flex: 0 0 28px;
}

.job-pipeline-manager-action-icon.is-pink {
  background: #fff1f7;
  color: #ff5aa7;
}

.job-pipeline-manager-action-icon.is-orange,
.job-pipeline-manager-feedback-icon.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-pipeline-manager-action-icon.is-green,
.job-pipeline-manager-feedback-icon.is-green {
  background: #edf9f1;
  color: #22b161;
}

.job-pipeline-manager-action-card div,
.job-pipeline-manager-candidate-row div,
.job-pipeline-manager-upcoming-card div {
  min-width: 0;
  flex: 1;
}

.job-pipeline-manager-candidate-copy {
  min-width: 0;
  flex: 1;
}

.job-pipeline-manager-action-card strong,
.job-pipeline-manager-candidate-row strong,
.job-pipeline-manager-upcoming-card strong,
.job-pipeline-manager-response strong,
.job-pipeline-manager-ai-title strong,
.job-pipeline-manager-stage-row strong {
  display: block;
  color: #162447;
  font-size: 0.68rem;
  line-height: 1.3;
}

.job-pipeline-manager-action-card small,
.job-pipeline-manager-candidate-row small,
.job-pipeline-manager-upcoming-card small,
.job-pipeline-manager-stage-row small,
.job-pipeline-manager-feedback-footer small {
  display: block;
  color: #98a4b6;
  font-size: 0.54rem;
  line-height: 1.35;
}

.job-pipeline-manager-action-card em {
  font-style: normal;
  font-size: 0.52rem;
  font-weight: 700;
  white-space: nowrap;
}

.job-pipeline-manager-action-card em.is-pink {
  color: #ff5aa7;
}

.job-pipeline-manager-action-card em.is-orange {
  color: #ff922c;
}

.job-pipeline-manager-action-card em.is-green {
  color: #22b161;
}

.job-pipeline-manager-rank {
  color: #9eaabc;
  font-size: 0.56rem;
  width: 14px;
  flex: 0 0 14px;
  text-align: center;
}

.job-pipeline-manager-candidate-row {
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #f2f5fa;
}

.job-pipeline-manager-candidate-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.job-pipeline-manager-chip-row,
.job-pipeline-manager-inline-icons {
  align-items: center;
  gap: 5px;
}

.job-pipeline-manager-chip-row {
  margin-top: 5px;
  flex-wrap: wrap;
}

.job-pipeline-manager-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 18px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 0.48rem;
  font-weight: 700;
  line-height: 1;
}

.job-pipeline-manager-chip.is-green {
  background: #edf9f1;
  color: #22b161;
}

.job-pipeline-manager-chip.is-violet {
  background: #eef0ff;
  color: #6f63ff;
}

.job-pipeline-manager-chip.is-orange,
.job-pipeline-manager-stage-row .job-pipeline-manager-chip.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-pipeline-manager-chip.is-pink {
  background: #fff1f7;
  color: #ff5aa7;
}

.job-pipeline-manager-inline-icons {
  color: #98a4b6;
  flex: 0 0 auto;
  margin-left: auto;
  justify-content: flex-end;
  min-width: 52px;
}

.job-pipeline-manager-primary {
  width: 100%;
  height: 36px;
  margin-top: 12px;
  border: 0;
  border-radius: 12px;
  background: #ea67af;
  color: #fff;
  font: inherit;
  font-size: 0.62rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.job-pipeline-manager-date-badge {
  width: 46px;
  flex: 0 0 46px;
  padding: 8px 6px;
  border-radius: 10px;
  background: #f8f9fd;
  text-align: center;
}

.job-pipeline-manager-date-badge span,
.job-pipeline-manager-date-badge small {
  display: block;
  color: #7f8ba0;
  font-size: 0.48rem;
  text-transform: uppercase;
}

.job-pipeline-manager-date-badge strong {
  display: block;
  margin: 3px 0;
  color: #162447;
  font-size: 0.94rem;
  line-height: 1;
}

.job-pipeline-manager-time {
  text-align: right;
  flex: 0 0 auto !important;
}

.job-pipeline-manager-time strong {
  font-size: 0.6rem;
}

.job-pipeline-manager-feedback-score {
  margin-top: 14px;
}

.job-pipeline-manager-feedback-score strong {
  color: #162447;
  font-size: 1.38rem;
}

.job-pipeline-manager-feedback-score span {
  margin-left: 6px;
  color: #98a4b6;
  font-size: 0.62rem;
}

.job-pipeline-manager-stars {
  display: inline-flex;
  gap: 6px;
  margin-top: 10px;
}

.job-pipeline-manager-stars i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22b161;
}

.job-pipeline-manager-stars i.is-off {
  background: #d9e0ec;
}

.job-pipeline-manager-response {
  align-items: baseline;
  justify-content: space-between;
  margin-top: 12px;
}

.job-pipeline-manager-feedback-footer {
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #edf1f7;
}

.job-pipeline-manager-avatars {
  display: inline-flex;
  align-items: center;
}

.job-pipeline-manager-avatars .job-pipeline-candidate-avatar {
  margin-right: -6px;
  border: 2px solid #fff;
}

.job-pipeline-manager-ai-card {
  margin-top: 12px;
  padding: 10px;
  border-radius: 12px;
  background: #fbfcff;
}

.job-pipeline-manager-ai-title,
.job-pipeline-manager-response,
.job-pipeline-manager-stage-row {
  justify-content: space-between;
  gap: 10px;
}

.job-pipeline-manager-ai-columns {
  gap: 14px;
  margin-top: 12px;
}

.job-pipeline-manager-ai-columns > div {
  flex: 1;
  min-width: 0;
}

.job-pipeline-manager-bullets {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.job-pipeline-manager-bullets li {
  position: relative;
  padding-left: 14px;
  color: #65758d;
  font-size: 0.52rem;
  line-height: 1.35;
}

.job-pipeline-manager-bullets li::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.job-pipeline-manager-bullets.is-positive li::before {
  background: #22b161;
}

.job-pipeline-manager-bullets.is-warning li::before {
  background: #ff922c;
}

.job-pipeline-manager-confidence {
  margin-top: 12px;
}

.job-pipeline-manager-confidence strong {
  display: block;
  margin-top: 2px;
  color: #22b161;
  font-size: 0.6rem;
}

.job-pipeline-manager-confidence-bar {
  height: 6px;
  margin-top: 6px;
  border-radius: 999px;
  background: #edf1f7;
  overflow: hidden;
}

.job-pipeline-manager-confidence-bar i {
  display: block;
  height: 100%;
  background: #22b161;
}

.job-pipeline-manager-progress {
  margin-top: 12px;
}

.job-pipeline-manager-progress-track {
  align-items: flex-start;
  justify-content: space-between;
  gap: 0;
}

.job-pipeline-manager-stage {
  display: grid;
  justify-items: center;
  gap: 7px;
  flex: 1;
  position: relative;
}

.job-pipeline-manager-stage::after {
  content: '';
  position: absolute;
  top: 9px;
  left: calc(50% + 12px);
  width: calc(100% - 24px);
  height: 2px;
  background: #e7ecf3;
}

.job-pipeline-manager-stage:last-child::after {
  display: none;
}

.job-pipeline-manager-stage.is-complete::after {
  background: #22b161;
}

.job-pipeline-manager-stage i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #d9e0ec;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  color: #b1bccd;
  font-size: 0.54rem;
  font-style: normal;
  font-weight: 700;
}

.job-pipeline-manager-stage.is-complete i {
  border-color: #22b161;
  background: #22b161;
  color: #fff;
}

.job-pipeline-manager-stage.is-current i {
  border-color: #ff4e74;
  background: #fff;
  color: #ff4e74;
  box-shadow: inset 0 0 0 5px #fff, 0 0 0 1px #ff4e74;
}

.job-pipeline-manager-stage small {
  color: #9aa5b7;
  font-size: 0.44rem;
  text-align: center;
  text-transform: uppercase;
}

.job-pipeline-manager-stage.is-current small {
  color: #ff4e74;
  font-weight: 700;
}

.job-pipeline-manager-progress-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  min-height: 18px;
  padding: 0 8px;
  border-radius: 999px;
  background: #fff1f7;
  color: #ff4e74;
  font-size: 0.46rem;
  font-weight: 700;
}

.job-pipeline-feedback-overlay,
.job-pipeline-feedback-modal-head,
.job-pipeline-feedback-modal-title,
.job-pipeline-feedback-stats,
.job-pipeline-feedback-stat-card,
.job-pipeline-feedback-row,
.job-pipeline-feedback-person,
.job-pipeline-feedback-status-block,
.job-pipeline-feedback-actions,
.job-pipeline-feedback-modal-footer,
.job-pipeline-feedback-footer-actions,
.job-pipeline-complete-feedback-meta,
.job-pipeline-complete-feedback-options,
.job-pipeline-complete-feedback-rating-row,
.job-pipeline-complete-feedback-rating-row > div:first-child,
.job-pipeline-complete-feedback-stars {
  display: flex;
}

.job-pipeline-feedback-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(17, 24, 39, 0.18);
  backdrop-filter: blur(10px);
}

.job-pipeline-feedback-modal,
.job-pipeline-complete-feedback-modal {
  width: min(100%, 980px);
  max-height: min(90vh, 920px);
  overflow-y: auto;
  border: 1px solid #e8edf6;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
}

.job-pipeline-feedback-modal {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  padding: 26px 30px 24px;
  overflow: hidden;
}

.job-pipeline-complete-feedback-modal {
  padding: 22px 0 0;
}

.job-pipeline-feedback-modal-head {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.job-pipeline-feedback-modal-title {
  gap: 16px;
  align-items: center;
}

.job-pipeline-feedback-modal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  color: #7f8ba0;
  background: #f5f7fb;
}

.job-pipeline-feedback-modal-icon.is-pink {
  color: #ff5aa7;
  background: #fff1f7;
}

.job-pipeline-feedback-modal-title strong {
  display: block;
  color: #162447;
  font-size: 0.96rem;
  line-height: 1.15;
}

.job-pipeline-feedback-modal-title small {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  color: #7d889b;
  font-size: 0.62rem;
  line-height: 1.4;
}

.job-pipeline-feedback-dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #c7d0df;
}

.job-pipeline-feedback-close,
.job-pipeline-feedback-action-button,
.job-pipeline-feedback-secondary-button,
.job-pipeline-feedback-primary-button,
.job-pipeline-complete-feedback-option,
.job-pipeline-complete-feedback-star {
  border: 0;
  background: transparent;
  font: inherit;
}

.job-pipeline-feedback-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  color: #9aa5b8;
  cursor: pointer;
}

.job-pipeline-feedback-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  margin-top: 24px;
  border: 1px solid #e8edf6;
  border-radius: 24px;
  overflow: hidden;
}

.job-pipeline-feedback-stat-card {
  align-items: center;
  gap: 14px;
  padding: 20px 22px;
  background: #fff;
}

.job-pipeline-feedback-stat-card + .job-pipeline-feedback-stat-card {
  border-left: 1px solid #edf1f7;
}

.job-pipeline-feedback-stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #f5f7fb;
  color: #7f8ba0;
}

.job-pipeline-feedback-stat-icon.is-pink {
  background: #fff1f7;
  color: #ff5aa7;
}

.job-pipeline-feedback-stat-icon.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-pipeline-feedback-stat-icon.is-violet {
  background: #f4efff;
  color: #7c63ff;
}

.job-pipeline-feedback-stat-icon.is-green {
  background: #edf9f1;
  color: #22b161;
}

.job-pipeline-feedback-stat-card strong {
  display: block;
  color: #162447;
  font-size: 0.92rem;
  line-height: 1.1;
}

.job-pipeline-feedback-stat-card small {
  display: block;
  margin-top: 4px;
  color: #6f7f98;
  font-size: 0.58rem;
}

.job-pipeline-feedback-list {
  margin-top: 22px;
  border: 1px solid #e8edf6;
  border-radius: 24px;
  overflow: hidden;
  min-height: 0;
  overflow-y: auto;
}

.job-pipeline-feedback-row {
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: #fff;
}

.job-pipeline-feedback-row + .job-pipeline-feedback-row {
  border-top: 1px solid #edf1f7;
}

.job-pipeline-feedback-person,
.job-pipeline-feedback-status-block {
  min-width: 0;
  flex: 1;
}

.job-pipeline-feedback-person {
  align-items: center;
  gap: 16px;
  max-width: 340px;
}

.job-pipeline-feedback-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.job-pipeline-feedback-avatar.is-pink {
  background: #fff1f7;
  color: #ff5aa7;
}

.job-pipeline-feedback-avatar.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-pipeline-feedback-avatar.is-violet {
  background: #f4efff;
  color: #7c63ff;
}

.job-pipeline-feedback-avatar.is-green {
  background: #edf9f1;
  color: #22b161;
}

.job-pipeline-feedback-person strong,
.job-pipeline-feedback-status-block strong {
  display: block;
  color: #162447;
  font-size: 0.74rem;
  line-height: 1.2;
}

.job-pipeline-feedback-person small,
.job-pipeline-feedback-status-block small,
.job-pipeline-feedback-status-block span {
  display: block;
  color: #7d889b;
  font-size: 0.58rem;
  line-height: 1.4;
}

.job-pipeline-feedback-department {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 0.56rem;
  font-weight: 700;
  text-transform: uppercase;
}

.job-pipeline-feedback-department.is-pink {
  color: #ff5aa7;
}

.job-pipeline-feedback-department.is-orange {
  color: #ff922c;
}

.job-pipeline-feedback-department.is-violet {
  color: #7c63ff;
}

.job-pipeline-feedback-department.is-green {
  color: #22b161;
}

.job-pipeline-feedback-status-block {
  display: grid;
  gap: 3px;
}

.job-pipeline-feedback-actions {
  margin-left: auto;
  flex: 0 0 188px;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.job-pipeline-feedback-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 0.55rem;
  font-weight: 700;
  line-height: 1;
}

.job-pipeline-feedback-pill.is-soft-pink {
  color: #ff5aa7;
  background: #fff1f7;
}

.job-pipeline-feedback-pill.is-green {
  color: #22b161;
  background: #edf9f1;
}

.job-pipeline-feedback-pill.is-orange {
  color: #ff922c;
  background: #fff5ea;
}

.job-pipeline-feedback-pill.is-violet {
  color: #7c63ff;
  background: #f4efff;
}

.job-pipeline-feedback-action-button,
.job-pipeline-feedback-secondary-button,
.job-pipeline-feedback-primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 14px;
  font-size: 0.58rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.18s ease;
  white-space: nowrap;
}

.job-pipeline-feedback-action-button,
.job-pipeline-feedback-secondary-button {
  border: 1px solid #e2e8f2;
  color: #4e5d78;
  background: #fff;
}

.job-pipeline-feedback-action-button.is-primary,
.job-pipeline-feedback-secondary-button.is-accent {
  border-color: #ffc0d9;
  color: #ff5aa7;
}

.job-pipeline-feedback-primary-button {
  border: 1px solid #ff5aa7;
  color: #fff;
  background: linear-gradient(135deg, #ff7fbc, #ec5ba7);
  box-shadow: 0 14px 28px rgba(236, 91, 167, 0.22);
}

.job-pipeline-feedback-modal-footer {
  margin-top: 18px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  border-top: 1px solid #edf1f7;
  padding-top: 16px;
  background: #fff;
}

.job-pipeline-feedback-footer-actions {
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-left: auto;
}

.job-pipeline-feedback-modal-footer.is-complete {
  padding: 24px 32px;
  margin-top: 0;
  border-top: 1px solid #edf1f7;
  background: #fff;
  border-radius: 0 0 26px 26px;
}

.job-pipeline-complete-feedback-meta {
  align-items: center;
  gap: 12px;
  padding: 0 32px 18px;
  border-bottom: 1px solid #edf1f7;
  flex-wrap: wrap;
}

.job-pipeline-feedback-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 12px;
  background: #f5f7fb;
  color: #4e5d78;
  font-size: 0.58rem;
  font-weight: 600;
}

.job-pipeline-complete-feedback-section {
  padding: 24px 32px 0;
}

.job-pipeline-complete-feedback-section h3 {
  margin: 0 0 16px;
  color: #162447;
  font-size: 0.82rem;
}

.job-pipeline-complete-feedback-options {
  gap: 16px;
}

.job-pipeline-complete-feedback-option {
  flex: 1;
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: 26px 12px 20px;
  border: 1px solid #e2e8f2;
  border-radius: 18px;
  color: #8f9ab0;
  cursor: pointer;
}

.job-pipeline-complete-feedback-option strong {
  color: #4e5d78;
  font-size: 0.7rem;
}

.job-pipeline-complete-feedback-option i {
  width: 18px;
  height: 18px;
  border: 1.5px solid #c9d2e0;
  border-radius: 999px;
}

.job-pipeline-complete-feedback-option.is-active {
  border-color: #ff6cae;
  background: #fff4f8;
  color: #ff5aa7;
  box-shadow: inset 0 0 0 1px rgba(255, 90, 167, 0.22);
}

.job-pipeline-complete-feedback-option.is-active strong {
  color: #ff5aa7;
}

.job-pipeline-complete-feedback-option.is-active i {
  border-color: #ff6cae;
  box-shadow: inset 0 0 0 4px #ff6cae;
}

.job-pipeline-complete-feedback-ratings {
  border-top: 1px solid #edf1f7;
}

.job-pipeline-complete-feedback-rating-row {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 0;
  border-bottom: 1px solid #edf1f7;
}

.job-pipeline-complete-feedback-rating-row > div:first-child {
  align-items: center;
  gap: 6px;
  color: #97a3b6;
}

.job-pipeline-complete-feedback-rating-row strong {
  color: #3e4b66;
  font-size: 0.72rem;
}

.job-pipeline-complete-feedback-stars {
  gap: 6px;
}

.job-pipeline-complete-feedback-star {
  padding: 0;
  color: #d3d9e5;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}

.job-pipeline-complete-feedback-star.is-active {
  color: #f26aad;
}

.job-pipeline-complete-feedback-notes {
  position: relative;
}

.job-pipeline-complete-feedback-notes textarea {
  width: 100%;
  min-height: 120px;
  resize: none;
  padding: 18px 18px 34px;
  border: 1px solid #dde5f0;
  border-radius: 16px;
  outline: none;
  color: #4e5d78;
  font: inherit;
  font-size: 0.64rem;
  background: #fff;
}

.job-pipeline-complete-feedback-notes textarea::placeholder {
  color: #a0abbd;
}

.job-pipeline-complete-feedback-notes small {
  position: absolute;
  right: 16px;
  bottom: 14px;
  color: #97a3b6;
  font-size: 0.56rem;
}

.job-pipeline-workload-view {
  margin-top: 14px;
  display: grid;
  gap: 14px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.job-pipeline-workload-summary,
.job-pipeline-workload-grid,
.job-pipeline-workload-bottom,
.job-pipeline-workload-panel-head,
.job-pipeline-workload-table-head,
.job-pipeline-workload-table-row,
.job-pipeline-workload-person,
.job-pipeline-workload-summary-metric,
.job-pipeline-workload-upcoming-item,
.job-pipeline-workload-side-head,
.job-pipeline-workload-side-item,
.job-pipeline-workload-highlight-alert {
  display: flex;
}

.job-pipeline-workload-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(168px, 182px));
  gap: 10px;
  justify-content: start;
}

.job-pipeline-workload-summary-card,
.job-pipeline-workload-panel,
.job-pipeline-workload-side-panel {
  border: 1px solid #e8edf6;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.04);
}

.job-pipeline-workload-summary-card {
  min-width: 0;
  max-width: 100%;
  display: grid;
  gap: 6px;
  padding: 10px 12px;
}

.job-pipeline-workload-summary-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 7px;
  background: #f5f7fb;
  color: #7f8ba0;
}

.job-pipeline-workload-summary-icon.is-green {
  background: #edf9f1;
  color: #22b161;
}

.job-pipeline-workload-summary-icon.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-pipeline-workload-summary-icon.is-pink {
  background: #fff1f7;
  color: #ff5aa7;
}

.job-pipeline-workload-summary-card > small {
  display: block;
  color: #7d889b;
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1.25;
}

.job-pipeline-workload-summary-metric {
  gap: 6px;
  align-items: baseline;
  margin-top: 0;
  flex-wrap: wrap;
}

.job-pipeline-workload-summary-metric strong {
  color: #162447;
  font-size: 0.98rem;
  line-height: 1.1;
}

.job-pipeline-workload-summary-metric span {
  font-size: 0.6rem;
  font-weight: 700;
}

.job-pipeline-workload-summary-metric span.is-green {
  color: #22b161;
}

.job-pipeline-workload-summary-metric span.is-orange {
  color: #ff922c;
}

.job-pipeline-workload-summary-metric span.is-pink {
  color: #ff5aa7;
}

.job-pipeline-workload-summary-card p {
  margin: 0;
  color: #a0abbd;
  font-size: 0.5rem;
  line-height: 1.35;
}

.job-pipeline-workload-grid {
  gap: 10px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.job-pipeline-workload-grid > *,
.job-pipeline-workload-bottom > * {
  min-width: 0;
}

.job-pipeline-workload-grid > .job-pipeline-workload-panel {
  flex: 1;
}

.job-pipeline-workload-panel {
  padding: 10px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.job-pipeline-workload-panel--compact {
  flex: 1;
  padding: 10px 11px;
  min-width: 0;
}

.job-pipeline-workload-panel-head {
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.job-pipeline-workload-panel-head strong {
  color: #162447;
  font-size: 0.68rem;
}

.job-pipeline-workload-panel-head button,
.job-pipeline-workload-panel-head small {
  border: 0;
  background: transparent;
  color: #ff5aa7;
  font: inherit;
  font-size: 0.5rem;
}

.job-pipeline-workload-table {
  margin-top: 10px;
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
}

.job-pipeline-workload-table-head,
.job-pipeline-workload-table-row {
  display: grid;
  gap: 0;
  align-items: center;
  min-width: 0;
}

.job-pipeline-workload-table-head.recruiter,
.job-pipeline-workload-table-row.recruiter {
  grid-template-columns: minmax(162px, 2.04fr) minmax(46px, 0.52fr) minmax(48px, 0.58fr) minmax(58px, 0.68fr) minmax(44px, 0.42fr) minmax(34px, 0.28fr) minmax(76px, 0.72fr);
}

.job-pipeline-workload-table-head.manager,
.job-pipeline-workload-table-row.manager {
  grid-template-columns: minmax(162px, 2.08fr) minmax(56px, 0.62fr) minmax(58px, 0.68fr) minmax(52px, 0.5fr) minmax(64px, 0.68fr) minmax(76px, 0.72fr);
}

.job-pipeline-workload-table-head {
  color: #97a3b6;
  font-size: 0.48rem;
  padding-bottom: 6px;
  border-bottom: 1px solid #eef2f7;
  line-height: 1.25;
}

.job-pipeline-workload-table-head > span:not(:first-child),
.job-pipeline-workload-table-row > *:not(:first-child) {
  padding-left: 0;
}

.job-pipeline-workload-table-head > span:last-child {
  justify-self: end;
  text-align: right;
}

.job-pipeline-workload-table-row {
  padding: 8px 0;
  border-bottom: 1px solid #f2f5fa;
}

.job-pipeline-workload-table-row:last-child {
  border-bottom: 0;
}

.job-pipeline-workload-person {
  gap: 6px;
  align-items: center;
  min-width: 0;
}

.job-pipeline-workload-person div,
.job-pipeline-workload-cell {
  min-width: 0;
}

.job-pipeline-workload-table-head > span,
.job-pipeline-workload-table-row > * {
  min-width: 0;
}

.job-pipeline-workload-person strong,
.job-pipeline-workload-cell strong,
.job-pipeline-workload-upcoming-copy strong {
  display: block;
  color: #162447;
  font-size: 0.58rem;
  line-height: 1.25;
}

.job-pipeline-workload-person span,
.job-pipeline-workload-cell small,
.job-pipeline-workload-upcoming-copy span {
  display: block;
  color: #98a4b6;
  font-size: 0.47rem;
  line-height: 1.3;
}

.job-pipeline-workload-sparkline {
  display: inline-flex;
  align-items: end;
  gap: 2px;
  height: 16px;
}

.job-pipeline-workload-sparkline span {
  width: 3px;
  border-radius: 999px;
  background: #d7deea;
}

.job-pipeline-workload-sparkline.is-green span {
  background: #22b161;
}

.job-pipeline-workload-sparkline.is-orange span {
  background: #ff922c;
}

.job-pipeline-workload-sparkline.is-pink span {
  background: #ff5aa7;
}

.job-pipeline-workload-sparkline.is-violet span {
  background: #6f63ff;
}

.job-pipeline-workload-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
  min-width: 68px;
  padding: 0 6px;
  border-radius: 8px;
  font-size: 0.5rem;
  font-weight: 700;
  max-width: 100%;
  white-space: normal;
  text-align: center;
  line-height: 1.2;
  justify-self: end;
}

.job-pipeline-workload-status.is-green {
  background: #edf9f1;
  color: #22b161;
}

.job-pipeline-workload-status.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-pipeline-workload-status.is-pink {
  background: #fff1f7;
  color: #ff5aa7;
}

.job-pipeline-workload-status.is-violet {
  background: #eef0ff;
  color: #6f63ff;
}

.job-pipeline-workload-bottom {
  gap: 10px;
  align-items: start;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.job-pipeline-workload-heatmap {
  margin-top: 8px;
  display: grid;
  gap: 6px;
}

.job-pipeline-workload-heatmap-head,
.job-pipeline-workload-heatmap-row {
  display: grid;
  grid-template-columns: minmax(70px, 1fr) repeat(5, 14px);
  gap: 6px;
  align-items: center;
  min-width: 0;
}

.job-pipeline-workload-heatmap-head span,
.job-pipeline-workload-heatmap-row strong {
  color: #97a3b6;
  font-size: 0.54rem;
}

.job-pipeline-workload-heatmap-cell {
  width: 14px;
  height: 14px;
  border-radius: 5px;
  background: #eef2f7;
}

.job-pipeline-workload-heatmap-cell.is-green {
  background: #c9f2d6;
}

.job-pipeline-workload-heatmap-cell.is-orange {
  background: #ffd7ab;
}

.job-pipeline-workload-heatmap-cell.is-pink {
  background: #ffb6c9;
}

.job-pipeline-workload-heatmap-cell.is-red {
  background: #ff7f8f;
}

.job-pipeline-workload-upcoming {
  margin-top: 8px;
  display: grid;
  gap: 8px;
}

.job-pipeline-workload-upcoming-item {
  align-items: center;
  gap: 7px;
}

.job-pipeline-workload-upcoming-icon,
.job-pipeline-workload-side-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: #f5f7fb;
  color: #7f8ba0;
  flex: 0 0 22px;
}

.job-pipeline-workload-upcoming-icon.is-green,
.job-pipeline-workload-side-icon.is-green {
  background: #edf9f1;
  color: #22b161;
}

.job-pipeline-workload-upcoming-icon.is-orange,
.job-pipeline-workload-side-icon.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-pipeline-workload-upcoming-icon.is-pink {
  background: #fff1f7;
  color: #ff5aa7;
}

.job-pipeline-workload-upcoming-item small {
  color: #98a4b6;
  font-size: 0.5rem;
}

.job-pipeline-workload-side-panel {
  padding: 12px;
}

.job-pipeline-workload-side-panel--highlight {
  border-color: #d9c7ff;
}

.job-pipeline-workload-side-head {
  align-items: center;
  justify-content: space-between;
}

.job-pipeline-workload-highlight-card {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #ffd9e6;
  border-radius: 12px;
  background: #fff8fa;
}

.job-pipeline-workload-highlight-alert {
  align-items: center;
  gap: 8px;
  color: #ff5aa7;
}

.job-pipeline-workload-highlight-alert strong {
  font-size: 0.66rem;
}

.job-pipeline-workload-highlight-card > span {
  display: block;
  margin-top: 8px;
  color: #162447;
  font-size: 0.58rem;
  font-weight: 700;
}

.job-pipeline-workload-highlight-card p {
  margin: 8px 0 0;
  color: #98a4b6;
  font-size: 0.54rem;
  line-height: 1.35;
}

.job-pipeline-workload-highlight-action {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #edf1f7;
  border-radius: 12px;
  background: #fff;
}

.job-pipeline-workload-highlight-action small,
.job-pipeline-workload-highlight-action span {
  display: block;
  color: #98a4b6;
  font-size: 0.52rem;
}

.job-pipeline-workload-highlight-action strong {
  display: block;
  margin-top: 8px;
  color: #162447;
  font-size: 0.68rem;
  line-height: 1.35;
}

.job-pipeline-workload-highlight-action em {
  display: block;
  margin-top: 6px;
  color: #22b161;
  font-size: 0.96rem;
  font-style: normal;
  font-weight: 800;
}

.job-pipeline-workload-highlight-action button,
.job-pipeline-workload-side-item button,
.job-pipeline-workload-settings {
  margin-top: 10px;
  width: 100%;
  height: 32px;
  border: 1px solid #ffd6e7;
  border-radius: 10px;
  background: #fff;
  color: #ff5aa7;
  font: inherit;
  font-size: 0.62rem;
  cursor: pointer;
}

.job-pipeline-workload-side-item {
  gap: 10px;
  align-items: flex-start;
}

.job-pipeline-workload-side-item strong {
  display: block;
  color: #162447;
  font-size: 0.64rem;
}

.job-pipeline-workload-side-item p {
  margin: 6px 0 0;
  color: #98a4b6;
  font-size: 0.54rem;
  line-height: 1.35;
}

.job-pipeline-workload-side-item button {
  width: auto;
  height: auto;
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: transparent;
}

.job-pipeline-workload-settings {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  border-color: #e6ebf4;
  color: #30415f;
}

.job-pipeline-timeline-view {
  margin-top: 14px;
}

.job-pipeline-timeline-top,
.job-pipeline-timeline-layout,
.job-pipeline-timeline-summary,
.job-pipeline-timeline-filters,
.job-pipeline-timeline-stage-head,
.job-pipeline-timeline-footer,
.job-pipeline-timeline-pagination,
.job-pipeline-timeline-candidate,
.job-pipeline-timeline-side-head,
.job-pipeline-timeline-side-item,
.job-pipeline-timeline-activity,
.job-pipeline-timeline-action {
  display: flex;
}

.job-pipeline-timeline-top,
.job-pipeline-timeline-stage-head,
.job-pipeline-timeline-footer,
.job-pipeline-timeline-side-head,
.job-pipeline-timeline-action {
  justify-content: space-between;
}

.job-pipeline-timeline-top {
  gap: 12px;
  align-items: flex-start;
}

.job-pipeline-timeline-summary {
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.job-pipeline-timeline-summary-card {
  min-width: 88px;
  padding: 8px 10px;
  border: 1px solid #edf1f7;
  border-radius: 10px;
  background: #fbfcff;
}

.job-pipeline-timeline-summary-card.is-pink {
  background: #fff5fa;
  border-color: #ffd6e7;
}

.job-pipeline-timeline-summary-card.is-orange {
  background: #fff8f1;
  border-color: #ffe2c0;
}

.job-pipeline-timeline-summary-card strong {
  display: block;
  color: #162447;
  font-size: 0.9rem;
  line-height: 1.1;
}

.job-pipeline-timeline-summary-card span {
  display: block;
  margin-top: 4px;
  color: #8a96aa;
  font-size: 0.58rem;
  line-height: 1.3;
}

.job-pipeline-timeline-filters {
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.job-pipeline-timeline-filters label {
  display: grid;
  gap: 4px;
}

.job-pipeline-timeline-filters span {
  color: #9aa5b7;
  font-size: 0.5rem;
  text-transform: uppercase;
}

.job-pipeline-timeline-filters select {
  min-width: 98px;
  height: 28px;
  padding: 0 9px;
  border: 1px solid #e6ebf4;
  border-radius: 8px;
  background: #fff;
  color: #4e5d78;
  font: inherit;
  font-size: 0.62rem;
}

.job-pipeline-timeline-layout {
  gap: 12px;
  margin-top: 14px;
  align-items: flex-start;
}

.job-pipeline-timeline-main {
  flex: 1;
  min-width: 0;
  border: 1px solid #edf1f7;
  border-radius: 14px;
  background: #fff;
  padding: 12px;
}

.job-pipeline-timeline-side-card {
  border: 1px solid #edf1f7;
  border-radius: 12px;
  background: #fff;
  padding: 10px;
}

.job-pipeline-timeline-side-head {
  align-items: center;
  gap: 8px;
}

.job-pipeline-timeline-side-head strong,
.job-pipeline-timeline-stage-title {
  color: #162447;
  font-size: 0.72rem;
}

.job-pipeline-timeline-side-head button {
  border: 0;
  background: transparent;
  color: #ff5aa7;
  font: inherit;
  font-size: 0.58rem;
  cursor: pointer;
}

.job-pipeline-timeline-stage-head {
  display: grid;
  grid-template-columns: 156px minmax(0, 1fr) 120px 96px;
  gap: 12px;
  align-items: end;
  padding-bottom: 10px;
  border-bottom: 1px solid #eef2f7;
}

.job-pipeline-timeline-stage-grid {
  position: relative;
  min-height: 36px;
}

.job-pipeline-timeline-stage-chip {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  display: grid;
  justify-items: center;
  gap: 3px;
  text-align: center;
}

.job-pipeline-timeline-stage-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #dce3ef;
  background: #fff;
}

.job-pipeline-timeline-stage-chip strong,
.job-pipeline-timeline-next,
.job-pipeline-timeline-status-head {
  color: #8b97ab;
  font-size: 0.5rem;
  line-height: 1.3;
  text-transform: uppercase;
}

.job-pipeline-timeline-row {
  display: grid;
  grid-template-columns: 156px minmax(0, 1fr) 120px 96px;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f4f9;
}

.job-pipeline-timeline-row:last-of-type {
  border-bottom: 0;
}

.job-pipeline-timeline-candidate {
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.job-pipeline-timeline-candidate div,
.job-pipeline-timeline-next-step,
.job-pipeline-timeline-status {
  min-width: 0;
}

.job-pipeline-timeline-candidate strong {
  display: block;
  color: #162447;
  font-size: 0.68rem;
  line-height: 1.25;
}

.job-pipeline-timeline-candidate span {
  display: block;
  color: #7f8ba0;
  font-size: 0.56rem;
  line-height: 1.3;
}

.job-pipeline-timeline-candidate small {
  display: block;
  margin-top: 2px;
  color: #22b161;
  font-size: 0.54rem;
  font-weight: 600;
}

.job-pipeline-timeline-track {
  position: relative;
  min-height: 44px;
}

.job-pipeline-timeline-rail,
.job-pipeline-timeline-progress {
  position: absolute;
  top: 14px;
  left: 0;
  height: 2px;
  border-radius: 999px;
}

.job-pipeline-timeline-rail {
  width: 100%;
  background: #e6ecf5;
}

.job-pipeline-timeline-progress {
  background: #22c55e;
}

.job-pipeline-timeline-progress.is-orange {
  background: #ff922c;
}

.job-pipeline-timeline-node {
  position: absolute;
  top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d9e0ec;
  transform: translateX(-50%);
}

.job-pipeline-timeline-node.is-complete {
  background: #22c55e;
}

.job-pipeline-timeline-node.is-current.is-orange,
.job-pipeline-timeline-node.is-complete.is-orange {
  background: #ff922c;
}

.job-pipeline-timeline-node.is-current.is-green,
.job-pipeline-timeline-node.is-complete.is-green {
  background: #6f63ff;
}

.job-pipeline-timeline-callout {
  position: absolute;
  top: 22px;
  transform: translateX(-50%);
  text-align: center;
}

.job-pipeline-timeline-callout strong {
  display: block;
  color: #6f63ff;
  font-size: 0.56rem;
  line-height: 1.25;
}

.job-pipeline-timeline-callout.is-orange strong {
  color: #ff922c;
}

.job-pipeline-timeline-callout span {
  display: block;
  margin-top: 2px;
  color: #98a4b6;
  font-size: 0.5rem;
  line-height: 1.25;
}

.job-pipeline-timeline-next-step span,
.job-pipeline-timeline-status span {
  display: block;
  color: #98a4b6;
  font-size: 0.48rem;
  text-transform: uppercase;
}

.job-pipeline-timeline-next-step strong,
.job-pipeline-timeline-status strong {
  display: block;
  margin-top: 4px;
  color: #162447;
  font-size: 0.62rem;
  line-height: 1.35;
}

.job-pipeline-timeline-status strong.is-green {
  color: #22b161;
}

.job-pipeline-timeline-status strong.is-orange {
  color: #ff922c;
}

.job-pipeline-timeline-status small {
  display: block;
  margin-top: 2px;
  color: #98a4b6;
  font-size: 0.5rem;
  line-height: 1.25;
}

.job-pipeline-timeline-footer {
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eef2f7;
}

.job-pipeline-timeline-footer > span {
  color: #98a4b6;
  font-size: 0.54rem;
}

.job-pipeline-timeline-pagination {
  align-items: center;
  gap: 4px;
}

.job-pipeline-timeline-pagination button,
.job-pipeline-timeline-page-size {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border: 1px solid #e6ebf4;
  border-radius: 8px;
  background: #fff;
  color: #77849b;
  font: inherit;
  font-size: 0.58rem;
  cursor: pointer;
}

.job-pipeline-timeline-pagination button.is-active {
  border-color: #ffc3de;
  color: #ff5aa7;
  background: #fff6fb;
}

.job-pipeline-timeline-pagination span {
  color: #a2aec0;
  font-size: 0.58rem;
}

.job-pipeline-timeline-side-item,
.job-pipeline-timeline-activity {
  gap: 8px;
  align-items: flex-start;
  margin-top: 10px;
}

.job-pipeline-timeline-side-icon,
.job-pipeline-timeline-activity-dot {
  flex: 0 0 auto;
}

.job-pipeline-timeline-side-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff6fb;
  color: #ff5aa7;
}

.job-pipeline-timeline-side-icon.is-orange {
  background: #fff6ef;
  color: #ff922c;
}

.job-pipeline-timeline-side-icon.is-violet {
  background: #f1efff;
  color: #6f63ff;
}

.job-pipeline-timeline-side-item strong,
.job-pipeline-timeline-activity strong {
  display: block;
  color: #162447;
  font-size: 0.6rem;
  line-height: 1.35;
}

.job-pipeline-timeline-side-item button {
  margin-top: 2px;
  border: 0;
  background: transparent;
  color: #ff5aa7;
  font: inherit;
  font-size: 0.54rem;
  cursor: pointer;
  padding: 0;
}

.job-pipeline-timeline-activity-dot {
  width: 8px;
  height: 8px;
  margin-top: 3px;
  border-radius: 50%;
  background: #d9e0ec;
}

.job-pipeline-timeline-activity-dot.is-green {
  background: #22c55e;
}

.job-pipeline-timeline-activity-dot.is-orange {
  background: #ff922c;
}

.job-pipeline-timeline-activity-dot.is-violet {
  background: #6f63ff;
}

.job-pipeline-timeline-activity small {
  display: block;
  color: #98a4b6;
  font-size: 0.5rem;
}

.job-pipeline-timeline-action {
  width: 100%;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 0 10px;
  height: 32px;
  border: 1px solid #e8edf6;
  border-radius: 10px;
  background: #fff;
  color: #30415f;
  font: inherit;
  font-size: 0.6rem;
  cursor: pointer;
}

.job-pipeline-column {
  min-width: 152px;
  max-width: 152px;
  padding: 7px;
  border: 1px solid #e9eef6;
  border-radius: 14px;
  background: #fbfcff;
}

.job-pipeline-column.is-focused {
  box-shadow: 0 0 0 2px rgba(255, 90, 167, 0.18);
}

.job-pipeline-column-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: flex-start;
}

.job-pipeline-column-heading,
.job-pipeline-column-meta,
.job-pipeline-candidate-top > div,
.job-pipeline-candidate-bottom > * {
  min-width: 0;
}

.job-pipeline-column-heading {
  display: grid;
  gap: 4px;
}

.job-pipeline-column-head strong {
  display: block;
  color: #162447;
  font-size: 0.84rem;
  line-height: 1.18;
}

.job-pipeline-column-head small,
.job-pipeline-column-meta span {
  color: #7d889b;
  font-size: 0.58rem;
  line-height: 1.3;
}

.job-pipeline-column-head small {
  white-space: nowrap;
}

.job-pipeline-column-meta {
  display: grid;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  text-align: right;
}

.job-pipeline-column-meta em {
  font-style: normal;
  font-weight: 700;
}

.job-pipeline-column-meta em.is-green {
  color: #22b161;
}

.job-pipeline-column-meta em.is-orange {
  color: #ff922c;
}

.job-pipeline-column-meta em.is-pink {
  color: #ff5aa7;
  font-size: 0.72rem;
}

.job-pipeline-column-bar {
  display: block;
  height: 4px;
  margin-top: 12px;
  border-radius: 999px;
  background: #dfe6f2;
}

.job-pipeline-column-bar.is-green {
  background: #22c55e;
}

.job-pipeline-column-bar.is-orange {
  background: #ff922c;
}

.job-pipeline-column-bar.is-pink {
  background: #ff6b8f;
}

.job-pipeline-column-cards {
  display: grid;
  gap: 7px;
  margin-top: 8px;
}

.job-pipeline-candidate-card {
  padding: 7px;
  border: 1px solid #e8edf6;
  border-radius: 11px;
  background: #fff;
}

.job-pipeline-candidate-top {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  align-items: flex-start;
  gap: 8px;
}

.job-pipeline-candidate-avatar {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  white-space: nowrap;
  flex: 0 0 26px;
}

.job-pipeline-candidate-avatar > span {
  display: block;
  font-size: 0.44rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  text-align: center;
  transform: translateY(1px);
}

.job-pipeline-candidate-avatar.job-pipeline-candidate-avatar--small {
  width: 22px;
  height: 22px;
  flex-basis: 22px;
}

.job-pipeline-candidate-avatar.job-pipeline-candidate-avatar--compare {
  width: 38px;
  height: 38px;
  flex-basis: 38px;
}

.job-pipeline-candidate-avatar.job-pipeline-candidate-avatar--tiny {
  width: 18px;
  height: 18px;
  flex-basis: 18px;
}

.job-pipeline-candidate-top strong {
  display: block;
  color: #162447;
  font-size: 0.68rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.job-pipeline-candidate-top span,
.job-pipeline-candidate-top small,
.job-pipeline-candidate-bottom small,
.job-pipeline-chart-copy {
  color: #7d889b;
}

.job-pipeline-candidate-top span {
  display: block;
  margin-top: 1px;
  font-size: 0.6rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.job-pipeline-candidate-top small {
  display: block;
  margin-top: 1px;
  font-size: 0.56rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.job-pipeline-candidate-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
  margin-top: 8px;
  align-items: start;
}

.job-pipeline-candidate-bottom strong {
  color: #22b161;
  font-size: 0.62rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.job-pipeline-candidate-bottom small {
  color: #7c6cff;
  font-weight: 600;
  font-size: 0.58rem;
  line-height: 1.35;
  text-align: right;
  overflow-wrap: anywhere;
}

.job-pipeline-add-candidate {
  width: 100%;
  height: 30px;
  margin-top: 8px;
  border: 1px dashed #d7deeb;
  border-radius: 10px;
  color: #758298;
  background: #fff;
  cursor: pointer;
  font-size: 0.68rem;
}

.job-pipeline-bottom-grid {
  align-items: stretch;
  gap: 18px;
}

.job-pipeline-bottom-grid > .job-pipeline-panel:first-child {
  flex: 1.7;
}

.job-pipeline-bottom-grid > .job-pipeline-panel:last-child {
  flex: 0.9;
}

.job-pipeline-beta {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  background: #eef2ff;
  color: #7c6cff;
  font-size: 0.62rem;
}

.job-pipeline-recommendations {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.job-pipeline-recommendation-card {
  padding: 12px;
  border: 1px solid #edf1f7;
  border-radius: 14px;
  background: #fbfcff;
}

.job-pipeline-recommendation-card strong {
  display: block;
  color: #162447;
  font-size: 0.76rem;
  line-height: 1.35;
}

.job-pipeline-recommendation-card p {
  min-height: 34px;
  margin: 6px 0 0;
  color: #7d889b;
  line-height: 1.45;
  font-size: 0.66rem;
}

.job-pipeline-recommendation-metric {
  margin-top: 12px;
  color: #22b161;
  font-size: 0.98rem;
  font-weight: 800;
  line-height: 1.15;
}

.job-pipeline-recommendation-card button {
  width: 100%;
  height: 30px;
  margin-top: 12px;
  border: 1px solid #ffd6e7;
  border-radius: 10px;
  color: #ff5aa7;
  background: #fff;
  cursor: pointer;
  font-size: 0.66rem;
}

.job-pipeline-panel--recommendations {
  padding: 14px;
}

.job-pipeline-panel--forecast {
  padding: 18px 18px 16px;
}

.job-pipeline-panel--forecast .job-pipeline-panel-title {
  gap: 8px;
}

.job-pipeline-panel--forecast .job-pipeline-panel-title strong {
  font-size: 0.94rem;
}

.job-pipeline-panel--forecast .job-pipeline-beta {
  height: 22px;
  padding: 0 9px;
  font-size: 0.64rem;
}

.job-pipeline-panel--forecast .job-pipeline-chart-copy {
  margin-top: 14px;
  font-size: 0.8rem;
  line-height: 1.45;
  max-width: 320px;
}

.job-pipeline-chart-legend {
  gap: 18px;
  margin-top: 18px;
  color: #7d889b;
  font-size: 0.8rem;
  flex-wrap: wrap;
}

.job-pipeline-chart-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.job-pipeline-chart-legend i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.job-pipeline-chart-legend .is-green {
  background: #22c55e;
}

.job-pipeline-chart-legend .is-orange {
  background: #ff922c;
}

.job-pipeline-chart-legend .is-slate {
  background: #d2d8e4;
}

.job-pipeline-chart-bars {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: end;
  gap: 32px;
  height: 230px;
  margin-top: 28px;
}

.job-pipeline-chart-bar {
  display: grid;
  justify-items: center;
  gap: 12px;
}

.job-pipeline-chart-bar span {
  width: 40px;
  border-radius: 16px 16px 0 0;
  background: #e1e6ef;
}

.job-pipeline-chart-bar span.is-accent {
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(255, 90, 167, 0.55);
}

.job-pipeline-chart-bar small {
  color: #98a4b6;
  font-size: 0.8rem;
}

.job-pipeline-chart-footer {
  gap: 42px;
  margin-top: 28px;
  justify-content: flex-start;
}

.job-pipeline-chart-footer div strong {
  display: block;
  color: #162447;
  font-size: 1.05rem;
}

.job-pipeline-chart-footer div span {
  color: #7d889b;
  font-size: 0.78rem;
}

.job-pipeline-tip {
  color: #7d889b;
  font-size: 0.82rem;
}

.job-pipeline-tip button {
  color: #7d889b;
  cursor: pointer;
}

@media (max-width: 1260px) {
  .job-pipeline-content-grid,
  .job-pipeline-bottom-grid {
    grid-template-columns: 1fr;
  }

  .job-pipeline-panel--copilot {
    width: 100%;
  }

  .job-pipeline-list-head,
  .job-pipeline-list-row {
    min-width: 900px;
  }

  .job-pipeline-workload-summary,
  .job-pipeline-workload-grid,
  .job-pipeline-workload-bottom {
    flex-wrap: wrap;
  }

  .job-pipeline-workload-summary > *,
  .job-pipeline-workload-grid > *,
  .job-pipeline-workload-bottom > * {
    flex: 1 1 100%;
  }

  .job-pipeline-workload-table-head.recruiter,
  .job-pipeline-workload-table-row.recruiter,
  .job-pipeline-workload-table-head.manager,
  .job-pipeline-workload-table-row.manager {
    min-width: 720px;
  }

  .job-pipeline-workload-panel {
    overflow-x: auto;
  }

  .job-pipeline-compare-candidates,
  .job-pipeline-compare-bottom {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .job-pipeline-compare-hero-side {
    grid-template-columns: 1fr;
  }

  .job-pipeline-compare-table {
    min-width: 860px;
  }

  .job-pipeline-manager-top,
  .job-pipeline-manager-grid {
    grid-template-columns: 1fr;
  }

  .job-pipeline-feedback-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .job-pipeline-feedback-row,
  .job-pipeline-complete-feedback-options,
  .job-pipeline-complete-feedback-rating-row,
  .job-pipeline-feedback-modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .job-pipeline-feedback-actions,
  .job-pipeline-feedback-person {
    max-width: none;
    flex: 1 1 auto;
  }

  .job-pipeline-feedback-actions {
    margin-left: 0;
    align-items: flex-start;
  }
}

@media (max-width: 1180px) {
  .job-pipeline-summary-grid,
  .job-pipeline-recommendations {
    grid-template-columns: 1fr;
  }

  .job-pipeline-summary-layout {
    flex-direction: column;
  }

  .job-pipeline-summary-copy {
    max-width: none;
  }

  .job-pipeline-summary-stats {
    justify-content: flex-start;
  }

  .job-pipeline-board-head,
  .job-pipeline-hero,
  .job-pipeline-topbar,
  .job-pipeline-tip {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .job-pipeline-timeline-stage-head,
  .job-pipeline-timeline-row {
    grid-template-columns: 1fr;
  }

  .job-pipeline-timeline-stage-grid {
    min-height: 44px;
  }

  .job-pipeline-timeline-footer,
  .job-pipeline-timeline-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-pipeline-workload-summary,
  .job-pipeline-compare-candidates,
  .job-pipeline-compare-bottom {
    grid-template-columns: 1fr;
  }

  .job-pipeline-compare-hero,
  .job-pipeline-compare-hero-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-pipeline-manager-card--metrics,
  .job-pipeline-manager-ai-columns {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .job-pipeline-manager-upcoming-card,
  .job-pipeline-manager-action-card,
  .job-pipeline-manager-candidate-row,
  .job-pipeline-manager-feedback-footer {
    flex-wrap: wrap;
  }

  .job-pipeline-feedback-modal,
  .job-pipeline-complete-feedback-modal {
    width: min(100%, 1000px);
  }

  .job-pipeline-feedback-stats {
    grid-template-columns: 1fr;
  }

  .job-pipeline-feedback-footer-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
