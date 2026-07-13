<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import ReferenceDetailsOverlay from './ReferenceDetailsOverlay.vue'

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
})

const emit = defineEmits(['close', 'reviewed'])

const activeTab = ref('all')
const agreementScore = 96
const selectedReferenceRow = ref(null)

const reviewTabs = [
  { id: 'all', label: 'All (3)' },
  { id: 'integrated', label: 'Integrated (1)' },
  { id: 'manual', label: 'Manual Email (2)' },
]

const referenceRows = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Director of Engineering',
    tag: 'Former Manager',
    tagTone: 'manager',
    source: 'HiPeople',
    collectionType: 'integrated',
    sourceKind: 'integrated',
    sourceLabel: 'Integrated',
    completed: 'May 21, 2026',
    wouldRehire: 'Yes',
    recommendation: 'Strongly Recommend',
    recommendationStars: 5,
    confidence: '94%',
    confidenceLevel: 'Very High',
    alignmentScore: 94,
    alignmentLabel: 'High alignment',
    alignmentCopy: 'Very consistent feedback across all references.',
    summary:
      "Sarah's reference strongly supports Marvin's qualifications for this role. Feedback is highly consistent with other references.",
    keyThemes: [
      'Technical leadership',
      'Ownership & accountability',
      'Problem solving',
      'Mentoring & developing others',
      'Team collaboration',
    ],
    riskFlags: ['No significant risks identified'],
    evidenceStrength: 'Excellent',
    additionalComment:
      'Marvin is one of the best engineers I have worked with in my career. He combines technical excellence with great empathy and team spirit.',
    ratings: [
      ['Technical Expertise', 5, 'Excellent', 'target'],
      ['Leadership', 5, 'Excellent', 'sparkles'],
      ['Communication', 4, 'Very Good', 'message'],
      ['Problem Solving', 5, 'Excellent', 'checkCircle'],
      ['Ownership', 5, 'Excellent', 'user'],
      ['Reliability', 5, 'Excellent', 'shield'],
      ['Team Collaboration', 4, 'Very Good', 'users'],
      ['Adaptability', 4, 'Very Good', 'refresh'],
      ['Innovation', 4, 'Very Good', 'bolt'],
    ],
    questions: [
      {
        question: "How would you describe Marvin's overall performance?",
        answer:
          'Marvin consistently exceeded expectations in every area. He is a highly skilled engineer who delivers quality work on time and raises the bar for the entire team.',
      },
      {
        question: "What are Marvin's greatest strengths?",
        answer:
          'Technical depth, problem solving, ownership, and his ability to mentor others. He leads by example and has a strong sense of responsibility.',
      },
      {
        question: 'How does Marvin handle challenges or pressure?',
        answer:
          'He stays calm, analyzes the problem quickly, and finds the best solution. He thrives in high pressure situations.',
      },
      {
        question: 'Would you hire Marvin again? Why or why not?',
        answer:
          'Absolutely yes. He would be a tremendous asset to any team.',
      },
      {
        question: 'What areas could Marvin improve in?',
        answer:
          'He sometimes takes on too much and could delegate more.',
      },
    ],
  },
  {
    id: 2,
    name: 'David Wilson',
    role: 'Product Designer',
    tag: 'Former Peer',
    tagTone: 'peer',
    source: 'Manual Email',
    collectionType: 'manual',
    sourceKind: 'manual',
    sourceLabel: 'Manual',
    completed: 'May 20, 2026',
    wouldRehire: 'Yes',
    recommendation: 'Recommend',
    recommendationStars: 4,
    confidence: '89%',
    confidenceLevel: 'High',
    alignmentScore: 91,
    alignmentLabel: 'Strong alignment',
    alignmentCopy: 'Feedback aligns well with manager references, with slightly softer communication notes.',
    summary:
      "David's feedback confirms Marvin's collaboration, product thinking, and reliability. Minor differences appear mainly in communication style.",
    keyThemes: [
      'Cross-functional partnership',
      'Calm under pressure',
      'Execution quality',
      'Thoughtful collaboration',
    ],
    riskFlags: ['Communication slightly lower than manager feedback'],
    evidenceStrength: 'Strong',
    additionalComment:
      'Marvin was an excellent partner to work with and always brought structure to ambiguous product discussions.',
    ratings: [
      ['Technical Expertise', 4, 'Very Good', 'target'],
      ['Leadership', 4, 'Very Good', 'sparkles'],
      ['Communication', 4, 'Very Good', 'message'],
      ['Problem Solving', 4, 'Very Good', 'checkCircle'],
      ['Ownership', 4, 'Very Good', 'user'],
      ['Reliability', 5, 'Excellent', 'shield'],
      ['Team Collaboration', 5, 'Excellent', 'users'],
      ['Adaptability', 4, 'Very Good', 'refresh'],
      ['Innovation', 4, 'Very Good', 'bolt'],
    ],
    questions: [
      {
        question: 'How was Marvin as a cross-functional partner?',
        answer:
          'He was reliable, thoughtful, and easy to work with. He helped create clarity when requirements were still evolving.',
      },
      {
        question: 'What strengths stood out the most?',
        answer:
          'Ownership, execution speed, and his ability to break complex work into manageable pieces.',
      },
      {
        question: 'How did Marvin communicate with design and product?',
        answer:
          'Generally very well. In fast moving situations he could be brief, but he was always respectful and responsive.',
      },
      {
        question: 'Would you work with Marvin again?',
        answer:
          'Yes, without hesitation. He raised the quality of the projects we worked on together.',
      },
      {
        question: 'Any areas for development?',
        answer:
          'He could narrate tradeoffs a bit earlier with non-technical stakeholders.',
      },
    ],
  },
  {
    id: 3,
    name: 'James Lee',
    role: 'Engineering Manager',
    tag: 'Other Manager',
    tagTone: 'manager',
    source: 'Uploaded Report',
    collectionType: 'manual',
    sourceKind: 'uploaded',
    sourceLabel: 'Uploaded',
    completed: 'May 18, 2026',
    wouldRehire: 'Yes',
    recommendation: 'Recommend',
    recommendationStars: 4,
    confidence: '90%',
    confidenceLevel: 'High',
    alignmentScore: 92,
    alignmentLabel: 'Strong alignment',
    alignmentCopy: 'Consistent with the broader reference set on ownership and delivery quality.',
    summary:
      "James emphasized Marvin's dependability, structured thinking, and strong delivery habits. Feedback supports the overall positive recommendation.",
    keyThemes: [
      'Reliable delivery',
      'Ownership',
      'Structured thinking',
      'Coaching mindset',
    ],
    riskFlags: ['No major concerns raised'],
    evidenceStrength: 'Strong',
    additionalComment:
      'Marvin was someone I could trust with the hardest projects. He consistently followed through and supported the team.',
    ratings: [
      ['Technical Expertise', 4, 'Very Good', 'target'],
      ['Leadership', 4, 'Very Good', 'sparkles'],
      ['Communication', 4, 'Very Good', 'message'],
      ['Problem Solving', 5, 'Excellent', 'checkCircle'],
      ['Ownership', 5, 'Excellent', 'user'],
      ['Reliability', 5, 'Excellent', 'shield'],
      ['Team Collaboration', 4, 'Very Good', 'users'],
      ['Adaptability', 4, 'Very Good', 'refresh'],
      ['Innovation', 3, 'Good', 'bolt'],
    ],
    questions: [
      {
        question: 'How dependable was Marvin on important projects?',
        answer:
          'Extremely dependable. He followed through on commitments and kept everyone aligned on delivery.',
      },
      {
        question: 'What made Marvin effective as an engineering manager?',
        answer:
          'He brought structure, accountability, and a calm presence that helped the team execute effectively.',
      },
      {
        question: 'How did Marvin support other engineers?',
        answer:
          'He coached junior engineers well and created space for people to grow without losing momentum on delivery.',
      },
      {
        question: 'Would you hire Marvin again?',
        answer:
          'Yes. I would be confident putting him in a senior role again.',
      },
      {
        question: 'Any improvement areas?',
        answer:
          'He can sometimes prioritize certainty over experimentation, so pushing earlier discovery could help.',
      },
    ],
  },
]

