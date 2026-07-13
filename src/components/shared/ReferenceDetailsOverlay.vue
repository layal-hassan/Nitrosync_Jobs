<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import OriginalReferenceOverlay from './OriginalReferenceOverlay.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  row: {
    type: Object,
    default: null,
  },
  collectionName: {
    type: String,
    default: 'Engineering Leadership',
  },
})

const emit = defineEmits(['close'])
const originalReferenceOpen = ref(false)

const fallbackRow = {
  name: 'Sarah Johnson',
  role: 'Director of Engineering',
  tag: 'Former Manager',
  source: 'Manual Email',
  sourceKind: 'manual',
  sourceLabel: 'Manual',
  completed: 'May 20, 2026',
  wouldRehire: 'Yes',
  recommendation: 'Highly Recommend',
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
}

const currentRow = computed(() => props.row ?? fallbackRow)
const referenceInitials = computed(() => (
  currentRow.value.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const alignmentRingStyle = computed(() => {
  const degrees = Math.round(((currentRow.value.alignmentScore ?? 94) / 100) * 360)

  return {
    background: `radial-gradient(circle at center, #ffffff 58%, transparent 59%), conic-gradient(#ef4fa0 0 ${degrees}deg, #edf0fb ${degrees}deg 360deg)`,
  }
})

function closeOverlay() {
  originalReferenceOpen.value = false
  emit('close')
}

function sourceIconName(sourceKind) {
  if (sourceKind === 'uploaded') {
    return 'document'
  }

  return 'mail'
}

function openOriginalReference() {
  originalReferenceOpen.value = true
}

function closeOriginalReference() {
  originalReferenceOpen.value = false
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      originalReferenceOpen.value = false
    }
  },
)
</script>

