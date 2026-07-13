<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Marvin McKinney',
  },
  candidateRole: {
    type: String,
    default: 'Senior Frontend Developer',
  },
  candidateStage: {
    type: String,
    default: 'Validation',
  },
})

const emit = defineEmits(['close'])

const previousBodyOverflow = ref('')
const previousHtmlOverflow = ref('')
const overlayOpenedAt = ref(0)
const bodyRef = ref(null)

const recommendationScore = 94

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const topMeta = computed(() => ([
  { label: props.candidateRole, note: 'Engineering - San Francisco, CA - Full-time', icon: 'document' },
  { label: '3 Finalists', note: 'Top candidates', icon: 'users' },
  { label: '8 Evaluation areas', note: 'Based on your criteria', icon: 'clock' },
  { label: props.candidateName, note: 'AI Recommendation', icon: 'sparkles', accent: true },
]))

const finalists = computed(() => ([
  { rank: 1, name: props.candidateName, tone: 'green', verdict: 'Strong Hire', score: 94, initials: candidateInitials.value, delta: '+0' },
  { rank: 2, name: 'Sarah Johnson', tone: 'green', verdict: 'Strong Hire', score: 87, initials: 'SJ', delta: '-7' },
  { rank: 3, name: 'David Wilson', tone: 'orange', verdict: 'Hire', score: 72, initials: 'DW', delta: '-22' },
]))

const whyBest = [
  'Highest overall fit across all areas',
  'Strongest in technical skills (95%)',
  'Top reference match among finalists',
  'Lowest hiring risk',
  'All requirements fully met',
]

const glanceRows = [
  ['Overall Fit', '94%', '87%', '72%'],
  ['Technical Skills', '95%', '88%', '72%'],
  ['Communication', '91%', '86%', '72%'],
  ['Leadership', '91%', '88%', '80%'],
  ['Hiring Risk', 'Low', 'Medium', 'High'],
  ['References', '5 / 5', '4 / 5', '4 / 5'],
]

const evaluationAreas = [
  { label: 'Technical Skills', values: [95, 88, 72] },
  { label: 'Problem Solving', values: [92, 89, 75] },
  { label: 'Experience Relevance', values: [90, 87, 70] },
  { label: 'Communication', values: [91, 86, 72] },
  { label: 'Culture Fit', values: [91, 89, 80] },
  { label: 'Assessments', values: [100, 90, 45] },
  { label: 'References', values: [100, 90, 85] },
  { label: 'Background Check', values: [100, 100, 100] },
]

const categoryWinners = [
  ['Technical Skills', props.candidateName],
  ['Problem Solving', props.candidateName],
  ['Experience Relevance', props.candidateName],
  ['Communication', props.candidateName],
  ['Culture Fit', 'David Wilson'],
  ['Assessments', props.candidateName],
  ['References', props.candidateName],
  ['Background Check', 'Tie'],
]

const strengthsSnapshot = computed(() => ([
  {
    name: props.candidateName,
    tone: 'pink',
    items: ['Best technical expertise', 'Strongest references', 'Lowest hiring risk', 'All requirements met'],
  },
  {
    name: 'Sarah Johnson',
    tone: 'blue',
    items: ['Strong alternative', 'Best communication skills', 'Excellent culture fit', 'Slightly lower technical score'],
  },
  {
    name: 'David Wilson',
    tone: 'orange',
    items: ['Strong leadership potential', 'Good assessment scores', 'Lower technical depth', 'Higher hiring risk'],
  },
]))

const whyOthersNotBest = [
  {
    name: 'Sarah Johnson',
    reasons: ['Lower technical skills (88% vs 95%)', 'Fewer assessment points', 'References not as strong'],
  },
  {
    name: 'David Wilson',
    reasons: ['Technical skills significantly lower (72%)', 'Higher hiring risk', 'Lower alignment with role requirements'],
  },
]

const headToHeadRows = [
  ['Technical Skills', '+7%', '95%', '88%', '89%'],
  ['Problem Solving', '+3%', '92%', '89%', '89%'],
  ['Communication', '+5%', '91%', '86%', '72%'],
  ['Culture Fit', '+1%', '91%', '89%', '84%'],
  ['Overall Fit', '+7%', '94%', '87%', '87%'],
]

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

function handleBackdropClick() {
  if (!overlayOpenedAt.value || Date.now() - overlayOpenedAt.value < 180) {
    return
  }

  closeOverlay()
}

