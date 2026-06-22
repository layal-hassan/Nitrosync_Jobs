<script setup>
import { computed, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import { getJobById } from '../../data/jobs'

const props = defineProps({
  jobId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['back', 'open-compare'])

const job = computed(() => getJobById(props.jobId))
const isStarred = ref(Boolean(job.value?.isStarred))
const addCompareModalOpen = ref(false)
const addCompareSuccessModalOpen = ref(false)
const whatIfModalOpen = ref(false)
const whatIfApplyModalOpen = ref(false)
const riskMonitorModalOpen = ref(false)
const addCompareSearch = ref('')
const maxCompareCandidates = 6
const appliedCompareCandidates = ref([])
const selectedWhatIfScenarioLabel = ref('')

const compareCandidateDirectory = [
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    role: 'Senior Frontend Engineer',
    avatar: 'SJ',
    match: 92,
    experience: '7 years',
    location: 'Stockholm',
    skills: ['Vue', 'TypeScript', 'Design Systems', 'Accessibility'],
  },
  {
    id: 'daniel-brown',
    name: 'Daniel Brown',
    role: 'UI Engineer',
    avatar: 'DB',
    match: 89,
    experience: '5 years',
    location: 'Berlin',
    skills: ['Figma', 'CSS', 'Motion', 'Component Libraries'],
  },
  {
    id: 'emily-smith',
    name: 'Emily Smith',
    role: 'Product Designer',
    avatar: 'ES',
    match: 87,
    experience: '6 years',
    location: 'Amsterdam',
    skills: ['Product Strategy', 'Research', 'UI', 'Workshops'],
  },
  {
    id: 'emma-wilson',
    name: 'Emma Wilson',
    role: 'Frontend Developer',
    avatar: 'EW',
    match: 85,
    experience: '4 years',
    location: 'Copenhagen',
    skills: ['Branding', 'HTML', 'CSS', 'Figma'],
  },
  {
    id: 'michael-brown',
    name: 'Michael Brown',
    role: 'Frontend Developer',
    avatar: 'MB',
    match: 82,
    experience: '6 years',
    location: 'London',
    skills: ['React', 'UI/UX', 'Illustration', 'Design QA'],
  },
  {
    id: 'olivia-chen',
    name: 'Olivia Chen',
    role: 'UI Designer',
    avatar: 'OC',
    match: 81,
    experience: '3 years',
    location: 'Singapore',
    skills: ['Illustrator', 'Branding', 'Figma', 'Prototyping'],
  },
  {
    id: 'david-svensson',
    name: 'David Svensson',
    role: 'Art Director',
    avatar: 'DS',
    match: 79,
    experience: '7 years',
    location: 'Stockholm',
    skills: ['Photoshop', 'Branding', 'Print Design', 'Leadership'],
  },
]

const selectedCompareCandidateIds = ref(['sarah-johnson', 'daniel-brown', 'emily-smith'])

const whatIfBaselineCards = [
  { title: 'Expected Hire Date', value: '15 Mar 2025', note: 'In 21 days', icon: 'calendar', tone: 'pink' },
  { title: 'Applications Expected', value: '98', note: 'From 2,500 talent pool', icon: 'users', tone: 'pink' },
  { title: 'Qualified Candidates', value: '12', note: '12% of applications', icon: 'userPlus', tone: 'pink' },
  { title: 'Hiring Confidence', value: '87%', note: 'Based on current setup', icon: 'trend-up', tone: 'pink' },
]

const whatIfScenarioMeta = {
  'Increase salary range by 10%': {
    index: 1,
    icon: 'wallet',
    tone: 'green',
    description: 'Make the role more competitive in the market.',
    current: '45k-55k SEK',
    next: '50k-60k SEK',
    explanation: 'Based on previous NitroSync jobs and local market benchmarks, this salary range moves the role into the top 30% of similar positions, significantly increasing candidate quality.',
    applyChanges: [
      {
        icon: 'wallet',
        title: 'Salary Range',
        description: 'Update salary range for this role',
        before: '45,000 - 55,000 SEK',
        after: '50,000 - 60,000 SEK',
      },
      {
        icon: 'document',
        title: 'Career Page',
        description: 'Updated salary info shown to future applicants',
        status: 'Will be updated',
        statusTone: 'green',
      },
      {
        icon: 'chart-bars',
        title: 'Hiring Forecast',
        description: 'Applicant and hiring forecasts will be recalculated',
        status: 'Will be recalculated',
        statusTone: 'green',
      },
    ],
    applyImpact: [
      { icon: 'users', label: 'Applications', before: '98', after: '122', delta: '+24 (+24%)', tone: 'green' },
      { icon: 'userPlus', label: 'Qualified Candidates', before: '12', after: '18', delta: '+6 (+50%)', tone: 'green' },
      { icon: 'calendar', label: 'Expected Hire Date', before: '15 Mar', after: '10 Mar', delta: '-5 days', tone: 'green' },
      { icon: 'shield', label: 'Hiring Confidence', before: '87%', after: '94%', delta: '+7%', tone: 'green' },
    ],
    insight: 'Based on similar Graphic Designer roles, this salary range places the role above the local market average and is expected to attract more qualified applicants.',
    warning: 'This change affects future applicants only. Existing candidates and current pipeline will not be modified.',
  },
  'Target senior designers': {
    index: 3,
    icon: 'users',
    tone: 'orange',
    description: 'Focus on candidates with 5+ years of experience.',
    current: '3+ years',
    next: '5+ years',
    explanation: 'Senior candidates are harder to source but produce stronger hiring outcomes and reduce long-term training costs.',
    applyChanges: [
      {
        icon: 'users',
        title: 'Experience Level',
        description: 'Refine target profile for new applicants',
        before: '3+ years',
        after: '5+ years',
      },
      {
        icon: 'document',
        title: 'Screening Criteria',
        description: 'Candidate scorecards will use seniority weighting',
        status: 'Will be updated',
        statusTone: 'green',
      },
      {
        icon: 'chart-bars',
        title: 'Hiring Forecast',
        description: 'Quality and timing projections will be recalculated',
        status: 'Will be recalculated',
        statusTone: 'green',
      },
    ],
    applyImpact: [
      { icon: 'users', label: 'Applications', before: '98', after: '86', delta: '-12 (-12%)', tone: 'orange' },
      { icon: 'userPlus', label: 'Qualified Candidates', before: '12', after: '15', delta: '+3 (+25%)', tone: 'green' },
      { icon: 'calendar', label: 'Expected Hire Date', before: '15 Mar', after: '22 Mar', delta: '+7 days', tone: 'orange' },
      { icon: 'shield', label: 'Hiring Confidence', before: '87%', after: '92%', delta: '+5%', tone: 'green' },
    ],
    insight: 'Targeting more experienced candidates improves long-term quality, but it usually narrows top-of-funnel volume and extends search time slightly.',
    warning: 'This change will prioritize senior candidates in future sourcing and screening. Existing applicants keep their current evaluation.',
  },
  'Add freelance option': {
    index: 4,
    icon: 'briefcase',
    tone: 'pink',
    description: 'Allow contract/freelance engagements.',
    current: 'Permanent',
    next: 'Perm + Freelance',
    explanation: 'Freelance candidates respond faster but are less likely to stay long-term. Useful for immediate gaps.',
    applyChanges: [
      {
        icon: 'briefcase',
        title: 'Employment Type',
        description: 'Allow contract or freelance engagement',
        before: 'Permanent',
        after: 'Permanent + Freelance',
      },
      {
        icon: 'document',
        title: 'Career Page',
        description: 'Role description will include contract flexibility',
        status: 'Will be updated',
        statusTone: 'green',
      },
      {
        icon: 'chart-bars',
        title: 'Hiring Forecast',
        description: 'Response speed and acceptance projections will refresh',
        status: 'Will be recalculated',
        statusTone: 'green',
      },
    ],
    applyImpact: [
      { icon: 'users', label: 'Applications', before: '98', after: '131', delta: '+33 (+34%)', tone: 'green' },
      { icon: 'userPlus', label: 'Qualified Candidates', before: '12', after: '11', delta: '-1 (-8%)', tone: 'orange' },
      { icon: 'calendar', label: 'Expected Hire Date', before: '15 Mar', after: '05 Mar', delta: '-10 days', tone: 'green' },
      { icon: 'shield', label: 'Hiring Confidence', before: '87%', after: '84%', delta: '-3%', tone: 'orange' },
    ],
    insight: 'Freelance flexibility increases speed and response rate, especially for urgent hiring, but long-term retention confidence usually softens a bit.',
    warning: 'This update changes the role terms for future applicants only. Existing candidates stay on their current employment path.',
  },
  'Expand to global talent pool': {
    index: 2,
    icon: 'mapPin',
    tone: 'blue',
    description: 'Open the role to remote talent across EU region.',
    current: 'Stockholm only',
    next: 'Sweden + EU Remote',
    explanation: 'The largest talent shortage is location-based rather than salary-based. Opening to EU increases pool by 8x.',
    applyChanges: [
      {
        icon: 'mapPin',
        title: 'Location Scope',
        description: 'Expand sourcing beyond the local market',
        before: 'Stockholm only',
        after: 'Sweden + EU Remote',
      },
      {
        icon: 'document',
        title: 'Career Page',
        description: 'Job page will show remote hiring availability',
        status: 'Will be updated',
        statusTone: 'green',
      },
      {
        icon: 'chart-bars',
        title: 'Hiring Forecast',
        description: 'Application volume and speed will be recalculated',
        status: 'Will be recalculated',
        statusTone: 'green',
      },
    ],
    applyImpact: [
      { icon: 'users', label: 'Applications', before: '98', after: '146', delta: '+48 (+49%)', tone: 'green' },
      { icon: 'userPlus', label: 'Qualified Candidates', before: '12', after: '20', delta: '+8 (+67%)', tone: 'green' },
      { icon: 'calendar', label: 'Expected Hire Date', before: '15 Mar', after: '07 Mar', delta: '-8 days', tone: 'green' },
      { icon: 'shield', label: 'Hiring Confidence', before: '87%', after: '91%', delta: '+4%', tone: 'green' },
    ],
    insight: 'Remote expansion broadens the addressable market immediately and tends to improve both pipeline velocity and qualified candidate density.',
    warning: 'This change updates future sourcing and outreach settings. Current applicants already in process are not modified.',
  },
}

const whatIfProjectedOutcome = [
  { label: 'Expected Applications', value: '142', delta: '↑+44%', tone: 'green' },
  { label: 'Qualified Candidates', value: '24', delta: '↑+12', tone: 'green' },
  { label: 'Expected Hire Date', value: '07 Mar 2025', delta: '↓-8 days', tone: 'green' },
  { label: 'Hiring Confidence', value: '94%', delta: '↑+7%', tone: 'green' },
]

const whatIfSimulatorFields = [
  { label: 'Salary Range', value: '+10%', icon: 'wallet' },
  { label: 'Location', value: 'EU Remote', icon: 'mapPin' },
  { label: 'Experience Level', value: '3+ Years', icon: 'users' },
  { label: 'Employment Type', value: 'Permanent', icon: 'briefcase' },
]

const riskMonitorSummaryCards = [
  { title: 'High risk', value: '1', note: 'Needs immediate action', icon: 'clock', tone: 'pink' },
  { title: 'Medium risk', value: '2', note: 'Needs attention', icon: 'clock', tone: 'orange' },
  { title: 'Low risk', value: '1', note: 'On track', icon: 'shield', tone: 'green' },
  { title: 'At risk of losing', value: '3', note: 'High chance of drop-off', icon: 'userPlus', tone: 'violet' },
]

const riskMonitorCandidates = [
  {
    level: 'High',
    levelTone: 'pink',
    name: 'Sarah Johnson',
    role: 'Senior Graphic Designer',
    match: '92% Match',
    avatar: 'SJ',
    factors: ['Waiting 6 days since final interview', 'Competitor interview detected', 'Compensation not approved'],
    factorTone: 'pink',
    prediction: '72%',
    predictionTone: 'pink',
    predictionNote: 'chance candidate may withdraw within 7 days.',
    actionTitle: 'Approve compensation',
    actionNote: 'and send offer to reduce risk.',
    actionLabel: 'Take Action',
    actionTone: 'pink',
  },
  {
    level: 'Medium',
    levelTone: 'orange',
    name: 'Daniel Brown',
    role: 'UI/UX Designer',
    match: '89% Match',
    avatar: 'DB',
    factors: ['No recruiter communication for 5 days', 'Feedback pending from hiring manager'],
    factorTone: 'orange',
    prediction: '48%',
    predictionTone: 'orange',
    predictionNote: 'chance candidate may withdraw within 7 days.',
    actionTitle: 'Request feedback',
    actionNote: 'from hiring manager to move forward.',
    actionLabel: 'Send Reminder',
    actionTone: 'orange',
  },
  {
    level: 'Medium',
    levelTone: 'orange',
    name: 'Emily Smith',
    role: 'Graphic Designer',
    match: '87% Match',
    avatar: 'ES',
    factors: ['Interview scheduling delay', 'Candidate waiting 4 days'],
    factorTone: 'orange',
    prediction: '36%',
    predictionTone: 'orange',
    predictionNote: 'chance candidate may withdraw within 7 days.',
    actionTitle: 'Schedule final interview',
    actionNote: 'to keep candidate engaged.',
    actionLabel: 'Schedule',
    actionTone: 'orange',
  },
  {
    level: 'Low',
    levelTone: 'green',
    name: 'Tom Williams',
    role: 'Design Director',
    match: '90% Match',
    avatar: 'TW',
    factors: ['Regular communication maintained', 'Interview process on track'],
    factorTone: 'green',
    prediction: '12%',
    predictionTone: 'green',
    predictionNote: 'chance candidate may withdraw within 7 days.',
    actionTitle: 'No action needed',
    actionNote: 'Continue the great progress!',
    actionLabel: 'On Track',
    actionTone: 'green',
  },
]

const detailPresets = {
  'ac-1187': {
    meta: ['Engineering', 'Product', 'Full-time', 'Remote'],
    status: 'Active',
    confidence: { value: 87, note: 'High chance to hire on time', delta: '9% vs last 7 days' },
    readiness: { value: 72, note: 'Not ready to make decision', delta: '11% if overdue items completed' },
    expectedHire: { date: '15 Mar 2025', note: 'In 27 days', target: 'Target: 15 Mar 2025', badge: 'On track', badgeTone: 'green' },
    risk: { title: 'Feedback delay', meta: 'Avg delay: 4.2 days', impact: 'Impact: +7 days to hire', badge: '2 reviewers pending', badgeTone: 'orange' },
    focus: { title: 'Review 3 finalists', meta: '3 pending decisions', action: 'View my tasks', badge: 'Priority today', badgeTone: 'pink' },
    blockers: [
      { icon: 'close', title: 'Missing hiring manager feedback', meta: '2 candidates' },
      { icon: 'calendar', title: 'References pending', meta: '1 candidate' },
      { icon: 'alert', title: 'Compensation not approved', meta: '1 candidate' },
    ],
    candidates: [
      { rank: 1, name: 'Sarah Johnson', role: 'Senior Frontend Engineer', match: '92% Match', note: 'Recommended', avatar: 'SJ', tone: 'pink' },
      { rank: 2, name: 'Daniel Brown', role: 'UI Engineer', match: '89% Match', note: 'Final interview', avatar: 'DB', tone: 'amber' },
      { rank: 3, name: 'Emily Smith', role: 'Product Designer', match: '87% Match', note: 'Final interview', avatar: 'ES', tone: 'violet' },
    ],
    scenarios: [
      { label: 'Increase salary range by 10%', hire: '-5 days', quality: '+12%', confidence: 'High', tone: 'green' },
      { label: 'Target senior designers', hire: '+7 days', quality: '+18%', confidence: 'Medium', tone: 'orange' },
      { label: 'Add freelance option', hire: '-10 days', quality: '-8%', confidence: 'Medium', tone: 'pink' },
      { label: 'Expand to global talent pool', hire: '-8 days', quality: '+5%', confidence: 'High', tone: 'green' },
    ],
    actions: [
      { index: 1, title: 'Request feedback from John Smith', meta: '2 candidates waiting', button: 'Review', impact: '+6%', impactLabel: 'Confidence' },
      { index: 2, title: 'Collect missing feedback', meta: 'From 2 interviewers', button: 'Follow up', impact: '+11%', impactLabel: 'Readiness' },
      { index: 3, title: 'Schedule final interviews', meta: '2 strong candidates ready', button: 'Schedule', impact: '-3 days', impactLabel: 'Expected hire' },
      { index: 4, title: 'Approve compensation', meta: 'For selected candidate', button: 'Approve', impact: '+6%', impactLabel: 'Confidence' },
    ],
    team: [
      { name: 'John Smith', role: 'Hiring Manager', alignment: 'Strong hire', tone: 'green', avatar: 'JS' },
      { name: 'Lisa Wong', role: 'Recruiter', alignment: 'Strong hire', tone: 'green', avatar: 'LW' },
      { name: 'Alex Chen', role: 'Design Lead', alignment: 'Hire', tone: 'orange', avatar: 'AC' },
      { name: 'Priya Patel', role: 'Marketing Lead', alignment: 'Strong hire', tone: 'green', avatar: 'PP' },
      { name: 'Tom Williams', role: 'Design Director', alignment: 'No hire', tone: 'pink', avatar: 'TW' },
    ],
    alignment: { score: 80, title: 'Strong alignment', detail: '1 disagreement' },
    sideSignals: [
      { icon: 'alert', label: 'Candidate risk monitor', value: 'High', tone: 'pink' },
      { icon: 'bolt', label: 'Bottlenecks', value: '3', tone: 'violet' },
      { icon: 'mail', label: 'Team responsiveness', value: '4', tone: 'pink' },
      { icon: 'user', label: 'Candidate pool health', value: '54', tone: 'pink' },
      { icon: 'chart-bars', label: 'Business impact', value: 'High', tone: 'orange' },
    ],
    bottomCards: [
      {
        type: 'pool',
        title: 'Candidate pool health',
        value: '54',
        subtitle: 'Total candidates',
        items: [
          { label: '12 Applied', tone: 'blue' },
          { label: '18 Screening', tone: 'pink' },
          { label: '8 Interview', tone: 'orange' },
          { label: '6 Assessment', tone: 'violet' },
          { label: '4 Offer', tone: 'green' },
          { label: '6 Hired', tone: 'slate' },
        ],
      },
      {
        type: 'diversity',
        title: 'Diversity mix',
        value: '46%',
        subtitle: 'Women',
        segments: [
          { label: '46% Women', tone: 'pink', value: 46 },
          { label: '24% Underrepresented', tone: 'blue', value: 24 },
          { label: '30% Others', tone: 'slate', value: 30 },
        ],
      },
      {
        type: 'trend',
        title: 'Funnel trend',
        value: '18%',
        subtitle: 'vs previous 30 days',
        delta: '+18%',
        deltaNote: 'vs previous 30 days',
        points: [16, 12, 18, 26, 22, 30, 24, 20, 31, 27, 34, 32],
        labels: ['23 Apr', '30 Apr', '7 May', '14 May', '21 May'],
      },
      {
        type: 'risk',
        title: 'Candidate risk monitor',
        value: '2',
        subtitle: 'Competing offers',
        items: [
          { label: 'Offer acceptance risk', value: 'Medium', tone: 'orange', icon: 'lock' },
          { label: 'Notice period risk', value: 'High', tone: 'pink', icon: 'close' },
          { label: 'Salary expectation risk', value: 'Low', tone: 'green', icon: 'checkCircle' },
          { label: 'Competing offers', value: '2 candidates', tone: 'violet', icon: 'spark' },
        ],
        link: 'View full risk report',
      },
    ],
  },
  'gd-2041': {
    meta: ['Design', 'Marketing', 'Full-time', 'Remote'],
    status: 'Active',
    confidence: { value: 84, note: 'Strong shortlist in final stage', delta: '6% vs last 7 days' },
    readiness: { value: 68, note: 'Waiting on final hiring manager input', delta: '9% if overdue items completed' },
    expectedHire: { date: '22 Mar 2025', note: 'In 11 days', target: 'Target: 22 Mar 2025', badge: 'On track', badgeTone: 'green' },
    risk: { title: 'References pending', meta: '2 references outstanding', impact: 'Impact: +4 days to hire', badge: '1 action overdue', badgeTone: 'orange' },
    focus: { title: 'Review final shortlist', meta: '2 candidates pending', action: 'View my tasks', badge: 'Priority today', badgeTone: 'pink' },
    blockers: [
      { icon: 'mail', title: 'Missing hiring manager feedback', meta: '2 candidates' },
      { icon: 'calendar', title: 'Portfolio review pending', meta: '1 candidate' },
      { icon: 'alert', title: 'Compensation review not complete', meta: '1 candidate' },
    ],
    candidates: [
      { rank: 1, name: 'Sarah Johnson', role: 'Senior Graphic Designer', match: '92% Match', note: 'Recommended', avatar: 'SJ', tone: 'pink' },
      { rank: 2, name: 'Daniel Brown', role: 'Visual Designer', match: '89% Match', note: 'Final interview', avatar: 'DB', tone: 'amber' },
      { rank: 3, name: 'Emily Smith', role: 'Graphic Designer', match: '87% Match', note: 'Final interview', avatar: 'ES', tone: 'violet' },
    ],
    scenarios: [
      { label: 'Increase freelance budget', hire: '-4 days', quality: '+9%', confidence: 'High', tone: 'green' },
      { label: 'Target agency candidates', hire: '+3 days', quality: '+11%', confidence: 'Medium', tone: 'orange' },
      { label: 'Shorten portfolio task', hire: '-6 days', quality: '-4%', confidence: 'Medium', tone: 'pink' },
      { label: 'Expand to remote-first markets', hire: '-5 days', quality: '+7%', confidence: 'High', tone: 'green' },
    ],
    actions: [
      { index: 1, title: 'Review finalist feedback', meta: '1 interviewer overdue', button: 'Review', impact: '+5%', impactLabel: 'Confidence' },
      { index: 2, title: 'Collect reference checks', meta: '2 references pending', button: 'Follow up', impact: '+8%', impactLabel: 'Readiness' },
      { index: 3, title: 'Schedule offer review', meta: 'Candidate selected', button: 'Schedule', impact: '-2 days', impactLabel: 'Expected hire' },
      { index: 4, title: 'Approve budget band', meta: 'Final finance signoff', button: 'Approve', impact: '+4%', impactLabel: 'Confidence' },
    ],
    team: [
      { name: 'John Smith', role: 'Hiring Manager', alignment: 'Strong hire', tone: 'green', avatar: 'JS' },
      { name: 'Lisa Wong', role: 'Recruiter', alignment: 'Strong hire', tone: 'green', avatar: 'LW' },
      { name: 'Alex Chen', role: 'Design Lead', alignment: 'Hire', tone: 'orange', avatar: 'AC' },
      { name: 'Priya Patel', role: 'Marketing Lead', alignment: 'Strong hire', tone: 'green', avatar: 'PP' },
      { name: 'Tom Williams', role: 'Creative Director', alignment: 'No hire', tone: 'pink', avatar: 'TW' },
    ],
    alignment: { score: 78, title: 'Strong alignment', detail: '1 disagreement' },
    sideSignals: [
      { icon: 'alert', label: 'Candidate risk monitor', value: 'High', tone: 'pink' },
      { icon: 'bolt', label: 'Bottlenecks', value: '2', tone: 'violet' },
      { icon: 'mail', label: 'Team responsiveness', value: '3', tone: 'pink' },
      { icon: 'user', label: 'Candidate pool health', value: '41', tone: 'pink' },
      { icon: 'chart-bars', label: 'Business impact', value: 'Med', tone: 'orange' },
    ],
    bottomCards: [
      {
        type: 'pool',
        title: 'Candidate pool health',
        value: '41',
        subtitle: 'Total candidates',
        items: [
          { label: '11 Applied', tone: 'blue' },
          { label: '14 Screening', tone: 'pink' },
          { label: '7 Interview', tone: 'orange' },
          { label: '4 Assessment', tone: 'violet' },
          { label: '2 Offer', tone: 'green' },
          { label: '3 Hired', tone: 'slate' },
        ],
      },
      {
        type: 'diversity',
        title: 'Diversity mix',
        value: '52%',
        subtitle: 'Women',
        segments: [
          { label: '52% Women', tone: 'pink', value: 52 },
          { label: '19% Underrepresented', tone: 'blue', value: 19 },
          { label: '29% Others', tone: 'slate', value: 29 },
        ],
      },
      {
        type: 'trend',
        title: 'Funnel trend',
        value: '11%',
        subtitle: 'vs previous 30 days',
        delta: '+11%',
        deltaNote: 'vs previous 30 days',
        points: [12, 15, 14, 19, 18, 22, 20, 24, 23, 26, 25, 28],
        labels: ['23 Apr', '30 Apr', '7 May', '14 May', '21 May'],
      },
      {
        type: 'risk',
        title: 'Candidate risk monitor',
        value: '1',
        subtitle: 'Competing offer',
        items: [
          { label: 'Offer acceptance risk', value: 'Medium', tone: 'orange', icon: 'lock' },
          { label: 'Notice period risk', value: 'Low', tone: 'green', icon: 'checkCircle' },
          { label: 'Salary expectation risk', value: 'Low', tone: 'green', icon: 'checkCircle' },
          { label: 'Competing offers', value: '1 candidate', tone: 'violet', icon: 'spark' },
        ],
        link: 'View full risk report',
      },
    ],
  },
}

const details = computed(() => {
  const preset = detailPresets[props.jobId]

  if (preset) {
    return preset
  }

  return {
    ...detailPresets['ac-1187'],
    meta: [job.value.department, job.value.stage, 'Full-time', job.value.location],
    status: job.value.status,
  }
})

const filteredCompareCandidates = computed(() => {
  const query = addCompareSearch.value.trim().toLowerCase()

  if (!query) {
    return compareCandidateDirectory
  }

  return compareCandidateDirectory.filter((candidate) => (
    candidate.name.toLowerCase().includes(query)
    || candidate.role.toLowerCase().includes(query)
    || candidate.location.toLowerCase().includes(query)
    || candidate.skills.some((skill) => skill.toLowerCase().includes(query))
  ))
})

const selectedCompareCandidates = computed(() => (
  selectedCompareCandidateIds.value
    .map((id) => compareCandidateDirectory.find((candidate) => candidate.id === id))
    .filter(Boolean)
))

const whatIfScenarioCards = computed(() => (
  details.value.scenarios.map((scenario) => ({
    ...scenario,
    ...(whatIfScenarioMeta[scenario.label] ?? {
      index: 0,
      icon: 'spark',
      tone: 'green',
      description: '',
      current: '-',
      next: '-',
      explanation: '',
    }),
  }))
))

const activeWhatIfScenario = computed(() => (
  whatIfScenarioCards.value.find((scenario) => scenario.label === selectedWhatIfScenarioLabel.value) ?? null
))

function goBack() {
  emit('back')
}

function openCompareCandidates() {
  emit('open-compare', props.jobId)
}

function openAddCompareModal() {
  addCompareModalOpen.value = true
}

function closeAddCompareModal() {
  addCompareModalOpen.value = false
}

function closeAddCompareSuccessModal() {
  addCompareSuccessModalOpen.value = false
}

function openWhatIfModal() {
  whatIfModalOpen.value = true
}

function closeWhatIfModal() {
  whatIfModalOpen.value = false
  closeWhatIfScenarioModal()
}

function openRiskMonitorModal() {
  riskMonitorModalOpen.value = true
}

function closeRiskMonitorModal() {
  riskMonitorModalOpen.value = false
}

function openWhatIfScenarioModal(scenario) {
  selectedWhatIfScenarioLabel.value = scenario.label
  whatIfApplyModalOpen.value = true
}

function closeWhatIfScenarioModal() {
  whatIfApplyModalOpen.value = false
  selectedWhatIfScenarioLabel.value = ''
}

function applyWhatIfScenario() {
  closeWhatIfScenarioModal()
  whatIfModalOpen.value = false
}

function toggleCompareCandidate(id) {
  if (selectedCompareCandidateIds.value.includes(id)) {
    selectedCompareCandidateIds.value = selectedCompareCandidateIds.value.filter((candidateId) => candidateId !== id)
    return
  }

  if (selectedCompareCandidateIds.value.length >= maxCompareCandidates) {
    return
  }

  selectedCompareCandidateIds.value = [...selectedCompareCandidateIds.value, id]
}

function removeCompareCandidate(id) {
  selectedCompareCandidateIds.value = selectedCompareCandidateIds.value.filter((candidateId) => candidateId !== id)
}

function clearCompareCandidates() {
  selectedCompareCandidateIds.value = []
}

function applyCompareCandidates() {
  if (!selectedCompareCandidates.value.length) {
    return
  }

  appliedCompareCandidates.value = [...selectedCompareCandidates.value]
  closeAddCompareModal()
  addCompareSuccessModalOpen.value = true
}

function continueReviewing() {
  closeAddCompareSuccessModal()
}

function openCompareFromSuccess() {
  closeAddCompareSuccessModal()
  openCompareCandidates()
}

function toggleStar() {
  isStarred.value = !isStarred.value
}

async function copyJobId() {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return
  }

  await navigator.clipboard.writeText(job.value.id.toUpperCase())
}