<template>
  <div v-if="open" class="reference-details-overlay" @click.self="closeOverlay">
    <section class="reference-details-modal">
      <header class="reference-details-modal__head">
        <div>
          <h2>Reference Details</h2>
          <p>Part of 3 of 3 references &middot; Collection: {{ collectionName }} &middot; Completed: {{ currentRow.completed }}</p>
        </div>

        <button type="button" aria-label="Close reference details" @click="closeOverlay">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="reference-details-modal__body">
        <section class="reference-details-summary">
          <div class="reference-details-profile">
            <span class="reference-details-profile__avatar">{{ referenceInitials }}</span>
            <div class="reference-details-profile__copy">
              <strong>{{ currentRow.name }}</strong>
              <p>{{ currentRow.role }}</p>
              <span>{{ currentRow.tag }}</span>
            </div>
          </div>

          <div class="reference-details-stats">
            <article>
              <small>Source</small>
              <strong>
                <span class="reference-details-source-chip" :class="`is-${currentRow.sourceKind}`">
                  <template v-if="currentRow.sourceKind === 'integrated'">Hi</template>
                  <AppIcon v-else :name="sourceIconName(currentRow.sourceKind)" :size="12" />
                </span>
                {{ currentRow.source }}
              </strong>
            </article>
            <article>
              <small>Completed On</small>
              <strong><AppIcon name="calendar" :size="13" /> {{ currentRow.completed }}</strong>
            </article>
            <article>
              <small>Would Rehire?</small>
              <strong class="is-success"><AppIcon name="checkCircle" :size="13" /> {{ currentRow.wouldRehire }}</strong>
              <span>Strongly agree</span>
            </article>
            <article>
              <small>AI Recommendation</small>
              <strong class="reference-details-recommendation">
                <span class="reference-details-stars">
                  <AppIcon v-for="star in 5" :key="star" name="star" :size="11" :class="{ 'is-muted': star > currentRow.recommendationStars }" />
                </span>
                {{ currentRow.recommendation }}
              </strong>
              <span>Highly Recommend</span>
            </article>
            <article>
              <small>Confidence</small>
              <div class="reference-details-confidence">
                <div class="reference-details-confidence__ring">
                  <span>{{ currentRow.confidence }}</span>
                </div>
                <strong>{{ currentRow.confidenceLevel }}</strong>
              </div>
            </article>
          </div>

          <button type="button" class="reference-details-original" @click="openOriginalReference">
            <AppIcon name="mail" :size="13" />
            View original email
          </button>
        </section>

        <section class="reference-details-grid">
          <div class="reference-details-left">
            <article class="reference-details-card">
              <div class="reference-details-card__head">
                <h3>Reference Ratings</h3>
                <AppIcon name="info" :size="14" />
              </div>

              <div class="reference-details-ratings">
                <article v-for="[label, score, level, icon] in currentRow.ratings" :key="label">
                  <div class="reference-details-ratings__label">
                    <span><AppIcon :name="icon" :size="12" /></span>
                    <strong>{{ label }}</strong>
                  </div>
                  <div class="reference-details-stars">
                    <AppIcon v-for="star in 5" :key="star" name="star" :size="11" :class="{ 'is-muted': star > score }" />
                  </div>
                  <em>{{ level }}</em>
                </article>
              </div>
            </article>

            <article class="reference-details-card">
              <div class="reference-details-card__head">
                <h3>Overall Recommendation</h3>
              </div>

              <div class="reference-details-overall">
                <div class="reference-details-overall__icon">
                  <AppIcon name="sparkles" :size="16" />
                </div>
                <div>
                  <p>Sarah strongly recommends Marvin for this role.</p>
                  <span>{{ currentRow.recommendation }}</span>
                </div>
              </div>
            </article>
          </div>

          <article class="reference-details-card reference-details-card--qa">
            <div class="reference-details-card__head">
              <h3>Reference Questions &amp; Answers</h3>
              <span>{{ currentRow.questions.length }} questions</span>
            </div>

            <div class="reference-details-questions">
              <article v-for="(item, index) in currentRow.questions" :key="item.question">
                <div class="reference-details-questions__head">
                  <span>{{ index + 1 }}</span>
                  <strong>{{ item.question }}</strong>
                  <AppIcon name="chevronDown" :size="14" />
                </div>
                <p>{{ item.answer }}</p>
              </article>
            </div>

            <div class="reference-details-comment">
              <div class="reference-details-comment__mark">&ldquo;</div>
              <div>
                <small>Additional Comments</small>
                <p>{{ currentRow.additionalComment }}</p>
              </div>
            </div>
          </article>

          <article class="reference-details-card">
            <div class="reference-details-card__head">
              <h3>AI Analysis</h3>
              <span>Generated by Nitrosync AI</span>
            </div>

            <div class="reference-details-analysis">
              <section>
                <small>Summary</small>
                <p>{{ currentRow.summary }}</p>
              </section>

              <section>
                <small>Key Themes</small>
                <div class="reference-details-tags">
                  <span v-for="theme in currentRow.keyThemes" :key="theme">{{ theme }}</span>
                </div>
              </section>

              <section>
                <small>Alignment With Other References</small>
                <div class="reference-details-alignment">
                  <div class="reference-details-alignment__ring" :style="alignmentRingStyle">
                    <span>{{ currentRow.alignmentScore }}%</span>
                  </div>
                  <div>
                    <strong>{{ currentRow.alignmentLabel }}</strong>
                    <p>{{ currentRow.alignmentCopy }}</p>
                  </div>
                </div>
              </section>

              <section>
                <small>Risk Flags</small>
                <ul class="reference-details-list">
                  <li v-for="flag in currentRow.riskFlags" :key="flag">
                    <AppIcon name="check" :size="12" />
                    {{ flag }}
                  </li>
                </ul>
              </section>

              <section>
                <small>Evidence Strength</small>
                <strong class="reference-details-evidence">
                  <span class="reference-details-stars">
                    <AppIcon v-for="star in 5" :key="star" name="star" :size="11" />
                  </span>
                  {{ currentRow.evidenceStrength }}
                </strong>
              </section>
            </div>
          </article>
        </section>
      </div>

      <footer class="reference-details-modal__foot">
        <button type="button" class="reference-details-button reference-details-button--ghost" @click="closeOverlay">
          Back to list
        </button>
        <button type="button" class="reference-details-button reference-details-button--ghost" @click="closeOverlay">
          Close
        </button>
      </footer>
    </section>

    <OriginalReferenceOverlay
      :open="originalReferenceOpen"
      :row="currentRow"
      @close="closeOriginalReference"
    />
  </div>
