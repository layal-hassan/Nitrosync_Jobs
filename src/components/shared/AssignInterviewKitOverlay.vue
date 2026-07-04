<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
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

const emit = defineEmits(['close', 'review-customize', 'assign-plan', 'create-kit'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const preparedAssets = [
  { title: 'Interview Kit', meta: 'AI-generated', action: 'Preview', icon: 'briefcase', tone: 'violet' },
  { title: 'Interview Brief', meta: 'AI-generated', action: 'Preview', icon: 'document', tone: 'blue' },
  { title: 'Scorecard', meta: 'AI-generated', action: 'Preview', icon: 'clipboard-check', tone: 'green' },
  { title: 'Interviewer Responsibilities', meta: 'AI-generated', action: 'Preview', icon: 'users', tone: 'orange' },
  { title: 'Focus Areas', meta: 'AI-generated', action: 'Preview', icon: 'shield', tone: 'pink' },
  { title: 'Confidence Impact', meta: 'AI-predicted', action: 'Preview', icon: 'trend-up', tone: 'indigo' },
]

const recommendationChips = [
  '96% Confidence',
  'Best fit for role and candidate',
]

const validationChips = [
  'Kit Matched',
  'Panel Matched',
  'Focus Areas Generated',
  'Scorecard Generated',
  'Brief Generated',
]

const evidenceKnown = ['Product Thinking', 'UX Process', 'Communication']
const evidenceMissing = ['Leadership', 'Stakeholder Influence', 'Analytics Depth']

const suggestionItems = [
  {
    title: 'Analytics Depth not fully covered',
    note: 'Add analytics discussion to Round 1.',
    action: 'Auto Fix',
  },
  {
    title: 'Leadership assessed only once',
    note: 'Add another leadership touchpoint.',
    action: 'Add Coverage',
  },
  {
    title: 'All key competencies will be covered',
    note: 'This plan covers 95% of role requirements.',
    action: '',
    success: true,
  },
]

const detailRows = [
  {
    title: 'Focus Areas',
    description: 'Top areas to evaluate in this interview.',
    chips: ['Leadership', 'Stakeholder Influence', 'Analytics Depth'],
    icon: 'shield',
    tone: 'pink',
  },
  {
    title: 'Interviewer Responsibilities',
    description: 'What each panelist will evaluate.',
    value: '+ View details',
    meta: 'Emma Wilson, Michael Chen, David Park',
    icon: 'users',
    tone: 'slate',
  },
  {
    title: 'Interview Brief',
    description: 'AI-generated brief for your panel.',
    value: '3 brief(s) generated',
    icon: 'document',
    tone: 'blue',
  },
  {
    title: 'Scorecard',
    description: 'Evaluation areas and rating criteria.',
    value: '4 competency areas',
    icon: 'clipboard-check',
    tone: 'green',
  },
  {
    title: 'Questions',
    description: 'Questions generated for this interview.',
    value: '12 questions',
    icon: 'message',
    tone: 'pink',
  },
  {
    title: 'Confidence Impact',
    description: 'How this interview improves hiring confidence.',
    current: '72%',
    after: '89%',
    uplift: '+17% uplift',
    icon: 'trend-up',
    tone: 'indigo',
  },
]

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

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

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

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="kit-overlay" @click.self="closeOverlay">
      <section class="kit-modal">
        <header class="kit-modal__header">
          <div class="kit-modal__title">
            <span class="kit-modal__title-icon">
              <AppIcon name="briefcase" :size="20" />
            </span>
            <div>
              <div class="kit-modal__title-row">
                <h2>Assign Interview Kit</h2>
                <span class="kit-modal__badge">AI Recommendation</span>
              </div>
              <p>NitroSync has analyzed the role, candidate and requirements to recommend the best interview plan.</p>
            </div>
          </div>

          <button class="kit-modal__close" type="button" aria-label="Close assign interview kit" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="kit-modal__body">
          <section class="kit-main">
            <section class="kit-candidate-card">
              <div class="kit-candidate-card__main">
                <div class="kit-avatar">
                  <span>{{ candidateInitials }}</span>
                  <i />
                </div>

                <div class="kit-candidate-copy">
                  <div class="kit-candidate-copy__name">
                    <h3>{{ candidateName }}</h3>
                    <span>{{ candidateStage }}</span>
                  </div>

                  <p>{{ candidateRole }}</p>

                  <div class="kit-candidate-copy__meta">
                    <span><AppIcon name="mapPin" :size="13" /> New York, NY (Hybrid)</span>
                    <span><AppIcon name="briefcase" :size="13" /> 6+ years experience</span>
                    <span><AppIcon name="calendar" :size="13" /> Applied on 10 May 2026</span>
                  </div>

                  <div class="kit-candidate-copy__team">
                    <div class="kit-panel-preview">
                      <strong>Interview Panel (3)</strong>
                      <div class="kit-panel-preview__avatars">
                        <span class="tone-sand">EW</span>
                        <span class="tone-ink">MC</span>
                        <span class="tone-slate">DP</span>
                        <button type="button">+ View all</button>
                      </div>
                    </div>

                    <div class="kit-manager-preview">
                      <strong>Hiring Manager</strong>
                      <div>
                        <span class="kit-mini-avatar tone-sand">EW</span>
                        <div>
                          <b>Emma Wilson</b>
                          <span>Design Director</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="kit-candidate-card__stage">
                <small>Interview Stage</small>
                <span>Not Assigned</span>
                <p>No stage has been assigned yet</p>
              </div>
            </section>

            <section class="kit-recommendation-card">
              <div class="kit-recommendation-card__content">
                <div class="kit-section-kicker">
                  <AppIcon name="spark" :size="14" />
                  <span>AI Recommendation</span>
                </div>

                <h3>Senior Product Designer Interview Kit</h3>

                <div class="kit-recommendation-card__chips">
                  <span v-for="chip in recommendationChips" :key="chip">{{ chip }}</span>
                </div>

                <p>
                  This interview plan is recommended to collect the right evidence and help you make a confident hiring decision.
                </p>

                <div class="kit-recommendation-card__checks">
                  <span v-for="chip in validationChips" :key="chip">
                    <AppIcon name="check" :size="13" />
                    {{ chip }}
                  </span>
                </div>
              </div>

              <div class="kit-recommendation-card__actions">
                <div class="kit-structure-card">
                  <small>Suggested Interview Structure</small>
                  <article>
                    <span>1</span>
                    <div>
                      <strong>Round 1 - Technical Interview</strong>
                      <p>Focus: Leadership, Stakeholder Influence, Analytics</p>
                    </div>
                    <em>60 mins</em>
                  </article>
                </div>

                <button class="kit-button kit-button--primary" type="button" @click="emit('create-kit')">Create New Interview Kit</button>
                <button class="kit-button kit-button--ghost" type="button" @click="emit('review-customize')">Review &amp; Customize</button>
              </div>
            </section>

            <section class="kit-prepared">
              <div class="kit-prepared__header">
                <h3>What AI has prepared <span>(Preview)</span></h3>
                <p>Everything below is AI-generated. Review, edit if needed, and then assign.</p>
              </div>

              <div class="kit-prepared__grid">
                <article v-for="item in preparedAssets" :key="item.title" class="kit-prepared-card" :class="`tone-${item.tone}`">
                  <span class="kit-prepared-card__icon">
                    <AppIcon :name="item.icon" :size="18" />
                  </span>
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.meta }}</small>
                  <button type="button">{{ item.action }}</button>
                </article>
              </div>
            </section>

            <section class="kit-detail-table">
              <article v-for="row in detailRows" :key="row.title" class="kit-detail-row">
                <div class="kit-detail-row__title">
                  <span class="kit-detail-row__icon" :class="`tone-${row.tone}`">
                    <AppIcon :name="row.icon" :size="15" />
                  </span>
                  <strong>{{ row.title }}</strong>
                </div>

                <p>{{ row.description }}</p>

                <div v-if="row.chips" class="kit-detail-row__chips">
                  <span v-for="chip in row.chips" :key="chip">{{ chip }}</span>
                </div>

                <div v-else-if="row.current" class="kit-detail-row__confidence">
                  <div>
                    <small>Current Confidence</small>
                    <strong class="is-orange">{{ row.current }}</strong>
                  </div>
                  <span><AppIcon name="chevrons-right" :size="16" /></span>
                  <div>
                    <small>After This Interview</small>
                    <strong class="is-green">{{ row.after }}</strong>
                  </div>
                  <em>{{ row.uplift }}</em>
                </div>

                <div v-else class="kit-detail-row__value">
                  <span>{{ row.value }}</span>
                  <small v-if="row.meta">{{ row.meta }}</small>
                </div>

                <div class="kit-detail-row__actions">
                  <button type="button">
                    <AppIcon name="edit" :size="13" />
                    <span>Edit</span>
                  </button>
                  <button type="button" aria-label="Expand section">
                    <AppIcon name="chevronDown" :size="16" />
                  </button>
                </div>
              </article>
            </section>
          </section>

          <aside class="kit-side">
            <section class="kit-side-card">
              <div class="kit-side-card__head">
                <h3>Evidence Snapshot</h3>
                <AppIcon name="info" :size="14" />
              </div>

              <small>What we already know</small>
              <ul class="kit-side-list">
                <li v-for="item in evidenceKnown" :key="item" class="is-green">
                  <AppIcon name="check" :size="13" />
                  <span>{{ item }}</span>
                </li>
              </ul>

              <small>What we still need to validate</small>
              <ul class="kit-side-list">
                <li v-for="item in evidenceMissing" :key="item" class="is-orange">
                  <AppIcon name="alert" :size="13" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </section>

            <section class="kit-side-card kit-side-card--tinted">
              <div class="kit-side-card__head">
                <h3>AI Suggestions</h3>
                <button type="button" aria-label="Collapse suggestions">
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </div>

              <div class="kit-suggestion-list">
                <article v-for="item in suggestionItems" :key="item.title" :class="{ 'is-success': item.success }">
                  <div class="kit-suggestion-list__copy">
                    <div class="kit-suggestion-list__title">
                      <AppIcon :name="item.success ? 'check' : 'alert'" :size="13" />
                      <strong>{{ item.title }}</strong>
                    </div>
                    <p>{{ item.note }}</p>
                  </div>
                  <button v-if="item.action" type="button">{{ item.action }}</button>
                </article>
              </div>
            </section>

            <section class="kit-side-card">
              <div class="kit-side-card__head">
                <h3>Expected Outcome</h3>
                <AppIcon name="trend-up" :size="15" />
              </div>

              <p>
                This plan is projected to provide sufficient evidence for a confident hiring decision after the recommended interview.
              </p>

              <div class="kit-confidence">
                <div class="kit-confidence__head">
                  <strong>Projected Confidence</strong>
                  <span>89%</span>
                </div>
                <div class="kit-confidence__bar">
                  <span />
                </div>
                <div class="kit-confidence__scale">
                  <small>72%</small>
                  <small>100%</small>
                </div>
                <p>Based on historical data from 132 similar hires</p>
              </div>
            </section>
          </aside>
        </div>

        <footer class="kit-modal__footer">
          <button class="kit-reset" type="button">
            <AppIcon name="refresh" :size="15" />
            <div>
              <strong>Reset to AI recommendation</strong>
              <span>Revert all changes back to AI defaults</span>
            </div>
          </button>

          <div class="kit-modal__footer-actions">
            <button class="kit-button kit-button--ghost" type="button" @click="closeOverlay">Cancel</button>
            <button class="kit-button kit-button--primary" type="button" @click="emit('assign-plan')">
              <AppIcon name="document" :size="14" />
              <span>Assign Interview Plan</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.kit-overlay,
