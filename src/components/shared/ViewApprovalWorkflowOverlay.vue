<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
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
  candidateRole: {
    type: String,
    default: 'US Software Engineer',
  },
})

const emit = defineEmits(['close'])
const editStepOpen = ref(false)
const editLayerRef = ref(null)

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MM'
))

const approvalPathRows = [
  ['1', 'Thomas Lee', 'Hiring Manager', 'Thomas Lee', 'Approves first', 'required'],
  ['2', 'Sarah Chen', 'HR Business Partner', 'Sarah Chen', 'Approves second', 'required'],
  ['3', 'Finance', 'Finance Team', '', 'Required only if salary > $150,000', 'conditional'],
]

const workflowOverviewRows = [
  ['Workflow name', 'Standard Engineering Offer'],
  ['Status', 'Active', 'green'],
  ['Description', 'Default workflow for Engineering roles in the United States.'],
  ['Owner', 'People Operations'],
  ['Version', 'v2.1'],
  ['Last updated', 'May 20, 2024 by People Operations'],
]

const approvalLogicRows = [
  ['Approval type', 'Sequential'],
  ['Required approvals', 'All required approvers must approve'],
  ['Reminder', 'After 24 hours'],
  ['Repeat every', '2 days'],
  ['Escalation', 'After 5 days to Head of People'],
  ['If rejected', 'Returns to offer owner'],
]

const usageRows = [
  ['Department', 'Engineering'],
  ['Employment type', 'Full-time'],
  ['Country', 'United States'],
  ['Salary range', 'Up to $150,000'],
]

const timeRows = [
  ['Hiring Manager', '4h', 'pink'],
  ['HR Business Partner', '9h', 'violet'],
  ['Finance (Conditional)', '16h', 'green'],
]

const stepPreviewRows = [
  ['Hiring Manager', 'Approved', 'Approver', 'green'],
  ['HR Business Partner', 'Approved', 'Approved', 'green'],
  ['Finance (Conditional)', 'Pending approval', 'Pending approval', 'pink'],
  ['Approved', 'Offer sent to candidate', 'Offer sent to candidate', 'slate'],
]

const aboutStepRows = [
  ['Step order', '3 of 3'],
  ['Approval type', 'Conditional'],
  ['Required', 'Yes'],
  ['Who can approve', 'Finance Team'],
  ['Used in', '28 jobs'],
]

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

function openEditStep() {
  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }

  editStepOpen.value = true

  nextTick(() => {
    editLayerRef.value?.scrollTo?.({ top: 0, behavior: 'auto' })
  })
}

