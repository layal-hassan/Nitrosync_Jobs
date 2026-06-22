<script setup>
import { computed, ref } from 'vue'
import AppIcon from '../../shared/AppIcon.vue'

const mustHaves = ref(['IFRS experience', '5+ years in accounting', 'Accounting degree', 'Fluent in English'])
const niceToHaves = ref(['SAP experience', 'Power BI', 'CPA / ACCA', 'Big 4 experience'])
const dealBreakers = ref(['No accounting background', 'No work permit', 'No finance experience'])

const aiUses = [
  'Rank candidates based on fit',
  'Auto-shortlist top applicants',
  'Generate relevant screening questions',
  'Personalize interview questions',
  'Improve hiring recommendations',
]

const readiness = [
  { step: 'Define Role', note: 'Describe the role and hiring need', done: true },
  { step: 'Hiring Blueprint', note: 'Review and approve AI blueprint', done: true },
  { step: 'Candidate Persona', note: 'Define your ideal candidate', active: true },
  { step: 'Application Setup' },
  { step: 'AI Screening' },
  { step: 'Hiring Pipeline' },
  { step: 'Interview Kit' },
  { step: 'Publish Job' },
]

const snapshot = [
  ['Role', 'Senior Accountant', 'briefcase'],
  ['Experience', '5 – 8 years', 'calendar'],
  ['Industry', 'Finance / Accounting', 'building'],
  ['Work Preference', 'Hybrid', 'briefcase'],
]

const modalTab = ref('suggestions')
const modalSearch = ref('')
const activeModalType = ref(null)

const personaModalConfigs = {
  must: {
    title: 'Add Must-Have Requirement',
    subtitle: 'Add a non-negotiable requirement for this role.',
    addLabel: 'Add Requirement',
    tone: 'green',
    recentTitle: 'Recently Added',
    searchTitle: 'Search Requirement',
    aiTitle: 'AI Suggestions',
    helperText: 'AI suggestions are based on the job title, description, blueprint and persona. You can add, remove or edit requirements anytime.',
    suggestions: ['SAP experience', 'Financial reporting', 'IFRS experience', 'CPA certification', 'Excel - Advanced', 'Power BI', 'Budgeting & Forecasting', 'Work authorization', 'Communication skills'],
  },
  nice: {
    title: 'Add Nice-to-Have Requirement',
    subtitle: 'Add a preferred skill or background that is a plus for this role.',
    addLabel: 'Add Skill',
    tone: 'orange',
    recentTitle: 'Recently Added',
    searchTitle: 'Search Preference',
    aiTitle: 'Suggested Extras',
    helperText: 'Suggestions are generated from the role profile and current hiring blueprint. Use them to enrich the persona without making it too restrictive.',
    suggestions: ['Swedish language', 'Shared services background', 'Leadership exposure', 'ERP migration projects', 'CMA certification', 'FP&A support', 'Audit background', 'Tax exposure', 'Cross-functional communication'],
  },
  deal: {
    title: 'Add Deal Breaker',
    subtitle: 'Add a red flag that should disqualify a candidate for this role.',
    addLabel: 'Add Rule',
    tone: 'red',
    recentTitle: 'Current Deal Breakers',
    searchTitle: 'Search Rule',
    aiTitle: 'Suggested Disqualifiers',
    helperText: 'Use deal breakers carefully. These rules should represent clear disqualifiers that reduce review time without filtering out strong talent unfairly.',
    suggestions: ['No IFRS exposure', 'No accounting degree', 'Unavailable in 60 days', 'No stakeholder communication', 'No ERP system knowledge', 'Lacks work authorization', 'No reporting experience', 'No Excel proficiency', 'No English fluency'],
  },
}

const activeModalConfig = computed(() => (
  activeModalType.value ? personaModalConfigs[activeModalType.value] : null
))

