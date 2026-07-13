<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Alex Morgan',
  },
  candidateRole: {
    type: String,
    default: 'Senior Product Designer',
  },
})

const emit = defineEmits(['close', 'share-another', 'view-profile', 'go-to-onboarding'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'AM'
))

const firstName = computed(() => props.candidateName.split(' ')[0] || 'Alex')
const avatars = ['SJ', 'MC', 'EW', 'JB', 'NH', 'LM', 'OA']

const impactRows = [
  ['Excitement created', 'People have reacted with 24 🎉 and 15 ❤️', 'heart'],
  ['Engagement', '78% of recipients opened the update', 'document'],
  ['Team reach', '3 teams & 14 individuals notified', 'users'],
]

const nextActions = [
  'Prepare welcome email',
  'Create onboarding tasks',
  'Schedule welcome meeting',
  'Share on Slack',
]

const bodyOverflow = typeof document !== 'undefined' ? document.body.style.overflow : ''

watch(() => props.open, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : bodyOverflow
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = bodyOverflow
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="hire-shared-overlay" @click.self="emit('close')">
      <section class="hire-shared-modal" @click.stop>
        <button class="hire-shared-close" type="button" aria-label="Close" @click="emit('close')">
          <AppIcon name="close" :size="18" />
        </button>

        <div class="hire-shared-hero">
          <span class="hire-shared-hero__icon"><AppIcon name="sparkles" :size="24" /></span>
          <h2>Update shared <strong>successfully!</strong></h2>
          <p>Great news! Your update about {{ firstName }} has been shared with <strong>14 people and 3 teams.</strong></p>
        </div>

        <div class="hire-shared-layout">
          <div class="hire-shared-main">
            <section class="hire-shared-card">
              <h3>What's been shared</h3>
              <div class="hire-shared-sharebox">
                <article class="hire-shared-preview">
                  <div class="hire-shared-preview__hero">
                    <span>{{ candidateInitials }}</span>
                    <i><AppIcon name="checkCircle" :size="12" /></i>
                  </div>
                  <div class="hire-shared-preview__body">
                    <strong>We have exciting news!</strong>
                    <h4>{{ candidateName }} is officially joining the team! 🎉</h4>
                    <small>{{ candidateRole }}</small>
                    <p>Excited to welcome {{ candidateName }} to the team! Her expertise in product design and passion for solving real user problems will be a huge asset to our mission. 🚀</p>
                  </div>
                </article>

                <dl class="hire-shared-meta">
                  <div><dt>Shared with</dt><dd>14 people & 3 teams</dd></div>
                  <div><dt>Channel</dt><dd>In-app notification</dd></div>
                  <div><dt>Sent on</dt><dd>May 18, 2024 at 2:35 PM</dd></div>
                  <div><dt>Shared by</dt><dd>Sarah Johnson</dd></div>
                </dl>
              </div>

              <div class="hire-shared-recipients">
                <div>
                  <strong>Who received the update</strong>
                  <div class="hire-shared-avatars">
                    <span v-for="avatar in avatars" :key="avatar">{{ avatar }}</span>
                    <em>+7</em>
                  </div>
                </div>
                <button type="button" class="hire-shared-inline-button">View all recipients</button>
              </div>
            </section>

            <section class="hire-shared-card is-onboarding">
              <div>
                <strong>Next up: Onboarding</strong>
                <p>{{ firstName }}'s onboarding plan is ready. You can customize tasks, add documents and assign owners.</p>
              </div>
              <button type="button" class="hire-shared-inline-button" @click="emit('go-to-onboarding')">Go to onboarding plan</button>
            </section>
          </div>

          <aside class="hire-shared-side">
            <section class="hire-shared-sidecard is-pink">
              <h3>Impact at a glance</h3>
              <article v-for="row in impactRows" :key="row[0]">
                <span><AppIcon :name="row[2]" :size="14" /></span>
                <div>
                  <strong>{{ row[0] }}</strong>
                  <small>{{ row[1] }}</small>
                </div>
              </article>
            </section>

            <section class="hire-shared-sidecard">
              <h3>Want to do more?</h3>
              <button v-for="action in nextActions" :key="action" type="button" class="hire-shared-action">
                <span>{{ action }}</span>
                <AppIcon name="chevronRight" :size="12" />
              </button>
            </section>

            <section class="hire-shared-sidecard is-green">
              <h3>Celebrate together</h3>
              <p>Recognition makes great hires feel even better.</p>
              <button type="button" class="hire-shared-inline-button is-success">Give a shout-out 👏</button>
            </section>
          </aside>
        </div>

        <footer class="hire-shared-footer">
          <button type="button" class="hire-shared-button" @click="emit('close')">Close</button>
          <button type="button" class="hire-shared-button is-ghost" @click="emit('share-another')">Share another update</button>
          <button type="button" class="hire-shared-button is-primary" @click="emit('view-profile')">View candidate profile</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.hire-shared-overlay {
  position: fixed;
  inset: 0;
  z-index: 1462;
  padding: 16px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(10px);
}

.hire-shared-modal {
  width: min(100%, 1240px);
  margin: auto;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  position: relative;
  padding: 28px 28px 22px;
  border-radius: 24px;
  border: 1px solid #ebeff7;
  background:
    radial-gradient(circle at top center, rgba(255, 112, 181, 0.08), transparent 40%),
    #fff;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.22);
}

.hire-shared-close,
.hire-shared-button,
.hire-shared-inline-button,
.hire-shared-action {
  font: inherit;
}

.hire-shared-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 42px;
  height: 42px;
  border: 1px solid #dfe7f4;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #24345b;
  background: #fff;
}

