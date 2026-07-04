<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Sarah Johnson',
  },
  candidateRole: {
    type: String,
    default: 'UX Designer',
  },
  candidateStage: {
    type: String,
    default: 'Interview Stage',
  },
})

const emit = defineEmits(['close', 'add-note'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const activeTab = ref('all')

const noteCards = [
  {
    author: 'Emma Wilson',
    role: 'Hiring Manager',
    title: 'Strong portfolio with great visual design skills.',
    body: 'The candidate presented a clean and well-structured portfolio. Strong attention to detail and consistency in visual design. Impressive use of typography and layout across case studies.',
    date: '22 May 2024',
    time: '10:00 AM',
    status: 'Added note',
    statusTone: 'pink',
    accent: 'pink',
    reactions: ['👍 2', '❤️ 1', '🎯 1', '👀 3'],
    tags: ['Interview', 'Design'],
    initials: 'EW',
  },
  {
    author: 'Sophia Carter',
    role: 'Talent Partner',
    title: 'Good communication during the interview.',
    body: 'Communicated thoughts clearly and structured responses well. Listened actively and asked relevant clarifying questions. Explained design decisions and trade-offs effectively.',
    date: '22 May 2024',
    time: '9:20 AM',
    status: 'Added note',
    statusTone: 'pink',
    accent: 'blue',
    reactions: ['👍 8', '👏 2', '❤️ 1', '👀 2'],
    tags: ['Interview', 'Design'],
    initials: 'SC',
  },
  {
    author: 'Michael Chen',
    role: 'Design Lead',
    title: 'Showed deep understanding of user experience and design systems.',
    body: 'Demonstrated solid knowledge of UX principles. Spoke confidently about design systems and component libraries. Gave examples of scaling design systems in the past.',
    date: '21 May 2024',
    time: '4:30 PM',
    status: 'Added note',
    statusTone: 'mint',
    accent: 'green',
    reactions: ['👍 2', '👏 1', '👀 2'],
    tags: ['Interview', 'Design'],
    initials: 'MC',
  },
  {
    author: 'David Lee',
    role: 'Panel Interviewer',
    title: 'Could improve in data-driven decision making.',
    body: 'Strong designer but needs to strengthen analytical thinking. Would like to see more data-backed reasoning in case studies. Potential to grow with more exposure to analytics tools.',
    date: '21 May 2024',
    time: '11:10 AM',
    status: 'Shared note',
    statusTone: 'blue',
    accent: 'orange',
    reactions: ['👍 1', '👀 1'],
    tags: ['Interview', 'Design'],
    initials: 'DL',
  },
]

const selectedNote = computed(() => noteCards[0])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function closeOverlay() {
  emit('close')
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow
    previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousHtmlOverflow
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="view-notes-overlay" @click.self="closeOverlay">
      <section class="view-notes-modal">
        <header class="view-notes-modal__header">
          <div class="view-notes-modal__title">
            <span class="view-notes-modal__title-icon">
              <AppIcon name="edit" :size="18" />
            </span>
            <div>
              <h2>View Notes</h2>
              <p>View and manage notes about {{ candidateName }}</p>
            </div>
          </div>

          <button class="view-notes-modal__close" type="button" aria-label="Close view notes" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="view-notes-modal__body">
          <section class="view-notes-hero">
            <div class="view-notes-candidate">
              <span class="view-notes-candidate__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }} <span>•</span> <em>{{ candidateStage }}</em></p>
              </div>
            </div>

            <div class="view-notes-visibility">
              <small>Note Visibility</small>
              <button type="button">
                <span class="view-notes-visibility__icon"><AppIcon name="shield" :size="16" /></span>
                <div>
                  <strong>Hiring Team</strong>
                  <p>Visible to all hiring team members</p>
                </div>
                <AppIcon name="chevronDown" :size="18" />
              </button>
            </div>
          </section>

          <section class="view-notes-toolbar">
            <nav class="view-notes-tabs">
              <button type="button" :class="{ 'is-active': activeTab === 'all' }" @click="activeTab = 'all'">All Notes (6)</button>
              <button type="button" :class="{ 'is-active': activeTab === 'mine' }" @click="activeTab = 'mine'">My Notes (2)</button>
              <button type="button" :class="{ 'is-active': activeTab === 'shared' }" @click="activeTab = 'shared'">Shared with Me (2)</button>
              <button type="button" :class="{ 'is-active': activeTab === 'deleted' }" @click="activeTab = 'deleted'">Deleted (0)</button>
            </nav>

            <label class="view-notes-search">
              <AppIcon name="search" :size="16" />
              <input type="text" placeholder="Search notes or tags..." />
            </label>
          </section>

          <section class="view-notes-content">
            <div class="view-notes-list">
              <article
                v-for="item in noteCards"
                :key="`${item.author}-${item.title}`"
                class="view-notes-card"
                :class="`is-${item.accent}`"
              >
                <aside class="view-notes-card__author">
                  <span class="view-notes-card__avatar">{{ item.initials }}</span>
                  <div>
                    <strong>{{ item.author }}</strong>
                    <small>{{ item.role }}</small>
                  </div>

                  <div class="view-notes-card__meta">
                    <span><AppIcon name="calendar" :size="13" /> {{ item.date }}</span>
                    <span><AppIcon name="clock" :size="13" /> {{ item.time }}</span>
                  </div>

                  <em :class="`is-${item.statusTone}`">{{ item.status }}</em>
                </aside>

                <div class="view-notes-card__body">
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.body }}</p>

                  <div class="view-notes-card__tags">
                    <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
                  </div>

                  <footer>
                    <div class="view-notes-card__reactions">
                      <span v-for="reaction in item.reactions" :key="reaction">{{ reaction }}</span>
                    </div>
                    <button type="button">Reply</button>
                  </footer>
                </div>
              </article>
            </div>

            <aside class="view-notes-side">
              <section class="view-notes-side__card">
                <h3>Note Details</h3>

                <div class="view-notes-side__detail">
                  <span><AppIcon name="user" :size="16" /></span>
                  <div>
                    <small>Created By</small>
                    <strong>{{ selectedNote.author }}</strong>
                    <p>{{ selectedNote.role }}</p>
                  </div>
                </div>

                <div class="view-notes-side__detail">
                  <span><AppIcon name="calendar" :size="16" /></span>
                  <div>
                    <small>Created On</small>
                    <strong>22 May 2024 at 10:00 AM</strong>
                  </div>
                </div>

                <div class="view-notes-side__detail">
                  <span><AppIcon name="clock" :size="16" /></span>
                  <div>
                    <small>Last Edited On</small>
                    <strong>22 May 2024 at 10:15 AM</strong>
                  </div>
                </div>

                <div class="view-notes-side__detail">
                  <span><AppIcon name="shield" :size="16" /></span>
                  <div>
                    <small>Visibility</small>
                    <strong>Hiring Team</strong>
                    <p>Visible to all hiring team members</p>
                  </div>
                </div>

                <div class="view-notes-side__detail">
                  <span><AppIcon name="tag" :size="16" /></span>
                  <div>
                    <small>Tags</small>
                    <div class="view-notes-side__tags">
                      <em>Interview</em>
                      <em>Design</em>
                    </div>
                  </div>
                </div>
              </section>

              <section class="view-notes-side__card is-tinted">
                <div class="view-notes-side__summary-head">
                  <h3>AI Summary</h3>
                  <small>(Beta)</small>
                </div>
                <p>This candidate demonstrates strong portfolio quality, visual design skills, and communication. Reviewers noted opportunities to strengthen data-driven decision making.</p>
                <button type="button">View AI Insights</button>
              </section>

              <section class="view-notes-side__card">
                <h3>Quick Actions</h3>
                <button type="button" class="view-notes-side__action" @click="emit('add-note')">
                  <AppIcon name="edit" :size="15" />
                  <span>Add Note</span>
                </button>
                <button type="button" class="view-notes-side__action">
                  <AppIcon name="document" :size="15" />
                  <span>Download Notes</span>
                </button>
              </section>
            </aside>
          </section>
        </div>

        <footer class="view-notes-modal__footer">
          <button class="view-notes-button view-notes-button--ghost" type="button" @click="closeOverlay">Close</button>

          <div class="view-notes-modal__actions view-notes-split-button">
            <button class="view-notes-button view-notes-button--primary view-notes-split-button__main" type="button" @click="emit('add-note')">
              <AppIcon name="plus" :size="15" />
              <span>Add Note</span>
            </button>
            <button class="view-notes-button view-notes-button--primary view-notes-split-button__toggle" type="button" aria-label="More note actions">
              <AppIcon name="chevronDown" :size="16" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.view-notes-overlay {
  position: fixed;
  inset: 0;
  z-index: 1460;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(21, 28, 42, 0.44);
  backdrop-filter: blur(6px);
}

.view-notes-modal {
  width: min(100%, 1150px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 30px 84px rgba(15, 23, 42, 0.2);
}

.view-notes-modal__header,
.view-notes-modal__title,
.view-notes-hero,
.view-notes-candidate,
.view-notes-visibility button,
.view-notes-toolbar,
.view-notes-tabs,
.view-notes-search,
.view-notes-content,
.view-notes-card,
.view-notes-card__author,
.view-notes-card__meta,
.view-notes-card__body footer,
.view-notes-card__reactions,
.view-notes-side__detail,
.view-notes-side__summary-head,
.view-notes-side__action,
.view-notes-modal__footer,
.view-notes-modal__actions,
.view-notes-button,
.view-notes-side__tags,
.view-notes-split-button {
  display: flex;
}

.view-notes-modal__header,
.view-notes-modal__footer {
  padding: 18px 22px;
  border-bottom: 1px solid #edf1f7;
}

.view-notes-modal__header {
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.view-notes-modal__title {
  align-items: center;
  gap: 14px;
}

.view-notes-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: #ff59a7;
  background: #ffedf6;
}

.view-notes-modal__title h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.05rem;
  font-weight: 800;
}

.view-notes-modal__title p {
  margin: 5px 0 0;
  color: #75839b;
}

.view-notes-modal__close {
  border: 0;
  background: transparent;
  color: #98a3b8;
  cursor: pointer;
}

.view-notes-modal__body {
  overflow: auto;
}

.view-notes-hero,
.view-notes-toolbar,
.view-notes-content {
  padding-left: 30px;
  padding-right: 30px;
}

.view-notes-hero {
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding-top: 26px;
  padding-bottom: 20px;
}

.view-notes-candidate {
  align-items: center;
  gap: 16px;
}

.view-notes-candidate__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2a44 0%, #f373b7 100%);
}

