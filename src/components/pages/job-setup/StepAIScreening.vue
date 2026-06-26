<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const screeningModes = [
  { title: 'Manual', note: 'Recruiters review and decide everything.' },
  { title: 'AI Assisted', note: 'AI recommends, recruiters approve.', active: true },
  { title: 'Fully Automated', note: 'AI qualifies and routes candidates.' },
]

const flowSteps = [
  'CV Received',
  'Resume Parsing',
  'Persona Match',
  'Requirements Check',
  'Qualification Score',
  'Pipeline Recommendation',
  'Recruiter Approval',
]

const scoreBreakdown = [
  ['Skills Match', 95],
  ['Experience Match', 90],
  ['Persona Match', 88],
  ['Education Match', 85],
  ['Culture Add', 82],
]

const evidence = [
  ['IFRS Reporting', 'High Match'],
  ['Financial Analysis', 'High Match'],
  ['SAP / ERP Experience', 'High Match'],
  ['Stakeholder Management', 'Medium Match'],
  ['Leadership Potential', 'Medium Match'],
]

const screeningRules = [
  ['Required Skills', 'Required'],
  ['Minimum Experience', 'Required'],
  ['Work Authorization', 'Required'],
  ['Education & Certifications', 'Required'],
  ['Application Answers', 'Optional'],
  ['Deal Breakers', 'Required'],
  ['Nice-to-Have Qualifications', 'Optional'],
]

const nitroGenerates = [
  'Candidate Summary',
  'Requirement Match Analysis',
  'Evidence Extraction',
  'Missing Information Detection',
  'Interview Focus Areas',
  'Stage Recommendation',
]

const communications = [
  'Application Confirmation',
  'Under Review Update',
  'Interview Invitation',
  'Validation Request',
  'Rejection Email',
  'Hired Confirmation',
  'General Notifications',
]

const thresholds = [
  ['90% and above', 'Strong Match', 'Auto-move to Qualified', 'green'],
  ['75% - 89%', 'Qualified', 'Recruiter Review', 'blue'],
  ['60% - 74%', 'Needs Review', 'Manual Review', 'yellow'],
  ['Below 60%', 'Not Qualified', 'Do Not Move', 'red'],
]

const routingRules = [
  ['Qualification Score > 90%', 'Move to Qualified', 'green'],
  ['Score 75% – 89%', 'Move to Recruiter Review', 'blue'],
  ['Missing Work Authorization', 'Flag for Review', 'orange'],
  ['Deal Breaker Found', 'Reject Application', 'red'],
]
</script>

