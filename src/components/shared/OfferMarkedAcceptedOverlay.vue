<script setup>
import { onBeforeUnmount, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Marvin McKinney',
  },
})

const emit = defineEmits(['close', 'view-offer-details', 'go-to-onboarding'])

const bodyOverflow = typeof document !== 'undefined' ? document.body.style.overflow : ''

watch(() => props.open, (isOpen) => {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : bodyOverflow
}, { immediate: true })

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = bodyOverflow
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="offer-marked-accepted-overlay" @click.self="emit('close')">
      <section class="offer-marked-accepted-modal" @click.stop>
        <button class="offer-marked-accepted-modal__close" type="button" aria-label="Close" @click="emit('close')">
          <AppIcon name="close" :size="18" />
        </button>

        <div class="offer-marked-accepted-modal__hero">
          <span class="offer-marked-accepted-modal__check">
            <AppIcon name="check" :size="28" />
          </span>
          <h2>Offer marked as accepted!</h2>
          <p>Great news! {{ candidateName.split(' ')[0] || 'Marvin' }} has accepted the offer.</p>
        </div>

        <div class="offer-marked-accepted-summary">
          <article><span><AppIcon name="calendar" :size="16" /></span><div><small>Accepted on</small><strong>May 18, 2024</strong></div></article>
          <article><span><AppIcon name="clock" :size="16" /></span><div><small>Time</small><strong>2:30 PM</strong></div></article>
          <article><span><AppIcon name="mail" :size="16" /></span><div><small>Accepted via</small><strong>Email</strong></div></article>
          <article><span><AppIcon name="chart-bars" :size="16" /></span><div><small>Accepted after</small><strong>2 days</strong></div></article>
        </div>

        <section class="offer-marked-accepted-flow">
          <h3>What happens next?</h3>
          <div class="offer-marked-accepted-flow__steps">
            <article><span><AppIcon name="checkCircle" :size="14" /></span><strong>Offer marked as accepted</strong><small>The offer status is updated in the system.</small></article>
            <i><AppIcon name="chevronRight" :size="14" /></i>
            <article><span><AppIcon name="user" :size="14" /></span><strong>Candidate moved to Hired</strong><small>Candidate stage is updated.</small></article>
            <i><AppIcon name="chevronRight" :size="14" /></i>
            <article><span><AppIcon name="mail" :size="14" /></span><strong>Welcome email sent</strong><small>A welcome email will be sent to the candidate.</small></article>
            <i><AppIcon name="chevronRight" :size="14" /></i>
            <article><span><AppIcon name="briefcase" :size="14" /></span><strong>Onboarding started</strong><small>Onboarding tasks are created automatically.</small></article>
            <i><AppIcon name="chevronRight" :size="14" /></i>
            <article><span><AppIcon name="user-check" :size="14" /></span><strong>Employee profile created</strong><small>Employee profile will be created before start date.</small></article>
          </div>
        </section>

        <div class="offer-marked-accepted-note is-green">
          <div>
            <strong>Recommended next step</strong>
            <h4>Send welcome email</h4>
            <p>Send a personalized welcome email to {{ candidateName.split(' ')[0] || 'Marvin' }} and kick off onboarding.</p>
          </div>
          <button type="button" class="offer-marked-accepted-button is-subtle">
            <AppIcon name="mail" :size="12" />
            <span>Send email</span>
          </button>
        </div>

        <div class="offer-marked-accepted-note is-violet">
          <div>
            <strong>Onboarding is ready to go!</strong>
            <p>{{ candidateName.split(' ')[0] || 'Marvin' }} will receive onboarding tasks and all the information he needs.</p>
          </div>
          <button type="button" class="offer-marked-accepted-button is-link" @click="emit('go-to-onboarding')">
            <span>View onboarding</span>
            <AppIcon name="external-link" :size="12" />
          </button>
        </div>

        <footer class="offer-marked-accepted-footer">
          <button type="button" class="offer-marked-accepted-button" @click="emit('view-offer-details')">
            <AppIcon name="eye" :size="12" />
            <span>View offer details</span>
          </button>
          <div class="offer-marked-accepted-footer__actions">
            <button type="button" class="offer-marked-accepted-button" @click="emit('close')">Close</button>
            <button type="button" class="offer-marked-accepted-button is-primary" @click="emit('go-to-onboarding')">Go to onboarding</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.offer-marked-accepted-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow-y: auto;
  background: rgba(32, 35, 47, 0.56);
  backdrop-filter: blur(6px);
}

