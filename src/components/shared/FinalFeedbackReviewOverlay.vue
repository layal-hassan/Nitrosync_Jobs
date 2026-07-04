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
    default: 'Charlotte Taylor',
  },
  candidateRole: {
    type: String,
    default: 'UX Designer',
  },
})

const emit = defineEmits([
  'close',
  'move-offer',
  'request-clarification',
  'hold-decision',
  'reject-candidate',
])

const previousBodyOverflow = ref('')
const previousHtmlOverflow = ref('')
const activeReviewerId = ref('sarah')
const activeTab = ref('overview')
const activeCompetencyId = ref('leadership')

const reviewers = [
  {
    id: 'sarah',
    name: 'Sarah Johnson',
    role: 'Engineering Manager',
    interviewDate: 'Interview on Apr 22, 2025',
    score: '5 / 5',
    recommendation: 'Hire',
    summary: 'Sarah consistently demonstrated exceptional leadership, strong technical depth and strategic thinking. She would bring immediate impact to our team.',
    strengths: ['Leadership', 'Strategic Thinking', 'Technical Depth', 'Communication', 'Problem Solving', 'Ownership'],
    areas: ['Limited enterprise experience', 'Reference check pending'],
  },
  {
    id: 'james',
    name: 'James Lee',
    role: 'Staff Engineer',
    interviewDate: 'Interview on Apr 22, 2025',
    score: '5 / 5',
    recommendation: 'Hire',
    summary: 'Clear communicator with strong system design judgment and excellent collaboration instincts.',
    strengths: ['Technical Depth', 'Communication', 'Problem Solving'],
    areas: ['Limited enterprise experience'],
  },
  {
    id: 'priya',
    name: 'Priya Patel',
    role: 'Product Manager',
    interviewDate: 'Interview on Apr 22, 2025',
    score: '4 / 5',
    recommendation: 'Hire',
    summary: 'Strong partner for product and cross-functional delivery with credible leadership presence.',
    strengths: ['Strategic Thinking', 'Ownership', 'Communication'],
    areas: ['Reference check pending'],
  },
  {
    id: 'david',
    name: 'David Kim',
    role: 'Director, Engineering',
    interviewDate: 'Interview on Apr 22, 2025',
    score: '5 / 5',
    recommendation: 'Hire',
    summary: 'Confident leadership profile with strong collaboration habits and sound technical framing.',
    strengths: ['Leadership', 'Team Collaboration', 'Technical Depth'],
    areas: ['Reference check pending'],
  },
]

const tabs = [
  ['overview', 'Overview'],
  ['competencies', 'Competencies'],
  ['evidence', 'Evidence'],
  ['timeline', 'Timeline'],
  ['notes', 'Notes & Quotes'],
  ['validation', 'AI Validation'],
]

