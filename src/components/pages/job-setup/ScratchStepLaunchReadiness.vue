<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const readinessChecks = [
  'Job Design',
  'Candidate Persona',
  'Evaluation Framework',
  'Pipeline',
  'Interview Kit',
  'Communications',
]

const workspaceSummary = [
  ['Job Title', 'Senior Accountant'],
  ['Department', 'Finance'],
  ['Location', 'Stockholm, Sweden'],
  ['Work Model', 'Hybrid'],
  ['Employment Type', 'Full-time'],
  ['Hiring Manager', 'Sarah Parker'],
  ['Recruiter', 'John Smith'],
  ['Open Positions', '2'],
]

const experiencePreview = [
  ['Application Time', '~ 6 min', 'clock'],
  ['Interview Process', '3 Interviews', 'users'],
  ['Expected Hiring Time', '21 Days', 'calendar'],
  ['Candidate Exp. Score', '9.1 / 10 EXCELLENT', 'checkCircle'],
]

const approvalRows = [
  ['Hiring Manager', 'Sarah Parker', 'Approved'],
  ['HR Business Partner', 'Emma Lund', 'Approved'],
  ['Finance', 'Marcus Berg', 'Pending'],
  ['Department Head', 'Johan Eriksson', 'Pending'],
]

const channels = [
  ['Career Site', '2k - 5k', 'briefcase'],
  ['LinkedIn', '12k - 18k', 'linkedin'],
  ['Indeed', '18k - 25k', 'indeed'],
  ['Glassdoor', '4k - 6k', 'glassdoor'],
  ['Talent Pool', '8k', 'users'],
  ['Employee Referrals', '5k', 'userPlus'],
]

const recommendations = [
  ['Add salary range to improve applicant quality.', 'Add', 'orange'],
  ['Await Finance approval to complete workflow.', 'Review', 'orange'],
  ['Optimize SEO title for Google for Jobs visibility.', 'Optimize', 'green'],
  ['Enable employee referral channel to increase reach.', 'Enable', 'violet'],
]

const forecast = [
  ['Expected Applications', '85 - 140'],
  ['Expected Qualified Candidates', '18 - 25'],
  ['Expected Interviews', '8 - 12'],
  ['Expected Hires', '1 - 2'],
]

const finalChecklistColumns = [
  [
    'Job Design',
    'Candidate Persona',
    'Evaluation Framework',
    'Pipeline Automation',
  ],
  [
    'Interview Kit',
    'Communications',
    'Publishing & SEO',
    'Compliance Check',
  ],
]

const communicationItems = [
  'Application Confirmation',
  'Review Update',
  'Interview Invitation',
  'Reminder Emails',
  'Rejection Email',
  'Offer Email',
]
</script>

