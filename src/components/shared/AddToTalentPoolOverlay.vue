<script setup>
import { computed, ref, watch } from 'vue'
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
  candidateLocation: {
    type: String,
    default: 'Stockholm, Sweden',
  },
  candidateMatch: {
    type: String,
    default: '94% Match',
  },
  candidateStage: {
    type: String,
    default: 'INTERVIEW STAGE',
  },
})

const emit = defineEmits(['close'])

const flowState = ref('form')
const selectedPool = ref('UX Designers')
const selectedReason = ref('strong-candidate')
const otherReason = ref('')
const internalNote = ref('')
const selectedVisibility = ref('hiring-team')
const selectedSkills = ref(['Figma', 'UX Research', 'Design Systems', 'User Interface', 'Prototyping'])

const reasonOptions = [
  { id: 'strong-candidate', title: 'Strong candidate, no open role' },
  { id: 'final-stage', title: 'Reached final stage' },
  { id: 'future-roles', title: 'Great skills for future roles' },
  { id: 'hiring-freeze', title: 'Hiring freeze' },
  { id: 'backup-candidate', title: 'Backup candidate' },
  { id: 'silver-medalist', title: 'Silver medalist' },
]

const suggestedPools = [
  { title: 'UX Designers', match: '95% match', tone: 'green' },
  { title: 'Product Designers', match: '87% match', tone: 'pink' },
]

const keepWarmItems = [
  { title: 'Add to Talent Community', note: 'Include in talent community' },
  { title: 'Include in future campaigns', note: 'Add to nurture campaigns' },
  { title: 'Notify when matching role opens', note: 'Get notified automatically' },
]

const historyItems = [
  ['Applied for', 'Senior UX Designer'],
  ['Reached', 'Final Interview'],
  ['Status', 'Silver Medalist'],
  ['Applied on', '12 May 2025'],
]

const noteCount = computed(() => internalNote.value.length)
const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function resetState() {
  flowState.value = 'form'
  selectedPool.value = 'UX Designers'
  selectedReason.value = 'strong-candidate'
  otherReason.value = ''
  internalNote.value = 'Strong portfolio and good interview performance. Consider for future senior UX or Product Design roles.'
  selectedVisibility.value = 'hiring-team'
  selectedSkills.value = ['Figma', 'UX Research', 'Design Systems', 'User Interface', 'Prototyping']
}

function closeOverlay() {
  emit('close')
}