.kit-overlay *,
.kit-overlay *::before,
.kit-overlay *::after {
  box-sizing: border-box;
}

.kit-overlay button {
  font: inherit;
}

.kit-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  padding: 18px;
  display: grid;
  place-items: center;
  background: rgba(12, 18, 31, 0.45);
  backdrop-filter: blur(8px);
}

.kit-modal {
  width: min(1480px, 100%);
  max-height: calc(100vh - 36px);
  overflow: auto;
  border: 1px solid #dfe7f3;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 34px 80px rgba(15, 23, 42, 0.16);
}

.kit-modal__header,
.kit-modal__title,
.kit-modal__title-row,
.kit-candidate-card,
.kit-candidate-card__main,
.kit-candidate-copy__name,
.kit-candidate-copy__meta,
.kit-candidate-copy__team,
.kit-panel-preview__avatars,
.kit-manager-preview > div,
.kit-recommendation-card,
.kit-section-kicker,
.kit-recommendation-card__chips,
.kit-recommendation-card__checks,
.kit-structure-card article,
.kit-prepared__header,
.kit-side-card__head,
.kit-side-list li,
.kit-suggestion-list__title,
.kit-confidence__head,
.kit-confidence__scale,
.kit-detail-row,
.kit-detail-row__title,
.kit-detail-row__confidence,
.kit-detail-row__actions,
.kit-modal__footer,
.kit-reset,
.kit-modal__footer-actions {
  display: flex;
  align-items: center;
}

