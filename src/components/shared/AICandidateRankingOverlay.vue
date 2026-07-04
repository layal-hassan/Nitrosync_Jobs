<script setup>
import { computed } from 'vue'
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
    default: 'UX Designer',
  },
  candidateStage: {
    type: String,
    default: 'Interview',
  },
  candidateAppliedOn: {
    type: String,
    default: 'May 12, 2025',
  },
})

const emit = defineEmits(['close', 'compare-candidates'])

const categoryCards = [
  { label: 'Skills', rank: '#3', percentile: 'Top 10%', icon: 'briefcase', tone: 'violet' },
  { label: 'Experience', rank: '#5', percentile: 'Top 15%', icon: 'briefcase', tone: 'blue' },
  { label: 'Portfolio', rank: '#1', percentile: 'Top 5%', icon: 'document', tone: 'green' },
  { label: 'Culture Fit', rank: '#4', percentile: 'Top 10%', icon: 'star', tone: 'orange' },
  { label: 'Overall Rank', rank: '#2', percentile: 'Top 4%', icon: 'sparkles', tone: 'pink', featured: true },
]

const comparisonCards = computed(() => ([
  {
    rank: '#1',
    name: 'Emma Wilson',
    role: 'UX Designer',
    meta: 'Hired: Feb 2024',
    match: '96% Match',
    tone: 'green',
    title: 'Why ranked higher?',
    reasons: ['More leadership experience', 'Enterprise SaaS background', 'Larger team collaboration'],
  },
  {
    rank: '#2',
    name: props.candidateName,
    role: props.candidateRole,
    meta: 'Current Candidate',
    match: '94% Match',
    tone: 'pink',
    title: 'Why ranked here?',
    reasons: ['Strong UX research skills', 'Excellent portfolio quality', 'Great SaaS experience'],
    featured: true,
    badge: 'Target Candidate',
  },
  {
    rank: '#3',
    name: 'Daniel Lee',
    role: 'UX Designer',
    meta: 'Hired: Nov 2023',
    match: '91% Match',
    tone: 'orange',
    title: 'Why ranked lower?',
    reasons: ['Less UX research experience', 'Smaller portfolio', 'Limited design systems work'],
  },
]))

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function closeOverlay() {
  emit('close')
}