function applyTalentPool() {
  flowState.value = 'success'
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetState()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="talent-pool-overlay"
      :class="{ 'is-success': flowState === 'success' }"
      @click.self="closeOverlay"
    >
      <section v-if="flowState === 'form'" class="talent-pool-modal">
        <header class="talent-pool-modal__head">
          <div class="talent-pool-modal__title">
            <span class="talent-pool-modal__title-icon">
              <AppIcon name="userPlus" :size="20" />
            </span>
            <div>
              <h2>Add to Talent Pool</h2>
              <p>Save this candidate for future opportunities</p>
            </div>
          </div>

          <button class="talent-pool-modal__close" type="button" aria-label="Close talent pool modal" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="talent-pool-modal__body">
          <div class="talent-pool-layout">
            <section class="talent-pool-main">
              <article class="talent-pool-profile">
                <div class="talent-pool-profile__copy">
                  <strong>{{ candidateName }}</strong>
                  <div class="talent-pool-profile__role">
                    <span>{{ candidateRole }}</span>
                    <em>{{ candidateStage }}</em>
                  </div>
                  <div class="talent-pool-profile__meta">
                    <span><AppIcon name="mapPin" :size="13" /> {{ candidateLocation }}</span>
                    <span><AppIcon name="mail" :size="13" /> sarah.johnson@email.com</span>
                  </div>
                </div>

                <div class="talent-pool-profile__score">
                  <small>MATCH SCORE</small>
                  <strong>94%</strong>
                  <div class="talent-pool-profile__bar"><span /></div>
                </div>
              </article>

              <div class="talent-pool-grid talent-pool-grid--pools">
                <section class="talent-pool-section">
                  <h3>Talent Pool <em>*</em></h3>
                  <button class="talent-pool-select" type="button">
                    <span><AppIcon name="users" :size="14" /> {{ selectedPool }}</span>
                    <AppIcon name="chevronDown" :size="16" />
                  </button>
                  <button class="talent-pool-link" type="button">+ Create New Talent Pool</button>
                </section>

                <section class="talent-pool-section">
                  <h3>Suggested Pools <small><AppIcon name="info" :size="13" /></small></h3>
                  <div class="talent-pool-suggestions">
                    <button
                      v-for="item in suggestedPools"
                      :key="item.title"
                      class="talent-pool-suggestion"
                      type="button"
                      @click="selectedPool = item.title"
                    >
                      <span><AppIcon name="users" :size="14" /> {{ item.title }}</span>
                      <strong :class="`is-${item.tone}`">{{ item.match }}</strong>
                    </button>
                  </div>
                </section>
              </div>

              <section class="talent-pool-section">
                <h3>Reason for Adding <em>*</em></h3>
                <div class="talent-pool-reasons">
                  <button
                    v-for="item in reasonOptions"
                    :key="item.id"
                    class="talent-pool-reason"
                    :class="{ 'is-active': selectedReason === item.id }"
                    type="button"
                    @click="selectedReason = item.id"
                  >
                    <span class="talent-pool-reason__check"></span>
                    <small>OPTION</small>
                    <strong>{{ item.title }}</strong>
                  </button>
                </div>

                <div class="talent-pool-other-row">
                  <button class="talent-pool-other-trigger" type="button" :class="{ 'is-active': selectedReason === 'other' }" @click="selectedReason = 'other'">
                    <span class="talent-pool-reason__check"></span>
                    <strong>Other</strong>
                  </button>
                  <input v-model="otherReason" type="text" placeholder="Please specify">
                </div>
              </section>

              <section class="talent-pool-section">
                <h3>Skills &amp; Tags</h3>
                <div class="talent-pool-tags">
                  <button v-for="tag in selectedSkills" :key="tag" type="button">
                    <span>{{ tag }}</span>
                    <AppIcon name="close" :size="12" />
                  </button>
                  <button class="is-add" type="button">+ Add tag</button>
                </div>
              </section>

              <section class="talent-pool-section">
                <h3>Internal Note</h3>
                <textarea v-model="internalNote" rows="5"></textarea>
                <div class="talent-pool-note-count">{{ noteCount }} / 1000</div>
              </section>

              <section class="talent-pool-section">
                <h3>Visibility <em>*</em> <small><AppIcon name="info" :size="13" /></small></h3>
                <div class="talent-pool-visibility">
                  <button
                    class="talent-pool-visibility-card"
                    :class="{ 'is-active': selectedVisibility === 'hiring-team' }"
                    type="button"
                    @click="selectedVisibility = 'hiring-team'"
                  >
                    <span class="talent-pool-visibility-card__icon"><AppIcon name="users" :size="18" /></span>
                    <div>
                      <strong>Hiring Team</strong>
                      <small>Full access for all members</small>
                    </div>
                  </button>

                  <button
                    class="talent-pool-visibility-card"
                    :class="{ 'is-active': selectedVisibility === 'recruiters-only' }"
                    type="button"
                    @click="selectedVisibility = 'recruiters-only'"
                  >
                    <span class="talent-pool-visibility-card__icon"><AppIcon name="user" :size="18" /></span>
                    <div>
                      <strong>Recruiters Only</strong>
                      <small>Restricted to recruitment team</small>
                    </div>
                  </button>
                </div>
              </section>
            </section>

            <aside class="talent-pool-side">
              <section class="talent-pool-side__panel is-suggest">
                <div class="talent-pool-side__title">
                  <span class="talent-pool-side__title-icon"><AppIcon name="spark" :size="15" /></span>
                  <strong>Nitro Suggests</strong>
                  <span class="talent-pool-side__badge">AI Powered</span>
                </div>

                <div class="talent-pool-side__hero">
                  <div>
                    <strong>Senior Product Designers</strong>
                    <small>95% match</small>
                  </div>
                  <div class="talent-pool-side__hero-bar"><span /></div>
                </div>

                <div class="talent-pool-side__list">
                  <div><AppIcon name="check" :size="13" /><span>Strong portfolio alignment</span></div>
                  <div><AppIcon name="check" :size="13" /><span>Leadership potential detected</span></div>
                  <div><AppIcon name="check" :size="13" /><span>Design systems expertise</span></div>
                </div>

                <button class="talent-pool-side__recommendation" type="button">Use This Recommendation</button>
              </section>

              <section class="talent-pool-side__panel">
                <div class="talent-pool-side__title">
                  <strong>Keep Candidate Warm</strong>
                </div>

                <div class="talent-pool-side__checks">
                  <label v-for="item in keepWarmItems" :key="item.title" class="talent-pool-side__check">
                    <input type="checkbox" checked>
                    <span class="talent-pool-side__check-box"><AppIcon name="check" :size="12" /></span>
                    <div>
                      <strong>{{ item.title }}</strong>
                      <small>{{ item.note }}</small>
                    </div>
                  </label>
                </div>
              </section>

              <section class="talent-pool-side__panel">
                <div class="talent-pool-side__title">
                  <span class="talent-pool-side__title-icon is-neutral"><AppIcon name="clock" :size="15" /></span>
                  <strong>Candidate History</strong>
                </div>

                <div class="talent-pool-history">
                  <div v-for="[label, value] in historyItems" :key="label">
                    <span>{{ label }}</span>
                    <strong>{{ value }}</strong>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="talent-pool-modal__footer">
          <button class="talent-pool-button talent-pool-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="talent-pool-button talent-pool-button--primary" type="button" @click="applyTalentPool">
            <AppIcon name="userPlus" :size="16" />
            <span>Add to Talent Pool</span>
          </button>
        </footer>
      </section>

      <section v-else class="talent-pool-success">
        <div class="talent-pool-success__icon">
          <AppIcon name="checkCircle" :size="40" />
        </div>

        <h2>Candidate Added to Talent Pool</h2>
        <p>{{ candidateName }} has been successfully added to the <strong>UX Designers</strong> pool for future opportunities.</p>

        <article class="talent-pool-success__candidate">
          <span class="talent-pool-success__avatar">{{ candidateInitials }}</span>
          <div>
            <strong>{{ candidateName }}</strong>
            <small>{{ candidateRole }} • {{ candidateLocation }}</small>
          </div>
          <em>94% Match</em>
        </article>

        <button class="talent-pool-button talent-pool-button--primary talent-pool-success__button" type="button" @click="closeOverlay">
          <AppIcon name="chevronLeft" :size="15" />
          <span>Back to Pipeline</span>
        </button>

        <button class="talent-pool-success__link" type="button">View Talent Pool</button>

        <div class="talent-pool-success__hint">
          <AppIcon name="refresh" :size="13" />
          <span>NitroSync AI has synced this change with your Talent CRM.</span>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.talent-pool-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(17, 24, 39, 0.54);
  backdrop-filter: blur(4px);
}