const competencyRows = [
  {
    id: 'leadership',
    label: 'Leadership',
    description: 'Drives vision, inspires teams and leads by example',
    score: '5.0 / 5',
    stars: '★★★★★',
    trend: 'Strong',
    trendIcon: 'trend-up',
    evidenceStrength: 'Very Strong',
    evidenceTone: 'green',
    evidenceBar: '92%',
    keyEvidence: [
      ['message', 'pink'],
      ['document', 'green'],
      ['sparkles', 'violet'],
      ['alert', 'orange'],
    ],
    why: 'Consistently demonstrated ability to lead cross-functional teams, set direction and empower others to deliver high impact results.',
    topEvidence: [
      ['Interview – Hiring Manager', 'Exceptional leadership presence and ability to inspire the team.', 'message', 'pink'],
      ['Portfolio / Case Study', 'Led a team of 15 to launch a new platform.', 'document', 'green'],
      ['Technical Assessment', 'Leadership scenario – Top 10% performance.', 'sparkles', 'violet'],
    ],
  },
  {
    id: 'technical',
    label: 'Technical Expertise',
    description: 'Deep technical knowledge and problem solving',
    score: '4.8 / 5',
    stars: '★★★★☆',
    trend: 'Stable',
    trendIcon: 'chevronRight',
    evidenceStrength: 'Strong',
    evidenceTone: 'green',
    evidenceBar: '72%',
    keyEvidence: [
      ['message', 'pink'],
      ['document', 'green'],
      ['sparkles', 'violet'],
      ['share', 'slate'],
    ],
    why: 'Strong technical depth across architecture, execution and debugging, with only minor gaps in large-scale platform exposure.',
    topEvidence: [
      ['Interview – Staff Engineer', 'Showed strong system design judgment and implementation detail.', 'message', 'pink'],
      ['Technical Assessment', 'High accuracy and pragmatic technical tradeoffs.', 'target', 'green'],
      ['Portfolio / Work', 'Shipped multiple complex platform improvements.', 'document', 'violet'],
    ],
  },
  {
    id: 'strategic',
    label: 'Strategic Thinking',
    description: 'Thinks ahead, aligns decisions with business goals',
    score: '5.0 / 5',
    stars: '★★★★★',
    trend: 'Strong',
    trendIcon: 'trend-up',
    evidenceStrength: 'Very Strong',
    evidenceTone: 'green',
    evidenceBar: '91%',
    keyEvidence: [
      ['message', 'pink'],
      ['document', 'green'],
      ['sparkles', 'violet'],
      ['alert', 'orange'],
    ],
    why: 'Demonstrated strong prioritization, commercial judgment and a clear connection between execution and business outcomes.',
    topEvidence: [
      ['Interview – Product Manager', 'Thinks strategically and drives product outcomes.', 'message', 'pink'],
      ['Portfolio / Case Study', 'Balanced customer value and operational complexity well.', 'document', 'green'],
      ['AI Analysis', 'Strategic reasoning consistently above benchmark.', 'sparkles', 'violet'],
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    description: 'Communicates clearly and influences effectively',
    score: '5.0 / 5',
    stars: '★★★★★',
    trend: 'Stable',
    trendIcon: 'chevronRight',
    evidenceStrength: 'Very Strong',
    evidenceTone: 'green',
    evidenceBar: '90%',
    keyEvidence: [
      ['message', 'pink'],
      ['document', 'green'],
      ['sparkles', 'violet'],
      ['share', 'slate'],
    ],
    why: 'Explains tradeoffs clearly, adapts tone for audience, and keeps discussions focused on decisions and alignment.',
    topEvidence: [
      ['Interview – Hiring Manager', 'Clear communicator with high executive presence.', 'message', 'pink'],
      ['Interview Notes', 'Consistently structured and concise responses.', 'document', 'green'],
      ['Feedback & Quotes', 'Multiple reviewers noted strong communication.', 'sparkles', 'violet'],
    ],
  },
  {
    id: 'problem-solving',
    label: 'Problem Solving',
    description: 'Analyzes problems and delivers effective solutions',
    score: '4.7 / 5',
    stars: '★★★★☆',
    trend: 'Slightly Lower',
    trendIcon: 'chevronDown',
    evidenceStrength: 'Moderate-Strong',
    evidenceTone: 'orange',
    evidenceBar: '61%',
    keyEvidence: [
      ['message', 'pink'],
      ['document', 'green'],
      ['sparkles', 'violet'],
      ['alert', 'orange'],
    ],
    why: 'Strong structured reasoning overall, with slightly more variability in speed when handling unfamiliar edge cases.',
    topEvidence: [
      ['Technical Assessment', 'Strong performance with one slower edge-case response.', 'target', 'orange'],
      ['Interview – Staff Engineer', 'Reasoning was robust and methodical.', 'message', 'pink'],
      ['AI Analysis', 'High confidence in solution quality, moderate confidence in pace.', 'sparkles', 'violet'],
    ],
  },
  {
    id: 'collaboration',
    label: 'Team Collaboration',
    description: 'Works well across teams and builds strong partnerships',
    score: '5.0 / 5',
    stars: '★★★★★',
    trend: 'Stable',
    trendIcon: 'chevronRight',
    evidenceStrength: 'Very Strong',
    evidenceTone: 'green',
    evidenceBar: '88%',
    keyEvidence: [
      ['message', 'pink'],
      ['document', 'green'],
      ['sparkles', 'violet'],
      ['alert', 'orange'],
    ],
    why: 'Repeated examples showed strong alignment, inclusive communication and healthy stakeholder management habits.',
    topEvidence: [
      ['Interview – Product Manager', 'Excellent cross-functional collaboration examples.', 'message', 'pink'],
      ['Portfolio / Work', 'Built trust across product, design and engineering.', 'document', 'green'],
      ['Feedback & Quotes', 'Multiple mentions of partnership mindset.', 'sparkles', 'violet'],
    ],
  },
  {
    id: 'ownership',
    label: 'Ownership & Accountability',
    description: 'Takes ownership and delivers results consistently',
    score: '5.0 / 5',
    stars: '★★★★★',
    trend: 'Strong',
    trendIcon: 'trend-up',
    evidenceStrength: 'Very Strong',
    evidenceTone: 'green',
    evidenceBar: '90%',
    keyEvidence: [
      ['message', 'pink'],
      ['document', 'green'],
      ['sparkles', 'violet'],
      ['share', 'slate'],
    ],
    why: 'Consistently showed initiative, follow-through and clear accountability for outcomes and team performance.',
    topEvidence: [
      ['Interview – Director, Engineering', 'Demonstrates ownership and accountability.', 'message', 'pink'],
      ['Portfolio / Work', 'Led ambiguous initiatives through completion.', 'document', 'green'],
      ['AI Analysis', 'Ownership signals strong across evidence sources.', 'sparkles', 'violet'],
    ],
  },
  {
    id: 'adaptability',
    label: 'Adaptability',
    description: 'Adapts to change and thrives in dynamic environments',
    score: '4.3 / 5',
    stars: '★★★★☆',
    trend: 'Stable',
    trendIcon: 'chevronRight',
    evidenceStrength: 'Moderate',
    evidenceTone: 'orange',
    evidenceBar: '52%',
    keyEvidence: [
      ['message', 'pink'],
      ['document', 'green'],
      ['sparkles', 'violet'],
      ['share', 'slate'],
    ],
    why: 'Good overall adaptability signals, though examples were less detailed than the strongest competencies.',
    topEvidence: [
      ['Interview Notes', 'Handled change scenarios with practical responses.', 'document', 'green'],
      ['Feedback & Quotes', 'Moderate evidence from reviewers.', 'message', 'pink'],
      ['AI Analysis', 'Confidence lower due to limited depth of examples.', 'sparkles', 'violet'],
    ],
  },
]

const evidenceCards = [
  ['CV / Resume', 'Reviewed', 'document', 'green'],
  ['Portfolio / Work', 'Reviewed', 'document', 'green'],
  ['Technical Assessment', 'Completed', 'target', 'green'],
  ['References', 'Pending', 'message', 'orange'],
  ['Interview Notes', 'Completed', 'document', 'green'],
  ['Scorecard', 'Completed', 'document', 'green'],
  ['AI Analysis', 'Completed', 'sparkles', 'green'],
  ['Feedback & Quotes', 'Collected', 'message', 'green'],
]

const quotedHighlights = [
  ['James Lee', 'Staff Engineer', 'One of the strongest technical leaders I have interviewed.'],
  ['Priya Patel', 'Product Manager', 'Thinks strategically and drives product outcomes.'],
  ['David Kim', 'Director, Engineering', 'Would be an excellent addition to our leadership team.'],
]

const evidenceStats = [
  ['Total Evidence Points', '84', 'Across all sources', 'checkCircle', 'green'],
  ['Human Evidence', '63', 'From interviews & feedback', 'user', 'orange'],
  ['AI Analyzed Evidence', '21', 'AI insights & assessments', 'users', 'blue'],
  ['Contradictions', '0', 'None detected', 'checkCircle', 'green'],
]

const evidenceCompetencies = [
  ['Leadership', '5.0', '24'],
  ['Technical Expertise', '4.8', '18'],
  ['Strategic Thinking', '5.0', '16'],
  ['Communication', '5.0', '14'],
  ['Problem Solving', '4.7', '12'],
  ['Ownership', '5.0', '10'],
  ['Team Collaboration', '5.0', '8'],
  ['Adaptability', '4.3', '6'],
]

const evidenceFeed = [
  {
    title: 'Interview Quote',
    source: 'Round 2 – Technical Interview',
    icon: 'message',
    iconTone: 'pink',
    body: 'I led a team of 18 engineers to migrate our platform to microservices, improving performance by 40%.',
    author: 'James Lee',
    date: 'Apr 14, 2025',
    support: 'Supports Leadership',
    stars: '★★★★★',
    score: '5 / 5',
  },
  {
    title: 'Hiring Manager Feedback',
    source: 'Round 3 – Hiring Manager Interview',
    icon: 'document',
    iconTone: 'orange',
    body: 'Excellent executive presence and communicates vision clearly. The team would follow her.',
    author: 'David Kim',
    date: 'Apr 18, 2025',
    support: 'Supports Leadership',
    stars: '★★★★★',
    score: '5 / 5',
  },
  {
    title: 'Portfolio / Case Study',
    source: 'E-commerce Platform Redesign',
    icon: 'document',
    iconTone: 'violet',
    body: 'Led end-to-end redesign that increased conversion by 32%. Submitted by candidate.',
    author: '',
    date: 'Apr 10, 2025',
    support: 'Supports Leadership',
    stars: '★★★★★',
    score: '5 / 5',
  },
  {
    title: 'Scorecard',
    source: 'Hiring Manager Interview',
    icon: 'target',
    iconTone: 'blue',
    body: 'Leadership competency rating',
    author: 'David Kim',
    date: 'Apr 18, 2025',
    support: 'Supports Leadership',
    stars: '★★★★★',
    score: '5 / 5',
  },
  {
    title: 'Assessment Result',
    source: 'Leadership Simulation',
    icon: 'document',
    iconTone: 'green',
    body: 'Leadership & Decision Making',
    author: 'Score: 91 / 100',
    date: 'Top 10% percentile',
    support: 'Supports Leadership',
    stars: '★★★★☆',
    score: '4.5 / 5',
  },
]

const timelineSteps = [
  {
    title: 'Application Submitted',
    shortLabel: 'Application',
    subtitle: 'Resume parsed & AI screening',
    icon: 'document',
    tone: 'violet',
    confidence: 84,
    evidenceAdded: ['Skills match', 'Experience', 'Education'],
    insight: 'Strong match for the role. Top strengths identified.',
    insightTone: 'violet',
    date: 'Apr 02',
  },
  {
    title: 'Recruiter Screen',
    shortLabel: 'Recruiter Screen',
    subtitle: 'Interview by James Lee',
    icon: 'user',
    tone: 'pink',
    confidence: 88,
    evidenceAdded: ['Communication', 'Motivation', 'Culture Fit'],
    insight: 'Candidate shows strong communication and alignment with company values.',
    insightTone: 'pink',
    date: 'Apr 08',
  },
  {
    title: 'Technical Assessment',
    shortLabel: 'Assessment',
    subtitle: 'Coding & System Design',
    icon: 'document',
    tone: 'orange',
    confidence: 91,
    evidenceAdded: ['Technical Skills', 'Problem Solving', 'Architecture'],
    insight: 'Excellent technical depth. Performed above benchmark.',
    insightTone: 'orange',
    date: 'Apr 10',
  },
  {
    title: 'Technical Interview',
    shortLabel: 'Technical Interview',
    subtitle: 'Interview by James Lee',
    icon: 'message',
    tone: 'green',
    confidence: 95,
    evidenceAdded: ['Leadership', 'Ownership', 'Technical Depth'],
    insight: 'Demonstrates strong leadership and ownership. No concerns.',
    insightTone: 'green',
    date: 'Apr 14',
  },
  {
    title: 'Hiring Manager Interview',
    shortLabel: 'Hiring Manager',
    subtitle: 'Interview by Sarah Johnson',
    icon: 'user-check',
    tone: 'blue',
    confidence: 97,
    evidenceAdded: ['Strategic Thinking', 'Execution', 'Impact'],
    insight: 'Exceptional executive presence and strategic thinking.',
    insightTone: 'blue',
    date: 'Apr 18',
  },
  {
    title: 'Panel Review',
    shortLabel: 'Panel Review',
    subtitle: 'Panel interview (4 people)',
    icon: 'users',
    tone: 'violet',
    confidence: 96,
    evidenceAdded: ['Collaboration', 'Decision Making', 'Culture Add'],
    insight: 'One concern on enterprise scale experience. Reference suggested.',
    insightTone: 'violet',
    date: 'Apr 22',
  },
  {
    title: 'Final Validation',
    shortLabel: 'Final Validation',
    subtitle: 'AI validation & consensus',
    icon: 'shield',
    tone: 'green',
    confidence: 97,
    evidenceAdded: ['Consistency Check', 'Bias Analysis', 'Final Consensus'],
    insight: 'High confidence. No contradictions detected. Strong hire recommendation.',
    insightTone: 'green',
    date: 'Apr 22',
  },
]

const evidenceGrowthPoints = [
  ['Application', 4],
  ['Assessment', 21],
  ['Tech Interview', 36],
  ['Panel Review', 44],
  ['Final', 53],
]

const competencyEvolutionPoints = [
  ['App', 3.8],
  ['Screen', 4.2],
  ['Assess', 4.5],
  ['Tech Int.', 4.8],
  ['HM Int.', 5.0],
  ['Panel', 5.0],
  ['Final', 5.0],
]

const timelineInsights = [
  ['green', 'Confidence increased 13% from first touch to final decision.'],
  ['blue', 'Strongest growth in Leadership and Technical Depth.'],
  ['orange', 'Reference check pending for enterprise scale experience.'],
]

const confidenceAxisLabels = ['100%', '75%', '50%', '25%', '0%']
const validationChartLabels = ['Application', 'Screen', 'Assessment', 'Tech Interview', 'HM Interview', 'Panel', 'Final']

const noteChips = [
  ['All', 12, true],
  ['Interviewers', 8, false],
  ['Hiring Team', 3, false],
  ['Recruiter', 1, false],
  ['AI', 2, false],
]

const noteEntries = [
  {
    author: 'James Lee',
    role: 'Staff Engineer',
    date: 'Apr 14, 2025',
    source: 'Technical Interview',
    tone: 'green',
    tag: 'Technical Skills',
    score: '5 / 5',
    text: 'Excellent problem solving approach. Broke down complex systems clearly. Strong ownership mindset.',
  },
  {
    author: 'Priya Patel',
    role: 'Product Manager',
    date: 'Apr 16, 2025',
    source: 'Culture Interview',
    tone: 'violet',
    tag: 'Culture Fit',
    score: '4 / 5',
    text: 'Great collaborator and communicator. Aligns teams and keeps focus on customer impact.',
  },
  {
    author: 'David Kim',
    role: 'Director, Engineering',
    date: 'Apr 18, 2025',
    source: 'Hiring Manager Interview',
    tone: 'orange',
    tag: 'Leadership',
    score: '5 / 5',
    text: 'Exceptional executive presence. Thinks strategically about scaling systems and teams.',
  },
  {
    author: 'AI Insight',
    role: 'Automated Analysis',
    date: 'Apr 18, 2025',
    source: 'Post Interview Analysis',
    tone: 'blue',
    tag: 'AI Analysis',
    score: '',
    text: 'Consistent positive feedback across all dimensions. No contradictions detected in the feedback.',
  },
]

const noteHighlights = [
  ['green', 'Consistent praise for leadership and ownership'],
  ['green', 'Strong alignment on technical expertise'],
  ['green', 'Excellent communication and team collaboration'],
  ['green', 'Strategic thinking and execution capability'],
  ['blue', 'No major concerns raised'],
]

const noteActivity = [
  ['Total Notes', '12'],
  ['Interviewers', '8'],
  ['Hiring Team', '3'],
  ['Recruiter', '1'],
  ['AI Generated', '2'],
]

const quoteCards = [
  {
    quote: "I'd hire Sarah immediately.",
    author: 'James Lee',
    role: 'Staff Engineer',
    source: 'Technical Interview',
    tone: 'green',
  },
  {
    quote: "One of the strongest engineering leaders I've interviewed.",
    author: 'David Kim',
    role: 'Director, Engineering',
    source: 'Hiring Manager Interview',
    tone: 'slate',
  },
  {
    quote: 'Excellent communicator who builds alignment across teams.',
    author: 'Priya Patel',
    role: 'Product Manager',
    source: 'Culture Interview',
    tone: 'violet',
  },
  {
    quote: 'Shows high potential to grow into a senior leadership role.',
    author: 'Sarah Johnson',
    role: 'Engineering Manager',
    source: 'Overall Feedback',
    tone: 'pink',
  },
]

const validationSummaryCards = [
  ['Overall Validation', 'Validated', 'Strong alignment across all data sources', 'shield', 'green', 'large'],
  ['AI Confidence', '97%', 'Very High', 'sparkles', 'green', 'metric'],
  ['Data Consistency', '92%', 'High', 'checkCircle', 'green', 'metric'],
  ['Contradictions', '0', 'None Detected', 'checkCircle', 'green', 'metric'],
  ['Bias Check', 'No Bias Detected', 'Evaluation is fair and balanced', 'scale', 'violet', 'text'],
]

const validationAnalyzed = [
  ['Interviews', '4', 'Interviews', 'users', 'violet'],
  ['Scorecards', '4', 'Scorecards', 'document', 'slate'],
  ['Assessments', '2', 'Assessments', 'shield', 'green'],
  ['Portfolio / Work', '3', 'Documents', 'copy', 'blue'],
  ['Notes & Feedback', '12', 'Notes', 'message', 'orange'],
  ['Resume', '1', 'Resume', 'document', 'slate'],
]

const validationBreakdown = [
  ['Interview Feedback', '48%', 'Consistency across 4 interviews', 'violet'],
  ['Assessments', '22%', 'Technical & behavioral assessments', 'blue'],
  ['Portfolio / Work', '15%', 'Projects and case studies', 'orange'],
  ['Notes & Feedback', '10%', 'Additional feedback & comments', 'pink'],
  ['Resume & Background', '5%', 'Experience and background match', 'green'],
]

const validationFindings = [
  ['Strong Alignment', 'All interviewers agree on key strengths: Leadership, Technical Depth, Ownership', 'checkCircle', 'green'],
  ['Evidence Quality', 'High quality evidence with specific examples and clear impact', 'copy', 'blue'],
  ['Consistency Check', 'No contradictions found across any data source', 'shield', 'green'],
  ['Bias Analysis', 'No signs of bias detected in the evaluation process', 'sparkles', 'violet'],
  ['Recommendation', 'AI strongly supports the decision to hire based on available evidence', 'thumbsUp', 'violet'],
]

const validationStrengths = [
  ['Leadership & Influence', 'Highly demonstrated ability to lead and inspire teams', 'Very Strong'],
  ['Technical Expertise', 'Deep technical knowledge and problem-solving skills', 'Very Strong'],
  ['Ownership & Execution', 'Takes full responsibility and delivers results', 'Very Strong'],
]

const activeReviewer = computed(() => (
  reviewers.find((reviewer) => reviewer.id === activeReviewerId.value) ?? reviewers[0]
))

const activeCompetency = computed(() => (
  competencyRows.find((item) => item.id === activeCompetencyId.value) ?? competencyRows[0]
))

const activeEvidenceCompetency = computed(() => (
  evidenceCompetencies.find((item) => {
    const normalized = item[0].toLowerCase()

    if (activeCompetencyId.value === 'technical') {
      return normalized === 'technical expertise'
    }

    if (activeCompetencyId.value === 'strategic') {
      return normalized === 'strategic thinking'
    }

    if (activeCompetencyId.value === 'problem-solving') {
      return normalized === 'problem solving'
    }

    if (activeCompetencyId.value === 'collaboration') {
      return normalized === 'team collaboration'
    }

    if (activeCompetencyId.value === 'ownership') {
      return normalized === 'ownership'
    }

    if (activeCompetencyId.value === 'leadership') {
      return normalized === 'leadership'
    }

    if (activeCompetencyId.value === 'communication') {
      return normalized === 'communication'
    }

    if (activeCompetencyId.value === 'adaptability') {
      return normalized === 'adaptability'
    }

    return false
  }) ?? evidenceCompetencies[0]
))

const evidenceGrowthSegments = computed(() => (
  buildLineSegments(evidenceGrowthPoints.map((item) => item[1]), 0, 60)
))

const timelineConfidenceSegments = computed(() => (
  buildLineSegments(timelineSteps.map((item) => item.confidence), 0, 100)
))

const competencyEvolutionSegments = computed(() => (
  buildLineSegments(competencyEvolutionPoints.map((item) => item[1]), 0, 5)
))

function starFill(totalScore, index) {
  return index < Math.floor(Number.parseFloat(totalScore))
}

function ringStyle(value, tone = 'violet') {
  const colorMap = {
    violet: '#7a52ff',
    pink: '#ff4da0',
    orange: '#ff8b1f',
    green: '#16b25e',
    blue: '#2878ff',
  }

  return {
    '--ring-angle': `${Math.max(0, Math.min(100, value)) * 3.6}deg`,
    '--ring-color': colorMap[tone] ?? colorMap.violet,
  }
}

function chartPointStyle(value, index, total, min, max) {
  const safeTotal = Math.max(1, total - 1)
  const left = (index / safeTotal) * 100
  const bottom = ((value - min) / (max - min || 1)) * 100

  return {
    left: `calc(${left}% - 6px)`,
    bottom: `calc(${bottom}% - 6px)`,
  }
}

function buildLineSegments(points, min, max) {
  const segments = []

  for (let index = 1; index < points.length; index += 1) {
    const previousX = ((index - 1) / Math.max(1, points.length - 1)) * 100
    const currentX = (index / Math.max(1, points.length - 1)) * 100
    const previousY = ((points[index - 1] - min) / (max - min || 1)) * 100
    const currentY = ((points[index] - min) / (max - min || 1)) * 100
    const deltaX = currentX - previousX
    const deltaY = currentY - previousY

    segments.push({
      left: `${previousX}%`,
      bottom: `${previousY}%`,
      width: `${Math.sqrt((deltaX ** 2) + (deltaY ** 2))}%`,
      angle: `${Math.atan2(deltaY, deltaX) * (180 / Math.PI)}deg`,
    })
  }

  return segments
}

function selectTab(tabId) {
  activeTab.value = tabId
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  if (isOpen) {
    previousBodyOverflow.value = document.body.style.overflow
    previousHtmlOverflow.value = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow.value
  document.documentElement.style.overflow = previousHtmlOverflow.value
}

function closeOverlay() {
  emit('close')
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      activeReviewerId.value = 'sarah'
      activeTab.value = 'overview'
      activeCompetencyId.value = 'leadership'
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="final-feedback-overlay" @click.self="closeOverlay">
      <section class="final-feedback-modal">
        <header class="final-feedback-header">
          <div class="final-feedback-header__title">
            <span class="final-feedback-header__icon">
              <AppIcon name="sparkles" :size="22" />
            </span>

            <div>
              <div class="final-feedback-header__row">
                <h2>Final Feedback Review</h2>
                <span>AI Summary</span>
              </div>
              <p>Validation Stage <i>&bull;</i> Decide Next Action</p>
            </div>
          </div>

          <div class="final-feedback-header__actions">
            <button type="button">
              <AppIcon name="document" :size="15" />
              <span>Download Summary</span>
            </button>
            <button class="is-close" type="button" aria-label="Close final feedback review" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="final-feedback-body">
          <div class="final-feedback-layout" :class="{ 'is-validation-active': activeTab === 'validation' }">
            <aside class="final-feedback-side">
              <section class="recommendation-card">
                <div class="recommendation-card__hero">
                  <span class="recommendation-card__badge">
                    <AppIcon name="checkCircle" :size="30" />
                  </span>

                  <div class="recommendation-card__copy">
                    <small>Recommendation</small>
                    <h3>Proceed to Offer</h3>
                    <p>AI confidence this candidate is ready for the next stage</p>
                  </div>

                  <div class="recommendation-card__confidence">
                    <small>AI Confidence</small>
                    <strong>93%</strong>
                    <span>Very High</span>
                    <div class="recommendation-card__bars" aria-hidden="true">
                      <i class="is-filled" />
                      <i class="is-filled" />
                      <i class="is-filled" />
                      <i class="is-filled" />
                      <i />
                    </div>
                  </div>
                </div>

                <div class="recommendation-card__stats">
                  <article>
                    <small>Final Evaluations</small>
                    <strong>4 / 4</strong>
                    <span>Completed</span>
                  </article>
                  <article>
                    <small>Team Consensus</small>
                    <strong>Very High</strong>
                    <span>(94%)</span>
                  </article>
                  <article>
                    <small>Average Rating</small>
                    <strong>4.7 / 5</strong>
                    <span>Excellent</span>
                  </article>
                  <article>
                    <small>Team Recommendation</small>
                    <strong>Hire</strong>
                    <span>Move to Offer</span>
                  </article>
                  <article>
                    <small>Red Flags</small>
                    <strong>None</strong>
                    <span>identified</span>
                  </article>
                </div>
              </section>

              <section class="reviewer-list-card">
                <div class="reviewer-list-card__head">
                  <h3>Individual Interview Feedback (4)</h3>
                </div>

                <div class="reviewer-list">
                  <button
                    v-for="reviewer in reviewers"
                    :key="reviewer.id"
                    type="button"
                    class="reviewer-list__item"
                    :class="{ 'is-active': reviewer.id === activeReviewer.id }"
                    @click="activeReviewerId = reviewer.id"
                  >
                    <span class="reviewer-list__avatar">{{ reviewer.name.split(' ').map((part) => part[0]).join('').slice(0, 2) }}</span>
                    <div class="reviewer-list__copy">
                      <strong>{{ reviewer.name }}</strong>
                      <small>{{ reviewer.role }}</small>
                      <span>{{ reviewer.interviewDate }}</span>
                    </div>
                    <div class="reviewer-list__score">
                      <em>{{ reviewer.score }}</em>
                      <span>{{ reviewer.recommendation }}</span>
                    </div>
                    <span class="reviewer-list__arrow">
                      <AppIcon name="chevronRight" :size="16" />
                    </span>
                  </button>
                </div>

                <button class="reviewer-list-card__compare" type="button">
                  <AppIcon name="chart-bars" :size="16" />
                  <span>Compare all reviewers</span>
                </button>
              </section>
            </aside>

            <section class="final-feedback-main">
              <section class="reviewer-summary-card">
                <div class="reviewer-summary-card__head">
                  <div class="reviewer-summary-card__identity">
                    <button class="reviewer-summary-card__back" type="button">
                      <AppIcon name="chevronLeft" :size="16" />
                    </button>
                    <span class="reviewer-summary-card__avatar">{{ activeReviewer.name.split(' ').map((part) => part[0]).join('').slice(0, 2) }}</span>
                    <div class="reviewer-summary-card__copy">
                      <div class="reviewer-summary-card__name-row">
                        <h3>{{ activeReviewer.name }}</h3>
                        <span>Completed</span>
                      </div>
                      <p>{{ activeReviewer.role }} <i>&bull;</i> {{ activeReviewer.interviewDate }}</p>
                    </div>
                  </div>

                  <div class="reviewer-summary-card__actions">
                    <button type="button"><AppIcon name="message" :size="15" /> <span>Reply</span></button>
                    <button type="button"><AppIcon name="search" :size="15" /> <span>Mention</span></button>
                    <button type="button"><AppIcon name="share" :size="15" /> <span>Share</span></button>
                    <button type="button" class="is-icon"><AppIcon name="more" :size="15" /></button>
                  </div>
                </div>

                <div class="reviewer-summary-grid">
                  <article class="summary-kpi-card">
                    <small>Recommendation</small>
                    <strong>Hire</strong>
                    <span>Strongly recommended</span>
                    <div class="summary-kpi-card__confidence">
                      <small>Confidence</small>
                      <strong>97%</strong>
                      <span>Very High</span>
                    </div>
                  </article>

                  <article class="summary-copy-card">
                    <small>Summary</small>
                    <p>{{ activeReviewer.summary }}</p>
                  </article>

                  <article class="summary-tags-card">
                    <small>Key Strengths</small>
                    <div class="summary-tags-card__list">
                      <span v-for="item in activeReviewer.strengths" :key="item">{{ item }}</span>
                    </div>
                  </article>
                </div>

                <div class="reviewer-summary-tabs">
                  <button
                    v-for="tab in tabs"
                    :key="tab[0]"
                    type="button"
                    :class="{ 'is-active': activeTab === tab[0] }"
                    @click="selectTab(tab[0])"
                  >
                    {{ tab[1] }}
                  </button>
                </div>

                <div v-if="activeTab === 'overview'" class="reviewer-content-grid">
                  <section class="content-panel competency-panel">
                    <h4>Competency Validation</h4>
                    <div class="competency-list">
                      <article v-for="row in competencyRows" :key="row[0]">
                        <div class="competency-list__label">
                          <AppIcon name="checkCircle" :size="14" />
                          <span>{{ row[0] }}</span>
                        </div>
                        <div class="competency-list__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                        <strong>{{ row[1] }}</strong>
                        <div class="competency-list__bar"><i :style="{ width: row[2] }" /></div>
                      </article>
                    </div>

                    <div class="competency-panel__legend">
                      <span><i class="is-green" /> Excellent (4.5 - 5)</span>
                      <span><i class="is-blue" /> Good (3.5 - 4.4)</span>
                      <span><i class="is-orange" /> Needs Improvement (&lt; 3.5)</span>
                    </div>
                  </section>

                  <section class="content-panel strengths-panel">
                    <div class="two-column-panels">
                      <article>
                        <h4>Strengths</h4>
                        <div class="check-list">
                          <p>Exceptional leadership presence and team influence</p>
                          <p>Strong product sense and customer focus</p>
                          <p>Communicates clearly and inspires confidence</p>
                          <p>Demonstrates ownership and accountability</p>
                        </div>
                      </article>

                      <article>
                        <h4 class="is-warning">Areas To Consider</h4>
                        <div class="warning-list">
                          <p v-for="item in activeReviewer.areas" :key="item">{{ item }}</p>
                        </div>

                        <div class="overall-rating-box">
                          <small>Overall Rating</small>
                          <div>
                            <span>&#9733; 5 / 5</span>
                            <strong>Excellent</strong>
                          </div>
                        </div>
                      </article>
                    </div>
                  </section>

                  <section class="content-panel evidence-panel">
                    <div class="content-panel__head">
                      <h4>Evidence Snapshot</h4>
                    </div>
                    <div class="evidence-grid">
                      <article v-for="item in evidenceCards" :key="item[0]">
                        <span :class="`is-${item[3]}`"><AppIcon :name="item[2]" :size="14" /></span>
                        <strong>{{ item[0] }}</strong>
                        <small>{{ item[1] }}</small>
                      </article>
                    </div>
                  </section>

                  <section class="content-panel quotes-panel">
                    <div class="content-panel__head">
                      <h4>Quoted Highlights</h4>
                      <button type="button">View all (6)</button>
                    </div>
                    <div class="quotes-grid">
                      <article v-for="item in quotedHighlights" :key="item[0]">
                        <strong>{{ item[0] }}</strong>
                        <small>{{ item[1] }}</small>
                        <p>{{ item[2] }}</p>
                      </article>
                    </div>
                  </section>
                </div>

                <div v-else-if="activeTab === 'competencies'" class="competencies-view">
                  <div class="competencies-view__head">
                    <div>
                      <h4>Competency Validation</h4>
                      <p>Assessment of key competencies based on interview feedback, evidence and AI analysis.</p>
                    </div>

                    <button type="button">
                      <AppIcon name="sparkles" :size="14" />
                      <span>View competency framework</span>
                    </button>
                  </div>

                  <div class="competencies-view__layout">
                    <section class="competencies-table">
                      <div class="competencies-table__header">
                        <span>Competency</span>
                        <span>Score</span>
                        <span>Trend</span>
                        <span>Evidence Strength</span>
                        <span>Key Evidence</span>
                        <span />
                      </div>

                      <button
                        v-for="item in competencyRows"
                        :key="item.id"
                        type="button"
                        class="competencies-table__row"
                        :class="{ 'is-active': item.id === activeCompetency.id }"
                        @click="activeCompetencyId = item.id"
                      >
                        <div class="competencies-table__competency">
                          <span class="competencies-table__competency-icon">
                            <AppIcon name="checkCircle" :size="14" />
                          </span>
                          <div>
                            <strong>{{ item.label }}</strong>
                            <small>{{ item.description }}</small>
                          </div>
                        </div>

                        <div class="competencies-table__score">
                          <span>{{ item.stars }}</span>
                          <strong>{{ item.score }}</strong>
                        </div>

                        <div class="competencies-table__trend" :class="`is-${item.evidenceTone}`">
                          <AppIcon :name="item.trendIcon" :size="14" />
                          <span>{{ item.trend }}</span>
                        </div>

                        <div class="competencies-table__evidence">
                          <div class="competencies-table__evidence-bar">
                            <i :class="`is-${item.evidenceTone}`" :style="{ width: item.evidenceBar }" />
                          </div>
                          <small :class="`is-${item.evidenceTone}`">{{ item.evidenceStrength }}</small>
                        </div>

                        <div class="competencies-table__icons">
                          <span
                            v-for="evidence in item.keyEvidence"
                            :key="`${item.id}-${evidence[0]}-${evidence[1]}`"
                            :class="`is-${evidence[1]}`"
                          >
                            <AppIcon :name="evidence[0]" :size="12" />
                          </span>
                        </div>

                        <span class="competencies-table__chevron">
                          <AppIcon name="chevronDown" :size="14" />
                        </span>
                      </button>

                      <div class="competencies-table__legend">
                        <span><i class="is-green" /> Excellent (4.5 - 5)</span>
                        <span><i class="is-blue" /> Good (3.5 - 4.4)</span>
                        <span><i class="is-orange" /> Needs Improvement (&lt; 3.5)</span>
                      </div>
                    </section>

                    <aside class="competencies-detail-card">
                      <div class="competencies-detail-card__head">
                        <h4>{{ activeCompetency.label }}</h4>
                        <button type="button" aria-label="Close competency detail">
                          <AppIcon name="close" :size="14" />
                        </button>
                      </div>

                      <div class="competencies-detail-card__meta">
                        <div>
                          <small>Score</small>
                          <div class="competencies-detail-card__score">
                            <span>{{ activeCompetency.stars }}</span>
                            <strong>{{ activeCompetency.score }}</strong>
                          </div>
                        </div>

                        <div>
                          <small>Evidence Strength</small>
                          <strong :class="`is-${activeCompetency.evidenceTone}`">{{ activeCompetency.evidenceStrength }}</strong>
                        </div>
                      </div>

                      <div class="competencies-detail-card__section">
                        <small>Why this score?</small>
                        <p>{{ activeCompetency.why }}</p>
                      </div>

                      <div class="competencies-detail-card__section">
                        <small>Top Evidence</small>
                        <div class="competencies-detail-card__evidence-list">
                          <article v-for="evidence in activeCompetency.topEvidence" :key="evidence[0]">
                            <span :class="`is-${evidence[3]}`">
                              <AppIcon :name="evidence[2]" :size="13" />
                            </span>
                            <div>
                              <strong>{{ evidence[0] }}</strong>
                              <p>{{ evidence[1] }}</p>
                            </div>
                          </article>
                        </div>
                      </div>

                      <button class="competencies-detail-card__cta" type="button">
                        View all 5 pieces of evidence
                      </button>
                    </aside>
                  </div>
                </div>

                <div v-else-if="activeTab === 'evidence'" class="evidence-view">
                  <div class="evidence-view__head">
                    <div>
                      <h4>Evidence Overview</h4>
                      <p>All key evidence collected across interviews, assessments and feedback.</p>
                    </div>
                  </div>

                  <div class="evidence-view__stats">
                    <article
                      v-for="item in evidenceStats"
                      :key="item[0]"
                      class="evidence-stat-card"
                    >
                      <span class="evidence-stat-card__label">{{ item[0] }}</span>
                      <div class="evidence-stat-card__value">
                        <span :class="`is-${item[4]}`">
                          <AppIcon :name="item[3]" :size="15" />
                        </span>
                        <strong>{{ item[1] }}</strong>
                      </div>
                      <small>{{ item[2] }}</small>
                    </article>
                  </div>

                  <div class="evidence-view__layout">
                    <section class="evidence-competencies">
                      <div class="evidence-competencies__head">
                        <h5>By Competency</h5>
                      </div>

                      <div class="evidence-competencies__list">
                        <button
                          v-for="item in evidenceCompetencies"
                          :key="item[0]"
                          type="button"
                          :class="{ 'is-active': item[0] === activeEvidenceCompetency[0] }"
                          @click="activeCompetencyId = item[0] === 'Technical Expertise'
                            ? 'technical'
                            : item[0] === 'Strategic Thinking'
                              ? 'strategic'
                              : item[0] === 'Problem Solving'
                                ? 'problem-solving'
                                : item[0] === 'Team Collaboration'
                                  ? 'collaboration'
                                  : item[0] === 'Ownership'
                                    ? 'ownership'
                                    : item[0] === 'Adaptability'
                                      ? 'adaptability'
                                      : item[0].toLowerCase()"
                        >
                          <div>
                            <strong>{{ item[0] }}</strong>
                            <small>{{ item[1] }}</small>
                          </div>
                          <span>{{ item[2] }}</span>
                        </button>
                      </div>

                      <button class="evidence-competencies__cta" type="button">
                        View all competencies
                      </button>
                    </section>

                    <section class="evidence-stream">
                      <div class="evidence-stream__summary">
                        <div>
                          <h4>{{ activeEvidenceCompetency[0] }}</h4>
                          <p>{{ activeCompetency.description }}</p>
                        </div>

                        <div class="evidence-stream__score-card">
                          <small>Score</small>
                          <strong>{{ activeEvidenceCompetency[1] }} / 5</strong>
                          <span>Confidence 97%</span>
                        </div>
                      </div>

                      <div class="evidence-stream__tabs">
                        <button class="is-active" type="button">
                          Human Evidence (17)
                        </button>
                        <button type="button">
                          AI Evidence &amp; Insights (7)
                        </button>
                      </div>

                      <div class="evidence-stream__list">
                        <article
                          v-for="item in evidenceFeed"
                          :key="`${item.title}-${item.source}`"
                          class="evidence-stream__item"
                        >
                          <div class="evidence-stream__item-main">
                            <span :class="['evidence-stream__icon', `is-${item.iconTone}`]">
                              <AppIcon :name="item.icon" :size="14" />
                            </span>

                            <div class="evidence-stream__copy">
                              <div class="evidence-stream__meta">
                                <strong>{{ item.title }}</strong>
                                <small>{{ item.source }}</small>
                              </div>

                              <p>{{ item.body }}</p>

                              <div class="evidence-stream__submeta">
                                <span v-if="item.author">{{ item.author }}</span>
                                <span>{{ item.date }}</span>
                              </div>
                            </div>
                          </div>

                          <div class="evidence-stream__support">
                            <span>{{ item.support }}</span>
                            <div class="evidence-stream__rating">
                              <i
                                v-for="index in 5"
                                :key="index"
                                :class="{ 'is-filled': starFill(item.score, index - 1) }"
                              />
                              <strong>{{ item.score }}</strong>
                            </div>
                          </div>
                        </article>
                      </div>

                      <button class="evidence-stream__cta" type="button">
                        Load more evidence
                      </button>
                    </section>

                    <aside class="evidence-inspector">
                      <div class="evidence-inspector__head">
                        <h4>Evidence Inspector</h4>
                        <button type="button" aria-label="Close evidence inspector">
                          <AppIcon name="close" :size="14" />
                        </button>
                      </div>

                      <div class="evidence-inspector__type">
                        <span class="is-violet">
                          <AppIcon name="sparkles" :size="14" />
                        </span>
                        <div>
                          <strong>Interview Quote</strong>
                          <small>Round 2 - Technical Interview</small>
                        </div>
                        <em>Validated</em>
                      </div>

                      <div class="evidence-inspector__section">
                        <small>Evidence Details</small>

                        <dl class="evidence-inspector__details">
                          <div><dt>Category</dt><dd>Interview Quote</dd></div>
                          <div><dt>Source</dt><dd>James Lee</dd></div>
                          <div><dt>Date</dt><dd>Apr 14, 2025</dd></div>
                          <div><dt>Confidence</dt><dd>98%</dd></div>
                        </dl>
                      </div>

                      <div class="evidence-inspector__section">
                        <small>Related Competencies</small>
                        <div class="evidence-inspector__tags">
                          <span>Leadership</span>
                          <span>Ownership</span>
                          <span>Communication</span>
                        </div>
                      </div>

                      <div class="evidence-inspector__section">
                        <small>Tags</small>
                        <div class="evidence-inspector__tags">
                          <span>Team Building</span>
                          <span>Mentoring</span>
                          <span>Execution</span>
                        </div>
                      </div>

                      <div class="evidence-inspector__section">
                        <small>Why this evidence matters</small>
                        <p>{{ activeCompetency.why }}</p>
                      </div>

                      <div class="evidence-inspector__section">
                        <small>Related Evidence</small>
                        <div class="evidence-inspector__related">
                          <article>
                            <span class="is-green"><AppIcon name="document" :size="13" /></span>
                            <div>
                              <strong>Leadership Assessment</strong>
                              <p>Score: 91 / 100</p>
                            </div>
                          </article>

                          <article>
                            <span class="is-orange"><AppIcon name="document" :size="13" /></span>
                            <div>
                              <strong>Hiring Manager Feedback</strong>
                              <p>Excellent executive presence...</p>
                            </div>
                          </article>

                          <article>
                            <span class="is-violet"><AppIcon name="document" :size="13" /></span>
                            <div>
                              <strong>Portfolio / Case Study</strong>
                              <p>Led platform redesign...</p>
                            </div>
                          </article>
                        </div>
                      </div>

                      <button class="evidence-inspector__cta" type="button">
                        View full context
                      </button>
                    </aside>
                  </div>
                </div>

                <div v-else-if="activeTab === 'timeline'" class="timeline-view">
                  <div class="timeline-view__head">
                    <div>
                      <h4>Decision Journey</h4>
                      <p>Track how confidence and evidence evolved throughout the hiring process.</p>
                    </div>

                    <button type="button">
                      <AppIcon name="play" :size="14" />
                      <span>Replay Journey</span>
                    </button>
                  </div>

                  <div class="timeline-view__layout">
                    <section class="timeline-journey">
                      <div class="timeline-journey__header">
                        <span>Step</span>
                        <span>Confidence</span>
                        <span>Evidence Added</span>
                        <span>AI Insight</span>
                        <span>Date</span>
                      </div>

                      <article
                        v-for="step in timelineSteps"
                        :key="step.title"
                        class="timeline-journey__row"
                      >
                        <div class="timeline-journey__step">
                          <span :class="`is-${step.tone}`">
                            <AppIcon :name="step.icon" :size="16" />
                          </span>
                          <div>
                            <strong>{{ step.title }}</strong>
                            <small>{{ step.subtitle }}</small>
                          </div>
                        </div>

                        <div class="timeline-journey__confidence">
                          <div class="timeline-journey__ring" :style="ringStyle(step.confidence, step.tone)">
                            <div>{{ step.confidence }}%</div>
                          </div>
                        </div>

                        <ul class="timeline-journey__evidence">
                          <li v-for="item in step.evidenceAdded" :key="`${step.title}-${item}`">
                            {{ item }}
                          </li>
                        </ul>

                        <div class="timeline-journey__insight" :class="`is-${step.insightTone}`">
                          {{ step.insight }}
                        </div>

                        <div class="timeline-journey__date">
                          <span>{{ step.date }}</span>
                          <AppIcon name="chevronDown" :size="14" />
                        </div>
                      </article>

                      <section class="timeline-chart-card">
                        <div class="timeline-chart-card__head">
                          <h5>Confidence Over Time</h5>
                        </div>

                        <div class="timeline-line-chart-shell">
                          <div class="timeline-line-chart__axis">
                            <span v-for="label in confidenceAxisLabels" :key="label">{{ label }}</span>
                          </div>

                          <div class="timeline-line-chart">
                            <div class="timeline-line-chart__grid" />

                            <span
                              v-for="segment in timelineConfidenceSegments"
                              :key="`confidence-${segment.left}-${segment.angle}`"
                              class="timeline-line-chart__segment"
                              :style="{
                                left: segment.left,
                                bottom: segment.bottom,
                                width: segment.width,
                                transform: `rotate(${segment.angle})`,
                              }"
                            />

                            <div
                              v-for="(step, index) in timelineSteps"
                              :key="`confidence-point-${step.title}`"
                              class="timeline-line-chart__point is-violet"
                              :style="chartPointStyle(step.confidence, index, timelineSteps.length, 0, 100)"
                            >
                              <em>{{ step.confidence }}%</em>
                            </div>
                          </div>
                        </div>

                        <div class="timeline-line-chart__labels">
                          <span v-for="step in timelineSteps" :key="`label-${step.title}`">
                            <strong>{{ step.shortLabel }}</strong>
                            <small>{{ step.date }}</small>
                          </span>
                        </div>
                      </section>
                    </section>

                    <aside class="timeline-sidebar">
                      <section class="timeline-sidebar__card">
                        <h5>Journey Summary</h5>
                        <div class="timeline-sidebar__stats">
                          <div><span>Total Steps</span><strong>7</strong></div>
                          <div><span>Total Evidence Points</span><strong>84</strong></div>
                          <div><span>Average Confidence</span><strong>93%</strong></div>
                          <div><span>Trend</span><strong class="is-green">Increasing</strong></div>
                        </div>
                      </section>

                      <section class="timeline-sidebar__card">
                        <h5>Evidence Growth</h5>
                        <div class="timeline-mini-chart is-green">
                          <div class="timeline-mini-chart__grid" />

                          <span
                            v-for="segment in evidenceGrowthSegments"
                            :key="`growth-${segment.left}-${segment.angle}`"
                            class="timeline-mini-chart__segment"
                            :style="{
                              left: segment.left,
                              bottom: segment.bottom,
                              width: segment.width,
                              transform: `rotate(${segment.angle})`,
                            }"
                          />

                          <div
                            v-for="(point, index) in evidenceGrowthPoints"
                            :key="`growth-point-${point[0]}`"
                            class="timeline-mini-chart__point"
                            :style="chartPointStyle(point[1], index, evidenceGrowthPoints.length, 0, 60)"
                          >
                            <em>{{ point[1] }}</em>
                          </div>
                        </div>

                        <div class="timeline-mini-chart__labels timeline-mini-chart__labels--growth">
                          <span v-for="point in evidenceGrowthPoints" :key="`growth-label-${point[0]}`">
                            {{ point[0] }}
                          </span>
                        </div>
                      </section>

                      <section class="timeline-sidebar__card">
                        <div class="timeline-sidebar__card-head">
                          <h5>Competency Evolution</h5>
                          <button type="button">
                            Leadership
                            <AppIcon name="chevronDown" :size="12" />
                          </button>
                        </div>

                        <div class="timeline-mini-chart is-violet">
                          <div class="timeline-mini-chart__grid" />

                          <span
                            v-for="segment in competencyEvolutionSegments"
                            :key="`competency-${segment.left}-${segment.angle}`"
                            class="timeline-mini-chart__segment"
                            :style="{
                              left: segment.left,
                              bottom: segment.bottom,
                              width: segment.width,
                              transform: `rotate(${segment.angle})`,
                            }"
                          />

                          <div
                            v-for="(point, index) in competencyEvolutionPoints"
                            :key="`competency-point-${point[0]}`"
                            class="timeline-mini-chart__point"
                            :style="chartPointStyle(point[1], index, competencyEvolutionPoints.length, 0, 5)"
                          >
                            <em>{{ point[1] }}</em>
                          </div>
                        </div>

                        <div class="timeline-mini-chart__labels timeline-mini-chart__labels--competency">
                          <span v-for="point in competencyEvolutionPoints" :key="`competency-label-${point[0]}`">
                            {{ point[0] }}
                          </span>
                        </div>
                      </section>

                      <section class="timeline-sidebar__card">
                        <h5>Key Insights</h5>
                        <div class="timeline-insights">
                          <article v-for="item in timelineInsights" :key="item[1]">
                            <span :class="`is-${item[0]}`">
                              <AppIcon :name="item[0] === 'green' ? 'checkCircle' : item[0] === 'blue' ? 'sparkles' : 'alert'" :size="14" />
                            </span>
                            <p>{{ item[1] }}</p>
                          </article>
                        </div>
                      </section>
                    </aside>
                  </div>
                </div>

                <div v-else-if="activeTab === 'validation'" class="validation-view">
                  <div class="validation-view__head">
                    <div>
                      <h4>AI Validation Summary</h4>
                      <p>AI has analyzed all available data to validate feedback consistency and provide an unbiased evaluation.</p>
                    </div>

                    <button type="button">
                      <AppIcon name="info" :size="14" />
                      <span>How AI Validates</span>
                    </button>
                  </div>

                  <div class="validation-view__layout">
                    <section class="validation-main">
                      <div class="validation-summary-grid">
                        <article
                          v-for="item in validationSummaryCards"
                          :key="item[0]"
                          class="validation-summary-card"
                          :class="[`is-${item[5]}`, `tone-${item[4]}`]"
                        >
                          <small>{{ item[0] }}</small>
                          <div class="validation-summary-card__content">
                            <span><AppIcon :name="item[3]" :size="16" /></span>
                            <div>
                              <strong>{{ item[1] }}</strong>
                              <p>{{ item[2] }}</p>
                            </div>
                          </div>
                          <div v-if="item[5] === 'metric'" class="validation-summary-card__bar">
                            <i :class="`is-${item[4]}`" />
                            <i :class="`is-${item[4]}`" />
                            <i :class="`is-${item[4]}`" />
                            <i :class="`is-${item[4]}`" />
                            <i :class="`is-${item[4]}`" />
                          </div>
                        </article>
                      </div>

                      <section class="validation-analyzed">
                        <div class="validation-section__head">
                          <div>
                            <h5>What AI Analyzed</h5>
                            <p>Total 53 data points analyzed</p>
                          </div>
                        </div>

                        <div class="validation-analyzed__grid">
                          <article v-for="item in validationAnalyzed" :key="item[0]">
                            <span :class="`is-${item[4]}`"><AppIcon :name="item[3]" :size="14" /></span>
                            <strong>{{ item[1] }}</strong>
                            <small>{{ item[2] }}</small>
                          </article>
                        </div>
                      </section>

                      <div class="validation-bottom-grid">
                        <section class="validation-breakdown">
                          <div class="validation-section__head">
                            <div>
                              <h5>AI Validation Breakdown</h5>
                              <p>How AI reached its conclusion</p>
                            </div>
                          </div>

                          <div class="validation-breakdown__content">
                            <div class="validation-donut">
                              <div class="validation-donut__ring">
                                <div>
                                  <strong>97%</strong>
                                  <span>AI Confidence</span>
                                </div>
                              </div>
                            </div>

                            <div class="validation-breakdown__legend">
                              <article v-for="item in validationBreakdown" :key="item[0]">
                                <span :class="`is-${item[3]}`" />
                                <div>
                                  <strong>{{ item[0] }}</strong>
                                  <small>{{ item[2] }}</small>
                                </div>
                                <em>{{ item[1] }}</em>
                              </article>
                            </div>
                          </div>
                        </section>

                        <section class="validation-findings">
                          <div class="validation-section__head">
                            <div>
                              <h5>AI Findings</h5>
                            </div>
                          </div>

                          <div class="validation-findings__list">
                            <article v-for="item in validationFindings" :key="item[0]">
                              <span :class="`is-${item[3]}`">
                                <AppIcon :name="item[2]" :size="14" />
                              </span>
                              <div>
                                <strong>{{ item[0] }}</strong>
                                <p>{{ item[1] }}</p>
                              </div>
                            </article>
                          </div>
                        </section>
                      </div>

                      <section class="validation-summary-note">
                        <span><AppIcon name="sparkles" :size="14" /></span>
                        <div>
                          <strong>AI Summary</strong>
                          <p>Sarah consistently demonstrates exceptional leadership, strong technical expertise, and ownership. All data sources align with no contradictions detected. She is a strong fit for the role and the team.</p>
                        </div>
                      </section>
                    </section>

                    <aside class="validation-sidebar">
                      <section class="validation-sidebar__card">
                        <h5>Confidence Over Time</h5>
                        <p>AI confidence progression throughout the process</p>

                        <div class="timeline-mini-chart is-violet">
                          <div class="timeline-mini-chart__grid" />

                          <span
                            v-for="segment in timelineConfidenceSegments"
                            :key="`validation-confidence-${segment.left}-${segment.angle}`"
                            class="timeline-mini-chart__segment"
                            :style="{
                              left: segment.left,
                              bottom: segment.bottom,
                              width: segment.width,
                              transform: `rotate(${segment.angle})`,
                            }"
                          />

                          <div
                            v-for="(step, index) in timelineSteps"
                            :key="`validation-point-${step.title}`"
                            class="timeline-mini-chart__point"
                            :style="chartPointStyle(step.confidence, index, timelineSteps.length, 0, 100)"
                          >
                            <em>{{ step.confidence }}%</em>
                          </div>
                        </div>

                        <div class="timeline-mini-chart__labels timeline-mini-chart__labels--validation">
                          <span v-for="(label, index) in validationChartLabels" :key="`validation-label-${label}`">
                            {{ label }}
                          </span>
                        </div>
                      </section>

                      <section class="validation-sidebar__card">
                        <h5>Top Strengths (AI Identified)</h5>
                        <div class="validation-strengths">
                          <article v-for="item in validationStrengths" :key="item[0]">
                            <span><AppIcon name="shield" :size="14" /></span>
                            <div>
                              <strong>{{ item[0] }}</strong>
                              <p>{{ item[1] }}</p>
                            </div>
                            <em>{{ item[2] }}</em>
                          </article>
                        </div>
                      </section>

                      <section class="validation-sidebar__card">
                        <h5>Attention Areas</h5>
                        <div class="validation-attention">
                          <article>
                            <span><AppIcon name="alert" :size="14" /></span>
                            <div>
                              <strong>Enterprise Scale Experience</strong>
                              <p>Limited exposure to organizations larger than 500 employees</p>
                            </div>
                            <em>Minor</em>
                          </article>
                        </div>
                      </section>

                      <section class="validation-sidebar__card">
                        <h5>View AI Reasoning Details</h5>
                        <p>See full AI analysis, reasoning and supporting evidence for this validation.</p>
                        <button class="validation-sidebar__cta" type="button">
                          <span>View Full Analysis</span>
                          <AppIcon name="chevronRight" :size="14" />
                        </button>
                      </section>
                    </aside>
                  </div>
                </div>

                <div v-else-if="activeTab === 'notes'" class="notes-view">
                  <div class="notes-view__layout">
                    <section class="notes-main">
                      <div class="notes-main__head">
                        <div>
                          <div class="notes-main__title">
                            <span><AppIcon name="document" :size="14" /></span>
                            <h4>Notes</h4>
                          </div>
                          <p>All notes and feedback from interviewers and collaborators.</p>
                        </div>

                        <div class="notes-main__actions">
                          <button type="button">
                            <AppIcon name="plus" :size="14" />
                            <span>Add Note</span>
                          </button>

                          <label class="notes-main__search">
                            <AppIcon name="search" :size="14" />
                            <input type="text" value="Search notes..." readonly>
                          </label>

                          <button type="button" class="notes-main__select">
                            <span>All Notes</span>
                            <AppIcon name="chevronDown" :size="12" />
                          </button>
                        </div>
                      </div>

                      <div class="notes-main__chips">
                        <button
                          v-for="item in noteChips"
                          :key="item[0]"
                          type="button"
                          :class="{ 'is-active': item[2] }"
                        >
                          {{ item[0] }} ({{ item[1] }})
                        </button>
                      </div>

                      <div class="notes-feed">
                        <article v-for="item in noteEntries" :key="`${item.author}-${item.date}`" class="notes-feed__item">
                          <div class="notes-feed__meta">
                            <div class="notes-feed__author">
                              <span :class="`is-${item.tone}`">{{ item.author.slice(0, 2).toUpperCase() }}</span>
                              <div>
                                <strong>{{ item.author }}</strong>
                                <small>{{ item.role }}</small>
                                <em>{{ item.date }} • {{ item.source }}</em>
                              </div>
                            </div>

                            <div class="notes-feed__actions">
                              <b :class="`is-${item.tone}`">{{ item.tag }}</b>
                              <strong v-if="item.score">{{ item.score }}</strong>
                              <button type="button"><AppIcon name="heart" :size="14" /></button>
                              <button type="button"><AppIcon name="more" :size="14" /></button>
                            </div>
                          </div>

                          <div class="notes-feed__bubble" :class="`is-${item.tone}`">
                            {{ item.text }}
                          </div>
                        </article>
                      </div>

                      <div class="notes-main__show-more">
                        <button type="button">
                          <span>Show more notes (8)</span>
                          <AppIcon name="chevronDown" :size="12" />
                        </button>
                      </div>

                      <section class="quotes-section">
                        <div class="quotes-section__head">
                          <div>
                            <div class="quotes-section__title">
                              <span><AppIcon name="message" :size="14" /></span>
                              <h4>Quotes</h4>
                            </div>
                            <p>Key quotes from interviews that highlight candidate strengths.</p>
                          </div>

                          <button type="button">View all quotes</button>
                        </div>

                        <div class="quotes-carousel">
                          <button type="button" class="quotes-carousel__arrow is-left" aria-label="Previous quotes">
                            <AppIcon name="chevronLeft" :size="14" />
                          </button>

                          <article
                            v-for="item in quoteCards"
                            :key="`${item.author}-${item.quote}`"
                            class="quotes-carousel__card"
                          >
                            <span :class="`is-${item.tone}`">
                              <AppIcon name="message" :size="14" />
                            </span>
                            <blockquote>{{ item.quote }}</blockquote>
                            <div class="quotes-carousel__stars">★★★★★</div>
                            <div class="quotes-carousel__author">
                              <i :class="`is-${item.tone}`">{{ item.author.slice(0, 2).toUpperCase() }}</i>
                              <div>
                                <strong>{{ item.author }}</strong>
                                <small>{{ item.role }}</small>
                                <em>{{ item.source }}</em>
                              </div>
                            </div>
                          </article>

                          <button type="button" class="quotes-carousel__arrow is-right" aria-label="Next quotes">
                            <AppIcon name="chevronRight" :size="14" />
                          </button>
                        </div>
                      </section>
                    </section>

                    <aside class="notes-sidebar">
                      <section class="notes-sidebar__card">
                        <h5>Highlights</h5>
                        <div class="notes-sidebar__list">
                          <article v-for="item in noteHighlights" :key="item[1]">
                            <span :class="`is-${item[0]}`">
                              <AppIcon :name="item[0] === 'blue' ? 'info' : 'checkCircle'" :size="14" />
                            </span>
                            <p>{{ item[1] }}</p>
                          </article>
                        </div>
                      </section>

                      <section class="notes-sidebar__card">
                        <div class="notes-sidebar__title">
                          <span><AppIcon name="chart-bars" :size="14" /></span>
                          <h5>Note Activity</h5>
                        </div>

                        <div class="notes-sidebar__stats">
                          <div v-for="item in noteActivity" :key="item[0]">
                            <span>{{ item[0] }}</span>
                            <strong>{{ item[1] }}</strong>
                          </div>
                        </div>

                        <div class="notes-sidebar__updated">
                          <span>Last Updated</span>
                          <strong>Apr 22, 2025</strong>
                        </div>
                      </section>

                      <section class="notes-sidebar__card">
                        <div class="notes-sidebar__title">
                          <span><AppIcon name="filter" :size="14" /></span>
                          <h5>Filter Notes</h5>
                          <button type="button">Clear</button>
                        </div>

                        <div class="notes-sidebar__filters">
                          <label>
                            <span>By Competency</span>
                            <button type="button">
                              <strong>All Competencies</strong>
                              <AppIcon name="chevronDown" :size="12" />
                            </button>
                          </label>

                          <label>
                            <span>By Source</span>
                            <button type="button">
                              <strong>All Sources</strong>
                              <AppIcon name="chevronDown" :size="12" />
                            </button>
                          </label>

                          <label>
                            <span>By Sentiment</span>
                            <button type="button">
                              <strong>All Sentiments</strong>
                              <AppIcon name="chevronDown" :size="12" />
                            </button>
                          </label>

                          <label class="notes-sidebar__checkbox">
                            <input type="checkbox">
                            <span>Show Bookmarked Only</span>
                            <strong>2</strong>
                          </label>
                        </div>
                      </section>
                    </aside>
                  </div>
                </div>

                <div v-else class="tab-placeholder">
                  <h4>{{ tabs.find((tab) => tab[0] === activeTab)?.[1] }}</h4>
                  <p>This section can be expanded next.</p>
                </div>
              </section>
            </section>
          </div>
        </div>

        <footer class="final-feedback-footer">
          <button class="is-primary" type="button" @click="emit('move-offer')">
            <AppIcon name="checkCircle" :size="18" />
            <div>
              <strong>Move to Offer</strong>
              <span>Proceed to next stage</span>
            </div>
          </button>

          <button type="button" @click="emit('request-clarification')">
            <AppIcon name="message" :size="18" />
            <div>
              <strong>Request Clarification</strong>
              <span>Ask the team for more input</span>
            </div>
          </button>

          <button class="is-warning" type="button" @click="emit('hold-decision')">
            <AppIcon name="clock" :size="18" />
            <div>
              <strong>Hold Decision</strong>
              <span>Pause and revisit later</span>
            </div>
          </button>

          <button class="is-danger" type="button" @click="emit('reject-candidate')">
            <AppIcon name="close" :size="18" />
            <div>
              <strong>Reject Candidate</strong>
              <span>Move to not selected</span>
            </div>
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.final-feedback-overlay {
  position: fixed;
  inset: 0;
  z-index: 1730;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(232, 238, 248, 0.76);
  backdrop-filter: blur(10px);
}

