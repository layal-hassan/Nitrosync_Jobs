<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const plan = [
  ['Recruiter Screen', '30 min - Phone/Video', 'Sarah Parker (Recruiter)', 'Motivation, Communication, Availability', 'green'],
  ['Hiring Manager Interview', '60 min - Video Call', 'Michael Brown (Hiring Manager)', 'Technical Skills, Problem Solving, Ownership', 'orange'],
  ['Final Interview', '45 min - In-person', 'Daniel Lee (Department Head)', 'Leadership, Culture Add, Long-term Potential', 'blue'],
]

const coverage = [
  ['Technical Skills', '90%', 'High', 'green'],
  ['Experience', '85%', 'High', 'green'],
  ['Communication', '80%', 'High', 'green'],
  ['Leadership', '45%', 'Low', 'red'],
  ['Culture Add', '70%', 'Medium', 'orange'],
]

const recommendations = [
  ['Leadership is under-evaluated.', 'Add 2-3 behavioural questions.', 'Add', 'red'],
  ['No question validates Power BI experience.', 'Add a technical question.', 'Add', 'blue'],
  ['Culture Add has only one question.', 'Add one more question.', 'Add', 'violet'],
  ['Final interview exceeds 90 minutes.', 'Consider reducing by 15 minutes.', 'Optimize', 'orange'],
]

const questions = [
  ['Technical Skills', '5', 'High', '"Explain how you would reconcile a complex accounting discrepancy."', 'Medium', '92%'],
  ['Experience', '4', 'High', '"Tell me about a time you improved a financial process."', 'Medium', '88%'],
  ['Communication', '4', 'High', '"How do you explain financial information to non-finance stakeholders?"', 'Easy', '80%'],
  ['Leadership', '2', 'Low', '"Describe a time you led a team through a difficult culture shift."', 'Medium', '42%'],
]

const scorecard = [
  ['Technical Skills', '30%', '5', '(1-5)'],
  ['Experience', '20%', '4', '(1-5)'],
  ['Problem Solving', '15%', '4', '(1-5)'],
]

const interviewers = [
  ['Sarah Parker', 'Recruiter', 'Recruiter Screen', 'Backup: Emma Wilson', 'Good'],
  ['Michael Brown', 'Hiring Manager', 'Hiring Manager Interview', 'Backup: Priya Patel', 'Good'],
  ['Daniel Lee', 'Department Head', 'Final Interview', 'Backup: Anna Karlsson', 'Good'],
]

const flexibleItems = [
  'Created later',
  'Assigned to specific candidates',
  'Generated from candidate CVs',
  'Generated from interview stages',
  'Customized by interviewers',
]

const previewStages = [
  ['Recruiter Screen', '30 min - Phone/Video'],
  ['Hiring Manager Interview', '60 min - Video Call'],
  ['Final Interview', '45 min - In-person'],
]
</script>

