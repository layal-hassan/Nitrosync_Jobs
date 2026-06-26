<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const plan = [
  ['Recruiter Screen', '30 min - Phone/Video', 'Sarah Parker', 'Motivation, Communication, Availability'],
  ['Hiring Manager Interview', '60 min - Video Call', 'Michael Brown', 'Technical Skills, Problem Solving, Ownership'],
  ['Final Interview', '45 min - In-person', 'Daniel Lee', 'Leadership, Culture Add, Long-term Potential'],
]

const coverage = [
  ['Technical Skills', '90%', 'High'],
  ['Experience', '85%', 'High'],
  ['Communication', '80%', 'High'],
  ['Leadership', '45%', 'Low'],
  ['Culture Add', '70%', 'Medium'],
]

const recommendations = [
  ['Leadership is under-evaluated.', 'Add'],
  ['No question validates Power BI experience.', 'Add'],
  ['Culture Add has only one question.', 'Add'],
  ['Final interview exceeds 90 minutes.', 'Optimize'],
]

const questions = [
  ['Technical Skills', '5', 'High', '"Explain how you would reconcile a complex accounting discrepancy."', 'Medium', '92%'],
  ['Experience', '4', 'High', '"Tell me about a time you improved a financial process."', 'Medium', '88%'],
  ['Communication', '4', 'High', '"How do you explain financial information to non-finance stakeholders?"', 'Easy', '80%'],
  ['Leadership', '2', 'Low', '"Describe a time you led a team through a difficult change."', 'Medium', '42%'],
]

const scorecard = [
  ['Technical Skills', '30%', '5'],
  ['Experience', '20%', '4'],
  ['Problem Solving', '15%', '4'],
]

const interviewers = [
  ['Sarah Parker', 'Recruiter', 'Recruiter Screen', 'Good'],
  ['Michael Brown', 'Hiring Manager', 'Hiring Manager Interview', 'Good'],
  ['Daniel Lee', 'Department Head', 'Final Interview', 'Good'],
]

const flexibleItems = [
  'Created later',
  'Assigned to specific candidates',
  'Generated from candidate CVs',
  'Generated from interview stages',
  'Customized by interviewers',
]
</script>

