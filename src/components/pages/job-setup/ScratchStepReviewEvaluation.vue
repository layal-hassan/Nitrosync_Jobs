<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const successProfile = [
  ['IFRS Experience', 'Critical', 'red', 'document'],
  ['Accounting Degree', 'Critical', 'red', 'copy'],
  ['Excel Skills', 'High', 'orange', 'edit'],
]

const evaluationCategories = [
  ['Experience', 30, 'yellow'],
  ['Skills', 25, 'blue'],
  ['Communication', 15, 'orange'],
]

const disqualificationRules = [
  'No Work Permit / Authorization',
  'Missing Required Certification',
  'Experience less than 3 years',
]

const reviewAreas = [
  ['Initial Review', 'Recruiter', '+2'],
  ['Technical Review', 'Hiring Manager', '+1'],
]

const decisionLevels = [
  ['Strong Hire', '≥ 85%', 'Manager + Head', 'green'],
  ['Hire', '70% - 84%', 'Manager', 'blue'],
  ['Mixed', '50% - 69%', 'Manager', 'orange'],
]

const aiSuggestions = [
  ['Missing work authorization requirement.', 'Recommended to add as a red flag.', 'Add', 'orange'],
  ['Communication weight appears low.', 'Top performers in similar roles score high on communication.', 'Adjust', 'green'],
  ['No leadership assessment configured.', 'Consider adding a leadership attribute.', 'Add', 'violet'],
]

const outcomeItems = [
  'Candidates will be evaluated consistently',
  'Compared fairly using objective criteria',
  'Reviewed by the right stakeholders',
  'Ranked and ready for pipeline progression',
]

const insightCards = [
  ['Top performers in similar Finance roles have strong IFRS and Excel skills.', 'View benchmark', 'blue'],
  ['Candidates with 5+ years experience increased retention by 28%.', 'View insight', 'green'],
  ['Communication scores are the top predictor of hiring manager satisfaction.', 'View insight', 'sky'],
]
</script>