</template>

<style scoped>
.reference-details-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
  background: rgba(24, 33, 53, 0.32);
  backdrop-filter: blur(10px);
}

.reference-details-modal {
  width: min(1220px, calc(100vw - 44px));
  max-height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dfe7fb;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(45, 62, 100, 0.2);
}

.reference-details-modal__head,
.reference-details-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-bottom: 1px solid #edf1fb;
}

.reference-details-modal__foot {
  border-top: 1px solid #edf1fb;
  border-bottom: 0;
}

.reference-details-modal__head h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1rem;
}

.reference-details-modal__head p {
  margin: 4px 0 0;
  color: #7a89a8;
  font-size: 0.74rem;
}

.reference-details-modal__head button {
  width: 36px;
  height: 36px;
  border: 1px solid #dbe3f7;
  border-radius: 50%;
  background: #fff;
  color: #8193b7;
  cursor: pointer;
}

.reference-details-modal__body {
  flex: 1;
  overflow: auto;
  padding: 14px;
  display: grid;
  gap: 12px;
  background: linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.reference-details-summary,
.reference-details-card {
  border: 1px solid #e6ecfb;
  border-radius: 12px;
  background: #fff;
}

.reference-details-summary {
  display: grid;
  grid-template-columns: 240px 1fr auto;
  gap: 14px;
  padding: 14px;
  align-items: center;
}

.reference-details-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reference-details-profile__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd7eb 0%, #f3f5ff 100%);
  color: #ef4fa0;
  font-weight: 800;
}

.reference-details-profile__copy strong {
  display: block;
  color: #22314e;
  font-size: 0.92rem;
}

.reference-details-profile__copy p {
  margin: 4px 0;
  color: #65789d;
  font-size: 0.78rem;
}

.reference-details-profile__copy span {
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 999px;
  background: #f2efff;
  color: #6b5cff;
  font-size: 0.7rem;
  font-weight: 700;
}

.reference-details-stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.reference-details-stats article {
  min-width: 0;
  padding-left: 12px;
  border-left: 1px solid #eef2fb;
}

.reference-details-stats article:first-child {
  border-left: 0;
  padding-left: 0;
}

.reference-details-stats small,
.reference-details-analysis small,
.reference-details-comment small {
  display: block;
  margin-bottom: 6px;
  color: #97a5bf;
  font-size: 0.63rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.reference-details-stats strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #243454;
  font-size: 0.82rem;
}

.reference-details-stats span {
  display: block;
  margin-top: 4px;
  color: #6d7d9d;
  font-size: 0.74rem;
}

.reference-details-stats .is-success {
  color: #20a55c;
}

.reference-details-source-chip {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #edf2ff;
  color: #6b5cff;
  font-size: 0.58rem;
  font-weight: 800;
}

.reference-details-source-chip.is-integrated {
  background: #15171c;
  color: #fff;
}

.reference-details-source-chip.is-uploaded {
  background: #fff2e8;
  color: #ff8a2d;
}

