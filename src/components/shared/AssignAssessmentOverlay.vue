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
    default: 'Sarah Johnson',
  },
  candidateRole: {
    type: String,
    default: 'Senior Product Designer',
  },
  candidateStage: {
    type: String,
    default: 'Shortlisted',
  },
})

const emit = defineEmits(['close', 'assign-send', 'customize-plan', 'assign-recommended', 'open-library'])

const sendTiming = ref('now')
const remindersEnabled = ref(true)
const libraryOpen = ref(false)
const librarySelectedIds = ref([])

const planItems = ref([
  {
    id: 'technical-coding-assessment',
    order: 1,
    title: 'Technical Coding Assessment',
    meta: 'HackerRank - External',
    description: 'Evaluate coding skills, problem solving and frontend development expertise.',
    duration: '90 min',
    durationMinutes: 90,
    difficulty: 'Medium',
    result: 'Auto sync',
    badge: 'Recommended',
    tone: 'violet',
    icon: 'compare',
  },
  {
    id: 'portfolio-review',
    order: 2,
    title: 'Portfolio Review',
    meta: 'Internal Review - Internal',
    description: 'Review portfolio for design thinking, user experience and visual quality.',
    duration: '30 min',
    durationMinutes: 30,
    difficulty: 'Reviewer',
    result: 'Design Scorecard',
    badge: 'Recommended',
    tone: 'green',
    icon: 'document',
  },
  {
    id: 'communication-assessment',
    order: 3,
    title: 'Communication Assessment',
    meta: 'SHL - External',
    description: 'Assess written communication and collaboration capabilities.',
    duration: '25 min',
    durationMinutes: 25,
    difficulty: 'Easy',
    result: 'Auto sync',
    badge: 'Recommended',
    tone: 'orange',
    icon: 'message',
  },
])

const assessmentLibrary = [
  {
    id: 'technical-coding-assessment',
    title: 'Frontend Coding Assessment',
    provider: 'HackerRank - External',
    description: 'Evaluate frontend development skills, problem solving, and code quality.',
    duration: '90 min',
    durationMinutes: 90,
    result: 'Auto Sync',
    usage: 'Used in 154 hires',
    covers: ['Technical Skills', 'Problem Solving', '+1'],
    recommended: true,
    tone: 'slate',
    icon: 'compare',
  },
  {
    id: 'portfolio-review',
    title: 'Portfolio Review',
    provider: 'Internal Review - Internal',
    description: 'Review candidate portfolio to evaluate design thinking, aesthetics and impact.',
    duration: '30 min',
    durationMinutes: 30,
    result: 'Reviewer Based',
    usage: 'Used in 84 hires',
    covers: ['Design Thinking', 'UX', 'Communication'],
    recommended: false,
    tone: 'green',
    icon: 'document',
  },
  {
    id: 'product-design-case-study',
    title: 'Product Design Case Study',
    provider: 'TestGorilla - External',
    description: 'Assess product design process, user research and solution thinking.',
    duration: '60 min',
    durationMinutes: 60,
    result: 'Auto Sync',
    usage: 'Used in 96 hires',
    covers: ['Product Thinking', 'Problem Solving', 'Design'],
    recommended: true,
    tone: 'orange',
    icon: 'briefcase',
  },
  {
    id: 'leadership-simulation',
    title: 'Leadership Simulation',
    provider: 'SHL - External',
    description: 'Evaluate leadership style, decision making and people management.',
    duration: '45 min',
    durationMinutes: 45,
    result: 'Auto Sync',
    usage: 'Used in 67 hires',
    covers: ['Leadership', 'Decision Making', 'Influence'],
    recommended: true,
    tone: 'pink',
    icon: 'users',
  },
  {
    id: 'communication-assessment',
    title: 'Communication Assessment',
    provider: 'TestGorilla - External',
    description: 'Assess written communication, clarity and persuasion.',
    duration: '25 min',
    durationMinutes: 25,
    result: 'Auto Sync',
    usage: 'Used in 143 hires',
    covers: ['Communication', 'Clarity', 'Writing'],
    recommended: false,
    tone: 'violet',
    icon: 'message',
  },
]

const libraryFilters = ['Recommended', 'Technical', 'Behavioral', 'Leadership', 'Communication', 'Portfolio', 'Case Study', 'Cognitive']

const evidenceItems = [
  { label: 'Technical depth', tone: 'green' },
  { label: 'Product thinking', tone: 'green' },
  { label: 'Collaboration', tone: 'orange' },
  { label: 'Communication', tone: 'orange' },
]

const integrationItems = [
  {
    title: 'External assessments',
    note: 'Results will be automatically synced.',
    badge: 'Auto sync',
    tone: 'green',
    icon: 'refresh',
  },
  {
    title: 'Internal reviews',
    note: 'Reviewers will receive tasks in NitroSync.',
    badge: 'Internal',
    tone: 'violet',
    icon: 'users',
  },
  {
    title: 'All results in one place',
    note: 'View scorecards and insights in Assessment Review.',
    badge: 'NitroSync',
    tone: 'blue',
    icon: 'clipboard-check',
  },
]

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const stageLabel = computed(() => props.candidateStage.toUpperCase())
const planCount = computed(() => planItems.value.length)
const totalDurationMinutes = computed(() => (
  planItems.value.reduce((sum, item) => sum + (item.durationMinutes ?? 0), 0)
))

