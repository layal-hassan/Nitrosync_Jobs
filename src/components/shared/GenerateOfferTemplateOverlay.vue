<script setup>
import { computed, ref, watch } from 'vue'
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
})

const emit = defineEmits(['close', 'use-template', 'start-from-scratch'])

const phase = ref('browse')
const selectedTemplateId = ref('senior-frontend-engineer')

const departments = [
  ['Engineering', 8],
  ['Product', 4],
  ['Sales', 3],
  ['Marketing', 3],
  ['Customer Success', 2],
  ['Finance', 2],
  ['Design', 1],
  ['Operations', 1],
]

const roleLevels = [
  ['All Levels', 24],
  ['Entry Level', 5],
  ['Mid Level', 9],
  ['Senior Level', 7],
  ['Executive', 3],
]

const featuredTemplate = {
  id: 'senior-frontend-engineer',
  title: 'Senior Frontend Engineer',
  role: 'Senior Frontend Developer',
  meta: ['Engineering', 'Senior Level', 'United States', 'Full-time'],
  used: '84 times',
  acceptanceRate: '97%',
  updated: 'Updated yesterday',
  matchScore: '97%',
}

const templates = [
  {
    id: 'senior-backend',
    title: 'Senior Backend Engineer',
    meta: ['Engineering', 'Senior', 'United States'],
    metrics: ['Salary', 'Benefits', 'Equity'],
    used: '72 times',
    acceptance: '92%',
    approval: '2.4h',
    avatars: ['TL', 'SC', 'MA'],
    extra: '+3',
    tone: 'violet',
    icon: 'compare',
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    meta: ['Product', 'Mid-Senior', 'United States'],
    metrics: ['Salary', 'Benefits', 'Equity'],
    used: '63 times',
    acceptance: '90%',
    approval: '2.8h',
    avatars: ['TL', 'HR'],
    extra: '+2',
    tone: 'green',
    icon: 'chart-bars',
  },
  {
    id: 'sales-executive',
    title: 'Sales Executive',
    meta: ['Sales', 'Mid', 'United States'],
    metrics: ['Salary', 'Benefits', 'Commission'],
    used: '58 times',
    acceptance: '89%',
    approval: '2.1h',
    avatars: ['TL', 'SC', 'MA'],
    extra: '+4',
    tone: 'orange',
    icon: 'users',
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    meta: ['Marketing', 'Mid-Senior', 'United States'],
    metrics: ['Salary', 'Benefits', 'Equity'],
    used: '41 times',
    acceptance: '91%',
    approval: '2.6h',
    avatars: ['TL', 'SC'],
    extra: '+2',
    tone: 'blue',
    icon: 'megaphone',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    meta: ['Engineering', 'Mid-Senior', 'United States'],
    metrics: ['Salary', 'Benefits', 'Equity'],
    used: '37 times',
    acceptance: '88%',
    approval: '2.5h',
    avatars: ['TL'],
    extra: '+1',
    tone: 'lavender',
    icon: 'grid',
  },
  {
    id: 'customer-success',
    title: 'Customer Success Manager',
    meta: ['Customer Success', 'Mid', 'United States'],
    metrics: ['Salary', 'Benefits', 'Equity'],
    used: '32 times',
    acceptance: '87%',
    approval: '2.0h',
    avatars: ['HR'],
    extra: '+1',
    tone: 'amber',
    icon: 'shield',
  },
]

const templateMappings = [
  ['Salary Band', 'Based on role, level and location', '$135,000 - $145,000', 'Matched', 'wallet'],
  ['Benefits Package', 'Standard package for US employees', 'Standard - US', 'Matched', 'gift'],
  ['Equity / RSU', 'Based on company policy', '1,000 RSUs', 'Matched', 'users'],
  ['Employment Type', 'From template', 'Full-time', 'Matched', 'briefcase'],
  ['Department', 'From template', 'Engineering', 'Matched', 'building'],
  ['Location', 'From template', 'San Francisco, CA', 'Matched', 'mapPin'],
  ['Documents', 'Offer letter, contract and more', '6 documents', 'Ready', 'document'],
]

const whyTemplateRows = [
  ['Role matches', 'Same role and seniority level'],
  ['Country matches', 'United States'],
  ['Compensation policy matches', 'Engineering salary structure'],
  ['Benefits policy matches', 'Standard US benefits package'],
  ['Approval workflow matches', 'Same approval path'],
  ['Highest acceptance rate', 'For similar roles'],
]

const templateAdjustments = [
  ['Base Salary', 'Adjusted based on interview performance and market data', '$142,000', '$145,000', '+ $3,000'],
  ['Notice Period', 'Adjusted based on candidate expectation', '2 weeks', '4 weeks', '+ 2 weeks'],
  ['Equity / RSUs', 'Adjusted based on hiring committee recommendation', '500 RSUs', '750 RSUs', '+ 250 RSUs'],
]

const generatedReviewSteps = [
  ['Template', 'Senior Frontend Engineer', 'done'],
  ['AI Mapping', '97% match', 'done'],
  ['Generate Offer', 'Completed', 'done'],
  ['Review & Edit', "You're here", 'active'],
]

const generatedSections = [
  ['Compensation', 'AI Modified', '$145,000 base salary • 750 RSUs • No bonus', 'pink', 'wallet'],
  ['Employment', 'No Changes', 'Full-time • Exempt • Engineering', 'green', 'briefcase'],
  ['Timeline', 'No Changes', 'Start date: June 16, 2026 • Offer expires in 7 days', 'green', 'calendar'],
  ['Documents', 'Complete', '6 documents included', 'green', 'document'],
  ['Terms & Conditions', 'AI Adjusted', 'Non-compete • IP Assignment • Confidentiality', 'orange', 'scale'],
  ['Benefits', 'No Changes', 'Standard US Benefits Package', 'green', 'gift'],
  ['Approval Workflow', 'Ready', '3 approvers • Estimated time: 1-2 days', 'green', 'users'],
  ['Internal Notes', 'No Changes', 'Visible to internal team only', 'green', 'message'],
]

const generatedInsights = [
  ['Salary adjusted', 'Increased based on interview performance', '+$3,000', 'green', 'wallet'],
  ['Equity increased', 'Hiring committee recommended adjustment', '+250 RSUs', 'green', 'users'],
  ['Notice period updated', 'Aligned with candidate expectation', '+2 weeks', 'green', 'calendar'],
]

const candidateFirstName = computed(() => props.candidateName.split(' ')[0] || 'Marvin')
const candidateLastName = computed(() => props.candidateName.split(' ').slice(1).join(' ') || 'McKinney')
const candidateInitials = computed(() => {
  const parts = props.candidateName.split(' ').filter(Boolean).slice(0, 2)
  return parts.map((item) => item[0]?.toUpperCase() ?? '').join('')
})