.kit-modal__header,
.kit-candidate-card,
.kit-prepared__header,
.kit-side-card__head,
.kit-modal__footer {
  justify-content: space-between;
}

.kit-modal__header {
  gap: 18px;
  padding: 20px 26px;
  border-bottom: 1px solid #e8eef7;
}

.kit-modal__title {
  gap: 16px;
}

.kit-modal__title-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(180deg, #fd72b7 0%, #ea4d9a 100%);
}

.kit-modal__title-row {
  gap: 10px;
}

.kit-modal__title h2,
.kit-candidate-copy__name h3,
.kit-recommendation-card__content h3,
.kit-prepared__header h3,
.kit-side-card__head h3 {
  margin: 0;
  color: #1d2943;
}

.kit-modal__title h2 {
  font-size: 17px;
}

.kit-modal__title p,
.kit-candidate-copy > p,
.kit-recommendation-card__content > p,
.kit-prepared__header p,
.kit-suggestion-list__copy p,
.kit-side-card > p,
.kit-confidence p,
.kit-candidate-card__stage p {
  margin: 4px 0 0;
  color: #70809a;
  font-size: 13px;
  line-height: 1.6;
}

.kit-modal__badge {
  padding: 4px 8px;
  border-radius: 8px;
  background: #ebfff2;
  color: #1ea55b;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.kit-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #98a4b7;
  background: transparent;
}

