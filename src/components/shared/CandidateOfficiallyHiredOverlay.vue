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

const emit = defineEmits(['close', 'share-update', 'view-profile', 'go-to-onboarding'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'AM'
))

const firstName = computed(() => props.candidateName.split(' ')[0] || 'Alex')

const confettiPieces = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${6 + ((index * 5.1) % 82)}%`,
  top: `${8 + ((index * 1.9) % 12)}%`,
  size: `${6 + (index % 3)}px`,
  drift: `${-18 + ((index % 5) * 9)}px`,
  rotate: `${18 + (index * 11)}deg`,
  delay: `${(index % 6) * 0.18}s`,
  duration: `${4.8 + ((index % 4) * 0.45)}s`,
}))

const nextSteps = computed(() => ([
  ['Moved to Hired', `${firstName.value} has been moved to the Hired stage.`, 'user-check', 'green'],
  ['Welcome email', `A personalized welcome email will be sent to ${firstName.value}.`, 'mail', 'violet'],
  ['Onboarding tasks', 'Onboarding tasks will be created automatically.', 'clipboard-check', 'blue'],
  ['Team notified', 'Hiring manager and team will be notified.', 'users', 'amber'],
  ['Profile created', 'Employee profile will be created before start date.', 'document', 'pink'],
]))

const excitementRows = [
  'Perfect match for the role',
  'Top performer in interviews',
  'Strong portfolio and skills',
  'Great culture add',
  'Ready to make an impact',
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
    <div v-if="open" class="official-hired-overlay" @click.self="emit('close')">
      <section class="official-hired-modal" @click.stop>
        <button class="official-hired-close" type="button" aria-label="Close" @click="emit('close')">
          <AppIcon name="close" :size="18" />
        </button>

        <div class="official-hired-hero">
          <span
            v-for="piece in confettiPieces"
            :key="piece.id"
            class="official-hired-confetti"
            :class="`is-${piece.id % 6}`"
            :style="{
              left: piece.left,
              top: piece.top,
              width: piece.size,
              height: piece.size,
              '--confetti-drift': piece.drift,
              '--confetti-rotate': piece.rotate,
              '--confetti-delay': piece.delay,
              '--confetti-duration': piece.duration,
            }"
          ></span>

          <div class="official-hired-hero__avatar">
            <span>{{ candidateInitials }}</span>
            <i><AppIcon name="checkCircle" :size="14" /></i>
          </div>

          <div class="official-hired-hero__copy">
            <h2><strong>{{ candidateName }}</strong> is officially hired! <span>🎉</span></h2>
            <p>Great work team! Let's give a warm welcome to our new <strong>{{ candidateRole }}</strong>.</p>
          </div>
        </div>

        <div class="official-hired-layout">
          <div class="official-hired-main">
            <section class="official-hired-stats">
              <article>
                <span><AppIcon name="calendar" :size="14" /></span>
                <div><small>Start date</small><strong>Sep 14, 2024</strong></div>
              </article>
              <article>
                <span><AppIcon name="wallet" :size="14" /></span>
                <div><small>Annual salary</small><strong>650,000 SEK</strong></div>
              </article>
              <article>
                <span><AppIcon name="building" :size="14" /></span>
                <div><small>Department</small><strong>Product</strong></div>
              </article>
              <article>
                <span><AppIcon name="mapPin" :size="14" /></span>
                <div><small>Location</small><strong>Stockholm, Sweden</strong></div>
              </article>
            </section>

            <section class="official-hired-ai">
              <div class="official-hired-ai__copy">
                <span><AppIcon name="sparkles" :size="16" /></span>
                <div>
                  <strong>You've made a great hire!</strong>
                  <p>AI predicts a strong impact and long-term success for {{ firstName }}.</p>
                </div>
              </div>
              <div class="official-hired-ai__score">
                <strong>92%</strong>
                <small>AI Fit Score</small>
              </div>
            </section>

            <section class="official-hired-flow">
              <h3>What happens next?</h3>
              <div class="official-hired-flow__steps">
                <template v-for="(step, index) in nextSteps" :key="step[0]">
                  <article>
                    <span :class="`is-${step[3]}`"><AppIcon :name="step[2]" :size="16" /></span>
                    <strong>{{ step[0] }}</strong>
                    <small>{{ step[1] }}</small>
                  </article>
                  <i v-if="index < nextSteps.length - 1"><AppIcon name="chevronRight" :size="14" /></i>
                </template>
              </div>
            </section>

            <section class="official-hired-highlight">
              <div>
                <strong>Celebrate this milestone! 🎈</strong>
                <p>Share the good news with the team.</p>
              </div>
              <button type="button" class="official-hired-button is-ghost-pink" @click="emit('share-update')">
                <AppIcon name="share" :size="13" />
                <span>Share update</span>
              </button>
            </section>
          </div>

          <aside class="official-hired-sidebar">
            <section class="official-hired-sidecard">
              <h3>Candidate summary</h3>
              <div class="official-hired-summary">
                <div class="official-hired-summary__identity">
                  <span>{{ candidateInitials }}</span>
                  <div>
                    <strong>{{ candidateName }}</strong>
                    <small>{{ candidateRole }}</small>
                    <em>HIRED</em>
                  </div>
                </div>
                <dl>
                  <div><dt>Applied on</dt><dd>May 2, 2024</dd></div>
                  <div><dt>Source</dt><dd>LinkedIn</dd></div>
                  <div><dt>Recruiter</dt><dd>Sarah Johnson</dd></div>
                  <div><dt>Employment type</dt><dd>Full-time</dd></div>
                </dl>
              </div>
            </section>

            <section class="official-hired-sidecard is-pink">
              <h3>Why this is exciting</h3>
              <ul>
                <li v-for="row in excitementRows" :key="row">
                  <AppIcon name="checkCircle" :size="12" />
                  <span>{{ row }}</span>
                </li>
              </ul>
            </section>

            <section class="official-hired-sidecard is-violet">
              <h3>Onboarding preview</h3>
              <dl>
                <div><dt>Start date</dt><dd>Mon, Sep 14, 2024</dd></div>
                <div><dt>First task</dt><dd>Complete personal information</dd></div>
              </dl>
              <button type="button" class="official-hired-inline-link" @click="emit('go-to-onboarding')">
                <span>View onboarding plan</span>
                <AppIcon name="chevronRight" :size="12" />
              </button>
            </section>
          </aside>
        </div>

        <footer class="official-hired-footer">
          <label class="official-hired-checkbox">
            <input type="checkbox">
            <span>Don't show this again</span>
          </label>

          <div class="official-hired-footer__actions">
            <button type="button" class="official-hired-button" @click="emit('view-profile')">View candidate profile</button>
            <button type="button" class="official-hired-button is-primary" @click="emit('go-to-onboarding')">
              <AppIcon name="check" :size="13" />
              <span>Go to onboarding</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.official-hired-overlay {
  position: fixed;
  inset: 0;
  z-index: 1460;
  padding: 16px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(10px);
}

.official-hired-modal {
  width: min(100%, 1240px);
  margin: auto;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  position: relative;
  padding: 30px 30px 24px;
  border-radius: 24px;
  border: 1px solid rgba(232, 236, 244, 0.95);
  background:
    radial-gradient(circle at top center, rgba(255, 112, 181, 0.08), transparent 42%),
    #fff;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.24);
  animation: official-hired-modal-in 380ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.official-hired-close,
.official-hired-button,
.official-hired-inline-link {
  border: 1px solid #dfe7f4;
  background: #fff;
  color: #24345b;
  font: inherit;
}

.official-hired-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.official-hired-hero {
  position: relative;
  padding-top: 14px;
  text-align: center;
}

.official-hired-hero::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 8px;
  width: min(100%, 520px);
  height: 180px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 88, 164, 0.14) 0%, rgba(255, 88, 164, 0) 68%);
  filter: blur(8px);
  pointer-events: none;
}

.official-hired-confetti {
  position: absolute;
  border-radius: 2px;
  opacity: 0;
  transform: translate3d(0, -42px, 0) rotate(var(--confetti-rotate));
  animation: official-hired-confetti-fall var(--confetti-duration) cubic-bezier(0.25, 0.65, 0.3, 1) var(--confetti-delay) infinite;
}

.official-hired-confetti.is-0 { background: #ff5ca8; }
.official-hired-confetti.is-1 { background: #f59e0b; }
.official-hired-confetti.is-2 { background: #8b5cf6; }
.official-hired-confetti.is-3 { background: #22c55e; }
.official-hired-confetti.is-4 { background: #60a5fa; }
.official-hired-confetti.is-5 { background: #f9a8d4; }

.official-hired-hero__avatar {
  width: 88px;
  height: 88px;
  margin: 0 auto 14px;
  border-radius: 50%;
  position: relative;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #111827 0%, #f97316 100%);
  box-shadow: 0 16px 34px rgba(255, 77, 154, 0.2);
  animation: official-hired-avatar-pop 720ms cubic-bezier(0.2, 0.9, 0.3, 1) 120ms both;
}

.official-hired-hero__avatar i {
  position: absolute;
  right: -2px;
  bottom: 4px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #22c55e;
  border: 3px solid #fff;
}

.official-hired-hero__copy h2,
.official-hired-main h3,
.official-hired-sidecard h3,
.official-hired-highlight strong,
.official-hired-ai strong,
.official-hired-summary strong {
  margin: 0;
  color: #1f2d53;
}

.official-hired-hero__copy h2 {
  font-size: 2.05rem;
  line-height: 1.16;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.official-hired-hero__copy h2 strong {
  color: #ff3f95;
}

.official-hired-hero__copy h2 > span:last-child {
  display: none;
}

.official-hired-hero__copy h2::after {
  content: '';
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.98) 0 18%, transparent 19%),
    linear-gradient(90deg, transparent 42%, #ffb000 42% 58%, transparent 58%),
    linear-gradient(0deg, transparent 42%, #ffb000 42% 58%, transparent 58%);
  box-shadow:
    0 0 0 3px rgba(255, 176, 0, 0.14),
    0 0 18px rgba(255, 176, 0, 0.22);
  transform: rotate(12deg);
}

.official-hired-hero__copy {
  animation: official-hired-copy-rise 760ms cubic-bezier(0.2, 0.85, 0.25, 1) 180ms both;
}

.official-hired-hero__copy p,
.official-hired-ai p,
.official-hired-highlight p,
.official-hired-sidecard li,
.official-hired-flow small,
.official-hired-summary small,
.official-hired-summary dt,
.official-hired-sidecard dt {
  margin: 0;
  color: #7183a6;
}

.official-hired-layout {
  margin-top: 26px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 374px;
  gap: 22px;
  align-items: start;
}

.official-hired-main,
.official-hired-sidebar {
  display: grid;
  gap: 18px;
  min-width: 0;
}

.official-hired-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  border: 1px solid #e6f5ea;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #fbfffd 0%, #fff 100%);
}

.official-hired-stats article {
  min-width: 0;
  padding: 16px 18px;
  display: flex;
  gap: 12px;
  align-items: center;
  border-right: 1px solid #edf4ef;
}

.official-hired-stats article > div,
.official-hired-ai__copy > div {
  min-width: 0;
}

.official-hired-stats article:last-child {
  border-right: 0;
}

.official-hired-stats span,
.official-hired-flow span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.official-hired-stats span {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: #22a456;
  background: #ecfbf1;
}

.official-hired-stats small,
.official-hired-ai__score small,
.official-hired-flow strong,
.official-hired-summary em,
.official-hired-sidecard dd {
  display: block;
}

.official-hired-stats strong {
  font-size: 0.94rem;
}

.official-hired-ai,
.official-hired-flow,
.official-hired-highlight,
.official-hired-sidecard {
  border: 1px solid #ebeff7;
  border-radius: 18px;
  background: #fff;
}

.official-hired-ai {
  padding: 18px 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 128px;
  align-items: center;
  gap: 18px;
  background: linear-gradient(90deg, #fff8fb 0%, #fff 74%);
}

.official-hired-ai__copy {
  display: flex;
  gap: 14px;
  align-items: center;
  min-width: 0;
}

.official-hired-ai__copy > span {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: #ff4d9a;
  background: #fff0f7;
}

.official-hired-ai__score {
  min-width: 128px;
  padding: 12px 16px;
  border-radius: 14px;
  text-align: center;
  background: linear-gradient(180deg, #fff7fb 0%, #fff 100%);
}

.official-hired-ai__score strong {
  font-size: 1.7rem;
  color: #ff3d94;
}

.official-hired-flow {
  padding: 20px;
}

.official-hired-flow__steps {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr) 16px) minmax(0, 1fr);
  column-gap: 12px;
  row-gap: 14px;
  align-items: start;
}

.official-hired-flow__steps article {
  width: auto;
  min-width: 0;
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 8px;
}

.official-hired-flow__steps span {
  width: 46px;
  height: 46px;
  border-radius: 50%;
}

.official-hired-flow__steps span.is-green { color: #16a34a; background: #ebfbf1; }
.official-hired-flow__steps span.is-violet { color: #7c3aed; background: #f4ebff; }
.official-hired-flow__steps span.is-blue { color: #2563eb; background: #eef5ff; }
.official-hired-flow__steps span.is-amber { color: #d97706; background: #fff6e7; }
.official-hired-flow__steps span.is-pink { color: #ff3d94; background: #fff0f7; }

.official-hired-flow__steps strong {
  font-size: 0.88rem;
  line-height: 1.3;
}

.official-hired-flow__steps small {
  font-size: 0.78rem;
  line-height: 1.45;
}

.official-hired-flow__steps i {
  padding-top: 16px;
  color: #8a96af;
  justify-self: center;
}

.official-hired-highlight {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(90deg, #fbfff9 0%, #fff 100%);
}

.official-hired-highlight strong {
  position: relative;
  color: transparent;
}

.official-hired-highlight strong::after {
  content: 'Celebrate this milestone!';
  color: #1f2d53;
}

.official-hired-sidebar {
  grid-auto-rows: min-content;
}

.official-hired-sidecard {
  padding: 18px;
}

.official-hired-sidecard.is-pink {
  background: linear-gradient(180deg, #fff8fb 0%, #fff 100%);
}

.official-hired-sidecard.is-violet {
  background: linear-gradient(180deg, #faf7ff 0%, #fff 100%);
}

.official-hired-summary {
  margin-top: 14px;
  display: grid;
  gap: 18px;
}

.official-hired-summary__identity {
  padding: 14px;
  border: 1px solid #eef1f7;
  border-radius: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.official-hired-summary__identity > div {
  min-width: 0;
}

.official-hired-summary__identity > span {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, #111827 0%, #f97316 100%);
}

.official-hired-summary em {
  width: fit-content;
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-style: normal;
  font-weight: 800;
  color: #16a34a;
  background: #ecfbf1;
}

.official-hired-summary strong,
.official-hired-summary small {
  display: block;
}

.official-hired-summary strong,
.official-hired-summary dd,
.official-hired-stats strong {
  line-height: 1.32;
}

.official-hired-summary small {
  margin-top: 2px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.official-hired-summary dl,
.official-hired-sidecard dl {
  display: grid;
  gap: 12px;
}

.official-hired-summary dl div,
.official-hired-sidecard dl div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.official-hired-summary dd,
.official-hired-sidecard dd {
  margin: 0;
  text-align: right;
  color: #1f2d53;
  font-weight: 700;
}

.official-hired-sidecard ul {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.official-hired-sidecard li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.official-hired-sidecard li :deep(svg) {
  color: #ff4b9b;
}

.official-hired-inline-link {
  width: 100%;
  margin-top: 16px;
  min-height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
}

.official-hired-footer {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.official-hired-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #667892;
  font-size: 0.84rem;
}

.official-hired-checkbox input {
  width: 16px;
  height: 16px;
}

.official-hired-footer__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.official-hired-button {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 700;
}

.official-hired-button.is-primary {
  min-width: 172px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff65b0 0%, #ff2d87 45%, #ff4b9b 100%);
}

.official-hired-button.is-ghost-pink {
  color: #ff2d87;
  background: #fff;
}

@keyframes official-hired-modal-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes official-hired-avatar-pop {
  0% {
    opacity: 0;
    transform: translateY(-18px) scale(0.78);
  }

  65% {
    opacity: 1;
    transform: translateY(4px) scale(1.04);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes official-hired-copy-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes official-hired-confetti-fall {
  0% {
    opacity: 0;
    transform: translate3d(0, -42px, 0) rotate(var(--confetti-rotate));
  }

  12% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate3d(var(--confetti-drift), 170px, 0) rotate(calc(var(--confetti-rotate) + 180deg));
  }
}

@media (prefers-reduced-motion: reduce) {
  .official-hired-modal,
  .official-hired-hero__avatar,
  .official-hired-hero__copy,
  .official-hired-confetti {
    animation: none;
  }
}

@media (max-width: 1080px) {
  .official-hired-layout {
    grid-template-columns: 1fr;
  }

  .official-hired-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .official-hired-stats article:nth-child(2n) {
    border-right: 0;
  }

  .official-hired-flow__steps {
    grid-template-columns: 1fr;
  }

  .official-hired-flow__steps article {
    width: auto;
    justify-items: start;
    text-align: left;
  }

  .official-hired-flow__steps i {
    display: none;
  }

  .official-hired-ai {
    grid-template-columns: 1fr;
  }

  .official-hired-ai__score {
    width: 100%;
  }
}

@media (max-width: 720px) {
  .official-hired-modal {
    padding: 22px 18px 18px;
  }

  .official-hired-hero__copy h2 {
    font-size: 1.7rem;
  }

  .official-hired-stats {
    grid-template-columns: 1fr;
  }

  .official-hired-stats article {
    border-right: 0;
    border-bottom: 1px solid #edf4ef;
  }

  .official-hired-stats article:last-child {
    border-bottom: 0;
  }

  .official-hired-ai,
  .official-hired-highlight,
  .official-hired-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .official-hired-footer__actions {
    width: 100%;
  }

  .official-hired-button {
    width: 100%;
  }
}
</style>
