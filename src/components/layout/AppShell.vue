<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import JobsListPage from '../pages/JobsListPage.vue'
import JobDetailsPage from '../pages/JobDetailsPage.vue'
import CompareCandidatesPage from '../pages/CompareCandidatesPage.vue'
import JobsOverviewPage from '../pages/JobsOverviewPage.vue'
import StartFromScratchFlowPage from '../pages/StartFromScratchFlowPage.vue'
import CreateJobStartPage from '../pages/CreateJobStartPage.vue'
import JobPipelinePage from '../pages/JobPipelinePage.vue'
import NitroPage from '../pages/NitroPage.vue'
import BackgroundCheckProgressPage from '../pages/BackgroundCheckProgressPage.vue'
import CreateOfferPage from '../pages/CreateOfferPage.vue'
import ReviewAIOfferPage from '../pages/ReviewAIOfferPage.vue'
import OfferDetailsPage from '../pages/OfferDetailsPage.vue'
import CreateOfferScratchCompensationPage from '../pages/CreateOfferScratchCompensationPage.vue'
import CreateOfferScratchBenefitsPage from '../pages/CreateOfferScratchBenefitsPage.vue'
import CreateOfferScratchAIReviewPage from '../pages/CreateOfferScratchAIReviewPage.vue'
import CreateOfferScratchPackagePage from '../pages/CreateOfferScratchPackagePage.vue'
import CreateOfferScratchFinalReviewPage from '../pages/CreateOfferScratchFinalReviewPage.vue'
import CreateOfferScratchLaunchPage from '../pages/CreateOfferScratchLaunchPage.vue'
import OfferPackagePage from '../pages/OfferPackagePage.vue'
import ReviewSendOfferPage from '../pages/ReviewSendOfferPage.vue'
import LaunchOfferPage from '../pages/LaunchOfferPage.vue'
import OfferActivityPage from '../pages/OfferActivityPage.vue'
import CreateOfferScratchPage from '../pages/CreateOfferScratchPage.vue'

const mobileMenuOpen = ref(false)
const currentPage = ref('jobs')
const activeJobId = ref('ac-1187')
const activePipelineStage = ref('')
const activeBackgroundCheckProgressCandidateId = ref('')
const activeBackgroundCheckProgressCandidateName = ref('Marvin McKinney')
const activeBackgroundCheckProgressCandidateRole = ref('Senior Frontend Developer')
const activeOfferCandidateId = ref('')
const activeOfferCandidateName = ref('Marvin McKinney')
const activeOfferCandidateRole = ref('Senior Frontend Developer')
const activeOfferSourceStage = ref('Validation')
const activeOfferStep = ref('source')

function scrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }
}