<template>
  <section class="interview-step">
    <div class="interview-main">
      <section class="interview-banner panel">
        <div>
          <strong>AI Interview Kit generated from your previous inputs</strong>
          <p>This interview kit was generated using the information from the steps below to ensure alignment with your hiring goals and evaluation framework.</p>
        </div>
        <button type="button">Regenerate Kit</button>
      </section>

      <section class="interview-note panel">
        <div>
          <strong>Interview kit is optional</strong>
          <p>You can skip this step and configure interview kits later from the Candidate Profile or Interview Management section.</p>
        </div>
        <button type="button">Skip for now</button>
      </section>

      <div class="interview-grid">
        <section class="card panel">
          <div class="card__head">
            <strong>1 Interview Plan</strong>
            <button type="button">+ Add stage</button>
          </div>
          <div class="plan-list">
            <article v-for="[title, meta, owner, focus] in plan" :key="title">
              <div>
                <strong>{{ title }}</strong>
                <small>{{ meta }}</small>
                <p>Owner {{ owner }}</p>
              </div>
              <span>{{ focus }}</span>
            </article>
          </div>
        </section>

        <section class="card panel">
          <div class="card__head">
            <strong>2 Competency Coverage</strong>
            <button type="button">View details</button>
          </div>
          <div class="coverage-ring">
            <div class="coverage-ring__score">82%</div>
            <span>Overall coverage Good</span>
          </div>
          <div class="coverage-list">
            <article v-for="[label, percent, state] in coverage" :key="label">
              <span>{{ label }}</span>
              <div class="coverage-list__bar"><span :style="{ width: percent }" /></div>
              <strong>{{ percent }}</strong>
              <small>{{ state }}</small>
            </article>
          </div>
          <div class="coverage-warning">
            <span>Leadership coverage is low. Add 2-3 behavioural questions to improve coverage.</span>
            <button type="button">Generate questions</button>
          </div>
        </section>
      </div>

      <section class="card panel">
        <div class="card__head">
          <strong>3 Question Intelligence</strong>
          <div class="card__actions">
            <button type="button">+ Add question</button>
            <button class="primary-button" type="button">Generate with AI</button>
          </div>
        </div>
        <div class="question-table">
          <div class="question-table__header">
            <span>Competency</span>
            <span># Qs</span>
            <span>Coverage</span>
            <span>Example question</span>
            <span>Difficulty</span>
            <span>AI Score</span>
          </div>
          <article v-for="[competency, count, coverageState, question, difficulty, score] in questions" :key="competency" class="question-table__row">
            <span>{{ competency }}</span>
            <span>{{ count }}</span>
            <span>{{ coverageState }}</span>
            <span>{{ question }}</span>
            <span>{{ difficulty }}</span>
            <strong>{{ score }}</strong>
          </article>
        </div>
      </section>

      <div class="interview-grid">
        <section class="card panel">
          <div class="card__head">
            <strong>4 Scorecard Alignment</strong>
          </div>
          <div class="scorecard-table">
            <article v-for="[criterion, weight, mapped] in scorecard" :key="criterion">
              <span>{{ criterion }}</span>
              <strong>{{ weight }}</strong>
              <small>{{ mapped }}</small>
            </article>
          </div>
          <div class="alignment-note">Scorecard is aligned with the Review & Evaluation Framework.</div>
        </section>

        <section class="card panel">
          <div class="card__head">
            <strong>5 Interviewer Assignment</strong>
          </div>
          <div class="interviewer-list">
            <article v-for="[name, role, stage, state] in interviewers" :key="name">
              <div>
                <strong>{{ name }}</strong>
                <small>{{ role }}</small>
              </div>
              <span>{{ stage }}</span>
              <em>{{ state }}</em>
            </article>
          </div>
        </section>
      </div>
    </div>

    <aside class="interview-side">
      <section class="side-card panel">
        <div class="side-card__head">
          <strong>AI Interview Copilot</strong>
          <span>Beta</span>
        </div>
        <div class="side-readiness">
          <div class="side-readiness__ring">94%</div>
          <div>
            <strong>Interview Readiness</strong>
            <p>Great! Your interview process is well-structured and ready.</p>
          </div>
        </div>
        <div class="recommendation-list">
          <article v-for="[label, action] in recommendations" :key="label">
            <p>{{ label }}</p>
            <button type="button">{{ action }}</button>
          </article>
        </div>
      </section>

      <section class="side-card panel">
        <strong class="side-title">Flexible Setup</strong>
        <div class="simple-list">
          <article v-for="item in flexibleItems" :key="item">
            <AppIcon name="check" :size="12" />
            <span>{{ item }}</span>
          </article>
        </div>
        <button class="side-link" type="button">Learn more about flexible setup</button>
      </section>

      <section class="side-card side-card--soft panel">
        <strong class="side-title">No Interview Kit?</strong>
        <p>You can still publish this job. Interview kits can be generated automatically later when candidates enter interview stages.</p>
        <button type="button">Continue without kit</button>
        <button class="side-card__ghost" type="button">Save draft</button>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.interview-step,
.interview-main,
.interview-side,
.interview-grid,
.plan-list,
.coverage-list,
.recommendation-list,
.simple-list,
.interviewer-list {
  display: grid;
  gap: 18px;
}

.interview-step {
  grid-template-columns: minmax(0, 1fr) 290px;
  align-items: start;
}

.panel {
  border: 1px solid #e7edf7;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.04);
}

.interview-banner,
.interview-note,
.card__head,
.card__actions,
.plan-list article,
.coverage-warning,
.side-card__head,
.side-readiness,
.recommendation-list article,
.simple-list article,
.interviewer-list article {
  display: flex;
  align-items: center;
}

.interview-banner,
.interview-note,
.card__head,
.side-card__head {
  justify-content: space-between;
  gap: 16px;
}

