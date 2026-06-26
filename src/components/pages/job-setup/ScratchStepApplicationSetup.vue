<script setup>
import AppIcon from '../../shared/AppIcon.vue'

const approaches = [
  {
    title: 'Quick Apply',
    description: 'Short and simple for higher completion rates.',
    bullets: ['Short form flow', 'Focus on essentials', 'Best mobile flow', 'Fastest to hire'],
    meta: '1-2 minutes',
    icon: 'bolt',
    tone: 'pink',
    active: true,
  },
  {
    title: 'Standard Application',
    description: 'Balanced for quality and candidate insights.',
    bullets: ['Balanced intake flow', '6-10 screening questions', 'Skills & experience', 'Good balance'],
    meta: '3-5 minutes',
    icon: 'document',
    tone: 'blue',
  },
  {
    title: 'Detailed Application',
    description: 'In-depth information for complex roles.',
    bullets: ['In-depth intake flow', '10+ screening questions', 'Detailed insights', 'Better for senior roles'],
    meta: '8-10 minutes',
    icon: 'calendar',
    tone: 'orange',
  },
]

const topics = [
  { title: 'Experience', note: 'Work history & roles', icon: 'briefcase', tone: 'pink', active: true },
  { title: 'Skills', note: 'Technical skills, tools', icon: 'bolt', tone: 'violet' },
  { title: 'Education', note: 'Degrees, certifications', icon: 'copy', tone: 'blue' },
  { title: 'Availability', note: 'Start date, notice period', icon: 'calendar', tone: 'green' },
  { title: 'Custom topic', note: 'Add your own topic', icon: 'plus', tone: 'mint' },
  { title: 'Competencies', note: 'Problem solving, critical...', icon: 'star', tone: 'yellow' },
]

const depths = [
  { title: 'Minimal', count: '4-8 questions', note: 'Fastest application', extra: 'Higher drop-off', meta: '1-2 min' },
  { title: 'Balanced', count: '8-14 questions', note: 'Good candidate insights', extra: 'Good completion rate', meta: '3-5 min', active: true },
  { title: 'Comprehensive', count: '14-20 questions', note: 'Maximum relevancy data', extra: 'Lower completion rate', meta: '5-10 min' },
  { title: 'Custom', count: 'Choose your number', note: '', extra: '', meta: '8-30+ min', custom: '12' },
]

const sections = [
  {
    title: 'Personal details',
    rows: [
      ['Full name', 'Short answer'],
      ['Email address', 'Email'],
      ['Phone number', 'Phone'],
      ['Location', 'Short answer'],
    ],
  },
  {
    title: 'Work experience',
    rows: [
      ['Current or most recent job title', 'Short answer'],
      ['Company', 'Short answer'],
      ['Years of experience', 'Number'],
      ['Notice period', 'Dropdown'],
    ],
  },
  {
    title: 'Resume',
    rows: [
      ['Upload resume', 'File upload'],
    ],
  },
]
</script>

