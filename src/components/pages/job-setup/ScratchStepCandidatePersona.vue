<script setup>
import { ref } from 'vue'
import AppIcon from '../../shared/AppIcon.vue'

const mustHaves = ref([
  { label: 'IFRS experience', checked: true },
  { label: '5+ years in accounting', checked: true },
  { label: 'Accounting degree', checked: true },
  { label: 'Fluent in English', checked: true },
])

const niceToHaves = ref([
  { label: 'SAP experience', checked: false },
  { label: 'Power BI', checked: false },
  { label: 'CPA / ACCA', checked: false },
  { label: 'Big 4 experience', checked: false },
])

const dealBreakers = ref([
  { label: 'No accounting background', checked: false },
  { label: 'No work permit', checked: false },
  { label: 'No finance experience', checked: false },
])

const assistantActions = [
  ['Suggest must-haves', 'plus'],
  ['Suggest nice-to-haves', 'star'],
  ['Suggest deal breakers', 'close'],
  ['Improve job fit', 'bolt'],
  ['Detect missing skills', 'document'],
]

const readiness = [
  { step: 'Define Role', note: 'Describe the role and hiring need', state: 'done' },
  { step: 'Hiring Blueprint', note: 'Review and approve AI blueprint', state: 'done' },
  { step: 'Candidate Persona', note: 'Define your ideal candidate', state: 'active' },
  { step: 'Application Setup', state: 'todo' },
  { step: 'AI Screening', state: 'todo' },
  { step: 'Hiring Pipeline', state: 'todo' },
  { step: 'Interview Kit', state: 'todo' },
  { step: 'Publish Job', state: 'todo' },
]

const snapshot = [
  ['Role', 'Senior Accountant'],
  ['Experience', '5 – 8 years'],
  ['Industry', 'Finance / Accounting'],
  ['Work Preference', 'Hybrid'],
]
</script>