.hire-shared-hero {
  text-align: center;
}

.hire-shared-hero__icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #ff65b0 0%, #ff2d87 45%, #ff4b9b 100%);
  box-shadow: 0 18px 40px rgba(255, 77, 154, 0.25);
}

.hire-shared-hero h2,
.hire-shared-card h3,
.hire-shared-preview strong,
.hire-shared-sidecard h3,
.hire-shared-meta dd,
.hire-shared-recipients strong {
  margin: 0;
  color: #1f2d53;
}

.hire-shared-hero h2 {
  font-size: 2rem;
}

.hire-shared-hero h2 strong {
  color: #ff3f95;
}

.hire-shared-hero p,
.hire-shared-preview p,
.hire-shared-preview small,
.hire-shared-meta dt,
.hire-shared-sidecard p,
.hire-shared-sidecard small,
.hire-shared-card p {
  margin: 0;
  color: #7284a7;
}

.hire-shared-layout {
  margin-top: 24px;
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) 320px;
  gap: 18px;
  align-items: start;
}

.hire-shared-main,
.hire-shared-side {
  display: grid;
  gap: 16px;
}

.hire-shared-card,
.hire-shared-sidecard {
  padding: 18px;
  border: 1px solid #ebeff7;
  border-radius: 18px;
  background: #fff;
}

.hire-shared-sharebox {
  margin-top: 14px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 240px;
  gap: 18px;
}

.hire-shared-preview {
  border: 1px solid #f0ddea;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #fff8fb 0%, #fff 100%);
}

