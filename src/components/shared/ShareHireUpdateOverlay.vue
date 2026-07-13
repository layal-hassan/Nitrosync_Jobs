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

const emit = defineEmits(['close', 'share'])

const firstName = computed(() => props.candidateName.split(' ')[0] || 'Alex')
const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'AM'
))

const audienceOptions = [
  ['Hiring Team', 'People involved in the hiring process', 'users'],
  ['Product Team', 'The product department', 'building'],
  ['Company Wide', 'Everyone in the company', 'building'],
  ['Custom', 'Choose specific people or teams', 'userPlus'],
]

const selectedTeams = ['Product Team', 'Design Team', 'Marketing Team']
const selectedPeople = ['Sarah Johnson', 'Michael Chen', 'Emma Wilson', 'James Brown', '+10 more']
const notifiedAvatars = ['SJ', 'MC', 'EW', 'JB', 'MN', 'LP', 'DT']

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
    <div v-if="open" class="share-hire-overlay" @click.self="emit('close')">
      <section class="share-hire-modal" @click.stop>
        <header class="share-hire-header">
          <div class="share-hire-header__title">
            <span><AppIcon name="sparkles" :size="18" /></span>
            <div>
              <h2>Share the good news! 🎉</h2>
              <p>Celebrate {{ firstName }}'s new chapter and let the team know.</p>
            </div>
          </div>
          <button class="share-hire-close" type="button" aria-label="Close" @click="emit('close')">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="share-hire-layout">
          <div class="share-hire-main">
            <section class="share-hire-card is-message">
              <div class="share-hire-card__head">
                <AppIcon name="message" :size="15" />
                <strong>Personalize your message</strong>
              </div>
              <div class="share-hire-message">
                Excited to welcome {{ candidateName }} to the team! Her expertise in product design and passion for solving real user problems will be a huge asset to our mission. 🚀
              </div>
              <small>146/300</small>
            </section>

            <section>
              <h3>Who would you like to share with?</h3>
              <div class="share-hire-audiences">
                <article
                  v-for="option in audienceOptions"
                  :key="option[0]"
                  class="share-hire-audience"
                  :class="{ 'is-selected': option[0] === 'Custom' }"
                >
                  <span><AppIcon :name="option[2]" :size="14" /></span>
                  <strong>{{ option[0] }}</strong>
                  <small>{{ option[1] }}</small>
                  <i v-if="option[0] === 'Custom'"><AppIcon name="checkCircle" :size="12" /></i>
                </article>
              </div>
            </section>

            <section class="share-hire-card">
              <div class="share-hire-section-head">
                <h3>Who should we notify?</h3>
                <span>14 selected</span>
              </div>

              <div class="share-hire-search">
                <AppIcon name="search" :size="14" />
                <span>Search people, teams or departments...</span>
                <button type="button">Clear all</button>
              </div>

              <div class="share-hire-chip-group">
                <small>Teams</small>
                <div class="share-hire-chips">
                  <span v-for="team in selectedTeams" :key="team" class="is-team">{{ team }}</span>
                </div>
              </div>

              <div class="share-hire-chip-group">
                <small>People</small>
                <div class="share-hire-chips">
                  <span v-for="person in selectedPeople" :key="person">{{ person }}</span>
                </div>
              </div>

              <div class="share-hire-notify-all">
                <div>
                  <strong>Notify all employees as well</strong>
                  <small>Recommended</small>
                  <p>This update will be visible to all employees in your organization.</p>
                </div>
                <span class="share-hire-toggle"></span>
              </div>
            </section>

            <section class="share-hire-card">
              <h3>How would you like to notify?</h3>
              <div class="share-hire-channels">
                <button type="button" class="is-active"><AppIcon name="bell" :size="13" /><span>In-app notification</span></button>
                <button type="button"><AppIcon name="mail" :size="13" /><span>Email</span></button>
                <button type="button"><AppIcon name="message" :size="13" /><span>Slack</span></button>
                <button type="button"><AppIcon name="users" :size="13" /><span>Teams</span></button>
              </div>

              <div class="share-hire-touch">
                <small>Add a personal touch (optional)</small>
                <div class="share-hire-touch__actions">
                  <button type="button"><AppIcon name="gift" :size="13" /><span>Add a GIF</span></button>
                  <button type="button"><AppIcon name="user" :size="13" /><span>Add a photo</span></button>
                  <button type="button"><AppIcon name="document" :size="13" /><span>Add a banner</span></button>
                </div>
              </div>
            </section>

            <footer class="share-hire-footer">
              <button type="button" class="share-hire-button" @click="emit('close')">Cancel</button>
              <button type="button" class="share-hire-button is-primary" @click="emit('share')">
                <AppIcon name="share" :size="13" />
                <span>Share update</span>
              </button>
            </footer>
          </div>

          <aside class="share-hire-side">
            <section class="share-hire-sidecard">
              <h3>Preview</h3>
              <p>This is how your message will look.</p>
              <article class="share-hire-preview">
                <div class="share-hire-preview__hero">
                  <span>{{ candidateInitials }}</span>
                  <i><AppIcon name="checkCircle" :size="12" /></i>
                </div>
                <div class="share-hire-preview__body">
                  <strong>We have exciting news!</strong>
                  <h4>{{ candidateName }} is officially joining the team! 🎉</h4>
                  <small>{{ candidateRole }}</small>
                  <p>Excited to welcome {{ candidateName }} to the team! Her expertise in product design and passion for solving real user problems will be a huge asset to our mission. 🚀</p>
                  <dl>
                    <div><dt>Start date</dt><dd>Sep 14, 2024</dd></div>
                    <div><dt>Location</dt><dd>Stockholm, Sweden</dd></div>
                    <div><dt>Department</dt><dd>Product</dd></div>
                    <div><dt>Annual salary</dt><dd>650,000 SEK</dd></div>
                  </dl>
                  <em>Let's give {{ firstName }} a warm welcome! 👋</em>
                </div>
              </article>
            </section>

            <section class="share-hire-sidecard">
              <h3>Who will be notified</h3>
              <strong>14 people & 3 teams</strong>
              <div class="share-hire-avatars">
                <span v-for="avatar in notifiedAvatars" :key="avatar">{{ avatar }}</span>
                <em>+7</em>
              </div>
              <small>This update will be sent via in-app notification.</small>
            </section>
          </aside>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.share-hire-overlay {
  position: fixed;
  inset: 0;
  z-index: 1461;
  padding: 16px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(10px);
}

