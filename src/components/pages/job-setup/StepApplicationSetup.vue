<script setup>
import AppIcon from '../../shared/AppIcon.vue'
import linkedInIcon from '../../../assets/linkedin.svg'

const approaches = [
  {
    title: 'Quick Apply',
    tag: 'Recommended',
    bullets: ['CV upload or Apply with LinkedIn', 'Fewer questions', 'Fastest for candidates', 'Higher completion rate'],
    meta: '1-2 minutes',
    badge: 'Best completion rate',
    active: true,
    tone: 'pink',
  },
  {
    title: 'Standard Application',
    bullets: ['CV upload', '6-10 screening questions', 'Skills & experience', 'Good balance'],
    meta: '3-5 minutes',
    tone: 'blue',
  },
  {
    title: 'Detailed Application',
    bullets: ['CV upload', '11-20 screening questions', 'Detailed insights', 'Better for complex roles'],
    meta: '6-10 minutes',
    tone: 'orange',
  },
]

const topics = [
  { label: 'Experience', note: 'Work history, years of…', active: true, tone: 'pink' },
  { label: 'Skills', note: 'Technical skills, tools…', active: true, tone: 'violet' },
  { label: 'Education', note: 'Degrees, certifications…', active: true, tone: 'blue' },
  { label: 'Competencies', note: 'Problem solving, critical…', active: true, tone: 'yellow' },
  { label: 'Availability', note: 'Start date, notice period…', active: true, tone: 'green' },
  { label: 'Custom Topic', note: 'Add your own topic', tone: 'slate' },
]

const depths = [
  { title: 'Minimal', note: '0–5 Questions', desc: 'Fastest application', meta: '1-2 min' },
  { title: 'Balanced', note: '6–10 Questions', desc: 'Good candidate insights', meta: '3-5 min', active: true, tag: 'Recommended' },
  { title: 'Comprehensive', note: '11–20 Questions', desc: 'Maximum screening data', meta: '6-10 min' },
  { title: 'Custom', note: 'Choose exact number', desc: '5-7 min', meta: '12', slider: true },
]

const coverages = [
  ['Experience', 100],
  ['Skills', 100],
  ['Availability', 100],
  ['Motivation', 70],
  ['Personality', 45],
  ['Leadership', 40],
]

const questions = [
  { text: 'How many years of experience do you have in accounting or finance?', type: 'Multiple choice' },
  { text: 'Do you have experience with ERP or accounting systems like SAP?', type: 'Yes / No' },
  { text: 'Which accounting standards are you most familiar with?', type: 'Multiple choice' },
  { text: 'What is your current notice period?', type: 'Dropdown' },
]

const previewBenefits = [
  'Takes less than 5 minutes',
  'Mobile friendly',
  'Save and continue anytime',
  'Secure and GDPR compliant',
]
</script>