.kit-modal__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 334px;
  min-height: 0;
}

.kit-main {
  min-width: 0;
  padding: 24px 24px 26px 28px;
  border-right: 1px solid #e9eef7;
  display: grid;
  gap: 24px;
}

.kit-side {
  padding: 24px;
  display: grid;
  align-content: start;
  gap: 24px;
}

.kit-candidate-card {
  align-items: stretch;
  gap: 22px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e7edf6;
}

.kit-candidate-card__main {
  gap: 18px;
  min-width: 0;
}

.kit-avatar {
  position: relative;
  width: 74px;
  height: 74px;
  flex: 0 0 74px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #f1b27b 0%, #d55c75 42%, #8e5066 100%);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.86);
}

.kit-avatar i {
  position: absolute;
  right: 2px;
  bottom: 5px;
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #24c26a;
}

.kit-candidate-copy {
  min-width: 0;
}

.kit-candidate-copy__name {
  gap: 12px;
}

.kit-candidate-copy__name h3 {
  font-size: 22px;
}

.kit-candidate-copy__name span {
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff0f6;
  color: #ef5da8;
  font-size: 12px;
  font-weight: 700;
}

.kit-candidate-copy > p {
  font-size: 16px;
}

.kit-candidate-copy__meta {
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.kit-candidate-copy__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8a97ab;
  font-size: 13px;
}