<template>
  <section class="scratch-interview">
    <div class="scratch-interview__main">
      <header class="interview-hero">
        <div>
          <span class="interview-hero__eyebrow">Step 7 of 8</span>
          <div class="interview-hero__title">
            <h2>Interview Kit</h2>
            <b>Optional</b>
          </div>
          <p>Design a structured interview process with the right questions, evaluation criteria, and interviewers.</p>
        </div>

        <div class="interview-hero__actions">
          <button class="ghost-button" type="button">How it works</button>
          <button class="ghost-button" type="button">
            <AppIcon name="archive" :size="13" />
            Use template
            <AppIcon name="chevronDown" :size="13" />
          </button>
          <button class="primary-button primary-button--hero" type="button">
            <AppIcon name="bolt" :size="13" />
            AI Copilot
          </button>
        </div>
      </header>

      <section class="panel banner-card">
        <div class="banner-card__head">
          <span class="banner-card__icon"><AppIcon name="bolt" :size="15" /></span>
          <div class="banner-card__copy">
            <strong>AI Interview Kit generated from your previous inputs</strong>
            <p>This interview kit was generated using the information from the steps below to ensure alignment with your hiring goals and evaluation framework.</p>
          </div>
          <div class="banner-card__aside">
            <button type="button">Regenerate Kit</button>
            <button class="text-link" type="button">View source inputs</button>
          </div>
        </div>

        <div class="banner-card__links">
          <span><i /> Job Requirements</span>
          <span><i /> Pipeline Stages</span>
          <span><i /> Review &amp; Evaluation Framework</span>
          <span><i /> Competencies &amp; Scorecards</span>
        </div>
      </section>

      <section class="panel note-card">
        <div class="note-card__copy">
          <span class="note-card__icon"><AppIcon name="alert" :size="14" /></span>
          <div>
          <strong>Interview kit is optional</strong>
          <p>You can skip this step and configure interview kits later from the Candidate Profile or Interview Management section.</p>
          </div>
        </div>
        <button type="button">Skip for now</button>
      </section>

      <div class="top-grid">
        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="section-badge">1</span>
              <strong>Interview Plan</strong>
            </div>
            <button class="mini-button" type="button">+ Add stage</button>
          </div>

          <p>Define your interview stages, owners, duration and focus areas.</p>

          <div class="plan-list">
            <article v-for="[title, meta, owner, focus, tone] in plan" :key="title">
              <span class="plan-list__icon" :class="`tone-${tone}`"><AppIcon name="user" :size="13" /></span>
              <div>
                <strong>{{ title }}</strong>
                <small>{{ meta }}</small>
                <p>Owner <b>{{ owner }}</b></p>
              </div>
              <div class="plan-list__focus">
                <span>Focus</span>
                <b>{{ focus }}</b>
              </div>
            </article>
          </div>

          <div class="card__meta-row">
            <span>Total interviews: <b>3</b></span>
            <span>Total duration: <b>2h 15m</b></span>
            <span>Estimated process time: <b>14 days</b></span>
          </div>
        </section>

        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="section-badge">2</span>
              <strong>Competency Coverage</strong>
            </div>
            <button class="text-link" type="button">View details</button>
          </div>

          <p>Ensure all key competencies are evaluated with the right depth.</p>

          <div class="coverage-layout">
            <div class="coverage-ring">
              <div class="coverage-ring__score">82%</div>
              <span>Overall coverage</span>
              <b>Good</b>
            </div>

            <div class="coverage-list">
              <article v-for="[label, value, state, tone] in coverage" :key="label">
                <span>{{ label }}</span>
                <div class="coverage-list__bar"><i :class="`tone-${tone}`" :style="{ width: value }" /></div>
                <strong>{{ value }}</strong>
                <small :class="`tone-${tone}`">{{ state }}</small>
              </article>
            </div>
          </div>

          <div class="warning-box">
            <span>Leadership coverage is low. Add 2-3 behavioural questions to improve coverage.</span>
            <button type="button">Generate questions</button>
          </div>
        </section>
      </div>

      <section class="panel card">
        <div class="card__head">
          <div class="card__title">
            <span class="section-badge">3</span>
            <strong>Question Intelligence</strong>
          </div>
          <div class="card__actions">
            <button class="mini-button" type="button">+ Add question</button>
            <button class="primary-button" type="button">Generate with AI</button>
          </div>
        </div>

        <p>AI maps questions to competencies and identifies coverage gaps.</p>

        <div class="question-table">
          <header>
            <span>Competency</span>
            <span># Qs</span>
            <span>Coverage</span>
            <span>Example Question</span>
            <span>Difficulty</span>
            <span>AI Score</span>
          </header>

          <article v-for="[competency, count, coverageState, question, difficulty, score] in questions" :key="competency">
            <span class="question-table__competency" :class="{ 'is-low': competency === 'Leadership' }">
              <i />
              {{ competency }}
            </span>
            <span>{{ count }}</span>
            <b :class="{ 'is-low': coverageState === 'Low' }">{{ coverageState }}</b>
            <span>{{ question }}</span>
            <small class="question-table__pill">{{ difficulty }}</small>
            <strong :class="{ 'is-low': score === '42%' }">{{ score }}</strong>
          </article>
        </div>

        <button class="text-link text-link--with-icon" type="button">
          Manage question bank
          <AppIcon name="chevronRight" :size="13" />
        </button>
      </section>

      <div class="bottom-grid">
        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="section-badge">4</span>
              <strong>Scorecard Alignment</strong>
            </div>
          </div>

          <p>Each question is mapped to scorecard criteria.</p>

          <div class="scorecard-table">
            <header>
              <span>Criterion</span>
              <span>Weight</span>
              <span>Mapped</span>
              <span>Rating Scale</span>
            </header>

            <article v-for="[criterion, weight, mapped, scale] in scorecard" :key="criterion">
              <span>{{ criterion }}</span>
              <strong>{{ weight }}</strong>
              <span>{{ mapped }}</span>
              <small>{{ scale }}</small>
            </article>
          </div>

          <div class="alignment-note">
            <AppIcon name="bolt" :size="13" />
            <span>Scorecard is aligned with the Review &amp; Evaluation Framework.</span>
            <button class="text-link text-link--with-icon" type="button">
              View framework
              <AppIcon name="chevronRight" :size="13" />
            </button>
          </div>
        </section>

        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="section-badge">5</span>
              <strong>Interviewer Assignment</strong>
            </div>
          </div>

          <p>Assign the right interviewers with balanced workload.</p>

          <div class="interviewer-list">
            <article v-for="[name, role, stage, backup, state] in interviewers" :key="name">
              <div class="interviewer-list__person">
                <span class="avatar" />
                <div>
                  <strong>{{ name }}</strong>
                  <small>{{ role }}</small>
                </div>
              </div>
              <b>{{ stage }}</b>
              <span>{{ backup }}</span>
              <em>{{ state }}</em>
            </article>
          </div>
        </section>
      </div>

      <section class="panel card preview-card">
        <div class="card__head">
          <div class="card__title">
            <span class="section-badge">6</span>
            <strong>Interview Experience Preview</strong>
          </div>
        </div>

        <p>This is what candidates will experience.</p>

        <div class="preview-card__layout">
          <div class="preview-stages">
            <article v-for="(item, index) in previewStages" :key="item[0]">
              <span class="preview-stages__number">{{ index + 1 }}</span>
              <strong>{{ item[0] }}</strong>
              <small>{{ item[1] }}</small>
            </article>
          </div>

          <div class="preview-metrics">
            <article>
              <small>Estimated Process Time</small>
              <strong>14 days</strong>
            </article>
            <article>
              <small>Candidate Experience Score</small>
              <strong>8.7 / 10</strong>
              <b>Good</b>
            </article>
          </div>
        </div>

        <div class="preview-insight">
          <AppIcon name="bolt" :size="13" />
          <span>AI Insight: Process length is within the optimal range.</span>
        </div>
      </section>
    </div>

    <aside class="scratch-interview__side">
      <section class="panel side-card">
        <div class="side-card__head">
          <div class="side-card__title">
            <AppIcon name="bolt" :size="13" />
            <strong>AI Interview Copilot</strong>
          </div>
          <span class="beta-badge">Beta</span>
        </div>

        <p>AI has reviewed your interview kit and found opportunities to improve quality.</p>

        <div class="readiness-box">
          <div class="readiness-ring">94%</div>
          <div>
            <strong>Interview Readiness</strong>
            <span>Great! Your interview process is well-structured and ready.</span>
            <button type="button" class="text-link text-link--with-icon">
              View readiness breakdown
              <AppIcon name="chevronRight" :size="13" />
            </button>
          </div>
        </div>

        <div class="recommendation-list">
          <small class="recommendation-list__label">Top Recommendations</small>
          <article v-for="[title, note, action, tone] in recommendations" :key="title">
            <span class="recommendation-list__icon" :class="`tone-${tone}`"><AppIcon name="alert" :size="13" /></span>
            <div>
              <strong>{{ title }}</strong>
              <p>{{ note }}</p>
            </div>
            <button type="button">{{ action }}</button>
          </article>
        </div>
      </section>

      <section class="panel side-card side-card--soft-blue">
        <div class="side-card__title side-card__title--neutral">
          <span class="soft-icon"><AppIcon name="lock" :size="13" /></span>
          <strong>Flexible Setup</strong>
        </div>

        <p>Interview kits can also be:</p>
        <ul class="simple-list">
          <li v-for="item in flexibleItems" :key="item">
            <AppIcon name="check" :size="12" />
            {{ item }}
          </li>
        </ul>

        <button class="text-link text-link--with-icon" type="button">
          Learn more about flexible setup
          <AppIcon name="chevronRight" :size="13" />
        </button>
      </section>

      <section class="panel side-card side-card--soft-warning">
        <div class="side-card__title side-card__title--neutral">
          <span class="soft-icon soft-icon--warning"><AppIcon name="alert" :size="13" /></span>
          <strong>No Interview Kit?</strong>
        </div>

        <p>You can still publish this job. Interview kits can be generated automatically later when candidates enter interview stages.</p>

        <button class="outline-button outline-button--full" type="button">Continue without kit</button>
        <button class="ghost-button ghost-button--full" type="button">Save draft</button>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.scratch-interview {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 268px;
  gap: 22px;
  align-items: start;
}