<template>
  <section class="scratch-launch">
    <header class="launch-hero">
      <span class="launch-hero__eyebrow">Step 8 of 8</span>
      <h2>
        Launch &amp; Hiring Readiness
        <AppIcon name="spark" :size="18" />
      </h2>
      <p>Final review and configuration before going live. NitroSync validates your setup for a successful launch.</p>
    </header>

    <div class="scratch-launch__body">
      <section class="panel readiness-strip">
        <div class="readiness-strip__score">
          <div class="readiness-strip__ring">
            <strong>96%</strong>
            <span>Ready to launch</span>
          </div>
          <small>Excellent</small>
        </div>

        <div class="readiness-strip__checks">
          <article v-for="item in readinessChecks" :key="item">
            <span class="readiness-check"><AppIcon name="check" :size="12" /></span>
            <strong>{{ item }}</strong>
            <small>Complete</small>
          </article>
        </div>

        <div class="readiness-strip__warning">
          <div class="warning-icon"><AppIcon name="bolt" :size="14" /></div>
          <div>
            <strong>1 recommendation remaining</strong>
            <p>Add reference check stage to improve quality of hire.</p>
            <button type="button">View recommendation</button>
          </div>
        </div>
      </section>

      <div class="summary-stack">
        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <AppIcon name="building" :size="15" />
              <strong>Hiring Workspace Summary</strong>
            </div>
            <button type="button">Edit</button>
          </div>

          <div class="summary-grid">
            <article v-for="[label, value] in workspaceSummary" :key="label">
              <span>{{ label }}</span>
              <strong>{{ value }}</strong>
            </article>
          </div>
        </section>

        <section class="panel card experience-card">
          <div class="card__head">
            <div class="card__title">
              <AppIcon name="refresh" :size="15" />
              <strong>Candidate Experience Preview</strong>
            </div>
            <button class="text-link" type="button">View full journey</button>
          </div>

          <div class="experience-grid">
            <article v-for="[label, value, icon] in experiencePreview" :key="label">
              <span class="experience-grid__icon"><AppIcon :name="icon" :size="14" /></span>
              <small>{{ label }}</small>
              <strong>{{ value }}</strong>
            </article>
          </div>

          <div class="experience-note">
            <AppIcon name="check" :size="13" />
            <span>Low drop-off risk. Your process is optimized for candidate experience.</span>
          </div>
        </section>
      </div>

      <div class="strategy-stack">
        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="section-badge">1</span>
              <strong>Launch Strategy</strong>
            </div>
          </div>

          <div class="strategy-layout">
            <div class="strategy-options">
              <label><span class="radio is-active" /> Publish immediately</label>
              <label><span class="radio" /> Schedule publication</label>
              <label><span class="radio" /> Internal hiring first</label>
              <label><span class="radio" /> Save as draft</label>
            </div>

            <div class="strategy-fields">
              <article>
                <span>Publish Date</span>
                <button type="button">Jun 20, 2026 <AppIcon name="calendar" :size="14" /></button>
              </article>
              <article>
                <span>Publish Time</span>
                <button type="button">09:00 <AppIcon name="clock" :size="14" /></button>
              </article>
              <article class="is-wide">
                <span>Application Deadline (Optional)</span>
                <button type="button">Jul 20, 2026 <AppIcon name="calendar" :size="14" /></button>
              </article>
              <label class="toggle-row"><span class="toggle is-active" /> Close automatically <AppIcon name="info" :size="13" /></label>
            </div>
          </div>
        </section>

        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="section-badge">2</span>
              <strong>Approval Workflow</strong>
            </div>
            <small>2 / 4 Approved</small>
          </div>

          <div class="approval-layout">
            <div class="approval-list">
              <article v-for="[team, owner, state] in approvalRows" :key="team">
                <span>{{ team }}</span>
                <strong>{{ owner }}</strong>
                <em :class="`is-${state.toLowerCase()}`">{{ state }}</em>
              </article>
            </div>

            <div class="approval-insight">
              <strong>AI Insight</strong>
              <p>Salary range exceeds standard budget by 12%. Finance approval recommended.</p>
              <button type="button">Send Reminder</button>
            </div>
          </div>
        </section>

        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="section-badge">3</span>
              <strong>Publishing Channels</strong>
            </div>
            <small>Estimated total reach: 32K - 48K people</small>
          </div>

          <div class="channels-grid">
            <article v-for="[name, reach, icon] in channels" :key="name">
              <span class="channels-grid__icon">
                <AppIcon :name="icon" :size="16" />
              </span>
              <strong>{{ name }}</strong>
              <small>{{ reach }}</small>
              <span class="toggle is-active" />
            </article>
          </div>
        </section>

        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="section-badge">4</span>
              <strong>Communication Readiness</strong>
            </div>
            <button class="text-link" type="button">Preview templates</button>
          </div>

          <div class="communication-row">
            <article v-for="item in communicationItems" :key="item">
              <span class="communication-row__icon"><AppIcon name="mail" :size="14" /></span>
              <strong>{{ item }}</strong>
            </article>
          </div>

          <div class="communication-note">
            <AppIcon name="info" :size="13" />
            <span>All essential communication templates are ready to go.</span>
          </div>
        </section>
      </div>

      <div class="side-stack">
        <section class="panel side-card side-card--advisor">
          <div class="side-card__head">
            <div class="side-card__title">
              <AppIcon name="users" :size="14" />
              <strong>AI Launch Advisor</strong>
            </div>
            <span class="beta-badge">Beta</span>
          </div>

          <div class="advisor-score">
            <div class="advisor-score__ring">96%</div>
            <div>
              <strong>Launch Readiness</strong>
              <small>Excellent</small>
            </div>
          </div>

          <div class="advisor-list">
            <article v-for="[label, action, tone] in recommendations" :key="label">
              <span class="advisor-list__icon" :class="`tone-${tone}`"><AppIcon name="alert" :size="13" /></span>
              <p>{{ label }}</p>
              <button type="button">{{ action }}</button>
            </article>
          </div>

          <button class="primary-side" type="button">Apply all recommendations</button>
        </section>

        <section class="panel side-card">
          <strong class="side-title">Hiring Outcome Forecast</strong>
          <div class="forecast-list">
            <article v-for="[label, value] in forecast" :key="label">
              <span>{{ label }}</span>
              <strong>{{ value }}</strong>
            </article>
          </div>
          <small class="side-footnote">Forecast is based on similar roles and historical data.</small>
        </section>

        <section class="panel side-card">
          <div class="side-title-row">
            <strong class="side-title">Final Validation Checklist</strong>
            <small>All good!</small>
          </div>
          <div class="checklist-grid">
            <div v-for="(column, columnIndex) in finalChecklistColumns" :key="columnIndex" class="checklist-grid__col">
              <article v-for="item in column" :key="item">
                <AppIcon name="check" :size="12" />
                <span>{{ item }}</span>
              </article>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scratch-launch {
  display: grid;
  gap: 20px;
}