const estimatedTimeLabel = computed(() => {
  const hours = Math.floor(totalDurationMinutes.value / 60)
  const minutes = totalDurationMinutes.value % 60

  if (!hours) return `${minutes}m`
  if (!minutes) return `${hours}h`
  return `${hours}h ${minutes}m`
})

const selectedLibraryItems = computed(() => (
  assessmentLibrary.filter((item) => librarySelectedIds.value.includes(item.id))
))

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') return

  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow
    previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousHtmlOverflow
}

function closeOverlay() {
  emit('close')
}

function closeLibrary() {
  libraryOpen.value = false
  librarySelectedIds.value = []
}

function openLibrary() {
  emit('open-library')
}

function assignAndSend() {
  emit('assign-send')
}

function assignRecommendedPlan() {
  emit('assign-recommended')
}

function customizePlan() {
  emit('customize-plan')
}

function removePlanItem(itemId) {
  planItems.value = planItems.value
    .filter((item) => item.id !== itemId)
    .map((item, index) => ({ ...item, order: index + 1 }))
}

function clearPlan() {
  planItems.value = []
}

function toggleLibraryAssessment(itemId) {
  if (librarySelectedIds.value.includes(itemId)) {
    librarySelectedIds.value = librarySelectedIds.value.filter((id) => id !== itemId)
    return
  }

  librarySelectedIds.value = [...librarySelectedIds.value, itemId]
}