<template>
  <section class="experience-step">
    <div class="experience-step__main">
      <section class="experience-hero">
        <div>
          <h2>Candidate Experience Designer</h2>
          <span>Design a simple, engaging application that attracts top talent and gets more completions.</span>
        </div>
        <button class="recommend-button" type="button">
          <AppIcon name="sparkles" :size="14" />
          AI Recommendations
          <span>3</span>
        </button>
      </section>

      <section class="experience-block">
        <div class="experience-block__head">
          <strong>1. Choose application approach</strong>
          <span>Pick the right balance for your goals. Recommended by best match rate.</span>
        </div>

        <div class="approach-grid">
          <article
            v-for="item in approaches"
            :key="item.title"
            class="approach-card panel"
            :class="[{ 'is-active': item.active }, `approach-card--${item.tone}`]"
          >
            <div class="approach-card__head">
              <div class="approach-card__icon">
                <AppIcon :name="item.tone === 'blue' ? 'document' : item.tone === 'orange' ? 'clipboard-check' : 'bolt'" :size="18" />
              </div>
              <div>
                <strong>{{ item.title }}</strong>
                <small v-if="item.tag">{{ item.tag }}</small>
              </div>
              <span class="approach-card__radio" :class="{ 'is-active': item.active }" />
            </div>

            <ul>
              <li v-for="bullet in item.bullets" :key="bullet">
                <AppIcon name="check" :size="12" />
                {{ bullet }}
              </li>
            </ul>

            <div class="approach-card__meta">
              <span>{{ item.meta }}</span>
              <strong v-if="item.badge">{{ item.badge }}</strong>
            </div>
          </article>
        </div>
      </section>

      <section class="experience-block">
        <div class="experience-block__head">
          <strong>2. What do you want to learn about candidates?</strong>
          <span>Select the topics that matter most. AI will generate the right questions.</span>
        </div>

        <div class="topic-grid">
          <button
            v-for="item in topics"
            :key="item.label"
            class="topic-chip"
            :class="[`topic-chip--${item.tone}`, { 'is-active': item.active }]"
            type="button"
          >
            <AppIcon :name="item.label === 'Experience' ? 'briefcase' : item.label === 'Skills' ? 'bolt' : item.label === 'Education' ? 'copy' : item.label === 'Competencies' ? 'star' : item.label === 'Availability' ? 'calendar' : 'plus'" :size="13" />
            <div>
              <strong>{{ item.label }}</strong>
              <span>{{ item.note }}</span>
            </div>
            <AppIcon v-if="item.active" name="checkCircle" :size="13" />
          </button>
        </div>
      </section>

      <section class="depth-layout panel">
        <div class="depth-layout__main">
          <div class="experience-block__head">
            <strong>2.5 Set application depth</strong>
            <span>Control how many questions candidates will answer.</span>
          </div>

          <div class="depth-grid">
            <article
              v-for="item in depths"
              :key="item.title"
              class="depth-card"
              :class="{ 'is-active': item.active }"
            >
              <div class="depth-card__head">
                <strong>{{ item.title }}</strong>
                <span class="approach-card__radio" :class="{ 'is-active': item.active }" />
              </div>
              <small v-if="item.tag">{{ item.tag }}</small>
              <p>{{ item.note }}</p>
              <span>{{ item.desc }}</span>
              <div v-if="item.slider" class="slider-row">
                <span />
                <strong>{{ item.meta }}</strong>
              </div>
              <div v-else class="depth-card__meta">{{ item.meta }}</div>
            </article>
          </div>
        </div>

        <div class="coverage-card">
          <strong>AI Coverage <span>(Based on depth)</span></strong>
          <div class="coverage-list">
            <div v-for="[label, value] in coverages" :key="label" class="coverage-row">
              <div class="coverage-row__top">
                <span>{{ label }}</span>
                <strong>{{ value }}%</strong>
              </div>
              <div class="coverage-bar"><span :style="{ width: `${value}%` }" /></div>
            </div>
          </div>
        </div>
      </section>

      <section class="experience-block">
        <div class="experience-block__head experience-block__head--split">
          <div class="questions-head">
            <div class="questions-head__title-row">
              <strong>3. AI Generated Screening Questions</strong>
              <span class="questions-head__badge">AI Generated</span>
            </div>
            <span class="questions-head__subtitle">Tailored to this role and your selected topics.</span>
          </div>
          <button class="text-action" type="button">+ Add custom question</button>
        </div>

        <div class="question-list panel">
          <article v-for="item in questions" :key="item.text" class="question-row">
            <div>
              <strong>{{ item.text }}</strong>
              <small>{{ item.type }}</small>
            </div>
            <div class="question-row__actions">
              <button type="button">Edit</button>
              <button type="button">Delete</button>
              <label><span class="toggle is-active" /> Required</label>
            </div>
          </article>
        </div>
      </section>
    </div>

    <aside class="experience-preview panel">
      <div class="experience-preview__head">
        <strong>Candidate Experience Preview</strong>
        <span>See how candidates will experience your application.</span>
      </div>

      <div class="preview-tabs">
        <button class="is-active" type="button">Desktop</button>
        <button type="button">Tablet</button>
        <button type="button">Mobile</button>
      </div>

      <div class="preview-card">
        <div class="preview-card__brand">
          <div class="preview-card__logo">N</div>
          <strong>NitroSync</strong>
          <span>Apply in under 5 minutes</span>
        </div>

        <h3>Senior Accountant</h3>
        <div class="preview-card__meta">
          <span>Finance</span>
          <span>Stockholm, Sweden</span>
          <span>Hybrid</span>
        </div>

        <div class="preview-upload">
          <div class="preview-upload__icon">
            <AppIcon name="cloud-upload" :size="22" />
          </div>
          <strong>Upload your CV</strong>
          <span>Drag & drop your file here<br />PDF, DOCX, OR XLSX</span>
        </div>

        <div class="preview-divider">OR</div>

        <button class="linkedin-button" type="button">
          <img :src="linkedInIcon" alt="LinkedIn" />
          <span>Apply with LinkedIn</span>
        </button>

        <div class="preview-benefits">
          <strong>Why candidates love this application</strong>
          <ul>
            <li v-for="item in previewBenefits" :key="item">
              <AppIcon name="check" :size="12" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <div class="preview-info">
          <AppIcon name="bolt" :size="15" />
          <div>
            <strong>You'll receive only 4 extra questions</strong>
            <span>AI will adapt based on answers</span>
          </div>
        </div>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.experience-step {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 338px;
  gap: 18px;
}

