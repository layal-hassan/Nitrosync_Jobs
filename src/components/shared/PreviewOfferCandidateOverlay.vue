<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import NitroSyncLogo from './NitroSyncLogo.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Marvin McKinney',
  },
  candidateRole: {
    type: String,
    default: 'Senior Frontend Developer',
  },
})

const emit = defineEmits(['close'])

const deviceMode = ref('desktop')
const pageIndex = ref(1)
const zoom = ref(100)

const candidateFirstName = computed(() => props.candidateName.split(' ')[0] || 'Marvin')

function prevPage() {
  pageIndex.value = Math.max(1, pageIndex.value - 1)
}

function nextPage() {
  pageIndex.value = Math.min(4, pageIndex.value + 1)
}

function zoomOut() {
  zoom.value = Math.max(75, zoom.value - 25)
}

function zoomIn() {
  zoom.value = Math.min(150, zoom.value + 25)
}

const bodyOverflow = typeof document !== 'undefined' ? document.body.style.overflow : ''

watch(() => props.open, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : bodyOverflow
  }
  if (isOpen) {
    pageIndex.value = 1
    zoom.value = 100
    deviceMode.value = 'desktop'
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
    <div v-if="open" class="offer-preview-overlay" @click.self="emit('close')">
      <section class="offer-preview-modal" @click.stop>
        <header class="offer-preview-header">
          <div class="offer-preview-header__copy">
            <span class="offer-preview-header__icon">
              <AppIcon name="eye" :size="15" />
            </span>
            <div>
              <strong>Preview Offer for Candidate</strong>
              <small>This is how {{ candidateName }} will see the offer.</small>
            </div>
          </div>

          <div class="offer-preview-header__actions">
            <div class="offer-preview-device-toggle">
              <button
                type="button"
                :class="{ 'is-active': deviceMode === 'desktop' }"
                @click="deviceMode = 'desktop'"
              >
                <AppIcon name="building" :size="13" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                :class="{ 'is-active': deviceMode === 'mobile' }"
                @click="deviceMode = 'mobile'"
              >
                <AppIcon name="phone" :size="13" />
                <span>Mobile</span>
              </button>
            </div>

            <button type="button" class="offer-preview-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <div class="offer-preview-toolbar">
          <div class="offer-preview-toolbar__group">
            <button type="button" class="offer-preview-tool-btn" aria-label="Previous page" @click="prevPage">
              <AppIcon name="chevronLeft" :size="14" />
            </button>
            <div class="offer-preview-tool-pill">{{ pageIndex }} / 4</div>
            <button type="button" class="offer-preview-tool-btn" aria-label="Next page" @click="nextPage">
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </div>

          <div class="offer-preview-toolbar__group">
            <button type="button" class="offer-preview-tool-btn" aria-label="Zoom out" @click="zoomOut">-</button>
            <div class="offer-preview-tool-pill">{{ zoom }}%</div>
            <button type="button" class="offer-preview-tool-btn" aria-label="Zoom in" @click="zoomIn">+</button>
          </div>

          <button type="button" class="offer-preview-download">
            <AppIcon name="document" :size="13" />
            <span>Download PDF</span>
          </button>
        </div>

        <div class="offer-preview-canvas" :class="{ 'is-mobile': deviceMode === 'mobile' }">
          <article class="offer-preview-sheet" :style="{ transform: `scale(${zoom / 100})` }">
            <div class="offer-preview-sheet__top">
              <NitroSyncLogo size="xs" :show-tagline="false" />
              <small>May 15, 2025</small>
            </div>

            <div class="offer-preview-sheet__intro">
              <h2>Offer of Employment</h2>
              <strong>Hi {{ candidateFirstName }},</strong>
              <p>We are excited to offer you the position of {{ candidateRole }} at NitroSync.</p>
              <p>We believe your skills and experience will be a great addition to our team.</p>
              <p>Please review the details of your offer carefully.</p>
              <p>We look forward to welcoming you to the team!</p>
            </div>

            <div class="offer-preview-sheet__signature">
              <em>Sarah Johnson</em>
              <small>HR Manager</small>
            </div>

            <section class="offer-preview-sheet__section">
              <h3>1. Position Details</h3>
              <dl>
                <div><dt>Position</dt><dd>{{ candidateRole }}</dd></div>
                <div><dt>Department</dt><dd>Engineering</dd></div>
                <div><dt>Reports To</dt><dd>Sarah Johnson</dd></div>
                <div><dt>Employment Type</dt><dd>Full-time</dd></div>
                <div><dt>Work Location</dt><dd>San Francisco, CA (Hybrid)</dd></div>
                <div><dt>Start Date</dt><dd>June 16, 2025</dd></div>
                <div><dt>Working Hours</dt><dd>40 hrs / week</dd></div>
              </dl>
            </section>

            <section class="offer-preview-sheet__section">
              <h3>2. Compensation</h3>
              <dl>
                <div><dt>Base Salary</dt><dd>$145,000 / year</dd></div>
                <div><dt>Annual Bonus</dt><dd>12% (Target)</dd></div>
                <div><dt>Signing Bonus</dt><dd>$10,000 (One-time)</dd></div>
                <div><dt>Equity (RSUs)</dt><dd>750 (Vested over 4 years)</dd></div>
                <div><dt>Total Annual Compensation</dt><dd class="is-pink">$165,000 / year</dd></div>
              </dl>
            </section>
          </article>
        </div>

        <footer class="offer-preview-footer">
          <button type="button" class="offer-preview-footer__button" @click="emit('close')">Close</button>
          <button type="button" class="offer-preview-footer__button is-primary" @click="nextPage">
            <span>Next</span>
            <AppIcon name="chevronRight" :size="14" />
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.offer-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  padding: 14px;
  overflow-y: auto;
  background: rgba(17, 24, 39, 0.42);
  backdrop-filter: blur(10px);
}

