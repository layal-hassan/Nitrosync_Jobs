<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const hiringTypes = [
  { title: 'New Position', note: 'Creating a new role', icon: 'userPlus', tone: 'pink', active: true },
  { title: 'Replacement', note: 'Replacing an employee', icon: 'refresh', tone: 'blue' },
  { title: 'Expansion Role', note: 'Adding more people', icon: 'chart-bars', tone: 'green' },
  { title: 'Temporary Role', note: 'Short-term or project based', icon: 'clock', tone: 'orange' },
  { title: 'Contractor / Freelancer', note: 'Hire for contract work', icon: 'briefcase', tone: 'violet' },
  { title: 'Internship', note: 'Hire an intern or trainee', icon: 'user-check', tone: 'sky' },
]

const employmentTypes = [
  { title: 'Full-time', icon: 'briefcase', active: true },
  { title: 'Part-time', icon: 'clock' },
  { title: 'Contract', icon: 'document' },
  { title: 'Internship', icon: 'copy' },
  { title: 'Freelance', icon: 'share' },
]

const workModes = [
  { title: 'Remote', icon: 'home' },
  { title: 'Hybrid', icon: 'users', active: true },
  { title: 'On-site', icon: 'building' },
]

const teamMembers = [
  { label: 'Hiring manager *', name: 'Sarah Johnson', role: 'Finance Manager', initials: 'SJ', tone: 'sand' },
  { label: 'Recruiter *', name: 'Emily Smith', role: 'Senior Recruiter', initials: 'ES', tone: 'olive' },
  { label: 'Coordinator (Optional)', name: 'Michael Chen', role: 'Recruiting Coordinator', initials: 'MC', tone: 'slate' },
]

const summaryItems = [
  { label: 'Hiring type', value: 'New Position', icon: 'userPlus', tone: 'pink' },
  { label: 'Job title', value: 'Senior Accountant', icon: 'briefcase', tone: 'slate' },
  { label: 'Department', value: 'Finance', icon: 'building', tone: 'slate' },
  { label: 'Employment type', value: 'Full-time', icon: 'briefcase', tone: 'slate' },
  { label: 'Work arrangement', value: 'Hybrid', icon: 'users', tone: 'slate' },
  { label: 'Location', value: 'Stockholm, Sweden', icon: 'mapPin', tone: 'slate' },
  { label: 'Hiring manager', value: 'Sarah Johnson', icon: 'user', tone: 'slate' },
  { label: 'Budget status', value: 'Approved', icon: 'wallet', tone: 'slate' },
  { label: 'Salary range', value: '55,000 - 70,000 SEK', icon: 'wallet', tone: 'slate' },
  { label: 'Desired start date', value: 'Jun 15, 2025', icon: 'calendar', tone: 'slate' },
]

const progressSteps = [
  'Job Details',
  'Hiring Blueprint',
  'Candidate Persona',
  'Application Setup',
  'Screening Setup',
  'Hiring Pipeline',
  'Interview Kit',
  'Publish',
]

const priorities = [
  { title: 'Critical', note: 'Fill immediately', active: true },
  { title: 'High', note: 'Within 30 days' },
  { title: 'Standard', note: 'Normal process' },
  { title: 'Pipeline', note: 'Build talent pipeline' },
]
</script>