function closeEditStep() {
  editStepOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="approval-workflow-overlay" @click.self="emit('close')">
      <section class="approval-workflow-modal" :class="{ 'is-hidden-by-child': editStepOpen }" @click.stop>
        <header class="approval-workflow-header">
          <div>
            <h2>View approval workflow</h2>
            <p>Read-only view of the approval workflow used for this vacancy.</p>
            <div class="approval-workflow-header__badge">
              <AppIcon name="team-gear" :size="12" />
              <span>Managed in Settings by People Operations</span>
            </div>
          </div>

          <div class="approval-workflow-header__actions">
            <span class="approval-workflow-readonly">
              <AppIcon name="eye" :size="12" />
              <span>READ-ONLY</span>
            </span>
            <button type="button" class="approval-workflow-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="15" />
            </button>
          </div>
        </header>

        <div class="approval-workflow-top">
          <article class="approval-workflow-card">
            <h3>Approval path</h3>
            <p>This is the order in which approvers will review and approve this offer.</p>

            <div class="approval-workflow-path">
              <article
                v-for="item in approvalPathRows"
                :key="item[0]"
                class="approval-workflow-path__row"
                :class="{ 'is-final': item[0] === '3' }"
              >
                <div class="approval-workflow-path__line">
                  <span :class="{ 'is-success': item[0] === '4' }">{{ item[0] }}</span>
                  <i v-if="item[0] !== '3'"></i>
                </div>

                <div class="approval-workflow-path__card">
                  <div class="approval-workflow-path__person">
                    <span v-if="item[2] !== 'Finance'">{{ item[1].split(' ').map((part) => part[0]).join('').slice(0, 2) }}</span>
                    <span v-else class="is-finance"><AppIcon name="wallet" :size="14" /></span>
                    <div>
                      <strong>{{ item[2] }}</strong>
                      <small>{{ item[3] || item[1] }}</small>
                      <em>{{ item[4] }}</em>
                    </div>
                  </div>

                  <b :class="`is-${item[5]}`" @click="item[5] === 'conditional' ? openEditStep() : null">{{ item[5] === 'conditional' ? 'CONDITIONAL' : 'REQUIRED' }}</b>
                </div>
              </article>

              <article class="approval-workflow-path__row is-approved">
                <div class="approval-workflow-path__line">
                  <span class="is-success"><AppIcon name="checkCircle" :size="14" /></span>
                </div>

                <div class="approval-workflow-path__card is-approved">
                  <div>
                    <strong>Approved</strong>
                    <small>Offer is ready to send to the candidate.</small>
                  </div>
                </div>
              </article>
            </div>

            <div class="approval-workflow-note">
              <AppIcon name="info" :size="14" />
              <span>If the offer is rejected by any approver, it will be returned to the offer owner for review and resubmission.</span>
            </div>
          </article>

          <article class="approval-workflow-card">
            <h3>Workflow overview</h3>

            <div class="approval-workflow-detail-list">
              <article v-for="item in workflowOverviewRows" :key="item[0]">
                <span>{{ item[0] }}</span>
                <strong :class="{ 'is-green': item[2] === 'green' }">
                  <i v-if="item[2] === 'green'"></i>{{ item[1] }}
                </strong>
              </article>
            </div>

            <div class="approval-workflow-tags">
              <span>Applied to this vacancy because</span>
              <div>
                <em>Engineering</em>
                <em>Full-time</em>
                <em>United States</em>
                <em>Salary up to $150,000</em>
              </div>
            </div>

            <div class="approval-workflow-section">
              <h4>Approval logic</h4>
              <div class="approval-workflow-detail-list">
                <article v-for="item in approvalLogicRows" :key="item[0]">
                  <span>{{ item[0] }}</span>
                  <strong>{{ item[1] }}</strong>
                </article>
              </div>
            </div>

            <div class="approval-workflow-actions">
              <button type="button">
                <AppIcon name="eye" :size="13" />
                <span>Preview workflow</span>
              </button>
              <button type="button">
                <AppIcon name="document" :size="13" />
                <span>Download workflow</span>
              </button>
            </div>
          </article>
        </div>

        <div class="approval-workflow-bottom">
          <article class="approval-workflow-card">
            <h3>Where this workflow is used</h3>
            <div class="approval-workflow-usage">
              <article v-for="item in usageRows" :key="item[0]">
                <span>{{ item[0] }}</span>
                <strong>{{ item[1] }}</strong>
              </article>
            </div>
          </article>

          <article class="approval-workflow-card">
            <h3>Currently used by</h3>
            <div class="approval-workflow-current">
              <div>
                <strong>{{ candidateRole }}</strong>
                <small>Offer in progress</small>
                <span>Candidate</span>
                <b>{{ candidateName }}</b>
              </div>
              <span class="approval-workflow-current__avatar">{{ candidateInitials }}</span>
              <button type="button">
                <AppIcon name="chevronRight" :size="14" />
              </button>
            </div>
          </article>

          <article class="approval-workflow-card">
            <h3>Average approval time</h3>
            <div class="approval-workflow-time">
              <article v-for="item in timeRows" :key="item[0]">
                <span :class="`is-${item[2]}`"></span>
                <strong>{{ item[0] }}</strong>
                <small>{{ item[1] }}</small>
              </article>
              <div class="approval-workflow-time__total">
                <span>Total average</span>
                <strong>10h</strong>
              </div>
            </div>
          </article>
        </div>

        <footer class="approval-workflow-footer">
          <button type="button" class="approval-workflow-footer__ghost" @click="emit('close')">Close</button>
          <button type="button" class="approval-workflow-footer__primary" @click="openEditStep">
            <AppIcon name="external-link" :size="13" />
            <span>Edit in Settings</span>
          </button>
        </footer>
      </section>

      <section v-if="editStepOpen" ref="editLayerRef" class="approval-workflow-edit-layer" @click.self="closeEditStep">
        <div class="approval-workflow-edit-modal" @click.stop>
          <header class="approval-workflow-edit-header">
            <div>
              <h2>Edit approval workflow step</h2>
              <p>Configure this approver step and its conditions.</p>
            </div>

            <button type="button" class="approval-workflow-close" aria-label="Close edit step" @click="closeEditStep">
              <AppIcon name="close" :size="15" />
            </button>
          </header>

          <div class="approval-workflow-edit-layout">
            <section class="approval-workflow-edit-main">
              <article class="approval-workflow-edit-card approval-workflow-edit-card--summary">
                <div class="approval-workflow-edit-step">
                  <span class="approval-workflow-edit-step__index">3</span>
                  <span class="approval-workflow-edit-step__icon"><AppIcon name="wallet" :size="14" /></span>
                  <div>
                    <strong>Finance</strong>
                    <small>Step 3 of 3 &bull; Finance Team</small>
                    <em>Required only if salary &gt; $150,000</em>
                  </div>
                </div>
                <b>CONDITIONAL</b>
              </article>

              <article class="approval-workflow-edit-card">
                <div class="approval-workflow-edit-grid approval-workflow-edit-grid--two">
                  <label class="approval-workflow-edit-field">
                    <span>Step name</span>
                    <div class="approval-workflow-edit-input">
                      <input type="text" value="Finance">
                      <small>7/60</small>
                    </div>
                  </label>

                  <label class="approval-workflow-edit-field">
                    <span>Step type</span>
                    <button type="button" class="approval-workflow-edit-select">
                      <span class="approval-workflow-edit-select__icon"><AppIcon name="wallet" :size="13" /></span>
                      <strong>Conditional approval</strong>
                      <AppIcon name="chevronDown" :size="14" />
                    </button>
                  </label>
                </div>
              </article>

              <article class="approval-workflow-edit-card">
                <h3>Condition</h3>
                <p>This step is required only if the following condition is met.</p>

                <div class="approval-workflow-edit-condition">
                  <button type="button" class="approval-workflow-edit-select">Salary <AppIcon name="chevronDown" :size="14" /></button>
                  <button type="button" class="approval-workflow-edit-select">is greater than <AppIcon name="chevronDown" :size="14" /></button>
                  <div class="approval-workflow-edit-input is-compact">
                    <input type="text" value="$150,000">
                  </div>
                  <button type="button" class="approval-workflow-edit-icon-button" aria-label="Remove condition">
                    <AppIcon name="close" :size="14" />
                  </button>
                </div>

                <button type="button" class="approval-workflow-edit-link">+ Add another condition</button>
              </article>

              <article class="approval-workflow-edit-card">
                <h3>Approver</h3>
                <p>Who needs to approve this step?</p>

                <div class="approval-workflow-edit-approver">
                  <div class="approval-workflow-edit-approver__avatars">
                    <span>TL</span>
                    <span>SC</span>
                    <span>MA</span>
                  </div>
                  <div>
                    <strong>Finance Team</strong>
                    <small>finance@nitrosync.com</small>
                  </div>
                  <button type="button" class="approval-workflow-edit-select">Edit <AppIcon name="chevronDown" :size="14" /></button>
                </div>

                <button type="button" class="approval-workflow-edit-link">+ Add backup approver</button>
              </article>

              <article class="approval-workflow-edit-card">
                <h3>Approval settings</h3>

                <div class="approval-workflow-edit-grid approval-workflow-edit-grid--four">
                  <label class="approval-workflow-edit-field">
                    <span>Timeout to approve</span>
                    <button type="button" class="approval-workflow-edit-select">5 days <AppIcon name="chevronDown" :size="14" /></button>
                  </label>
                  <label class="approval-workflow-edit-field">
                    <span>Reminder</span>
                    <button type="button" class="approval-workflow-edit-select">After 24 hours <AppIcon name="chevronDown" :size="14" /></button>
                  </label>
                  <label class="approval-workflow-edit-field">
                    <span>Repeat reminder</span>
                    <button type="button" class="approval-workflow-edit-select">Every 2 days <AppIcon name="chevronDown" :size="14" /></button>
                  </label>
                  <label class="approval-workflow-edit-field">
                    <span>Escalate to</span>
                    <button type="button" class="approval-workflow-edit-select">CFO <AppIcon name="chevronDown" :size="14" /></button>
                  </label>
                </div>

                <div class="approval-workflow-edit-toggle">
                  <div>
                    <strong>Allow delegate</strong>
                    <small>Approvers can delegate this step to someone else.</small>
                  </div>
                  <button type="button" class="approval-workflow-edit-switch is-on" aria-label="Allow delegate">
                    <i></i>
                  </button>
                </div>
              </article>
            </section>

            <aside class="approval-workflow-edit-side">
              <article class="approval-workflow-edit-card">
                <h3>Step preview</h3>
                <div class="approval-workflow-edit-preview">
                  <article v-for="item in stepPreviewRows" :key="item[0]">
                    <span :class="`is-${item[3]}`"></span>
                    <div>
                      <strong>{{ item[0] }}</strong>
                      <small>{{ item[1] }}</small>
                      <em>{{ item[2] }}</em>
                    </div>
                  </article>
                </div>

                <div class="approval-workflow-note">
                  <AppIcon name="info" :size="14" />
                  <span>This step will appear only when Salary is greater than $150,000.</span>
                </div>
              </article>

              <article class="approval-workflow-edit-card">
                <h3>About this step</h3>
                <div class="approval-workflow-detail-list approval-workflow-detail-list--compact">
                  <article v-for="item in aboutStepRows" :key="item[0]">
                    <span>{{ item[0] }}</span>
                    <strong>{{ item[1] }}</strong>
                  </article>
                </div>
              </article>
            </aside>
          </div>

          <footer class="approval-workflow-edit-footer">
            <button type="button" class="approval-workflow-edit-footer__danger">Delete step</button>
            <div class="approval-workflow-edit-footer__actions">
              <button type="button" class="approval-workflow-footer__ghost" @click="closeEditStep">Cancel</button>
              <button type="button" class="approval-workflow-edit-footer__primary" @click="closeEditStep">Save changes</button>
            </div>
          </footer>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.approval-workflow-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(10px);
}