<template>
  <section class="scratch-experience">
    <div class="scratch-experience__main">
      <header class="experience-hero">
        <div>
          <h2>Candidate Experience Designer</h2>
          <p>Design a simple, engaging application that attracts top talent and gets more completions.</p>
        </div>

        <button class="preview-button" type="button">
          <AppIcon name="eye" :size="15" />
          Preview Job
        </button>
      </header>

      <section class="block">
        <div class="block__head">
          <h3>1. Choose application approach</h3>
          <p>Pick the right balance for your goals.</p>
        </div>

        <div class="approach-grid">
          <article
            v-for="item in approaches"
            :key="item.title"
            class="approach-card panel"
            :class="[{ 'is-active': item.active }, `approach-card--${item.tone}`]"
          >
            <div class="approach-card__top">
              <span class="approach-card__icon">
                <AppIcon :name="item.icon" :size="17" />
              </span>
              <span class="approach-card__radio" :class="{ 'is-active': item.active }" />
            </div>

            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>

            <ul>
              <li v-for="bullet in item.bullets" :key="bullet">
                <AppIcon name="check" :size="11" />
                {{ bullet }}
              </li>
            </ul>

            <div class="approach-card__meta">
              <AppIcon name="clock" :size="12" />
              <span>{{ item.meta }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="block">
        <div class="block__head">
          <h3>2. What do you want to learn about candidates?</h3>
          <p>Select the topics that matter most. We'll show relevant fields and questions.</p>
        </div>

        <div class="topic-grid">
          <button
            v-for="item in topics"
            :key="item.title"
            class="topic-card panel"
            :class="[`topic-card--${item.tone}`, { 'is-active': item.active }]"
            type="button"
          >
            <span class="topic-card__icon">
              <AppIcon :name="item.icon" :size="15" />
            </span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.note }}</p>
            </div>
            <span class="topic-card__check" :class="{ 'is-active': item.active }" />
          </button>
        </div>
      </section>

      <section class="block">
        <div class="block__head">
          <h3>2.5 Set application depth</h3>
          <p>Control how many questions candidates will answer.</p>
        </div>

        <div class="depth-grid">
          <article
            v-for="item in depths"
            :key="item.title"
            class="depth-card panel"
            :class="{ 'is-active': item.active }"
          >
            <div class="depth-card__top">
              <strong>{{ item.title }}</strong>
              <span class="approach-card__radio" :class="{ 'is-active': item.active }" />
            </div>

            <small>{{ item.count }}</small>
            <p>{{ item.note }}</p>
            <span>{{ item.extra }}</span>

            <div v-if="item.custom" class="custom-meter">
              <span />
              <b>{{ item.custom }}</b>
            </div>

            <div class="depth-card__meta">
              <AppIcon name="clock" :size="12" />
              {{ item.meta }}
            </div>
          </article>

          <article class="tip-card panel">
            <span class="tip-card__icon"><AppIcon name="alert" :size="14" /></span>
            <strong>Tip</strong>
            <p>Balanced is our recommended option for most roles.</p>
          </article>
        </div>
      </section>

      <section class="block">
        <div class="block__head block__head--split">
          <div>
            <h3>3. Build your application</h3>
            <p>Add and configure the fields your candidates will complete.</p>
          </div>

          <button class="add-section-button" type="button">
            <AppIcon name="plus" :size="13" />
            Add section
          </button>
        </div>

        <section class="builder-table panel">
          <header class="builder-table__head">
            <span>Section / Field</span>
            <span>Type</span>
            <span>Required</span>
            <span>Actions</span>
          </header>

          <div v-for="section in sections" :key="section.title" class="builder-section">
            <div class="builder-section__title">
              <span class="drag-handle" />
              <strong>{{ section.title }}</strong>
              <button type="button"><AppIcon name="more" :size="14" /></button>
            </div>

            <article v-for="[field, type] in section.rows" :key="field" class="builder-row">
              <span class="drag-handle drag-handle--light" />
              <span class="builder-row__field">{{ field }}</span>
              <span class="builder-row__type">{{ type }}</span>
              <span class="builder-row__required">
                <span class="required-pill" />
              </span>
              <div class="builder-row__actions">
                <button type="button"><AppIcon name="edit" :size="13" /></button>
                <button type="button"><AppIcon name="trash" :size="13" /></button>
              </div>
            </article>
          </div>

          <button class="add-field-row" type="button">
            <AppIcon name="plus" :size="14" />
            Add field
          </button>
        </section>
      </section>
    </div>

    <aside class="scratch-experience__side">
      <section class="preview-panel panel">
        <div class="preview-panel__head">
          <strong>Candidate Experience Preview</strong>
          <p>This is how candidates will see your application.</p>
        </div>

        <div class="device-tabs">
          <button class="is-active" type="button">Desktop</button>
          <button type="button">Tablet</button>
          <button type="button">Mobile</button>
        </div>

        <div class="phone-frame">
          <div class="phone-frame__brand">
            <strong>NitroSync</strong>
          </div>

          <div class="phone-frame__job">
            <h4>Senior Accountant</h4>
            <div>
              <span>Draft</span>
              <b>Finance</b>
            </div>
          </div>

          <div class="phone-frame__progress">
            <span class="phone-frame__dot" />
            <strong>Define Role</strong>
          </div>

          <div class="phone-frame__content">
            <small>Step 5 of 8</small>
            <h5>Review &amp; Evaluation</h5>
            <p>Define how candidates will be evaluated and what criteria determine their progress in the process.</p>

            <div class="mini-card">
              <span class="mini-card__icon"><AppIcon name="bolt" :size="13" /></span>
              <div>
                <strong>1. Evaluation criteria</strong>
                <p>Choose the competencies and criteria the team will evaluate candidates on.</p>
              </div>
            </div>
          </div>

          <button class="phone-frame__next" type="button">Next</button>
        </div>
      </section>

      <section class="preview-note panel">
        <div class="preview-note__head">
          <AppIcon name="clock" :size="15" />
          <strong>Preview mode</strong>
        </div>
        <p>This preview uses example content. Actual questions will reflect your configuration.</p>
      </section>
    </aside>
  </section>