.scratch-launch__body {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 290px;
  gap: 14px;
  align-items: start;
}

.summary-stack,
.strategy-stack,
.side-stack,
.summary-grid,
.approval-list,
.channels-grid,
.advisor-list,
.forecast-list,
.checklist-grid {
  display: grid;
  gap: 18px;
}

.summary-stack,
.strategy-stack,
.side-stack,
.card,
.side-card,
.summary-grid article,
.channels-grid article {
  min-width: 0;
}

.summary-stack {
  grid-column: 1;
  grid-row: 2 / span 2;
}

.strategy-stack {
  grid-column: 2;
  grid-row: 2 / span 3;
}

.side-stack {
  grid-column: 3;
  grid-row: 1 / span 4;
  position: sticky;
  top: 16px;
  align-content: start;
}

.readiness-strip {
  grid-column: 1 / 3;
}

.launch-hero__eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  color: #7f8ba0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.launch-hero h2 {
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1d2640;
  font-size: 32px;
  font-weight: 800;
}

.launch-hero p,
.readiness-strip__warning p,
.experience-note span,
.approval-insight p,
.advisor-list p {
  margin: 0;
  color: #70809a;
  font-size: 14px;
  line-height: 1.6;
}

.panel {
  border: 1px solid #e7edf7;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
}

.readiness-strip,
.card,
.side-card {
  padding: 20px;
}

.readiness-strip,
.card__head,
.readiness-strip__warning,
.experience-note,
.strategy-layout,
.strategy-options label,
.toggle-row,
.approval-list article,
.approval-layout,
.channels-grid article,
.communication-row,
.communication-note,
.side-card__head,
.side-card__title,
.advisor-score,
.advisor-list article,
.forecast-list article,
.checklist-grid article,
.warning-icon {
  display: flex;
  align-items: center;
}

.readiness-strip,
.card__head,
.side-card__head {
  justify-content: space-between;
  gap: 16px;
}

.readiness-strip {
  display: grid;
  grid-template-columns: 136px minmax(0, 1fr) 220px;
  gap: 18px;
  min-height: 138px;
  align-items: center;
}