const activeModalItems = computed(() => {
  if (activeModalType.value === 'must') return mustHaves.value
  if (activeModalType.value === 'nice') return niceToHaves.value
  if (activeModalType.value === 'deal') return dealBreakers.value
  return []
})

const filteredModalSuggestions = computed(() => {
  if (!activeModalConfig.value) return []

  const query = modalSearch.value.trim().toLowerCase()

  return activeModalConfig.value.suggestions.filter((item) => (
    !query || item.toLowerCase().includes(query)
  ))
})

function openAddModal(type) {
  activeModalType.value = type
  modalTab.value = 'suggestions'
  modalSearch.value = ''
}

function closeAddModal() {
  activeModalType.value = null
  modalSearch.value = ''
}

function addModalItem(item) {
  const value = item.trim()

  if (!value) return

  if (activeModalType.value === 'must' && !mustHaves.value.includes(value)) {
    mustHaves.value = [...mustHaves.value, value]
  }

  if (activeModalType.value === 'nice' && !niceToHaves.value.includes(value)) {
    niceToHaves.value = [...niceToHaves.value, value]
  }

  if (activeModalType.value === 'deal' && !dealBreakers.value.includes(value)) {
    dealBreakers.value = [...dealBreakers.value, value]
  }

  modalSearch.value = ''
}

function removeModalItem(item) {
  if (activeModalType.value === 'must') {
    mustHaves.value = mustHaves.value.filter((entry) => entry !== item)
  }

  if (activeModalType.value === 'nice') {
    niceToHaves.value = niceToHaves.value.filter((entry) => entry !== item)
  }

  if (activeModalType.value === 'deal') {
    dealBreakers.value = dealBreakers.value.filter((entry) => entry !== item)
  }
}

function modalItemExists(item) {
  return activeModalItems.value.includes(item)
}
</script>

