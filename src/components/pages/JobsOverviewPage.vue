<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import StepDefineGoal from './job-setup/StepDefineGoal.vue'
import StepHiringBlueprint from './job-setup/StepHiringBlueprint.vue'
import StepCandidatePersona from './job-setup/StepCandidatePersona.vue'
import StepApplicationSetup from './job-setup/StepApplicationSetup.vue'
import StepAIScreening from './job-setup/StepAIScreening.vue'

const emit = defineEmits(['open-pipeline'])

const baseSteps = [
  { id: 1, label: 'Define Goal' },
  { id: 2, label: 'Hiring Blueprint' },
  { id: 3, label: 'Candidate Persona' },
  { id: 4, label: 'Application Setup' },
  { id: 5, label: 'AI Screening' },
  { id: 6, label: 'Hiring Pipeline' },
  { id: 7, label: 'Interview Kit' },
  { id: 8, label: 'Publish' },
]

const activeStep = ref(1)
const props = defineProps({
  jobId: {
    type: String,
    default: 'ac-1187',
  },
  routePrefix: {
    type: String,
    default: 'create-job',
  },
})

const steps = computed(() => (
  baseSteps.map((step) => ({
    ...step,
    active: step.id === activeStep.value,
  }))
))

const stepContent = {
  1: {
    eyebrow: 'Step 1 of 8',
    title: 'Define Goal',
    description: 'Set the hiring goal, job title, location and employment type before building the workflow.',
    cards: [
      { title: 'Role Basics', text: 'Senior Accountant, Finance, Stockholm, Hybrid, Full-time.' },
      { title: 'Hiring Goal', text: 'Expansion role to support IFRS reporting and monthly close.' },
      { title: 'Stakeholders', text: 'Hiring manager, finance and talent team are aligned on this role.' },
    ],
  },
  2: {
    eyebrow: 'Step 2 of 8',
    title: 'AI Hiring Blueprint',
    description: 'Review responsibilities, requirements, quality checks and candidate attraction signals.',
    cards: [
      { title: 'Responsibilities', text: 'Financial statements, IFRS compliance, closing cycles and analysis.' },
      { title: 'Requirements', text: '5+ years in accounting, ERP familiarity and advanced Excel.' },
      { title: 'Readiness', text: 'Blueprint quality is high and ready for recruiter review.' },
    ],
  },
  3: {
    eyebrow: 'Step 3 of 8',
    title: 'Candidate Persona',
    description: 'Define must-haves, strengths and ideal profile traits for the search.',
    cards: [
      { title: 'Must-Haves', text: 'IFRS, accounting degree, English fluency and 5+ years of experience.' },
      { title: 'Nice to Have', text: 'SAP, CPA/ACCA, Power BI and Big 4 background.' },
      { title: 'Success Traits', text: 'Detail-oriented, analytical and calm under deadline pressure.' },
    ],
  },
  4: {
    eyebrow: 'Step 4 of 8',
    title: 'Experience & Application Setup',
    description: 'Tune the candidate application flow, questions and submission depth.',
    cards: [
      { title: 'Application Mode', text: 'Balanced flow with CV upload and focused screening questions.' },
      { title: 'Coverage', text: 'Experience, skills, education and availability are included.' },
      { title: 'Candidate Effort', text: 'Estimated application time is 3 to 5 minutes.' },
    ],
  },
  5: {
    eyebrow: 'Step 5 of 8',
    title: 'Review & Evaluation',
    description: 'Inspect evaluation logic, scoring coverage and recruiter checkpoints.',
    cards: [
      { title: 'Screening Mode', text: 'AI assisted with recruiter approval before progression.' },
      { title: 'Coverage', text: 'Experience, skills and availability are fully covered.' },
      { title: 'Validation', text: 'Screening logic is ready for activation in the pipeline.' },
    ],
  },
  7: {
    eyebrow: 'Step 7 of 8',
    title: 'Interview Kit',
    description: 'Prepare interview loops, scorecards and evaluation criteria for each stakeholder.',
    cards: [
      { title: 'Interview Panels', text: 'Recruiter, hiring manager and finance participants configured.' },
      { title: 'Scorecards', text: 'Technical depth, communication, ownership and business fit.' },
      { title: 'Status', text: 'Interview kits are drafted and ready for final review.' },
    ],
  },
  8: {
    eyebrow: 'Step 8 of 8',
    title: 'Launch & Publish',
    description: 'Finalize publishing, activation settings and go-live readiness checks.',
    cards: [
      { title: 'Career Page', text: 'Preview is ready with role overview, benefits and application CTA.' },
      { title: 'Automation', text: 'Workflow, approvals and alerts are prepared for launch.' },
      { title: 'Final Check', text: 'Only launch confirmation remains before publishing externally.' },
    ],
  },
}

const currentStepContent = computed(() => stepContent[activeStep.value] ?? null)

const interviewPlanStages = [
  { id: 1, title: 'Recruiter Screen', duration: '30 min', purpose: 'Initial screening', focus: 'Motivation, Communication', owner: 'Sarah Parker', tone: 'green' },
  { id: 2, title: 'Hiring Manager', duration: '60 min', purpose: 'Deep dive evaluation', focus: 'Technical skills, Problem solving', owner: 'John Berg', tone: 'blue' },
  { id: 3, title: 'Team Interview', duration: '45 min', purpose: 'Collaboration assessment', focus: 'Teamwork, Culture add', owner: 'Panel +2', tone: 'orange' },
  { id: 4, title: 'Final Interview', duration: '30 min', purpose: 'Final assessment', focus: 'Leadership, Decision making', owner: 'Lisa Thompson', tone: 'pink' },
]

const interviewKits = [
  { title: 'Recruiter Screen Kit', questions: 8, tone: 'green', areas: ['Communication', 'Motivation', 'Availability & Notice Period'], includes: ['Scorecard', 'Candidate Notes'] },
  { title: 'Hiring Manager Kit', questions: 12, tone: 'blue', featured: true, areas: ['Technical Skills (Accounting)', 'IFRS & Reporting', 'Problem Solving'], includes: ['Scorecard', 'Model Answer Guide'] },
  { title: 'Team Interview Kit', questions: 6, tone: 'orange', areas: ['Collaboration', 'Stakeholder Management', 'Culture Add'], includes: ['Scorecard', 'Team Feedback'] },
  { title: 'Final Interview Kit', questions: 6, tone: 'pink', areas: ['Leadership Potential', 'Decision Making', 'Long-term Impact'], includes: ['Scorecard', 'Reference Guide'] },
]

const evaluationAreas = [
  { title: 'Technical Skills', questions: 5, tone: 'pink' },
  { title: 'IFRS Knowledge', questions: 3, tone: 'green' },
  { title: 'Communication', questions: 4, tone: 'blue' },
  { title: 'Leadership', questions: 3, tone: 'orange' },
  { title: 'Culture Add', questions: 2, tone: 'yellow' },
]

const interviewFocusAreas = [
  'IFRS reporting and compliance accuracy',
  'Financial analysis and decision support',
  'ERP / SAP system proficiency',
  'Stakeholder communication and influence',
  'Leadership potential and ownership mindset',
]

const interviewPreviewQuestion = {
  title: 'Walk me through a complex financial analysis you performed. What was the business impact?',
  lookingFor: 'Problem solving approach, analytical skills, business acumen, and impact.',
  prompts: [
    'What was the biggest challenge?',
    'How did you ensure accuracy?',
    'What would you do differently next time?',
  ],
}

const launchChecks = [
  'Job Blueprint Complete',
  'Candidate Persona Complete',
  'Screening Rules Ready',
  'Pipeline Logic Ready',
  'Interview Kit Ready',
  'Communications Ready',
]

const launchSummary = [
  ['Job Title', 'Senior Accountant'],
  ['Department', 'Finance'],
  ['Location', 'Stockholm, Sweden'],
  ['Work Model', 'Hybrid'],
  ['Employment Type', 'Full-time'],
  ['Hiring Manager', 'Sarah Parker'],
  ['Recruiter', 'John Smith'],
  ['Open Positions', '2'],
]

const candidateExperiencePreview = [
  ['Application Time', '~ 6 min'],
  ['Interview Process', '3 Interviews'],
  ['Expected Hiring Time', '21 Days'],
  ['Candidate Exp. Score', '9.2 / 10'],
]

const publishingChannels = [
  {
    name: 'Career Site',
    image: 'https://api.iconify.design/material-symbols:house-outline-rounded.svg?color=%23ec4899',
    background: '#fff1f7',
  },
  {
    name: 'LinkedIn',
    image: 'https://api.iconify.design/simple-icons:linkedin.svg?color=%230A66C2',
    background: '#edf2ff',
  },
  {
    name: 'Indeed',
    image: 'https://api.iconify.design/simple-icons:indeed.svg?color=%232557A7',
    background: '#edf2ff',
  },
  {
    name: 'Glassdoor',
    image: 'https://api.iconify.design/simple-icons:glassdoor.svg?color=%2300A162',
    background: '#eafbf0',
  },
  {
    name: 'Talent Pool',
    image: 'https://api.iconify.design/material-symbols:group-outline-rounded.svg?color=%23ec4899',
    background: '#fff1f7',
  },
  {
    name: 'Employee Referrals',
    image: 'https://api.iconify.design/material-symbols:person-add-outline-rounded.svg?color=%234f6ef6',
    background: '#edf2ff',
  },
]

const approvalWorkflow = [
  ['Hiring Manager', 'Sarah Parker', 'Approved'],
  ['HR Business Partner', 'Emma Lund', 'Approved'],
  ['Finance', 'Marcus Berg', 'Pending'],
  ['Department Head', 'Johan Eriksson', 'Pending'],
]

const seoKeywords = ['accountant', 'finance', 'ifrs', 'hybrid', 'stockholm']