function compareCandidates() {
  emit('compare-candidates')
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="candidate-ranking-overlay" @click.self="closeOverlay">
      <section class="candidate-ranking-modal">
        <header class="candidate-ranking-modal__head">
          <div class="candidate-ranking-modal__title">
            <span class="candidate-ranking-modal__title-icon">
              <AppIcon name="briefcase" :size="18" />
            </span>
            <div>
              <h2>Candidate Ranking</h2>
              <p>See how this candidate compares to other applicants</p>
            </div>
          </div>

          <button class="candidate-ranking-modal__close" type="button" aria-label="Close Candidate Ranking" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="candidate-ranking-modal__body">
          <section class="candidate-ranking-hero">
            <article class="candidate-ranking-profile">
              <span class="candidate-ranking-profile__avatar">{{ candidateInitials }}</span>
              <div class="candidate-ranking-profile__copy">
                <strong>{{ candidateName }}</strong>
                <span>{{ candidateRole }}</span>
                <small>Applied on {{ candidateAppliedOn }} <i aria-hidden="true">•</i> Current stage: {{ candidateStage }}</small>
              </div>
            </article>

            <div class="candidate-ranking-hero__score" aria-label="Candidate is ranked number 2 of 48 applicants">
              <span class="candidate-ranking-hero__arc is-left" aria-hidden="true" />
              <div class="candidate-ranking-hero__copy">
                <strong>#2 <span>of 48</span></strong>
                <small>Applicants</small>
                <em>
                  <AppIcon name="trend-up" :size="10" />
                  <span>Top 4%</span>
                </em>
              </div>
              <span class="candidate-ranking-hero__arc is-right" aria-hidden="true" />
            </div>
          </section>

          <section class="candidate-ranking-section">
            <div class="candidate-ranking-section__head">
              <h3>Category Breakdown</h3>
              <AppIcon name="info" :size="15" />
            </div>

            <div class="candidate-ranking-category-grid">
              <article
                v-for="item in categoryCards"
                :key="item.label"
                class="candidate-ranking-category-card"
                :class="[{ 'is-featured': item.featured }, `is-${item.tone}`]"
              >
                <span class="candidate-ranking-category-card__icon">
                  <AppIcon :name="item.icon" :size="16" />
                </span>
                <small>{{ item.label }}</small>
                <strong>{{ item.rank }}</strong>
                <em>{{ item.percentile }}</em>
              </article>
            </div>
          </section>

          <section class="candidate-ranking-section">
            <div class="candidate-ranking-section__head">
              <h3>Ranking Comparison</h3>
            </div>

            <div class="candidate-ranking-comparison-grid">
              <article
                v-for="card in comparisonCards"
                :key="card.rank"
                class="candidate-ranking-compare-card"
                :class="[{ 'is-featured': card.featured }, `is-${card.tone}`]"
              >
                <span v-if="card.badge" class="candidate-ranking-compare-card__badge">{{ card.badge }}</span>
                <div class="candidate-ranking-compare-card__top">
                  <span class="candidate-ranking-compare-card__rank">{{ card.rank }}</span>
                  <span class="candidate-ranking-compare-card__match" :class="`is-${card.tone}`">{{ card.match }}</span>
                </div>

                <strong>{{ card.name }}</strong>
                <small>{{ card.role }}</small>
                <span class="candidate-ranking-compare-card__meta">{{ card.meta }}</span>

                <div class="candidate-ranking-compare-card__section">
                  <h4>{{ card.title }}</h4>
                  <ul>
                    <li v-for="reason in card.reasons" :key="reason">{{ reason }}</li>
                  </ul>
                </div>
              </article>
            </div>
          </section>

          <section class="candidate-ranking-insight">
            <div>
              <small>Nitro Insight</small>
              <p>If you can hire 3 candidates for this role, {{ candidateName.split(' ')[0] }} should be one of them. They have strong long-term impact potential.</p>
            </div>

            <div class="candidate-ranking-insight__score">
              <span>Confidence</span>
              <strong>91%</strong>
            </div>
          </section>

          <section class="candidate-ranking-section">
            <div class="candidate-ranking-section__head">
              <h3>Ranking Distribution</h3>
              <AppIcon name="info" :size="15" />
            </div>

            <div class="candidate-ranking-distribution">
              <div class="candidate-ranking-distribution__segments">
                <div class="candidate-ranking-distribution__segment is-hot is-xs">
                  <span>Top 1%</span>
                  <i />
                </div>

                <div class="candidate-ranking-distribution__segment is-hot is-sm">
                  <span>Top 5%</span>
                  <i />
                </div>

                <div class="candidate-ranking-distribution__segment is-hot is-lg">
                  <span>Top 10%</span>
                  <i />
                </div>

                <div class="candidate-ranking-distribution__segment is-md">
                  <span>Top 25%</span>
                  <i />
                </div>

                <div class="candidate-ranking-distribution__segment is-current is-sm">
                  <span>Top 50%</span>
                  <i />
                  <div class="candidate-ranking-distribution__marker">
                    <em>You are here</em>
                    <strong>Top 4%</strong>
                  </div>
                </div>

                <div class="candidate-ranking-distribution__segment is-md">
                  <span>Below 50%</span>
                  <i />
                </div>
              </div>

              <p>Ranked against 48 total applicants</p>
            </div>
          </section>
        </div>

        <footer class="candidate-ranking-modal__footer">
          <button class="candidate-ranking-link" type="button">
            <span>View Full Ranking Report</span>
            <AppIcon name="external-link" :size="14" />
          </button>

          <div class="candidate-ranking-modal__actions">
            <button class="candidate-ranking-button candidate-ranking-button--ghost" type="button" @click="closeOverlay">Close</button>
            <button class="candidate-ranking-button candidate-ranking-button--primary" type="button" @click="compareCandidates">
              <AppIcon name="compare" :size="15" />
              <span>Compare Candidates</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.candidate-ranking-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(21, 28, 42, 0.52);
  backdrop-filter: blur(5px);
}

.candidate-ranking-modal {
  width: min(100%, 700px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.22);
}