async function shareJob() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.clipboard) {
    return
  }

  await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#job/${job.value.id}`)
}

function toneClass(tone) {
  return `is-${tone}`
}

function ringOffset(value, radius) {
  const circumference = 2 * Math.PI * radius
  return circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference
}

function sparklinePoints(values) {
  if (!values?.length) {
    return ''
  }

  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = Math.max(1, max - min)

  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 100
      const y = 40 - ((value - min) / range) * 28
      return `${x},${y}`
    })
    .join(' ')
}

function diversityStyle(segments) {
  const safeSegments = segments ?? []
  let start = 0
  const colors = {
    pink: '#f55ba8',
    blue: '#6b8bff',
    slate: '#1f2937',
  }

  const parts = safeSegments.map((segment) => {
    const end = start + segment.value
    const color = colors[segment.tone] ?? '#cbd5e1'
    const part = `${color} ${start}% ${end}%`
    start = end
    return part
  })

  return {
    background: `conic-gradient(${parts.join(', ')})`,
  }
}
</script>

<template>
  <main class="job-detail-page">
    <div class="job-detail-shell">
      <div class="job-detail-topbar">
        <button class="job-detail-back" type="button" @click="goBack">
          <AppIcon name="chevronLeft" :size="18" />
          <span>Back to Jobs</span>
        </button>

        <div class="job-detail-topbar-actions">
          <button class="job-detail-ghost-button" type="button">
            <AppIcon name="edit" :size="16" />
            <span>Edit job</span>
          </button>
          <button class="job-detail-ghost-button" type="button" @click="shareJob">
            <AppIcon name="share" :size="16" />
            <span>Share</span>
          </button>
          <button class="job-detail-icon-button" type="button" aria-label="More">
            <AppIcon name="more" :size="18" />
          </button>
        </div>
      </div>

      <div class="job-detail-hero">
        <div class="job-detail-hero-main">
          <div class="job-detail-title-row">
            <h1>{{ job.title }}</h1>
            <button class="job-detail-star" type="button" :class="{ 'is-active': isStarred }" @click="toggleStar">
              <AppIcon name="star" :size="18" />
            </button>
          </div>

          <div class="job-detail-meta-row">
            <template v-for="(item, index) in details.meta" :key="item">
              <span class="job-detail-meta-item">{{ item }}</span>
              <span v-if="index < details.meta.length - 1" class="job-detail-meta-dot" />
            </template>
            <span class="job-detail-status">{{ details.status }}</span>
          </div>
        </div>

        <div class="job-detail-hero-side">
          <div class="job-detail-team-summary">
            <div class="job-detail-avatar-stack">
              <span v-for="member in details.team.slice(0, 3)" :key="member.name" class="job-detail-stack-avatar">
                {{ member.avatar }}
              </span>
              <span class="job-detail-stack-count">+{{ Math.max(details.team.length - 3, 0) }}</span>
            </div>

            <div class="job-detail-team-meta">
              <span>Hiring team</span>
              <strong>6</strong>
            </div>
          </div>

          <button class="job-detail-id-button" type="button" @click="copyJobId">
            <span>ID: {{ job.id.toUpperCase() }}</span>
            <AppIcon name="copy" :size="16" />
          </button>
        </div>
      </div>

      <div class="job-detail-layout">
        <section class="job-detail-main">
          <div class="job-detail-summary-grid">
            <article class="job-detail-summary-card">
              <div class="job-detail-card-head">
                <span>Hiring confidence</span>
                <AppIcon name="info" :size="14" />
              </div>
              <strong class="job-detail-card-value">{{ details.confidence.value }}%</strong>
              <p>{{ details.confidence.note }}</p>
              <small class="job-detail-positive-note">
                <span>{{ details.confidence.delta }}</span>
              </small>
            </article>

            <article class="job-detail-summary-card">
              <div class="job-detail-card-head">
                <span>Hiring readiness</span>
                <AppIcon name="info" :size="14" />
              </div>
              <div class="job-detail-readiness-block">
                <div class="job-detail-ring-svg-wrap">
                  <svg class="job-detail-ring-svg" viewBox="0 0 84 84" aria-hidden="true">
                    <circle class="job-detail-ring-track" cx="42" cy="42" r="31" />
                    <circle
                      class="job-detail-ring-progress is-pink"
                      cx="42"
                      cy="42"
                      r="31"
                      :stroke-dasharray="2 * Math.PI * 31"
                      :stroke-dashoffset="ringOffset(details.readiness.value, 31)"
                    />
                  </svg>
                  <div class="job-detail-ring-label">{{ details.readiness.value }}%</div>
                </div>
                <div class="job-detail-readiness-copy">
                  <strong>{{ details.readiness.note }}</strong>
                  <small class="job-detail-positive-note">
                    <span>{{ details.readiness.delta }}</span>
                  </small>
                </div>
              </div>
            </article>

            <article class="job-detail-summary-card">
              <div class="job-detail-card-head">
                <span>Expected hire</span>
                <AppIcon name="calendar" :size="14" />
              </div>
              <strong class="job-detail-card-value">{{ details.expectedHire.date }}</strong>
              <p class="is-green">{{ details.expectedHire.note }}</p>
              <small>{{ details.expectedHire.target }}</small>
              <span class="job-detail-summary-badge" :class="toneClass(details.expectedHire.badgeTone)">{{ details.expectedHire.badge }}</span>
            </article>

            <article class="job-detail-summary-card">
              <div class="job-detail-card-head">
                <span>Biggest risk</span>
                <AppIcon name="alert" :size="14" />
              </div>
              <strong class="job-detail-card-value">{{ details.risk.title }}</strong>
              <p>{{ details.risk.meta }}</p>
              <small>{{ details.risk.impact }}</small>
              <span class="job-detail-summary-badge" :class="toneClass(details.risk.badgeTone)">{{ details.risk.badge }}</span>
            </article>

            <article class="job-detail-summary-card is-focus">
              <div class="job-detail-card-head">
                <span>Today's focus</span>
                <AppIcon name="checkCircle" :size="14" />
              </div>
              <strong class="job-detail-card-value">{{ details.focus.title }}</strong>
              <p>{{ details.focus.meta }}</p>
              <button class="job-detail-inline-link" type="button">{{ details.focus.action }}</button>
              <span class="job-detail-summary-badge" :class="toneClass(details.focus.badgeTone)">{{ details.focus.badge }}</span>
            </article>
          </div>

          <section class="job-detail-panel">
            <div class="job-detail-panel-head">
              <h2>Why not ready?</h2>
              <span>3 items are blocking readiness</span>
            </div>

            <div class="job-detail-blocker-grid">
              <article v-for="blocker in details.blockers" :key="blocker.title" class="job-detail-blocker">
                <span class="job-detail-blocker-icon">
                  <AppIcon :name="blocker.icon" :size="16" />
                </span>
                <div class="job-detail-blocker-copy">
                  <strong>{{ blocker.title }}</strong>
                  <small>{{ blocker.meta }}</small>
                </div>
              </article>
            </div>
          </section>

          <section class="job-detail-panel">
            <div class="job-detail-panel-head">
              <div class="job-detail-section-title">
                <h2>Top candidates</h2>
                <span>3 of 4</span>
              </div>
              <button class="job-detail-inline-link" type="button" @click="openAddCompareModal">
                <AppIcon name="plus" :size="14" />
                <span>Add candidate</span>
              </button>
            </div>

            <div class="job-detail-candidate-grid">
              <article v-for="candidate in details.candidates" :key="candidate.name" class="job-detail-candidate-card">
                <span class="job-detail-rank">{{ candidate.rank }}</span>
                <div class="job-detail-candidate-avatar" :class="toneClass(candidate.tone)">{{ candidate.avatar }}</div>
                <strong>{{ candidate.name }}</strong>
                <p>{{ candidate.role }}</p>
                <span class="job-detail-match">{{ candidate.match }}</span>
                <small>{{ candidate.note }}</small>
              </article>

              <button class="job-detail-add-card" type="button" @click="openAddCompareModal">
                <span class="job-detail-add-circle">
                  <AppIcon name="plus" :size="20" />
                </span>
                <strong>Add candidate</strong>
              </button>
            </div>

            <button class="job-detail-panel-link" type="button" @click="openCompareCandidates">View candidates to compare</button>
          </section>

          <div class="job-detail-lower-grid">
            <section class="job-detail-panel">
              <div class="job-detail-panel-head">
                <div class="job-detail-section-title is-stacked">
                  <h2>What-if scenarios</h2>
                  <span>Model the impact of different decisions</span>
                </div>
              </div>

              <div class="job-detail-table">
                <div class="job-detail-table-head">
                  <span>Scenario</span>
                  <span>Time to hire</span>
                  <span>Quality</span>
                  <span>Confidence</span>
                </div>

                <div v-for="scenario in details.scenarios" :key="scenario.label" class="job-detail-table-row">
                  <strong>{{ scenario.label }}</strong>
                  <span class="is-green">{{ scenario.hire }}</span>
                  <span :class="scenario.quality.startsWith('-') ? 'is-pink' : 'is-green'">{{ scenario.quality }}</span>
                  <span :class="toneClass(scenario.tone)">{{ scenario.confidence }}</span>
                </div>
              </div>

              <button class="job-detail-panel-link" type="button" @click="openWhatIfModal">View full what-if analysis</button>
            </section>

            <section class="job-detail-panel">
              <div class="job-detail-panel-head job-detail-panel-head--actions">
                <div class="job-detail-section-title is-stacked">
                  <h2>Recommended actions</h2>
                  <span>Prioritized next steps</span>
                </div>
                <small class="job-detail-actions-head-label">Impact</small>
              </div>

              <div class="job-detail-action-list">
                <article v-for="action in details.actions" :key="action.title" class="job-detail-action-row">
                  <span class="job-detail-action-index">{{ action.index }}</span>
                  <div class="job-detail-action-copy">
                    <strong>{{ action.title }}</strong>
                    <span>{{ action.meta }}</span>
                  </div>
                  <button class="job-detail-action-tag" type="button">{{ action.button }}</button>
                  <div class="job-detail-action-impact">
                    <strong class="is-green">{{ action.impact }}</strong>
                    <small>{{ action.impactLabel }}</small>
                  </div>
                </article>
              </div>

              <button class="job-detail-panel-link" type="button">View all actions</button>
            </section>
          </div>

          <div class="job-detail-bottom-grid">
            <article v-for="card in details.bottomCards" :key="card.title" class="job-detail-bottom-card">
              <template v-if="card.type === 'pool'">
                <h3>{{ card.title }}</h3>
                <div class="job-detail-bottom-pool">
                  <div class="job-detail-bottom-pool-value">
                    <strong class="job-detail-bottom-value">{{ card.value }}</strong>
                    <p>{{ card.subtitle }}</p>
                  </div>
                  <ul class="job-detail-bottom-legend">
                    <li v-for="item in card.items" :key="item.label">
                      <span class="job-detail-legend-dot" :class="toneClass(item.tone)" />
                      <span>{{ item.label }}</span>
                    </li>
                  </ul>
                </div>
              </template>

              <template v-else-if="card.type === 'diversity'">
                <h3>{{ card.title }}</h3>
                <div class="job-detail-bottom-diversity">
                  <div class="job-detail-diversity-visual">
                    <div class="job-detail-diversity-ring" :style="diversityStyle(card.segments)">
                      <div class="job-detail-diversity-ring-core">
                        <strong class="job-detail-bottom-value">{{ card.value }}</strong>
                        <p>{{ card.subtitle }}</p>
                      </div>
                    </div>
                  </div>
                  <ul class="job-detail-bottom-legend">
                    <li v-for="item in card.segments" :key="item.label">
                      <span class="job-detail-legend-dot" :class="toneClass(item.tone)" />
                      <span>{{ item.label }}</span>
                    </li>
                  </ul>
                </div>
              </template>

              <template v-else-if="card.type === 'trend'">
                <div class="job-detail-bottom-trend-head">
                  <div>
                    <h3>{{ card.title }}</h3>
                    <p>{{ card.subtitle }}</p>
                  </div>
                  <div class="job-detail-bottom-trend-delta">
                    <strong class="is-green">{{ card.delta }}</strong>
                    <small>{{ card.deltaNote }}</small>
                  </div>
                </div>
                <div class="job-detail-bottom-trend-body">
                  <svg class="job-detail-trend-chart" viewBox="0 0 100 44" aria-hidden="true">
                    <polyline class="job-detail-trend-line" :points="sparklinePoints(card.points)" />
                  </svg>
                  <div class="job-detail-trend-labels">
                    <span v-for="label in card.labels" :key="label">{{ label }}</span>
                  </div>
                </div>
              </template>

              <template v-else-if="card.type === 'risk'">
                <h3>{{ card.title }}</h3>
                <div class="job-detail-bottom-risk-head">
                  <strong class="job-detail-bottom-value">{{ card.value }}</strong>
                  <p>{{ card.subtitle }}</p>
                </div>
                <div class="job-detail-risk-list">
                  <div v-for="item in card.items" :key="item.label" class="job-detail-risk-row">
                    <div class="job-detail-risk-copy">
                      <AppIcon :name="item.icon" :size="12" />
                      <span>{{ item.label }}</span>
                    </div>
                    <span class="job-detail-risk-badge" :class="toneClass(item.tone)">{{ item.value }}</span>
                  </div>
                </div>
                <button class="job-detail-inline-link job-detail-risk-link" type="button" @click="openRiskMonitorModal">{{ card.link }}</button>
              </template>
            </article>
          </div>
        </section>

        <aside class="job-detail-sidebar">
          <section class="job-detail-panel">
            <div class="job-detail-panel-head">
              <h2>Hiring team alignment</h2>
              <button class="job-detail-inline-link" type="button">View details</button>
            </div>

            <div class="job-detail-team-list">
              <article v-for="member in details.team" :key="member.name" class="job-detail-team-row">
                <span class="job-detail-person-avatar">{{ member.avatar }}</span>
                <div class="job-detail-team-copy-block">
                  <strong>{{ member.name }}</strong>
                  <small>{{ member.role }}</small>
                </div>
                <span class="job-detail-pill" :class="toneClass(member.tone)">{{ member.alignment }}</span>
              </article>
            </div>

            <div class="job-detail-alignment-row">
              <div class="job-detail-ring-svg-wrap is-large">
                <svg class="job-detail-ring-svg" viewBox="0 0 84 84" aria-hidden="true">
                  <circle class="job-detail-ring-track" cx="42" cy="42" r="31" />
                  <circle
                    class="job-detail-ring-progress is-green"
                    cx="42"
                    cy="42"
                    r="31"
                    :stroke-dasharray="2 * Math.PI * 31"
                    :stroke-dashoffset="ringOffset(details.alignment.score, 31)"
                  />
                </svg>
                <div class="job-detail-ring-label">{{ details.alignment.score }}%</div>
              </div>
              <div class="job-detail-alignment-copy">
                <strong>{{ details.alignment.title }}</strong>
                <small>{{ details.alignment.detail }}</small>
              </div>
            </div>
          </section>

          <section class="job-detail-signal-list">
            <button v-for="signal in details.sideSignals" :key="signal.label" class="job-detail-signal-item" type="button">
              <span class="job-detail-signal-icon" :class="toneClass(signal.tone)">
                <AppIcon :name="signal.icon" :size="18" />
              </span>
              <span class="job-detail-signal-label">{{ signal.label }}</span>
              <strong :class="toneClass(signal.tone)">{{ signal.value }}</strong>
              <AppIcon name="chevronRight" :size="16" />
            </button>
          </section>
        </aside>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="addCompareModalOpen" class="job-detail-compare-modal-layer" @click.self="closeAddCompareModal">
        <section class="job-detail-compare-modal">
          <div class="job-detail-compare-modal__head">
            <div class="job-detail-compare-modal__title">
              <span class="job-detail-compare-modal__icon">
                <AppIcon name="userPlus" :size="18" />
              </span>
              <div>
                <h2>Add Candidates to Compare</h2>
                <div class="job-detail-compare-modal__role">
                  <AppIcon name="briefcase" :size="11" />
                  <span>{{ job.title }}</span>
                </div>
              </div>
            </div>

            <button class="job-detail-compare-modal__close" type="button" @click="closeAddCompareModal">
              <AppIcon name="close" :size="16" />
            </button>
          </div>

          <p class="job-detail-compare-modal__copy">Select one or more candidates to add to your comparison.</p>

          <div class="job-detail-compare-modal__toolbar">
            <label class="job-detail-compare-modal__search">
              <AppIcon name="search" :size="16" />
              <input v-model="addCompareSearch" type="text" placeholder="Search by name, email, skill, or keyword...">
            </label>

            <button class="job-detail-compare-modal__filter" type="button">
              <AppIcon name="filter" :size="14" />
              <span>Filters</span>
            </button>
          </div>

          <div class="job-detail-compare-modal__meta">
            <strong>{{ filteredCompareCandidates.length }} RESULTS FOUND</strong>
            <button class="job-detail-compare-modal__sort" type="button">
              <span>Sorted by match</span>
              <AppIcon name="chevronDown" :size="13" />
            </button>
          </div>

          <div class="job-detail-compare-modal__list">
            <article
              v-for="candidate in filteredCompareCandidates"
              :key="candidate.id"
              class="job-detail-compare-modal__row"
              :class="{ 'is-selected': selectedCompareCandidateIds.includes(candidate.id) }"
            >
              <button class="job-detail-compare-modal__check-button" type="button" @click="toggleCompareCandidate(candidate.id)">
                <span
                  class="job-detail-compare-modal__check"
                  :class="{
                    'is-selected': selectedCompareCandidateIds.includes(candidate.id),
                    'is-disabled': !selectedCompareCandidateIds.includes(candidate.id) && selectedCompareCandidateIds.length >= maxCompareCandidates,
                  }"
                >
                  <AppIcon v-if="selectedCompareCandidateIds.includes(candidate.id)" name="check" :size="11" />
                </span>
              </button>

              <span class="job-detail-compare-modal__avatar">{{ candidate.avatar }}</span>

              <div class="job-detail-compare-modal__main">
                <div class="job-detail-compare-modal__name">
                  <strong>{{ candidate.name }}</strong>
                  <div class="job-detail-compare-modal__row-meta">
                    <span>{{ candidate.role }}</span>
                    <span class="job-detail-compare-modal__dot" />
                    <span>{{ candidate.experience }} exp.</span>
                    <span class="job-detail-compare-modal__dot" />
                    <span class="job-detail-compare-modal__location">
                      <AppIcon name="mapPin" :size="10" />
                      <span>{{ candidate.location }}</span>
                    </span>
                  </div>
                </div>
              </div>

              <strong class="job-detail-compare-modal__match">{{ candidate.match }}% Match</strong>

              <div class="job-detail-compare-modal__tags">
                <span v-for="skill in candidate.skills.slice(0, 3)" :key="`${candidate.id}-${skill}`">{{ skill }}</span>
                <small v-if="candidate.skills.length > 3">+{{ candidate.skills.length - 3 }}</small>
              </div>

              <button class="job-detail-compare-modal__expand" type="button" aria-label="View candidate details">
                <AppIcon name="chevronDown" :size="14" />
              </button>
            </article>

            <button class="job-detail-compare-modal__upload" type="button">
              <span class="job-detail-compare-modal__upload-icon">
                <AppIcon name="cloud-upload" :size="16" />
              </span>
              <div class="job-detail-compare-modal__upload-copy">
                <strong>Upload New Candidate</strong>
                <span>Upload a CV to add a new candidate to this job</span>
              </div>
              <small>Supported formats: PDF, DOCX (Max 10MB)</small>
            </button>
          </div>

          <div class="job-detail-compare-modal__selected">
            <div class="job-detail-compare-modal__selected-head">
              <strong>Selected Candidates ({{ selectedCompareCandidates.length }})</strong>
              <button type="button" @click="clearCompareCandidates">Clear all</button>
            </div>

            <div class="job-detail-compare-modal__selected-list">
              <article
                v-for="candidate in selectedCompareCandidates"
                :key="`selected-${candidate.id}`"
                class="job-detail-compare-modal__selected-chip"
              >
                <span class="job-detail-compare-modal__avatar is-small">{{ candidate.avatar }}</span>
                <div>
                  <strong>{{ candidate.name }}</strong>
                  <span>{{ candidate.match }}% match</span>
                </div>
                <button type="button" aria-label="Remove selected candidate" @click="removeCompareCandidate(candidate.id)">
                  <AppIcon name="close" :size="13" />
                </button>
              </article>
            </div>
          </div>

          <div class="job-detail-compare-modal__footer">
            <div class="job-detail-compare-modal__footer-copy">
              <strong>Currently comparing: {{ selectedCompareCandidates.length }} of {{ maxCompareCandidates }} candidates</strong>
              <span>You can compare up to {{ maxCompareCandidates }} candidates at a time.</span>
            </div>

            <div class="job-detail-compare-modal__footer-actions">
              <button class="job-detail-compare-modal__cancel" type="button" @click="closeAddCompareModal">Cancel</button>
              <button class="job-detail-compare-modal__apply" type="button" :disabled="!selectedCompareCandidates.length" @click="applyCompareCandidates">
                Add {{ selectedCompareCandidates.length }} Candidate{{ selectedCompareCandidates.length === 1 ? '' : 's' }} to Comparison
              </button>
            </div>
          </div>
        </section>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="addCompareSuccessModalOpen" class="job-detail-compare-success-layer" @click.self="closeAddCompareSuccessModal">
        <section class="job-detail-compare-success-modal">
          <button class="job-detail-compare-success-modal__close" type="button" @click="closeAddCompareSuccessModal">
            <AppIcon name="close" :size="18" />
          </button>

          <div class="job-detail-compare-success-modal__hero">
            <div class="job-detail-compare-success-modal__icon-wrap">
              <span class="job-detail-compare-success-modal__spark is-left"></span>
              <span class="job-detail-compare-success-modal__spark is-right"></span>
              <div class="job-detail-compare-success-modal__icon">
                <AppIcon name="check" :size="28" />
              </div>
            </div>

            <h2>Candidates Added Successfully</h2>
            <p>{{ appliedCompareCandidates.length }} candidate{{ appliedCompareCandidates.length === 1 ? '' : 's' }} were added to your comparison list.</p>
          </div>

          <section class="job-detail-compare-success-section">
            <strong class="job-detail-compare-success-section__label">Added candidates</strong>
            <div class="job-detail-compare-success-list">
              <article
                v-for="candidate in appliedCompareCandidates"
                :key="`success-${candidate.id}`"
                class="job-detail-compare-success-row"
              >
                <div class="job-detail-compare-success-row__main">
                  <span class="job-detail-compare-modal__avatar">{{ candidate.avatar }}</span>
                  <strong>{{ candidate.name }}</strong>
                </div>
                <span class="job-detail-compare-success-row__match">{{ candidate.match }}% Match</span>
              </article>
            </div>
          </section>

          <section class="job-detail-compare-success-section">
            <strong class="job-detail-compare-success-section__label">Comparison list updated</strong>
            <div class="job-detail-compare-success-count">
              <span class="job-detail-compare-success-count__icon">
                <AppIcon name="check" :size="12" />
              </span>
              <strong>{{ appliedCompareCandidates.length }} / {{ maxCompareCandidates }}</strong>
              <span>candidates selected</span>
            </div>

            <div class="job-detail-compare-success-avatars">
              <span
                v-for="candidate in appliedCompareCandidates"
                :key="`success-avatar-${candidate.id}`"
                class="job-detail-compare-success-avatar"
              >
                {{ candidate.avatar }}
              </span>
            </div>

            <article class="job-detail-compare-success-insight">
              <span class="job-detail-compare-success-insight__icon">
                <AppIcon name="spark" :size="16" />
              </span>
              <div>
                <strong>Nitro Insight</strong>
                <p>You now have enough candidates for a meaningful comparison.</p>
                <small>Nitro can help identify the strongest finalist.</small>
              </div>
            </article>
          </section>

          <div class="job-detail-compare-success-actions">
            <button class="job-detail-compare-success-actions__ghost" type="button" @click="continueReviewing">Continue Reviewing</button>
            <button class="job-detail-compare-success-actions__primary" type="button" @click="openCompareFromSuccess">
              <span>Compare Candidates</span>
              <AppIcon name="chevronRight" :size="16" />
            </button>
          </div>
        </section>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="whatIfModalOpen" class="job-detail-what-if-layer" @click.self="closeWhatIfModal">
        <section class="job-detail-what-if-modal">
          <div class="job-detail-what-if-modal__head">
            <button class="job-detail-what-if-modal__back" type="button" @click="closeWhatIfModal">
              <AppIcon name="chevronLeft" :size="18" />
            </button>

            <div class="job-detail-what-if-modal__title">
              <h2>What-If Analysis</h2>
              <p>Test hiring strategies before changing your job requirements.</p>
            </div>

            <div class="job-detail-what-if-modal__actions">
              <button class="job-detail-what-if-modal__ghost" type="button">
                <AppIcon name="info" :size="15" />
                <span>How it works</span>
              </button>
              <button class="job-detail-what-if-modal__ghost" type="button">
                <AppIcon name="document" :size="15" />
                <span>Export Analysis</span>
              </button>
            </div>
          </div>

          <div class="job-detail-what-if-modal__body">
            <div class="job-detail-what-if-modal__main">
              <section class="job-detail-what-if-section">
                <div class="job-detail-what-if-section__head">
                  <strong>Current Hiring Baseline</strong>
                  <button class="job-detail-what-if-inline" type="button">
                    <AppIcon name="info" :size="13" />
                    <span>Why these numbers?</span>
                  </button>
                </div>

                <div class="job-detail-what-if-baseline-grid">
                  <article
                    v-for="card in whatIfBaselineCards"
                    :key="card.title"
                    class="job-detail-what-if-baseline-card"
                  >
                    <span class="job-detail-what-if-baseline-card__icon" :class="toneClass(card.tone)">
                      <AppIcon :name="card.icon" :size="15" />
                    </span>
                    <strong>{{ card.title }}</strong>
                    <em>{{ card.value }}</em>
                    <small>{{ card.note }}</small>
                  </article>
                </div>
              </section>

              <section class="job-detail-what-if-section">
                <div class="job-detail-what-if-section__head">
                  <strong>What-If Scenarios</strong>
                  <button class="job-detail-what-if-inline is-pink" type="button">Reset all</button>
                </div>

                <div class="job-detail-what-if-scenarios">
                  <article
                    v-for="scenario in whatIfScenarioCards"
                    :key="scenario.label"
                    class="job-detail-what-if-card"
                  >
                    <div class="job-detail-what-if-card__top">
                      <div class="job-detail-what-if-card__identity">
                        <span class="job-detail-what-if-card__index" :class="toneClass(scenario.tone)">{{ scenario.index }}</span>
                        <span class="job-detail-what-if-card__icon" :class="toneClass(scenario.tone)">
                          <AppIcon :name="scenario.icon" :size="15" />
                        </span>
                      </div>

                      <div class="job-detail-what-if-card__copy">
                        <strong>{{ scenario.label }}</strong>
                        <p>{{ scenario.description }}</p>
                      </div>

                      <div class="job-detail-what-if-card__change">
                        <div>
                          <span>Current</span>
                          <strong>{{ scenario.current }}</strong>
                        </div>
                        <AppIcon name="chevronRight" :size="14" />
                        <div class="is-new">
                          <span>New</span>
                          <strong>{{ scenario.next }}</strong>
                        </div>
                      </div>

                      <button class="job-detail-what-if-card__apply" :class="toneClass(scenario.tone)" type="button" @click="openWhatIfScenarioModal(scenario)">Apply Scenario</button>
                    </div>

                    <div class="job-detail-what-if-card__explanation" :class="toneClass(scenario.tone)">
                      <strong>AI Explanation:</strong>
                      <span>{{ scenario.explanation }}</span>
                    </div>
                  </article>
                </div>
              </section>
            </div>

            <aside class="job-detail-what-if-modal__side">
              <section class="job-detail-what-if-side-card is-recommendation">
                <div class="job-detail-what-if-side-card__head">
                  <div class="job-detail-what-if-side-card__title">
                    <AppIcon name="spark" :size="16" />
                    <strong>Nitro Recommendation</strong>
                  </div>
                  <span class="job-detail-what-if-side-card__badge">Best overall outcome</span>
                </div>

                <p>Based on your goals (balance of speed, quality &amp; cost), Nitro suggests:</p>

                <div class="job-detail-what-if-side-card__recommendation-box">
                  <strong>Increase Salary by 10%</strong>
                  <span>+</span>
                  <strong>Expand Talent Pool to EU Remote</strong>
                  <small>This combination gives you the best balance between speed, quality and candidate volume.</small>
                </div>

                <div class="job-detail-what-if-outcome-list">
                  <strong class="job-detail-what-if-side-card__section-label">Projected Outcome</strong>
                  <div
                    v-for="item in whatIfProjectedOutcome"
                    :key="item.label"
                    class="job-detail-what-if-outcome-row"
                  >
                    <span>{{ item.label }}</span>
                    <div>
                      <strong>{{ item.value }}</strong>
                      <small :class="toneClass(item.tone)">{{ item.delta }}</small>
                    </div>
                  </div>
                </div>

                <div class="job-detail-what-if-confidence">
                  <div class="job-detail-what-if-confidence__ring">
                    <div>94%</div>
                  </div>
                  <div>
                    <strong>High Confidence</strong>
                    <small>Based on 1,245 similar hires</small>
                  </div>
                </div>
              </section>

              <section class="job-detail-what-if-side-card">
                <div class="job-detail-what-if-side-card__title is-plain">
                  <strong>Interactive Simulator</strong>
                </div>
                <p>Adjust the levers below to see live impact</p>

                <div class="job-detail-what-if-simulator">
                  <button
                    v-for="field in whatIfSimulatorFields"
                    :key="field.label"
                    class="job-detail-what-if-simulator__field"
                    type="button"
                  >
                    <div class="job-detail-what-if-simulator__field-main">
                      <span class="job-detail-what-if-simulator__icon">
                        <AppIcon :name="field.icon" :size="14" />
                      </span>
                      <strong>{{ field.label }}</strong>
                    </div>
                    <div class="job-detail-what-if-simulator__field-side">
                      <span>{{ field.value }}</span>
                      <AppIcon name="chevronDown" :size="14" />
                    </div>
                  </button>
                </div>

                <button class="job-detail-what-if-reset" type="button">
                  <AppIcon name="refresh" :size="14" />
                  <span>Reset to baseline</span>
                </button>
              </section>
            </aside>
          </div>

          <div class="job-detail-what-if-modal__footer">
            <div class="job-detail-what-if-note">
              <AppIcon name="info" :size="14" />
              <span>All predictions are AI-powered and based on historical NitroSync data, current pipeline, and role complexity.</span>
            </div>

            <div class="job-detail-what-if-modal__footer-actions">
              <button class="job-detail-what-if-modal__close-button" type="button" @click="closeWhatIfModal">Close</button>
              <button class="job-detail-what-if-modal__primary" type="button">Apply Recommended Strategy</button>
            </div>
          </div>
        </section>
      </div>
    </Teleport>
    <Teleport to="body">
      <div
        v-if="whatIfApplyModalOpen && activeWhatIfScenario"
        class="job-detail-what-if-layer job-detail-what-if-confirm-layer"
        @click.self="closeWhatIfScenarioModal"
      >
        <section class="job-detail-what-if-confirm-modal">
          <button class="job-detail-what-if-confirm-modal__close" type="button" @click="closeWhatIfScenarioModal">
            <AppIcon name="close" :size="18" />
          </button>

          <div class="job-detail-what-if-confirm-modal__hero">
            <div class="job-detail-what-if-confirm-modal__art">
              <span class="job-detail-what-if-confirm-modal__spark is-left">
                <AppIcon name="sparkles" :size="12" />
              </span>
              <span class="job-detail-what-if-confirm-modal__spark is-right">
                <AppIcon name="sparkles" :size="12" />
              </span>
              <div class="job-detail-what-if-confirm-modal__hero-icon">
                <AppIcon name="trend-up" :size="24" />
              </div>
            </div>

            <h2>Apply This Scenario?</h2>
            <p>You are about to apply the following changes to this job.</p>
          </div>

          <div class="job-detail-what-if-confirm-modal__body">
            <section class="job-detail-what-if-confirm-section">
              <strong class="job-detail-what-if-confirm-section__label">Changes to be applied</strong>

              <div class="job-detail-what-if-confirm-changes">
                <article
                  v-for="change in activeWhatIfScenario.applyChanges"
                  :key="`${activeWhatIfScenario.label}-${change.title}`"
                  class="job-detail-what-if-confirm-change"
                >
                  <div class="job-detail-what-if-confirm-change__main">
                    <span class="job-detail-what-if-confirm-change__icon">
                      <AppIcon :name="change.icon" :size="16" />
                    </span>

                    <div class="job-detail-what-if-confirm-change__copy">
                      <strong>
                        {{ change.title }}
                        <AppIcon v-if="change.before || change.after" name="checkCircle" :size="14" />
                      </strong>
                      <p>{{ change.description }}</p>
                    </div>
                  </div>

                  <div v-if="change.before || change.after" class="job-detail-what-if-confirm-change__shift">
                    <span>{{ change.before }}</span>
                    <AppIcon name="chevronRight" :size="14" />
                    <strong>{{ change.after }}</strong>
                  </div>

                  <span
                    v-else-if="change.status"
                    class="job-detail-what-if-confirm-change__badge"
                    :class="toneClass(change.statusTone || 'green')"
                  >
                    {{ change.status }}
                  </span>
                </article>
              </div>
            </section>

            <section class="job-detail-what-if-confirm-section">
              <strong class="job-detail-what-if-confirm-section__label">Expected impact</strong>

              <div class="job-detail-what-if-confirm-impact-grid">
                <article
                  v-for="impact in activeWhatIfScenario.applyImpact"
                  :key="`${activeWhatIfScenario.label}-${impact.label}`"
                  class="job-detail-what-if-confirm-impact-card"
                >
                  <span class="job-detail-what-if-confirm-impact-card__icon" :class="toneClass(impact.tone)">
                    <AppIcon :name="impact.icon" :size="16" />
                  </span>
                  <span>{{ impact.label }}</span>
                  <strong>{{ impact.before }} <AppIcon name="chevronRight" :size="12" /> {{ impact.after }}</strong>
                  <small :class="toneClass(impact.tone)">{{ impact.delta }}</small>
                </article>
              </div>
            </section>

            <article class="job-detail-what-if-confirm-message is-insight">
              <span class="job-detail-what-if-confirm-message__icon">
                <AppIcon name="bolt" :size="16" />
              </span>
              <div>
                <strong>AI Insight</strong>
                <p>{{ activeWhatIfScenario.insight }}</p>
              </div>
            </article>

            <article class="job-detail-what-if-confirm-message is-warning">
              <span class="job-detail-what-if-confirm-message__icon">
                <AppIcon name="alert" :size="16" />
              </span>
              <div>
                <strong>Important</strong>
                <p>{{ activeWhatIfScenario.warning }}</p>
              </div>
            </article>
          </div>

          <div class="job-detail-what-if-confirm-modal__footer">
            <button class="job-detail-what-if-confirm-modal__ghost" type="button" @click="closeWhatIfScenarioModal">Cancel</button>
            <button class="job-detail-what-if-confirm-modal__primary" type="button" @click="applyWhatIfScenario">Apply Changes</button>
          </div>
        </section>
      </div>
    </Teleport>
    <Teleport to="body">
      <div v-if="riskMonitorModalOpen" class="job-detail-risk-monitor-layer" @click.self="closeRiskMonitorModal">
        <section class="job-detail-risk-monitor-modal">
          <div class="job-detail-risk-monitor-modal__head">
            <div class="job-detail-risk-monitor-modal__title">
              <span class="job-detail-risk-monitor-modal__icon">
                <AppIcon name="alert" :size="18" />
              </span>
              <div>
                <h2>Candidate Risk Monitor</h2>
                <p>4 candidates require attention</p>
              </div>
            </div>

            <button class="job-detail-risk-monitor-modal__close" type="button" @click="closeRiskMonitorModal">
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <div class="job-detail-risk-monitor-modal__body">
            <div class="job-detail-risk-monitor-summary">
              <article
                v-for="card in riskMonitorSummaryCards"
                :key="card.title"
                class="job-detail-risk-monitor-summary__card"
                :class="toneClass(card.tone)"
              >
                <span class="job-detail-risk-monitor-summary__icon" :class="toneClass(card.tone)">
                  <AppIcon :name="card.icon" :size="16" />
                </span>
                <div>
                  <small>{{ card.title }}</small>
                  <strong>{{ card.value }}</strong>
                  <p>{{ card.note }}</p>
                </div>
              </article>
            </div>

            <div class="job-detail-risk-monitor-table">
              <div class="job-detail-risk-monitor-table__head">
                <span>Candidate</span>
                <span>Risk Factors</span>
                <span>Nitro Prediction</span>
                <span>Recommended Action</span>
              </div>

              <article
                v-for="candidate in riskMonitorCandidates"
                :key="candidate.name"
                class="job-detail-risk-monitor-row"
              >
                <div class="job-detail-risk-monitor-person">
                  <div class="job-detail-risk-monitor-person__status">
                    <span class="job-detail-risk-monitor-person__level" :class="toneClass(candidate.levelTone)">{{ candidate.level }}</span>
                    <span class="job-detail-risk-monitor-person__avatar">{{ candidate.avatar }}</span>
                  </div>
                  <div>
                    <strong>{{ candidate.name }}</strong>
                    <p>{{ candidate.role }}</p>
                    <span class="job-detail-risk-monitor-person__match">{{ candidate.match }}</span>
                  </div>
                </div>

                <div class="job-detail-risk-monitor-factors">
                  <div
                    v-for="factor in candidate.factors"
                    :key="`${candidate.name}-${factor}`"
                    class="job-detail-risk-monitor-factor"
                    :class="toneClass(candidate.factorTone)"
                  >
                    <AppIcon :name="candidate.factorTone === 'green' ? 'check' : 'alert'" :size="12" />
                    <span>{{ factor }}</span>
                  </div>
                </div>

                <div class="job-detail-risk-monitor-prediction" :class="toneClass(candidate.predictionTone)">
                  <strong>{{ candidate.prediction }}</strong>
                  <p>{{ candidate.predictionNote }}</p>
                  <svg viewBox="0 0 100 24" aria-hidden="true">
                    <path d="M2 16 C 18 11, 35 10, 51 14 S 83 20, 98 12" />
                  </svg>
                </div>

                <div class="job-detail-risk-monitor-action">
                  <strong>{{ candidate.actionTitle }}</strong>
                  <p>{{ candidate.actionNote }}</p>
                  <button class="job-detail-risk-monitor-action__button" :class="toneClass(candidate.actionTone)" type="button">
                    {{ candidate.actionLabel }}
                  </button>
                </div>
              </article>
            </div>
          </div>

          <div class="job-detail-risk-monitor-modal__footer">
            <button class="job-detail-risk-monitor-modal__ghost" type="button" @click="closeRiskMonitorModal">Close</button>
            <button class="job-detail-risk-monitor-modal__primary" type="button">
              <AppIcon name="shield" :size="15" />
              <span>Resolve All Risks</span>
            </button>
          </div>
        </section>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.job-detail-page {
  min-height: calc(100vh - 88px);
  background:
    radial-gradient(circle at top left, rgba(245, 91, 168, 0.08), transparent 28%),
    linear-gradient(180deg, #fcfdff 0%, #f7f9fc 100%);
}

.job-detail-shell {
  max-width: 1360px;
  margin: 0 auto;
  padding: 22px 24px 36px;
}

.job-detail-topbar,
.job-detail-title-row,
.job-detail-hero,
.job-detail-team-summary,
.job-detail-readiness-block,
.job-detail-panel-head,
.job-detail-alignment-row {
  display: flex;
  align-items: center;
}

.job-detail-topbar,
.job-detail-hero,
.job-detail-panel-head {
  justify-content: space-between;
}

.job-detail-back,
.job-detail-ghost-button,
.job-detail-icon-button,
.job-detail-id-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #d9e2ef;
  border-radius: 16px;
  background: #fff;
  color: #172444;
  font: inherit;
  font-size: 0.95rem;
  cursor: pointer;
}