.final-feedback-modal {
  width: min(1520px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e6ecf7;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.18);
}

.final-feedback-header,
.final-feedback-header__title,
.final-feedback-header__row,
.final-feedback-header__actions,
.reviewer-summary-card__head,
.reviewer-summary-card__identity,
.reviewer-summary-card__name-row,
.reviewer-summary-card__actions,
.reviewer-summary-tabs,
.content-panel__head,
.final-feedback-footer,
.final-feedback-footer button,
.reviewer-list__item,
.reviewer-list-card__compare,
.competency-list article,
.competency-list__label {
  display: flex;
  align-items: center;
}

.final-feedback-header,
.reviewer-summary-card__head,
.content-panel__head {
  justify-content: space-between;
}

.final-feedback-header {
  padding: 20px 26px;
  border-bottom: 1px solid #eef2f8;
}

.final-feedback-header__title {
  gap: 18px;
}

.final-feedback-header__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: linear-gradient(180deg, #ff67ad 0%, #f653a2 100%);
  color: #fff;
  flex: 0 0 68px;
}

.final-feedback-header__row {
  gap: 14px;
}

.final-feedback-header__row h2,
.recommendation-card__copy h3,
.reviewer-list-card__head h3,
.reviewer-summary-card__name-row h3,
.content-panel h4 {
  margin: 0;
  color: #1f2940;
}