.talent-pool-overlay.is-success {
  background: rgba(231, 236, 244, 0.88);
  backdrop-filter: blur(6px);
}

.talent-pool-modal,
.talent-pool-success {
  width: min(100%, 1150px);
  max-height: calc(100vh - 48px);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
}

.talent-pool-modal {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.talent-pool-modal__head,
.talent-pool-modal__title,
.talent-pool-profile,
.talent-pool-profile__role,
.talent-pool-profile__meta,
.talent-pool-select,
.talent-pool-suggestion,
.talent-pool-link,
.talent-pool-reason,
.talent-pool-other-trigger,
.talent-pool-tags,
.talent-pool-tags button,
.talent-pool-visibility,
.talent-pool-visibility-card,
.talent-pool-modal__footer,
.talent-pool-button,
.talent-pool-side__title,
.talent-pool-side__list div,
.talent-pool-side__check,
.talent-pool-success,
.talent-pool-success__candidate,
.talent-pool-success__hint {
  display: flex;
  align-items: center;
}

.talent-pool-modal__head,
.talent-pool-modal__footer {
  justify-content: space-between;
}

.talent-pool-modal__head {
  padding: 20px 24px;
  border-bottom: 1px solid #edf2fb;
}

.talent-pool-modal__title {
  gap: 14px;
}

.talent-pool-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fff1f8;
  color: #ff67b5;
}