const evidenceCoverage = [
  { label: 'Leadership', score: 4, level: 'High' },
  { label: 'Technical Expertise', score: 5, level: 'Very High' },
  { label: 'Ownership', score: 5, level: 'Very High' },
  { label: 'Problem Solving', score: 4, level: 'High' },
  { label: 'Communication', score: 3, level: 'High' },
  { label: 'Team Collaboration', score: 5, level: 'Very High' },
  { label: 'Reliability', score: 4, level: 'Very High' },
  { label: 'Adaptability', score: 2, level: 'Medium' },
]

const strengths = [
  'Technical leadership',
  'Ownership & accountability',
  'Problem solving',
  'Mentoring & developing others',
]

const visibleRows = computed(() => {
  if (activeTab.value === 'all') {
    return referenceRows
  }

  return referenceRows.filter((row) => row.collectionType === activeTab.value)
})

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateFirstName = computed(() => (
  (props.candidateName || 'Marvin').split(' ').filter(Boolean)[0] ?? 'Marvin'
))

const agreementRingStyle = computed(() => {
  const degrees = Math.round((agreementScore / 100) * 360)

  return {
    background: `radial-gradient(circle at center, #ffffff 58%, transparent 59%), conic-gradient(#28bf63 0 ${degrees}deg, #e6ebfb ${degrees}deg 360deg)`,
  }
})