.offer-preview-modal {
  width: min(100%, 1220px);
  margin: auto;
  max-height: calc(100vh - 28px);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid rgba(231, 237, 245, 0.96);
  border-radius: 24px;
  background:
    radial-gradient(circle at top, rgba(255, 92, 162, 0.08), transparent 36%),
    #fff;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.22);
}

.offer-preview-header,
.offer-preview-header__copy,
.offer-preview-header__actions,
.offer-preview-device-toggle,
.offer-preview-device-toggle button,
.offer-preview-toolbar,
.offer-preview-toolbar__group,
.offer-preview-tool-btn,
.offer-preview-download,
.offer-preview-footer,
.offer-preview-footer__button,
.offer-preview-sheet__top,
.offer-preview-sheet dl div {
  display: flex;
  align-items: center;
}

.offer-preview-header {
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px;
  border-bottom: 1px solid #edf1f8;
}

.offer-preview-header__copy {
  gap: 12px;
}

.offer-preview-header__icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff0f7;
}

.offer-preview-header__copy strong,
.offer-preview-sheet__top strong,
.offer-preview-sheet__intro h2,
.offer-preview-sheet__section h3 {
  margin: 0;
  color: #1d2b49;
}

.offer-preview-header__copy small,
.offer-preview-sheet__top small,
.offer-preview-sheet__intro p,
.offer-preview-sheet__signature small,
.offer-preview-sheet dt {
  color: #8390a8;
}

.offer-preview-header__actions {
  gap: 10px;
}

.offer-preview-device-toggle {
  padding: 4px;
  gap: 4px;
  border: 1px solid #dfe6f2;
  border-radius: 13px;
  background: #fff;
}

.offer-preview-device-toggle button,
.offer-preview-close,
.offer-preview-tool-btn,
.offer-preview-download,
.offer-preview-footer__button {
  border: 1px solid #dfe6f2;
  background: #fff;
  color: #223251;
  font: inherit;
}