function addSelectedAssessments() {
  if (!selectedLibraryItems.value.length) {
    closeLibrary()
    return
  }

  const nextItems = [...planItems.value]

  selectedLibraryItems.value.forEach((item) => {
    if (nextItems.some((entry) => entry.id === item.id)) return

    nextItems.push({
      id: item.id,
      order: nextItems.length + 1,
      title: item.title,
      meta: item.provider,
      description: item.description,
      duration: item.duration,
      durationMinutes: item.durationMinutes,
      difficulty: item.result === 'Reviewer Based' ? 'Reviewer' : item.recommended ? 'Medium' : 'Easy',
      result: item.result === 'Reviewer Based' ? 'Design Scorecard' : 'Auto sync',
      badge: item.recommended ? 'Recommended' : 'Added',
      tone: item.tone,
      icon: item.icon,
    })
  })

  planItems.value = nextItems.map((item, index) => ({ ...item, order: index + 1 }))
  closeLibrary()
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (!isOpen) {
      libraryOpen.value = false
      librarySelectedIds.value = []
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="assign-assessment-overlay" @click.self="closeOverlay">
      <section class="assign-assessment-modal" :class="{ 'is-dimmed': libraryOpen }">
        <header class="assign-assessment-modal__header">
          <div class="assign-assessment-modal__title">
            <span class="assign-assessment-modal__title-icon">
              <AppIcon name="document" :size="20" />
            </span>
            <div>
              <h2>Assign Assessment</h2>
              <p>Create an optimized assessment plan or customize it for {{ candidateName }}.</p>
            </div>
          </div>

          <div class="assign-assessment-modal__header-actions">
            <button class="assign-assessment-modal__ghost-button" type="button">
              <AppIcon name="spark" :size="15" />
              <span>AI Recommendations</span>
            </button>

            <button class="assign-assessment-modal__close" type="button" aria-label="Close assign assessment" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="assign-assessment-modal__body">
          <section class="assign-assessment-main">
            <section class="assign-assessment-candidate">
              <div class="assign-assessment-candidate__avatar">{{ candidateInitials }}</div>

              <div class="assign-assessment-candidate__copy">
                <div class="assign-assessment-candidate__name">
                  <h3>{{ candidateName }}</h3>
                  <span>{{ stageLabel }}</span>
                </div>

                <p>{{ candidateRole }}</p>

                <div class="assign-assessment-candidate__meta">
                  <span><AppIcon name="mapPin" :size="13" /> New York, NY (Hybrid)</span>
                  <span><AppIcon name="briefcase" :size="13" /> 6+ years experience</span>
                  <span><AppIcon name="calendar" :size="13" /> Applied on 10 May 2026</span>
                </div>
              </div>
            </section>

            <section class="assign-assessment-recommendation">
              <div class="assign-assessment-recommendation__title-row">
                <div class="assign-assessment-recommendation__title">
                  <AppIcon name="spark" :size="16" />
                  <h3>AI Recommended Assessment Plan</h3>
                  <span>High Confidence 96%</span>
                </div>
                <p>Based on role requirements, candidate profile, and interview feedback, this plan will close 92% of the remaining evidence gaps.</p>
              </div>

              <div class="assign-assessment-recommendation__stats">
                <div>
                  <small>Evidence we still need</small>
                  <ul>
                    <li v-for="item in evidenceItems" :key="item.label">
                      <i :class="`tone-${item.tone}`" />
                      <span>{{ item.label }}</span>
                    </li>
                  </ul>
                </div>

                <div class="assign-assessment-progress">
                  <small>Current evidence coverage</small>
                  <strong>58%</strong>
                  <div class="assign-assessment-progress__bar">
                    <span style="width: 58%" />
                  </div>
                </div>

                <div class="assign-assessment-progress">
                  <small>After this plan</small>
                  <strong>91%</strong>
                  <div class="assign-assessment-progress__bar is-green">
                    <span style="width: 91%" />
                  </div>
                </div>

                <div class="assign-assessment-recommendation__metrics">
                  <div>
                    <small>Estimated total time</small>
                    <strong>{{ estimatedTimeLabel }}</strong>
                  </div>
                  <div>
                    <small>Candidate experience</small>
                    <strong>Balanced</strong>
                  </div>
                </div>
              </div>

              <div class="assign-assessment-recommendation__actions">
                <button class="assign-assessment-recommendation__submit" type="button" @click="assignRecommendedPlan">
                  Assign Recommended Plan
                </button>
                <button class="assign-assessment-recommendation__secondary" type="button" @click="customizePlan">
                  Customize Plan
                </button>
              </div>
            </section>

            <section class="assign-assessment-plan">
              <div class="assign-assessment-plan__header">
                <span>Assessment Plan ({{ planCount }})</span>
              </div>

              <article
                v-for="item in planItems"
                :key="item.id"
                class="assign-assessment-plan__item"
              >
                <button type="button" class="assign-assessment-plan__drag" aria-label="Reorder assessment">
                  <AppIcon name="drag" :size="14" />
                </button>

                <span class="assign-assessment-plan__order" :class="`tone-${item.tone}`">{{ item.order }}</span>

                <span class="assign-assessment-plan__icon" :class="`tone-${item.tone}`">
                  <AppIcon :name="item.icon" :size="18" />
                </span>

                <div class="assign-assessment-plan__copy">
                  <div class="assign-assessment-plan__head">
                    <div>
                      <h4>{{ item.title }}</h4>
                      <p>{{ item.meta }}</p>
                    </div>
                    <span>{{ item.badge }}</span>
                  </div>

                  <p>{{ item.description }}</p>

                  <div class="assign-assessment-plan__details">
                    <strong>{{ item.duration }}</strong>
                    <span>Duration</span>
                    <strong>{{ item.difficulty }}</strong>
                    <span>Difficulty</span>
                    <strong>{{ item.result }}</strong>
                    <span>Results</span>
                  </div>
                </div>

                <button type="button" class="assign-assessment-plan__remove" aria-label="Remove assessment" @click="removePlanItem(item.id)">
                  <AppIcon name="close" :size="14" />
                </button>
              </article>

              <button class="assign-assessment-add" type="button" @click.stop="openLibrary">
                <AppIcon name="plus" :size="16" />
                <span>Add Assessment</span>
              </button>

              <footer class="assign-assessment-footer-note">
                <div>
                  <span><AppIcon name="clock" :size="14" /> Total estimated time: {{ estimatedTimeLabel }}</span>
                  <span><AppIcon name="checkCircle" :size="14" /> Evidence coverage after plan: 91%</span>
                </div>
                <button type="button" @click="clearPlan">Clear all</button>
              </footer>
            </section>
          </section>

          <aside class="assign-assessment-side">
            <section class="assign-assessment-side__section">
              <span class="assign-assessment-side__label">Delivery Settings</span>

              <div class="assign-assessment-field">
                <strong>When to send</strong>
                <div class="assign-assessment-radio-row">
                  <label><input v-model="sendTiming" type="radio" value="now"> <span>Send now</span></label>
                  <label><input v-model="sendTiming" type="radio" value="later"> <span>Schedule for later</span></label>
                </div>
              </div>

              <div class="assign-assessment-field">
                <strong>Due date</strong>
                <div class="assign-assessment-input">24 May 2026 <AppIcon name="calendar" :size="14" /></div>
              </div>

              <div class="assign-assessment-field">
                <strong>Time zone for deadlines</strong>
                <div class="assign-assessment-input">(GMT-04:00) Eastern Time (US &amp; Canada) <AppIcon name="chevronDown" :size="14" /></div>
              </div>

              <div class="assign-assessment-field">
                <strong>Automatic reminders</strong>
                <label class="assign-assessment-checkbox-row">
                  <input v-model="remindersEnabled" type="checkbox">
                  <span>Send reminders to candidate</span>
                </label>
                <div class="assign-assessment-input assign-assessment-input--small">Every 3 days (up to 3 times) <AppIcon name="chevronDown" :size="14" /></div>
              </div>

              <div class="assign-assessment-field">
                <strong>Candidate instructions (optional)</strong>
                <textarea rows="5">Please complete all the assigned assessments by the due date. Ensure a quiet environment and avoid using external help.</textarea>
                <small>129 / 500</small>
              </div>

              <div class="assign-assessment-field">
                <strong>Notify team</strong>
                <div class="assign-assessment-input">
                  <div class="assign-assessment-avatars">
                    <span>MC</span>
                    <span>EW</span>
                    <span>+2</span>
                  </div>
                  <AppIcon name="chevronDown" :size="14" />
                </div>
              </div>
            </section>

            <section class="assign-assessment-side__section">
              <span class="assign-assessment-side__label">Results &amp; Integrations</span>

              <article
                v-for="item in integrationItems"
                :key="item.title"
                class="assign-assessment-integration"
              >
                <span class="assign-assessment-integration__icon" :class="`tone-${item.tone}`">
                  <AppIcon :name="item.icon" :size="16" />
                </span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.note }}</p>
                </div>
                <em :class="`tone-${item.tone}`">{{ item.badge }}</em>
              </article>
            </section>

            <footer class="assign-assessment-side__footer">
              <button class="assign-assessment-side__cancel" type="button" @click="closeOverlay">Cancel</button>
              <button class="assign-assessment-side__submit" type="button" @click="assignAndSend">
                <span>Assign &amp; Send Assessments</span>
              </button>
            </footer>
          </aside>
        </div>
      </section>

      <div v-if="libraryOpen" class="assessment-library-layer" @click.self="closeLibrary">
        <section class="assessment-library-modal" @click.stop>
          <header class="assessment-library-modal__header">
            <div>
              <h3>Add Assessment</h3>
              <p>Browse, preview and add assessments to your plan.</p>
            </div>

            <button class="assessment-library-modal__close" type="button" aria-label="Close add assessment library" @click="closeLibrary">
              <AppIcon name="close" :size="18" />
            </button>
          </header>

          <div class="assessment-library-modal__body">
            <section class="assessment-library-main">
              <div class="assessment-library-search">
                <div class="assessment-library-search__box">
                  <AppIcon name="search" :size="16" />
                  <span>Search by assessment, skill, provider or keyword...</span>
                  <kbd>K</kbd>
                </div>
                <button class="assessment-library-search__filter" type="button">
                  <AppIcon name="filter" :size="14" />
                  <span>Filters</span>
                  <AppIcon name="chevronDown" :size="14" />
                </button>
              </div>

              <div class="assessment-library-filter-row">
                <button
                  v-for="filter in libraryFilters"
                  :key="filter"
                  type="button"
                  class="assessment-library-filter-chip"
                  :class="{ 'is-active': filter === 'Recommended' }"
                >
                  <AppIcon v-if="filter === 'Recommended'" name="spark" :size="12" />
                  <span>{{ filter }}</span>
                </button>
                <button type="button" class="assessment-library-filter-chip">
                  <span>More</span>
                  <AppIcon name="chevronDown" :size="12" />
                </button>
              </div>

              <div class="assessment-library-results-head">
                <strong>35 assessments found</strong>
                <div>
                  <span>Sort by: Relevance</span>
                  <button type="button"><AppIcon name="grid" :size="14" /></button>
                  <button type="button"><AppIcon name="list" :size="14" /></button>
                </div>
              </div>

              <article
                v-for="item in assessmentLibrary"
                :key="item.id"
                class="assessment-library-card"
              >
                <div class="assessment-library-card__icon" :class="`tone-${item.tone}`">
                  <AppIcon :name="item.icon" :size="20" />
                </div>

                <div class="assessment-library-card__copy">
                  <div class="assessment-library-card__copy-head">
                    <div>
                      <h4>{{ item.title }}</h4>
                      <p>{{ item.provider }}</p>
                    </div>
                    <span v-if="item.recommended">Recommended</span>
                  </div>
                  <p>{{ item.description }}</p>
                </div>

                <div class="assessment-library-card__meta">
                  <span><AppIcon name="clock" :size="13" /> {{ item.duration }}</span>
                  <span><AppIcon name="refresh" :size="13" /> {{ item.result }}</span>
                  <span><AppIcon name="users" :size="13" /> {{ item.usage }}</span>
                </div>

                <div class="assessment-library-card__covers">
                  <small>Covers</small>
                  <div>
                    <span v-for="tag in item.covers" :key="tag">{{ tag }}</span>
                  </div>
                </div>

                <div class="assessment-library-card__actions">
                  <button type="button" class="assessment-library-card__preview">Preview</button>
                  <button
                    type="button"
                    class="assessment-library-card__add"
                    :class="{ 'is-selected': librarySelectedIds.includes(item.id) }"
                    @click="toggleLibraryAssessment(item.id)"
                  >
                    <span>{{ librarySelectedIds.includes(item.id) ? 'Added' : '+ Add' }}</span>
                  </button>
                </div>
              </article>

              <footer class="assessment-library-pagination">
                <div>
                  <button type="button"><AppIcon name="chevronLeft" :size="14" /></button>
                  <button type="button" class="is-active">1</button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <button type="button">...</button>
                  <button type="button">5</button>
                  <button type="button"><AppIcon name="chevronRight" :size="14" /></button>
                </div>
                <span>Showing 1-10 of 35</span>
              </footer>
            </section>

            <aside class="assessment-library-side">
              <div class="assessment-library-side__head">
                <strong>Assessment Plan</strong>
                <span>{{ planCount }}</span>
              </div>

              <div class="assessment-library-side__plan">
                <article
                  v-for="item in planItems"
                  :key="item.id"
                  class="assessment-library-side__plan-item"
                >
                  <span class="assessment-library-side__order">{{ item.order }}</span>
                  <span class="assessment-library-side__item-icon" :class="`tone-${item.tone}`">
                    <AppIcon :name="item.icon" :size="16" />
                  </span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.duration }} - {{ item.meta.split('-').pop()?.trim() ?? 'External' }}</small>
                  </div>
                  <button type="button" @click="removePlanItem(item.id)">
                    <AppIcon name="close" :size="12" />
                  </button>
                </article>

                <button type="button" class="assessment-library-side__add-another" @click="closeLibrary">
                  <AppIcon name="plus" :size="14" />
                  <span>Add another assessment</span>
                </button>
              </div>

              <div class="assessment-library-side__summary">
                <h4>Plan Summary</h4>
                <div><span>Total assessments</span><strong>{{ planCount }}</strong></div>
                <div><span>Estimated total time</span><strong>{{ estimatedTimeLabel }}</strong></div>
                <div><span>Evidence coverage</span><strong>91%</strong></div>
                <div class="assessment-library-side__coverage-bar"><span /></div>
                <small>Great coverage!</small>
              </div>
            </aside>
          </div>

          <footer class="assessment-library-modal__footer">
            <button type="button" class="assessment-library-modal__cancel" @click="closeLibrary">Cancel</button>
            <button type="button" class="assessment-library-modal__submit" @click="addSelectedAssessments">
              <AppIcon name="checkCircle" :size="14" />
              <span>Add to Plan ({{ selectedLibraryItems.length }})</span>
            </button>
          </footer>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.assign-assessment-overlay {
  position: fixed;
  inset: 0;
  z-index: 1600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(10px);
}