function closeOverlay() {
  emit('close')
}

function markReviewed() {
  emit('reviewed')
  emit('close')
}

function openReferenceDetails(row) {
  selectedReferenceRow.value = row
}

function closeReferenceDetails() {
  selectedReferenceRow.value = null
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : ''
}

function getRowInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function getSourceIcon(kind) {
  if (kind === 'manual') {
    return 'mail'
  }

  if (kind === 'uploaded') {
    return 'document'
  }

  return 'document'
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      activeTab.value = 'all'
      selectedReferenceRow.value = null
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="review-references-overlay" @click.self="closeOverlay">
      <section class="review-references-modal">
        <header class="review-references-modal__head">
          <div class="review-references-modal__title">
            <div class="review-references-modal__title-icon">
              <AppIcon name="document" :size="18" />
            </div>
            <div>
              <h2>Review References</h2>
              <p>3 of 3 references completed &middot; Collection: Engineering Leadership &middot; Completed: May 20, 2026</p>
            </div>
          </div>

          <button type="button" aria-label="Close review references" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="review-references-modal__body">
          <section class="review-references-candidate">
            <div class="review-references-candidate__identity">
              <span class="review-references-avatar">{{ candidateInitials }}</span>
              <div class="review-references-candidate__copy">
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
                <span class="review-references-stage">
                  <i />
                  Validation Stage
                </span>
              </div>
            </div>

            <div class="review-references-candidate__meta">
              <article>
                <small>Collection Strategy</small>
                <strong>Hybrid (Manual + Integrated)</strong>
              </article>
              <article>
                <small>Provider</small>
                <strong class="review-references-provider">
                  <span class="review-references-provider__badge">Hi</span>
                  HiPeople
                </strong>
              </article>
              <article>
                <small>References</small>
                <strong>3 of 3</strong>
              </article>
              <article>
                <small>Due Date</small>
                <strong class="review-references-date">
                  <AppIcon name="calendar" :size="13" />
                  May 25, 2026
                </strong>
              </article>
              <article>
                <small>Status</small>
                <span class="review-references-status-pill is-success">Completed</span>
              </article>
            </div>
          </section>

          <section class="review-references-summary-grid">
            <article class="review-references-card review-references-card--summary">
              <div class="review-references-card__head">
                <h3>AI Reference Summary</h3>
                <span>Generated by Nitrosync AI</span>
              </div>

              <div class="review-references-summary-hero">
                <div class="review-references-summary-hero__icon">
                  <AppIcon name="spark" :size="16" />
                </div>
                <div>
                  <strong>Highly Recommended</strong>
                  <p>All 3 references would rehire {{ candidateFirstName }}.</p>
                </div>
              </div>

              <div class="review-references-summary-metrics">
                <article>
                  <small>Confidence</small>
                  <strong>95%</strong>
                  <span>Very High</span>
                </article>
                <article>
                  <small>Overall Sentiment</small>
                  <strong class="review-references-stars review-references-stars--large">
                    <AppIcon v-for="star in 5" :key="star" name="star" :size="12" />
                  </strong>
                  <span>Very Positive</span>
                </article>
                <article>
                  <small>Would Rehire</small>
                  <strong>3 of 3</strong>
                  <span>Strongly agree</span>
                </article>
                <article>
                  <small>Risk Flags</small>
                  <strong>None identified</strong>
                  <span class="is-safe">No issues found</span>
                </article>
              </div>

              <div class="review-references-ai-copy">
                <div>
                  <small>AI Summary</small>
                  <p>
                    References consistently describe {{ candidateFirstName }} as a strong technical
                    leader with excellent ownership, problem solving skills, and a collaborative
                    mindset. No significant concerns were raised.
                  </p>
                </div>

                <button type="button">
                  View full AI analysis
                  <AppIcon name="external-link" :size="13" />
                </button>
              </div>
            </article>

            <article class="review-references-card">
              <div class="review-references-card__head">
                <h3>Evidence Coverage</h3>
                <AppIcon name="info" :size="14" />
              </div>

              <div class="review-references-coverage">
                <article v-for="item in evidenceCoverage" :key="item.label">
                  <span>{{ item.label }}</span>
                  <div class="review-references-coverage__dots">
                    <i v-for="index in 5" :key="index" :class="{ 'is-filled': index <= item.score }" />
                  </div>
                  <strong>{{ item.level }}</strong>
                </article>
              </div>

              <button type="button" class="review-references-link">
                View evidence matrix
                <AppIcon name="chevronRight" :size="14" />
              </button>
            </article>

            <article class="review-references-card">
              <div class="review-references-card__head">
                <h3>Cross-reference insights</h3>
                <AppIcon name="info" :size="14" />
              </div>

              <div class="review-references-agreement">
                <div class="review-references-agreement__ring" :style="agreementRingStyle">
                  <span>{{ agreementScore }}%</span>
                </div>

                <div class="review-references-agreement__copy">
                  <small>Agreement</small>
                  <p>References are highly aligned in their feedback.</p>
                </div>
              </div>

              <div class="review-references-insights-group">
                <small>Consistent strengths</small>
                <div class="review-references-chip-list">
                  <span v-for="item in strengths" :key="item">
                    <AppIcon name="check" :size="11" />
                    {{ item }}
                  </span>
                </div>
              </div>

              <div class="review-references-insights-group">
                <small>Consistent themes</small>
                <p>
                  All references highlighted {{ candidateFirstName }}'s ability to lead complex
                  projects, take ownership, and support team growth.
                </p>
              </div>

              <div class="review-references-insights-group">
                <small>Minor differences</small>
                <p class="review-references-warning">
                  <i />
                  Peer rated communication slightly lower than managers.
                </p>
              </div>

              <div class="review-references-evidence-quality">
                <small>Evidence quality</small>
                <strong>
                  <span class="review-references-stars">
                    <AppIcon v-for="star in 5" :key="star" name="star" :size="12" />
                  </span>
                  Excellent
                </strong>
              </div>
            </article>
          </section>

          <section class="review-references-list">
            <div class="review-references-list__controls">
              <div class="review-references-tabs">
                <button
                  v-for="tab in reviewTabs"
                  :key="tab.id"
                  type="button"
                  :class="{ 'is-active': activeTab === tab.id }"
                  @click="activeTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </div>

              <label class="review-references-sort">
                <span>Sort by</span>
                <select>
                  <option>Most recent</option>
                  <option>Highest rating</option>
                </select>
              </label>
            </div>

            <div class="review-references-table">
              <div class="review-references-table__head">
                <span>Reference</span>
                <span>Source</span>
                <span>Completed</span>
                <span>Would Rehire</span>
                <span>Recommendation</span>
                <span>Action</span>
              </div>

            <article v-for="row in visibleRows" :key="row.id" class="review-references-table__row">
                <div class="review-references-person">
                  <span class="review-references-person__avatar">{{ getRowInitials(row.name) }}</span>
                  <div>
                    <strong>{{ row.name }}</strong>
                    <small>{{ row.role }}</small>
                    <em :class="`is-${row.tagTone}`">{{ row.tag }}</em>
                  </div>
                </div>

                <div class="review-references-source">
                  <strong>
                    <span class="review-references-source__icon" :class="`is-${row.sourceKind}`">
                      <template v-if="row.sourceKind === 'integrated'">Hi</template>
                      <AppIcon v-else :name="getSourceIcon(row.sourceKind)" :size="12" />
                    </span>
                    {{ row.source }}
                  </strong>
                  <small :class="`is-${row.sourceKind}`">{{ row.sourceLabel }}</small>
                </div>

                <div class="review-references-meta">
                  <small>Completed</small>
                  <strong class="review-references-date">
                    <AppIcon name="calendar" :size="12" />
                    {{ row.completed }}
                  </strong>
                </div>

                <div class="review-references-meta review-references-meta--positive">
                  <small>Would rehire</small>
                  <strong>{{ row.wouldRehire }}</strong>
                </div>

                <div class="review-references-recommendation">
                  <div class="review-references-stars">
                    <AppIcon
                      v-for="star in 5"
                      :key="star"
                      name="star"
                      :size="11"
                      :class="{ 'is-muted': star > row.recommendationStars }"
                    />
                  </div>
                  <strong>{{ row.recommendation }}</strong>
                </div>

                <div class="review-references-table__action">
                  <button type="button" @click="openReferenceDetails(row)">
                    View details
                    <AppIcon name="chevronDown" :size="14" />
                  </button>
                </div>
              </article>
            </div>
          </section>

          <div class="review-references-note">
            <AppIcon name="info" :size="14" />
            <p>
              Each reference has been reviewed and analyzed by NitroSync AI. You can view the original
              source for full details.
            </p>
          </div>
        </div>

        <footer class="review-references-modal__foot">
          <button type="button" class="review-references-button review-references-button--ghost" @click="closeOverlay">
            Back to collection
          </button>

          <div class="review-references-modal__foot-main">
            <button type="button" class="review-references-button review-references-button--primary" @click="markReviewed">
              <AppIcon name="check" :size="15" />
              Mark references reviewed
            </button>
            <p>This will update the candidate's validation progress and move the requirement to completed.</p>
          </div>
        </footer>
      </section>

      <ReferenceDetailsOverlay
        :open="Boolean(selectedReferenceRow)"
        :row="selectedReferenceRow"
        @close="closeReferenceDetails"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.review-references-overlay {
  --review-border: #dde6fb;
  --review-border-soft: #ebf0fc;
  --review-card-bg: #ffffff;
  --review-card-muted: #fafcff;
  --review-text: #243454;
  --review-text-soft: #6f81a5;
  --review-text-muted: #95a3bf;
  --review-success: #1ea85e;
  --review-success-soft: #e9f9ef;
  --review-purple: #665cff;
  --review-purple-soft: #f3f1ff;
  --review-shadow: 0 34px 90px rgba(114, 133, 184, 0.24);
  position: fixed;
  inset: 0;
  z-index: 1700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(18, 26, 43, 0.1), rgba(18, 26, 43, 0.16)),
    rgba(246, 248, 254, 0.72);
  backdrop-filter: blur(18px);
}

