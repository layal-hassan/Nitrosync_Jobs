<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import AICandidateRankingOverlay from '../shared/AICandidateRankingOverlay.vue'
import AIHiringSuccessPredictionOverlay from '../shared/AIHiringSuccessPredictionOverlay.vue'
import AIAssessmentInsightsOverlay from '../shared/AIAssessmentInsightsOverlay.vue'
import AIFeedbackQualityOverlay from '../shared/AIFeedbackQualityOverlay.vue'
import AIInterviewGapAnalysisOverlay from '../shared/AIInterviewGapAnalysisOverlay.vue'
import AIInterviewReadinessOverlay from '../shared/AIInterviewReadinessOverlay.vue'
import AIMatchAnalysisOverlay from '../shared/AIMatchAnalysisOverlay.vue'
import AIQualificationAnalysisOverlay from '../shared/AIQualificationAnalysisOverlay.vue'
import AIScreeningSummaryOverlay from '../shared/AIScreeningSummaryOverlay.vue'
import AIScoreCalibrationOverlay from '../shared/AIScoreCalibrationOverlay.vue'
import AIScorecardBiasDetectionOverlay from '../shared/AIScorecardBiasDetectionOverlay.vue'
import AIStageRecommendationOverlay from '../shared/AIStageRecommendationOverlay.vue'
import AIStrengthsGapsOverlay from '../shared/AIStrengthsGapsOverlay.vue'
import AIRiskDetectionOverlay from '../shared/AIRiskDetectionOverlay.vue'
import ActivityLogOverlay from '../shared/ActivityLogOverlay.vue'
import AssessmentReviewOverlay from '../shared/AssessmentReviewOverlay.vue'
import AddToTalentPoolOverlay from '../shared/AddToTalentPoolOverlay.vue'
import AssignInterviewPanelOverlay from '../shared/AssignInterviewPanelOverlay.vue'
import AssignInterviewKitOverlay from '../shared/AssignInterviewKitOverlay.vue'
import AssignHiringManagerOverlay from '../shared/AssignHiringManagerOverlay.vue'
import AddNoteOverlay from '../shared/AddNoteOverlay.vue'
import AddAssessmentLibraryOverlay from '../shared/AddAssessmentLibraryOverlay.vue'
import AddTagsOverlay from '../shared/AddTagsOverlay.vue'
import ArchiveCandidateOverlay from '../shared/ArchiveCandidateOverlay.vue'
import AssignAssessmentOverlay from '../shared/AssignAssessmentOverlay.vue'
import AutoDQKnockoutOverlay from '../shared/AutoDQKnockoutOverlay.vue'
import CheckInterviewerWorkloadOverlay from '../shared/CheckInterviewerWorkloadOverlay.vue'
import ConfirmAvailabilityOverlay from '../shared/ConfirmAvailabilityOverlay.vue'
import ConfirmCandidateInterestOverlay from '../shared/ConfirmCandidateInterestOverlay.vue'
import ConfirmSalaryAlignmentOverlay from '../shared/ConfirmSalaryAlignmentOverlay.vue'
import InterviewPlanSequenceOverlay from '../shared/InterviewPlanSequenceOverlay.vue'
import InterviewScorecardOverlay from '../shared/InterviewScorecardOverlay.vue'
import PutCandidateOnHoldOverlay from '../shared/PutCandidateOnHoldOverlay.vue'
import RequestFeedbackOverlay from '../shared/RequestFeedbackOverlay.vue'
import RequestFinalFeedbackOverlay from '../shared/RequestFinalFeedbackOverlay.vue'
import RequestHiringManagerDecisionOverlay from '../shared/RequestHiringManagerDecisionOverlay.vue'
import RequestSalaryExpectationOverlay from '../shared/RequestSalaryExpectationOverlay.vue'
import RejectCandidateOverlay from '../shared/RejectCandidateOverlay.vue'
import ScheduleHiringManagerReviewOverlay from '../shared/ScheduleHiringManagerReviewOverlay.vue'
import ScheduleScreeningOverlay from '../shared/ScheduleScreeningOverlay.vue'
import SendReminderOverlay from '../shared/SendReminderOverlay.vue'
import ShareCandidateOverlay from '../shared/ShareCandidateOverlay.vue'
import SendCandidateEmailOverlay from '../shared/SendCandidateEmailOverlay.vue'
import SuggestedNextActionOverlay from '../shared/SuggestedNextActionOverlay.vue'
import FinalFeedbackReviewOverlay from '../shared/FinalFeedbackReviewOverlay.vue'
import CreateHiringDecisionOverlay from '../shared/CreateHiringDecisionOverlay.vue'
import DecisionReviewOverlay from '../shared/DecisionReviewOverlay.vue'
import ConfigureInterviewKitOverlay from '../shared/ConfigureInterviewKitOverlay.vue'
import CandidateComparisonOverlay from '../shared/CandidateComparisonOverlay.vue'
import ReviewerCalibrationOverlay from '../shared/ReviewerCalibrationOverlay.vue'
import TrackAssessmentProgressOverlay from '../shared/TrackAssessmentProgressOverlay.vue'
import ViewFeedbackStatusOverlay from '../shared/ViewFeedbackStatusOverlay.vue'
import ViewNotesOverlay from '../shared/ViewNotesOverlay.vue'
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
  applied: 'applied',
  new: 'applied',
  screening: 'screening',
  qualified: 'screening',
  interview: 'interview',
  shortlisted: 'interview',
  assessment: 'assessment',
  validation: 'validation',
  offer: 'offer',
  hired: 'hired',
}

const activeColumnSlug = computed(() => stageFocusMap[props.focusStage] ?? '')
const activeBoardView = ref('board')
const activeAudienceView = ref('recruiter')
const activeStageMenuCandidateId = ref('')
const activeStageMenuColumnSlug = ref('')
const addNoteCandidateId = ref('')
const addNoteOpen = ref(false)
const viewNotesCandidateId = ref('')
const viewNotesOpen = ref(false)
const addTagsCandidateId = ref('')
const addTagsOpen = ref(false)
const activityLogCandidateId = ref('')
const activityLogOpen = ref(false)
const archiveCandidateCandidateId = ref('')
const archiveCandidateOpen = ref(false)
const aiCandidateRankingCandidateId = ref('')
const aiCandidateRankingOpen = ref(false)
const aiMatchAnalysisCandidateId = ref('')
const aiMatchAnalysisOpen = ref(false)
const aiInterviewGapAnalysisCandidateId = ref('')
const aiInterviewGapAnalysisOpen = ref(false)
const aiInterviewReadinessCandidateId = ref('')
const aiInterviewReadinessOpen = ref(false)
const aiHiringSuccessPredictionCandidateId = ref('')
const aiHiringSuccessPredictionOpen = ref(false)
const aiQualificationCandidateId = ref('')
const aiQualificationOpen = ref(false)
const configureInterviewKitCandidateId = ref('')
const configureInterviewKitOpen = ref(false)
const aiScreeningSummaryCandidateId = ref('')
const aiScreeningSummaryOpen = ref(false)
const aiRiskDetectionCandidateId = ref('')
const aiRiskDetectionOpen = ref(false)
const suggestedNextActionCandidateId = ref('')
const suggestedNextActionOpen = ref(false)
const finalFeedbackReviewCandidateId = ref('')
const finalFeedbackReviewOpen = ref(false)
const createHiringDecisionCandidateId = ref('')
const createHiringDecisionOpen = ref(false)
const decisionReviewCandidateId = ref('')
const decisionReviewOpen = ref(false)
const aiAssessmentInsightsCandidateId = ref('')
const aiAssessmentInsightsOpen = ref(false)
const aiFeedbackQualityCandidateId = ref('')
const aiFeedbackQualityOpen = ref(false)
const aiScoreCalibrationCandidateId = ref('')
const aiScoreCalibrationOpen = ref(false)
const aiScorecardBiasCandidateId = ref('')
const aiScorecardBiasOpen = ref(false)
const aiStageRecommendationCandidateId = ref('')
const aiStageRecommendationOpen = ref(false)
const aiStrengthsGapsCandidateId = ref('')
const aiStrengthsGapsOpen = ref(false)
const addToTalentPoolCandidateId = ref('')
const addToTalentPoolOpen = ref(false)
const assignAssessmentCandidateId = ref('')
const assignAssessmentOpen = ref(false)
const addAssessmentLibraryOpen = ref(false)
const assignInterviewPanelCandidateId = ref('')
const assignInterviewPanelOpen = ref(false)
const checkInterviewerWorkloadCandidateId = ref('')
const checkInterviewerWorkloadOpen = ref(false)
const interviewPlanSequenceCandidateId = ref('')
const interviewPlanSequenceOpen = ref(false)
const interviewPlanSequenceInitialView = ref('auto')
const assignInterviewKitCandidateId = ref('')
const assignInterviewKitOpen = ref(false)
const assignHiringManagerCandidateId = ref('')
const assignHiringManagerOpen = ref(false)
const autoDqCandidateId = ref('')
const autoDqOpen = ref(false)
const confirmAvailabilityCandidateId = ref('')
const confirmAvailabilityOpen = ref(false)
const confirmInterestCandidateId = ref('')
const confirmInterestOpen = ref(false)
const confirmSalaryAlignmentCandidateId = ref('')
const confirmSalaryAlignmentOpen = ref(false)
const feedbackRequestCandidateId = ref('')
const feedbackRequestOpen = ref(false)
const finalFeedbackRequestCandidateId = ref('')
const finalFeedbackRequestOpen = ref(false)
const sendReminderCandidateId = ref('')
const sendReminderOpen = ref(false)
const assessmentReviewCandidateId = ref('')
const assessmentReviewOpen = ref(false)
const candidateComparisonCandidateId = ref('')
const candidateComparisonOpen = ref(false)
const reviewerCalibrationCandidateId = ref('')
const reviewerCalibrationOpen = ref(false)
const trackAssessmentProgressCandidateId = ref('')
const trackAssessmentProgressOpen = ref(false)
const interviewScorecardCandidateId = ref('')
const interviewScorecardOpen = ref(false)
const feedbackStatusCandidateId = ref('')
const feedbackStatusOpen = ref(false)
const feedbackStatusInitialTab = ref('status')
const putOnHoldCandidateId = ref('')
const putOnHoldOpen = ref(false)
const requestSalaryCandidateId = ref('')
const requestSalaryOpen = ref(false)
const requestHmDecisionCandidateId = ref('')
const requestHmDecisionOpen = ref(false)
const rejectCandidateCandidateId = ref('')
const rejectCandidateOpen = ref(false)
const scheduleHmReviewCandidateId = ref('')
const scheduleHmReviewOpen = ref(false)
const scheduleScreeningCandidateId = ref('')
const scheduleScreeningOpen = ref(false)
const sendEmailCandidateId = ref('')
const sendEmailOpen = ref(false)
const shareCandidateCandidateId = ref('')
const shareCandidateOpen = ref(false)
const stageMenuPosition = ref({ top: 0, left: 0 })
const boardVisibleCandidateTotal = 48
const stageMenuConfigs = {
  applied: {
    number: '1',
    title: 'New (Applied)',
    subtitle: 'Capture & engage',
    badgeStyle: 'linear-gradient(180deg, #6d5cff 0%, #4f46e5 100%)',
    sections: [
      {
        title: 'Quick Actions',
        items: [
          { label: 'Move to Qualified', icon: 'file-description' },
          { label: 'Schedule Screening', icon: 'calendar' },
          { label: 'Send Email', icon: 'mail' },
        ],
      },
      {
        title: 'Smart Actions',
        items: [
          { label: 'Confirm Interest', icon: 'user' },
          { label: 'Request Availability', icon: 'clipboard-check' },
          { label: 'Request Salary Expectations', icon: 'wallet' },
          { label: 'Auto DQ / Knockout', icon: 'alert' },
          { label: 'Add to Talent Pool', icon: 'archive' },
        ],
      },
      {
        title: 'Actions',
        accent: true,
        items: [
          { label: 'AI Match Analysis', icon: 'spark' },
          { label: 'AI Candidate Ranking', icon: 'compare' },
          { label: 'AI Risk Detection', icon: 'alert' },
          { label: 'Suggested Next Action', icon: 'spark' },
        ],
      },
      {
        title: 'More Actions ( )',
        items: [
          { label: 'View Profile', icon: 'eye' },
          { label: 'Add Tags', icon: 'tag' },
          { label: 'Add Note', icon: 'edit' },
          { label: 'View Notes', icon: 'document' },
          { label: 'Share Candidate', icon: 'share' },
          { label: 'Put On Hold', icon: 'pause' },
          { label: 'Reject Candidate', icon: 'close', tone: 'danger' },
          { label: 'Archive Candidate', icon: 'archive' },
          { label: 'Activity Log', icon: 'clock' },
        ],
      },
    ],
  },
  screening: {
    number: '2',
    title: 'Qualified',
    subtitle: 'Validate & align',
    badgeStyle: 'linear-gradient(180deg, #27b0ff 0%, #1d8df1 100%)',
    sections: [
      {
        title: 'Quick Actions',
        items: [
          { label: 'Move to Shortlisted', icon: 'file-description' },
          { label: 'Schedule HM Review', icon: 'calendar' },
          { label: 'Request HM Review', icon: 'users' },
          { label: 'Send Email', icon: 'mail' },
        ],
      },
      {
        title: 'Smart Actions',
        items: [
          { label: 'Assign Hiring Manager', icon: 'team-gear' },
          { label: 'Confirm Availability', icon: 'clipboard-check' },
          { label: 'Confirm Salary Alignment', icon: 'wallet' },
          { label: 'Conduct Screening Call', icon: 'phone' },
          { label: 'Add Notes & Tags', icon: 'plus' },
        ],
      },
      {
        title: 'Actions',
        accent: true,
        items: [
          { label: 'AI Hiring Success Prediction', icon: 'sparkles' },
          { label: 'AI Qualification Score', icon: 'spark' },
          { label: 'AI Screening Summary', icon: 'document' },
          { label: 'Recommended Next Step', icon: 'sparkles' },
          { label: 'AI Hiring Manager Match', icon: 'compare' },
        ],
      },
      {
        title: 'More Actions ( )',
        items: [
          { label: 'View Profile', icon: 'eye' },
          { label: 'Add Tags', icon: 'tag' },
          { label: 'Add Note', icon: 'edit' },
          { label: 'View Note', icon: 'document' },
          { label: 'Submit Feedback', icon: 'document' },
          { label: 'View Feedback', icon: 'document' },
          { label: 'Share Candidate', icon: 'share' },
          { label: 'Put On Hold', icon: 'pause' },
          { label: 'Reject Candidate', icon: 'close', tone: 'danger' },
          { label: 'Archive Candidate', icon: 'archive' },
          { label: 'Activity Log', icon: 'clock' },
        ],
      },
    ],
  },
  interview: {
    number: '3',
    title: 'Shortlisted',
    subtitle: 'Prepare for interviews',
    badgeStyle: 'linear-gradient(180deg, #4c7cff 0%, #3568f6 100%)',
    sections: [
      {
        title: 'Quick Actions',
        items: [
          { label: 'Schedule Interview', icon: 'calendar' },
          { label: 'Move to Assessment', icon: 'file-description' },
          { label: 'Share Candidate', icon: 'share' },
          { label: 'Send Email', icon: 'mail' },
          { label: '...', icon: 'more', disabled: true },
        ],
      },
      {
        title: 'Smart Actions',
        items: [
          { label: 'Assign Interview Panel', icon: 'users' },
          { label: 'Assign Interview Kit', icon: 'document' },
          { label: 'Request Candidate Availability', icon: 'clipboard-check' },
          { label: 'Interview Plan & Sequence', icon: 'calendar' },
          { label: 'Check Interviewer Workload', icon: 'clock' },
          { label: 'Assign Assessment', icon: 'target' },
        ],
      },
      {
        title: 'Feedback Actions',
        items: [
          { label: 'Submit Feedback', icon: 'document' },
          { label: 'Request Feedback', icon: 'mail' },
          { label: 'View Feedback Status', icon: 'document' },
          { label: 'Send Reminder', icon: 'bell' },
        ],
      },
      {
        title: 'Actions',
        accent: true,
        items: [
          { label: 'AI Interview Readiness', icon: 'spark' },
          { label: 'AI Interview Gap Analysis', icon: 'compare' },
          { label: 'AI Interview Panel Review', icon: 'users' },
          { label: 'AI Interview Kit Review', icon: 'document' },
          { label: 'Suggested Next Action', icon: 'sparkles' },
        ],
      },
      {
        title: 'More Actions ( )',
        items: [
          { label: 'View Profile', icon: 'eye' },
          { label: 'Compare Candidate', icon: 'compare' },
          { label: 'Add to Talent Pool', icon: 'archive' },
          { label: 'Add Feedback', icon: 'edit' },
          { label: 'View Feedback', icon: 'document' },
          { label: 'Add Note', icon: 'edit' },
          { label: 'View Note', icon: 'document' },
          { label: 'Put On Hold', icon: 'pause' },
          { label: 'Reject Candidate', icon: 'close', tone: 'danger' },
          { label: 'Activity Log', icon: 'clock' },
        ],
      },
    ],
  },
  assessment: {
    number: '4',
    title: 'Assessment',
    subtitle: 'Evaluate & collect data',
    badgeStyle: 'linear-gradient(180deg, #2ec9df 0%, #1ea8c7 100%)',
    sections: [
      {
        title: 'Quick Actions',
        items: [
          { label: 'Move to Validation', icon: 'file-description' },
          { label: 'Assign Assessment', icon: 'target' },
          { label: 'Assessment Review', icon: 'document' },
          { label: 'Share Candidate', icon: 'share' },
          { label: 'View Interview Scorecards', icon: 'clipboard-check' },
        ],
      },
      {
        title: 'Smart Actions',
        items: [
          { label: 'Track Assessment Progress', icon: 'clock' },
          { label: 'Candidate Comparison', icon: 'compare' },
          { label: 'Reviewer Calibration', icon: 'users' },
        ],
      },
      {
        title: 'Feedback Actions',
        items: [
          { label: 'Request Feedback', icon: 'mail' },
          { label: 'Send Reminder', icon: 'bell' },
          { label: 'Add Internal Feedback', icon: 'edit' },
        ],
      },
      {
        title: 'Actions',
        accent: true,
        items: [
          { label: 'AI Assessment Insights', icon: 'spark' },
          { label: 'AI Strengths & Gaps', icon: 'compare' },
          { label: 'AI Hiring Recommendation', icon: 'sparkles' },
          { label: 'AI Score Calibration', icon: 'target' },
          { label: 'AI Feedback Quality', icon: 'document' },
          { label: 'AI Scorecard Bias Detection', icon: 'alert' },
          { label: 'AI Stage Recommendation', icon: 'sparkles' },
        ],
      },
      {
        title: 'More Actions ( )',
        items: [
          { label: 'View Profile', icon: 'eye' },
          { label: 'Compare Candidate', icon: 'compare' },
          { label: 'Assessment History', icon: 'clock' },
          { label: 'Put On Hold', icon: 'pause' },
          { label: 'Add Note', icon: 'edit' },
          { label: 'View Note', icon: 'document' },
          { label: 'View Feedback', icon: 'document' },
          { label: 'Reject Candidate', icon: 'close', tone: 'danger' },
          { label: 'Activity Log', icon: 'clock' },
        ],
      },
    ],
  },
  validation: {
    number: '5',
    title: 'Validation',
    subtitle: 'Make the decision',
    badgeStyle: 'linear-gradient(180deg, #26c281 0%, #0ea768 100%)',
    sections: [
      {
        title: 'Quick Actions',
        items: [
          { label: 'Move to Offer', icon: 'file-description' },
          { label: 'Review Final Feedback', icon: 'document' },
          { label: 'Create Hiring Decision', icon: 'document' },
          { label: 'Schedule Final Meeting', icon: 'calendar' },
          { label: '...', icon: 'more', disabled: true },
        ],
      },
      {
        title: 'Decision Actions',
        items: [
          { label: 'Request Final Feedback', icon: 'mail' },
          { label: 'Decision Review', icon: 'users' },
          { label: 'Hiring Committee Review', icon: 'users' },
          { label: 'Select Backup Candidate', icon: 'compare' },
          { label: 'Offer Readiness Checklist', icon: 'clipboard-check' },
        ],
      },
      {
        title: 'Compliance Actions',
        items: [
          { label: 'Request References', icon: 'mail' },
          { label: 'Review References', icon: 'document' },
          { label: 'Background Check', icon: 'shield' },
          { label: 'Review Background', icon: 'document' },
        ],
      },
      {
        title: 'Actions',
        accent: true,
        items: [
          { label: 'AI Hiring Recommendation', icon: 'sparkles' },
          { label: 'AI Decision Summary', icon: 'document' },
          { label: 'AI Confidence Breakdown', icon: 'target' },
          { label: 'AI Risk Analysis', icon: 'alert' },
          { label: 'AI Consensus Analysis', icon: 'users' },
          { label: 'AI Compare Finalists', icon: 'compare' },
        ],
      },
      {
        title: 'More Actions ( )',
        items: [
          { label: 'View Profile', icon: 'eye' },
          { label: 'Compare Candidate', icon: 'compare' },
          { label: 'Put On Hold', icon: 'pause' },
          { label: 'View Feedback', icon: 'document' },
          { label: 'View Note', icon: 'document' },
          { label: 'Add Note', icon: 'edit' },
          { label: 'Add Feedback', icon: 'edit' },
          { label: 'Reject Candidate', icon: 'close', tone: 'danger' },
          { label: 'Activity Log', icon: 'clock' },
        ],
      },
    ],
  },
}
const pipelineBoardTemplate = [
  {
    slug: 'applied',
    title: 'NEW (APPLIED)',
    countLabel: '142',
    tone: 'slate',
    selectAllChecked: false,
    cards: [
      { name: 'Ava Martinez', role: 'Product Designer', match: '92% match', matchTone: 'green', note: 'Added 2 days ago', noteTone: 'slate' },
      { name: 'Liam Anderson', role: 'UX Designer', match: '88% match', matchTone: 'green', note: 'Added 1 day ago', noteTone: 'slate' },
      { name: 'Noah Williams', role: 'Product Designer', match: '76% match', matchTone: 'orange', note: 'Added 5 days ago', noteTone: 'slate' },
    ],
  },
  {
    slug: 'screening',
    title: 'QUALIFIED',
    countLabel: '54',
    tone: 'pink',
    selectAllChecked: false,
    cards: [
      { name: 'Isabella Chen', role: 'UX Designer', match: '90% match', matchTone: 'green', note: 'Review pending', noteTone: 'orange', selected: true, hasAiScreeningSummary: true },
      { name: 'James Wilson', role: 'Product Designer', match: '85% match', matchTone: 'green', note: 'Review pending', noteTone: 'orange', selected: true, hasAiScreeningSummary: false },
    ],
  },
  {
    slug: 'interview',
    title: 'SHORTLISTED',
    countLabel: '18',
    tone: 'violet',
    selectAllChecked: true,
    cards: [
      { name: 'Ethan Johnson', role: 'Senior UX Designer', match: '93% match', matchTone: 'green', note: 'Interview tomorrow', noteTone: 'blue', selected: true, hasAssignedInterviewPanel: true, hasInterviewPlanConfigured: true },
      { name: 'Olivia Davis', role: 'UX Designer', match: '91% match', matchTone: 'green', note: 'Interview in 3 days', noteTone: 'blue', selected: true, hasInterviewPlanConfigured: false },
      { name: 'Benjamin Lee', role: 'Product Designer', match: '78% match', matchTone: 'green', note: 'Interview in 3 days', noteTone: 'blue', selected: true, hasInterviewPlanConfigured: true },
    ],
  },
  {
    slug: 'assessment',
    title: 'ASSESSMENT',
    countLabel: '10',
    tone: 'blue',
    selectAllChecked: false,
    cards: [
      { name: 'Charlotte Taylor', role: 'UX Designer', match: '92% match', matchTone: 'green', note: 'Assessment due tomorrow', noteTone: 'orange' },
      { name: 'Daniel Harris', role: 'Product Designer', match: '84% match', matchTone: 'green', note: 'Assessment due in 2 days', noteTone: 'orange' },
    ],
  },
  {
    slug: 'validation',
    title: 'DECISION',
    countLabel: '5',
    tone: 'violet',
    selectAllChecked: false,
    cards: [
      { name: 'Amelia Clark', role: 'Senior UX Designer', match: '95% match', matchTone: 'green', note: 'References complete', noteTone: 'green' },
      { name: 'Lucas Rodriguez', role: 'UX Designer', match: '89% match', matchTone: 'green', note: 'Background check clear', noteTone: 'blue' },
    ],
  },
  {
    slug: 'offer',
    title: 'OFFER',
    countLabel: '5',
    tone: 'green',
    selectAllChecked: false,
    cards: [
      { name: 'Grace Hall', role: 'Senior UX Designer', match: '', matchTone: 'green', note: 'Offer sent', noteTone: 'green' },
      { name: 'Mason White', role: 'UX Designer', match: '', matchTone: 'green', note: 'Awaiting approval', noteTone: 'orange' },
    ],
  },
  {
    slug: 'hired',
    title: 'HIRED',
    countLabel: '5',
    tone: 'green',
    selectAllChecked: false,
    cards: [
      { name: 'Ethan Scott', role: 'UX Designer', match: '', matchTone: 'green', note: 'Starts in 7 days', noteTone: 'blue' },
      { name: 'Sophie Moore', role: 'UX Designer', match: '', matchTone: 'green', note: 'Onboarding', noteTone: 'blue' },
    ],
  },
]

