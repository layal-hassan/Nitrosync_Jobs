<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const overviewStats = [
  ['Role', 'Senior Accountant'],
  ['Department', 'Finance'],
  ['Employment Type', 'Full-time'],
  ['Location', 'Stockholm, Sweden'],
  ['Work Arrangement', 'Hybrid'],
  ['Experience Level', '5+ Years'],
]

const contextStats = [
  ['Hiring Reason', 'New Position'],
  ['Business Goal', 'Support IFRS reporting growth'],
  ['Team Impact', 'Reduce month-end closing workload'],
  ['Urgency', 'High'],
  ['Expected Start', 'ASAP'],
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
  'Advanced Excel skills; experience with ERP systems like SAP',
  'Excellent analytical and problem-solving skills',
]

const skills = ['IFRS', 'Financial Reporting', 'Month-End Closing', 'Excel (Advanced)', 'SAP', 'General Ledger', 'Reconciliation', 'Analytical Skills', 'Attention to Detail']
const niceToHave = ['CPA / ACCA', 'Big 4 Experience', 'Power BI', 'Swedish Language']
const benefits = ['Private Healthcare', 'Pension', 'Hybrid Work', 'Wellness Allowance', '30 Days Vacation', 'Lunch Allowance']

const summaryItems = [
  ['Role', 'Senior Accountant', 'user', 'tone-pink'],
  ['Hiring Reason', 'New Position', 'userPlus', 'tone-green'],
  ['Hiring Type', 'Expansion Role', 'refresh', 'tone-cyan'],
  ['Timeline', 'ASAP', 'clock', 'tone-orange'],
  ['Budget Status', 'Approved', 'wallet', 'tone-blue'],
  ['Salary Range', '55,000 - 70,000 SEK', 'target', 'tone-violet'],
  ['Work Arrangement', 'Hybrid', 'building', 'tone-blue'],
  ['Experience Level', '5+ Years', 'calendar', 'tone-indigo'],
  ['Candidate Attraction', '88%', 'heart', 'tone-rose'],
  ['Blueprint Quality', '94%', 'checkCircle', 'tone-mint'],
]

const successTraits = ['IFRS Expertise', 'Financial Analysis', 'Stakeholder Management', 'Attention To Detail', 'Problem Solving']

const qualityChecks = [
  'Job overview',
  'Job description',
  'Key responsibilities',
  'Requirements',
  'Skills',
  'Nice to have',
  'Benefits & perks',
  'Compensation',
]

const advisorItems = [
  'Improve job description',
  'Find missing skills',
  'Check market alignment',
  'Suggest responsibilities',
  'Optimize compensation',
  'Improve candidate attraction',
]
</script>

