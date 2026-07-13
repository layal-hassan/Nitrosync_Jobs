<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import AppSelect from './AppSelect.vue'
import RunBackgroundCheckOverlay from './RunBackgroundCheckOverlay.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
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
})

const emit = defineEmits(['close', 'created'])

const selectedMethod = ref('ai')
const customizeOpen = ref(false)
const confirmRunOpen = ref(false)
const integratedTemplateDetailsOpen = ref(false)
const manualSetupOpen = ref(false)
const manualSetupStep = ref(1)
const manualVerificationLaunchPhase = ref('idle')
const manualVerificationActiveStep = ref(0)
let manualVerificationLaunchTimer = null

const methodOptions = [
  {
    id: 'ai',
    title: 'AI Recommended',
    description:
      'NitroSync recommends the best background check based on this candidate and your company policy.',
    tone: 'pink',
    badge: 'AI',
    icon: 'sparkles',
  },
  {
    id: 'integrated',
    title: 'Integrated Provider',
    description: 'Choose a provider and run the checks electronically.',
    tone: 'neutral',
    icon: 'shield',
  },
  {
    id: 'manual',
    title: 'Manual Verification',
    description: 'You handle all verifications internally with your team.',
    tone: 'neutral',
    icon: 'user',
  },
]

const checkCatalog = [
  { id: 'identity', label: 'Identity Verification' },
  { id: 'employment', label: 'Employment Verification' },
  { id: 'criminal', label: 'Criminal Records (County)' },
  { id: 'education', label: 'Education Verification' },
  { id: 'watchlist', label: 'Global Watchlist' },
  { id: 'license', label: 'Professional License Check' },
  { id: 'reference', label: 'Reference Verification' },
]

const providerOptions = ['Checker']
const templateOptions = ['Software Engineer (US)', 'Engineering Leader (US)', 'Product Designer (US)']
const completionOptions = ['2-3 business days', '3-5 business days', '5-7 business days']
const accountOptions = ['Acme Inc.', 'NitroSync US', 'Monzo Design']
const manualInvitationTemplateOptions = ['Manual Verification - Standard', 'Manual Verification - Friendly', 'Manual Verification - Urgent']

const manualVerificationLaunchSteps = [
  'Creating verification tasks',
  'Assigning reviewers',
  'Creating candidate upload request',
  'Preparing invitation email',
  'Sending reviewer notifications',
]

const recommendationBullets = [
  'Matches job & department',
  'Compliant in United States',
  'Used 34 times this month',
  'Includes all required checks',
  '98% positive completion rate',
  'Aligned with company policy',
]

const candidateFacts = [
  ['Location', 'San Francisco, CA, US', 'mapPin'],
  ['Department', 'Engineering', 'building'],
  ['Employment type', 'Full-time', 'briefcase'],
  ['Start date', 'June 2, 2025', 'calendar'],
]

const timelineSteps = [
  ['Consent email sent', 'Today', 'mail'],
  ['Candidate consents', '1-2 days', 'checkCircle'],
  ['Check in progress', '1-3 days', 'shield'],
  ['Results received', '2-3 days', 'document'],
  ['Hiring team notified', 'Automatically', 'bell'],
]

const defaultCheckIds = checkCatalog.map((item) => item.id)

const integratedProviderFacts = [
  ['API Version', 'v2.3'],
  ['Last sync', 'Today at 10:24 AM'],
  ['Supported countries', '200+'],
  ['Supported checks', '50+'],
  ['Billing account', 'Acme Inc.'],
]

const providerValidationItems = [
  ['Candidate country supported', 'Yes'],
  ['Required checks available', 'Yes'],
  ['Account connected', 'Yes'],
  ['API healthy', 'Healthy'],
  ['Sufficient permissions', 'Yes'],
]

const manualVerificationSteps = [
  ['Create verification tasks', 'Define which checks to perform and what documents are required.', 'clipboard-check'],
  ['Assign internal reviewers', 'Assign tasks to the right team members or departments.', 'users'],
  ['Track progress in real time', 'Monitor each verification step and follow up easily.', 'shield'],
  ['Make final decision', 'Review all results and mark the verification as complete.', 'sparkles'],
]

const manualVerificationReasons = [
  'You have internal processes for verification',
  'You need custom verification methods',
  'You prefer direct communication with references or employers',
  'You want full control over the verification process',
]

const manualSetupStages = computed(() => (
  [
    ['Setup', '1', manualSetupStep.value === 1 ? 'active' : manualSetupStep.value > 1 ? 'completed' : 'pending', 'clipboard-check'],
    ['Assign Reviewers', '2', manualSetupStep.value === 2 ? 'active' : manualSetupStep.value > 2 ? 'completed' : 'pending', 'users'],
    ['Review & Send', '3', manualSetupStep.value === 3 ? 'active' : manualSetupStep.value > 3 ? 'completed' : 'pending', 'document'],
    ['In Progress', '4', 'pending', 'checkCircle'],
    ['Results', '5', 'pending', 'document'],
  ]
))

const manualSetupWorkflow = [
  'Candidate uploads documents',
  'Internal team reviews documents',
  'Contact employers and references',
  'Complete verification tasks',
  'Final review and approval',
  'Verification completed',
]

const manualVerificationCheckCatalog = [
  ['identity', 'Identity Verification', "Verify the candidate's identity using government-issued ID.", 'document', true],
  ['employment', 'Employment Verification', "Confirm candidate's employment history and job details.", 'briefcase', true],
  ['education', 'Education Verification', 'Verify degrees, institutions and educational qualifications.', 'document', true],
  ['reference', 'Reference Verification', 'Contact references to validate work performance and conduct.', 'users', true],
  ['criminal', 'Criminal Record Check', 'Check national or county criminal records.', 'scale', false],
  ['license', 'Professional License Check', 'Verify professional licenses and certifications.', 'document', false],
  ['right-to-work', 'Right to Work Verification', 'Confirm eligibility to work in the specified country.', 'mapPin', false],
  ['address', 'Address Verification', 'Verify current or previous addresses.', 'mapPin', false],
]

const manualRequiredDocumentCatalog = [
  ['passport', 'Passport', true],
  ['payslip', 'Payslip (Latest)', false],
  ['government-id', 'Government ID', true],
  ['driver-license', 'Driver License', false],
  ['diploma', 'Diploma / Degree Certificate', true],
  ['work-permit', 'Work Permit', false],
  ['employment-certificate', 'Employment Certificate', true],
]

const customVerificationTypeOptions = [
  'Document Review',
  'Phone Verification',
  'Email Verification',
  'Website Verification',
  'Physical Verification',
  'Interview Validation',
  'Other',
]

const reviewerOptions = ['Sarah Johnson', 'Alex Carter', 'Priya Patel', 'Talent Ops Team']

const documentCategoryOptions = [
  'Identity Document',
  'Employment Record',
  'Education Certificate',
  'License / Permit',
  'Address Proof',
  'Medical / Compliance',
  'Other',
]

const documentProvidedByOptions = ['Candidate', 'Employer', 'Third Party']

const documentFileTypeOptions = [
  ['pdf', 'PDF', true],
  ['jpg', 'JPG / JPEG', true],
  ['png', 'PNG', true],
  ['docx', 'DOCX', false],
  ['other', 'Other', false],
]

const documentMaxFileSizeOptions = ['5 MB', '10 MB', '20 MB', '50 MB']

const customEvidenceCatalog = [
  ['candidate-upload', 'Candidate uploads document', true],
  ['internal-proof', 'Internal reviewer uploads proof', true],
  ['external-confirmation', 'External contact confirms', false],
  ['notes', 'Notes required', true],
  ['attachment', 'Attachment required', true],
]

const customCheckSuggestions = [
  {
    label: 'Drug Test Review',
    name: 'Drug Test Review',
    description: 'Review external screening results and confirm the report matches the candidate profile.',
    verificationType: 'Document Review',
    evidence: ['candidate-upload', 'internal-proof', 'attachment'],
    requiredDocuments: ['Passport', 'Consent Form', 'Screening Report'],
    priority: 'High',
  },
  {
    label: 'Credential Audit',
    name: 'Credential Audit',
    description: 'Validate submitted certifications and capture a documented reviewer decision.',
    verificationType: 'Document Review',
    evidence: ['candidate-upload', 'internal-proof', 'notes'],
    requiredDocuments: ['License', 'Certificate'],
    priority: 'Medium',
  },
  {
    label: 'Site Validation',
    name: 'On-site Validation',
    description: 'Confirm information through physical or location-based verification.',
    verificationType: 'Physical Verification',
    evidence: ['internal-proof', 'external-confirmation', 'notes'],
    requiredDocuments: ['Address Proof'],
    priority: 'Low',
  },
]

const manualReviewerDirectory = {
  'Sarah Johnson': 'Talent Operations',
  'Michael Chen': 'Compliance',
  'John Smith': 'People Operations',
  'Lisa Brown': 'Employment Specialist',
  'Emma Davis': 'Education Operations',
  'Robert Wilson': 'Approver',
  'David Miller': 'Reference Lead',
  'Jessica Lee': 'Reviewer',
  'Alex Carter': 'People Operations',
  'Priya Patel': 'Talent Operations',
  'Talent Ops Team': 'Team',
  'Compliance Team': '3 members',
}