.job-detail-topbar-actions {
  display: flex;
  gap: 10px;
}

.job-detail-icon-button {
  width: 40px;
  justify-content: center;
  padding: 0;
}

.job-detail-hero {
  gap: 20px;
  margin-top: 18px;
}

.job-detail-hero-main {
  flex: 1;
  min-width: 0;
}

.job-detail-title-row {
  gap: 12px;
}

.job-detail-title-row h1 {
  margin: 0;
  color: #142246;
  font-size: 2.8rem;
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.job-detail-star {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: rgba(245, 91, 168, 0.12);
  color: #f55ba8;
  cursor: pointer;
}

.job-detail-star.is-active {
  background: rgba(245, 91, 168, 0.22);
}

.job-detail-meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.job-detail-meta-item {
  color: #6d7c96;
  font-size: 0.92rem;
}

.job-detail-meta-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #c5cfdd;
}

.job-detail-status {
  color: #1f9b53;
  font-size: 0.92rem;
  font-weight: 700;
}

.job-detail-hero-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.job-detail-team-summary {
  gap: 16px;
}

.job-detail-avatar-stack {
  display: flex;
  align-items: center;
}

.job-detail-stack-avatar,
.job-detail-stack-count,
.job-detail-person-avatar,
.job-detail-candidate-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
}