.assign-assessment-modal,
.assessment-library-modal {
  overflow: hidden;
  border: 1px solid #dbe5f3;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.22);
}

.assign-assessment-modal {
  position: relative;
  width: min(1280px, 100%);
  max-height: min(94vh, 1120px);
  transition: opacity 0.18s ease, transform 0.18s ease, filter 0.18s ease;
}

.assign-assessment-modal.is-dimmed {
  opacity: 0.22;
  transform: scale(0.985);
  filter: blur(2px);
  pointer-events: none;
}

.assign-assessment-modal__header,
.assessment-library-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 32px 22px;
  border-bottom: 1px solid #e9eef8;
}

.assign-assessment-modal__title {
  display: flex;
  gap: 16px;
}

.assign-assessment-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: #5967ff;
  background: #eef2ff;
}

.assign-assessment-modal__title h2,
.assessment-library-modal__header h3 {
  margin: 0;
  line-height: 1.08;
  color: #1c274c;
}

.assign-assessment-modal__title h2 {
  font-size: 2rem;
}

.assessment-library-modal__header h3 {
  font-size: 1.8rem;
}

.assign-assessment-modal__title p,
.assessment-library-modal__header p {
  margin: 6px 0 0;
  font-size: 1rem;
  color: #7081a3;
}