const manualAssignmentBlueprints = {
  identity: {
    reviewers: [['Sarah Johnson', 'Primary'], ['Michael Chen', 'Reviewer']],
    responsibilities: ['Review ID documents', 'Confirm authenticity'],
    dueDate: 'Jun 10, 2025',
    workloadCount: 3,
    workloadLevel: 'Low',
  },
  employment: {
    reviewers: [['John Smith', 'Primary'], ['Lisa Brown', 'Reviewer']],
    responsibilities: ['Contact previous employer', 'Validate job title & dates', 'Review documentation'],
    dueDate: 'Jun 10, 2025',
    workloadCount: 8,
    workloadLevel: 'Medium',
  },
  education: {
    reviewers: [['Emma Davis', 'Primary'], ['Robert Wilson', 'Approver']],
    responsibilities: ['Validate institution', 'Verify degree & dates', 'Final approval'],
    dueDate: 'Jun 11, 2025',
    workloadCount: 4,
    workloadLevel: 'Low',
  },
  reference: {
    reviewers: [['David Miller', 'Primary'], ['Jessica Lee', 'Reviewer']],
    responsibilities: ['Contact references', 'Assess performance', 'Document findings'],
    dueDate: 'Jun 12, 2025',
    workloadCount: 7,
    workloadLevel: 'Medium',
  },
  criminal: {
    reviewers: [['Michael Chen', 'Primary'], ['Robert Wilson', 'Approver']],
    responsibilities: ['Review criminal search', 'Escalate risk findings'],
    dueDate: 'Jun 11, 2025',
    workloadCount: 5,
    workloadLevel: 'Medium',
  },
  license: {
    reviewers: [['Sarah Johnson', 'Primary'], ['Robert Wilson', 'Approver']],
    responsibilities: ['Verify license status', 'Confirm validity'],
    dueDate: 'Jun 12, 2025',
    workloadCount: 4,
    workloadLevel: 'Low',
  },
  'right-to-work': {
    reviewers: [['Sarah Johnson', 'Primary'], ['Alex Carter', 'Reviewer']],
    responsibilities: ['Review work permit/visa', 'Confirm eligibility'],
    dueDate: 'Jun 10, 2025',
    workloadCount: 3,
    workloadLevel: 'Low',
  },
  address: {
    reviewers: [['Priya Patel', 'Primary'], ['Michael Chen', 'Reviewer']],
    responsibilities: ['Validate submitted proof', 'Confirm address history'],
    dueDate: 'Jun 11, 2025',
    workloadCount: 2,
    workloadLevel: 'Low',
  },
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getCustomCheckIcon(verificationType) {
  const iconMap = {
    'Document Review': 'document',
    'Phone Verification': 'phone',
    'Email Verification': 'mail',
    'Website Verification': 'link',
    'Physical Verification': 'mapPin',
    'Interview Validation': 'users',
    Other: 'clipboard-check',
  }

  return iconMap[verificationType] ?? 'clipboard-check'
}

function getInitials(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function createAssignmentReviewer(name, role) {
  return {
    name,
    role,
    subtitle: manualReviewerDirectory[name] ?? 'Reviewer',
  }
}

function buildCandidateEmail(name) {
  const normalized = (name || 'candidate')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')

  return `${normalized || 'candidate'}@email.com`
}

function buildManualInvitationMessage(name, dueDate) {
  return `Hi ${name || 'there'},

As part of our hiring process, we need to complete a manual verification.

Please upload the requested documents using the secure link below by ${dueDate}.

If you have any questions, please contact our HR team.

Thank you,
People Operations Team`
}

function scrollManualSetupToTop() {
  nextTick(() => {
    manualSetupBodyRef.value?.scrollTo?.({ top: 0, behavior: 'auto' })
  })
}

const templateOverviewFacts = computed(() => [
  ['7', 'Checks included', 'clipboard-check'],
  [integratedConfig.value.completion, 'Est. completion', 'clock'],
  [integratedConfig.value.cost, 'Est. cost', 'wallet'],
  ['United States', 'Applies to', 'mapPin'],
  ['From Checker', 'Template origin', 'document'],
])

const templateDetailRows = [
  ['Identity Verification', "Verifies candidate's identity using government-issued ID.", 'Global', 'Yes', 'shield'],
  ['Employment Verification', 'Confirms past employment history and job titles.', '7 years', 'Yes', 'briefcase'],
  ['Criminal Records (County)', 'Search of county criminal records in reported locations.', '7 years', 'Yes', 'scale'],
  ['Education Verification', 'Verifies highest degree and institution attended.', 'Global', 'Yes', 'document'],
  ['Global Watchlist', 'Checks against global sanction and watchlist databases.', 'Global', 'Yes', 'target'],
  ['Professional License Check', 'Verifies professional licenses and certifications.', 'As applicable', 'Yes', 'document'],
  ['Reference Verification', 'Confirms references and professional character.', '3 references', 'Yes', 'users'],
]

const templateBestFor = [
  'Software Engineer',
  'Backend Engineer',
  'Frontend Engineer',
  'Full-stack Developer',
]

function createCustomizationState() {
  return {
    provider: 'Checker',
    template: 'Software Engineer (US)',
    completion: '2-3 business days',
    cost: '$39.00',
    reason: '',
    checks: [...defaultCheckIds],
  }
}

function createIntegratedState() {
  return {
    provider: 'Checker',
    template: 'Software Engineer (US)',
    account: 'Acme Inc.',
    completion: '2-3 business days',
    cost: '$39.00',
    checks: [...defaultCheckIds],
  }
}

function createManualSetupState() {
  return {
    selectedChecks: manualVerificationCheckCatalog
      .filter(([, , , , selected]) => selected)
      .map(([id]) => id),
    requiredDocuments: manualRequiredDocumentCatalog
      .filter(([, , selected]) => selected)
      .map(([id]) => id),
    dueDate: 'Jun 12, 2025',
    priority: 'Medium',
    notes: '',
    customChecks: [],
    customDocuments: [],
    reviewerAssignments: {},
    notifications: {
      notifyReviewersImmediately: true,
      notifyCandidateAfterAssignments: true,
      notifyHiringManagerOnComplete: true,
    },
    invitationMethod: 'email',
    invitationTemplate: 'Manual Verification - Standard',
    invitationMessage: '',
    allowOneTimeEdits: true,
  }
}

function createCustomCheckDraft() {
  return {
    name: '',
    description: '',
    verificationType: 'Document Review',
    evidence: customEvidenceCatalog
      .filter(([, , selected]) => selected)
      .map(([id]) => id),
    requiredDocuments: ['Passport', 'License', 'Certificate'],
    documentInput: '',
    assignReviewer: true,
    reviewer: 'Sarah Johnson',
    priority: 'Medium',
    dueDate: 'Jun 12, 2025',
  }
}

function createDocumentDraft() {
  return {
    name: '',
    category: '',
    providedBy: 'Candidate',
    required: true,
    aiVerification: true,
    acceptedFileTypes: documentFileTypeOptions
      .filter(([, , selected]) => selected)
      .map(([id]) => id),
    maxFileSize: '20 MB',
    notes: '',
  }
}

function cloneCustomization(source) {
  return {
    provider: source.provider,
    template: source.template,
    completion: source.completion,
    cost: source.cost,
    reason: source.reason,
    checks: [...source.checks],
  }
}

const appliedCustomization = ref(createCustomizationState())
const draftCustomization = ref(createCustomizationState())
const integratedConfig = ref(createIntegratedState())
const manualSetupState = ref(createManualSetupState())
const customCheckModalOpen = ref(false)
const customCheckDraft = ref(createCustomCheckDraft())
const addDocumentModalOpen = ref(false)
const documentDraft = ref(createDocumentDraft())
const manualSetupBodyRef = ref(null)

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const appliedChecks = computed(() => (
  checkCatalog.filter((item) => appliedCustomization.value.checks.includes(item.id))
))

const draftChecks = computed(() => (
  checkCatalog.filter((item) => draftCustomization.value.checks.includes(item.id))
))

const integratedChecks = computed(() => (
  checkCatalog.filter((item) => integratedConfig.value.checks.includes(item.id))
))

const allDraftChecksSelected = computed(() => (
  draftCustomization.value.checks.length === checkCatalog.length
))

const readinessItems = computed(() => [
  ['Consent required', 'Yes'],
  ['Recommended template', appliedCustomization.value.template],
  ['Estimated turnaround', appliedCustomization.value.completion],
  ['Estimated cost', appliedCustomization.value.cost],
  ['Potential issues', 'None detected'],
])

const integratedSummaryFacts = computed(() => [
  ['Job', 'Software Engineer'],
  ['Department', 'Engineering'],
  ['Location', 'San Francisco, CA, US'],
  ['Employment type', 'Full-time'],
  ['Start date', 'June 2, 2025'],
])

const manualSetupChecks = computed(() => (
  [
    ...manualVerificationCheckCatalog.map(([id, label, detail, icon]) => ({
      id,
      label,
      detail,
      icon,
      custom: false,
      meta: '',
      selected: manualSetupState.value.selectedChecks.includes(id),
    })),
    ...manualSetupState.value.customChecks.map((item) => ({
      ...item,
      custom: true,
      meta: item.assignReviewer ? `${item.verificationType} · ${item.reviewer}` : item.verificationType,
      selected: manualSetupState.value.selectedChecks.includes(item.id),
    })),
  ]
))

const manualSetupDocuments = computed(() => (
  [
    ...manualRequiredDocumentCatalog.map(([id, label]) => ({
      id,
      label,
      custom: false,
      selected: manualSetupState.value.requiredDocuments.includes(id),
    })),
    ...manualSetupState.value.customDocuments.map((item) => ({
      ...item,
      custom: true,
      selected: manualSetupState.value.requiredDocuments.includes(item.id),
    })),
  ]
))

const manualSelectedChecks = computed(() => (
  manualSetupChecks.value.filter((item) => item.selected)
))

const manualSelectedDocuments = computed(() => (
  manualSetupDocuments.value.filter((item) => item.selected)
))

const manualReviewerCount = computed(() => (
  Object.values(manualSetupState.value.reviewerAssignments)
    .reduce((total, assignment) => total + (assignment?.reviewers?.length ?? 0), 0)
))

const manualReviewerStats = computed(() => {
  const stats = {}

  Object.values(manualSetupState.value.reviewerAssignments).forEach((assignment) => {
    assignment?.reviewers?.forEach((reviewer) => {
      if (!stats[reviewer.name]) {
        stats[reviewer.name] = {
          name: reviewer.name,
          subtitle: reviewer.subtitle,
          role: reviewer.role,
          checks: 0,
        }
      }

      stats[reviewer.name].checks += 1
    })
  })

  return Object.values(stats).sort((a, b) => b.checks - a.checks || a.name.localeCompare(b.name))
})

const manualCandidateEmail = computed(() => buildCandidateEmail(props.candidateName))

const manualSummaryFacts = computed(() => [
  ...(manualSetupStep.value === 1
    ? [
        ['Verification Checks', `${manualSetupState.value.selectedChecks.length} selected`],
        ['Required Documents', `${manualSetupState.value.requiredDocuments.length} selected`],
        ['Estimated Duration', '2 - 5 business days'],
        ['Priority', manualSetupState.value.priority],
        ['Owner', 'Not assigned yet'],
      ]
    : [
        ['Verification Checks', `${manualSetupState.value.selectedChecks.length}`],
        ['Reviewers Assigned', `${manualReviewerCount.value}`],
        ['Required Documents', `${manualSetupState.value.requiredDocuments.length}`],
        ['Estimated Duration', '2 - 5 business days'],
        ['Due Date', manualSetupState.value.dueDate],
        ['Priority', manualSetupState.value.priority],
      ]),
])

const manualAssignmentRows = computed(() => (
  manualSelectedChecks.value.map((check) => ({
    ...check,
    assignment: manualSetupState.value.reviewerAssignments[check.id],
  }))
))

const manualNotificationCards = computed(() => ([
  [
    'Notify reviewers immediately',
    'Send an email notification as soon as they are assigned.',
    'notifyReviewersImmediately',
    'bell',
  ],
  [
    'Notify candidate after assignments',
    'Inform the candidate that reviewers have been assigned to their verification.',
    'notifyCandidateAfterAssignments',
    'users',
  ],
  [
    'Notify hiring manager when complete',
    'Send a notification when all verifications are completed.',
    'notifyHiringManagerOnComplete',
    'checkCircle',
  ],
]))

const manualReviewMetricCards = computed(() => ([
  ['Verification Checks', `${manualSelectedChecks.value.length}`, 'clipboard-check'],
  ['Reviewers Assigned', `${manualReviewerCount.value}`, 'users'],
  ['Required Documents', `${manualSelectedDocuments.value.length}`, 'document'],
  ['Candidate Email', manualCandidateEmail.value, 'mail'],
  ['AI Validation', 'Passed', 'sparkles'],
]))

const manualValidationChecklist = computed(() => ([
  'All verification checks have reviewers',
  'All reviewers have necessary permissions',
  'All required documents are defined',
  'Due dates are valid',
  'Workflow is complete and ready',
]))

const manualVerificationProgressRows = computed(() => (
  manualVerificationLaunchSteps.map((label, index) => {
    if (index < manualVerificationActiveStep.value) {
      return { label, state: 'completed', progress: 100, statusLabel: 'Completed' }
    }

    if (index === manualVerificationActiveStep.value) {
      return { label, state: 'active', progress: 72, statusLabel: 'In Progress' }
    }

    return { label, state: 'pending', progress: 0, statusLabel: 'Pending' }
  })
))

const manualVerificationStartedFacts = computed(() => ([
  ['Candidate', props.candidateName, 'user'],
  ['Verification Checks', `${manualSelectedChecks.value.length}`, 'clipboard-check'],
  ['Reviewers Assigned', `${manualReviewerCount.value}`, 'users'],
  ['Invitation', 'Sent to candidate', 'mail'],
  ['Status', 'Waiting for Candidate Documents', 'shield'],
]))

const manualStepTip = computed(() => (
  manualSetupStep.value === 1
    ? {
        title: 'What happens next?',
        text: "In the next step, you'll assign team members who will be responsible for each verification.",
      }
    : manualSetupStep.value === 2
      ? {
          title: 'What happens next?',
          text: "In the next step, you'll review all settings before sending the verification request to your team.",
        }
      : {
        title: 'What happens next?',
        text: 'Once you start the verification, the candidate will receive an invitation to upload documents and reviewers will begin their tasks.',
      }
))

const manualNoteCount = computed(() => manualSetupState.value.notes.length)
const customCheckDescriptionCount = computed(() => customCheckDraft.value.description.length)
const customCheckCanSubmit = computed(() => customCheckDraft.value.name.trim().length > 0)
const documentNoteCount = computed(() => documentDraft.value.notes.length)
const documentDraftCanSubmit = computed(() => (
  documentDraft.value.name.trim().length > 0 && documentDraft.value.category.trim().length > 0
))
const documentAcceptedFileTypeLabels = computed(() => (
  documentFileTypeOptions
    .filter(([id]) => documentDraft.value.acceptedFileTypes.includes(id))
    .map(([, label]) => label)
))

const reasonCount = computed(() => draftCustomization.value.reason.length)

const currentProvider = computed(() => (
  selectedMethod.value === 'integrated'
    ? integratedConfig.value.provider
    : appliedCustomization.value.provider
))

const currentTemplate = computed(() => (
  selectedMethod.value === 'integrated'
    ? integratedConfig.value.template
    : appliedCustomization.value.template
))

const currentCompletion = computed(() => (
  selectedMethod.value === 'integrated'
    ? integratedConfig.value.completion
    : appliedCustomization.value.completion
))

const currentCost = computed(() => (
  selectedMethod.value === 'integrated'
    ? integratedConfig.value.cost
    : appliedCustomization.value.cost
))

const currentChecks = computed(() => (
  selectedMethod.value === 'integrated' ? integratedChecks.value : appliedChecks.value
))

const isIntegratedTemplateDetailsView = computed(() => (
  selectedMethod.value === 'integrated' && integratedTemplateDetailsOpen.value
))

function syncDraftFromApplied() {
  draftCustomization.value = cloneCustomization(appliedCustomization.value)
}

function selectMethod(methodId) {
  selectedMethod.value = methodId
  integratedTemplateDetailsOpen.value = false
  manualSetupOpen.value = false

  if (methodId !== 'ai') {
    customizeOpen.value = false
  }
}

function closeOverlay() {
  if (manualVerificationLaunchTimer) {
    clearTimeout(manualVerificationLaunchTimer)
    manualVerificationLaunchTimer = null
  }

  manualVerificationLaunchPhase.value = 'idle'
  manualVerificationActiveStep.value = 0
  customizeOpen.value = false
  confirmRunOpen.value = false
  manualSetupOpen.value = false
  manualSetupStep.value = 1
  customCheckModalOpen.value = false
  addDocumentModalOpen.value = false
  emit('close')
}

function openCustomizePanel() {
  syncDraftFromApplied()
  customizeOpen.value = true
}

function closeCustomizePanel() {
  customizeOpen.value = false
  syncDraftFromApplied()
}

function applyCustomization() {
  appliedCustomization.value = cloneCustomization(draftCustomization.value)
  customizeOpen.value = false
}

function resetCustomization() {
  draftCustomization.value = createCustomizationState()
}

function toggleDraftCheck(checkId) {
  const isSelected = draftCustomization.value.checks.includes(checkId)

  if (isSelected) {
    draftCustomization.value.checks = draftCustomization.value.checks.filter((item) => item !== checkId)
    return
  }

  draftCustomization.value.checks = [...draftCustomization.value.checks, checkId]
}

function toggleSelectAllChecks() {
  draftCustomization.value.checks = allDraftChecksSelected.value ? [] : [...defaultCheckIds]
}

function openRunConfirmation() {
  confirmRunOpen.value = true
}

function openManualSetup() {
  manualSetupOpen.value = true
  manualSetupStep.value = 1
  scrollManualSetupToTop()
}

function closeManualSetup() {
  if (manualVerificationLaunchTimer) {
    clearTimeout(manualVerificationLaunchTimer)
    manualVerificationLaunchTimer = null
  }

  manualVerificationLaunchPhase.value = 'idle'
  manualVerificationActiveStep.value = 0
  manualSetupOpen.value = false
  manualSetupStep.value = 1
}

function syncManualInvitationMessage() {
  manualSetupState.value.invitationMessage = buildManualInvitationMessage(props.candidateName, manualSetupState.value.dueDate)
}

function createDefaultManualAssignment(check) {
  const blueprint = manualAssignmentBlueprints[check.id]

  if (blueprint) {
    return {
      reviewers: blueprint.reviewers.map(([name, role]) => createAssignmentReviewer(name, role)),
      responsibilities: [...blueprint.responsibilities],
      dueDate: blueprint.dueDate,
      workloadCount: blueprint.workloadCount,
      workloadLevel: blueprint.workloadLevel,
    }
  }

  return {
    reviewers: [
      createAssignmentReviewer(check.reviewer || 'Compliance Team', 'Primary'),
    ],
    responsibilities: check.requiredDocuments?.length
      ? [
          `Review ${check.requiredDocuments[0]}`,
          `Confirm ${check.verificationType?.toLowerCase() || 'status'}`,
        ]
      : ['Review submitted documents', 'Confirm status'],
    dueDate: check.dueDate || manualSetupState.value.dueDate,
    workloadCount: 2,
    workloadLevel: check.priority || manualSetupState.value.priority,
  }
}

function syncManualReviewerAssignments() {
  const nextAssignments = {}

  manualSelectedChecks.value.forEach((check) => {
    nextAssignments[check.id] = manualSetupState.value.reviewerAssignments[check.id] || createDefaultManualAssignment(check)
  })

  manualSetupState.value.reviewerAssignments = nextAssignments
}

function goToManualSetupStep(step) {
  if (step === 2) {
    syncManualReviewerAssignments()
  }

  if (step === 3 && !manualSetupState.value.invitationMessage) {
    syncManualInvitationMessage()
  }

  manualSetupStep.value = step
  scrollManualSetupToTop()
}

function goToAssignReviewers() {
  goToManualSetupStep(2)
}

function goBackManualSetupStep() {
  if (manualSetupStep.value === 3) {
    manualSetupStep.value = 2
    scrollManualSetupToTop()
    return
  }

  if (manualSetupStep.value === 2) {
    manualSetupStep.value = 1
    scrollManualSetupToTop()
    return
  }

  closeManualSetup()
}

function resetDocumentDraft() {
  documentDraft.value = createDocumentDraft()
}

function openAddDocumentModal() {
  resetDocumentDraft()
  addDocumentModalOpen.value = true
}

function closeAddDocumentModal() {
  addDocumentModalOpen.value = false
  resetDocumentDraft()
}

function resetCustomCheckDraft() {
  customCheckDraft.value = {
    ...createCustomCheckDraft(),
    dueDate: manualSetupState.value.dueDate,
    priority: manualSetupState.value.priority,
  }
}

function openCustomCheckModal() {
  resetCustomCheckDraft()
  customCheckModalOpen.value = true
}

function closeCustomCheckModal() {
  customCheckModalOpen.value = false
  resetCustomCheckDraft()
}

function openIntegratedTemplateDetails() {
  integratedTemplateDetailsOpen.value = true
}

function closeIntegratedTemplateDetails() {
  integratedTemplateDetailsOpen.value = false
}

function useIntegratedTemplate() {
  integratedTemplateDetailsOpen.value = false
}

function closeRunConfirmation() {
  confirmRunOpen.value = false
}

function launchManualVerification() {
  manualVerificationLaunchPhase.value = 'creating'
  manualVerificationActiveStep.value = 0

  if (manualVerificationLaunchTimer) {
    clearTimeout(manualVerificationLaunchTimer)
  }

  const advanceStep = () => {
    if (manualVerificationActiveStep.value < manualVerificationLaunchSteps.length - 1) {
      manualVerificationActiveStep.value += 1
      manualVerificationLaunchTimer = setTimeout(advanceStep, 520)
      return
    }

    manualVerificationLaunchPhase.value = 'success'
    emit('created', {
      candidateId: props.candidateId,
      reviewMode: 'manual',
    })
    manualVerificationLaunchTimer = null
  }

  manualVerificationLaunchTimer = setTimeout(advanceStep, 520)
}

function viewManualVerificationProgress() {
  if (typeof window !== 'undefined') {
    const query = new URLSearchParams({
      candidateName: props.candidateName,
      candidateRole: props.candidateRole,
    })

    window.location.hash = `#job/${props.jobId}/background-check-progress/${props.candidateId || 'manual'}?${query.toString()}`
  }

  closeOverlay()
}

function completeBackgroundCheck() {
  confirmRunOpen.value = false
  emit('created', {
    candidateId: props.candidateId,
    reviewMode: 'hybrid',
  })
  emit('close')
}

function toggleManualSetupCheck(checkId) {
  const isSelected = manualSetupState.value.selectedChecks.includes(checkId)

  manualSetupState.value.selectedChecks = isSelected
    ? manualSetupState.value.selectedChecks.filter((item) => item !== checkId)
    : [...manualSetupState.value.selectedChecks, checkId]
}

function toggleManualSetupDocument(documentId) {
  const isSelected = manualSetupState.value.requiredDocuments.includes(documentId)

  manualSetupState.value.requiredDocuments = isSelected
    ? manualSetupState.value.requiredDocuments.filter((item) => item !== documentId)
    : [...manualSetupState.value.requiredDocuments, documentId]
}

function toggleCustomEvidence(evidenceId) {
  const isSelected = customCheckDraft.value.evidence.includes(evidenceId)

  customCheckDraft.value.evidence = isSelected
    ? customCheckDraft.value.evidence.filter((item) => item !== evidenceId)
    : [...customCheckDraft.value.evidence, evidenceId]
}

function addCustomRequiredDocument() {
  const label = customCheckDraft.value.documentInput.trim()

  if (!label) {
    return
  }

  if (customCheckDraft.value.requiredDocuments.some((item) => item.toLowerCase() === label.toLowerCase())) {
    customCheckDraft.value.documentInput = ''
    return
  }

  customCheckDraft.value.requiredDocuments = [...customCheckDraft.value.requiredDocuments, label]
  customCheckDraft.value.documentInput = ''
}

function removeCustomRequiredDocument(label) {
  customCheckDraft.value.requiredDocuments = customCheckDraft.value.requiredDocuments.filter((item) => item !== label)
}

function applyCustomCheckSuggestion(suggestion) {
  customCheckDraft.value = {
    ...customCheckDraft.value,
    name: suggestion.name,
    description: suggestion.description,
    verificationType: suggestion.verificationType,
    evidence: [...suggestion.evidence],
    requiredDocuments: [...suggestion.requiredDocuments],
    priority: suggestion.priority,
  }
}

function resolveDocumentEntry(label) {
  const normalized = label.trim().toLowerCase()
  const baseDocument = manualRequiredDocumentCatalog.find(([, itemLabel]) => itemLabel.toLowerCase() === normalized)

  if (baseDocument) {
    return { id: baseDocument[0], label: baseDocument[1], custom: false }
  }

  const customDocument = manualSetupState.value.customDocuments.find((item) => item.label.toLowerCase() === normalized)

  if (customDocument) {
    return { ...customDocument, custom: true }
  }

  return {
    id: `custom-document-${slugify(label)}`,
    label: label.trim(),
    custom: true,
  }
}

function toggleDocumentFileType(fileTypeId) {
  const isSelected = documentDraft.value.acceptedFileTypes.includes(fileTypeId)

  documentDraft.value.acceptedFileTypes = isSelected
    ? documentDraft.value.acceptedFileTypes.filter((item) => item !== fileTypeId)
    : [...documentDraft.value.acceptedFileTypes, fileTypeId]
}

function addManualDocument() {
  if (!documentDraftCanSubmit.value) {
    return
  }

  const label = documentDraft.value.name.trim()
  const documentEntry = resolveDocumentEntry(label)

  if (documentEntry.custom) {
    const customDocument = {
      ...documentEntry,
      category: documentDraft.value.category,
      providedBy: documentDraft.value.providedBy,
      required: documentDraft.value.required,
      aiVerification: documentDraft.value.aiVerification,
      acceptedFileTypes: [...documentDraft.value.acceptedFileTypes],
      maxFileSize: documentDraft.value.maxFileSize,
      notes: documentDraft.value.notes.trim(),
    }

    if (!manualSetupState.value.customDocuments.some((item) => item.id === customDocument.id)) {
      manualSetupState.value.customDocuments = [...manualSetupState.value.customDocuments, customDocument]
    } else {
      manualSetupState.value.customDocuments = manualSetupState.value.customDocuments.map((item) => (
        item.id === customDocument.id ? customDocument : item
      ))
    }
  }

  if (!manualSetupState.value.requiredDocuments.includes(documentEntry.id)) {
    manualSetupState.value.requiredDocuments = [...manualSetupState.value.requiredDocuments, documentEntry.id]
  }

  closeAddDocumentModal()
}

function addReviewerToAssignment(checkId) {
  const assignment = manualSetupState.value.reviewerAssignments[checkId]

  if (!assignment) {
    return
  }

  const nextReviewerName = Object.keys(manualReviewerDirectory).find((name) => (
    !assignment.reviewers.some((reviewer) => reviewer.name === name)
  ))

  if (!nextReviewerName) {
    return
  }

  manualSetupState.value.reviewerAssignments = {
    ...manualSetupState.value.reviewerAssignments,
    [checkId]: {
      ...assignment,
      reviewers: [...assignment.reviewers, createAssignmentReviewer(nextReviewerName, 'Reviewer')],
    },
  }
}

function toggleManualNotification(notificationKey) {
  manualSetupState.value.notifications = {
    ...manualSetupState.value.notifications,
    [notificationKey]: !manualSetupState.value.notifications[notificationKey],
  }
}

function addCustomCheck() {
  if (!customCheckCanSubmit.value) {
    return
  }

  const resolvedDocuments = customCheckDraft.value.requiredDocuments.map((label) => resolveDocumentEntry(label))
  const customDocuments = [...manualSetupState.value.customDocuments]

  resolvedDocuments.forEach((item) => {
    if (item.custom && !customDocuments.some((document) => document.id === item.id)) {
      customDocuments.push(item)
    }
  })

  const customCheck = {
    id: `custom-check-${Date.now()}`,
    label: customCheckDraft.value.name.trim(),
    detail: customCheckDraft.value.description.trim() || 'Custom verification configured for this candidate.',
    icon: getCustomCheckIcon(customCheckDraft.value.verificationType),
    verificationType: customCheckDraft.value.verificationType,
    reviewer: customCheckDraft.value.reviewer,
    assignReviewer: customCheckDraft.value.assignReviewer,
    priority: customCheckDraft.value.priority,
    dueDate: customCheckDraft.value.dueDate,
    evidence: [...customCheckDraft.value.evidence],
    requiredDocuments: resolvedDocuments.map((item) => item.label),
  }

  manualSetupState.value.customChecks = [...manualSetupState.value.customChecks, customCheck]
  manualSetupState.value.customDocuments = customDocuments
  manualSetupState.value.selectedChecks = [...manualSetupState.value.selectedChecks, customCheck.id]
  manualSetupState.value.requiredDocuments = [
    ...new Set([
      ...manualSetupState.value.requiredDocuments,
      ...resolvedDocuments.map((item) => item.id),
    ]),
  ]

  closeCustomCheckModal()
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : ''
}

watch(
  () => [
    manualSetupState.value.selectedChecks.join('|'),
    manualSetupState.value.customChecks.map((item) => item.id).join('|'),
  ],
  () => {
    syncManualReviewerAssignments()
  },
)

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      selectedMethod.value = 'ai'
      customizeOpen.value = false
      confirmRunOpen.value = false
      integratedTemplateDetailsOpen.value = false
      manualSetupOpen.value = false
      manualSetupStep.value = 1
      customCheckModalOpen.value = false
      addDocumentModalOpen.value = false
      appliedCustomization.value = createCustomizationState()
      draftCustomization.value = createCustomizationState()
      integratedConfig.value = createIntegratedState()
      manualSetupState.value = createManualSetupState()
      manualSetupState.value.invitationMessage = buildManualInvitationMessage(props.candidateName, manualSetupState.value.dueDate)
      customCheckDraft.value = createCustomCheckDraft()
      documentDraft.value = createDocumentDraft()
      manualVerificationLaunchPhase.value = 'idle'
      manualVerificationActiveStep.value = 0
    }
  },
)

