<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import StepDefineGoal from './job-setup/ScratchStepDefineGoal.vue'
import StepHiringBlueprint from './job-setup/ScratchStepHiringBlueprint.vue'
import StepCandidatePersona from './job-setup/ScratchStepCandidatePersona.vue'
import StepApplicationSetup from './job-setup/ScratchStepApplicationSetup.vue'
import StepAIScreening from './job-setup/ScratchStepReviewEvaluation.vue'
import StepPipelineAutomation from './job-setup/ScratchStepPipelineAutomation.vue'
import StepInterviewKit from './job-setup/ScratchStepInterviewKit.vue'
import StepLaunchReadiness from './job-setup/ScratchStepLaunchReadiness.vue'

const emit = defineEmits(['open-pipeline'])

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

const steps = [
  { id: 1, label: 'Job Details' },
  { id: 2, label: 'Hiring Blueprint' },
  { id: 3, label: 'Candidate Persona' },
  { id: 4, label: 'Experience' },
  { id: 5, label: 'Review & Evaluation' },
  { id: 6, label: 'Pipeline' },
  { id: 7, label: 'Interview Kit' },
  { id: 8, label: 'Launch' },
]

const activeStep = ref(1)
const showLocalStepOneFooter = computed(() => activeStep.value === 1)
const showHeaderLaunchActions = computed(() => activeStep.value >= 7)
const showFooterSaveDraft = computed(() => activeStep.value !== 7)
const jobStatusLabel = computed(() => (activeStep.value >= 7 ? 'Open' : 'Draft'))
const jobStatusClass = computed(() => (activeStep.value >= 7 ? 'is-open' : 'is-draft'))
const jobMeta = computed(() => {
  if (activeStep.value >= 8) {
    return 'Finance · Stockholm, Sweden · Hybrid · Full-time · ID: AC-1187'
  }

  if (activeStep.value >= 7) {
    return 'Finance · Stockholm, Sweden · ID: AC-1187 · Created May 10, 2024'
  }

  return 'Finance · Stockholm, Sweden · Hybrid'
})

const decoratedSteps = computed(() => (
  steps.map((step) => ({
    ...step,
    state: step.id < activeStep.value ? 'done' : step.id === activeStep.value ? 'active' : 'todo',
  }))
))

const currentStepLabel = computed(() => (
  steps.find((step) => step.id === activeStep.value)?.label ?? 'Create Job'
))

const showBreadcrumb = computed(() => activeStep.value >= 2 && activeStep.value <= 4)
const showJobHeader = computed(() => activeStep.value >= 5)

const primaryLabel = computed(() => {
  if (activeStep.value === 2) {
    return 'Approve & Continue'
  }

  if (activeStep.value === 8) {
    return 'Launch Hiring Workspace'
  }

  if (activeStep.value === 7) {
    return 'Next: Launch'
  }

  return `Continue to ${Math.min(activeStep.value + 1, 8)}. ${steps[Math.min(activeStep.value, 7)].label}`
})

