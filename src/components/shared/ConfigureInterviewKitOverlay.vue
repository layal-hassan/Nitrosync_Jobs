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

const emit = defineEmits(['close', 'view-kit', 'keep-current', 'apply-fixes'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const evaluationAreas = [
  { label: 'Product Thinking', tone: 'violet' },
  { label: 'UX Process', tone: 'blue' },
  { label: 'Communication', tone: 'green' },
  { label: 'Design Systems', tone: 'teal' },
  { label: 'Leadership', tone: 'orange' },
  { label: 'Stakeholder Management', tone: 'orange' },
]

const candidateContext = [
  '6+ years experience',
  'Strong in design systems, product thinking',
  'Leadership experience mentioned',
  'Cross-functional collaboration in finance domain',
]

const coverageItems = [
  { label: 'Product Thinking', status: 'Covered', tone: 'green' },
  { label: 'UX Process', status: 'Covered', tone: 'green' },
  { label: 'Communication', status: 'Covered', tone: 'green' },
  { label: 'Design Systems', status: 'Covered', tone: 'green' },
  { label: 'Leadership', status: 'Not Enough', tone: 'orange' },
  { label: 'Stakeholder Management', status: 'Partially Covered', tone: 'orange' },
]

const recommendationItems = [
  {
    title: 'Leadership',
    tone: 'orange',
    badge: 'Not Enough Coverage',
    copy: 'Add questions to better evaluate leadership and people impact.',
    link: '+ Add 2 Leadership Questions',
  },
  {
    title: 'Stakeholder Management',
    tone: 'orange',
    badge: 'Partially Covered',
    copy: 'Add a scenario question to assess stakeholder influence and alignment.',
    link: '+ Add 1 Scenario Question',
  },
]

const updatedItems = [
  'Interview Kit Questions',
  'Scorecard Criteria',
  'Interviewer Responsibilities',
  'Interview Briefs',
]

const previewChanges = [
  { delta: '+2', label: 'New Questions', tone: 'pink' },
  { delta: '+1', label: 'Updated Scorecard Criteria', tone: 'pink' },
  { delta: '0', label: 'New Interviewers Needed', tone: 'slate' },
]

const interviewerCards = [
  { name: 'Emma Wilson', role: 'Hiring Manager', badge: 'HM', chips: ['Product Thinking', 'Leadership'], tone: 'sand' },
  { name: 'Michael Chen', role: 'Design Lead', badge: '', chips: ['UX Process', 'Design Systems'], tone: 'ink' },
  { name: 'David Park', role: 'Principal Designer', badge: '', chips: ['Design Systems', 'Portfolio Review'], tone: 'slate' },
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
    <div v-if="open" class="configure-kit-overlay" @click.self="closeOverlay">
      <section class="configure-kit-modal">
        <header class="configure-kit-modal__header">
          <div class="configure-kit-modal__title">
            <span class="configure-kit-modal__title-icon">
              <AppIcon name="user" :size="20" />
            </span>
            <div>
              <h2>Configure Interview Kit</h2>
              <p>AI is reviewing your assigned kit and suggesting improvements.</p>
            </div>
          </div>

          <button class="configure-kit-modal__close" type="button" aria-label="Close configure interview kit" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="configure-kit-modal__body">
          <aside class="configure-kit-sidebar">
            <section class="configure-kit-block">
              <div class="configure-kit-block__head">
                <h3>Job &amp; Requirements</h3>
                <button type="button">Edit</button>
              </div>

              <article class="configure-kit-role-card">
                <span><AppIcon name="briefcase" :size="18" /></span>
                <div>
                  <strong>{{ candidateRole }}</strong>
                  <p>New York, NY (Hybrid)</p>
                </div>
              </article>
            </section>

            <section class="configure-kit-block">
              <div class="configure-kit-block__head">
                <h3>Required Evaluation Areas</h3>
                <button type="button">Edit</button>
              </div>

              <div class="configure-kit-areas">
                <article v-for="item in evaluationAreas" :key="item.label">
                  <div>
                    <AppIcon :name="item.tone === 'orange' ? 'alert' : 'spark'" :size="14" />
                    <span>{{ item.label }}</span>
                  </div>
                  <em>Required</em>
                </article>
              </div>
            </section>

            <section class="configure-kit-block">
              <div class="configure-kit-block__head">
                <h3>Candidate Context</h3>
                <button type="button">Edit</button>
              </div>

              <div class="configure-kit-candidate">
                <div class="configure-kit-candidate__head">
                  <span>{{ candidateInitials }}</span>
                  <div>
                    <strong>{{ candidateName }}</strong>
                    <em>{{ candidateStage }}</em>
                  </div>
                </div>

                <ul>
                  <li v-for="item in candidateContext" :key="item">
                    <AppIcon name="check" :size="12" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </section>

            <section class="configure-kit-block">
              <div class="configure-kit-block__head">
                <h3>Interview Stage</h3>
                <button type="button">Edit</button>
              </div>

              <span class="configure-kit-stage-pill">{{ candidateStage }}</span>
            </section>
          </aside>

          <section class="configure-kit-main">
            <section class="configure-kit-summary">
              <div class="configure-kit-summary__head">
                <div class="configure-kit-summary__title">
                  <span><AppIcon name="briefcase" :size="22" /></span>
                  <div>
                    <h3>Senior Product Designer Kit</h3>
                    <p>Assigned 2 days ago • Used in 24 hires</p>
                  </div>
                  <em>Assigned</em>
                </div>

                <button type="button" @click="emit('view-kit')">
                  <AppIcon name="eye" :size="15" />
                  <span>View Kit</span>
                </button>
              </div>

              <div class="configure-kit-summary__stats">
                <article>
                  <strong>12</strong>
                  <span>Questions</span>
                </article>
                <article>
                  <strong>4</strong>
                  <span>Evaluation Areas</span>
                </article>
                <article>
                  <strong>3</strong>
                  <span>Interview Briefs</span>
                </article>
                <article>
                  <strong>2</strong>
                  <span>Scorecards</span>
                </article>
              </div>
            </section>

            <div class="configure-kit-grid">
              <section class="configure-kit-card">
                <div class="configure-kit-card__head">
                  <h3><AppIcon name="spark" :size="16" /> AI Coverage Review</h3>
                </div>

                <div class="configure-kit-coverage">
                  <div class="configure-kit-coverage__ring">
                    <div>
                      <strong>4 of 6</strong>
                      <span>Areas covered</span>
                    </div>
                  </div>

                  <div class="configure-kit-coverage__list">
                    <article v-for="item in coverageItems" :key="item.label" :class="`is-${item.tone}`">
                      <span>
                        <AppIcon :name="item.tone === 'orange' ? 'alert' : 'checkCircle'" :size="13" />
                        <b>{{ item.label }}</b>
                      </span>
                      <em>{{ item.status }}</em>
                    </article>
                  </div>
                </div>

                <div class="configure-kit-gap-note">
                  <span><AppIcon name="clock" :size="15" /></span>
                  <div>
                    <strong>2 gaps detected</strong>
                    <p>Your kit is missing complete coverage for all required areas.</p>
                  </div>
                </div>
              </section>

              <section class="configure-kit-card">
                <div class="configure-kit-card__head">
                  <h3><AppIcon name="spark" :size="16" /> AI Recommendations</h3>
                  <span>2 Improvements</span>
                </div>

                <div class="configure-kit-recommendations">
                  <article v-for="item in recommendationItems" :key="item.title">
                    <div class="configure-kit-recommendations__icon">
                      <AppIcon name="user" :size="16" />
                    </div>
                    <div class="configure-kit-recommendations__copy">
                      <div class="configure-kit-recommendations__title">
                        <strong>{{ item.title }}</strong>
                        <em>{{ item.badge }}</em>
                      </div>
                      <p>{{ item.copy }}</p>
                      <button type="button">{{ item.link }}</button>
                    </div>
                    <button class="configure-kit-recommendations__fix" type="button">Apply Fix</button>
                  </article>
                </div>

                <p class="configure-kit-recommendations__note">
                  Applying fixes will automatically update questions, scorecard and interviewer responsibilities.
                </p>
              </section>
            </div>

            <section class="configure-kit-team">
              <div class="configure-kit-team__head">
                <h3><AppIcon name="users" :size="18" /> Interviewer Responsibilities <span>(After Fixes)</span></h3>
              </div>

              <div class="configure-kit-team__grid">
                <article v-for="person in interviewerCards" :key="person.name">
                  <div class="configure-kit-team__identity">
                    <span :class="`tone-${person.tone}`">{{ person.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() }}</span>
                    <div>
                      <strong>{{ person.name }}</strong>
                      <p>{{ person.role }}</p>
                    </div>
                    <em v-if="person.badge">{{ person.badge }}</em>
                  </div>

                  <small>Evaluates</small>
                  <div class="configure-kit-team__chips">
                    <span v-for="chip in person.chips" :key="chip">{{ chip }}</span>
                  </div>
                </article>
              </div>
            </section>
          </section>

          <aside class="configure-kit-impact">
            <section class="configure-kit-impact__card">
              <div class="configure-kit-impact__head">
                <h3>Impact After Fixes</h3>
                <AppIcon name="info" :size="14" />
              </div>

              <div class="configure-kit-impact__coverage">
                <div class="configure-kit-impact__mini-ring">
                  <small>Current Coverage</small>
                  <strong>4 of 6</strong>
                </div>

                <span><AppIcon name="chevrons-right" :size="16" /></span>

                <div class="configure-kit-impact__mini-ring is-after">
                  <small>After Fixes</small>
                  <strong>6 of 6</strong>
                </div>
              </div>

              <div class="configure-kit-impact__success">
                Complete coverage across all required areas.
              </div>
            </section>

            <section class="configure-kit-impact__card">
              <h3>What will be updated</h3>
              <ul class="configure-kit-impact__list">
                <li v-for="item in updatedItems" :key="item">
                  <AppIcon name="checkCircle" :size="14" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </section>

            <section class="configure-kit-impact__card">
              <div class="configure-kit-impact__preview-head">
                <h3>Preview of Changes</h3>
                <button type="button">View Details</button>
              </div>

              <div class="configure-kit-impact__preview-list">
                <article v-for="item in previewChanges" :key="item.label">
                  <strong :class="`is-${item.tone}`">{{ item.delta }}</strong>
                  <span>{{ item.label }}</span>
                </article>
              </div>
            </section>
          </aside>
        </div>

        <footer class="configure-kit-modal__footer">
          <button class="configure-kit-reset" type="button">
            <AppIcon name="refresh" :size="15" />
            <div>
              <strong>Reset to AI recommended kit</strong>
              <span>Revert all changes back to the original AI recommended kit.</span>
            </div>
          </button>

          <div class="configure-kit-modal__actions">
            <button class="configure-kit-button configure-kit-button--ghost" type="button" @click="emit('keep-current')">Keep Current Kit</button>
            <button class="configure-kit-button configure-kit-button--primary" type="button" @click="emit('apply-fixes')">
              <AppIcon name="spark" :size="14" />
              <span>Apply Fixes (2)</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.configure-kit-overlay,
.configure-kit-overlay *,
.configure-kit-overlay *::before,
.configure-kit-overlay *::after {
  box-sizing: border-box;
}

.configure-kit-overlay button {
  font: inherit;
}

.configure-kit-overlay {
  position: fixed;
  inset: 0;
  z-index: 1510;
  padding: 18px;
  display: grid;
  place-items: center;
  background: rgba(12, 18, 31, 0.52);
  backdrop-filter: blur(8px);
}

.configure-kit-modal {
  width: min(1480px, 100%);
  max-height: calc(100vh - 36px);
  overflow: auto;
  border: 1px solid #dfe7f3;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 34px 80px rgba(15, 23, 42, 0.2);
}

.configure-kit-modal__header,
.configure-kit-modal__title,
.configure-kit-block__head,
.configure-kit-role-card,
.configure-kit-candidate__head,
.configure-kit-candidate ul li,
.configure-kit-summary__head,
.configure-kit-summary__title,
.configure-kit-summary__stats,
.configure-kit-card__head,
.configure-kit-coverage,
.configure-kit-coverage__list article,
.configure-kit-gap-note,
.configure-kit-recommendations article,
.configure-kit-recommendations__title,
.configure-kit-team__identity,
.configure-kit-impact__head,
.configure-kit-impact__coverage,
.configure-kit-impact__list li,
.configure-kit-impact__preview-head,
.configure-kit-impact__preview-list article,
.configure-kit-modal__footer,
.configure-kit-reset,
.configure-kit-modal__actions {
  display: flex;
  align-items: center;
}

.configure-kit-modal__header,
.configure-kit-block__head,
.configure-kit-summary__head,
.configure-kit-card__head,
.configure-kit-impact__preview-head,
.configure-kit-modal__footer {
  justify-content: space-between;
}

.configure-kit-modal__header {
  gap: 18px;
  padding: 16px 22px;
  border-bottom: 1px solid #e7edf6;
}

.configure-kit-modal__title {
  gap: 16px;
}

.configure-kit-modal__title-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(180deg, #fd72b7 0%, #ea4d9a 100%);
}

.configure-kit-modal__title h2,
.configure-kit-block__head h3,
.configure-kit-summary__title h3,
.configure-kit-card__head h3,
.configure-kit-impact__card h3 {
  margin: 0;
  color: #1d2943;
}

.configure-kit-modal__title h2 {
  font-size: 17px;
}

.configure-kit-modal__title p,
.configure-kit-role-card p,
.configure-kit-summary__title p,
.configure-kit-gap-note p,
.configure-kit-recommendations__copy p,
.configure-kit-reset span {
  margin: 4px 0 0;
  color: #70809a;
  font-size: 13px;
  line-height: 1.6;
}

.configure-kit-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #97a2b4;
  background: transparent;
}

.configure-kit-modal__body {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr) 292px;
  min-height: 0;
}

.configure-kit-sidebar,
.configure-kit-main,
.configure-kit-impact {
  min-width: 0;
  padding: 24px;
  display: grid;
  align-content: start;
  gap: 24px;
}

.configure-kit-sidebar {
  border-right: 1px solid #e7edf6;
}

.configure-kit-impact {
  border-left: 1px solid #e7edf6;
}

.configure-kit-block,
.configure-kit-summary,
.configure-kit-card,
.configure-kit-team,
.configure-kit-impact__card {
  border: 1px solid #e4ebf5;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
}

.configure-kit-block {
  padding: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.configure-kit-block__head {
  margin-bottom: 14px;
}

.configure-kit-block__head h3 {
  font-size: 15px;
}

.configure-kit-block__head button,
.configure-kit-impact__preview-head button {
  border: 0;
  padding: 0;
  color: #ff63ad;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.configure-kit-role-card {
  gap: 14px;
  padding: 16px;
  border: 1px solid #ebeff5;
  border-radius: 16px;
}

.configure-kit-role-card > span {
  width: 48px;
  height: 48px;
  border: 1px solid #e7edf6;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #ff63ad;
  background: #fff8fc;
}

.configure-kit-role-card strong,
.configure-kit-candidate__head strong,
.configure-kit-summary__title h3 {
  display: block;
  color: #1f2b45;
}

.configure-kit-role-card strong {
  font-size: 16px;
}

.configure-kit-areas {
  display: grid;
  gap: 14px;
}

.configure-kit-areas article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.configure-kit-areas article > div {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #25314a;
  font-size: 14px;
}

.configure-kit-areas article em {
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid #bdeccf;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  color: #169957;
  background: #effcf4;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
}

.configure-kit-candidate {
  display: grid;
  gap: 14px;
}

.configure-kit-candidate__head {
  gap: 12px;
}

.configure-kit-candidate__head > span,
.configure-kit-team__identity > span {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  background: linear-gradient(135deg, #f1b27b 0%, #d55c75 42%, #8e5066 100%);
}

.configure-kit-candidate__head em {
  margin-top: 6px;
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 999px;
  color: #ef5da8;
  background: #fff0f6;
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
}

.configure-kit-candidate ul,
.configure-kit-impact__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.configure-kit-candidate ul li,
.configure-kit-impact__list li {
  gap: 8px;
  color: #5d6a82;
  font-size: 14px;
}

.configure-kit-stage-pill {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #546277;
  background: #f4f6fa;
  font-size: 13px;
  font-weight: 700;
}

.configure-kit-summary,
.configure-kit-card,
.configure-kit-team,
.configure-kit-impact__card {
  padding: 22px 24px;
}

.configure-kit-summary__title {
  gap: 14px;
}

.configure-kit-summary__title > span {
  width: 46px;
  height: 46px;
  border: 1px solid #e7edf6;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
  color: #9aa5b8;
  background: #fff;
}

.configure-kit-summary__title h3 {
  font-size: 20px;
}

.configure-kit-summary__title em {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #eafaf0;
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.configure-kit-summary__head button {
  min-height: 40px;
  padding: 0 18px;
  border: 1px solid #ff9bc8;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ff5aa7;
  background: #fff;
  font-weight: 800;
}

.configure-kit-summary__stats {
  margin-top: 22px;
  align-items: stretch;
}

.configure-kit-summary__stats article {
  flex: 1;
  padding: 0 18px;
  border-right: 1px solid #eef2f7;
  display: grid;
  justify-items: center;
  gap: 6px;
}

.configure-kit-summary__stats article:last-child {
  border-right: 0;
}

.configure-kit-summary__stats strong {
  color: #1f2b45;
  font-size: 18px;
}

.configure-kit-summary__stats span {
  color: #98a3b5;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.configure-kit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.configure-kit-card__head h3 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.configure-kit-card__head > span {
  min-height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  color: #a855f7;
  background: #f5edff;
  font-size: 11px;
  font-weight: 800;
}

.configure-kit-coverage {
  gap: 26px;
  align-items: flex-start;
  margin-top: 20px;
}

.configure-kit-coverage__ring {
  width: 126px;
  height: 126px;
  flex: 0 0 126px;
  border-radius: 50%;
  padding: 10px;
  background: conic-gradient(from -30deg, #ef63ad 0deg 240deg, #f8dbe8 240deg 360deg);
}

.configure-kit-coverage__ring > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
  text-align: center;
}

.configure-kit-coverage__ring strong {
  color: #25314a;
  font-size: 18px;
}

.configure-kit-coverage__ring span {
  max-width: 72px;
  color: #97a2b4;
  font-size: 11px;
  line-height: 1.35;
}

.configure-kit-coverage__list {
  flex: 1;
  display: grid;
  gap: 12px;
}

.configure-kit-coverage__list article {
  justify-content: space-between;
  gap: 12px;
}

.configure-kit-coverage__list article span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.configure-kit-coverage__list article b {
  color: #25314a;
  font-size: 14px;
}

.configure-kit-coverage__list article em {
  min-height: 26px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
}

.configure-kit-coverage__list article.is-green em {
  color: #169957;
  background: #eefcf4;
}

.configure-kit-coverage__list article.is-orange em {
  color: #f97316;
  background: #fff3e8;
}

.configure-kit-gap-note {
  gap: 12px;
  margin-top: 22px;
  padding: 16px;
  border: 1px solid #cfe0ff;
  border-radius: 12px;
  background: #f7fbff;
}

.configure-kit-gap-note span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
  color: #3b82f6;
  background: #fff;
}

.configure-kit-gap-note strong {
  display: block;
  color: #25314a;
  font-size: 14px;
}

.configure-kit-recommendations {
  margin-top: 18px;
  display: grid;
  gap: 18px;
}

.configure-kit-recommendations article {
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #eef2f7;
  border-radius: 14px;
}

.configure-kit-recommendations__icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-grid;
  place-items: center;
  color: #f97316;
  background: #fff4eb;
}

.configure-kit-recommendations__copy {
  flex: 1;
  min-width: 0;
}

.configure-kit-recommendations__title {
  gap: 10px;
  flex-wrap: wrap;
}

.configure-kit-recommendations__title strong {
  color: #25314a;
  font-size: 16px;
}

.configure-kit-recommendations__title em {
  min-height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  color: #f97316;
  background: #fff3e8;
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
}

.configure-kit-recommendations__copy p {
  font-size: 13px;
}

.configure-kit-recommendations__copy button {
  border: 0;
  padding: 0;
  color: #ff63ad;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.configure-kit-recommendations__fix {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  color: #435166;
  background: #fff;
  font-weight: 800;
}

.configure-kit-recommendations__note {
  margin: 16px 0 0;
  color: #a855f7;
  font-size: 12px;
  line-height: 1.6;
}

.configure-kit-team__head h3 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #1f2b45;
  font-size: 16px;
}

.configure-kit-team__head h3 span {
  color: #98a3b5;
  font-weight: 500;
}

.configure-kit-team__grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.configure-kit-team__grid article {
  padding: 0 10px 0 0;
  border-right: 1px solid #eef2f7;
}

.configure-kit-team__grid article:last-child {
  border-right: 0;
}

.configure-kit-team__identity {
  gap: 12px;
  align-items: flex-start;
}

.configure-kit-team__identity > span.tone-sand {
  background: linear-gradient(135deg, #f6dcc6 0%, #d59a88 100%);
}

.configure-kit-team__identity > span.tone-ink {
  background: linear-gradient(135deg, #17253c 0%, #51657f 100%);
}

.configure-kit-team__identity > span.tone-slate {
  background: linear-gradient(135deg, #29303b 0%, #77796d 100%);
}

.configure-kit-team__identity strong {
  display: block;
  color: #1f2b45;
  font-size: 15px;
}

.configure-kit-team__identity p {
  margin: 4px 0 0;
  color: #97a2b4;
  font-size: 13px;
}

.configure-kit-team__identity em {
  padding: 4px 7px;
  border-radius: 8px;
  background: #fff0f7;
  color: #ef5da8;
  font-size: 10px;
  font-style: normal;
  font-weight: 800;
}

.configure-kit-team__grid article > small {
  display: block;
  margin-top: 16px;
  color: #9aa5b8;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.configure-kit-team__chips {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.configure-kit-team__chips span {
  padding: 5px 9px;
  border-radius: 8px;
  background: #f2f5ff;
  color: #445166;
  font-size: 11px;
  font-weight: 700;
}

.configure-kit-impact__head {
  gap: 8px;
}

.configure-kit-impact__coverage {
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
}

.configure-kit-impact__mini-ring {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  border: 4px solid #f1d8e6;
  display: grid;
  place-items: center;
  text-align: center;
}

.configure-kit-impact__mini-ring strong {
  display: block;
  color: #25314a;
  font-size: 14px;
}

.configure-kit-impact__mini-ring small {
  display: block;
  color: #9aa5b8;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}

.configure-kit-impact__mini-ring.is-after {
  border-color: #ef63ad;
}

.configure-kit-impact__success {
  margin-top: 18px;
  padding: 14px 12px;
  border-radius: 12px;
  color: #169957;
  background: #eafaf0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
}

.configure-kit-impact__list {
  margin-top: 18px;
}

.configure-kit-impact__list .app-icon {
  color: #22c55e;
}

.configure-kit-impact__preview-list {
  margin-top: 16px;
  display: grid;
  gap: 14px;
}

.configure-kit-impact__preview-list article {
  gap: 10px;
}

.configure-kit-impact__preview-list strong {
  width: 28px;
  flex: 0 0 28px;
  font-size: 18px;
}

.configure-kit-impact__preview-list strong.is-pink {
  color: #ff63ad;
}

.configure-kit-impact__preview-list strong.is-slate {
  color: #94a3b8;
}

.configure-kit-impact__preview-list span {
  color: #5d6a82;
  font-size: 14px;
}

.configure-kit-modal__footer {
  gap: 16px;
  padding: 18px 22px;
  border-top: 1px solid #e7edf6;
}

.configure-kit-reset {
  gap: 12px;
  border: 0;
  padding: 0;
  color: #506078;
  background: transparent;
}

.configure-kit-reset strong {
  display: block;
  color: #47556d;
  font-size: 14px;
  text-align: left;
}

.configure-kit-modal__actions {
  gap: 14px;
  margin-left: auto;
}

.configure-kit-button {
  min-height: 50px;
  padding: 0 24px;
  border: 1px solid transparent;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 800;
}

.configure-kit-button--ghost {
  color: #3f4d64;
  border-color: #dce4ef;
  background: #fff;
}

.configure-kit-button--primary {
  color: #fff;
  background: linear-gradient(180deg, #f06bae 0%, #ea56a4 100%);
  box-shadow: 0 16px 28px rgba(236, 94, 166, 0.24);
}

@media (max-width: 1320px) {
  .configure-kit-modal__body {
    grid-template-columns: 280px minmax(0, 1fr);
  }

  .configure-kit-impact {
    grid-column: 1 / -1;
    border-left: 0;
    border-top: 1px solid #e7edf6;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1080px) {
  .configure-kit-modal__body,
  .configure-kit-grid,
  .configure-kit-team__grid,
  .configure-kit-impact {
    grid-template-columns: 1fr;
  }

  .configure-kit-sidebar,
  .configure-kit-main {
    border-right: 0;
    border-bottom: 1px solid #e7edf6;
  }

  .configure-kit-team__grid article {
    border-right: 0;
    padding-right: 0;
  }
}

@media (max-width: 760px) {
  .configure-kit-overlay {
    padding: 10px;
  }

  .configure-kit-modal {
    max-height: calc(100vh - 20px);
  }

  .configure-kit-modal__footer,
  .configure-kit-modal__actions {
    display: grid;
  }

  .configure-kit-modal__actions {
    margin-left: 0;
  }
}
</style>