</template>

<style scoped>
.scratch-experience {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 392px;
  gap: 28px;
  align-items: start;
}

.scratch-experience__main,
.scratch-experience__side {
  display: grid;
  gap: 24px;
  align-content: start;
}

.scratch-experience__side {
  position: sticky;
  top: 16px;
}

.experience-hero,
.block__head--split,
.approach-card__top,
.depth-card__top,
.topic-card,
.builder-section__title,
.builder-row,
.builder-row__actions,
.preview-panel__head,
.preview-note__head {
  display: flex;
}

.experience-hero {
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.experience-hero h2 {
  margin: 0 0 10px;
  color: #1d2640;
  font-size: 32px;
  line-height: 1.14;
  font-weight: 800;
}

.experience-hero p,
.block__head p,
.approach-card p,
.topic-card p,
.preview-panel__head p,
.phone-frame__content p,
.mini-card p,
.preview-note p {
  margin: 0;
  color: #6f7d95;
  font-size: 15px;
  line-height: 1.6;
}

.preview-button,
.add-section-button,
.device-tabs button,
.phone-frame__next {
  border: 1px solid #dce4f0;
  background: #fff;
}

.preview-button {
  min-height: 42px;
  padding: 0 18px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #24314d;
  font-size: 14px;
  font-weight: 700;
}

.block {
  display: grid;
  gap: 18px;
}

.block__head {
  display: grid;
  gap: 6px;
}

.block__head h3 {
  margin: 0;
  color: #1f2a44;
  font-size: 18px;
  font-weight: 800;
}

.block__head--split {
  align-items: end;
  justify-content: space-between;
  gap: 14px;
}

.panel {
  border: 1px solid #e7edf7;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
}

.approach-grid,
.topic-grid,
.depth-grid {
  display: grid;
  gap: 14px;
}

.approach-grid,
.depth-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.approach-card,
.depth-card {
  padding: 18px;
}

.approach-card {
  min-height: 286px;
  display: grid;
  align-content: start;
  gap: 14px;
}

.approach-card.is-active,
.depth-card.is-active,
.topic-card.is-active {
  border-color: #f163ae;
  box-shadow: inset 0 0 0 1px rgba(241, 99, 174, 0.16);
}

.approach-card__top {
  align-items: center;
  justify-content: space-between;
}

.approach-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f163ae;
  background: #fff0f7;
}

.approach-card--blue .approach-card__icon {
  color: #4f7ef6;
  background: #eef4ff;
}

