<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'add-to-plan'])

const selectedIds = ref([])

const planItems = ref([
  { id: 'frontend-coding', order: 1, title: 'Frontend Coding Assessment', meta: '90 min - External', tone: 'slate', icon: 'compare' },
  { id: 'portfolio-review', order: 2, title: 'Portfolio Review', meta: '30 min - Internal', tone: 'green', icon: 'document' },
  { id: 'product-case-study', order: 3, title: 'Product Design Case Study', meta: '60 min - External', tone: 'orange', icon: 'briefcase' },
])

const libraryItems = [
  {
    id: 'frontend-coding',
    title: 'Frontend Coding Assessment',
    provider: 'HackerRank - External',
    description: 'Evaluate frontend development skills, problem solving, and code quality.',
    duration: '90 min',
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
    result: 'Reviewer Based',
    usage: 'Used in 84 hires',
    covers: ['Design Thinking', 'UX', 'Communication'],
    recommended: false,
    tone: 'green',
    icon: 'document',
  },
  {
    id: 'product-case-study',
    title: 'Product Design Case Study',
    provider: 'TestGorilla - External',
    description: 'Assess product design process, user research and solution thinking.',
    duration: '60 min',
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
    result: 'Auto Sync',
    usage: 'Used in 143 hires',
    covers: ['Communication', 'Clarity', 'Writing'],
    recommended: false,
    tone: 'violet',
    icon: 'message',
  },
]

const filters = ['Recommended', 'Technical', 'Behavioral', 'Leadership', 'Communication', 'Portfolio', 'Case Study', 'Cognitive']

const selectedCount = computed(() => selectedIds.value.length)

function closeOverlay() {
  selectedIds.value = []
  emit('close')
}

function toggleAssessment(itemId) {
  if (selectedIds.value.includes(itemId)) {
    selectedIds.value = selectedIds.value.filter((id) => id !== itemId)
    return
  }

  selectedIds.value = [...selectedIds.value, itemId]
}

function submitPlan() {
  emit('add-to-plan')
  selectedIds.value = []
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="assessment-library-overlay" @click.self="closeOverlay">
      <section class="assessment-library-modal" @click.stop>
        <header class="assessment-library-modal__header">
          <div>
            <h2>Add Assessment</h2>
            <p>Browse, preview and add assessments to your plan.</p>
          </div>

          <button type="button" class="assessment-library-modal__close" aria-label="Close add assessment" @click="closeOverlay">
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
              <button type="button" class="assessment-library-search__filter">
                <AppIcon name="filter" :size="14" />
                <span>Filters</span>
                <AppIcon name="chevronDown" :size="14" />
              </button>
            </div>

            <div class="assessment-library-filter-row">
              <button
                v-for="filter in filters"
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
              v-for="item in libraryItems"
              :key="item.id"
              class="assessment-library-card"
            >
              <div class="assessment-library-card__icon" :class="`tone-${item.tone}`">
                <AppIcon :name="item.icon" :size="20" />
              </div>

              <div class="assessment-library-card__copy">
                <div class="assessment-library-card__head">
                  <div>
                    <h3>{{ item.title }}</h3>
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
                  <span v-for="cover in item.covers" :key="cover">{{ cover }}</span>
                </div>
              </div>

              <div class="assessment-library-card__actions">
                <button type="button" class="assessment-library-card__preview">Preview</button>
                <button
                  type="button"
                  class="assessment-library-card__add"
                  :class="{ 'is-selected': selectedIds.includes(item.id) }"
                  @click="toggleAssessment(item.id)"
                >
                  {{ selectedIds.includes(item.id) ? 'Added' : '+ Add' }}
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
              <span>{{ planItems.length }}</span>
            </div>

            <div class="assessment-library-side__items">
              <article
                v-for="item in planItems"
                :key="item.id"
                class="assessment-library-side__item"
              >
                <span class="assessment-library-side__order">{{ item.order }}</span>
                <span class="assessment-library-side__icon" :class="`tone-${item.tone}`">
                  <AppIcon :name="item.icon" :size="16" />
                </span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.meta }}</small>
                </div>
                <button type="button" aria-label="Remove assessment">
                  <AppIcon name="close" :size="12" />
                </button>
              </article>

              <button type="button" class="assessment-library-side__another">
                <AppIcon name="plus" :size="14" />
                <span>Add another assessment</span>
              </button>
            </div>

            <div class="assessment-library-side__summary">
              <h3>Plan Summary</h3>
              <div><span>Total assessments</span><strong>{{ planItems.length }}</strong></div>
              <div><span>Estimated total time</span><strong>2h 15m</strong></div>
              <div><span>Evidence coverage</span><strong>91%</strong></div>
              <div class="assessment-library-side__bar"><span /></div>
              <small>Great coverage!</small>
            </div>
          </aside>
        </div>

        <footer class="assessment-library-modal__footer">
          <button type="button" class="assessment-library-modal__cancel" @click="closeOverlay">Cancel</button>
          <button type="button" class="assessment-library-modal__submit" @click="submitPlan">
            <AppIcon name="checkCircle" :size="14" />
            <span>Add to Plan ({{ selectedCount }})</span>
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.assessment-library-overlay {
  position: fixed;
  inset: 0;
  z-index: 1700;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(10px);
}