const selectedTemplate = computed(() => {
  if (selectedTemplateId.value === featuredTemplate.id) {
    return featuredTemplate
  }

  return templates.find((item) => item.id === selectedTemplateId.value) ?? featuredTemplate
})

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    phase.value = 'browse'
    selectedTemplateId.value = featuredTemplate.id
  }
})

function closeOverlay() {
  phase.value = 'browse'
  emit('close')
}

function useTemplate(templateId) {
  selectedTemplateId.value = templateId
  phase.value = 'ready'
}

function backToBrowse() {
  phase.value = 'browse'
}

function confirmTemplate() {
  phase.value = 'generated'
}

function continueToReview() {
  emit('use-template', selectedTemplateId.value)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="offer-template-overlay" @click.self="closeOverlay">
      <section class="offer-template-modal" :class="`is-${phase}`" @click.stop>
        <header class="offer-template-modal__header">
          <div class="offer-template-modal__title">
            <span class="offer-template-modal__icon">
              <AppIcon :name="phase === 'browse' ? 'document' : 'sparkles'" :size="18" />
            </span>
            <div>
              <h2>{{ phase === 'browse' ? 'Generate Offer from Template' : phase === 'ready' ? 'Template Ready' : 'Your offer is ready' }}</h2>
              <p>
                {{
                  phase === 'browse'
                    ? 'Choose a proven template to create a tailored offer in seconds.'
                    : phase === 'ready'
                      ? 'NitroSync analyzed the selected template and automatically mapped it to your candidate.'
                      : 'NitroSync has generated a personalized offer based on AI insights and company policies.'
                }}
              </p>
            </div>
          </div>

          <button type="button" class="offer-template-modal__close" aria-label="Close template picker" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div v-if="phase === 'browse'" class="offer-template-modal__body">
          <aside class="offer-template-sidebar">
            <label class="offer-template-search">
              <AppIcon name="search" :size="15" />
              <input type="text" placeholder="Search by template name, role, or department..." />
            </label>

            <button type="button" class="offer-template-sidebar__chip is-active">
              <span><AppIcon name="grid" :size="13" /></span>
              <strong>All Templates</strong>
              <em>24</em>
            </button>

            <section class="offer-template-sidebar__group">
              <small>BY DEPARTMENT</small>
              <button
                v-for="item in departments"
                :key="item[0]"
                type="button"
                class="offer-template-sidebar__item"
              >
                <span>{{ item[0] }}</span>
                <em>{{ item[1] }}</em>
              </button>
            </section>

            <section class="offer-template-sidebar__group">
              <small>BY ROLE LEVEL</small>
              <button
                v-for="item in roleLevels"
                :key="item[0]"
                type="button"
                class="offer-template-sidebar__item"
              >
                <span>{{ item[0] }}</span>
                <em>{{ item[1] }}</em>
              </button>
            </section>

            <button type="button" class="offer-template-sidebar__clear">
              <AppIcon name="refresh" :size="13" />
              <span>Clear all filters</span>
            </button>
          </aside>

          <section class="offer-template-main">
            <article class="offer-template-featured">
              <div class="offer-template-featured__copy">
                <small><AppIcon name="sparkles" :size="11" /> AI RECOMMENDED</small>
                <h3>{{ featuredTemplate.title }}</h3>
                <p>97% match for {{ candidateFirstName }}</p>

                <div class="offer-template-tags">
                  <span v-for="item in featuredTemplate.meta" :key="item">{{ item }}</span>
                </div>

                <div class="offer-template-featured__meta">
                  <span><AppIcon name="star" :size="12" /> Used {{ featuredTemplate.used }}</span>
                  <span><AppIcon name="target" :size="12" /> Acceptance rate {{ featuredTemplate.acceptanceRate }}</span>
                  <span><AppIcon name="clock" :size="12" /> {{ featuredTemplate.updated }}</span>
                </div>
              </div>

              <div class="offer-template-featured__side">
                <div class="offer-template-match-ring">
                  <div class="offer-template-match-ring__inner">
                    <strong>{{ featuredTemplate.matchScore }}</strong>
                  </div>
                </div>
                <small>Match</small>
                <button type="button" class="offer-template-primary" @click="useTemplate(featuredTemplate.id)">
                  <span>Use this template</span>
                  <AppIcon name="chevronRight" :size="14" />
                </button>
              </div>
            </article>

            <div class="offer-template-results-head">
              <strong>All Templates (24)</strong>
              <div class="offer-template-results-head__actions">
                <label>
                  <span>Sort by:</span>
                  <button type="button">
                    <strong>Most relevant</strong>
                    <AppIcon name="chevronDown" :size="14" />
                  </button>
                </label>
                <div class="offer-template-view-toggle">
                  <button type="button" class="is-active"><AppIcon name="grid" :size="14" /></button>
                  <button type="button"><AppIcon name="list" :size="14" /></button>
                </div>
              </div>
            </div>

            <div class="offer-template-grid">
              <article v-for="templateItem in templates" :key="templateItem.id" class="offer-template-card">
                <div class="offer-template-card__head">
                  <span class="offer-template-card__icon" :class="`is-${templateItem.tone}`">
                    <AppIcon :name="templateItem.icon" :size="16" />
                  </span>
                  <button type="button" aria-label="Save template">
                    <AppIcon name="star" :size="14" />
                  </button>
                </div>

                <div class="offer-template-card__copy">
                  <h4>{{ templateItem.title }}</h4>
                  <p>{{ templateItem.meta.join(' | ') }}</p>
                </div>

                <div class="offer-template-card__metrics">
                  <span v-for="metric in templateItem.metrics" :key="metric">{{ metric }}</span>
                </div>

                <dl class="offer-template-card__stats">
                  <div>
                    <dt>Used</dt>
                    <dd>{{ templateItem.used }}</dd>
                  </div>
                  <div>
                    <dt>Acceptance rate</dt>
                    <dd>{{ templateItem.acceptance }}</dd>
                  </div>
                  <div>
                    <dt>Avg. approval time</dt>
                    <dd>{{ templateItem.approval }}</dd>
                  </div>
                </dl>

                <div class="offer-template-card__footer">
                  <div class="offer-template-card__avatars">
                    <span v-for="avatar in templateItem.avatars" :key="avatar">{{ avatar }}</span>
                    <small v-if="templateItem.extra">{{ templateItem.extra }}</small>
                  </div>

                  <button type="button" class="offer-template-card__use" @click="useTemplate(templateItem.id)">
                    <span>Use template</span>
                    <AppIcon name="chevronRight" :size="13" />
                  </button>
                </div>
              </article>
            </div>

            <div class="offer-template-empty-state">
              <div>
                <strong>Can't find what you need?</strong>
                <p>Start from scratch and customize every detail.</p>
              </div>

              <button type="button" class="offer-template-secondary" @click="emit('start-from-scratch')">
                <span>Start from scratch</span>
                <AppIcon name="chevronRight" :size="14" />
              </button>
            </div>

            <div class="offer-template-note">
              <AppIcon name="shield" :size="13" />
              <span>Templates include pre-built sections and recommended ranges to save you time.</span>
            </div>
          </section>
        </div>

        <div v-else-if="phase === 'ready'" class="offer-template-ready">
          <section class="offer-template-ready__hero">
            <article class="offer-template-ready__summary">
              <div class="offer-template-ready__summary-card">
                <span class="offer-template-ready__summary-icon">
                  <AppIcon name="document" :size="18" />
                </span>
                <div>
                  <small>Template</small>
                  <strong>{{ selectedTemplate.title }}</strong>
                  <p>Best Match</p>
                </div>
              </div>

              <span class="offer-template-ready__arrow">
                <AppIcon name="chevronRight" :size="18" />
              </span>

              <div class="offer-template-ready__candidate">
                <div class="offer-template-ready__avatar">{{ candidateInitials }}</div>
                <div>
                  <small>Applying to</small>
                  <strong>{{ candidateName }}</strong>
                  <p>{{ selectedTemplate.role || featuredTemplate.role }}</p>
                </div>
              </div>
            </article>

            <article class="offer-template-ready__score">
              <div class="offer-template-match-ring">
                <div class="offer-template-match-ring__inner">
                  <strong>{{ featuredTemplate.matchScore }}</strong>
                </div>
              </div>
              <small>Match Score</small>
            </article>
          </section>

          <div class="offer-template-ready__layout">
            <section class="offer-template-ready__main">
              <article class="offer-template-ready__card">
                <div class="offer-template-ready__card-head">
                  <h3>AI Template Mapping</h3>
                  <span>All good</span>
                </div>

                <div class="offer-template-ready__mapping-list">
                  <div v-for="item in templateMappings" :key="item[0]" class="offer-template-ready__mapping-row">
                    <div class="offer-template-ready__mapping-label">
                      <span><AppIcon :name="item[4]" :size="14" /></span>
                      <div>
                        <strong>{{ item[0] }}</strong>
                        <small>{{ item[1] }}</small>
                      </div>
                    </div>
                    <strong>{{ item[2] }}</strong>
                    <em :class="{ 'is-violet': item[3] === 'Ready' }">
                      <AppIcon :name="item[3] === 'Ready' ? 'clock' : 'checkCircle'" :size="12" />
                      {{ item[3] }}
                    </em>
                  </div>
                </div>
              </article>

              <article class="offer-template-ready__card">
                <div class="offer-template-ready__section-title">
                  <AppIcon name="sparkles" :size="14" />
                  <h3>AI Adjustments Made</h3>
                </div>

                <div class="offer-template-ready__adjustments">
                  <div v-for="item in templateAdjustments" :key="item[0]" class="offer-template-ready__adjustment-row">
                    <div>
                      <strong>{{ item[0] }}</strong>
                      <small>{{ item[1] }}</small>
                    </div>
                    <b>{{ item[2] }}</b>
                    <span><AppIcon name="chevronRight" :size="14" /></span>
                    <b class="is-pink">{{ item[3] }}</b>
                    <em>
                      {{ item[4] }}
                      <AppIcon name="trend-up" :size="11" />
                    </em>
                    <button type="button" aria-label="More details">
                      <AppIcon name="info" :size="13" />
                    </button>
                  </div>
                </div>
              </article>
            </section>

            <aside class="offer-template-ready__side">
              <article class="offer-template-ready__card">
                <div class="offer-template-ready__section-title">
                  <AppIcon name="spark" :size="14" />
                  <h3>Why this template?</h3>
                </div>

                <div class="offer-template-ready__why-list">
                  <div v-for="item in whyTemplateRows" :key="item[0]">
                    <strong><AppIcon name="checkCircle" :size="13" /> {{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                </div>

                <div class="offer-template-ready__expected">
                  <small>Expected acceptance</small>
                  <strong>94%</strong>
                  <div class="offer-template-ready__expected-chart">
                    <i /><i /><i /><i /><i /><i />
                  </div>
                </div>
              </article>

              <article class="offer-template-ready__card is-attention">
                <div class="offer-template-ready__section-title">
                  <AppIcon name="alert" :size="15" />
                  <h3>Attention</h3>
                </div>

                <div class="offer-template-ready__attention-copy">
                  <strong>Signing bonus not included</strong>
                  <p>The candidate discussed relocation support.</p>
                  <small>Recommendation</small>
                  <span>Review before generating the offer.</span>
                </div>
              </article>
            </aside>
          </div>
        </div>

        <div v-else class="offer-template-generated">
          <section class="offer-template-generated__top">
            <div class="offer-template-generated__progress">
              <div
                v-for="item in generatedReviewSteps"
                :key="item[0]"
                class="offer-template-generated__progress-item"
                :class="`is-${item[2]}`"
              >
                <span>
                  <AppIcon v-if="item[2] !== 'active'" name="checkCircle" :size="14" />
                  <template v-else>4</template>
                </span>
                <div>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </div>
              </div>
            </div>

            <aside class="offer-template-generated__preview">
              <small>OFFER PREVIEW</small>
              <div class="offer-template-generated__preview-head">
                <div class="offer-template-generated__preview-avatar">{{ candidateInitials }}</div>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <span>{{ featuredTemplate.role }}</span>
                  <em>San Francisco, CA • Full-time</em>
                </div>
              </div>

              <div class="offer-template-generated__preview-metrics">
                <div>
                  <span>Total Annual Compensation</span>
                  <strong>$165,000</strong>
                  <small>$145,000 base + $20,000 equity value</small>
                </div>
                <div class="offer-template-generated__market-box">
                  <strong>P62</strong>
                  <span>Market Position</span>
                </div>
              </div>

              <div class="offer-template-generated__preview-footer">
                <span>AI Confidence <strong>95%</strong></span>
                <i />
                <span>Est. Acceptance <strong>94%</strong></span>
              </div>
            </aside>
          </section>

          <section class="offer-template-generated__hero-card">
            <article class="offer-template-generated__success">
              <div class="offer-template-generated__success-icon">
                <div>
                  <AppIcon name="checkCircle" :size="30" />
                </div>
                <AppIcon name="sparkles" :size="16" />
              </div>
              <div>
                <strong>Offer generated successfully!</strong>
                <p>AI created a personalized offer for {{ candidateName }}.</p>
              </div>
            </article>

            <article class="offer-template-generated__bars">
              <div>
                <span>AI Confidence</span>
                <strong>95%</strong>
                <div class="offer-template-generated__bar"><i class="is-pink" /></div>
              </div>
              <div>
                <span>Estimated Acceptance</span>
                <strong>94%</strong>
                <div class="offer-template-generated__bar"><i class="is-pink" /></div>
              </div>
              <div class="offer-template-generated__chips">
                <small><AppIcon name="document" :size="12" /> Template Applied</small>
                <small><AppIcon name="users" :size="12" /> 9 Data Sources Used</small>
                <small><AppIcon name="shield" :size="12" /> Company Policies Matched</small>
              </div>
            </article>
          </section>

          <div class="offer-template-generated__layout">
            <section class="offer-template-generated__main">
              <div class="offer-template-generated__section-head">
                <div>
                  <h3>Review & edit your offer</h3>
                  <p>AI has prepared 8 sections. Review the sections that need your attention.</p>
                </div>
                <div class="offer-template-generated__legend">
                  <span><i class="is-orange" /> Needs Review</span>
                  <span><i class="is-green" /> Ready</span>
                  <span><i class="is-slate" /> Locked</span>
                </div>
              </div>

              <div class="offer-template-generated__section-list">
                <article
                  v-for="section in generatedSections"
                  :key="section[0]"
                  class="offer-template-generated__section-row"
                >
                  <div class="offer-template-generated__section-title">
                    <span class="offer-template-generated__section-icon" :class="`is-${section[3]}`">
                      <AppIcon :name="section[4]" :size="15" />
                    </span>
                    <strong>{{ section[0] }}</strong>
                    <em :class="`is-${section[3]}`">{{ section[1] }}</em>
                  </div>
                  <p>{{ section[2] }}</p>
                  <button type="button" aria-label="Expand section">
                    <AppIcon name="chevronDown" :size="16" />
                  </button>
                </article>
              </div>
            </section>

            <aside class="offer-template-generated__side">
              <article class="offer-template-generated__insights-card">
                <div class="offer-template-generated__side-title">
                  <AppIcon name="sparkles" :size="14" />
                  <strong>AI Insights</strong>
                </div>

                <div class="offer-template-generated__insight-list">
                  <div v-for="item in generatedInsights" :key="item[0]" class="offer-template-generated__insight-row">
                    <span class="offer-template-generated__insight-icon" :class="`is-${item[3]}`">
                      <AppIcon :name="item[4]" :size="14" />
                    </span>
                    <div>
                      <strong>{{ item[0] }}</strong>
                      <small>{{ item[1] }}</small>
                    </div>
                    <em>{{ item[2] }}</em>
                  </div>
                </div>

                <div class="offer-template-generated__review-callout">
                  <small>Recommended review</small>
                  <strong>Compensation</strong>
                  <p>AI modified this section based on candidate performance and market data.</p>
                </div>
              </article>

              <article class="offer-template-generated__tip-card">
                <AppIcon name="spark" :size="14" />
                <span>Tip: Focus on sections marked as "AI Modified" to save time.</span>
              </article>
            </aside>
          </div>
        </div>

        <footer class="offer-template-modal__footer" :class="{ 'is-ready': phase === 'ready', 'is-generated': phase === 'generated' }">
          <template v-if="phase === 'browse'">
            <button type="button" class="offer-template-cancel" @click="closeOverlay">Cancel</button>
          </template>
          <template v-else-if="phase === 'ready'">
            <button type="button" class="offer-template-cancel" @click="backToBrowse">Back</button>
            <div class="offer-template-modal__footer-note">
              <AppIcon name="lock" :size="13" />
              <span>You can review and edit all details in the next step before sending.</span>
            </div>
            <button type="button" class="offer-template-primary" @click="confirmTemplate">
              <AppIcon name="sparkles" :size="14" />
              <span>Generate Offer</span>
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </template>
          <template v-else>
            <button type="button" class="offer-template-cancel" @click="backToBrowse">Back</button>
            <div class="offer-template-modal__generated-actions">
              <button type="button" class="offer-template-primary" @click="continueToReview">
                <span>Continue to Review &amp; Edit</span>
                <AppIcon name="chevronRight" :size="14" />
              </button>
              <small>You can edit any section before sending</small>
            </div>
          </template>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style>
.offer-template-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(9, 20, 43, 0.26);
  backdrop-filter: blur(8px);
}

.offer-template-modal {
  width: min(1280px, 100%);
  max-height: min(92vh, 980px);
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid #dbe4f3;
  background:
    radial-gradient(circle at top center, rgba(255, 145, 191, 0.12), transparent 42%),
    #ffffff;
  box-shadow: 0 30px 90px rgba(17, 26, 56, 0.2);
  display: flex;
  flex-direction: column;
}

.offer-template-modal.is-ready {
  width: min(1120px, 100%);
}

.offer-template-modal.is-generated {
  width: min(1380px, 100%);
}

.offer-template-modal__header,
.offer-template-modal__footer {
  padding: 22px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.offer-template-modal__header {
  border-bottom: 1px solid #edf2fa;
}

.offer-template-modal__title {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.offer-template-modal__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffe4f0 0%, #fff2f8 100%);
  color: #ff2d87;
}

.offer-template-modal__title h2 {
  margin: 0;
  color: #1d2b49;
  font-size: 1.6rem;
  font-weight: 800;
}

.offer-template-modal__title p {
  margin: 6px 0 0;
  color: #8794ab;
  font-size: 0.95rem;
}

.offer-template-modal__close,
.offer-template-sidebar__chip,
.offer-template-sidebar__item,
.offer-template-sidebar__clear,
.offer-template-results-head__actions button,
.offer-template-view-toggle button,
.offer-template-card__head button {
  border: 0;
  background: transparent;
}

.offer-template-modal__close {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #7b89a4;
}

.offer-template-modal__body {
  padding: 18px 20px 16px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 20px;
}

.offer-template-sidebar {
  border: 1px solid #edf2fa;
  border-radius: 24px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.offer-template-search {
  height: 46px;
  border-radius: 14px;
  border: 1px solid #e4eaf5;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #96a3ba;
}

.offer-template-search input {
  width: 100%;
  border: 0;
  outline: none;
  color: #1d2b49;
  font-size: 0.9rem;
}

.offer-template-sidebar__chip {
  width: 100%;
  min-height: 46px;
  border-radius: 14px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ff2d87;
  background: #fff1f7;
}

.offer-template-sidebar__chip span {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 45, 135, 0.1);
}

.offer-template-sidebar__chip strong,
.offer-template-sidebar__item span {
  font-size: 0.9rem;
  font-weight: 700;
}

.offer-template-sidebar__chip em,
.offer-template-sidebar__item em {
  margin-left: auto;
  font-style: normal;
  color: #94a1b7;
  font-size: 0.82rem;
  font-weight: 700;
}

.offer-template-sidebar__group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.offer-template-sidebar__group small {
  color: #99a5ba;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.offer-template-sidebar__item {
  width: 100%;
  min-height: 38px;
  border-radius: 12px;
  padding: 0 8px 0 2px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #687791;
  text-align: left;
}

.offer-template-sidebar__item:hover,
.offer-template-sidebar__clear:hover,
.offer-template-modal__close:hover,
.offer-template-results-head__actions button:hover,
.offer-template-view-toggle button:hover,
.offer-template-card__head button:hover {
  background: #f7f9fe;
}

.offer-template-sidebar__clear {
  margin-top: auto;
  min-height: 42px;
  border-radius: 12px;
  border: 1px solid #e4eaf5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #7685a0;
  font-weight: 700;
}

.offer-template-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.offer-template-featured {
  border: 1px solid #ffd3e4;
  border-radius: 24px;
  padding: 18px 22px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 18px;
  align-items: center;
  background: linear-gradient(180deg, rgba(255, 242, 248, 0.75), rgba(255, 255, 255, 0.94));
}

.offer-template-featured__copy small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ff2d87;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.offer-template-featured__copy h3,
.offer-template-results-head strong,
.offer-template-card__copy h4,
.offer-template-empty-state strong {
  margin: 0;
  color: #1d2b49;
  font-weight: 800;
}

.offer-template-featured__copy h3 {
  margin-top: 10px;
  font-size: 1.15rem;
}

.offer-template-featured__copy p {
  margin: 6px 0 0;
  color: #1db56e;
  font-size: 0.92rem;
  font-weight: 700;
}

.offer-template-tags,
.offer-template-featured__meta,
.offer-template-card__metrics,
.offer-template-card__avatars {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.offer-template-tags {
  margin-top: 14px;
}

.offer-template-tags span,
.offer-template-card__metrics span {
  min-height: 26px;
  border-radius: 9px;
  padding: 0 9px;
  display: inline-flex;
  align-items: center;
  color: #6e7d97;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px #e6ecf6;
  font-size: 0.72rem;
  font-weight: 700;
}

.offer-template-featured__meta {
  margin-top: 16px;
  color: #8592a9;
  font-size: 0.78rem;
}

.offer-template-featured__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.offer-template-featured__side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.offer-template-match-ring {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  padding: 6px;
  background: conic-gradient(#ff2d87 0deg 349deg, #ffd6e8 349deg 360deg);
}

.offer-template-match-ring__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.offer-template-match-ring__inner strong {
  color: #1d2b49;
  font-size: 1.34rem;
  font-weight: 800;
}

.offer-template-featured__side small,
.offer-template-ready__score small {
  color: #97a4ba;
  font-size: 0.78rem;
  font-weight: 700;
}

.offer-template-primary,
.offer-template-secondary,
.offer-template-card__use,
.offer-template-cancel {
  border: 0;
  cursor: pointer;
}

.offer-template-primary {
  min-height: 42px;
  border-radius: 12px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  background: linear-gradient(135deg, #ff3f98 0%, #ff1f7c 100%);
  font-weight: 800;
  box-shadow: 0 18px 40px rgba(255, 47, 134, 0.26);
}

.offer-template-results-head,
.offer-template-results-head__actions,
.offer-template-results-head label,
.offer-template-card__head,
.offer-template-card__footer,
.offer-template-note,
.offer-template-ready__hero,
.offer-template-ready__summary,
.offer-template-ready__summary-card,
.offer-template-ready__candidate,
.offer-template-ready__layout,
.offer-template-ready__card-head,
.offer-template-ready__mapping-row,
.offer-template-ready__mapping-label,
.offer-template-ready__section-title,
.offer-template-ready__adjustment-row,
.offer-template-modal__footer-note {
  display: flex;
  align-items: center;
}

.offer-template-results-head {
  justify-content: space-between;
  gap: 16px;
}

.offer-template-results-head__actions {
  gap: 12px;
}

.offer-template-results-head label {
  gap: 8px;
  color: #93a0b6;
  font-size: 0.82rem;
}

.offer-template-results-head__actions button {
  min-height: 38px;
  border-radius: 12px;
  padding: 0 12px;
  box-shadow: inset 0 0 0 1px #e3e9f4;
  color: #6d7c97;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.offer-template-view-toggle {
  display: inline-flex;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px #e3e9f4;
}

.offer-template-view-toggle button {
  width: 38px;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #93a0b6;
}

.offer-template-view-toggle button.is-active {
  color: #ff2d87;
  background: #fff2f8;
}

.offer-template-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.offer-template-card,
.offer-template-empty-state,
.offer-template-ready__card {
  border-radius: 20px;
  border: 1px solid #e8edf7;
  background: #fff;
}

.offer-template-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.offer-template-card__head {
  justify-content: space-between;
}

.offer-template-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-template-card__icon.is-violet {
  color: #6b56ff;
  background: #f0edff;
}

.offer-template-card__icon.is-green {
  color: #15b46d;
  background: #ebfaf2;
}

.offer-template-card__icon.is-orange {
  color: #ff9d1e;
  background: #fff5e5;
}

.offer-template-card__icon.is-blue {
  color: #3494ff;
  background: #edf6ff;
}

.offer-template-card__icon.is-lavender {
  color: #7a68ff;
  background: #f2efff;
}

.offer-template-card__icon.is-amber {
  color: #ffb24a;
  background: #fff7ea;
}

.offer-template-card__copy p {
  margin: 6px 0 0;
  color: #8794ab;
  font-size: 0.76rem;
  line-height: 1.45;
}

.offer-template-card__metrics span:nth-child(1) {
  color: #1db56e;
}

.offer-template-card__metrics span:nth-child(2) {
  color: #7a68ff;
}

.offer-template-card__metrics span:nth-child(3) {
  color: #ff8d2a;
}

.offer-template-card__stats {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.offer-template-card__stats dt {
  color: #9aa6ba;
  font-size: 0.64rem;
  font-weight: 700;
}

.offer-template-card__stats dd {
  margin: 6px 0 0;
  color: #1d2b49;
  font-size: 0.74rem;
  font-weight: 800;
}

.offer-template-card__footer {
  justify-content: space-between;
  gap: 12px;
}

.offer-template-card__avatars span,
.offer-template-card__avatars small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffd6b0 0%, #ffc07d 100%);
  color: #5f3810;
  font-size: 0.66rem;
  font-weight: 800;
}

.offer-template-card__avatars small {
  background: #f4f6fb;
  color: #7f8ba2;
  font-style: normal;
}

.offer-template-card__use {
  min-height: 34px;
  border-radius: 10px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6d56ff;
  background: #f7f4ff;
  font-size: 0.76rem;
  font-weight: 800;
}

.offer-template-empty-state {
  min-height: 78px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border-style: dashed;
  border-color: #ffd5e5;
  background: linear-gradient(180deg, rgba(255, 243, 248, 0.55), #fff);
}

.offer-template-empty-state p {
  margin: 5px 0 0;
  color: #93a0b6;
  font-size: 0.84rem;
}

.offer-template-secondary {
  min-height: 42px;
  border-radius: 12px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ff2d87;
  background: #fff;
  box-shadow: inset 0 0 0 1px #ffd3e4;
  font-weight: 800;
}

.offer-template-note {
  justify-content: flex-end;
  gap: 8px;
  color: #8390a6;
  font-size: 0.76rem;
}

.offer-template-ready {
  padding: 18px 20px 16px;
  overflow-y: auto;
  display: grid;
  gap: 18px;
}

.offer-template-ready__hero {
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #e8edf7;
  border-radius: 22px;
  padding: 18px 20px;
}

.offer-template-ready__summary {
  gap: 18px;
  min-width: 0;
}

.offer-template-ready__summary-card,
.offer-template-ready__candidate {
  gap: 14px;
}

.offer-template-ready__summary-card small,
.offer-template-ready__candidate small,
.offer-template-ready__expected small,
.offer-template-ready__mapping-label small,
.offer-template-ready__adjustment-row small,
.offer-template-ready__attention-copy small {
  display: block;
  color: #97a4ba;
  font-size: 0.74rem;
  font-weight: 700;
}

.offer-template-ready__summary-card strong,
.offer-template-ready__candidate strong,
.offer-template-ready__mapping-label strong,
.offer-template-ready__section-title h3,
.offer-template-ready__adjustment-row strong,
.offer-template-ready__attention-copy strong {
  color: #1d2b49;
}

.offer-template-ready__summary-card strong,
.offer-template-ready__candidate strong {
  display: block;
  margin-top: 4px;
  font-size: 1.02rem;
  font-weight: 800;
}

.offer-template-ready__summary-card p,
.offer-template-ready__candidate p,
.offer-template-ready__attention-copy p {
  margin: 4px 0 0;
  color: #ff2d87;
  font-size: 0.76rem;
  font-weight: 700;
}

.offer-template-ready__summary-icon,
.offer-template-ready__mapping-label span {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-template-ready__summary-icon {
  background: linear-gradient(180deg, #ffe4f0 0%, #fff1f7 100%);
  color: #ff2d87;
}

.offer-template-ready__mapping-label span {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f7f9fe;
  color: #7b89a4;
}

.offer-template-ready__arrow {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f4ff;
  color: #7b68ff;
  flex: 0 0 auto;
}

.offer-template-ready__avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffe0ba 0%, #ffc781 100%);
  color: #5a3712;
  font-size: 1rem;
  font-weight: 800;
}

.offer-template-ready__score {
  min-width: 110px;
  display: grid;
  justify-items: center;
  gap: 8px;
}

.offer-template-ready__layout {
  align-items: flex-start;
  gap: 18px;
}

.offer-template-ready__main {
  flex: 1 1 auto;
  min-width: 0;
  display: grid;
  gap: 16px;
}

.offer-template-ready__side {
  width: 340px;
  max-width: 100%;
  display: grid;
  gap: 16px;
}

.offer-template-ready__card {
  padding: 18px;
}

.offer-template-ready__card-head {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.offer-template-ready__card-head h3,
.offer-template-ready__section-title h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}

.offer-template-ready__card-head span {
  min-height: 26px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  color: #17b26a;
  background: #ebfaf2;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-template-ready__mapping-list,
.offer-template-ready__why-list,
.offer-template-ready__adjustments {
  display: grid;
}

.offer-template-ready__mapping-list {
  gap: 4px;
}

.offer-template-ready__mapping-row {
  justify-content: space-between;
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid #eff3fa;
}

.offer-template-ready__mapping-row:first-child,
.offer-template-ready__adjustment-row:first-child {
  border-top: 0;
}

.offer-template-ready__mapping-label {
  gap: 12px;
  min-width: 0;
}

.offer-template-ready__mapping-label strong,
.offer-template-ready__adjustment-row strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 800;
}

.offer-template-ready__mapping-row > strong,
.offer-template-ready__adjustment-row b {
  color: #1d2b49;
  font-size: 0.9rem;
  font-weight: 800;
}

.offer-template-ready__mapping-row em,
.offer-template-ready__adjustment-row em {
  font-style: normal;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #17b26a;
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
}

.offer-template-ready__mapping-row em.is-violet {
  color: #6d56ff;
}

.offer-template-ready__section-title {
  gap: 8px;
  margin-bottom: 12px;
  color: #ff2d87;
}

.offer-template-ready__adjustments {
  gap: 0;
}

.offer-template-ready__adjustment-row {
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #eff3fa;
}

.offer-template-ready__adjustment-row > div:first-child {
  flex: 1 1 auto;
  min-width: 0;
}

.offer-template-ready__adjustment-row b.is-pink {
  color: #ff2d87;
}

.offer-template-ready__adjustment-row button {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f7f9fe;
  color: #7b89a4;
}

.offer-template-ready__why-list {
  gap: 12px;
}

.offer-template-ready__why-list strong {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1d2b49;
  font-size: 0.84rem;
  font-weight: 800;
}

.offer-template-ready__why-list small {
  display: block;
  margin: 4px 0 0 21px;
  color: #97a4ba;
  font-size: 0.76rem;
}

.offer-template-ready__expected {
  margin-top: 16px;
  border-radius: 16px;
  padding: 14px 16px;
  background: linear-gradient(180deg, rgba(255, 244, 248, 0.95), rgba(248, 242, 255, 0.95));
}

.offer-template-ready__expected strong {
  display: block;
  margin-top: 4px;
  color: #6d56ff;
  font-size: 1.7rem;
  font-weight: 800;
}

.offer-template-ready__expected-chart {
  margin-top: 8px;
  height: 38px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 6px;
}

.offer-template-ready__expected-chart i {
  width: 20px;
  border-radius: 999px 999px 4px 4px;
  background: linear-gradient(180deg, rgba(255, 64, 152, 0.08), #7a68ff);
}

.offer-template-ready__expected-chart i:nth-child(1) { height: 8px; }
.offer-template-ready__expected-chart i:nth-child(2) { height: 13px; }
.offer-template-ready__expected-chart i:nth-child(3) { height: 18px; }
.offer-template-ready__expected-chart i:nth-child(4) { height: 15px; }
.offer-template-ready__expected-chart i:nth-child(5) { height: 22px; }
.offer-template-ready__expected-chart i:nth-child(6) { height: 29px; }

.offer-template-ready__card.is-attention {
  border-color: #ffe7c3;
}

.offer-template-ready__attention-copy strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 800;
}

.offer-template-ready__attention-copy p,
.offer-template-ready__attention-copy span {
  color: #7f8ea5;
  font-size: 0.82rem;
  line-height: 1.5;
}

.offer-template-ready__attention-copy span {
  display: block;
  margin-top: 4px;
}

.offer-template-generated {
  padding: 14px 16px 12px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: start;
  gap: 14px;
}

.offer-template-generated__top,
.offer-template-generated__hero-card,
.offer-template-generated__layout,
.offer-template-generated__progress,
.offer-template-generated__progress-item,
.offer-template-generated__preview-head,
.offer-template-generated__preview-metrics,
.offer-template-generated__preview-footer,
.offer-template-generated__success,
.offer-template-generated__bars,
.offer-template-generated__chips,
.offer-template-generated__section-head,
.offer-template-generated__legend,
.offer-template-generated__section-row,
.offer-template-generated__section-title,
.offer-template-generated__side-title,
.offer-template-generated__insight-row,
.offer-template-generated__tip-card {
  display: flex;
  align-items: center;
}

.offer-template-generated__top,
.offer-template-generated__layout {
  align-items: flex-start;
  gap: 14px;
}

.offer-template-generated__top,
.offer-template-generated__layout {
  display: contents;
}

.offer-template-generated__progress {
  flex: 1 1 auto;
  min-width: 0;
  gap: 12px;
  border: 1px solid #e8edf7;
  border-radius: 22px;
  padding: 12px 16px;
}

.offer-template-generated__progress-item {
  flex: 1 1 0;
  gap: 8px;
  min-width: 0;
  position: relative;
}

.offer-template-generated__progress-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px;
  right: -8px;
  width: 16px;
  height: 1px;
  background: #dfe5f0;
}

.offer-template-generated__progress-item span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-template-generated__progress-item.is-done span {
  color: #ff2d87;
  background: #fff2f8;
}

.offer-template-generated__progress-item.is-active span {
  color: #fff;
  background: linear-gradient(135deg, #ff3f98 0%, #ff1f7c 100%);
}

.offer-template-generated__progress-item strong,
.offer-template-generated__preview-head strong,
.offer-template-generated__success strong,
.offer-template-generated__section-head h3,
.offer-template-generated__section-title strong,
.offer-template-generated__insight-row strong,
.offer-template-generated__review-callout strong {
  color: #1d2b49;
}

.offer-template-generated__progress-item strong {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
}

.offer-template-generated__progress-item small,
.offer-template-generated__preview-head span,
.offer-template-generated__preview-head em,
.offer-template-generated__success p,
.offer-template-generated__section-head p,
.offer-template-generated__insight-row small,
.offer-template-generated__review-callout small,
.offer-template-generated__review-callout p,
.offer-template-generated__tip-card span {
  display: block;
  color: #8f9bb1;
  font-size: 0.72rem;
  font-weight: 500;
}

.offer-template-generated__preview {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: start;
  width: 320px;
  max-width: 100%;
  border: 1px solid #f2dfeb;
  border-radius: 22px;
  padding: 14px 16px;
  background: linear-gradient(180deg, rgba(255, 248, 251, 0.92), #fff);
}

.offer-template-generated__preview > small {
  display: block;
  color: #ff2d87;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.offer-template-generated__preview-head {
  gap: 12px;
  margin-top: 10px;
}

.offer-template-generated__preview-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffe0ba 0%, #ffc781 100%);
  color: #5a3712;
  font-size: 0.92rem;
  font-weight: 800;
}

.offer-template-generated__preview-head strong,
.offer-template-generated__success strong {
  display: block;
  font-size: 0.96rem;
  font-weight: 800;
}

.offer-template-generated__preview-head em {
  font-style: normal;
}

.offer-template-generated__preview-metrics {
  margin-top: 12px;
  align-items: stretch;
  gap: 12px;
}

.offer-template-generated__preview-metrics > div:first-child {
  flex: 1 1 auto;
}

.offer-template-generated__preview-metrics span,
.offer-template-generated__bars span,
.offer-template-generated__review-callout small {
  color: #8f9bb1;
  font-size: 0.72rem;
  font-weight: 700;
}

.offer-template-generated__preview-metrics strong {
  display: block;
  margin-top: 4px;
  color: #ff2d87;
  font-size: 1.35rem;
  font-weight: 800;
}

.offer-template-generated__preview-metrics small {
  display: block;
  margin-top: 4px;
  color: #99a5ba;
  font-size: 0.7rem;
}

.offer-template-generated__market-box {
  width: 104px;
  border-radius: 16px;
  border: 1px solid #ffd4e5;
  padding: 12px 10px;
  text-align: center;
}

.offer-template-generated__market-box strong {
  display: block;
  color: #6e56ff;
  font-size: 1.3rem;
  font-weight: 800;
}

.offer-template-generated__market-box span {
  color: #7f8ea4;
  font-size: 0.68rem;
  font-weight: 700;
}

.offer-template-generated__preview-footer {
  gap: 12px;
  margin-top: 12px;
  color: #8f9bb1;
  font-size: 0.76rem;
}

.offer-template-generated__preview-footer strong {
  margin-left: 4px;
  color: #ff2d87;
}

.offer-template-generated__preview-footer i {
  width: 1px;
  height: 12px;
  background: #dfe5f0;
}

.offer-template-generated__hero-card {
  grid-column: 1;
  grid-row: 2;
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
  align-items: stretch;
  gap: 16px;
  border: 1px solid #e8edf7;
  border-radius: 24px;
  padding: 14px 16px;
}

.offer-template-generated__success {
  width: 250px;
  max-width: 100%;
  gap: 14px;
  padding-right: 16px;
  border-right: 1px solid #eef2f8;
}

.offer-template-generated__success-icon {
  position: relative;
  width: 62px;
  height: 62px;
  flex: 0 0 auto;
}

.offer-template-generated__success-icon > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: linear-gradient(180deg, #fff1f7 0%, #fff 100%);
  box-shadow: inset 0 0 0 5px #ff2d87;
}

.offer-template-generated__success-icon > svg {
  position: absolute;
  right: -2px;
  bottom: 2px;
  color: #ff2d87;
}

.offer-template-generated__bars {
  flex: 1 1 auto;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
}

.offer-template-generated__bars strong {
  display: block;
  margin-top: 4px;
  color: #ff2d87;
  font-size: 1.55rem;
  font-weight: 800;
}

.offer-template-generated__bar {
  margin-top: 4px;
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: #f1d3e2;
  overflow: hidden;
}

.offer-template-generated__bar i {
  display: block;
  height: 100%;
  width: 78%;
  border-radius: inherit;
}

.offer-template-generated__bar i.is-pink {
  background: linear-gradient(90deg, #ff3f98 0%, #ff1f7c 100%);
}

.offer-template-generated__chips {
  grid-column: 1 / -1;
  gap: 8px;
  flex-wrap: wrap;
}

.offer-template-generated__chips small {
  min-height: 28px;
  border-radius: 10px;
  padding: 0 9px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #657691;
  background: #f8faff;
  box-shadow: inset 0 0 0 1px #e4eaf4;
  font-size: 0.7rem;
  font-weight: 700;
}

.offer-template-generated__main {
  grid-column: 1;
  grid-row: 3;
  flex: 1 1 auto;
  min-width: 0;
}

.offer-template-generated__section-head {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}

.offer-template-generated__section-head h3 {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 800;
}

.offer-template-generated__legend {
  gap: 14px;
  flex-wrap: wrap;
  color: #7f8da4;
  font-size: 0.72rem;
  font-weight: 700;
}

.offer-template-generated__legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.offer-template-generated__legend i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.offer-template-generated__legend i.is-orange {
  background: #ffad33;
}

.offer-template-generated__legend i.is-green {
  background: #14b86f;
}

.offer-template-generated__legend i.is-slate {
  background: #8797b2;
}

.offer-template-generated__section-list {
  display: grid;
  gap: 8px;
}

.offer-template-generated__section-row {
  gap: 16px;
  border: 1px solid #e9edf6;
  border-radius: 18px;
  padding: 12px 14px;
  background: #fff;
}

.offer-template-generated__section-title {
  width: 320px;
  max-width: 100%;
  gap: 10px;
  min-width: 0;
}

.offer-template-generated__section-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.offer-template-generated__section-icon.is-pink {
  color: #ff2d87;
  background: #fff1f7;
}

.offer-template-generated__section-icon.is-green {
  color: #17b26a;
  background: #ebfaf2;
}

.offer-template-generated__section-icon.is-orange {
  color: #ff9d1e;
  background: #fff5e8;
}

.offer-template-generated__section-title strong {
  font-size: 0.92rem;
  font-weight: 800;
}

.offer-template-generated__section-title em {
  margin-left: 8px;
  min-height: 24px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  font-style: normal;
  font-size: 0.7rem;
  font-weight: 800;
}

.offer-template-generated__section-title em.is-pink {
  color: #ff2d87;
  background: #fff1f7;
}

.offer-template-generated__section-title em.is-green {
  color: #17b26a;
  background: #ebfaf2;
}

.offer-template-generated__section-title em.is-orange {
  color: #ff9d1e;
  background: #fff5e8;
}

.offer-template-generated__section-row p {
  flex: 1 1 auto;
  margin: 0;
  color: #7f8ea4;
  font-size: 0.76rem;
  text-align: right;
}

.offer-template-generated__section-row button {
  border: 0;
  background: transparent;
  color: #8190a7;
}

.offer-template-generated__side {
  grid-column: 2;
  grid-row: 3;
  width: 308px;
  max-width: 100%;
  display: grid;
  gap: 12px;
}

.offer-template-generated__insights-card,
.offer-template-generated__tip-card {
  border: 1px solid #e9edf6;
  border-radius: 20px;
  padding: 14px;
  background: #fff;
}

.offer-template-generated__side-title {
  gap: 8px;
  color: #ff2d87;
}

.offer-template-generated__side-title strong {
  color: #1d2b49;
  font-size: 1rem;
  font-weight: 800;
}

.offer-template-generated__insight-list {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.offer-template-generated__insight-row {
  align-items: flex-start;
  gap: 10px;
}

.offer-template-generated__insight-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ebfaf2;
  color: #17b26a;
  flex: 0 0 auto;
}

.offer-template-generated__insight-row strong {
  display: block;
  font-size: 0.84rem;
  font-weight: 800;
}

.offer-template-generated__insight-row em {
  margin-left: auto;
  font-style: normal;
  color: #17b26a;
  font-size: 0.76rem;
  font-weight: 800;
  white-space: nowrap;
}

.offer-template-generated__review-callout {
  margin-top: 12px;
  border-radius: 16px;
  padding: 12px;
  background: linear-gradient(180deg, rgba(255, 243, 248, 0.9), #fff);
}

.offer-template-generated__review-callout strong {
  display: block;
  margin-top: 6px;
  font-size: 0.9rem;
  font-weight: 800;
}

.offer-template-generated__tip-card {
  gap: 8px;
  color: #7c68ff;
  background: linear-gradient(180deg, rgba(244, 242, 255, 0.92), #fff);
}

.offer-template-modal__footer {
  border-top: 1px solid #edf2fa;
  justify-content: flex-start;
}

.offer-template-modal__footer.is-ready {
  gap: 16px;
}

.offer-template-modal__footer.is-generated {
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.offer-template-modal__footer-note {
  gap: 8px;
  margin-left: auto;
  color: #8a97ad;
  font-size: 0.78rem;
}

.offer-template-modal__generated-actions {
  display: grid;
  justify-items: end;
  gap: 6px;
}

.offer-template-modal__generated-actions small {
  color: #97a4ba;
  font-size: 0.72rem;
  font-weight: 500;
}

.offer-template-cancel {
  min-width: 74px;
  min-height: 42px;
  border-radius: 12px;
  padding: 0 18px;
  color: #1d2b49;
  background: #fff;
  box-shadow: inset 0 0 0 1px #dce4f1;
  font-weight: 700;
}

@media (max-width: 1180px) {
  .offer-template-modal__body,
  .offer-template-ready__layout {
    grid-template-columns: 1fr;
    display: grid;
  }

  .offer-template-grid {
    grid-template-columns: 1fr 1fr;
  }

  .offer-template-ready__side,
  .offer-template-generated__preview,
  .offer-template-generated__side {
    width: 100%;
  }

  .offer-template-generated {
    grid-template-columns: 1fr;
  }

  .offer-template-generated__top,
  .offer-template-generated__layout {
    display: grid;
    grid-template-columns: 1fr;
  }

  .offer-template-generated__preview,
  .offer-template-generated__hero-card,
  .offer-template-generated__main,
  .offer-template-generated__side {
    grid-column: auto;
    grid-row: auto;
  }

  .offer-template-generated__hero-card {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 840px) {
  .offer-template-overlay {
    padding: 12px;
  }

  .offer-template-modal__header,
  .offer-template-modal__footer,
  .offer-template-modal__body,
  .offer-template-ready,
  .offer-template-generated {
    padding-left: 16px;
    padding-right: 16px;
  }

  .offer-template-featured,
  .offer-template-empty-state,
  .offer-template-results-head,
  .offer-template-ready__hero,
  .offer-template-generated__hero-card {
    grid-template-columns: 1fr;
    display: grid;
  }

  .offer-template-results-head__actions,
  .offer-template-card__footer,
  .offer-template-ready__summary,
  .offer-template-ready__adjustment-row,
  .offer-template-modal__footer.is-ready,
  .offer-template-generated__progress,
  .offer-template-generated__section-row,
  .offer-template-generated__section-head {
    flex-wrap: wrap;
  }

  .offer-template-grid {
    grid-template-columns: 1fr;
  }

  .offer-template-modal__footer-note {
    margin-left: 0;
    width: 100%;
  }

  .offer-template-modal__footer.is-generated {
    align-items: stretch;
  }

  .offer-template-modal__generated-actions {
    width: 100%;
    justify-items: stretch;
  }

  .offer-template-modal__generated-actions .offer-template-primary {
    justify-content: center;
  }

  .offer-template-generated__progress {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .offer-template-generated__progress-item:not(:last-child)::after {
    display: none;
  }

  .offer-template-generated__section-title,
  .offer-template-generated__section-row p {
    width: 100%;
    text-align: left;
  }

  .offer-template-generated__success {
    width: 100%;
    border-right: 0;
    border-bottom: 1px solid #eef2f8;
    padding-right: 0;
    padding-bottom: 14px;
  }

  .offer-template-generated__bars {
    grid-template-columns: 1fr;
  }
}
</style>