.approach-card--orange .approach-card__icon {
  color: #ff8b1f;
  background: #fff3e4;
}

.approach-card strong,
.topic-card strong,
.depth-card strong,
.builder-section__title strong,
.mini-card strong,
.preview-panel strong {
  color: #1f2a44;
}

.approach-card strong,
.depth-card strong {
  font-size: 17px;
  font-weight: 800;
}

.approach-card__radio,
.topic-card__check {
  width: 18px;
  height: 18px;
  border: 1px solid #ccd6e5;
  border-radius: 50%;
  flex-shrink: 0;
}

.approach-card__radio.is-active,
.topic-card__check.is-active {
  border-color: #f163ae;
  box-shadow: inset 0 0 0 4px #f163ae;
}

.approach-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  color: #4d5b74;
  font-size: 14px;
}

.approach-card li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.approach-card li :deep(svg) {
  color: #4cd07e;
}

.approach-card__meta,
.depth-card__meta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8b97ab;
  font-size: 13px;
}

.topic-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.topic-card {
  min-height: 66px;
  padding: 0 14px;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}

.topic-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f7f9fc;
}

.topic-card div {
  margin-right: auto;
}

.topic-card strong {
  display: block;
  font-size: 15px;
  font-weight: 700;
}

.topic-card p {
  font-size: 12px;
}