.approval-workflow-modal {
  width: min(1380px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
  transition: opacity 0.18s ease;
}

.approval-workflow-modal.is-hidden-by-child {
  opacity: 0;
  pointer-events: none;
}

.approval-workflow-header,
.approval-workflow-header__actions,
.approval-workflow-path__person,
.approval-workflow-path__card,
.approval-workflow-note,
.approval-workflow-actions,
.approval-workflow-current,
.approval-workflow-footer {
  display: flex;
  align-items: center;
}

.approval-workflow-header,
.approval-workflow-top,
.approval-workflow-bottom,
.approval-workflow-footer {
  padding: 18px 22px;
}

.approval-workflow-header {
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #edf1f8;
}

.approval-workflow-header h2,
.approval-workflow-card h3,
.approval-workflow-card h4,
.approval-workflow-path__card strong,
.approval-workflow-detail-list strong,
.approval-workflow-usage strong,
.approval-workflow-current strong,
.approval-workflow-time strong {
  margin: 0;
  color: #1f2c4f;
}

.approval-workflow-header p,
.approval-workflow-card p,
.approval-workflow-path__card small,
.approval-workflow-path__card em,
.approval-workflow-detail-list span,
.approval-workflow-usage span,
.approval-workflow-current small,
.approval-workflow-current span,
.approval-workflow-time small,
.approval-workflow-time__total span {
  margin: 0;
  color: #7d8cab;
}

.approval-workflow-header__badge,
.approval-workflow-readonly {
  margin-top: 10px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.69rem;
  font-weight: 700;
}

.approval-workflow-header__badge {
  color: #6d5cff;
  background: #f4f1ff;
}

.approval-workflow-readonly {
  margin-top: 0;
  color: #ff2d87;
  background: #fff1f7;
}

.approval-workflow-header__actions {
  gap: 12px;
  align-self: flex-start;
}

.approval-workflow-close,
.approval-workflow-actions button,
.approval-workflow-current button,
.approval-workflow-footer__ghost,
.approval-workflow-footer__primary {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #223251;
  background: #fff;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 800;
}

.approval-workflow-close {
  width: 36px;
  padding: 0;
}

.approval-workflow-top {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 1.3fr);
  gap: 16px;
  align-items: start;
}