<template>
  <section class="scratch-evaluation">
    <div class="scratch-evaluation__main">
      <header class="eval-hero">
        <div>
          <span class="eval-hero__eyebrow">Step 5 of 8</span>
          <h2>
            Review &amp; Evaluation Framework
            <AppIcon name="sparkles" :size="18" />
          </h2>
          <p>Define what great candidates look like, how they will be evaluated, and how your team will make consistent hiring decisions.</p>
        </div>

        <div class="eval-hero__actions">
          <button class="ghost-button" type="button">
            <AppIcon name="info" :size="14" />
            How it works
          </button>
          <button class="ghost-button ghost-button--violet" type="button">
            <AppIcon name="bolt" :size="14" />
            AI Copilot
          </button>
        </div>
      </header>

      <div class="top-grid">
        <section class="panel card profile-card">
          <div class="card__head">
            <div class="card__title">
              <span class="card__badge">1</span>
              <strong>Candidate Success Profile</strong>
              <AppIcon name="info" :size="14" />
            </div>
            <p>What attributes are most important for success in this role?</p>
          </div>

          <div class="profile-table">
            <header>
              <span>Attribute</span>
              <span>Importance</span>
            </header>

            <article v-for="[label, importance, tone, icon] in successProfile" :key="label">
              <div class="profile-table__label">
                <span class="drag-handle" />
                <span class="skill-icon" :class="`tone-${tone}`"><AppIcon :name="icon" :size="13" /></span>
                <strong>{{ label }}</strong>
              </div>
              <div class="profile-table__importance">
                <button type="button">
                  <span class="status-dot" :class="`tone-${tone}`" />
                  {{ importance }}
                  <AppIcon name="chevronDown" :size="13" />
                </button>
                <button class="icon-button" type="button"><AppIcon name="trash" :size="13" /></button>
              </div>
            </article>
          </div>

          <div class="card__footer">
            <button class="text-button" type="button">+ Add attribute</button>
            <button class="pink-button" type="button">
              <AppIcon name="bolt" :size="13" />
              AI Suggest profile
            </button>
          </div>
        </section>

        <section class="panel card framework-card">
          <div class="card__head">
            <div class="card__title">
              <span class="card__badge">2</span>
              <strong>Evaluation Framework</strong>
              <AppIcon name="info" :size="14" />
            </div>
            <p>How will candidates be evaluated?</p>
          </div>

          <div class="framework-table">
            <header>
              <span>Category</span>
              <span>Weight</span>
            </header>

            <article v-for="[label, weight, tone] in evaluationCategories" :key="label">
              <div class="framework-table__label">
                <span class="skill-icon" :class="`tone-${tone}`"><AppIcon name="bolt" :size="12" /></span>
                <strong>{{ label }}</strong>
              </div>
              <div class="framework-table__weight">
                <div class="mini-bar"><span :style="{ width: `${weight * 2.4}px` }" /></div>
                <button type="button">{{ weight }} %</button>
              </div>
            </article>
          </div>

          <div class="framework-card__footer">
            <button class="text-button" type="button">+ Add category</button>
            <strong>Total <span>100%</span></strong>
          </div>
        </section>
      </div>

      <div class="middle-grid">
        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="card__badge">3</span>
              <strong>Disqualification Rules</strong>
              <AppIcon name="info" :size="14" />
            </div>
            <p>Automatically disqualify candidates who don't meet these criteria.</p>
          </div>

          <div class="rule-list">
            <article v-for="item in disqualificationRules" :key="item">
              <span>{{ item }}</span>
              <button type="button"><AppIcon name="close" :size="12" /></button>
            </article>
          </div>

          <div class="card__footer">
            <button class="text-button" type="button">+ Add rule</button>
            <button class="soft-pink-button" type="button">
              <AppIcon name="bolt" :size="13" />
              AI Suggest red flags
            </button>
          </div>
        </section>

        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="card__badge">4</span>
              <strong>Human Review Team</strong>
              <AppIcon name="info" :size="14" />
            </div>
            <p>Who will review and make decisions during the hiring process?</p>
          </div>

          <div class="review-table">
            <header>
              <span>Review Area</span>
              <span>Primary Owner</span>
              <span>Collaborators</span>
            </header>

            <article v-for="[area, owner, collab] in reviewAreas" :key="area">
              <span>{{ area }}</span>
              <div class="owner-cell">
                <span class="avatar avatar--dark" />
                <b>{{ owner }}</b>
              </div>
              <div class="owner-cell">
                <span class="avatar avatar--mix" />
                <b>{{ collab }}</b>
              </div>
            </article>
          </div>

          <button class="text-button" type="button">+ Add reviewer</button>
        </section>

        <section class="panel card">
          <div class="card__head">
            <div class="card__title">
              <span class="card__badge">5</span>
              <strong>Hiring Decision Framework</strong>
              <AppIcon name="info" :size="14" />
            </div>
            <p>How should candidates be classified?</p>
          </div>

          <div class="decision-table">
            <header>
              <span>Decision Level</span>
              <span>Score</span>
              <span>Approval</span>
            </header>

            <article v-for="[label, score, approval, tone] in decisionLevels" :key="label" :class="`tone-${tone}`">
              <span>{{ label }}</span>
              <span>{{ score }}</span>
              <span>{{ approval }}</span>
            </article>
          </div>

          <button class="text-button" type="button">+ Add decision level</button>
        </section>
      </div>

      <section class="panel insights-panel">
        <div class="insights-panel__head">
          <strong><AppIcon name="bolt" :size="14" /> AI Insights</strong>
          <span>Leverage data from similar roles and past hires.</span>
        </div>

        <div class="insight-grid">
          <article v-for="[copy, action, tone] in insightCards" :key="copy" class="insight-card" :class="`insight-card--${tone}`">
            <span class="insight-card__icon"><AppIcon :name="tone === 'green' ? 'users' : tone === 'sky' ? 'mail' : 'chart-bars'" :size="15" /></span>
            <p>{{ copy }}</p>
            <button type="button">{{ action }} →</button>
          </article>
        </div>
      </section>
    </div>

    <aside class="scratch-evaluation__side">
      <section class="panel side-card">
        <div class="side-card__head">
          <div class="side-card__title">
            <AppIcon name="bolt" :size="14" />
            <strong>AI Hiring Copilot</strong>
          </div>
          <span class="beta-badge">Beta</span>
        </div>

        <div class="readiness-block">
          <div class="readiness-ring">89%</div>
          <div>
            <p>Framework readiness</p>
            <strong>Great job! Your evaluation framework is almost ready.</strong>
            <button type="button">View full analysis →</button>
          </div>
        </div>

        <div class="suggestion-list">
          <article v-for="[title, note, action, tone] in aiSuggestions" :key="title" class="suggestion-card">
            <span class="suggestion-card__icon" :class="`tone-${tone}`"><AppIcon name="alert" :size="13" /></span>
            <div>
              <strong>{{ title }}</strong>
              <p>{{ note }}</p>
            </div>
            <button type="button">{{ action }}</button>
          </article>
        </div>

        <button class="apply-button" type="button">
          <AppIcon name="bolt" :size="13" />
          Apply all suggestions
        </button>
      </section>

      <section class="panel side-card predictor-card">
        <div class="side-card__head">
          <strong>Candidate Quality Predictor</strong>
          <AppIcon name="info" :size="14" />
        </div>
        <p>Based on your current framework</p>

        <div class="predictor-grid">
          <article>
            <small>Match Accuracy</small>
            <strong>91%</strong>
            <span class="ok">High</span>
          </article>
          <article>
            <small>False Positive Risk</small>
            <strong>Low</strong>
            <span class="ok">Good</span>
          </article>
          <article>
            <small>False Negative Risk</small>
            <strong>Medium</strong>
            <span class="warn">Monitor</span>
          </article>
        </div>
      </section>

      <section class="panel side-card outcome-card">
        <div class="side-card__head">
          <div class="side-card__title">
            <span class="card__badge card__badge--violet">?</span>
            <strong>Outcome of this stage</strong>
          </div>
        </div>

        <ul>
          <li v-for="item in outcomeItems" :key="item">
            <AppIcon name="check" :size="13" />
            {{ item }}
          </li>
        </ul>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.scratch-evaluation {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 352px;
  gap: 24px;
  align-items: start;
}