.kit-candidate-copy__team {
  gap: 34px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.kit-panel-preview,
.kit-manager-preview {
  display: grid;
  gap: 8px;
}

.kit-panel-preview strong,
.kit-manager-preview strong,
.kit-candidate-card__stage small,
.kit-side-card small {
  color: #95a1b4;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.kit-panel-preview__avatars {
  gap: 8px;
}

.kit-panel-preview__avatars span,
.kit-mini-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}

.tone-sand {
  background: linear-gradient(135deg, #f6dcc6 0%, #d59a88 100%);
}

.tone-ink {
  background: linear-gradient(135deg, #17253c 0%, #51657f 100%);
}

.tone-slate {
  background: linear-gradient(135deg, #29303b 0%, #77796d 100%);
}

.kit-panel-preview__avatars button {
  border: 0;
  padding: 0;
  color: #3267f5;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.kit-manager-preview > div {
  gap: 10px;
}

.kit-manager-preview b {
  display: block;
  color: #25314a;
  font-size: 14px;
}

.kit-manager-preview span {
  color: #97a2b3;
  font-size: 12px;
}

.kit-candidate-card__stage {
  width: 172px;
  flex: 0 0 172px;
  text-align: center;
}

.kit-candidate-card__stage span {
  min-height: 34px;
  margin-top: 10px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #435166;
  background: #f5f7fb;
  font-weight: 700;
}

.kit-recommendation-card {
  align-items: stretch;
  gap: 28px;
  padding: 26px 22px;
  border: 1px solid #ffdced;
  border-radius: 18px;
  background: linear-gradient(180deg, #fffefe 0%, #fff7fb 100%);
}

.kit-recommendation-card__content {
  flex: 1;
  min-width: 0;
}

.kit-section-kicker {
  gap: 8px;
  color: #f05fa8;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.kit-recommendation-card__content h3 {
  margin-top: 16px;
  font-size: 24px;
  line-height: 1.2;
}

.kit-recommendation-card__chips,
.kit-recommendation-card__checks {
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.kit-recommendation-card__chips span,
.kit-recommendation-card__checks span {
  min-height: 30px;
  padding: 0 13px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
}

.kit-recommendation-card__chips span {
  background: #e7fbec;
  color: #18864e;
}

.kit-recommendation-card__checks span {
  background: #fff;
  border: 1px solid #e6ebf4;
  color: #445166;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.03);
}

.kit-recommendation-card__actions {
  width: 320px;
  flex: 0 0 320px;
  display: grid;
  align-content: start;
  gap: 16px;
}

.kit-structure-card {
  padding: 16px;
  border: 1px solid #ffd8ea;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.86);
}

.kit-structure-card small {
  display: block;
  color: #9aa5b8;
  font-size: 13px;
}

.kit-structure-card article {
  gap: 12px;
  margin-top: 14px;
  padding: 18px 14px;
  border: 1px solid #eef2f8;
  border-radius: 14px;
  background: #fbfcfe;
}

.kit-structure-card article > span {
  width: 34px;
  height: 34px;
  border: 1px solid #dfe6f2;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
  color: #34425e;
  background: #fff;
  font-weight: 800;
}

.kit-structure-card article strong {
  display: block;
  color: #26334d;
  font-size: 14px;
}

.kit-structure-card article p {
  margin: 4px 0 0;
  color: #97a2b4;
  font-size: 12px;
  line-height: 1.45;
}

.kit-structure-card article em {
  margin-left: auto;
  color: #97a2b4;
  font-size: 12px;
  font-style: normal;
}

.kit-button {
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
}

.kit-button--primary {
  color: #fff;
  background: linear-gradient(180deg, #f06bae 0%, #ea56a4 100%);
  box-shadow: 0 16px 28px rgba(236, 94, 166, 0.24);
}

.kit-button--ghost {
  color: #3f4d64;
  border-color: #dce4ef;
  background: #fff;
}

.kit-prepared {
  display: grid;
  gap: 16px;
}

.kit-prepared__header {
  align-items: flex-end;
  gap: 14px;
}

.kit-prepared__header h3 {
  font-size: 18px;
}

.kit-prepared__header h3 span {
  color: #9aa5b8;
}

.kit-prepared__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.kit-prepared-card {
  padding: 18px 14px 14px;
  border: 1px solid #e5ebf5;
  border-radius: 18px;
  background: #fff;
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
}

.kit-prepared-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  background: #f5f7ff;
}

.kit-prepared-card.tone-violet .kit-prepared-card__icon {
  color: #6f62ff;
  background: #f3f1ff;
}

.kit-prepared-card.tone-blue .kit-prepared-card__icon,
.kit-prepared-card.tone-indigo .kit-prepared-card__icon {
  color: #3b82f6;
  background: #eef5ff;
}

.kit-prepared-card.tone-green .kit-prepared-card__icon {
  color: #1dbf66;
  background: #eefcf4;
}

.kit-prepared-card.tone-orange .kit-prepared-card__icon {
  color: #f97316;
  background: #fff4eb;
}

.kit-prepared-card.tone-pink .kit-prepared-card__icon {
  color: #ef5da8;
  background: #fff0f7;
}

.kit-prepared-card strong {
  color: #25314a;
  font-size: 13px;
}

.kit-prepared-card small {
  color: #9aa5b8;
  font-size: 11px;
}

.kit-prepared-card button {
  border: 0;
  padding: 0;
  color: #3168f5;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
}

.kit-detail-table {
  border: 1px solid #e4ebf5;
  border-radius: 18px;
  overflow: hidden;
}

.kit-detail-row {
  gap: 18px;
  padding: 16px 18px;
  border-bottom: 1px solid #ebf0f7;
}

.kit-detail-row:last-child {
  border-bottom: 0;
}

.kit-detail-row__title {
  width: 200px;
  flex: 0 0 200px;
  gap: 10px;
}

.kit-detail-row__icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
}

.kit-detail-row__icon.tone-pink {
  color: #ef5da8;
  background: #fff0f7;
}

.kit-detail-row__icon.tone-slate {
  color: #64748b;
  background: #f4f7fb;
}

.kit-detail-row__icon.tone-blue,
.kit-detail-row__icon.tone-indigo {
  color: #3b82f6;
  background: #eef4ff;
}

.kit-detail-row__icon.tone-green {
  color: #1dbf66;
  background: #eefcf4;
}

.kit-detail-row__title strong {
  color: #22304a;
  font-size: 15px;
}

.kit-detail-row > p {
  flex: 1;
  margin: 0;
  color: #97a2b3;
  font-size: 12px;
  line-height: 1.6;
}

.kit-detail-row__chips,
.kit-detail-row__value,
.kit-detail-row__confidence {
  min-width: 0;
  flex: 1.1;
}

.kit-detail-row__chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.kit-detail-row__chips span {
  padding: 5px 10px;
  border-radius: 8px;
  background: #f3f5f8;
  color: #334155;
  font-size: 12px;
}

.kit-detail-row__value span,
.kit-detail-row__value small {
  display: block;
}

.kit-detail-row__value span {
  color: #435066;
  font-size: 14px;
  font-weight: 700;
}

.kit-detail-row__value small {
  margin-top: 5px;
  color: #3267f5;
  font-size: 12px;
  font-weight: 700;
}

.kit-detail-row__confidence {
  gap: 18px;
}

.kit-detail-row__confidence > div small {
  display: block;
  color: #9aa5b8;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.kit-detail-row__confidence > div strong {
  display: block;
  margin-top: 4px;
  font-size: 24px;
}

.kit-detail-row__confidence strong.is-orange {
  color: #f97316;
}

.kit-detail-row__confidence strong.is-green {
  color: #16a34a;
}

.kit-detail-row__confidence > span {
  color: #c2cada;
}

.kit-detail-row__confidence em {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #e9fbef;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.kit-detail-row__actions {
  gap: 10px;
  margin-left: auto;
}

.kit-detail-row__actions button {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #cfe0ff;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #3168f5;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
}

.kit-detail-row__actions button:last-child {
  min-width: 34px;
  padding: 0;
  justify-content: center;
  border-color: transparent;
  color: #97a2b4;
}

.kit-side-card {
  padding: 18px 18px 20px;
  border: 1px solid #e4ebf5;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
}

.kit-side-card--tinted {
  background: linear-gradient(180deg, #f8f9ff 0%, #f4f7ff 100%);
}

.kit-side-card__head {
  gap: 8px;
}

.kit-side-card__head button {
  border: 0;
  padding: 0;
  color: #8090ab;
  background: transparent;
}

.kit-side-card small {
  display: block;
  margin-top: 16px;
  margin-bottom: 10px;
}

.kit-side-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.kit-side-list + small {
  margin-top: 18px;
}

.kit-side-list li {
  gap: 10px;
  color: #29364f;
  font-size: 14px;
  font-weight: 600;
}

.kit-side-list li.is-green .app-icon,
.kit-suggestion-list__title .app-icon {
  color: #22c55e;
}

.kit-side-list li.is-orange .app-icon {
  color: #f59e0b;
}

.kit-suggestion-list {
  display: grid;
  gap: 16px;
  margin-top: 12px;
}

.kit-suggestion-list article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
}

.kit-suggestion-list__title {
  gap: 8px;
}

.kit-suggestion-list__title strong {
  color: #1f2b45;
  font-size: 14px;
}

.kit-suggestion-list__copy p {
  margin-top: 4px;
  font-size: 12px;
}

.kit-suggestion-list article button {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #cad7ff;
  border-radius: 10px;
  color: #315ef8;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
}

.kit-suggestion-list article.is-success {
  grid-template-columns: 1fr;
}

.kit-suggestion-list article.is-success .kit-suggestion-list__title .app-icon {
  color: #22c55e;
}

.kit-confidence {
  margin-top: 18px;
}

.kit-confidence__head {
  justify-content: space-between;
}

.kit-confidence__head strong {
  color: #46546d;
  font-size: 14px;
}

.kit-confidence__head span {
  color: #22c55e;
  font-size: 34px;
  font-weight: 800;
}

.kit-confidence__bar {
  height: 8px;
  margin-top: 12px;
  border-radius: 999px;
  background: #ebeff5;
  overflow: hidden;
}

.kit-confidence__bar span {
  display: block;
  width: 89%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #16c05d 0%, #31c56d 100%);
}

.kit-confidence__scale {
  justify-content: space-between;
  margin-top: 6px;
}

.kit-confidence__scale small {
  margin: 0;
  color: #97a2b4;
  font-size: 11px;
}

.kit-confidence p {
  margin-top: 22px;
  text-align: center;
  font-size: 12px;
}

.kit-modal__footer {
  gap: 16px;
  padding: 18px 22px;
  border-top: 1px solid #e7edf6;
}

.kit-reset {
  gap: 12px;
  border: 0;
  padding: 0;
  color: #506078;
  background: transparent;
}

.kit-reset strong {
  display: block;
  color: #47556d;
  font-size: 14px;
  text-align: left;
}

.kit-reset span {
  display: block;
  margin-top: 4px;
  color: #9aa5b8;
  font-size: 12px;
  text-align: left;
}

.kit-modal__footer-actions {
  gap: 12px;
  margin-left: auto;
}

@media (max-width: 1260px) {
  .kit-modal__body {
    grid-template-columns: 1fr;
  }

  .kit-main {
    border-right: 0;
    border-bottom: 1px solid #e9eef7;
  }

  .kit-prepared__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .kit-recommendation-card {
    display: grid;
  }

  .kit-recommendation-card__actions {
    width: 100%;
  }
}

@media (max-width: 920px) {
  .kit-overlay {
    padding: 10px;
  }

  .kit-modal {
    max-height: calc(100vh - 20px);
  }

  .kit-modal__body,
  .kit-prepared__grid {
    grid-template-columns: 1fr;
  }

  .kit-candidate-card,
  .kit-recommendation-card,
  .kit-detail-row,
  .kit-modal__footer {
    display: grid;
  }

  .kit-candidate-card__stage,
  .kit-detail-row__title {
    width: auto;
  }

  .kit-modal__footer-actions {
    margin-left: 0;
  }
}
</style>