<template>
  <section class="screening-step">
    <div class="screening-step__main">
      <section class="screening-hero">
        <div class="screening-hero__copy">
          <h2>
            5 AI Screening &amp; Candidate Qualification
            <span class="hero-ai-badge">AI</span>
          </h2>
          <p>Review how Nitro will score, qualify, and route candidates before they move into your hiring pipeline.</p>
        </div>
        <div class="screening-hero__actions">
          <button class="ghost-button" type="button">How it works</button>
          <button class="soft-button" type="button">
            <AppIcon name="spark" :size="14" />
            Auto-configured by AI
          </button>
        </div>
      </section>

      <section class="mode-strip panel">
        <div class="mode-strip__head">
          <strong>Screening Mode</strong>
          <span>Choose how much Nitro should decide automatically versus what remains with recruiters.</span>
        </div>
        <div class="mode-grid">
          <button
            v-for="item in screeningModes"
            :key="item.title"
            class="mode-card"
            :class="{ 'is-active': item.active }"
            type="button"
          >
            <span class="mode-card__radio" :class="{ 'is-active': item.active }" />
            <div>
              <strong>{{ item.title }}</strong>
              <span>{{ item.note }}</span>
            </div>
          </button>
        </div>
      </section>

      <section class="qualification-card panel">
        <div class="qualification-card__head">
          <strong>Candidate Qualification Flow</strong>
          <span>This is how every candidate is evaluated and routed.</span>
        </div>

        <div class="qualification-flow">
          <div class="qualification-flow__track">
            <template v-for="(item, index) in flowSteps" :key="item">
              <div class="flow-step" :class="{ 'is-highlight': item === 'Qualification Score', 'is-success': item === 'Recruiter Approval' }">
                <div class="flow-step__icon">
                  <AppIcon :name="item === 'Qualification Score' ? 'star' : item === 'Recruiter Approval' ? 'user' : 'document'" :size="16" />
                </div>
                <strong>{{ item }}</strong>
              </div>
              <span v-if="index < flowSteps.length - 1" class="flow-arrow">
                <AppIcon name="chevronRight" :size="13" />
              </span>
            </template>
          </div>

          <aside class="approval-preview">
            <div class="approval-preview__candidate">
              <div class="approval-preview__avatar">AS</div>
              <div class="approval-preview__identity">
                <strong>Anna Svensson</strong>
                <span>anna.svensson@email.com</span>
              </div>
            </div>
            <div class="approval-preview__stats">
              <div class="approval-preview__row">
                <span>Qualification Score</span>
                <strong class="approval-preview__score">92%</strong>
              </div>
              <div class="approval-preview__row">
                <span>Recommended Stage</span>
                <strong class="approval-preview__pill">Qualified</strong>
              </div>
              <div class="approval-preview__row">
                <span>Confidence</span>
                <strong class="approval-preview__confidence">
                  High
                  <AppIcon name="checkCircle" :size="11" />
                </strong>
              </div>
            </div>
            <button class="approve-button" type="button">
              <AppIcon name="check" :size="12" />
              Approve &amp; Move
            </button>
            <button class="ghost-button ghost-button--full ghost-button--preview" type="button">
              <AppIcon name="eye" :size="12" />
              Override
            </button>
            <button class="link-button link-button--preview" type="button">
              <AppIcon name="chart-bars" :size="12" />
              View AI Reasoning
            </button>
          </aside>
        </div>
      </section>

      <div class="screening-grid screening-grid--three">
        <section class="config-card panel">
          <div class="config-card__head"><strong>1 Screening Rules</strong><span>Rules are generated from your role setup.</span></div>
          <div class="list-table">
            <article v-for="[label, state] in screeningRules" :key="label" class="list-table__row">
              <span>{{ label }}</span>
              <strong :class="{ 'is-optional': state === 'Optional' }">{{ state }}</strong>
            </article>
          </div>
          <button class="outline-button" type="button">+ Add Rule</button>
        </section>

        <section class="config-card panel">
          <div class="config-card__head"><strong>2 What Nitro Will Generate</strong><span>For every candidate, Nitro will create.</span></div>
          <div class="list-table list-table--stacked">
            <article v-for="item in nitroGenerates" :key="item" class="list-table__row">
              <span>{{ item }}</span>
            </article>
          </div>
        </section>

        <section class="config-card panel">
          <div class="config-card__head"><strong>3 Candidate Communication</strong><span>Nitro will send the right messages automatically.</span></div>
          <div class="list-table list-table--stacked">
            <article v-for="item in communications" :key="item" class="list-table__row">
              <span>{{ item }}</span>
              <span class="toggle is-active" />
            </article>
          </div>
          <button class="link-button link-button--bottom" type="button">Customize Emails</button>
        </section>
      </div>

      <div class="screening-grid screening-grid--two">
        <section class="config-card panel">
          <div class="config-card__head"><strong>4 Qualification Thresholds</strong><span>Define how scores translate to actions.</span></div>
          <div class="threshold-list">
            <article v-for="[label, state, action, tone] in thresholds" :key="label" class="threshold-row">
              <span class="threshold-row__dot" :class="`tone-${tone}`" />
              <strong>{{ label }}</strong>
              <span>{{ state }}</span>
              <em :class="`tone-${tone}`">{{ action }}</em>
            </article>
          </div>
          <button class="outline-button outline-button--pink" type="button">Optimize Thresholds with AI</button>
        </section>

        <section class="config-card panel">
          <div class="config-card__head"><strong>5 Candidate Routing Rules</strong><span>Decide where candidates go based on score and conditions.</span></div>
          <div class="threshold-list">
            <article v-for="[rule, action, tone] in routingRules" :key="rule" class="threshold-row">
              <span class="threshold-row__dot" :class="`tone-${tone}`" />
              <strong>{{ rule }}</strong>
              <em :class="`tone-${tone}`">{{ action }}</em>
            </article>
          </div>
          <button class="outline-button" type="button">+ Add Routing Rule</button>
        </section>
      </div>
    </div>

    <aside class="screening-side panel">
      <div class="screening-side__head">
        <strong>AI Decision Preview</strong>
        <span>Live Example</span>
      </div>

      <section class="screening-side__candidate">
        <div class="screening-side__avatar">AS</div>
        <div>
          <strong>Anna Svensson</strong>
          <small>Senior Accountant</small>
        </div>
        <div class="score-pill">92%</div>
      </section>

      <div class="section-label">Score Breakdown</div>
      <div class="score-breakdown">
        <div v-for="[label, value] in scoreBreakdown" :key="label" class="score-breakdown__row">
          <div class="score-breakdown__top">
            <span>{{ label }}</span>
            <strong>{{ value }}%</strong>
          </div>
          <div class="score-breakdown__bar"><span :style="{ width: `${value}%` }" /></div>
        </div>
      </div>

      <div class="risk-row">
        <span>Risk Factors</span>
        <strong>
          Low
          <AppIcon name="checkCircle" :size="12" />
        </strong>
      </div>

      <div class="section-label">Evidence Found</div>
      <div class="evidence-list">
        <article v-for="[label, state] in evidence" :key="label" class="evidence-item">
          <span class="evidence-item__dot" />
          <strong>{{ label }}</strong>
          <small :class="{ 'is-medium': state === 'Medium Match' }">{{ state }}</small>
        </article>
      </div>

      <div class="reasoning-card">
        <strong>AI Reasoning</strong>
        <p>Strong match on core accounting skills and IFRS experience. Demonstrates relevant ERP expertise and stakeholder communication.</p>
        <button type="button">View Full Reasoning</button>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.screening-step {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 348px;
  gap: 20px;
  align-items: start;
}