.assign-assessment-modal__header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.assign-assessment-modal__ghost-button,
.assign-assessment-modal__close,
.assessment-library-modal__close {
  border: 1px solid #cfdaf0;
  background: #fff;
}

.assign-assessment-modal__ghost-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 14px;
  color: #5664ff;
  font-size: 0.98rem;
  font-weight: 700;
}

.assign-assessment-modal__close,
.assessment-library-modal__close {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: #8b98b3;
}

.assign-assessment-modal__body {
  display: grid;
  grid-template-columns: minmax(0, 1.85fr) minmax(320px, 0.95fr);
  max-height: calc(94vh - 108px);
  overflow: auto;
}

.assign-assessment-main {
  padding: 28px;
  border-right: 1px solid #e9eef8;
}

.assign-assessment-side {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
}

.assign-assessment-candidate {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 22px;
}

.assign-assessment-candidate__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #5b5fdf, #e96bb2);
}

.assign-assessment-candidate__name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.assign-assessment-candidate__name h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #18284d;
}

.assign-assessment-candidate__name span {
  padding: 6px 10px;
  border-radius: 999px;
  color: #ff5aa6;
  font-size: 0.78rem;
  font-weight: 800;
  background: #ffeaf4;
}

.assign-assessment-candidate__copy > p {
  margin: 4px 0 0;
  color: #6d7c99;
}

.assign-assessment-candidate__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  color: #8090ad;
  font-size: 0.92rem;
}

.assign-assessment-candidate__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.assign-assessment-recommendation {
  padding: 24px;
  border: 1px solid #dde6f6;
  border-radius: 24px;
  background: linear-gradient(180deg, #eef3ff 0%, #f8fbff 100%);
}

.assign-assessment-recommendation__title-row p {
  margin: 10px 0 0;
  color: #66799f;
  line-height: 1.65;
}

.assign-assessment-recommendation__title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4d58ff;
}

.assign-assessment-recommendation__title h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #4d58ff;
}

.assign-assessment-recommendation__title span {
  padding: 7px 10px;
  border-radius: 999px;
  color: #16914d;
  font-size: 0.75rem;
  font-weight: 800;
  background: #def7e7;
}

.assign-assessment-recommendation__stats {
  display: grid;
  grid-template-columns: 1.15fr 0.9fr 0.9fr 0.9fr;
  gap: 22px;
  margin-top: 22px;
}

.assign-assessment-recommendation__stats small,
.assign-assessment-progress small,
.assign-assessment-recommendation__metrics small {
  display: block;
  color: #8a98b6;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.assign-assessment-recommendation__stats ul {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.assign-assessment-recommendation__stats li {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #28385a;
}

.assign-assessment-recommendation__stats i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.tone-green {
  color: #1ca757;
  background: #1ca757;
}

.tone-orange {
  color: #ff8a2a;
  background: #ff8a2a;
}