.view-notes-candidate strong {
  display: block;
  color: #1f2a44;
  font-size: 0.98rem;
  font-weight: 800;
}

.view-notes-candidate p {
  margin: 7px 0 0;
  color: #6d7890;
}

.view-notes-candidate p span {
  margin: 0 4px;
}

.view-notes-candidate p em {
  color: #ff59a7;
  font-style: normal;
}

.view-notes-visibility {
  flex: 0 0 48%;
  min-width: 360px;
  padding: 14px 16px;
  border: 1px solid #edf1f7;
  border-radius: 16px;
}

.view-notes-visibility small {
  display: block;
  color: #a0a9bc;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.view-notes-visibility button {
  width: 100%;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
  padding: 14px;
  border: 1px solid #dce3ee;
  border-radius: 12px;
  background: #fff;
  text-align: left;
}

.view-notes-visibility__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: #7a8498;
  background: #f6f8fc;
}

.view-notes-visibility strong {
  display: block;
  color: #1f2a44;
  font-size: 0.88rem;
}

.view-notes-visibility p {
  margin: 4px 0 0;
  color: #7a8498;
  font-size: 0.8rem;
}

.view-notes-toolbar {
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 18px;
  padding-bottom: 14px;
  border-top: 1px solid #edf1f7;
  border-bottom: 1px solid #edf1f7;
}