<template>
  <section class="persona-step">
    <div class="persona-step__main">
      <section class="persona-hero">
        <p>Step 3 of 8</p>
        <h2>
          Define your ideal candidate
          <AppIcon name="bolt" :size="18" />
        </h2>
        <span>Tell us who would be a great fit for this role. This helps AI find, screen and rank the best candidates.</span>
      </section>

      <section class="persona-card panel">
        <div class="persona-card__head">
          <div class="persona-card__title">
            <div class="persona-card__icon tone-green"><AppIcon name="checkCircle" :size="16" /></div>
            <div>
              <strong>Must Have</strong>
              <span>Non-negotiable requirements. Candidates must meet these.</span>
            </div>
          </div>
          <button type="button" @click="openAddModal('must')">+ Add</button>
        </div>
        <div class="chip-grid">
          <div v-for="item in mustHaves" :key="item" class="chip chip--green">
            <AppIcon name="check" :size="12" />
            <span>{{ item }}</span>
            <AppIcon name="edit" :size="11" />
            <AppIcon name="close" :size="11" />
          </div>
        </div>
      </section>

      <section class="persona-card panel">
        <div class="persona-card__head">
          <div class="persona-card__title">
            <div class="persona-card__icon tone-orange"><AppIcon name="star" :size="16" /></div>
            <div>
              <strong>Nice To Have</strong>
              <span>Preferred skills and experience that are a plus.</span>
            </div>
          </div>
          <button type="button" @click="openAddModal('nice')">+ Add</button>
        </div>
        <div class="chip-grid">
          <div v-for="item in niceToHaves" :key="item" class="chip chip--orange">
            <AppIcon name="check" :size="12" />
            <span>{{ item }}</span>
            <AppIcon name="edit" :size="11" />
            <AppIcon name="close" :size="11" />
          </div>
        </div>
      </section>

      <section class="persona-card panel">
        <div class="persona-card__head">
          <div class="persona-card__title">
            <div class="persona-card__icon tone-red"><AppIcon name="close" :size="16" /></div>
            <div>
              <strong>Deal Breakers</strong>
              <span>Red flags that would disqualify a candidate.</span>
            </div>
          </div>
          <button type="button" @click="openAddModal('deal')">+ Add</button>
        </div>
        <div class="chip-grid">
          <div v-for="item in dealBreakers" :key="item" class="chip chip--red">
            <AppIcon name="alert" :size="12" />
            <span>{{ item }}</span>
            <AppIcon name="edit" :size="11" />
            <AppIcon name="close" :size="11" />
          </div>
        </div>
      </section>

      <section class="persona-snapshot panel">
        <div class="persona-snapshot__head">
          <div class="persona-card__icon tone-violet"><AppIcon name="user" :size="16" /></div>
          <div class="persona-snapshot__intro">
            <strong>Ideal Candidate Snapshot</strong>
            <span>AI-generated summary of your ideal candidate.</span>
          </div>
        </div>

        <div class="persona-snapshot__grid">
          <article v-for="[label, value, icon] in snapshot" :key="label">
            <div class="snapshot-icon">
              <AppIcon :name="icon" :size="15" />
            </div>
            <small>{{ label }}</small>
            <strong>{{ value }}</strong>
          </article>
        </div>

        <div class="persona-strengths">
          <small>Key strengths</small>
          <strong>IFRS, Reporting, Excel, Analysis</strong>
        </div>
      </section>
    </div>

    <aside class="persona-step__side">
      <section class="side-card panel">
        <div class="side-card__head">
          <AppIcon name="bolt" :size="16" />
          <strong>AI will use this profile to</strong>
        </div>
        <ul class="side-list">
          <li v-for="item in aiUses" :key="item">
            <AppIcon name="checkCircle" :size="14" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <section class="side-card panel">
        <strong class="readiness-title">Hiring Readiness</strong>
        <div class="readiness-list">
          <div v-for="item in readiness" :key="item.step" class="readiness-item" :class="{ 'is-done': item.done, 'is-active': item.active }">
            <span>{{ item.done ? '' : readiness.indexOf(item) + 1 }}</span>
            <div>
              <strong>{{ item.step }}</strong>
              <small v-if="item.note">{{ item.note }}</small>
            </div>
          </div>
        </div>
      </section>

      <section class="tip-card panel">
        <div class="tip-card__icon">
          <AppIcon name="spark" :size="16" />
        </div>
        <div class="tip-card__copy">
          <strong>Tip</strong>
          <span>Be specific about must-have skills to get the most accurate matches.</span>
        </div>
      </section>
    </aside>

    <div v-if="activeModalConfig" class="persona-modal">
      <div class="persona-modal__backdrop" @click="closeAddModal" />
      <section class="persona-modal__dialog panel">
        <div class="persona-modal__header">
          <div>
            <h3>{{ activeModalConfig.title }}</h3>
            <p>{{ activeModalConfig.subtitle }}</p>
          </div>
          <button type="button" class="persona-modal__close" @click="closeAddModal">
            <AppIcon name="close" :size="18" />
          </button>
        </div>

        <div class="persona-modal__tabs">
          <button
            type="button"
            :class="{ 'is-active': modalTab === 'suggestions' }"
            @click="modalTab = 'suggestions'"
          >
            Suggestions
          </button>
          <button
            type="button"
            :class="{ 'is-active': modalTab === 'recent' }"
            @click="modalTab = 'recent'"
          >
            Recently Added ({{ activeModalItems.length }})
          </button>
        </div>

        <div class="persona-modal__body">
          <section class="persona-modal__section">
            <div class="persona-modal__section-head">
              <strong>1. {{ activeModalConfig.recentTitle }} ({{ activeModalItems.length }})</strong>
            </div>
            <div class="persona-modal__recent">
              <button
                v-for="item in activeModalItems"
                :key="item"
                type="button"
                class="persona-modal__recent-chip"
                :class="`persona-modal__recent-chip--${activeModalConfig.tone}`"
                @click="removeModalItem(item)"
              >
                <AppIcon name="check" :size="12" />
                <span>{{ item }}</span>
                <AppIcon name="close" :size="14" />
              </button>
            </div>
          </section>

          <section class="persona-modal__section">
            <div class="persona-modal__section-head">
              <strong>2. {{ activeModalConfig.searchTitle }}</strong>
            </div>
            <label class="persona-modal__search">
              <AppIcon name="search" :size="16" />
              <input
                v-model="modalSearch"
                type="text"
                placeholder="Search or type requirement..."
                @keydown.enter.prevent="addModalItem(modalSearch)"
              />
            </label>
          </section>

          <section class="persona-modal__section">
            <div class="persona-modal__section-head persona-modal__section-head--split">
              <strong>3. {{ activeModalConfig.aiTitle }}</strong>
              <div class="persona-modal__tools">
                <button type="button" class="persona-modal__ai-button">
                  <AppIcon name="sparkles" :size="14" />
                  Generate More with AI
                </button>
                <button type="button" class="persona-modal__refresh">
                  <AppIcon name="refresh" :size="14" />
                  Refresh
                </button>
              </div>
            </div>

            <div class="persona-modal__suggestions">
              <button
                v-for="item in filteredModalSuggestions"
                :key="item"
                type="button"
                class="persona-modal__suggestion"
                :class="{
                  'is-added': modalItemExists(item),
                  [`persona-modal__suggestion--${activeModalConfig.tone}`]: true,
                }"
                @click="!modalItemExists(item) && addModalItem(item)"
              >
                <template v-if="modalItemExists(item)">
                  <span>{{ item }}</span>
                  <small>
                    <AppIcon name="check" :size="11" />
                    Added
                  </small>
                </template>
                <template v-else>
                  <span>{{ item }}</span>
                  <AppIcon name="plus" :size="13" />
                </template>
              </button>
            </div>
          </section>

          <div class="persona-modal__note">
            <AppIcon name="sparkles" :size="16" />
            <p>{{ activeModalConfig.helperText }}</p>
          </div>
        </div>

        <div class="persona-modal__footer">
          <button type="button" class="persona-modal__cancel" @click="closeAddModal">Cancel</button>
          <button type="button" class="persona-modal__submit" @click="addModalItem(modalSearch)">
            {{ activeModalConfig.addLabel }}
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.persona-step {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 288px;
  gap: 18px;
}