.experience-step__main {
  display: grid;
  gap: 18px;
}

.panel {
  border: 1px solid #e8edf5;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.experience-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.experience-hero h2 {
  margin: 0 0 8px;
  color: #18233f;
  font-size: 24px;
}

.experience-hero span,
.experience-block__head span,
.topic-chip span,
.preview-card span {
  color: #70809a;
  font-size: 14px;
  line-height: 1.55;
}

.recommend-button {
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ef4fa0;
  background: #fff0f7;
  font-size: 14px;
  font-weight: 700;
}

.recommend-button span {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #ef4fa0;
  font-size: 12px;
}

.experience-block {
  display: grid;
  gap: 18px;
}

.experience-block__head {
  display: grid;
  gap: 6px;
}

.experience-block__head strong,
.approach-card strong,
.topic-chip strong,
.depth-card strong,
.coverage-card strong,
.preview-card h3,
.experience-preview strong {
  color: #1f2a44;
}

.experience-block__head strong {
  font-size: 18px;
}

.experience-block__head--split {
  display: flex;
  align-items: end;
  justify-content: space-between;
}

.approach-grid,
.depth-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.approach-card,
.depth-card {
  padding: 18px;
}

.approach-card.is-active,
.depth-card.is-active {
  border-color: #ef4fa0;
  box-shadow: inset 0 0 0 1px rgba(239, 79, 160, 0.16);
}

.approach-card__head,
.depth-card__head,
.coverage-row__top,
.preview-card__brand,
.question-row,
.question-row__actions {
  display: flex;
  align-items: center;
}

.approach-card__head {
  gap: 12px;
  margin-bottom: 16px;
}

.approach-card__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef4fa0;
  background: #fff0f7;
}

.approach-card--blue .approach-card__icon {
  color: #4f6ef6;
  background: #edf2ff;
}

.approach-card--orange .approach-card__icon {
  color: #f28b34;
  background: #fff3e8;
}

.approach-card__head strong,
.depth-card strong {
  display: block;
  font-size: 18px;
}

.approach-card__head small,
.depth-card small {
  display: inline-flex;
  margin-top: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  color: #ef4fa0;
  background: #fff0f7;
  font-size: 10px;
  font-weight: 700;
}

.approach-card__radio {
  width: 18px;
  height: 18px;
  margin-left: auto;
  border: 1px solid #cad3e1;
  border-radius: 50%;
}

.approach-card__radio.is-active {
  border-color: #ef4fa0;
  box-shadow: inset 0 0 0 4px #ef4fa0;
}

