<script setup>
import { onBeforeUnmount, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'done'])

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
    <div v-if="open" class="offer-marked-declined-overlay" @click.self="emit('close')">
      <section class="offer-marked-declined-modal" @click.stop>
        <button class="offer-marked-declined-modal__close" type="button" aria-label="Close" @click="emit('close')">
          <AppIcon name="close" :size="18" />
        </button>

        <header class="offer-marked-declined-header">
          <span class="offer-marked-declined-header__icon">
            <AppIcon name="alert" :size="20" />
          </span>
          <div>
            <h2>Offer marked as declined</h2>
            <p>The offer has been declined and the candidate has been moved out of the active pipeline.</p>
          </div>
        </header>

        <div class="offer-marked-declined-top">
          <article class="offer-marked-declined-card">
            <h3>Decline summary</h3>
            <div class="offer-marked-declined-summary">
              <article><span><AppIcon name="tag" :size="12" /></span><div><small>Primary reason</small><strong>Compensation</strong></div></article>
              <article><span><AppIcon name="copy" :size="12" /></span><div><small>Additional reason(s)</small><strong>Accepted another offer</strong></div></article>
              <article><span><AppIcon name="user" :size="12" /></span><div><small>Recorded by</small><strong>You</strong></div></article>
              <article><span><AppIcon name="calendar" :size="12" /></span><div><small>Recorded on</small><strong>May 18, 2024 at 2:35 PM</strong></div></article>
            </div>
          </article>

          <article class="offer-marked-declined-card is-comment">
            <h3>Candidate's comment</h3>
            <p>Thank you so much for the offer and the time you and the team have invested in me. After careful consideration, I've decided to move forward with another opportunity that is closer to my long-term goals at this time.</p>
            <p>I truly appreciate your support and hope we can stay in touch for the future.</p>
            <strong>— Marvin</strong>
            <small>Received on May 18, 2024 at 2:30 PM</small>
          </article>
        </div>

        <article class="offer-marked-declined-card offer-marked-declined-flow">
          <h3>What happens next?</h3>
          <div class="offer-marked-declined-flow__steps">
            <article><span class="is-pink"><AppIcon name="close" :size="14" /></span><strong>Offer marked as declined</strong><small>The offer status is updated in the system.</small></article>
            <i><AppIcon name="chevronRight" :size="14" /></i>
            <article><span class="is-violet"><AppIcon name="user" :size="14" /></span><strong>Candidate moved</strong><small>Candidate moved out of the active pipeline.</small></article>
            <i><AppIcon name="chevronRight" :size="14" /></i>
            <article><span class="is-blue"><AppIcon name="mail" :size="14" /></span><strong>No email sent</strong><small>No email will be sent to the candidate.</small></article>
            <i><AppIcon name="chevronRight" :size="14" /></i>
            <article><span class="is-slate"><AppIcon name="archive" :size="14" /></span><strong>Available in archive</strong><small>You can find this candidate again in the archive.</small></article>
          </div>
        </article>

        <div class="offer-marked-declined-note">
          <div>
            <strong>Recommended next step</strong>
            <h4>Send personalized email</h4>
            <p>Keep the door open and maintain a positive relationship.</p>
          </div>
          <button type="button" class="offer-marked-declined-button is-subtle">
            <AppIcon name="mail" :size="12" />
            <span>Send email</span>
          </button>
        </div>

        <footer class="offer-marked-declined-footer">
          <button type="button" class="offer-marked-declined-button" @click="emit('close')">Close</button>
          <button type="button" class="offer-marked-declined-button is-primary" @click="emit('done')">Done</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.offer-marked-declined-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
  background: rgba(32, 35, 47, 0.56);
  backdrop-filter: blur(6px);
}

.offer-marked-declined-modal {
  width: min(100%, 980px);
  position: relative;
  padding: 28px;
  margin: auto 0;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.26);
}

.offer-marked-declined-modal__close,
.offer-marked-declined-button {
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

.offer-marked-declined-modal__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 40px;
  padding: 0;
}

.offer-marked-declined-header,
.offer-marked-declined-summary article,
.offer-marked-declined-footer,
.offer-marked-declined-note {
  display: flex;
  align-items: center;
}

.offer-marked-declined-header {
  gap: 14px;
}

.offer-marked-declined-header__icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff5a76;
  background: #fff1f4;
}

.offer-marked-declined-header h2,
.offer-marked-declined-card h3,
.offer-marked-declined-summary strong,
.offer-marked-declined-flow strong,
.offer-marked-declined-note strong,
.offer-marked-declined-note h4 {
  margin: 0;
  color: #1f2c4f;
}

.offer-marked-declined-header p,
.offer-marked-declined-summary small,
.offer-marked-declined-card p,
.offer-marked-declined-card small,
.offer-marked-declined-flow small {
  margin: 0;
  color: #738199;
}

.offer-marked-declined-top {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 16px;
}

.offer-marked-declined-card {
  padding: 18px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.offer-marked-declined-summary {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.offer-marked-declined-summary article {
  gap: 12px;
}

.offer-marked-declined-summary span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff0f7;
}

.offer-marked-declined-card.is-comment {
  background: linear-gradient(180deg, #fff8fb 0%, #fff 100%);
}

.offer-marked-declined-card.is-comment strong {
  display: block;
  margin: 14px 0 6px;
}

.offer-marked-declined-flow {
  margin-top: 16px;
}

.offer-marked-declined-flow__steps {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(7, auto);
  gap: 12px;
  align-items: start;
}

.offer-marked-declined-flow__steps article {
  width: 168px;
}

.offer-marked-declined-flow__steps span {
  width: 34px;
  height: 34px;
  margin-bottom: 10px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-marked-declined-flow__steps span.is-pink { color: #ff2d87; background: #fff0f7; }
.offer-marked-declined-flow__steps span.is-violet { color: #8b5cf6; background: #f3e8ff; }
.offer-marked-declined-flow__steps span.is-blue { color: #2563eb; background: #eff6ff; }
.offer-marked-declined-flow__steps span.is-slate { color: #64748b; background: #f7f9fc; }

.offer-marked-declined-flow__steps i {
  color: #7d8cab;
  padding-top: 10px;
}

.offer-marked-declined-note {
  margin-top: 16px;
  padding: 18px;
  border: 1px solid #e4f6ea;
  border-radius: 16px;
  justify-content: space-between;
  gap: 14px;
  background: linear-gradient(180deg, #f9fffb 0%, #fff 100%);
}

.offer-marked-declined-note h4 {
  margin: 4px 0;
}

.offer-marked-declined-button.is-subtle {
  color: #ff2d87;
}

.offer-marked-declined-footer {
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.offer-marked-declined-button.is-primary {
  min-width: 120px;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff5cab 0%, #ff2d87 45%, #ff4b9b 100%);
}

@media (max-width: 1180px) {
  .offer-marked-declined-top {
    grid-template-columns: 1fr;
  }

  .offer-marked-declined-flow__steps {
    grid-template-columns: 1fr;
  }

  .offer-marked-declined-flow__steps article {
    width: auto;
  }

  .offer-marked-declined-flow__steps i {
    display: none;
  }

  .offer-marked-declined-note,
  .offer-marked-declined-footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
