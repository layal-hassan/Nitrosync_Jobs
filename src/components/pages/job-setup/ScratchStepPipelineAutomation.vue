<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const emit = defineEmits(['open-pipeline'])

const stages = [
  ['1', 'Applied', 'Auto-entry stage', 'Recruiter', '0 days', 'green', 'check'],
  ['2', 'AI Qualification', 'AI-powered', 'AI Copilot', '0.5 day', 'violet', 'spark'],
  ['3', 'Recruiter Review', '', 'Recruiter', '1 day', 'blue', 'clock'],
  ['4', 'Phone Screen', '', 'Recruiter', '2 days', 'orange', 'mail'],
  ['5', 'Assessment', '', 'Hiring Manager', '5 days', 'violet', 'copy'],
  ['6', 'Hiring Manager Interview', '', 'Hiring Manager', '3 days', 'orange', 'users'],
  ['7', 'Final Interview', '', 'Department Head', '3 days', 'pink', 'heart'],
  ['8', 'Offer', '', 'HR', '2 days', 'blue', 'document'],
  ['9', 'Hired', 'Auto-exit stage', 'System', '0 days', 'green', 'checkCircle'],
]

const movementRules = [
  'Assessment is completed',
  'Score is greater than or equal to 75%',
  'All required skills are matched',
  'Feedback is submitted',
  'Hiring Manager approval is given',
]

const routingSteps = [
  ['CV Received', 'document'],
  ['Extract Resume', 'archive'],
  ['Match Candidate Persona', 'user'],
  ['Evaluate Criteria', 'clipboard-check'],
  ['Calculate Fit Score', 'hash'],
  ['Recommend Stage', 'chevronRight'],
]

const topAttributes = [
  'IFRS Experience',
  'Accounting Degree',
  'Excel Skills',
  'English',
  'Problem Solving',
]

const workflows = [
  ['When CV Received', ['Parse resume with AI', 'Match against candidate persona', 'Assign to recruiter', 'Send confirmation email', 'Move candidate to Applied'], true],
  ['When Assessment Completed', ['Calculate assessment score', 'Request Hiring Manager approval', 'If approved → Move candidate', 'If rejected → Notify recruiter'], true],
  ['When Candidate Moved to Offer', ['Send offer email', 'Create approval task', 'Notify HR for onboarding'], false],
]

const suggestions = [
  ['Assessment stage missing exit criteria.', 'Add', 'orange'],
  ['Add Reference Check stage before Offer.', 'Add', 'green'],
  ['Add approval gate before Offer stage.', 'Add', 'red'],
  ['Pipeline can be shortened by ~5 days.', 'Optimize', 'blue'],
]

const outcomes = [
  ['Expected Time To Hire', '22 days'],
  ['Automation Coverage', '86%'],
  ['Manual Actions', '4'],
  ['Predicted Drop-off Risk', 'Low'],
]

const summary = [
  ['Total Stages', '9'],
  ['Interview Stages', '3'],
  ['Assessment Stages', '1'],
  ['AI / Auto Stages', '2'],
  ['Approval Gates', '2'],
]

function openStage(title) {
  emit('open-pipeline', title)
}
</script>