.talent-pool-modal__title h2,
.talent-pool-success h2 {
  margin: 0;
  color: #1f2940;
}

.talent-pool-modal__title p,
.talent-pool-profile__meta span,
.talent-pool-note-count,
.talent-pool-side__check small,
.talent-pool-history span,
.talent-pool-success p,
.talent-pool-success__candidate small,
.talent-pool-success__hint span {
  color: #738199;
}

.talent-pool-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.talent-pool-modal__body {
  overflow: auto;
  padding: 20px 24px;
}

.talent-pool-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 22px;
}

.talent-pool-main {
  min-width: 0;
}

.talent-pool-profile {
  justify-content: space-between;
  gap: 18px;
  padding: 16px 0 18px;
  border-bottom: 1px solid #edf2f8;
}

.talent-pool-profile__copy strong,
.talent-pool-section h3,
.talent-pool-reason strong,
.talent-pool-visibility-card strong,
.talent-pool-side__hero strong,
.talent-pool-side__check strong,
.talent-pool-history strong,
.talent-pool-success__candidate strong {
  color: #1f2940;
}

.talent-pool-profile__copy strong {
  display: block;
  font-size: 1.05rem;
}

.talent-pool-profile__role {
  gap: 10px;
  margin-top: 4px;
}

.talent-pool-profile__role span {
  color: #53627b;
}

.talent-pool-profile__role em {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 8px;
  background: #fff1f8;
  color: #ff67b5;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
}

.talent-pool-profile__meta {
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.talent-pool-profile__meta span {
  gap: 5px;
  display: inline-flex;
  align-items: center;
}

.talent-pool-profile__score {
  min-width: 100px;
  text-align: right;
}

.talent-pool-profile__score small,
.talent-pool-side__hero small {
  display: block;
  color: #8f9cb0;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.talent-pool-profile__score strong {
  display: block;
  color: #18b96a;
  font-size: 2rem;
  line-height: 1;
}

.talent-pool-profile__bar,
.talent-pool-side__hero-bar {
  height: 5px;
  margin-top: 10px;
  border-radius: 999px;
  background: #e5eaef;
  overflow: hidden;
}

.talent-pool-profile__bar span,
.talent-pool-side__hero-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1cc26f 0%, #11a55f 100%);
}

.talent-pool-profile__bar span {
  width: 94%;
}

.talent-pool-section {
  margin-top: 18px;
}

.talent-pool-section h3 {
  margin: 0 0 12px;
  font-size: 0.95rem;
}

.talent-pool-section h3 em {
  color: #ff67b5;
  font-style: normal;
}

.talent-pool-section h3 small {
  color: #a0abbe;
}

.talent-pool-grid--pools {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  margin-top: 18px;
}

.talent-pool-select,
.talent-pool-other-row input,
.talent-pool-section textarea {
  width: 100%;
  border: 1px solid #dde5f1;
  border-radius: 12px;
  background: #fff;
  color: #2d3550;
  font: inherit;
}

.talent-pool-select {
  justify-content: space-between;
  min-height: 46px;
  padding: 0 14px;
  cursor: pointer;
}

