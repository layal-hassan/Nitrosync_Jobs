<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const overviewStats = [
  ['Job Title', 'Senior Accountant'],
  ['Department', 'Finance'],
  ['Employment Type', 'Full-time'],
  ['Location', 'Stockholm, Sweden'],
  ['Experience Level', '5+ Years'],
  ['Work Arrangement', 'Hybrid'],
]

const summaryItems = [
  ['Role', 'Senior Accountant', 'user', 'tone-pink'],
  ['Hiring Reason', 'New Position', 'userPlus', 'tone-green'],
  ['Hiring Type', 'Expansion Role', 'trend-up', 'tone-green'],
  ['Timeline', 'Start ASAP', 'clock', 'tone-orange'],
  ['Budget Status', 'Approved', 'calendar', 'tone-blue'],
  ['Salary Range', '55,000 - 70,000 SEK', 'copy', 'tone-violet'],
]

const responsibilities = [
  'Prepare and review monthly, quarterly and annual financial statements',
  'Ensure compliance with IFRS and local accounting standards',
  'Lead month-end and year-end closing activities',
  'Analyze financial data and provide actionable insights',
  'Assist with budgeting and forecasting',
]

const requirements = [
  '5+ years of experience in accounting / finance',
  'Strong experience with IFRS and financial reporting',
  'Advanced Excel skills; experience with ERP systems (e.g., SAP)',
  'Excellent analytical and problem-solving skills',
]

const skills = [
  'IFRS',
  'Financial Reporting',
  'Month-end Closing',
  'Excel (Advanced)',
  'SAP',
  'General Ledger',
  'Reconciliation',
  'Analytical Skills',
  'Attention to Detail',
]

const niceToHave = ['CPA / ACCA', 'Ag & Experiences', 'Power BI', 'Swedish Language']
const benefits = ['Private Healthcare', 'Pension', 'Hybrid Work', 'Wellness Allowance', '30 Days Vacation', 'Lunch Allowance']

const healthChecks = [
  ['Job description', 'done'],
  ['Key responsibilities', 'done'],
  ['Requirements', 'done'],
  ['Skills', 'done'],
  ['Nice to have', 'done'],
  ['Benefits & perks', 'warn'],
]

const assistantActions = [
  ['Improve description', 'edit'],
  ['Find missing skills', 'link'],
  ['Check market alignment', 'chart-bars'],
  ['Detect requirement gaps', 'eye'],
  ['Suggest responsibilities', 'document'],
]
</script>