<template>
  <section class="scratch-step">
    <div class="scratch-step__main">
      <header class="scratch-hero">
        <span>Step 1 of 8</span>
        <h2>Job Details</h2>
        <p>Configure the core information for this position before setting up screening, pipeline and interviews.</p>
      </header>

      <section class="section-block">
        <div class="section-head">
          <h3>1. What are you hiring for?</h3>
          <p>Select the option that best describes this hiring need.</p>
        </div>

        <div class="type-grid">
          <article
            v-for="item in hiringTypes"
            :key="item.title"
            class="type-card"
            :class="[{ 'is-active': item.active }, `tone-${item.tone}`]"
          >
            <span class="type-card__icon">
              <AppIcon :name="item.icon" :size="18" />
            </span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.note }}</small>
            <span v-if="item.active" class="type-card__check">
              <AppIcon name="checkCircle" :size="13" />
            </span>
          </article>
        </div>
      </section>

      <section class="section-block">
        <div class="section-head">
          <h3>2. Position Information</h3>
          <p>Add the basic details of the position you're hiring for.</p>
        </div>

        <div class="field-grid">
          <label class="field">
            <span>Job title *</span>
            <div>Senior Accountant</div>
          </label>

          <label class="field">
            <span>Department *</span>
            <div class="field__with-chevron">
              <strong>Finance</strong>
              <AppIcon name="chevronDown" :size="14" />
            </div>
          </label>
        </div>

        <div class="choice-group">
          <span class="choice-group__label">Employment type *</span>
          <div class="choice-grid choice-grid--five">
            <button
              v-for="item in employmentTypes"
              :key="item.title"
              class="choice-card"
              :class="{ 'is-active': item.active }"
              type="button"
            >
              <AppIcon :name="item.icon" :size="16" />
              <strong>{{ item.title }}</strong>
              <span v-if="item.active" class="choice-card__check">
                <AppIcon name="checkCircle" :size="12" />
              </span>
            </button>
          </div>
        </div>

        <div class="field-grid field-grid--bottom">
          <div class="choice-group">
            <span class="choice-group__label">Work arrangement *</span>
            <div class="choice-grid choice-grid--three">
              <button
                v-for="item in workModes"
                :key="item.title"
                class="choice-card"
                :class="{ 'is-active': item.active }"
                type="button"
              >
                <AppIcon :name="item.icon" :size="16" />
                <strong>{{ item.title }}</strong>
                <span v-if="item.active" class="choice-card__check">
                  <AppIcon name="checkCircle" :size="12" />
                </span>
              </button>
            </div>
          </div>

          <label class="field">
            <span>Location *</span>
            <div class="field__with-chevron field__with-leading-icon">
              <span><AppIcon name="mapPin" :size="14" /> Stockholm, Sweden</span>
              <AppIcon name="chevronDown" :size="14" />
            </div>
            <small>+ Add another location</small>
          </label>
        </div>
      </section>

      <section class="section-block">
        <div class="section-head">
          <h3>3. Hiring Team</h3>
          <p>Add the key people involved in this hiring.</p>
        </div>

        <div class="team-grid">
          <article v-for="member in teamMembers" :key="member.label" class="team-field">
            <span>{{ member.label }}</span>
            <div class="team-field__control">
              <div class="team-field__person">
                <div class="team-avatar" :class="`tone-${member.tone}`">{{ member.initials }}</div>
                <div>
                  <strong>{{ member.name }}</strong>
                  <small>{{ member.role }}</small>
                </div>
              </div>
              <div class="team-field__actions">
                <AppIcon name="close" :size="12" />
                <AppIcon name="chevronDown" :size="12" />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="section-block section-block--last">
        <div class="section-head">
          <h3>4. Hiring Constraints</h3>
          <p>Set important business and hiring constraints for better recommendations.</p>
        </div>

        <div class="constraints-grid">
          <article class="constraint-card">
            <div class="constraint-head tone-pink">
              <AppIcon name="briefcase" :size="14" />
              <strong>Budget approval</strong>
            </div>
            <div class="radio-list">
              <label class="radio-item is-active"><span /> Approved</label>
              <label class="radio-item"><span /> Pending approval</label>
              <label class="radio-item"><span /> Not required</label>
            </div>
          </article>

          <article class="constraint-card">
            <div class="constraint-head tone-green">
              <AppIcon name="checkCircle" :size="14" />
              <strong>Salary range</strong>
            </div>
            <div class="salary-row">
              <div class="salary-chip salary-chip--currency">SEK</div>
              <div class="salary-chip">55,000</div>
              <span>-</span>
              <div class="salary-chip">70,000</div>
            </div>
            <small>+ Add another range</small>
            <label class="toggle-row">
              <span class="toggle" />
              Not sure yet
            </label>
          </article>

          <article class="constraint-card">
            <div class="constraint-head tone-blue">
              <AppIcon name="calendar" :size="14" />
              <strong>Desired start date</strong>
            </div>
            <div class="input-like">
              <span><AppIcon name="calendar" :size="14" /> Jun 15, 2025</span>
              <AppIcon name="close" :size="12" />
            </div>
            <label class="toggle-row">
              <span class="toggle" />
              Flexible / Not sure yet
            </label>
          </article>

          <article class="constraint-card">
            <div class="constraint-head tone-violet">
              <AppIcon name="clock" :size="14" />
              <strong>Maximum notice period</strong>
            </div>
            <div class="input-like">
              <span>Up to 1 month</span>
              <AppIcon name="chevronDown" :size="12" />
            </div>
            <label class="toggle-row">
              <span class="toggle" />
              Flexible
            </label>
          </article>

          <article class="constraint-card constraint-card--priority">
            <div class="constraint-head tone-yellow">
              <AppIcon name="star" :size="14" />
              <strong>Hiring priority</strong>
            </div>
            <div class="priority-grid">
              <button
                v-for="item in priorities"
                :key="item.title"
                class="priority-card"
                :class="{ 'is-active': item.active }"
                type="button"
              >
                <strong>{{ item.title }}</strong>
                <small>{{ item.note }}</small>
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>

    <aside class="scratch-step__side">
      <section class="side-panel">
        <div class="side-panel__head">
          <span class="side-panel__icon">
            <AppIcon name="briefcase" :size="16" />
          </span>
          <strong>Job Setup Summary</strong>
        </div>

        <div class="summary-list">
          <article v-for="item in summaryItems" :key="item.label" class="summary-row">
            <span class="summary-row__icon" :class="`tone-${item.tone}`">
              <AppIcon :name="item.icon" :size="14" />
            </span>
            <div>
              <small>{{ item.label }}</small>
              <strong>{{ item.value }}</strong>
            </div>
          </article>
        </div>
      </section>

      <section class="side-panel">
        <div class="progress-head">
          <div class="progress-ring">25%</div>
          <div>
            <strong>Setup Progress</strong>
            <small>1 of 8 completed</small>
          </div>
        </div>

        <div class="progress-list">
          <article
            v-for="(item, index) in progressSteps"
            :key="item"
            class="progress-row"
            :class="{ 'is-active': index === 0 }"
          >
            <span>{{ index + 1 }}</span>
            <strong>{{ item }}</strong>
            <span v-if="index === 0" class="progress-row__status">
              <AppIcon name="checkCircle" :size="12" />
            </span>
            <span v-else class="progress-row__dot" />
          </article>
        </div>
      </section>

      <section class="side-panel side-panel--soft">
        <span class="side-panel__icon side-panel__icon--help">
          <AppIcon name="refresh" :size="16" />
        </span>
        <strong>Need help?</strong>
        <p>Check our examples to see how other companies set up similar roles.</p>
        <button type="button">
          View examples
          <AppIcon name="chevronRight" :size="13" />
        </button>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.scratch-step {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 30px;
  align-items: start;
  padding-top: 10px;
}