.candidate-ranking-modal__head,
.candidate-ranking-modal__title,
.candidate-ranking-hero,
.candidate-ranking-profile,
.candidate-ranking-hero__score,
.candidate-ranking-section__head,
.candidate-ranking-modal__footer,
.candidate-ranking-modal__actions,
.candidate-ranking-button,
.candidate-ranking-link,
.candidate-ranking-compare-card__top,
.candidate-ranking-insight {
  display: flex;
  align-items: center;
}

.candidate-ranking-modal__head,
.candidate-ranking-section__head,
.candidate-ranking-modal__footer,
.candidate-ranking-insight {
  justify-content: space-between;
}

.candidate-ranking-modal__head {
  padding: 20px 24px;
  border-bottom: 1px solid #edf2fb;
}

.candidate-ranking-modal__title {
  gap: 14px;
}

.candidate-ranking-modal__title-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #fff1f8;
  color: #ff67b5;
}

.candidate-ranking-modal__title h2,
.candidate-ranking-section__head h3,
.candidate-ranking-profile__copy strong,
.candidate-ranking-hero__copy strong,
.candidate-ranking-category-card strong,
.candidate-ranking-compare-card strong,
.candidate-ranking-insight__score strong {
  margin: 0;
  color: #1f2940;
}

.candidate-ranking-modal__title p,
.candidate-ranking-profile__copy span,
.candidate-ranking-profile__copy small,
.candidate-ranking-distribution p,
.candidate-ranking-compare-card small,
.candidate-ranking-compare-card__meta {
  margin: 0;
  color: #7a879e;
}

.candidate-ranking-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.candidate-ranking-modal__body {
  overflow: auto;
  padding: 22px 24px 26px;
}

.candidate-ranking-hero {
  gap: 18px;
  padding: 18px 20px;
  border: 1px solid #e6ecf5;
  border-radius: 18px;
  background: #fbfcff;
}

.candidate-ranking-profile {
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.candidate-ranking-profile__avatar {
  width: 60px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd49a 0%, #466d7f 100%);
  color: #fff;
  font-size: 1.15rem;
  font-weight: 800;
}

.candidate-ranking-profile__copy strong {
  display: block;
  font-size: 1.1rem;
}

.candidate-ranking-profile__copy > span {
  display: block;
  margin-top: 4px;
  font-size: 0.95rem;
  color: #42506d;
}

.candidate-ranking-profile__copy small {
  display: block;
  margin-top: 8px;
  font-size: 0.78rem;
}

.candidate-ranking-profile__copy i {
  margin: 0 6px;
  color: #b0bac9;
  font-style: normal;
}

.candidate-ranking-hero__score {
  position: relative;
  min-width: 182px;
  min-height: 78px;
  justify-content: center;
  padding: 4px 22px 2px;
}

.candidate-ranking-hero__arc {
  position: absolute;
  top: 18px;
  width: 22px;
  height: 22px;
  border: 6px solid #c8d4e6;
  border-radius: 50%;
}

.candidate-ranking-hero__arc.is-left {
  left: 6px;
  border-top-color: transparent;
  border-right-color: transparent;
  transform: rotate(-10deg);
}

.candidate-ranking-hero__arc.is-right {
  right: 6px;
  border-bottom-color: transparent;
  border-left-color: transparent;
  transform: rotate(-10deg);
}

.candidate-ranking-hero__copy {
  text-align: center;
}

.candidate-ranking-hero__copy strong {
  display: block;
  font-size: 1.4rem;
  line-height: 0.9;
}

.candidate-ranking-hero__copy strong span {
  color: #94a1b8;
  font-size: 0.78rem;
  font-weight: 600;
}

.candidate-ranking-hero__copy small {
  display: block;
  margin-top: 4px;
  color: #6f7e97;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.candidate-ranking-hero__copy em {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 22px;
  margin-top: 7px;
  padding: 0 9px;
  border-radius: 999px;
  background: #eefcf3;
  color: #1fa74f;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 700;
}

.candidate-ranking-section {
  margin-top: 26px;
}

.candidate-ranking-section__head {
  gap: 8px;
  justify-content: flex-start;
}

.candidate-ranking-section__head h3 {
  font-size: 1rem;
}

.candidate-ranking-section__head :deep(svg) {
  color: #b0bac9;
}

.candidate-ranking-category-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.candidate-ranking-category-card {
  padding: 16px 12px;
  border: 1px solid #e6ecf5;
  border-radius: 16px;
  text-align: center;
  background: #fff;
}

.candidate-ranking-category-card.is-featured {
  border-width: 2px;
  box-shadow: 0 12px 24px rgba(255, 103, 181, 0.1);
}

.candidate-ranking-category-card__icon {
  display: inline-flex;
  color: #7383a2;
}

.candidate-ranking-category-card.is-violet .candidate-ranking-category-card__icon,
.candidate-ranking-category-card.is-violet em {
  color: #6570f6;
}

.candidate-ranking-category-card.is-blue .candidate-ranking-category-card__icon,
.candidate-ranking-category-card.is-blue em {
  color: #4a78ff;
}

.candidate-ranking-category-card.is-green .candidate-ranking-category-card__icon,
.candidate-ranking-category-card.is-green em {
  color: #1fa74f;
}

.candidate-ranking-category-card.is-orange .candidate-ranking-category-card__icon,
.candidate-ranking-category-card.is-orange em {
  color: #f28b2f;
}

.candidate-ranking-category-card.is-pink {
  border-color: #ff72ba;
  background: #fffafd;
}

.candidate-ranking-category-card.is-pink .candidate-ranking-category-card__icon,
.candidate-ranking-category-card.is-pink strong,
.candidate-ranking-category-card.is-pink em,
.candidate-ranking-category-card.is-pink small {
  color: #ff67b5;
}

.candidate-ranking-category-card small {
  display: block;
  margin-top: 10px;
  color: #65758f;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.candidate-ranking-category-card strong {
  display: block;
  margin-top: 6px;
  font-size: 1.2rem;
}

.candidate-ranking-category-card em {
  display: block;
  margin-top: 6px;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
}

.candidate-ranking-comparison-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.candidate-ranking-compare-card {
  position: relative;
  padding: 16px;
  border: 1px solid #e6ecf5;
  border-radius: 16px;
  background: #fff;
}

.candidate-ranking-compare-card.is-featured {
  border: 2px solid #ff72ba;
  box-shadow: 0 14px 30px rgba(255, 103, 181, 0.12);
}

.candidate-ranking-compare-card__badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
}