.final-feedback-header__row h2 {
  font-size: 1.05rem;
}

.final-feedback-header__row span {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 14px;
  border-radius: 999px;
  background: #fff0f7;
  color: #ef4ca1;
  font-size: 0.75rem;
  font-weight: 800;
}

.final-feedback-header p,
.reviewer-summary-card__head p,
.reviewer-list__copy small,
.reviewer-list__copy span,
.recommendation-card__copy p,
.recommendation-card__stats article span,
.summary-kpi-card span,
.summary-copy-card p,
.final-feedback-footer button span {
  margin: 0;
  color: #73819a;
}

.final-feedback-header p {
  margin-top: 6px;
  font-size: 0.88rem;
}

.final-feedback-header p i,
.reviewer-summary-card__head p i {
  font-style: normal;
  margin: 0 8px;
}

.final-feedback-header__actions {
  gap: 12px;
}

.final-feedback-header__actions button,
.reviewer-summary-card__actions button,
.reviewer-summary-tabs button,
.content-panel__head button,
.reviewer-summary-card__back,
.reviewer-list__item,
.reviewer-list-card__compare,
.final-feedback-footer button {
  font: inherit;
  cursor: pointer;
}

.final-feedback-header__actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  padding: 0 18px;
  border: 1px solid #dfe6f3;
  border-radius: 14px;
  background: #fff;
  color: #30405e;
  font-weight: 700;
}