.scratch-interview__main,
.scratch-interview__side,
.top-grid,
.bottom-grid,
.plan-list,
.coverage-list,
.recommendation-list,
.simple-list,
.interviewer-list,
.question-table,
.scorecard-table {
  display: grid;
  gap: 18px;
}

.top-grid,
.bottom-grid {
  grid-template-columns: 1fr 1fr;
}

.scratch-interview__side {
  position: sticky;
  top: 16px;
  align-content: start;
}

.interview-hero,
.interview-hero__actions,
.banner-card__head,
.note-card,
.card__head,
.card__title,
.card__actions,
.plan-list article,
.card__meta-row,
.coverage-layout,
.warning-box,
.preview-card__layout,
.interviewer-list article,
.side-card__head,
.side-card__title,
.readiness-box,
.recommendation-list article,
.simple-list li,
.preview-insight {
  display: flex;
}

.interview-hero,
.banner-card__head,
.note-card,
.card__head,
.side-card__head {
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.interview-hero__eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  color: #7f8ba0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.interview-hero__title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.interview-hero h2 {
  margin: 0;
  color: #1d2640;
  font-size: 32px;
  font-weight: 800;
}

.interview-hero__title b {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  color: #6b5cff;
  background: #f1efff;
  font-size: 11px;
  font-weight: 700;
}