const movementModes = [
  {
    id: 'manual',
    title: 'Manual',
    note: 'Recruiters move candidates manually.',
  },
  {
    id: 'assisted',
    title: 'AI Assisted',
    note: 'AI recommends, recruiters approve.',
    active: true,
  },
  {
    id: 'automated',
    title: 'Fully Automated',
    note: 'AI moves candidates automatically.',
  },
]

const routingSteps = [
  { icon: 'document', label: 'CV Uploaded' },
  { icon: 'search', label: 'Parse Resume' },
  { icon: 'user', label: 'Match Persona' },
  { icon: 'clipboard-check', label: 'Evaluate Requirements', accent: 'violet' },
  { icon: 'refresh', label: 'Calculate Match Score' },
  { icon: 'check', label: 'Recommend Stage', accent: 'green' },
]

const pipelineStages = [
  { id: 1, title: 'Applied', owner: 'Recruiter', sla: '1 Day', kit: 'No kit', automation: 'Basic', icon: 'document', tone: 'green' },
  { id: 2, title: 'Qualified', owner: 'Recruiter', sla: '2 Days', kit: 'Screening Kit v1', automation: 'AI Assisted', icon: 'user', tone: 'blue', active: true },
  { id: 3, title: 'Shortlisted', owner: 'Hiring Manager', sla: '3 Days', kit: 'Shortlist Kit v1', automation: 'AI Assisted', icon: 'star', tone: 'violet' },
  { id: 4, title: 'Interview', owner: 'Hiring Manager', sla: '5 Days', kit: 'Interview Kit v2', automation: 'AI Assisted', icon: 'briefcase', tone: 'orange' },
  { id: 5, title: 'Validation', owner: 'Hiring Manager', sla: '3 Days', kit: 'Validation Kit v1', automation: 'Manual', icon: 'shield', tone: 'blue' },
  { id: 6, title: 'Offer', owner: 'Recruiter', sla: '2 Days', kit: 'Offer Kit v1', automation: 'Manual', icon: 'briefcase', tone: 'green' },
]

const movementRules = [
  'Match score greater than 75%',
  'All must-have skills found',
  'Minimum 3 years relevant experience',
  'Work authorization verified',
  'Recruiter approved',
]

const approvalSteps = [
  { title: 'Recruiter Approval', state: 'Required', tone: 'green', icon: 'user', note: '' },
  { title: 'Hiring Manager Approval', state: 'Required', tone: 'green', icon: 'star', note: '' },
  { title: 'HR Approval', state: 'Optional', tone: 'orange', icon: 'user', note: '' },
  { title: 'Finance Approval', state: 'Offer Stage Only', tone: 'blue', icon: 'briefcase', note: 'Offer Stage Only' },
]

const automationFlows = [
  {
    id: 1,
    active: true,
    steps: ['CV Uploaded', 'Send Confirmation Email', 'Assign Recruiter', 'AI Match Candidate', 'Move to Qualified'],
  },
  {
    id: 2,
    active: true,
    steps: ['Review CV', 'Shortlist Candidate', 'Validate Fit', 'Assign Manager'],
  },
  {
    id: 3,
    active: false,
    steps: ['Candidate Reply', 'Reminder Email', 'Approval Ping'],
  },
]

const automationPageSize = 3
const automationPages = ref(
  Object.fromEntries(automationFlows.map((flow) => [flow.id, 0])),
)

function getAutomationPageCount(flow) {
  return Math.max(1, Math.ceil(flow.steps.length / automationPageSize))
}

function getVisibleAutomationSteps(flow) {
  const page = automationPages.value[flow.id] ?? 0
  const start = page * automationPageSize
  return flow.steps.slice(start, start + automationPageSize)
}

function shiftAutomationPage(flowId, direction, maxPage) {
  const current = automationPages.value[flowId] ?? 0
  const next = Math.min(maxPage, Math.max(0, current + direction))
  automationPages.value = {
    ...automationPages.value,
    [flowId]: next,
  }
}

function getStepFromHash() {
  if (typeof window === 'undefined') {
    return null
  }

  const match = window.location.hash.match(/step-(\d+)/)

  if (!match) {
    return null
  }

  const stepId = Number(match[1])

  return baseSteps.some((step) => step.id === stepId) ? stepId : null
}

function syncStepFromHash() {
  const stepId = getStepFromHash()

  if (stepId !== null) {
    activeStep.value = stepId
  }
}

function updateHash(stepId) {
  if (typeof window === 'undefined') {
    return
  }

  const nextHash = `#${props.routePrefix}/step-${stepId}`

  if (window.location.hash !== nextHash) {
    window.history.replaceState(null, '', nextHash)
  }
}