.approval-workflow-bottom {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding-top: 0;
  align-items: start;
}

.approval-workflow-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.approval-workflow-card h3 {
  margin-bottom: 8px;
}

.approval-workflow-path {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.approval-workflow-path__row {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 12px;
}

.approval-workflow-path__line {
  display: grid;
  justify-items: center;
  align-items: start;
}

.approval-workflow-path__line span {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #ff4b9b;
  font-size: 0.69rem;
  font-weight: 800;
}

.approval-workflow-path__line span.is-success {
  background: #22c55e;
}

.approval-workflow-path__line i {
  width: 2px;
  min-height: 42px;
  margin-top: 6px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ffd4e7 0%, #eef2ff 100%);
}

.approval-workflow-path__card {
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e9eef7;
  border-radius: 14px;
}

.approval-workflow-path__card.is-approved {
  background: #f3fff7;
  border-color: #d8f4e1;
}

.approval-workflow-path__person {
  gap: 12px;
  min-width: 0;
}

.approval-workflow-path__person > span {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.78rem;
  font-weight: 800;
  flex: 0 0 36px;
}

.approval-workflow-path__person > span.is-finance {
  color: #16a34a;
  background: #ecfdf3;
}

.approval-workflow-path__person > div,
.approval-workflow-current > div {
  display: grid;
  gap: 4px;
}

.approval-workflow-path__person em {
  font-style: normal;
}

.approval-workflow-path__card b {
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  font-size: 0.63rem;
  font-weight: 800;
  cursor: pointer;
}

.approval-workflow-path__card b.is-required {
  color: #6d5cff;
  background: #f3f0ff;
}

.approval-workflow-path__card b.is-conditional {
  color: #16a34a;
  background: #effcf4;
}

.approval-workflow-note {
  gap: 10px;
  margin-top: 14px;
  padding: 12px 14px;
  border: 1px solid #e5e9ff;
  border-radius: 12px;
  color: #6d5cff;
  background: #f7f8ff;
  font-size: 0.76rem;
  font-weight: 600;
}

.approval-workflow-detail-list {
  display: grid;
  gap: 12px;
}

.approval-workflow-detail-list article {
  padding: 10px 0;
  border-bottom: 1px solid #edf1f8;
  display: grid;
  grid-template-columns: minmax(0, 180px) 1fr;
  gap: 18px;
  align-items: center;
}

.approval-workflow-detail-list article:last-child {
  border-bottom: 0;
}

.approval-workflow-detail-list strong.is-green {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #16a34a;
}

.approval-workflow-detail-list strong.is-green i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.approval-workflow-tags {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #edf1f8;
  display: grid;
  gap: 10px;
}

.approval-workflow-tags > span {
  color: #7d8cab;
  font-size: 0.74rem;
  font-weight: 700;
}

.approval-workflow-tags > div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.approval-workflow-tags em {
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #475569;
  background: #f8fafc;
  font-style: normal;
  font-size: 0.69rem;
  font-weight: 700;
}

.approval-workflow-section {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #edf1f8;
}

.approval-workflow-section h4 {
  margin-bottom: 10px;
}

.approval-workflow-actions {
  gap: 10px;
  margin-top: 16px;
}

.approval-workflow-usage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 18px;
  margin-top: 14px;
}