function getStepFromHash() {
  if (typeof window === 'undefined') {
    return 1
  }

  const match = window.location.hash.match(/step-(\d+)/)
  const parsed = Number(match?.[1] ?? 1)

  return steps.some((step) => step.id === parsed) ? parsed : 1
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

function syncStepFromHash() {
  activeStep.value = getStepFromHash()
}

function goToStep(stepId) {
  activeStep.value = stepId
  updateHash(stepId)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goBack() {
  if (activeStep.value > 1) {
    goToStep(activeStep.value - 1)
    return
  }

  window.location.hash = '#create-job'
}

function goToNextStep() {
  if (activeStep.value < 8) {
    goToStep(activeStep.value + 1)
  }
}

function openPipeline(stage) {
  emit('open-pipeline', {
    jobId: props.jobId,
    stage,
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
</script>

<template>
  <main class="create-job-flow" :class="{ 'create-job-flow--step-one': showLocalStepOneFooter }">
    <header v-if="showJobHeader" class="flow-jobbar flow-panel">
      <div class="flow-jobbar__title">
        <button v-if="activeStep < 8" class="flow-jobbar__back" type="button" @click="goBack">
          <AppIcon name="chevronLeft" :size="18" />
        </button>
        <div>
          <h1>Senior Accountant <span :class="jobStatusClass">{{ jobStatusLabel }}</span></h1>
          <p>{{ jobMeta }}</p>
        </div>
      </div>

      <div class="flow-jobbar__actions">
        <button class="flow-ghost-button" type="button">
          Preview career page
          <AppIcon name="external-link" :size="14" />
        </button>
        <button class="flow-ghost-button flow-ghost-button--icon" type="button">
          <AppIcon name="more" :size="16" />
        </button>
        <template v-if="showHeaderLaunchActions">
          <button class="flow-ghost-button" type="button">Save draft</button>
          <button class="flow-primary-button flow-primary-button--compact" type="button" @click="goToNextStep">
            {{ activeStep === 8 ? 'Launch Hiring Workspace' : 'Next: Launch' }}
            <AppIcon name="chevronRight" :size="15" />
          </button>
        </template>
      </div>
    </header>

    <header v-else-if="showBreadcrumb" class="flow-breadcrumb">
      <span>Jobs</span>
      <AppIcon name="chevronRight" :size="12" />
      <span>Create Job</span>
      <AppIcon name="chevronRight" :size="12" />
      <strong>{{ currentStepLabel }}</strong>
    </header>

    <nav class="flow-stepper">
      <button
        v-for="step in decoratedSteps"
        :key="step.id"
        class="flow-stepper__item"
        :class="`is-${step.state}`"
        type="button"
        @click="goToStep(step.id)"
      >
        <span class="flow-stepper__dot">
          <AppIcon v-if="step.state === 'done'" name="check" :size="12" />
          <template v-else>{{ step.id }}</template>
        </span>
        <span class="flow-stepper__label">{{ step.label }}</span>
      </button>
    </nav>

    <StepDefineGoal v-if="activeStep === 1" />
    <StepHiringBlueprint v-else-if="activeStep === 2" />
    <StepCandidatePersona v-else-if="activeStep === 3" />
    <StepApplicationSetup v-else-if="activeStep === 4" />
    <StepAIScreening v-else-if="activeStep === 5" />
    <StepPipelineAutomation v-else-if="activeStep === 6" @open-pipeline="openPipeline" />
    <StepInterviewKit v-else-if="activeStep === 7" />
    <StepLaunchReadiness v-else />

    <footer class="flow-footer" :class="{ 'flow-footer--step-one': showLocalStepOneFooter, 'flow-panel': !showLocalStepOneFooter }">
      <button class="flow-back-button" type="button" @click="goBack">
        <AppIcon name="chevronLeft" :size="15" />
        Back
      </button>

      <div v-if="!showLocalStepOneFooter" class="flow-footer__status">
        <AppIcon name="checkCircle" :size="14" />
        <span>All changes saved automatically</span>
      </div>

      <div class="flow-footer__actions">
        <button v-if="showFooterSaveDraft" class="flow-ghost-button" type="button">Save draft</button>
        <button class="flow-primary-button" type="button" @click="goToNextStep">
          {{ primaryLabel }}
          <AppIcon name="chevronRight" :size="15" />
        </button>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.create-job-flow {
  min-height: 100%;
  padding: 18px 22px 24px;
  display: grid;
  gap: 18px;
  background: linear-gradient(180deg, #fbfcff 0%, #f5f8fd 100%);
}

.create-job-flow--step-one {
  gap: 0;
  padding-top: 24px;
  background: #fbfdff;
}

.flow-panel {
  border: 1px solid #e7edf7;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
}

.flow-breadcrumb,
.flow-jobbar,
.flow-footer,
.flow-stepper,
.flow-jobbar__title,
.flow-jobbar__actions,
.flow-footer__status,
.flow-footer__actions {
  display: flex;
  align-items: center;
}

.flow-breadcrumb {
  gap: 10px;
  padding: 0 0 18px;
  color: #7b879b;
  font-size: 14px;
}

.flow-breadcrumb strong {
  color: #1f2b45;
}

.flow-jobbar,
.flow-footer {
  justify-content: space-between;
  gap: 18px;
  padding: 14px 18px;
}

.flow-footer--step-one {
  margin-top: 8px;
  padding: 22px 0 0;
  border-top: 1px solid #e7edf7;
  background: transparent;
}

.flow-footer--step-one .flow-footer__actions {
  margin-left: auto;
}

.flow-footer--step-one .flow-back-button,
.flow-footer--step-one .flow-ghost-button {
  background: #ffffff;
}

.flow-jobbar__title {
  min-width: 0;
  gap: 14px;
}

.flow-jobbar__back {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #33415d;
  background: #f8fbff;
  flex-shrink: 0;
}

.flow-jobbar h1 {
  margin: 0 0 6px;
  color: #1a243c;
  font-size: 18px;
  font-weight: 800;
}

.flow-jobbar h1 span {
  margin-left: 8px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.flow-jobbar h1 span.is-draft {
  color: #6b5cff;
  background: #f1efff;
}

.flow-jobbar h1 span.is-open {
  color: #16a34a;
  background: #dcfce7;
}

.flow-jobbar p {
  margin: 0;
  color: #72819a;
  font-size: 13px;
}

.flow-jobbar__actions,
.flow-footer__actions {
  gap: 10px;
  flex-wrap: wrap;
}

.flow-stepper {
  gap: 0;
  justify-content: space-between;
  padding: 12px 16px 24px;
  border-top: 1px solid #e7edf7;
  border-bottom: 1px solid #e7edf7;
  overflow-x: auto;
}

.flow-stepper__item {
  min-width: 120px;
  border: 0;
  display: grid;
  justify-items: center;
  gap: 10px;
  color: #9aa6bb;
  background: transparent;
  position: relative;
}

.flow-stepper__item::after {
  content: '';
  position: absolute;
  top: 16px;
  left: calc(50% + 26px);
  width: calc(100% - 52px);
  height: 2px;
  background: #e7edf7;
}

.flow-stepper__item:last-child::after {
  display: none;
}

.flow-stepper__dot {
  width: 32px;
  height: 32px;
  border: 1px solid #d6ddea;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  background: #fff;
}

.flow-stepper__item.is-done {
  color: #33415d;
}

.flow-stepper__item.is-done .flow-stepper__dot {
  border-color: #22c55e;
  color: #fff;
  background: #22c55e;
}

.flow-stepper__item.is-done::after {
  background: #f08dc1;
}

.flow-stepper__item.is-active {
  color: #1f2b45;
}

.flow-stepper__item.is-active .flow-stepper__dot {
  border-color: #6b5cff;
  color: #fff;
  background: #6b5cff;
}

.flow-stepper__label {
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.flow-back-button,
.flow-ghost-button,
.flow-primary-button {
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

.flow-back-button,
.flow-ghost-button {
  border: 1px solid #dce4f0;
  color: #33415d;
  background: #fff;
}

.flow-ghost-button--icon {
  width: 46px;
  padding: 0;
}

.flow-primary-button {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
  box-shadow: 0 14px 28px rgba(241, 88, 173, 0.18);
}

.flow-primary-button--compact {
  min-height: 42px;
  padding: 0 16px;
  box-shadow: none;
}

.flow-footer__status {
  gap: 8px;
  color: #7f8ba0;
  font-size: 13px;
}

@media (max-width: 960px) {
  .flow-jobbar,
  .flow-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .flow-footer__status {
    justify-content: center;
  }
}

@media (max-width: 720px) {
  .create-job-flow {
    padding: 12px;
  }

  .flow-jobbar__title,
  .flow-footer__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .flow-stepper {
    justify-content: flex-start;
  }

  .flow-back-button,
  .flow-ghost-button,
  .flow-primary-button {
    width: 100%;
  }
}
</style>