.candidate-ranking-compare-card__top {
  justify-content: space-between;
  gap: 10px;
}

.candidate-ranking-compare-card__rank {
  color: #1f2940;
  font-size: 0.98rem;
  font-weight: 800;
}

.candidate-ranking-compare-card__match {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 8px;
  border-radius: 10px;
  background: #f6f8fc;
  font-size: 0.72rem;
  font-weight: 800;
}

.candidate-ranking-compare-card__match.is-green {
  color: #1fa74f;
  background: #eefcf3;
}

.candidate-ranking-compare-card__match.is-pink {
  color: #ff67b5;
  background: #fff1f8;
}

.candidate-ranking-compare-card__match.is-orange {
  color: #f28b2f;
  background: #fff4ea;
}

.candidate-ranking-compare-card strong {
  display: block;
  margin-top: 10px;
  font-size: 1rem;
}

.candidate-ranking-compare-card small,
.candidate-ranking-compare-card__meta {
  display: block;
  margin-top: 4px;
  font-size: 0.76rem;
}

.candidate-ranking-compare-card__section {
  margin-top: 16px;
}

.candidate-ranking-compare-card__section h4 {
  margin: 0;
  color: #29344b;
  font-size: 0.82rem;
}

.candidate-ranking-compare-card__section ul {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.candidate-ranking-compare-card__section li {
  color: #738199;
  font-size: 0.75rem;
  line-height: 1.45;
}

.candidate-ranking-compare-card__section li::before {
  content: '✓';
  margin-right: 6px;
}

.candidate-ranking-compare-card.is-orange .candidate-ranking-compare-card__section li::before {
  content: '−';
}

.candidate-ranking-insight {
  gap: 18px;
  margin-top: 24px;
  padding: 18px 20px;
  border: 1px solid #e6ecf5;
  border-radius: 18px;
  background: #fbfcff;
}

.candidate-ranking-insight small {
  display: block;
  color: #ff67b5;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.candidate-ranking-insight p {
  margin: 10px 0 0;
  color: #42506d;
  line-height: 1.6;
}

.candidate-ranking-insight__score {
  min-width: 100px;
  padding: 12px 14px;
  border: 1px solid #e6ecf5;
  border-radius: 14px;
  background: #fff;
  text-align: center;
}

.candidate-ranking-insight__score span {
  display: block;
  color: #b0bac9;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.candidate-ranking-insight__score strong {
  display: block;
  margin-top: 6px;
  color: #ff67b5;
  font-size: 1.85rem;
}

.candidate-ranking-distribution {
  margin-top: 14px;
}

.candidate-ranking-distribution__segments {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px;
  align-items: end;
}

.candidate-ranking-distribution__segment {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 18px;
  min-height: 92px;
}

.candidate-ranking-distribution__segment > span {
  color: #90a0b9;
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
}

.candidate-ranking-distribution__segment i {
  height: 10px;
  border-radius: 999px;
  background: #dfe7f3;
  justify-self: center;
}

.candidate-ranking-distribution__segment.is-xs i {
  width: 8px;
}

.candidate-ranking-distribution__segment.is-sm i {
  width: 20px;
}

.candidate-ranking-distribution__segment.is-md i {
  width: 32px;
}

.candidate-ranking-distribution__segment.is-lg i {
  width: 46px;
}

.candidate-ranking-distribution__segment.is-hot i {
  background: linear-gradient(90deg, #ff72ba 0%, #f15fab 100%);
}

.candidate-ranking-distribution__marker {
  position: absolute;
  left: 50%;
  top: 26px;
  transform: translateX(-50%);
  display: grid;
  justify-items: center;
  gap: 4px;
  pointer-events: none;
}

.candidate-ranking-distribution__marker::before {
  content: '';
  width: 14px;
  height: 14px;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #f15fab;
  box-shadow: 0 0 0 1px #f7bfd8;
}

.candidate-ranking-distribution__marker em,
.candidate-ranking-distribution__marker strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: 999px;
  background: #fff1f8;
  color: #ff67b5;
  font-style: normal;
  font-size: 0.7rem;
  font-weight: 700;
}

.candidate-ranking-distribution__marker strong {
  min-height: 24px;
}

.candidate-ranking-distribution p {
  margin-top: 18px;
  text-align: center;
  font-size: 0.76rem;
}

.candidate-ranking-modal__footer {
  padding: 18px 24px 20px;
  border-top: 1px solid #edf2fb;
}

.candidate-ranking-link {
  border: 0;
  background: transparent;
  color: #65758f;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.candidate-ranking-modal__actions {
  gap: 12px;
}

.candidate-ranking-button {
  justify-content: center;
  gap: 8px;
  min-width: 120px;
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.candidate-ranking-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #42506d;
}

.candidate-ranking-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.2);
}