.approach-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  color: #56657f;
  font-size: 14px;
}

.approach-card li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.approach-card li svg {
  color: #22b661;
}

.approach-card__meta {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #edf2f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.approach-card__meta span,
.approach-card__meta strong,
.depth-card p,
.depth-card span,
.depth-card__meta,
.coverage-row span,
.coverage-row strong,
.question-row small,
.preview-card__meta span,
.preview-benefits span,
.preview-info span {
  color: #8b97ad;
  font-size: 12px;
}

.approach-card__meta strong {
  color: #ef4fa0;
  font-weight: 700;
}

.topic-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.topic-chip {
  min-height: 52px;
  padding: 0 14px;
  border: 1px dashed #dbe3ef;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  background: #fff;
  flex: 0 1 264px;
  min-width: 0;
}

.topic-chip.is-active {
  border-style: solid;
}

.topic-chip strong {
  display: block;
  font-size: 13px;
}

.topic-chip > div {
  min-width: 0;
}

.topic-chip span {
  display: block;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topic-chip--pink.is-active { border-color: #ef4fa0; color: #ef4fa0; background: #fff8fc; }
.topic-chip--violet.is-active { border-color: #8b5cf6; color: #8b5cf6; background: #faf5ff; }
.topic-chip--blue.is-active { border-color: #4f6ef6; color: #4f6ef6; background: #f5f8ff; }
.topic-chip--yellow.is-active { border-color: #f1a61c; color: #f1a61c; background: #fffaf0; }
.topic-chip--green.is-active { border-color: #22b661; color: #22b661; background: #f3fff7; }

.depth-layout {
  padding: 22px;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: 22px;
  align-items: start;
}

.depth-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.depth-card {
  border: 1px solid #e4ebf4;
  border-radius: 16px;
  display: grid;
  gap: 8px;
  background: #fff;
  min-width: 0;
}

.depth-card__head {
  gap: 8px;
  align-items: start;
}

.depth-card p {
  margin: 0;
  color: #8090a8;
  font-size: 12px;
  line-height: 1.45;
}

.depth-card span {
  font-size: 12px;
  line-height: 1.45;
}

.depth-card__meta {
  margin-top: auto;
}

.depth-card strong {
  font-size: 15px;
  line-height: 1.2;
}

.depth-card small {
  width: fit-content;
  margin-top: -2px;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
}

.slider-row span {
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f8d1e6 0%, #ef4fa0 74%, #f3f6fb 74%);
}

.slider-row strong {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef4fa0;
  background: #fff0f7;
  font-size: 12px;
}

.coverage-card {
  padding-left: 20px;
  border-left: 1px solid #e8edf5;
  min-width: 0;
}

.coverage-card strong {
  display: block;
  margin-bottom: 14px;
  font-size: 15px;
}

.coverage-card strong span {
  color: #9aa6bb;
  font-size: 11px;
}

.coverage-list {
  display: grid;
  gap: 10px;
}

.coverage-row__top {
  justify-content: space-between;
  margin-bottom: 5px;
}

.coverage-row span {
  font-size: 11px;
}

.coverage-row strong {
  font-size: 11px;
}

.coverage-bar {
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  background: #f0f3f8;
}

.coverage-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f56cb3 0%, #e5429f 100%);
}

.question-list {
  padding: 6px 20px;
}

.question-row {
  justify-content: space-between;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #edf2f8;
}

.question-row:last-child {
  border-bottom: 0;
}

.question-row strong {
  display: block;
  margin-bottom: 6px;
  font-size: 15px;
}

.question-row__actions {
  gap: 14px;
}

.question-row__actions button,
.question-row__actions label {
  border: 0;
  color: #8f9cb0;
  background: transparent;
  font-size: 12px;
}

.question-row__actions label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.questions-head {
  display: grid;
  gap: 8px;
}

.questions-head__title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.questions-head__badge {
  width: fit-content;
  padding: 4px 9px;
  border-radius: 999px;
  color: #ef4fa0;
  background: #fff1f7;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.questions-head__subtitle {
  display: block;
  color: #70809a;
  font-size: 14px;
  line-height: 1.55;
}

.toggle {
  width: 34px;
  height: 20px;
  border-radius: 999px;
  background: #e6ebf4;
}

.toggle.is-active {
  background: linear-gradient(90deg, #f56cb3 0%, #e6439f 100%);
}

.text-action,
.linkedin-button {
  border: 0;
  color: #ef4fa0;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.text-action {
  align-self: start;
  padding-top: 4px;
  white-space: nowrap;
}

.experience-preview {
  padding: 22px;
  display: grid;
  gap: 14px;
  align-content: start;
}

.experience-preview__head strong {
  display: block;
  margin-bottom: 6px;
  font-size: 18px;
}

.preview-tabs {
  padding: 4px;
  border: 1px solid #e8edf5;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  background: #fff;
}

.preview-tabs button {
  height: 28px;
  border: 0;
  border-radius: 8px;
  color: #9aa6bb;
  background: transparent;
  font-size: 11px;
  font-weight: 700;
}

.preview-tabs .is-active {
  color: #ef4fa0;
  background: #fff0f7;
}

.preview-card {
  border: 1px solid #e8edf5;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  min-width: 0;
}

.preview-card__brand,
.preview-card__meta,
.preview-benefits li,
.preview-info {
  display: flex;
  align-items: center;
}

.preview-card__brand {
  gap: 10px;
  padding: 18px 20px 12px;
}

.preview-card__logo {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #ef4fa0;
  font-size: 12px;
  font-weight: 800;
}

.preview-card__brand strong {
  font-size: 14px;
}

.preview-card__brand span {
  margin-left: auto;
  color: #ef4fa0;
  font-size: 11px;
  font-weight: 700;
}

.preview-card h3 {
  margin: 0;
  padding: 0 20px;
  font-size: 18px;
}

.preview-card__meta {
  gap: 14px;
  padding: 12px 20px 0;
}

.preview-upload {
  margin: 20px;
  padding: 28px 16px;
  border: 1px dashed #f5bfdc;
  border-radius: 18px;
  text-align: center;
}

.preview-upload__icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 14px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef4fa0;
  background: #fff0f7;
}

.preview-upload strong {
  display: block;
  margin-bottom: 6px;
  font-size: 16px;
}

.preview-divider {
  text-align: center;
  color: #adb8c9;
  font-size: 11px;
  font-weight: 700;
}

.linkedin-button {
  height: 38px;
  margin: 16px auto 0;
  border: 1px solid #dfe6f1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  color: #44536e;
  background: #fff;
}

.linkedin-button img {
  width: 15px;
  height: 15px;
  display: block;
}

.preview-benefits {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(180deg, #fff7fb 0%, #fffafc 100%);
}

.preview-benefits strong {
  display: block;
  margin-bottom: 14px;
  font-size: 14px;
}

.preview-benefits ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.preview-benefits li {
  gap: 8px;
  color: #53627c;
  font-size: 13px;
}

.preview-benefits li svg {
  color: #ef4fa0;
}

.preview-info {
  gap: 12px;
  margin: 18px 20px 20px;
  padding: 16px;
  border-radius: 14px;
  background: #f4f7ff;
}

.preview-info svg {
  color: #4f6ef6;
}

.preview-info strong {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
}

@media (max-width: 1400px) {
  .experience-step {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1100px) {
  .approach-grid,
  .depth-layout {
    grid-template-columns: 1fr;
  }

  .depth-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .depth-layout {
    padding: 20px;
  }

  .coverage-card {
    padding-left: 0;
    border-left: 0;
    border-top: 1px solid #e8edf5;
    padding-top: 18px;
  }
}

@media (max-width: 720px) {
  .experience-hero,
  .experience-block__head--split,
  .question-row,
  .question-row__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .depth-grid,
  .approach-grid {
    grid-template-columns: 1fr;
  }

  .topic-chip {
    flex-basis: 100%;
  }
}
</style>
