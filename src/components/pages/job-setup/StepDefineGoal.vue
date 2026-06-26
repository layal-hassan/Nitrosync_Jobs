<script setup>
import { ref } from 'vue'
import AppIcon from '../../shared/AppIcon.vue'

const hiringReasons = [
  { title: 'New Position', description: 'Creating a new role', icon: 'userPlus', tone: 'pink', active: true },
  { title: 'Replacement', description: 'Replacing someone', icon: 'refresh', tone: 'blue' },
  { title: 'Expansion Role', description: 'Adding more people to the team', icon: 'chart-bars', tone: 'green' },
  { title: 'Temporary Role', description: 'Short-term or project based', icon: 'clock', tone: 'orange' },
  { title: 'Contractor / Freelancer', description: 'Hire for contract or freelance work', icon: 'briefcase', tone: 'indigo' },
  { title: 'Internship', description: 'Hire an intern or trainee', icon: 'user-check', tone: 'cyan' },
  { title: 'Executive Search', description: 'Leadership or C-level role', icon: 'bolt', tone: 'violet' },
]

const employmentTypes = [
  { label: 'Full-time', icon: 'briefcase', active: true },
  { label: 'Part-time', icon: 'clock' },
  { label: 'Contract', icon: 'document' },
  { label: 'Internship', icon: 'spark' },
  { label: 'Freelance', icon: 'user' },
]

const workModes = [
  { label: 'Remote', icon: 'home' },
  { label: 'Hybrid', icon: 'users', active: true },
  { label: 'On-site', icon: 'building' },
]

const priorities = [
  { label: 'Critical', note: 'Fill immediately', active: true },
  { label: 'High', note: 'Within 30 days' },
  { label: 'Standard', note: 'Normal process' },
  { label: 'Pipeline', note: 'Build talent pipeline' },
]

const aiCreates = [
  'Job description',
  'Responsibilities',
  'Requirements & qualifications',
  'Candidate persona',
  'Screening questions',
  'AI screening rules',
  'Suggested hiring pipeline',
  'Interview kit & scorecards',
]

const aiBenefits = [
  { title: 'Save time', note: 'Create a complete hiring setup in under 5 minutes.', icon: 'clock', tone: 'pink' },
  { title: 'Better quality', note: 'AI writes role descriptions and requirements that attract the right talent.', icon: 'spark', tone: 'violet' },
  { title: 'Consistent process', note: 'Follow best practices for every hire across your organization.', icon: 'chart-bars', tone: 'green' },
]

const examplePrompts = [
  '"We need a Senior Accountant in Stockholm."',
  '"We are replacing our HR Manager."',
  '"We need seasonal warehouse staff."',
  '"We are opening a new office in Germany."',
]

const exampleRequests = [
  {
    title: 'Senior Accountant',
    description: 'We need a Senior Accountant in Stockholm with IFRS experience and SAP knowledge.',
    icon: 'briefcase',
    tone: 'blue',
  },
  {
    title: 'HR Manager',
    description: 'We are replacing our HR Manager and need someone experienced in recruitment and employee relations.',
    icon: 'user',
    tone: 'green',
  },
  {
    title: 'Warehouse Staff',
    description: 'We need seasonal warehouse staff for our distribution center during peak season.',
    icon: 'building',
    tone: 'orange',
  },
  {
    title: 'Frontend Developer',
    description: 'We need a React developer with TypeScript experience to join our product team.',
    icon: 'code',
    tone: 'indigo',
  },
  {
    title: 'AI Engineer',
    description: 'We are building AI-powered products and need an engineer experienced with LLMs and Python.',
    icon: 'sparkles',
    tone: 'pink',
  },
]

const exampleTipItems = ['Job title', 'Skills', 'Experience level', 'Location', 'Work setup']
const examplesOpen = ref(false)

function openExamples() {
  examplesOpen.value = true
}

function closeExamples() {
  examplesOpen.value = false
}
</script>