.review-references-modal {
  width: min(1360px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(221, 230, 251, 0.96);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--review-shadow);
}

.review-references-modal__head,
.review-references-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 22px;
}

.review-references-modal__head {
  border-bottom: 1px solid var(--review-border);
}

.review-references-modal__foot {
  margin-top: auto;
  border-top: 1px solid var(--review-border);
  background: rgba(255, 255, 255, 0.98);
}

.review-references-modal__title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.review-references-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(180deg, #f8e7fb 0%, #f2efff 100%);
  color: var(--review-purple);
}

.review-references-modal__title h2 {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.1;
  color: var(--review-text);
}

.review-references-modal__title p {
  margin: 5px 0 0;
  font-size: 0.84rem;
  color: var(--review-text-soft);
}

.review-references-modal__head button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--review-border);
  border-radius: 14px;
  background: #fff;
  color: #8fa0c0;
  cursor: pointer;
}

.review-references-modal__body {
  flex: 1;
  overflow: auto;
  padding: 16px 18px 18px;
  display: grid;
  gap: 14px;
  background:
    linear-gradient(180deg, rgba(250, 251, 255, 0.92), rgba(255, 255, 255, 1) 12%),
    radial-gradient(circle at top left, rgba(255, 96, 170, 0.06), transparent 18%),
    radial-gradient(circle at top right, rgba(108, 77, 255, 0.06), transparent 16%),
    #fff;
}