.hire-shared-preview__hero {
  min-height: 96px;
  position: relative;
  background:
    radial-gradient(circle at 20% 26%, rgba(255, 77, 154, 0.2) 0 2px, transparent 3px),
    radial-gradient(circle at 76% 18%, rgba(99, 102, 241, 0.2) 0 2px, transparent 3px),
    radial-gradient(circle at 62% 70%, rgba(34, 197, 94, 0.2) 0 2px, transparent 3px),
    linear-gradient(180deg, #fff5fb 0%, #fff 100%);
}

.hire-shared-preview__hero span,
.hire-shared-avatars span,
.hire-shared-avatars em {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hire-shared-preview__hero span {
  width: 68px;
  height: 68px;
  position: absolute;
  left: 50%;
  bottom: -22px;
  transform: translateX(-50%);
  border-radius: 50%;
  color: #fff;
  font-size: 1.06rem;
  font-weight: 800;
  background: linear-gradient(135deg, #111827 0%, #f97316 100%);
  border: 4px solid #fff;
}

.hire-shared-preview__hero i {
  position: absolute;
  left: calc(50% + 18px);
  bottom: -14px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #22c55e;
  border: 2px solid #fff;
}

.hire-shared-preview__body {
  padding: 30px 18px 18px;
  text-align: center;
}

.hire-shared-preview__body h4 {
  margin: 8px 0 6px;
  font-size: 1.35rem;
  line-height: 1.2;
  color: #ff3f95;
}

.hire-shared-preview__body p {
  margin-top: 14px;
  text-align: left;
  line-height: 1.7;
}

.hire-shared-meta {
  display: grid;
  gap: 14px;
}

.hire-shared-meta div {
  display: grid;
  gap: 4px;
}

.hire-shared-meta dd {
  margin: 0;
  font-weight: 700;
}

.hire-shared-recipients,
.hire-shared-card.is-onboarding,
.hire-shared-footer {
  display: flex;
  align-items: center;
}

.hire-shared-recipients {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #edf1f7;
  justify-content: space-between;
  gap: 14px;
}

.hire-shared-avatars {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.hire-shared-avatars span,
.hire-shared-avatars em {
  width: 28px;
  height: 28px;
  margin-left: -8px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.hire-shared-avatars span:first-child,
.hire-shared-avatars em:first-child {
  margin-left: 0;
}

.hire-shared-avatars span {
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  background: linear-gradient(135deg, #22355f 0%, #ff5ca8 100%);
}

.hire-shared-avatars em {
  font-style: normal;
  color: #ff3f95;
  background: #fff0f7;
}

.hire-shared-inline-button,
.hire-shared-action {
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #e0e7f3;
  border-radius: 12px;
  color: #ff2d87;
  background: #fff;
  font-size: 0.82rem;
  font-weight: 700;
}

.hire-shared-card.is-onboarding {
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(90deg, #faf7ff 0%, #fff 100%);
}

.hire-shared-sidecard.is-pink {
  background: linear-gradient(180deg, #fff8fb 0%, #fff 100%);
}

.hire-shared-sidecard.is-green {
  background: linear-gradient(180deg, #fbfff9 0%, #fff 100%);
}

.hire-shared-sidecard article {
  margin-top: 14px;
  display: flex;
  gap: 12px;
  align-items: start;
}

.hire-shared-sidecard article span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4a9b;
  background: #fff0f7;
}

.hire-shared-action {
  width: 100%;
  margin-top: 10px;
  color: #32446b;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
}

.hire-shared-inline-button.is-success {
  width: 100%;
  margin-top: 14px;
  color: #16a34a;
  border-color: #d8efde;
  background: #fff;
}

.hire-shared-footer {
  margin-top: 18px;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.hire-shared-button {
  min-height: 46px;
  padding: 0 18px;
  border: 1px solid #dfe7f4;
  border-radius: 14px;
  color: #24345b;
  background: #fff;
  font-size: 0.88rem;
  font-weight: 700;
}

.hire-shared-button.is-ghost {
  color: #ff2d87;
}

.hire-shared-button.is-primary {
  min-width: 170px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff65b0 0%, #ff2d87 45%, #ff4b9b 100%);
}

@media (max-width: 1080px) {
  .hire-shared-layout,
  .hire-shared-sharebox {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .hire-shared-card.is-onboarding,
  .hire-shared-recipients,
  .hire-shared-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .hire-shared-button,
  .hire-shared-inline-button {
    width: 100%;
  }
}
</style>