@media (max-width: 860px) {
  .candidate-ranking-category-grid,
  .candidate-ranking-comparison-grid {
    grid-template-columns: 1fr 1fr;
  }

  .candidate-ranking-category-card.is-featured {
    grid-column: span 2;
  }
}

@media (max-width: 720px) {
  .candidate-ranking-overlay {
    padding: 12px;
  }

  .candidate-ranking-modal {
    max-height: calc(100vh - 24px);
    border-radius: 18px;
  }

  .candidate-ranking-modal__head,
  .candidate-ranking-modal__footer,
  .candidate-ranking-hero,
  .candidate-ranking-insight {
    flex-direction: column;
    align-items: flex-start;
  }

  .candidate-ranking-modal__body,
  .candidate-ranking-modal__head,
  .candidate-ranking-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .candidate-ranking-category-grid,
  .candidate-ranking-comparison-grid,
  .candidate-ranking-distribution__segments {
    grid-template-columns: 1fr;
  }

  .candidate-ranking-distribution__segment {
    justify-items: start;
    gap: 10px;
    min-height: auto;
  }

  .candidate-ranking-distribution__segment > span {
    text-align: left;
  }

  .candidate-ranking-distribution__segment i {
    justify-self: start;
  }

  .candidate-ranking-distribution__segment.is-current {
    padding-top: 54px;
  }

  .candidate-ranking-distribution__marker {
    top: 0;
    left: 0;
    transform: none;
    justify-items: start;
  }

  .candidate-ranking-distribution p {
    margin-top: 18px;
    text-align: left;
  }

  .candidate-ranking-modal__actions,
  .candidate-ranking-button {
    width: 100%;
  }
}
</style>