.review-references-candidate,
.review-references-card,
.review-references-list,
.review-references-note {
  border: 1px solid var(--review-border);
  border-radius: 22px;
  background: var(--review-card-bg);
}

.review-references-candidate {
  display: grid;
  grid-template-columns: minmax(280px, 350px) 1fr;
  gap: 20px;
  padding: 14px 18px;
}

.review-references-candidate__identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.review-references-avatar {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffc98d 0%, #de9456 100%);
  color: #fff;
  font-size: 1.3rem;
  font-weight: 800;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
}

.review-references-candidate__copy strong {
  display: block;
  font-size: 0.95rem;
  color: #1f2d4b;
}

.review-references-candidate__copy p {
  margin: 2px 0 0;
  color: var(--review-text-soft);
  font-size: 0.82rem;
}

.review-references-stage {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
  color: var(--review-purple);
  font-size: 0.73rem;
  font-weight: 700;
}

.review-references-stage i,
.review-references-warning i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex: 0 0 auto;
}

.review-references-stage i {
  background: #45d46f;
  box-shadow: 0 0 0 3px rgba(69, 212, 111, 0.14);
}

.review-references-candidate__meta {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.review-references-candidate__meta article {
  padding-left: 14px;
  border-left: 1px solid var(--review-border-soft);
}

.review-references-candidate__meta article:first-child {
  padding-left: 0;
  border-left: 0;
}

.review-references-candidate__meta small,
.review-references-summary-metrics small,
.review-references-ai-copy small,
.review-references-insights-group small,
.review-references-evidence-quality small,
.review-references-meta small {
  display: block;
  margin-bottom: 5px;
  color: var(--review-text-muted);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.review-references-candidate__meta strong {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--review-text);
  font-size: 0.88rem;
  line-height: 1.45;
}

.review-references-provider__badge,
.review-references-source__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  font-size: 0.57rem;
  font-weight: 800;
}