.topic-card--pink .topic-card__icon { color: #f163ae; background: #fff0f7; }
.topic-card--violet .topic-card__icon { color: #6b5cff; background: #f2efff; }
.topic-card--blue .topic-card__icon { color: #4f7ef6; background: #eef4ff; }
.topic-card--green .topic-card__icon { color: #22c55e; background: #effcf3; }
.topic-card--mint .topic-card__icon { color: #10b981; background: #ecfdf5; }
.topic-card--yellow .topic-card__icon { color: #f4b000; background: #fff7e7; }

.depth-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.depth-card {
  min-height: 156px;
  display: grid;
  align-content: start;
  gap: 10px;
}

.depth-card__top {
  align-items: center;
  justify-content: space-between;
}

.depth-card small {
  color: #71809a;
  font-size: 12px;
  font-weight: 700;
}

.depth-card p,
.depth-card > span {
  color: #8692a9;
  font-size: 13px;
}

.custom-meter {
  margin-top: 4px;
  display: grid;
  gap: 6px;
}

.custom-meter span {
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #eceff6 0%, #dfe5f2 70%, #eceff6 100%);
}

.custom-meter b {
  width: fit-content;
  min-width: 28px;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f163ae;
  background: #fff0f7;
  font-size: 11px;
}

.tip-card {
  padding: 18px;
  display: grid;
  align-content: start;
  gap: 10px;
  background: linear-gradient(180deg, #fff8ef 0%, #fffaf4 100%);
}

.tip-card__icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff8b1f;
  background: #fff0df;
}

.tip-card strong {
  color: #ff8b1f;
  font-size: 15px;
}

.tip-card p {
  color: #d67935;
  font-size: 13px;
}

.add-section-button {
  min-height: 34px;
  padding: 0 14px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ff68b5;
  font-size: 13px;
  font-weight: 700;
}

.builder-table {
  overflow: hidden;
}

.builder-table__head,
.builder-row {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(140px, 0.9fr) 120px 120px;
  column-gap: 20px;
  align-items: center;
}

.builder-table__head {
  padding: 14px 22px;
  color: #9aa6bb;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.builder-section__title {
  padding: 16px 22px;
  align-items: center;
  gap: 12px;
  border-top: 1px solid #edf2f8;
}

.builder-section__title button,
.builder-row__actions button {
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a0adbf;
  background: transparent;
}

.builder-section__title button {
  margin-left: auto;
}

.builder-row {
  padding: 14px 22px;
  border-top: 1px solid #f1f4f9;
  color: #516079;
  font-size: 14px;
}

.builder-row__field {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.builder-row__required {
  display: flex;
  justify-content: center;
}

.required-pill {
  width: 16px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
}

.builder-row__actions {
  gap: 14px;
  justify-content: flex-end;
}

.drag-handle {
  width: 8px;
  height: 18px;
  background-image: radial-gradient(#cfd7e4 1px, transparent 1px);
  background-size: 4px 4px;
  background-position: 0 0;
}

.drag-handle--light {
  opacity: 0.7;
}

.add-field-row {
  width: calc(100% - 44px);
  min-height: 54px;
  margin: 16px 22px 22px;
  border: 1px dashed #e1e7f2;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ff68b5;
  background: #fff;
  font-size: 15px;
  font-weight: 700;
}

.preview-panel,
.preview-note {
  padding: 20px;
}

.preview-panel__head,
.preview-note__head {
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.preview-panel strong,
.preview-note strong {
  color: #1f2a44;
  font-size: 16px;
  font-weight: 800;
}

.device-tabs {
  margin-top: 18px;
  padding: 4px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: #f7f8fc;
}

.device-tabs button {
  min-height: 30px;
  border: 0;
  border-radius: 10px;
  color: #a0aabd;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
}

.device-tabs button.is-active {
  color: #1f2a44;
  background: #fff;
}

.phone-frame {
  margin-top: 18px;
  border: 1px solid #eef2f8;
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
}

.phone-frame__brand,
.phone-frame__job,
.phone-frame__progress,
.phone-frame__content {
  padding-left: 18px;
  padding-right: 18px;
}

.phone-frame__brand {
  padding-top: 18px;
  color: #5f6d86;
  font-size: 12px;
}

.phone-frame__job {
  padding-top: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid #f0f3f9;
}

.phone-frame__job h4 {
  margin: 0 0 12px;
  color: #202b43;
  font-size: 18px;
  font-weight: 800;
}

.phone-frame__job div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.phone-frame__job span {
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #8a8fa1;
  background: #f4f5f9;
  font-size: 12px;
  font-weight: 700;
}

.phone-frame__job b {
  color: #8692a6;
  font-size: 13px;
  font-weight: 600;
}

.phone-frame__progress {
  min-height: 52px;
  border-bottom: 1px solid #f0f3f9;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #99a5b8;
  font-size: 13px;
}

.phone-frame__dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #eef1f6;
}

.phone-frame__content {
  padding-top: 28px;
}

.phone-frame__content small {
  color: #7e8ba1;
  font-size: 14px;
}

.phone-frame__content h5 {
  margin: 10px 0 12px;
  color: #1e2741;
  font-size: 22px;
  line-height: 1.15;
  font-weight: 800;
}

.mini-card {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff;
}

.mini-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
  background: #f5edff;
}

.phone-frame__next {
  width: calc(100% - 36px);
  height: 42px;
  margin: 24px 18px 18px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(90deg, #f562ae 0%, #ef69bf 100%);
  font-size: 14px;
  font-weight: 700;
}

.preview-note {
  background: linear-gradient(180deg, #eef3ff 0%, #edf2ff 100%);
}

@media (max-width: 1240px) {
  .scratch-experience {
    grid-template-columns: 1fr;
  }

  .scratch-experience__side {
    position: static;
  }
}

@media (max-width: 940px) {
  .approach-grid,
  .topic-grid {
    grid-template-columns: 1fr;
  }

  .depth-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .builder-table__head,
  .builder-row {
    grid-template-columns: minmax(0, 1.6fr) minmax(120px, 1fr) 88px 88px;
    column-gap: 12px;
  }
}

@media (max-width: 760px) {
  .experience-hero,
  .block__head--split {
    flex-direction: column;
    align-items: stretch;
  }

  .depth-grid {
    grid-template-columns: 1fr;
  }

  .builder-table__head {
    display: none;
  }

  .builder-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