.final-feedback-header__actions .is-close {
  width: 50px;
  padding: 0;
}

.final-feedback-body {
  overflow: auto;
  padding: 20px 20px 16px;
}

.final-feedback-layout {
  display: grid;
  grid-template-columns: 468px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.final-feedback-layout.is-validation-active {
  grid-template-columns: 340px minmax(0, 1fr);
}

.final-feedback-side,
.final-feedback-main {
  display: grid;
  gap: 16px;
}

.recommendation-card,
.reviewer-list-card,
.reviewer-summary-card,
.content-panel {
  border: 1px solid #e8edf6;
  border-radius: 20px;
  background: #fff;
}

.recommendation-card {
  padding: 22px;
  background: linear-gradient(180deg, #fff8fc 0%, #ffffff 100%);
}

.recommendation-card__hero {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 104px;
  gap: 16px;
  align-items: start;
}

.recommendation-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ffd3e7 0%, #ff74b6 100%);
  color: #fff;
}

.recommendation-card__copy small,
.recommendation-card__confidence small,
.recommendation-card__stats article small,
.summary-kpi-card small,
.summary-copy-card small,
.summary-tags-card small,
.overall-rating-box small {
  display: block;
  color: #97a4b8;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.recommendation-card__copy small {
  color: #ff4c9f;
}

.recommendation-card__copy h3 {
  margin-top: 8px;
  font-size: 1.45rem;
}

.recommendation-card__copy p {
  max-width: 240px;
  margin-top: 12px;
  font-size: 0.86rem;
  line-height: 1.55;
}

.recommendation-card__confidence {
  padding-top: 4px;
}

.recommendation-card__confidence strong {
  display: block;
  margin-top: 8px;
  color: #17233f;
  font-size: 2.45rem;
  line-height: 0.95;
}

.recommendation-card__confidence span {
  display: block;
  margin-top: 6px;
  color: #17a460;
  font-size: 0.9rem;
  font-weight: 800;
}

.recommendation-card__bars {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 12px;
}

.recommendation-card__bars i {
  display: block;
  height: 6px;
  border-radius: 999px;
  background: #e3e8f2;
}

.recommendation-card__bars i.is-filled {
  background: linear-gradient(180deg, #20c16d 0%, #119f58 100%);
}

.recommendation-card__stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
  margin-top: 18px;
}

.recommendation-card__stats article {
  min-width: 0;
  padding: 0 10px;
  border-left: 1px solid #edf1f8;
}

.recommendation-card__stats article:first-child {
  padding-left: 0;
  border-left: 0;
}

.recommendation-card__stats article strong {
  display: block;
  margin-top: 8px;
  color: #1f2940;
  font-size: 0.88rem;
  line-height: 1.2;
}

.recommendation-card__stats article span {
  display: block;
  margin-top: 4px;
  font-size: 0.78rem;
  line-height: 1.35;
}

.reviewer-list-card {
  padding: 14px 12px;
}

.reviewer-list-card__head {
  padding: 0 10px 14px;
}

.reviewer-list {
  display: grid;
  gap: 10px;
}

.reviewer-list__item {
  gap: 14px;
  width: 100%;
  padding: 14px 12px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: #fff;
  text-align: left;
}

.reviewer-list__item.is-active {
  border-color: #ff9acb;
  box-shadow: 0 0 0 1px rgba(255, 110, 177, 0.12);
}

.reviewer-list__avatar,
.reviewer-summary-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd48c 0%, #c97345 100%);
  color: #fff;
  font-weight: 800;
  flex: 0 0 48px;
}

.reviewer-summary-card__avatar {
  width: 54px;
  height: 54px;
}

.reviewer-list__copy {
  flex: 1;
  min-width: 0;
}

.reviewer-list__copy strong {
  display: block;
  color: #1f2940;
}

.reviewer-list__copy small,
.reviewer-list__copy span {
  display: block;
  margin-top: 3px;
  font-size: 0.8rem;
}

.reviewer-list__score {
  display: grid;
  justify-items: end;
  gap: 6px;
}

.reviewer-list__score em {
  color: #1f2940;
  font-style: normal;
  font-weight: 800;
}

.reviewer-list__score span {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: #e8faef;
  color: #149b59;
  font-size: 0.72rem;
  font-weight: 800;
}

.reviewer-list__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e4ebf6;
  color: #8391a8;
  flex: 0 0 32px;
}

.reviewer-list__item.is-active .reviewer-list__arrow {
  border-color: transparent;
  background: linear-gradient(180deg, #ff74b6 0%, #f957a4 100%);
  color: #fff;
}

.reviewer-list-card__compare {
  justify-content: center;
  gap: 8px;
  width: max-content;
  min-height: 42px;
  margin: 18px auto 0;
  padding: 0 16px;
  border: 1px solid #dfe6f3;
  border-radius: 12px;
  background: #fff;
  color: #4d57ef;
  font-weight: 700;
}

.reviewer-summary-card {
  padding: 14px;
}

.reviewer-summary-card__head {
  gap: 18px;
}

.reviewer-summary-card__identity {
  flex: 1;
  min-width: 0;
  gap: 14px;
}

.reviewer-summary-card__copy {
  min-width: 0;
}

.reviewer-summary-card__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #e2e8f3;
  border-radius: 50%;
  background: #fff;
  color: #7e8aa0;
  flex: 0 0 36px;
}

.reviewer-summary-card__name-row {
  gap: 12px;
}

.reviewer-summary-card__name-row h3 {
  font-size: 0.96rem;
}

.reviewer-summary-card__name-row span {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  background: #e8faef;
  color: #149b59;
  font-size: 0.74rem;
  font-weight: 800;
}

.reviewer-summary-card__head p {
  margin-top: 6px;
  font-size: 0.82rem;
  overflow-wrap: anywhere;
}

.reviewer-summary-card__actions {
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.reviewer-summary-card__actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #e2e8f3;
  border-radius: 12px;
  background: #fff;
  color: #53617b;
  font-weight: 700;
}

.reviewer-summary-card__actions .is-icon {
  width: 36px;
  padding: 0;
}

.reviewer-summary-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr) minmax(0, 0.94fr);
  gap: 12px;
  margin-top: 12px;
  align-items: stretch;
}

.summary-kpi-card,
.summary-copy-card,
.summary-tags-card,
.content-panel {
  padding: 14px;
  min-width: 0;
}

.summary-kpi-card,
.summary-copy-card,
.summary-tags-card {
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: #fff;
  height: 100%;
}

.summary-kpi-card {
  background: linear-gradient(180deg, #f7fff9 0%, #ffffff 100%);
}

.summary-kpi-card strong {
  display: block;
  margin-top: 10px;
  color: #16a356;
  font-size: 1.75rem;
  line-height: 1;
}

.summary-kpi-card span {
  display: block;
  margin-top: 8px;
}

.summary-kpi-card__confidence {
  margin-top: 14px;
}

.summary-kpi-card__confidence strong {
  color: #17233f;
  font-size: 1.75rem;
}

.summary-kpi-card__confidence span {
  color: #16a356;
  font-weight: 800;
}

.summary-copy-card p {
  margin-top: 12px;
  font-size: 0.84rem;
  line-height: 1.6;
}

.summary-tags-card__list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
  margin-top: 12px;
}

.summary-tags-card__list span {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 10px;
  background: #ebfbef;
  color: #1c9d5c;
  font-size: 0.7rem;
  font-weight: 800;
}

.reviewer-summary-tabs {
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding: 0 8px;
  border-bottom: 1px solid #edf1f7;
}

.reviewer-summary-tabs button {
  height: 38px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #56627d;
  font-size: 0.82rem;
  white-space: nowrap;
}

.reviewer-summary-tabs button.is-active {
  color: #ff4da0;
  box-shadow: inset 0 -2px 0 #ff4da0;
  font-weight: 800;
}

.reviewer-content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(330px, 0.92fr);
  gap: 12px;
  margin-top: 14px;
  align-items: start;
}

.competency-panel {
  grid-column: 1;
}

.strengths-panel {
  grid-column: 2;
}

.evidence-panel {
  grid-column: 1;
}

.quotes-panel {
  grid-column: 2;
}

.content-panel {
  min-width: 0;
}

.content-panel h4 {
  font-size: 0.76rem;
  text-transform: uppercase;
}

.content-panel h4.is-warning {
  color: #ff8b1f;
}