<template>
  <section class="goal-step">
    <div class="goal-step__main">
      <section class="goal-hero">
        <p>Step 1 of 8</p>
        <h2>
          Define your hiring goal
          <AppIcon name="sparkles" :size="18" />
        </h2>
        <span>Tell us what you're hiring for and why. Our AI will understand the context and create a complete hiring blueprint tailored to your needs.</span>
      </section>

      <section class="goal-card panel">
        <div class="goal-card__head">
          <strong>1. What are you hiring for?</strong>
          <span>Select the option that best describes this hiring need.</span>
        </div>

        <div class="goal-reason-grid">
          <article
            v-for="item in hiringReasons"
            :key="item.title"
            class="goal-reason-card"
            :class="[{ 'is-active': item.active }, `goal-reason-card--${item.tone}`]"
          >
            <div class="goal-reason-card__icon">
              <AppIcon :name="item.icon" :size="18" />
            </div>
            <strong>{{ item.title }}</strong>
            <span>{{ item.description }}</span>
            <AppIcon v-if="item.active" name="checkCircle" :size="14" class="goal-reason-card__check" />
          </article>
        </div>
      </section>

      <section class="goal-card panel">
        <div class="goal-card__head">
          <strong>2. Why are you hiring?</strong>
          <span>Help our AI understand the context, team needs and goals.</span>
        </div>

        <div class="goal-textarea">
          <p>We need a Senior Accountant because our finance team is growing and we need support for IFRS reporting and month-end closing.</p>
          <small>112 / 500</small>
        </div>

        <div class="goal-card__actions">
          <button class="soft-action" type="button">
            <AppIcon name="spark" :size="14" />
            Voice input
          </button>
          <button class="ghost-action" type="button">
            <AppIcon name="link" :size="14" />
            Attach file
          </button>
        </div>
      </section>

      <section class="goal-card panel">
        <div class="goal-card__head">
          <strong>3. Position Information</strong>
          <span>Add the basic details of the position you're hiring for.</span>
        </div>

        <div class="goal-form-grid">
          <label class="goal-field">
            <span>Job title</span>
            <div>Senior Accountant</div>
          </label>
          <label class="goal-field">
            <span>Department</span>
            <div>Finance</div>
          </label>
        </div>

        <div class="goal-group">
          <span class="goal-group__label">Employment type</span>
          <div class="goal-select-grid goal-select-grid--five">
            <button
              v-for="item in employmentTypes"
              :key="item.label"
              class="goal-select-card"
              :class="{ 'is-active': item.active }"
              type="button"
            >
              <AppIcon :name="item.icon" :size="16" />
              <strong>{{ item.label }}</strong>
            </button>
          </div>
        </div>

        <div class="goal-form-grid goal-form-grid--align-end">
          <div class="goal-group">
            <span class="goal-group__label">Work arrangement</span>
            <div class="goal-select-grid">
              <button
                v-for="item in workModes"
                :key="item.label"
                class="goal-select-card"
                :class="{ 'is-active': item.active }"
                type="button"
              >
                <AppIcon :name="item.icon" :size="16" />
                <strong>{{ item.label }}</strong>
              </button>
            </div>
          </div>

          <label class="goal-field">
            <span>Location</span>
            <div class="goal-field__with-icon">
              <AppIcon name="mapPin" :size="14" />
              <strong>Stockholm, Sweden</strong>
              <AppIcon name="chevronDown" :size="14" />
            </div>
            <small>+ Add another location</small>
          </label>
        </div>
      </section>

      <section class="goal-card panel">
        <div class="goal-card__head">
          <strong>4. Hiring Constraints</strong>
          <span>Set important business and hiring constraints for better recommendations.</span>
        </div>

        <div class="goal-constraints">
          <article class="constraint-card">
            <div class="constraint-card__head">
              <AppIcon name="briefcase" :size="14" />
              <strong>Budget approval</strong>
            </div>
            <div class="radio-list">
              <label class="radio-item is-active"><span /> Approved</label>
              <label class="radio-item"><span /> Pending approval</label>
              <label class="radio-item"><span /> Not required</label>
            </div>
          </article>

          <article class="constraint-card constraint-card--salary">
            <div class="constraint-card__head">
              <AppIcon name="checkCircle" :size="14" />
              <strong>Salary range</strong>
            </div>
            <div class="constraint-range-wrap">
              <div class="constraint-range">
                <span>SEK</span>
                <strong>55,000</strong>
                <small>-</small>
                <strong>70,000</strong>
              </div>
            </div>
            <small class="constraint-note">+ Add another range</small>
          </article>

          <article class="constraint-card constraint-card--date">
            <div class="constraint-card__head">
              <AppIcon name="calendar" :size="14" />
              <strong>Desired start date</strong>
            </div>
            <div class="constraint-date">
              <AppIcon name="calendar" :size="14" />
              <span>Jun 15, 2025</span>
              <AppIcon name="close" :size="12" />
            </div>
            <label class="toggle-row">
              <span class="toggle" />
              Flexible / Not sure yet
            </label>
          </article>

          <article class="constraint-card">
            <div class="constraint-card__head">
              <AppIcon name="clock" :size="14" />
              <strong>Maximum notice period</strong>
            </div>
            <div class="constraint-date">
              <span>Up to 1 month</span>
              <AppIcon name="chevronDown" :size="12" />
            </div>
            <label class="toggle-row">
              <span class="toggle" />
              Flexible
            </label>
          </article>

          <article class="constraint-card constraint-card--wide">
            <div class="constraint-card__head">
              <AppIcon name="star" :size="14" />
              <strong>Hiring priority</strong>
            </div>
            <div class="goal-select-grid goal-select-grid--priority">
              <button
                v-for="item in priorities"
                :key="item.label"
                class="goal-select-card goal-select-card--priority"
                :class="{ 'is-active': item.active }"
                type="button"
              >
                <strong>{{ item.label }}</strong>
                <span>{{ item.note }}</span>
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>

    <aside class="goal-step__side">
      <section class="goal-side-card panel">
        <div class="goal-side-card__title">
          <div class="goal-side-card__badge">
            <AppIcon name="spark" :size="14" />
          </div>
          <div>
            <strong>AI will create for you</strong>
            <span class="goal-side-card__intro">Our AI will generate a complete hiring blueprint including:</span>
          </div>
        </div>
        <ul class="side-list">
          <li v-for="item in aiCreates" :key="item">
            <AppIcon name="check" :size="12" />
            <span>{{ item }}</span>
          </li>
        </ul>
        <div class="goal-side-card__divider" />
        <strong class="goal-side-card__header">Why AI?</strong>
        <div class="benefit-list">
          <article v-for="item in aiBenefits" :key="item.title" class="benefit-item">
            <div class="benefit-item__icon" :class="`tone-${item.tone}`">
              <AppIcon :name="item.icon" :size="14" />
            </div>
            <div>
              <strong>{{ item.title }}</strong>
              <span>{{ item.note }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="goal-side-card goal-side-card--soft panel">
        <strong class="goal-side-card__header">Example prompts</strong>
        <ul class="prompt-list">
          <li v-for="item in examplePrompts" :key="item">{{ item }}</li>
        </ul>
        <button class="link-button" type="button" @click="openExamples">
          View more examples
          <AppIcon name="chevronRight" :size="13" />
        </button>
      </section>
    </aside>

    <div v-if="examplesOpen" class="examples-modal" @click.self="closeExamples">
      <div class="examples-modal__dialog panel">
        <div class="examples-modal__head">
          <div class="examples-modal__title">
            <div class="examples-modal__badge">
              <AppIcon name="sparkles" :size="16" />
            </div>
            <div>
              <strong>Example hiring requests</strong>
              <span>Use these examples to get started. You can edit them anytime.</span>
            </div>
          </div>

          <button class="examples-modal__close" type="button" @click="closeExamples">
            <AppIcon name="close" :size="18" />
          </button>
        </div>

        <div class="examples-list">
          <article
            v-for="item in exampleRequests"
            :key="item.title"
            class="examples-item"
          >
            <div class="examples-item__icon" :class="`tone-${item.tone}`">
              <AppIcon :name="item.icon" :size="18" />
            </div>
            <div class="examples-item__copy">
              <strong>{{ item.title }}</strong>
              <span>{{ item.description }}</span>
            </div>
            <button class="examples-item__action" type="button">Use example</button>
          </article>
        </div>

        <div class="examples-tip">
          <div class="examples-tip__icon">
            <AppIcon name="spark" :size="16" />
          </div>
          <div class="examples-tip__copy">
            <strong>Tip</strong>
            <span>Include these details for better results:</span>
          </div>
          <div class="examples-tip__tags">
            <span v-for="item in exampleTipItems" :key="item">
              <AppIcon name="check" :size="11" />
              {{ item }}
            </span>
          </div>
        </div>

        <div class="examples-modal__footer">
          <button class="examples-modal__cancel" type="button" @click="closeExamples">Cancel</button>
          <button class="examples-modal__primary" type="button">
            Use example &amp; generate
            <AppIcon name="sparkles" :size="14" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.goal-step {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 18px;
}

.goal-step__main,
.goal-step__side {
  display: grid;
  gap: 18px;
}

.goal-step__side {
  align-content: start;
}

.panel {
  border: 1px solid #e8edf5;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.goal-hero {
  display: grid;
  gap: 10px;
  padding: 6px 2px 0;
}

.goal-hero p {
  margin: 0;
  color: #f04f9d;
  font-size: 14px;
  font-weight: 700;
}

.goal-hero h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #18233f;
  font-size: 24px;
}