.review-references-provider__badge {
  background: #111318;
  color: #fff;
}

.review-references-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.review-references-status-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
}

.review-references-status-pill.is-success {
  background: var(--review-success-soft);
  color: var(--review-success);
}

.review-references-summary-grid {
  display: grid;
  grid-template-columns: 1.18fr 0.92fr 0.92fr;
  gap: 14px;
}

.review-references-card {
  padding: 16px 18px;
}

.review-references-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.review-references-card__head h3 {
  margin: 0;
  font-size: 0.98rem;
  color: var(--review-text);
}

.review-references-card__head span {
  color: var(--review-purple);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.review-references-summary-hero {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(230, 255, 240, 0.88), rgba(244, 249, 255, 0.92));
}

.review-references-summary-hero__icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 168, 94, 0.12);
  color: var(--review-success);
}

.review-references-summary-hero strong {
  display: block;
  color: var(--review-success);
  font-size: 0.92rem;
}

.review-references-summary-hero p {
  margin: 4px 0 0;
  color: var(--review-text-soft);
  font-size: 0.82rem;
}

.review-references-summary-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.review-references-summary-metrics article {
  padding: 12px;
  border: 1px solid var(--review-border-soft);
  border-radius: 16px;
  background: var(--review-card-muted);
}

.review-references-summary-metrics strong {
  display: block;
  color: #1b2844;
  font-size: 0.95rem;
}