.offer-marked-accepted-modal {
  width: min(100%, 980px);
  position: relative;
  margin: auto;
  padding: 28px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.26);
}

.offer-marked-accepted-modal__close,
.offer-marked-accepted-button {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #223251;
  background: #fff;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 800;
}

.offer-marked-accepted-modal__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 40px;
  padding: 0;
}

.offer-marked-accepted-modal__hero {
  text-align: left;
}

.offer-marked-accepted-modal__check {
  width: 74px;
  height: 74px;
  margin-bottom: 14px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: radial-gradient(circle at 35% 35%, #22c55e 0%, #16a34a 70%);
  box-shadow: 0 14px 28px rgba(34, 197, 94, 0.26);
}

.offer-marked-accepted-modal h2,
.offer-marked-accepted-flow h3,
.offer-marked-accepted-note strong,
.offer-marked-accepted-note h4,
.offer-marked-accepted-summary strong,
.offer-marked-accepted-flow strong {
  margin: 0;
  color: #1f2c4f;
}

.offer-marked-accepted-modal p,
.offer-marked-accepted-summary small,
.offer-marked-accepted-note p,
.offer-marked-accepted-flow small {
  margin: 0;
  color: #738199;
}

.offer-marked-accepted-summary {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border: 1px solid #e5f5ea;
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfffc 0%, #fff 100%);
}

.offer-marked-accepted-summary article {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.offer-marked-accepted-summary article + article {
  border-left: 1px solid #edf1f8;
}

.offer-marked-accepted-summary span {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #effcf4;
}

.offer-marked-accepted-flow {
  margin-top: 16px;
  padding: 18px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
}

.offer-marked-accepted-flow__steps {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(9, auto);
  gap: 12px;
  align-items: start;
}

.offer-marked-accepted-flow__steps article {
  width: 140px;
  text-align: center;
}

.offer-marked-accepted-flow__steps span {
  width: 34px;
  height: 34px;
  margin: 0 auto 10px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f7f9fc;
  color: #16a34a;
}

.offer-marked-accepted-flow__steps i {
  color: #7d8cab;
  padding-top: 12px;
}

.offer-marked-accepted-note {
  margin-top: 16px;
  padding: 18px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}

.offer-marked-accepted-note.is-green {
  border: 1px solid #e4f6ea;
  background: linear-gradient(180deg, #f9fffb 0%, #fff 100%);
}

.offer-marked-accepted-note.is-violet {
  border: 1px solid #eee7ff;
  background: linear-gradient(180deg, #faf8ff 0%, #fff 100%);
}

.offer-marked-accepted-note h4 {
  margin: 4px 0;
}

.offer-marked-accepted-button.is-subtle {
  color: #ff2d87;
  background: #fff;
}

.offer-marked-accepted-button.is-link {
  color: #6d5cff;
  background: #fff;
}

.offer-marked-accepted-footer {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}

.offer-marked-accepted-footer__actions {
  display: flex;
  gap: 12px;
}

.offer-marked-accepted-button.is-primary {
  min-width: 170px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff5cab 0%, #ff2d87 45%, #ff4b9b 100%);
}

@media (max-width: 980px) {
  .offer-marked-accepted-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .offer-marked-accepted-summary article:nth-child(3) {
    border-left: 0;
  }

  .offer-marked-accepted-flow__steps {
    grid-template-columns: 1fr;
  }

  .offer-marked-accepted-flow__steps article {
    width: auto;
  }

  .offer-marked-accepted-flow__steps i {
    display: none;
  }

  .offer-marked-accepted-note,
  .offer-marked-accepted-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .offer-marked-accepted-footer__actions {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