<template>
  <section class="scratch-persona">
    <div class="scratch-persona__main">
      <header class="persona-hero">
        <div class="persona-hero__copy">
          <span class="persona-hero__eyebrow">Step 3 of 8</span>
          <h2>
            Define your ideal candidate
            <AppIcon name="bolt" :size="20" />
          </h2>
          <p>Add must-haves, nice-to-haves and deal breakers to help your team focus on the right candidates.</p>
        </div>

        <div class="persona-hero__actions">
          <button class="ghost-button" type="button">
            <AppIcon name="clock" :size="15" />
            Learn more
          </button>
          <button class="primary-button" type="button">
            <AppIcon name="spark" :size="14" />
            Get AI suggestions
          </button>
        </div>
      </header>

      <section class="group-card panel">
        <div class="group-card__head">
          <div class="group-card__title">
            <span class="group-card__icon tone-green"><AppIcon name="checkCircle" :size="16" /></span>
            <div>
              <strong>Must Have</strong>
              <p>Non-negotiable requirements. Candidates must meet these.</p>
            </div>
          </div>

          <button class="add-button" type="button">+ Add</button>
        </div>

        <div class="criteria-list">
          <article v-for="item in mustHaves" :key="item.label" class="criteria-row">
            <span class="drag-handle" />
            <label class="criteria-check">
              <input type="checkbox" :checked="item.checked">
              <span class="criteria-check__box" />
            </label>
            <strong>{{ item.label }}</strong>
            <div class="criteria-row__actions">
              <button type="button"><AppIcon name="edit" :size="13" /></button>
              <button type="button"><AppIcon name="trash" :size="13" /></button>
            </div>
          </article>
        </div>
      </section>

      <section class="group-card panel">
        <div class="group-card__head">
          <div class="group-card__title">
            <span class="group-card__icon tone-orange"><AppIcon name="star" :size="16" /></span>
            <div>
              <strong>Nice To Have</strong>
              <p>Preferred skills and experience that are a plus.</p>
            </div>
          </div>

          <button class="add-button" type="button">+ Add</button>
        </div>

        <div class="criteria-list">
          <article v-for="item in niceToHaves" :key="item.label" class="criteria-row">
            <span class="drag-handle" />
            <label class="criteria-check">
              <input type="checkbox" :checked="item.checked">
              <span class="criteria-check__box criteria-check__box--empty" />
            </label>
            <strong>{{ item.label }}</strong>
            <div class="criteria-row__actions">
              <button type="button"><AppIcon name="edit" :size="13" /></button>
              <button type="button"><AppIcon name="trash" :size="13" /></button>
            </div>
          </article>
        </div>
      </section>

      <section class="group-card panel">
        <div class="group-card__head">
          <div class="group-card__title">
            <span class="group-card__icon tone-red"><AppIcon name="close" :size="16" /></span>
            <div>
              <strong>Deal Breakers</strong>
              <p>Red flags that would disqualify a candidate.</p>
            </div>
          </div>

          <button class="add-button" type="button">+ Add</button>
        </div>

        <div class="criteria-list">
          <article v-for="item in dealBreakers" :key="item.label" class="criteria-row">
            <span class="drag-handle" />
            <label class="criteria-check">
              <input type="checkbox" :checked="item.checked">
              <span class="criteria-check__box criteria-check__box--empty" />
            </label>
            <strong>{{ item.label }}</strong>
            <div class="criteria-row__actions">
              <button type="button"><AppIcon name="edit" :size="13" /></button>
              <button type="button"><AppIcon name="trash" :size="13" /></button>
            </div>
          </article>
        </div>
      </section>

      <section class="snapshot-card panel">
        <div class="snapshot-card__head">
          <span class="snapshot-card__icon"><AppIcon name="user" :size="16" /></span>
          <div>
            <strong>Ideal Candidate Snapshot</strong>
            <p>A summary of your ideal candidate based on the criteria above.</p>
          </div>
        </div>

        <div class="snapshot-grid">
          <article v-for="[label, value] in snapshot" :key="label">
            <small>{{ label }}</small>
            <strong>{{ value }}</strong>
          </article>
        </div>

        <div class="snapshot-strengths">
          <small>Key strengths</small>
          <strong>IFRS, Reporting, Excel, Analysis</strong>
        </div>
      </section>
    </div>

    <aside class="scratch-persona__side">
      <section class="side-card panel">
        <div class="side-card__head">
          <div class="side-card__title">
            <span class="side-card__spark"><AppIcon name="bolt" :size="14" /></span>
            <strong>AI Help</strong>
          </div>
          <AppIcon name="chevronUp" :size="16" />
        </div>

        <p>Get AI-powered help to build the perfect candidate profile.</p>

        <div class="side-action-list">
          <button v-for="[label, icon] in assistantActions" :key="label" class="side-action" type="button">
            <span>
              <AppIcon :name="icon" :size="14" />
              {{ label }}
            </span>
            <AppIcon name="chevronRight" :size="14" />
          </button>
        </div>

        <button class="info-link" type="button">
          <AppIcon name="info" :size="14" />
          How AI suggestions work
        </button>
      </section>

      <section class="side-card panel">
        <h3>Hiring Readiness</h3>

        <div class="readiness-list">
          <article v-for="(item, index) in readiness" :key="item.step" class="readiness-item" :class="`is-${item.state}`">
            <span class="readiness-item__dot">
              <AppIcon v-if="item.state === 'done'" name="check" :size="11" />
              <template v-else>{{ index + 1 }}</template>
            </span>
            <div>
              <strong>{{ item.step }}</strong>
              <small v-if="item.note">{{ item.note }}</small>
            </div>
          </article>
        </div>
      </section>

      <section class="tip-card panel">
        <span class="tip-card__icon"><AppIcon name="spark" :size="15" /></span>
        <div>
          <strong>Tip</strong>
          <p>Be specific about must-have skills to get the most accurate matches.</p>
        </div>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.scratch-persona {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 374px;
  gap: 30px;
  align-items: start;
}

.scratch-persona__main,
.scratch-persona__side {
  display: grid;
  gap: 24px;
  align-content: start;
}

.scratch-persona__side {
  position: sticky;
  top: 16px;
}

.persona-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.persona-hero__copy {
  max-width: 650px;
}

.persona-hero__eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: #ff4fa0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.persona-hero h2 {
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1c253f;
  font-size: 32px;
  line-height: 1.15;
  font-weight: 800;
}

.persona-hero p,
.group-card__title p,
.side-card p,
.tip-card p,
.snapshot-card__head p,
.readiness-item small {
  margin: 0;
  color: #6d7b94;
  font-size: 15px;
  line-height: 1.6;
}

.persona-hero__actions,
.group-card__head,
.group-card__title,
.criteria-row,
.criteria-row__actions,
.side-card__head,
.side-card__title,
.side-action,
.side-action span,
.snapshot-card__head,
.tip-card {
  display: flex;
}

.persona-hero__actions {
  gap: 12px;
}

.ghost-button,
.primary-button,
.add-button,
.side-action,
.info-link {
  min-height: 46px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
}

.ghost-button,
.add-button,
.side-action {
  border: 1px solid #dce4f0;
  background: #fff;
}

.ghost-button,
.primary-button {
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #1f2b45;
}

.primary-button {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #ff62ab 0%, #ef69c1 100%);
}

.panel {
  border: 1px solid #e6edf7;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.04);
}

.group-card,
.side-card {
  overflow: hidden;
}

.group-card__head,
.snapshot-card {
  padding: 26px 24px;
}

.group-card__head {
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #edf2f8;
}