.reference-details-confidence {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reference-details-confidence__ring {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at center, #fff 60%, transparent 61%),
    conic-gradient(#2bb35f 0 338deg, #e8edf9 338deg 360deg);
}

.reference-details-confidence__ring span {
  margin: 0;
  color: #1f2b44;
  font-size: 0.76rem;
  font-weight: 800;
}

.reference-details-original {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: start;
  padding: 10px 12px;
  border: 1px solid #dbe3f7;
  border-radius: 8px;
  background: #fff;
  color: #33415f;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}

.reference-details-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.55fr 0.95fr;
  gap: 12px;
}

.reference-details-left {
  display: grid;
  gap: 12px;
}

.reference-details-card {
  padding: 14px;
}

.reference-details-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.reference-details-card__head h3 {
  margin: 0;
  color: #1f2a44;
  font-size: 0.76rem;
  text-transform: uppercase;
}

.reference-details-card__head span {
  color: #6b5cff;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.reference-details-ratings {
  display: grid;
  gap: 9px;
}

.reference-details-ratings article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 8px;
}

.reference-details-ratings__label {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.reference-details-ratings__label span {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f6f8ff;
  color: #8b63ff;
}

.reference-details-ratings__label strong {
  color: #33415f;
  font-size: 0.76rem;
}

.reference-details-ratings em {
  color: #6b7c9d;
  font-size: 0.72rem;
  font-style: normal;
}

.reference-details-stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #23b15f;
}

.reference-details-stars :deep(svg.is-muted) {
  color: #d4dbee;
}

.reference-details-overall {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reference-details-overall__icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eaf9f0;
  color: #23b15f;
}

.reference-details-overall p {
  margin: 0;
  color: #526683;
  font-size: 0.76rem;
  line-height: 1.55;
}

.reference-details-overall span {
  display: inline-flex;
  margin-top: 8px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #e9f9ef;
  color: #21a95d;
  font-size: 0.7rem;
  font-weight: 700;
}

.reference-details-card--qa {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.reference-details-questions {
  display: grid;
  gap: 8px;
}

.reference-details-questions article {
  padding: 10px 0;
  border-top: 1px solid #eef2fb;
}

.reference-details-questions article:first-child {
  border-top: 0;
  padding-top: 0;
}

.reference-details-questions__head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
}

.reference-details-questions__head span {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ef4fa0;
  font-size: 0.66rem;
  font-weight: 800;
}

.reference-details-questions__head strong {
  color: #243454;
  font-size: 0.77rem;
}

.reference-details-questions p {
  margin: 8px 0 0 30px;
  color: #5d708f;
  font-size: 0.74rem;
  line-height: 1.6;
}

.reference-details-comment {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
  background: #fcfdff;
  border: 1px solid #edf1fb;
}

.reference-details-comment__mark {
  color: #ef4fa0;
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 800;
}

.reference-details-comment p,
.reference-details-analysis p {
  margin: 0;
  color: #5f7190;
  font-size: 0.74rem;
  line-height: 1.65;
}

.reference-details-analysis {
  display: grid;
  gap: 14px;
}

.reference-details-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reference-details-tags span {
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff0f7;
  color: #ef4fa0;
  font-size: 0.69rem;
  font-weight: 700;
}

.reference-details-alignment {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reference-details-alignment__ring {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.reference-details-alignment__ring span {
  color: #243454;
  font-size: 0.76rem;
  font-weight: 800;
}

.reference-details-alignment strong,
.reference-details-evidence {
  color: #243454;
  font-size: 0.76rem;
}

.reference-details-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.reference-details-list li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #5f7190;
  font-size: 0.73rem;
}

.reference-details-list li :deep(svg) {
  color: #23b15f;
}

.reference-details-evidence {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.reference-details-button {
  min-width: 112px;
  min-height: 36px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.reference-details-button--ghost {
  border: 1px solid #dbe3f7;
  background: #fff;
  color: #33415f;
}

@media (max-width: 1120px) {
  .reference-details-summary,
  .reference-details-grid {
    grid-template-columns: 1fr;
  }

  .reference-details-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .reference-details-overlay {
    padding: 12px;
  }

  .reference-details-modal {
    width: 100%;
    max-height: calc(100vh - 24px);
  }

  .reference-details-stats {
    grid-template-columns: 1fr;
  }

  .reference-details-modal__head,
  .reference-details-modal__foot,
  .reference-details-modal__body {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