onBeforeUnmount(() => {
  if (manualVerificationLaunchTimer) {
    clearTimeout(manualVerificationLaunchTimer)
  }

  manualVerificationLaunchPhase.value = 'idle'
  manualVerificationActiveStep.value = 0
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="background-check-overlay" @click.self="closeOverlay">
      <section class="background-check-modal">
        <header class="background-check-modal__head" :class="{ 'is-progress': manualSetupOpen }">
          <div class="background-check-modal__title">
            <span class="background-check-modal__title-icon">
              <AppIcon name="shield" :size="18" />
            </span>
            <div>
              <h2>{{ manualSetupOpen ? 'Background Check Progress' : 'Background Check' }}</h2>
              <p>{{ manualSetupOpen ? 'Manual Verification Setup' : `Start a background check request for ${candidateName}` }}</p>
            </div>
          </div>

          <div v-if="manualSetupOpen" class="background-check-modal__progress-steps">
            <article
              v-for="[label, step, state, icon] in manualSetupStages"
              :key="label"
              class="background-check-manual-setup__step"
              :class="`is-${state}`"
            >
              <span>
                <AppIcon :name="icon" :size="13" />
                <i>{{ step }}</i>
              </span>
              <strong>{{ label }}</strong>
            </article>
          </div>

          <button type="button" aria-label="Close background check" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div
          ref="manualSetupBodyRef"
          class="background-check-modal__body"
          :class="{ 'is-manual-setup': manualSetupOpen }"
        >
          <div class="background-check-workspace" :class="{ 'is-customizing': customizeOpen && selectedMethod === 'ai' }">
            <div v-if="manualSetupOpen" class="background-check-manual-setup">
              <div class="background-check-manual-setup__grid">
                <aside class="background-check-manual-setup__sidebar">
                  <article class="background-check-summary__card background-check-manual-setup__candidate-card">
                    <div class="background-check-manual-setup__candidate">
                      <span class="background-check-avatar">{{ candidateInitials }}</span>
                      <div>
                        <strong>{{ candidateName }}</strong>
                        <p>{{ candidateRole }}</p>
                        <small>Software Engineer (US)</small>
                      </div>
                    </div>

                    <button type="button" class="background-check-secondary">
                      View Candidate Profile
                      <AppIcon name="external-link" :size="13" />
                    </button>
                  </article>

                  <article class="background-check-summary__card">
                    <h4>Request Overview</h4>
                    <dl class="background-check-manual-setup__facts">
                      <div>
                        <dt>Verification Type</dt>
                        <dd><span>Manual</span></dd>
                      </div>
                      <div>
                        <dt>Requested by</dt>
                        <dd>Sarah Johnson</dd>
                      </div>
                      <div>
                        <dt>Request date</dt>
                        <dd>May 12, 2025 - 10:24 AM</dd>
                      </div>
                      <div>
                        <dt>Owner</dt>
                        <dd>Not assigned yet</dd>
                      </div>
                      <div>
                        <dt>Due date</dt>
                        <dd>{{ manualSetupState.dueDate }}</dd>
                      </div>
                      <div>
                        <dt>Priority</dt>
                        <dd class="is-priority">
                          <span class="background-check-manual-setup__priority-dot" />
                          {{ manualSetupState.priority }}
                        </dd>
                      </div>
                    </dl>
                  </article>

                  <article class="background-check-summary__card background-check-manual-setup__help">
                    <span>
                      <AppIcon name="sparkles" :size="16" />
                    </span>
                    <div>
                      <strong>Need Help?</strong>
                      <p>If you have any questions, please contact our support team.</p>
                      <button type="button" class="background-check-manual-setup__support-link">
                        Contact Support
                        <AppIcon name="external-link" :size="12" />
                      </button>
                    </div>
                  </article>
                </aside>

                <div class="background-check-manual-setup__main">
                  <template v-if="manualSetupStep === 1">
                    <article class="background-check-summary__card">
                      <h4>1. Select Verification Checks</h4>
                      <p>Choose the checks you want your team to perform for this candidate.</p>

                      <div class="background-check-manual-setup__checks-grid">
                        <label
                          v-for="item in manualSetupChecks"
                          :key="item.id"
                          class="background-check-manual-setup__check-card"
                          :class="{ 'is-selected': item.selected, 'is-generated': item.custom }"
                        >
                          <input
                            :checked="item.selected"
                            type="checkbox"
                            @change="toggleManualSetupCheck(item.id)"
                          >
                          <span class="background-check-manual-setup__check-toggle">
                            <AppIcon name="check" :size="11" />
                          </span>
                          <div class="background-check-manual-setup__check-icon">
                            <AppIcon :name="item.icon" :size="13" />
                          </div>
                          <strong>{{ item.label }}</strong>
                          <p>{{ item.detail }}</p>
                          <small v-if="item.meta" class="background-check-manual-setup__check-meta">{{ item.meta }}</small>
                        </label>

                        <button
                          type="button"
                          class="background-check-manual-setup__check-card is-custom"
                          @click="openCustomCheckModal"
                        >
                          <span class="background-check-manual-setup__check-toggle is-empty" />
                          <strong>+ Custom Check</strong>
                          <p>Create a custom verification check for this candidate.</p>
                        </button>
                      </div>
                    </article>

                    <div class="background-check-manual-setup__bottom-grid">
                      <article class="background-check-summary__card">
                        <h4>2. Candidate Documents Required</h4>
                        <p>Select the documents you want the candidate to upload.</p>

                        <div class="background-check-manual-setup__documents-grid">
                          <label
                            v-for="item in manualSetupDocuments"
                            :key="item.id"
                            class="background-check-manual-setup__document-row"
                          >
                            <input
                              :checked="item.selected"
                              type="checkbox"
                              @change="toggleManualSetupDocument(item.id)"
                            >
                            <span class="background-check-manual-setup__document-toggle">
                              <AppIcon name="check" :size="10" />
                            </span>
                            <span>{{ item.label }}</span>
                          </label>

                          <button
                            type="button"
                            class="background-check-manual-setup__document-add"
                            @click="openAddDocumentModal"
                          >
                            <AppIcon name="plus" :size="12" />
                            Add document
                          </button>
                        </div>
                      </article>

                      <article class="background-check-summary__card">
                        <h4>3. Additional Settings</h4>

                        <div class="background-check-manual-setup__settings">
                          <label>
                            <span>Due Date</span>
                            <input v-model="manualSetupState.dueDate" type="text">
                          </label>

                          <div>
                            <span>Priority</span>
                            <div class="background-check-manual-setup__priority-group">
                              <button
                                v-for="level in ['Low', 'Medium', 'High']"
                                :key="level"
                                type="button"
                                :class="{ 'is-active': manualSetupState.priority === level }"
                                @click="manualSetupState.priority = level"
                              >
                                {{ level }}
                              </button>
                            </div>
                          </div>

                          <label>
                            <span>Notes (Optional)</span>
                            <textarea
                              v-model="manualSetupState.notes"
                              rows="5"
                              maxlength="250"
                              placeholder="Add any notes or special instructions for your team..."
                            ></textarea>
                            <small>{{ manualNoteCount }}/250</small>
                          </label>
                        </div>
                      </article>
                    </div>
                  </template>

                  <template v-else-if="manualSetupStep === 2">
                    <div class="background-check-manual-setup__assign-shell">
                      <article class="background-check-summary__card background-check-manual-setup__assign-card">
                        <div class="background-check-manual-setup__assign-head">
                          <h4>3. Assign Reviewers</h4>
                          <p>Assign team members who will be responsible for completing each verification check.</p>
                        </div>

                        <div class="background-check-manual-setup__assign-table">
                          <div class="background-check-manual-setup__assign-table-head">
                            <span>Verification Check</span>
                            <span>Assigned Reviewers</span>
                            <span>Roles &amp; Responsibilities</span>
                            <span>Due Date</span>
                            <span>Workload</span>
                          </div>

                          <article
                            v-for="item in manualAssignmentRows"
                            :key="item.id"
                            class="background-check-manual-setup__assign-row"
                          >
                            <div class="background-check-manual-setup__assign-check">
                              <span class="background-check-manual-setup__assign-check-icon">
                                <AppIcon :name="item.icon" :size="13" />
                              </span>
                              <div>
                                <strong>{{ item.label }}</strong>
                                <p>{{ item.detail }}</p>
                              </div>
                            </div>

                            <div class="background-check-manual-setup__assign-reviewers">
                              <article
                                v-for="reviewer in item.assignment.reviewers"
                                :key="`${item.id}-${reviewer.name}`"
                                class="background-check-manual-setup__reviewer-item"
                              >
                                <span class="background-check-manual-setup__reviewer-avatar">{{ getInitials(reviewer.name) }}</span>
                                <div>
                                  <strong>{{ reviewer.name }}</strong>
                                  <small>{{ reviewer.subtitle }}</small>
                                </div>
                                <em class="background-check-manual-setup__reviewer-role">{{ reviewer.role }}</em>
                              </article>

                              <button
                                type="button"
                                class="background-check-manual-setup__add-reviewer"
                                @click="addReviewerToAssignment(item.id)"
                              >
                                <AppIcon name="plus" :size="11" />
                                Add Reviewer
                              </button>
                            </div>

                            <div class="background-check-manual-setup__assign-responsibilities">
                              <span
                                v-for="responsibility in item.assignment.responsibilities"
                                :key="responsibility"
                              >
                                {{ responsibility }}
                              </span>
                            </div>

                            <div class="background-check-manual-setup__assign-date">
                              <AppIcon name="calendar" :size="13" />
                              <span>{{ item.assignment.dueDate }}</span>
                            </div>

                            <div
                              class="background-check-manual-setup__assign-workload"
                              :class="`is-${item.assignment.workloadLevel.toLowerCase()}`"
                            >
                              <strong>{{ item.assignment.workloadCount }} active</strong>
                              <small>{{ item.assignment.workloadLevel }}</small>
                            </div>
                          </article>
                        </div>

                        <button
                          type="button"
                          class="background-check-manual-setup__add-check"
                          @click="goToManualSetupStep(1)"
                        >
                          <AppIcon name="plus" :size="12" />
                          Add Another Verification Check
                        </button>
                      </article>

                      <article class="background-check-summary__card background-check-manual-setup__notifications">
                        <h4>Notification Settings</h4>

                        <div class="background-check-manual-setup__notifications-grid">
                          <article
                            v-for="[title, detail, key, icon] in manualNotificationCards"
                            :key="key"
                            class="background-check-manual-setup__notification-card"
                          >
                            <div class="background-check-manual-setup__notification-copy">
                              <span>
                                <AppIcon :name="icon" :size="14" />
                              </span>
                              <div>
                                <strong>{{ title }}</strong>
                                <p>{{ detail }}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              class="background-check-manual-setup__switch"
                              :class="{ 'is-active': manualSetupState.notifications[key] }"
                              @click="toggleManualNotification(key)"
                            >
                              <i />
                            </button>
                          </article>
                        </div>
                      </article>
                    </div>
                  </template>

                  <template v-else>
                    <div class="background-check-manual-review">
                      <article class="background-check-summary__card background-check-manual-review__hero">
                        <div class="background-check-manual-review__hero-copy">
                          <span>
                            <AppIcon name="checkCircle" :size="18" />
                          </span>
                          <div>
                            <strong>Manual Verification Ready</strong>
                            <p>Everything looks good. You can now send the verification request to the candidate.</p>
                          </div>
                        </div>

                        <div class="background-check-manual-review__hero-metrics">
                          <article
                            v-for="[label, value, icon] in manualReviewMetricCards"
                            :key="label"
                          >
                            <span>
                              <AppIcon :name="icon" :size="13" />
                            </span>
                            <div>
                              <strong>{{ value }}</strong>
                              <small>{{ label }}</small>
                            </div>
                          </article>
                        </div>
                      </article>

                      <div class="background-check-manual-review__grid">
                        <article class="background-check-summary__card background-check-manual-review__panel">
                          <div class="background-check-manual-review__panel-head">
                            <h4>Verification Checks ({{ manualSelectedChecks.length }})</h4>
                            <button type="button">View all verification details</button>
                          </div>

                          <div class="background-check-manual-review__list">
                            <article v-for="item in manualSelectedChecks" :key="item.id">
                              <span>
                                <AppIcon :name="item.icon" :size="13" />
                              </span>
                              <div>
                                <strong>{{ item.label }}</strong>
                                <small>{{ manualSetupState.reviewerAssignments[item.id]?.reviewers?.length || 0 }} reviewers</small>
                              </div>
                            </article>
                          </div>
                        </article>

                        <article class="background-check-summary__card background-check-manual-review__panel">
                          <div class="background-check-manual-review__panel-head">
                            <h4>Assigned Reviewers ({{ manualReviewerCount }})</h4>
                            <button type="button">View all reviewers</button>
                          </div>

                          <div class="background-check-manual-review__list">
                            <article v-for="reviewer in manualReviewerStats.slice(0, 5)" :key="reviewer.name">
                              <span class="is-avatar">{{ getInitials(reviewer.name) }}</span>
                              <div>
                                <strong>{{ reviewer.name }}</strong>
                                <small>{{ reviewer.role }}</small>
                              </div>
                              <em>{{ reviewer.checks }} checks</em>
                            </article>
                          </div>
                        </article>

                        <article class="background-check-summary__card background-check-manual-review__panel">
                          <div class="background-check-manual-review__panel-head">
                            <h4>Required Documents ({{ manualSelectedDocuments.length }})</h4>
                            <button type="button">View all documents</button>
                          </div>

                          <div class="background-check-manual-review__list">
                            <article v-for="item in manualSelectedDocuments" :key="item.id">
                              <span>
                                <AppIcon name="document" :size="13" />
                              </span>
                              <div>
                                <strong>{{ item.label }}</strong>
                                <small>{{ item.custom ? 'Custom requirement' : 'Standard requirement' }}</small>
                              </div>
                            </article>
                          </div>
                        </article>
                      </div>

                      <article class="background-check-summary__card background-check-manual-review__invitation">
                        <div class="background-check-manual-review__invitation-head">
                          <div>
                            <h4>Candidate Invitation</h4>
                            <p>Choose a template or write your own invitation message.</p>
                          </div>
                        </div>

                        <div class="background-check-manual-review__invitation-shell">
                          <label class="background-check-manual-review__invite-field background-check-manual-review__invite-email">
                            <span>Send invitation to</span>
                            <div class="background-check-manual-review__email-input">
                              <AppIcon name="mail" :size="13" />
                              <input :value="manualCandidateEmail" type="text" readonly>
                            </div>
                          </label>

                          <div class="background-check-manual-review__invite-template">
                            <span>Email Template</span>
                            <div class="background-check-manual-review__template-control">
                              <AppSelect
                                v-model="manualSetupState.invitationTemplate"
                                :options="manualInvitationTemplateOptions"
                              />

                              <div class="background-check-manual-review__inline-actions">
                                <button type="button">
                                  <AppIcon name="eye" :size="13" />
                                  Preview
                                </button>
                                <button type="button">
                                  <AppIcon name="edit" :size="13" />
                                  Edit
                                </button>
                                <button type="button" class="is-icon-only" aria-label="More actions">
                                  <AppIcon name="more" :size="13" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div class="background-check-manual-review__invite-method">
                            <span>Invitation Method</span>
                            <div class="background-check-manual-review__method-grid">
                              <button
                                type="button"
                                :class="{ 'is-active': manualSetupState.invitationMethod === 'email' }"
                                @click="manualSetupState.invitationMethod = 'email'"
                              >
                                <AppIcon name="mail" :size="13" />
                                <div>
                                  <strong>Email Invitation</strong>
                                  <small>Send via email</small>
                                </div>
                              </button>

                              <button
                                type="button"
                                :class="{ 'is-active': manualSetupState.invitationMethod === 'link' }"
                                @click="manualSetupState.invitationMethod = 'link'"
                              >
                                <AppIcon name="link" :size="13" />
                                <div>
                                  <strong>Share Link</strong>
                                  <small>Get shareable link</small>
                                </div>
                              </button>
                            </div>
                          </div>

                          <div class="background-check-manual-review__invite-message">
                            <span>Message Preview</span>
                            <textarea
                              v-model="manualSetupState.invitationMessage"
                              rows="9"
                            ></textarea>

                            <label class="background-check-manual-review__allow-edit">
                              <input v-model="manualSetupState.allowOneTimeEdits" type="checkbox">
                              <span class="background-check-manual-review__checkbox">
                                <AppIcon name="check" :size="10" />
                              </span>
                              <span>Allow one-time edits for this request</span>
                            </label>
                          </div>

                          <aside class="background-check-manual-review__actions background-check-manual-review__invite-actions">
                            <button type="button">
                              <AppIcon name="copy" :size="13" />
                              <div>
                                <strong>Use Template</strong>
                                <small>Choose from saved templates</small>
                              </div>
                            </button>
                            <button type="button">
                              <AppIcon name="edit" :size="13" />
                              <div>
                                <strong>Edit for This Request</strong>
                                <small>Customize without saving</small>
                              </div>
                            </button>
                            <button type="button">
                              <AppIcon name="plus" :size="13" />
                              <div>
                                <strong>Create New Template</strong>
                                <small>Save as reusable template</small>
                              </div>
                            </button>
                            <button type="button">
                              <AppIcon name="sparkles" :size="13" />
                              <div>
                                <strong>Generate with AI</strong>
                                <small>Create message with AI</small>
                              </div>
                              <em>AI</em>
                            </button>
                          </aside>
                        </div>
                      </article>
                    </div>
                  </template>
                </div>

                <aside class="background-check-manual-setup__summary">
                  <article class="background-check-summary__card">
                    <h4>{{ manualSetupStep === 3 ? 'Final Summary' : 'Verification Summary' }}</h4>
                    <dl class="background-check-manual-setup__facts">
                      <div v-for="[label, value] in manualSummaryFacts" :key="label">
                        <dt>{{ label }}</dt>
                        <dd>{{ value }}</dd>
                      </div>
                    </dl>
                  </article>

                  <article
                    v-if="manualSetupStep !== 3"
                    class="background-check-summary__card background-check-manual-setup__workflow"
                  >
                    <h4>Manual Verification Workflow</h4>
                    <div class="background-check-manual-setup__workflow-list">
                      <article v-for="item in manualSetupWorkflow" :key="item">
                        <span class="background-check-manual-setup__workflow-icon">
                          <AppIcon name="document" :size="12" />
                        </span>
                        <span class="background-check-manual-setup__workflow-text">{{ item }}</span>
                      </article>
                    </div>
                  </article>

                  <article
                    v-else
                    class="background-check-summary__card background-check-manual-review__validation"
                  >
                    <h4>NitroSync AI Validation</h4>
                    <div class="background-check-manual-review__validation-list">
                      <article v-for="item in manualValidationChecklist" :key="item">
                        <AppIcon name="checkCircle" :size="13" />
                        <span>{{ item }}</span>
                      </article>
                    </div>
                    <button type="button" class="background-check-manual-review__validation-button">
                      Ready to Send
                      <AppIcon name="checkCircle" :size="13" />
                    </button>
                  </article>

                  <article class="background-check-summary__card background-check-manual-setup__tip">
                    <span class="background-check-manual-setup__tip-icon">
                      <AppIcon name="info" :size="14" />
                    </span>
                    <div>
                      <strong>{{ manualStepTip.title }}</strong>
                      <p>{{ manualStepTip.text }}</p>
                    </div>
                  </article>
                </aside>
              </div>

              <div class="background-check-manual-setup__foot">
                <button type="button" class="background-check-secondary" @click="goBackManualSetupStep">
                  <AppIcon name="chevronLeft" :size="13" />
                  Back
                </button>
                <button
                  type="button"
                  class="background-check-primary"
                  @click="manualSetupStep === 1 ? goToAssignReviewers() : manualSetupStep === 2 ? goToManualSetupStep(3) : launchManualVerification()"
                >
                  {{ manualSetupStep === 1 ? 'Continue to Assign Reviewers' : manualSetupStep === 2 ? 'Continue to Review & Send' : 'Start Manual Verification' }}
                  <AppIcon name="chevronRight" :size="14" />
                </button>
              </div>
            </div>

            <div v-else class="background-check-main-content">
              <section class="background-check-candidate">
                <div class="background-check-candidate__identity">
                  <span class="background-check-avatar">{{ candidateInitials }}</span>
                  <div>
                    <strong>{{ candidateName }}</strong>
                    <p>{{ candidateRole }}</p>
                    <div class="background-check-candidate__tags">
                      <span>Software Engineer</span>
                      <span>Engineering</span>
                      <span>Full-time</span>
                    </div>
                  </div>
                </div>

                <div class="background-check-candidate__facts">
                  <article v-for="[label, value, icon] in candidateFacts" :key="label">
                    <small>{{ label }}</small>
                    <strong>
                      <AppIcon :name="icon" :size="13" />
                      {{ value }}
                    </strong>
                  </article>
                </div>
              </section>

              <section class="background-check-methods-shell">
                <section class="background-check-methods">
                  <h3>Select Verification Type</h3>

                  <div class="background-check-methods__grid">
                    <button
                      v-for="option in methodOptions"
                      :key="option.id"
                      type="button"
                      class="background-check-method"
                      :class="[{ 'is-active': selectedMethod === option.id }, `is-${option.tone}`]"
                      @click="selectMethod(option.id)"
                    >
                      <div class="background-check-method__head">
                        <span class="background-check-method__icon">
                          <AppIcon :name="option.icon" :size="15" />
                        </span>
                        <span class="background-check-method__radio" />
                      </div>

                      <div class="background-check-method__copy">
                        <strong>
                          {{ option.title }}
                          <em v-if="option.badge">{{ option.badge }}</em>
                        </strong>
                        <p>{{ option.description }}</p>
                      </div>
                    </button>
                  </div>
                </section>
              </section>

              <template v-if="selectedMethod === 'integrated'">
                <section class="background-check-integrated-shell">
                  <div class="background-check-integrated-main">
                    <template v-if="!isIntegratedTemplateDetailsView">
                      <small>Integrated Background Check</small>

                      <article class="background-check-package background-check-integrated-card">
                        <div class="background-check-integrated-card__grid">
                          <div class="background-check-integrated-card__field">
                            <label>Provider</label>
                            <select v-model="integratedConfig.provider">
                              <option v-for="option in providerOptions" :key="option" :value="option">{{ option }}</option>
                            </select>

                            <div class="background-check-integrated-card__stack">
                              <small>Connection status</small>
                              <span class="background-check-integrated-card__status">Connected</span>
                            </div>

                            <div class="background-check-integrated-card__stack">
                              <small>Account</small>
                              <select v-model="integratedConfig.account">
                                <option v-for="option in accountOptions" :key="option" :value="option">{{ option }}</option>
                              </select>
                            </div>
                          </div>

                          <div class="background-check-integrated-card__field">
                            <label>Available Provider Templates</label>
                            <select v-model="integratedConfig.template">
                              <option v-for="option in templateOptions" :key="option" :value="option">{{ option }}</option>
                            </select>

                            <button type="button" class="background-check-integrated-card__link" @click="openIntegratedTemplateDetails">
                              View template details
                              <AppIcon name="info" :size="13" />
                            </button>

                            <div class="background-check-integrated-card__template-meta">
                              <article>
                                <small>Template origin</small>
                                <strong>Provider Template</strong>
                              </article>
                              <article>
                                <small>Last updated by provider</small>
                                <strong>May 28, 2025</strong>
                              </article>
                              <article>
                                <small>Template description</small>
                                <strong>Standard background screening for Software Engineer roles in the United States.</strong>
                              </article>
                            </div>
                          </div>

                          <div class="background-check-integrated-card__checks">
                            <label>Included Checks ({{ integratedChecks.length }})</label>
                            <div class="background-check-integrated-card__check-list">
                              <article v-for="item in integratedChecks" :key="item.id">
                                <span>
                                  <AppIcon name="check" :size="11" />
                                </span>
                                <strong>{{ item.label }}</strong>
                                <AppIcon name="info" :size="12" />
                              </article>
                            </div>
                          </div>
                        </div>

                        <div class="background-check-integrated-card__metrics">
                          <article>
                            <span class="is-violet">
                              <AppIcon name="wallet" :size="14" />
                            </span>
                            <div>
                              <small>Estimated Cost</small>
                              <strong>{{ integratedConfig.cost }}</strong>
                            </div>
                          </article>
                          <article>
                            <span class="is-green">
                              <AppIcon name="clock" :size="14" />
                            </span>
                            <div>
                              <small>Estimated Completion</small>
                              <strong>{{ integratedConfig.completion }}</strong>
                            </div>
                          </article>
                          <article>
                            <span class="is-blue">
                              <AppIcon name="copy" :size="14" />
                            </span>
                            <div>
                              <small>Billing</small>
                              <strong>Billed to {{ integratedConfig.account }} via Checker</strong>
                            </div>
                          </article>
                        </div>

                        <div class="background-check-integrated-card__notice">
                          <AppIcon name="info" :size="14" />
                          <p>The cost and completion time are provided by Checker and may vary based on candidate details.</p>
                        </div>
                      </article>
                    </template>

                    <template v-else>
                      <button type="button" class="background-check-template-details__back" @click="closeIntegratedTemplateDetails">
                        <AppIcon name="chevronLeft" :size="13" />
                        Back to integrated provider
                      </button>

                      <article class="background-check-template-details">
                        <div class="background-check-template-details__head">
                          <div>
                            <h3>Template Details: {{ integratedConfig.template }}</h3>
                            <p>
                              Provider template
                              <span>&bull;</span>
                              Last updated by provider on May 28, 2025
                            </p>
                          </div>

                          <div class="background-check-template-details__head-actions">
                            <span>From Checker</span>
                            <button type="button" class="background-check-secondary" @click="useIntegratedTemplate">
                              Use this template
                            </button>
                          </div>
                        </div>

                        <div class="background-check-template-details__content">
                          <div class="background-check-template-details__main">
                            <section class="background-check-template-details__overview">
                              <h4>Template Overview</h4>
                              <div class="background-check-template-details__overview-grid">
                                <article v-for="[value, label, icon] in templateOverviewFacts" :key="label">
                                  <span>
                                    <AppIcon :name="icon" :size="13" />
                                  </span>
                                  <div>
                                    <strong>{{ value }}</strong>
                                    <small>{{ label }}</small>
                                  </div>
                                </article>
                              </div>
                            </section>

                            <section class="background-check-template-details__checks">
                              <h4>Included Checks</h4>

                              <div class="background-check-template-details__checks-table">
                                <div class="background-check-template-details__checks-head">
                                  <span>Check</span>
                                  <span>Description</span>
                                  <span>Scope</span>
                                  <span>Required</span>
                                </div>

                                <article v-for="[label, description, scope, required, icon] in templateDetailRows" :key="label">
                                  <div class="background-check-template-details__check">
                                    <span>
                                      <AppIcon :name="icon" :size="12" />
                                    </span>
                                    <strong>{{ label }}</strong>
                                  </div>
                                  <p>{{ description }}</p>
                                  <small>{{ scope }}</small>
                                  <em>
                                    <AppIcon name="checkCircle" :size="12" />
                                    {{ required }}
                                  </em>
                                </article>
                              </div>

                              <div class="background-check-template-details__note">
                                <AppIcon name="info" :size="13" />
                                <p>The scope and availability of checks may vary based on candidate location and data sources.</p>
                              </div>
                            </section>
                          </div>

                          <aside class="background-check-template-details__side">
                            <section class="background-check-template-details__description">
                              <h4>Template Description</h4>
                              <p>Standard background screening for Software Engineer roles in the United States. This template provides a comprehensive overview of a candidate's identity, employment, education, criminal history, and professional standing.</p>

                              <div>
                                <h5>Best for</h5>
                                <ul>
                                  <li v-for="item in templateBestFor" :key="item">
                                    <AppIcon name="checkCircle" :size="12" />
                                    <span>{{ item }}</span>
                                  </li>
                                </ul>
                              </div>

                              <div>
                                <h5>Template Category</h5>
                                <span class="background-check-template-details__category">IT &amp; Engineering</span>
                              </div>

                              <div>
                                <h5>Data Retention</h5>
                                <p>Varies by check type. See provider terms for details.</p>
                              </div>
                            </section>
                          </aside>
                        </div>
                      </article>
                    </template>
                  </div>

                  <aside class="background-check-summary">
                    <article class="background-check-summary__card background-check-provider-card">
                      <h4>Provider Information</h4>
                      <div class="background-check-provider-card__brand">
                        <span>C</span>
                        <div>
                          <strong>Checker</strong>
                          <small>Connected</small>
                        </div>
                      </div>
                      <dl class="background-check-provider-card__details">
                        <div v-for="[label, value] in integratedProviderFacts" :key="label">
                          <dt>{{ label }}</dt>
                          <dd>{{ value }}</dd>
                        </div>
                      </dl>
                      <button type="button" class="background-check-provider-card__button">
                        Manage Integration
                        <AppIcon name="external-link" :size="13" />
                      </button>
                    </article>

                    <article class="background-check-summary__card">
                      <h4>Provider Validation</h4>

                      <div class="background-check-summary__list">
                        <article v-for="[label, value] in providerValidationItems" :key="label">
                          <AppIcon name="checkCircle" :size="13" />
                          <div>
                            <small>{{ label }}</small>
                            <strong>{{ value }}</strong>
                          </div>
                        </article>
                      </div>

                      <div class="background-check-summary__success">
                        <AppIcon name="checkCircle" :size="14" />
                        <div>
                          <strong>All good!</strong>
                          <p>You're ready to run this check.</p>
                        </div>
                      </div>
                    </article>

                    <article class="background-check-summary__card background-check-summary__card--candidate">
                      <h4>Candidate Summary</h4>
                      <div v-if="isIntegratedTemplateDetailsView" class="background-check-summary__candidate-mini">
                        <span class="background-check-avatar">{{ candidateInitials }}</span>
                        <div>
                          <strong>{{ candidateName }}</strong>
                          <p>{{ candidateRole }}</p>
                        </div>
                      </div>
                      <dl>
                        <div v-for="[label, value] in integratedSummaryFacts" :key="label">
                          <dt>{{ label }}</dt>
                          <dd>{{ value }}</dd>
                        </div>
                      </dl>
                    </article>
                  </aside>
                </section>
              </template>

              <template v-else-if="selectedMethod === 'manual'">
                <section class="background-check-manual-shell">
                  <small>Manual Verification</small>

                  <article class="background-check-manual-card">
                    <div class="background-check-manual-card__visual">
                      <div class="background-check-manual-card__glow" />
                      <div class="background-check-manual-card__document">
                        <span class="background-check-manual-card__doc-icon">
                          <AppIcon name="user" :size="14" />
                        </span>
                        <i />
                        <i />
                        <i />
                        <i />
                        <span class="background-check-manual-card__doc-badge">
                          <AppIcon name="clipboard-check" :size="14" />
                        </span>
                      </div>

                      <div class="background-check-manual-card__people">
                        <span class="is-top">SJ</span>
                        <span class="is-middle">AC</span>
                        <span class="is-bottom">PP</span>
                      </div>

                      <div class="background-check-manual-card__connector" />

                      <div class="background-check-manual-card__checkmark">
                        <AppIcon name="check" :size="20" />
                      </div>
                    </div>

                    <div class="background-check-manual-card__content">
                      <section class="background-check-manual-card__steps">
                        <h3>How Manual Verification works</h3>

                        <div class="background-check-manual-card__steps-list">
                          <article v-for="[title, detail, icon] in manualVerificationSteps" :key="title">
                            <span>
                              <AppIcon :name="icon" :size="14" />
                            </span>
                            <div>
                              <strong>{{ title }}</strong>
                              <p>{{ detail }}</p>
                            </div>
                          </article>
                        </div>
                      </section>

                      <aside class="background-check-manual-card__reasons">
                        <h3>When to use manual verification</h3>

                        <div class="background-check-manual-card__reasons-list">
                          <article v-for="item in manualVerificationReasons" :key="item">
                            <span>
                              <AppIcon name="check" :size="12" />
                            </span>
                            <p>{{ item }}</p>
                          </article>
                        </div>
                      </aside>
                    </div>
                  </article>
                </section>
              </template>

              <template v-else>
                <section class="background-check-recommendation">
                  <div class="background-check-recommendation__main">
                    <small>AI Recommendation</small>

                    <article class="background-check-package">
                      <div class="background-check-package__head">
                        <div class="background-check-package__role">
                          <span class="background-check-package__icon">
                            <AppIcon name="briefcase" :size="16" />
                          </span>
                          <div>
                            <strong>{{ appliedCustomization.template }}</strong>
                            <p>Best matched based on role, location, seniority and company policy</p>
                          </div>
                        </div>

                        <div class="background-check-package__actions">
                          <span class="background-check-package__match">89% match</span>
                          <button type="button" @click="openCustomizePanel">
                            <AppIcon name="edit" :size="13" />
                            Customize
                          </button>
                        </div>
                      </div>

                      <div class="background-check-package__meta">
                        <article>
                          <small>Provider</small>
                          <strong>{{ appliedCustomization.provider }}</strong>
                        </article>
                        <article>
                          <small>Template</small>
                          <strong>{{ appliedCustomization.template }}</strong>
                        </article>
                        <article>
                          <small>Est. completion</small>
                          <strong>{{ appliedCustomization.completion }}</strong>
                        </article>
                        <article>
                          <small>Est. cost</small>
                          <strong>{{ appliedCustomization.cost }}</strong>
                        </article>
                      </div>

                      <div class="background-check-package__checks">
                        <small>Included checks ({{ appliedChecks.length }})</small>
                        <div class="background-check-package__check-list">
                          <span v-for="item in appliedChecks" :key="item.id">
                            <AppIcon name="check" :size="11" />
                            {{ item.label }}
                          </span>
                        </div>
                      </div>

                      <div class="background-check-package__why">
                        <article v-for="item in recommendationBullets" :key="item">
                          <AppIcon name="check" :size="11" />
                          <span>{{ item }}</span>
                        </article>
                      </div>

                      <div class="background-check-package__footer">
                        <button type="button" class="background-check-primary" @click="openRunConfirmation">
                          Run Background Check
                          <AppIcon name="chevronRight" :size="14" />
                        </button>
                        <p>Candidate will receive a consent email to authorize this check.</p>
                      </div>
                    </article>
                  </div>

                  <aside class="background-check-summary">
                    <article class="background-check-summary__card">
                      <h4>Candidate Summary</h4>
                      <dl>
                        <div>
                          <dt>Job</dt>
                          <dd>Software Engineer</dd>
                        </div>
                        <div>
                          <dt>Department</dt>
                          <dd>Engineering</dd>
                        </div>
                        <div>
                          <dt>Location</dt>
                          <dd>San Francisco, CA, US</dd>
                        </div>
                        <div>
                          <dt>Employment type</dt>
                          <dd>Full-time</dd>
                        </div>
                        <div>
                          <dt>Start date</dt>
                          <dd>June 2, 2025</dd>
                        </div>
                      </dl>
                    </article>

                    <article class="background-check-summary__card">
                      <h4>Background Check Readiness</h4>

                      <div class="background-check-readiness">
                        <div class="background-check-readiness__ring">
                          <span>98%</span>
                          <small>Ready</small>
                        </div>

                        <div class="background-check-readiness__list">
                          <article v-for="[label, value] in readinessItems" :key="label">
                            <AppIcon name="check" :size="11" />
                            <div>
                              <small>{{ label }}</small>
                              <strong>{{ value }}</strong>
                            </div>
                          </article>
                        </div>
                      </div>

                      <div class="background-check-summary__success">
                        <AppIcon name="checkCircle" :size="14" />
                        <div>
                          <strong>This candidate is ready for a background check.</strong>
                          <p>No issues detected.</p>
                        </div>
                      </div>
                    </article>
                  </aside>
                </section>

                <section class="background-check-timeline">
                  <h3>What happens next?</h3>

                  <div class="background-check-timeline__steps">
                    <article v-for="[label, detail, icon] in timelineSteps" :key="label">
                      <span class="background-check-timeline__icon">
                        <AppIcon :name="icon" :size="13" />
                      </span>
                      <strong>{{ label }}</strong>
                      <small>{{ detail }}</small>
                    </article>
                  </div>
                </section>
              </template>
            </div>

            <aside v-if="customizeOpen && selectedMethod === 'ai'" class="background-check-customize">
              <div class="background-check-customize__head">
                <h3>Customize Recommendation</h3>
                <p>Adjust the template or checks included in this background check.</p>
              </div>

              <div class="background-check-customize__notice">
                <AppIcon name="info" :size="16" />
                <p>
                  You're customizing the AI recommendation. Changes you make will be reflected in
                  the estimate and readiness.
                </p>
              </div>

              <div class="background-check-customize__field">
                <label>Provider</label>
                <select v-model="draftCustomization.provider">
                  <option v-for="option in providerOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>

              <div class="background-check-customize__field">
                <label>Background Check Template</label>
                <select v-model="draftCustomization.template">
                  <option v-for="option in templateOptions" :key="option" :value="option">{{ option }}</option>
                </select>
                <button type="button" class="background-check-customize__link">
                  View template details
                  <AppIcon name="info" :size="13" />
                </button>
              </div>

              <div class="background-check-customize__checks">
                <div class="background-check-customize__checks-head">
                  <label>Included Checks</label>
                  <button type="button" @click="toggleSelectAllChecks">
                    {{ allDraftChecksSelected ? 'Clear all' : 'Select all' }}
                  </button>
                </div>

                <label
                  v-for="check in checkCatalog"
                  :key="check.id"
                  class="background-check-customize__check-row"
                >
                  <input
                    :checked="draftCustomization.checks.includes(check.id)"
                    type="checkbox"
                    @change="toggleDraftCheck(check.id)"
                  >
                  <span class="background-check-customize__check-box">
                    <AppIcon name="check" :size="11" />
                  </span>
                  <span class="background-check-customize__check-label">{{ check.label }}</span>
                  <AppIcon name="info" :size="13" />
                </label>
              </div>

              <div class="background-check-customize__metrics">
                <div class="background-check-customize__field">
                  <label>Estimated completion</label>
                  <select v-model="draftCustomization.completion">
                    <option v-for="option in completionOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>

                <div class="background-check-customize__field">
                  <label>Estimated cost</label>
                  <input v-model="draftCustomization.cost" type="text">
                </div>
              </div>

              <div class="background-check-customize__field">
                <label>Reason for change (optional)</label>
                <textarea
                  v-model="draftCustomization.reason"
                  rows="4"
                  maxlength="250"
                  placeholder="Add a note about why you're customizing this recommendation..."
                />
                <small>{{ reasonCount }}/250</small>
              </div>

              <button type="button" class="background-check-customize__reset" @click="resetCustomization">
                <AppIcon name="refresh" :size="14" />
                Reset to AI Recommendation
              </button>

              <div class="background-check-customize__foot">
                <button type="button" class="background-check-secondary" @click="closeCustomizePanel">Cancel</button>
                <button type="button" class="background-check-primary" @click="applyCustomization">
                  Apply Changes
                </button>
              </div>

              <p class="background-check-customize__caption">
                {{ draftChecks.length }} checks selected for this package.
              </p>
            </aside>
          </div>
        </div>

        <footer v-if="!manualSetupOpen" class="background-check-modal__foot">
          <button
            v-if="!isIntegratedTemplateDetailsView && selectedMethod !== 'manual'"
            type="button"
            class="background-check-secondary"
          >
            Learn more about background checks
          </button>
          <span v-else-if="selectedMethod !== 'manual'" />
          <span v-else />

          <div class="background-check-modal__actions">
            <button
              type="button"
              class="background-check-secondary"
              @click="selectedMethod === 'manual' ? closeOverlay() : isIntegratedTemplateDetailsView ? closeIntegratedTemplateDetails() : closeOverlay"
            >
              {{ selectedMethod === 'manual' ? 'Cancel' : isIntegratedTemplateDetailsView ? 'Cancel' : 'Save as draft' }}
            </button>
            <button
              type="button"
              class="background-check-primary"
              @click="selectedMethod === 'manual' ? openManualSetup() : isIntegratedTemplateDetailsView ? closeIntegratedTemplateDetails() : openRunConfirmation()"
            >
              {{ selectedMethod === 'manual' ? 'Continue to Setup' : isIntegratedTemplateDetailsView ? 'Back to Integrated Provider' : 'Run Background Check' }}
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </div>
        </footer>
      </section>

      <RunBackgroundCheckOverlay
        :open="confirmRunOpen"
        :job-id="jobId"
        :candidate-id="candidateId"
        :candidate-name="candidateName"
        :candidate-role="candidateRole"
        :flow-type="selectedMethod"
        :provider="currentProvider"
        :template="currentTemplate"
        :completion="currentCompletion"
        :cost="currentCost"
        :checks="currentChecks.map((item) => item.label)"
        @close="closeRunConfirmation"
        @complete="completeBackgroundCheck"
      />

      <div
        v-if="customCheckModalOpen"
        class="background-check-custom-modal__overlay"
        @click.self="closeCustomCheckModal"
      >
        <section class="background-check-custom-modal">
          <header class="background-check-custom-modal__head">
            <div>
              <h3>Add Custom Verification Check</h3>
              <p>Create a custom verification task that your internal team will complete manually.</p>
            </div>

            <button type="button" aria-label="Close custom verification modal" @click="closeCustomCheckModal">
              <AppIcon name="close" :size="16" />
            </button>
          </header>

          <div class="background-check-custom-modal__body">
            <div class="background-check-custom-modal__main">
              <label class="background-check-custom-modal__field">
                <span>Verification Name</span>
                <input
                  v-model="customCheckDraft.name"
                  type="text"
                  placeholder="e.g. Security Clearance Verification"
                >
              </label>

              <label class="background-check-custom-modal__field">
                <span>Description</span>
                <textarea
                  v-model="customCheckDraft.description"
                  rows="5"
                  maxlength="250"
                  placeholder="Explain what needs to be verified and what it covers..."
                ></textarea>
                <small>{{ customCheckDescriptionCount }}/250</small>
              </label>

              <div class="background-check-custom-modal__field">
                <span>Verification Type</span>
                <AppSelect
                  v-model="customCheckDraft.verificationType"
                  :options="customVerificationTypeOptions"
                />
              </div>

              <div class="background-check-custom-modal__bottom-grid">
                <div class="background-check-custom-modal__field">
                  <span>Priority</span>
                  <div class="background-check-custom-modal__priority-group">
                    <button
                      v-for="level in ['Low', 'Medium', 'High']"
                      :key="level"
                      type="button"
                      :class="{ 'is-active': customCheckDraft.priority === level }"
                      @click="customCheckDraft.priority = level"
                    >
                      {{ level }}
                    </button>
                  </div>
                </div>

                <label class="background-check-custom-modal__field">
                  <span>Due Date</span>
                  <input v-model="customCheckDraft.dueDate" type="text">
                </label>
              </div>

              <section class="background-check-custom-modal__suggested">
                <div class="background-check-custom-modal__suggested-head">
                  <span>AI Suggestions</span>
                  <button type="button" @click="applyCustomCheckSuggestion(customCheckSuggestions[0])">
                    Use Suggested Setup
                  </button>
                </div>

                <div class="background-check-custom-modal__suggested-tags">
                  <button
                    v-for="suggestion in customCheckSuggestions"
                    :key="suggestion.label"
                    type="button"
                    @click="applyCustomCheckSuggestion(suggestion)"
                  >
                    {{ suggestion.label }}
                  </button>
                </div>
              </section>
            </div>

            <aside class="background-check-custom-modal__side">
              <section class="background-check-custom-modal__panel">
                <h4>Required Evidence</h4>

                <label
                  v-for="[id, label] in customEvidenceCatalog"
                  :key="id"
                  class="background-check-custom-modal__evidence-row"
                >
                  <input
                    :checked="customCheckDraft.evidence.includes(id)"
                    type="checkbox"
                    @change="toggleCustomEvidence(id)"
                  >
                  <span class="background-check-custom-modal__checkbox">
                    <AppIcon name="check" :size="10" />
                  </span>
                  <span>{{ label }}</span>
                </label>
              </section>

              <section class="background-check-custom-modal__panel">
                <h4>Required Documents</h4>

                <div class="background-check-custom-modal__document-list">
                  <article
                    v-for="documentName in customCheckDraft.requiredDocuments"
                    :key="documentName"
                    class="background-check-custom-modal__document-pill"
                  >
                    <span>{{ documentName }}</span>
                    <button type="button" @click="removeCustomRequiredDocument(documentName)">
                      <AppIcon name="close" :size="12" />
                    </button>
                  </article>
                </div>

                <div class="background-check-custom-modal__document-input">
                  <input
                    v-model="customCheckDraft.documentInput"
                    type="text"
                    placeholder="Add document"
                    @keydown.enter.prevent="addCustomRequiredDocument"
                  >
                  <button type="button" @click="addCustomRequiredDocument">
                    <AppIcon name="plus" :size="12" />
                    Add Document
                  </button>
                </div>
              </section>

              <section class="background-check-custom-modal__panel">
                <h4>Assign Reviewer</h4>

                <label class="background-check-custom-modal__assign-toggle">
                  <input v-model="customCheckDraft.assignReviewer" type="checkbox">
                  <span class="background-check-custom-modal__checkbox">
                    <AppIcon name="check" :size="10" />
                  </span>
                  <span>Assign reviewer</span>
                </label>

                <div v-if="customCheckDraft.assignReviewer" class="background-check-custom-modal__reviewer-card">
                  <span>{{ customCheckDraft.reviewer.split(' ').map((part) => part[0]).join('').slice(0, 2) }}</span>
                  <div>
                    <strong>{{ customCheckDraft.reviewer }}</strong>
                    <small>Talent Operations</small>
                  </div>
                </div>

                <AppSelect
                  v-if="customCheckDraft.assignReviewer"
                  v-model="customCheckDraft.reviewer"
                  :options="reviewerOptions"
                  :placeholder="'Select reviewer'"
                />
              </section>
            </aside>
          </div>

          <footer class="background-check-custom-modal__foot">
            <button type="button" class="background-check-secondary" @click="closeCustomCheckModal">Cancel</button>
            <button
              type="button"
              class="background-check-primary"
              :disabled="!customCheckCanSubmit"
              @click="addCustomCheck"
            >
              Add Verification Check
            </button>
          </footer>
        </section>
      </div>

      <div
        v-if="addDocumentModalOpen"
        class="background-check-custom-modal__overlay"
        @click.self="closeAddDocumentModal"
      >
        <section class="background-check-document-modal">
          <header class="background-check-document-modal__head">
            <div>
              <h3>Add Document</h3>
              <p>Add a document requirement for this background check.</p>
            </div>

            <button type="button" aria-label="Close add document modal" @click="closeAddDocumentModal">
              <AppIcon name="close" :size="16" />
            </button>
          </header>

          <div class="background-check-document-modal__body">
            <div class="background-check-document-modal__main">
              <label class="background-check-document-modal__field">
                <span>Document Name</span>
                <input
                  v-model="documentDraft.name"
                  type="text"
                  placeholder="e.g. Employment Certificate"
                >
              </label>

              <div class="background-check-document-modal__field">
                <span>Category</span>
                <AppSelect
                  v-model="documentDraft.category"
                  :options="documentCategoryOptions"
                  :placeholder="'Select category'"
                />
              </div>

              <div class="background-check-document-modal__field">
                <span>Provided By</span>
                <div class="background-check-document-modal__pill-group">
                  <button
                    v-for="option in documentProvidedByOptions"
                    :key="option"
                    type="button"
                    :class="{ 'is-active': documentDraft.providedBy === option }"
                    @click="documentDraft.providedBy = option"
                  >
                    <AppIcon :name="option === 'Candidate' ? 'user' : option === 'Employer' ? 'briefcase' : 'building'" :size="12" />
                    {{ option }}
                  </button>
                </div>
              </div>

              <div class="background-check-document-modal__field">
                <span>Required</span>
                <div class="background-check-document-modal__radio-group">
                  <button
                    type="button"
                    :class="{ 'is-active': documentDraft.required }"
                    @click="documentDraft.required = true"
                  >
                    <span class="background-check-document-modal__radio" />
                    Required
                  </button>
                  <button
                    type="button"
                    :class="{ 'is-active': !documentDraft.required }"
                    @click="documentDraft.required = false"
                  >
                    <span class="background-check-document-modal__radio" />
                    Optional
                  </button>
                </div>
              </div>

              <div class="background-check-document-modal__field">
                <div class="background-check-document-modal__toggle-head">
                  <span>AI Verification</span>
                  <small>Enable AI to validate the document for authenticity and completeness.</small>
                </div>

                <div class="background-check-document-modal__toggle-row">
                  <button
                    type="button"
                    class="background-check-document-modal__switch"
                    :class="{ 'is-active': documentDraft.aiVerification }"
                    @click="documentDraft.aiVerification = !documentDraft.aiVerification"
                  >
                    <i />
                  </button>
                  <span>Enable AI verification</span>
                  <em>Recommended</em>
                </div>
              </div>

              <label class="background-check-document-modal__field">
                <span>Notes (Optional)</span>
                <textarea
                  v-model="documentDraft.notes"
                  rows="5"
                  maxlength="250"
                  placeholder="Add any instructions for the reviewer..."
                ></textarea>
                <small>{{ documentNoteCount }}/250</small>
              </label>
            </div>

            <aside class="background-check-document-modal__side">
              <section class="background-check-document-modal__panel">
                <h4>Accepted File Types</h4>

                <label
                  v-for="[id, label] in documentFileTypeOptions"
                  :key="id"
                  class="background-check-document-modal__check-row"
                >
                  <input
                    :checked="documentDraft.acceptedFileTypes.includes(id)"
                    type="checkbox"
                    @change="toggleDocumentFileType(id)"
                  >
                  <span class="background-check-document-modal__checkbox">
                    <AppIcon name="check" :size="10" />
                  </span>
                  <span>{{ label }}</span>
                </label>
              </section>

              <section class="background-check-document-modal__panel">
                <h4>Maximum File Size</h4>
                <AppSelect
                  v-model="documentDraft.maxFileSize"
                  :options="documentMaxFileSizeOptions"
                />
              </section>

              <section class="background-check-document-modal__panel background-check-document-modal__preview">
                <div class="background-check-document-modal__preview-head">
                  <h4>Preview</h4>
                  <small>(for candidate)</small>
                </div>

                <div class="background-check-document-modal__preview-card">
                  <span>
                    <AppIcon name="document" :size="20" />
                  </span>
                  <p>Candidate will be asked to upload</p>
                  <strong>{{ documentDraft.name || 'Document Name' }}</strong>
                  <small>
                    Accepted formats:
                    {{ documentAcceptedFileTypeLabels.length ? documentAcceptedFileTypeLabels.join(', ') : 'None selected' }}
                  </small>
                  <small>Max file size: {{ documentDraft.maxFileSize }}</small>
                </div>
              </section>
            </aside>
          </div>

          <footer class="background-check-document-modal__foot">
            <button type="button" class="background-check-secondary" @click="closeAddDocumentModal">Cancel</button>
            <button
              type="button"
              class="background-check-primary"
              :disabled="!documentDraftCanSubmit"
              @click="addManualDocument"
            >
              Add Document
            </button>
          </footer>
        </section>
      </div>

      <div
        v-if="manualVerificationLaunchPhase === 'creating'"
        class="background-check-manual-launch__overlay"
        @click.self="closeOverlay"
      >
        <section class="background-check-manual-launch">
          <button type="button" aria-label="Close manual verification creation" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>

          <header class="background-check-manual-launch__head">
            <span class="background-check-manual-launch__spinner">
              <i />
            </span>
            <div>
              <h3>Creating Manual Verification...</h3>
              <p>Please don't close this window.</p>
            </div>
          </header>

          <div class="background-check-manual-launch__steps">
            <article
              v-for="(item, index) in manualVerificationProgressRows"
              :key="item.label"
              class="background-check-manual-launch__step"
              :class="`is-${item.state}`"
            >
              <div class="background-check-manual-launch__step-rail">
                <span>
                  <AppIcon
                    :name="item.state === 'completed' ? 'checkCircle' : item.state === 'active' ? 'more' : 'clock'"
                    :size="12"
                  />
                </span>
                <i v-if="index < manualVerificationProgressRows.length - 1" />
              </div>

              <div class="background-check-manual-launch__step-copy">
                <strong>{{ item.label }}</strong>
                <div class="background-check-manual-launch__progress">
                  <span :style="{ width: `${item.progress}%` }" />
                </div>
              </div>

              <em>{{ item.statusLabel }}</em>
            </article>
          </div>

          <article class="background-check-manual-launch__tip">
            <span>
              <AppIcon name="shield" :size="15" />
            </span>
            <div>
              <strong>This may take a few seconds.</strong>
              <p>We'll update you once everything is set.</p>
            </div>
          </article>
        </section>
      </div>

      <div
        v-if="manualVerificationLaunchPhase === 'success'"
        class="background-check-manual-launch__overlay"
        @click.self="closeOverlay"
      >
        <section class="background-check-manual-success">
          <button type="button" aria-label="Close manual verification success" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>

          <header class="background-check-manual-success__head">
            <span>
              <AppIcon name="checkCircle" :size="28" />
            </span>
            <h3>Manual Verification Started!</h3>
            <p>The verification request has been successfully launched.</p>
          </header>

          <div class="background-check-manual-success__summary">
            <article
              v-for="[label, value, icon] in manualVerificationStartedFacts"
              :key="label"
            >
              <span>
                <AppIcon :name="icon" :size="13" />
              </span>
              <strong>{{ label }}</strong>
              <em :class="{ 'is-status': label === 'Status' }">{{ value }}</em>
            </article>
          </div>

          <section class="background-check-manual-success__next">
            <h4>What happens next?</h4>
            <div>
              <article v-for="item in [
                'Candidate will receive an invitation to upload documents',
                'Reviewers will be notified and can begin their tasks',
                'You will receive updates as verification progresses',
                'All activities will be tracked in real-time'
              ]" :key="item">
                <AppIcon name="checkCircle" :size="13" />
                <span>{{ item }}</span>
              </article>
            </div>
          </section>

          <footer class="background-check-manual-success__foot">
            <button type="button" class="background-check-secondary" @click="closeOverlay">Close</button>
            <button type="button" class="background-check-primary" @click="viewManualVerificationProgress">
              View Progress
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </footer>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.background-check-overlay {
  position: fixed;
  inset: 0;
  z-index: 2210;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(10px);
}

.background-check-modal {
  width: min(1540px, calc(100vw - 40px));
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(220, 229, 248, 0.95);
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 34px 90px rgba(23, 34, 56, 0.22);
}

.background-check-modal__head,
.background-check-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 22px;
}