.talent-pool-select span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.talent-pool-link {
  margin-top: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5d69ff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.talent-pool-suggestions {
  display: grid;
  gap: 10px;
}

.talent-pool-suggestion {
  justify-content: space-between;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #edf2fb;
  border-radius: 12px;
  background: #fbfcff;
  color: #33415b;
  font: inherit;
  cursor: pointer;
}

.talent-pool-suggestion span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.talent-pool-suggestion strong {
  font-size: 0.78rem;
}

.talent-pool-suggestion strong.is-green {
  color: #13b36a;
}

.talent-pool-suggestion strong.is-pink {
  color: #ff697b;
}

.talent-pool-reasons {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.talent-pool-reason,
.talent-pool-other-trigger {
  display: grid;
  justify-items: start;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid #dfe7f3;
  border-radius: 14px;
  background: #fff;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.talent-pool-reason.is-active,
.talent-pool-other-trigger.is-active {
  border-color: #ff73bb;
  box-shadow: inset 0 0 0 1px #ff73bb;
  background: #fff4f9;
}

.talent-pool-reason small {
  color: #a0abbe;
  font-size: 0.72rem;
  font-weight: 800;
}

.talent-pool-reason__check {
  width: 14px;
  height: 14px;
  border: 2px solid #d2dae6;
  border-radius: 50%;
  display: inline-block;
}

.talent-pool-reason.is-active .talent-pool-reason__check,
.talent-pool-other-trigger.is-active .talent-pool-reason__check {
  border-color: #ff67b5;
  box-shadow: inset 0 0 0 3px #fff, 0 0 0 6px #ff67b5;
  background: #ff67b5;
}

.talent-pool-other-row {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.talent-pool-other-row input {
  min-height: 42px;
  padding: 0 14px;
  outline: 0;
}

.talent-pool-tags {
  gap: 10px;
  flex-wrap: wrap;
}

.talent-pool-tags button {
  gap: 8px;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid #dde5f1;
  border-radius: 10px;
  background: #fff;
  color: #44506b;
  font: inherit;
  cursor: pointer;
}

.talent-pool-tags button.is-add {
  border-style: dashed;
  color: #5b6780;
}

.talent-pool-section textarea {
  min-height: 120px;
  padding: 16px;
  resize: vertical;
  outline: 0;
  line-height: 1.6;
}

.talent-pool-note-count {
  margin-top: 8px;
  text-align: right;
  font-size: 0.76rem;
}

.talent-pool-visibility {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.talent-pool-visibility-card {
  gap: 14px;
  min-height: 72px;
  padding: 0 16px;
  border: 1px solid #dde5f1;
  border-radius: 16px;
  background: #fff;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.talent-pool-visibility-card.is-active {
  border-color: #ff73bb;
  box-shadow: inset 0 0 0 1px #ff73bb;
  background: #fff4f9;
}

.talent-pool-visibility-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #f7f9fc;
  color: #67758f;
  flex: 0 0 42px;
}

.talent-pool-visibility-card small {
  display: block;
  margin-top: 4px;
  color: #7f8ba1;
}

.talent-pool-side {
  display: grid;
  align-content: start;
  gap: 20px;
}

.talent-pool-side__panel {
  padding: 18px;
  border: 1px solid #edf2fb;
  border-radius: 18px;
  background: #fff;
}

.talent-pool-side__panel.is-suggest {
  background: #fbfcff;
}

.talent-pool-side__title {
  gap: 8px;
  flex-wrap: wrap;
}

.talent-pool-side__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: #eef0ff;
  color: #6a6eff;
}

.talent-pool-side__title-icon.is-neutral {
  background: #f6f8fc;
  color: #7f8ba1;
}

.talent-pool-side__badge {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: #18b96a;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.talent-pool-side__hero {
  margin-top: 18px;
}

.talent-pool-side__hero strong {
  display: block;
  font-size: 0.88rem;
}

.talent-pool-side__hero small {
  display: block;
  margin-top: 4px;
  color: #18b96a;
  font-size: 0.86rem;
  font-weight: 800;
}

.talent-pool-side__hero-bar span {
  width: 95%;
}

.talent-pool-side__list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.talent-pool-side__list div {
  gap: 8px;
  color: #52627e;
}

.talent-pool-side__list :deep(svg) {
  color: #16b46a;
}

.talent-pool-side__recommendation {
  width: 100%;
  min-height: 40px;
  margin-top: 20px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(90deg, #6a67f7 0%, #5865f2 100%);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.talent-pool-side__checks {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.talent-pool-side__check {
  align-items: flex-start;
  gap: 10px;
}

.talent-pool-side__check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.talent-pool-side__check-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: #ff67b5;
  color: #fff;
  flex: 0 0 20px;
}

.talent-pool-side__check strong {
  display: block;
  font-size: 0.82rem;
}

.talent-pool-side__check small {
  display: block;
  margin-top: 3px;
  line-height: 1.4;
}

.talent-pool-history {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.talent-pool-history div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
}

.talent-pool-modal__footer {
  padding: 18px 24px 24px;
  border-top: 1px solid #edf2fb;
}

.talent-pool-button {
  justify-content: center;
  gap: 8px;
  min-width: 132px;
  height: 42px;
  padding: 0 20px;
  border-radius: 12px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.talent-pool-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #42506d;
}

.talent-pool-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.2);
}

.talent-pool-success {
  width: min(100%, 600px);
  max-height: none;
  padding: 28px 0 0;
  display: grid;
  gap: 18px;
  justify-items: center;
  text-align: center;
  overflow: hidden;
}

.talent-pool-success__icon {
  display: grid;
  place-items: center;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ee65b2 0%, #ea5da9 100%);
  color: #6d0045;
}

.talent-pool-success__icon :deep(svg) {
  color: #6d0045;
}

.talent-pool-success h2 {
  font-size: 1.16rem;
}

.talent-pool-success p {
  max-width: 360px;
  margin: 0 28px;
  line-height: 1.5;
}

.talent-pool-success p strong {
  color: #b03384;
}

.talent-pool-success__candidate {
  gap: 14px;
  width: calc(100% - 56px);
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(90deg, rgba(240, 112, 178, 0.9) 0%, rgba(249, 211, 231, 0.72) 100%);
  text-align: left;
}

.talent-pool-success__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-weight: 800;
  flex: 0 0 44px;
}