.interview-banner,
.interview-note,
.card,
.side-card {
  padding: 22px;
}

.interview-banner {
  background: #f6f4ff;
}

.interview-note {
  background: #fff9eb;
}

.interview-banner strong,
.interview-note strong,
.card__head strong,
.side-title,
.side-readiness strong {
  color: #1f2b45;
  font-size: 16px;
}

.interview-banner p,
.interview-note p,
.side-card p,
.coverage-warning span {
  margin: 0;
  color: #70809a;
  font-size: 14px;
  line-height: 1.65;
}

.interview-banner button,
.interview-note button,
.card__head button,
.primary-button,
.recommendation-list button,
.side-card button {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #dce4f0;
  border-radius: 14px;
  color: #33415d;
  background: #fff;
  font-weight: 700;
}

.interview-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.plan-list article,
.coverage-list article,
.scorecard-table article,
.interviewer-list article {
  gap: 14px;
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
}

.plan-list strong,
.coverage-list strong,
.interviewer-list strong {
  display: block;
  color: #1f2b45;
}

.plan-list small,
.plan-list p,
.coverage-list span,
.coverage-list small,
.scorecard-table span,
.scorecard-table small,
.interviewer-list small,
.interviewer-list span,
.interviewer-list em {
  color: #70809a;
  font-size: 13px;
}

.plan-list p {
  margin: 6px 0 0;
}

.plan-list span {
  margin-left: auto;
  max-width: 210px;
  color: #4b5770;
  text-align: right;
}

.coverage-ring {
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.coverage-ring__score,
.side-readiness__ring {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1f2b45;
  font-size: 24px;
  font-weight: 800;
  border: 7px solid #22c55e;
}

.coverage-list article {
  display: grid;
  grid-template-columns: 1fr 1.2fr auto auto;
  align-items: center;
}

.coverage-list__bar {
  height: 8px;
  border-radius: 999px;
  background: #edf2f8;
  overflow: hidden;
}

.coverage-list__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e 0%, #38d17c 100%);
}

.coverage-warning {
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  padding: 16px;
  border-radius: 16px;
  background: #fff7eb;
}

.question-table {
  display: grid;
  gap: 0;
}

.question-table__header,
.question-table__row {
  display: grid;
  grid-template-columns: 1fr 0.5fr 0.7fr 2fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 14px 0;
  align-items: center;
}

.question-table__header {
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.question-table__row {
  border-top: 1px solid #edf2f8;
  color: #4b5770;
  font-size: 14px;
}

.question-table__row strong {
  color: #22c55e;
}

.scorecard-table,
.simple-list {
  display: grid;
  gap: 12px;
}

.scorecard-table article,
.interviewer-list article {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
}

.alignment-note {
  margin-top: 18px;
  padding: 16px;
  border-radius: 16px;
  color: #ef5da8;
  background: #fff6fb;
  font-weight: 700;
}

.interviewer-list em {
  color: #22c55e;
  font-style: normal;
  font-weight: 700;
}

.side-card__head span {
  padding: 4px 8px;
  border-radius: 999px;
  color: #6b5cff;
  background: #f1efff;
  font-size: 11px;
  font-weight: 700;
}

.side-readiness {
  gap: 16px;
}

.recommendation-list article {
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 16px;
}

.recommendation-list p {
  flex: 1;
}

.recommendation-list button {
  min-height: 34px;
  padding: 0 12px;
}

.simple-list article {
  gap: 10px;
  color: #5f6d86;
}

.side-link {
  border: 0 !important;
  padding: 0 !important;
  color: #5667ff !important;
  background: transparent !important;
  text-align: left;
}

.side-card--soft {
  background: #fff7eb;
}

.side-card__ghost {
  margin-top: 10px;
}

.primary-button {
  border: 0 !important;
  color: #fff !important;
  background: linear-gradient(90deg, #f95ba8 0%, #ef69c2 100%) !important;
}

@media (max-width: 1180px) {
  .interview-step {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .interview-grid,
  .question-table__header,
  .question-table__row {
    grid-template-columns: 1fr;
  }
}
</style>