.assessment-library-modal {
  display: flex;
  flex-direction: column;
  width: min(1320px, 100%);
  margin: auto 0;
  overflow: hidden;
  border: 1px solid #dbe5f3;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.24);
}

.assessment-library-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 32px 22px;
  border-bottom: 1px solid #e9eef8;
}

.assessment-library-modal__header h2 {
  margin: 0;
  color: #1c274c;
  font-size: 1.9rem;
  line-height: 1.08;
}

.assessment-library-modal__header p {
  margin: 6px 0 0;
  color: #7081a3;
}

.assessment-library-modal__close {
  width: 42px;
  height: 42px;
  border: 1px solid #cfdaf0;
  border-radius: 14px;
  color: #8b98b3;
  background: #fff;
}

.assessment-library-modal__body {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) 330px;
}

.assessment-library-main {
  display: block;
  padding: 24px 28px;
}

.assessment-library-side {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 24px 28px;
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

.assessment-library-search__filter,
.assessment-library-filter-chip,
.assessment-library-card__preview,
.assessment-library-card__add,
.assessment-library-side__another,
.assessment-library-modal__cancel,
.assessment-library-modal__submit {
  border-radius: 16px;
  font-weight: 800;
}

.assessment-library-search__filter,
.assessment-library-filter-chip,
.assessment-library-card__preview,
.assessment-library-card__add,
.assessment-library-side__another,
.assessment-library-modal__cancel {
  border: 1px solid #d3ddf2;
  color: #25375a;
  background: #fff;
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

.assessment-library-results-head button,
.assessment-library-pagination button,
.assessment-library-side__item button {
  border: 0;
  background: transparent;
}

.assessment-library-results-head button,
.assessment-library-pagination button {
  min-width: 34px;
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

.assessment-library-card__icon,
.assessment-library-side__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: #f6f8fe;
}

.assessment-library-card__icon.tone-green,
.assessment-library-side__icon.tone-green {
  color: #1ca757;
  background: #ecfdf3;
}

.assessment-library-card__icon.tone-orange,
.assessment-library-side__icon.tone-orange {
  color: #ff8a2a;
  background: #fff4e8;
}

.assessment-library-card__icon.tone-violet,
.assessment-library-side__icon.tone-violet {
  color: #5b5fdf;
  background: #eef1ff;
}

.assessment-library-card__icon.tone-pink,
.assessment-library-side__icon.tone-pink {
  color: #ef4f88;
  background: #ffedf4;
}

.assessment-library-card__icon.tone-slate,
.assessment-library-side__icon.tone-slate {
  color: #1f2b4d;
}

.assessment-library-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.assessment-library-card__head h3 {
  margin: 0;
  color: #223255;
  font-size: 1.05rem;
}

.assessment-library-card__head p {
  margin: 6px 0 0;
  color: #8d9ab4;
}

.assessment-library-card__head span {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
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

.assessment-library-card__add.is-selected,
.assessment-library-modal__submit {
  color: #fff;
  background: linear-gradient(135deg, #f06bad 0%, #ea5ca2 100%);
  box-shadow: 0 18px 28px rgba(240, 93, 169, 0.22);
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

.assessment-library-side__items {
  display: grid;
  gap: 12px;
}

.assessment-library-side__item {
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

.assessment-library-side__item strong {
  display: block;
  color: #25375a;
  font-size: 0.94rem;
}

.assessment-library-side__item small {
  display: block;
  margin-top: 4px;
  color: #8f9dbc;
}

.assessment-library-side__another {
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

.assessment-library-side__summary h3 {
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

.assessment-library-side__bar {
  height: 8px;
  margin-top: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: #dfe6f3;
}

.assessment-library-side__bar span {
  display: block;
  width: 91%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #27c86d 0%, #15a34a 100%);
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

.assessment-library-pagination button.is-active {
  color: #f05d9a;
  background: #ffeff6;
}

.assessment-library-modal__footer {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  flex: 0 0 auto;
  gap: 14px;
  padding: 22px 28px 28px;
  border-top: 1px solid #e9eef8;
  background: #fff;
}

.assessment-library-modal__cancel,
.assessment-library-modal__submit {
  padding: 16px 18px;
  font-size: 1rem;
}

.assessment-library-modal__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 1180px) {
  .assessment-library-modal__body {
    grid-template-columns: 1fr;
  }

  .assessment-library-side {
    border-left: 0;
    border-top: 1px solid #e9eef8;
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
  .assessment-library-overlay {
    padding: 12px;
  }

  .assessment-library-modal {
    border-radius: 22px;
  }

  .assessment-library-modal__header,
  .assessment-library-main,
  .assessment-library-side,
  .assessment-library-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .assessment-library-search,
  .assessment-library-results-head {
    flex-direction: column;
    align-items: stretch;
  }

  .assessment-library-modal__footer {
    grid-template-columns: 1fr;
  }
}
</style>