.interview-hero p,
.banner-card p,
.note-card p,
.card p,
.recommendation-list p,
.side-card p,
.preview-insight span {
  margin: 0;
  color: #70809a;
  font-size: 14px;
  line-height: 1.6;
}

.interview-hero__actions {
  gap: 10px;
}

.panel {
  border: 1px solid #e7edf7;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
}

.banner-card,
.note-card,
.card,
.side-card {
  padding: 18px;
}

.banner-card {
  background: #f7f4ff;
}

.banner-card__icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef5da8;
  background: #fff;
}

.banner-card__copy {
  flex: 1;
}

.banner-card__aside {
  display: grid;
  justify-items: end;
  gap: 8px;
}

.banner-card button,
.note-card button,
.ghost-button,
.mini-button,
.primary-button,
.outline-button,
.recommendation-list button {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dce4f0;
  border-radius: 12px;
  color: #33415d;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
}

.primary-button--hero {
  min-height: 38px;
  padding: 0 16px;
}

.banner-card__links {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  color: #5f6d86;
  font-size: 13px;
}

.banner-card__links span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.banner-card__links i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background: #10b981;
}

.note-card {
  align-items: center;
  background: #fff9eb;
}

.note-card__copy {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.note-card__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  background: #fff2d9;
  flex-shrink: 0;
}