.competency-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.competency-list article {
  gap: 12px;
  min-width: 0;
}

.competency-list__label {
  min-width: 132px;
  gap: 8px;
  color: #1f2940;
  font-size: 0.8rem;
}

.competency-list__label :deep(svg) {
  color: #5464f2;
}

.competency-list__stars {
  min-width: 66px;
  color: #18a45e;
  letter-spacing: 0.04em;
  font-size: 0.72rem;
}

.competency-list strong {
  min-width: 56px;
  color: #1f2940;
  font-size: 0.76rem;
}

.competency-list__bar {
  flex: 1;
  min-width: 80px;
  height: 6px;
  border-radius: 999px;
  background: #e6edf7;
  overflow: hidden;
}

.competency-list__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #16b25e 0%, #0f954c 100%);
}

.competency-panel__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 16px;
  color: #66748f;
  font-size: 0.68rem;
}

.competency-panel__legend span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.competency-panel__legend i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.competency-panel__legend .is-green {
  background: #16b25e;
}

.competency-panel__legend .is-blue {
  background: #4f84ff;
}

.competency-panel__legend .is-orange {
  background: #ff922e;
}

.two-column-panels {
  display: grid;
  grid-template-columns: 1fr 0.88fr;
  gap: 16px;
  align-items: start;
}

.check-list,
.warning-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.check-list p,
.warning-list p,
.quotes-grid p {
  position: relative;
  margin: 0;
  padding-left: 28px;
  color: #27344f;
  font-size: 0.82rem;
  line-height: 1.55;
}