.readiness-strip__score {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.readiness-strip__ring {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: grid;
  justify-items: center;
  align-content: center;
  background:
    radial-gradient(#fff 58%, transparent 60%),
    conic-gradient(#14b8a6 0deg 346deg, #e6f0f5 346deg 360deg);
}

.readiness-strip__ring strong {
  color: #1f2b45;
  font-size: 22px;
  font-weight: 800;
}

.readiness-strip__ring span,
.readiness-strip__score small,
.readiness-strip__checks small,
.card__head small,
.summary-grid span,
.strategy-fields span,
.approval-list span,
.forecast-list span,
.side-footnote {
  color: #8b97ad;
  font-size: 12px;
}

.readiness-strip__score small {
  color: #10b981;
  font-weight: 700;
  text-transform: uppercase;
}

.readiness-strip__checks {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  align-items: start;
  min-width: 0;
  overflow: hidden;
}

.readiness-strip__checks article {
  display: grid;
  justify-items: center;
  gap: 6px;
  text-align: center;
  min-width: 0;
}

.readiness-check {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
  background: #eefcf4;
}

.readiness-strip__checks strong,
.card__head strong,
.card__title strong,
.side-title,
.advisor-score strong {
  color: #1f2b45;
}

.readiness-strip__checks strong {
  font-size: 11px;
  line-height: 1.35;
  text-wrap: balance;
}

.readiness-strip__checks small {
  font-size: 10px;
}

.readiness-strip__warning {
  width: 220px;
  min-width: 220px;
  padding: 14px 16px;
  border: 1px solid #f8dbe2;
  border-radius: 16px;
  align-items: flex-start;
  gap: 12px;
  background: #fff7f8;
}

.warning-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  justify-content: center;
  color: #ef5da8;
  background: #fff;
  flex-shrink: 0;
}

.readiness-strip__warning strong {
  display: block;
  margin-bottom: 6px;
  color: #1f2b45;
  font-size: 13px;
  line-height: 1.35;
}

.readiness-strip__warning p {
  margin-bottom: 12px;
  font-size: 12px;
  line-height: 1.55;
}

.readiness-strip__warning button,
.card__head button,
.experience-grid article,
.strategy-fields button,
.approval-insight button,
.advisor-list button,
.primary-side {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dce4f0;
  border-radius: 12px;
  color: #33415d;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
}

.card__head {
  margin-bottom: 18px;
}

.card__title,
.side-card__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.summary-grid {
  grid-template-columns: 1fr 1fr;
  column-gap: 14px;
  row-gap: 12px;
}

.summary-grid article {
  display: grid;
  gap: 6px;
}

.summary-grid strong,
.strategy-fields button,
.approval-list strong,
.forecast-list strong {
  color: #1f2b45;
}

.experience-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.experience-grid article {
  min-height: 64px;
  padding: 12px;
  display: grid;
  gap: 6px;
  align-content: start;
  justify-content: start;
  background: #fbfcff;
}

.experience-grid__icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
  background: #f3edff;
}

.experience-grid article small {
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.experience-grid article strong {
  color: #1f2b45;
  font-size: 16px;
  font-weight: 800;
}

.experience-note {
  margin-top: 16px;
  gap: 8px;
  padding: 14px;
  border-radius: 14px;
  color: #16a34a;
  background: #eefcf4;
}

.experience-note :deep(svg) {
  color: #16a34a;
}

.text-link {
  border: 0 !important;
  padding: 0 !important;
  color: #5667ff !important;
  background: transparent !important;
  font-size: 13px;
  font-weight: 700;
}

.strategy-layout {
  align-items: flex-start;
  gap: 18px;
}

.strategy-options {
  display: grid;
  gap: 12px;
  min-width: 230px;
}

.strategy-options label,
.toggle-row {
  gap: 10px;
  color: #44526d;
  font-size: 14px;
}

.radio {
  width: 18px;
  height: 18px;
  border: 1px solid #cad3e1;
  border-radius: 50%;
}

.radio.is-active {
  border-color: #6b5cff;
  box-shadow: inset 0 0 0 4px #6b5cff;
}

.strategy-fields {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 0.7fr;
  gap: 14px;
}

.strategy-fields article {
  display: grid;
  gap: 8px;
}

.strategy-fields article.is-wide {
  grid-column: span 2;
}

.strategy-fields button {
  justify-content: space-between;
  display: inline-flex;
  align-items: center;
}

.toggle-row {
  grid-column: span 2;
}

.toggle {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: #e3e9f4;
}

.toggle.is-active {
  background: linear-gradient(90deg, #14b8a6 0%, #22c55e 100%);
}

.approval-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 168px;
  align-items: stretch;
  gap: 14px;
}

.approval-list {
  min-width: 0;
}

.approval-list article {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(120px, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
}

.approval-list article strong {
  text-align: right;
}

.approval-list em {
  padding: 6px 10px;
  border-radius: 999px;
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
}

.approval-list .is-approved {
  color: #22c55e;
  background: #eefcf4;
}

.approval-list .is-pending {
  color: #ff8a1f;
  background: #fff3e8;
}

.approval-insight {
  min-width: 0;
  padding: 14px;
  border-radius: 16px;
  display: grid;
  align-content: start;
  gap: 10px;
  background: #fff7eb;
}

.approval-insight strong {
  color: #ff8a1f;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.approval-insight button {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #6b5cff 0%, #4f46e5 100%);
}

.channels-grid {
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.channels-grid article {
  min-height: 96px;
  padding: 10px 6px;
  border: 1px solid #edf2f8;
  border-radius: 18px;
  justify-items: center;
  display: grid;
  gap: 8px;
  text-align: center;
}

.channels-grid__icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5667ff;
  background: #f4f6fb;
}

.channels-grid strong {
  color: #1f2b45;
  font-size: 10px;
  line-height: 1.35;
  text-wrap: balance;
}

.channels-grid small {
  color: #8b97ad;
  font-size: 9px;
}

.communication-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  align-items: start;
}

.communication-row article {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
}

.communication-row__icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #14b8a6;
  background: #eefcf7;
}

.communication-row strong {
  color: #5c6983;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  text-wrap: balance;
}

.communication-note {
  margin-top: 22px;
  gap: 10px;
  padding: 16px 18px;
  border-radius: 18px;
  color: #5667ff;
  background: #f3f5ff;
  font-weight: 700;
}

.side-card__head {
  margin-bottom: 18px;
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

.advisor-score {
  gap: 14px;
  margin-bottom: 12px;
}

.advisor-score__ring {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1f2b45;
  font-size: 22px;
  font-weight: 800;
  background:
    radial-gradient(#fff 58%, transparent 60%),
    conic-gradient(#14b8a6 0deg 346deg, #e6f0f5 346deg 360deg);
}

.advisor-score small {
  display: block;
  margin-top: 6px;
  color: #14b8a6;
  font-size: 13px;
  font-weight: 700;
}

.advisor-list article {
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
}

.advisor-list__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.advisor-list p {
  flex: 1;
  font-size: 12px;
  line-height: 1.45;
}

.advisor-list button {
  min-height: 34px;
  padding: 0 12px;
}

.primary-side {
  width: 100%;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%);
}

.forecast-list article,
.checklist-grid article {
  color: #5f6d86;
}

.forecast-list article {
  justify-content: space-between;
  gap: 10px;
}

.side-footnote {
  display: block;
  margin-top: 12px;
}

.side-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
  gap: 12px;
}

.side-title-row small {
  color: #22c55e;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0;
}

.checklist-grid__col {
  display: grid;
  gap: 14px;
}

.checklist-grid {
  grid-template-columns: 1fr 1fr;
  column-gap: 14px;
}

.checklist-grid article {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  align-items: start;
  column-gap: 10px;
  min-width: 0;
}

.checklist-grid article span {
  color: #66748f;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.45;
  text-wrap: balance;
}

.checklist-grid article :deep(svg) {
  color: #22c55e;
  margin-top: 2px;
}

@media (max-width: 1180px) {
  .scratch-launch__body {
    grid-template-columns: 1fr;
  }

  .side-stack {
    position: static;
  }

  .readiness-strip,
  .summary-stack,
  .strategy-stack,
  .side-stack {
    grid-column: auto;
    grid-row: auto;
  }

  .readiness-strip {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .summary-grid,
  .strategy-layout,
  .strategy-fields,
  .approval-layout,
  .communication-row {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .channels-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .strategy-fields article.is-wide,
  .toggle-row {
    grid-column: auto;
  }

  .readiness-strip__checks {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .approval-list article {
    grid-template-columns: 1fr;
  }

  .approval-list article strong {
    text-align: left;
  }
}

@media (max-width: 720px) {
  .channels-grid,
  .checklist-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .channels-grid,
  .checklist-grid {
    grid-template-columns: 1fr;
  }

  .readiness-strip__checks {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .readiness-strip__warning {
    width: 100%;
    min-width: 0;
  }
}
</style>