<template>
  <section class="blueprint-step">
    <div class="blueprint-step__main">
      <section class="blueprint-hero">
        <div class="blueprint-hero__copy">
          <p>Step 2 of 8</p>
          <div class="blueprint-hero__title-row">
            <h2>Your AI-generated hiring blueprint</h2>
            <span class="hero-ai-badge">AI Powered</span>
          </div>
          <div class="blueprint-hero__glow">
            <AppIcon name="spark" :size="14" />
            <span>Generated from your hiring goal, role details, and constraints</span>
          </div>
          <span>Review and edit the details below. You can customize everything before moving to the next step. AI insights help you build a stronger hiring plan.</span>
        </div>

        <div class="blueprint-hero__actions">
          <button class="soft-button" type="button">
            <AppIcon name="spark" :size="14" />
            AI Assistant
          </button>
          <button class="ghost-button" type="button">
            <AppIcon name="refresh" :size="14" />
            Regenerate
          </button>
        </div>
      </section>

      <div class="blueprint-grid">
        <article class="blueprint-card panel">
          <div class="blueprint-card__head">
            <div class="blueprint-card__icon tone-pink"><AppIcon name="briefcase" :size="16" /></div>
            <strong>Job overview</strong>
            <button type="button">Edit</button>
          </div>
          <div class="blueprint-stats">
            <div v-for="[label, value] in overviewStats" :key="label">
              <small>{{ label }}</small>
              <strong>{{ value }}</strong>
            </div>
          </div>
        </article>

        <article class="blueprint-card panel">
          <div class="blueprint-card__head">
            <div class="blueprint-card__icon tone-green"><AppIcon name="calendar" :size="16" /></div>
            <strong>Hiring context</strong>
            <button type="button">Edit</button>
          </div>
          <div class="blueprint-stats">
            <div v-for="[label, value] in contextStats" :key="label">
              <small>{{ label }}</small>
              <strong>{{ value }}</strong>
            </div>
          </div>
        </article>

        <article class="blueprint-card panel">
          <div class="blueprint-card__head">
            <div class="blueprint-card__icon tone-blue"><AppIcon name="document" :size="16" /></div>
            <strong>Job description</strong>
            <button type="button">Edit</button>
          </div>
          <p class="blueprint-card__copy">We are looking for a Senior Accountant to join our finance team and play a key role in ensuring accurate financial reporting, compliance with IFRS, and month-end closing. You will work closely with the finance and insight teams to deliver timely and insightful financial information that supports business decisions.</p>
          <button class="suggest-button" type="button">Rewrite with AI</button>
        </article>

        <article class="blueprint-card panel">
          <div class="blueprint-card__head">
            <div class="blueprint-card__icon tone-violet"><AppIcon name="clipboard-check" :size="16" /></div>
            <strong>Key responsibilities</strong>
            <button type="button">Edit</button>
          </div>
          <ul class="bullet-list">
            <li v-for="item in responsibilities" :key="item">{{ item }}</li>
          </ul>
          <button class="suggest-button" type="button">Suggest More</button>
        </article>

        <article class="blueprint-card panel">
          <div class="blueprint-card__head">
            <div class="blueprint-card__icon tone-cyan"><AppIcon name="user" :size="16" /></div>
            <strong>Requirements</strong>
            <button type="button">Edit</button>
          </div>
          <ul class="bullet-list bullet-list--blue">
            <li v-for="item in requirements" :key="item">{{ item }}</li>
          </ul>
          <button class="suggest-button" type="button">Find Missing Requirements</button>
        </article>

        <article class="blueprint-card panel">
          <div class="blueprint-card__head">
            <div class="blueprint-card__icon tone-orange"><AppIcon name="bolt" :size="16" /></div>
            <strong>Skills</strong>
            <button type="button">Edit</button>
          </div>
          <div class="tag-list">
            <span v-for="item in skills" :key="item">{{ item }}</span>
          </div>
          <button class="suggest-button" type="button">AI Skill Suggestions</button>
        </article>

        <article class="blueprint-card panel">
          <div class="blueprint-card__head">
            <div class="blueprint-card__icon tone-yellow"><AppIcon name="star" :size="16" /></div>
            <strong>Nice to have</strong>
            <button type="button">Edit</button>
          </div>
          <div class="tag-list">
            <span v-for="item in niceToHave" :key="item">{{ item }}</span>
          </div>
          <button class="suggest-button" type="button">Generate Nice-to-Haves</button>
        </article>

        <article class="blueprint-card panel">
          <div class="blueprint-card__head">
            <div class="blueprint-card__icon tone-pink"><AppIcon name="heart" :size="16" /></div>
            <strong>Benefits & perks</strong>
            <button type="button">Edit</button>
          </div>
          <div class="tag-list">
            <span v-for="item in benefits" :key="item">{{ item }}</span>
          </div>
          <button class="suggest-button" type="button">Suggest Benefits</button>
        </article>

        <article class="blueprint-attraction panel">
          <div class="blueprint-attraction__score">
            <div class="blueprint-attraction__ring">88%</div>
            <div>
              <strong>Candidate attraction score</strong>
              <span>Your job post is likely to attract high-quality candidates. Improve a few areas to increase reach.</span>
            </div>
          </div>
          <ul class="blueprint-attraction__checks">
            <li><AppIcon name="check" :size="12" /> Add salary range <small>(done)</small></li>
            <li><AppIcon name="check" :size="12" /> Highlight growth opportunities</li>
            <li><AppIcon name="check" :size="12" /> Mention hybrid flexibility</li>
            <li><AppIcon name="check" :size="12" /> Add team information</li>
          </ul>
          <button class="primary-action" type="button">Improve Attraction</button>
        </article>
      </div>
    </div>

    <aside class="blueprint-step__side">
      <section class="side-card panel">
        <div class="side-card__head">
          <AppIcon name="spark" :size="16" />
          <div>
            <strong>AI Blueprint Summary</strong>
            <p>Snapshot of the current role setup and readiness.</p>
          </div>
        </div>
        <div class="summary-list">
          <div
            v-for="[label, value, icon, tone] in summaryItems"
            :key="label"
            class="summary-item"
            :class="{ 'summary-item--accent': label === 'Candidate Attraction' || label === 'Blueprint Quality' }"
          >
            <div class="summary-item__icon" :class="tone">
              <AppIcon :name="icon" :size="14" />
            </div>
            <div>
              <small>{{ label }}</small>
              <strong>{{ value }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="side-card panel">
        <div class="side-card__head">
          <AppIcon name="wallet" :size="16" />
          <div>
            <strong>Compensation & budget</strong>
            <p>Budget approval and compensation competitiveness.</p>
          </div>
        </div>
        <div class="compact-stat">
          <small>Salary range</small>
          <strong>55,000 - 70,000 SEK</strong>
        </div>
        <div class="compact-stat">
          <small>Budget status</small>
          <strong class="is-green">Approved</strong>
        </div>
        <div class="compact-stat">
          <small>Market alignment</small>
          <div class="compact-stat__inline">
            <strong>92%</strong>
            <span>Strong</span>
          </div>
        </div>
        <div class="side-curve">
          <div class="side-curve__trend">
            <span />
          </div>
          <p>This range is competitive for Stockholm at this experience level.</p>
        </div>
      </section>

      <section class="side-card panel side-card--soft">
        <div class="side-card__head">
          <AppIcon name="user" :size="16" />
          <div>
            <strong>Success profile preview</strong>
            <p>The ideal candidate will demonstrate these traits.</p>
          </div>
        </div>
        <ul class="focus-list">
          <li v-for="item in successTraits" :key="item">{{ item }}</li>
        </ul>
      </section>

      <section class="side-card panel">
        <div class="side-card__head">
          <AppIcon name="checkCircle" :size="16" />
          <div>
            <strong>Blueprint Quality</strong>
            <p>Coverage across the core blueprint sections.</p>
          </div>
        </div>
        <div class="quality-score">
          <strong>94%</strong>
          <span>Excellent</span>
        </div>
        <div class="quality-bar"><span /></div>
        <ul class="quality-list">
          <li v-for="item in qualityChecks" :key="item">
            <AppIcon name="check" :size="12" />
            <span>{{ item }}</span>
          </li>
        </ul>
        <button class="side-outline-button" type="button">View Details</button>
      </section>

      <section class="side-card panel">
        <div class="side-card__head">
          <AppIcon name="sparkles" :size="16" />
          <div>
            <strong>AI Hiring Advisor</strong>
            <p>Recommendations to strengthen this hiring plan.</p>
          </div>
        </div>
        <div class="advisor-list">
          <button v-for="item in advisorItems" :key="item" class="advisor-item" type="button">
            <span>{{ item }}</span>
            <AppIcon name="chevronRight" :size="13" />
          </button>
        </div>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.blueprint-step {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 336px;
  gap: 20px;
  align-items: start;
}

.blueprint-step__main,
.blueprint-step__side {
  display: grid;
  gap: 18px;
  align-content: start;
}

.blueprint-step__side {
  position: sticky;
  top: 12px;
  max-height: calc(100vh - 24px);
  overflow-y: auto;
  padding-right: 4px;
}

.panel {
  border: 1px solid #e8edf5;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.05);
}

.blueprint-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 4px 0 2px;
}

