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

const approvalRows = [
  ['Hiring Manager', 'Sarah Parker', 'Approved'],
  ['HR Business Partner', 'Emma Lund', 'Approved'],
  ['Finance', 'Marcus Berg', 'Pending'],
  ['Department Head', 'Johan Eriksson', 'Pending'],
]

const channels = [
  ['Career Site', '2k - 5k'],
  ['LinkedIn', '12k - 18k'],
  ['Indeed', '18k - 25k'],
  ['Glassdoor', '4k - 6k'],
  ['Talent Pool', '8k'],
  ['Employee Referrals', '5k'],
]

const recommendations = [
  ['Add salary range to improve applicant quality.', 'Add'],
  ['Await Finance approval to complete workflow.', 'Review'],
  ['Optimize SEO title for Google for Jobs visibility.', 'Optimize'],
  ['Enable employee referral channel to increase reach.', 'Enable'],
]

const forecast = [
  ['Expected Applications', '85 - 140'],
  ['Expected Qualified Candidates', '18 - 25'],
  ['Expected Interviews', '8 - 12'],
  ['Expected Hires', '1 - 2'],
]

const finalChecklist = [
  'Job Design',
  'Candidate Persona',
  'Evaluation Framework',
  'Interview Kit',
  'Communications',
  'Publishing & SEO',
]
</script>

<template>
  <section class="launch-step">
    <div class="launch-main">
      <section class="launch-hero">
        <span>Step 8 of 8</span>
        <h2>Launch & Hiring Readiness <AppIcon name="spark" :size="18" /></h2>
        <p>Final review and configuration before going live. NitroSync validates your setup for a successful launch.</p>
      </section>

      <section class="readiness-strip panel">
        <div class="readiness-strip__score">
          <div class="readiness-strip__ring">96%</div>
          <span>Ready to launch</span>
        </div>
        <div class="readiness-strip__checks">
          <article v-for="item in readinessChecks" :key="item">
            <span class="readiness-check"><AppIcon name="check" :size="12" /></span>
            <strong>{{ item }}</strong>
            <small>Complete</small>
          </article>
        </div>
        <div class="readiness-strip__warning">
          <strong>1 recommendation remaining</strong>
          <p>Add reference check stage to improve quality of hire.</p>
          <button type="button">View recommendation</button>
        </div>
      </section>

      <div class="launch-grid">
        <section class="card panel">
          <div class="card__head">
            <strong>Hiring Workspace Summary</strong>
            <button type="button">Edit</button>
          </div>
          <div class="summary-grid">
            <article v-for="[label, value] in workspaceSummary" :key="label">
              <span>{{ label }}</span>
              <strong>{{ value }}</strong>
            </article>
          </div>
        </section>

        <section class="card panel">
          <div class="card__head">
            <strong>1 Launch Strategy</strong>
          </div>
          <div class="launch-options">
            <label><span class="radio is-active" /> Publish immediately</label>
            <label><span class="radio" /> Schedule publication</label>
            <label><span class="radio" /> Internal hiring first</label>
            <label><span class="radio" /> Save as draft</label>
          </div>
          <div class="launch-fields">
            <article><span>Publish Date</span><strong>Jun 20, 2026</strong></article>
            <article><span>Publish Time</span><strong>09:00</strong></article>
            <article class="is-wide"><span>Application Deadline (Optional)</span><strong>Jul 20, 2026</strong></article>
          </div>
          <label class="toggle-row"><span class="toggle is-active" /> Close automatically</label>
        </section>
      </div>

      <div class="launch-grid">
        <section class="card panel">
          <div class="card__head">
            <strong>2 Approval Workflow</strong>
            <small>2 / 4 Approved</small>
          </div>
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
        </section>

        <section class="card panel">
          <div class="card__head">
            <strong>3 Publishing Channels</strong>
          </div>
          <div class="channels-grid">
            <article v-for="[name, reach] in channels" :key="name">
              <strong>{{ name }}</strong>
              <small>{{ reach }}</small>
              <span class="toggle is-active" />
            </article>
          </div>
        </section>
      </div>

      <section class="card panel">
        <div class="card__head">
          <strong>4 Communication Readiness</strong>
          <button type="button">Preview templates</button>
        </div>
        <div class="communication-row">
          <article>Application Confirmation</article>
          <article>Review Update</article>
          <article>Interview Invitation</article>
          <article>Reminder Emails</article>
          <article>Rejection Email</article>
          <article>Offer Email</article>
        </div>
        <div class="communication-note">All essential communication templates are ready to go.</div>
      </section>
    </div>

    <aside class="launch-side">
      <section class="side-card panel">
        <div class="side-card__head">
          <strong>AI Launch Advisor</strong>
          <span>Beta</span>
        </div>
        <div class="advisor-score">
          <div class="advisor-score__ring">96%</div>
          <div>
            <strong>Launch Readiness</strong>
            <small>Excellent</small>
          </div>
        </div>
        <div class="advisor-list">
          <article v-for="[label, action] in recommendations" :key="label">
            <p>{{ label }}</p>
            <button type="button">{{ action }}</button>
          </article>
        </div>
        <button class="primary-side" type="button">Apply all recommendations</button>
      </section>

      <section class="side-card panel">
        <strong class="side-title">Hiring Outcome Forecast</strong>
        <div class="forecast-list">
          <article v-for="[label, value] in forecast" :key="label">
            <span>{{ label }}</span>
            <strong>{{ value }}</strong>
          </article>
        </div>
      </section>

      <section class="side-card panel">
        <div class="side-title-row">
          <strong class="side-title">Final Validation Checklist</strong>
          <small>All good!</small>
        </div>
        <div class="checklist">
          <article v-for="item in finalChecklist" :key="item">
            <AppIcon name="check" :size="12" />
            <span>{{ item }}</span>
          </article>
        </div>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.launch-step,