.scratch-step__main,
.scratch-step__side {
  display: grid;
  gap: 34px;
}

.scratch-step__side {
  align-content: start;
}

.scratch-hero span {
  color: #ff5ead;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.scratch-hero h2 {
  margin: 10px 0 10px;
  color: #1c2740;
  font-size: 31px;
  line-height: 1.1;
  font-weight: 800;
}

.scratch-hero p,
.section-head p,
.field small,
.team-field small,
.toggle-row,
.side-panel p {
  margin: 0;
  color: #70809a;
  font-size: 14px;
  line-height: 1.6;
}

.section-block {
  display: grid;
  gap: 20px;
}

.section-head {
  display: grid;
  gap: 6px;
}

.section-head h3,
.choice-group__label,
.side-panel strong {
  margin: 0;
  color: #1f2b45;
}

.section-head h3 {
  font-size: 18px;
  font-weight: 800;
}

.type-grid,
.field-grid,
.choice-grid,
.team-grid,
.constraints-grid,
.priority-grid,
.summary-list,
.progress-list {
  display: grid;
  gap: 12px;
}

.type-grid {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.type-card,
.choice-card,
.priority-card,
.side-panel {
  border: 1px solid #dfe7f2;
  border-radius: 20px;
  background: #fff;
}

.type-card {
  min-height: 138px;
  padding: 18px 14px;
  position: relative;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 10px;
  text-align: center;
}

.type-card__icon,
.side-panel__icon,
.summary-row__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f8fbff;
}

.type-card strong,
.choice-card strong,
.priority-card strong,
.team-field__person strong,
.summary-row strong {
  color: #1f2b45;
  font-weight: 800;
}

.type-card small {
  color: #8491a6;
  font-size: 13px;
  line-height: 1.45;
}

.type-card.is-active,
.choice-card.is-active,
.priority-card.is-active {
  border-color: #ff75b9;
  box-shadow: inset 0 0 0 1px rgba(255, 117, 185, 0.18);
  background: #fff9fc;
}

.type-card__check,
.choice-card__check {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #ff62b4;
}

.field-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field,
.team-field {
  display: grid;
  gap: 10px;
}

.field > span,
.team-field > span,
.constraint-head strong {
  font-size: 14px;
  font-weight: 700;
}

.field > div,
.team-field__control,
.input-like,
.salary-chip {
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid #dce5f1;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #1f2b45;
  background: #fff;
}

.field__with-chevron span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.field__with-leading-icon span {
  margin-right: auto;
}

.choice-group {
  display: grid;
  gap: 10px;
}

.choice-group__label {
  font-size: 14px;
  font-weight: 700;
}