.background-check-modal__head {
  border-bottom: 1px solid #e9eefb;
}

.background-check-modal__foot {
  border-top: 1px solid #e9eefb;
}

.background-check-modal__title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.background-check-modal__title-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef4fa0;
  background: #fff0f7;
}

.background-check-modal__title h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.08rem;
}

.background-check-modal__title p {
  margin: 4px 0 0;
  color: #7485a6;
  font-size: 0.82rem;
}

.background-check-modal__head button {
  width: 38px;
  height: 38px;
  border: 1px solid #dbe4fb;
  border-radius: 50%;
  background: #fff;
  color: #8da0c4;
  cursor: pointer;
}

.background-check-modal__body {
  flex: 1;
  overflow: auto;
  padding: 18px;
  background:
    radial-gradient(circle at top left, rgba(255, 92, 168, 0.08), transparent 20%),
    linear-gradient(180deg, #fff 0%, #fbfdff 100%);
}

.background-check-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.background-check-workspace.is-customizing {
  grid-template-columns: minmax(0, 1fr) 330px;
}

.background-check-main-content {
  display: grid;
  gap: 14px;
}

.background-check-candidate,
.background-check-methods,
.background-check-provider-info,
.background-check-package,
.background-check-summary__card,
.background-check-timeline,
.background-check-customize,
.background-check-integrated-card {
  border: 1px solid #e2e9fb;
  border-radius: 20px;
  background: #fff;
}

.background-check-candidate {
  display: grid;
  grid-template-columns: minmax(260px, 340px) 1fr;
  gap: 18px;
  padding: 16px 18px;
}

.background-check-candidate__identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.background-check-avatar {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd8ec 0%, #f4f6ff 100%);
  color: #ef4fa0;
  font-weight: 800;
}

.background-check-candidate__identity strong {
  display: block;
  color: #233253;
  font-size: 0.96rem;
}

.background-check-candidate__identity p {
  margin: 3px 0 0;
  color: #7183a6;
  font-size: 0.8rem;
}

.background-check-candidate__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 9px;
}