.review-references-summary-metrics span {
  display: block;
  margin-top: 5px;
  color: var(--review-text-soft);
  font-size: 0.8rem;
  line-height: 1.45;
}

.review-references-summary-metrics .is-safe {
  color: var(--review-success);
}

.review-references-ai-copy {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, #fafbff 0%, #ffffff 100%);
}

.review-references-ai-copy p,
.review-references-insights-group p {
  margin: 0;
  color: #5d708f;
  font-size: 0.82rem;
  line-height: 1.6;
}

.review-references-ai-copy button,
.review-references-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 0;
  background: transparent;
  color: var(--review-purple);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.review-references-coverage {
  display: grid;
  gap: 9px;
}

.review-references-coverage article {
  display: grid;
  grid-template-columns: minmax(132px, 1fr) auto auto;
  align-items: center;
  gap: 12px;
}

.review-references-coverage span {
  color: #2b395a;
  font-size: 0.82rem;
  font-weight: 600;
}

.review-references-coverage__dots {
  display: flex;
  gap: 6px;
}

.review-references-coverage__dots i {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #d7e0f3;
}

.review-references-coverage__dots i.is-filled {
  background: #2ab45e;
}

.review-references-coverage strong {
  color: #637495;
  font-size: 0.82rem;
  font-weight: 700;
}

.review-references-link {
  margin-top: 14px;
}

.review-references-agreement {
  display: flex;
  align-items: center;
  gap: 14px;
}

.review-references-agreement__ring {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.review-references-agreement__ring span {
  color: #192744;
  font-size: 1.05rem;
  font-weight: 800;
}

.review-references-agreement__copy small {
  margin-bottom: 4px;
}

.review-references-agreement__copy p {
  margin: 0;
  color: var(--review-text-soft);
  font-size: 0.82rem;
  line-height: 1.6;
}

.review-references-insights-group + .review-references-insights-group {
  margin-top: 15px;
}

.review-references-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.review-references-chip-list span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border-radius: 999px;
  background: #eef0ff;
  color: var(--review-purple);
  font-size: 0.77rem;
  font-weight: 700;
}

.review-references-warning {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.review-references-warning i {
  background: #ff9f43;
  box-shadow: 0 0 0 3px rgba(255, 159, 67, 0.12);
}

.review-references-evidence-quality {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--review-border-soft);
}

.review-references-evidence-quality strong {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1f2a44;
  font-size: 0.86rem;
}

.review-references-list {
  padding: 14px 16px;
}

.review-references-list__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.review-references-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.review-references-tabs button {
  padding: 7px 12px;
  border: 1px solid var(--review-border);
  border-radius: 999px;
  background: #fff;
  color: #7384a8;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.review-references-tabs button.is-active {
  background: var(--review-purple-soft);
  border-color: #d7d6ff;
  color: var(--review-purple);
}

.review-references-sort {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7b8ba9;
  font-size: 0.78rem;
  font-weight: 600;
}

.review-references-sort select {
  padding: 8px 12px;
  border: 1px solid var(--review-border);
  border-radius: 12px;
  color: #2c3958;
  background: #fff;
}

.review-references-table {
  border: 1px solid var(--review-border-soft);
  border-radius: 20px;
  overflow: hidden;
}

.review-references-table__head,
.review-references-table__row {
  display: grid;
  grid-template-columns: 1.52fr 0.95fr 0.82fr 0.66fr 0.94fr 0.8fr;
  gap: 14px;
  align-items: center;
  padding: 12px 16px;
}