.screening-step__main {
  display: grid;
  gap: 18px;
}

.screening-hero__copy {
  display: grid;
  gap: 12px;
  max-width: 760px;
}

.panel {
  border: 1px solid #e7edf7;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.05);
}

.screening-hero,
.screening-hero__actions,
.mode-grid,
.mode-card,
.qualification-flow,
.qualification-flow__track,
.approval-preview__candidate,
.approval-preview__row,
.list-table__row,
.score-breakdown__top,
.screening-side__candidate,
.evidence-item {
  display: flex;
  align-items: center;
}

.screening-hero {
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
}

.screening-hero h2 {
  margin: 0;
  color: #18233f;
  font-size: 28px;
  line-height: 1.14;
  letter-spacing: -0.03em;
}

.screening-hero p {
  margin: 0;
  color: #72819a;
  font-size: 15px;
  line-height: 1.65;
}

.hero-ai-badge {
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 999px;
  color: #ef4fa0;
  background: #fff0f7;
  font-size: 10px;
  font-weight: 700;
}

.screening-hero__actions {
  gap: 10px;
  flex-wrap: wrap;
}

.ghost-button,
.soft-button,
.approve-button,
.outline-button,
.link-button,
.advisor-button {
  border: 1px solid #dfe6f1;
  background: #fff;
}

.ghost-button,
.soft-button {
  height: 48px;
  padding: 0 18px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #31415f;
  font-size: 14px;
  font-weight: 700;
}

