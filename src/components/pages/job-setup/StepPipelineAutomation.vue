<script setup>
import AppIcon from '../../shared/AppIcon.vue'

defineEmits(['open-pipeline'])

const stages = [
  ['1', 'Applied', 'Auto-entry stage', 'Recruiter', '0 days', 'green'],
  ['2', 'AI Qualification', 'AI-powered', 'AI Copilot', '0.5 day', 'violet'],
  ['3', 'Recruiter Review', '', 'Recruiter', '1 day', 'blue'],
  ['4', 'Phone Screen', '', 'Recruiter', '2 days', 'orange'],
  ['5', 'Assessment', '', 'Hiring Manager', '5 days', 'violet'],
  ['6', 'Hiring Manager Interview', '', 'Hiring Manager', '3 days', 'orange'],
  ['7', 'Final Interview', '', 'Department Head', '3 days', 'pink'],
  ['8', 'Offer', '', 'HR', '2 days', 'blue'],
  ['9', 'Hired', 'Auto-exit stage', 'System', '0 days', 'green'],
]

const movementRules = [
  'Assessment is completed',
  'Score is greater than or equal to 75%',
  'All required skills are matched',
  'Feedback is submitted',
  'Hiring Manager approval is given',
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

const workflows = [
  ['When CV Received', ['Parse resume with AI', 'Match against candidate persona', 'Assign to recruiter', 'Send confirmation email', 'Move candidate to Applied'], true],
  ['When Assessment Completed', ['Calculate assessment score', 'Request Hiring Manager approval', 'If approved move candidate', 'If rejected notify recruiter'], true],
  ['When Candidate Moved to Offer', ['Send offer email', 'Create approval task', 'Notify HR for onboarding'], false],
]
</script>

<template>
  <section class="pipeline-step">
    <div class="pipeline-main">
      <section class="pipeline-hero">
        <div>
          <span>Step 6 of 8</span>
          <h2>Pipeline Intelligence & Automation</h2>
          <p>Design the candidate journey, set movement rules, and automate progression.</p>
        </div>
        <div class="pipeline-hero__actions">
          <button type="button">How it works</button>
          <button type="button">Use template</button>
          <button class="pipeline-hero__ai" type="button">AI Copilot</button>
        </div>
      </section>

      <section class="builder panel">
        <div class="builder__head">
          <div>
            <strong>1 Pipeline Builder</strong>
            <p>Drag stages to reorder. Click a stage to configure.</p>
          </div>
          <div class="builder__actions">
            <button type="button">+ Add stage</button>
            <button type="button">Reorder</button>
          </div>
        </div>

        <div class="stage-grid">
          <article v-for="[index, title, note, owner, sla, tone] in stages" :key="title" class="stage-card" :class="{ 'is-active': title === 'AI Qualification' }">
            <div class="stage-card__top">
              <span class="stage-number" :class="`tone-${tone}`">{{ index }}</span>
              <AppIcon name="more" :size="14" />
            </div>
            <strong>{{ title }}</strong>
            <small>{{ note || ' ' }}</small>
            <p>Owner</p>
            <span>{{ owner }}</span>
            <p>SLA</p>
            <span>{{ sla }}</span>
          </article>
        </div>
      </section>

      <div class="pipeline-grid">
        <section class="card panel">
          <div class="card__head">
            <strong>2 Stage Movement Logic</strong>
            <button type="button">AI Generate rules</button>
          </div>
          <div class="logic-flow">
            <div class="logic-flow__from">Assessment</div>
            <AppIcon name="chevronRight" :size="14" />
            <div class="logic-flow__to">Hiring Manager Interview</div>
          </div>
          <p class="logic-text">Move when ALL conditions are met</p>
          <div class="logic-list">
            <article v-for="item in movementRules" :key="item">
              <AppIcon name="check" :size="12" />
              <span>{{ item }}</span>
            </article>
          </div>
          <button class="link-button" type="button">+ Add condition</button>
          <label class="logic-fallback">
            <span>If conditions are not met</span>
            <div>Move to Recruiter Review</div>
          </label>
          <div class="card__footer">
            <button class="danger-button" type="button">Delete rule</button>
            <button class="primary-button" type="button">Save rule</button>
          </div>
        </section>

        <section class="card panel">
          <div class="card__head">
            <strong>3 AI Candidate Routing</strong>
          </div>
          <div class="route-icons">
            <span>CV Received</span>
            <span>Extract Resume</span>
            <span>Match Persona</span>
            <span>Evaluate Criteria</span>
            <span>Recommend Stage</span>
          </div>
          <div class="route-score">
            <div>
              <small>AI MATCH RESULT</small>
              <strong>92%</strong>
              <span>Strong Match</span>
            </div>
            <div class="route-stage">
              <small>RECOMMENDED NEXT STAGE</small>
              <strong>Phone Screen</strong>
              <p>Candidate meets all must-have criteria and has strong alignment on 4 out of 5 high importance attributes.</p>
            </div>
          </div>
          <div class="route-actions">
            <button class="primary-button" type="button">Approve & Move</button>
            <button type="button">Override Stage</button>
          </div>
          <button class="link-button" type="button">View details</button>
        </section>

        <section class="card panel">
          <div class="card__head">
            <strong>4 Automation Playground</strong>
            <button type="button">Add workflow</button>
          </div>
          <div class="workflow-list">
            <article v-for="[title, steps, active] in workflows" :key="title">
              <div class="workflow-list__head">
                <strong>{{ title }}</strong>
                <span class="workflow-toggle" :class="{ 'is-active': active }" />
              </div>
              <ul>
                <li v-for="item in steps" :key="item">{{ item }}</li>
              </ul>
            </article>
          </div>
          <button class="link-button" type="button">View all workflows</button>
        </section>
      </div>
    </div>

    <aside class="pipeline-side">
      <section class="side-card panel">
        <div class="side-card__head">
          <strong>AI Pipeline Copilot</strong>
          <span>Beta</span>
        </div>
        <div class="side-ring">
          <div class="side-ring__score">94%</div>
          <div>
            <strong>Excellent! Your pipeline is optimized for quality and speed.</strong>
            <small>4 suggestions available</small>
          </div>
        </div>
        <div class="side-suggestions">
          <article v-for="[label, action, tone] in suggestions" :key="label">
            <span class="side-suggestions__dot" :class="`tone-${tone}`" />
            <p>{{ label }}</p>
            <button type="button">{{ action }}</button>
          </article>
        </div>
      </section>

      <section class="side-card panel">
        <strong class="side-title">Pipeline Outcomes</strong>
        <div class="metric-list">
          <article v-for="[label, value] in outcomes" :key="label">
            <span>{{ label }}</span>
            <strong>{{ value }}</strong>
          </article>
        </div>
      </section>

      <section class="side-card panel">
        <strong class="side-title">Stage Summary</strong>
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
.pipeline-step,
.pipeline-main,
.pipeline-side,
.stage-grid,
.pipeline-grid,
.logic-list,
.workflow-list,
.side-suggestions,
.metric-list {
  display: grid;
  gap: 18px;
}

.pipeline-step {
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: start;
}

.panel {
  border: 1px solid #e7edf7;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.04);
}

.pipeline-hero,
.pipeline-hero__actions,
.builder__head,
.builder__actions,
.stage-card__top,
.card__head,
.logic-flow,
.card__footer,
.workflow-list__head,
.side-card__head,
.side-ring,
.side-suggestions article,
.metric-list article,
.route-actions {
  display: flex;
  align-items: center;
}

.pipeline-hero,
.builder__head,
.card__head,
.side-card__head {
  justify-content: space-between;
  gap: 16px;
}

.pipeline-hero span {
  color: #7f8ba0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pipeline-hero h2 {
  margin: 10px 0 12px;
  color: #18233f;
  font-size: 28px;
}

.pipeline-hero p,
.builder__head p,
.logic-text,
.route-stage p {
  margin: 0;
  color: #70809a;
  font-size: 14px;
  line-height: 1.65;
}

.pipeline-hero__actions {
  gap: 12px;
}

.pipeline-hero__actions button,
.builder__actions button,
.card__head button,
.side-suggestions button,
.route-actions button,
.primary-button,
.danger-button {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dce4f0;
  border-radius: 14px;
  color: #33415d;
  background: #fff;
  font-weight: 700;
}

.pipeline-hero__ai {
  color: #ef5da8 !important;
}

.builder,
.card,
.side-card {
  padding: 22px;
}

.builder__head strong,
.card__head strong,
.side-title,
.side-ring strong {
  color: #1f2b45;
  font-size: 16px;
}

.stage-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.stage-card {
  padding: 16px;
  border: 1px solid #e7edf7;
  border-radius: 18px;
  background: #fff;
}

.stage-card.is-active {
  border-color: #cfd1ff;
  background: #f5f5ff;
}

.stage-card strong {
  display: block;
  margin: 10px 0 8px;
  color: #1f2b45;
}

.stage-card small,
.stage-card p {
  color: #9aa6bb;
  font-size: 12px;
}

.stage-card p {
  margin: 14px 0 4px;
  text-transform: uppercase;
}

.stage-card span {
  display: block;
  color: #34415d;
  font-size: 13px;
  font-weight: 700;
}

.stage-number {
  font-size: 13px;
  font-weight: 800;
}

.pipeline-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.logic-flow__from,
.logic-flow__to,
.logic-fallback div {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #e7edf7;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  color: #34415d;
  background: #fff;
  font-weight: 700;
}

.logic-text {
  margin: 16px 0 12px;
}

.logic-list article,
.metric-list article,
.side-suggestions article,
.route-icons span {
  display: flex;
  align-items: center;
}

.logic-list article {
  gap: 10px;
  color: #5f6d86;
}

.link-button {
  border: 0;
  padding: 0;
  color: #5667ff;
  background: transparent;
  font-weight: 700;
}

.logic-fallback {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.logic-fallback span {
  color: #8b97ad;
  font-size: 12px;
}

.card__footer,
.route-actions {
  gap: 12px;
  margin-top: 18px;
}

.primary-button {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

.danger-button {
  color: #ef5668;
}

.route-icons {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.route-icons span {
  justify-content: center;
  min-height: 58px;
  padding: 8px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
  color: #4b5770;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.route-score {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.route-score small,
.route-stage small {
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.route-score strong,
.route-stage strong {
  display: block;
  margin: 6px 0;
  color: #22c55e;
  font-size: 34px;
}

.route-stage strong {
  color: #1f2b45;
  font-size: 18px;
}

.workflow-list article {
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
}

.workflow-list__head {
  justify-content: space-between;
  gap: 12px;
}

.workflow-list strong {
  color: #1f2b45;
}

.workflow-list ul {
  margin: 14px 0 0;
  padding-left: 18px;
  color: #5f6d86;
  font-size: 13px;
  line-height: 1.7;
}

.workflow-toggle {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: #e3e9f4;
}

.workflow-toggle.is-active {
  background: linear-gradient(90deg, #6b5cff 0%, #ef5da8 100%);
}

.side-card__head span {
  padding: 4px 8px;
  border-radius: 999px;
  color: #6b5cff;
  background: #f1efff;
  font-size: 11px;
  font-weight: 700;
}

.side-ring {
  gap: 16px;
}

.side-ring__score {
  width: 78px;
  height: 78px;
  border: 7px solid #ef5da8;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1f2b45;
  font-size: 24px;
  font-weight: 800;
}

.side-ring small {
  display: block;
  margin-top: 8px;
  color: #5667ff;
  font-weight: 700;
}

.side-suggestions article {
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
}

.side-suggestions__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 6px;
}

.side-suggestions p {
  flex: 1;
  margin: 0;
  color: #5f6d86;
  font-size: 13px;
  line-height: 1.5;
}

.side-suggestions button {
  min-height: 34px;
  padding: 0 12px;
}

.metric-list article {
  justify-content: space-between;
  color: #5f6d86;
}

.metric-list strong {
  color: #1f2b45;
}

.tone-green { color: #22c55e; }
.tone-violet { color: #8b5cf6; }
.tone-blue { color: #4f7ff6; }
.tone-orange { color: #ff8a1f; }
.tone-pink { color: #ef5da8; }
.tone-red { color: #ef5668; }

@media (max-width: 1180px) {
  .pipeline-step {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .stage-grid,
  .pipeline-grid,
  .route-icons,
  .route-score {
    grid-template-columns: 1fr;
  }

  .pipeline-hero,
  .pipeline-hero__actions,
  .builder__head {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