.background-check-candidate__tags span {
  padding: 5px 9px;
  border-radius: 999px;
  background: #f3f1ff;
  color: #6a5cff;
  font-size: 0.68rem;
  font-weight: 700;
}

.background-check-candidate__facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.background-check-candidate__facts article {
  min-width: 0;
  padding-left: 12px;
  border-left: 1px solid #eef2fb;
}

.background-check-candidate__facts small,
.background-check-package small,
.background-check-summary__card h4 + dl dt,
.background-check-readiness__list small,
.background-check-timeline small,
.background-check-customize__field label,
.background-check-customize__checks-head label,
.background-check-provider-info dt,
.background-check-provider-card__details dt,
.background-check-integrated-card label,
.background-check-integrated-card small,
.background-check-summary__list small {
  display: block;
  color: #95a3bf;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.background-check-candidate__facts strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 5px;
  color: #243454;
  font-size: 0.8rem;
}

.background-check-methods-shell {
  display: grid;
  gap: 14px;
  align-items: start;
}

.background-check-methods-shell.has-provider-info {
  grid-template-columns: minmax(0, 1fr) 260px;
}

.background-check-methods {
  padding: 16px;
  align-self: start;
}

.background-check-methods h3,
.background-check-timeline h3 {
  margin: 0 0 14px;
  color: #243454;
  font-size: 0.92rem;
}

.background-check-methods__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.background-check-method {
  padding: 14px;
  border: 1px solid #e3e9fb;
  border-radius: 16px;
  background: #fff;
  text-align: left;
  cursor: pointer;
}

.background-check-method.is-active {
  border-color: #f7a1ca;
  box-shadow: inset 0 0 0 1px rgba(239, 79, 160, 0.2);
}

.background-check-method.is-pink {
  background: linear-gradient(180deg, #fffafd 0%, #fff 100%);
}

.background-check-method__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.background-check-method__icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef4fa0;
  background: #fff0f7;
}

.background-check-method__radio {
  width: 16px;
  height: 16px;
  border: 1.5px solid #cfd9ef;
  border-radius: 50%;
  background: #fff;
}

.background-check-method.is-active .background-check-method__radio {
  border-color: #ef4fa0;
  box-shadow: inset 0 0 0 4px #ef4fa0;
}

.background-check-method__copy strong {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  color: #263655;
  font-size: 0.86rem;
}

.background-check-method__copy em {
  padding: 2px 6px;
  border-radius: 999px;
  background: #f3f1ff;
  color: #6a5cff;
  font-size: 0.63rem;
  font-style: normal;
  font-weight: 800;
}

.background-check-method__copy p {
  margin: 8px 0 0;
  color: #6d7f9f;
  font-size: 0.76rem;
  line-height: 1.55;
}

.background-check-provider-info,
.background-check-provider-card {
  padding: 16px;
  display: grid;
  gap: 14px;
  align-self: start;
}

.background-check-provider-info h4,
.background-check-provider-card h4,
.background-check-summary__card h4 {
  margin: 0;
  color: #233252;
  font-size: 0.88rem;
}

.background-check-provider-info__brand,
.background-check-provider-card__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.background-check-provider-info__brand span,
.background-check-provider-card__brand span {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #2f6dff;
  color: #fff;
  font-weight: 800;
}

.background-check-provider-info__brand strong,
.background-check-provider-card__brand strong {
  display: block;
  color: #243454;
  font-size: 0.82rem;
}

.background-check-provider-info__brand small,
.background-check-provider-card__brand small {
  display: inline-flex;
  margin-top: 5px;
  padding: 3px 7px;
  border-radius: 999px;
  background: #e9f9ef;
  color: #20a95a;
  font-size: 0.64rem;
  font-weight: 800;
}

.background-check-provider-info dl,
.background-check-provider-card__details,
.background-check-summary__card dl,
.background-check-summary__list {
  display: grid;
  gap: 10px;
  margin: 0;
}

.background-check-provider-info dd,
.background-check-provider-card__details dd,
.background-check-summary__card dd,
.background-check-readiness__list strong,
.background-check-summary__success strong,
.background-check-summary__list strong {
  margin: 4px 0 0;
  color: #243454;
  font-size: 0.78rem;
  font-weight: 700;
}

.background-check-provider-info button,
.background-check-provider-card__button,
.background-check-integrated-card__link,
.background-check-secondary,
.background-check-package__actions button,
.background-check-customize__link,
.background-check-customize__checks-head button,
.background-check-customize__reset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 12px;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.background-check-provider-info button,
.background-check-provider-card__button,
.background-check-secondary,
.background-check-package__actions button {
  padding: 10px 14px;
  border: 1px solid #dce4fb;
  background: #fff;
  color: #33425f;
}

.background-check-recommendation,
.background-check-integrated-shell,
.background-check-manual-shell {
  display: grid;
  gap: 14px;
  align-items: start;
}

.background-check-recommendation,
.background-check-integrated-shell {
  grid-template-columns: minmax(0, 1.65fr) 340px;
}

.background-check-recommendation__main > small,
.background-check-integrated-main > small,
.background-check-manual-shell > small {
  display: block;
  margin: 0 0 8px;
  color: #ef4fa0;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.background-check-package,
.background-check-integrated-card {
  padding: 16px;
}

.background-check-package__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.background-check-package__role {
  display: flex;
  align-items: center;
  gap: 12px;
}

.background-check-package__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef4fa0;
  background: #fff0f7;
}

.background-check-package__role strong {
  display: block;
  color: #243454;
  font-size: 1.02rem;
}