.review-references-table__head {
  background: #fbfcff;
  color: var(--review-text-muted);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.review-references-table__row + .review-references-table__row {
  border-top: 1px solid var(--review-border-soft);
}

.review-references-person {
  display: flex;
  align-items: center;
  gap: 11px;
}

.review-references-person__avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffe8f3 0%, #eef3ff 100%);
  color: var(--review-purple);
  font-size: 0.74rem;
  font-weight: 800;
}

.review-references-person strong,
.review-references-source strong,
.review-references-meta strong,
.review-references-recommendation strong {
  display: block;
  color: #1f2a44;
  font-size: 0.82rem;
}

.review-references-person small,
.review-references-source small,
.review-references-meta small {
  display: block;
  margin-top: 3px;
  color: var(--review-text-soft);
  font-size: 0.72rem;
}

.review-references-person em {
  display: inline-flex;
  align-items: center;
  margin-top: 6px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 700;
}

.review-references-person em.is-manager {
  background: #ede9ff;
  color: var(--review-purple);
}

.review-references-person em.is-peer {
  background: #eaf3ff;
  color: #3f7be8;
}

.review-references-source strong {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.review-references-source__icon {
  background: #111318;
  color: #fff;
}

.review-references-source__icon.is-manual {
  background: #eef4ff;
  color: #6482d3;
}

.review-references-source__icon.is-uploaded {
  background: #fff3e7;
  color: #ff8b2c;
}

.review-references-source small.is-integrated,
.review-references-meta--positive strong {
  color: var(--review-success);
}

.review-references-source small.is-manual {
  color: #5a72d7;
}

.review-references-source small.is-uploaded {
  color: #ff8b2c;
}

.review-references-recommendation strong {
  margin-top: 4px;
}

.review-references-stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: var(--review-success);
}

.review-references-stars--large {
  gap: 1px;
}

.review-references-stars :deep(svg.is-muted) {
  color: #cfd9ee;
}

.review-references-table__action button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid var(--review-border);
  border-radius: 12px;
  background: #fff;
  color: #31415f;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.review-references-note {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  color: #6c7d9f;
  font-size: 0.78rem;
  background: linear-gradient(135deg, rgba(245, 241, 255, 0.92), rgba(250, 250, 255, 0.98));
}

.review-references-note p {
  margin: 0;
}

.review-references-modal__foot-main {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
}

.review-references-modal__foot-main p {
  margin: 0;
  color: #93a1bb;
  font-size: 0.68rem;
}

.review-references-button {
  min-width: 176px;
  min-height: 44px;
  padding: 11px 18px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
}

.review-references-button--ghost {
  border: 1px solid var(--review-border);
  background: #fff;
  color: #2b3958;
}

.review-references-button--primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  background: #ff5ca8 !important;
  background-image: none !important;
  color: #fff;
  box-shadow: 0 18px 36px rgba(255, 92, 168, 0.22);
}

@media (max-width: 1380px) {
  .review-references-summary-grid {
    grid-template-columns: 1fr;
  }

  .review-references-candidate {
    grid-template-columns: 1fr;
  }

  .review-references-candidate__meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1120px) {
  .review-references-table__head,
  .review-references-table__row {
    grid-template-columns: 1fr;
  }

  .review-references-summary-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .review-references-list__controls,
  .review-references-modal__foot {
    flex-direction: column;
    align-items: stretch;
  }

  .review-references-modal__foot-main {
    align-items: stretch;
  }
}

@media (max-width: 760px) {
  .review-references-overlay {
    padding: 12px;
  }

  .review-references-modal {
    width: 100%;
    max-height: calc(100vh - 24px);
    border-radius: 24px;
  }

  .review-references-modal__head,
  .review-references-modal__body,
  .review-references-modal__foot {
    padding-left: 14px;
    padding-right: 14px;
  }

  .review-references-candidate__meta,
  .review-references-summary-metrics {
    grid-template-columns: 1fr;
  }

  .review-references-ai-copy,
  .review-references-agreement {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