.scratch-evaluation__main,
.scratch-evaluation__side {
  display: grid;
  gap: 22px;
  align-content: start;
}

.scratch-evaluation__side {
  position: sticky;
  top: 16px;
}

.eval-hero,
.eval-hero__actions,
.card__title,
.profile-table__label,
.profile-table__importance,
.review-table article,
.review-table header,
.decision-table header,
.decision-table article,
.insights-panel__head,
.side-card__head,
.side-card__title,
.readiness-block,
.suggestion-card,
.predictor-grid,
.outcome-card li {
  display: flex;
}

.eval-hero {
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.eval-hero__eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: #7c8799;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.eval-hero h2 {
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1d2640;
  font-size: 32px;
  line-height: 1.15;
  font-weight: 800;
}

.eval-hero p,
.card__head p,
.side-card p,
.suggestion-card p,
.insight-card p {
  margin: 0;
  color: #71809a;
  font-size: 15px;
  line-height: 1.6;
}

.eval-hero__actions {
  gap: 10px;
  flex-shrink: 0;
}

.ghost-button,
.pink-button,
.soft-pink-button,
.apply-button {
  border: 1px solid #dde5f1;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
}

.ghost-button {
  min-height: 58px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #33415d;
  background: #fff;
}

.eval-hero__actions .ghost-button {
  min-width: 144px;
  white-space: nowrap;
  flex-shrink: 0;
}

.ghost-button--violet {
  color: #6b5cff;
}

.panel {
  border: 1px solid #e7edf7;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
}

.top-grid,
.middle-grid {
  display: grid;
  gap: 22px;
}

.top-grid {
  grid-template-columns: 1fr 1fr;
}