.tone-violet {
  color: #5b5fdf;
}

.tone-pink {
  color: #ef4f88;
}

.tone-blue {
  color: #3e69ff;
}

.tone-slate {
  color: #1f2b4d;
}

.assign-assessment-progress strong,
.assign-assessment-recommendation__metrics strong {
  display: block;
  margin-top: 12px;
  color: #1d2b4b;
  font-size: 1.05rem;
}

.assign-assessment-progress__bar,
.assessment-library-side__coverage-bar {
  height: 8px;
  margin-top: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: #dfe6f3;
}

.assign-assessment-progress__bar span,
.assessment-library-side__coverage-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #5c63ff;
}

.assign-assessment-progress__bar.is-green span,
.assessment-library-side__coverage-bar span {
  background: linear-gradient(90deg, #27c86d 0%, #15a34a 100%);
}

.assign-assessment-recommendation__actions {
  display: flex;
  gap: 14px;
  margin-top: 26px;
}

.assign-assessment-recommendation__submit,
.assign-assessment-side__submit,
.assessment-library-card__add.is-selected,
.assessment-library-modal__submit {
  color: #fff;
  background: linear-gradient(135deg, #f06bad 0%, #ea5ca2 100%);
  box-shadow: 0 18px 28px rgba(240, 93, 169, 0.22);
}

.assign-assessment-recommendation__submit,
.assign-assessment-recommendation__secondary,
.assign-assessment-add,
.assign-assessment-side__cancel,
.assign-assessment-side__submit,
.assessment-library-modal__cancel,
.assessment-library-modal__submit,
.assessment-library-card__preview,
.assessment-library-card__add,
.assessment-library-search__filter,
.assessment-library-filter-chip,
.assessment-library-side__add-another {
  border-radius: 16px;
  font-size: 0.98rem;
  font-weight: 800;
}

.assign-assessment-recommendation__submit,
.assign-assessment-recommendation__secondary,
.assign-assessment-add,
.assign-assessment-side__cancel,
.assign-assessment-side__submit,
.assessment-library-modal__cancel,
.assessment-library-modal__submit {
  padding: 16px 18px;
}

.assign-assessment-recommendation__secondary,
.assign-assessment-add,
.assign-assessment-side__cancel,
.assessment-library-modal__cancel,
.assessment-library-card__preview,
.assessment-library-card__add,
.assessment-library-search__filter,
.assessment-library-filter-chip,
.assessment-library-side__add-another {
  border: 1px solid #d3ddf2;
  color: #25375a;
  background: #fff;
}

.assign-assessment-plan {
  margin-top: 26px;
}

.assign-assessment-plan__header {
  margin-bottom: 14px;
  color: #9aa7c1;
  font-size: 0.84rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.assign-assessment-plan__item {
  display: grid;
  grid-template-columns: 20px 40px 54px minmax(0, 1fr) 24px;
  gap: 16px;
  align-items: start;
  padding: 20px 18px;
  border: 1px solid #dfe7f5;
  border-radius: 24px;
  background: #fff;
}

.assign-assessment-plan__item + .assign-assessment-plan__item {
  margin-top: 16px;
}

.assign-assessment-plan__drag,
.assign-assessment-plan__remove,
.assessment-library-side__plan-item button,
.assessment-library-pagination button,
.assessment-library-results-head button {
  border: 0;
  background: transparent;
}

.assign-assessment-plan__drag,
.assign-assessment-plan__remove {
  color: #a1aec8;
}

.assign-assessment-plan__order {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  color: #fff;
  font-weight: 800;
}

.assign-assessment-plan__order.tone-green {
  background: #26bf67;
}

.assign-assessment-plan__order.tone-orange {
  background: #ff9337;
}

.assign-assessment-plan__order.tone-violet {
  background: #5b5fdf;
}

.assign-assessment-plan__icon,
.assessment-library-card__icon,
.assessment-library-side__item-icon,
.assign-assessment-integration__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #f6f8fe;
}

.assign-assessment-plan__icon,
.assessment-library-card__icon,
.assessment-library-side__item-icon {
  width: 50px;
  height: 50px;
}

.assign-assessment-plan__icon.tone-green,
.assessment-library-card__icon.tone-green,
.assessment-library-side__item-icon.tone-green {
  color: #1ca757;
  background: #ecfdf3;
}

.assign-assessment-plan__icon.tone-orange,
.assessment-library-card__icon.tone-orange,
.assessment-library-side__item-icon.tone-orange {
  color: #ff8a2a;
  background: #fff4e8;
}

.assign-assessment-plan__icon.tone-violet,
.assessment-library-card__icon.tone-violet,
.assessment-library-side__item-icon.tone-violet {
  color: #5b5fdf;
  background: #eef1ff;
}

.assign-assessment-plan__icon.tone-pink,
.assessment-library-card__icon.tone-pink,
.assessment-library-side__item-icon.tone-pink {
  color: #ef4f88;
  background: #ffedf4;
}

.assign-assessment-plan__icon.tone-slate,
.assessment-library-card__icon.tone-slate,
.assessment-library-side__item-icon.tone-slate {
  color: #1f2b4d;
}

.assign-assessment-plan__head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

.assign-assessment-plan__head h4 {
  margin: 0;
  color: #223255;
  font-size: 1.05rem;
}

.assign-assessment-plan__head p {
  margin: 6px 0 0;
  color: #94a2be;
}

.assign-assessment-plan__head span {
  align-self: start;
  padding: 8px 12px;
  border-radius: 999px;
  color: #1ca757;
  font-size: 0.8rem;
  font-weight: 800;
  background: #e8f9ef;
}

.assign-assessment-plan__copy > p {
  margin: 14px 0 0;
  color: #5f7093;
  line-height: 1.55;
}

.assign-assessment-plan__details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-top: 16px;
}

.assign-assessment-plan__details strong {
  color: #223255;
}

.assign-assessment-plan__details span {
  color: #8b98b4;
}

.assign-assessment-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 18px;
  border-style: dashed;
  color: #4e60ff;
}