.job-detail-stack-avatar {
  width: 42px;
  height: 42px;
  margin-left: -10px;
  border: 3px solid #fff;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-size: 0.85rem;
}

.job-detail-stack-avatar:first-child {
  margin-left: 0;
}

.job-detail-stack-count {
  width: 42px;
  height: 42px;
  margin-left: -10px;
  border: 3px solid #fff;
  background: #f6f8fc;
  color: #7b889f;
  font-size: 0.95rem;
}

.job-detail-team-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6d7c96;
  font-size: 0.95rem;
}

.job-detail-team-meta strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(245, 91, 168, 0.12);
  color: #f55ba8;
}

.job-detail-id-button {
  color: #6d7c96;
}

.job-detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 18px;
  margin-top: 20px;
}

.job-detail-summary-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.job-detail-summary-card,
.job-detail-panel,
.job-detail-bottom-card,
.job-detail-signal-item {
  border: 1px solid #dde5f1;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 14px 40px rgba(21, 32, 67, 0.06);
}

.job-detail-summary-card,
.job-detail-bottom-card {
  padding: 16px 18px;
}

.job-detail-panel {
  margin-top: 16px;
  padding: 18px 20px;
}

.job-detail-summary-card.is-focus {
  background: linear-gradient(180deg, #fff 0%, #fff7fb 100%);
  border-color: rgba(245, 91, 168, 0.26);
}

.job-detail-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #5f6d87;
  font-size: 0.88rem;
  line-height: 1.35;
}