.blueprint-hero__copy {
  max-width: 720px;
}

.blueprint-hero__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.blueprint-hero p {
  margin: 0 0 12px;
  color: #f04f9d;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.blueprint-hero h2 {
  margin: 0;
  color: #18233f;
  font-size: 28px;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.hero-ai-badge {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  color: #ef4fa0;
  background: linear-gradient(180deg, #fff3f8 0%, #ffeaf4 100%);
  border: 1px solid #ffd5e8;
  box-shadow: 0 8px 20px rgba(242, 95, 179, 0.12);
  font-size: 11px;
  font-weight: 700;
  vertical-align: middle;
}

.blueprint-hero__glow {
  width: fit-content;
  max-width: 100%;
  min-height: 42px;
  margin-bottom: 18px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #d94d95;
  font-size: 12px;
  font-weight: 600;
  background:
    linear-gradient(90deg, rgba(242, 95, 179, 0.12) 0%, rgba(255, 239, 247, 0.78) 48%, rgba(240, 244, 255, 0.2) 100%);
  border: 1px solid rgba(248, 201, 222, 0.5);
}

.blueprint-hero span {
  display: block;
  max-width: 700px;
  color: #70809a;
  font-size: 15px;
  line-height: 1.7;
}

.blueprint-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.soft-button,
.ghost-button,
.primary-action,
.suggest-button,
.advisor-item,
.side-outline-button {
  border: 1px solid #dfe6f1;
  background: #fff;
}

.soft-button,
.ghost-button {
  height: 48px;
  padding: 0 18px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #32425e;
  font-size: 14px;
  font-weight: 700;
  transition: 0.2s ease;
}

.soft-button {
  color: #6052ef;
  background: linear-gradient(180deg, #f7f4ff 0%, #f1efff 100%);
  border-color: #ece6ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.ghost-button:hover,
.soft-button:hover,
.blueprint-card__head button:hover,
.suggest-button:hover,
.advisor-item:hover,
.side-outline-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
}

.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  align-items: start;
  grid-auto-rows: minmax(min-content, max-content);
}

.blueprint-card,
.side-card {
  padding: 22px 22px 20px;
}

.side-card {
  padding: 18px 18px 16px;
  border-radius: 20px;
}

.blueprint-card__head,
.side-card__head,
.blueprint-attraction {
  display: flex;
  align-items: flex-start;
}

.blueprint-card__head {
  gap: 10px;
  margin-bottom: 18px;
}

.blueprint-card__head strong,
.blueprint-attraction strong {
  color: #1f2a44;
  font-size: 18px;
  line-height: 1.2;
}

.side-card__head {
  gap: 10px;
  margin-bottom: 12px;
  color: #6c6cf3;
}

.side-card__head > div {
  min-width: 0;
}

.side-card__head strong {
  display: block;
  color: #1f2a44;
  font-size: 17px;
  line-height: 1.2;
}

.side-card__head p {
  margin: 4px 0 0;
  color: #8a97ad;
  font-size: 12px;
  line-height: 1.42;
}

.blueprint-card__head button,
.advisor-item,
.side-outline-button {
  border: 1px solid #e4e9f2;
  border-radius: 12px;
  color: #93a0b5;
  background: #fff;
  font-size: 12px;
}

.blueprint-card__head button {
  height: 32px;
  margin-left: auto;
  padding: 0 12px;
  font-weight: 700;
}

.blueprint-card__icon,
.summary-item__icon {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.blueprint-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 18px;
}

.blueprint-stats small,
.summary-item small,
.compact-stat small {
  display: block;
  margin-bottom: 5px;
  color: #a0abc0;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.blueprint-stats strong,
.summary-item strong,
.compact-stat strong {
  color: #25324d;
  font-size: 14px;
  line-height: 1.5;
}

.blueprint-card__copy {
  margin: 0 0 18px;
  color: #5e6d87;
  font-size: 14px;
  line-height: 1.8;
}

.bullet-list,
.focus-list,
.quality-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 11px;
}

.bullet-list li,
.focus-list li,
.quality-list li {
  display: flex;
  align-items: start;
  gap: 10px;
  color: #53627c;
  font-size: 13px;
  line-height: 1.6;
}

.bullet-list li::before {
  content: '';
  width: 7px;
  height: 7px;
  margin-top: 7px;
  border-radius: 50%;
  background: #7c86ff;
  flex-shrink: 0;
}

.bullet-list--blue li::before {
  background: #54a1ff;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.tag-list span {
  padding: 7px 12px;
  border-radius: 999px;
  color: #66758f;
  background: #f4f7fb;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #edf2f8;
}

.suggest-button {
  width: 100%;
  height: 40px;
  margin-top: 18px;
  border-radius: 13px;
  color: #6d6cf2;
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(180deg, #fbfbff 0%, #f7f8ff 100%);
}

.blueprint-attraction {
  grid-column: span 2;
  padding: 24px;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

.blueprint-attraction__score {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
}

.blueprint-attraction__ring {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #4c58f4;
  font-size: 20px;
  font-weight: 800;
  background:
    radial-gradient(circle, #fff 58%, transparent 59%),
    conic-gradient(#5d5ff2 0deg 316deg, #ebeff9 316deg 360deg);
  box-shadow: 0 10px 22px rgba(93, 95, 242, 0.14);
}

.blueprint-attraction__score span {
  display: block;
  margin-top: 6px;
  color: #8090a8;
  font-size: 14px;
  line-height: 1.55;
}

.blueprint-attraction__checks {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  color: #4e5d79;
  font-size: 13px;
}

.blueprint-attraction__checks li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.blueprint-attraction__checks small {
  color: #94a0b5;
}

.primary-action {
  min-width: 180px;
  height: 54px;
  padding: 0 24px;
  border: 0;
  border-radius: 14px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #5a4df5 0%, #5246ea 100%);
  box-shadow: 0 12px 24px rgba(90, 77, 245, 0.22);
}

.summary-list,
.advisor-list {
  display: grid;
  gap: 10px;
}

.summary-item {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 8px 0;
  border-bottom: 1px solid #f0f4f9;
}

.summary-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.summary-item--accent strong {
  color: #22b661;
}

.compact-stat {
  margin-bottom: 12px;
}

.compact-stat__inline {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.compact-stat__inline span {
  color: #22b661;
  font-size: 12px;
  font-weight: 700;
}

.compact-stat .is-green {
  color: #1db96e;
}

.side-curve {
  margin-top: 2px;
  border: 1px solid #eef4f9;
  border-radius: 16px;
  padding: 14px 14px 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(247, 251, 255, 0.96) 100%);
}

.side-curve__trend {
  display: flex;
  align-items: center;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: #e8f6ee;
}

.side-curve__trend span {
  display: block;
  width: 92%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22b661 0%, #2fd07a 100%);
}

.side-curve p {
  margin: 10px 0 0;
  color: #8b97ac;
  font-size: 11px;
  line-height: 1.45;
}

.side-card--soft {
  background: linear-gradient(180deg, #f8f8ff 0%, #f4f6ff 100%);
}

.quality-score {
  display: flex;
  align-items: end;
  gap: 10px;
  margin-bottom: 10px;
}

.quality-score strong {
  color: #18233f;
  font-size: 30px;
  line-height: 1;
}

.quality-score span {
  color: #22b661;
  font-size: 14px;
  font-weight: 700;
}

.quality-bar {
  height: 7px;
  margin-bottom: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #edf2f8;
}

.quality-bar span {
  display: block;
  width: 94%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22b661 0%, #27ca75 100%);
}

.quality-list li {
  color: #5e6d87;
  gap: 8px;
  font-size: 12px;
}

.side-outline-button {
  width: 100%;
  height: 38px;
  margin-top: 12px;
  border-radius: 13px;
  color: #5a64ef;
  font-size: 13px;
  font-weight: 700;
}

.focus-list li {
  position: relative;
  padding-left: 14px;
  font-size: 12px;
}

.focus-list li::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(180deg, #6b7cff 0%, #9d69ef 100%);
}

.advisor-item {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 14px;
  color: #42516c;
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.tone-pink { color: #ef4fa0; background: #fff0f7; }
.tone-green { color: #22b661; background: #eafbf0; }
.tone-blue { color: #4f6ef6; background: #edf2ff; }
.tone-violet { color: #8b5cf6; background: #f5edff; }
.tone-cyan { color: #2f93ff; background: #eef8ff; }
.tone-orange { color: #f28b34; background: #fff3e8; }
.tone-yellow { color: #f1a61c; background: #fff8e7; }
.tone-indigo { color: #6274ff; background: #eef1ff; }
.tone-rose { color: #f26497; background: #fff1f5; }
.tone-mint { color: #21b66a; background: #ecfbf2; }

@media (max-width: 1400px) {
  .blueprint-step {
    grid-template-columns: 1fr;
  }

  .blueprint-step__side {
    position: static;
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
}

@media (max-width: 1100px) {
  .blueprint-grid {
    grid-template-columns: 1fr;
  }

  .blueprint-attraction {
    grid-column: auto;
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 720px) {
  .blueprint-hero,
  .blueprint-hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .blueprint-hero h2 {
    font-size: 23px;
  }

  .blueprint-hero__glow {
    min-height: 34px;
    margin-bottom: 14px;
    padding: 0 12px;
    font-size: 11px;
  }

  .blueprint-stats {
    grid-template-columns: 1fr;
  }

  .blueprint-attraction__score {
    grid-template-columns: 1fr;
  }
}
</style>