.assign-assessment-footer-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  color: #7b89a7;
}

.assign-assessment-footer-note div {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.assign-assessment-footer-note span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.assign-assessment-footer-note button {
  border: 0;
  color: #ff5d5d;
  font-weight: 700;
  background: transparent;
}

.assign-assessment-side__label {
  display: block;
  margin-bottom: 16px;
  color: #97a3bb;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.assign-assessment-field + .assign-assessment-field {
  margin-top: 18px;
}

.assign-assessment-field strong {
  display: block;
  margin-bottom: 10px;
  color: #223255;
}

.assign-assessment-radio-row,
.assign-assessment-checkbox-row {
  display: flex;
  gap: 18px;
  color: #556784;
}

.assign-assessment-input,
textarea {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d7e1f3;
  border-radius: 14px;
  color: #223255;
  background: #fff;
}

textarea {
  min-height: 128px;
  resize: none;
  line-height: 1.55;
}

.assign-assessment-input--small {
  margin-top: 10px;
}

.assign-assessment-field small {
  display: block;
  margin-top: 8px;
  color: #99a5be;
  text-align: right;
}

.assign-assessment-avatars {
  display: flex;
  align-items: center;
}

.assign-assessment-avatars span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: -6px;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  background: linear-gradient(135deg, #5b5fdf, #df7fae);
}

.assign-assessment-integration {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 16px;
  border: 1px solid #dfe7f5;
  border-radius: 20px;
  background: #fff;
}

.assign-assessment-integration + .assign-assessment-integration {
  margin-top: 14px;
}

.assign-assessment-integration__icon {
  width: 50px;
  height: 50px;
}

.assign-assessment-integration strong {
  display: block;
  color: #223255;
}

.assign-assessment-integration p {
  margin: 4px 0 0;
  color: #7d8ba8;
  font-size: 0.9rem;
}

.assign-assessment-integration em {
  font-style: normal;
  font-size: 0.76rem;
  font-weight: 800;
}

.assign-assessment-side__footer,
.assessment-library-modal__footer {
  display: grid;
  gap: 14px;
}

.assign-assessment-side__footer {
  grid-template-columns: 1fr 1.5fr;
  margin-top: auto;
  padding-top: 24px;
}

.assessment-library-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(6px);
}

.assessment-library-modal {
  position: relative;
  width: min(1320px, 100%);
  max-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.assessment-library-modal__body {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) 330px;
  min-height: 0;
  flex: 1 1 auto;
}

.assessment-library-main {
  min-height: 0;
  padding: 24px 28px;
  overflow: auto;
}

.assessment-library-side {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 0;
  padding: 24px 28px;
  overflow: auto;
  border-left: 1px solid #e9eef8;
  background: #fafcff;
}

.assessment-library-search {
  display: flex;
  gap: 14px;
}

.assessment-library-search__box {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 auto;
  padding: 0 16px;
  border: 1px solid #d8e0f2;
  border-radius: 16px;
  color: #7a88a6;
  background: #fff;
}

.assessment-library-search__box span {
  flex: 1 1 auto;
  padding: 15px 0;
}

.assessment-library-search__box kbd {
  padding: 3px 8px;
  border: 1px solid #d8e0f2;
  border-radius: 8px;
  color: #90a0bd;
  font-size: 0.8rem;
  background: #f7f9fe;
}

.assessment-library-search__filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
}

.assessment-library-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.assessment-library-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 999px;
  color: #4f5f81;
  font-size: 0.92rem;
}

.assessment-library-filter-chip.is-active {
  color: #f05d9a;
  background: #ffeff6;
}

.assessment-library-results-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: 28px 0 18px;
}

.assessment-library-results-head strong {
  color: #223255;
  font-size: 1.15rem;
}

.assessment-library-results-head div {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #7a88a6;
}

.assessment-library-results-head button {
  width: 34px;
  height: 34px;
  border: 1px solid #d8e0f2;
  border-radius: 10px;
  color: #7f8ead;
  background: #fff;
}

.assessment-library-card {
  display: grid;
  grid-template-columns: 52px minmax(0, 1.2fr) 160px 190px 126px;
  gap: 18px;
  align-items: start;
  padding: 20px;
  border: 1px solid #e0e8f7;
  border-radius: 20px;
  background: #fff;
}

.assessment-library-card + .assessment-library-card {
  margin-top: 18px;
}

.assessment-library-card__copy-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 10px;
}

.assessment-library-card__copy-head h4 {
  margin: 0;
  color: #223255;
}