.background-check-package__role p {
  margin: 4px 0 0;
  color: #6d7e9d;
  font-size: 0.78rem;
}

.background-check-package__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.background-check-package__match,
.background-check-integrated-card__status {
  display: inline-flex;
  width: fit-content;
  padding: 5px 9px;
  border-radius: 999px;
  background: #e9f9ef;
  color: #21aa5d;
  font-size: 0.67rem;
  font-weight: 800;
}

.background-check-package__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #eef2fb;
}

.background-check-package__meta strong {
  display: block;
  margin-top: 5px;
  color: #243454;
  font-size: 0.8rem;
}

.background-check-package__checks {
  margin-top: 14px;
}

.background-check-package__check-list,
.background-check-package__why {
  display: grid;
  gap: 8px;
  margin-top: 8px;
}

.background-check-package__check-list {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.background-check-package__check-list span,
.background-check-package__why article {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 12px;
  background: #fbfcff;
  color: #4b5f82;
  font-size: 0.72rem;
  font-weight: 600;
}

.background-check-package__check-list span :deep(svg),
.background-check-package__why article :deep(svg),
.background-check-readiness__list article :deep(svg),
.background-check-customize__check-row :deep(svg:first-child),
.background-check-summary__list article :deep(svg),
.background-check-integrated-card__check-list article span :deep(svg) {
  color: #22ab5e;
}

.background-check-package__why {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 12px;
}

.background-check-package__footer {
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eef2fb;
}

.background-check-package__footer p {
  margin: 0;
  color: #8b98b4;
  font-size: 0.69rem;
}

.background-check-summary {
  display: grid;
  gap: 14px;
  align-self: start;
}

.background-check-integrated-main,
.background-check-recommendation__main,
.background-check-manual-shell {
  align-self: start;
}

.background-check-manual-card,
.background-check-manual-card__content,
.background-check-manual-card__steps,
.background-check-manual-card__reasons,
.background-check-manual-card__steps-list,
.background-check-manual-card__reasons-list {
  display: grid;
  gap: 16px;
}

.background-check-manual-card {
  grid-template-columns: minmax(280px, 0.95fr) minmax(0, 1.45fr);
  align-items: center;
  padding: 18px;
  border: 1px solid #e2e9fb;
  border-radius: 20px;
  background: #fff;
}

.background-check-manual-card__visual {
  position: relative;
  min-height: 220px;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.background-check-manual-card__glow {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, rgba(255, 86, 160, 0.16) 0%, rgba(255, 86, 160, 0.05) 42%, transparent 72%);
}

.background-check-manual-card__document {
  position: relative;
  width: 154px;
  min-height: 164px;
  padding: 18px 16px 20px;
  border: 1px solid #e8edf9;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 20px 48px rgba(34, 45, 78, 0.1);
  z-index: 1;
}

.background-check-manual-card__doc-icon,
.background-check-manual-card__doc-badge,
.background-check-manual-card__steps-list article span,
.background-check-manual-card__reasons-list article span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.background-check-manual-card__doc-icon {
  width: 26px;
  height: 26px;
  border-radius: 10px;
  background: #fff0f7;
  color: #ef4fa0;
}

.background-check-manual-card__document i {
  display: block;
  height: 8px;
  margin-top: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f3f5fc 0%, #e7ecfb 100%);
}

.background-check-manual-card__document i:nth-of-type(1) { width: 72%; }
.background-check-manual-card__document i:nth-of-type(2) { width: 62%; }
.background-check-manual-card__document i:nth-of-type(3) { width: 78%; }
.background-check-manual-card__document i:nth-of-type(4) { width: 58%; }

.background-check-manual-card__doc-badge {
  position: absolute;
  left: 16px;
  bottom: 16px;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff2d8f 0%, #ff5daa 100%);
  color: #fff;
}

.background-check-manual-card__people span {
  position: absolute;
  right: 54px;
  width: 42px;
  height: 42px;
  border: 3px solid #fff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #384968 0%, #16223d 100%);
  box-shadow: 0 14px 28px rgba(34, 45, 78, 0.16);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  z-index: 1;
}

.background-check-manual-card__people span.is-top { top: 22px; }
.background-check-manual-card__people span.is-middle { top: 78px; right: 28px; }
.background-check-manual-card__people span.is-bottom { bottom: 34px; }

.background-check-manual-card__connector {
  position: absolute;
  left: calc(50% + 18px);
  top: 48px;
  width: 148px;
  height: 128px;
  border: 2px dashed rgba(255, 79, 160, 0.35);
  border-left: 0;
  border-bottom: 0;
  border-radius: 0 30px 0 0;
}

.background-check-manual-card__checkmark {
  position: absolute;
  bottom: 18px;
  left: calc(50% - 8px);
  width: 58px;
  height: 58px;
  border: 5px solid #fff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff1180 0%, #ff4fa2 100%);
  box-shadow: 0 18px 36px rgba(255, 79, 160, 0.22);
  color: #fff;
  z-index: 1;
}

.background-check-manual-card__content {
  grid-template-columns: minmax(0, 1.1fr) minmax(230px, 0.72fr);
  align-items: start;
}

.background-check-manual-card__steps h3,
.background-check-manual-card__reasons h3 {
  margin: 0;
  color: #233252;
  font-size: 0.92rem;
}

.background-check-manual-card__steps-list article,
.background-check-manual-card__reasons-list article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.background-check-manual-card__steps-list article span,
.background-check-manual-card__reasons-list article span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #fff0f7;
  color: #ef4fa0;
}

.background-check-manual-card__steps-list article strong {
  display: block;
  color: #243454;
  font-size: 0.78rem;
}

.background-check-manual-card__steps-list article p,
.background-check-manual-card__reasons-list article p {
  margin: 4px 0 0;
  color: #6f82a3;
  font-size: 0.73rem;
  line-height: 1.55;
}

.background-check-manual-card__reasons {
  padding: 18px 16px;
  border: 1px solid #f7e7f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff9fc 0%, #fff 100%);
}

.background-check-template-details__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6a35ff;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.background-check-template-details {
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid #e2e9fb;
  border-radius: 20px;
  background: #fff;
}

.background-check-template-details__head,
.background-check-template-details__head-actions,
.background-check-template-details__overview-grid article,
.background-check-template-details__check,
.background-check-summary__candidate-mini {
  display: flex;
  align-items: flex-start;
}

.background-check-template-details__head {
  justify-content: space-between;
  gap: 16px;
}

.background-check-template-details__head h3,
.background-check-template-details__overview h4,
.background-check-template-details__checks h4,
.background-check-template-details__description h4 {
  margin: 0;
  color: #223251;
  font-size: 0.98rem;
}

.background-check-template-details__head p,
.background-check-template-details__description p,
.background-check-template-details__description li span,
.background-check-template-details__note p {
  margin: 6px 0 0;
  color: #66799d;
  font-size: 0.75rem;
  line-height: 1.6;
}

.background-check-template-details__head p span {
  margin: 0 6px;
}

.background-check-template-details__head-actions {
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.background-check-template-details__head-actions span,
.background-check-template-details__category {
  display: inline-flex;
  padding: 4px 9px;
  border-radius: 999px;
  background: #f3efff;
  color: #6a5cff;
  font-size: 0.67rem;
  font-weight: 800;
}

.background-check-template-details__content {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(250px, 0.7fr);
  gap: 16px;
}

.background-check-template-details__main,
.background-check-template-details__side,
.background-check-template-details__checks,
.background-check-template-details__description {
  display: grid;
  gap: 14px;
}

.background-check-template-details__overview,
.background-check-template-details__checks,
.background-check-template-details__description {
  padding: 16px;
  border: 1px solid #edf1fb;
  border-radius: 16px;
  background: #fff;
}

.background-check-template-details__overview-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.background-check-template-details__overview-grid article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  min-height: 92px;
  padding: 12px;
  border: 1px solid #eef2fb;
  border-radius: 14px;
  background: #fcfdff;
}

.background-check-template-details__overview-grid article span {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3efff;
  color: #6a5cff;
  flex: 0 0 auto;
}

.background-check-template-details__overview-grid article strong,
.background-check-template-details__check strong,
.background-check-summary__candidate-mini strong {
  display: block;
  color: #243454;
  font-size: 0.8rem;
  line-height: 1.35;
}

.background-check-template-details__overview-grid article small,
.background-check-template-details__checks-head span,
.background-check-template-details__checks article small,
.background-check-template-details__checks article em,
.background-check-template-details__description h5,
.background-check-summary__candidate-mini p {
  display: block;
  margin-top: 4px;
  color: #95a3bf;
  font-size: 0.63rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.35;
}

.background-check-template-details__checks-table {
  display: grid;
  margin-top: 2px;
}

.background-check-template-details__checks-head,
.background-check-template-details__checks-table article {
  display: grid;
  grid-template-columns: minmax(170px, 1.15fr) minmax(220px, 1.8fr) minmax(80px, 0.7fr) 70px;
  gap: 12px;
  align-items: center;
}

.background-check-template-details__checks-head {
  padding-bottom: 10px;
}

.background-check-template-details__checks-table article {
  padding: 12px 0;
  border-top: 1px solid #eef2fb;
}

.background-check-template-details__check {
  gap: 8px;
}

.background-check-template-details__check span {
  width: 22px;
  height: 22px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #edf2ff;
  color: #4b6fff;
  flex: 0 0 auto;
}

.background-check-template-details__checks-table article p {
  margin: 0;
  color: #66799d;
  font-size: 0.73rem;
  line-height: 1.55;
}

.background-check-template-details__checks-table article small {
  margin-top: 0;
  letter-spacing: 0;
  text-transform: none;
}

.background-check-template-details__checks-table article em {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 0;
  color: #1ea759;
  font-style: normal;
  letter-spacing: 0;
  text-transform: none;
}

.background-check-template-details__checks-table article em :deep(svg) {
  color: #1ea759;
}

.background-check-template-details__note {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fbfcff;
  color: #6a35ff;
}

.background-check-template-details__note p {
  margin: 0;
}

.background-check-template-details__description h5 {
  margin: 0 0 8px;
}

.background-check-template-details__description ul {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.background-check-template-details__description li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: start;
}

.background-check-template-details__description li :deep(svg) {
  color: #1ea759;
}

.background-check-summary__candidate-mini {
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  align-items: center;
  border-bottom: 1px solid #eef2fb;
}

.background-check-summary__candidate-mini .background-check-avatar {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
}

.background-check-summary__candidate-mini p {
  margin: 4px 0 0;
  color: #7a8cab;
  font-size: 0.76rem;
  letter-spacing: 0;
  text-transform: none;
}

.background-check-summary__card--candidate dl {
  gap: 14px;
}

.background-check-summary__card--candidate dl div {
  display: grid;
  gap: 4px;
}

.background-check-summary__card--candidate dt {
  color: #6f81a3;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}

.background-check-summary__card--candidate dd {
  margin: 0;
  font-size: 0.8rem;
}

.background-check-summary__card {
  padding: 16px;
}

.background-check-summary__list article,
.background-check-readiness__list article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: start;
}

.background-check-readiness {
  display: grid;
  grid-template-columns: 108px 1fr;
  gap: 12px;
  align-items: start;
}

.background-check-readiness__ring {
  width: 94px;
  height: 94px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at center, #fff 58%, transparent 59%),
    conic-gradient(#21ab5e 0 353deg, #e7edf9 353deg 360deg);
  text-align: center;
}

.background-check-readiness__ring span {
  display: block;
  color: #243454;
  font-size: 1rem;
  font-weight: 800;
}

.background-check-readiness__ring small {
  color: #6d7f9f;
  font-size: 0.66rem;
  letter-spacing: 0;
}

.background-check-readiness__list {
  display: grid;
  gap: 10px;
}

.background-check-summary__success {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: #eefaf2;
}

.background-check-summary__success p {
  margin: 4px 0 0;
  color: #5d7190;
  font-size: 0.73rem;
}

.background-check-summary__success :deep(svg) {
  color: #22ab5e;
}

.background-check-timeline {
  padding: 16px;
}

.background-check-timeline__steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.background-check-timeline__steps article {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 7px;
  text-align: center;
}

.background-check-timeline__steps article::after {
  content: '';
  position: absolute;
  top: 11px;
  left: calc(50% + 24px);
  width: calc(100% - 48px);
  height: 1px;
  background: #dbe3f8;
}

.background-check-timeline__steps article:last-child::after {
  display: none;
}

.background-check-timeline__icon {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f7ff;
  color: #8c99b5;
  z-index: 1;
}

.background-check-timeline__steps strong {
  color: #31415f;
  font-size: 0.72rem;
}

.background-check-integrated-card__grid {
  display: grid;
  grid-template-columns: minmax(220px, 0.9fr) minmax(250px, 1fr) minmax(280px, 1fr);
  gap: 16px;
}

.background-check-integrated-card__field,
.background-check-integrated-card__checks {
  display: grid;
  gap: 10px;
}

.background-check-integrated-card__field select,
.background-check-customize__field select,
.background-check-customize__field input,
.background-check-customize__field textarea {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  outline: none;
  background: #fff;
  color: #263655;
  font: inherit;
}

.background-check-integrated-card__stack {
  display: grid;
  gap: 6px;
  margin-top: 6px;
}

.background-check-integrated-card__template-meta {
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid #edf1fb;
  border-radius: 14px;
  background: #fcfdff;
}

.background-check-integrated-card__template-meta strong {
  display: block;
  margin-top: 4px;
  color: #243454;
  font-size: 0.76rem;
  line-height: 1.5;
}

.background-check-integrated-card__link,
.background-check-customize__link,
.background-check-customize__checks-head button,
.background-check-customize__reset {
  width: fit-content;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6a35ff;
}

.background-check-integrated-card__checks label {
  margin-bottom: 2px;
}

.background-check-integrated-card__check-list {
  display: grid;
  gap: 8px;
}

.background-check-integrated-card__check-list article {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid #eef2fb;
}

.background-check-integrated-card__check-list article:last-child {
  border-bottom: 0;
}

.background-check-integrated-card__check-list article span {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff4fa2;
  color: #fff;
}

.background-check-integrated-card__check-list article strong {
  color: #2b3a5a;
  font-size: 0.76rem;
}

.background-check-integrated-card__check-list article :deep(svg:last-child) {
  color: #97a6c1;
}

.background-check-integrated-card__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eef2fb;
}

.background-check-integrated-card__metrics article {
  display: flex;
  align-items: center;
  gap: 10px;
}

.background-check-integrated-card__metrics article span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.background-check-integrated-card__metrics article span.is-violet {
  background: #f3efff;
  color: #775cff;
}

.background-check-integrated-card__metrics article span.is-green {
  background: #eaf9ef;
  color: #20a95a;
}

.background-check-integrated-card__metrics article span.is-blue {
  background: #edf2ff;
  color: #4b6fff;
}

.background-check-integrated-card__metrics article strong {
  display: block;
  margin-top: 4px;
  color: #243454;
  font-size: 0.78rem;
}

.background-check-integrated-card__notice {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 14px;
  background: linear-gradient(180deg, #f7f2ff 0%, #fff 100%);
  color: #6a35ff;
}

.background-check-integrated-card__notice p {
  margin: 0;
  font-size: 0.74rem;
  line-height: 1.55;
}

.background-check-customize {
  position: sticky;
  top: 0;
  display: grid;
  gap: 16px;
  padding: 18px;
  align-self: start;
}

.background-check-customize__head h3 {
  margin: 0;
  color: #202f4f;
  font-size: 1rem;
}

.background-check-customize__head p {
  margin: 8px 0 0;
  color: #6e7fa0;
  font-size: 0.78rem;
  line-height: 1.6;
}

.background-check-customize__notice {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: linear-gradient(180deg, #f8f2ff 0%, #f5efff 100%);
  color: #6a5cff;
}

.background-check-customize__notice p {
  margin: 0;
  font-size: 0.74rem;
  line-height: 1.6;
  font-weight: 600;
}

.background-check-customize__field {
  display: grid;
  gap: 8px;
}

.background-check-customize__field textarea {
  min-height: 104px;
  resize: vertical;
}

.background-check-customize__field small {
  justify-self: end;
  color: #95a3bf;
  font-size: 0.69rem;
}

.background-check-customize__checks {
  display: grid;
  gap: 10px;
}

.background-check-customize__checks-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.background-check-customize__check-row {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eef2fb;
  color: #2a3a5a;
  cursor: pointer;
}

.background-check-customize__check-row:last-child {
  border-bottom: 0;
}

.background-check-customize__check-row input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.background-check-customize__check-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ff4fa2;
  background: #ff4fa2;
  color: #fff;
}

.background-check-customize__check-row input:not(:checked) + .background-check-customize__check-box {
  border-color: #cfd9ef;
  background: #fff;
  color: transparent;
}

.background-check-customize__check-label {
  font-size: 0.77rem;
  font-weight: 600;
}

.background-check-customize__check-row :deep(svg:last-child) {
  color: #98a7c1;
}

.background-check-customize__metrics,
.background-check-customize__foot {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.background-check-customize__caption {
  margin: -6px 0 0;
  color: #95a3bf;
  font-size: 0.72rem;
}

.background-check-modal__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.background-check-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 18px;
  border: 0;
  border-radius: 12px;
  background: #ff4fa2;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
}

.background-check-modal__head.is-progress {
  align-items: center;
}

.background-check-modal__progress-steps {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, minmax(88px, 1fr));
  gap: 12px;
  max-width: 760px;
  margin-left: auto;
}

.background-check-modal__body.is-manual-setup {
  padding-top: 14px;
}

.background-check-manual-setup {
  display: grid;
  gap: 16px;
}

.background-check-manual-setup__step {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;
}

.background-check-manual-setup__step::after {
  content: '';
  position: absolute;
  top: 16px;
  left: calc(50% + 26px);
  width: calc(100% - 52px);
  height: 1px;
  background: #dbe4f6;
}

.background-check-manual-setup__step:last-child::after {
  display: none;
}

.background-check-manual-setup__step span {
  position: relative;
  width: 32px;
  height: 32px;
  border: 1px solid #d9e2f4;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #8696b5;
  z-index: 1;
}

.background-check-manual-setup__step span i {
  position: absolute;
  right: -4px;
  top: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eef2fb;
  color: #7282a2;
  font-size: 0.58rem;
  font-style: normal;
  font-weight: 800;
}

.background-check-manual-setup__step.is-active span {
  border-color: #ff78b8;
  box-shadow: 0 0 0 4px rgba(255, 79, 162, 0.12);
  color: #ff4fa2;
}

.background-check-manual-setup__step.is-active span i {
  background: #ff4fa2;
  color: #fff;
}

.background-check-manual-setup__step.is-completed span {
  border-color: #ffb7d7;
  background: #fff7fb;
  color: #ff4fa2;
}

.background-check-manual-setup__step.is-completed span i {
  background: #ff8dc2;
  color: #fff;
}

.background-check-manual-setup__step strong {
  color: #93a1bd;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.35;
}

.background-check-manual-setup__step.is-active strong {
  color: #ff4fa2;
}

.background-check-manual-setup__step.is-completed strong {
  color: #d86ca6;
}

.background-check-manual-setup__grid {
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr) 280px;
  gap: 16px;
  align-items: start;
}

.background-check-manual-setup__sidebar,
.background-check-manual-setup__summary,
.background-check-manual-setup__main,
.background-check-manual-setup__workflow-list {
  display: grid;
  gap: 14px;
}

.background-check-manual-setup__candidate-card,
.background-check-manual-setup__help,
.background-check-manual-setup__workflow-list article,
.background-check-manual-setup__tip {
  display: grid;
}

.background-check-manual-setup__candidate {
  display: flex;
  align-items: center;
  gap: 12px;
}

.background-check-manual-setup__candidate .background-check-avatar {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  flex: 0 0 auto;
}

.background-check-manual-setup__candidate strong {
  display: block;
  color: #243454;
  font-size: 0.88rem;
}

.background-check-manual-setup__candidate p {
  margin: 4px 0 0;
  color: #6d7f9f;
  font-size: 0.74rem;
}

.background-check-manual-setup__candidate small {
  display: inline-flex;
  margin-top: 8px;
  padding: 5px 9px;
  border-radius: 999px;
  background: #f3f1ff;
  color: #6a5cff;
  font-size: 0.66rem;
  font-weight: 700;
}

.background-check-manual-setup__facts {
  display: grid;
  gap: 12px;
  margin: 0;
}

.background-check-manual-setup__facts div {
  display: grid;
  gap: 4px;
}