.goal-hero span {
  max-width: 760px;
  color: #70809a;
  font-size: 14px;
  line-height: 1.6;
}

.goal-card,
.goal-side-card {
  padding: 22px 24px;
}

.goal-card__head {
  display: grid;
  gap: 6px;
  margin-bottom: 18px;
}

.goal-card__head strong,
.goal-side-card strong {
  color: #1e2945;
  font-size: 18px;
}

.goal-card__head span,
.goal-side-card span,
.benefit-item span,
.side-list span,
.prompt-list li {
  color: #8a96ad;
  font-size: 13px;
  line-height: 1.5;
}

.goal-reason-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 14px;
}

.goal-reason-card,
.goal-select-card {
  position: relative;
  min-height: 118px;
  padding: 16px 10px 14px;
  border: 1px solid #dfe6f1;
  border-radius: 16px;
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 10px;
  text-align: center;
  background: #fff;
}

.goal-reason-card.is-active,
.goal-select-card.is-active {
  border-color: #f04f9d;
  box-shadow: inset 0 0 0 1px rgba(240, 79, 157, 0.2);
  background: #fff8fc;
}

.goal-reason-card__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.goal-reason-card__check {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #f04f9d;
}

.goal-reason-card strong,
.goal-select-card strong {
  color: #1e2945;
  font-size: 12px;
  line-height: 1.35;
}