function createPipelineBoard() {
  return pipelineBoardTemplate.map((column, columnIndex) => ({
    ...column,
    cards: column.cards.map((candidate, candidateIndex) => ({
      id: `${column.slug}-${columnIndex}-${candidateIndex}`,
      ...candidate,
    })),
  }))
}

const pipelineBoard = ref(createPipelineBoard())
const draggedCandidateId = ref('')
const draggedFromColumnSlug = ref('')
const dragOverColumnSlug = ref('')
const draggedColumnSlug = ref('')
const columnDragOverSlug = ref('')

watch(job, () => {
  pipelineBoard.value = createPipelineBoard()
  draggedCandidateId.value = ''
  draggedFromColumnSlug.value = ''
  dragOverColumnSlug.value = ''
  draggedColumnSlug.value = ''
  columnDragOverSlug.value = ''
  activeStageMenuCandidateId.value = ''
  activeStageMenuColumnSlug.value = ''
  addNoteCandidateId.value = ''
  addNoteOpen.value = false
  viewNotesCandidateId.value = ''
  viewNotesOpen.value = false
  addTagsCandidateId.value = ''
  addTagsOpen.value = false
  activityLogCandidateId.value = ''
  activityLogOpen.value = false
  archiveCandidateCandidateId.value = ''
  archiveCandidateOpen.value = false
  aiCandidateRankingCandidateId.value = ''
  aiCandidateRankingOpen.value = false
  aiMatchAnalysisCandidateId.value = ''
  aiMatchAnalysisOpen.value = false
  aiInterviewGapAnalysisCandidateId.value = ''
  aiInterviewGapAnalysisOpen.value = false
  aiInterviewReadinessCandidateId.value = ''
  aiInterviewReadinessOpen.value = false
  aiHiringSuccessPredictionCandidateId.value = ''
  aiHiringSuccessPredictionOpen.value = false
  aiQualificationCandidateId.value = ''
  aiQualificationOpen.value = false
  configureInterviewKitCandidateId.value = ''
  configureInterviewKitOpen.value = false
  aiScreeningSummaryCandidateId.value = ''
  aiScreeningSummaryOpen.value = false
  aiRiskDetectionCandidateId.value = ''
  aiRiskDetectionOpen.value = false
  suggestedNextActionCandidateId.value = ''
  suggestedNextActionOpen.value = false
  finalFeedbackReviewCandidateId.value = ''
  finalFeedbackReviewOpen.value = false
  aiAssessmentInsightsCandidateId.value = ''
  aiAssessmentInsightsOpen.value = false
  aiFeedbackQualityCandidateId.value = ''
  aiFeedbackQualityOpen.value = false
  aiScoreCalibrationCandidateId.value = ''
  aiScoreCalibrationOpen.value = false
  aiScorecardBiasCandidateId.value = ''
  aiScorecardBiasOpen.value = false
  aiStageRecommendationCandidateId.value = ''
  aiStageRecommendationOpen.value = false
  aiStrengthsGapsCandidateId.value = ''
  aiStrengthsGapsOpen.value = false
  addToTalentPoolCandidateId.value = ''
  addToTalentPoolOpen.value = false
  assignAssessmentCandidateId.value = ''
  assignAssessmentOpen.value = false
  addAssessmentLibraryOpen.value = false
  assignInterviewPanelCandidateId.value = ''
  assignInterviewPanelOpen.value = false
  checkInterviewerWorkloadCandidateId.value = ''
  checkInterviewerWorkloadOpen.value = false
  interviewPlanSequenceCandidateId.value = ''
  interviewPlanSequenceOpen.value = false
  interviewPlanSequenceInitialView.value = 'auto'
  assignInterviewKitCandidateId.value = ''
  assignInterviewKitOpen.value = false
  assignHiringManagerCandidateId.value = ''
  assignHiringManagerOpen.value = false
  autoDqCandidateId.value = ''
  autoDqOpen.value = false
  confirmAvailabilityCandidateId.value = ''
  confirmAvailabilityOpen.value = false
  confirmInterestCandidateId.value = ''
  confirmInterestOpen.value = false
  confirmSalaryAlignmentCandidateId.value = ''
  confirmSalaryAlignmentOpen.value = false
  feedbackRequestCandidateId.value = ''
  feedbackRequestOpen.value = false
  sendReminderCandidateId.value = ''
  sendReminderOpen.value = false
  assessmentReviewCandidateId.value = ''
  assessmentReviewOpen.value = false
  candidateComparisonCandidateId.value = ''
  candidateComparisonOpen.value = false
  reviewerCalibrationCandidateId.value = ''
  reviewerCalibrationOpen.value = false
  trackAssessmentProgressCandidateId.value = ''
  trackAssessmentProgressOpen.value = false
  interviewScorecardCandidateId.value = ''
  interviewScorecardOpen.value = false
  feedbackStatusCandidateId.value = ''
  feedbackStatusOpen.value = false
  feedbackStatusInitialTab.value = 'status'
  putOnHoldCandidateId.value = ''
  putOnHoldOpen.value = false
  requestSalaryCandidateId.value = ''
  requestSalaryOpen.value = false
  requestHmDecisionCandidateId.value = ''
  requestHmDecisionOpen.value = false
  decisionReviewCandidateId.value = ''
  decisionReviewOpen.value = false
  rejectCandidateCandidateId.value = ''
  rejectCandidateOpen.value = false
  scheduleHmReviewCandidateId.value = ''
  scheduleHmReviewOpen.value = false
  scheduleScreeningCandidateId.value = ''
  scheduleScreeningOpen.value = false
  sendEmailCandidateId.value = ''
  sendEmailOpen.value = false
  shareCandidateCandidateId.value = ''
  shareCandidateOpen.value = false
})

const pipelineColumns = computed(() => pipelineBoard.value)
const visiblePipelineCandidateCount = computed(() => boardVisibleCandidateTotal)
const activeStageMenuCandidate = computed(() => findCandidateById(activeStageMenuCandidateId.value))
const activeStageMenuConfig = computed(() => {
  const baseConfig = stageMenuConfigs[activeStageMenuColumnSlug.value] ?? stageMenuConfigs.applied

  return {
    ...baseConfig,
    sections: baseConfig.sections.map((section) => ({
      ...section,
      items: section.items.filter((item) => (
        item.label !== 'AI Screening Summary' || Boolean(activeStageMenuCandidate.value?.hasAiScreeningSummary)
      )),
    })),
  }
})

function hasStageMenu(columnSlug) {
  return columnSlug === 'applied'
    || columnSlug === 'screening'
    || columnSlug === 'interview'
    || columnSlug === 'assessment'
    || columnSlug === 'validation'
}

function onCandidateDragStart(columnSlug, candidateId) {
  draggedFromColumnSlug.value = columnSlug
  draggedCandidateId.value = candidateId
}

function onCandidateDragEnd() {
  draggedCandidateId.value = ''
  draggedFromColumnSlug.value = ''
  dragOverColumnSlug.value = ''
}

function onColumnDragOver(columnSlug) {
  if (draggedColumnSlug.value) {
    columnDragOverSlug.value = columnSlug
    return
  }

  if (!draggedCandidateId.value) {
    return
  }

  dragOverColumnSlug.value = columnSlug
}

function onColumnDrop(columnSlug) {
  if (draggedColumnSlug.value) {
    const sourceIndex = pipelineBoard.value.findIndex((column) => column.slug === draggedColumnSlug.value)
    const targetIndex = pipelineBoard.value.findIndex((column) => column.slug === columnSlug)

    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
      onColumnDragEnd()
      return
    }

    const [movedColumn] = pipelineBoard.value.splice(sourceIndex, 1)

    if (!movedColumn) {
      onColumnDragEnd()
      return
    }

    pipelineBoard.value.splice(targetIndex, 0, movedColumn)
    onColumnDragEnd()
    return
  }

  if (!draggedCandidateId.value || !draggedFromColumnSlug.value || draggedFromColumnSlug.value === columnSlug) {
    onCandidateDragEnd()
    return
  }

  const sourceColumn = pipelineBoard.value.find((column) => column.slug === draggedFromColumnSlug.value)
  const targetColumn = pipelineBoard.value.find((column) => column.slug === columnSlug)

  if (!sourceColumn || !targetColumn) {
    onCandidateDragEnd()
    return
  }

  const candidateIndex = sourceColumn.cards.findIndex((candidate) => candidate.id === draggedCandidateId.value)

  if (candidateIndex === -1) {
    onCandidateDragEnd()
    return
  }

  const [candidate] = sourceColumn.cards.splice(candidateIndex, 1)

  if (!candidate) {
    onCandidateDragEnd()
    return
  }

  targetColumn.cards.push(candidate)

  onCandidateDragEnd()
}

function onColumnHandleDragStart(columnSlug) {
  draggedColumnSlug.value = columnSlug
  columnDragOverSlug.value = columnSlug
  draggedCandidateId.value = ''
  draggedFromColumnSlug.value = ''
  dragOverColumnSlug.value = ''
}

function onColumnDragEnd() {
  draggedColumnSlug.value = ''
  columnDragOverSlug.value = ''
}

function updateStageMenuPosition(anchorRect) {
  const menuWidth = 292
  const viewportPadding = 16
  const preferredLeft = anchorRect.right - menuWidth
  const clampedLeft = Math.max(viewportPadding, Math.min(preferredLeft, window.innerWidth - menuWidth - viewportPadding))
  const clampedTop = Math.max(96, Math.min(anchorRect.top - 6, window.innerHeight - 120))

  stageMenuPosition.value = {
    top: clampedTop,
    left: clampedLeft,
  }
}

function toggleStageMenu(candidateId, columnSlug, event) {
  if (activeStageMenuCandidateId.value === candidateId) {
    closeStageMenu()
    return
  }

  const anchor = event?.currentTarget

  if (anchor instanceof Element) {
    updateStageMenuPosition(anchor.getBoundingClientRect())
  }

  activeStageMenuColumnSlug.value = columnSlug
  activeStageMenuCandidateId.value = candidateId
}

