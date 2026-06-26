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

const mobileMenuOpen = ref(false)
const currentPage = ref('jobs')
const activeJobId = ref('ac-1187')
const activePipelineStage = ref('')

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
    currentPage.value === 'create-job-start' ||
    currentPage.value === 'create-job-flow' ||
    currentPage.value === 'create-job-scratch'
  ) {
    return 'jobs'
  }

  return currentPage.value
})

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

  <div v-else class="app-shell">
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu" />

    <AppSidebar
      :mobile-open="mobileMenuOpen"
      :active-item="sidebarActiveItem"
      @close-mobile="closeMobileMenu"
      @navigate="navigateTo"
    />

    <div class="page-pane">
      <AppHeader
        :mobile-menu-open="mobileMenuOpen"
        @toggle-mobile-menu="toggleMobileMenu"
        @open-nitro="goToNitro"
      />

      <JobsListPage
        v-if="currentPage === 'jobs'"
        @open-job="openJob"
        @create-job="goToCreateJob"
        @open-pipeline="openJobPipeline"
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

.page-pane {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
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