.check-list p::before,
.warning-list p::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.check-list p::before {
  background: linear-gradient(180deg, #20c16d 0%, #15a35b 100%);
}

.warning-list p::before {
  background: linear-gradient(180deg, #ffb162 0%, #ff8b1f 100%);
}

.overall-rating-box {
  margin-top: 20px;
}

.overall-rating-box div {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 10px;
}

.overall-rating-box span {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 16px;
  background: #fff0f7;
  color: #ef4ca1;
  font-size: 1rem;
  font-weight: 800;
}

.overall-rating-box strong {
  color: #1f2940;
}

.evidence-grid,
.quotes-grid {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.evidence-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.evidence-grid article,
.quotes-grid article {
  padding: 12px;
  border: 1px solid #edf1f7;
  border-radius: 16px;
  background: #fff;
}

.evidence-grid article span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #f5f7ff;
}

.evidence-grid article span.is-green {
  color: #16a356;
}

.evidence-grid article span.is-orange {
  color: #ff922e;
}

.evidence-grid article strong,
.quotes-grid article strong {
  display: block;
  margin-top: 10px;
  color: #1f2940;
  font-size: 0.8rem;
}

.evidence-grid article small,
.quotes-grid article small {
  display: block;
  margin-top: 4px;
  color: #16a356;
  font-size: 0.72rem;
  font-weight: 700;
}

.evidence-grid article span.is-orange ~ small,
.quotes-grid article small {
  color: #7b879b;
}

.content-panel__head button {
  border: 0;
  background: transparent;
  color: #5b5df1;
  font-weight: 700;
}

.quotes-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.quotes-grid article p {
  margin-top: 12px;
  padding-left: 0;
}

.competencies-view {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.competencies-view__head,
.competencies-table__header,
.competencies-table__row,
.competencies-table__competency,
.competencies-table__score,
.competencies-table__trend,
.competencies-table__icons,
.competencies-detail-card__head,
.competencies-detail-card__score,
.competencies-detail-card__evidence-list article,
.tab-placeholder {
  display: flex;
  align-items: center;
}

.competencies-view__head {
  justify-content: space-between;
  gap: 12px;
}

.competencies-view__head h4,
.competencies-detail-card__head h4,
.tab-placeholder h4 {
  margin: 0;
  color: #1f2940;
}

.competencies-view__head p,
.competencies-detail-card__section p,
.competencies-detail-card__evidence-list p,
.tab-placeholder p {
  margin: 6px 0 0;
  color: #72819a;
  font-size: 0.8rem;
  line-height: 1.55;
}

.competencies-view__head button,
.competencies-detail-card__head button,
.competencies-detail-card__cta {
  font: inherit;
  cursor: pointer;
}

.competencies-view__head button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #e4ebf6;
  border-radius: 12px;
  background: #fff;
  color: #5a63f1;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.competencies-view__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 278px;
  gap: 14px;
  align-items: start;
}

.competencies-table,
.competencies-detail-card {
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
}

.competencies-table {
  padding: 10px 14px 14px;
}

.competencies-table__header {
  padding: 4px 0 10px;
  border-bottom: 1px solid #edf1f7;
  color: #8b97ab;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.competencies-table__header span:nth-child(1),
.competencies-table__row > div:nth-child(1) {
  flex: 1.65;
}

.competencies-table__header span:nth-child(2),
.competencies-table__row > div:nth-child(2) {
  flex: 0.82;
}

.competencies-table__header span:nth-child(3),
.competencies-table__row > div:nth-child(3) {
  flex: 0.7;
}

.competencies-table__header span:nth-child(4),
.competencies-table__row > div:nth-child(4) {
  flex: 0.92;
}

.competencies-table__header span:nth-child(5),
.competencies-table__row > div:nth-child(5) {
  flex: 0.86;
}

.competencies-table__row {
  width: 100%;
  gap: 12px;
  padding: 14px 0;
  border: 0;
  border-bottom: 1px solid #edf1f7;
  background: transparent;
  text-align: left;
}

.competencies-table__row:last-of-type {
  border-bottom: 0;
}

.competencies-table__row.is-active {
  background: linear-gradient(180deg, #fffafd 0%, #ffffff 100%);
}

.competencies-table__competency {
  gap: 10px;
  min-width: 0;
}

.competencies-table__competency-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f4f6ff;
  color: #5966f2;
  flex: 0 0 32px;
}

.competencies-table__competency strong,
.competencies-detail-card__evidence-list strong {
  display: block;
  color: #1f2940;
  font-size: 0.8rem;
}

.competencies-table__competency small {
  display: block;
  margin-top: 4px;
  color: #748197;
  font-size: 0.72rem;
  line-height: 1.45;
}

.competencies-table__score {
  display: grid;
  gap: 4px;
}

.competencies-table__score span {
  color: #18a45e;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.competencies-table__score strong,
.competencies-detail-card__score strong {
  color: #1f2940;
  font-size: 0.8rem;
}

.competencies-table__trend {
  gap: 6px;
  color: #6e7b93;
  font-size: 0.74rem;
}

.competencies-table__trend :deep(svg) {
  color: #18a45e;
}

.competencies-table__trend.is-orange :deep(svg) {
  color: #ff922e;
}

.competencies-table__evidence {
  display: grid;
  gap: 4px;
}

.competencies-table__evidence-bar {
  width: 92px;
  height: 7px;
  border-radius: 999px;
  background: #e8edf5;
  overflow: hidden;
}

.competencies-table__evidence-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.competencies-table__evidence-bar i.is-green {
  background: linear-gradient(90deg, #16b25e 0%, #0f954c 100%);
}

.competencies-table__evidence-bar i.is-orange {
  background: linear-gradient(90deg, #ffb162 0%, #ff8b1f 100%);
}

.competencies-table__evidence small {
  font-size: 0.7rem;
  font-weight: 700;
}

.competencies-table__evidence small.is-green,
.competencies-detail-card__meta strong.is-green {
  color: #13a45b;
}

.competencies-table__evidence small.is-orange,
.competencies-detail-card__meta strong.is-orange {
  color: #ff8b1f;
}

.competencies-table__icons {
  gap: 6px;
  flex-wrap: wrap;
}

.competencies-table__icons span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 8px;
  background: #f7f8ff;
}

.competencies-table__icons span.is-pink {
  color: #ff5ea9;
}

.competencies-table__icons span.is-green {
  color: #13a45b;
}

.competencies-table__icons span.is-violet {
  color: #6a5cf2;
}

.competencies-table__icons span.is-orange {
  color: #ff8b1f;
}

.competencies-table__icons span.is-slate {
  color: #718099;
}

.competencies-table__chevron {
  display: inline-flex;
  justify-content: flex-end;
  width: 16px;
  color: #95a0b3;
}

.competencies-table__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 14px;
  color: #697892;
  font-size: 0.7rem;
}

.competencies-table__legend span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.competencies-table__legend i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.competencies-table__legend .is-green {
  background: #16b25e;
}

.competencies-table__legend .is-blue {
  background: #4f84ff;
}

.competencies-table__legend .is-orange {
  background: #ff922e;
}

.competencies-detail-card {
  padding: 16px;
}

.competencies-detail-card__head {
  justify-content: space-between;
  gap: 10px;
}

.competencies-detail-card__head button {
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #9aa4b7;
}

.competencies-detail-card__meta {
  display: grid;
  gap: 16px;
  margin-top: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf1f7;
}

.competencies-detail-card__meta small,
.competencies-detail-card__section small {
  display: block;
  color: #8f9bae;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.competencies-detail-card__score {
  gap: 10px;
  margin-top: 8px;
}

.competencies-detail-card__score span {
  color: #18a45e;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}

.competencies-detail-card__section {
  margin-top: 18px;
}

.competencies-detail-card__evidence-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.competencies-detail-card__evidence-list article {
  align-items: flex-start;
  gap: 10px;
}

.competencies-detail-card__evidence-list span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f7f8ff;
  flex: 0 0 34px;
}

.competencies-detail-card__evidence-list span.is-pink {
  color: #ff5ea9;
}

.competencies-detail-card__evidence-list span.is-green {
  color: #13a45b;
}

.competencies-detail-card__evidence-list span.is-violet {
  color: #6a5cf2;
}

.competencies-detail-card__cta {
  width: 100%;
  min-height: 40px;
  margin-top: 18px;
  border: 1px solid #f4d6e7;
  border-radius: 12px;
  background: #fff;
  color: #ff4da0;
  font-size: 0.8rem;
  font-weight: 700;
}

.evidence-view {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.evidence-view__head h4,
.evidence-stream__summary h4,
.evidence-inspector__head h4,
.evidence-competencies__head h5 {
  margin: 0;
  color: #1f2940;
}

.evidence-view__head p,
.evidence-stream__summary p,
.evidence-stream__copy p,
.evidence-inspector__section p {
  margin: 6px 0 0;
  color: #72819a;
  font-size: 0.8rem;
  line-height: 1.55;
}

.evidence-view__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.evidence-stat-card,
.evidence-competencies,
.evidence-stream,
.evidence-inspector {
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
}

.evidence-stat-card {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
}

.evidence-stat-card__label,
.evidence-stream__score-card small,
.evidence-inspector__section small,
.evidence-inspector__details dt {
  color: #8f9bae;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.evidence-stat-card__value,
.evidence-inspector__head,
.evidence-inspector__type,
.evidence-inspector__related article,
.evidence-stream__item-main,
.evidence-stream__meta,
.evidence-stream__support,
.evidence-competencies__list button {
  display: flex;
  align-items: center;
}

.evidence-stat-card__value {
  gap: 10px;
}

.evidence-stat-card__value span,
.evidence-stream__icon,
.evidence-inspector__type > span,
.evidence-inspector__related span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f7f8ff;
  flex: 0 0 32px;
}

.evidence-stat-card__value span.is-green,
.evidence-inspector__related span.is-green {
  color: #18a45e;
}

.evidence-stat-card__value span.is-orange,
.evidence-inspector__related span.is-orange {
  color: #ff8b1f;
}

.evidence-stat-card__value span.is-blue {
  color: #4f84ff;
}

.evidence-stat-card__value strong {
  color: #1f2940;
  font-size: 1.45rem;
  line-height: 1;
}

.evidence-stat-card small {
  color: #748197;
  font-size: 0.74rem;
}

.evidence-view__layout {
  display: grid;
  grid-template-columns: 172px minmax(0, 1fr) 286px;
  gap: 14px;
  align-items: start;
}

.evidence-competencies {
  padding: 12px;
}

.evidence-competencies__head {
  margin-bottom: 10px;
}

.evidence-competencies__head h5 {
  font-size: 0.86rem;
}

.evidence-competencies__list {
  display: grid;
  gap: 8px;
}

.evidence-competencies__list button {
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #edf1f7;
  border-radius: 14px;
  background: #fff;
  text-align: left;
}

.evidence-competencies__list button.is-active {
  border-color: #f6d3e4;
  background: linear-gradient(180deg, #fff9fd 0%, #ffffff 100%);
}

.evidence-competencies__list strong {
  display: block;
  color: #1f2940;
  font-size: 0.76rem;
}

.evidence-competencies__list small {
  display: block;
  margin-top: 4px;
  color: #5a63f1;
  font-size: 0.72rem;
  font-weight: 700;
}

.evidence-competencies__list span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: #fff1f8;
  color: #ff4da0;
  font-size: 0.7rem;
  font-weight: 700;
}

.evidence-competencies__cta,
.evidence-stream__cta,
.evidence-inspector__cta {
  min-height: 40px;
  border: 1px solid #ead7e6;
  border-radius: 12px;
  background: #fff;
  color: #5a63f1;
  font-size: 0.8rem;
  font-weight: 700;
}

.evidence-competencies__cta {
  width: 100%;
  margin-top: 12px;
}

.evidence-stream {
  padding: 14px;
}

.evidence-stream__summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 138px;
  gap: 14px;
  align-items: start;
}

.evidence-stream__score-card {
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid #edf1f7;
  border-radius: 14px;
  background: #fff;
}

.evidence-stream__score-card strong {
  color: #1f2940;
  font-size: 1.1rem;
}

.evidence-stream__score-card span {
  color: #748197;
  font-size: 0.72rem;
}

.evidence-stream__tabs {
  display: flex;
  gap: 18px;
  margin-top: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf1f7;
}

.evidence-stream__tabs button {
  padding: 0 0 8px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #687792;
  font-size: 0.78rem;
  font-weight: 700;
}

.evidence-stream__tabs button.is-active {
  border-bottom-color: #ff4da0;
  color: #ff4da0;
}

.evidence-stream__list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.evidence-stream__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px;
  gap: 14px;
  padding: 14px;
  border: 1px solid #edf1f7;
  border-radius: 16px;
  background: #fff;
}

.evidence-stream__item-main {
  align-items: flex-start;
  gap: 12px;
}

.evidence-stream__icon {
  color: #ff4da0;
}

.evidence-stream__icon.is-orange {
  color: #ff8b1f;
}

.evidence-stream__icon.is-violet {
  color: #6a5cf2;
}

.evidence-stream__icon.is-blue {
  color: #4f84ff;
}

.evidence-stream__icon.is-green {
  color: #18a45e;
}

.evidence-stream__copy {
  min-width: 0;
}

.evidence-stream__meta {
  gap: 8px;
  flex-wrap: wrap;
}

.evidence-stream__meta strong {
  color: #1f2940;
  font-size: 0.76rem;
}

.evidence-stream__meta small,
.evidence-stream__submeta {
  color: #8e99ac;
  font-size: 0.7rem;
}

.evidence-stream__submeta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.evidence-stream__support {
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.evidence-stream__support > span {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #18a45e;
  font-size: 0.66rem;
  font-weight: 800;
}

.evidence-stream__rating {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.evidence-stream__rating i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d7dee9;
}

.evidence-stream__rating i.is-filled {
  background: #16b25e;
}

.evidence-stream__rating strong {
  margin-left: 4px;
  color: #1f2940;
  font-size: 0.76rem;
}

.evidence-stream__cta {
  display: block;
  width: 180px;
  margin: 16px auto 0;
}

.evidence-inspector {
  padding: 16px;
}

.evidence-inspector__head {
  justify-content: space-between;
  gap: 10px;
}

.evidence-inspector__head button {
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #9aa4b7;
}

.evidence-inspector__type {
  align-items: flex-start;
  gap: 10px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #edf1f7;
  border-radius: 14px;
  background: #fbfcff;
}

.evidence-inspector__type > span.is-violet {
  color: #6a5cf2;
}

.evidence-inspector__type strong {
  display: block;
  color: #1f2940;
  font-size: 0.78rem;
}

.evidence-inspector__type small {
  display: block;
  margin-top: 4px;
  color: #7b879a;
  font-size: 0.7rem;
}

.evidence-inspector__type em {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  margin-left: auto;
  padding: 0 10px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #18a45e;
  font-size: 0.65rem;
  font-style: normal;
  font-weight: 800;
}

.evidence-inspector__section {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #edf1f7;
}

.evidence-inspector__details {
  display: grid;
  gap: 10px;
  margin: 12px 0 0;
}

.evidence-inspector__details div {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 10px;
}

.evidence-inspector__details dd {
  margin: 0;
  color: #1f2940;
  font-size: 0.76rem;
}

.evidence-inspector__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.evidence-inspector__tags span {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #edf8f0;
  color: #18a45e;
  font-size: 0.68rem;
  font-weight: 700;
}

.evidence-inspector__related {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.evidence-inspector__related article {
  align-items: flex-start;
  gap: 10px;
}

.evidence-inspector__related strong {
  display: block;
  color: #1f2940;
  font-size: 0.76rem;
}

.evidence-inspector__related p {
  margin: 4px 0 0;
  color: #748197;
  font-size: 0.72rem;
  line-height: 1.5;
}

.evidence-inspector__cta {
  width: 100%;
  margin-top: 18px;
}

.timeline-view {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.timeline-view__head,
.timeline-sidebar__card-head,
.timeline-sidebar__card-head button,
.timeline-journey__step,
.timeline-journey__date,
.timeline-sidebar__stats div,
.timeline-insights article {
  display: flex;
  align-items: center;
}

.timeline-view__head {
  justify-content: space-between;
  gap: 12px;
}

.timeline-view__head h4,
.timeline-chart-card__head h5,
.timeline-sidebar__card h5 {
  margin: 0;
  color: #1f2940;
}

.timeline-view__head p,
.timeline-insights p {
  margin: 6px 0 0;
  color: #72819a;
  font-size: 0.8rem;
  line-height: 1.55;
}

.timeline-view__head button,
.timeline-sidebar__card-head button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #e4ebf6;
  border-radius: 12px;
  background: #fff;
  color: #5a63f1;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.timeline-view__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 14px;
  align-items: start;
}

.timeline-journey,
.timeline-sidebar__card,
.timeline-chart-card {
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
}

.timeline-journey {
  padding: 10px 14px 14px;
}

.timeline-journey__header {
  display: grid;
  grid-template-columns: 1.6fr 108px 1fr 1.18fr 72px;
  gap: 12px;
  padding: 4px 0 10px;
  border-bottom: 1px solid #edf1f7;
  color: #8b97ab;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.timeline-journey__row {
  display: grid;
  grid-template-columns: 1.6fr 108px 1fr 1.18fr 72px;
  gap: 12px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #edf1f7;
}

.timeline-journey__row:last-of-type {
  border-bottom: 0;
}

.timeline-journey__step {
  align-items: flex-start;
  gap: 10px;
}

.timeline-journey__step > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #f7f8ff;
  flex: 0 0 36px;
}

.timeline-journey__step > span.is-violet { color: #7a52ff; }
.timeline-journey__step > span.is-pink { color: #ff4da0; }
.timeline-journey__step > span.is-orange { color: #ff8b1f; }
.timeline-journey__step > span.is-green { color: #16b25e; }
.timeline-journey__step > span.is-blue { color: #2878ff; }

.timeline-journey__step strong,
.timeline-insights p {
  color: #1f2940;
}

.timeline-journey__step strong {
  display: block;
  font-size: 0.79rem;
}

.timeline-journey__step small {
  display: block;
  margin-top: 4px;
  color: #748197;
  font-size: 0.72rem;
  line-height: 1.45;
}

.timeline-journey__confidence {
  display: flex;
  justify-content: center;
}

.timeline-journey__ring {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: conic-gradient(var(--ring-color) 0deg, var(--ring-color) var(--ring-angle), #e8edf5 var(--ring-angle), #e8edf5 360deg);
}

.timeline-journey__ring div {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #fff;
  color: #1f2940;
  font-size: 0.78rem;
  font-weight: 800;
}

.timeline-journey__evidence {
  margin: 0;
  padding-left: 16px;
  color: #1f2940;
  font-size: 0.72rem;
  line-height: 1.6;
}

.timeline-journey__insight {
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 0.72rem;
  line-height: 1.5;
}

.timeline-journey__insight.is-violet {
  background: #f3efff;
  color: #5148cb;
}

.timeline-journey__insight.is-pink {
  background: #fff0f7;
  color: #d93f8b;
}

.timeline-journey__insight.is-orange {
  background: #fff4ea;
  color: #d8771a;
}

.timeline-journey__insight.is-green {
  background: #ecfbf2;
  color: #168a4e;
}

.timeline-journey__insight.is-blue {
  background: #eef5ff;
  color: #286adf;
}

.timeline-journey__date {
  justify-content: space-between;
  gap: 8px;
  color: #53627f;
  font-size: 0.74rem;
}

.timeline-chart-card {
  margin-top: 14px;
  padding: 14px;
}

.timeline-chart-card__head {
  margin-bottom: 10px;
}

.timeline-line-chart-shell {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 10px;
  align-items: stretch;
}

.timeline-line-chart__axis {
  display: grid;
  align-content: space-between;
  padding: 2px 0 2px;
  color: #8a96ab;
  font-size: 0.64rem;
  text-align: right;
}

.timeline-line-chart,
.timeline-mini-chart {
  position: relative;
  height: 112px;
  border-left: 1px solid #edf1f7;
  border-bottom: 1px solid #edf1f7;
  overflow: visible;
}

.timeline-mini-chart {
  height: 118px;
  margin-top: 10px;
}

.timeline-line-chart__grid,
.timeline-mini-chart__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to top, rgba(235, 239, 246, 0.9) 1px, transparent 1px),
    linear-gradient(to right, rgba(242, 245, 250, 0.75) 1px, transparent 1px);
  background-size: 100% 25%, calc(100% / 6) 100%;
  pointer-events: none;
}

.timeline-line-chart__segment,
.timeline-mini-chart__segment {
  position: absolute;
  height: 2px;
  transform-origin: left center;
  pointer-events: none;
}

.timeline-line-chart__segment {
  background: #7a52ff;
  box-shadow: 0 0 0 1px rgba(122, 82, 255, 0.02);
}

.timeline-mini-chart.is-green .timeline-mini-chart__segment {
  background: #16b25e;
}

.timeline-mini-chart.is-violet .timeline-mini-chart__segment {
  background: #7a52ff;
}

.timeline-line-chart__point,
.timeline-mini-chart__point {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #7a52ff;
  box-shadow: 0 0 0 2px rgba(122, 82, 255, 0.14);
}

.timeline-mini-chart.is-green .timeline-mini-chart__point {
  background: #16b25e;
  box-shadow: 0 0 0 2px rgba(22, 178, 94, 0.12);
}

.timeline-line-chart__point em,
.timeline-mini-chart__point em {
  position: absolute;
  bottom: 13px;
  left: 50%;
  transform: translateX(-50%);
  color: #1f2940;
  font-size: 0.66rem;
  font-style: normal;
  font-weight: 800;
  white-space: nowrap;
}

.timeline-line-chart__labels,
.timeline-mini-chart__labels {
  display: grid;
  gap: 8px;
  margin-top: 10px;
  color: #73839c;
  font-size: 0.66rem;
}

.timeline-line-chart__labels {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.timeline-line-chart__labels span {
  display: grid;
  gap: 2px;
  text-align: center;
}

.timeline-line-chart__labels strong {
  color: #63718b;
  font-size: 0.63rem;
  font-weight: 700;
  line-height: 1.2;
}

.timeline-line-chart__labels small {
  color: #9aa5b8;
  font-size: 0.6rem;
  line-height: 1.2;
}

.timeline-mini-chart__labels {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.timeline-mini-chart__labels--competency {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.timeline-sidebar {
  display: grid;
  gap: 14px;
}

.timeline-sidebar__card {
  padding: 14px;
}

.timeline-sidebar__stats {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.timeline-sidebar__stats div {
  justify-content: space-between;
  gap: 12px;
  color: #5c6b85;
  font-size: 0.75rem;
}

.timeline-sidebar__stats strong {
  color: #1f2940;
  font-size: 0.8rem;
}

.timeline-sidebar__stats strong.is-green {
  color: #16b25e;
}

.timeline-sidebar__card-head {
  justify-content: space-between;
  gap: 10px;
}

.timeline-sidebar__card-head button {
  min-height: 34px;
  padding: 0 10px;
  font-size: 0.72rem;
}

.timeline-insights {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.timeline-insights article {
  align-items: flex-start;
  gap: 10px;
}

.timeline-insights span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: #f7f8ff;
  flex: 0 0 30px;
}

.timeline-insights span.is-green { color: #16b25e; }
.timeline-insights span.is-blue { color: #2878ff; }
.timeline-insights span.is-orange { color: #ff8b1f; }

.timeline-insights p {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.55;
}

.validation-view {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.validation-view__head,
.validation-summary-card__content,
.validation-section__head,
.validation-breakdown__legend article,
.validation-findings__list article,
.validation-strengths article,
.validation-attention article,
.validation-summary-note,
.validation-sidebar__cta {
  display: flex;
  align-items: center;
}

.validation-view__head {
  justify-content: space-between;
  gap: 12px;
}

.validation-view__head h4,
.validation-section__head h5,
.validation-sidebar__card h5 {
  margin: 0;
  color: #1f2940;
}

.validation-view__head p,
.validation-section__head p,
.validation-summary-card p,
.validation-findings__list p,
.validation-summary-note p,
.validation-sidebar__card > p,
.validation-strengths p,
.validation-attention p {
  margin: 6px 0 0;
  color: #72819a;
  font-size: 0.8rem;
  line-height: 1.55;
}

.validation-view__head button,
.validation-sidebar__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #e4ebf6;
  border-radius: 12px;
  background: #fff;
  color: #5a63f1;
  font-size: 0.78rem;
  font-weight: 700;
}

.validation-view__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 14px;
  align-items: start;
}

.validation-main,
.validation-sidebar__card,
.validation-analyzed,
.validation-breakdown,
.validation-findings,
.validation-summary-note {
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
}

.validation-main {
  border: 0;
  background: transparent;
  min-width: 0;
}

.validation-summary-grid {
  display: grid;
  grid-template-columns: 1.75fr 1.05fr 1.05fr 0.95fr 1.65fr;
  gap: 12px;
  align-items: stretch;
}

.validation-summary-card {
  padding: 14px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
  background: #fff;
  min-width: 0;
}

.validation-summary-card small,
.validation-analyzed__grid article small {
  display: block;
  color: #8f9bae;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.validation-summary-card__content {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  margin-top: 10px;
  min-width: 0;
}

.validation-summary-card__content > div {
  min-width: 0;
}

.validation-summary-card__content > span,
.validation-findings__list span,
.validation-strengths span,
.validation-attention span,
.validation-summary-note > span,
.validation-analyzed__grid article span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f7f8ff;
  flex: 0 0 32px;
}

.validation-summary-card.tone-green .validation-summary-card__content > span,
.validation-findings__list span.is-green,
.validation-strengths span {
  color: #18a45e;
}

.validation-summary-card.tone-violet .validation-summary-card__content > span,
.validation-findings__list span.is-violet,
.validation-summary-note > span {
  color: #6a5cf2;
}

.validation-summary-card.tone-blue .validation-summary-card__content > span,
.validation-findings__list span.is-blue {
  color: #2878ff;
}

.validation-summary-card__content strong {
  display: block;
  color: #1f2940;
  font-size: 0.9rem;
  line-height: 1.2;
  word-break: normal;
  overflow-wrap: normal;
}

.validation-summary-card.is-large .validation-summary-card__content strong {
  font-size: 1.2rem;
  line-height: 1.1;
  white-space: nowrap;
}

.validation-summary-card.is-metric .validation-summary-card__content strong {
  font-size: 1.55rem;
  line-height: 0.95;
  white-space: nowrap;
}

.validation-summary-card.is-text .validation-summary-card__content strong {
  font-size: 0.92rem;
  line-height: 1.35;
}

.validation-summary-card__bar {
  display: flex;
  gap: 4px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.validation-summary-card__bar i {
  width: 14px;
  height: 4px;
  border-radius: 999px;
}

.validation-summary-card__bar i.is-green {
  background: #16b25e;
}

.validation-analyzed,
.validation-breakdown,
.validation-findings,
.validation-summary-note,
.validation-sidebar__card {
  padding: 14px;
  min-width: 0;
}

.validation-analyzed {
  margin-top: 14px;
}

.validation-analyzed__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.validation-analyzed__grid article {
  padding: 14px 12px;
  border: 1px solid #edf1f7;
  border-radius: 14px;
  background: #fff;
}

.validation-analyzed__grid article span {
  width: 28px;
  height: 28px;
}

.validation-analyzed__grid article span.is-violet { color: #6a5cf2; }
.validation-analyzed__grid article span.is-slate { color: #60708d; }
.validation-analyzed__grid article span.is-green { color: #18a45e; }
.validation-analyzed__grid article span.is-blue { color: #2878ff; }
.validation-analyzed__grid article span.is-orange { color: #ff8b1f; }

.validation-analyzed__grid article strong {
  display: block;
  margin-top: 12px;
  color: #1f2940;
  font-size: 1.6rem;
  line-height: 1;
}

.validation-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 14px;
}

.validation-breakdown__content {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  margin-top: 14px;
}

.validation-donut {
  display: grid;
  place-items: center;
}

.validation-donut__ring {
  display: grid;
  place-items: center;
  width: 164px;
  height: 164px;
  border-radius: 50%;
  background: conic-gradient(
    #7a52ff 0deg 172.8deg,
    #2878ff 172.8deg 252deg,
    #ff9f2f 252deg 306deg,
    #ff4da0 306deg 342deg,
    #46cf9b 342deg 360deg
  );
}

.validation-donut__ring > div {
  display: grid;
  place-items: center;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: #fff;
  text-align: center;
}

.validation-donut__ring strong {
  color: #1f2940;
  font-size: 2rem;
  line-height: 1;
}

.validation-donut__ring span {
  margin-top: 6px;
  color: #72819a;
  font-size: 0.76rem;
}

.validation-breakdown__legend {
  display: grid;
  gap: 12px;
}

.validation-breakdown__legend article {
  align-items: flex-start;
  gap: 10px;
}

.validation-breakdown__legend span {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 50%;
  flex: 0 0 10px;
}

.validation-breakdown__legend span.is-violet { background: #7a52ff; }
.validation-breakdown__legend span.is-blue { background: #2878ff; }
.validation-breakdown__legend span.is-orange { background: #ff9f2f; }
.validation-breakdown__legend span.is-pink { background: #ff4da0; }
.validation-breakdown__legend span.is-green { background: #46cf9b; }

.validation-breakdown__legend strong,
.validation-findings__list strong,
.validation-strengths strong,
.validation-attention strong,
.validation-summary-note strong {
  display: block;
  color: #1f2940;
  font-size: 0.8rem;
}

.validation-breakdown__legend small {
  display: block;
  margin-top: 4px;
  color: #72819a;
  font-size: 0.72rem;
  line-height: 1.5;
}

.validation-breakdown__legend em {
  margin-left: auto;
  color: #1f2940;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
}

.validation-findings__list,
.validation-strengths {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.validation-findings__list article,
.validation-strengths article,
.validation-attention article {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 10px;
}

.validation-summary-note {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 10px;
  margin-top: 14px;
  background: linear-gradient(180deg, #f8f4ff 0%, #ffffff 100%);
}

.validation-sidebar {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.validation-strengths article,
.validation-attention article {
  grid-template-columns: 32px minmax(0, 1fr) auto;
  align-items: start;
}

.validation-strengths em,
.validation-attention em {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eaf8ef;
  color: #18a45e;
  font-size: 0.66rem;
  font-style: normal;
  font-weight: 800;
  white-space: nowrap;
}

.validation-attention span {
  color: #ff8b1f;
}

.validation-attention em {
  background: #fff2e3;
  color: #d98322;
}

.validation-sidebar__cta {
  width: 100%;
  justify-content: space-between;
  margin-top: 14px;
}

.timeline-mini-chart__labels--validation {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.timeline-mini-chart__labels--validation span {
  text-align: center;
  font-size: 0.58rem;
  line-height: 1.25;
  word-break: break-word;
}

.notes-view__layout,
.notes-main__head,
.notes-main__title,
.notes-main__actions,
.notes-main__search,
.notes-main__show-more,
.notes-feed__meta,
.notes-feed__author,
.notes-feed__actions,
.quotes-section__head,
.quotes-section__title,
.quotes-carousel__author,
.notes-sidebar__title,
.notes-sidebar__list article,
.notes-sidebar__stats div,
.notes-sidebar__updated,
.notes-sidebar__checkbox {
  display: flex;
  align-items: center;
}

.notes-view__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 290px;
  gap: 14px;
  margin-top: 14px;
  align-items: start;
}

.notes-main,
.notes-sidebar__card,
.quotes-section {
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
}

.notes-main {
  padding: 14px;
}

.notes-main__head {
  justify-content: space-between;
  gap: 14px;
}

.notes-main__title,
.quotes-section__title,
.notes-sidebar__title {
  gap: 10px;
}

.notes-main__title span,
.quotes-section__title span,
.notes-sidebar__title span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #f4f6ff;
  color: #6a5cf2;
}

.notes-main__title h4,
.quotes-section__title h4,
.notes-sidebar__title h5,
.notes-sidebar__card h5 {
  margin: 0;
  color: #1f2940;
}

.notes-main__head p,
.quotes-section__head p,
.notes-sidebar__list p {
  margin: 6px 0 0;
  color: #72819a;
  font-size: 0.8rem;
  line-height: 1.55;
}

.notes-main__actions {
  gap: 10px;
  flex-wrap: wrap;
}

.notes-main__actions > button,
.notes-main__select,
.notes-main__show-more button,
.quotes-section__head button,
.notes-sidebar__title button,
.notes-sidebar__filters button {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #e4ebf6;
  border-radius: 12px;
  background: #fff;
  color: #5a63f1;
  font-size: 0.78rem;
  font-weight: 700;
}

.notes-main__actions > button,
.notes-main__select,
.notes-main__show-more button,
.notes-sidebar__filters button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.notes-main__search {
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid #e4ebf6;
  border-radius: 12px;
  background: #fff;
  color: #95a0b3;
}

.notes-main__search input {
  width: 130px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #7a879d;
  font: inherit;
  font-size: 0.76rem;
}

.notes-main__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.notes-main__chips button {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #e8edf6;
  border-radius: 12px;
  background: #fff;
  color: #677790;
  font-size: 0.74rem;
  font-weight: 700;
}

.notes-main__chips button.is-active {
  border-color: #e7dafe;
  background: #f6f1ff;
  color: #6a5cf2;
}

.notes-feed {
  margin-top: 14px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  overflow: hidden;
}

.notes-feed__item {
  padding: 12px 14px 14px;
  border-bottom: 1px solid #edf1f7;
}

.notes-feed__item:last-child {
  border-bottom: 0;
}

.notes-feed__meta {
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.notes-feed__author {
  align-items: flex-start;
  gap: 10px;
}

.notes-feed__author > span,
.quotes-carousel__author i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #fff;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 800;
  flex: 0 0 30px;
}

.notes-feed__author > span.is-green,
.quotes-carousel__author i.is-green { background: linear-gradient(135deg, #1db867 0%, #87db97 100%); }
.notes-feed__author > span.is-violet,
.quotes-carousel__author i.is-violet { background: linear-gradient(135deg, #7b52ff 0%, #c1b3ff 100%); }
.notes-feed__author > span.is-orange,
.quotes-carousel__author i.is-orange { background: linear-gradient(135deg, #ff8b1f 0%, #ffc06c 100%); }
.notes-feed__author > span.is-blue,
.quotes-carousel__author i.is-blue { background: linear-gradient(135deg, #2878ff 0%, #80b1ff 100%); }
.quotes-carousel__author i.is-slate { background: linear-gradient(135deg, #60708d 0%, #9cb0c9 100%); }
.quotes-carousel__author i.is-pink { background: linear-gradient(135deg, #ff5ea9 0%, #ff9cca 100%); }

.notes-feed__author strong,
.quotes-carousel__author strong {
  display: block;
  color: #1f2940;
  font-size: 0.78rem;
}

.notes-feed__author small,
.quotes-carousel__author small {
  display: inline-block;
  margin-top: 2px;
  color: #748197;
  font-size: 0.7rem;
}

.notes-feed__author em,
.quotes-carousel__author em {
  display: block;
  margin-top: 4px;
  color: #9aa4b7;
  font-size: 0.68rem;
  font-style: normal;
}

.notes-feed__actions {
  gap: 10px;
  flex-wrap: wrap;
}

.notes-feed__actions b {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.66rem;
}

.notes-feed__actions b.is-green { background: #e9f8ef; color: #18a45e; }
.notes-feed__actions b.is-violet { background: #f3efff; color: #6a5cf2; }
.notes-feed__actions b.is-orange { background: #fff4ea; color: #ff8b1f; }
.notes-feed__actions b.is-blue { background: #edf4ff; color: #2878ff; }

.notes-feed__actions strong {
  color: #1f2940;
  font-size: 0.76rem;
}

.notes-feed__actions button {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #8694ab;
}

.notes-feed__bubble {
  max-width: 56%;
  margin-top: 10px;
  margin-left: 40px;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 0.78rem;
  line-height: 1.6;
  color: #30415c;
}

.notes-feed__bubble.is-green { background: linear-gradient(90deg, #eefcf3 0%, #f7fffa 100%); }
.notes-feed__bubble.is-violet { background: linear-gradient(90deg, #f5f1ff 0%, #faf8ff 100%); }
.notes-feed__bubble.is-orange { background: linear-gradient(90deg, #fff7ec 0%, #fffdf8 100%); }
.notes-feed__bubble.is-blue { background: linear-gradient(90deg, #f1f6ff 0%, #fbfdff 100%); }

.notes-main__show-more {
  justify-content: center;
  margin-top: 14px;
}

.quotes-section {
  margin-top: 14px;
  padding: 14px;
}

.quotes-section__head {
  justify-content: space-between;
  gap: 12px;
}

.quotes-carousel {
  position: relative;
  display: grid;
  grid-template-columns: 28px repeat(4, minmax(0, 1fr)) 28px;
  gap: 12px;
  margin-top: 14px;
  align-items: stretch;
}

.quotes-carousel__arrow {
  align-self: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #e4ebf6;
  border-radius: 50%;
  background: #fff;
  color: #90a0b6;
}

.quotes-carousel__card {
  padding: 14px;
  border: 1px solid #edf1f7;
  border-radius: 16px;
  background: #fff;
}

.quotes-carousel__card > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #f6f7ff;
}

.quotes-carousel__card > span.is-green { color: #18a45e; }
.quotes-carousel__card > span.is-slate { color: #60708d; }
.quotes-carousel__card > span.is-violet { color: #6a5cf2; }
.quotes-carousel__card > span.is-pink { color: #ff4da0; }

.quotes-carousel__card blockquote {
  margin: 10px 0 0;
  color: #1f2940;
  font-size: 0.82rem;
  line-height: 1.65;
}

.quotes-carousel__stars {
  margin-top: 10px;
  color: #18a45e;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

.quotes-carousel__author {
  align-items: flex-start;
  gap: 10px;
  margin-top: 14px;
}

.notes-sidebar {
  display: grid;
  gap: 14px;
}

.notes-sidebar__card {
  padding: 14px;
}

.notes-sidebar__list {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.notes-sidebar__list article {
  align-items: flex-start;
  gap: 10px;
}

.notes-sidebar__list span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #f7f8ff;
  flex: 0 0 28px;
}

.notes-sidebar__list span.is-green { color: #18a45e; }
.notes-sidebar__list span.is-blue { color: #2878ff; }

.notes-sidebar__list p {
  margin: 0;
  color: #495a77;
  font-size: 0.75rem;
}

.notes-sidebar__stats {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.notes-sidebar__stats div {
  justify-content: space-between;
  gap: 12px;
  color: #5c6b85;
  font-size: 0.75rem;
}

.notes-sidebar__stats strong,
.notes-sidebar__updated strong {
  color: #1f2940;
  font-size: 0.78rem;
}

.notes-sidebar__updated {
  justify-content: space-between;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #edf1f7;
  color: #8b97ab;
  font-size: 0.72rem;
}

.notes-sidebar__title {
  gap: 8px;
}

.notes-sidebar__title button {
  margin-left: auto;
  min-height: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #8f9bae;
  font-size: 0.72rem;
}

.notes-sidebar__filters {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.notes-sidebar__filters label {
  display: grid;
  gap: 6px;
}

.notes-sidebar__filters label > span {
  color: #8f9bae;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.notes-sidebar__filters button {
  justify-content: space-between;
  color: #5d6d86;
}

.notes-sidebar__filters button strong {
  color: #4d5e7a;
  font-size: 0.76rem;
}

.notes-sidebar__checkbox {
  gap: 10px;
  min-height: 38px;
  padding: 0 2px;
  color: #5d6d86;
  font-size: 0.76rem;
}

.notes-sidebar__checkbox input {
  width: 15px;
  height: 15px;
  margin: 0;
}

.notes-sidebar__checkbox strong {
  margin-left: auto;
  color: #6a5cf2;
  font-size: 0.74rem;
}

.tab-placeholder {
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  min-height: 220px;
  margin-top: 14px;
  border: 1px dashed #dfe6f3;
  border-radius: 18px;
  background: #fbfcff;
  text-align: center;
}

.final-feedback-footer {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 14px 18px 18px;
  border-top: 1px solid #eef2f8;
}

.final-feedback-footer button {
  min-height: 78px;
  justify-content: flex-start;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid #eceff6;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fff8fc 100%);
  text-align: left;
}

.final-feedback-footer button strong {
  display: block;
  color: #1f2940;
  font-size: 0.92rem;
}

.final-feedback-footer button span {
  display: block;
  margin-top: 4px;
  font-size: 0.8rem;
  line-height: 1.3;
}

.final-feedback-footer button.is-primary {
  border-color: transparent;
  background: linear-gradient(90deg, #ff5fae 0%, #f653a2 100%);
}

.final-feedback-footer button.is-primary strong,
.final-feedback-footer button.is-primary span,
.final-feedback-footer button.is-primary :deep(svg) {
  color: #fff;
}

.final-feedback-footer button.is-warning strong,
.final-feedback-footer button.is-warning :deep(svg) {
  color: #ff7f1d;
}

.final-feedback-footer button.is-danger strong,
.final-feedback-footer button.is-danger :deep(svg) {
  color: #f24d4d;
}

@media (max-width: 1380px) {
  .final-feedback-layout,
  .reviewer-content-grid,
  .two-column-panels,
  .competencies-view__layout,
  .validation-view__layout,
  .notes-view__layout,
  .timeline-view__layout,
  .evidence-view__layout {
    grid-template-columns: 1fr;
  }

  .competency-panel,
  .strengths-panel,
  .evidence-panel,
  .quotes-panel {
    grid-column: auto;
  }

  .quotes-grid {
    grid-template-columns: 1fr;
  }

  .evidence-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .evidence-view__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .validation-summary-grid,
  .validation-analyzed__grid,
  .validation-bottom-grid {
    grid-template-columns: 1fr 1fr;
  }

  .validation-view__layout {
    grid-template-columns: minmax(0, 1fr) 340px;
  }

  .quotes-carousel {
    grid-template-columns: 28px repeat(2, minmax(0, 1fr)) 28px;
  }
}

@media (max-width: 1240px) {
  .reviewer-summary-grid {
    grid-template-columns: 1fr;
  }

  .competencies-table__header,
  .timeline-journey__header {
    display: none;
  }

  .competencies-table__row,
  .timeline-journey__row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .competencies-table__chevron {
    justify-content: flex-start;
  }

  .evidence-stream__item {
    grid-template-columns: 1fr;
  }

  .evidence-stream__support {
    flex-direction: row;
    align-items: center;
  }

  .timeline-journey__confidence {
    justify-content: flex-start;
  }

  .timeline-journey__date {
    justify-content: flex-start;
  }

  .validation-summary-grid,
  .validation-analyzed__grid,
  .validation-bottom-grid,
  .validation-breakdown__content {
    grid-template-columns: 1fr;
  }

  .validation-view__layout {
    grid-template-columns: 1fr;
  }

  .notes-main__head {
    display: grid;
  }

  .notes-feed__meta {
    display: grid;
  }

  .notes-feed__bubble {
    max-width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 1100px) {
  .recommendation-card__hero,
  .recommendation-card__stats,
  .final-feedback-footer {
    grid-template-columns: 1fr 1fr;
  }

  .recommendation-card__hero {
    grid-template-columns: 108px 1fr;
  }

  .recommendation-card__confidence {
    grid-column: 1 / -1;
  }

  .reviewer-summary-card__head,
  .final-feedback-header {
    display: grid;
    gap: 16px;
  }
}

@media (max-width: 720px) {
  .final-feedback-overlay {
    padding: 10px;
  }

  .final-feedback-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 20px;
  }

  .final-feedback-header,
  .final-feedback-body,
  .final-feedback-footer {
    padding-left: 14px;
    padding-right: 14px;
  }

  .final-feedback-header__actions,
  .reviewer-summary-card__actions,
  .reviewer-summary-tabs {
    flex-wrap: wrap;
  }

  .recommendation-card__hero,
  .recommendation-card__stats,
  .evidence-grid,
  .evidence-view__stats,
  .validation-summary-grid,
  .final-feedback-footer {
    grid-template-columns: 1fr;
  }

  .evidence-stream__summary {
    grid-template-columns: 1fr;
  }

  .reviewer-list__item {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr);
  }

  .reviewer-list__score,
  .reviewer-list__arrow {
    grid-column: 2;
    justify-self: start;
  }

  .timeline-line-chart__labels,
  .timeline-mini-chart__labels,
  .timeline-mini-chart__labels--competency {
    grid-template-columns: repeat(auto-fit, minmax(54px, 1fr));
  }

  .quotes-carousel {
    grid-template-columns: 1fr;
  }

  .quotes-carousel__arrow {
    display: none;
  }
}
</style>