.persona-step__main,
.persona-step__side {
  display: grid;
  gap: 18px;
}

.panel {
  border: 1px solid #e8edf5;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.persona-hero {
  display: grid;
  gap: 10px;
}

.persona-hero p {
  margin: 0;
  color: #f04f9d;
  font-size: 14px;
  font-weight: 700;
}

.persona-hero h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #18233f;
  font-size: 24px;
}

.persona-hero span {
  max-width: 760px;
  color: #70809a;
  font-size: 14px;
  line-height: 1.6;
}

.persona-card,
.persona-snapshot,
.side-card,
.tip-card {
  padding: 22px 24px;
}

.persona-card__head,
.persona-card__title,
.side-card__head,
.tip-card {
  display: flex;
  align-items: start;
}

.persona-card__head {
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.persona-card__title {
  gap: 14px;
}

.persona-card__icon,
.snapshot-icon,
.tip-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.persona-card strong,
.persona-snapshot strong,
.side-card strong,
.tip-card strong {
  color: #1f2a44;
  font-size: 16px;
}

.persona-card span,
.persona-snapshot span,
.side-list span,
.tip-card span {
  color: #8390a6;
  font-size: 13px;
  line-height: 1.5;
}

.persona-card__head button {
  height: 34px;
  padding: 0 14px;
  border: 1px solid #dfe6f1;
  border-radius: 12px;
  color: #40516c;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
}

.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chip {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid currentColor;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.chip span {
  color: inherit;
}

.chip--green { color: #35aa65; background: #f4fff7; }
.chip--orange { color: #ef9346; background: #fff8f1; }
.chip--red { color: #f06171; background: #fff7f8; }

.persona-snapshot__head {
  display: flex;
  align-items: start;
  gap: 14px;
  margin-bottom: 22px;
}

.persona-snapshot__intro {
  display: grid;
  gap: 4px;
}

.persona-snapshot__intro strong {
  font-size: 17px;
  line-height: 1.2;
}

.persona-snapshot__intro span {
  display: block;
  color: #8390a6;
  font-size: 13px;
  line-height: 1.45;
}

.persona-snapshot__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.persona-snapshot__grid article {
  display: grid;
  gap: 6px;
}

.persona-snapshot__grid article small,
.persona-strengths small,
.readiness-item small {
  display: block;
  margin: 4px 0 2px;
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.persona-snapshot__grid article strong,
.persona-strengths strong,
.readiness-item strong {
  display: block;
  line-height: 1.35;
}

.persona-snapshot__grid article strong {
  font-size: 15px;
}

.persona-strengths {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #dce4f1;
}

.side-card__head {
  gap: 10px;
  margin-bottom: 18px;
  color: #6674ff;
}

.side-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 16px;
}

.side-list li {
  display: flex;
  align-items: start;
  gap: 10px;
  color: #6674ff;
}

.readiness-title {
  display: block;
  margin-bottom: 16px;
}

.readiness-list {
  display: grid;
  gap: 16px;
}

.readiness-item {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.readiness-item > span {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a8b4c7;
  background: #f3f6fb;
  font-size: 12px;
  font-weight: 700;
}

.readiness-item.is-done > span {
  background: #22b661;
}

.readiness-item.is-active > span {
  color: #fff;
  background: #f04f9d;
}

.readiness-item.is-done > span::before {
  content: '';
  width: 9px;
  height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg);
}

.readiness-item strong {
  font-size: 14px;
}

.tip-card {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  align-items: start;
  gap: 14px;
  background: #fff9eb;
  border-color: #f2dfa9;
}

.tip-card__copy {
  display: grid;
  gap: 6px;
}

.tip-card__copy strong {
  line-height: 1.2;
}

.tip-card__copy span {
  display: block;
  line-height: 1.6;
}

.persona-modal {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 28px;
}

.persona-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(17, 24, 39, 0.34);
  backdrop-filter: blur(3px);
}

.persona-modal__dialog {
  position: relative;
  z-index: 1;
  width: min(100%, 770px);
  max-height: min(92vh, 900px);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.22);
}

.persona-modal__header,
.persona-modal__body,
.persona-modal__footer {
  padding-left: 32px;
  padding-right: 32px;
}

.persona-modal__header {
  padding-top: 30px;
  padding-bottom: 18px;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 20px;
}

.persona-modal__header h3 {
  margin: 0 0 8px;
  color: #18233f;
  font-size: 22px;
  line-height: 1.15;
}

.persona-modal__header p {
  margin: 0;
  color: #6e7c94;
  font-size: 14px;
  line-height: 1.6;
}

.persona-modal__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #98a4b8;
  background: transparent;
}

.persona-modal__tabs {
  padding: 0 32px;
  display: flex;
  align-items: end;
  gap: 26px;
  border-bottom: 1px solid #e8edf5;
}

.persona-modal__tabs button {
  height: 46px;
  padding: 0;
  border: 0;
  border-bottom: 2px solid transparent;
  color: #6f7c91;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
}

.persona-modal__tabs button.is-active {
  color: #ef4fa0;
  border-bottom-color: #ef4fa0;
}

.persona-modal__body {
  padding-top: 28px;
  padding-bottom: 22px;
  overflow-y: auto;
  display: grid;
  gap: 26px;
}

.persona-modal__section {
  display: grid;
  gap: 14px;
}

.persona-modal__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.persona-modal__section-head strong {
  color: #1f2a44;
  font-size: 16px;
}

.persona-modal__section-head--split {
  align-items: start;
}

.persona-modal__tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.persona-modal__ai-button,
.persona-modal__refresh,
.persona-modal__cancel {
  height: 38px;
  padding: 0 14px;
  border: 1px solid #dde5f0;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
}

.persona-modal__ai-button {
  color: #ef4fa0;
  border-color: transparent;
  background: #fff3f8;
}

.persona-modal__refresh,
.persona-modal__cancel {
  color: #495a75;
}

.persona-modal__recent,
.persona-modal__suggestions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.persona-modal__recent-chip,
.persona-modal__suggestion {
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #dde5f0;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
  background: #fff;
  color: #3b4d68;
  font-size: 13px;
}

.persona-modal__recent-chip span,
.persona-modal__suggestion span {
  min-width: 0;
  flex: 1;
}

.persona-modal__recent-chip--green {
  color: #239f5d;
  background: #eefcf4;
  border-color: #b8ebc9;
}

.persona-modal__recent-chip--orange {
  color: #e88c3c;
  background: #fff7ee;
  border-color: #f8d8bb;
}

.persona-modal__recent-chip--red {
  color: #eb5c71;
  background: #fff4f6;
  border-color: #f6c8d1;
}

.persona-modal__search {
  height: 48px;
  padding: 0 16px;
  border: 1.5px solid #f04f9d;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #95a2b8;
}

.persona-modal__search input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #334155;
  background: transparent;
  font-size: 14px;
}

.persona-modal__suggestion {
  justify-content: flex-start;
}

.persona-modal__suggestion--green.is-added {
  color: #239f5d;
  background: #eefcf4;
  border-color: #b8ebc9;
}

.persona-modal__suggestion--orange.is-added {
  color: #e88c3c;
  background: #fff7ee;
  border-color: #f8d8bb;
}

.persona-modal__suggestion--red.is-added {
  color: #eb5c71;
  background: #fff4f6;
  border-color: #f6c8d1;
}

.persona-modal__suggestion small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: inherit;
  font-size: 12px;
  font-weight: 700;
}