function syncRouteFromHash() {
  if (typeof window === 'undefined') {
    return
  }

  const hash = window.location.hash

  if (hash === '#create-job' || hash === '#create-job/start') {
    currentPage.value = 'create-job-start'
    scrollToTop()
    return
  }

  if (/^#create-job\/scratch/.test(hash)) {
    currentPage.value = 'create-job-scratch'
    scrollToTop()
    return
  }

  if (/^#create-job/.test(hash)) {
    currentPage.value = 'create-job-flow'
    scrollToTop()
    return
  }

  if (/^#job\/[^/]+\/compare$/.test(hash)) {
    currentPage.value = 'compare-candidates'
    const match = hash.match(/^#job\/([^/]+)\/compare$/)
    activeJobId.value = match?.[1] ?? 'ac-1187'
    scrollToTop()
    return
  }

  if (/^#job\/[^/]+\/background-check-progress(?:\/[^?]+)?(?:\?.*)?$/.test(hash)) {
    currentPage.value = 'background-check-progress'
    const [pathPart, queryString = ''] = hash.slice(1).split('?')
    const match = pathPart.match(/^job\/([^/]+)\/background-check-progress(?:\/([^/]+))?$/)
    const query = new URLSearchParams(queryString)

    activeJobId.value = match?.[1] ?? 'ac-1187'
    activeBackgroundCheckProgressCandidateId.value = match?.[2] ?? ''
    activeBackgroundCheckProgressCandidateName.value = query.get('candidateName') ?? 'Marvin McKinney'
    activeBackgroundCheckProgressCandidateRole.value = query.get('candidateRole') ?? 'Senior Frontend Developer'
    scrollToTop()
    return
  }

  if (/^#job\/[^/]+\/offer(?:\/[^?]+)?(?:\?.*)?$/.test(hash)) {
    currentPage.value = 'create-offer'
    const [pathPart, queryString = ''] = hash.slice(1).split('?')
    const match = pathPart.match(/^job\/([^/]+)\/offer(?:\/([^/]+))?$/)
    const query = new URLSearchParams(queryString)
    const rawStep = query.get('step') ?? ''
    const normalizedStep = normalizeOfferStep(rawStep)

    activeJobId.value = match?.[1] ?? 'ac-1187'
    activeOfferCandidateId.value = match?.[2] ?? ''
    activeOfferCandidateName.value = query.get('candidateName') ?? 'Marvin McKinney'
    activeOfferCandidateRole.value = query.get('candidateRole') ?? 'Senior Frontend Developer'
    activeOfferSourceStage.value = query.get('sourceStage') ?? 'Validation'
    activeOfferStep.value = normalizedStep

    if (typeof window !== 'undefined' && rawStep && rawStep !== normalizedStep) {
      query.set('step', normalizedStep)
      const candidatePath = activeOfferCandidateId.value ? `/${activeOfferCandidateId.value}` : ''
      window.history.replaceState(null, '', `#job/${activeJobId.value}/offer${candidatePath}?${query.toString()}`)
    }

    scrollToTop()
    return
  }

  if (/^#job\/[^/]+\/pipeline(?:\/[^/]+)?$/.test(hash)) {
    currentPage.value = 'job-pipeline'
    const match = hash.match(/^#job\/([^/]+)\/pipeline(?:\/([^/]+))?$/)
    activeJobId.value = match?.[1] ?? 'ac-1187'
    activePipelineStage.value = match?.[2] ?? ''
    scrollToTop()
    return
  }

  if (/^#job\//.test(hash)) {
    currentPage.value = 'job-detail'
    const match = hash.match(/^#job\/([^/]+)/)
    activeJobId.value = match?.[1] ?? 'ac-1187'
    scrollToTop()
    return
  }

  if (hash === '#nitro') {
    currentPage.value = 'nitro'
    scrollToTop()
    return
  }

  currentPage.value = 'jobs'
  scrollToTop()
}

function goToJobs() {
  currentPage.value = 'jobs'

  if (typeof window !== 'undefined' && window.location.hash !== '#jobs') {
    window.history.replaceState(null, '', '#jobs')
  }

  scrollToTop()
}

function goToCreateJob() {
  currentPage.value = 'create-job-start'

  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '#create-job')
  }

  scrollToTop()
}

function goToNitro() {
  currentPage.value = 'nitro'

  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', '#nitro')
  }

  scrollToTop()
}

function startCreateJobFlow(option = 'template') {
  currentPage.value = option === 'scratch' ? 'create-job-scratch' : 'create-job-flow'

  if (typeof window !== 'undefined') {
    window.history.replaceState(
      null,
      '',
      option === 'scratch' ? '#create-job/scratch/step-1' : '#create-job/step-1',
    )
  }

  scrollToTop()
}

function openJob(job) {
  currentPage.value = 'job-detail'
  activeJobId.value = job.id

  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', `#job/${job.id}`)
  }

  scrollToTop()
}

function openCompareCandidates(jobId = activeJobId.value) {
  currentPage.value = 'compare-candidates'
  activeJobId.value = jobId

  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', `#job/${jobId}/compare`)
  }

  scrollToTop()
}

function slugifyStage(stage = '') {
  return stage.toLowerCase().replace(/\s+/g, '-')
}

function resolveOfferSourceStage(stage = '') {
  const normalized = slugifyStage(stage)

  if (normalized === 'decision' || normalized === 'validation') {
    return 'Validation'
  }

  if (normalized === 'offer') {
    return 'Offer'
  }

  return 'Validation'
}

function normalizeOfferStep(step = '') {
  if (step === 'scratch' || step === 'scratch-compensation' || step === 'scratch-benefits' || step === 'scratch-ai-review' || step === 'scratch-offer-package' || step === 'scratch-final-review' || step === 'scratch-launch' || step === 'review-ai' || step === 'offer-details' || step === 'offer-package' || step === 'review-send' || step === 'launch-offer' || step === 'offer-activity') {
    return step
  }

  return 'source'
}