<template>
  <section class="scratch-pipeline">
    <div class="scratch-pipeline__main">
      <header class="pipeline-hero">
        <div>
          <span class="pipeline-hero__eyebrow">Step 6 of 8</span>
          <h2>Pipeline Intelligence &amp; Automation</h2>
          <p>Design the candidate journey, set movement rules, and automate progression.</p>
        </div>

        <div class="pipeline-hero__actions">
          <button class="ghost-button" type="button">
            <AppIcon name="info" :size="14" />
            How it works
          </button>
          <button class="ghost-button" type="button">
            <AppIcon name="archive" :size="14" />
            Use template
            <AppIcon name="chevronDown" :size="14" />
          </button>
          <button class="ghost-button ghost-button--pink" type="button">
            <AppIcon name="plus" :size="13" />
            AI Copilot
          </button>
        </div>
      </header>

      <section class="panel builder-card">
        <div class="builder-card__head">
          <div class="builder-card__title">
            <span class="section-badge">1</span>
            <strong>Pipeline Builder</strong>
            <p>Drag stages to reorder. Click a stage to configure.</p>
          </div>

          <div class="builder-card__actions">
            <button class="builder-action builder-action--primary" type="button">
              <AppIcon name="plus" :size="14" />
              Add stage
            </button>
            <button class="builder-action" type="button">
              <AppIcon name="refresh" :size="13" />
              Reorder
            </button>
          </div>
        </div>

        <div class="stage-grid">
          <article
            v-for="[index, title, note, owner, sla, tone, icon] in stages"
            :key="title"
            class="stage-card"
            :class="[{ 'is-active': title === 'AI Qualification' }, `tone-${tone}`]"
            @click="openStage(title)"
          >
            <div class="stage-card__top">
              <div class="stage-card__step">
                <span class="stage-card__step-mark">
                  <AppIcon :name="icon" :size="11" />
                </span>
                <b>{{ index }}</b>
              </div>
              <button type="button" @click.stop><AppIcon name="more" :size="14" /></button>
            </div>

            <strong>{{ title }}</strong>
            <small>{{ note || ' ' }}</small>

            <div class="stage-card__meta">
              <span>Owner</span>
              <b>{{ owner }}</b>
            </div>
            <div class="stage-card__meta">
              <span>SLA</span>
              <b>{{ sla }}</b>
            </div>

            <span class="stage-card__status"><AppIcon name="checkCircle" :size="15" /></span>
          </article>
        </div>

        <div class="stage-legend">
          <span><i class="tone-pink" /> Interview stage</span>
          <span><i class="tone-violet" /> Assessment stage</span>
          <span><i class="tone-blue" /> AI stage</span>
          <span><i class="tone-orange" /> Approval gate</span>
          <span><i class="tone-green" /> Auto stage</span>
        </div>
      </section>

      <div class="content-grid">
        <section class="panel logic-card">
          <div class="card-head">
            <div class="card-head__title">
              <span class="section-badge">2</span>
              <strong>Stage Movement Logic</strong>
            </div>
            <button class="mini-action" type="button">AI Generate rules</button>
          </div>

          <p>Define rules for moving candidates between stages.</p>

          <div class="logic-flow">
            <div class="logic-node">Assessment</div>
            <AppIcon name="chevronRight" :size="14" />
            <div class="logic-node logic-node--accent">Hiring Manager Interview</div>
          </div>

          <h4>Move when ALL conditions are met</h4>
          <div class="logic-list">
            <article v-for="item in movementRules" :key="item">
              <AppIcon name="check" :size="12" />
              <span>{{ item }}</span>
              <AppIcon name="chevronDown" :size="12" />
            </article>
          </div>

          <button class="text-link" type="button">+ Add condition</button>

          <div class="fallback-box">
            <span>If conditions are not met</span>
            <button type="button">
              Move to Recruiter Review
              <AppIcon name="chevronDown" :size="13" />
            </button>
          </div>

          <div class="logic-card__footer">
            <button class="danger-button" type="button">Delete rule</button>
            <button class="primary-button" type="button">Save rule</button>
          </div>
        </section>

        <section class="panel routing-card">
          <div class="card-head">
            <div class="card-head__title">
              <span class="section-badge">3</span>
              <strong>AI Candidate Routing</strong>
            </div>
          </div>

          <p>Automatically evaluate and route candidates using AI.</p>

          <div class="routing-steps">
            <article v-for="[label, icon] in routingSteps" :key="label">
              <span><AppIcon :name="icon" :size="13" /></span>
              <strong>{{ label }}</strong>
            </article>
          </div>

          <div class="routing-score">
            <div>
              <small>AI Match Result</small>
              <strong>92%</strong>
              <span>Strong Match</span>
            </div>
            <div class="routing-bars">
              <i class="is-on" />
              <i class="is-on" />
              <i class="is-on" />
              <i class="is-on" />
              <i />
            </div>
          </div>

          <div class="route-recommendation">
            <small>Recommended Next Stage</small>
            <strong>Phone Screen</strong>
            <p>Candidate meets all must-have criteria and has strong alignment on 4 out of 5 high importance attributes.</p>
          </div>

          <div class="attribute-list">
            <strong>Top matched attributes</strong>
            <ul>
              <li v-for="item in topAttributes" :key="item">
                <AppIcon name="check" :size="12" />
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="routing-actions">
            <button class="primary-button" type="button">Approve &amp; Move</button>
            <button class="outline-button" type="button">Override Stage</button>
          </div>

          <button class="text-link" type="button">View details</button>

          <div class="routing-footer">
            <label>
              <AppIcon name="clock" :size="13" />
              Auto-move after approval
            </label>
            <button type="button">
              <span class="toggle is-active" />
              <AppIcon name="settings" :size="13" />
              Settings
            </button>
          </div>
        </section>

        <section class="panel automation-card">
          <div class="card-head">
            <div class="card-head__title">
              <span class="section-badge">4</span>
              <strong>Automation Playground</strong>
            </div>
            <button class="mini-action" type="button">Add workflow</button>
          </div>

          <p>Build automation workflows for your pipeline.</p>

          <div class="workflow-list">
            <article v-for="[title, steps, active] in workflows" :key="title" class="workflow-card">
              <div class="workflow-card__head">
                <strong>{{ title }}</strong>
                <span class="toggle" :class="{ 'is-active': active }" />
              </div>
              <ul>
                <li v-for="item in steps" :key="item">{{ item }}</li>
              </ul>
            </article>
          </div>

          <button class="text-link" type="button">View all workflows</button>
        </section>
      </div>
    </div>

    <aside class="scratch-pipeline__side">
      <section class="panel side-card">
        <div class="side-card__head">
          <div class="side-card__title">
            <AppIcon name="plus" :size="13" />
            <strong>AI Pipeline Copilot</strong>
          </div>
          <span class="beta-badge">Beta</span>
        </div>

        <div class="readiness-block">
          <div class="readiness-ring">94%</div>
          <div>
            <small>Pipeline Readiness</small>
            <strong>Excellent! Your pipeline is optimized for quality and speed.</strong>
            <button type="button">4 suggestions available</button>
          </div>
        </div>

        <div class="suggestions">
          <h4>Top Suggestions</h4>
          <article v-for="[copy, action, tone] in suggestions" :key="copy">
            <span class="suggestions__icon" :class="`tone-${tone}`"><AppIcon name="alert" :size="13" /></span>
            <p>{{ copy }}</p>
            <button type="button">{{ action }}</button>
          </article>
        </div>
      </section>

      <section class="panel side-card">
        <strong class="metric-title">Pipeline Outcomes</strong>
        <div class="metric-list">
          <article v-for="[label, value] in outcomes" :key="label">
            <span>{{ label }}</span>
            <strong>{{ value }}</strong>
          </article>
        </div>
      </section>

      <section class="panel side-card">
        <strong class="metric-title">Stage Summary</strong>
        <div class="metric-list">
          <article v-for="[label, value] in summary" :key="label">
            <span>{{ label }}</span>
            <strong>{{ value }}</strong>
          </article>
        </div>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.scratch-pipeline {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 288px;
  gap: 24px;
  align-items: start;
}