.job-detail-card-value {
  display: block;
  margin-top: 10px;
  color: #162447;
  font-size: 0.98rem;
  font-weight: 800;
  line-height: 1.35;
}

.job-detail-summary-card p,
.job-detail-summary-card small,
.job-detail-panel-head span,
.job-detail-table-head,
.job-detail-table-row span,
.job-detail-team-copy-block small,
.job-detail-action-copy span,
.job-detail-action-impact small,
.job-detail-bottom-card p,
.job-detail-bottom-card li,
.job-detail-signal-label {
  color: #6f7f99;
}

.job-detail-summary-card p,
.job-detail-summary-card small {
  display: block;
  margin-top: 10px;
  font-size: 0.86rem;
  line-height: 1.5;
}

.job-detail-positive-note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 172px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(35, 193, 107, 0.1);
  color: #1f9b53;
  font-size: 0.7rem;
  line-height: 1.2;
  font-weight: 700;
}

.job-detail-positive-note::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex: 0 0 5px;
}

.job-detail-positive-note span {
  display: block;
  min-width: 0;
}

.job-detail-summary-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.2;
}

.job-detail-summary-badge.is-green {
  background: rgba(35, 193, 107, 0.12);
}

.job-detail-summary-badge.is-orange {
  background: rgba(242, 139, 45, 0.12);
}

.job-detail-summary-badge.is-pink {
  background: rgba(245, 91, 168, 0.12);
}

.job-detail-readiness-block {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 14px;
}

.job-detail-readiness-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.job-detail-readiness-copy strong {
  color: #f55ba8;
  max-width: 124px;
  font-size: 0.88rem;
  line-height: 1.35;
}

.job-detail-ring-svg-wrap {
  position: relative;
  width: 78px;
  height: 78px;
  flex: 0 0 78px;
}

.job-detail-ring-svg-wrap.is-large {
  width: 84px;
  height: 84px;
  flex-basis: 84px;
}

.job-detail-ring-svg {
  display: block;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.job-detail-ring-track,
.job-detail-ring-progress {
  fill: none;
  stroke-width: 7;
}

.job-detail-ring-track {
  stroke: #e8eef8;
}

.job-detail-ring-progress {
  stroke-linecap: round;
}

.job-detail-ring-progress.is-pink {
  stroke: #f55ba8;
}

.job-detail-ring-progress.is-green {
  stroke: #23c16b;
}

.job-detail-ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #162447;
  font-weight: 800;
  font-size: 0.95rem;
}

.job-detail-panel-head h2,
.job-detail-bottom-card h3 {
  margin: 0;
  color: #162447;
  font-size: 1.05rem;
  line-height: 1.3;
}

.job-detail-bottom-card h3 {
  font-size: 0.92rem;
  line-height: 1.2;
}

.job-detail-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.job-detail-section-title.is-stacked {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.job-detail-inline-link,
.job-detail-panel-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: #f55ba8;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.job-detail-blocker-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 16px;
  border-top: 1px solid #e8edf5;
}

.job-detail-blocker {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 8px;
}

.job-detail-blocker + .job-detail-blocker {
  border-left: 1px solid #e8edf5;
}

.job-detail-blocker-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 14px;
  background: #f8faff;
  color: #f55ba8;
}

.job-detail-blocker-copy strong,
.job-detail-candidate-card strong,
.job-detail-team-copy-block strong,
.job-detail-action-copy strong,
.job-detail-table-row strong {
  color: #162447;
}

.job-detail-blocker-copy small {
  display: block;
  margin-top: 4px;
  color: #7b889f;
  font-size: 0.88rem;
}

.job-detail-candidate-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.job-detail-candidate-card,
.job-detail-add-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 236px;
  padding: 20px;
  border: 1px solid #dde5f1;
  border-radius: 20px;
  background: linear-gradient(180deg, #fff 0%, #fbfcff 100%);
}

.job-detail-rank {
  position: absolute;
  top: 14px;
  left: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #f2f5fb;
  color: #7c8ba2;
  font-size: 0.82rem;
  font-weight: 700;
}

.job-detail-candidate-avatar {
  width: 72px;
  height: 72px;
  margin-top: 4px;
  font-size: 1.35rem;
}

.job-detail-candidate-card strong {
  margin-top: 18px;
}

.job-detail-candidate-card p {
  margin: 6px 0 0;
}

.job-detail-match {
  margin-top: 14px;
  padding: 7px 14px;
  border-radius: 999px;
  background: rgba(35, 193, 107, 0.12);
  color: #1f9b53;
  font-weight: 700;
}

.job-detail-candidate-card small {
  margin-top: 14px;
}

.job-detail-add-card {
  justify-content: center;
  gap: 16px;
  border-style: dashed;
  background: linear-gradient(180deg, #fff9fc 0%, #fff 100%);
  color: #f55ba8;
  cursor: pointer;
}

.job-detail-add-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(245, 91, 168, 0.1);
}

.job-detail-panel-link {
  display: flex;
  justify-content: center;
  margin: 18px auto 0;
}

.job-detail-lower-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.job-detail-table {
  margin-top: 16px;
}

.job-detail-table-head,
.job-detail-table-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 0.9fr;
  gap: 14px;
  align-items: center;
}

.job-detail-table-head {
  padding-bottom: 14px;
  border-bottom: 1px solid #e8edf5;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.job-detail-table-row {
  padding: 14px 0;
  border-bottom: 1px solid #eef2f8;
  font-size: 0.9rem;
}

.job-detail-table-row:last-child {
  border-bottom: 0;
}

.job-detail-action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.job-detail-action-row {
  display: grid;
  grid-template-columns: 34px minmax(0, 1.5fr) 96px 120px;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
}

.job-detail-action-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(245, 91, 168, 0.1);
  color: #f55ba8;
  font-size: 0.9rem;
  font-weight: 700;
}

.job-detail-action-copy {
  min-width: 0;
}

.job-detail-action-copy strong {
  display: block;
  font-size: 0.9rem;
  line-height: 1.35;
}

.job-detail-action-copy span {
  display: block;
  margin-top: 3px;
  font-size: 0.82rem;
  line-height: 1.4;
}