.group-card__title,
.snapshot-card__head {
  align-items: flex-start;
  gap: 14px;
}

.group-card__title strong,
.snapshot-card__head strong,
.side-card h3 {
  margin: 0;
  color: #1f2942;
  font-size: 18px;
  font-weight: 800;
}

.group-card__icon,
.snapshot-card__icon,
.side-card__spark,
.tip-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tone-green { color: #22c55e; background: #eafbf0; }
.tone-orange { color: #ff8b1f; background: #fff3e4; }
.tone-red { color: #ff5e67; background: #fff0f1; }

.add-button {
  min-width: 76px;
  padding: 0 18px;
  color: #5b62ff;
}

.criteria-list {
  padding: 22px 24px 24px;
  display: grid;
  gap: 14px;
}

.criteria-row {
  min-height: 50px;
  padding: 0 14px;
  align-items: center;
  gap: 14px;
  border: 1px solid #dce4f0;
  border-radius: 12px;
  background: #fff;
}

.drag-handle {
  width: 8px;
  height: 18px;
  background-image: radial-gradient(#d7deea 1px, transparent 1px);
  background-size: 4px 4px;
  background-position: 0 0;
  opacity: 0.9;
}

.criteria-check {
  position: relative;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.criteria-check input {
  position: absolute;
  inset: 0;
  opacity: 0;
}

.criteria-check__box {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid #6b5cff;
  background: #6b5cff;
}

.criteria-check__box::after {
  content: '';
  position: relative;
  top: 5px;
  left: 8px;
  display: block;
  width: 5px;
  height: 9px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg);
}

.criteria-check__box--empty {
  border-color: #cfd8e7;
  background: #fff;
}

.criteria-check__box--empty::after {
  display: none;
}

.criteria-row strong {
  color: #33415d;
  font-size: 17px;
  font-weight: 500;
}

.criteria-row__actions {
  margin-left: auto;
  gap: 10px;
}

.criteria-row__actions button {
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a1adbf;
  background: transparent;
}

.snapshot-card {
  background: linear-gradient(180deg, #f4f7ff 0%, #eef4ff 100%);
}

.snapshot-grid {
  margin-top: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid #dfe8f8;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.snapshot-grid small,
.snapshot-strengths small {
  display: block;
  margin-bottom: 8px;
  color: #8f9bb0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.snapshot-grid strong,
.snapshot-strengths strong {
  color: #1f2942;
  font-size: 17px;
  font-weight: 800;
}

.snapshot-strengths {
  padding-top: 18px;
}

.side-card {
  padding: 20px;
}

.side-card__head {
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.side-card__title {
  align-items: center;
  gap: 10px;
}

.side-card__title strong {
  color: #1f2942;
  font-size: 16px;
  font-weight: 800;
}

.side-card__spark {
  color: #f4b000;
  background: #fff6e8;
}

.side-action-list,
.readiness-list {
  display: grid;
  gap: 12px;
}

.side-action-list {
  margin-top: 22px;
}

.side-action {
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  color: #33415d;
}

.info-link {
  margin-top: 14px;
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #5c63ff;
  background: transparent;
}

.readiness-list {
  margin-top: 20px;
}

.readiness-item {
  padding: 12px 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  color: #b0bacb;
}

.readiness-item__dot {
  width: 22px;
  height: 22px;
  border: 1px solid #d6dfec;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font-size: 12px;
  font-weight: 700;
}

.readiness-item strong {
  display: block;
  margin-bottom: 4px;
  color: inherit;
  font-size: 15px;
  font-weight: 700;
}

.readiness-item.is-done {
  color: #1f2b45;
}

.readiness-item.is-done .readiness-item__dot {
  border-color: #22c55e;
  color: #fff;
  background: #22c55e;
}

.readiness-item.is-active {
  margin: 2px -20px 0;
  padding: 12px 20px;
  color: #1f2b45;
  background: #eef1ff;
}

.readiness-item.is-active .readiness-item__dot {
  border-color: #6b5cff;
  color: #fff;
  background: #6b5cff;
}

.tip-card {
  padding: 24px 20px;
  align-items: flex-start;
  gap: 14px;
  background: linear-gradient(180deg, #fff9f2 0%, #fffaf4 100%);
}

.tip-card__icon {
  color: #ff8b1f;
  background: #fff1df;
}

@media (max-width: 1180px) {
  .scratch-persona {
    grid-template-columns: 1fr;
  }

  .scratch-persona__side {
    position: static;
  }
}

@media (max-width: 860px) {
  .persona-hero,
  .persona-hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .snapshot-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .criteria-row {
    padding: 12px;
    display: grid;
    grid-template-columns: auto auto 1fr auto;
  }

  .snapshot-grid {
    grid-template-columns: 1fr;
  }
}
</style>