.choice-grid--five {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.choice-grid--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.choice-card {
  min-height: 76px;
  position: relative;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 8px;
  color: #49566f;
}

.field-grid--bottom {
  align-items: end;
}

.team-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.team-field__control {
  justify-content: space-between;
}

.team-field__person,
.team-field__actions,
.progress-head,
.side-panel__head {
  display: flex;
  align-items: center;
}

.team-field__person {
  gap: 12px;
}

.team-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.team-avatar.tone-sand { background: linear-gradient(135deg, #d29c69 0%, #8f6847 100%); }
.team-avatar.tone-olive { background: linear-gradient(135deg, #ceb68a 0%, #837154 100%); }
.team-avatar.tone-slate { background: linear-gradient(135deg, #64748b 0%, #475569 100%); }

.team-field__actions {
  gap: 10px;
  color: #9aa6bb;
}

.constraints-grid {
  grid-template-columns: 1.05fr 1fr 1fr;
}

.constraint-card {
  display: grid;
  gap: 14px;
}

.constraint-card--priority {
  grid-column: span 2;
}

.constraint-head {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.radio-list {
  display: grid;
  gap: 10px;
}

.radio-item,
.toggle-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.radio-item {
  color: #55627b;
  font-size: 14px;
}

.radio-item span {
  width: 16px;
  height: 16px;
  border: 1px solid #cfd8e7;
  border-radius: 50%;
}

.radio-item.is-active span {
  border-color: #ef5da8;
  box-shadow: inset 0 0 0 4px #ef5da8;
}

.salary-row {
  display: grid;
  grid-template-columns: 82px 1fr auto 1fr;
  gap: 10px;
  align-items: center;
}

.salary-chip {
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.salary-chip--currency {
  color: #5c6981;
  background: #fbfcff;
  font-weight: 600;
}

.constraint-card small {
  color: #f04f9d;
  font-size: 12px;
}

.input-like span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.toggle {
  width: 34px;
  height: 18px;
  border-radius: 999px;
  display: inline-block;
  background: #e4ebf5;
}

.priority-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.priority-card {
  min-height: 68px;
  padding: 12px;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 4px;
  text-align: center;
}

.priority-card small {
  color: #8a96ad;
  font-size: 12px;
}

.side-panel {
  padding: 24px;
  display: grid;
  gap: 20px;
  border-color: #e7edf7;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.side-panel__head {
  gap: 12px;
}

.side-panel__icon {
  color: #ef5da8;
  background: #fff0f7;
}

.side-panel__icon--help {
  color: #6366f1;
  background: #eef2ff;
}

.summary-row,
.progress-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
}

.summary-row small,
.progress-head small,
.progress-row {
  color: #8b97ab;
}

.summary-row strong {
  display: block;
  margin-top: 4px;
}

.progress-ring {
  width: 46px;
  height: 46px;
  border: 4px solid transparent;
  border-radius: 50%;
  background:
    radial-gradient(#fff 58%, transparent 60%),
    conic-gradient(#ef7dbd 0deg 90deg, #f6d9ea 90deg 360deg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef5da8;
  font-size: 12px;
  font-weight: 800;
}

.progress-head {
  gap: 12px;
}

.progress-row {
  grid-template-columns: auto 1fr auto;
  align-items: center;
  font-size: 14px;
}

.progress-row span:first-child {
  width: 18px;
  text-align: center;
}

.progress-row__dot {
  width: 12px;
  height: 12px;
  border: 1px solid #cfd8e7;
  border-radius: 50%;
}

.progress-row__status {
  color: #ef5da8;
}

.progress-row.is-active {
  padding: 10px 12px;
  border-radius: 12px;
  color: #ef5da8;
  background: #fff2f8;
}

.side-panel--soft {
  background: linear-gradient(180deg, #f6f8ff 0%, #fff 100%);
}

.side-panel button {
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #5667ff;
  background: transparent;
  font-weight: 700;
}

.tone-pink { color: #ef5da8; }
.tone-blue { color: #4f7ff6; }
.tone-green { color: #22c55e; }
.tone-orange { color: #ff7a12; }
.tone-violet { color: #8b5cf6; }
.tone-sky { color: #38bdf8; }
.summary-row__icon.tone-pink { background: #fff0f7; }
.summary-row__icon.tone-slate { color: #8fa0b7; background: #f5f8fc; }
.constraint-head.tone-pink { color: #ef5da8; }
.constraint-head.tone-green { color: #22c55e; }
.constraint-head.tone-blue { color: #4f7ff6; }
.constraint-head.tone-violet { color: #8b5cf6; }
.constraint-head.tone-yellow { color: #f4b000; }

@media (max-width: 1360px) {
  .type-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1180px) {
  .scratch-step {
    grid-template-columns: 1fr;
  }

  .constraints-grid {
    grid-template-columns: 1fr;
  }

  .constraint-card--priority {
    grid-column: auto;
  }
}

@media (max-width: 820px) {
  .type-grid,
  .field-grid,
  .choice-grid--five,
  .team-grid,
  .priority-grid,
  .choice-grid--three {
    grid-template-columns: 1fr;
  }

  .salary-row {
    grid-template-columns: 1fr;
  }
}
</style>