.middle-grid {
  grid-template-columns: 1fr 1fr 1fr;
}

.card,
.side-card,
.insights-panel {
  padding: 20px;
}

.card__head {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.card__title {
  align-items: center;
  gap: 8px;
  color: #1f2a44;
}

.card__title strong,
.side-card strong,
.insights-panel__head strong {
  color: #1f2a44;
  font-size: 17px;
  font-weight: 800;
}

.card__badge {
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

.card__badge--violet {
  border-radius: 50%;
}

.profile-table,
.framework-table,
.review-table,
.decision-table,
.rule-list,
.suggestion-list {
  display: grid;
  gap: 12px;
}

.profile-table header,
.framework-table header,
.review-table header,
.decision-table header {
  display: grid;
  color: #a0acbe;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.profile-table header,
.profile-table article {
  display: grid;
  grid-template-columns: 1.2fr 180px;
  align-items: center;
}

.profile-table article {
  min-height: 44px;
}

.profile-table__label {
  align-items: center;
  gap: 12px;
}

.profile-table__label strong,
.framework-table__label strong {
  font-size: 15px;
  font-weight: 500;
  color: #33415d;
}

.profile-table__importance {
  justify-content: space-between;
  gap: 10px;
}

.profile-table__importance > button:first-child {
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid #dbe3ef;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #33415d;
  background: #fff;
  font-size: 14px;
}

.icon-button {
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #c4cddd;
  background: transparent;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.tone-red { color: #ef4444; background: #fef2f2; }
.tone-orange { color: #f97316; background: #fff7ed; }
.tone-yellow { color: #f59e0b; background: #fffbeb; }
.tone-blue { color: #4f7ef6; background: #eef4ff; }
.tone-green { color: #22c55e; background: #effcf3; }
.tone-violet { color: #8b5cf6; background: #f5f0ff; }
.tone-sky { color: #38bdf8; background: #effbff; }

.status-dot.tone-red { background: #ef4444; }
.status-dot.tone-orange { background: #f97316; }

.drag-handle {
  width: 8px;
  height: 18px;
  background-image: radial-gradient(#cfd7e4 1px, transparent 1px);
  background-size: 4px 4px;
}

.skill-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.card__footer,
.framework-card__footer {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.text-button,
.pink-button,
.soft-pink-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.text-button {
  border: 0;
  padding: 0;
  color: #ff68b5;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
}

.pink-button,
.soft-pink-button {
  min-height: 32px;
  padding: 0 14px;
}

.pink-button {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f562ae 0%, #ef69bf 100%);
}

.soft-pink-button {
  color: #f062ad;
  background: #fff5fa;
  border-color: #ffd9ea;
}

.framework-table header,
.framework-table article {
  display: grid;
  grid-template-columns: 1fr 180px;
  align-items: center;
}

.framework-table__label,
.framework-table__weight {
  display: flex;
  align-items: center;
  gap: 12px;
}

.framework-table__weight {
  justify-content: space-between;
}

.mini-bar {
  width: 100px;
  height: 6px;
  border-radius: 999px;
  background: #edf1f8;
}

.mini-bar span {
  height: 100%;
  border-radius: inherit;
  display: block;
  background: linear-gradient(90deg, #6b5cff 0%, #4f7ef6 100%);
}

.framework-table__weight button {
  min-width: 46px;
  min-height: 30px;
  border: 1px solid #dce4f0;
  border-radius: 8px;
  color: #66758d;
  background: #fff;
}

.framework-card__footer strong {
  color: #71809a;
  font-size: 14px;
}

.framework-card__footer strong span {
  color: #10b981;
}

.rule-list article {
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid #ffd9df;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ef4444;
  background: #fff5f6;
  font-size: 14px;
}

.rule-list article button {
  border: 0;
  padding: 0;
  color: #ef4444;
  background: transparent;
}

.review-table header,
.review-table article,
.decision-table header,
.decision-table article {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  align-items: center;
}

.review-table span,
.decision-table span,
.review-table b {
  color: #63728b;
  font-size: 13px;
}

.owner-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-block;
}

.avatar--dark { background: linear-gradient(135deg, #334155 0%, #0f172a 100%); }
.avatar--mix { background: linear-gradient(135deg, #b45309 0%, #93c5fd 100%); }

.decision-table article {
  min-height: 24px;
  padding: 0 10px;
  border-radius: 4px;
}

.decision-table article.tone-green { background: #effcf3; }
.decision-table article.tone-blue { background: #eef4ff; }
.decision-table article.tone-orange { background: #fff4e8; }

.insights-panel__head {
  align-items: center;
  gap: 10px;
}

.insights-panel__head span {
  color: #9aa6bb;
  font-size: 14px;
}

.insight-grid {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.insight-card {
  min-height: 120px;
  padding: 18px;
  border-radius: 16px;
  background: #f8fbff;
}

.insight-card--green { background: #f0fbf6; }
.insight-card--sky { background: #f4f9ff; }

.insight-card__icon {
  width: 34px;
  height: 34px;
  margin-bottom: 16px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b5cff;
  background: #eef1ff;
}

.insight-card button,
.readiness-block button {
  border: 0;
  padding: 0;
  color: #4f46e5;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.side-card__head {
  align-items: center;
  justify-content: space-between;
  gap: 10px;
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
  background: #eef1ff;
  font-size: 11px;
  font-weight: 700;
}

.readiness-block {
  margin-top: 22px;
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  padding: 16px;
  border: 1px solid #eef2f8;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
}

.readiness-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #1f2a44;
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.08);
  background:
    radial-gradient(#fff 60%, transparent 61%),
    conic-gradient(#10b981 0deg 320deg, #e8f0f7 320deg 360deg);
}

.readiness-block > div:last-child {
  min-width: 0;
}

.readiness-block p {
  color: #6f7f99;
  font-size: 14px;
  line-height: 1.4;
}

.readiness-block strong {
  display: block;
  margin: 8px 0 12px;
  font-size: 18px;
  line-height: 1.25;
}

.readiness-block button {
  display: inline-flex;
  align-items: center;
}

.suggestion-list {
  margin-top: 20px;
}

.suggestion-card {
  padding: 14px;
  gap: 12px;
  align-items: flex-start;
  border: 1px solid #eef2f8;
  border-radius: 14px;
  background: #f9fbff;
}

.suggestion-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggestion-card > div {
  flex: 1;
}

.suggestion-card > div strong {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
}

.suggestion-card button {
  min-width: 52px;
  min-height: 30px;
  border: 1px solid #ffd5e7;
  border-radius: 10px;
  color: #ff68b5;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
}

.apply-button {
  width: 100%;
  min-height: 38px;
  margin-top: 16px;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  background: linear-gradient(90deg, #f562ae 0%, #ef69bf 100%);
}

.predictor-card p {
  margin: 8px 0 18px;
  color: #9aa6bb;
  font-size: 13px;
}

.predictor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.predictor-grid article small {
  display: block;
  color: #a0acbe;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.predictor-grid article strong {
  display: block;
  margin: 6px 0;
  font-size: 19px;
}

.ok { color: #10b981; font-size: 13px; font-weight: 700; }
.warn { color: #f59e0b; font-size: 13px; font-weight: 700; }

.outcome-card ul {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 14px;
}

.outcome-card li {
  align-items: center;
  gap: 10px;
  color: #47556e;
  font-size: 14px;
  line-height: 1.45;
}

.outcome-card li :deep(svg) {
  color: #10b981;
}

@media (max-width: 1260px) {
  .scratch-evaluation {
    grid-template-columns: 1fr;
  }

  .scratch-evaluation__side {
    position: static;
  }
}

@media (max-width: 980px) {
  .top-grid,
  .middle-grid,
  .insight-grid,
  .predictor-grid {
    grid-template-columns: 1fr;
  }

  .eval-hero,
  .eval-hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .readiness-block {
    grid-template-columns: 1fr;
    justify-items: start;
  }
}
</style>