.job-detail-action-tag {
  height: 32px;
  padding: 0 12px;
  border: 1px solid rgba(245, 91, 168, 0.16);
  border-radius: 10px;
  background: #fff6fb;
  color: #f55ba8;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  justify-self: start;
}

.job-detail-action-impact {
  text-align: right;
  min-width: 0;
}

.job-detail-action-impact strong {
  display: block;
  font-size: 0.86rem;
  line-height: 1.2;
}

.job-detail-action-impact small {
  display: block;
  margin-top: 3px;
  font-size: 0.8rem;
  line-height: 1.35;
}

.job-detail-panel-head--actions {
  align-items: flex-start;
}

.job-detail-actions-head-label {
  padding-top: 4px;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
}

.job-detail-bottom-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.job-detail-bottom-value {
  display: block;
  margin-top: 10px;
  color: #162447;
  font-size: 1.45rem;
  font-weight: 800;
  line-height: 1.05;
}

.job-detail-bottom-pool,
.job-detail-bottom-diversity {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}

.job-detail-bottom-pool {
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: start;
}

.job-detail-bottom-pool-value p,
.job-detail-bottom-risk-head p {
  margin: 6px 0 0;
  font-size: 0.78rem;
  line-height: 1.35;
}

.job-detail-bottom-legend {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.job-detail-bottom-legend li {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 0.76rem;
  line-height: 1.3;
}

.job-detail-legend-dot {
  width: 7px;
  height: 7px;
  margin-top: 4px;
  border-radius: 50%;
  flex: 0 0 7px;
}

.job-detail-legend-dot.is-blue {
  background: #6b8bff;
}

.job-detail-legend-dot.is-pink {
  background: #f55ba8;
}

.job-detail-legend-dot.is-orange {
  background: #f7a53b;
}

.job-detail-legend-dot.is-violet {
  background: #8b6cff;
}

.job-detail-legend-dot.is-green {
  background: #23c16b;
}

.job-detail-legend-dot.is-slate {
  background: #94a3b8;
}

.job-detail-diversity-visual {
  display: flex;
  justify-content: center;
}

.job-detail-diversity-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104px;
  height: 104px;
  padding: 9px;
  border-radius: 50%;
}

.job-detail-diversity-ring-core {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
  text-align: center;
}

.job-detail-diversity-ring-core .job-detail-bottom-value {
  margin-top: 0;
  font-size: 1.35rem;
}

.job-detail-diversity-ring-core p {
  margin: 4px 0 0;
  font-size: 0.72rem;
}

.job-detail-bottom-trend-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.job-detail-bottom-trend-head > div:first-child {
  min-width: 0;
}

.job-detail-bottom-trend-head p {
  margin: 4px 0 0;
  font-size: 0.8rem;
  line-height: 1.35;
}

.job-detail-bottom-trend-delta {
  text-align: right;
}

.job-detail-bottom-trend-delta strong {
  display: block;
  font-size: 0.84rem;
}

.job-detail-bottom-trend-delta small {
  display: block;
  margin-top: 2px;
  color: #8a98af;
  font-size: 0.64rem;
  line-height: 1.25;
}

.job-detail-bottom-trend-body {
  margin-top: 10px;
}

.job-detail-trend-chart {
  display: block;
  width: 100%;
  height: 64px;
}

.job-detail-trend-line {
  fill: none;
  stroke: #f55ba8;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.job-detail-trend-labels {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
  color: #9aa7bb;
  font-size: 0.62rem;
}

.job-detail-bottom-risk-head {
  margin-top: 10px;
}

.job-detail-risk-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.job-detail-risk-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.job-detail-risk-copy {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: #6f7f99;
  font-size: 0.74rem;
  line-height: 1.3;
}

.job-detail-risk-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
}

.job-detail-risk-badge.is-orange {
  background: rgba(242, 139, 45, 0.14);
}

.job-detail-risk-badge.is-pink {
  background: rgba(245, 91, 168, 0.14);
}

.job-detail-risk-badge.is-green {
  background: rgba(35, 193, 107, 0.14);
}

.job-detail-risk-badge.is-violet {
  background: rgba(123, 97, 255, 0.14);
}

.job-detail-risk-link {
  margin-top: 12px;
  font-size: 0.78rem;
}

.job-detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.job-detail-team-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.job-detail-team-row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.job-detail-person-avatar {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-size: 0.82rem;
}

.job-detail-alignment-row {
  gap: 14px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e8edf5;
}

.job-detail-alignment-copy strong {
  display: block;
  color: #162447;
}

.job-detail-alignment-copy small {
  color: #7b889f;
}

.job-detail-signal-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.job-detail-compare-modal-layer {
  position: fixed;
  inset: 0;
  z-index: 120;
  padding: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(98, 108, 126, 0.46);
  backdrop-filter: blur(4px);
}

.job-detail-compare-modal {
  width: min(940px, 100%);
  max-height: calc(100vh - 48px);
  padding: 22px 24px;
  border: 1px solid #e6edf7;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 26px 80px rgba(15, 23, 42, 0.18);
  display: grid;
  gap: 14px;
  overflow-y: auto;
}

.job-detail-compare-modal__head,
.job-detail-compare-modal__toolbar,
.job-detail-compare-modal__meta,
.job-detail-compare-modal__footer,
.job-detail-compare-modal__selected-head,
.job-detail-compare-modal__row,
.job-detail-compare-modal__title,
.job-detail-compare-modal__footer-actions {
  display: flex;
  align-items: center;
}

.job-detail-compare-modal__head,
.job-detail-compare-modal__meta,
.job-detail-compare-modal__footer,
.job-detail-compare-modal__selected-head,
.job-detail-compare-modal__row {
  justify-content: space-between;
}

.job-detail-compare-modal__title,
.job-detail-compare-modal__toolbar,
.job-detail-compare-modal__footer-actions {
  gap: 12px;
}

.job-detail-compare-modal__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f55ba8;
  background: #fff0f7;
  flex: 0 0 42px;
}

.job-detail-compare-modal__title h2 {
  margin: 0;
  color: #162447;
  font-size: 1.02rem;
  line-height: 1.2;
}

.job-detail-compare-modal__role {
  margin-top: 5px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #77859d;
  font-size: 0.7rem;
}

.job-detail-compare-modal__close {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #a3aec0;
  cursor: pointer;
}

.job-detail-compare-modal__copy {
  margin: 0;
  color: #6f7f99;
  font-size: 0.74rem;
}

.job-detail-compare-modal__search {
  flex: 1;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #dfe7f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #9aa7bb;
}

.job-detail-compare-modal__search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #162447;
  font: inherit;
  font-size: 0.76rem;
}

.job-detail-compare-modal__filter {
  min-width: 98px;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #dfe7f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fff;
  color: #4c5d7a;
  font: inherit;
  font-size: 0.76rem;
  cursor: pointer;
}

.job-detail-compare-modal__meta {
  color: #6f7f99;
}

.job-detail-compare-modal__meta strong {
  font-size: 0.68rem;
  letter-spacing: 0.04em;
}

.job-detail-compare-modal__sort {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: #6f7f99;
  font: inherit;
  font-size: 0.72rem;
  cursor: pointer;
}

.job-detail-compare-modal__list {
  display: grid;
  gap: 10px;
}

.job-detail-compare-modal__row {
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e8edf6;
  border-radius: 13px;
  background: #fff;
}

.job-detail-compare-modal__check-button,
.job-detail-compare-modal__expand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.job-detail-compare-modal__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border: 1px solid #d9e2ef;
  border-radius: 5px;
  background: #fff;
  color: #fff;
}

.job-detail-compare-modal__check.is-selected {
  border-color: #f55ba8;
  background: #f55ba8;
}

.job-detail-compare-modal__check.is-disabled {
  opacity: 0.45;
}

.job-detail-compare-modal__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-size: 0.76rem;
  font-weight: 700;
  flex: 0 0 38px;
}

.job-detail-compare-modal__avatar.is-small {
  width: 28px;
  height: 28px;
  flex-basis: 28px;
  font-size: 0.66rem;
}

.job-detail-compare-modal__main {
  flex: 1;
  min-width: 0;
}

.job-detail-compare-modal__name strong {
  display: block;
  color: #162447;
  font-size: 0.76rem;
  line-height: 1.25;
}

.job-detail-compare-modal__row-meta {
  margin-top: 3px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  color: #6f7f99;
  font-size: 0.66rem;
}

.job-detail-compare-modal__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c6d0df;
}

.job-detail-compare-modal__location {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.job-detail-compare-modal__match {
  color: #f55ba8;
  white-space: nowrap;
  font-size: 0.74rem;
  font-weight: 700;
}

.job-detail-compare-modal__tags {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  min-width: 0;
  max-width: none;
  overflow: hidden;
}

.job-detail-compare-modal__tags span,
.job-detail-compare-modal__tags small {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  height: 21px;
  padding: 0 8px;
  border-radius: 7px;
  background: #f5f7fb;
  color: #5f6d87;
  font-size: 0.62rem;
  white-space: nowrap;
}

.job-detail-compare-modal__expand {
  width: 24px;
  height: 24px;
  color: #a4b0c3;
}

.job-detail-compare-modal__upload {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  border: 1px dashed #f1a7cf;
  border-radius: 14px;
  background: #fff8fc;
  text-align: left;
  cursor: pointer;
}

.job-detail-compare-modal__upload-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  border-radius: 10px;
  background: #fff;
  color: #f55ba8;
  box-shadow: inset 0 0 0 1px rgba(245, 91, 168, 0.14);
}

.job-detail-compare-modal__upload-copy strong {
  display: block;
  color: #162447;
  font-size: 0.76rem;
}

.job-detail-compare-modal__upload-copy span,
.job-detail-compare-modal__upload small,
.job-detail-compare-modal__selected-chip span,
.job-detail-compare-modal__footer-copy span {
  color: #6f7f99;
}

.job-detail-compare-modal__upload-copy span {
  display: block;
  margin-top: 2px;
  font-size: 0.68rem;
}

.job-detail-compare-modal__upload small {
  font-size: 0.66rem;
  text-align: right;
}

.job-detail-compare-modal__selected {
  padding: 12px 14px;
  border: 1px solid #ebeff6;
  border-radius: 16px;
  background: #fff;
}

.job-detail-compare-modal__selected-head strong {
  color: #162447;
  font-size: 0.74rem;
}

.job-detail-compare-modal__selected-head button {
  border: 0;
  background: transparent;
  color: #f55ba8;
  font: inherit;
  font-size: 0.72rem;
  cursor: pointer;
}

.job-detail-compare-modal__selected-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.job-detail-compare-modal__selected-chip {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  padding: 8px 10px;
  border: 1px solid #edf1f7;
  border-radius: 12px;
}

.job-detail-compare-modal__selected-chip > div {
  min-width: 0;
}

.job-detail-compare-modal__selected-chip strong {
  display: block;
  color: #162447;
  overflow-wrap: anywhere;
  font-size: 0.7rem;
}

.job-detail-compare-modal__selected-chip button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 0;
  background: transparent;
  color: #9aa6bb;
  cursor: pointer;
}

.job-detail-compare-modal__footer {
  gap: 16px;
}

.job-detail-compare-modal__footer-copy strong {
  display: block;
  color: #162447;
  font-size: 0.72rem;
}

.job-detail-compare-modal__footer-copy span {
  display: block;
  margin-top: 4px;
  font-size: 0.68rem;
}

.job-detail-compare-modal__footer-actions {
  flex-shrink: 0;
}

.job-detail-compare-modal__cancel,
.job-detail-compare-modal__apply {
  height: 38px;
  padding: 0 18px;
  border-radius: 10px;
  font: inherit;
  font-size: 0.74rem;
  cursor: pointer;
}

.job-detail-compare-modal__cancel {
  border: 1px solid #dfe6f2;
  background: #fff;
  color: #162447;
}

.job-detail-compare-modal__apply {
  border: 0;
  background: linear-gradient(90deg, #ff5aa7 0%, #f24796 100%);
  color: #fff;
  box-shadow: 0 14px 28px rgba(242, 71, 150, 0.22);
}

.job-detail-compare-modal__apply:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.job-detail-compare-success-layer {
  position: fixed;
  inset: 0;
  z-index: 121;
  padding: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(98, 108, 126, 0.5);
  backdrop-filter: blur(4px);
}

.job-detail-compare-success-modal {
  position: relative;
  width: min(640px, 100%);
  max-height: calc(100vh - 48px);
  padding: 28px 32px 30px;
  border: 1px solid #e6edf7;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.2);
  display: grid;
  gap: 22px;
  overflow-y: auto;
}

.job-detail-compare-success-modal__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #a3aec0;
  cursor: pointer;
}

.job-detail-compare-success-modal__hero {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 10px;
}

.job-detail-compare-success-modal__icon-wrap {
  position: relative;
  width: 82px;
  height: 82px;
  display: grid;
  place-items: center;
}

.job-detail-compare-success-modal__spark {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9be2b2;
}

.job-detail-compare-success-modal__spark.is-left {
  top: 8px;
  left: 12px;
  box-shadow: 8px 8px 0 #9be2b2, -2px 18px 0 #9be2b2;
}

.job-detail-compare-success-modal__spark.is-right {
  top: 10px;
  right: 14px;
  box-shadow: -8px 10px 0 #9be2b2, 2px 18px 0 #9be2b2;
}

.job-detail-compare-success-modal__icon {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #dff8e8;
  color: #20b15a;
}

.job-detail-compare-success-modal__hero h2 {
  margin: 0;
  color: #162447;
  font-size: 1.12rem;
  line-height: 1.2;
}

.job-detail-compare-success-modal__hero p {
  margin: 0;
  color: #6f7f99;
  font-size: 0.8rem;
}

.job-detail-compare-success-section {
  display: grid;
  gap: 12px;
}

.job-detail-compare-success-section + .job-detail-compare-success-section {
  padding-top: 16px;
  border-top: 1px solid #edf1f7;
}

.job-detail-compare-success-section__label {
  color: #162447;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.job-detail-compare-success-list {
  border: 1px solid #e7edf6;
  border-radius: 16px;
  overflow: hidden;
}

.job-detail-compare-success-row,
.job-detail-compare-success-row__main,
.job-detail-compare-success-count,
.job-detail-compare-success-actions {
  display: flex;
  align-items: center;
}

.job-detail-compare-success-row {
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
}

.job-detail-compare-success-row + .job-detail-compare-success-row {
  border-top: 1px solid #edf1f7;
}

.job-detail-compare-success-row__main {
  gap: 12px;
  min-width: 0;
}

.job-detail-compare-success-row__main strong {
  color: #162447;
  font-size: 0.86rem;
  line-height: 1.25;
}

.job-detail-compare-success-row__match {
  color: #f55ba8;
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.job-detail-compare-success-count {
  gap: 8px;
  color: #6f7f99;
  font-size: 0.82rem;
}

.job-detail-compare-success-count__icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #22c55e;
  color: #fff;
}

.job-detail-compare-success-count strong {
  color: #20b15a;
  font-size: 0.9rem;
}

.job-detail-compare-success-avatars {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.job-detail-compare-success-avatar {
  width: 42px;
  height: 42px;
  margin-left: -8px;
  border: 3px solid #fff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
}

.job-detail-compare-success-avatar:first-child {
  margin-left: 0;
}

.job-detail-compare-success-insight {
  margin-top: 6px;
  padding: 18px;
  border: 1px solid #d7f3df;
  border-radius: 16px;
  background: #effdf4;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.job-detail-compare-success-insight__icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #22c55e;
  box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.12);
}

.job-detail-compare-success-insight strong {
  display: block;
  color: #1f9b53;
  font-size: 0.88rem;
}

.job-detail-compare-success-insight p,
.job-detail-compare-success-insight small {
  display: block;
  color: #486173;
  line-height: 1.45;
}

.job-detail-compare-success-insight p {
  margin: 6px 0 0;
  font-size: 0.78rem;
}