.share-hire-modal {
  width: min(100%, 1260px);
  margin: auto;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  border-radius: 24px;
  border: 1px solid #e9edf5;
  background: #fff;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.22);
}

.share-hire-header {
  padding: 24px 28px;
  border-bottom: 1px solid #edf1f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.share-hire-header__title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.share-hire-header__title > span {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4698;
  background: #fff0f7;
}

.share-hire-header h2,
.share-hire-main h3,
.share-hire-card strong,
.share-hire-audience strong,
.share-hire-preview strong,
.share-hire-sidecard h3 {
  margin: 0;
  color: #1f2d53;
}

.share-hire-header p,
.share-hire-message,
.share-hire-audience small,
.share-hire-preview p,
.share-hire-preview small,
.share-hire-sidecard p,
.share-hire-sidecard small,
.share-hire-card small {
  margin: 0;
  color: #7284a7;
}

.share-hire-close,
.share-hire-button,
.share-hire-search button,
.share-hire-channels button,
.share-hire-touch__actions button {
  font: inherit;
}

.share-hire-close {
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

.share-hire-layout {
  padding: 18px 20px 22px;
  display: grid;
  grid-template-columns: minmax(0, 1.48fr) 360px;
  gap: 18px;
  align-items: start;
}

.share-hire-main,
.share-hire-side {
  display: grid;
  gap: 16px;
}

.share-hire-card,
.share-hire-sidecard,
.share-hire-audience {
  border: 1px solid #ebeff7;
  border-radius: 18px;
  background: #fff;
}

.share-hire-card {
  padding: 18px;
}

.share-hire-card.is-message {
  background: linear-gradient(180deg, #fff8fb 0%, #fff 100%);
}

.share-hire-card__head,
.share-hire-section-head,
.share-hire-notify-all,
.share-hire-footer {
  display: flex;
  align-items: center;
}

.share-hire-card__head {
  gap: 10px;
}

.share-hire-card__head :deep(svg) {
  color: #ff4a9b;
}

.share-hire-message {
  margin-top: 14px;
  min-height: 112px;
  padding: 16px;
  border: 1px solid #e8edf6;
  border-radius: 14px;
  background: #fff;
  line-height: 1.7;
}

.share-hire-card.is-message > small {
  display: block;
  margin-top: 8px;
  text-align: right;
}

.share-hire-audiences {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.share-hire-audience {
  min-height: 120px;
  padding: 16px;
  position: relative;
  display: grid;
  align-content: start;
  gap: 10px;
}

.share-hire-audience span,
.share-hire-preview__hero span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.share-hire-audience span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: #ff4a9b;
  background: #fff0f7;
}

.share-hire-audience.is-selected {
  border-color: #ff8cc1;
  box-shadow: inset 0 0 0 1px rgba(255, 79, 155, 0.12);
}

.share-hire-audience i {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #ff4a9b;
}

.share-hire-section-head {
  justify-content: space-between;
  gap: 12px;
}

.share-hire-section-head span {
  color: #ff4a9b;
  font-size: 0.78rem;
  font-weight: 700;
}

.share-hire-search {
  margin-top: 14px;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid #e6ebf4;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #91a0b9;
}

.share-hire-search button {
  margin-left: auto;
  border: 0;
  color: #7b8cab;
  background: transparent;
  font-size: 0.75rem;
  font-weight: 700;
}

.share-hire-chip-group {
  margin-top: 14px;
}

.share-hire-chip-group > small {
  display: block;
  margin-bottom: 8px;
}

.share-hire-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.share-hire-chips span {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #e7ebf4;
  color: #405172;
  background: #fff;
  font-size: 0.76rem;
  font-weight: 600;
}

.share-hire-chips span.is-team {
  color: #6d5cff;
  background: #f5f2ff;
}

.share-hire-notify-all {
  margin-top: 16px;
  padding: 14px 16px;
  border: 1px solid #e5f5eb;
  border-radius: 14px;
  justify-content: space-between;
  gap: 14px;
  background: linear-gradient(90deg, #fbfff9 0%, #fff 100%);
}

.share-hire-notify-all strong {
  display: inline-block;
  margin-right: 8px;
}

.share-hire-notify-all small {
  color: #16a34a;
  font-weight: 700;
}

.share-hire-notify-all p {
  margin-top: 4px;
  color: #7284a7;
}

.share-hire-toggle {
  width: 42px;
  height: 24px;
  border-radius: 999px;
  position: relative;
  background: #dbe4f2;
}

.share-hire-toggle::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.16);
}

.share-hire-channels {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  border: 1px solid #ebeff7;
  border-radius: 14px;
  overflow: hidden;
}

.share-hire-channels button {
  min-height: 44px;
  border: 0;
  border-right: 1px solid #ebeff7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #697c9f;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 700;
}

.share-hire-channels button:last-child {
  border-right: 0;
}

.share-hire-channels button.is-active {
  color: #ff2d87;
  background: #fff4fa;
}

.share-hire-touch {
  margin-top: 16px;
}

.share-hire-touch__actions {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.share-hire-touch__actions button {
  min-height: 44px;
  border: 1px solid #e8edf6;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #596c91;
  background: #fff;
  font-size: 0.78rem;
  font-weight: 700;
}

.share-hire-footer {
  justify-content: space-between;
  gap: 12px;
}

.share-hire-button {
  min-height: 46px;
  padding: 0 18px;
  border: 1px solid #dfe7f4;
  border-radius: 14px;
  color: #24345b;
  background: #fff;
  font-size: 0.88rem;
  font-weight: 700;
}

.share-hire-button.is-primary {
  min-width: 140px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff65b0 0%, #ff2d87 45%, #ff4b9b 100%);
}

.share-hire-sidecard {
  padding: 18px;
}

.share-hire-preview {
  margin-top: 14px;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff6fb 0%, #fff 100%);
  border: 1px solid #f0ddea;
}

.share-hire-preview__hero {
  min-height: 96px;
  border-radius: 16px 16px 0 0;
  position: relative;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 77, 154, 0.18) 0 2px, transparent 3px),
    radial-gradient(circle at 72% 22%, rgba(99, 102, 241, 0.18) 0 2px, transparent 3px),
    radial-gradient(circle at 60% 68%, rgba(34, 197, 94, 0.18) 0 2px, transparent 3px),
    linear-gradient(180deg, #fff5fb 0%, #fff 100%);
}

.share-hire-preview__hero span {
  width: 72px;
  height: 72px;
  position: absolute;
  left: 50%;
  bottom: -24px;
  transform: translateX(-50%);
  border-radius: 50%;
  color: #fff;
  font-size: 1.12rem;
  font-weight: 800;
  background: linear-gradient(135deg, #111827 0%, #f97316 100%);
  border: 4px solid #fff;
}

.share-hire-preview__hero i {
  position: absolute;
  left: calc(50% + 20px);
  bottom: -16px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #22c55e;
  border: 3px solid #fff;
}

.share-hire-preview__body {
  margin-top: 28px;
  padding: 18px 18px 10px;
  border-radius: 18px;
  background: #fff;
  text-align: center;
}

.share-hire-preview__body h4 {
  margin: 8px 0 6px;
  font-size: 1.5rem;
  line-height: 1.18;
  color: #ff3f95;
}

.share-hire-preview__body p {
  margin-top: 16px;
  text-align: left;
  line-height: 1.7;
}

.share-hire-preview__body dl {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.share-hire-preview__body dl div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
}

.share-hire-preview__body dd {
  margin: 0;
  text-align: right;
  color: #203055;
  font-weight: 700;
}

.share-hire-preview__body em {
  display: block;
  margin-top: 16px;
  font-style: normal;
  font-weight: 700;
  color: #ff4a9b;
}

.share-hire-avatars {
  margin: 14px 0 8px;
  display: flex;
  align-items: center;
}

.share-hire-avatars span,
.share-hire-avatars em {
  width: 28px;
  height: 28px;
  margin-left: -8px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.share-hire-avatars span:first-child,
.share-hire-avatars em:first-child {
  margin-left: 0;
}

.share-hire-avatars span {
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  background: linear-gradient(135deg, #23355f 0%, #ff6aac 100%);
}

.share-hire-avatars em {
  font-style: normal;
  color: #ff4a9b;
  background: #fff0f7;
}

@media (max-width: 1120px) {
  .share-hire-layout {
    grid-template-columns: 1fr;
  }

  .share-hire-audiences {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .share-hire-header,
  .share-hire-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .share-hire-layout {
    padding: 16px;
  }

  .share-hire-audiences,
  .share-hire-channels,
  .share-hire-touch__actions {
    grid-template-columns: 1fr;
  }
}
</style>