.persona-modal__note {
  padding: 14px 16px;
  border-radius: 12px;
  display: flex;
  align-items: start;
  gap: 12px;
  color: #8b61f5;
  background: #f5f1ff;
}

.persona-modal__note p {
  margin: 0;
  color: #67758d;
  font-size: 13px;
  line-height: 1.6;
}

.persona-modal__footer {
  padding-top: 20px;
  padding-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #edf2f8;
}

.persona-modal__submit {
  min-width: 182px;
  height: 54px;
  padding: 0 24px;
  border: 0;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(135deg, #f04f9d 0%, #d93b95 100%);
  box-shadow: 0 12px 24px rgba(240, 79, 157, 0.24);
  font-size: 15px;
  font-weight: 700;
}

.tone-green { color: #22b661; background: #ebfbf0; }
.tone-orange { color: #ef9346; background: #fff5e9; }
.tone-red { color: #f06171; background: #fff0f3; }
.tone-violet { color: #6e71ff; background: #eef1ff; }

@media (max-width: 1400px) {
  .persona-step {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .persona-snapshot__grid {
    grid-template-columns: 1fr 1fr;
  }

  .persona-modal {
    padding: 14px;
  }

  .persona-modal__header,
  .persona-modal__body,
  .persona-modal__footer,
  .persona-modal__tabs {
    padding-left: 18px;
    padding-right: 18px;
  }

  .persona-modal__recent,
  .persona-modal__suggestions {
    grid-template-columns: 1fr;
  }

  .persona-modal__footer,
  .persona-modal__tools,
  .persona-modal__section-head--split {
    flex-direction: column;
    align-items: stretch;
  }

  .persona-modal__submit,
  .persona-modal__cancel,
  .persona-modal__ai-button,
  .persona-modal__refresh {
    width: 100%;
    justify-content: center;
  }
}
</style>