function openJobPipeline(payload = {}) {
  const jobId = typeof payload === 'string' ? payload : (payload.jobId ?? activeJobId.value)
  const stage = typeof payload === 'string' ? '' : (payload.stage ?? '')
  const stageSlug = stage ? slugifyStage(stage) : ''

  currentPage.value = 'job-pipeline'
  activeJobId.value = jobId
  activePipelineStage.value = stageSlug

  if (typeof window !== 'undefined') {
    const nextHash = stageSlug ? `#job/${jobId}/pipeline/${stageSlug}` : `#job/${jobId}/pipeline`
    window.history.replaceState(null, '', nextHash)
  }

  scrollToTop()
}

function openCreateOffer(payload = {}) {
  const jobId = payload.jobId ?? activeJobId.value
  const candidateId = payload.candidateId ?? ''
  const candidateName = payload.candidateName ?? 'Marvin McKinney'
  const candidateRole = payload.candidateRole ?? 'Senior Frontend Developer'
  const sourceStage = resolveOfferSourceStage(payload.sourceStage ?? 'Validation')
  const step = normalizeOfferStep(payload.step)
  const query = new URLSearchParams({
    candidateName,
    candidateRole,
    sourceStage,
    step,
  })

  currentPage.value = 'create-offer'
  activeJobId.value = jobId
  activeOfferCandidateId.value = candidateId
  activeOfferCandidateName.value = candidateName
  activeOfferCandidateRole.value = candidateRole
  activeOfferSourceStage.value = sourceStage
  activeOfferStep.value = step

  if (typeof window !== 'undefined') {
    const candidatePath = candidateId ? `/${candidateId}` : ''
    window.history.replaceState(null, '', `#job/${jobId}/offer${candidatePath}?${query.toString()}`)
  }

  scrollToTop()
}

function goBackFromCreateOffer() {
  openJobPipeline({
    jobId: activeJobId.value,
    stage: activeOfferSourceStage.value === 'Offer' ? 'offer' : 'validation',
  })
}

function goToJobDetail() {
  currentPage.value = 'job-detail'

  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', `#job/${activeJobId.value}`)
  }

  scrollToTop()
}

function navigateTo(itemId) {
  if (itemId === 'jobs' || itemId === 'home') {
    goToJobs()
  }

  closeMobileMenu()
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

const sidebarActiveItem = computed(() => {
  if (
    currentPage.value === 'nitro' ||
    currentPage.value === 'job-detail' ||
    currentPage.value === 'compare-candidates' ||
    currentPage.value === 'job-pipeline' ||
    currentPage.value === 'create-offer' ||
    currentPage.value === 'background-check-progress' ||
    currentPage.value === 'create-job-start' ||
    currentPage.value === 'create-job-flow' ||
    currentPage.value === 'create-job-scratch'
  ) {
    if (currentPage.value === 'background-check-progress') {
      return 'candidates'
    }

    return 'jobs'
  }

  return currentPage.value
})

const isFramelessPage = computed(() => (
  currentPage.value === 'background-check-progress'
  || currentPage.value === 'create-offer'
))

const showHeader = computed(() => (
  !isFramelessPage.value && currentPage.value !== 'create-offer'
))

onMounted(() => {
  syncRouteFromHash()

  if (typeof window !== 'undefined' && !window.location.hash) {
    window.history.replaceState(null, '', '#jobs')
  }

  window.addEventListener('hashchange', syncRouteFromHash)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncRouteFromHash)
})
</script>