.talent-pool-success__candidate strong {
  display: block;
}

.talent-pool-success__candidate small {
  display: block;
  margin-top: 3px;
  color: #5d4460;
}

.talent-pool-success__candidate em {
  margin-left: auto;
  font-style: normal;
  color: #b03384;
  font-weight: 800;
}

.talent-pool-success__button {
  width: calc(100% - 56px);
  height: 46px;
  border-radius: 10px;
}

.talent-pool-success__link {
  border: 0;
  background: transparent;
  color: #b03384;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.talent-pool-success__hint {
  width: 100%;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  margin-top: 4px;
  border-top: 1px solid #eef2f8;
  background: #f7f9fc;
  color: #627089;
}

.talent-pool-success__hint :deep(svg) {
  color: #627089;
}

@media (max-width: 1080px) {
  .talent-pool-layout,
  .talent-pool-grid--pools,
  .talent-pool-reasons,
  .talent-pool-visibility {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .talent-pool-overlay {
    padding: 12px;
  }

  .talent-pool-modal,
  .talent-pool-success {
    width: 100%;
    max-height: calc(100vh - 24px);
    border-radius: 20px;
  }

  .talent-pool-modal__body,
  .talent-pool-modal__head,
  .talent-pool-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .talent-pool-modal__head,
  .talent-pool-modal__footer,
  .talent-pool-profile,
  .talent-pool-success__candidate {
    gap: 12px;
    flex-direction: column;
    align-items: flex-start;
  }

  .talent-pool-profile__score {
    width: 100%;
    text-align: left;
  }

  .talent-pool-button,
  .talent-pool-success__button,
  .talent-pool-success__candidate {
    width: calc(100% - 36px);
  }

  .talent-pool-other-row {
    grid-template-columns: 1fr;
  }
}
</style>