.soft-button {
  color: #ef4fa0;
  background: linear-gradient(180deg, #fff3f9 0%, #fff0f7 100%);
  border-color: #f9d7e8;
}

.mode-strip,
.qualification-card,
.config-card,
.screening-side {
  padding: 22px;
}

.mode-strip {
  display: grid;
  grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.mode-strip__head {
  display: grid;
  gap: 6px;
}

.mode-strip__head > strong,
.qualification-card__head strong,
.config-card__head strong,
.screening-side strong,
.approval-preview strong,
.reasoning-card strong {
  color: #1f2a44;
  font-size: 18px;
}

.mode-strip__head span {
  color: #8b97ad;
  font-size: 12px;
  line-height: 1.5;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.mode-card {
  min-height: 92px;
  padding: 16px;
  border: 1px solid #e2e8f2;
  border-radius: 18px;
  gap: 12px;
  background: #fff;
  align-items: flex-start;
}

.mode-card.is-active {
  border-color: #ef4fa0;
  box-shadow: inset 0 0 0 1px rgba(239, 79, 160, 0.14), 0 14px 26px rgba(239, 79, 160, 0.08);
}

.mode-card__radio {
  width: 16px;
  height: 16px;
  border: 1px solid #cad3e1;
  border-radius: 50%;
}

.mode-card__radio.is-active {
  border-color: #ef4fa0;
  box-shadow: inset 0 0 0 4px #ef4fa0;
}

.mode-card strong {
  display: block;
  margin-bottom: 6px;
  font-size: 15px;
}

.mode-card span,
.qualification-card__head span,
.config-card__head span,
.screening-side__head span,
.section-label,
.reasoning-card p,
.approval-preview span,
.screening-side small,
.score-breakdown__top span,
.list-table__row span,
.threshold-row span,
.threshold-row em {
  color: #8b97ad;
  font-size: 12px;
  line-height: 1.45;
}

.qualification-card__head,
.config-card__head {
  display: grid;
  gap: 6px;
  margin-bottom: 20px;
}

.qualification-flow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: center;
  gap: 20px;
}

.qualification-flow__track {
  flex-wrap: wrap;
  gap: 12px;
  min-height: 0;
  align-content: flex-start;
}

.flow-step {
  width: 92px;
  display: grid;
  justify-items: center;
  gap: 9px;
  text-align: center;
}

.flow-step__icon {
  width: 44px;
  height: 44px;
  border: 1px solid #e6ebf3;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #91a0b7;
  background: #fbfcfe;
}

.flow-step.is-highlight .flow-step__icon {
  color: #ef4fa0;
  border-color: #f4b4d6;
  background: #fff5fa;
}

.flow-step.is-success .flow-step__icon {
  color: #22b661;
  border-color: #5bd48d;
  background: #f4fff7;
}

.flow-step strong {
  color: #31415d;
  font-size: 11px;
  line-height: 1.45;
}

.flow-arrow {
  color: #cad3e1;
  align-self: center;
}

.approval-preview {
  width: 100%;
  padding: 16px;
  border: 1px solid #e6ebf3;
  border-radius: 20px;
  display: grid;
  gap: 14px;
  background: #fff;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.approval-preview__avatar,
.screening-side__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5a4df5;
  background: linear-gradient(180deg, #eef2ff 0%, #e8eeff 100%);
  font-size: 18px;
  font-weight: 800;
}

.approval-preview__candidate {
  gap: 14px;
  min-width: 0;
  padding-bottom: 2px;
}

.approval-preview__identity {
  min-width: 0;
}

.approval-preview__identity strong,
.approval-preview__identity span {
  display: block;
}

.approval-preview__identity strong {
  font-size: 14px;
  line-height: 1.2;
}

.approval-preview__identity span {
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.approval-preview__stats {
  display: grid;
  gap: 12px;
}

.approval-preview__row {
  justify-content: space-between;
  gap: 16px;
  min-height: 28px;
}

.approval-preview__row > span {
  color: #8290a7;
  font-size: 11px;
}

.approval-preview__score {
  color: #22b661;
  font-size: 14px;
}

.approval-preview__pill {
  width: fit-content;
  padding: 4px 9px;
  border-radius: 9px;
  color: #9a59f6;
  background: #f4eaff;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1;
}

.approval-preview__confidence {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #22b661;
  font-size: 11px;
}

.approve-button {
  width: 100%;
  height: 42px;
  border: 0;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(135deg, #5a4df5 0%, #4f45e8 100%);
}

.ghost-button--full {
  width: 100%;
}

.ghost-button--preview {
  width: 100%;
  height: 40px;
  border-radius: 12px;
  justify-content: center;
  color: #4f5d77;
  font-size: 12px;
  font-weight: 600;
  background: #fff;
}

.link-button {
  height: 36px;
  border: 0;
  color: #5d5ff2;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.link-button--preview {
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #6366f1;
  font-size: 12px;
  font-weight: 700;
}

.screening-grid {
  display: grid;
  gap: 18px;
  align-items: start;
}

.screening-grid--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.screening-grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.list-table,
.threshold-list,
.score-breakdown,
.evidence-list {
  display: grid;
  gap: 12px;
}

.list-table__row {
  justify-content: space-between;
  gap: 12px;
  min-height: 34px;
  padding: 6px 0;
}

.list-table__row strong {
  color: #22b661;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  flex-shrink: 0;
}

.list-table__row strong.is-optional {
  color: #b0baca;
}

.list-table--stacked .list-table__row {
  min-height: 0;
  padding: 8px 0;
  border-bottom: 1px solid #eff3f8;
}

.list-table--stacked .list-table__row:last-child {
  border-bottom: 0;
}

.outline-button {
  width: 100%;
  height: 42px;
  margin-top: 16px;
  border-style: dashed;
  border-radius: 12px;
  color: #ef4fa0;
  font-size: 13px;
  font-weight: 700;
}

.outline-button--pink {
  color: #f04f9d;
  background: #fff8fc;
}

.threshold-row {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto auto;
  gap: 12px;
  align-items: center;
  padding: 6px 0;
}

.threshold-row__dot,
.evidence-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.threshold-row strong,
.evidence-item strong {
  color: #2f3f5b;
  font-size: 13px;
}

.threshold-row span {
  color: #7f8ca2;
  font-size: 12px;
}

.threshold-row em {
  padding: 5px 9px;
  border-radius: 8px;
  font-style: normal;
  font-weight: 700;
  line-height: 1;
  background: transparent;
}

.threshold-row__dot.tone-green { color: #22b661; }
.threshold-row__dot.tone-blue { color: #4f6ef6; }
.threshold-row__dot.tone-yellow { color: #f3b61f; }
.threshold-row__dot.tone-red { color: #ef5668; }
.threshold-row__dot.tone-orange { color: #f28b34; }

.threshold-row em.tone-green {
  color: #22b661;
  background: #eafbf0;
}

.threshold-row em.tone-blue {
  color: #4f6ef6;
  background: #edf2ff;
}

.threshold-row em.tone-yellow {
  color: #d59b12;
  background: #fff6dc;
}

.threshold-row em.tone-red {
  color: #ef5668;
  background: #fff0f3;
}

.threshold-row em.tone-orange {
  color: #f28b34;
  background: #fff3e8;
}

.screening-side {
  align-self: start;
  position: sticky;
  top: 12px;
  padding: 18px;
}

.screening-side__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.screening-side__head span {
  color: #22b661;
  font-size: 11px;
  font-weight: 700;
}

.screening-side__candidate {
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 14px;
  background: #f8fbff;
  min-width: 0;
}

.screening-side__candidate strong {
  display: block;
  font-size: 13px;
  line-height: 1.25;
}

.screening-side__candidate > div:nth-child(2) {
  min-width: 0;
}

.screening-side__candidate small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 1.35;
}

.score-pill {
  width: 42px;
  height: 42px;
  margin-left: auto;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #22b661;
  font-size: 11px;
  font-weight: 800;
  border: 3px solid currentColor;
}

.section-label {
  margin-bottom: 10px;
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.score-breakdown {
  gap: 12px;
  margin-bottom: 12px;
}

.score-breakdown__row {
  display: grid;
  gap: 6px;
}

.score-breakdown__top {
  justify-content: space-between;
}

.score-breakdown__top span {
  font-size: 11px;
  line-height: 1.3;
  color: #6f7d95;
}

.score-breakdown__top strong {
  font-size: 11px;
  line-height: 1.2;
  color: #2f3f5b;
}

.score-breakdown__bar {
  height: 5px;
  border-radius: 999px;
  overflow: hidden;
  background: #eef2f7;
}

.score-breakdown__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22b661 0%, #19c566 100%);
}

.risk-row {
  margin-bottom: 14px;
  padding-top: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.risk-row span {
  color: #6f7d95;
  font-size: 11px;
  font-weight: 700;
}

.risk-row strong {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #22b661;
  font-size: 11px;
  font-weight: 800;
}

.evidence-item {
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #edf2f8;
}

.evidence-item:last-child {
  border-bottom: 0;
}

.evidence-item__dot {
  width: 7px;
  height: 7px;
  background: #ef4fa0;
}

.evidence-item small {
  margin-left: auto;
  color: #22b661;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.evidence-item small.is-medium {
  color: #f28b34;
}

.reasoning-card {
  margin-top: 16px;
  padding: 14px;
  border-radius: 14px;
  background: #f8f4ff;
}

.reasoning-card p {
  margin: 8px 0 12px;
  font-size: 11px;
  line-height: 1.6;
}

.reasoning-card button {
  width: 100%;
  height: 34px;
  border: 1px solid #ddd7fb;
  border-radius: 10px;
  color: #5d5ff2;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 1400px) {
  .screening-step {
    grid-template-columns: 1fr;
  }

  .screening-side {
    position: static;
  }
}

@media (max-width: 1100px) {
  .screening-grid--three,
  .screening-grid--two,
  .mode-strip {
    grid-template-columns: 1fr;
  }

  .mode-grid,
  .qualification-flow {
    grid-template-columns: 1fr;
  }

  .qualification-flow {
    flex-direction: column;
  }

  .approval-preview {
    width: 100%;
  }
}

@media (max-width: 720px) {
  .screening-hero,
  .screening-hero__actions,
  .mode-grid {
    flex-direction: column;
    align-items: stretch;
  }

  .screening-hero h2 {
    font-size: 24px;
  }

  .threshold-row {
    grid-template-columns: 10px 1fr;
  }
}
</style>