<template>
  <section class="scratch-blueprint">
    <div class="scratch-blueprint__main">
      <header class="scratch-blueprint__hero">
        <div>
          <span class="hero-eyebrow">Step 2 of 8</span>
          <h2>Review Your Hiring Blueprint</h2>
          <p>Review and complete the hiring blueprint before moving to the next step. Use AI assistance whenever you need help.</p>
        </div>

        <button class="assistant-trigger" type="button">
          <AppIcon name="spark" :size="14" />
          AI Assistant
          <AppIcon name="chevronDown" :size="14" />
        </button>
      </header>

      <section class="panel overview-card">
        <div class="panel__head panel__head--overview">
          <div class="panel__title">
            <span class="panel__icon tone-pink"><AppIcon name="briefcase" :size="16" /></span>
            <strong>Job overview</strong>
          </div>

          <button class="outline-button" type="button">
            <AppIcon name="edit" :size="14" />
            Edit
          </button>
        </div>

        <div class="overview-grid">
          <article v-for="[label, value] in overviewStats" :key="label">
            <small>{{ label }}</small>
            <strong>{{ value }}</strong>
          </article>
        </div>
      </section>

      <div class="content-grid">
        <section class="panel content-card">
          <div class="panel__head">
            <div class="panel__title">
              <span class="panel__icon tone-green"><AppIcon name="list" :size="16" /></span>
              <strong>Job description</strong>
            </div>
          </div>

          <p class="content-copy">We are looking for a Senior Accountant to join our finance team and play a key role in ensuring accurate financial reporting, compliance with IFRS, and month-end closing. You will work closely with the finance manager and cross-functional teams to deliver timely and insightful financial information that supports business decisions.</p>

          <div class="card-actions">
            <button class="outline-button" type="button">
              <AppIcon name="edit" :size="14" />
              Edit
            </button>
            <button class="soft-action" type="button">
              <AppIcon name="spark" :size="14" />
              Rewrite with AI
            </button>
          </div>
        </section>

        <section class="panel content-card">
          <div class="panel__head">
            <div class="panel__title">
              <span class="panel__icon tone-blue"><AppIcon name="briefcase" :size="16" /></span>
              <strong>Key responsibilities</strong>
            </div>
          </div>

          <ul class="plain-list">
            <li v-for="item in responsibilities" :key="item">{{ item }}</li>
          </ul>

          <div class="card-actions">
            <button class="outline-button" type="button">
              <AppIcon name="edit" :size="14" />
              Edit
            </button>
            <button class="soft-action" type="button">
              <AppIcon name="spark" :size="14" />
              Suggest Responsibilities
            </button>
          </div>
        </section>

        <section class="panel content-card">
          <div class="panel__head">
            <div class="panel__title">
              <span class="panel__icon tone-sky"><AppIcon name="user" :size="16" /></span>
              <strong>Requirements</strong>
            </div>
          </div>

          <ul class="plain-list">
            <li v-for="item in requirements" :key="item">{{ item }}</li>
          </ul>

          <div class="card-actions">
            <button class="outline-button" type="button">
              <AppIcon name="edit" :size="14" />
              Edit
            </button>
            <button class="soft-action" type="button">
              <AppIcon name="spark" :size="14" />
              Find Missing Requirements
            </button>
          </div>
        </section>

        <section class="panel content-card">
          <div class="panel__head">
            <div class="panel__title">
              <span class="panel__icon tone-orange"><AppIcon name="bolt" :size="16" /></span>
              <strong>Skills</strong>
            </div>
          </div>

          <div class="tag-cloud">
            <span v-for="item in skills" :key="item">{{ item }}</span>
          </div>

          <div class="card-actions">
            <button class="outline-button" type="button">
              <AppIcon name="edit" :size="14" />
              Edit
            </button>
            <button class="soft-action" type="button">
              <AppIcon name="spark" :size="14" />
              AI Skill Suggestions
            </button>
          </div>
        </section>

        <section class="panel content-card">
          <div class="panel__head">
            <div class="panel__title">
              <span class="panel__icon tone-yellow"><AppIcon name="star" :size="16" /></span>
              <strong>Nice to have</strong>
            </div>
          </div>

          <div class="tag-cloud">
            <span v-for="item in niceToHave" :key="item">{{ item }}</span>
          </div>

          <div class="card-actions">
            <button class="outline-button" type="button">
              <AppIcon name="edit" :size="14" />
              Edit
            </button>
            <button class="soft-action" type="button">
              <AppIcon name="spark" :size="14" />
              Generate Nice-to-Haves
            </button>
          </div>
        </section>

        <section class="panel content-card">
          <div class="panel__head">
            <div class="panel__title">
              <span class="panel__icon tone-rose"><AppIcon name="heart" :size="16" /></span>
              <strong>Benefits &amp; perks</strong>
            </div>
          </div>

          <div class="tag-cloud">
            <span v-for="item in benefits" :key="item">{{ item }}</span>
          </div>

          <div class="card-actions">
            <button class="outline-button" type="button">
              <AppIcon name="edit" :size="14" />
              Edit
            </button>
            <button class="soft-action" type="button">
              <AppIcon name="spark" :size="14" />
              Suggest Benefits
            </button>
          </div>
        </section>
      </div>
    </div>

    <aside class="scratch-blueprint__side">
      <section class="panel side-card">
        <div class="side-card__head">
          <span class="panel__icon tone-pink"><AppIcon name="briefcase" :size="16" /></span>
          <strong>Hiring Blueprint Summary</strong>
        </div>

        <div class="summary-list">
          <article v-for="[label, value, icon, tone] in summaryItems" :key="label" class="summary-row">
            <span class="summary-row__icon" :class="tone"><AppIcon :name="icon" :size="14" /></span>
            <div>
              <small>{{ label }}</small>
              <strong>{{ value }}</strong>
            </div>
          </article>
        </div>
      </section>

      <section class="panel side-card">
        <div class="health-card">
          <div class="health-card__score">
            <strong>92%</strong>
          </div>
          <div>
            <h3>Blueprint Health</h3>
            <b>Complete</b>
            <p>Almost there! Just a few things left.</p>
          </div>
        </div>

        <ul class="health-list">
          <li v-for="[item, state] in healthChecks" :key="item" :class="`is-${state}`">
            <AppIcon :name="state === 'done' ? 'check' : 'alert'" :size="13" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <section class="panel side-card">
        <div class="side-card__heading">
          <span class="spark-mark"><AppIcon name="spark" :size="14" /></span>
          <div>
            <h3>AI Assistant</h3>
            <p>Get AI help to improve your blueprint instantly.</p>
          </div>
        </div>

        <div class="assistant-list">
          <button v-for="[label, icon] in assistantActions" :key="label" class="assistant-item" type="button">
            <span>
              <AppIcon :name="icon" :size="14" />
              {{ label }}
            </span>
            <AppIcon name="chevronRight" :size="14" />
          </button>
        </div>
      </section>

      <section class="panel inspire-card">
        <div class="side-card__heading">
          <span class="spark-mark spark-mark--violet"><AppIcon name="refresh" :size="14" /></span>
          <div>
            <h3>Need inspiration?</h3>
            <p>Explore examples from similar companies and roles.</p>
          </div>
        </div>

        <button class="link-button" type="button">
          View examples
          <AppIcon name="chevronRight" :size="13" />
        </button>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.scratch-blueprint {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 384px;
  gap: 32px;
  align-items: start;
}