.job-detail-compare-success-insight small {
  margin-top: 6px;
  font-size: 0.76rem;
}

.job-detail-compare-success-actions {
  justify-content: space-between;
  gap: 14px;
}

.job-detail-compare-success-actions__ghost,
.job-detail-compare-success-actions__primary {
  flex: 1;
  height: 46px;
  border-radius: 12px;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.job-detail-compare-success-actions__ghost {
  border: 1px solid #dfe6f2;
  background: #fff;
  color: #162447;
}

.job-detail-compare-success-actions__primary {
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(90deg, #ff5aa7 0%, #f24796 100%);
  color: #fff;
  box-shadow: 0 14px 28px rgba(242, 71, 150, 0.22);
}

.job-detail-what-if-layer {
  position: fixed;
  inset: 0;
  z-index: 122;
  padding: 28px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(98, 108, 126, 0.52);
  backdrop-filter: blur(4px);
}

.job-detail-what-if-modal {
  width: min(1260px, 100%);
  max-height: calc(100vh - 56px);
  border: 1px solid #e6edf7;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.2);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.job-detail-what-if-modal__head,
.job-detail-what-if-modal__footer,
.job-detail-what-if-section__head,
.job-detail-what-if-card__top,
.job-detail-what-if-side-card__head,
.job-detail-what-if-simulator__field,
.job-detail-what-if-confidence,
.job-detail-what-if-outcome-row,
.job-detail-what-if-note,
.job-detail-what-if-modal__footer-actions,
.job-detail-what-if-modal__actions,
.job-detail-what-if-card__change,
.job-detail-what-if-side-card__title,
.job-detail-what-if-simulator__field-main,
.job-detail-what-if-simulator__field-side {
  display: flex;
  align-items: center;
}

.job-detail-what-if-modal__head,
.job-detail-what-if-modal__footer,
.job-detail-what-if-section__head,
.job-detail-what-if-card__top,
.job-detail-what-if-side-card__head,
.job-detail-what-if-simulator__field,
.job-detail-what-if-outcome-row {
  justify-content: space-between;
}

.job-detail-what-if-modal__head {
  gap: 16px;
  padding: 28px 32px 20px;
  border-bottom: 1px solid #edf1f7;
}

.job-detail-what-if-modal__back {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #162447;
  cursor: pointer;
  flex: 0 0 34px;
}

.job-detail-what-if-modal__title {
  flex: 1;
  min-width: 0;
}

.job-detail-what-if-modal__title h2 {
  margin: 0;
  color: #162447;
  font-size: 0.98rem;
  line-height: 1.2;
}

.job-detail-what-if-modal__title p,
.job-detail-what-if-side-card p {
  margin: 4px 0 0;
  color: #6f7f99;
  font-size: 0.72rem;
  line-height: 1.45;
}

.job-detail-what-if-modal__actions {
  gap: 10px;
}

.job-detail-what-if-modal__ghost,
.job-detail-what-if-modal__close-button,
.job-detail-what-if-modal__primary {
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  font: inherit;
  font-size: 0.74rem;
  cursor: pointer;
}

.job-detail-what-if-modal__ghost,
.job-detail-what-if-modal__close-button {
  border: 1px solid #e2cad7;
  background: #fff;
  color: #30415f;
}

.job-detail-what-if-modal__ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.job-detail-what-if-modal__body {
  min-height: 0;
  padding: 24px 32px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 28px;
  overflow-y: auto;
}

.job-detail-what-if-modal__main,
.job-detail-what-if-modal__side,
.job-detail-what-if-scenarios,
.job-detail-what-if-simulator,
.job-detail-what-if-outcome-list {
  display: grid;
  gap: 18px;
}

.job-detail-what-if-section {
  display: grid;
  gap: 14px;
}

.job-detail-what-if-section__head strong,
.job-detail-what-if-side-card__title strong {
  color: #162447;
  font-size: 0.88rem;
  line-height: 1.2;
}

.job-detail-what-if-inline {
  border: 0;
  background: transparent;
  color: #6f7f99;
  font: inherit;
  font-size: 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.job-detail-what-if-inline.is-pink {
  color: #f55ba8;
  font-weight: 600;
}

.job-detail-what-if-baseline-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.job-detail-what-if-baseline-card,
.job-detail-what-if-card,
.job-detail-what-if-side-card {
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
}

.job-detail-what-if-baseline-card {
  padding: 14px 16px;
  display: grid;
  gap: 8px;
}

.job-detail-what-if-baseline-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff1f7;
  color: #f55ba8;
}

.job-detail-what-if-baseline-card strong,
.job-detail-what-if-card__copy strong,
.job-detail-what-if-card__change strong,
.job-detail-what-if-side-card__recommendation-box strong {
  color: #162447;
}

.job-detail-what-if-baseline-card strong {
  font-size: 0.76rem;
  font-weight: 700;
}

.job-detail-what-if-baseline-card em {
  color: #162447;
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 800;
}

.job-detail-what-if-baseline-card small {
  color: #6f7f99;
  font-size: 0.72rem;
}

.job-detail-what-if-card {
  padding: 16px;
  display: grid;
  gap: 12px;
}

.job-detail-what-if-card__top {
  gap: 14px;
  align-items: center;
}

.job-detail-what-if-card__identity {
  display: grid;
  gap: 8px;
  justify-items: center;
}

.job-detail-what-if-card__index,
.job-detail-what-if-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
}

.job-detail-what-if-card__index.is-green,
.job-detail-what-if-card__icon.is-green {
  background: #ecfbf3;
  color: #22b161;
}

.job-detail-what-if-card__index.is-blue,
.job-detail-what-if-card__icon.is-blue {
  background: #edf4ff;
  color: #3868e8;
}

.job-detail-what-if-card__index.is-orange,
.job-detail-what-if-card__icon.is-orange {
  background: #fff5ea;
  color: #ff922c;
}

.job-detail-what-if-card__index.is-pink,
.job-detail-what-if-card__icon.is-pink {
  background: #fff0f7;
  color: #f55ba8;
}

.job-detail-what-if-card__copy {
  flex: 1;
  min-width: 0;
}

.job-detail-what-if-card__copy strong {
  display: block;
  font-size: 0.88rem;
  line-height: 1.25;
}

.job-detail-what-if-card__copy p {
  margin: 6px 0 0;
  color: #65758d;
  font-size: 0.72rem;
  line-height: 1.4;
}

.job-detail-what-if-card__change {
  gap: 10px;
  color: #6f7f99;
}

.job-detail-what-if-card__change > div {
  display: grid;
  gap: 4px;
}

.job-detail-what-if-card__change span {
  color: #7f8ca1;
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
}

.job-detail-what-if-card__change strong {
  font-size: 0.8rem;
  line-height: 1.25;
}

.job-detail-what-if-card__change .is-new strong,
.job-detail-what-if-card__change .is-new span {
  color: #2563eb;
}

.job-detail-what-if-card__apply {
  min-width: 102px;
  height: 42px;
  padding: 0 14px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.job-detail-what-if-card__apply.is-green {
  background: linear-gradient(90deg, #19b564 0%, #109b53 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(16, 155, 83, 0.22);
}

.job-detail-what-if-card__apply.is-blue {
  background: linear-gradient(90deg, #3b82f6 0%, #2853d8 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(40, 83, 216, 0.22);
}

.job-detail-what-if-card__apply.is-orange {
  background: linear-gradient(90deg, #ff922c 0%, #f06a00 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(240, 106, 0, 0.22);
}

.job-detail-what-if-card__apply.is-pink {
  background: linear-gradient(90deg, #ff5aa7 0%, #f24796 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(242, 71, 150, 0.22);
}

.job-detail-what-if-card__explanation {
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.72rem;
  line-height: 1.5;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.job-detail-what-if-card__explanation strong {
  font-weight: 800;
}

.job-detail-what-if-card__explanation.is-green {
  background: #ecfbf3;
  color: #157a45;
}

.job-detail-what-if-card__explanation.is-blue {
  background: #edf4ff;
  color: #2b5dcb;
}

.job-detail-what-if-card__explanation.is-orange {
  background: #fff5ea;
  color: #b35f13;
}

.job-detail-what-if-card__explanation.is-pink {
  background: #fff0f7;
  color: #c83b7e;
}

.job-detail-what-if-side-card {
  padding: 18px;
  display: grid;
  gap: 14px;
}

.job-detail-what-if-side-card.is-recommendation {
  background: linear-gradient(180deg, #fff7fb 0%, #fff 100%);
  border-color: #f7dbe7;
}

.job-detail-what-if-side-card__head {
  gap: 10px;
  align-items: flex-start;
}

.job-detail-what-if-side-card__title {
  gap: 8px;
  color: #c64286;
}

.job-detail-what-if-side-card__title.is-plain {
  color: #162447;
}

.job-detail-what-if-side-card__badge {
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  background: #ffeaf3;
  color: #cf4c8d;
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
}

.job-detail-what-if-side-card__recommendation-box {
  padding: 18px 16px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #f0e6ec;
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;
}

.job-detail-what-if-side-card__recommendation-box strong {
  font-size: 0.96rem;
  line-height: 1.3;
}

.job-detail-what-if-side-card__recommendation-box span {
  color: #f55ba8;
  font-size: 1.02rem;
  font-weight: 800;
}

.job-detail-what-if-side-card__recommendation-box small,
.job-detail-what-if-confidence small,
.job-detail-what-if-note span {
  color: #6f7f99;
  font-size: 0.72rem;
  line-height: 1.45;
}

.job-detail-what-if-side-card__section-label {
  color: #162447;
  font-size: 0.76rem;
  font-weight: 800;
}

.job-detail-what-if-outcome-row {
  gap: 10px;
  font-size: 0.74rem;
  color: #5f6d87;
}

.job-detail-what-if-outcome-row div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.job-detail-what-if-outcome-row strong {
  color: #162447;
  font-size: 0.76rem;
}

.job-detail-what-if-outcome-row small.is-green {
  color: #22b161;
  font-weight: 700;
}

.job-detail-what-if-confidence {
  gap: 12px;
  padding-top: 6px;
}

.job-detail-what-if-confidence__ring {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(#22c55e 0deg 338deg, #f5d7e4 338deg 360deg);
}

.job-detail-what-if-confidence__ring::before {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: #fff;
}

.job-detail-what-if-confidence__ring div {
  position: relative;
  z-index: 1;
  color: #162447;
  font-size: 0.56rem;
  font-weight: 800;
}

.job-detail-what-if-confidence strong {
  display: block;
  color: #22b161;
  font-size: 0.82rem;
}

.job-detail-what-if-simulator {
  gap: 10px;
}

.job-detail-what-if-simulator__field {
  width: 100%;
  padding: 14px 14px;
  border: 1px solid #edf1f7;
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
}

.job-detail-what-if-simulator__field-main,
.job-detail-what-if-simulator__field-side {
  gap: 8px;
}

.job-detail-what-if-simulator__icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f7f9fc;
  color: #52627d;
}

.job-detail-what-if-simulator__field strong {
  color: #162447;
  font-size: 0.76rem;
}

.job-detail-what-if-simulator__field-side {
  color: #c04b8b;
  font-size: 0.76rem;
  font-weight: 700;
}

.job-detail-what-if-reset {
  border: 0;
  background: transparent;
  color: #66768f;
  font: inherit;
  font-size: 0.74rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.job-detail-what-if-modal__footer {
  gap: 16px;
  padding: 18px 32px;
  border-top: 1px solid #edf1f7;
  background: #fff;
}

.job-detail-what-if-note {
  gap: 8px;
  min-width: 0;
  padding: 10px 14px;
  border: 1px solid #e5edf7;
  border-radius: 999px;
  color: #5f6d87;
  flex: 1;
}

.job-detail-what-if-modal__footer-actions {
  gap: 12px;
}

.job-detail-what-if-modal__primary {
  min-width: 280px;
  border: 0;
  background: linear-gradient(90deg, #ff5aa7 0%, #f24796 100%);
  color: #fff;
  box-shadow: 0 14px 28px rgba(242, 71, 150, 0.22);
}

.job-detail-what-if-confirm-layer {
  z-index: 123;
}

.job-detail-what-if-confirm-modal {
  position: relative;
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  border: 1px solid #e7edf7;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.job-detail-what-if-confirm-modal__close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #95a2bb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.job-detail-what-if-confirm-modal__hero,
.job-detail-what-if-confirm-modal__body,
.job-detail-what-if-confirm-change,
.job-detail-what-if-confirm-change__main,
.job-detail-what-if-confirm-change__shift,
.job-detail-what-if-confirm-impact-card,
.job-detail-what-if-confirm-message,
.job-detail-what-if-confirm-message__icon,
.job-detail-what-if-confirm-modal__footer {
  display: flex;
}

.job-detail-what-if-confirm-modal__hero,
.job-detail-what-if-confirm-modal__body {
  flex-direction: column;
}

.job-detail-what-if-confirm-modal__hero {
  align-items: center;
  gap: 10px;
  padding: 26px 32px 18px;
  text-align: center;
}

.job-detail-what-if-confirm-modal__art {
  position: relative;
  display: grid;
  place-items: center;
  width: 88px;
  height: 72px;
}

.job-detail-what-if-confirm-modal__hero-icon {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e9fbef;
  color: #1fb35d;
}

.job-detail-what-if-confirm-modal__spark {
  position: absolute;
  color: #79e4a7;
}

.job-detail-what-if-confirm-modal__spark.is-left {
  top: 2px;
  left: 6px;
}

.job-detail-what-if-confirm-modal__spark.is-right {
  top: 8px;
  right: 2px;
  color: #ffc34d;
}

.job-detail-what-if-confirm-modal__hero h2 {
  margin: 0;
  color: #162447;
  font-size: 0.98rem;
  line-height: 1.2;
}

.job-detail-what-if-confirm-modal__hero p {
  margin: 0;
  color: #6f7f99;
  font-size: 0.74rem;
  line-height: 1.45;
}

.job-detail-what-if-confirm-modal__body {
  min-height: 0;
  gap: 18px;
  padding: 0 32px 24px;
  overflow-y: auto;
}

.job-detail-what-if-confirm-section {
  display: grid;
  gap: 12px;
}

.job-detail-what-if-confirm-section__label {
  color: #162447;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.job-detail-what-if-confirm-changes,
.job-detail-what-if-confirm-impact-grid {
  display: grid;
  gap: 12px;
}

.job-detail-what-if-confirm-change {
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
}

.job-detail-what-if-confirm-change__main {
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.job-detail-what-if-confirm-change__icon,
.job-detail-what-if-confirm-impact-card__icon,
.job-detail-what-if-confirm-message__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.job-detail-what-if-confirm-change__icon {
  background: #edf4ff;
  color: #5b67ff;
}

.job-detail-what-if-confirm-change__copy {
  min-width: 0;
}

.job-detail-what-if-confirm-change__copy strong {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #162447;
  font-size: 0.84rem;
  line-height: 1.25;
}

.job-detail-what-if-confirm-change__copy strong :deep(svg:last-child) {
  color: #22b161;
}

.job-detail-what-if-confirm-change__copy p {
  margin: 4px 0 0;
  color: #6f7f99;
  font-size: 0.72rem;
  line-height: 1.45;
}

.job-detail-what-if-confirm-change__shift {
  align-items: center;
  gap: 10px;
  color: #98a4b9;
  font-size: 0.76rem;
  white-space: nowrap;
}

.job-detail-what-if-confirm-change__shift strong {
  color: #f55ba8;
  font-size: 0.8rem;
}

.job-detail-what-if-confirm-change__badge {
  min-height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
}

.job-detail-what-if-confirm-change__badge.is-green {
  background: #ecfbf3;
  color: #1fa354;
}

.job-detail-what-if-confirm-impact-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.job-detail-what-if-confirm-impact-card {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
}

.job-detail-what-if-confirm-impact-card__icon.is-green {
  background: #ecfbf3;
  color: #22b161;
}

.job-detail-what-if-confirm-impact-card__icon.is-orange,
.job-detail-what-if-confirm-impact-card__icon.is-amber {
  background: #fff5ea;
  color: #f28b2d;
}

.job-detail-what-if-confirm-impact-card__icon.is-blue {
  background: #edf4ff;
  color: #3868e8;
}

.job-detail-what-if-confirm-impact-card__icon.is-pink {
  background: #fff0f7;
  color: #f55ba8;
}

.job-detail-what-if-confirm-impact-card > span:last-of-type {
  color: #6f7f99;
  font-size: 0.7rem;
}

.job-detail-what-if-confirm-impact-card strong {
  color: #162447;
  font-size: 0.86rem;
  line-height: 1.35;
}

.job-detail-what-if-confirm-impact-card small {
  font-size: 0.8rem;
  font-weight: 700;
}

.job-detail-what-if-confirm-message {
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
}

.job-detail-what-if-confirm-message.is-insight {
  background: #f5f4ff;
  border-color: #dfe2ff;
}

.job-detail-what-if-confirm-message.is-warning {
  background: #fffaf0;
  border-color: #f6e0a7;
}

.job-detail-what-if-confirm-message__icon {
  flex: 0 0 40px;
}

.job-detail-what-if-confirm-message.is-insight .job-detail-what-if-confirm-message__icon {
  background: #ecebff;
  color: #6a61ff;
}

.job-detail-what-if-confirm-message.is-warning .job-detail-what-if-confirm-message__icon {
  background: #fff3de;
  color: #e48a18;
}

.job-detail-what-if-confirm-message strong {
  display: block;
  margin-bottom: 6px;
  color: #162447;
  font-size: 0.82rem;
}

.job-detail-what-if-confirm-message p {
  margin: 0;
  color: #5f6d87;
  font-size: 0.74rem;
  line-height: 1.55;
}

.job-detail-what-if-confirm-modal__footer {
  justify-content: space-between;
  gap: 16px;
  padding: 18px 32px 24px;
  border-top: 1px solid #edf1f7;
}

.job-detail-what-if-confirm-modal__ghost,
.job-detail-what-if-confirm-modal__primary {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.job-detail-what-if-confirm-modal__ghost {
  min-width: 180px;
  border: 1px solid #dbe4f2;
  background: #fff;
  color: #1b2748;
}

.job-detail-what-if-confirm-modal__primary {
  min-width: 240px;
  border: 0;
  background: linear-gradient(90deg, #6f6ff0 0%, #5856df 100%);
  color: #fff;
  box-shadow: 0 14px 28px rgba(88, 86, 223, 0.24);
}

.job-detail-risk-monitor-layer {
  position: fixed;
  inset: 0;
  z-index: 124;
  padding: 24px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(98, 108, 126, 0.56);
  backdrop-filter: blur(4px);
}

.job-detail-risk-monitor-modal {
  width: min(1120px, 100%);
  max-height: calc(100vh - 48px);
  border: 1px solid #e6edf7;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.job-detail-risk-monitor-modal__head,
.job-detail-risk-monitor-modal__title,
.job-detail-risk-monitor-summary__card,
.job-detail-risk-monitor-row,
.job-detail-risk-monitor-person,
.job-detail-risk-monitor-person__status,
.job-detail-risk-monitor-factor,
.job-detail-risk-monitor-modal__footer {
  display: flex;
}

.job-detail-risk-monitor-modal__head,
.job-detail-risk-monitor-modal__footer,
.job-detail-risk-monitor-row {
  justify-content: space-between;
}

.job-detail-risk-monitor-modal__head {
  align-items: center;
  gap: 18px;
  padding: 24px 32px 20px;
  border-bottom: 1px solid #edf1f7;
}

.job-detail-risk-monitor-modal__title {
  align-items: center;
  gap: 14px;
}

.job-detail-risk-monitor-modal__icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff1f1;
  color: #ff5b52;
}

.job-detail-risk-monitor-modal__title h2 {
  margin: 0;
  color: #162447;
  font-size: 0.98rem;
  line-height: 1.2;
}

.job-detail-risk-monitor-modal__title p {
  margin: 6px 0 0;
  color: #6f7f99;
  font-size: 0.74rem;
}

.job-detail-risk-monitor-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #98a4b9;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.job-detail-risk-monitor-modal__body {
  min-height: 0;
  padding: 24px 32px;
  display: grid;
  gap: 20px;
  overflow-y: auto;
}

.job-detail-risk-monitor-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.job-detail-risk-monitor-summary__card {
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
}

.job-detail-risk-monitor-summary__card.is-pink {
  border-color: #ffd9df;
  background: #fffafc;
}

.job-detail-risk-monitor-summary__card.is-orange,
.job-detail-risk-monitor-summary__card.is-amber {
  border-color: #ffe1bf;
  background: #fffdf9;
}

.job-detail-risk-monitor-summary__card.is-green {
  border-color: #d5f4de;
  background: #fcfffd;
}

.job-detail-risk-monitor-summary__card.is-violet {
  border-color: #eadbff;
  background: #fdfbff;
}

.job-detail-risk-monitor-summary__icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.job-detail-risk-monitor-summary__icon.is-pink {
  background: #fff1f1;
  color: #ff5b52;
}

.job-detail-risk-monitor-summary__icon.is-orange,
.job-detail-risk-monitor-summary__icon.is-amber {
  background: #fff5ea;
  color: #f28b2d;
}

.job-detail-risk-monitor-summary__icon.is-green {
  background: #ecfbf3;
  color: #22b161;
}

.job-detail-risk-monitor-summary__icon.is-violet {
  background: #f3eeff;
  color: #a05cff;
}

.job-detail-risk-monitor-summary__card small {
  display: block;
  margin-bottom: 4px;
  color: #7f8ca1;
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
}

.job-detail-risk-monitor-summary__card strong {
  display: block;
  color: #162447;
  font-size: 0.98rem;
  line-height: 1.1;
}

.job-detail-risk-monitor-summary__card p {
  margin: 6px 0 0;
  color: #93a0b5;
  font-size: 0.68rem;
  line-height: 1.35;
}

.job-detail-risk-monitor-table {
  display: grid;
}

.job-detail-risk-monitor-table__head,
.job-detail-risk-monitor-row {
  display: grid;
  grid-template-columns: 1.2fr 1.45fr 1fr 1.1fr;
  gap: 24px;
}

.job-detail-risk-monitor-table__head {
  padding: 8px 8px 10px;
}

.job-detail-risk-monitor-table__head span {
  color: #8a99b0;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.job-detail-risk-monitor-row {
  align-items: start;
  padding: 20px 8px;
  border-top: 1px solid #edf1f7;
}

.job-detail-risk-monitor-person {
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.job-detail-risk-monitor-person__status {
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.job-detail-risk-monitor-person__level {
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 0.52rem;
  font-weight: 800;
  text-transform: uppercase;
}

.job-detail-risk-monitor-person__level.is-pink {
  background: #fff0f0;
  color: #ff5b52;
}

.job-detail-risk-monitor-person__level.is-orange,
.job-detail-risk-monitor-person__level.is-amber {
  background: #fff4e9;
  color: #f28b2d;
}

.job-detail-risk-monitor-person__level.is-green {
  background: #ecfbf3;
  color: #22b161;
}

.job-detail-risk-monitor-person__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #efd27f 0%, #4a8d6a 100%);
  color: #fff;
  font-size: 0.92rem;
  font-weight: 800;
}

.job-detail-risk-monitor-person strong,
.job-detail-risk-monitor-action strong {
  display: block;
  color: #162447;
  font-size: 0.82rem;
  line-height: 1.3;
}

.job-detail-risk-monitor-person p,
.job-detail-risk-monitor-action p {
  margin: 4px 0 0;
  color: #93a0b5;
  font-size: 0.72rem;
  line-height: 1.4;
}

.job-detail-risk-monitor-person__match {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 22px;
  margin-top: 8px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eff9f2;
  color: #22b161;
  font-size: 0.66rem;
  font-weight: 700;
}

.job-detail-risk-monitor-factors {
  display: grid;
  gap: 10px;
}

.job-detail-risk-monitor-factor {
  align-items: center;
  gap: 8px;
  font-size: 0.74rem;
  line-height: 1.45;
}

.job-detail-risk-monitor-factor.is-pink {
  color: #ff5b52;
}

.job-detail-risk-monitor-factor.is-orange,
.job-detail-risk-monitor-factor.is-amber {
  color: #f28b2d;
}

.job-detail-risk-monitor-factor.is-green {
  color: #22b161;
}

.job-detail-risk-monitor-prediction {
  padding: 14px 14px 12px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
}

.job-detail-risk-monitor-prediction.is-pink {
  background: #fff8f8;
  border-color: #ffd5d5;
}

.job-detail-risk-monitor-prediction.is-orange,
.job-detail-risk-monitor-prediction.is-amber {
  background: #fffaf4;
  border-color: #ffdcb6;
}

.job-detail-risk-monitor-prediction.is-green {
  background: #f7fffa;
  border-color: #cdeed8;
}

.job-detail-risk-monitor-prediction strong {
  display: block;
  font-size: 1rem;
  line-height: 1.1;
}

.job-detail-risk-monitor-prediction.is-pink strong {
  color: #ef3b3b;
}

.job-detail-risk-monitor-prediction.is-orange strong,
.job-detail-risk-monitor-prediction.is-amber strong {
  color: #f06a00;
}

.job-detail-risk-monitor-prediction.is-green strong {
  color: #17a34a;
}

.job-detail-risk-monitor-prediction p {
  margin: 6px 0 10px;
  color: #8d9ab1;
  font-size: 0.62rem;
  line-height: 1.35;
}

.job-detail-risk-monitor-prediction svg {
  width: 100%;
  height: 28px;
}

.job-detail-risk-monitor-prediction path {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.job-detail-risk-monitor-prediction.is-pink path {
  stroke: #f8a4a4;
}

.job-detail-risk-monitor-prediction.is-orange path,
.job-detail-risk-monitor-prediction.is-amber path {
  stroke: #f7b87a;
}

.job-detail-risk-monitor-prediction.is-green path {
  stroke: #8ae1a8;
}

.job-detail-risk-monitor-action__button,
.job-detail-risk-monitor-modal__ghost,
.job-detail-risk-monitor-modal__primary {
  height: 40px;
  border-radius: 12px;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.job-detail-risk-monitor-action__button {
  width: 100%;
  margin-top: 12px;
  border: 1px solid #e4dce8;
  background: #fff;
}

.job-detail-risk-monitor-action__button.is-pink {
  border-color: #f55ba8;
  background: linear-gradient(90deg, #f55ba8 0%, #ea4c98 100%);
  color: #fff;
}

.job-detail-risk-monitor-action__button.is-orange,
.job-detail-risk-monitor-action__button.is-amber {
  border-color: #f7c594;
  color: #f06a00;
}

.job-detail-risk-monitor-action__button.is-green {
  border-color: #9fe0b5;
  color: #1fa354;
}

.job-detail-risk-monitor-modal__footer {
  align-items: center;
  gap: 12px;
  padding: 18px 32px 24px;
  border-top: 1px solid #edf1f7;
}

.job-detail-risk-monitor-modal__ghost,
.job-detail-risk-monitor-modal__primary {
  padding: 0 20px;
}

.job-detail-risk-monitor-modal__ghost {
  border: 1px solid #dbe4f2;
  background: #fff;
  color: #1b2748;
}

.job-detail-risk-monitor-modal__primary {
  min-width: 204px;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(90deg, #f55ba8 0%, #ea4c98 100%);
  color: #fff;
  box-shadow: 0 14px 26px rgba(242, 71, 150, 0.2);
}

.job-detail-signal-item {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto 18px;
  gap: 10px;
  align-items: center;
  padding: 14px;
  text-align: left;
  cursor: pointer;
}

.job-detail-signal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: #f8faff;
}

.job-detail-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
}

.is-green {
  color: #1f9b53;
}

.is-pink {
  color: #f55ba8;
}

.is-orange,
.is-amber {
  color: #f28b2d;
}

.is-violet {
  color: #7b61ff;
}

.job-detail-pill.is-green,
.job-detail-candidate-avatar.is-green,
.job-detail-signal-icon.is-green {
  background: rgba(35, 193, 107, 0.12);
}

.job-detail-pill.is-pink,
.job-detail-candidate-avatar.is-pink,
.job-detail-signal-icon.is-pink {
  background: rgba(245, 91, 168, 0.12);
}

.job-detail-pill.is-orange,
.job-detail-pill.is-amber,
.job-detail-candidate-avatar.is-orange,
.job-detail-candidate-avatar.is-amber,
.job-detail-signal-icon.is-orange,
.job-detail-signal-icon.is-amber {
  background: rgba(242, 139, 45, 0.12);
}

.job-detail-pill.is-violet,
.job-detail-candidate-avatar.is-violet,
.job-detail-signal-icon.is-violet {
  background: rgba(123, 97, 255, 0.12);
}

@media (max-width: 1280px) {
  .job-detail-layout {
    grid-template-columns: 1fr;
  }

  .job-detail-summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .job-detail-bottom-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .job-detail-shell {
    padding: 20px 18px 30px;
  }

  .job-detail-topbar,
  .job-detail-hero,
  .job-detail-panel-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .job-detail-hero-side {
    align-items: flex-start;
  }

  .job-detail-summary-grid,
  .job-detail-blocker-grid,
  .job-detail-candidate-grid,
  .job-detail-lower-grid,
  .job-detail-bottom-grid {
    grid-template-columns: 1fr;
  }

  .job-detail-bottom-pool {
    grid-template-columns: 1fr;
  }

  .job-detail-blocker + .job-detail-blocker {
    border-left: 0;
    border-top: 1px solid #e8edf5;
  }

  .job-detail-table-head,
  .job-detail-table-row,
  .job-detail-action-row {
    grid-template-columns: 1fr;
  }

  .job-detail-what-if-confirm-impact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .job-detail-what-if-confirm-change {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-detail-what-if-confirm-change__shift {
    white-space: normal;
  }

  .job-detail-risk-monitor-summary,
  .job-detail-risk-monitor-table__head,
  .job-detail-risk-monitor-row {
    grid-template-columns: 1fr;
  }

  .job-detail-risk-monitor-table__head {
    display: none;
  }

  .job-detail-risk-monitor-row {
    gap: 16px;
  }

  .job-detail-action-impact {
    text-align: left;
  }
}

@media (max-width: 720px) {
  .job-detail-title-row h1 {
    font-size: 2.3rem;
  }

  .job-detail-topbar-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .job-detail-what-if-confirm-modal {
    max-height: calc(100vh - 24px);
    border-radius: 22px;
  }

  .job-detail-what-if-confirm-modal__hero,
  .job-detail-what-if-confirm-modal__body,
  .job-detail-what-if-confirm-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .job-detail-what-if-confirm-impact-grid {
    grid-template-columns: 1fr;
  }

  .job-detail-what-if-confirm-modal__footer {
    flex-direction: column;
  }

  .job-detail-what-if-confirm-modal__ghost,
  .job-detail-what-if-confirm-modal__primary {
    width: 100%;
    min-width: 0;
  }

  .job-detail-risk-monitor-modal {
    max-height: calc(100vh - 24px);
    border-radius: 20px;
  }

  .job-detail-risk-monitor-modal__head,
  .job-detail-risk-monitor-modal__body,
  .job-detail-risk-monitor-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .job-detail-risk-monitor-modal__footer {
    justify-content: stretch;
    flex-direction: column;
  }

  .job-detail-risk-monitor-modal__ghost,
  .job-detail-risk-monitor-modal__primary {
    width: 100%;
  }
}
</style>