.background-check-manual-setup__facts dt {
  color: #95a3bf;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.background-check-manual-setup__facts dd {
  margin: 0;
  color: #243454;
  font-size: 0.78rem;
  font-weight: 700;
}

.background-check-manual-setup__facts dd span {
  display: inline-flex;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 999px;
  background: #fff1da;
  color: #d98808;
  font-size: 0.65rem;
  font-weight: 800;
}

.background-check-manual-setup__facts dd.is-priority {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.background-check-manual-setup__priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f8b400;
}

.background-check-manual-setup__help {
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 18px 16px;
  background: linear-gradient(180deg, #faf6ff 0%, #fff 100%);
}

.background-check-manual-setup__help > span,
.background-check-manual-setup__workflow-icon,
.background-check-manual-setup__tip-icon {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ff4fa2;
}

.background-check-manual-setup__help strong,
.background-check-manual-setup__tip strong {
  display: block;
  color: #243454;
  font-size: 0.82rem;
}

.background-check-manual-setup__help p,
.background-check-manual-setup__tip p {
  margin: 4px 0 0;
  color: #6d7f9f;
  font-size: 0.74rem;
  line-height: 1.55;
}

.background-check-manual-setup__support-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  margin-top: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6a35ff;
  font: inherit;
  font-size: 0.73rem;
  font-weight: 700;
  cursor: pointer;
}

.background-check-manual-setup__checks-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.background-check-manual-setup__check-card {
  position: relative;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  gap: 10px 12px;
  align-items: start;
  padding: 16px;
  border: 1px solid #e2e9fb;
  border-radius: 16px;
  background: #fff;
  cursor: pointer;
}

.background-check-manual-setup__check-card.is-selected {
  border-color: #ff9ccb;
  box-shadow: inset 0 0 0 1px rgba(255, 79, 162, 0.18);
}

.background-check-manual-setup__check-card input,
.background-check-manual-setup__document-row input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.background-check-manual-setup__check-toggle,
.background-check-manual-setup__document-toggle {
  width: 18px;
  height: 18px;
  border: 1px solid #ff4fa2;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff4fa2;
  color: #fff;
}

.background-check-manual-setup__check-card input:not(:checked) + .background-check-manual-setup__check-toggle,
.background-check-manual-setup__document-row input:not(:checked) + .background-check-manual-setup__document-toggle,
.background-check-manual-setup__check-toggle.is-empty {
  border-color: #d8e0f3;
  background: #fff;
  color: transparent;
}

.background-check-manual-setup__check-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f1ff;
  color: #6a5cff;
}

.background-check-manual-setup__check-card strong {
  grid-column: 2;
  color: #243454;
  font-size: 0.79rem;
  line-height: 1.4;
}

.background-check-manual-setup__check-card p {
  grid-column: 2 / 4;
  margin: 0;
  color: #6d7f9f;
  font-size: 0.72rem;
  line-height: 1.55;
}

.background-check-manual-setup__check-meta {
  grid-column: 2 / 4;
  color: #95a3bf;
  font-size: 0.66rem;
  font-weight: 700;
}

.background-check-manual-setup__check-card.is-custom {
  color: #ff4fa2;
  border-style: dashed;
}

.background-check-manual-setup__check-card.is-custom strong {
  color: #ff4fa2;
}

.background-check-manual-setup__check-card.is-generated .background-check-manual-setup__check-icon {
  background: #fff0f7;
  color: #ff4fa2;
}

.background-check-manual-setup__bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.95fr);
  gap: 14px;
}

.background-check-manual-setup__documents-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.background-check-manual-setup__document-row,
.background-check-manual-setup__document-add {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid #e2e9fb;
  border-radius: 14px;
  background: #fff;
  color: #243454;
  font-size: 0.74rem;
  font-weight: 600;
}

.background-check-manual-setup__document-add {
  justify-content: center;
  border-style: dashed;
  color: #ff4fa2;
  cursor: pointer;
}

.background-check-manual-setup__document-cancel {
  min-height: 44px;
  border: 1px solid #dbe4fb;
  border-radius: 14px;
  background: #fff;
  color: #7183a6;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.background-check-manual-setup__document-row--editor {
  grid-column: 1 / -1;
  justify-content: space-between;
  gap: 8px;
}

.background-check-manual-setup__document-row--editor input {
  position: static;
  opacity: 1;
  pointer-events: auto;
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  color: #243454;
  font: inherit;
  background: transparent;
}

.background-check-manual-setup__document-row--editor button {
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid #ffd0e6;
  border-radius: 10px;
  background: #fff6fb;
  color: #ff4fa2;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
}

.background-check-manual-setup__settings {
  display: grid;
  gap: 14px;
}

.background-check-manual-setup__settings label {
  display: grid;
  gap: 8px;
}

.background-check-manual-setup__settings > div {
  display: grid;
  gap: 8px;
}

.background-check-manual-setup__settings span {
  color: #95a3bf;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.background-check-manual-setup__settings input,
.background-check-manual-setup__settings textarea {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  outline: none;
  background: #fff;
  color: #263655;
  font: inherit;
}

.background-check-manual-setup__settings textarea {
  min-height: 124px;
  resize: vertical;
}

.background-check-manual-setup__settings small {
  justify-self: end;
  color: #95a3bf;
  font-size: 0.69rem;
}

.background-check-manual-setup__priority-group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.background-check-manual-setup__priority-group button {
  min-height: 40px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  background: #fff;
  color: #7183a6;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.background-check-manual-setup__priority-group button.is-active {
  border-color: #ff9ccb;
  background: #fff6fb;
  color: #ff4fa2;
}

.background-check-manual-setup__workflow-list article {
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}

.background-check-manual-setup__workflow-icon {
  width: 24px;
  height: 24px;
  border-radius: 8px;
}

.background-check-manual-setup__workflow-icon :deep(svg),
.background-check-manual-setup__tip-icon :deep(svg) {
  color: #ff4fa2;
}

.background-check-manual-setup__workflow-list article:last-child {
  padding-bottom: 0;
}

.background-check-manual-setup__workflow-list article + article {
  padding-top: 10px;
  border-top: 1px solid #eef2fb;
}

.background-check-manual-setup__workflow-text {
  color: #243454;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
}

.background-check-manual-setup__tip {
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  background: linear-gradient(180deg, #f8fbff 0%, #fff 100%);
}

.background-check-manual-setup__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.background-check-manual-setup__assign-shell,
.background-check-manual-setup__notifications-grid {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.background-check-manual-setup__assign-card,
.background-check-manual-setup__notifications {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.background-check-manual-setup__assign-head h4,
.background-check-manual-setup__notifications h4 {
  margin: 0;
  color: #243454;
  font-size: 0.92rem;
}

.background-check-manual-setup__assign-head p {
  margin: 6px 0 0;
  color: #6d7f9f;
  font-size: 0.74rem;
}

.background-check-manual-setup__assign-table {
  width: 100%;
  border: 1px solid #eef2fb;
  border-radius: 18px;
  overflow-x: auto;
  overflow-y: hidden;
}

.background-check-manual-setup__assign-table-head,
.background-check-manual-setup__assign-row {
  display: grid;
  grid-template-columns: minmax(170px, 1.05fr) minmax(220px, 1.18fr) minmax(160px, 1fr) 118px 96px;
  gap: 14px;
  align-items: start;
  min-width: 780px;
}

.background-check-manual-setup__assign-table-head {
  padding: 12px 14px;
  border-bottom: 1px solid #eef2fb;
  background: #fcfdff;
  color: #95a3bf;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.background-check-manual-setup__assign-row {
  padding: 14px;
  border-bottom: 1px solid #eef2fb;
}

.background-check-manual-setup__assign-row:last-child {
  border-bottom: 0;
}

.background-check-manual-setup__assign-check {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  min-width: 0;
}

.background-check-manual-setup__assign-check-icon {
  width: 32px;
  height: 32px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f1ff;
  color: #6a5cff;
}

.background-check-manual-setup__assign-check strong,
.background-check-manual-setup__assign-reviewers strong,
.background-check-manual-setup__notification-copy strong {
  display: block;
  color: #243454;
  font-size: 0.76rem;
  min-width: 0;
}

.background-check-manual-setup__assign-check p,
.background-check-manual-setup__notification-copy p {
  margin: 4px 0 0;
  color: #6d7f9f;
  font-size: 0.71rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.background-check-manual-setup__assign-reviewers,
.background-check-manual-setup__assign-responsibilities {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.background-check-manual-setup__reviewer-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.background-check-manual-setup__reviewer-avatar {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd8ec 0%, #f4f6ff 100%);
  color: #ef4fa0;
  font-size: 0.7rem;
  font-weight: 800;
}

.background-check-manual-setup__assign-reviewers small {
  display: block;
  margin-top: 3px;
  color: #95a3bf;
  font-size: 0.66rem;
  min-width: 0;
  overflow-wrap: anywhere;
}

.background-check-manual-setup__reviewer-role {
  padding: 4px 8px;
  border-radius: 999px;
  background: #fff1f8;
  color: #ff4fa2;
  font-size: 0.63rem;
  font-style: normal;
  font-weight: 800;
}

.background-check-manual-setup__add-reviewer,
.background-check-manual-setup__add-check {
  width: fit-content;
  padding: 0;
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #ff4fa2;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
}

.background-check-manual-setup__add-reviewer {
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid #ffd0e6;
  border-radius: 999px;
  background: #fff6fb;
}

.background-check-manual-setup__assign-responsibilities span {
  position: relative;
  padding-left: 12px;
  color: #44597f;
  font-size: 0.72rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.background-check-manual-setup__assign-responsibilities span::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ff4fa2;
}

.background-check-manual-setup__assign-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #44597f;
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 0;
  white-space: nowrap;
}

.background-check-manual-setup__assign-date :deep(svg) {
  color: #97a6c1;
}

.background-check-manual-setup__assign-workload {
  display: grid;
  gap: 4px;
  justify-items: start;
  min-width: 0;
}

.background-check-manual-setup__assign-workload strong {
  color: #243454;
  font-size: 0.73rem;
}

.background-check-manual-setup__assign-workload small {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.63rem;
  font-weight: 800;
}

.background-check-manual-setup__assign-workload.is-low small {
  background: #eefaf2;
  color: #20a95a;
}

.background-check-manual-setup__assign-workload.is-medium small {
  background: #fff6e6;
  color: #d98808;
}

.background-check-manual-setup__assign-workload.is-high small {
  background: #fff0f0;
  color: #d14343;
}

.background-check-manual-setup__notification-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px;
  border: 1px solid #eef2fb;
  border-radius: 16px;
  background: #fcfdff;
}

.background-check-manual-setup__notification-copy {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.background-check-manual-setup__notification-copy > span {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ff4fa2;
}

.background-check-manual-setup__switch {
  width: 42px;
  height: 24px;
  padding: 2px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: #d7dfef;
  cursor: pointer;
  transition: background 0.2s ease;
}

.background-check-manual-setup__switch i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: block;
  background: #fff;
  box-shadow: 0 4px 12px rgba(27, 39, 67, 0.14);
  transition: transform 0.2s ease;
}

.background-check-manual-setup__switch.is-active {
  background: #ff4fa2;
}

.background-check-manual-setup__switch.is-active i {
  transform: translateX(18px);
}

.background-check-manual-review,
.background-check-manual-review__grid,
.background-check-manual-review__hero-metrics,
.background-check-manual-review__list,
.background-check-manual-review__form,
.background-check-manual-review__actions,
.background-check-manual-review__validation-list {
  display: grid;
  gap: 14px;
}

.background-check-manual-review__hero {
  gap: 18px;
  border-color: #dceee2;
  background: linear-gradient(180deg, #f6fff8 0%, #fff 100%);
}

.background-check-manual-review__hero-copy {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
}

.background-check-manual-review__hero-copy > span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e9f9ef;
  color: #21aa5d;
}

.background-check-manual-review__hero-copy strong {
  display: block;
  color: #243454;
  font-size: 0.9rem;
}

.background-check-manual-review__hero-copy p {
  margin: 4px 0 0;
  color: #67809a;
  font-size: 0.73rem;
}

.background-check-manual-review__hero-metrics {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding-top: 12px;
  border-top: 1px solid #e6f1e8;
}

.background-check-manual-review__hero-metrics article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
}

.background-check-manual-review__hero-metrics article > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eefaf2;
  color: #21aa5d;
}

.background-check-manual-review__hero-metrics strong,
.background-check-manual-review__panel-head h4,
.background-check-manual-review__validation h4,
.background-check-manual-review__invitation-head h4,
.background-check-manual-review__list strong,
.background-check-manual-review__actions strong,
.background-check-manual-review__method-grid strong {
  color: #243454;
}

.background-check-manual-review__hero-metrics strong {
  display: block;
  font-size: 0.76rem;
}

.background-check-manual-review__hero-metrics small,
.background-check-manual-review__list small,
.background-check-manual-review__actions small,
.background-check-manual-review__method-grid small {
  display: block;
  margin-top: 3px;
  color: #95a3bf;
  font-size: 0.66rem;
  line-height: 1.45;
}

.background-check-manual-review__grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.background-check-manual-review__panel,
.background-check-manual-review__validation,
.background-check-manual-review__invitation {
  display: grid;
  gap: 14px;
}

.background-check-manual-review__panel-head,
.background-check-manual-review__invitation-head,
.background-check-manual-review__template-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.background-check-manual-review__panel-head h4,
.background-check-manual-review__validation h4,
.background-check-manual-review__invitation-head h4 {
  margin: 0;
  font-size: 0.88rem;
}

.background-check-manual-review__panel-head button,
.background-check-manual-review__inline-actions button,
.background-check-manual-review__actions button {
  border: 0;
  background: transparent;
  color: #6a35ff;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.background-check-manual-review__list article {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eef2fb;
}

.background-check-manual-review__list article:last-child {
  border-bottom: 0;
}

.background-check-manual-review__list article > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f1ff;
  color: #6a5cff;
}

.background-check-manual-review__list article > span.is-avatar {
  background: linear-gradient(135deg, #ffd8ec 0%, #f4f6ff 100%);
  color: #ef4fa0;
  font-size: 0.7rem;
  font-weight: 800;
}

.background-check-manual-review__list strong {
  display: block;
  font-size: 0.76rem;
}

.background-check-manual-review__list em {
  padding: 4px 8px;
  border-radius: 999px;
  background: #f3f6ff;
  color: #6378a2;
  font-size: 0.63rem;
  font-style: normal;
  font-weight: 800;
}

.background-check-manual-review__invitation p {
  margin: 4px 0 0;
  color: #6d7f9f;
  font-size: 0.73rem;
}

.background-check-manual-review__invitation-shell {
  display: grid;
  grid-template-columns: minmax(220px, 0.86fr) minmax(340px, 1.12fr) 220px;
  gap: 16px 18px;
  align-items: start;
}

.background-check-manual-review__invite-field,
.background-check-manual-review__invite-template,
.background-check-manual-review__invite-method,
.background-check-manual-review__invite-message {
  display: grid;
  gap: 8px;
}

.background-check-manual-review__invite-field > span,
.background-check-manual-review__invite-template > span,
.background-check-manual-review__invite-method > span,
.background-check-manual-review__invite-message > span {
  color: #95a3bf;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.background-check-manual-review__invite-email {
  grid-column: 1;
  grid-row: 1;
}

.background-check-manual-review__invite-template {
  grid-column: 2;
  grid-row: 1;
}

.background-check-manual-review__invite-method {
  grid-column: 1;
  grid-row: 2;
}

.background-check-manual-review__invite-message {
  grid-column: 2;
  grid-row: 2;
}

.background-check-manual-review__invite-actions {
  grid-column: 3;
  grid-row: 1 / span 2;
  align-self: start;
  margin-top: 32px;
}

.background-check-manual-review__email-input {
  min-height: 54px;
  padding: 0 14px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  background: #fff;
}

.background-check-manual-review__email-input :deep(svg) {
  color: #7f8fb0;
}

.background-check-manual-review__email-input input,
.background-check-manual-review__invite-message textarea {
  width: 100%;
  padding: 0;
  border: 0;
  outline: none;
  color: #263655;
  font: inherit;
  background: transparent;
}

.background-check-manual-review__template-control {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
}

.background-check-manual-review__inline-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.background-check-manual-review__inline-actions button,
.background-check-manual-review__actions button {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e6ecfb;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  color: #425575;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.background-check-manual-review__inline-actions button.is-icon-only {
  width: 40px;
  padding: 0;
  justify-content: center;
}

.background-check-manual-review__inline-actions button:hover,
.background-check-manual-review__actions button:hover {
  border-color: #ffbddb;
  background: #fff8fc;
  box-shadow: 0 10px 24px rgba(255, 79, 162, 0.1);
}

.background-check-manual-review__method-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.background-check-manual-review__method-grid button {
  min-height: 78px;
  padding: 14px;
  border: 1px solid #dbe4fb;
  border-radius: 14px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  background: #fff;
  color: #425575;
  text-align: left;
  cursor: pointer;
}

.background-check-manual-review__method-grid button.is-active {
  border-color: #ff9ccb;
  background: #fff6fb;
  box-shadow: inset 0 0 0 1px rgba(255, 79, 162, 0.14);
}

.background-check-manual-review__method-grid button > div {
  min-width: 0;
}

.background-check-manual-review__method-grid strong {
  display: block;
  font-size: 0.76rem;
}

.background-check-manual-review__allow-edit {
  display: grid !important;
  grid-template-columns: auto auto 1fr;
  gap: 10px !important;
  align-items: center;
  margin-top: 4px;
  color: #5c6f92;
  font-size: 0.73rem;
}

.background-check-manual-review__allow-edit input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.background-check-manual-review__checkbox {
  width: 18px;
  height: 18px;
  border: 1px solid #ff4fa2;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff4fa2;
  color: #fff;
}

.background-check-manual-review__allow-edit input:not(:checked) + .background-check-manual-review__checkbox {
  border-color: #d8e0f3;
  background: #fff;
  color: transparent;
}

.background-check-manual-review__actions {
  align-content: start;
  gap: 6px;
  padding: 8px;
  border: 1px solid #e6ecfb;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 16px 32px rgba(36, 52, 84, 0.08);
}

.background-check-manual-review__actions button {
  width: 100%;
  justify-content: flex-start;
  text-align: left;
  border: 1px solid transparent;
  border-radius: 12px;
  min-height: 62px;
  padding: 14px 16px;
}

.background-check-manual-review__actions button em {
  margin-left: auto;
  padding: 3px 6px;
  border-radius: 999px;
  background: #fff0f7;
  color: #ff4fa2;
  font-size: 0.62rem;
  font-style: normal;
  font-weight: 800;
}

.background-check-manual-review__invite-message textarea {
  min-height: 226px;
  padding: 14px 16px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  background: linear-gradient(180deg, #fcfdff 0%, #fff 100%);
  resize: none;
  line-height: 1.7;
}

.background-check-manual-review__validation {
  border-color: #dceee2;
  background: linear-gradient(180deg, #f8fff9 0%, #fff 100%);
}

.background-check-manual-review__validation-list article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  color: #4b5f82;
  font-size: 0.73rem;
}

.background-check-manual-review__validation-list :deep(svg) {
  color: #21aa5d;
}

.background-check-manual-review__validation-button {
  min-height: 40px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #dff4e5;
  color: #20a95a;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 800;
}

.background-check-manual-launch__overlay {
  position: fixed;
  inset: 0;
  z-index: 2300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

.background-check-manual-launch,
.background-check-manual-success {
  position: relative;
  width: min(860px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  display: grid;
  gap: 22px;
  overflow: auto;
  padding: 28px 30px;
  border: 1px solid #e5ebf8;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(18, 29, 53, 0.26);
}

.background-check-manual-launch > button,
.background-check-manual-success > button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #7c8cab;
  cursor: pointer;
}

.background-check-manual-launch__head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
  padding-top: 12px;
}

.background-check-manual-launch__head h3,
.background-check-manual-success__head h3 {
  margin: 0;
  color: #243454;
  font-size: 1.18rem;
}

.background-check-manual-launch__head p,
.background-check-manual-success__head p {
  margin: 6px 0 0;
  color: #6f82a3;
  font-size: 0.76rem;
}

.background-check-manual-launch__spinner {
  width: 72px;
  height: 72px;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fff5fb 0%, #fff 100%);
}

.background-check-manual-launch__spinner i {
  width: 34px;
  height: 34px;
  border: 4px dashed #ff5da8;
  border-radius: 50%;
  display: block;
  animation: manual-launch-spin 1.25s linear infinite;
}

.background-check-manual-launch__steps,
.background-check-manual-success__next div,
.background-check-manual-success__summary {
  display: grid;
  gap: 16px;
}

.background-check-manual-launch__step {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
}

.background-check-manual-launch__step-rail {
  display: grid;
  justify-items: center;
  gap: 6px;
}

.background-check-manual-launch__step-rail span {
  width: 26px;
  height: 26px;
  border: 1px solid #ffd0e6;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #ff4fa2;
}

.background-check-manual-launch__step-rail i {
  width: 1px;
  min-height: 34px;
  background: linear-gradient(180deg, #ffe5f1 0%, #eff3fb 100%);
}

.background-check-manual-launch__step:last-child .background-check-manual-launch__step-rail i {
  display: none;
}

.background-check-manual-launch__step-copy {
  display: grid;
  gap: 8px;
}

.background-check-manual-launch__step-copy strong {
  color: #243454;
  font-size: 0.82rem;
}

.background-check-manual-launch__progress {
  height: 2px;
  border-radius: 999px;
  overflow: hidden;
  background: #edf1fb;
}

.background-check-manual-launch__progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #ff4fa2 0%, #1dd169 100%);
}

.background-check-manual-launch__step em {
  color: #92a0ba;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 700;
}

.background-check-manual-launch__step.is-completed em {
  color: #20a95a;
}

.background-check-manual-launch__step.is-active em {
  color: #243454;
}

.background-check-manual-launch__step.is-completed .background-check-manual-launch__progress span {
  width: 100% !important;
}

.background-check-manual-launch__tip {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  padding: 18px;
  border: 1px solid #eef2fb;
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfcff 0%, #fff 100%);
}

.background-check-manual-launch__tip > span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3efff;
  color: #6a5cff;
}

.background-check-manual-launch__tip strong,
.background-check-manual-success__next h4 {
  color: #243454;
}

.background-check-manual-launch__tip strong {
  display: block;
  font-size: 0.82rem;
}

.background-check-manual-launch__tip p {
  margin: 4px 0 0;
  color: #6d7f9f;
  font-size: 0.74rem;
}

.background-check-manual-success {
  justify-items: center;
  text-align: center;
}

.background-check-manual-success__head {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding-top: 8px;
}

.background-check-manual-success__head > span {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #22c55e;
  color: #fff;
  box-shadow: 0 18px 36px rgba(34, 197, 94, 0.2);
}

.background-check-manual-success__summary {
  width: 100%;
  padding: 8px 0;
  border: 1px solid #e8edf9;
  border-radius: 16px;
}

.background-check-manual-success__summary article {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eef2fb;
  text-align: left;
}

.background-check-manual-success__summary article:last-child {
  border-bottom: 0;
}

.background-check-manual-success__summary article > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f6f8ff;
  color: #5f74a0;
}

.background-check-manual-success__summary strong {
  color: #425575;
  font-size: 0.75rem;
  font-weight: 700;
}

.background-check-manual-success__summary em {
  color: #243454;
  font-size: 0.76rem;
  font-style: normal;
  font-weight: 800;
}

.background-check-manual-success__summary em.is-status {
  padding: 6px 10px;
  border-radius: 999px;
  background: #ecfbf3;
  color: #20a95a;
}

.background-check-manual-success__next {
  width: 100%;
  text-align: left;
}

.background-check-manual-success__next h4 {
  margin: 0;
  font-size: 0.95rem;
}

.background-check-manual-success__next article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  color: #425575;
  font-size: 0.75rem;
}