.scratch-blueprint__main,
.scratch-blueprint__side {
  display: grid;
  gap: 26px;
  align-content: start;
}

.scratch-blueprint__side {
  position: sticky;
  top: 16px;
}

.scratch-blueprint__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.hero-eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: #ff5da8;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.scratch-blueprint__hero h2 {
  margin: 0 0 12px;
  color: #1b243c;
  font-size: 32px;
  line-height: 1.15;
  font-weight: 800;
}

.scratch-blueprint__hero p,
.content-copy,
.side-card p,
.health-card p,
.summary-row small {
  margin: 0;
  color: #6d7b94;
  font-size: 15px;
  line-height: 1.65;
}

.assistant-trigger,
.outline-button,
.soft-action,
.assistant-item,
.link-button {
  border: 1px solid #e2e8f2;
  background: #fff;
}

.assistant-trigger {
  min-height: 46px;
  padding: 0 16px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f05ca8;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.panel {
  border: 1px solid #e6edf7;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.04);
}

.overview-card,
.side-card,
.content-card,
.inspire-card {
  padding: 30px 24px 24px;
}

.panel__head,
.panel__title,
.side-card__head,
.side-card__heading,
.summary-row {
  display: flex;
}

.panel__head,
.side-card__head,
.side-card__heading {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.panel__title,
.side-card__head {
  align-items: center;
  gap: 14px;
}

.panel__title strong,
.side-card__head strong,
.side-card__heading h3,
.health-card h3 {
  margin: 0;
  color: #1f2942;
  font-size: 17px;
  font-weight: 800;
}

.panel__icon,
.summary-row__icon,
.spark-mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tone-pink { color: #f05ca8; background: #fff0f7; }
.tone-green { color: #22c55e; background: #effcf3; }
.tone-blue { color: #4f7ff6; background: #eef4ff; }
.tone-violet { color: #8b5cf6; background: #f3edff; }
.tone-orange { color: #ff7d12; background: #fff3e7; }
.tone-yellow { color: #f4b000; background: #fff8e5; }
.tone-sky { color: #4f8ef7; background: #eef5ff; }
.tone-rose { color: #f062ae; background: #fff0f7; }

.outline-button,
.soft-action {
  min-height: 38px;
  padding: 0 16px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #26324d;
  font-size: 14px;
  font-weight: 700;
}

.soft-action {
  color: #f05ca8;
  border-color: #ffd7e9;
  background: #fff7fb;
}

.overview-grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px 24px;
}

.overview-grid small {
  display: block;
  margin-bottom: 8px;
  color: #96a2b6;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.overview-grid strong,
.summary-row strong {
  color: #202b43;
  font-size: 16px;
  font-weight: 800;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.content-card {
  min-height: 388px;
  display: grid;
  align-content: start;
  gap: 22px;
}

.plain-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 14px;
  color: #48566f;
  font-size: 15px;
  line-height: 1.55;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-cloud span {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  color: #47556e;
  background: #f4f6fa;
  font-size: 14px;
}

.card-actions {
  margin-top: auto;
  display: flex;
  gap: 12px;
}

.summary-list,
.health-list,
.assistant-list {
  display: grid;
  gap: 14px;
}

.summary-row {
  align-items: flex-start;
  gap: 12px;
}

.summary-row strong {
  display: block;
  margin-top: 4px;
}

.health-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: start;
}

.health-card__score {
  color: #202b43;
  font-size: 28px;
  font-weight: 800;
}

.health-card b {
  display: block;
  margin: 6px 0 2px;
  color: #f05ca8;
  font-size: 15px;
}

.health-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.health-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #39465f;
  font-size: 15px;
}

.health-list li.is-done {
  color: #27344d;
}

.health-list li.is-done :deep(svg) {
  color: #22c55e;
}

.health-list li.is-warn :deep(svg) {
  color: #ff7d12;
}

.spark-mark {
  color: #f4b000;
  background: #fff7e7;
}

.spark-mark--violet {
  color: #6b5cff;
  background: #eef1ff;
}

.assistant-item {
  min-height: 54px;
  padding: 0 16px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #26324d;
  font-size: 14px;
  font-weight: 700;
}

.assistant-item span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.inspire-card {
  background: linear-gradient(180deg, #f7f8ff 0%, #f5f8ff 100%);
}

.link-button {
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #5b62ff;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
}

@media (max-width: 1360px) {
  .scratch-blueprint {
    grid-template-columns: minmax(0, 1fr) 340px;
  }
}

@media (max-width: 1180px) {
  .scratch-blueprint {
    grid-template-columns: 1fr;
  }

  .scratch-blueprint__side {
    position: static;
  }
}

@media (max-width: 820px) {
  .scratch-blueprint__hero,
  .card-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .content-grid,
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