.card__title {
  align-items: center;
  gap: 8px;
}

.card__title strong,
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
  color: #9aa6bb;
  background: #f5f7fb;
  font-size: 12px;
  font-weight: 800;
}

.mini-button {
  color: #5667ff;
}

.text-link {
  border: 0;
  padding: 0;
  color: #5667ff;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.text-link--with-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.plan-list article {
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #edf2f8;
}

.plan-list article:last-child {
  border-bottom: 0;
}

.plan-list__icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.plan-list strong,
.interviewer-list strong {
  display: block;
  color: #1f2b45;
}

.plan-list small,
.plan-list p,
.plan-list span,
.plan-list b,
.coverage-list span,
.coverage-list small,
.question-table span,
.question-table small,
.scorecard-table span,
.scorecard-table small,
.interviewer-list small,
.interviewer-list span,
.interviewer-list em {
  color: #70809a;
  font-size: 12px;
}

.plan-list p {
  margin: 8px 0 0;
}

.plan-list__focus {
  margin-left: auto;
  max-width: 150px;
  display: grid;
  gap: 4px;
  text-align: left;
}

.plan-list__focus span {
  text-transform: uppercase;
}

.card__meta-row {
  margin-top: 8px;
  justify-content: space-between;
  gap: 10px;
  color: #8b97ad;
  font-size: 12px;
}

.coverage-layout {
  align-items: center;
  gap: 18px;
}