.background-check-manual-success__next :deep(svg) {
  color: #20a95a;
}

.background-check-manual-success__foot {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

@keyframes manual-launch-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.background-check-custom-modal__overlay {
  position: fixed;
  inset: 0;
  z-index: 2250;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

.background-check-custom-modal {
  width: min(860px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e4eaf7;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(18, 29, 53, 0.26);
}

.background-check-custom-modal__head,
.background-check-custom-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
}

.background-check-custom-modal__head {
  border-bottom: 1px solid #eef2fb;
}

.background-check-custom-modal__head h3 {
  margin: 0;
  color: #243454;
  font-size: 1rem;
}

.background-check-custom-modal__head p {
  margin: 6px 0 0;
  color: #7383a3;
  font-size: 0.74rem;
}

.background-check-custom-modal__head button {
  width: 36px;
  height: 36px;
  border: 1px solid #dbe4fb;
  border-radius: 50%;
  background: #fff;
  color: #90a0bd;
  cursor: pointer;
}

.background-check-custom-modal__body {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.82fr);
  gap: 18px;
  padding: 20px 22px;
  overflow: auto;
  background:
    radial-gradient(circle at top left, rgba(255, 92, 168, 0.08), transparent 22%),
    linear-gradient(180deg, #fff 0%, #fbfdff 100%);
}

.background-check-custom-modal__main,
.background-check-custom-modal__side,
.background-check-custom-modal__panel {
  display: grid;
  gap: 14px;
  align-content: start;
}

.background-check-custom-modal__field {
  display: grid;
  gap: 8px;
}

.background-check-custom-modal__field > span,
.background-check-custom-modal__panel h4,
.background-check-custom-modal__suggested-head span {
  color: #95a3bf;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.background-check-custom-modal__panel h4 {
  margin: 0;
}

.background-check-custom-modal__field input,
.background-check-custom-modal__field textarea,
.background-check-custom-modal__document-input input {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  outline: none;
  background: #fff;
  color: #263655;
  font: inherit;
}

.background-check-custom-modal__field textarea {
  min-height: 120px;
  resize: vertical;
}

.background-check-custom-modal__field small {
  justify-self: end;
  color: #95a3bf;
  font-size: 0.69rem;
}

.background-check-custom-modal__bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 0.9fr);
  gap: 14px;
}

.background-check-custom-modal__priority-group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.background-check-custom-modal__priority-group button {
  min-height: 40px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  background: #fff;
  color: #7183a6;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.background-check-custom-modal__priority-group button.is-active {
  border-color: #ff9ccb;
  background: #fff6fb;
  color: #ff4fa2;
}

.background-check-custom-modal__panel,
.background-check-custom-modal__suggested {
  padding: 16px;
  border: 1px solid #e2e9fb;
  border-radius: 18px;
  background: #fff;
}

.background-check-custom-modal__suggested {
  display: grid;
  gap: 12px;
  background: linear-gradient(180deg, #fff8fc 0%, #fff 100%);
}

.background-check-custom-modal__suggested-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.background-check-custom-modal__suggested-head button {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #ffd0e6;
  border-radius: 10px;
  background: #fff;
  color: #ff4fa2;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
}

.background-check-custom-modal__suggested-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.background-check-custom-modal__suggested-tags button {
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid #f0ddee;
  border-radius: 999px;
  background: #fff;
  color: #6d7f9f;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
}

.background-check-custom-modal__evidence-row,
.background-check-custom-modal__assign-toggle {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 10px;
  align-items: center;
  color: #243454;
  font-size: 0.74rem;
  font-weight: 600;
}

.background-check-custom-modal__evidence-row input,
.background-check-custom-modal__assign-toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.background-check-custom-modal__checkbox {
  width: 18px;
  height: 18px;
  border: 1px solid #ff4fa2;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff4fa2;
  color: #fff;
}

.background-check-custom-modal__evidence-row input:not(:checked) + .background-check-custom-modal__checkbox,
.background-check-custom-modal__assign-toggle input:not(:checked) + .background-check-custom-modal__checkbox {
  border-color: #d8e0f3;
  background: #fff;
  color: transparent;
}

.background-check-custom-modal__document-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.background-check-custom-modal__document-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid #e6ddff;
  border-radius: 10px;
  background: #faf7ff;
  color: #4c5d82;
  font-size: 0.71rem;
  font-weight: 700;
}

.background-check-custom-modal__document-pill button {
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(106, 92, 255, 0.12);
  color: #6a5cff;
  cursor: pointer;
}

.background-check-custom-modal__document-input {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.background-check-custom-modal__document-input button {
  min-height: 42px;
  padding: 0 12px;
  border: 1px dashed #ffb4d4;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  color: #ff4fa2;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
}

.background-check-custom-modal__reviewer-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border: 1px solid #eef2fb;
  border-radius: 14px;
  background: #fbfdff;
}

.background-check-custom-modal__reviewer-card span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd8ec 0%, #f4f6ff 100%);
  color: #ef4fa0;
  font-size: 0.74rem;
  font-weight: 800;
}

.background-check-custom-modal__reviewer-card strong {
  display: block;
  color: #243454;
  font-size: 0.78rem;
}

.background-check-custom-modal__reviewer-card small {
  display: block;
  margin-top: 4px;
  color: #95a3bf;
  font-size: 0.68rem;
}

.background-check-custom-modal__foot {
  border-top: 1px solid #eef2fb;
}

.background-check-custom-modal__foot button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.background-check-document-modal {
  width: min(860px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e4eaf7;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(18, 29, 53, 0.26);
}

.background-check-document-modal__head,
.background-check-document-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
}

.background-check-document-modal__head {
  border-bottom: 1px solid #eef2fb;
}

.background-check-document-modal__head h3 {
  margin: 0;
  color: #243454;
  font-size: 1rem;
}

.background-check-document-modal__head p {
  margin: 6px 0 0;
  color: #7383a3;
  font-size: 0.74rem;
}

.background-check-document-modal__head button {
  width: 36px;
  height: 36px;
  border: 1px solid #dbe4fb;
  border-radius: 50%;
  background: #fff;
  color: #90a0bd;
  cursor: pointer;
}

.background-check-document-modal__body {
  display: grid;
  grid-template-columns: minmax(0, 1.28fr) minmax(250px, 0.82fr);
  gap: 18px;
  padding: 20px 22px;
  overflow: auto;
  background:
    radial-gradient(circle at top left, rgba(255, 92, 168, 0.08), transparent 22%),
    linear-gradient(180deg, #fff 0%, #fbfdff 100%);
}

.background-check-document-modal__main,
.background-check-document-modal__side,
.background-check-document-modal__panel {
  display: grid;
  gap: 14px;
  align-content: start;
}

.background-check-document-modal__field {
  display: grid;
  gap: 8px;
}

.background-check-document-modal__field > span,
.background-check-document-modal__panel h4,
.background-check-document-modal__toggle-head span {
  color: #95a3bf;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.background-check-document-modal__panel h4 {
  margin: 0;
}

.background-check-document-modal__field input,
.background-check-document-modal__field textarea {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  outline: none;
  background: #fff;
  color: #263655;
  font: inherit;
}

.background-check-document-modal__field textarea {
  min-height: 112px;
  resize: vertical;
}

.background-check-document-modal__field small,
.background-check-document-modal__toggle-head small {
  color: #95a3bf;
  font-size: 0.69rem;
  line-height: 1.5;
}

.background-check-document-modal__field > small {
  justify-self: end;
}

.background-check-document-modal__pill-group,
.background-check-document-modal__radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.background-check-document-modal__pill-group button,
.background-check-document-modal__radio-group button {
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  color: #7183a6;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.background-check-document-modal__pill-group button.is-active,
.background-check-document-modal__radio-group button.is-active {
  border-color: #ff9ccb;
  background: #fff6fb;
  color: #ff4fa2;
}

.background-check-document-modal__radio {
  width: 14px;
  height: 14px;
  border: 1.5px solid #cfd9ef;
  border-radius: 50%;
  background: #fff;
}

.background-check-document-modal__radio-group button.is-active .background-check-document-modal__radio {
  border-color: #ff4fa2;
  box-shadow: inset 0 0 0 4px #ff4fa2;
}

.background-check-document-modal__toggle-head {
  display: grid;
  gap: 4px;
}

.background-check-document-modal__toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #243454;
  font-size: 0.74rem;
  font-weight: 600;
}

.background-check-document-modal__toggle-row em {
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 999px;
  background: #ecfbf3;
  color: #21aa5d;
  font-size: 0.63rem;
  font-style: normal;
  font-weight: 800;
}

.background-check-document-modal__switch {
  width: 42px;
  height: 24px;
  padding: 2px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: #d7dfef;
  cursor: pointer;
  transition: background 0.2s ease;
}

.background-check-document-modal__switch i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: block;
  background: #fff;
  box-shadow: 0 4px 12px rgba(27, 39, 67, 0.14);
  transition: transform 0.2s ease;
}

.background-check-document-modal__switch.is-active {
  background: #ff4fa2;
}

.background-check-document-modal__switch.is-active i {
  transform: translateX(18px);
}

.background-check-document-modal__panel {
  padding: 16px;
  border: 1px solid #e2e9fb;
  border-radius: 18px;
  background: #fff;
}

.background-check-document-modal__check-row {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 10px;
  align-items: center;
  color: #243454;
  font-size: 0.74rem;
  font-weight: 600;
}

.background-check-document-modal__check-row input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.background-check-document-modal__checkbox {
  width: 18px;
  height: 18px;
  border: 1px solid #ff4fa2;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff4fa2;
  color: #fff;
}

.background-check-document-modal__check-row input:not(:checked) + .background-check-document-modal__checkbox {
  border-color: #d8e0f3;
  background: #fff;
  color: transparent;
}

.background-check-document-modal__preview-head {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.background-check-document-modal__preview-head small {
  color: #95a3bf;
  font-size: 0.68rem;
}

.background-check-document-modal__preview-card {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 18px 16px;
  border: 1px solid #eef2fb;
  border-radius: 16px;
  background: linear-gradient(180deg, #fffafb 0%, #fff 100%);
  text-align: center;
}

.background-check-document-modal__preview-card > span {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ff4fa2;
}

.background-check-document-modal__preview-card p,
.background-check-document-modal__preview-card small {
  margin: 0;
  color: #7c8cab;
  font-size: 0.71rem;
  line-height: 1.55;
}

.background-check-document-modal__preview-card strong {
  color: #243454;
  font-size: 0.79rem;
}

.background-check-document-modal__foot {
  border-top: 1px solid #eef2fb;
}

.background-check-document-modal__foot button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 1480px) {
  .background-check-methods-shell.has-provider-info,
  .background-check-recommendation,
  .background-check-integrated-shell,
  .background-check-manual-card,
  .background-check-manual-card__content {
    grid-template-columns: 1fr;
  }

  .background-check-modal__head.is-progress {
    flex-wrap: wrap;
  }

  .background-check-modal__progress-steps,
  .background-check-manual-setup__grid {
    max-width: none;
    width: 100%;
  }

  .background-check-modal__progress-steps,
  .background-check-manual-setup__grid,
  .background-check-manual-setup__bottom-grid,
  .background-check-manual-setup__checks-grid,
  .background-check-manual-setup__documents-grid,
  .background-check-custom-modal__body,
  .background-check-custom-modal__bottom-grid,
  .background-check-document-modal__body {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .background-check-manual-setup__sidebar,
  .background-check-manual-setup__summary {
    grid-column: span 2;
  }

  .background-check-manual-review__grid,
  .background-check-manual-review__hero-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .background-check-manual-review__invitation-shell {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .background-check-manual-review__invite-template {
    grid-column: 2;
    grid-row: 1;
  }

  .background-check-manual-review__invite-method {
    grid-column: 1;
    grid-row: 2;
  }

  .background-check-manual-review__invite-message {
    grid-column: 1 / -1;
    grid-row: 3;
  }

  .background-check-manual-review__invite-actions {
    grid-column: 2;
    grid-row: 2;
    margin-top: 0;
  }

  .background-check-manual-setup__assign-table-head,
  .background-check-manual-setup__assign-row {
    grid-template-columns: minmax(170px, 1fr) minmax(210px, 1.1fr) minmax(170px, 0.95fr) 110px 90px;
    min-width: 740px;
  }

  .background-check-candidate__facts,
  .background-check-methods__grid,
  .background-check-package__meta,
  .background-check-package__check-list,
  .background-check-timeline__steps,
  .background-check-template-details__overview-grid,
  .background-check-template-details__content,
  .background-check-integrated-card__grid,
  .background-check-integrated-card__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1180px) {
  .background-check-workspace.is-customizing {
    grid-template-columns: 1fr;
  }

  .background-check-customize {
    position: static;
  }

  .background-check-custom-modal__body {
    grid-template-columns: 1fr;
  }

  .background-check-document-modal__body {
    grid-template-columns: 1fr;
  }

  .background-check-manual-setup__grid {
    grid-template-columns: 1fr;
  }

  .background-check-manual-setup__sidebar,
  .background-check-manual-setup__summary {
    grid-column: auto;
  }

  .background-check-manual-setup__assign-table-head,
  .background-check-manual-setup__assign-row {
    grid-template-columns: 1fr;
  }

  .background-check-manual-setup__assign-table-head {
    display: none;
  }

  .background-check-manual-review__grid,
  .background-check-manual-review__hero-metrics,
  .background-check-manual-review__invitation-shell {
    grid-template-columns: 1fr;
  }

  .background-check-manual-review__invite-email,
  .background-check-manual-review__invite-template,
  .background-check-manual-review__invite-method,
  .background-check-manual-review__invite-message,
  .background-check-manual-review__invite-actions {
    grid-column: auto;
    grid-row: auto;
    margin-top: 0;
  }
}

@media (max-width: 860px) {
  .background-check-overlay {
    padding: 12px;
  }

  .background-check-modal {
    width: 100%;
    max-height: calc(100vh - 24px);
  }

  .background-check-candidate,
  .background-check-candidate__facts,
  .background-check-methods__grid,
  .background-check-manual-card__content,
  .background-check-package__meta,
  .background-check-package__check-list,
  .background-check-package__why,
  .background-check-readiness,
  .background-check-timeline__steps,
  .background-check-modal__progress-steps,
  .background-check-manual-setup__checks-grid,
  .background-check-manual-setup__documents-grid,
  .background-check-manual-setup__bottom-grid,
  .background-check-manual-review__grid,
  .background-check-manual-review__hero-metrics,
  .background-check-manual-review__invitation-shell,
  .background-check-manual-review__method-grid,
  .background-check-template-details__overview-grid,
  .background-check-template-details__content,
  .background-check-customize__metrics,
  .background-check-customize__foot,
  .background-check-custom-modal__bottom-grid,
  .background-check-custom-modal__document-input,
  .background-check-document-modal__body,
  .background-check-integrated-card__grid,
  .background-check-integrated-card__metrics {
    grid-template-columns: 1fr;
  }

  .background-check-template-details__head,
  .background-check-template-details__head-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .background-check-template-details__checks-head {
    display: none;
  }

  .background-check-template-details__checks-table article {
    grid-template-columns: 1fr;
  }

  .background-check-package__head,
  .background-check-modal__foot {
    flex-direction: column;
    align-items: stretch;
  }

  .background-check-modal__head.is-progress {
    align-items: stretch;
  }

  .background-check-manual-card {
    padding: 16px;
  }

  .background-check-manual-card__visual {
    min-height: 190px;
  }

  .background-check-modal__actions,
  .background-check-package__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .background-check-package__actions button,
  .background-check-secondary,
  .background-check-primary,
  .background-check-provider-info button {
    width: 100%;
  }

  .background-check-manual-setup__priority-group {
    grid-template-columns: 1fr;
  }

  .background-check-manual-setup__reviewer-item,
  .background-check-manual-setup__notification-card,
  .background-check-manual-setup__foot {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .background-check-manual-review__panel-head,
  .background-check-manual-review__invitation-head,
  .background-check-manual-review__template-control,
  .background-check-manual-review__inline-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .background-check-custom-modal__head,
  .background-check-custom-modal__foot,
  .background-check-custom-modal__suggested-head,
  .background-check-document-modal__head,
  .background-check-document-modal__foot {
    flex-direction: column;
    align-items: stretch;
  }

  .background-check-custom-modal__overlay {
    padding: 12px;
  }

  .background-check-manual-launch__overlay {
    padding: 12px;
  }

  .background-check-manual-launch,
  .background-check-manual-success {
    width: 100%;
    max-height: calc(100vh - 24px);
    padding: 22px 20px;
    border-radius: 24px;
  }

  .background-check-manual-launch__step,
  .background-check-manual-success__summary article {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .background-check-manual-launch__step em,
  .background-check-manual-success__summary em {
    grid-column: 2;
    justify-self: start;
  }

  .background-check-manual-success__foot {
    grid-template-columns: 1fr;
  }
}
</style>