<template>
  <NitroPage v-if="currentPage === 'nitro'" @close="goToJobs" />

  <div v-else class="app-shell" :class="{ 'is-frameless': isFramelessPage }">
    <template v-if="!isFramelessPage">
      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu" />

      <AppSidebar
        :mobile-open="mobileMenuOpen"
        :active-item="sidebarActiveItem"
        @close-mobile="closeMobileMenu"
        @navigate="navigateTo"
      />
    </template>

    <div class="page-pane" :class="{ 'page-pane--frameless': isFramelessPage }">
      <AppHeader
        v-if="showHeader"
        :mobile-menu-open="mobileMenuOpen"
        @toggle-mobile-menu="toggleMobileMenu"
        @open-nitro="goToNitro"
      />

      <JobsListPage
        v-if="currentPage === 'jobs'"
        @open-job="openJob"
        @create-job="goToCreateJob"
        @open-pipeline="openJobPipeline"
        @open-offer="openCreateOffer"
      />
      <CreateJobStartPage
        v-else-if="currentPage === 'create-job-start'"
        @continue="startCreateJobFlow"
        @go-jobs="goToJobs"
      />
      <StartFromScratchFlowPage
        v-else-if="currentPage === 'create-job-scratch'"
        :job-id="activeJobId"
        route-prefix="create-job/scratch"
        @open-pipeline="openJobPipeline"
      />
      <JobDetailsPage
        v-else-if="currentPage === 'job-detail'"
        :job-id="activeJobId"
        @back="goToJobs"
        @open-compare="openCompareCandidates"
        @open-pipeline="openJobPipeline"
      />
      <JobPipelinePage
        v-else-if="currentPage === 'job-pipeline'"
        :job-id="activeJobId"
        :focus-stage="activePipelineStage"
        @back="goToJobs"
        @open-offer="openCreateOffer"
      />
      <CreateOfferPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'source'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="goBackFromCreateOffer"
        @open-candidate-profile="openJobPipeline({ jobId: activeJobId, stage: 'offer' })"
        @open-review-ai-offer="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'review-ai',
        })"
        @open-scratch-offer="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch',
        })"
      />
      <CreateOfferScratchPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'scratch'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="goBackFromCreateOffer"
        @open-source="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'source',
        })"
        @open-offer-details="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-compensation',
        })"
      />
      <CreateOfferScratchCompensationPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'scratch-compensation'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch',
        })"
        @open-source="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch',
        })"
        @open-review-ai-offer="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'review-ai',
        })"
        @open-offer-package="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'offer-package',
        })"
        @open-review-send="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'review-send',
        })"
      />
      <CreateOfferScratchBenefitsPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'scratch-benefits'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-compensation',
        })"
        @open-source="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-compensation',
        })"
        @open-offer-package="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'offer-package',
        })"
      />
      <CreateOfferScratchAIReviewPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'scratch-ai-review'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-benefits',
        })"
        @open-source="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-benefits',
        })"
        @open-offer-package="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'offer-package',
        })"
      />
      <CreateOfferScratchPackagePage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'scratch-offer-package'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-ai-review',
        })"
        @open-source="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-ai-review',
        })"
        @open-review-send="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'review-send',
        })"
      />
      <CreateOfferScratchFinalReviewPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'scratch-final-review'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-offer-package',
        })"
        @open-source="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-offer-package',
        })"
      />
      <CreateOfferScratchLaunchPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'scratch-launch'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-final-review',
        })"
        @open-source="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'scratch-final-review',
        })"
        @open-launch-offer="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'launch-offer',
        })"
      />
      <template v-else-if="currentPage === 'create-offer' && activeOfferStep === 'offer-details'">
        <CreateOfferPage
          :job-id="activeJobId"
          :candidate-id="activeOfferCandidateId"
          :candidate-name="activeOfferCandidateName"
          :candidate-role="activeOfferCandidateRole"
          :source-stage="activeOfferSourceStage"
          @back="goBackFromCreateOffer"
          @open-candidate-profile="openJobPipeline({ jobId: activeJobId, stage: 'offer' })"
          @open-review-ai-offer="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'review-ai',
          })"
        />
        <OfferDetailsPage
          :job-id="activeJobId"
          :candidate-id="activeOfferCandidateId"
          :candidate-name="activeOfferCandidateName"
          :candidate-role="activeOfferCandidateRole"
          :source-stage="activeOfferSourceStage"
          @back="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'source',
          })"
          @open-source="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'source',
          })"
          @open-review-ai-offer="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'review-ai',
          })"
          @open-offer-package="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'offer-package',
          })"
          @open-review-send="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'review-send',
          })"
        />
      </template>
      <ReviewAIOfferPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'review-ai'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="goBackFromCreateOffer"
        @open-source="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'source',
        })"
        @open-offer-details="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'offer-details',
        })"
        @open-offer-package="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'offer-package',
        })"
        @open-review-send="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'review-send',
        })"
        @open-candidate-profile="openJobPipeline({ jobId: activeJobId, stage: 'offer' })"
      />
      <template v-else-if="currentPage === 'create-offer' && activeOfferStep === 'offer-package'">
        <CreateOfferPage
          :job-id="activeJobId"
          :candidate-id="activeOfferCandidateId"
          :candidate-name="activeOfferCandidateName"
          :candidate-role="activeOfferCandidateRole"
          :source-stage="activeOfferSourceStage"
          @back="goBackFromCreateOffer"
          @open-candidate-profile="openJobPipeline({ jobId: activeJobId, stage: 'offer' })"
          @open-review-ai-offer="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'review-ai',
          })"
        />
        <OfferPackagePage
          :job-id="activeJobId"
          :candidate-id="activeOfferCandidateId"
          :candidate-name="activeOfferCandidateName"
          :candidate-role="activeOfferCandidateRole"
          :source-stage="activeOfferSourceStage"
          @back="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'source',
          })"
          @open-source="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'source',
          })"
          @open-offer-details="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'offer-details',
          })"
          @open-review-ai-offer="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'review-ai',
          })"
          @open-review-send="openCreateOffer({
            jobId: activeJobId,
            candidateId: activeOfferCandidateId,
            candidateName: activeOfferCandidateName,
            candidateRole: activeOfferCandidateRole,
            sourceStage: activeOfferSourceStage,
            step: 'review-send',
          })"
        />
      </template>
      <ReviewSendOfferPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'review-send'"
        :key="`review-send-${activeJobId}-${activeOfferCandidateId}-${activeOfferCandidateName}-${activeOfferStep}`"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="goBackFromCreateOffer"
        @open-offer-package="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'offer-package',
        })"
        @open-source="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'source',
        })"
        @open-offer-details="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'offer-details',
        })"
        @open-review-ai-offer="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'review-ai',
        })"
        @open-launch-offer="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'launch-offer',
        })"
        @open-candidate-profile="openJobPipeline({ jobId: activeJobId, stage: 'offer' })"
      />
      <LaunchOfferPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'launch-offer'"
        :job-id="activeJobId"
        :candidate-id="activeOfferCandidateId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        :source-stage="activeOfferSourceStage"
        @back="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'review-send',
        })"
        @open-review-send="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'review-send',
        })"
        @open-candidate-profile="openJobPipeline({ jobId: activeJobId, stage: 'offer' })"
        @open-offer-activity="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'offer-activity',
        })"
      />
      <OfferActivityPage
        v-else-if="currentPage === 'create-offer' && activeOfferStep === 'offer-activity'"
        :job-id="activeJobId"
        :candidate-name="activeOfferCandidateName"
        :candidate-role="activeOfferCandidateRole"
        @back="openCreateOffer({
          jobId: activeJobId,
          candidateId: activeOfferCandidateId,
          candidateName: activeOfferCandidateName,
          candidateRole: activeOfferCandidateRole,
          sourceStage: activeOfferSourceStage,
          step: 'launch-offer',
        })"
      />
      <BackgroundCheckProgressPage
        v-else-if="currentPage === 'background-check-progress'"
        :job-id="activeJobId"
        :candidate-id="activeBackgroundCheckProgressCandidateId"
        :candidate-name="activeBackgroundCheckProgressCandidateName"
        :candidate-role="activeBackgroundCheckProgressCandidateRole"
        @back="openJobPipeline({ jobId: activeJobId, stage: 'decision' })"
      />
      <CompareCandidatesPage
        v-else-if="currentPage === 'compare-candidates'"
        :job-id="activeJobId"
        @back="goToJobDetail"
      />
      <JobsOverviewPage
        v-else
        :job-id="activeJobId"
        route-prefix="create-job"
        @open-pipeline="openJobPipeline"
      />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
}

.app-shell.is-frameless {
  display: block;
}

.page-pane {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-pane--frameless {
  min-height: 100vh;
}

.mobile-overlay {
  display: none;
}

@media (max-width: 720px) {
  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: block;
    background: rgba(15, 23, 42, 0.24);
  }
}
</style>