function goBack() {
  if (activeStep.value > 1) {
    activeStep.value -= 1
    updateHash(activeStep.value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  window.location.hash = 'jobs'

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToStep(stepId) {
  activeStep.value = stepId
  updateHash(stepId)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToNextStep() {
  if (activeStep.value < baseSteps.length) {
    activeStep.value += 1
    updateHash(activeStep.value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function openPipelinePage(stage) {
  emit('open-pipeline', {
    jobId: props.jobId,
    stage: stage.title,
  })
}

onMounted(() => {
  syncStepFromHash()
  updateHash(activeStep.value)
  window.addEventListener('hashchange', syncStepFromHash)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncStepFromHash)
})

const timeline = [
  { date: 'May 20, 09:14', title: 'CV Uploaded', tone: 'green' },
  { date: 'May 20, 09:15', title: 'AI Match Score: 89%', tone: 'green' },
  { date: 'May 20, 09:16', title: 'Moved to Qualified', tone: 'violet' },
  { date: 'May 21, 14:30', title: 'Moved to Shortlisted', tone: 'slate' },
]

const copilotItems = [
  { text: 'Interview stage missing exit criteria', tone: 'red' },
  { text: 'Reference check recommended', tone: 'violet' },
  { text: 'Offer stage missing approval gate', tone: 'red' },
  { text: 'Pipeline can be reduced by 3 days', tone: 'green' },
]

const copilotHealth = [
  { label: 'Total Stages', value: '7' },
  { label: 'Automation Coverage', value: '82%', progress: 82 },
  { label: 'Approval Gates', value: '3' },
  { label: 'Average Stage Duration', value: '3.4 Days', accent: true },
  { label: 'Expected Time to Hire', value: '24 Days', accent: true },
]
</script>

<template>
  <main class="pipeline-page">
    <section class="job-frame panel">
      <div class="job-frame__info">
        <div class="job-frame__title">
          <h1>Senior Accountant</h1>
          <span class="draft-badge">Draft</span>
        </div>

        <div class="job-frame__meta">
          <span>Finance</span>
          <span>Stockholm, Sweden</span>
          <span>Hybrid</span>
          <span>Full-time</span>
          <span>ID: AC-1187</span>
        </div>
      </div>

      <div class="job-frame__actions">
        <button class="ghost-button" type="button">
          Preview Career Page
          <AppIcon name="external-link" :size="15" />
        </button>
        <button class="ghost-button" type="button">Save draft</button>
        <button class="primary-button" type="button" @click="goToNextStep">
          Continue to {{ Math.min(activeStep + 1, 8) }}. {{ steps[Math.min(activeStep, 7)].label }}
          <AppIcon name="chevronRight" :size="16" />
        </button>
      </div>
    </section>

    <section class="stepper panel">
      <button
        v-for="step in steps"
        :key="step.id"
        class="stepper__item"
        :class="{ 'is-active': step.active }"
        type="button"
        @click="goToStep(step.id)"
      >
        <span>{{ step.id }}</span>
        <strong>{{ step.label }}</strong>
      </button>
    </section>

    <StepDefineGoal v-if="activeStep === 1" />

    <StepHiringBlueprint v-else-if="activeStep === 2" />

    <StepCandidatePersona v-else-if="activeStep === 3" />

    <StepApplicationSetup v-else-if="activeStep === 4" />

    <StepAIScreening v-else-if="activeStep === 5" />

    <div v-else-if="activeStep === 6" class="page-layout">
      <div class="page-main">
        <section class="hero-copy">
          <p>Step 6 of 8</p>
          <h2>
            Pipeline Intelligence &amp; Automation
            <AppIcon name="sparkles" :size="18" />
          </h2>
          <span>
            Define how candidates move through your hiring process, who approves decisions,
            and how AI assists progression.
          </span>
        </section>

        <section class="panel movement-panel">
          <div class="movement-panel__label">
            <strong>Movement Mode</strong>
            <AppIcon name="info" :size="14" />
          </div>

          <div class="movement-grid">
            <article
              v-for="mode in movementModes"
              :key="mode.id"
              class="mode-card"
              :class="{ 'is-active': mode.active }"
            >
              <span class="mode-radio" />
              <div>
                <h3>{{ mode.title }}</h3>
                <p>{{ mode.note }}</p>
              </div>
            </article>
          </div>
        </section>

        <section class="panel feature-panel">
          <div class="section-heading">
            <div class="section-heading__index">1</div>
            <h3>AI Candidate Routing</h3>
          </div>

          <div class="routing-layout">
            <div class="routing-flow">
              <div class="routing-steps">
                <template v-for="(step, index) in routingSteps" :key="step.label">
                  <div class="routing-step" :class="step.accent ? `is-${step.accent}` : ''">
                    <div class="routing-step__icon">
                      <AppIcon :name="step.icon" :size="18" />
                    </div>
                    <span>{{ step.label }}</span>
                  </div>
                  <div v-if="index < routingSteps.length - 1" class="routing-arrow">
                    <AppIcon name="chevronRight" :size="16" />
                  </div>
                </template>
              </div>
            </div>

            <aside class="approval-card">
              <div class="approval-card__head">
                <div class="candidate-mini-avatar">AS</div>
                <div>
                  <strong>Anna Svensson</strong>
                  <span>anna.svensson@gmail.com</span>
                </div>
              </div>

              <dl class="score-list">
                <div>
                  <dt>Match Score</dt>
                  <dd>89%</dd>
                </div>
                <div>
                  <dt>Recommended Stage</dt>
                  <dd class="pill pill-blue">Qualified</dd>
                </div>
                <div>
                  <dt>Confidence</dt>
                  <dd class="pill pill-green">High</dd>
                </div>
              </dl>

              <button class="approve-button" type="button">Approve Move</button>

              <div class="approval-card__actions">
                <button class="ghost-button ghost-button--small" type="button">Override</button>
                <button class="ghost-button ghost-button--small" type="button">View AI Reasoning</button>
              </div>
            </aside>
          </div>
        </section>

        <section class="panel feature-panel">
          <div class="section-heading section-heading--spread">
            <div class="section-heading__wrap">
              <div class="section-heading__index">2</div>
              <h3>Pipeline Builder</h3>
              <span>Drag to reorder stages. Click a stage to configure rules, approvals and automation.</span>
            </div>
            <button class="soft-button" type="button">
              <AppIcon name="plus" :size="14" />
              Add Stage
            </button>
          </div>

          <div class="stages-grid">
            <article
              v-for="stage in pipelineStages"
              :key="stage.id"
              class="stage-card"
              :class="{ 'is-active': stage.active }"
              @click="openPipelinePage(stage)"
            >
              <div class="stage-card__count">{{ stage.id }}</div>
              <div class="stage-card__icon" :class="`tone-${stage.tone}`">
                <AppIcon :name="stage.icon" :size="18" />
              </div>
              <h4>{{ stage.title }}</h4>
              <dl>
                <div><dt>Owner</dt><dd>{{ stage.owner }}</dd></div>
                <div><dt>SLA</dt><dd>{{ stage.sla }}</dd></div>
                <div><dt>Kit</dt><dd>{{ stage.kit }}</dd></div>
              </dl>
              <div class="stage-tag">{{ stage.automation }}</div>
            </article>
          </div>
        </section>

        <div class="triple-grid">
          <section class="panel small-panel">
            <div class="section-heading">
              <div class="section-heading__index">3</div>
              <h3>Movement Logic</h3>
            </div>
            <p class="small-panel__copy">Define the conditions for moving candidates between stages.</p>

            <div class="rule-box rule-box--primary">
              <div class="rule-box__head">
                <strong>Qualified -&gt; Shortlisted</strong>
                <button type="button">EDIT</button>
              </div>
              <ul>
                <li v-for="rule in movementRules" :key="rule">
                  <AppIcon name="checkCircle" :size="14" />
                  <span>{{ rule }}</span>
                </li>
              </ul>
            </div>

            <div class="rule-box rule-box--compact">
              <div class="rule-box__head">
                <strong>Interview -&gt; Validation</strong>
                <button type="button">EDIT</button>
              </div>
            </div>

            <button class="gradient-button" type="button">
              <AppIcon name="spark" :size="15" />
              Generate Rules with AI
            </button>
          </section>

          <section class="panel small-panel">
            <div class="section-heading">
              <div class="section-heading__index">4</div>
              <h3>Approval Gates</h3>
            </div>
            <p class="small-panel__copy">Set who needs to approve candidate movement.</p>

            <div class="approval-list">
              <article v-for="item in approvalSteps" :key="item.title" class="approval-row">
                <div class="approval-row__title">
                  <div class="approval-row__icon" :class="`tone-${item.tone}`">
                    <AppIcon :name="item.icon" :size="14" />
                  </div>
                  <strong>{{ item.title }}</strong>
                </div>
                <div class="approval-row__meta">
                  <span class="pill" :class="`pill-${item.tone}`">{{ item.state }}</span>
                  <span v-if="item.note" class="approval-row__note">{{ item.note }}</span>
                  <button class="approval-row__more" type="button">
                    <AppIcon name="more" :size="14" />
                  </button>
                </div>
              </article>
            </div>

            <button class="outline-button" type="button">+ Add Approval Step</button>
          </section>

          <section class="panel small-panel">
            <div class="section-heading">
              <div class="section-heading__index">5</div>
              <h3>Automation Playground</h3>
            </div>
            <p class="small-panel__copy">Build automations that trigger actions in your pipeline.</p>

            <div class="tab-row">
              <button class="tab-row__item is-active" type="button">Templates</button>
              <button class="tab-row__item" type="button">Custom Workflow</button>
            </div>

            <div
              v-for="flow in automationFlows"
              :key="flow.id"
              class="automation-card"
              :class="{ 'automation-card--muted': !flow.active }"
            >
              <div class="automation-row-head">
                <div class="automation-pagination">
                  <button
                    class="automation-page-button"
                    type="button"
                    :disabled="(automationPages[flow.id] ?? 0) === 0"
                    @click="shiftAutomationPage(flow.id, -1, getAutomationPageCount(flow) - 1)"
                  >
                    <AppIcon name="chevronLeft" :size="14" />
                  </button>
                  <span>{{ (automationPages[flow.id] ?? 0) + 1 }}/{{ getAutomationPageCount(flow) }}</span>
                  <button
                    class="automation-page-button"
                    type="button"
                    :disabled="(automationPages[flow.id] ?? 0) >= getAutomationPageCount(flow) - 1"
                    @click="shiftAutomationPage(flow.id, 1, getAutomationPageCount(flow) - 1)"
                  >
                    <AppIcon name="chevronRight" :size="14" />
                  </button>
                </div>
                <button class="toggle" :class="{ on: flow.active }" type="button" aria-label="Toggle automation" />
              </div>

              <div class="automation-icons" :class="{ 'automation-icons--faded': !flow.active }">
                <template v-for="(item, index) in getVisibleAutomationSteps(flow)" :key="`${flow.id}-${item}`">
                  <div class="automation-icon">
                    <div class="automation-icon__shape">
                      <AppIcon
                        :name="index === getVisibleAutomationSteps(flow).length - 1 ? 'check' : 'document'"
                        :size="13"
                      />
                    </div>
                    <span>{{ item }}</span>
                  </div>
                  <span v-if="index < getVisibleAutomationSteps(flow).length - 1" class="automation-arrow">
                    <AppIcon name="chevronRight" :size="12" />
                  </span>
                </template>
              </div>
            </div>

            <button class="outline-button" type="button">+ Create Automation</button>
          </section>
        </div>

        <section class="optimizer-bar panel">
          <div class="optimizer-bar__title">
            <div class="optimizer-dot" />
            <div>
              <strong>AI Pipeline Optimizer</strong>
              <span>Let AI analyze your pipeline and suggest improvements.</span>
            </div>
          </div>

          <div class="optimizer-metrics">
            <div>
              <strong>24 Days</strong>
              <span>Current Time to Hire</span>
            </div>
            <div>
              <strong>21 Days</strong>
              <span>Optimized Time to Hire</span>
            </div>
            <div>
              <strong>-12.5%</strong>
              <span>Faster</span>
            </div>
          </div>

          <button class="ghost-button" type="button">
            <AppIcon name="spark" :size="15" />
            Optimize Pipeline with AI
          </button>
        </section>
      </div>

      <aside class="page-side">
        <section class="panel side-card">
          <div class="side-card__head">
            <div>
              <h3>Pipeline Preview</h3>
              <span>This is an example of how candidates will move.</span>
            </div>
            <span class="live-badge">Live</span>
          </div>

          <div class="preview-candidate">
            <div class="preview-candidate__avatar">AS</div>
            <div class="preview-candidate__copy">
              <strong>Anna Svensson</strong>
              <span>Senior Accountant</span>
            </div>
            <div class="score-ring">89%</div>
          </div>

          <div class="side-block">
            <small>Current Stage</small>
            <strong>Qualified</strong>
          </div>

          <div class="side-block">
            <small>Next Possible Move</small>
            <strong>Shortlisted</strong>
            <span>Requires recruiter approval</span>
          </div>

          <div class="timeline-head">
            <h4>Journey Timeline</h4>
            <button type="button">View Full Timeline</button>
          </div>

          <div class="timeline-list">
            <article v-for="item in timeline" :key="item.title" class="timeline-row">
              <span class="timeline-dot" :class="`tone-${item.tone}`" />
              <div>
                <small>{{ item.date }}</small>
                <strong>{{ item.title }}</strong>
              </div>
            </article>
          </div>
        </section>

        <section class="panel side-card">
          <div class="side-card__head">
            <div>
              <h3>AI Pipeline Copilot</h3>
              <span>Your pipeline readiness score.</span>
            </div>
            <AppIcon name="spark" :size="18" />
          </div>

          <div class="copilot-score">
            <div class="copilot-ring">95%</div>
            <div class="copilot-score__copy">
              <strong>Excellent</strong>
              <span>Optimized for speed and accuracy.</span>
            </div>
          </div>

          <ul class="copilot-list">
            <li v-for="item in copilotItems" :key="item.text">
              <span class="copilot-list__icon" :class="`tone-${item.tone}`">
                <AppIcon name="alert" :size="12" />
              </span>
              <span>{{ item.text }}</span>
            </li>
          </ul>

          <div class="copilot-actions">
            <button class="primary-button primary-button--small" type="button">Apply Suggestions</button>
            <button class="ghost-button ghost-button--small" type="button">View Details</button>
          </div>

          <div class="copilot-health">
            <h4>Pipeline Health</h4>
            <div class="health-grid">
              <div v-for="item in copilotHealth" :key="item.label" class="health-grid__row">
                <div class="health-grid__top">
                  <span>{{ item.label }}</span>
                  <strong :class="{ 'is-accent': item.accent }">{{ item.value }}</strong>
                </div>
                <div v-if="item.progress" class="health-progress">
                  <span class="health-progress__bar" :style="{ width: `${item.progress}%` }" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <section v-else-if="activeStep === 7" class="interview-step">
      <div class="interview-main">
        <section class="hero-copy">
          <p>Step 7 of 8</p>
          <h2>
            Interview Kit
            <span class="hero-ai-badge">AI</span>
          </h2>
          <span>Design the interview process and tools interviewers will use to evaluate candidates.</span>
        </section>

        <section class="panel interview-banner">
          <div class="interview-banner__copy">
            <strong>Interview kits were generated from your previous setup.</strong>
            <span>You can customize them now or continue and manage interview kits later from candidate profiles and interview management.</span>
          </div>
          <div class="interview-banner__actions">
            <button class="primary-button primary-button--small" type="button">Customize Now</button>
            <button class="ghost-button ghost-button--small" type="button">Skip for Now</button>
          </div>
        </section>

        <section class="panel interview-block">
          <div class="section-heading section-heading--spread">
            <div class="section-heading__wrap">
              <div class="section-heading__index">1</div>
              <h3>Interview Plan</h3>
              <span>The sequence of interviews candidates will go through.</span>
            </div>
            <button class="ghost-button ghost-button--small" type="button">Reorder Stages</button>
          </div>

          <div class="interview-plan-grid">
            <article v-for="stage in interviewPlanStages" :key="stage.id" class="interview-stage-card">
              <div class="interview-stage-card__count">{{ stage.id }}</div>
              <div class="interview-stage-card__icon" :class="`tone-${stage.tone}`">
                <AppIcon name="user" :size="15" />
              </div>
              <strong>{{ stage.title }}</strong>
              <small>{{ stage.duration }}</small>
              <div class="interview-stage-meta">
                <span>PURPOSE</span>
                <p>{{ stage.purpose }}</p>
              </div>
              <div class="interview-stage-meta">
                <span>FOCUS</span>
                <p>{{ stage.focus }}</p>
              </div>
              <div class="interview-stage-owner">{{ stage.owner }}</div>
            </article>

            <button class="interview-add-stage" type="button">
              <AppIcon name="plus" :size="18" />
              <span>Add Stage</span>
            </button>
          </div>
        </section>

        <section class="panel interview-block">
          <div class="section-heading">
            <div class="section-heading__index">2</div>
            <h3>Interview Kits</h3>
          </div>
          <p class="small-panel__copy">AI-generated question sets and evaluation tools for each stage.</p>

          <div class="interview-kits-grid">
            <article
              v-for="kit in interviewKits"
              :key="kit.title"
              class="interview-kit-card"
              :class="{ 'is-featured': kit.featured }"
            >
              <div class="interview-kit-card__head">
                <div class="interview-kit-card__icon" :class="`tone-${kit.tone}`">
                  <AppIcon name="user" :size="15" />
                </div>
                <div>
                  <strong>{{ kit.title }}</strong>
                  <span>{{ kit.questions }} Questions</span>
                </div>
              </div>

              <div class="interview-kit-list">
                <span>FOCUS AREAS</span>
                <ul>
                  <li v-for="area in kit.areas" :key="area">{{ area }}</li>
                </ul>
              </div>

              <div class="interview-kit-list interview-kit-list--includes">
                <span>INCLUDES</span>
                <div class="interview-kit-includes">
                  <small v-for="item in kit.includes" :key="item">{{ item }}</small>
                </div>
              </div>

              <div class="interview-kit-actions">
                <button class="ghost-button ghost-button--small" type="button">Preview</button>
                <button class="ghost-button ghost-button--small" type="button">Edit</button>
                <button class="ghost-button ghost-button--small" type="button">...</button>
              </div>
            </article>
          </div>

          <div class="interview-tip">
            <span>AI Tip: These questions are tailored to the must-have competencies and success profile for this role.</span>
            <button class="ghost-button ghost-button--small" type="button">Customize Questions with AI</button>
          </div>
        </section>

        <div class="interview-bottom-grid">
          <section class="panel interview-block">
            <div class="section-heading">
              <div class="section-heading__index">3</div>
              <h3>Evaluation Areas</h3>
            </div>
            <p class="small-panel__copy">Key competencies will be evaluated across the interview process.</p>

            <div class="evaluation-grid">
              <article v-for="area in evaluationAreas" :key="area.title" class="evaluation-card">
                <div class="evaluation-card__icon" :class="`tone-${area.tone}`">
                  <AppIcon name="document" :size="14" />
                </div>
                <div>
                  <strong>{{ area.title }}</strong>
                  <span>{{ area.questions }} Questions</span>
                </div>
              </article>
            </div>

            <button class="ghost-button ghost-button--small interview-full-button" type="button">View All Competencies</button>
          </section>

          <section class="panel interview-block">
            <div class="section-heading">
              <div class="section-heading__index">4</div>
              <h3>AI Focus Areas for This Role</h3>
            </div>
            <p class="small-panel__copy">Based on role complexity and success profile.</p>

            <ul class="focus-list">
              <li v-for="item in interviewFocusAreas" :key="item">
                <span class="focus-list__dot" />
                <span>{{ item }}</span>
              </li>
            </ul>

            <button class="gradient-button" type="button">Regenerate Focus Areas</button>
          </section>
        </div>
      </div>

      <aside class="interview-side">
        <section class="panel side-card">
          <div class="section-heading">
            <div class="section-heading__index">5</div>
            <h3>Live Interview Preview</h3>
          </div>
          <p class="small-panel__copy">See how an interviewer will experience this kit.</p>

          <div class="interview-preview-tabs">
            <button class="tab-row__item is-active" type="button">Questions</button>
            <button class="tab-row__item" type="button">Scorecard</button>
            <button class="tab-row__item" type="button">Notes</button>
            <button class="tab-row__item" type="button">AI Assist</button>
          </div>

          <div class="interview-preview-card">
            <div class="interview-preview-card__top">
              <div>
                <strong>Hiring Manager Kit</strong>
                <span>Q1 of 12</span>
              </div>
            </div>

            <small>QUESTION</small>
            <h4>{{ interviewPreviewQuestion.title }}</h4>

            <small>WHAT WE'RE LOOKING FOR</small>
            <p>{{ interviewPreviewQuestion.lookingFor }}</p>

            <small>FOLLOW-UP PROMPTS</small>
            <ul>
              <li v-for="item in interviewPreviewQuestion.prompts" :key="item">{{ item }}</li>
            </ul>

            <div class="interview-preview-score">
              <span>SCORE</span>
              <div>☆ ☆ ☆ ☆ ☆</div>
            </div>
          </div>
        </section>

        <section class="panel side-card">
          <div class="section-heading">
            <div class="section-heading__index">6</div>
            <h3>Candidate Experience</h3>
          </div>
          <p class="small-panel__copy">Preview the candidate's interview journey.</p>

          <div class="candidate-experience-list">
            <div><span>Interview Stages</span><strong>4</strong></div>
            <div><span>Estimated Duration</span><strong>~ 12 Days</strong></div>
            <div><span>Total Interview Time</span><strong>~ 2h 45m</strong></div>
          </div>

          <div class="candidate-experience-score">
            <span>Candidate Experience Score</span>
            <strong>8.9 / 10</strong>
            <small>Great</small>
          </div>

          <button class="ghost-button ghost-button--small interview-full-button" type="button">Preview Candidate Journey</button>
        </section>
      </aside>
    </section>

    <section v-else-if="activeStep === 8" class="launch-step">
      <div class="launch-main">
        <section class="hero-copy">
          <p>Step 8 of 8</p>
          <h2>Launch &amp; Hiring Readiness <span class="hero-ai-badge">AI</span></h2>
          <span>Final review and configuration before going live. NitroSync validates your setup for a successful launch.</span>
        </section>

        <section class="panel launch-readiness">
          <div class="launch-readiness__score">
            <div class="launch-readiness__ring">96%</div>
            <small>Ready to Launch</small>
            <strong>Excellent</strong>
          </div>

          <div class="launch-readiness__checks">
            <article v-for="item in launchChecks" :key="item" class="launch-check">
              <span class="launch-check__icon"><AppIcon name="check" :size="14" /></span>
              <strong>{{ item }}</strong>
              <small>Complete</small>
            </article>
          </div>
        </section>

        <div class="launch-grid-two">
          <section class="panel launch-card">
            <div class="section-heading section-heading--spread">
              <div class="section-heading__wrap">
                <div class="section-heading__index">1</div>
                <h3>Hiring Workspace Summary</h3>
              </div>
              <button class="ghost-button ghost-button--small" type="button">Edit</button>
            </div>

            <div class="launch-summary-list">
              <div v-for="[label, value] in launchSummary" :key="label" class="launch-summary-row">
                <span>{{ label }}</span>
                <strong>{{ value }}</strong>
              </div>
            </div>
          </section>

          <section class="panel launch-card">
            <div class="section-heading">
              <div class="section-heading__index">2</div>
              <h3>Launch Strategy</h3>
            </div>

            <div class="launch-strategy">
              <label class="launch-radio is-active"><span /> Publish immediately</label>
              <label class="launch-radio"><span /> Schedule publication</label>
              <label class="launch-radio"><span /> Internal hiring first</label>
              <label class="launch-radio"><span /> Save as draft</label>
            </div>

            <div class="launch-input-grid">
              <div class="launch-field">
                <small>PUBLISH DATE</small>
                <div>Jun 20, 2026</div>
              </div>
              <div class="launch-field">
                <small>PUBLISH TIME</small>
                <div>09:00</div>
              </div>
              <div class="launch-field launch-field--full">
                <small>APPLICATION DEADLINE (OPTIONAL)</small>
                <div>Jul 20, 2026</div>
              </div>
            </div>

            <label class="launch-checkbox"><span /> Close job automatically</label>
          </section>
        </div>

        <div class="launch-grid-two">
          <section class="panel launch-card">
            <div class="section-heading section-heading--spread">
              <div class="section-heading__wrap">
                <div class="section-heading__index">3</div>
                <h3>Candidate Experience Preview</h3>
              </div>
              <button class="ghost-button ghost-button--small" type="button">View full journey</button>
            </div>

            <div class="launch-experience-grid">
              <article v-for="[label, value] in candidateExperiencePreview" :key="label" class="launch-metric-card">
                <span>{{ label }}</span>
                <strong>{{ value }}</strong>
              </article>
            </div>

            <div class="launch-note success">Low drop-off risk. Your process is optimized for candidate experience.</div>
          </section>

          <section class="panel launch-card">
            <div class="section-heading">
              <div class="section-heading__index">4</div>
              <h3>Publishing Channels</h3>
            </div>
            <p class="small-panel__copy">Estimated total reach: 32K - 48K people</p>

            <div class="launch-channel-grid">
              <article v-for="channel in publishingChannels" :key="channel.name" class="launch-channel-card">
                <div class="launch-channel-icon" :style="{ background: channel.background }">
                  <img :src="channel.image" :alt="`${channel.name} icon`" loading="lazy" />
                </div>
                <strong>{{ channel.name }}</strong>
                <button class="toggle on" type="button" aria-label="Toggle channel" />
              </article>
            </div>
          </section>
        </div>

        <div class="launch-grid-two">
          <section class="panel launch-card">
            <div class="section-heading section-heading--spread">
              <div class="section-heading__wrap">
                <div class="section-heading__index">5</div>
                <h3>Approval Workflow</h3>
              </div>
              <strong class="launch-approved-count">2 / 4 Approved</strong>
            </div>

            <div class="launch-summary-list">
              <div v-for="[role, name, status] in approvalWorkflow" :key="role" class="launch-summary-row">
                <span>{{ role }}</span>
                <strong>{{ name }}</strong>
                <em :class="`status-${status.toLowerCase()}`">{{ status }}</em>
              </div>
            </div>

            <button class="gradient-button" type="button">Send Reminders</button>
          </section>

          <section class="panel launch-card">
            <div class="section-heading section-heading--spread">
              <div class="section-heading__wrap">
                <div class="section-heading__index">6</div>
                <h3>SEO &amp; Discoverability</h3>
              </div>
              <div class="launch-mini-ring">91%</div>
            </div>

            <div class="launch-seo-stack">
              <div class="launch-field launch-field--full">
                <small>SEO TITLE</small>
                <div>Senior Accountant - Hybrid - Stockholm</div>
              </div>
              <div class="launch-field launch-field--full">
                <small>META DESCRIPTION</small>
                <div>Join our finance team and play a key role in ensuring accurate financial reporting and IFRS compliance.</div>
              </div>
              <div class="launch-keywords">
                <small>KEYWORDS</small>
                <div>
                  <span v-for="keyword in seoKeywords" :key="keyword">{{ keyword }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <aside class="launch-side">
        <section class="panel side-card launch-side-card launch-side-card--pink">
          <strong>AI Hiring Workspace Ready</strong>
          <p>NitroSync AI is configured to attract, screen, evaluate and recommend candidates for this role.</p>
          <button class="ghost-button ghost-button--small" type="button">View AI Configuration</button>
        </section>

        <section class="panel side-card launch-side-card">
          <div class="section-heading">
            <div class="section-heading__index">7</div>
            <h3>AI Launch Advisor</h3>
          </div>
          <ul class="focus-list">
            <li><span class="focus-list__dot" /> Add salary range to improve application quality.</li>
            <li><span class="focus-list__dot" /> Await Finance approval to complete workflow.</li>
            <li><span class="focus-list__dot" /> Enable employee referral channel to increase reach.</li>
          </ul>
          <button class="gradient-button" type="button">Apply all recommendations</button>
        </section>

        <section class="panel side-card launch-side-card">
          <div class="section-heading">
            <div class="section-heading__index">8</div>
            <h3>AI Confidence</h3>
          </div>
          <div class="copilot-score">
            <div class="copilot-ring">96%</div>
            <div class="copilot-score__copy">
              <strong>High Confidence</strong>
              <span>Blueprint, persona, screening and communications are aligned.</span>
            </div>
          </div>
        </section>
      </aside>
    </section>

    <section class="bottom-actions panel">
      <button class="back-button" type="button" @click="goBack">
        <AppIcon name="chevronLeft" :size="14" />
        Back
      </button>

      <div class="bottom-actions__status">
        <AppIcon name="checkCircle" :size="14" />
        <span>All changes saved automatically</span>
      </div>

      <div class="bottom-actions__buttons">
        <button class="ghost-button ghost-button--small" type="button">Save draft</button>
        <button class="primary-button primary-button--small" type="button" @click="goToNextStep">
          Continue to {{ Math.min(activeStep + 1, 8) }}. {{ steps[Math.min(activeStep, 7)].label }}
          <AppIcon name="chevronRight" :size="14" />
        </button>
      </div>
    </section>
  </main>
</template>

<style>
.pipeline-page {
  padding: 22px 24px 28px;
  display: grid;
  gap: 16px;
  background:
    radial-gradient(circle at top left, rgba(245, 84, 159, 0.08), transparent 22%),
    linear-gradient(180deg, #fbfcff 0%, #f6f8fc 100%);
}

.panel {
  border: 1px solid #e8edf5;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.job-frame,
.stepper,
.bottom-actions {
  display: flex;
  align-items: center;
}

.job-frame {
  justify-content: space-between;
  gap: 24px;
  padding: 18px 20px;
}

.job-frame__info {
  min-width: 0;
  flex: 1 1 auto;
  display: grid;
  gap: 8px;
}

.job-frame__title,
.job-frame__meta,
.job-frame__actions,
.stepper__item,
.movement-panel__label,
.section-heading,
.section-heading__wrap,
.routing-steps,
.approval-card__head,
.approval-card__actions,
.stage-card,
.rule-box__head,
.approval-row,
.approval-row__title,
.tab-row,
.automation-card,
.automation-icons,
.automation-icon,
.optimizer-bar,
.optimizer-bar__title,
.optimizer-metrics,
.side-card__head,
.preview-candidate,
.timeline-head,
.timeline-row,
.copilot-score,
.copilot-actions,
.bottom-actions,
.bottom-actions__status,
.bottom-actions__buttons {
  display: flex;
  align-items: center;
}

.job-frame__title {
  gap: 14px;
  flex-wrap: wrap;
}

.job-frame__title h1,
.hero-copy h2,
.side-card__head h3 {
  margin: 0;
  color: #17213f;
}

.job-frame__title h1 {
  font-size: 22px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.draft-badge,
.live-badge,
.stage-tag,
.pill {
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.draft-badge {
  padding: 5px 10px;
  color: #ef4fa0;
  background: #fff1f7;
}

.job-frame__meta {
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 8px 22px;
  color: #97a2b8;
  font-size: 13px;
  line-height: 1.45;
}

.job-frame__meta span {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.job-frame__meta span + span::before {
  content: '•';
  position: absolute;
  left: -12px;
  color: #c4cad8;
}

.job-frame__actions {
  gap: 12px;
}

.job-frame__meta span + span::before {
  content: '•';
  position: static;
  margin-right: 10px;
  color: #c4cad8;
}

.job-frame__actions {
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.ghost-button,
.primary-button,
.soft-button,
.outline-button,
.gradient-button,
.back-button {
  height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  border: 1px solid #dfe6f1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  background: #fff;
  color: #31415f;
}

.optimizer-bar > .ghost-button {
  min-width: 210px;
  height: 42px;
  padding: 0 18px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.optimizer-bar > .ghost-button svg {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
}

.primary-button {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #f0509e 0%, #d93fbe 100%);
  box-shadow: 0 14px 24px rgba(240, 80, 158, 0.22);
}

.soft-button {
  height: 38px;
  padding-inline: 14px;
  color: #5d5ff2;
  background: #f5f3ff;
  border-color: transparent;
}

.outline-button {
  width: 100%;
  color: #5d5ff2;
  border-style: dashed;
}

.gradient-button {
  width: 100%;
  border-color: #f8c3de;
  color: #eb4899;
  background: linear-gradient(180deg, #fff7fb 0%, #fff0f8 100%);
}

.ghost-button--small,
.primary-button--small,
.back-button {
  height: 40px;
  padding-inline: 16px;
  font-size: 13px;
}

.stepper {
  padding: 14px 18px;
  justify-content: space-between;
  gap: 12px;
  overflow-x: auto;
}

.stepper__item {
  border: 0;
  background: transparent;
  flex: 1 1 0;
  justify-content: center;
  gap: 10px;
  min-width: max-content;
  color: #9da7ba;
  font-size: 13px;
  white-space: nowrap;
}

.stepper__item span {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f2f4f8;
  color: #7d889b;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.stepper__item.is-active {
  color: #212a4a;
}

.stepper__item.is-active span {
  color: #fff;
  background: linear-gradient(135deg, #f0509e 0%, #d93fbe 100%);
}

.step-overview {
  padding: 24px;
  display: grid;
  gap: 20px;
}

.hero-ai-badge {
  padding: 3px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  color: #ef4fa0;
  background: #fff0f7;
}

.interview-step {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 292px;
  gap: 18px;
}

.interview-main,
.interview-side {
  display: grid;
  gap: 18px;
}

.interview-side {
  gap: 14px;
  align-content: start;
}

.interview-side .side-card {
  padding: 14px;
}

.interview-banner,
.interview-block {
  padding: 18px;
}

.interview-banner {
  border-color: #f6d6e6;
  background: linear-gradient(180deg, #fff8fc 0%, #fff5fb 100%);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.interview-banner__copy strong,
.interview-preview-card h4,
.candidate-experience-score strong {
  display: block;
  margin-bottom: 6px;
  color: #a53b73;
}

.interview-banner__copy span {
  color: #c06c95;
  font-size: 13px;
  line-height: 1.5;
}

.interview-banner__actions {
  display: flex;
  gap: 10px;
}

.interview-plan-grid,
.interview-kits-grid,
.interview-bottom-grid {
  display: grid;
  gap: 14px;
}

.interview-plan-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.interview-stage-card,
.interview-kit-card,
.evaluation-card,
.interview-preview-card {
  border: 1px solid #e7edf6;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff 0%, #fbfcff 100%);
}

.interview-stage-card {
  position: relative;
  padding: 16px 14px;
  display: grid;
  gap: 10px;
}

.interview-stage-card__count {
  position: absolute;
  top: -8px;
  left: calc(50% - 12px);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #7f8aa0;
  background: #fff;
  border: 1px solid #e6ebf3;
}

.interview-stage-card__icon,
.interview-kit-card__icon,
.evaluation-card__icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.interview-stage-card strong,
.interview-kit-card__head strong,
.evaluation-card strong,
.interview-preview-card strong,
.candidate-experience-list strong {
  color: #1f2a44;
}

.interview-stage-card small,
.interview-kit-card__head span,
.evaluation-card span,
.candidate-experience-list span {
  color: #8a96ad;
}

.interview-stage-meta span,
.interview-kit-list span,
.interview-preview-card small {
  font-size: 9px;
  font-weight: 800;
  color: #9aa6bb;
}

.interview-stage-meta p,
.interview-preview-card p {
  margin: 4px 0 0;
  font-size: 11px;
  line-height: 1.5;
  color: #5d6c87;
}

.interview-stage-owner {
  margin-top: auto;
  font-size: 11px;
  color: #45536e;
}

.interview-add-stage {
  border: 1px dashed #dbe4f0;
  border-radius: 16px;
  background: #fff;
  color: #91a0b7;
  display: grid;
  place-items: center;
  gap: 8px;
}

.interview-kits-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;
}

.interview-kit-card {
  padding: 16px 16px 14px;
  display: grid;
  gap: 14px;
}

.interview-kit-card.is-featured {
  border-color: #f38dbf;
  box-shadow: inset 0 0 0 1px rgba(243, 141, 191, 0.2);
}

.interview-kit-card__head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.interview-kit-card__head > div:last-child {
  min-width: 0;
}

.interview-kit-card__head strong {
  display: block;
  margin-bottom: 2px;
  font-size: 13px;
  line-height: 1.3;
}

.interview-kit-card__head span {
  display: block;
  font-size: 11px;
  line-height: 1.25;
  color: #8a96ad;
}

.interview-kit-list {
  display: grid;
  gap: 8px;
}

.interview-kit-list ul,
.focus-list,
.interview-preview-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 7px;
}

.interview-kit-list li,
.focus-list li,
.interview-preview-card li {
  position: relative;
  padding-left: 14px;
  font-size: 11px;
  color: #50607b;
  line-height: 1.45;
}

.interview-kit-list li::before,
.interview-preview-card li::before {
  content: '';
  position: absolute;
  top: 6px;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

.interview-kit-includes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  margin-top: 0;
}

.interview-kit-includes small {
  color: #4e5ee9;
  font-size: 10px;
  font-weight: 700;
}

.interview-kit-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: auto;
  padding-top: 4px;
}

.interview-tip {
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff6fb;
  border: 1px solid #f7d7e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #c05c8f;
  font-size: 12px;
}

.interview-tip span {
  line-height: 1.5;
}

.interview-bottom-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.evaluation-grid {
  display: grid;
  gap: 10px;
}

.evaluation-card {
  padding: 14px 16px;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff 0%, #fcfdff 100%);
  display: flex;
  align-items: center;
  gap: 12px;
}

.evaluation-card > div:last-child {
  min-width: 0;
}

.evaluation-card strong {
  display: block;
  margin-bottom: 2px;
  font-size: 13px;
  line-height: 1.25;
}

.evaluation-card span {
  display: block;
  font-size: 10px;
  color: #93a0b5;
  line-height: 1.25;
}

.interview-full-button {
  width: 100%;
  margin-top: 14px;
}

.focus-list__dot {
  position: absolute;
  top: 6px;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
}

.focus-list {
  gap: 10px;
}

.focus-list li {
  padding-left: 18px;
  font-size: 12px;
  color: #495873;
  line-height: 1.5;
}

.focus-list + .gradient-button {
  margin-top: 12px;
}

.interview-preview-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  border-bottom: 1px solid #edf2f8;
  overflow-x: auto;
  scrollbar-width: none;
}

.interview-preview-tabs::-webkit-scrollbar {
  display: none;
}

.interview-preview-tabs .tab-row__item {
  flex: 0 0 auto;
  height: 28px;
  font-size: 10px;
}

.interview-preview-card {
  padding: 12px;
  border-radius: 16px;
  display: grid;
  gap: 8px;
}

.interview-preview-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.interview-preview-card__top strong {
  display: block;
  margin-bottom: 3px;
  font-size: 12px;
  line-height: 1.25;
}

.interview-preview-card__top span {
  display: block;
  font-size: 10px;
  color: #96a2b6;
}

.interview-preview-card h4 {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: #b3437e;
}

.interview-preview-card small {
  display: block;
  margin: 0;
  font-size: 9px;
  font-weight: 800;
  color: #9eabc0;
}

.interview-preview-card p {
  margin: 0;
  font-size: 10px;
  line-height: 1.5;
  color: #5f6d87;
}

.interview-preview-card ul {
  margin-top: 0;
  gap: 6px;
}

.interview-preview-score {
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid #edf2f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #8e9ab0;
  font-size: 10px;
}

.interview-preview-score div {
  letter-spacing: 0.08em;
  color: #b7c0d1;
}

.launch-step {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 18px;
}

.launch-main,
.launch-side {
  display: grid;
  gap: 18px;
}

.launch-readiness,
.launch-card,
.launch-side-card {
  padding: 18px;
}

.launch-readiness {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  gap: 18px;
}

.launch-readiness__score {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 6px;
}

.launch-readiness__ring,
.launch-mini-ring {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 18px;
  font-weight: 800;
  color: #1f2a44;
  background:
    radial-gradient(circle, #fff 58%, transparent 59%),
    conic-gradient(#ef4fa0 0deg 310deg, #fce3ef 310deg 360deg);
}

.launch-readiness__score small,
.launch-readiness__score strong {
  text-align: center;
}

.launch-readiness__score small {
  color: #a2aec1;
  font-size: 10px;
  text-transform: uppercase;
}

.launch-readiness__score strong {
  color: #ef4fa0;
  font-size: 11px;
}

.launch-readiness__checks {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.launch-check {
  display: grid;
  justify-items: center;
  gap: 6px;
  text-align: center;
}

.launch-check__icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #eafbf0;
}

.launch-check strong {
  font-size: 11px;
  color: #1f2a44;
}

.launch-check small {
  color: #8a96ad;
  font-size: 10px;
}

.launch-grid-two {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.launch-summary-list,
.launch-strategy,
.launch-seo-stack {
  display: grid;
  gap: 12px;
}

.launch-summary-row {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.launch-summary-row span {
  color: #98a3b6;
  font-size: 12px;
}

.launch-summary-row strong {
  color: #1f2a44;
  font-size: 12px;
  justify-self: end;
}

.launch-summary-row em {
  font-style: normal;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
}

.status-approved {
  color: #16a34a;
  background: #eafbf0;
}

.status-pending {
  color: #ea7a13;
  background: #fff1e4;
}

.launch-approved-count {
  font-size: 12px;
  color: #16a34a;
}

.launch-summary-list + .gradient-button {
  margin-top: 14px;
}

.launch-radio,
.launch-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #47566f;
}

.launch-radio span,
.launch-checkbox span {
  width: 16px;
  height: 16px;
  border: 1.5px solid #cad4e2;
  border-radius: 50%;
  flex: 0 0 16px;
}

.launch-radio.is-active span,
.launch-checkbox span {
  box-shadow: inset 0 0 0 4px #ef4fa0;
  border-color: #ef4fa0;
}

.launch-input-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.launch-field {
  display: grid;
  gap: 6px;
}

.launch-field--full {
  grid-column: 1 / -1;
}

.launch-field small,
.launch-keywords small {
  font-size: 9px;
  font-weight: 800;
  color: #9aa6bb;
}

.launch-field div {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e7edf6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #24324e;
  background: #fff;
}

.launch-experience-grid,
.launch-channel-grid {
  display: grid;
  gap: 12px;
}

.launch-experience-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.launch-metric-card,
.launch-channel-card {
  padding: 14px;
  border: 1px solid #e7edf6;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff 0%, #fbfcff 100%);
}

.launch-metric-card span {
  display: block;
  margin-bottom: 6px;
  color: #93a0b5;
  font-size: 11px;
}

.launch-metric-card strong {
  color: #1f2a44;
  font-size: 16px;
}

.launch-note {
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 12px;
}

.launch-note.success {
  color: #157c4f;
  background: #eafbf0;
}

.launch-channel-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.launch-channel-card {
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
}

.launch-channel-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #4f6ef6;
  background: #edf2ff;
}

.launch-channel-icon img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
}

.launch-channel-card strong {
  font-size: 11px;
  color: #1f2a44;
}

.launch-side-card {
  display: grid;
  gap: 10px;
  padding: 14px;
}

.launch-side-card--pink {
  border-color: #f8dbe9;
  background: linear-gradient(180deg, #fff8fc 0%, #fff4fa 100%);
}

.launch-side-card--pink strong {
  color: #a53b73;
}

.launch-side-card--pink p {
  margin: 0;
  color: #c06c95;
  font-size: 12px;
  line-height: 1.5;
}

.launch-side {
  align-content: start;
  gap: 14px;
}

.launch-side .side-card .section-heading {
  margin-bottom: 4px;
}

.launch-side .side-card .small-panel__copy,
.launch-side-card p {
  margin: 0;
}

.launch-side .ghost-button,
.launch-side .gradient-button {
  margin-top: 2px;
}

.launch-keywords div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.launch-keywords span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #f6f8fc;
  color: #45536e;
  font-size: 10px;
  font-weight: 700;
}

.candidate-experience-list {
  display: grid;
  gap: 8px;
}

.candidate-experience-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.candidate-experience-score {
  margin: 12px 0 12px;
  padding: 10px;
  border-radius: 14px;
  background: #f8fbff;
  display: grid;
  gap: 3px;
}

.candidate-experience-score span {
  font-size: 11px;
  color: #7f8da4;
}

.candidate-experience-score small {
  width: fit-content;
  padding: 3px 8px;
  border-radius: 999px;
  color: #16a34a;
  background: #eafbf0;
  font-size: 10px;
  font-weight: 700;
}

.step-overview__hero {
  display: grid;
  gap: 6px;
}

.step-overview__hero p {
  margin: 0;
  color: #97a2b8;
  font-weight: 600;
}

.step-overview__hero h2 {
  margin: 0;
  font-size: 28px;
  color: #17213f;
}

.step-overview__hero span {
  color: #74839e;
  font-size: 15px;
  line-height: 1.55;
}

.step-overview__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.step-overview__card {
  padding: 18px;
  border: 1px solid #e7edf6;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff 0%, #fbfcff 100%);
}

.step-overview__card strong {
  display: block;
  margin-bottom: 10px;
  color: #1f2a44;
  font-size: 16px;
}

.step-overview__card p {
  margin: 0;
  color: #70809b;
  font-size: 14px;
  line-height: 1.6;
}

.step-overview__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.step-overview__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #16a34a;
  font-size: 13px;
  font-weight: 600;
}

.page-layout {
  display: grid;
  gap: 40px;
  grid-template-columns: minmax(0, 1fr) 304px;
  align-items: start;
}

.page-main,
.page-side {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.hero-copy {
  padding: 14px 6px 0;
  display: grid;
  gap: 6px;
  min-width: 0;
}

.hero-copy p,
.hero-copy span,
.small-panel__copy,
.side-card__head span,
.preview-candidate__copy span,
.side-block span,
.copilot-score span,
.optimizer-bar__title span,
.optimizer-metrics span {
  color: #8a96ad;
}

.hero-copy span {
  display: block;
  max-width: 100%;
}

.hero-copy p {
  margin: 0;
  color: #97a2b8;
  font-weight: 600;
}

.hero-copy h2 {
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.movement-panel,
.feature-panel,
.small-panel,
.side-card {
  padding: 18px;
}

.movement-panel {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 14px;
  min-width: 0;
}

.movement-panel__label {
  gap: 8px;
  color: #24324e;
}

.movement-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  min-width: 0;
}

.mode-card {
  min-height: 72px;
  padding: 16px;
  border: 1px solid #e5eaf3;
  border-radius: 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.mode-card.is-active {
  border-color: #ef4fa0;
  box-shadow: inset 0 0 0 1px rgba(239, 79, 160, 0.14);
}

.mode-radio {
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  margin-top: 3px;
  border: 1.5px solid #cbd4e2;
  border-radius: 50%;
  background: #fff;
}

.mode-card.is-active .mode-radio {
  border-color: #ef4fa0;
  box-shadow: inset 0 0 0 4px #ef4fa0;
}

.mode-card h3,
.section-heading h3,
.timeline-head h4,
.copilot-score strong {
  margin: 0;
  color: #1e2a44;
}

.mode-card h3 {
  font-size: 15px;
}

.mode-card p,
.section-heading__wrap span,
.approval-card__head span,
.score-list dt,
.stage-card dl dt,
.automation-icon span,
.timeline-row small,
.health-grid span {
  margin: 0;
  color: #8a96ad;
  font-size: 12px;
}

.mode-card p {
  font-size: 11px;
  line-height: 1.45;
}

.section-heading {
  gap: 12px;
  margin-bottom: 18px;
}

.section-heading--spread {
  justify-content: space-between;
}

.section-heading__wrap {
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;
}

.section-heading__index {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #6652f4;
  background: #f3eeff;
}

.routing-layout {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1fr) 294px;
  min-width: 0;
}

.routing-flow {
  min-height: 300px;
  border: 1px solid #edf1f7;
  border-radius: 22px;
  padding: 28px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 20% 20%, rgba(82, 115, 255, 0.06), transparent 25%),
    linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.routing-steps {
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.routing-step {
  width: 96px;
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;
}

.routing-step__icon {
  width: 42px;
  height: 42px;
  border: 1px solid #e8edf5;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8b96ac;
  background: #f8fafc;
}

.routing-step.is-violet .routing-step__icon {
  color: #8b5cf6;
  background: #f5edff;
}

.routing-step.is-green .routing-step__icon {
  color: #16a34a;
  background: #eafbf0;
}

.routing-step span {
  font-size: 12px;
  color: #61708b;
}

.routing-arrow {
  color: #c7cfdd;
}

.approval-card {
  padding: 14px;
  border: 1px solid #dde5f0;
  border-radius: 18px;
  align-self: center;
  background: #f9fbff;
  min-width: 0;
}

.candidate-mini-avatar,
.preview-candidate__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #4461f2;
  background: #e8efff;
}

.approval-card__head {
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.approval-card__head > div:last-child {
  min-width: 0;
}

.approval-card__head strong {
  display: block;
  font-size: 12px;
  line-height: 1.25;
  color: #1f2a44;
}

.approval-card__head span {
  display: block;
  margin-top: 2px;
  font-size: 10px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.score-list {
  margin: 0 0 10px;
  display: grid;
  gap: 8px;
}

.score-list div,
.stage-card dl div,
.health-grid div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.score-list dd,
.stage-card dl dd,
.health-grid strong {
  margin: 0;
  color: #24324e;
  font-weight: 700;
}

.score-list dt,
.score-list dd {
  font-size: 11px;
}

.pill {
  padding: 4px 9px;
}

.pill-blue {
  color: #4f6ef6;
  background: #edf2ff;
}

.pill-green {
  color: #16a34a;
  background: #eafbf0;
}

.pill-orange {
  color: #ea7a13;
  background: #fff1e4;
}

.approve-button {
  width: 100%;
  height: 36px;
  border: 0;
  border-radius: 12px;
  font-weight: 700;
  font-size: 12px;
  color: #fff;
  background: linear-gradient(135deg, #574bff 0%, #4b3fe7 100%);
}

.approval-card__actions {
  gap: 8px;
  margin-top: 8px;
}

.approval-card__actions .ghost-button {
  flex: 1;
  min-width: 0;
  height: 34px;
  padding-inline: 10px;
  font-size: 11px;
  text-align: center;
}

.stages-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
}

.stage-card {
  position: relative;
  padding: 18px 16px 16px;
  border: 1px solid #e9edf4;
  border-radius: 18px;
  display: grid;
  gap: 14px;
  align-items: start;
  cursor: pointer;
  min-width: 0;
  min-height: 244px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.stage-card.is-active {
  border-color: #c9d6ff;
  background: linear-gradient(180deg, #f7f9ff 0%, #ffffff 100%);
  box-shadow: 0 10px 24px rgba(79, 110, 246, 0.08);
}

.stage-card:hover {
  transform: translateY(-2px);
  border-color: #d8e1ef;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}

.stage-card__count {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #93a1b7;
  background: #f5f7fb;
}

.stage-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tone-green {
  color: #16a34a;
  background: #eafbf0;
}

.tone-blue {
  color: #4f6ef6;
  background: #edf2ff;
}

.tone-violet {
  color: #8b5cf6;
  background: #f5edff;
}

.tone-orange {
  color: #ea7a13;
  background: #fff1e4;
}

.tone-slate {
  color: #94a3b8;
  background: #eef2f7;
}

.stage-card h4 {
  margin: 0;
  font-size: 17px;
  line-height: 1.2;
  color: #1f2a44;
}

.stage-card dl {
  margin: 0;
  display: grid;
  gap: 10px;
}

.stage-card dl dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.stage-card dl dd {
  font-size: 15px;
  line-height: 1.25;
  text-align: right;
}

.stage-tag {
  width: fit-content;
  margin-top: auto;
  padding: 6px 10px;
  color: #4b4fe1;
  background: #f2f0ff;
}

.triple-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
}

.small-panel {
  display: grid;
  align-content: start;
  min-width: 0;
  overflow: hidden;
}

.small-panel__copy {
  margin: -4px 0 18px;
  font-size: 13px;
}

.rule-box,
.approval-list,
.automation-card {
  border: 1px solid #e8edf5;
  border-radius: 16px;
  background: #fff;
}

.rule-box {
  padding: 14px;
  margin-bottom: 14px;
}

.rule-box--primary {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.rule-box--compact {
  padding: 12px 14px;
}

.rule-box__head {
  justify-content: space-between;
  margin-bottom: 12px;
}

.rule-box__head button,
.timeline-head button {
  border: 0;
  padding: 0;
  background: transparent;
  font-weight: 700;
  color: #5d5ff2;
  font-size: 11px;
}

.rule-box ul,
.copilot-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 9px;
}

.rule-box li,
.copilot-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #54627d;
  font-size: 11px;
  line-height: 1.35;
}

.copilot-list__icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 16px;
}

.approval-list {
  padding: 0;
  border: 0;
  background: transparent;
  margin-bottom: 16px;
  display: grid;
  gap: 12px;
}

.approval-row {
  justify-content: space-between;
  gap: 12px;
  padding: 12px 12px;
  border: 1px solid #e6ebf3;
  border-radius: 12px;
  background: #fff;
}

.approval-row__title {
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.approval-row__title strong {
  font-size: 12px;
  line-height: 1.25;
}

.approval-row__icon {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.approval-row__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.approval-row__note {
  font-size: 10px;
  font-weight: 700;
  color: #4f6ef6;
}

.approval-row__more {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: transparent;
}

.tab-row {
  gap: 18px;
  margin-bottom: 14px;
  border-bottom: 1px solid #edf2f8;
  min-width: 0;
  overflow-x: auto;
}

.tab-row__item {
  height: 34px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #8a96ad;
  font-weight: 600;
}

.tab-row__item.is-active {
  color: #5d5ff2;
  box-shadow: inset 0 -2px 0 #5d5ff2;
}

.automation-card {
  padding: 12px 12px;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 14px;
  align-items: stretch;
  min-height: 88px;
  min-width: 0;
  overflow: hidden;
  flex-direction: column;
}

.automation-card--muted {
  opacity: 0.7;
}

.automation-row-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.automation-icons {
  gap: 8px;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  overflow: hidden;
  align-items: center;
  min-width: 0;
  justify-content: flex-start;
}

.automation-icons--faded {
  opacity: 0.7;
}

.automation-icon {
  min-width: 0;
  width: 52px;
  max-width: 52px;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  flex: 0 0 auto;
}

.automation-icon__shape {
  width: 24px;
  height: 24px;
  border: 1px solid #e6ebf3;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8a96ad;
  background: #fbfcfe;
}

.automation-icon span {
  font-size: 9px;
  line-height: 1.25;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.automation-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #c8d0de;
  flex: 0 0 auto;
  width: 12px;
}

.automation-page-button {
  width: 28px;
  height: 28px;
  border: 1px solid #e3e9f4;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  background: #fff;
  flex: 0 0 auto;
}

.automation-page-button:disabled {
  opacity: 0.35;
  cursor: default;
}

.automation-pagination {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  margin-right: auto;
}

.automation-pagination span {
  min-width: 28px;
  text-align: center;
}

.automation-row-head .toggle {
  flex: 0 0 auto;
  margin-left: auto;
}

.toggle {
  width: 38px;
  height: 22px;
  border: 0;
  border-radius: 999px;
  position: relative;
  background: #d8deea;
}

.toggle::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s ease;
}

.toggle.on {
  background: #5a4ff5;
}

.toggle.on::after {
  transform: translateX(16px);
}

.optimizer-bar {
  padding: 16px 20px;
  justify-content: space-between;
  gap: 18px;
  border-color: #f0b6d8;
}

.optimizer-dot {
  flex: 0 0 auto;
  margin-top: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #f8c1dd, #ef4fa0);
}

.optimizer-metrics {
  gap: 22px;
}

.optimizer-metrics strong {
  display: block;
  font-size: 22px;
  line-height: 1.05;
  color: #17213f;
}

.optimizer-bar__title strong {
  display: block;
  font-size: 13px;
}

.optimizer-bar__title span,
.optimizer-metrics span {
  font-size: 11px;
  line-height: 1.35;
}

.optimizer-bar__title {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: start;
  column-gap: 10px;
}

.optimizer-bar__title > div:last-child {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.side-card {
  position: static;
  overflow: hidden;
  padding: 14px;
}

.page-side {
  width: 304px;
  max-width: 100%;
  justify-self: end;
  align-content: start;
  align-self: start;
  gap: 18px;
}

.side-card__head {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.side-card__head h3 {
  font-size: 15px;
}

.side-card__head span {
  font-size: 10px;
  line-height: 1.45;
}

.live-badge {
  padding: 3px 8px;
  color: #16a34a;
  background: #eafbf0;
  text-transform: uppercase;
  font-size: 10px;
}

.preview-candidate {
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  background: #f7f9fd;
}

.preview-candidate__copy {
  flex: 1;
}

.preview-candidate__copy strong {
  display: block;
  font-size: 12px;
  line-height: 1.2;
}

.preview-candidate__copy span {
  display: block;
  margin-top: 2px;
  font-size: 10px;
  line-height: 1.35;
}

.score-ring,
.copilot-ring {
  flex: 0 0 46px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 0;
  display: inline-grid;
  place-items: center;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 800;
  color: #1f2a44;
  background:
    radial-gradient(circle, #fff 58%, transparent 59%),
    conic-gradient(
      #22c55e 0deg 68deg,
      #e9f7ef 68deg 112deg,
      #22c55e 112deg 196deg,
      #e9f7ef 196deg 242deg,
      #22c55e 242deg 332deg,
      #e9f7ef 332deg 360deg
    );
}

.side-block {
  padding: 10px 0;
  border-bottom: 1px solid #edf1f7;
  display: grid;
  gap: 4px;
}

.side-block small {
  color: #a2aec1;
  text-transform: uppercase;
  font-size: 9px;
  font-weight: 700;
}

.side-block strong {
  color: #4f6ef6;
  font-size: 12px;
}

.side-block span {
  font-size: 10px;
  line-height: 1.4;
}

.timeline-head {
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0 6px;
}

.timeline-head h4 {
  font-size: 12px;
}

.timeline-head button {
  font-size: 10px;
}

.timeline-list {
  display: grid;
  gap: 8px;
}

.timeline-row {
  align-items: flex-start;
  gap: 8px;
}

.timeline-row small {
  display: block;
  font-size: 10px;
  line-height: 1.3;
}

.timeline-row strong {
  display: block;
  font-size: 11px;
  line-height: 1.35;
}

.timeline-dot {
  width: 6px;
  height: 6px;
  margin-top: 4px;
  border-radius: 50%;
}

.copilot-score {
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.copilot-actions {
  gap: 8px;
  margin: 14px 0 16px;
  flex-wrap: nowrap;
}

.copilot-actions > * {
  flex: 1 1 0;
}

.copilot-score__copy strong {
  display: block;
  margin-bottom: 2px;
  font-size: 11px;
  color: #1aa768;
}

.copilot-score__copy span {
  display: block;
  font-size: 8px;
  line-height: 1.3;
}

.copilot-health {
  padding-top: 12px;
  border-top: 1px solid #edf2f8;
}

.copilot-health h4 {
  margin: 0 0 10px;
  font-size: 11px;
  color: #26344f;
}

.health-grid {
  display: grid;
  gap: 8px;
}

.health-grid__row {
  display: grid;
  gap: 5px;
}

.health-grid__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.health-grid__top strong {
  font-size: 11px;
}

.health-grid__top strong.is-accent {
  color: #5d5ff2;
}

.health-progress {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  overflow: hidden;
  background: #eef2f7;
}

.health-progress__bar {
  display: block;
  height: 100%;
  min-width: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22c55e 0%, #10b981 100%);
}

.bottom-actions {
  padding: 14px 18px;
  justify-content: space-between;
  gap: 16px;
}

.bottom-actions__status {
  gap: 10px;
  color: #16a34a;
}

.bottom-actions__buttons {
  gap: 10px;
}

@media (max-width: 1680px) and (min-width: 1401px) {
  .page-layout {
    grid-template-columns: minmax(0, 1fr) 280px;
  }

  .page-side {
    width: 280px;
  }

  .movement-panel {
    grid-template-columns: 160px minmax(0, 1fr);
  }

  .routing-layout {
    grid-template-columns: minmax(0, 1fr) 260px;
  }
}

@media (max-width: 1400px) {
  .job-frame {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .job-frame__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .page-layout {
    grid-template-columns: 1fr;
  }

  .interview-step {
    grid-template-columns: 1fr;
  }

  .launch-step,
  .launch-grid-two {
    grid-template-columns: 1fr;
  }

  .launch-readiness__checks {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .interview-kits-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .interview-plan-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .page-side {
    width: 100%;
    justify-self: stretch;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .side-card {
    position: static;
  }

  .stages-grid {
    grid-template-columns: repeat(3, minmax(170px, 1fr));
  }

  .triple-grid {
    grid-template-columns: 1fr;
  }

  .step-overview__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1100px) {
  .job-frame,
  .bottom-actions,
  .movement-panel,
  .routing-layout,
  .optimizer-bar {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .job-frame__meta,
  .job-frame__actions,
  .optimizer-metrics,
  .bottom-actions__buttons {
    flex-wrap: wrap;
  }

  .movement-grid,
  .page-side {
    grid-template-columns: 1fr;
  }

  .stages-grid {
    grid-template-columns: repeat(2, minmax(170px, 1fr));
  }

  .interview-banner,
  .interview-tip,
  .interview-bottom-grid,
  .launch-readiness {
    grid-template-columns: 1fr;
    display: grid;
  }

  .interview-banner__actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .interview-plan-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .launch-experience-grid,
  .launch-channel-grid,
  .launch-input-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .pipeline-page {
    padding: 16px;
  }

  .stepper {
    justify-content: flex-start;
  }

  .routing-steps,
  .automation-icons {
    justify-content: flex-start;
  }

  .stages-grid {
    grid-template-columns: 1fr;
  }

  .job-frame__actions > *,
  .copilot-actions > *,
  .bottom-actions__buttons > *,
  .optimizer-bar > .ghost-button,
  .step-overview__footer > .primary-button,
  .interview-banner__actions > *,
  .interview-tip > .ghost-button {
    width: 100%;
  }

  .bottom-actions__status {
    justify-content: center;
  }

  .step-overview__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .interview-kits-grid,
  .interview-plan-grid,
  .interview-bottom-grid,
  .launch-readiness__checks {
    grid-template-columns: 1fr;
  }
}
</style>