function scoreWidth(value) {
  return `${value}%`
}

watch(
  () => props.open,
  async (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      overlayOpenedAt.value = Date.now()
      await nextTick()

      if (bodyRef.value) {
        bodyRef.value.scrollTop = 0
      }
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-finalists-overlay" @click.self="handleBackdropClick">
      <section class="ai-finalists-modal">
        <header class="ai-finalists-head">
          <div>
            <div class="ai-finalists-head__title">
              <span class="ai-finalists-head__icon">
                <AppIcon name="compare" :size="16" />
              </span>
              <h2>AI Compare Finalists</h2>
              <em>AI</em>
            </div>
            <p>Compare your top candidates side by side to make the best hiring decision.</p>
          </div>

          <div class="ai-finalists-head__actions">
            <button type="button" class="ai-finalists-download">
              <AppIcon name="document" :size="14" />
              <span>Download comparison report</span>
            </button>
            <button class="ai-finalists-close" type="button" aria-label="Close AI Compare Finalists" @click="closeOverlay">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <div ref="bodyRef" class="ai-finalists-body">
          <section class="ai-finalists-meta">
            <article v-for="item in topMeta" :key="item.label" :class="{ 'is-accent': item.accent }">
              <span><AppIcon :name="item.icon" :size="14" /></span>
              <div>
                <strong>{{ item.label }}</strong>
                <small>{{ item.note }}</small>
              </div>
            </article>
          </section>

          <div class="ai-finalists-top-grid">
            <section class="ai-finalists-card">
              <div class="ai-finalists-card__head">
                <strong>Finalist ranking</strong>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="ai-finalists-ranking">
                <article v-for="item in finalists" :key="item.rank">
                  <span class="ai-finalists-ranking__place">{{ item.rank }}</span>
                  <span class="ai-finalists-ranking__avatar">{{ item.initials }}</span>
                  <div class="ai-finalists-ranking__identity">
                    <strong>{{ item.name }}</strong>
                    <small :class="`is-${item.tone}`">{{ item.verdict }}</small>
                  </div>
                  <div class="ai-finalists-ranking__score">
                    <strong :class="item.rank === 1 ? 'is-pink' : ''">{{ item.score }}%</strong>
                    <small>Overall Fit</small>
                  </div>
                </article>
              </div>

              <button type="button" class="ai-finalists-link">
                <span>View full scoring model</span>
                <AppIcon name="external-link" :size="12" />
              </button>
            </section>

            <section class="ai-finalists-card ai-finalists-card--hero">
              <div class="ai-finalists-hero">
                <div class="ai-finalists-hero__badge">AI Recommended</div>
                <div class="ai-finalists-hero__main">
                  <span class="ai-finalists-hero__avatar">{{ candidateInitials }}</span>
                  <div class="ai-finalists-hero__identity">
                    <strong>{{ candidateName }}</strong>
                    <small>Strong Hire</small>
                  </div>
                  <div class="ai-finalists-hero__score">
                    <strong>{{ recommendationScore }}%</strong>
                    <span>Overall Fit</span>
                    <div class="ai-finalists-hero__stars">
                      <AppIcon v-for="index in 5" :key="index" name="star" :size="12" />
                    </div>
                  </div>
                </div>

                <div class="ai-finalists-hero__why">
                  <strong>Why {{ candidateName.split(' ')[0] }} is the best choice</strong>
                  <ul>
                    <li v-for="item in whyBest" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>

              <footer class="ai-finalists-hero__foot">
                <span>AI Confidence in recommendation</span>
                <strong>96%</strong>
              </footer>
            </section>

            <section class="ai-finalists-card">
              <div class="ai-finalists-card__head">
                <strong>At a glance</strong>
              </div>

              <div class="ai-finalists-glance">
                <header>
                  <span />
                  <strong>{{ candidateName.split(' ')[0] }}</strong>
                  <strong>Sarah</strong>
                  <strong>David</strong>
                </header>
                <article v-for="row in glanceRows" :key="row[0]">
                  <span>{{ row[0] }}</span>
                  <strong>{{ row[1] }}</strong>
                  <strong>{{ row[2] }}</strong>
                  <strong>{{ row[3] }}</strong>
                </article>
              </div>
            </section>
          </div>

          <div class="ai-finalists-middle-grid">
            <section class="ai-finalists-card">
              <div class="ai-finalists-card__head">
                <strong>Evaluation areas</strong>
                <div class="ai-finalists-mini-legend">
                  <span>{{ candidateName.split(' ')[0] }}</span>
                  <span>Sarah Johnson</span>
                  <span>David Wilson</span>
                </div>
              </div>

              <div class="ai-finalists-evaluation">
                <article v-for="area in evaluationAreas" :key="area.label">
                  <div class="ai-finalists-evaluation__label">{{ area.label }}</div>
                  <div v-for="(value, index) in area.values" :key="`${area.label}-${index}`" class="ai-finalists-evaluation__metric">
                    <div class="ai-finalists-evaluation__bar">
                      <span :class="index === 0 ? 'is-pink' : ''" :style="{ width: scoreWidth(value) }" />
                    </div>
                    <strong :class="index === 0 ? 'is-pink' : ''">{{ value }}%</strong>
                  </div>
                </article>
              </div>
            </section>

            <section class="ai-finalists-card">
              <div class="ai-finalists-card__head">
                <strong>Category winner</strong>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="ai-finalists-winners">
                <article v-for="item in categoryWinners" :key="item[0]">
                  <span>{{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                </article>
              </div>
            </section>
          </div>

          <div class="ai-finalists-bottom-grid">
            <section class="ai-finalists-card">
              <div class="ai-finalists-card__head">
                <strong>Candidate strengths snapshot</strong>
              </div>

              <div class="ai-finalists-snapshots">
                <article v-for="item in strengthsSnapshot" :key="item.name">
                  <div class="ai-finalists-snapshots__head">
                    <span :class="`is-${item.tone}`">{{ item.name.slice(0, 2).toUpperCase() }}</span>
                    <strong>{{ item.name }}</strong>
                  </div>
                  <ul>
                    <li v-for="point in item.items" :key="point">{{ point }}</li>
                  </ul>
                </article>
              </div>
            </section>

            <section class="ai-finalists-card">
              <div class="ai-finalists-card__head">
                <strong>Why others are not the best choice</strong>
              </div>

              <div class="ai-finalists-why-not">
                <article v-for="item in whyOthersNotBest" :key="item.name">
                  <strong>{{ item.name }}</strong>
                  <ul>
                    <li v-for="point in item.reasons" :key="point">{{ point }}</li>
                  </ul>
                </article>
              </div>
            </section>

            <section class="ai-finalists-card">
              <div class="ai-finalists-card__head">
                <strong>Head-to-head comparison</strong>
              </div>

              <div class="ai-finalists-headtohead">
                <div class="ai-finalists-headtohead__controls">
                  <span>{{ candidateName }}</span>
                  <small>vs</small>
                  <span>Sarah Johnson</span>
                </div>

                <article v-for="row in headToHeadRows" :key="row[0]">
                  <div class="ai-finalists-headtohead__top">
                    <span>{{ row[0] }}</span>
                    <em>{{ row[1] }}</em>
                  </div>
                  <div class="ai-finalists-headtohead__bars">
                    <strong class="is-pink">{{ row[2] }}</strong>
                    <div class="ai-finalists-headtohead__bar"><span class="is-pink" :style="{ width: row[2] }" /></div>
                    <strong>{{ row[3] }}</strong>
                    <div class="ai-finalists-headtohead__bar"><span :style="{ width: row[3] }" /></div>
                    <strong>{{ row[4] }}</strong>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>

        <footer class="ai-finalists-foot">
          <div class="ai-finalists-foot__summary">
            <div>
              <small>Bottom line</small>
              <strong>{{ candidateName }} is the strongest candidate for this role.</strong>
              <span>He consistently outperformed other finalists across key areas.</span>
            </div>
          </div>

          <div class="ai-finalists-foot__actions">
            <button type="button" class="ai-finalists-primary">Move {{ candidateName.split(' ')[0] }} to Offer</button>
            <button type="button" class="ai-finalists-secondary">View candidate profiles</button>
            <button type="button" class="ai-finalists-secondary">Share comparison</button>
            <button type="button" class="ai-finalists-close-button" @click="closeOverlay">Close</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-finalists-overlay {
  position: fixed;
  inset: 0;
  z-index: 2300;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(8px);
}

.ai-finalists-modal {
  width: min(1520px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e6edf8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 28px 72px rgba(15, 23, 42, 0.14);
}

.ai-finalists-head,
.ai-finalists-head__title,
.ai-finalists-head__actions,
.ai-finalists-card__head,
.ai-finalists-hero__main,
.ai-finalists-ranking article,
.ai-finalists-ranking__identity,
.ai-finalists-meta article,
.ai-finalists-foot,
.ai-finalists-foot__actions,
.ai-finalists-snapshots__head,
.ai-finalists-headtohead__top {
  display: flex;
  align-items: center;
}

.ai-finalists-head {
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
}

.ai-finalists-head__title {
  gap: 8px;
}

.ai-finalists-head__icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
}

.ai-finalists-head h2 {
  margin: 0;
  color: #243454;
  font-size: 1.05rem;
}

.ai-finalists-head em {
  padding: 2px 7px;
  border-radius: 999px;
  background: #fff0f7;
  color: #ff4f9c;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-finalists-head p {
  margin: 2px 0 0;
  color: #8390aa;
  font-size: 0.7rem;
}

.ai-finalists-head__actions {
  gap: 8px;
}

.ai-finalists-download,
.ai-finalists-close,
.ai-finalists-primary,
.ai-finalists-secondary,
.ai-finalists-close-button {
  border: 1px solid #dfe6f5;
  background: #fff;
  font: inherit;
  cursor: pointer;
}

.ai-finalists-download {
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #334155;
  font-size: 0.68rem;
  font-weight: 700;
}

.ai-finalists-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #66758f;
}

.ai-finalists-body {
  overflow: auto;
  padding: 14px;
  background:
    radial-gradient(circle at top left, rgba(255, 79, 156, 0.05), transparent 18%),
    linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.ai-finalists-meta,
.ai-finalists-top-grid,
.ai-finalists-middle-grid,
.ai-finalists-bottom-grid {
  display: grid;
  gap: 14px;
}

.ai-finalists-meta {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.ai-finalists-meta article,
.ai-finalists-card {
  border: 1px solid #edf2fb;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(27, 39, 76, 0.04);
}

.ai-finalists-meta article {
  gap: 10px;
  padding: 12px 14px;
}

.ai-finalists-meta article.is-accent {
  background: linear-gradient(135deg, rgba(255, 79, 156, 0.08) 0%, rgba(255, 255, 255, 1) 100%);
}

.ai-finalists-meta article span {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ff4f9c;
  flex: 0 0 28px;
}

.ai-finalists-meta strong {
  display: block;
  color: #243454;
  font-size: 0.72rem;
}

.ai-finalists-meta small {
  display: block;
  margin-top: 3px;
  color: #97a4ba;
  font-size: 0.62rem;
}

.ai-finalists-top-grid {
  grid-template-columns: 0.92fr 1.22fr 0.9fr;
  margin-top: 14px;
}

.ai-finalists-middle-grid {
  grid-template-columns: 1.4fr 0.62fr;
  margin-top: 14px;
}

.ai-finalists-bottom-grid {
  grid-template-columns: 1fr 0.82fr 0.92fr;
  margin-top: 14px;
}

.ai-finalists-card {
  padding: 14px 16px;
}

.ai-finalists-card__head {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.ai-finalists-card__head strong {
  color: #243454;
  font-size: 0.78rem;
}

.ai-finalists-mini-legend {
  display: inline-flex;
  gap: 10px;
  color: #97a4ba;
  font-size: 0.58rem;
  font-weight: 700;
}

.ai-finalists-ranking {
  display: grid;
  gap: 10px;
}

.ai-finalists-ranking article {
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  background: #fbfcff;
}

.ai-finalists-ranking__place {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ff4f9c;
  font-size: 0.7rem;
  font-weight: 800;
  flex: 0 0 26px;
}

.ai-finalists-ranking__avatar,
.ai-finalists-hero__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #111827 0%, #f05d8f 100%);
  color: #fff;
  font-weight: 800;
}

.ai-finalists-ranking__identity {
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  min-width: 0;
}

.ai-finalists-ranking__identity strong {
  color: #243454;
  font-size: 0.7rem;
}

.ai-finalists-ranking__identity small {
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-finalists-ranking__identity small.is-green {
  color: #1fb86a;
}

.ai-finalists-ranking__identity small.is-orange {
  color: #ff9824;
}

.ai-finalists-ranking__score {
  margin-left: auto;
  text-align: right;
}

.ai-finalists-ranking__score strong {
  display: block;
  color: #243454;
  font-size: 1rem;
}

.ai-finalists-ranking__score strong.is-pink {
  color: #ff4f9c;
}

.ai-finalists-ranking__score small {
  display: block;
  margin-top: 3px;
  color: #97a4ba;
  font-size: 0.58rem;
}

.ai-finalists-link {
  margin-top: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #ff4f9c;
  font-size: 0.66rem;
  font-weight: 700;
  cursor: pointer;
}

.ai-finalists-card--hero {
  padding: 0;
  overflow: hidden;
}

.ai-finalists-hero {
  padding: 14px;
  background: linear-gradient(135deg, rgba(255, 79, 156, 0.08) 0%, rgba(255, 255, 255, 1) 52%);
}

.ai-finalists-hero__badge {
  color: #ff4f9c;
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-finalists-hero__main {
  gap: 14px;
  margin-top: 10px;
}

.ai-finalists-hero__identity strong {
  display: block;
  color: #243454;
  font-size: 0.82rem;
}

.ai-finalists-hero__identity small {
  display: block;
  margin-top: 4px;
  color: #1fb86a;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-finalists-hero__score {
  margin-left: auto;
  text-align: center;
}

.ai-finalists-hero__score strong {
  display: block;
  color: #ff4f9c;
  font-size: 2rem;
  line-height: 1;
}

.ai-finalists-hero__score span {
  display: block;
  margin-top: 4px;
  color: #97a4ba;
  font-size: 0.62rem;
}

.ai-finalists-hero__stars {
  display: inline-flex;
  gap: 4px;
  margin-top: 8px;
  color: #ff4f9c;
}

.ai-finalists-hero__why {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 14px;
}

.ai-finalists-hero__why strong {
  color: #243454;
  font-size: 0.74rem;
}

.ai-finalists-hero__why ul,
.ai-finalists-snapshots ul,
.ai-finalists-why-not ul {
  margin: 0;
  padding: 0 0 0 16px;
}

.ai-finalists-hero__why li,
.ai-finalists-snapshots li,
.ai-finalists-why-not li {
  color: #66758f;
  font-size: 0.64rem;
  line-height: 1.55;
}

.ai-finalists-hero__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-top: 1px solid #f3dbe7;
  color: #ff4f9c;
  font-size: 0.66rem;
  font-weight: 700;
}

.ai-finalists-hero__foot strong {
  font-size: 1rem;
}

.ai-finalists-glance {
  border: 1px solid #edf2fb;
  border-radius: 12px;
  overflow: hidden;
}

.ai-finalists-glance header,
.ai-finalists-glance article {
  display: grid;
  grid-template-columns: 1.2fr repeat(3, 0.6fr);
  gap: 10px;
  align-items: center;
}

.ai-finalists-glance header {
  padding: 10px 12px;
  background: #fafcff;
  color: #97a4ba;
  font-size: 0.58rem;
  font-weight: 800;
}

.ai-finalists-glance article {
  padding: 10px 12px;
  border-top: 1px solid #edf2fb;
}

.ai-finalists-glance span,
.ai-finalists-glance strong {
  color: #243454;
  font-size: 0.64rem;
}

.ai-finalists-glance article strong:first-of-type {
  color: #ff4f9c;
}

.ai-finalists-evaluation {
  border: 1px solid #edf2fb;
  border-radius: 12px;
  overflow: hidden;
}

.ai-finalists-evaluation article {
  display: grid;
  grid-template-columns: 1.15fr repeat(3, 1fr);
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-top: 1px solid #edf2fb;
}

.ai-finalists-evaluation article:first-child {
  border-top: 0;
}

.ai-finalists-evaluation__label {
  color: #243454;
  font-size: 0.64rem;
}

.ai-finalists-evaluation__metric {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}

.ai-finalists-evaluation__bar,
.ai-finalists-headtohead__bar {
  height: 7px;
  border-radius: 999px;
  background: #edf2fb;
  overflow: hidden;
}

.ai-finalists-evaluation__bar span,
.ai-finalists-headtohead__bar span {
  display: block;
  height: 100%;
  background: #c3cedf;
  border-radius: inherit;
}

.ai-finalists-evaluation__bar span.is-pink,
.ai-finalists-headtohead__bar span.is-pink {
  background: #ff4f9c;
}

.ai-finalists-evaluation__metric strong,
.ai-finalists-headtohead__bars strong {
  color: #243454;
  font-size: 0.62rem;
}

.ai-finalists-evaluation__metric strong.is-pink {
  color: #ff4f9c;
}

.ai-finalists-winners {
  display: grid;
  gap: 10px;
}

.ai-finalists-winners article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 9px;
  border-bottom: 1px solid #edf2fb;
}

.ai-finalists-winners article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.ai-finalists-winners span,
.ai-finalists-winners strong {
  font-size: 0.64rem;
}

.ai-finalists-winners span {
  color: #66758f;
}

.ai-finalists-winners strong {
  color: #243454;
}

.ai-finalists-snapshots,
.ai-finalists-why-not {
  display: grid;
  gap: 12px;
}

.ai-finalists-snapshots article,
.ai-finalists-why-not article {
  padding: 12px;
  border-radius: 12px;
  background: #fbfcff;
}

.ai-finalists-snapshots__head {
  gap: 8px;
  margin-bottom: 10px;
}

.ai-finalists-snapshots__head span {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.55rem;
  font-weight: 800;
}

.ai-finalists-snapshots__head span.is-pink {
  background: linear-gradient(135deg, #111827 0%, #f05d8f 100%);
}

.ai-finalists-snapshots__head span.is-blue {
  background: linear-gradient(135deg, #6b7cff 0%, #55b2ff 100%);
}

.ai-finalists-snapshots__head span.is-orange {
  background: linear-gradient(135deg, #ffb347 0%, #ff7f50 100%);
}

.ai-finalists-snapshots__head strong,
.ai-finalists-why-not strong {
  color: #243454;
  font-size: 0.68rem;
}

.ai-finalists-headtohead__controls {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  background: #fbfcff;
  color: #243454;
  font-size: 0.64rem;
  font-weight: 700;
}

.ai-finalists-headtohead__controls small {
  color: #97a4ba;
}

.ai-finalists-headtohead {
  display: grid;
  gap: 10px;
}

.ai-finalists-headtohead article {
  padding: 10px 0;
  border-bottom: 1px solid #edf2fb;
}

.ai-finalists-headtohead article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.ai-finalists-headtohead__top {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.ai-finalists-headtohead__top span {
  color: #243454;
  font-size: 0.64rem;
}

.ai-finalists-headtohead__top em {
  color: #ff4f9c;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-finalists-headtohead__bars {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto;
  gap: 8px;
  align-items: center;
}

.ai-finalists-headtohead__bars strong.is-pink {
  color: #ff4f9c;
}

.ai-finalists-foot {
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.03) 0%, #fff 100%);
}

.ai-finalists-foot__summary small {
  display: block;
  color: #97a4ba;
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-finalists-foot__summary strong {
  display: block;
  margin-top: 4px;
  color: #243454;
  font-size: 0.74rem;
}

.ai-finalists-foot__summary span {
  display: block;
  margin-top: 3px;
  color: #7f8da6;
  font-size: 0.64rem;
}

.ai-finalists-foot__actions {
  gap: 8px;
  flex-wrap: wrap;
}

.ai-finalists-primary,
.ai-finalists-secondary,
.ai-finalists-close-button {
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 0.66rem;
  font-weight: 800;
}

.ai-finalists-primary {
  border-color: transparent;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
}

.ai-finalists-secondary {
  color: #334155;
}

.ai-finalists-close-button {
  color: #66758f;
}

@media (max-width: 1400px) {
  .ai-finalists-meta,
  .ai-finalists-top-grid,
  .ai-finalists-middle-grid,
  .ai-finalists-bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1040px) {
  .ai-finalists-head,
  .ai-finalists-head__actions,
  .ai-finalists-foot {
    flex-wrap: wrap;
  }

  .ai-finalists-glance,
  .ai-finalists-evaluation {
    overflow-x: auto;
  }

  .ai-finalists-glance header,
  .ai-finalists-glance article {
    min-width: 520px;
  }

  .ai-finalists-evaluation article {
    min-width: 700px;
  }
}

@media (max-width: 720px) {
  .ai-finalists-overlay {
    padding: 10px;
  }

  .ai-finalists-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 16px;
  }

  .ai-finalists-head,
  .ai-finalists-body,
  .ai-finalists-foot {
    padding-left: 12px;
    padding-right: 12px;
  }

  .ai-finalists-meta {
    grid-template-columns: 1fr;
  }

  .ai-finalists-hero__main,
  .ai-finalists-headtohead__bars {
    grid-template-columns: 1fr;
  }
}
</style>