.scratch-pipeline__main,
.scratch-pipeline__side,
.content-grid,
.stage-grid,
.workflow-list,
.metric-list {
  display: grid;
  gap: 18px;
}

.content-grid {
  grid-template-columns: 0.95fr 1.08fr 0.97fr;
  align-items: start;
}

.scratch-pipeline__side {
  position: sticky;
  top: 16px;
  align-content: start;
}

.pipeline-hero,
.pipeline-hero__actions,
.builder-card__head,
.builder-card__actions,
.stage-card__top,
.card-head,
.card-head__title,
.logic-flow,
.logic-list article,
.logic-card__footer,
.routing-actions,
.routing-footer,
.workflow-card__head,
.side-card__head,
.side-card__title,
.readiness-block,
.suggestions article,
.metric-list article,
.stage-legend {
  display: flex;
}

.pipeline-hero,
.builder-card__head,
.card-head,
.side-card__head {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.pipeline-hero__eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: #7f8ba0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pipeline-hero h2 {
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1c253f;
  font-size: 32px;
  line-height: 1.15;
  font-weight: 800;
}

.pipeline-hero p,
.builder-card__title p,
.logic-card p,
.routing-card p,
.automation-card p,
.side-card p,
.workflow-card li {
  margin: 0;
  color: #70809a;
  font-size: 14px;
  line-height: 1.6;
}

.pipeline-hero__actions,
.builder-card__actions {
  gap: 10px;
}