function closeStageMenu() {
  activeStageMenuCandidateId.value = ''
  activeStageMenuColumnSlug.value = ''
}

function findCandidateById(candidateId) {
  for (const column of pipelineBoard.value) {
    const candidate = column.cards.find((item) => item.id === candidateId)

    if (candidate) {
      return candidate
    }
  }

  return null
}

function moveCandidateToColumn(candidateId, targetColumnSlug) {
  if (!candidateId) {
    return false
  }

  const sourceColumn = pipelineBoard.value.find((column) => column.cards.some((candidate) => candidate.id === candidateId))
  const targetColumn = pipelineBoard.value.find((column) => column.slug === targetColumnSlug)

  if (!sourceColumn || !targetColumn || sourceColumn.slug === targetColumnSlug) {
    return false
  }

  const candidateIndex = sourceColumn.cards.findIndex((candidate) => candidate.id === candidateId)

  if (candidateIndex === -1) {
    return false
  }

  const [candidate] = sourceColumn.cards.splice(candidateIndex, 1)

  if (!candidate) {
    return false
  }

  targetColumn.cards.unshift(candidate)
  closeStageMenu()
  return true
}

function setCandidateInterviewPanelAssigned(candidateId, assigned = true) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  candidate.hasAssignedInterviewPanel = assigned
}

function setCandidateInterviewSequenceAssigned(candidateId, assigned = true) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  candidate.hasAssignedInterviewSequence = assigned
}

function getCandidateStageById(candidateId, fallback = 'Interview') {
  for (const column of pipelineBoard.value) {
    const candidate = column.cards.find((item) => item.id === candidateId)

    if (candidate) {
      if (column.slug === 'applied') return 'Applied'
      if (column.slug === 'screening') return 'Qualified'
      if (column.slug === 'interview') return 'Interview'
      if (column.slug === 'assessment') return 'Assessment'
      if (column.slug === 'validation') return 'Decision'
      if (column.slug === 'offer') return 'Offer'
      if (column.slug === 'hired') return 'Hired'
    }
  }

  return fallback
}