.goal-reason-card span {
  font-size: 11px;
  line-height: 1.35;
}

.goal-reason-card--pink .goal-reason-card__icon { color: #ef4fa0; background: #fff0f7; }
.goal-reason-card--blue .goal-reason-card__icon { color: #4f6ef6; background: #edf2ff; }
.goal-reason-card--green .goal-reason-card__icon { color: #22b661; background: #eafbf0; }
.goal-reason-card--orange .goal-reason-card__icon { color: #f28b34; background: #fff3e8; }
.goal-reason-card--indigo .goal-reason-card__icon { color: #6674ff; background: #eff2ff; }
.goal-reason-card--cyan .goal-reason-card__icon { color: #2ea8f5; background: #eef9ff; }
.goal-reason-card--violet .goal-reason-card__icon { color: #9d58f6; background: #f6efff; }

.goal-textarea {
  min-height: 110px;
  padding: 22px 24px;
  border: 1px solid #e6ebf3;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
}

.goal-textarea p,
.goal-textarea small {
  margin: 0;
  color: #50607b;
  font-size: 14px;
  line-height: 1.6;
}

.goal-textarea small {
  align-self: end;
  color: #9aa5b8;
  font-size: 12px;
}

.goal-card__actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.soft-action,
.ghost-action,
.link-button {
  border: 1px solid #e2e8f2;
  background: #fff;
  color: #4a5a75;
}

.soft-action,
.ghost-action {
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.soft-action {
  color: #f04f9d;
  background: #fff7fb;
  border-color: #f7c6df;
}

.goal-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.goal-form-grid--align-end {
  align-items: end;
  margin-top: 18px;
}

.goal-field,
.goal-group {
  display: grid;
  gap: 10px;
}

.goal-field > span,
.goal-group__label {
  color: #1d2944;
  font-size: 13px;
  font-weight: 700;
}

.goal-field > div {
  min-height: 46px;
  padding: 0 16px;
  border: 1px solid #e0e7f2;
  border-radius: 12px;
  display: flex;
  align-items: center;
  color: #33445f;
  background: #fff;
  font-size: 14px;
}

.goal-field small {
  color: #f04f9d;
  font-size: 12px;
}

.goal-field__with-icon {
  justify-content: space-between;
  gap: 10px;
}

.goal-field__with-icon strong {
  margin-right: auto;
  font-size: 14px;
  color: #33445f;
}

.goal-select-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.goal-select-grid--five {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.goal-select-grid--priority {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.goal-select-card {
  min-height: 58px;
  padding: 14px 12px;
  gap: 8px;
}

.goal-select-card--priority {
  min-height: 72px;
  align-content: center;
}

.goal-select-card span {
  color: #95a1b6;
  font-size: 11px;
  line-height: 1.4;
}

.goal-constraints {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.constraint-card {
  padding: 18px;
  border: 1px solid #e6ebf3;
  border-radius: 16px;
  display: grid;
  gap: 14px;
  background: #fff;
  min-width: 0;
  overflow: hidden;
}

.constraint-card--salary,
.constraint-card--date {
  padding: 18px 20px;
}

.constraint-card--wide {
  grid-column: span 3;
}

.constraint-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e2945;
}

.constraint-card__head strong {
  font-size: 14px;
}

.radio-list {
  display: grid;
  gap: 10px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #5a6983;
  font-size: 13px;
}

.radio-item span {
  width: 14px;
  height: 14px;
  border: 1px solid #cbd4e2;
  border-radius: 50%;
}

.radio-item.is-active span {
  border-color: #f04f9d;
  box-shadow: inset 0 0 0 4px #f04f9d;
}

.constraint-range,
.constraint-date,
.toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #33445f;
}

.constraint-range-wrap {
  padding-top: 2px;
  min-width: 0;
}

.constraint-range {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 10px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.constraint-range strong {
  min-width: 0;
  width: 100%;
  height: 46px;
  border: 1px solid #e0e7f2;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #24324d;
  font-size: 11px;
  font-weight: 700;
  background: #fff;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.02);
  overflow: hidden;
  white-space: nowrap;
}

.constraint-range span {
  min-width: 0;
  width: 100%;
  height: 46px;
  border: 1px solid #e0e7f2;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5d6c85;
  font-size: 11px;
  background: #fbfcff;
}

.constraint-range small {
  color: #95a1b6;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  min-width: 0;
}

.constraint-note {
  color: #f04f9d;
  font-size: 11px;
  font-weight: 600;
}

.constraint-date {
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid #e0e7f2;
  border-radius: 13px;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.02);
}

.constraint-date span {
  color: #24324d;
  font-size: 13px;
  font-weight: 500;
}

.toggle-row {
  color: #95a1b6;
  font-size: 12px;
  font-weight: 500;
}

.toggle {
  width: 34px;
  height: 20px;
  border-radius: 999px;
  background: #edf1f7;
}

.goal-side-card {
  display: grid;
  gap: 10px;
  padding: 18px 18px 16px;
}

.goal-side-card__title {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.goal-side-card__title > div:last-child {
  display: grid;
  gap: 4px;
}

.goal-side-card__badge {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef4fa0;
  background: #fff0f7;
}

.goal-side-card__intro {
  display: block;
  max-width: none;
  color: #8a96ad;
  font-size: 12px;
  line-height: 1.4;
}

.goal-side-card__header {
  font-size: 15px;
  margin-top: 2px;
}

.goal-side-card__divider {
  height: 1px;
  margin: 2px 0 0;
  background: #edf2f8;
}

.side-list,
.prompt-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.side-list li {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  align-items: start;
  gap: 8px;
  color: #ef4fa0;
}

.benefit-list {
  display: grid;
  gap: 8px;
}

.benefit-item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 8px;
}

.benefit-item__icon {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.benefit-item strong {
  display: block;
  margin-bottom: 2px;
  font-size: 12px;
}

.goal-side-card--soft {
  background: #f7f8ff;
  padding: 16px 18px;
}

.prompt-list li {
  color: #5f67cc;
  font-size: 12px;
  line-height: 1.45;
  font-style: italic;
}

.link-button {
  height: 28px;
  padding: 0;
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #5d5ff2;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
}

.examples-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  padding: 18px;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(2px);
}

.examples-modal__dialog {
  width: min(900px, calc(100vw - 32px));
  max-height: min(1080px, calc(100vh - 36px));
  padding: 22px 26px 24px;
  overflow: auto;
}

.examples-modal__head,
.examples-modal__title,
.examples-item,
.examples-tip__copy,
.examples-modal__footer {
  display: flex;
}

.examples-modal__head,
.examples-modal__footer {
  align-items: center;
  justify-content: space-between;
}

.examples-modal__head {
  gap: 18px;
  margin-bottom: 18px;
}

.examples-modal__title {
  align-items: flex-start;
  gap: 12px;
}

.examples-modal__title > div:last-child {
  display: grid;
  gap: 4px;
}

.examples-modal__title strong {
  color: #1d2944;
  font-size: 18px;
}

.examples-modal__title span {
  color: #74829b;
  font-size: 12px;
}

.examples-modal__badge {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
  background: #f6efff;
}

.examples-modal__close {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9aa6bb;
  background: transparent;
}

.examples-list {
  display: grid;
  gap: 12px;
}

.examples-item {
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid #e8edf5;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.03);
}

.examples-item__icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.examples-item__copy {
  flex: 1;
  min-width: 0;
}

.examples-item__copy strong {
  display: block;
  margin-bottom: 3px;
  color: #1f2a44;
  font-size: 14px;
}

.examples-item__copy span {
  color: #6f7f98;
  font-size: 12px;
  line-height: 1.45;
}

.examples-item__action,
.examples-modal__cancel,
.examples-modal__primary {
  height: 40px;
  padding: 0 18px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}

.examples-item__action,
.examples-modal__cancel {
  border: 1px solid #e6ccff;
  color: #ef4fa0;
  background: #fff;
}

.examples-tip {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #e0e7fb;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 10px;
  background: #f7f9ff;
}

.examples-tip__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5d5ff2;
  background: #edf2ff;
}

.examples-tip__copy {
  flex-direction: column;
  gap: 2px;
}

.examples-tip__copy strong {
  color: #22304b;
  font-size: 13px;
}

.examples-tip__copy span {
  color: #7a88a0;
  font-size: 12px;
}

.examples-tip__tags {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.examples-tip__tags span {
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid #dde5f5;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #465571;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
}

.examples-modal__footer {
  margin-top: 18px;
}

.examples-modal__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #ef4fa0 0%, #e63f9d 100%);
  box-shadow: 0 12px 24px rgba(239, 79, 160, 0.2);
}

.tone-pink { color: #ef4fa0; background: #fff0f7; }
.tone-violet { color: #8b5cf6; background: #f5edff; }
.tone-green { color: #22b661; background: #eafbf0; }
.tone-blue { color: #2e9bf1; background: #eef8ff; }
.tone-orange { color: #f28b34; background: #fff3e8; }
.tone-indigo { color: #6674ff; background: #eef1ff; }

@media (max-width: 1400px) {
  .goal-step {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1100px) {
  .goal-reason-grid,
  .goal-select-grid--five,
  .goal-constraints {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .constraint-card--wide {
    grid-column: span 2;
  }
}

@media (max-width: 720px) {
  .goal-form-grid,
  .goal-select-grid,
  .goal-reason-grid,
  .goal-select-grid--five,
  .goal-constraints,
  .goal-select-grid--priority {
    grid-template-columns: 1fr;
  }

  .constraint-range {
    grid-template-columns: 1fr 1fr;
  }

  .constraint-range small {
    display: none;
  }

  .constraint-card--wide {
    grid-column: auto;
  }

  .examples-item,
  .examples-modal__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .examples-item__action,
  .examples-modal__cancel,
  .examples-modal__primary {
    width: 100%;
  }
}
</style>