.pipeline-hero__actions {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.builder-card__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.ghost-button,
.mini-action,
.primary-button,
.danger-button,
.outline-button {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dce4f0;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fff;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.ghost-button {
  color: #31415f;
}

.ghost-button--pink {
  color: #ef5da8;
  border-color: #f6bdd8;
}

.pipeline-hero__actions .ghost-button {
  min-width: 0;
}

.pipeline-hero__actions .ghost-button--pink {
  min-width: 0;
}

.builder-action {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #d8e1ee;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #31415f;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.04);
  font-size: 14px;
  font-weight: 700;
}

.builder-action--primary {
  color: #5667ff;
  border-color: #d9defe;
  background: #fbfbff;
}

.panel {
  border: 1px solid #e7edf7;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
}

.builder-card,
.logic-card,
.routing-card,
.automation-card,
.side-card {
  padding: 20px;
}

.logic-card,
.routing-card,
.automation-card {
  min-width: 0;
}

.builder-card__title,
.card-head__title {
  display: grid;
  gap: 4px;
}

.builder-card__title strong,
.card-head__title strong,
.metric-title,
.side-card strong {
  color: #1f2b45;
  font-size: 16px;
  font-weight: 800;
}

.section-badge {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b5cff;
  background: #eef1ff;
  font-size: 12px;
  font-weight: 800;
}

.builder-card__title {
  grid-template-columns: auto auto 1fr;
  align-items: center;
  column-gap: 10px;
}

.stage-grid {
  margin-top: 18px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.stage-card {
  min-height: 154px;
  padding: 14px;
  border: 1px solid #dfe6f2;
  border-radius: 18px;
  position: relative;
  cursor: pointer;
}

.stage-card.is-active {
  border-color: #cfd4ff;
  background: #f5f6ff;
  box-shadow: inset 0 0 0 1px rgba(107, 92, 255, 0.1);
}

.stage-card__top {
  align-items: center;
  justify-content: space-between;
}

.stage-card__top button {
  border: 0;
  padding: 0;
  color: #a0acbe;
  background: transparent;
}

.stage-card__step {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.stage-card__step-mark {
  color: inherit;
}

.stage-card b,
.stage-card strong {
  color: #1f2b45;
}

.stage-card strong {
  display: block;
  margin: 12px 0 6px;
  font-size: 16px;
}

.stage-card small,
.stage-card__meta span {
  color: #9aa6bb;
  font-size: 12px;
}

.stage-card__meta {
  margin-top: 14px;
  display: grid;
  gap: 4px;
}

.stage-card__meta b {
  font-size: 14px;
}

.stage-card__status {
  position: absolute;
  right: 14px;
  bottom: 14px;
  color: #22c55e;
}

.tone-green { color: #22c55e; }
.tone-violet { color: #8b5cf6; }
.tone-blue { color: #4f7ef6; }
.tone-orange { color: #ff8b1f; }
.tone-pink { color: #ef5da8; }
.tone-red { color: #ff6b6b; }

.stage-legend {
  margin-top: 8px;
  gap: 20px;
  flex-wrap: wrap;
  color: #6f7d95;
  font-size: 13px;
}

.stage-legend i {
  width: 10px;
  height: 10px;
  margin-right: 6px;
  border-radius: 3px;
  display: inline-block;
  background: currentColor;
}

.card-head__title {
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.card-head__title strong {
  line-height: 1.2;
}

.card-head + p {
  margin-top: -4px;
  max-width: 28ch;
}

.logic-card .card-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 14px;
}

.logic-card .card-head__title {
  gap: 8px;
}

.logic-card .mini-action {
  min-height: 38px;
  padding: 0 12px;
  justify-self: end;
}

.mini-action {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  color: #5c63ff;
  font-size: 12px;
  white-space: nowrap;
  background: #fbfbff;
  border-color: #d9defe;
}

.logic-flow {
  margin: 20px 0 18px;
  display: grid;
  grid-template-columns: minmax(104px, 1fr) auto minmax(112px, 1fr);
  align-items: center;
  gap: 10px;
}

.logic-node,
.fallback-box button {
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid #e4eaf4;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #33415d;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
}

.logic-node--accent {
  color: #f97316;
  border-color: #ffd8bd;
  background: #fff9f4;
}

.logic-card h4,
.route-recommendation strong,
.attribute-list strong,
.suggestions h4 {
  margin: 0;
  color: #1f2b45;
  font-size: 14px;
  font-weight: 800;
}

.logic-card h4 {
  margin-top: 4px;
  line-height: 1.35;
}

.logic-list {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.logic-list article {
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  color: #516079;
}

.logic-list article span {
  font-size: 13px;
  line-height: 1.45;
}

.logic-list article :deep(svg:first-child) {
  color: #22c55e;
}

.logic-list article :deep(svg:last-child) {
  margin-left: auto;
  color: #a0acbe;
}

.text-link {
  border: 0;
  padding: 0;
  color: #5667ff;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
}

.fallback-box {
  margin-top: 18px;
  display: grid;
  gap: 12px;
}

.fallback-box span,
.routing-score small,
.route-recommendation small,
.readiness-block small {
  color: #8b97ad;
  font-size: 12px;
  font-weight: 700;
}

.logic-card__footer,
.routing-actions {
  gap: 12px;
  margin-top: 18px;
}

.routing-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
}

.primary-button {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

.danger-button {
  color: #ef5668;
}

.outline-button {
  color: #5667ff;
}

.routing-actions .primary-button,
.routing-actions .outline-button {
  min-height: 44px;
  padding: 0 12px;
  border-radius: 14px;
  font-size: 13px;
  white-space: nowrap;
}

.routing-steps {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.routing-steps article {
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
  align-content: start;
  min-width: 0;
}

.routing-steps span {
  width: 42px;
  height: 42px;
  border: 1px solid #e8edf5;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #7f8ba0;
}

.routing-steps strong {
  color: #4d5b74;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
  text-wrap: balance;
  max-width: 88px;
}

.routing-score {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: end;
}

.routing-score strong {
  display: block;
  margin: 8px 0 4px;
  color: #22c55e;
  font-size: 42px;
  line-height: 1;
}

.routing-score span {
  color: #16a34a;
  font-size: 14px;
  font-weight: 700;
}

.routing-bars {
  display: flex;
  align-items: end;
  gap: 4px;
}

.routing-bars i {
  width: 10px;
  height: 6px;
  border-radius: 999px;
  background: #d8dee9;
}

.routing-bars i.is-on {
  background: #22c55e;
}

.route-recommendation {
  margin-top: 20px;
  padding: 18px;
  border: 1px solid #e9eef8;
  border-radius: 16px;
  background: #fbfcff;
}

.route-recommendation strong {
  display: block;
  margin: 8px 0;
  font-size: 22px;
}

.attribute-list {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.attribute-list ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
  color: #516079;
  font-size: 14px;
}

.attribute-list li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.attribute-list li :deep(svg) {
  color: #22c55e;
}

.routing-footer {
  margin-top: 18px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #6f7d95;
  font-size: 13px;
  flex-wrap: wrap;
}

.routing-footer label,
.routing-footer button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.routing-footer button {
  border: 0;
  padding: 0;
  color: #5667ff;
  background: transparent;
  font-weight: 700;
}

.toggle {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  display: inline-flex;
  background: #e3e9f4;
}

.toggle.is-active {
  background: linear-gradient(90deg, #6b5cff 0%, #ef5da8 100%);
}

.workflow-list {
  margin-top: 18px;
}

.workflow-card {
  padding: 16px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
  background: #fcfdff;
}

.workflow-card__head {
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.workflow-card strong {
  color: #1f2b45;
  font-size: 16px;
  line-height: 1.25;
}

.workflow-card ul {
  margin: 14px 0 0;
  padding-left: 18px;
  color: #5f6d86;
  font-size: 13px;
  line-height: 1.7;
}

.workflow-card li + li {
  margin-top: 2px;
}

.automation-card > .text-link,
.routing-card > .text-link {
  margin-top: 18px;
  width: fit-content;
}

.side-card__title {
  align-items: center;
  gap: 8px;
  color: #6b5cff;
}

.beta-badge {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  color: #6b5cff;
  background: #f1efff;
  font-size: 11px;
  font-weight: 700;
}

.readiness-block {
  margin-top: 18px;
  align-items: center;
  gap: 16px;
}

.readiness-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #1f2b45;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  background:
    radial-gradient(#fff 60%, transparent 61%),
    conic-gradient(#ef5da8 0deg 338deg, #e8eef7 338deg 360deg);
}

.readiness-block > div:last-child {
  min-width: 0;
  flex: 1;
}

.readiness-block strong {
  display: block;
  margin: 4px 0 6px;
  font-size: 15px;
  line-height: 1.5;
}

.readiness-block button,
.suggestions article button {
  border: 0;
  padding: 0;
  color: #5667ff;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.suggestions {
  margin-top: 18px;
  display: grid;
  gap: 14px;
}

.suggestions h4 {
  font-size: 13px;
  text-transform: uppercase;
}

.suggestions article {
  padding: 12px;
  align-items: center;
  gap: 10px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
}

.suggestions__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggestions article p {
  flex: 1;
  font-size: 13px;
}

.metric-list article {
  align-items: center;
  justify-content: space-between;
  color: #6f7d95;
  font-size: 14px;
}

.metric-list article strong {
  font-size: 15px;
}

@media (max-width: 1260px) {
  .scratch-pipeline {
    grid-template-columns: 1fr;
  }

  .scratch-pipeline__side {
    position: static;
  }
}

@media (max-width: 1024px) {
  .content-grid,
  .stage-grid {
    grid-template-columns: 1fr 1fr;
  }

  .routing-steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .pipeline-hero,
  .pipeline-hero__actions,
  .builder-card__head,
  .builder-card__actions,
  .content-grid,
  .stage-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .content-grid {
    display: grid;
  }

  .logic-flow {
    grid-template-columns: 1fr;
  }

  .routing-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