.launch-main,
.launch-side,
.launch-grid,
.summary-grid,
.approval-list,
.channels-grid,
.advisor-list,
.forecast-list,
.checklist {
  display: grid;
  gap: 18px;
}

.launch-step {
  grid-template-columns: minmax(0, 1fr) 310px;
  align-items: start;
}

.panel {
  border: 1px solid #e7edf7;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.04);
}

.launch-hero span {
  color: #7f8ba0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.launch-hero h2 {
  margin: 10px 0 12px;
  color: #18233f;
  font-size: 28px;
}

.launch-hero p,
.readiness-strip__warning p,
.approval-insight p {
  margin: 0;
  color: #70809a;
  font-size: 14px;
  line-height: 1.65;
}

.readiness-strip,
.card,
.side-card {
  padding: 22px;
}

.readiness-strip,
.card__head,
.readiness-strip__checks,
.readiness-strip__warning,
.launch-options label,
.toggle-row,
.approval-list article,
.advisor-score,
.advisor-list article,
.forecast-list article,
.checklist article,
.communication-row,
.side-title-row {
  display: flex;
  align-items: center;
}

.readiness-strip {
  justify-content: space-between;
  gap: 20px;
}

.readiness-strip__score {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.readiness-strip__ring,
.advisor-score__ring {
  width: 92px;
  height: 92px;
  border: 8px solid #14b8a6;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1f2b45;
  font-size: 28px;
  font-weight: 800;
}

.readiness-strip__score span {
  color: #14b8a6;
  font-weight: 700;
  text-transform: uppercase;
}

.readiness-strip__checks {
  gap: 18px;
  flex: 1;
  justify-content: center;
}

.readiness-strip__checks article {
  display: grid;
  justify-items: center;
  gap: 6px;
  text-align: center;
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
.advisor-score strong,
.side-title {
  color: #1f2b45;
}

.readiness-strip__checks small,
.card__head small,
.advisor-score small {
  color: #8b97ad;
}

.readiness-strip__warning {
  max-width: 270px;
  padding: 16px;
  border: 1px solid #f9d6de;
  border-radius: 18px;
  background: #fff6f8;
  flex-direction: column;
  align-items: flex-start;
}

.readiness-strip__warning button,
.card__head button,
.approval-insight button,
.advisor-list button,
.primary-side {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dce4f0;
  border-radius: 14px;
  color: #33415d;
  background: #fff;
  font-weight: 700;
}

.launch-grid {
  grid-template-columns: 1fr 1fr;
}

.card__head {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.summary-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.summary-grid article,
.launch-fields article,
.forecast-list article {
  display: grid;
  gap: 6px;
}

.summary-grid span,
.launch-fields span,
.approval-list span,
.forecast-list span {
  color: #8b97ad;
  font-size: 13px;
}

.summary-grid strong,
.launch-fields strong,
.approval-list strong,
.forecast-list strong {
  color: #1f2b45;
}

.launch-options {
  display: grid;
  gap: 12px;
}

.launch-options label,
.toggle-row {
  gap: 10px;
  color: #44526d;
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

.launch-fields {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.launch-fields .is-wide {
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

.approval-list {
  gap: 12px;
}

.approval-list article {
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
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
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  padding: 16px;
  border-radius: 18px;
  background: #fff7eb;
}

.channels-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.channels-grid article {
  padding: 16px;
  border: 1px solid #edf2f8;
  border-radius: 18px;
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;
}

.channels-grid strong {
  color: #1f2b45;
}

.channels-grid small {
  color: #8b97ad;
}

.communication-row {
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  color: #5f6d86;
}

.communication-note {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 16px;
  color: #5667ff;
  background: #f3f5ff;
  font-weight: 700;
}

.side-card__head,
.side-title-row {
  justify-content: space-between;
  margin-bottom: 18px;
}

.side-card__head span {
  padding: 4px 8px;
  border-radius: 999px;
  color: #6b5cff;
  background: #f1efff;
  font-size: 11px;
  font-weight: 700;
}

.advisor-score {
  gap: 16px;
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
  gap: 12px;
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
}

.advisor-list p {
  flex: 1;
  margin: 0;
  color: #5f6d86;
  font-size: 13px;
  line-height: 1.5;
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

.forecast-list,
.checklist {
  gap: 12px;
}

.forecast-list article,
.checklist article {
  justify-content: space-between;
  color: #5f6d86;
}

.side-title-row small {
  color: #22c55e;
  font-weight: 700;
}

@media (max-width: 1180px) {
  .launch-step {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .launch-grid,
  .summary-grid,
  .launch-fields,
  .channels-grid {
    grid-template-columns: 1fr;
  }

  .launch-fields .is-wide {
    grid-column: auto;
  }

  .readiness-strip {
    flex-direction: column;
    align-items: stretch;
  }

  .readiness-strip__checks {
    flex-wrap: wrap;
  }
}
</style>