.offer-preview-device-toggle button {
  min-height: 34px;
  padding: 0 12px;
  gap: 7px;
  border-color: transparent;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
}

.offer-preview-device-toggle button.is-active {
  color: #ff2d87;
  background: #fff0f7;
}

.offer-preview-close {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-preview-toolbar {
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid #edf1f8;
}

.offer-preview-toolbar__group {
  gap: 8px;
}

.offer-preview-tool-btn,
.offer-preview-tool-pill,
.offer-preview-download {
  min-height: 36px;
  border-radius: 10px;
}

.offer-preview-tool-btn {
  min-width: 36px;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
}

.offer-preview-tool-pill {
  min-width: 58px;
  padding: 0 10px;
  border: 1px solid #dfe6f2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5f6f8c;
  background: #fff;
  font-size: 0.76rem;
  font-weight: 700;
}

.offer-preview-download {
  gap: 8px;
  padding: 0 14px;
  font-size: 0.8rem;
  font-weight: 700;
}

.offer-preview-canvas {
  min-height: 0;
  padding: 24px;
  overflow: auto;
  background: linear-gradient(180deg, #fcfdff 0%, #fff 100%);
}

.offer-preview-canvas.is-mobile .offer-preview-sheet {
  width: 430px;
}

.offer-preview-sheet {
  width: 760px;
  margin: 0 auto;
  padding: 34px 38px;
  transform-origin: top center;
  border: 1px solid #edf1f8;
  background: #fff;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
}

.offer-preview-sheet__top {
  justify-content: space-between;
  gap: 12px;
}

.offer-preview-sheet__top strong {
  font-size: 1.55rem;
  color: #ff2d87;
}

.offer-preview-sheet__intro {
  margin-top: 18px;
}

.offer-preview-sheet__intro h2 {
  font-size: 2rem;
}

.offer-preview-sheet__intro strong {
  display: block;
  margin-top: 18px;
  color: #1d2b49;
}

.offer-preview-sheet__intro p {
  margin: 10px 0 0;
  line-height: 1.65;
}

.offer-preview-sheet__signature {
  margin-top: 22px;
}

.offer-preview-sheet__signature em {
  display: block;
  font-style: italic;
  font-size: 1.1rem;
  color: #1d2b49;
}

.offer-preview-sheet__section {
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid #e7edf6;
}

.offer-preview-sheet__section h3 {
  font-size: 1rem;
  color: #ff2d87;
}

.offer-preview-sheet__section dl {
  margin: 14px 0 0;
  display: grid;
  gap: 10px;
}

.offer-preview-sheet__section dl div {
  justify-content: space-between;
  gap: 20px;
}

.offer-preview-sheet dd {
  margin: 0;
  color: #1d2b49;
  font-weight: 700;
}

.offer-preview-sheet dd.is-pink {
  color: #ff2d87;
}

.offer-preview-footer {
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #edf1f8;
  background: #fff;
}

.offer-preview-footer__button {
  min-height: 42px;
  padding: 0 18px;
  gap: 8px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 700;
}

.offer-preview-footer__button.is-primary {
  min-width: 110px;
  justify-content: center;
  border-color: transparent;
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
}

@media (max-width: 900px) {
  .offer-preview-header,
  .offer-preview-toolbar,
  .offer-preview-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .offer-preview-header__actions,
  .offer-preview-toolbar__group {
    justify-content: center;
  }

  .offer-preview-download,
  .offer-preview-footer__button {
    justify-content: center;
  }

  .offer-preview-canvas {
    min-height: 0;
    padding: 16px;
  }

  .offer-preview-sheet,
  .offer-preview-canvas.is-mobile .offer-preview-sheet {
    width: 100%;
  }

  .offer-preview-sheet {
    padding: 24px 18px;
  }
}
</style>
