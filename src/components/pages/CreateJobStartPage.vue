<script setup>
import { ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'

const emit = defineEmits(['continue', 'go-jobs'])

const selectedOption = ref('template')

const options = [
  {
    id: 'template',
    title: 'Use saved template',
    description: 'Choose from your existing templates to save time.',
    icon: 'document',
    tone: 'pink',
    badge: 'Recommended',
  },
  {
    id: 'scratch',
    title: 'Start from scratch',
    description: 'Create a job from scratch with full customization and control.',
    icon: 'edit',
    tone: 'blue',
  },
  {
    id: 'ai',
    title: 'Create with AI',
    description: 'Let AI help you generate a complete job description and requirements.',
    icon: 'bolt',
    tone: 'violet',
  },
]

function submit() {
  emit('continue', selectedOption.value)
}

function chooseOption(optionId) {
  selectedOption.value = optionId

  if (optionId === 'ai' || optionId === 'scratch') {
    emit('continue', optionId)
  }
}
</script>

<template>
  <main class="create-job-start">
    <header class="create-job-start__topbar">
      <div class="breadcrumb">
        <button type="button" @click="emit('go-jobs')">
          <AppIcon name="home" :size="14" />
        </button>
        <span>Jobs</span>
        <AppIcon name="chevronRight" :size="13" />
        <span>Post a Job</span>
        <AppIcon name="chevronRight" :size="13" />
        <strong>Create Job</strong>
      </div>
    </header>

    <div class="create-job-start__content">
      <section class="create-job-hero">
        <span class="create-job-hero__eyebrow">Step 0 of 8</span>
        <h1>Create Job</h1>
        <p>Let's start by creating your job. Choose how you want to get started.</p>
      </section>

      <section class="create-job-options">
        <button
          v-for="option in options"
          :key="option.id"
          class="create-option"
          :class="[`create-option--${option.tone}`, { 'is-active': selectedOption === option.id }]"
          type="button"
          @click="chooseOption(option.id)"
        >
          <div class="create-option__icon">
            <AppIcon :name="option.icon" :size="24" />
          </div>
          <strong>{{ option.title }}</strong>
          <p>{{ option.description }}</p>
          <div class="create-option__footer">
            <span v-if="option.badge" class="create-option__badge">
              <AppIcon name="checkCircle" :size="13" />
              {{ option.badge }}
            </span>
          </div>
        </button>
      </section>

      <section class="create-job-note">
        <div class="create-job-note__icon">
          <AppIcon name="lock" :size="18" />
        </div>
        <div class="create-job-note__copy">
          <strong>Your data is secure</strong>
          <span>All job information is encrypted and protected. Only authorized users can access this data.</span>
        </div>
        <div class="create-job-note__dots">
          <span />
          <span />
        </div>
        <div class="create-job-note__shield">
          <div class="create-job-note__shield-core">
            <AppIcon name="checkCircle" :size="18" />
          </div>
        </div>
      </section>

      <div class="create-job-actions">
        <button class="continue-button" type="button" @click="submit">
          Continue
          <AppIcon name="chevronRight" :size="16" />
        </button>
        <span>You can change or edit any information later.</span>
      </div>
    </div>
  </main>
</template>

<style scoped>
.create-job-start {
  min-height: 100%;
  background: #f6f8fc;
}

.create-job-start__topbar {
  height: 58px;
  padding: 0 30px;
  border-bottom: 1px solid #e7edf6;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.82);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6f7d94;
  font-size: 13px;
}

.breadcrumb button {
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  color: #f174bd;
  background: transparent;
}

.breadcrumb strong {
  color: #1f2a44;
}

.create-job-start__content {
  width: min(960px, calc(100% - 56px));
  margin: 0 auto;
  padding: 112px 0 64px;
}

.create-job-hero {
  margin-bottom: 34px;
  text-align: center;
}

.create-job-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 13px;
  border-radius: 999px;
  color: #ff69b6;
  background: #ffeef7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.create-job-hero h1 {
  margin: 14px 0 10px;
  color: #27324a;
  font-size: 32px;
  line-height: 1.1;
}

.create-job-hero p {
  margin: 0;
  color: #6f82a2;
  font-size: 16px;
}

.create-job-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.create-option {
  min-height: 246px;
  padding: 24px 26px 20px;
  border: 1px solid #dde6f1;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #fff;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}

.create-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
}

.create-option.is-active {
  border-width: 2px;
}

.create-option--pink.is-active {
  border-color: #ff66b8;
}

.create-option--blue.is-active {
  border-color: #4f7ff6;
}

.create-option--violet.is-active {
  border-color: #9d58f6;
}

.create-option__icon {
  width: 48px;
  height: 48px;
  margin-bottom: 18px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.create-option--pink .create-option__icon {
  background: #ef6ab8;
}

.create-option--blue .create-option__icon {
  background: #4a7ff6;
}

.create-option--violet .create-option__icon {
  background: #9f56f8;
}

.create-option strong {
  margin-bottom: 12px;
  color: #27324a;
  font-size: 18px;
  line-height: 1.3;
}

.create-option--pink strong {
  color: #ff66b8;
}

.create-option p {
  margin: 0;
  color: #70809a;
  font-size: 13px;
  line-height: 1.65;
}

.create-option__footer {
  width: 100%;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #eef2f8;
}

.create-option__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ff66b8;
  font-size: 13px;
  font-weight: 700;
}

.create-job-note {
  margin-top: 32px;
  padding: 16px 18px;
  border: 1px solid #d9e5fb;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto 38px;
  align-items: center;
  gap: 14px;
  background: #f4f7ff;
}

.create-job-note__icon,
.create-job-note__shield {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.create-job-note__icon {
  color: #5867f5;
  background: #fff;
}

.create-job-note__shield {
  color: #1fa95a;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #effcf4 0%, #d8f7e3 100%);
  box-shadow: inset 0 0 0 1px rgba(34, 182, 97, 0.1);
}

.create-job-note__shield-core {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 4px 10px rgba(34, 182, 97, 0.14);
}

.create-job-note__copy strong,
.create-job-note__copy span {
  display: block;
}

.create-job-note__copy strong {
  margin-bottom: 4px;
  color: #24314e;
  font-size: 15px;
}

.create-job-note__copy span {
  color: #6f7f97;
  font-size: 13px;
}

.create-job-note__dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.create-job-note__dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ccd7fb;
}

.create-job-actions {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.continue-button {
  min-width: 190px;
  height: 50px;
  padding: 0 28px;
  border: 0;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(90deg, #f36cbc 0%, #ef5aa5 100%);
}

.create-job-actions span {
  color: #a0aec2;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .create-job-options {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .create-job-start__topbar {
    padding: 0 16px;
  }

  .create-job-start__content {
    width: min(100%, calc(100% - 28px));
    padding-top: 52px;
  }

  .create-job-note {
    grid-template-columns: 42px minmax(0, 1fr);
  }

  .create-job-note__dots,
  .create-job-note__shield {
    display: none;
  }
}
</style>