.view-notes-tabs {
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}

.view-notes-tabs button {
  position: relative;
  padding: 0 0 12px;
  border: 0;
  background: transparent;
  color: #69768e;
  font-size: 0.9rem;
  cursor: pointer;
}

.view-notes-tabs button.is-active {
  color: #ff59a7;
  font-weight: 700;
}

.view-notes-tabs button.is-active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -15px;
  left: 0;
  height: 2px;
  border-radius: 999px;
  background: #ff59a7;
}

.view-notes-search {
  align-items: center;
  gap: 10px;
  min-width: 258px;
  padding: 0 14px;
  border: 1px solid #dce3ee;
  border-radius: 12px;
  background: #fff;
}

.view-notes-search input {
  width: 100%;
  height: 40px;
  border: 0;
  outline: none;
  font: inherit;
}

.view-notes-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 344px;
  gap: 22px;
  padding-top: 18px;
  padding-bottom: 24px;
}

.view-notes-list {
  display: grid;
  gap: 16px;
}

.view-notes-card {
  gap: 18px;
  padding: 20px 20px 18px;
  border: 1px solid #edf1f7;
  border-left-width: 4px;
  border-radius: 16px;
  background: #fff;
}

.view-notes-card.is-pink { border-left-color: #ff6bb0; }
.view-notes-card.is-blue { border-left-color: #6ba6ff; }
.view-notes-card.is-green { border-left-color: #34d399; }
.view-notes-card.is-orange { border-left-color: #fb923c; }

.view-notes-card__author {
  flex: 0 0 156px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.view-notes-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 800;
  background: linear-gradient(135deg, #24324d 0%, #f373b7 100%);
}

.view-notes-card__author strong,
.view-notes-card__body > strong,
.view-notes-side__card h3 {
  display: block;
  color: #1f2a44;
  font-size: 0.9rem;
  font-weight: 800;
}

.view-notes-card__author small {
  display: block;
  margin-top: 4px;
  color: #7a8498;
}

.view-notes-card__meta {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  color: #7a8498;
  font-size: 0.78rem;
}

.view-notes-card__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.view-notes-card__author em {
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
}

.view-notes-card__author em.is-pink {
  color: #ff59a7;
  background: #ffedf6;
}

.view-notes-card__author em.is-mint {
  color: #059669;
  background: #ecfdf5;
}

.view-notes-card__author em.is-blue {
  color: #4f46e5;
  background: #eef2ff;
}

.view-notes-card__body {
  flex: 1;
}

.view-notes-card__body > p {
  margin: 10px 0 0;
  color: #546179;
  line-height: 1.7;
}

.view-notes-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.view-notes-card__tags span,
.view-notes-side__tags em {
  padding: 5px 8px;
  border-radius: 8px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.72rem;
  font-style: normal;
}

.view-notes-card__body footer {
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
}

.view-notes-card__reactions {
  gap: 14px;
  flex-wrap: wrap;
  color: #66748d;
  font-size: 0.82rem;
}

.view-notes-card__body footer button {
  border: 0;
  background: transparent;
  color: #ff59a7;
  font-weight: 700;
  cursor: pointer;
}

.view-notes-side {
  display: grid;
  gap: 16px;
  align-content: start;
}

.view-notes-side__card {
  padding: 20px;
  border: 1px solid #edf1f7;
  border-radius: 16px;
  background: #fff;
}

.view-notes-side__card.is-tinted {
  border-color: #dce3fb;
  background: linear-gradient(180deg, #f8faff 0%, #fbfcff 100%);
}

.view-notes-side__detail {
  align-items: flex-start;
  gap: 12px;
  padding-top: 16px;
}

.view-notes-side__detail + .view-notes-side__detail {
  border-top: 1px solid #eef2f7;
  margin-top: 16px;
}

.view-notes-side__detail > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: #7a8498;
  background: #f6f8fc;
}

.view-notes-side__detail small {
  display: block;
  color: #a0a9bc;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.view-notes-side__detail strong {
  display: block;
  margin-top: 6px;
  color: #1f2a44;
  font-size: 0.9rem;
}

.view-notes-side__detail p {
  margin: 4px 0 0;
  color: #7a8498;
  line-height: 1.5;
}

.view-notes-side__summary-head {
  align-items: center;
  gap: 8px;
}

.view-notes-side__summary-head small {
  color: #a0a9bc;
}

.view-notes-side__card.is-tinted p {
  margin: 14px 0 0;
  color: #66748d;
  line-height: 1.7;
}

.view-notes-side__card.is-tinted button {
  width: 100%;
  margin-top: 18px;
  min-height: 42px;
  border: 1px solid #cad4fb;
  border-radius: 12px;
  background: #fff;
  color: #4f46e5;
  font-weight: 700;
}

.view-notes-side__action {
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 0;
  border: 0;
  background: transparent;
  color: #4c5d7d;
  font-size: 0.92rem;
  cursor: pointer;
}

.view-notes-side__action + .view-notes-side__action {
  border-top: 1px solid #edf1f7;
}

.view-notes-modal__footer {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 26px;
  border-top: 1px solid #edf1f7;
  border-bottom: 0;
}

.view-notes-button {
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 52px;
  padding: 0 18px;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
}

.view-notes-button--ghost {
  min-width: 106px;
  border: 1px solid #dce3ee;
  background: #fff;
  color: #4b5565;
}

.view-notes-button--primary {
  border: 0;
  color: #fff;
  background: linear-gradient(135deg, #f15da9 0%, #ef77bd 100%);
}

.view-notes-split-button {
  align-items: stretch;
  gap: 0;
  flex: 0 0 auto;
  min-width: 254px;
  height: 52px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, #f15da9 0%, #ef77bd 100%);
  box-shadow: 0 14px 26px rgba(241, 93, 169, 0.18);
}

.view-notes-split-button__main {
  flex: 1;
  min-height: 100%;
  padding: 0 28px;
  border-radius: 0;
  background: transparent;
}

.view-notes-split-button__toggle {
  flex: 0 0 58px;
  min-height: 100%;
  padding: 0;
  border-radius: 0;
  background: transparent;
  border-left: 1px solid rgba(255, 255, 255, 0.28);
}

.view-notes-split-button .view-notes-button--primary {
  box-shadow: none;
}

@media (max-width: 1080px) {
  .view-notes-hero,
  .view-notes-toolbar,
  .view-notes-content {
    padding-left: 18px;
    padding-right: 18px;
  }

  .view-notes-hero,
  .view-notes-toolbar,
  .view-notes-content,
  .view-notes-card,
  .view-notes-modal__footer {
    flex-direction: column;
  }

  .view-notes-content {
    grid-template-columns: 1fr;
  }

  .view-notes-visibility {
    min-width: 0;
    width: 100%;
  }

  .view-notes-modal__footer,
  .view-notes-modal__actions {
    width: 100%;
  }
}
</style>