.approval-workflow-usage article {
  display: grid;
  gap: 6px;
}

.approval-workflow-current {
  gap: 12px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
}

.approval-workflow-current b {
  color: #1f2c4f;
}

.approval-workflow-current__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.74rem;
  font-weight: 800;
  margin-left: auto;
}

.approval-workflow-current button {
  width: 32px;
  min-height: 32px;
  padding: 0;
}

.approval-workflow-time {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.approval-workflow-time article,
.approval-workflow-time__total {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
}

.approval-workflow-time article > span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.approval-workflow-time article > span.is-pink { background: #ff4b9b; }
.approval-workflow-time article > span.is-violet { background: #8b7bff; }
.approval-workflow-time article > span.is-green { background: #22c55e; }

.approval-workflow-time__total {
  padding-top: 10px;
  border-top: 1px solid #edf1f8;
}

.approval-workflow-footer {
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #edf1f8;
}

.approval-workflow-footer__primary {
  color: #ff2d87;
  border-color: #ffd5e7;
  background: #fff7fb;
}

.approval-workflow-edit-layer {
  position: fixed;
  inset: 0;
  z-index: 1460;
  display: grid;
  align-items: start;
  padding: 24px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
}

.approval-workflow-edit-modal {
  width: min(1260px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 22px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.24);
}

.approval-workflow-edit-header,
.approval-workflow-edit-step,
.approval-workflow-edit-approver,
.approval-workflow-edit-approver__avatars,
.approval-workflow-edit-condition,
.approval-workflow-edit-toggle,
.approval-workflow-edit-preview article,
.approval-workflow-edit-footer,
.approval-workflow-edit-footer__actions {
  display: flex;
  align-items: center;
}

.approval-workflow-edit-header,
.approval-workflow-edit-layout,
.approval-workflow-edit-footer {
  padding: 18px 22px;
}

.approval-workflow-edit-header,
.approval-workflow-edit-footer {
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #edf1f8;
}

.approval-workflow-edit-footer {
  border-top: 1px solid #edf1f8;
  border-bottom: 0;
}

.approval-workflow-edit-header h2,
.approval-workflow-edit-card h3,
.approval-workflow-edit-field strong,
.approval-workflow-edit-preview strong,
.approval-workflow-edit-step strong,
.approval-workflow-edit-toggle strong {
  margin: 0;
  color: #1f2c4f;
}

.approval-workflow-edit-header p,
.approval-workflow-edit-card p,
.approval-workflow-edit-step small,
.approval-workflow-edit-step em,
.approval-workflow-edit-field span,
.approval-workflow-edit-input small,
.approval-workflow-edit-preview small,
.approval-workflow-edit-preview em,
.approval-workflow-edit-toggle small {
  margin: 0;
  color: #7d8cab;
}

.approval-workflow-edit-layout {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) 320px;
  gap: 16px;
  overflow: auto;
}

.approval-workflow-edit-main,
.approval-workflow-edit-side,
.approval-workflow-edit-grid,
.approval-workflow-edit-preview {
  display: grid;
  gap: 16px;
  align-content: start;
}

.approval-workflow-edit-card--summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.approval-workflow-edit-step {
  gap: 10px;
}

.approval-workflow-edit-step__index,
.approval-workflow-edit-step__icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
}

.approval-workflow-edit-step__index {
  color: #fff;
  background: #ff4b9b;
}

.approval-workflow-edit-step__icon {
  color: #16a34a;
  background: #ecfdf3;
}

.approval-workflow-edit-step > div {
  display: grid;
  gap: 4px;
}

.approval-workflow-edit-step em {
  font-style: normal;
}

.approval-workflow-edit-card--summary b {
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #16a34a;
  background: #effcf4;
  font-size: 0.63rem;
  font-weight: 800;
}

.approval-workflow-edit-grid--two {
  grid-template-columns: 1fr 1fr;
}

.approval-workflow-edit-grid--four {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.approval-workflow-edit-field {
  display: grid;
  gap: 8px;
}

.approval-workflow-edit-input,
.approval-workflow-edit-select,
.approval-workflow-edit-icon-button {
  min-height: 42px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  background: #fff;
  font: inherit;
}

.approval-workflow-edit-input {
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.approval-workflow-edit-input input {
  width: 100%;
  padding: 0;
  border: 0;
  color: #1f2c4f;
  background: transparent;
  font: inherit;
  font-weight: 700;
}

.approval-workflow-edit-input.is-compact {
  width: 130px;
}

.approval-workflow-edit-select {
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #223251;
  font-size: 0.76rem;
  font-weight: 700;
}

.approval-workflow-edit-select__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #ecfdf3;
}

.approval-workflow-edit-condition {
  gap: 10px;
  margin-top: 14px;
}

.approval-workflow-edit-condition > * {
  flex: 1 1 0;
}

.approval-workflow-edit-icon-button {
  width: 42px;
  flex: 0 0 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.approval-workflow-edit-link {
  margin-top: 12px;
  padding: 0;
  border: 0;
  color: #6d5cff;
  background: transparent;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 800;
}

.approval-workflow-edit-approver {
  gap: 12px;
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
}

.approval-workflow-edit-approver__avatars span {
  width: 28px;
  height: 28px;
  margin-right: -6px;
  border: 2px solid #fff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.64rem;
  font-weight: 800;
}

.approval-workflow-edit-approver > div {
  display: grid;
  gap: 4px;
}

.approval-workflow-edit-approver .approval-workflow-edit-select {
  margin-left: auto;
}

.approval-workflow-edit-toggle {
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #edf1f8;
}

.approval-workflow-edit-toggle > div {
  display: grid;
  gap: 4px;
}

.approval-workflow-edit-switch {
  width: 42px;
  height: 24px;
  padding: 2px;
  border: 0;
  border-radius: 999px;
  background: #dbe3f1;
}

.approval-workflow-edit-switch.is-on {
  background: #6d5cff;
}

.approval-workflow-edit-switch i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: block;
  background: #fff;
  margin-left: auto;
}

.approval-workflow-edit-preview article {
  gap: 10px;
  align-items: start;
}

.approval-workflow-edit-preview article > span {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  border: 2px solid #d9e1ef;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 18px;
}

.approval-workflow-edit-preview article > span.is-green {
  border-color: #22c55e;
  background: #22c55e;
}

.approval-workflow-edit-preview article > span.is-pink {
  border-color: #ff4b9b;
  background: #ff4b9b;
}

.approval-workflow-edit-preview article > span.is-slate {
  background: #fff;
}

.approval-workflow-edit-preview article > div {
  display: grid;
  gap: 4px;
}

.approval-workflow-detail-list--compact article {
  grid-template-columns: minmax(0, 110px) 1fr;
}

.approval-workflow-edit-footer__danger {
  padding: 0;
  border: 0;
  color: #ff2d87;
  background: transparent;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 800;
}

.approval-workflow-edit-footer__actions {
  gap: 10px;
}

.approval-workflow-edit-footer__primary {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #5b49ff;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, #6d5cff 0%, #4f46e5 100%);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 800;
}

@media (max-width: 1180px) {
  .approval-workflow-top,
  .approval-workflow-bottom,
  .approval-workflow-edit-layout {
    grid-template-columns: 1fr;
  }

  .approval-workflow-edit-grid--four {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .approval-workflow-overlay {
    padding: 12px;
  }

  .approval-workflow-modal {
    width: min(100%, calc(100vw - 24px));
  }

  .approval-workflow-header,
  .approval-workflow-footer,
  .approval-workflow-edit-header,
  .approval-workflow-edit-footer {
    display: grid;
    grid-template-columns: 1fr;
  }

  .approval-workflow-detail-list article,
  .approval-workflow-usage,
  .approval-workflow-path__row,
  .approval-workflow-edit-grid--two,
  .approval-workflow-edit-grid--four {
    grid-template-columns: 1fr;
  }

  .approval-workflow-path__line {
    justify-items: start;
  }

  .approval-workflow-path__line i {
    display: none;
  }

  .approval-workflow-path__card,
  .approval-workflow-current {
    display: grid;
    grid-template-columns: 1fr;
  }

  .approval-workflow-edit-layer {
    padding: 12px;
  }

  .approval-workflow-edit-modal {
    width: min(100%, calc(100vw - 24px));
    max-height: calc(100vh - 24px);
  }

  .approval-workflow-edit-condition,
  .approval-workflow-edit-toggle {
    display: grid;
    grid-template-columns: 1fr;
  }

  .approval-workflow-edit-condition > * {
    flex: none;
    width: 100%;
  }
}
</style>