.assessment-library-card__copy-head p {
  margin: 6px 0 0;
  color: #8d9ab4;
}

.assessment-library-card__copy-head span {
  padding: 7px 10px;
  border-radius: 999px;
  color: #1ca757;
  font-size: 0.75rem;
  font-weight: 800;
  background: #eafaf1;
}

.assessment-library-card__copy > p {
  margin: 12px 0 0;
  color: #5f7093;
  line-height: 1.55;
}

.assessment-library-card__meta {
  display: grid;
  gap: 10px;
  color: #7383a3;
  font-size: 0.92rem;
}

.assessment-library-card__meta span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.assessment-library-card__covers small {
  display: block;
  margin-bottom: 10px;
  color: #97a3bb;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.assessment-library-card__covers div,
.assessment-library-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.assessment-library-card__covers span {
  padding: 8px 10px;
  border-radius: 10px;
  color: #596a90;
  font-size: 0.82rem;
  background: #f4f7fd;
}

.assessment-library-card__actions {
  justify-content: flex-end;
}

.assessment-library-card__preview,
.assessment-library-card__add {
  min-width: 108px;
  padding: 11px 14px;
}

.assessment-library-side__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.assessment-library-side__head strong {
  color: #223255;
  font-size: 1.2rem;
}

.assessment-library-side__head span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 999px;
  color: #ff5aa6;
  font-size: 0.8rem;
  font-weight: 800;
  background: #ffeaf4;
}

.assessment-library-side__plan {
  display: grid;
  gap: 12px;
}

.assessment-library-side__plan-item {
  display: grid;
  grid-template-columns: 28px 44px minmax(0, 1fr) 18px;
  gap: 12px;
  align-items: center;
  padding: 14px;
  border: 1px solid #e1e8f5;
  border-radius: 18px;
  background: #fff;
}

.assessment-library-side__order {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #ff5aa6;
  font-size: 0.8rem;
  font-weight: 800;
  background: #ffeaf4;
}

.assessment-library-side__plan-item strong {
  display: block;
  color: #25375a;
  font-size: 0.94rem;
}

.assessment-library-side__plan-item small {
  display: block;
  margin-top: 4px;
  color: #8f9dbc;
}

.assessment-library-side__add-another {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 16px;
}

.assessment-library-side__summary {
  padding: 18px;
  border: 1px solid #e1e8f5;
  border-radius: 20px;
  background: #fff;
}

.assessment-library-side__summary h4 {
  margin: 0 0 14px;
  color: #223255;
}

.assessment-library-side__summary div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #7383a3;
}

.assessment-library-side__summary div + div {
  margin-top: 10px;
}

.assessment-library-side__summary strong {
  color: #223255;
}

.assessment-library-side__summary small {
  display: block;
  margin-top: 10px;
  color: #1ca757;
  font-weight: 700;
}

.assessment-library-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 24px;
  color: #7f8ead;
}

.assessment-library-pagination div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.assessment-library-pagination button {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #d8e0f2;
  border-radius: 10px;
  color: #7f8ead;
  background: #fff;
}

.assessment-library-pagination button.is-active {
  color: #f05d9a;
  background: #ffeff6;
}

.assessment-library-modal__footer {
  grid-template-columns: 1fr 1.2fr;
  padding: 22px 28px 28px;
  border-top: 1px solid #e9eef8;
  background: #fff;
}

.assessment-library-modal__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 1180px) {
  .assign-assessment-modal__body,
  .assessment-library-modal__body {
    grid-template-columns: 1fr;
  }

  .assign-assessment-main {
    border-right: 0;
    border-bottom: 1px solid #e9eef8;
  }

  .assessment-library-side {
    border-left: 0;
    border-top: 1px solid #e9eef8;
  }

  .assign-assessment-recommendation__stats {
    grid-template-columns: 1fr 1fr;
  }

  .assessment-library-card {
    grid-template-columns: 52px minmax(0, 1fr);
  }

  .assessment-library-card__meta,
  .assessment-library-card__covers,
  .assessment-library-card__actions {
    grid-column: 2;
  }
}

@media (max-width: 860px) {
  .assign-assessment-overlay,
  .assessment-library-layer {
    padding: 12px;
  }

  .assign-assessment-modal,
  .assessment-library-modal {
    max-height: 96vh;
    border-radius: 22px;
  }

  .assign-assessment-modal__header,
  .assign-assessment-main,
  .assign-assessment-side,
  .assessment-library-modal__header,
  .assessment-library-main,
  .assessment-library-side,
  .assessment-library-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .assign-assessment-modal__header,
  .assign-assessment-candidate,
  .assign-assessment-recommendation__actions,
  .assign-assessment-footer-note,
  .assign-assessment-footer-note div,
  .assessment-library-search,
  .assessment-library-results-head {
    flex-direction: column;
    align-items: stretch;
  }

  .assign-assessment-recommendation__stats,
  .assign-assessment-side__footer,
  .assessment-library-modal__footer {
    grid-template-columns: 1fr;
  }

  .assign-assessment-plan__item {
    grid-template-columns: 34px 44px minmax(0, 1fr);
  }

  .assign-assessment-plan__drag,
  .assign-assessment-plan__remove {
    display: none;
  }
}
</style>