const selectedScheduleCandidate = computed(() => (
  findCandidateById(scheduleScreeningCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedConfirmInterestCandidate = computed(() => (
  findCandidateById(confirmInterestCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedConfirmAvailabilityCandidate = computed(() => (
  findCandidateById(confirmAvailabilityCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards[0]
  ?? null
))

const selectedConfirmSalaryAlignmentCandidate = computed(() => (
  findCandidateById(confirmSalaryAlignmentCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards[0]
  ?? null
))

const selectedAutoDqCandidate = computed(() => (
  findCandidateById(autoDqCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedTalentPoolCandidate = computed(() => (
  findCandidateById(addToTalentPoolCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedAiAssessmentInsightsCandidate = computed(() => (
  findCandidateById(aiAssessmentInsightsCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAiFeedbackQualityCandidate = computed(() => (
  findCandidateById(aiFeedbackQualityCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAiScoreCalibrationCandidate = computed(() => (
  findCandidateById(aiScoreCalibrationCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAiScorecardBiasCandidate = computed(() => (
  findCandidateById(aiScorecardBiasCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAiStageRecommendationCandidate = computed(() => (
  findCandidateById(aiStageRecommendationCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAiStrengthsGapsCandidate = computed(() => (
  findCandidateById(aiStrengthsGapsCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAssignHiringManagerCandidate = computed(() => (
  findCandidateById(assignHiringManagerCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards[0]
  ?? null
))

const selectedAssignAssessmentCandidate = computed(() => (
  findCandidateById(assignAssessmentCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? null
))

const selectedAssignInterviewPanelCandidate = computed(() => (
  findCandidateById(assignInterviewPanelCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedCheckInterviewerWorkloadCandidate = computed(() => (
  findCandidateById(checkInterviewerWorkloadCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedInterviewPlanSequenceCandidate = computed(() => (
  findCandidateById(interviewPlanSequenceCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAssignInterviewKitCandidate = computed(() => (
  findCandidateById(assignInterviewKitCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedRequestSalaryCandidate = computed(() => (
  findCandidateById(requestSalaryCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedRequestHmDecisionCandidate = computed(() => (
  findCandidateById(requestHmDecisionCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards[0]
  ?? null
))

const selectedDecisionReviewCandidate = computed(() => (
  findCandidateById(decisionReviewCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'validation')?.cards[0]
  ?? null
))

const selectedPutOnHoldCandidate = computed(() => (
  findCandidateById(putOnHoldCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedEmailCandidate = computed(() => (
  findCandidateById(sendEmailCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedAiMatchCandidate = computed(() => (
  findCandidateById(aiMatchAnalysisCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedAiInterviewGapAnalysisCandidate = computed(() => (
  findCandidateById(aiInterviewGapAnalysisCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAiQualificationCandidate = computed(() => (
  findCandidateById(aiQualificationCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards[0]
  ?? null
))

const selectedAiInterviewReadinessCandidate = computed(() => (
  findCandidateById(aiInterviewReadinessCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards[0]
  ?? null
))

const selectedConfigureInterviewKitCandidate = computed(() => (
  findCandidateById(configureInterviewKitCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAiHiringSuccessPredictionCandidate = computed(() => (
  findCandidateById(aiHiringSuccessPredictionCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards[0]
  ?? null
))

const selectedAiScreeningSummaryCandidate = computed(() => (
  findCandidateById(aiScreeningSummaryCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards.find((candidate) => candidate.hasAiScreeningSummary)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards[0]
  ?? null
))

const selectedAiCandidateRankingCandidate = computed(() => (
  findCandidateById(aiCandidateRankingCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedAiCandidateRankingStage = computed(() => getCandidateStageById(aiCandidateRankingCandidateId.value))

const selectedSuggestedNextActionCandidate = computed(() => (
  findCandidateById(suggestedNextActionCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedSuggestedNextActionStage = computed(() => getCandidateStageById(suggestedNextActionCandidateId.value))

const selectedFinalFeedbackReviewCandidate = computed(() => (
  findCandidateById(finalFeedbackReviewCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'validation')?.cards[0]
  ?? null
))

const selectedCreateHiringDecisionCandidate = computed(() => (
  findCandidateById(createHiringDecisionCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'validation')?.cards[0]
  ?? null
))

const selectedAiRiskDetectionCandidate = computed(() => (
  findCandidateById(aiRiskDetectionCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedAiRiskDetectionStage = computed(() => getCandidateStageById(aiRiskDetectionCandidateId.value))

const selectedAddNoteCandidate = computed(() => (
  findCandidateById(addNoteCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedViewNotesCandidate = computed(() => (
  findCandidateById(viewNotesCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAddNoteStage = computed(() => `${getCandidateStageById(addNoteCandidateId.value)} Stage`)
const selectedViewNotesStage = computed(() => `${getCandidateStageById(viewNotesCandidateId.value)} Stage`)

const selectedShareCandidate = computed(() => (
  findCandidateById(shareCandidateCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedArchiveCandidate = computed(() => (
  findCandidateById(archiveCandidateCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedActivityLogCandidate = computed(() => (
  findCandidateById(activityLogCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedRejectCandidate = computed(() => (
  findCandidateById(rejectCandidateCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'applied')?.cards[0]
  ?? null
))

const selectedRejectCandidateStage = computed(() => getCandidateStageById(rejectCandidateCandidateId.value))
const selectedScheduleHmReviewCandidate = computed(() => (
  findCandidateById(scheduleHmReviewCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'screening')?.cards[0]
  ?? null
))

const selectedFeedbackRequestCandidate = computed(() => (
  findCandidateById(feedbackRequestCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedFinalFeedbackRequestCandidate = computed(() => (
  findCandidateById(finalFeedbackRequestCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'validation')?.cards[0]
  ?? null
))

const selectedSendReminderCandidate = computed(() => (
  findCandidateById(sendReminderCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedAssessmentReviewCandidate = computed(() => (
  findCandidateById(assessmentReviewCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? null
))

const selectedCandidateComparisonCandidate = computed(() => (
  findCandidateById(candidateComparisonCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? null
))

const selectedReviewerCalibrationCandidate = computed(() => (
  findCandidateById(reviewerCalibrationCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? null
))

const selectedReviewerCalibrationCount = computed(() => {
  const candidateName = selectedReviewerCalibrationCandidate.value?.name

  if (candidateName === 'Daniel Harris') {
    return 4
  }

  return 1
})

const selectedTrackAssessmentProgressCandidate = computed(() => (
  findCandidateById(trackAssessmentProgressCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? null
))

const selectedInterviewScorecardCandidate = computed(() => (
  findCandidateById(interviewScorecardCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

const selectedFeedbackStatusCandidate = computed(() => (
  findCandidateById(feedbackStatusCandidateId.value)
  ?? pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]
  ?? null
))

function openScheduleHmReview(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  scheduleHmReviewCandidateId.value = candidate.id
  scheduleHmReviewOpen.value = true
  closeStageMenu()
}

function closeScheduleHmReview() {
  scheduleHmReviewOpen.value = false
}

function openRequestFeedback(candidateId = activeStageMenuCandidateId.value) {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  feedbackRequestCandidateId.value = candidate.id
  feedbackRequestOpen.value = true
  closeStageMenu()
}

function closeRequestFeedback() {
  feedbackRequestOpen.value = false
}

function openRequestFinalFeedback(candidateId = activeStageMenuCandidateId.value) {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'validation')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  finalFeedbackRequestCandidateId.value = candidate.id
  finalFeedbackRequestOpen.value = true
  closeStageMenu()
}

function closeRequestFinalFeedback() {
  finalFeedbackRequestOpen.value = false
}

function openSendReminder(candidateId = activeStageMenuCandidateId.value) {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  sendReminderCandidateId.value = candidate.id
  sendReminderOpen.value = true
  closeStageMenu()
}

function closeSendReminder() {
  sendReminderOpen.value = false
}

function submitRequestFeedback() {
  const candidateId = feedbackRequestCandidateId.value

  feedbackRequestOpen.value = false

  if (!candidateId) {
    return
  }

  feedbackStatusCandidateId.value = candidateId
  feedbackStatusInitialTab.value = 'status'
  feedbackStatusOpen.value = true
}

function openViewFeedbackStatus(candidateId = activeStageMenuCandidateId.value, tab = 'status') {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  feedbackStatusCandidateId.value = candidate.id
  feedbackStatusInitialTab.value = tab === 'insights' ? 'insights' : 'status'
  feedbackStatusOpen.value = true
  closeStageMenu()
}

function openAssessmentReview(candidateId = activeStageMenuCandidateId.value) {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  assessmentReviewCandidateId.value = candidate.id
  assessmentReviewOpen.value = true
  closeStageMenu()
}

function closeAssessmentReview() {
  assessmentReviewOpen.value = false
}

function openCandidateComparison(candidateId = activeStageMenuCandidateId.value) {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  candidateComparisonCandidateId.value = candidate.id
  candidateComparisonOpen.value = true
  closeStageMenu()
}

function closeCandidateComparison() {
  candidateComparisonOpen.value = false
}

function openReviewerCalibration(candidateId = activeStageMenuCandidateId.value) {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  reviewerCalibrationCandidateId.value = candidate.id
  reviewerCalibrationOpen.value = true
  closeStageMenu()
}

function closeReviewerCalibration() {
  reviewerCalibrationOpen.value = false
}

function openTrackAssessmentProgress(candidateId = activeStageMenuCandidateId.value) {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  trackAssessmentProgressCandidateId.value = candidate.id
  trackAssessmentProgressOpen.value = true
  closeStageMenu()
}

function closeTrackAssessmentProgress() {
  trackAssessmentProgressOpen.value = false
}

function openInterviewScorecard(candidateId = activeStageMenuCandidateId.value) {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'assessment')?.cards[0]?.id
    || pipelineBoard.value.find((column) => column.slug === 'interview')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  interviewScorecardCandidateId.value = candidate.id
  interviewScorecardOpen.value = true
  closeStageMenu()
}

function closeInterviewScorecard() {
  interviewScorecardOpen.value = false
}

function closeViewFeedbackStatus() {
  feedbackStatusOpen.value = false
  feedbackStatusInitialTab.value = 'status'
}

function openScheduleScreening(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  scheduleScreeningCandidateId.value = candidate.id
  scheduleScreeningOpen.value = true
  closeStageMenu()
}

function closeScheduleScreening() {
  scheduleScreeningOpen.value = false
}

function openAiCandidateRanking(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiCandidateRankingCandidateId.value = candidate.id
  aiCandidateRankingOpen.value = true
  closeStageMenu()
}

function closeAiCandidateRanking() {
  aiCandidateRankingOpen.value = false
}

function openAiMatchAnalysis(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiMatchAnalysisCandidateId.value = candidate.id
  aiMatchAnalysisOpen.value = true
  closeStageMenu()
}

function closeAiMatchAnalysis() {
  aiMatchAnalysisOpen.value = false
}

function openAiInterviewGapAnalysis(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiInterviewGapAnalysisCandidateId.value = candidate.id
  aiInterviewGapAnalysisOpen.value = true
  closeStageMenu()
}

function closeAiInterviewGapAnalysis() {
  aiInterviewGapAnalysisOpen.value = false
}

function openAiInterviewReadiness(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiInterviewReadinessCandidateId.value = candidate.id
  aiInterviewReadinessOpen.value = true
  closeStageMenu()
}

function closeAiInterviewReadiness() {
  aiInterviewReadinessOpen.value = false
}

function openAiHiringSuccessPrediction(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiHiringSuccessPredictionCandidateId.value = candidate.id
  aiHiringSuccessPredictionOpen.value = true
  closeStageMenu()
}

function closeAiHiringSuccessPrediction() {
  aiHiringSuccessPredictionOpen.value = false
}

function openAiQualification(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiQualificationCandidateId.value = candidate.id
  aiQualificationOpen.value = true
  closeStageMenu()
}

function closeAiQualification() {
  aiQualificationOpen.value = false
}

function openAiScreeningSummary(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate?.hasAiScreeningSummary) {
    return
  }

  aiScreeningSummaryCandidateId.value = candidate.id
  aiScreeningSummaryOpen.value = true
  closeStageMenu()
}

function closeAiScreeningSummary() {
  aiScreeningSummaryOpen.value = false
}

function handleScreeningScheduled(candidateId, payload) {
  if (!payload?.summaryAvailable) {
    return
  }

  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  candidate.hasAiScreeningSummary = true
}

function openAiRiskDetection(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiRiskDetectionCandidateId.value = candidate.id
  aiRiskDetectionOpen.value = true
  closeStageMenu()
}

function closeAiRiskDetection() {
  aiRiskDetectionOpen.value = false
}

function openSuggestedNextAction(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  suggestedNextActionCandidateId.value = candidate.id
  suggestedNextActionOpen.value = true
  closeStageMenu()
}

function closeSuggestedNextAction() {
  suggestedNextActionOpen.value = false
}

async function openSuggestedNextActionFromMenu(candidateId = activeStageMenuCandidateId.value) {
  openSuggestedNextAction(candidateId)
}

function openFinalFeedbackReview(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  finalFeedbackReviewCandidateId.value = candidate.id
  finalFeedbackReviewOpen.value = true
  closeStageMenu()
}

function closeFinalFeedbackReview() {
  finalFeedbackReviewOpen.value = false
}

function openCreateHiringDecision(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  createHiringDecisionCandidateId.value = candidate.id
  createHiringDecisionOpen.value = true
  closeStageMenu()
}

function closeCreateHiringDecision() {
  createHiringDecisionOpen.value = false
}

function openAddNote(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  addNoteCandidateId.value = candidate.id
  addNoteOpen.value = true
  closeStageMenu()
}

function closeAddNote() {
  addNoteOpen.value = false
}

function openViewNotes(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  viewNotesCandidateId.value = candidate.id
  viewNotesOpen.value = true
  closeStageMenu()
}

function closeViewNotes() {
  viewNotesOpen.value = false
}

async function openAddNoteFromViewNotes() {
  const candidateId = viewNotesCandidateId.value

  viewNotesOpen.value = false
  await nextTick()
  openAddNote(candidateId)
}

function openAddTags(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  addTagsCandidateId.value = candidate.id
  addTagsOpen.value = true
  closeStageMenu()
}

function closeAddTags() {
  addTagsOpen.value = false
}

function openActivityLog(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  activityLogCandidateId.value = candidate.id
  activityLogOpen.value = true
  closeStageMenu()
}

function closeActivityLog() {
  activityLogOpen.value = false
}

function openArchiveCandidate(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  archiveCandidateCandidateId.value = candidate.id
  archiveCandidateOpen.value = true
  closeStageMenu()
}

function closeArchiveCandidate() {
  archiveCandidateOpen.value = false
}

function openPutOnHold(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  putOnHoldCandidateId.value = candidate.id
  putOnHoldOpen.value = true
  closeStageMenu()
}

function closePutOnHold() {
  putOnHoldOpen.value = false
}

function openShareCandidate(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  shareCandidateCandidateId.value = candidate.id
  shareCandidateOpen.value = true
  closeStageMenu()
}

function closeShareCandidate() {
  shareCandidateOpen.value = false
}

function openRejectCandidate(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  rejectCandidateCandidateId.value = candidate.id
  rejectCandidateOpen.value = true
  closeStageMenu()
}

function closeRejectCandidate() {
  rejectCandidateOpen.value = false
}

function openConfirmInterest(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  confirmInterestCandidateId.value = candidate.id
  confirmInterestOpen.value = true
  closeStageMenu()
}

function closeConfirmInterest() {
  confirmInterestOpen.value = false
}

function openConfirmAvailability(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  confirmAvailabilityCandidateId.value = candidate.id
  confirmAvailabilityOpen.value = true
  closeStageMenu()
}

function closeConfirmAvailability() {
  confirmAvailabilityOpen.value = false
}

function openConfirmSalaryAlignment(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  confirmSalaryAlignmentCandidateId.value = candidate.id
  confirmSalaryAlignmentOpen.value = true
  closeStageMenu()
}

function closeConfirmSalaryAlignment() {
  confirmSalaryAlignmentOpen.value = false
}

function openAutoDq(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  autoDqCandidateId.value = candidate.id
  autoDqOpen.value = true
  closeStageMenu()
}

function closeAutoDq() {
  autoDqOpen.value = false
}

function openAddToTalentPool(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  addToTalentPoolCandidateId.value = candidate.id
  addToTalentPoolOpen.value = true
  closeStageMenu()
}

function closeAddToTalentPool() {
  addToTalentPoolOpen.value = false
}

function openAiAssessmentInsights(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiAssessmentInsightsCandidateId.value = candidate.id
  aiAssessmentInsightsOpen.value = true
  closeStageMenu()
}

function closeAiAssessmentInsights() {
  aiAssessmentInsightsOpen.value = false
}

function openAiFeedbackQuality(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiFeedbackQualityCandidateId.value = candidate.id
  aiFeedbackQualityOpen.value = true
  closeStageMenu()
}

function closeAiFeedbackQuality() {
  aiFeedbackQualityOpen.value = false
}

function openAiScoreCalibration(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiScoreCalibrationCandidateId.value = candidate.id
  aiScoreCalibrationOpen.value = true
  closeStageMenu()
}

function closeAiScoreCalibration() {
  aiScoreCalibrationOpen.value = false
}

function openAiScorecardBiasDetection(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiScorecardBiasCandidateId.value = candidate.id
  aiScorecardBiasOpen.value = true
  closeStageMenu()
}

function closeAiScorecardBiasDetection() {
  aiScorecardBiasOpen.value = false
}

function openAiStageRecommendation(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiStageRecommendationCandidateId.value = candidate.id
  aiStageRecommendationOpen.value = true
  closeStageMenu()
}

function closeAiStageRecommendation() {
  aiStageRecommendationOpen.value = false
}

function openAiStrengthsGaps(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  aiStrengthsGapsCandidateId.value = candidate.id
  aiStrengthsGapsOpen.value = true
  closeStageMenu()
}

function closeAiStrengthsGaps() {
  aiStrengthsGapsOpen.value = false
}

function openAssignHiringManager(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  assignHiringManagerCandidateId.value = candidate.id
  assignHiringManagerOpen.value = true
  closeStageMenu()
}

function closeAssignHiringManager() {
  assignHiringManagerOpen.value = false
}

function openAssignAssessment(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  assignAssessmentCandidateId.value = candidate.id
  assignAssessmentOpen.value = true
  closeStageMenu()
}

function closeAssignAssessment() {
  assignAssessmentOpen.value = false
}

function openAddAssessmentLibrary() {
  assignAssessmentOpen.value = false
  addAssessmentLibraryOpen.value = true
}

function closeAddAssessmentLibrary() {
  addAssessmentLibraryOpen.value = false

  if (assignAssessmentCandidateId.value) {
    assignAssessmentOpen.value = true
  }
}

function handleAssessmentLibrarySubmit() {
  addAssessmentLibraryOpen.value = false

  if (assignAssessmentCandidateId.value) {
    assignAssessmentOpen.value = true
  }
}

function handleAssignAssessmentSubmit() {
  const candidateId = assignAssessmentCandidateId.value

  assignAssessmentOpen.value = false

  if (!candidateId) {
    return
  }

  moveCandidateToColumn(candidateId, 'assessment')
}

function openAssignInterviewPanel(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  assignInterviewPanelCandidateId.value = candidate.id
  assignInterviewPanelOpen.value = true
  closeStageMenu()
}

function closeAssignInterviewPanel() {
  assignInterviewPanelOpen.value = false
}

function openCheckInterviewerWorkload(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  checkInterviewerWorkloadCandidateId.value = candidate.id
  checkInterviewerWorkloadOpen.value = true
  closeStageMenu()
}

function closeCheckInterviewerWorkload() {
  checkInterviewerWorkloadOpen.value = false
}

function openInterviewPlanSequence(candidateId = activeStageMenuCandidateId.value, initialView = 'auto') {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  interviewPlanSequenceCandidateId.value = candidate.id
  interviewPlanSequenceInitialView.value = initialView
  interviewPlanSequenceOpen.value = true
  closeStageMenu()
}

function closeInterviewPlanSequence() {
  interviewPlanSequenceOpen.value = false
  interviewPlanSequenceInitialView.value = 'auto'
}

function openAssignInterviewKit(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  assignInterviewKitCandidateId.value = candidate.id
  assignInterviewKitOpen.value = true
  closeStageMenu()
}

function closeAssignInterviewKit() {
  assignInterviewKitOpen.value = false
}

async function openConfigureInterviewKitFromAssign() {
  const candidateId = assignInterviewKitCandidateId.value

  assignInterviewKitOpen.value = false
  await nextTick()

  if (candidateId) {
    configureInterviewKitCandidateId.value = candidateId
    configureInterviewKitOpen.value = true
  }
}

function openConfigureInterviewKit(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  configureInterviewKitCandidateId.value = candidate.id
  configureInterviewKitOpen.value = true
  closeStageMenu()
}

function closeConfigureInterviewKit() {
  configureInterviewKitOpen.value = false
}

function openRequestSalary(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  requestSalaryCandidateId.value = candidate.id
  requestSalaryOpen.value = true
  closeStageMenu()
}

function closeRequestSalary() {
  requestSalaryOpen.value = false
}

function openRequestHmDecision(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  requestHmDecisionCandidateId.value = candidate.id
  requestHmDecisionOpen.value = true
  closeStageMenu()
}

function closeRequestHmDecision() {
  requestHmDecisionOpen.value = false
}

function openDecisionReview(candidateId = activeStageMenuCandidateId.value) {
  const resolvedCandidateId = candidateId
    || activeStageMenuCandidateId.value
    || pipelineBoard.value.find((column) => column.slug === 'validation')?.cards[0]?.id
    || ''
  const candidate = findCandidateById(resolvedCandidateId)

  if (!candidate) {
    return
  }

  decisionReviewCandidateId.value = candidate.id
  decisionReviewOpen.value = true
  closeStageMenu()
}

function closeDecisionReview() {
  decisionReviewOpen.value = false
}

function openSendEmail(candidateId = activeStageMenuCandidateId.value) {
  const candidate = findCandidateById(candidateId)

  if (!candidate) {
    return
  }

  sendEmailCandidateId.value = candidate.id
  sendEmailOpen.value = true
  closeStageMenu()
}

function closeSendEmail() {
  sendEmailOpen.value = false
}

function openCompareCandidatesView() {
  activeBoardView.value = 'compare'
}

function handleStageMenuAction(actionLabel) {
  if (actionLabel === 'Move to Qualified') {
    moveCandidateToColumn(activeStageMenuCandidateId.value, 'screening')
    return
  }

  if (actionLabel === 'Move to Shortlisted') {
    moveCandidateToColumn(activeStageMenuCandidateId.value, 'interview')
    return
  }

  if (actionLabel === 'Schedule Interview') {
    openScheduleHmReview()
    return
  }

  if (actionLabel === 'Move to Assessment') {
    moveCandidateToColumn(activeStageMenuCandidateId.value, 'assessment')
    return
  }

  if (actionLabel === 'Move to Validation') {
    moveCandidateToColumn(activeStageMenuCandidateId.value, 'validation')
    return
  }

  if (actionLabel === 'Move to Offer') {
    moveCandidateToColumn(activeStageMenuCandidateId.value, 'offer')
    return
  }

  if (actionLabel === 'Schedule Screening') {
    openScheduleScreening()
    return
  }

  if (actionLabel === 'Schedule HM Review') {
    openScheduleHmReview()
    return
  }

  if (actionLabel === 'Schedule Final Meeting') {
    openScheduleHmReview()
    return
  }

  if (actionLabel === 'Request HM Review') {
    openRequestHmDecision()
    return
  }

  if (actionLabel === 'Send Email') {
    openSendEmail()
    return
  }

  if (actionLabel === 'Confirm Interest') {
    openConfirmInterest()
    return
  }

  if (actionLabel === 'Request Salary Expectations') {
    openRequestSalary()
    return
  }

  if (actionLabel === 'Auto DQ / Knockout') {
    openAutoDq()
    return
  }

  if (actionLabel === 'Add to Talent Pool') {
    openAddToTalentPool()
    return
  }

  if (actionLabel === 'Assign Hiring Manager') {
    openAssignHiringManager()
    return
  }

  if (actionLabel === 'Assign Interview Panel') {
    openAssignInterviewPanel()
    return
  }

  if (actionLabel === 'Assign Interview Kit') {
    openAssignInterviewKit()
    return
  }

  if (actionLabel === 'Request Candidate Availability') {
    openConfirmAvailability()
    return
  }

  if (actionLabel === 'Interview Plan & Sequence') {
    openInterviewPlanSequence(activeStageMenuCandidateId.value, 'recommend')
    return
  }

  if (actionLabel === 'Check Interviewer Workload') {
    openCheckInterviewerWorkload()
    return
  }

  if (actionLabel === 'Assign Assessment') {
    openAssignAssessment()
    return
  }

  if (actionLabel === 'Confirm Availability') {
    openConfirmAvailability()
    return
  }

  if (actionLabel === 'Confirm Salary Alignment') {
    openConfirmSalaryAlignment()
    return
  }

  if (actionLabel === 'Conduct Screening Call') {
    openScheduleScreening()
    return
  }

  if (actionLabel === 'Add Notes & Tags') {
    openAddNote()
    return
  }

  if (actionLabel === 'AI Match Analysis') {
    openAiMatchAnalysis()
    return
  }

  if (actionLabel === 'AI Candidate Ranking') {
    openAiCandidateRanking()
    return
  }

  if (actionLabel === 'AI Risk Detection') {
    openAiRiskDetection()
    return
  }

  if (actionLabel === 'AI Interview Readiness') {
    openAiInterviewReadiness()
    return
  }

  if (actionLabel === 'AI Interview Gap Analysis') {
    openAiInterviewGapAnalysis()
    return
  }

  if (actionLabel === 'AI Interview Panel Review') {
    openInterviewPlanSequence(activeStageMenuCandidateId.value, 'review')
    return
  }

  if (actionLabel === 'AI Interview Kit Review') {
    openConfigureInterviewKit()
    return
  }

  if (actionLabel === 'AI Qualification Score') {
    openAiQualification()
    return
  }

  if (actionLabel === 'AI Hiring Success Prediction') {
    openAiHiringSuccessPrediction()
    return
  }

  if (actionLabel === 'AI Screening Summary') {
    openAiScreeningSummary()
    return
  }

  if (actionLabel === 'Recommended Next Step') {
    openSuggestedNextActionFromMenu(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Hiring Manager Match') {
    openAiCandidateRanking()
    return
  }

  if (actionLabel === 'Suggested Next Action') {
    openSuggestedNextActionFromMenu(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'Request Feedback') {
    openRequestFeedback()
    return
  }

  if (actionLabel === 'Request Final Feedback') {
    openRequestFinalFeedback()
    return
  }

  if (actionLabel === 'Assessment Review') {
    openAssessmentReview(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'Review Final Feedback') {
    openFinalFeedbackReview(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'Create Hiring Decision') {
    openCreateHiringDecision(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'Decision Review' || actionLabel === 'Hiring Committee Review') {
    openDecisionReview(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'Select Backup Candidate') {
    openCandidateComparison(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'Track Assessment Progress') {
    openTrackAssessmentProgress(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'View Interview Scorecards') {
    openInterviewScorecard(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'View Feedback Status') {
    openViewFeedbackStatus(activeStageMenuCandidateId.value, 'status')
    return
  }

  if (actionLabel === 'Send Reminder') {
    openSendReminder()
    return
  }

  if (actionLabel === 'Add Note') {
    openAddNote()
    return
  }

  if (actionLabel === 'Add Internal Feedback') {
    openCompleteFeedbackModal(activeStageMenuCandidateId.value || undefined)
    closeStageMenu()
    return
  }

  if (actionLabel === 'Add Tags') {
    openAddTags()
    return
  }

  if (actionLabel === 'View Note' || actionLabel === 'View Notes') {
    openViewNotes()
    return
  }

  if (actionLabel === 'Compare Candidate') {
    openCompareCandidatesView()
    closeStageMenu()
    return
  }

  if (actionLabel === 'Candidate Comparison') {
    openCandidateComparison(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'Reviewer Calibration') {
    openReviewerCalibration(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'Add Feedback') {
    openCompleteFeedbackModal()
    closeStageMenu()
    return
  }

  if (actionLabel === 'Submit Feedback') {
    openCompleteFeedbackModal(activeStageMenuCandidateId.value || undefined)
    closeStageMenu()
    return
  }

  if (actionLabel === 'View Feedback') {
    openViewFeedbackStatus(activeStageMenuCandidateId.value, 'status')
    return
  }

  if (actionLabel === 'AI Assessment Insights') {
    openAiAssessmentInsights(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Strengths & Gaps') {
    openAiStrengthsGaps(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Feedback Quality') {
    openAiFeedbackQuality(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Hiring Recommendation') {
    openSuggestedNextActionFromMenu(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Decision Summary') {
    openSuggestedNextActionFromMenu(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Confidence Breakdown' || actionLabel === 'AI Consensus Analysis') {
    openAiScoreCalibration(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Risk Analysis') {
    openAiRiskDetection(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Compare Finalists') {
    openCandidateComparison(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Stage Recommendation') {
    openAiStageRecommendation(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Scorecard Bias Detection') {
    openAiScorecardBiasDetection(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'AI Score Calibration') {
    openAiScoreCalibration(activeStageMenuCandidateId.value)
    return
  }

  if (actionLabel === 'Share Candidate') {
    openShareCandidate()
    return
  }

  if (actionLabel === 'Put On Hold') {
    openPutOnHold()
    return
  }

  if (actionLabel === 'Archive Candidate') {
    openArchiveCandidate()
    return
  }

  if (actionLabel === 'Activity Log') {
    openActivityLog()
    return
  }

  if (actionLabel === 'Assessment History') {
    openActivityLog()
    return
  }

  if (actionLabel === 'Reject Candidate') {
    openRejectCandidate()
    return
  }

  closeStageMenu()
}

function handleStageMenuDocumentClick(event) {
  const target = event.target

  if (!(target instanceof Element)) {
    return
  }

  if (target.closest('.job-pipeline-stage-menu-anchor') || target.closest('.job-pipeline-stage-menu')) {
    return
  }

  closeStageMenu()
}

function handleStageMenuViewportChange(event) {
  const target = event?.target

  if (target instanceof Element && target.closest('.job-pipeline-stage-menu')) {
    return
  }

  closeStageMenu()
}

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
  { title: 'Complete scorecard', note: 'For Liam Johnson', meta: 'Due in 2 days', tone: 'orange', icon: 'clipboard-check', action: 'complete-feedback', candidateId: 'liam-johnson' },
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

const reviewFeedbackSummary = {
  title: 'Send feedback to 5 candidates',
  note: 'Feedback is overdue and candidates are waiting.',
  job: 'Graphic Designer',
  impact: 'Reduce delay by 4 days',
  priority: 'High',
  priorityTone: 'pink',
  why: 'These candidates are waiting for your feedback. Providing feedback will help move them forward and reduce time-to-hire.',
  impactCards: [
    { icon: 'users', tone: 'green', value: '+4', label: 'Potential hires', note: 'Additional hires likely' },
    { icon: 'clock', tone: 'blue', value: '-4 days', label: 'Time-to-hire', note: 'Faster hiring cycle' },
    { icon: 'user-check', tone: 'violet', value: '5', label: 'Candidates', note: 'will move forward' },
  ],
  tip: 'Start with the most overdue interviews first. It clears the bottleneck faster and shortens the cycle for everyone else.',
}

const reviewFeedbackCandidates = [
  {
    id: 'ethan-miller',
    initials: 'EM',
    name: 'Ethan Miller',
    role: 'Graphic Designer',
    appliedOn: '12 May',
    source: 'LinkedIn',
    sourceTone: 'blue',
    stage: 'Interview',
    stageDetail: '2nd Round',
    stageTone: 'violet',
    lastActivity: '5 days ago',
    waiting: '5 days',
    avatarTone: 'brown',
    ownFeedback: true,
  },
  {
    id: 'olivia-smith',
    initials: 'DB',
    name: 'Olivia Smith',
    role: 'Graphic Designer',
    appliedOn: '14 May',
    source: 'Careers Page',
    sourceTone: 'green',
    stage: 'Interview',
    stageDetail: '2nd Round',
    stageTone: 'violet',
    lastActivity: '6 days ago',
    waiting: '6 days',
    avatarTone: 'sand',
    ownFeedback: false,
    missingFrom: 'Alex Rivera',
  },
  {
    id: 'liam-johnson',
    initials: 'LJ',
    name: 'Liam Johnson',
    role: 'Graphic Designer',
    appliedOn: '15 May',
    source: 'eReferral',
    sourceTone: 'orange',
    stage: 'Assessment',
    stageDetail: 'Design Test',
    stageTone: 'yellow',
    lastActivity: '7 days ago',
    waiting: '7 days',
    avatarTone: 'amber',
    ownFeedback: false,
    missingFrom: 'Hiring Manager',
  },
  {
    id: 'ava-brown',
    initials: 'AB',
    name: 'Ava Brown',
    role: 'Graphic Designer',
    appliedOn: '16 May',
    source: 'LinkedIn',
    sourceTone: 'blue',
    stage: 'Assessment',
    stageDetail: 'Portfolio Review',
    stageTone: 'yellow',
    lastActivity: '8 days ago',
    waiting: '8 days',
    avatarTone: 'rose',
    ownFeedback: true,
  },
  {
    id: 'maya-chen',
    initials: 'MC',
    name: 'Maya Chen',
    role: 'Graphic Designer',
    appliedOn: '18 May',
    source: 'Indeed',
    sourceTone: 'orange',
    stage: 'Interview',
    stageDetail: 'Portfolio Review',
    stageTone: 'blue',
    lastActivity: '9 days ago',
    waiting: '9 days',
    avatarTone: 'olive',
    ownFeedback: false,
    missingFrom: 'John Lee',
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
const selectedFeedbackCandidateId = ref('ethan-miller')
const reviewFeedbackSelected = ref(reviewFeedbackCandidates.map((candidate) => candidate.id))
const feedbackRecommendation = ref('strong-hire')
const feedbackNotes = ref('')
const feedbackAssistantExpanded = ref(false)
const feedbackRatings = ref(
  feedbackEvaluationTemplate.reduce((accumulator, item) => {
    accumulator[item.key] = item.rating
    return accumulator
  }, {}),
)

const selectedFeedbackCandidate = computed(
  () => reviewFeedbackCandidates.find((candidate) => candidate.id === selectedFeedbackCandidateId.value) ?? reviewFeedbackCandidates[0],
)

const reviewFeedbackSelectedCount = computed(() => reviewFeedbackSelected.value.length)
const reviewFeedbackAllSelected = computed(() => {
  return reviewFeedbackCandidates.length > 0 && reviewFeedbackSelected.value.length === reviewFeedbackCandidates.length
})
const reviewFeedbackSendLabel = computed(() => {
  const count = reviewFeedbackSelectedCount.value
  return `Send feedback to ${count} ${count === 1 ? 'candidate' : 'candidates'}`
})
const reviewFeedbackPrimaryCandidateId = computed(() => {
  const selectedOwnFeedbackCandidate = reviewFeedbackCandidates.find(
    (candidate) => reviewFeedbackSelected.value.includes(candidate.id) && candidate.ownFeedback,
  )

  return selectedOwnFeedbackCandidate?.id ?? reviewFeedbackCandidates.find((candidate) => candidate.ownFeedback)?.id ?? reviewFeedbackCandidates[0]?.id ?? ''
})

const feedbackEvaluationRows = computed(() =>
  feedbackEvaluationTemplate.map((item) => ({
    ...item,
    rating: feedbackRatings.value[item.key] ?? item.rating,
  })),
)

const feedbackAssistantQualityItems = [
  { label: 'Strength Coverage', value: 'Good', tone: 'green' },
  { label: 'Evidence Coverage', value: 'Missing examples', tone: 'orange' },
  { label: 'Clarity', value: 'Strong', tone: 'green' },
  { label: 'Bias Detection', value: 'No issues found', tone: 'green' },
]

const feedbackNoteCount = computed(() => feedbackNotes.value.length)

function openReviewFeedbackModal() {
  reviewFeedbackSelected.value = reviewFeedbackCandidates.map((candidate) => candidate.id)
  reviewFeedbackModal.value = 'list'
}

function openCompleteFeedbackModal(candidateId = 'ethan-miller') {
  selectedFeedbackCandidateId.value = candidateId
  feedbackAssistantExpanded.value = false
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

function toggleFeedbackAssistant() {
  feedbackAssistantExpanded.value = !feedbackAssistantExpanded.value
}

function toggleReviewFeedbackCandidate(candidateId) {
  if (reviewFeedbackSelected.value.includes(candidateId)) {
    reviewFeedbackSelected.value = reviewFeedbackSelected.value.filter((id) => id !== candidateId)
    return
  }

  reviewFeedbackSelected.value = [...reviewFeedbackSelected.value, candidateId]
}

function toggleReviewFeedbackSelectAll() {
  if (reviewFeedbackAllSelected.value) {
    reviewFeedbackSelected.value = []
    return
  }

  reviewFeedbackSelected.value = reviewFeedbackCandidates.map((candidate) => candidate.id)
}

function openSelectedFeedbackFlow() {
  if (!reviewFeedbackPrimaryCandidateId.value) {
    closeFeedbackModal()
    return
  }

  openCompleteFeedbackModal(reviewFeedbackPrimaryCandidateId.value)
}

function handleManagerAction(item) {
  if (item.action === 'review-feedback') {
    openViewFeedbackStatus()
    return
  }

  if (item.action === 'complete-feedback') {
    openCompleteFeedbackModal(item.candidateId)
  }
}

function toneClass(tone) {
  return tone ? `is-${tone}` : ''
}

function candidateInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function timelineNodeStyle(index, total) {
  const position = total <= 1 ? 0 : (index / (total - 1)) * 100
  return { left: `${position}%` }
}

function goBack() {
  emit('back')
}

onMounted(() => {
  document.addEventListener('pointerdown', handleStageMenuDocumentClick)
  window.addEventListener('resize', handleStageMenuViewportChange)
  document.addEventListener('scroll', handleStageMenuViewportChange, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleStageMenuDocumentClick)
  window.removeEventListener('resize', handleStageMenuViewportChange)
  document.removeEventListener('scroll', handleStageMenuViewportChange, true)
})
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
                <span v-else-if="activeBoardView !== 'workload'">{{ visiblePipelineCandidateCount }} candidates</span>
                <label v-if="activeBoardView === 'board'" class="job-pipeline-board-select-all">
                  <span class="job-pipeline-fake-check" />
                  <span>Select all {{ visiblePipelineCandidateCount }} candidates</span>
                </label>
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
                <button v-if="activeBoardView === 'board'" class="job-pipeline-bulk-action" type="button">
                  <span>Bulk actions</span>
                  <AppIcon name="chevronDown" :size="13" />
                </button>
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
                  :class="[
                    toneClass(column.tone),
                    {
                      'is-focused': activeColumnSlug === column.slug,
                      'is-drop-target': dragOverColumnSlug === column.slug && draggedCandidateId,
                      'is-column-drop-target': columnDragOverSlug === column.slug && draggedColumnSlug,
                    },
                  ]"
                  @dragover.prevent="onColumnDragOver(column.slug)"
                  @drop.prevent="onColumnDrop(column.slug)"
                >
                  <button
                    class="job-pipeline-column-bar job-pipeline-column-bar--handle"
                    :class="toneClass(column.tone)"
                    type="button"
                    draggable="true"
                    aria-label="Reorder column"
                    @dragstart="onColumnHandleDragStart(column.slug)"
                    @dragend="onColumnDragEnd"
                  />

                  <div class="job-pipeline-column-head">
                    <div class="job-pipeline-column-heading">
                      <strong>{{ column.title }}</strong>
                      <small>{{ column.countLabel }}</small>
                    </div>

                    <div class="job-pipeline-column-meta">
                      <span class="job-pipeline-fake-check" :class="{ 'is-checked': column.selectAllChecked }" />
                      <em>SELECT ALL</em>
                    </div>
                  </div>

                  <div class="job-pipeline-column-cards">
                    <article
                      v-for="candidate in column.cards"
                      :key="candidate.id"
                      class="job-pipeline-candidate-card"
                      :class="{
                        'is-dragging': draggedCandidateId === candidate.id,
                        'is-selected': candidate.selected,
                        'is-menu-open': activeStageMenuCandidateId === candidate.id,
                      }"
                      draggable="true"
                      @dragstart="onCandidateDragStart(column.slug, candidate.id)"
                      @dragend="onCandidateDragEnd"
                    >
                      <div class="job-pipeline-card-head">
                        <span class="job-pipeline-fake-check" :class="{ 'is-checked': candidate.selected }" />
                        <span class="job-pipeline-candidate-avatar">
                          <span aria-hidden="true">{{ candidateInitials(candidate.name) }}</span>
                        </span>

                        <div class="job-pipeline-candidate-top">
                          <strong>{{ candidate.name }}</strong>
                          <span>{{ candidate.role }}</span>
                        </div>

                        <button
                          v-if="hasStageMenu(column.slug)"
                          class="job-pipeline-card-more job-pipeline-stage-menu-anchor"
                          type="button"
                          aria-label="Candidate actions"
                          :aria-expanded="activeStageMenuCandidateId === candidate.id"
                          @click.stop="toggleStageMenu(candidate.id, column.slug, $event)"
                        >
                          <AppIcon name="more" :size="14" />
                        </button>
                        <span v-else class="job-pipeline-card-more" aria-hidden="true">
                          <AppIcon name="more" :size="14" />
                        </span>
                      </div>

                      <div class="job-pipeline-candidate-bottom">
                        <strong v-if="candidate.match" :class="toneClass(candidate.matchTone)">{{ candidate.match }}</strong>
                        <small :class="toneClass(candidate.noteTone)">{{ candidate.note }}</small>
                      </div>

                      <div class="job-pipeline-card-actions">
                        <button type="button" aria-label="Email candidate">
                          <AppIcon name="mail" :size="12" />
                        </button>
                        <button type="button" aria-label="AI actions">
                          <AppIcon name="spark" :size="12" />
                        </button>
                        <span />
                        <button type="button" aria-label="More candidate actions">
                          <AppIcon name="more" :size="12" />
                        </button>
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
              <button type="button" @click="openViewFeedbackStatus()">View all feedback</button>
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
              <button class="job-pipeline-inline-button job-pipeline-manager-inline" type="button" @click="openSendReminder()">Send reminder</button>
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
                <strong>{{ reviewFeedbackSummary.title }}</strong>
                <small>{{ reviewFeedbackSummary.note }}</small>
              </div>
            </div>
            <button class="job-pipeline-feedback-close" type="button" @click="closeFeedbackModal">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <div class="job-pipeline-feedback-modal__body">
            <section class="job-pipeline-feedback-summary">
              <div class="job-pipeline-feedback-summary__item">
                <span class="job-pipeline-feedback-summary__icon">
                  <AppIcon name="briefcase" :size="18" />
                </span>
                <div>
                  <small>Job</small>
                  <strong>{{ reviewFeedbackSummary.job }}</strong>
                </div>
              </div>

              <div class="job-pipeline-feedback-summary__item">
                <span class="job-pipeline-feedback-summary__icon">
                  <AppIcon name="users" :size="18" />
                </span>
                <div>
                  <small>Candidates</small>
                  <strong>{{ reviewFeedbackCandidates.length }}</strong>
                </div>
              </div>

              <div class="job-pipeline-feedback-summary__item">
                <span class="job-pipeline-feedback-summary__icon">
                  <AppIcon name="clock" :size="18" />
                </span>
                <div>
                  <small>Impact</small>
                  <strong>{{ reviewFeedbackSummary.impact }}</strong>
                </div>
              </div>

              <div class="job-pipeline-feedback-summary__priority">
                <small>Priority</small>
                <strong :class="toneClass(reviewFeedbackSummary.priorityTone)">{{ reviewFeedbackSummary.priority }}</strong>
              </div>
            </section>

            <div class="job-pipeline-feedback-layout">
              <section class="job-pipeline-feedback-candidates">
                <div class="job-pipeline-feedback-candidates__head">
                  <label class="job-pipeline-feedback-check">
                    <input :checked="reviewFeedbackAllSelected" type="checkbox" @change="toggleReviewFeedbackSelectAll" />
                    <span class="job-pipeline-feedback-check__box">
                      <AppIcon name="check" :size="12" />
                    </span>
                    <strong>Candidates ({{ reviewFeedbackCandidates.length }})</strong>
                  </label>

                  <div class="job-pipeline-feedback-candidates__controls">
                    <button class="job-pipeline-feedback-candidates__select" type="button" @click="toggleReviewFeedbackSelectAll">
                      {{ reviewFeedbackAllSelected ? 'Deselect all' : 'Select all' }}
                    </button>
                    <button class="job-pipeline-feedback-candidates__sort" type="button">
                      <span>Sort by: Oldest</span>
                      <AppIcon name="chevronDown" :size="14" />
                    </button>
                  </div>
                </div>

                <div class="job-pipeline-feedback-candidates__list">
                  <article
                    v-for="item in reviewFeedbackCandidates"
                    :key="item.id"
                    class="job-pipeline-feedback-candidate"
                    :class="{
                      'is-selected': reviewFeedbackSelected.includes(item.id),
                      'is-clickable': item.ownFeedback,
                    }"
                    @click="item.ownFeedback ? openCompleteFeedbackModal(item.id) : null"
                  >
                    <label class="job-pipeline-feedback-check job-pipeline-feedback-check--row" @click.stop>
                      <input :checked="reviewFeedbackSelected.includes(item.id)" type="checkbox" @change="toggleReviewFeedbackCandidate(item.id)" />
                      <span class="job-pipeline-feedback-check__box">
                        <AppIcon name="check" :size="12" />
                      </span>
                    </label>

                    <div class="job-pipeline-feedback-candidate__avatar" :class="`tone-${item.avatarTone}`">
                      {{ item.initials }}
                    </div>

                    <div class="job-pipeline-feedback-candidate__identity">
                      <strong>{{ item.name }}</strong>
                      <p>Applied on {{ item.appliedOn }}</p>
                      <span class="job-pipeline-feedback-candidate__source" :class="toneClass(item.sourceTone)">{{ item.source }}</span>
                    </div>

                    <div class="job-pipeline-feedback-candidate__stage">
                      <strong>
                        <span class="job-pipeline-feedback-candidate__dot" :class="toneClass(item.stageTone)" />
                        {{ item.stage }}
                      </strong>
                      <p>{{ item.stageDetail }}</p>
                      <small class="job-pipeline-feedback-candidate__inline-note">
                        {{ item.ownFeedback ? 'Your feedback is required' : `Waiting on ${item.missingFrom}` }}
                      </small>
                    </div>

                    <div class="job-pipeline-feedback-candidate__meta">
                      <span>Last activity</span>
                      <strong>{{ item.lastActivity }}</strong>
                    </div>

                    <div class="job-pipeline-feedback-candidate__meta">
                      <span>Waiting</span>
                      <strong class="is-red">{{ item.waiting }}</strong>
                    </div>
                  </article>
                </div>
              </section>

              <aside class="job-pipeline-feedback-aside">
                <section class="job-pipeline-feedback-aside__card">
                  <div class="job-pipeline-feedback-aside__head">
                    <h3>Why this is recommended</h3>
                    <AppIcon name="info" :size="15" />
                  </div>
                  <p>{{ reviewFeedbackSummary.why }}</p>
                </section>

                <section class="job-pipeline-feedback-aside__card">
                  <span class="job-pipeline-feedback-aside__label">Expected impact</span>
                  <div class="job-pipeline-feedback-impact">
                    <div v-for="item in reviewFeedbackSummary.impactCards" :key="item.label" class="job-pipeline-feedback-impact__item">
                      <span class="job-pipeline-feedback-impact__icon" :class="toneClass(item.tone)">
                        <AppIcon :name="item.icon" :size="17" />
                      </span>
                      <div>
                        <strong :class="toneClass(item.tone)">{{ item.value }}</strong>
                        <h4>{{ item.label }}</h4>
                        <p>{{ item.note }}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section class="job-pipeline-feedback-tip">
                  <div class="job-pipeline-feedback-tip__head">
                    <AppIcon name="sparkles" :size="15" />
                    <strong>AI tip</strong>
                  </div>
                  <p>{{ reviewFeedbackSummary.tip }}</p>
                </section>
              </aside>
            </div>
          </div>

          <footer class="job-pipeline-feedback-modal-footer">
            <div class="job-pipeline-feedback-modal-note">
              <AppIcon name="info" :size="14" />
              <span>Feedback helps candidates move forward and improves your hiring outcomes.</span>
            </div>
            <div class="job-pipeline-feedback-footer-actions">
              <button class="job-pipeline-feedback-secondary-button" type="button" @click="closeFeedbackModal">
                <span>Cancel</span>
              </button>
              <button class="job-pipeline-feedback-primary-button" type="button" @click="openSelectedFeedbackFlow">
                <AppIcon name="mail" :size="14" />
                <span>{{ reviewFeedbackSendLabel }}</span>
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

          <section class="job-pipeline-complete-feedback-section">
            <button
              class="job-pipeline-complete-feedback-ai-toggle"
              :class="{ 'is-expanded': feedbackAssistantExpanded }"
              type="button"
              @click="toggleFeedbackAssistant"
            >
              <div class="job-pipeline-complete-feedback-ai-toggle__copy">
                <span class="job-pipeline-complete-feedback-ai-toggle__icon">
                  <AppIcon name="spark" :size="17" />
                </span>
                <div>
                  <strong>AI Feedback Assistant</strong>
                  <small>Get AI-powered suggestions to improve the quality and impact of your feedback.</small>
                </div>
              </div>

              <div class="job-pipeline-complete-feedback-ai-toggle__action">
                <span>{{ feedbackAssistantExpanded ? 'Hide Assistant' : 'Show Assistant' }}</span>
                <AppIcon :name="feedbackAssistantExpanded ? 'chevronUp' : 'chevronDown'" :size="18" />
              </div>
            </button>

            <div v-if="feedbackAssistantExpanded" class="job-pipeline-complete-feedback-ai-panel">
              <div class="job-pipeline-complete-feedback-ai-grid">
                <article class="job-pipeline-complete-feedback-ai-card">
                  <strong>Feedback Quality</strong>
                  <div class="job-pipeline-complete-feedback-ai-quality-list">
                    <div v-for="item in feedbackAssistantQualityItems" :key="item.label" class="job-pipeline-complete-feedback-ai-quality-row">
                      <span>
                        <AppIcon :name="item.tone === 'orange' ? 'alert' : 'checkCircle'" :size="14" />
                        {{ item.label }}
                      </span>
                      <em :class="toneClass(item.tone)">{{ item.value }}</em>
                    </div>
                  </div>
                </article>

                <article class="job-pipeline-complete-feedback-ai-card">
                  <strong>Suggested Improvements</strong>
                  <h4>Missing Evidence</h4>
                  <p>You mentioned strong leadership but did not provide an example.</p>
                  <small>Suggested addition:</small>
                  <blockquote>"Candidate successfully led cross-functional design initiatives that improved user engagement by 28%."</blockquote>
                  <button type="button">Apply Suggestion</button>
                </article>

                <article class="job-pipeline-complete-feedback-ai-card">
                  <strong>Improve Clarity</strong>
                  <small>Original</small>
                  <p>Strong communicator.</p>
                  <small>Improved</small>
                  <p>Candidate clearly articulated design decisions and stakeholder trade-offs in a clear and structured manner.</p>
                  <button type="button">Apply Improvement</button>
                </article>

                <article class="job-pipeline-complete-feedback-ai-card">
                  <strong>Suggested Summary</strong>
                  <p>Based on your notes, the candidate demonstrated strong product thinking, stakeholder management and leadership potential. Their performance was consistently above expectations.</p>
                  <button type="button">Insert Summary</button>
                </article>
              </div>

              <div class="job-pipeline-complete-feedback-ai-insights">
                <div>
                  <AppIcon name="checkCircle" :size="15" />
                  <span>Hiring Intelligence Insight</span>
                  <small>This feedback aligns with 3 of 4 submitted reviews.</small>
                </div>
                <div>
                  <AppIcon name="checkCircle" :size="15" />
                  <small>No major reviewer conflicts detected.</small>
                </div>
              </div>

              <div class="job-pipeline-complete-feedback-ai-footer">
                <button type="button" class="job-pipeline-complete-feedback-ai-link">
                  <AppIcon name="refresh" :size="15" />
                  <span>Regenerate Suggestions</span>
                </button>

                <button type="button" class="job-pipeline-complete-feedback-ai-primary">
                  <AppIcon name="shield" :size="15" />
                  <span>Apply All Suggestions</span>
                </button>
              </div>
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

    <Teleport to="body">
      <div
        v-if="activeStageMenuCandidateId"
        class="job-pipeline-stage-menu"
        :style="{
          top: `${stageMenuPosition.top}px`,
          left: `${stageMenuPosition.left}px`,
        }"
        @pointerdown.stop
        @click.stop
      >
        <div class="job-pipeline-stage-menu__hero">
          <span class="job-pipeline-stage-menu__badge" :style="{ background: activeStageMenuConfig.badgeStyle }">{{ activeStageMenuConfig.number }}</span>
          <div>
            <strong>{{ activeStageMenuConfig.title }}</strong>
            <small>{{ activeStageMenuConfig.subtitle }}</small>
          </div>
        </div>

        <section
          v-for="section in activeStageMenuConfig.sections"
          :key="section.title"
          class="job-pipeline-stage-menu__section"
        >
          <h4 :class="{ 'is-accent': section.accent }">{{ section.title }}</h4>

          <button
            v-for="item in section.items"
            :key="item.label"
            class="job-pipeline-stage-menu__item"
            :class="[toneClass(item.tone), { 'is-disabled': item.disabled }]"
            type="button"
            :disabled="item.disabled"
            @click="handleStageMenuAction(item.label)"
          >
            <span class="job-pipeline-stage-menu__icon" :class="toneClass(item.tone)">
              <AppIcon :name="item.icon" :size="13" />
            </span>
            <span>{{ item.label }}</span>
          </button>
        </section>
      </div>
    </Teleport>

    <ScheduleScreeningOverlay
      :open="scheduleScreeningOpen"
      :candidate-name="selectedScheduleCandidate?.name"
      :candidate-role="selectedScheduleCandidate?.role"
      :candidate-stage="getCandidateStageById(scheduleScreeningCandidateId, 'Applied')"
      @close="closeScheduleScreening"
      @screening-scheduled="handleScreeningScheduled(scheduleScreeningCandidateId, $event)"
    />

    <ScheduleHiringManagerReviewOverlay
      :open="scheduleHmReviewOpen"
      :candidate-name="selectedScheduleHmReviewCandidate?.name"
      :candidate-role="selectedScheduleHmReviewCandidate?.role"
      :candidate-stage="getCandidateStageById(scheduleHmReviewCandidateId, 'Qualified')"
      :candidate-match="selectedScheduleHmReviewCandidate?.match"
      @close="closeScheduleHmReview"
    />

    <RequestHiringManagerDecisionOverlay
      :open="requestHmDecisionOpen"
      :candidate-name="selectedRequestHmDecisionCandidate?.name"
      :candidate-role="selectedRequestHmDecisionCandidate?.role"
      :candidate-stage="getCandidateStageById(requestHmDecisionCandidateId, 'Qualified')"
      :candidate-match="selectedRequestHmDecisionCandidate?.match"
      @close="closeRequestHmDecision"
    />

    <DecisionReviewOverlay
      :open="decisionReviewOpen"
      :candidate-name="selectedDecisionReviewCandidate?.name"
      :candidate-role="selectedDecisionReviewCandidate?.role"
      @close="closeDecisionReview"
    />

    <AICandidateRankingOverlay
      :open="aiCandidateRankingOpen"
      :candidate-name="selectedAiCandidateRankingCandidate?.name"
      :candidate-role="selectedAiCandidateRankingCandidate?.role"
      :candidate-stage="selectedAiCandidateRankingStage"
      @close="closeAiCandidateRanking"
      @compare-candidates="openCompareCandidatesView"
    />

    <AssignAssessmentOverlay
      :open="assignAssessmentOpen"
      :candidate-name="selectedAssignAssessmentCandidate?.name"
      :candidate-role="selectedAssignAssessmentCandidate?.role"
      :candidate-stage="getCandidateStageById(assignAssessmentCandidateId, 'Shortlisted')"
      @close="closeAssignAssessment"
      @assign-send="openAddAssessmentLibrary"
      @assign-recommended="handleAssignAssessmentSubmit"
      @customize-plan="closeAssignAssessment"
      @open-library="openAddAssessmentLibrary"
    />

    <AddAssessmentLibraryOverlay
      :open="addAssessmentLibraryOpen"
      @close="closeAddAssessmentLibrary"
      @add-to-plan="handleAssessmentLibrarySubmit"
    />

    <AIMatchAnalysisOverlay
      :open="aiMatchAnalysisOpen"
      :candidate-name="selectedAiMatchCandidate?.name"
      :candidate-role="selectedAiMatchCandidate?.role"
      @close="closeAiMatchAnalysis"
      @schedule-screening="openScheduleScreening(aiMatchAnalysisCandidateId)"
    />

    <AIInterviewGapAnalysisOverlay
      :open="aiInterviewGapAnalysisOpen"
      :candidate-name="selectedAiInterviewGapAnalysisCandidate?.name"
      :candidate-role="selectedAiInterviewGapAnalysisCandidate?.role"
      :candidate-stage="getCandidateStageById(aiInterviewGapAnalysisCandidateId, 'Shortlisted')"
      :has-interview-plan-configured="selectedAiInterviewGapAnalysisCandidate?.hasInterviewPlanConfigured !== false"
      @close="closeAiInterviewGapAnalysis"
      @apply-updates="closeAiInterviewGapAnalysis"
      @generate-process="openInterviewPlanSequence(aiInterviewGapAnalysisCandidateId, 'recommend')"
    />

    <AIQualificationAnalysisOverlay
      :open="aiQualificationOpen"
      :candidate-name="selectedAiQualificationCandidate?.name"
      :candidate-role="selectedAiQualificationCandidate?.role"
      @close="closeAiQualification"
      @assign-hiring-manager="openAssignHiringManager(aiQualificationCandidateId)"
      @schedule-hm-review="openScheduleHmReview(aiQualificationCandidateId)"
    />

    <AIInterviewReadinessOverlay
      :open="aiInterviewReadinessOpen"
      :candidate-name="selectedAiInterviewReadinessCandidate?.name"
      :candidate-role="selectedAiInterviewReadinessCandidate?.role"
      :candidate-stage="getCandidateStageById(aiInterviewReadinessCandidateId, 'Qualified')"
      @close="closeAiInterviewReadiness"
      @share-team="openShareCandidate(aiInterviewReadinessCandidateId)"
      @proceed="moveCandidateToColumn(aiInterviewReadinessCandidateId, 'interview')"
    />

    <ConfigureInterviewKitOverlay
      :open="configureInterviewKitOpen"
      :candidate-name="selectedConfigureInterviewKitCandidate?.name"
      :candidate-role="selectedConfigureInterviewKitCandidate?.role"
      :candidate-stage="getCandidateStageById(configureInterviewKitCandidateId, 'Shortlisted')"
      @close="closeConfigureInterviewKit"
      @view-kit="closeConfigureInterviewKit(); openAssignInterviewKit(configureInterviewKitCandidateId)"
      @keep-current="closeConfigureInterviewKit"
      @apply-fixes="closeConfigureInterviewKit"
    />

    <AIHiringSuccessPredictionOverlay
      :open="aiHiringSuccessPredictionOpen"
      :candidate-name="selectedAiHiringSuccessPredictionCandidate?.name"
      :candidate-role="selectedAiHiringSuccessPredictionCandidate?.role"
      :candidate-stage="getCandidateStageById(aiHiringSuccessPredictionCandidateId, 'Qualified')"
      @close="closeAiHiringSuccessPrediction"
      @add-note="openAddNote(aiHiringSuccessPredictionCandidateId)"
      @share-prediction="openShareCandidate(aiHiringSuccessPredictionCandidateId)"
      @move-shortlisted="moveCandidateToColumn(aiHiringSuccessPredictionCandidateId, 'interview')"
    />

    <AIScreeningSummaryOverlay
      :open="aiScreeningSummaryOpen"
      :candidate-name="selectedAiScreeningSummaryCandidate?.name"
      :candidate-role="selectedAiScreeningSummaryCandidate?.role"
      @close="closeAiScreeningSummary"
      @add-notes="openAddNote(aiScreeningSummaryCandidateId)"
      @open-feedback="openViewFeedbackStatus(aiScreeningSummaryCandidateId, 'status')"
      @move-shortlisted="moveCandidateToColumn(aiScreeningSummaryCandidateId.value, 'interview')"
    />

    <AIRiskDetectionOverlay
      :open="aiRiskDetectionOpen"
      :candidate-name="selectedAiRiskDetectionCandidate?.name"
      :candidate-role="selectedAiRiskDetectionCandidate?.role"
      :candidate-stage="selectedAiRiskDetectionStage"
      @close="closeAiRiskDetection"
      @add-risk-note="openAddNote(aiRiskDetectionCandidateId)"
      @continue-next-stage="openSuggestedNextAction(aiRiskDetectionCandidateId)"
    />

    <SuggestedNextActionOverlay
      :open="suggestedNextActionOpen"
      :candidate-name="selectedSuggestedNextActionCandidate?.name"
      :candidate-role="selectedSuggestedNextActionCandidate?.role"
      :candidate-stage="selectedSuggestedNextActionStage"
      @close="closeSuggestedNextAction"
      @schedule-screening="openScheduleScreening(suggestedNextActionCandidateId)"
      @request-hm-review="openRequestHmDecision(suggestedNextActionCandidateId)"
      @move-shortlisted="moveCandidateToColumn(suggestedNextActionCandidateId.value, 'interview')"
      @move-validation="moveCandidateToColumn(suggestedNextActionCandidateId.value, 'validation')"
      @assign-assessment="openAssignAssessment(suggestedNextActionCandidateId.value)"
      @hold-candidate="openPutOnHold(suggestedNextActionCandidateId.value)"
      @reject-candidate="openRejectCandidate(suggestedNextActionCandidateId.value)"
      @add-note="openAddNote(suggestedNextActionCandidateId.value)"
    />

    <FinalFeedbackReviewOverlay
      :open="finalFeedbackReviewOpen"
      :candidate-name="selectedFinalFeedbackReviewCandidate?.name"
      :candidate-role="selectedFinalFeedbackReviewCandidate?.role"
      @close="closeFinalFeedbackReview"
      @move-offer="moveCandidateToColumn(finalFeedbackReviewCandidateId.value, 'offer')"
      @request-clarification="openRequestFeedback(finalFeedbackReviewCandidateId.value)"
      @hold-decision="openPutOnHold(finalFeedbackReviewCandidateId.value)"
      @reject-candidate="openRejectCandidate(finalFeedbackReviewCandidateId.value)"
    />

    <CreateHiringDecisionOverlay
      :open="createHiringDecisionOpen"
      :candidate-name="selectedCreateHiringDecisionCandidate?.name"
      :candidate-role="selectedCreateHiringDecisionCandidate?.role"
      @close="closeCreateHiringDecision"
      @save-draft="closeCreateHiringDecision"
      @save-decision="closeCreateHiringDecision"
      @create-offer="closeCreateHiringDecision(); moveCandidateToColumn(createHiringDecisionCandidateId.value, 'offer')"
    />

    <AddNoteOverlay
      :open="addNoteOpen"
      :candidate-name="selectedAddNoteCandidate?.name"
      :candidate-role="selectedAddNoteCandidate?.role"
      :candidate-stage="selectedAddNoteStage"
      @close="closeAddNote"
    />

    <ViewNotesOverlay
      :open="viewNotesOpen"
      :candidate-name="selectedViewNotesCandidate?.name"
      :candidate-role="selectedViewNotesCandidate?.role"
      :candidate-stage="selectedViewNotesStage"
      @close="closeViewNotes"
      @add-note="openAddNoteFromViewNotes"
    />

    <AddTagsOverlay
      :open="addTagsOpen"
      @close="closeAddTags"
    />

    <ShareCandidateOverlay
      :open="shareCandidateOpen"
      :candidate-name="selectedShareCandidate?.name"
      :candidate-role="selectedShareCandidate?.role"
      @close="closeShareCandidate"
    />

    <PutCandidateOnHoldOverlay
      :open="putOnHoldOpen"
      :candidate-name="selectedPutOnHoldCandidate?.name"
      :candidate-role="selectedPutOnHoldCandidate?.role"
      @close="closePutOnHold"
    />

    <ArchiveCandidateOverlay
      :open="archiveCandidateOpen"
      :candidate-name="selectedArchiveCandidate?.name"
      :candidate-role="selectedArchiveCandidate?.role"
      @close="closeArchiveCandidate"
    />

    <ActivityLogOverlay
      :open="activityLogOpen"
      :candidate-name="selectedActivityLogCandidate?.name"
      :candidate-role="selectedActivityLogCandidate?.role"
      @close="closeActivityLog"
    />

    <RejectCandidateOverlay
      :open="rejectCandidateOpen"
      :candidate-name="selectedRejectCandidate?.name"
      :candidate-role="selectedRejectCandidate?.role"
      :candidate-stage="selectedRejectCandidateStage"
      @close="closeRejectCandidate"
    />

    <ConfirmAvailabilityOverlay
      :open="confirmAvailabilityOpen"
      :candidate-name="selectedConfirmAvailabilityCandidate?.name"
      :candidate-role="selectedConfirmAvailabilityCandidate?.role"
      :candidate-stage="getCandidateStageById(confirmAvailabilityCandidateId, 'Qualified')"
      @close="closeConfirmAvailability"
    />

    <ConfirmSalaryAlignmentOverlay
      :open="confirmSalaryAlignmentOpen"
      :candidate-name="selectedConfirmSalaryAlignmentCandidate?.name"
      :candidate-role="selectedConfirmSalaryAlignmentCandidate?.role"
      :candidate-stage="getCandidateStageById(confirmSalaryAlignmentCandidateId, 'Qualified')"
      @close="closeConfirmSalaryAlignment"
    />

    <ConfirmCandidateInterestOverlay
      :open="confirmInterestOpen"
      :candidate-name="selectedConfirmInterestCandidate?.name"
      :candidate-role="selectedConfirmInterestCandidate?.role"
      :candidate-match="selectedConfirmInterestCandidate?.match"
      @close="closeConfirmInterest"
    />

    <RequestFeedbackOverlay
      :open="feedbackRequestOpen"
      :candidate-name="selectedFeedbackRequestCandidate?.name"
      :candidate-role="selectedFeedbackRequestCandidate?.role"
      :candidate-stage="getCandidateStageById(feedbackRequestCandidateId, 'Interview')"
      @close="closeRequestFeedback"
      @send-request="submitRequestFeedback"
    />

    <RequestFinalFeedbackOverlay
      :open="finalFeedbackRequestOpen"
      :candidate-name="selectedFinalFeedbackRequestCandidate?.name"
      :candidate-role="selectedFinalFeedbackRequestCandidate?.role"
      @close="closeRequestFinalFeedback"
      @send-request="closeRequestFinalFeedback"
    />

    <SendReminderOverlay
      :open="sendReminderOpen"
      :candidate-name="selectedSendReminderCandidate?.name"
      :candidate-role="selectedSendReminderCandidate?.role"
      @close="closeSendReminder"
      @send-reminder="closeSendReminder"
    />

    <ViewFeedbackStatusOverlay
      :open="feedbackStatusOpen"
      :candidate-name="selectedFeedbackStatusCandidate?.name"
      :candidate-role="selectedFeedbackStatusCandidate?.role"
      :candidate-stage="getCandidateStageById(feedbackStatusCandidateId, 'Shortlisted')"
      :initial-tab="feedbackStatusInitialTab"
      @close="closeViewFeedbackStatus"
      @request-feedback="closeViewFeedbackStatus(); openRequestFeedback(feedbackStatusCandidateId)"
    />

    <AssessmentReviewOverlay
      :open="assessmentReviewOpen"
      :candidate-name="selectedAssessmentReviewCandidate?.name"
      :candidate-role="selectedAssessmentReviewCandidate?.role"
      :candidate-stage="getCandidateStageById(assessmentReviewCandidateId, 'Assessment')"
      @close="closeAssessmentReview"
    />

    <CandidateComparisonOverlay
      :open="candidateComparisonOpen"
      :candidate-name="selectedCandidateComparisonCandidate?.name"
      :candidate-role="selectedCandidateComparisonCandidate?.role"
      @close="closeCandidateComparison"
    />

    <ReviewerCalibrationOverlay
      :open="reviewerCalibrationOpen"
      :candidate-name="selectedReviewerCalibrationCandidate?.name"
      :candidate-role="selectedReviewerCalibrationCandidate?.role"
      :reviewer-count="selectedReviewerCalibrationCount"
      @close="closeReviewerCalibration"
    />

    <TrackAssessmentProgressOverlay
      :open="trackAssessmentProgressOpen"
      :candidate-name="selectedTrackAssessmentProgressCandidate?.name"
      :candidate-role="selectedTrackAssessmentProgressCandidate?.role"
      @close="closeTrackAssessmentProgress"
    />

    <InterviewScorecardOverlay
      :open="interviewScorecardOpen"
      :candidate-name="selectedInterviewScorecardCandidate?.name"
      :candidate-role="selectedInterviewScorecardCandidate?.role"
      @close="closeInterviewScorecard"
    />

    <AutoDQKnockoutOverlay
      :open="autoDqOpen"
      :candidate-name="selectedAutoDqCandidate?.name"
      :candidate-role="selectedAutoDqCandidate?.role"
      :candidate-match="selectedAutoDqCandidate?.match"
      @close="closeAutoDq"
    />

    <AddToTalentPoolOverlay
      :open="addToTalentPoolOpen"
      :candidate-name="selectedTalentPoolCandidate?.name"
      :candidate-role="selectedTalentPoolCandidate?.role"
      :candidate-match="selectedTalentPoolCandidate?.match"
      @close="closeAddToTalentPool"
    />

    <AIAssessmentInsightsOverlay
      :open="aiAssessmentInsightsOpen"
      :candidate-name="selectedAiAssessmentInsightsCandidate?.name"
      :candidate-role="selectedAiAssessmentInsightsCandidate?.role"
      :candidate-match="selectedAiAssessmentInsightsCandidate?.match"
      @close="closeAiAssessmentInsights"
    />

    <AIFeedbackQualityOverlay
      :open="aiFeedbackQualityOpen"
      :candidate-name="selectedAiFeedbackQualityCandidate?.name"
      :candidate-role="selectedAiFeedbackQualityCandidate?.role"
      @close="closeAiFeedbackQuality"
    />

    <AIScoreCalibrationOverlay
      :open="aiScoreCalibrationOpen"
      :candidate-name="selectedAiScoreCalibrationCandidate?.name"
      :candidate-role="selectedAiScoreCalibrationCandidate?.role"
      @close="closeAiScoreCalibration"
    />

    <AIScorecardBiasDetectionOverlay
      :open="aiScorecardBiasOpen"
      :candidate-name="selectedAiScorecardBiasCandidate?.name"
      :candidate-role="selectedAiScorecardBiasCandidate?.role"
      @close="closeAiScorecardBiasDetection"
    />

    <AIStageRecommendationOverlay
      :open="aiStageRecommendationOpen"
      :candidate-name="selectedAiStageRecommendationCandidate?.name"
      :candidate-role="selectedAiStageRecommendationCandidate?.role"
      @close="closeAiStageRecommendation"
    />

    <AIStrengthsGapsOverlay
      :open="aiStrengthsGapsOpen"
      :candidate-name="selectedAiStrengthsGapsCandidate?.name"
      :candidate-role="selectedAiStrengthsGapsCandidate?.role"
      @close="closeAiStrengthsGaps"
    />

    <AssignHiringManagerOverlay
      :open="assignHiringManagerOpen"
      :candidate-name="selectedAssignHiringManagerCandidate?.name"
      :candidate-role="selectedAssignHiringManagerCandidate?.role"
      :candidate-stage="getCandidateStageById(assignHiringManagerCandidateId, 'Qualified')"
      @close="closeAssignHiringManager"
    />

    <AssignInterviewPanelOverlay
      :open="assignInterviewPanelOpen"
      :candidate-name="selectedAssignInterviewPanelCandidate?.name"
      :candidate-role="selectedAssignInterviewPanelCandidate?.role"
      :candidate-stage="getCandidateStageById(assignInterviewPanelCandidateId, 'Shortlisted')"
      :has-assigned-panel="Boolean(selectedAssignInterviewPanelCandidate?.hasAssignedInterviewPanel)"
      @panel-assigned="setCandidateInterviewPanelAssigned(assignInterviewPanelCandidateId, true)"
      @close="closeAssignInterviewPanel"
    />

    <CheckInterviewerWorkloadOverlay
      :open="checkInterviewerWorkloadOpen"
      :candidate-name="selectedCheckInterviewerWorkloadCandidate?.name"
      :candidate-role="selectedCheckInterviewerWorkloadCandidate?.role"
      :candidate-stage="getCandidateStageById(checkInterviewerWorkloadCandidateId, 'Shortlisted')"
      @close="closeCheckInterviewerWorkload"
      @use-current-panel="closeCheckInterviewerWorkload"
      @view-replacements="closeCheckInterviewerWorkload"
    />

    <InterviewPlanSequenceOverlay
      :open="interviewPlanSequenceOpen"
      :candidate-name="selectedInterviewPlanSequenceCandidate?.name"
      :candidate-role="selectedInterviewPlanSequenceCandidate?.role"
      :candidate-stage="getCandidateStageById(interviewPlanSequenceCandidateId, 'Shortlisted')"
      :has-assigned-sequence="Boolean(selectedInterviewPlanSequenceCandidate?.hasAssignedInterviewSequence)"
      :initial-view="interviewPlanSequenceInitialView"
      @sequence-assigned="setCandidateInterviewSequenceAssigned(interviewPlanSequenceCandidateId, true)"
      @close="closeInterviewPlanSequence"
    />

    <AssignInterviewKitOverlay
      :open="assignInterviewKitOpen"
      :candidate-name="selectedAssignInterviewKitCandidate?.name"
      :candidate-role="selectedAssignInterviewKitCandidate?.role"
      :candidate-stage="getCandidateStageById(assignInterviewKitCandidateId, 'Shortlisted')"
      @close="closeAssignInterviewKit"
      @review-customize="openConfigureInterviewKitFromAssign"
      @create-kit="closeAssignInterviewKit"
      @assign-plan="closeAssignInterviewKit"
    />

    <RequestSalaryExpectationOverlay
      :open="requestSalaryOpen"
      :candidate-name="selectedRequestSalaryCandidate?.name"
      :candidate-role="selectedRequestSalaryCandidate?.role"
      :candidate-match="selectedRequestSalaryCandidate?.match"
      @close="closeRequestSalary"
    />

    <SendCandidateEmailOverlay
      :open="sendEmailOpen"
      :candidate-name="selectedEmailCandidate?.name"
      :candidate-role="selectedEmailCandidate?.role"
      :candidate-stage="getCandidateStageById(sendEmailCandidateId, 'Interview')"
      :candidate-match="selectedEmailCandidate?.match"
      @close="closeSendEmail"
    />
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
.job-pipeline-bulk-action,
.job-pipeline-icon-button,
.job-pipeline-view-button,
.job-pipeline-tab,
.job-pipeline-inline-button,
.job-pipeline-resolve,
.job-pipeline-link,
.job-pipeline-copilot-card button,
.job-pipeline-copilot-button,
.job-pipeline-add-candidate,
.job-pipeline-card-actions button,
.job-pipeline-card-more,
.job-pipeline-column-trigger,
.job-pipeline-stage-menu__item,
.job-pipeline-recommendation-card button,
.job-pipeline-tip button {
  border: 0;
  background: transparent;
  font: inherit;
}

.job-pipeline-back,
.job-pipeline-ghost,
.job-pipeline-outline-accent,
.job-pipeline-bulk-action,
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

.job-pipeline-bulk-action {
  color: #fff;
  background: linear-gradient(90deg, #ff67ad 0%, #f15ea8 100%);
  border-color: transparent;
  box-shadow: 0 10px 18px rgba(241, 94, 168, 0.16);
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
  overflow: visible;
}

.job-pipeline-board-title {
  gap: 12px;
  min-width: 0;
  flex-wrap: wrap;
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

.job-pipeline-board-select-all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6f7c93;
  font-size: 0.78rem;
}

.job-pipeline-fake-check {
  width: 13px;
  height: 13px;
  border: 1px solid #d9e1ee;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  flex: 0 0 13px;
}

.job-pipeline-fake-check.is-checked {
  border-color: #ff67ad;
  background: linear-gradient(180deg, #ff78b8 0%, #f25ea8 100%);
  box-shadow: 0 4px 10px rgba(242, 94, 168, 0.18);
}

.job-pipeline-fake-check.is-checked::after {
  content: '';
  width: 6px;
  height: 3px;
  border-left: 1.5px solid #fff;
  border-bottom: 1.5px solid #fff;
  transform: rotate(-45deg) translateY(-1px);
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
.job-pipeline-board-controls .job-pipeline-bulk-action,
.job-pipeline-board-controls .job-pipeline-icon-button {
  height: 32px;
}

.job-pipeline-board-controls .job-pipeline-ghost,
.job-pipeline-board-controls .job-pipeline-bulk-action {
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
  grid-auto-columns: 268px;
  gap: 14px;
  width: max-content;
  min-width: 0;
}

.job-pipeline-board-scroll {
  margin-top: 18px;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
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
.job-pipeline-feedback-modal-footer,
.job-pipeline-feedback-footer-actions,
.job-pipeline-feedback-summary,
.job-pipeline-feedback-candidates__controls,
.job-pipeline-feedback-aside__head,
.job-pipeline-feedback-tip__head,
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
  padding: 18px;
  background: rgba(17, 24, 39, 0.18);
  backdrop-filter: blur(10px);
}

.job-pipeline-feedback-modal,
.job-pipeline-complete-feedback-modal {
  border: 1px solid #e8edf6;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
}

.job-pipeline-feedback-modal {
  width: min(1160px, calc(100vw - 36px));
  max-height: calc(100vh - 36px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.job-pipeline-complete-feedback-modal {
  width: min(100%, 980px);
  max-height: min(90vh, 920px);
  overflow-y: auto;
  padding: 22px 0 0;
}

.job-pipeline-feedback-modal-head {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.job-pipeline-feedback-modal .job-pipeline-feedback-modal-head,
.job-pipeline-feedback-modal .job-pipeline-feedback-modal-footer {
  padding-left: 34px;
  padding-right: 34px;
}

.job-pipeline-feedback-modal .job-pipeline-feedback-modal-head {
  padding-top: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid #edf2f8;
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
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: #9aa5b8;
  border: 1px solid #e2e8f3;
  cursor: pointer;
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

.job-pipeline-feedback-secondary-button {
  border: 1px solid #e2e8f2;
  color: #4e5d78;
  background: #fff;
}

.job-pipeline-feedback-primary-button {
  border: 1px solid #ff5aa7;
  color: #fff;
  background: linear-gradient(135deg, #ff7fbc, #ec5ba7);
  box-shadow: 0 14px 28px rgba(236, 91, 167, 0.22);
}

.job-pipeline-feedback-modal__body {
  padding: 16px 34px;
  overflow: auto;
  display: grid;
  gap: 16px;
}

.job-pipeline-feedback-summary {
  padding: 14px 20px;
  border: 1px solid #edf2f8;
  border-radius: 18px;
  gap: 0;
}

.job-pipeline-feedback-summary__item {
  flex: 1;
  min-width: 0;
  padding-right: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.job-pipeline-feedback-summary__item + .job-pipeline-feedback-summary__item {
  padding-left: 18px;
  border-left: 1px solid #edf2f8;
}

.job-pipeline-feedback-summary__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  color: #94a3b8;
  background: #f8fafc;
}

.job-pipeline-feedback-summary small,
.job-pipeline-feedback-summary__priority small {
  display: block;
  margin-bottom: 4px;
  color: #a0abc0;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.job-pipeline-feedback-summary strong,
.job-pipeline-feedback-summary__priority strong {
  color: #162447;
  font-size: 0.88rem;
  line-height: 1.3;
}

.job-pipeline-feedback-summary__priority {
  min-width: 120px;
  align-self: stretch;
  padding-left: 20px;
  border-left: 1px solid #edf2f8;
  display: grid;
  align-content: center;
}

.job-pipeline-feedback-summary__priority strong.is-pink,
.job-pipeline-feedback-summary__priority strong.is-orange {
  width: fit-content;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
}

.job-pipeline-feedback-summary__priority strong.is-pink {
  color: #ef5da8;
  background: #fff1f6;
}

.job-pipeline-feedback-summary__priority strong.is-orange {
  color: #ff8a34;
  background: #fff4ea;
}

.job-pipeline-feedback-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 332px;
  gap: 22px;
  align-items: start;
}

.job-pipeline-feedback-candidates {
  min-width: 0;
  border-right: 1px solid #edf2f8;
  padding-right: 22px;
  display: grid;
  gap: 14px;
  overflow: hidden;
}

.job-pipeline-feedback-candidates__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
}

.job-pipeline-feedback-check {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #162447;
  font-size: 0.84rem;
  font-weight: 700;
}

.job-pipeline-feedback-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.job-pipeline-feedback-check__box {
  width: 22px;
  height: 22px;
  border: 1px solid #f0b8cf;
  border-radius: 7px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  color: transparent;
  background: #fff;
  transition: 0.2s ease;
}

.job-pipeline-feedback-check input:checked + .job-pipeline-feedback-check__box {
  border-color: #ef5da8;
  color: #fff;
  background: #ef5da8;
}

.job-pipeline-feedback-candidates__controls {
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

.job-pipeline-feedback-candidates__select {
  border: 0;
  padding: 0;
  color: #ef5da8;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.job-pipeline-feedback-candidates__sort {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #e2e8f3;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  background: #fff;
  font: inherit;
  cursor: pointer;
}

.job-pipeline-feedback-candidates__list {
  display: grid;
  gap: 12px;
}

.job-pipeline-feedback-candidate {
  display: grid;
  grid-template-columns: 28px 54px minmax(180px, 1.2fr) minmax(148px, 0.95fr) minmax(120px, 0.75fr) minmax(92px, 0.65fr);
  padding: 14px 14px 14px 12px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
  gap: 14px;
  align-items: center;
  transition: 0.18s ease;
}

.job-pipeline-feedback-candidate.is-selected {
  border-color: #f1bfd6;
  box-shadow: 0 10px 24px rgba(241, 93, 168, 0.08);
}

.job-pipeline-feedback-candidate.is-clickable {
  cursor: pointer;
}

.job-pipeline-feedback-candidate.is-clickable:hover {
  border-color: #e8b2cb;
  transform: translateY(-1px);
}

.job-pipeline-feedback-check--row {
  align-self: center;
}

.job-pipeline-feedback-candidate__avatar {
  width: 54px;
  height: 54px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.job-pipeline-feedback-candidate__avatar.tone-brown {
  background: linear-gradient(135deg, #2b211e 0%, #8e6749 100%);
}

.job-pipeline-feedback-candidate__avatar.tone-sand {
  background: linear-gradient(135deg, #d7b68f 0%, #6e5841 100%);
}

.job-pipeline-feedback-candidate__avatar.tone-amber {
  background: linear-gradient(135deg, #4f382a 0%, #b88348 100%);
}

.job-pipeline-feedback-candidate__avatar.tone-rose {
  background: linear-gradient(135deg, #5f3533 0%, #cf857d 100%);
}

.job-pipeline-feedback-candidate__avatar.tone-olive {
  background: linear-gradient(135deg, #41372e 0%, #8d7749 100%);
}

.job-pipeline-feedback-candidate__identity,
.job-pipeline-feedback-candidate__stage,
.job-pipeline-feedback-candidate__meta {
  min-width: 0;
}

.job-pipeline-feedback-candidate__identity strong,
.job-pipeline-feedback-candidate__stage strong,
.job-pipeline-feedback-candidate__meta strong {
  display: block;
  color: #162447;
  font-size: 0.82rem;
  line-height: 1.3;
}

.job-pipeline-feedback-candidate__identity p,
.job-pipeline-feedback-candidate__stage p,
.job-pipeline-feedback-candidate__meta p,
.job-pipeline-feedback-candidate__inline-note {
  margin: 4px 0 0;
  color: #7b879a;
  font-size: 0.72rem;
  line-height: 1.35;
}

.job-pipeline-feedback-candidate__inline-note {
  display: block;
}

.job-pipeline-feedback-candidate__source {
  width: fit-content;
  margin-top: 8px;
  padding: 3px 8px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 0.66rem;
  font-weight: 700;
  line-height: 1.1;
}

.job-pipeline-feedback-candidate__source.is-blue {
  color: #3b82f6;
  background: #eef4ff;
}

.job-pipeline-feedback-candidate__source.is-green {
  color: #22b161;
  background: #ecfbf3;
}

.job-pipeline-feedback-candidate__source.is-orange {
  color: #ff8a34;
  background: #fff4ea;
}

.job-pipeline-feedback-candidate__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

.job-pipeline-feedback-candidate__dot.is-violet {
  background: #9b67ff;
}

.job-pipeline-feedback-candidate__dot.is-yellow {
  background: #eab308;
}

.job-pipeline-feedback-candidate__dot.is-blue {
  background: #3b82f6;
}

.job-pipeline-feedback-candidate__meta span {
  display: block;
  margin-bottom: 4px;
  color: #9aa6bb;
  font-size: 0.62rem;
}

.job-pipeline-feedback-candidate__meta strong.is-red {
  color: #ef4444;
}

.job-pipeline-feedback-aside {
  display: grid;
  gap: 16px;
  min-width: 0;
  position: sticky;
  top: 0;
}

.job-pipeline-feedback-aside__card {
  display: grid;
  gap: 14px;
}

.job-pipeline-feedback-aside__head {
  justify-content: space-between;
  gap: 10px;
}

.job-pipeline-feedback-aside__head h3 {
  margin: 0;
  color: #162447;
  font-size: 0.88rem;
}

.job-pipeline-feedback-aside__head :deep(svg) {
  color: #94a3b8;
}

.job-pipeline-feedback-aside__card p {
  margin: 0;
  color: #5b6981;
  font-size: 0.76rem;
  line-height: 1.65;
}

.job-pipeline-feedback-aside__label {
  color: #a0abc0;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.job-pipeline-feedback-impact {
  display: grid;
  gap: 14px;
}

.job-pipeline-feedback-impact__item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.job-pipeline-feedback-impact__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
}

.job-pipeline-feedback-impact__icon.is-green {
  color: #22b161;
  background: #ecfbf3;
}

.job-pipeline-feedback-impact__icon.is-blue {
  color: #3b82f6;
  background: #edf4ff;
}

.job-pipeline-feedback-impact__icon.is-violet {
  color: #9b67ff;
  background: #f6efff;
}

.job-pipeline-feedback-impact__item strong {
  display: block;
  font-size: 1rem;
  line-height: 1.1;
}

.job-pipeline-feedback-impact__item strong.is-green {
  color: #22b161;
}

.job-pipeline-feedback-impact__item strong.is-blue {
  color: #3b82f6;
}

.job-pipeline-feedback-impact__item strong.is-violet {
  color: #9b67ff;
}

.job-pipeline-feedback-impact__item h4 {
  margin: 4px 0 3px;
  color: #162447;
  font-size: 0.84rem;
}

.job-pipeline-feedback-impact__item p {
  margin: 0;
  color: #7c889d;
  font-size: 0.72rem;
}

.job-pipeline-feedback-tip {
  padding: 16px 18px;
  border: 1px solid #cfe1ff;
  border-radius: 12px;
  background: #f5f9ff;
  display: grid;
  gap: 12px;
}

.job-pipeline-feedback-tip__head {
  justify-content: flex-start;
  gap: 8px;
  color: #2e6cf6;
}

.job-pipeline-feedback-tip p {
  margin: 0;
  color: #5b6981;
  font-size: 0.74rem;
  line-height: 1.65;
}

.job-pipeline-feedback-modal-footer {
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #edf2f8;
  padding-top: 16px;
  padding-bottom: 20px;
  background: #fff;
}

.job-pipeline-feedback-modal-note {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6f7d94;
  font-size: 0.72rem;
}

.job-pipeline-feedback-footer-actions {
  align-items: center;
  gap: 12px;
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

.job-pipeline-complete-feedback-modal .job-pipeline-feedback-modal-head {
  padding: 0 32px 18px;
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

.job-pipeline-complete-feedback-ai-toggle,
.job-pipeline-complete-feedback-ai-toggle__copy,
.job-pipeline-complete-feedback-ai-toggle__action,
.job-pipeline-complete-feedback-ai-quality-row,
.job-pipeline-complete-feedback-ai-insights,
.job-pipeline-complete-feedback-ai-insights > div,
.job-pipeline-complete-feedback-ai-footer,
.job-pipeline-complete-feedback-ai-link,
.job-pipeline-complete-feedback-ai-primary {
  display: flex;
}

.job-pipeline-complete-feedback-ai-toggle {
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid #dfe6fb;
  border-radius: 16px;
  background: linear-gradient(180deg, #f7f8ff 0%, #fbfcff 100%);
  cursor: pointer;
}

.job-pipeline-complete-feedback-ai-toggle.is-expanded {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.job-pipeline-complete-feedback-ai-toggle__copy {
  align-items: center;
  gap: 14px;
  text-align: left;
}

.job-pipeline-complete-feedback-ai-toggle__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: #5b61f6;
  background: #eef1ff;
}

.job-pipeline-complete-feedback-ai-toggle__copy strong,
.job-pipeline-complete-feedback-ai-card strong {
  display: block;
  color: #39476a;
  font-size: 0.78rem;
}

.job-pipeline-complete-feedback-ai-toggle__copy small {
  display: block;
  margin-top: 6px;
  color: #7f8ba0;
  font-size: 0.62rem;
  line-height: 1.5;
}

.job-pipeline-complete-feedback-ai-toggle__action {
  align-items: center;
  gap: 8px;
  color: #4f46e5;
  font-size: 0.68rem;
  font-weight: 700;
}

.job-pipeline-complete-feedback-ai-panel {
  border: 1px solid #dfe6fb;
  border-top: 0;
  border-radius: 0 0 16px 16px;
  background: linear-gradient(180deg, #f7f8ff 0%, #fbfcff 100%);
  padding: 18px 20px 20px;
}

.job-pipeline-complete-feedback-ai-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.job-pipeline-complete-feedback-ai-card {
  min-width: 0;
  padding: 16px;
  border: 1px solid #e4e9f6;
  border-radius: 14px;
  background: #fff;
}

.job-pipeline-complete-feedback-ai-quality-list {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.job-pipeline-complete-feedback-ai-quality-row {
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #50607b;
  font-size: 0.62rem;
}

.job-pipeline-complete-feedback-ai-quality-row span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.job-pipeline-complete-feedback-ai-quality-row em {
  font-size: 0.6rem;
  font-style: normal;
  font-weight: 700;
}

.job-pipeline-complete-feedback-ai-card h4 {
  margin: 14px 0 0;
  color: #4f46e5;
  font-size: 0.7rem;
}

.job-pipeline-complete-feedback-ai-card p,
.job-pipeline-complete-feedback-ai-card small,
.job-pipeline-complete-feedback-ai-card blockquote {
  color: #66748d;
  font-size: 0.6rem;
  line-height: 1.55;
}

.job-pipeline-complete-feedback-ai-card p {
  margin: 10px 0 0;
}

.job-pipeline-complete-feedback-ai-card small {
  display: block;
  margin-top: 14px;
  color: #98a3b8;
  text-transform: uppercase;
}

.job-pipeline-complete-feedback-ai-card blockquote {
  margin: 10px 0 0;
  padding: 0;
  border: 0;
  font-style: italic;
}

.job-pipeline-complete-feedback-ai-card button {
  width: 100%;
  margin-top: 16px;
  min-height: 38px;
  border: 1px solid #cfd8fb;
  border-radius: 12px;
  background: #fff;
  color: #4f46e5;
  font-size: 0.62rem;
  font-weight: 700;
  cursor: pointer;
}

.job-pipeline-complete-feedback-ai-insights {
  justify-content: space-between;
  gap: 14px;
  margin-top: 16px;
  padding: 14px 16px;
  border: 1px solid #e4e9f6;
  border-radius: 14px;
  background: #fff;
}

.job-pipeline-complete-feedback-ai-insights > div {
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: #64748b;
  font-size: 0.6rem;
}

.job-pipeline-complete-feedback-ai-insights svg {
  color: #22c55e;
}

.job-pipeline-complete-feedback-ai-insights span {
  color: #39476a;
  font-weight: 700;
}

.job-pipeline-complete-feedback-ai-insights small {
  color: #7f8ba0;
}

.job-pipeline-complete-feedback-ai-footer {
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
}

.job-pipeline-complete-feedback-ai-link,
.job-pipeline-complete-feedback-ai-primary {
  align-items: center;
  gap: 8px;
  min-height: 42px;
  border-radius: 12px;
  font-size: 0.66rem;
  font-weight: 700;
  cursor: pointer;
}

.job-pipeline-complete-feedback-ai-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #4f46e5;
}

.job-pipeline-complete-feedback-ai-primary {
  justify-content: center;
  min-width: 204px;
  padding: 0 18px;
  border: 0;
  color: #fff;
  background: linear-gradient(135deg, #5448e5 0%, #5b61f6 100%);
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
  position: relative;
  min-width: 268px;
  max-width: 268px;
  padding: 0 0 10px;
  border: 0;
  border-radius: 0;
  background: transparent;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.job-pipeline-column.is-focused {
  transform: translateY(-1px);
}

.job-pipeline-column.is-drop-target {
  opacity: 0.92;
}

.job-pipeline-column.is-column-drop-target {
  opacity: 0.92;
}

.job-pipeline-column-head {
  display: grid;
  gap: 8px;
  align-items: start;
}

.job-pipeline-column-heading,
.job-pipeline-column-meta,
.job-pipeline-candidate-top,
.job-pipeline-candidate-bottom > * {
  min-width: 0;
}

.job-pipeline-column-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.job-pipeline-column-trigger {
  padding: 0;
  color: inherit;
  cursor: pointer;
}

.job-pipeline-column-head strong {
  display: block;
  color: #162447;
  font-size: 0.68rem;
  line-height: 1.18;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.job-pipeline-column-head small,
.job-pipeline-column-meta span {
  color: #7d889b;
  font-size: 0.58rem;
  line-height: 1.3;
}

.job-pipeline-column-head small {
  white-space: nowrap;
  font-weight: 700;
}

.job-pipeline-column-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.job-pipeline-column-meta em {
  font-style: normal;
  font-weight: 700;
  font-size: 0.58rem;
  line-height: 1.2;
  white-space: nowrap;
  color: #ff71b5;
  letter-spacing: 0.03em;
}

.job-pipeline-stage-menu {
  position: fixed;
  z-index: 1200;
  width: 292px;
  max-height: min(72vh, 760px);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding: 14px;
  border: 1px solid #e6ebf4;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 24px 56px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(10px);
}

.job-pipeline-stage-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 18px;
  width: 16px;
  height: 16px;
  border-top: 1px solid #e6ebf4;
  border-left: 1px solid #e6ebf4;
  background: rgba(255, 255, 255, 0.98);
  transform: rotate(45deg);
}

.job-pipeline-stage-menu::-webkit-scrollbar {
  width: 8px;
}

.job-pipeline-stage-menu::-webkit-scrollbar-track {
  background: transparent;
}

.job-pipeline-stage-menu::-webkit-scrollbar-thumb {
  background: #d6ddec;
  border-radius: 999px;
}

.job-pipeline-stage-menu__hero {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 4px 4px 14px;
  border-bottom: 1px solid #eef2f7;
}

.job-pipeline-stage-menu__badge {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #6d5cff 0%, #4f46e5 100%);
  font-size: 1rem;
  font-weight: 800;
  flex: 0 0 34px;
}

.job-pipeline-stage-menu__hero strong {
  display: block;
  color: #25345a;
  font-size: 1rem;
  line-height: 1.2;
}

.job-pipeline-stage-menu__hero small {
  display: block;
  margin-top: 4px;
  color: #98a4b6;
  font-size: 0.78rem;
  line-height: 1.3;
}

.job-pipeline-stage-menu__section {
  margin-top: 14px;
}

.job-pipeline-stage-menu__section h4 {
  margin: 0 0 8px;
  color: #5a67ff;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.job-pipeline-stage-menu__section h4.is-accent {
  color: #6b5cff;
}

.job-pipeline-stage-menu__item {
  width: 100%;
  min-height: 38px;
  padding: 6px 8px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  color: #58657c;
  cursor: pointer;
  text-align: left;
  border-radius: 12px;
  transition: background-color 0.16s ease, color 0.16s ease;
}

.job-pipeline-stage-menu__item + .job-pipeline-stage-menu__item {
  margin-top: 2px;
}

.job-pipeline-stage-menu__item:hover {
  background: #f8faff;
  color: #25345a;
}

.job-pipeline-stage-menu__item.is-danger {
  color: #ef4444;
}

.job-pipeline-stage-menu__item.is-disabled {
  color: #b8c1d2;
  cursor: not-allowed;
}

.job-pipeline-stage-menu__item.is-disabled:hover {
  background: transparent;
  color: #b8c1d2;
}

.job-pipeline-stage-menu__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #8a96ab;
}

.job-pipeline-stage-menu__icon.is-danger {
  color: #ef4444;
}

.job-pipeline-stage-menu__item.is-disabled .job-pipeline-stage-menu__icon {
  color: #c8d0de;
}

.job-pipeline-column-bar {
  display: block;
  height: 2px;
  margin-bottom: 12px;
  border-radius: 999px;
  background: #d8e0ed;
}

.job-pipeline-column-bar--handle {
  width: 100%;
  padding: 0;
  cursor: grab;
}

.job-pipeline-column-bar--handle:active {
  cursor: grabbing;
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

.job-pipeline-column-bar.is-violet {
  background: #8d6cff;
}

.job-pipeline-column-bar.is-blue {
  background: #6d94ff;
}

.job-pipeline-column-bar.is-slate {
  background: #d7deea;
}

.job-pipeline-column-cards {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.job-pipeline-candidate-card {
  position: relative;
  min-height: 136px;
  padding: 14px 14px 10px;
  border: 1px solid #e3eaf4;
  border-radius: 12px;
  background: #fff;
  cursor: grab;
  box-shadow: 0 8px 18px rgba(20, 28, 48, 0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease, border-color 0.18s ease;
}

.job-pipeline-candidate-card.is-selected {
  border-color: #ff8fca;
  box-shadow: 0 10px 20px rgba(255, 95, 170, 0.08);
}

.job-pipeline-candidate-card.is-menu-open {
  z-index: 12;
}

.job-pipeline-candidate-card:active {
  cursor: grabbing;
}

.job-pipeline-candidate-card.is-dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 10px 24px rgba(22, 36, 71, 0.12);
}

.job-pipeline-card-head {
  display: grid;
  grid-template-columns: 16px 34px minmax(0, 1fr) 20px;
  align-items: flex-start;
  gap: 10px;
}

.job-pipeline-candidate-avatar {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  white-space: nowrap;
  flex: 0 0 34px;
}

.job-pipeline-candidate-avatar > span {
  display: block;
  font-size: 0.58rem;
  font-weight: 700;
  line-height: 1;
  text-align: center;
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

.job-pipeline-candidate-top {
  display: grid;
  gap: 4px;
  align-content: start;
  padding-right: 6px;
}

.job-pipeline-candidate-top strong {
  display: block;
  color: #162447;
  font-size: 0.9rem;
  line-height: 1.12;
  overflow-wrap: anywhere;
}

.job-pipeline-candidate-top span,
.job-pipeline-candidate-bottom small,
.job-pipeline-chart-copy {
  color: #7d889b;
}

.job-pipeline-candidate-top span {
  display: block;
  margin-top: 0;
  font-size: 0.8rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.job-pipeline-card-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #b1bccf;
  cursor: pointer;
}

.job-pipeline-candidate-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  margin-top: 14px;
  align-items: center;
}

.job-pipeline-candidate-bottom strong {
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.job-pipeline-candidate-bottom strong.is-green {
  color: #22b161;
}

.job-pipeline-candidate-bottom strong.is-orange {
  color: #f59e0b;
}

.job-pipeline-candidate-bottom small {
  font-weight: 600;
  font-size: 0.74rem;
  line-height: 1.35;
  text-align: right;
  justify-self: end;
  max-width: 122px;
  overflow-wrap: anywhere;
}

.job-pipeline-candidate-bottom small.is-slate {
  color: #97a3b7;
}

.job-pipeline-candidate-bottom small.is-orange {
  color: #f59e0b;
}

.job-pipeline-candidate-bottom small.is-blue {
  color: #6290ff;
}

.job-pipeline-candidate-bottom small.is-green {
  color: #22b161;
}

.job-pipeline-card-actions {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px dashed #edf1f7;
}

.job-pipeline-card-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #ff7dbd;
  cursor: pointer;
}

.job-pipeline-add-candidate {
  width: 100%;
  height: 28px;
  margin-top: 6px;
  border: 1px dashed #d7deeb;
  border-radius: 10px;
  color: #a1aec2;
  background: transparent;
  cursor: pointer;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
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

  .job-pipeline-feedback-layout {
    grid-template-columns: 1fr;
  }

  .job-pipeline-feedback-candidates {
    border-right: 0;
    padding-right: 0;
  }

  .job-pipeline-feedback-aside {
    position: static;
  }

  .job-pipeline-complete-feedback-options,
  .job-pipeline-complete-feedback-rating-row,
  .job-pipeline-feedback-modal-footer {
    flex-direction: column;
    align-items: stretch;
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

  .job-pipeline-feedback-modal {
    width: min(100%, calc(100vw - 20px));
  }

  .job-pipeline-feedback-summary {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .job-pipeline-feedback-footer-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .job-pipeline-feedback-candidates__head {
    grid-template-columns: 1fr;
  }

  .job-pipeline-feedback-candidates__controls {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .job-pipeline-feedback-candidate {
    grid-template-columns: 28px 54px minmax(0, 1fr);
    align-items: flex-start;
  }

  .job-pipeline-feedback-candidate__stage,
  .job-pipeline-feedback-candidate__meta {
    grid-column: 2 / -1;
  }
}

@media (max-width: 820px) {
  .job-pipeline-feedback-overlay {
    padding: 10px;
  }

  .job-pipeline-feedback-modal .job-pipeline-feedback-modal-head,
  .job-pipeline-feedback-modal .job-pipeline-feedback-modal-footer,
  .job-pipeline-feedback-modal__body {
    padding-left: 20px;
    padding-right: 20px;
  }

  .job-pipeline-feedback-summary {
    grid-template-columns: 1fr;
    padding: 10px 0;
  }

  .job-pipeline-feedback-summary__item,
  .job-pipeline-feedback-summary__priority {
    padding: 14px 18px;
    border-left: 0;
  }

  .job-pipeline-feedback-summary__item + .job-pipeline-feedback-summary__item,
  .job-pipeline-feedback-summary__priority {
    border-top: 1px solid #edf2f8;
  }

  .job-pipeline-complete-feedback-modal .job-pipeline-feedback-modal-head,
  .job-pipeline-complete-feedback-meta,
  .job-pipeline-complete-feedback-section,
  .job-pipeline-feedback-modal-footer.is-complete {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