.coverage-ring {
  width: 124px;
  height: 124px;
  border-radius: 50%;
  display: grid;
  justify-items: center;
  align-content: center;
  background:
    radial-gradient(#fff 58%, transparent 60%),
    conic-gradient(#10b981 0deg 295deg, #eef2f8 295deg 360deg);
}

.coverage-ring__score {
  color: #1f2b45;
  font-size: 32px;
  font-weight: 800;
}

.coverage-ring span,
.coverage-ring b {
  font-size: 12px;
}

.coverage-list {
  flex: 1;
}

.coverage-list article {
  display: grid;
  grid-template-columns: 1fr 1.2fr auto auto;
  gap: 10px;
  align-items: center;
}

.coverage-list__bar {
  height: 6px;
  border-radius: 999px;
  background: #edf2f8;
  overflow: hidden;
}

.coverage-list__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: currentColor;
}

.tone-green { color: #10b981; background: #effcf3; }
.tone-orange { color: #f59e0b; background: #fff7ed; }
.tone-blue { color: #4f7ef6; background: #eef4ff; }
.tone-red { color: #ef4444; background: #fff1f2; }
.tone-violet { color: #8b5cf6; background: #f5f0ff; }

.warning-box {
  margin-top: 16px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  background: #fff7eb;
}

.question-table header,
.question-table article,
.scorecard-table header,
.scorecard-table article {
  display: grid;
  align-items: center;
}

.question-table header,
.question-table article {
  grid-template-columns: 1fr 0.5fr 0.7fr 2fr 0.8fr 0.8fr;
  gap: 14px;
}

.question-table header,
.scorecard-table header {
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.question-table article {
  padding: 12px 0;
  border-top: 1px solid #edf2f8;
  color: #4b5770;
  font-size: 13px;
}

.question-table__competency {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.question-table__competency i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  background: #10b981;
}

.question-table__competency.is-low i {
  background: #ef4444;
}

.question-table b {
  width: fit-content;
  min-height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #effcf3;
}

.question-table b.is-low,
.question-table strong.is-low {
  color: #ef4444;
}

.question-table b.is-low {
  background: #fff1f2;
}

.question-table strong {
  color: #22c55e;
}

.question-table__pill {
  width: fit-content;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #6f7d95;
  background: #f4f6fa;
}

.bottom-grid {
  align-items: start;
}

.scorecard-table {
  gap: 0;
}

.scorecard-table header,
.scorecard-table article {
  grid-template-columns: 1.2fr 0.7fr 0.6fr 0.8fr;
  gap: 12px;
}

.scorecard-table article {
  padding: 12px 0;
  border-top: 1px solid #edf2f8;
}

.alignment-note {
  margin-top: 16px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  border-radius: 14px;
  color: #ef5da8;
  background: #fff6fb;
  font-weight: 700;
}

.interviewer-list article {
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid #edf2f8;
}

.interviewer-list article:first-child {
  border-top: 0;
}

.interviewer-list__person {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-block;
  background: linear-gradient(135deg, #b45309 0%, #fde68a 100%);
}

.interviewer-list b {
  color: #5667ff;
  font-size: 12px;
}

.interviewer-list em {
  color: #22c55e;
  font-style: normal;
  font-weight: 700;
}

.preview-card__layout {
  margin-top: 12px;
  gap: 18px;
}

.preview-stages {
  display: grid;
  gap: 14px;
  min-width: 240px;
}

.preview-stages article {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
}

.preview-stages__number {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5667ff;
  background: #eef1ff;
  font-size: 11px;
  font-weight: 700;
}

.preview-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  flex: 1;
}

.preview-metrics article {
  min-height: 108px;
  padding: 18px;
  border-radius: 18px;
  background: #fbfcff;
}

.preview-metrics small {
  color: #a0acbe;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.preview-metrics strong {
  display: block;
  margin-top: 12px;
  color: #1f2b45;
  font-size: 32px;
  font-weight: 800;
}

.preview-metrics b {
  color: #10b981;
  font-size: 13px;
}

.preview-insight {
  margin-top: 16px;
  align-items: center;
  gap: 8px;
  color: #5667ff;
}

.side-card__title {
  align-items: center;
  gap: 8px;
  color: #ef5da8;
}

.beta-badge {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  color: #ef5da8;
  background: #fff0f7;
  font-size: 11px;
  font-weight: 700;
}

.readiness-box {
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
    conic-gradient(#10b981 0deg 338deg, #e8eef7 338deg 360deg);
}

.readiness-box > div:last-child {
  min-width: 0;
  flex: 1;
}

.readiness-box strong {
  display: block;
  margin: 4px 0 6px;
}

.readiness-box span {
  display: block;
  color: #70809a;
  font-size: 13px;
  line-height: 1.5;
}

.readiness-box button,
.recommendation-list button {
  border: 0;
  padding: 0;
  color: #5667ff;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
}

.recommendation-list article {
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
}

.recommendation-list__label {
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.recommendation-list__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recommendation-list strong {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
}

.recommendation-list article > div {
  flex: 1;
}

.side-card--soft-blue {
  background: #f5f8ff;
}

.side-card--soft-warning {
  background: #fff8ef;
}

.side-card__title--neutral {
  color: #1f2b45;
}

.soft-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b5cff;
  background: #eef1ff;
}

.soft-icon--warning {
  color: #f59e0b;
  background: #fff1df;
}

.simple-list {
  margin: 12px 0;
  padding: 0;
  list-style: none;
}

.simple-list li {
  align-items: center;
  gap: 8px;
  color: #5f6d86;
  font-size: 13px;
}

.simple-list li :deep(svg) {
  color: #22c55e;
}

.outline-button--full,
.ghost-button--full {
  width: 100%;
}

.ghost-button--full {
  margin-top: 10px;
}

@media (max-width: 1180px) {
  .scratch-interview {
    grid-template-columns: 1fr;
  }

  .scratch-interview__side {
    position: static;
  }
}

@media (max-width: 900px) {
  .top-grid,
  .bottom-grid,
  .preview-card__layout,
  .question-table header,
  .question-table article,
  .scorecard-table header,
  .scorecard-table article {
    grid-template-columns: 1fr;
  }

  .interview-hero,
  .interview-hero__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
