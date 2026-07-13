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
    default: 'Senior UX Designer',
  },
})

const emit = defineEmits(['close', 'continue'])

const currentStep = ref(1)
const selectedMethod = ref('automated')
const selectedTiming = ref('send-now')
const selectedProvider = ref('HiPeople')
const referencesRequired = ref('5')
const reminderFrequency = ref('Every 3 days')
const dueDate = ref('Jun 10, 2026')
const candidateConsent = ref(true)
const questionnaireTemplate = ref('Standard Template')
const autoFollowUp = ref(true)
const addCandidateToPool = ref(false)
const managersCount = ref(3)
const peersCount = ref(1)
const crossFunctionalCount = ref(1)
const customersCount = ref(0)
const manualReferences = ref([])
const editingManualReferenceId = ref(null)
const manualReviewPhase = ref('configure')

function createManualDraft() {
  return {
    id: Date.now(),
    fullName: '',
    jobTitle: '',
    relationship: '',
    email: '',
    phone: '',
    company: '',
    noLongerAtCompany: false,
    duration: '',
    capacity: '',
    context: '',
  }
}

const manualDraft = ref(createManualDraft())
const manualStage = ref('list')

const methodOptions = [
  {
    id: 'automated',
    title: 'Automated',
    icon: 'sparkles',
    tag: 'Recommended',
    description: 'Use an integrated provider to send requests automatically and get structured reports.',
    bullets: [
      'Automated invites & reminders',
      'Secure & verified responses',
      'AI-powered insights & summaries',
      'Faster completion & tracking',
    ],
    providers: ['HiPeople', 'Xref', 'Checkster', 'More'],
  },
  {
    id: 'manual',
    title: 'Manual',
    icon: 'edit',
    description: 'Add reference details yourself and collect feedback outside of the platform.',
    bullets: [
      'Full control over the process',
      'Collect via call, email or meetings',
      'Upload documents or notes',
      'Flexible & customizable',
    ],
  },
]

const timingOptions = [
  ['send-now', 'Send now', 'Send the reference request immediately.', 'mail'],
  ['later', 'Save and send later', 'Save this reference and send it at a later time.', 'clock'],
  ['candidate', 'Candidate will provide contacts', 'The candidate will add and submit their references.', 'user'],
]

const recommendationChips = ['3 Managers', '1 Peer', '1 Cross-functional Partner']
const referenceMixCards = [
  ['managers', 'Managers', 'Direct or recent managers', 'briefcase'],
  ['peers', 'Peers', 'People who worked with the candidate', 'users'],
  ['cross', 'Cross-functional Partners', 'Partners or stakeholders', 'share'],
  ['customers', 'Customers', 'Clients or external partners', 'user-check'],
]

function getReferenceMixIcon(label) {
  if (label === 'Managers') return 'briefcase'
  if (label === 'Peers') return 'users'
  if (label === 'Cross-functional Partners') return 'share'
  if (label === 'Customers') return 'user-check'
  return 'users'
}

const manualCount = computed(() => manualReferences.value.length)
const isManualFlow = computed(() => selectedMethod.value === 'manual')
const manualPreparedReferences = computed(() => (
  manualReferences.value.filter((reference) => (
    reference.fullName
    || reference.jobTitle
    || reference.relationship
    || reference.email
    || reference.phone
    || reference.company
    || reference.duration
    || reference.capacity
    || reference.context
  ))
))
const selectedMethodOption = computed(() => (
  methodOptions.find((method) => method.id === selectedMethod.value) ?? methodOptions[0]
))
const providerBadge = computed(() => (
  selectedMethod.value === 'automated' ? selectedProvider.value.charAt(0) : 'M'
))
const totalReferenceMix = computed(() => (
  isManualFlow.value
    ? manualPreparedReferences.value.length
    : managersCount.value + peersCount.value + crossFunctionalCount.value + customersCount.value
))
const stepTwoTitle = computed(() => (
  isManualFlow.value ? 'Setup References' : 'Configure Request'
))
const stepThreeTitle = computed(() => (
  isManualFlow.value
    ? ((manualReviewPhase.value === 'review' || currentStep.value === 4) ? 'Review & Send' : 'Configure & Send')
    : 'Review & Send'
))
const stepperCurrentStep = computed(() => (
  isManualFlow.value && currentStep.value === 4 ? 3 : currentStep.value
))
const stepItems = computed(() => ([
  { step: 1, label: 'Method' },
  { step: 2, label: stepTwoTitle.value },
  { step: 3, label: stepThreeTitle.value },
]))
const currentStepTitle = computed(() => (
  isManualFlow.value && currentStep.value === 4
    ? 'Reference requests have been sent successfully.'
    : isManualFlow.value && currentStep.value >= 2
      ? (
          currentStep.value === 2
            ? 'Add and customize reference requests manually.'
            : 'Review and send your reference request.'
        )
      : currentStep.value === 1
    ? 'Choose how you want to collect and manage this reference request for'
    : currentStep.value === 4
      ? 'Reference requests were sent successfully for'
      : 'Configure and send this reference request for'
))
const modalTitle = computed(() => (
  isManualFlow.value && currentStep.value >= 2
    ? 'Add Reference'
    : currentStep.value === 4 && !isManualFlow.value
      ? 'Send Reference Requests'
      : 'Reference Collection'
))
const referenceMixSummary = computed(() => ([
  [
    'Managers',
    isManualFlow.value
      ? manualPreparedReferences.value.filter((item) => item.relationship === 'Manager').length
      : managersCount.value,
    'pink',
  ],
  [
    'Peers',
    isManualFlow.value
      ? manualPreparedReferences.value.filter((item) => item.relationship === 'Peer').length
      : peersCount.value,
    'violet',
  ],
  [
    'Cross-functional Partners',
    isManualFlow.value
      ? manualPreparedReferences.value.filter((item) => item.relationship === 'Cross-functional Partner').length
      : crossFunctionalCount.value,
    'orange',
  ],
  [
    'Customers',
    isManualFlow.value
      ? manualPreparedReferences.value.filter((item) => item.relationship === 'Customer').length
      : customersCount.value,
    'green',
  ],
]))
const reminderSummaryText = computed(() => (
  `${reminderFrequency.value}${autoFollowUp.value ? ' � Auto follow-up enabled' : ''}`
))

const requestsCreated = computed(() => (
  selectedMethod.value === 'automated' ? totalReferenceMix.value : manualCount.value
))
const responseGroups = computed(() => ([
  {
    title: 'Managers',
    count: managersCount.value,
    status: managersCount.value > 0 ? 'Sent' : 'Not requested',
    tone: managersCount.value > 0 ? 'success' : 'muted',
    people: ['SJ', 'DK', 'PL'].slice(0, managersCount.value),
  },
  {
    title: 'Peers',
    count: peersCount.value,
    status: peersCount.value > 0 ? 'Sent' : 'Not requested',
    tone: peersCount.value > 0 ? 'success' : 'muted',
    people: ['JL', 'MR', 'AC'].slice(0, peersCount.value),
  },
  {
    title: 'Cross-functional Partners',
    count: crossFunctionalCount.value,
    status: crossFunctionalCount.value > 0 ? 'Sent' : 'Not requested',
    tone: crossFunctionalCount.value > 0 ? 'success' : 'muted',
    people: ['PT', 'EM'].slice(0, crossFunctionalCount.value),
  },
  {
    title: 'Customers',
    count: customersCount.value,
    status: customersCount.value > 0 ? 'Sent' : 'Not requested',
    tone: customersCount.value > 0 ? 'success' : 'muted',
    people: ['CR', 'JN'].slice(0, customersCount.value),
  },
]))
const successTimeline = computed(() => ([
  ['checkCircle', 'Requests created', 'Just now', 'success'],
  ['mail', 'Invitations sent', 'Just now', 'success'],
  ['refresh', 'References complete questionnaire', `We'll send reminders ${reminderFrequency.value.toLowerCase()}`, 'progress'],
  ['sparkles', 'AI analyzes feedback', 'AI summaries and insights will be generated', 'violet'],
  ['bell', 'Hiring team notified', 'You will be notified when all responses are in.', 'blue'],
]))
const secondaryActionLabel = computed(() => (
  currentStep.value === 1 ? 'Cancel' : currentStep.value === 4 ? 'View Candidate' : 'Back'
))
const primaryActionLabel = computed(() => (
  currentStep.value === 4 ? 'Go to Reference Tracking' : currentStep.value === 3 ? 'Send Request' : 'Continue'
))
const primaryActionIcon = computed(() => (
  currentStep.value === 3 ? 'mail' : 'chevronRight'
))
const showModalFooter = computed(() => !(
  isManualFlow.value
  && currentStep.value >= 2
))
const isPrimaryActionDisabled = computed(() => false)
const isManualDraftValid = computed(() => true)
const manualCanContinue = computed(() => manualPreparedReferences.value.length > 0)
const manualPrimaryReference = computed(() => manualPreparedReferences.value[0] ?? null)
const manualRequestMessage = computed(() => (
  `Hi {{reference_name}},\n\nYou have been selected to provide a reference for ${props.candidateName}, who has applied for the ${props.candidateRole} role.`
))

function resetManualDraft() {
  editingManualReferenceId.value = null
  manualDraft.value = createManualDraft()
}

function closeOverlay() {
  emit('close')
}

function addManualReference() {
  manualStage.value = 'form'
  resetManualDraft()
}

function removeManualReference(referenceId) {
  manualReferences.value = manualReferences.value.filter((reference) => reference.id !== referenceId)
}

function editManualReference(reference) {
  editingManualReferenceId.value = reference.id
  manualDraft.value = {
    ...createManualDraft(),
    ...reference,
  }
  manualStage.value = 'form'
}

function handleManualListBack() {
  currentStep.value = 1
}

function handleManualListContinue() {
  if (manualPreparedReferences.value.length === 0) {
    addManualReference()
    return
  }

  manualReviewPhase.value = 'configure'
  currentStep.value = 3
}

function goToManualListStage() {
  currentStep.value = 2
  manualStage.value = 'list'
}

function goToManualFormStage(reference = null) {
  if (reference) {
    currentStep.value = 2
    editManualReference(reference)
    return
  }

  currentStep.value = 2
  addManualReference()
}

function goToManualReviewPhase() {
  if (!manualCanContinue.value) {
    return
  }

  manualReviewPhase.value = 'review'
  currentStep.value = 3
}

function goBackFromManualReview() {
  if (manualReviewPhase.value === 'review') {
    manualReviewPhase.value = 'configure'
    return
  }

  goToManualListStage()
}

function sendManualReferences() {
  emit('continue', buildPayload())
  currentStep.value = 4
}

function backToManualReview() {
  manualReviewPhase.value = 'review'
  currentStep.value = 3
}

function saveManualReference(addAnother = false) {
  const payload = {
    ...manualDraft.value,
    id: editingManualReferenceId.value ?? Date.now(),
    fullName: manualDraft.value.fullName.trim() || 'Reference Contact',
    jobTitle: manualDraft.value.jobTitle.trim() || 'Reference',
    relationship: manualDraft.value.relationship || 'Manager',
    email: manualDraft.value.email.trim() || 'pending@reference.com',
    phone: manualDraft.value.phone.trim(),
    company: manualDraft.value.company.trim(),
    context: manualDraft.value.context.trim(),
  }

  if (editingManualReferenceId.value) {
    manualReferences.value = manualReferences.value.map((reference) => (
      reference.id === editingManualReferenceId.value ? payload : reference
    ))
  } else {
    manualReferences.value.push(payload)
  }

  if (addAnother) {
    manualStage.value = 'form'
    resetManualDraft()
    return
  }

  manualStage.value = 'list'
  resetManualDraft()
}

function resetForm() {
  currentStep.value = 1
  manualStage.value = 'list'
  manualReviewPhase.value = 'configure'
  selectedMethod.value = 'automated'
  selectedTiming.value = 'send-now'
  selectedProvider.value = 'HiPeople'
  referencesRequired.value = '5'
  reminderFrequency.value = 'Every 3 days'
  dueDate.value = 'Jun 10, 2026'
  candidateConsent.value = true
  questionnaireTemplate.value = 'Standard Template'
  autoFollowUp.value = true
  addCandidateToPool.value = false
  managersCount.value = 3
  peersCount.value = 1
  crossFunctionalCount.value = 1
  customersCount.value = 0
  manualReferences.value = []
  resetManualDraft()
}

function adjustCount(target, delta) {
  if (target === 'managers') {
    managersCount.value = Math.max(0, managersCount.value + delta)
  }

  if (target === 'peers') {
    peersCount.value = Math.max(0, peersCount.value + delta)
  }

  if (target === 'cross') {
    crossFunctionalCount.value = Math.max(0, crossFunctionalCount.value + delta)
  }

  if (target === 'customers') {
    customersCount.value = Math.max(0, customersCount.value + delta)
  }
}

function applyAiRecommendation() {
  managersCount.value = 3
  peersCount.value = 1
  crossFunctionalCount.value = 1
  customersCount.value = 0
}

function goBackStep() {
  if (currentStep.value > 1) {
    currentStep.value -= 1
  }
}

function buildPayload() {
  return {
    step: currentStep.value,
    method: selectedMethod.value,
    timing: selectedTiming.value,
    provider: selectedProvider.value,
    referencesRequired: referencesRequired.value,
    reminderFrequency: reminderFrequency.value,
    dueDate: dueDate.value,
    candidateConsent: candidateConsent.value,
    questionnaireTemplate: questionnaireTemplate.value,
    autoFollowUp: autoFollowUp.value,
    addCandidateToPool: addCandidateToPool.value,
    referenceMix: {
      managers: managersCount.value,
      peers: peersCount.value,
      crossFunctional: crossFunctionalCount.value,
      customers: customersCount.value,
    },
    manualReferences: manualReferences.value,
  }
}

function handleSecondaryAction() {
  if (currentStep.value === 1 || currentStep.value === 4) {
    closeOverlay()
    return
  }

  if (isManualFlow.value && currentStep.value === 3) {
    if (manualReviewPhase.value === 'review') {
      manualReviewPhase.value = 'configure'
      return
    }

    goToManualListStage()
    return
  }

  goBackStep()
}

function handlePrimaryAction() {
  if (isPrimaryActionDisabled.value) {
    return
  }

  if (currentStep.value === 4) {
    closeOverlay()
    return
  }

  if (currentStep.value === 1) {
    if (isManualFlow.value) {
      manualStage.value = 'list'
    }
    currentStep.value = 2
    return
  }

  if (currentStep.value === 2) {
    if (isManualFlow.value && manualStage.value === 'list' && manualPreparedReferences.value.length === 0) {
      addManualReference()
      return
    }

    if (isManualFlow.value) {
      manualReviewPhase.value = 'configure'
    }
    currentStep.value = 3
    return
  }

  if (currentStep.value === 3 && isManualFlow.value) {
    if (manualReviewPhase.value === 'configure') {
      manualReviewPhase.value = 'review'
      return
    }

    sendManualReferences()
    return
  }

  emit('continue', buildPayload())
  currentStep.value = 4
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : ''
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      resetForm()
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="reference-collection-overlay" @click.self="closeOverlay">
      <section class="reference-collection-modal">
        <header class="reference-collection-modal__head">
          <div class="reference-collection-modal__title">
            <span class="reference-collection-modal__title-icon">
              <AppIcon name="users" :size="20" />
            </span>
            <div>
              <h2>{{ modalTitle }}</h2>
              <p>{{ currentStepTitle }} {{ candidateName }}.</p>
            </div>
          </div>

          <button type="button" aria-label="Close reference collection" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="reference-collection-modal__body">
          <section class="reference-collection-steps">
            <template v-for="(item, index) in stepItems" :key="item.step">
              <article :class="{ 'is-active': stepperCurrentStep === item.step, 'is-complete': stepperCurrentStep > item.step }">
                <span>
                  <AppIcon v-if="stepperCurrentStep > item.step" name="check" :size="12" :stroke="2.6" />
                  <template v-else>{{ item.step }}</template>
                </span>
                <strong>{{ item.label }}</strong>
              </article>
              <i v-if="index < stepItems.length - 1" />
            </template>
          </section>

          <section v-if="currentStep === 1" class="reference-collection-panel">
            <div class="reference-collection-panel__hero">
              <h3>How would you like to collect references?</h3>
              <p>Choose the option that works best for your workflow.</p>
            </div>

            <div class="reference-collection-method-grid">
              <div
                v-for="method in methodOptions"
                :key="method.id"
                class="reference-method-column"
              >
                <button
                  type="button"
                  class="reference-method-card"
                  :class="{ 'is-selected': selectedMethod === method.id }"
                  @click="selectedMethod = method.id"
                >
                  <span class="reference-method-card__radio">
                    <span v-if="selectedMethod === method.id" />
                  </span>

                  <span class="reference-method-card__icon">
                    <AppIcon :name="method.icon" :size="24" />
                  </span>

                  <div class="reference-method-card__copy">
                    <div class="reference-method-card__head">
                      <strong>{{ method.title }}</strong>
                      <small v-if="method.tag">{{ method.tag }}</small>
                    </div>

                    <p>{{ method.description }}</p>

                    <ul>
                      <li v-for="bullet in method.bullets" :key="bullet">
                        <AppIcon name="checkCircle" :size="14" />
                        <span>{{ bullet }}</span>
                      </li>
                    </ul>

                    <div v-if="method.providers" class="reference-method-card__providers">
                      <span v-for="provider in method.providers" :key="provider">{{ provider }}</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div class="reference-method-expand">
              <div class="reference-method-expand__head">
                <div>
                  <small>Selected Method</small>
                  <h4>{{ selectedMethodOption.title }}</h4>
                </div>
                <span>{{ selectedMethodOption.description }}</span>
              </div>

              <template v-if="selectedMethod === 'automated'">
                <article class="reference-method-config">
                  <div class="reference-method-config__head">
                    <h4>Automated Setup</h4>
                    <p>Select the provider and define how the request should be sent.</p>
                  </div>

                  <div class="reference-method-config__layout">
                    <section class="reference-method-config__card">
                      <label>
                        <span>Provider</span>
                        <select v-model="selectedProvider">
                          <option>HiPeople</option>
                          <option>Xref</option>
                          <option>Checkster</option>
                          <option>RefNow</option>
                        </select>
                      </label>

                      <div class="reference-method-config__fields two-col">
                        <label>
                          <span>References Required</span>
                          <select v-model="referencesRequired">
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                          </select>
                        </label>

                        <label class="toggle-field">
                          <span>Candidate Consent</span>
                          <button type="button" :class="{ active: candidateConsent }" @click="candidateConsent = !candidateConsent">
                            <span />
                          </button>
                        </label>

                        <label>
                          <span>Reminder Frequency</span>
                          <select v-model="reminderFrequency">
                            <option>Every 2 days</option>
                            <option>Every 3 days</option>
                            <option>Every week</option>
                          </select>
                        </label>

                        <label>
                          <span>Due Date</span>
                          <input v-model="dueDate" type="text">
                        </label>
                      </div>
                    </section>

                    <aside class="reference-method-config__aside">
                      <strong>Why automated?</strong>
                      <ul>
                        <li>Fastest path to verified responses.</li>
                        <li>Automatic reminders reduce follow-up work.</li>
                        <li>Structured outputs are easier to review later.</li>
                      </ul>
                    </aside>
                  </div>
                </article>
              </template>

              <template v-else>
                <article class="reference-method-expand">
                  <div class="reference-method-expand__head">
                    <div>
                      <small>Selected Method</small>
                      <h4>Manual collection</h4>
                    </div>
                    <span>You will add the reference contacts yourself in the next step, then configure how the request should be sent.</span>
                  </div>

                  <div class="reference-method-config__stack">
                    <section class="reference-method-config__card">
                      <strong>What happens next?</strong>
                      <ul>
                        <li>Add each reference contact manually.</li>
                        <li>Choose reminder and consent settings.</li>
                        <li>Review the request before sending it.</li>
                      </ul>
                    </section>
                  </div>
                </article>
              </template>
            </div>

            <article class="reference-ai-recommendation">
              <div class="reference-ai-recommendation__copy">
                <AppIcon name="sparkles" :size="16" />
                <div>
                  <strong>AI Recommendation</strong>
                  <p>Based on this role, we recommend collecting 5 references:</p>
                </div>
              </div>

              <div class="reference-ai-recommendation__chips">
                <span v-for="chip in recommendationChips" :key="chip">{{ chip }}</span>
              </div>

              <button type="button">Change</button>
            </article>

            <section class="reference-timing">
              <div class="reference-timing__head">
                <h4>Reference Collection Timing</h4>
                <p>When would you like to send this request?</p>
              </div>

              <div class="reference-timing__grid">
                <button
                  v-for="option in timingOptions"
                  :key="option[0]"
                  type="button"
                  class="reference-timing-card"
                  :class="{ 'is-selected': selectedTiming === option[0] }"
                  @click="selectedTiming = option[0]"
                >
                  <span class="reference-timing-card__radio">
                    <span v-if="selectedTiming === option[0]" />
                  </span>

                  <span class="reference-timing-card__icon">
                    <AppIcon :name="option[3]" :size="18" />
                  </span>

                  <div>
                    <strong>{{ option[1] }}</strong>
                    <p>{{ option[2] }}</p>
                  </div>
                </button>
              </div>
            </section>
          </section>

          <section v-else-if="currentStep === 2" class="reference-collection-configure">
            <div class="reference-collection-configure__main">
              <template v-if="selectedMethod === 'automated'">
              <section class="reference-config-card">
                <div class="reference-config-card__title">
                  <span>1</span>
                  <div>
                    <h3>{{ selectedMethod === 'automated' ? 'Reference Provider' : 'Reference Collection Method' }}</h3>
                    <p>
                      {{
                        selectedMethod === 'automated'
                          ? 'Choose the platform you want to use.'
                          : 'Manual collection will be handled by your team inside the hiring workflow.'
                      }}
                    </p>
                  </div>
                </div>

                <template v-if="selectedMethod === 'automated'">
                  <label class="reference-config-field">
                    <span>Provider</span>
                    <select v-model="selectedProvider">
                      <option>HiPeople</option>
                      <option>Xref</option>
                      <option>Checkster</option>
                      <option>RefNow</option>
                    </select>
                  </label>

                  <article class="reference-config-note">
                    <AppIcon name="sparkles" :size="15" />
                    <p>{{ selectedProvider }} will send invites, collect responses and provide AI-powered insights.</p>
                    <button type="button">Learn more</button>
                  </article>
                </template>

                <template v-else>
                  <article class="reference-config-note">
                    <AppIcon name="edit" :size="15" />
                    <p>{{ manualCount }} manual reference{{ manualCount > 1 ? 's' : '' }} prepared. Your team will collect and record feedback directly.</p>
                  </article>
                </template>
              </section>

              <section class="reference-config-card">
                <div class="reference-config-card__title">
                  <span>2</span>
                  <div>
                    <h3>Reference Mix</h3>
                    <p>Tell us what types of references you need for this role.</p>
                  </div>
                </div>

                <div class="reference-mix-grid">
                  <article
                    v-for="mixCard in referenceMixCards"
                    :key="mixCard[0]"
                    class="reference-mix-card"
                  >
                    <span class="reference-mix-card__icon">
                      <AppIcon :name="mixCard[3]" :size="16" />
                    </span>
                    <strong>{{ mixCard[1] }}</strong>
                    <small>{{ mixCard[2] }}</small>
                    <div class="reference-mix-counter">
                      <button type="button" @click="adjustCount(mixCard[0], -1)">-</button>
                      <span>
                        {{
                          mixCard[0] === 'managers'
                            ? managersCount
                            : mixCard[0] === 'peers'
                              ? peersCount
                              : mixCard[0] === 'cross'
                                ? crossFunctionalCount
                                : customersCount
                        }}
                      </span>
                      <button type="button" @click="adjustCount(mixCard[0], 1)">+</button>
                    </div>
                  </article>
                </div>

                <div class="reference-mix-footer">
                  <span>Total references <strong>{{ totalReferenceMix }}</strong></span>
                  <article class="reference-ai-inline">
                    <div>
                      <AppIcon name="sparkles" :size="14" />
                      <p><strong>AI Recommendation</strong><span>3 Managers, 1 Peer and 1 Cross-functional Partner.</span></p>
                    </div>
                    <button type="button" @click="applyAiRecommendation">Apply</button>
                  </article>
                </div>
              </section>

              <section class="reference-config-card">
                <div class="reference-config-card__title">
                  <span>3</span>
                  <div>
                    <h3>Request Configuration</h3>
                    <p>Set how the reference request should be sent and managed.</p>
                  </div>
                </div>

                <div class="reference-request-grid">
                  <label class="reference-config-field">
                    <span>Questionnaire Template</span>
                    <select v-model="questionnaireTemplate">
                      <option>Standard Template</option>
                      <option>Leadership Template</option>
                      <option>Technical Deep Dive</option>
                    </select>
                  </label>

                  <label class="reference-config-field">
                    <span>Due Date</span>
                    <input v-model="dueDate" type="text">
                  </label>

                  <label class="reference-config-field">
                    <span>Reminder Frequency</span>
                    <select v-model="reminderFrequency">
                      <option>Every 2 days</option>
                      <option>Every 3 days</option>
                      <option>Every week</option>
                    </select>
                  </label>
                </div>

                <div class="reference-request-options">
                  <label class="reference-request-check">
                    <input v-model="candidateConsent" type="checkbox">
                    <span>Request candidate consent automatically</span>
                  </label>
                  <label class="reference-request-check">
                    <input v-model="addCandidateToPool" type="checkbox">
                    <span>Allow candidate to add or replace references</span>
                  </label>
                </div>

                <div class="reference-request-toggle-row">
                  <div>
                    <strong>Auto Follow-up</strong>
                    <p>Send automatic reminders until responses are received.</p>
                  </div>

                  <button type="button" class="toggle-switch" :class="{ active: autoFollowUp }" @click="autoFollowUp = !autoFollowUp">
                    <span />
                  </button>
                </div>
              </section>
              </template>

              <template v-else>
                <template v-if="manualStage === 'list'">
                  <section class="reference-manual-stage">
                    <div class="reference-config-card__title">
                      <div>
                        <h3>{{ manualPreparedReferences.length ? 'References Added' : 'Add References Manually' }}</h3>
                        <p>
                          {{
                            manualPreparedReferences.length
                              ? `${manualPreparedReferences.length} reference${manualPreparedReferences.length === 1 ? ' has' : 's have'} been added. Add more references or continue to configure your request.`
                              : 'Add each reference and we\'ll send them a customized request.'
                          }}
                        </p>
                      </div>

                      <button
                        v-if="manualPreparedReferences.length"
                        type="button"
                        class="reference-inline-action"
                        @click="addManualReference"
                      >
                        <AppIcon name="plus" :size="14" />
                        <span>Add Another Reference</span>
                      </button>
                    </div>

                    <section v-if="manualPreparedReferences.length === 0" class="reference-manual-stage__empty">
                      <span class="reference-manual-stage__empty-icon">
                        <AppIcon name="userPlus" :size="34" />
                      </span>
                      <strong>No references added yet</strong>
                      <p>Add references who can provide insights about the candidate's work performance and experience.</p>
                      <button type="button" class="reference-manual-stage__empty-button" @click="addManualReference">
                        <AppIcon name="plus" :size="15" />
                        Add Your First Reference
                      </button>
                    </section>

                    <section v-else class="reference-manual-stage__list">
                      <article
                        v-for="reference in manualPreparedReferences"
                        :key="reference.id"
                        class="reference-manual-stage__card"
                      >
                        <div class="reference-manual-stage__card-head">
                          <div>
                            <strong>{{ reference.fullName }}</strong>
                            <p>{{ reference.jobTitle }}<span v-if="reference.company"> at {{ reference.company }}</span></p>
                          </div>
                          <div class="reference-manual-stage__card-actions">
                            <span class="reference-manual-stage__pill">{{ reference.relationship }}</span>
                            <button
                              type="button"
                              class="reference-manual-stage__icon-button"
                              @click="editManualReference(reference)"
                            >
                              <AppIcon name="edit" :size="14" />
                            </button>
                            <button
                              type="button"
                              class="reference-manual-stage__icon-button"
                              @click="removeManualReference(reference.id)"
                            >
                              <AppIcon name="trash" :size="14" />
                            </button>
                          </div>
                        </div>
                      </article>
                    </section>

                    <template v-if="manualPreparedReferences.length">
                      <section class="reference-manual-success">
                        <div class="reference-manual-success__head">
                          <span class="reference-manual-success__icon">
                            <AppIcon name="checkCircle" :size="18" />
                          </span>
                          <div>
                            <strong>References Added</strong>
                            <p>{{ manualPreparedReferences.length }} reference{{ manualPreparedReferences.length === 1 ? ' has' : 's have' }} been added. Add more references or continue to configure your request.</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          class="reference-inline-action reference-inline-action--compact"
                          @click="addManualReference"
                        >
                          <AppIcon name="plus" :size="14" />
                          <span>Add Another Reference</span>
                        </button>
                      </section>

                      <section class="reference-manual-summary-card">
                        <article
                          v-for="(reference, index) in manualPreparedReferences"
                          :key="reference.id"
                          class="reference-manual-stage__card reference-manual-stage__card--detailed"
                        >
                          <div class="reference-manual-stage__card-index">{{ index + 1 }}</div>
                          <div class="reference-manual-stage__card-copy">
                            <strong>{{ reference.fullName }}</strong>
                            <p>{{ reference.jobTitle }}<span v-if="reference.company"> at {{ reference.company }}</span></p>
                          </div>
                          <div class="reference-manual-stage__card-actions">
                            <span class="reference-manual-stage__pill">{{ reference.relationship }}</span>
                            <button
                              type="button"
                              class="reference-manual-stage__icon-button"
                              @click="editManualReference(reference)"
                            >
                              <AppIcon name="edit" :size="14" />
                            </button>
                            <button
                              type="button"
                              class="reference-manual-stage__icon-button"
                              @click="removeManualReference(reference.id)"
                            >
                              <AppIcon name="trash" :size="14" />
                            </button>
                          </div>
                        </article>
                      </section>

                      <section class="reference-manual-summary-card">
                        <div class="reference-config-card__title">
                          <div>
                            <h3>Reference Summary</h3>
                            <p>You can add up to {{ referencesRequired }} references for this request.</p>
                          </div>
                        </div>

                        <div class="reference-manual-mix-grid">
                          <article
                            v-for="item in referenceMixSummary"
                            :key="`manual-${item[0]}`"
                            class="reference-manual-mix-card reference-manual-mix-card--with-icon"
                            :class="`is-${item[2]}`"
                          >
                            <span class="reference-manual-mix-card__icon">
                              <AppIcon :name="getReferenceMixIcon(item[0])" :size="15" />
                            </span>
                            <div>
                              <strong>{{ item[0] }}</strong>
                              <small>{{ item[1] }} / {{ referencesRequired }}</small>
                            </div>
                          </article>
                        </div>
                      </section>

                      <article class="reference-manual-tip">
                        <AppIcon name="sparkles" :size="16" />
                        <div>
                          <strong>Tips for great references</strong>
                          <p>Add a mix of managers, peers, and cross-functional partners. Choose people who worked closely with the candidate and can speak to performance and skills.</p>
                        </div>
                      </article>
                    </template>

                    <template v-else>
                      <article class="reference-manual-tip">
                        <AppIcon name="info" :size="16" />
                        <div>
                          <strong>Tip: Add diverse references</strong>
                          <p>We recommend a mix of managers, peers and cross-functional partners for a well-rounded perspective.</p>
                        </div>
                      </article>

                      <section>
                        <div class="reference-config-card__title">
                          <div>
                            <h3>Reference Mix</h3>
                            <p>Will be updated as you add references.</p>
                          </div>
                        </div>

                        <div class="reference-manual-mix-grid">
                          <article
                            v-for="item in referenceMixSummary"
                            :key="`manual-${item[0]}`"
                            class="reference-manual-mix-card"
                            :class="`is-${item[2]}`"
                          >
                            <span class="reference-manual-mix-card__dot" :class="`is-${item[2]}`" />
                            <div>
                              <strong>{{ item[0] }}</strong>
                              <small>{{ item[1] }}</small>
                            </div>
                          </article>
                        </div>
                      </section>
                    </template>

                    <div class="reference-manual-navigation">
                      <button type="button" class="reference-collection-button secondary" @click="handleManualListBack">
                        Back
                      </button>
                      <button type="button" class="reference-collection-button primary-alt" @click="handleManualListContinue">
                        {{ manualPreparedReferences.length ? 'Continue to Configure' : 'Continue' }}
                        <AppIcon name="chevronRight" :size="16" />
                      </button>
                    </div>
                  </section>
                </template>

                <section v-else class="reference-config-card reference-config-card--manual-form">
                  <div class="reference-config-card__title reference-config-card__title--manual">
                    <div>
                      <button type="button" class="reference-inline-link reference-back-link" @click="manualStage = 'list'">
                        <AppIcon name="chevronLeft" :size="14" />
                        <span>Back to Reference List</span>
                      </button>
                      <h3>Add Your First Reference</h3>
                      <p>Enter the details of the person who will provide a reference.</p>
                    </div>
                    <small class="reference-required-note">* Required fields</small>
                  </div>

                  <article class="reference-manual-section">
                    <h4>Reference Information</h4>

                    <div class="reference-method-config__fields three-col">
                      <label class="reference-config-field">
                        <span>Full Name *</span>
                        <input v-model="manualDraft.fullName" type="text" placeholder="e.g. Sarah Johnson">
                      </label>

                      <label class="reference-config-field">
                        <span>Job Title *</span>
                        <input v-model="manualDraft.jobTitle" type="text" placeholder="e.g. Senior Product Manager">
                      </label>

                      <label class="reference-config-field">
                        <span>Relationship to Candidate *</span>
                        <select v-model="manualDraft.relationship">
                          <option value="">Select relationship</option>
                          <option>Manager</option>
                          <option>Peer</option>
                          <option>Cross-functional Partner</option>
                          <option>Customer</option>
                        </select>
                      </label>

                      <label class="reference-config-field">
                        <span>Email Address *</span>
                        <input v-model="manualDraft.email" type="email" placeholder="name@company.com">
                      </label>

                      <label class="reference-config-field">
                        <span>Phone Number</span>
                        <input v-model="manualDraft.phone" type="text" placeholder="+1 (555) 123-4567">
                      </label>

                      <label class="reference-config-field">
                        <span>Company</span>
                        <input v-model="manualDraft.company" type="text" placeholder="e.g. Acme Inc.">
                      </label>
                    </div>

                    <label class="reference-request-check reference-request-check--inline">
                      <input v-model="manualDraft.noLongerAtCompany" type="checkbox">
                      <span>This person is no longer at this company</span>
                    </label>
                  </article>

                  <article class="reference-manual-section">
                    <div>
                      <h4>Additional Information (Optional)</h4>
                      <p>This information helps us customize the reference request.</p>
                    </div>

                    <div class="reference-method-config__fields two-col">
                      <label class="reference-config-field">
                        <span>How long did they work with the candidate?</span>
                        <select v-model="manualDraft.duration">
                          <option value="">Select duration</option>
                          <option>Less than 6 months</option>
                          <option>6 to 12 months</option>
                          <option>1 to 2 years</option>
                          <option>2+ years</option>
                        </select>
                      </label>

                      <label class="reference-config-field">
                        <span>In what capacity did they work together?</span>
                        <select v-model="manualDraft.capacity">
                          <option value="">Select capacity</option>
                          <option>Direct manager</option>
                          <option>Peer collaborator</option>
                          <option>Cross-functional partner</option>
                          <option>Client / customer</option>
                        </select>
                      </label>
                    </div>

                    <label class="reference-config-field reference-config-field--textarea">
                      <span>Any additional context to help this reference provide better feedback?</span>
                      <textarea
                        v-model="manualDraft.context"
                        maxlength="500"
                        placeholder="e.g. Key projects worked on together, specific areas to focus on..."
                      ></textarea>
                      <small>{{ manualDraft.context.length }}/500</small>
                    </label>
                  </article>

                  <div class="reference-manual-actions">
                    <button type="button" class="reference-collection-button secondary" @click="manualStage = 'list'">
                      Cancel
                    </button>
                    <div class="reference-manual-actions__main">
                      <button
                        type="button"
                        class="reference-collection-button ghost"
                        :disabled="!isManualDraftValid"
                        @click="saveManualReference(true)"
                      >
                        <AppIcon name="plus" :size="15" />
                        Save &amp; Add Another
                      </button>
                      <button
                        type="button"
                        class="reference-collection-button primary-alt"
                        :disabled="!isManualDraftValid"
                        @click="saveManualReference()"
                      >
                        Save Reference
                      </button>
                    </div>
                  </div>
                </section>
              </template>
            </div>

            <aside class="reference-collection-summary">
              <div class="reference-collection-summary__card">
                <div class="reference-collection-summary__head">
                  <div>
                    <h3>Reference Request Summary</h3>
                    <p>Here's what will be sent.</p>
                  </div>

                  <button v-if="selectedMethod === 'manual'" type="button" class="reference-inline-link" @click="currentStep = 1">
                    Change
                  </button>
                </div>

                <div class="reference-collection-summary__provider">
                  <div>
                    <small>Collection Method</small>
                    <strong>{{ selectedMethod === 'automated' ? `Automated via ${selectedProvider}` : 'Manual' }}</strong>
                  </div>
                  <span v-if="selectedMethod === 'automated'">{{ providerBadge }}</span>
                  <span v-else class="reference-collection-summary__provider-icon">
                    <AppIcon name="userPlus" :size="14" />
                  </span>
                </div>

                <div class="reference-summary-list">
                  <div v-if="selectedMethod === 'manual'" class="reference-summary-list__row">
                    <span class="reference-summary-list__label">
                      <AppIcon name="users" :size="14" />
                      References Added
                    </span>
                    <strong>{{ manualPreparedReferences.length }} / {{ referencesRequired }}</strong>
                  </div>
                  <h4>Reference Mix</h4>
                  <div
                    v-for="item in referenceMixSummary"
                    :key="item[0]"
                    class="reference-summary-list__row"
                  >
                    <span class="reference-summary-list__label">
                      <i :class="`is-${item[2]}`" />
                      {{ item[0] }}
                    </span>
                    <strong>{{ item[1] }}</strong>
                  </div>
                </div>

                <div class="reference-summary-meta">
                  <div class="reference-summary-meta__total"><span>Total References</span><strong>{{ totalReferenceMix }}</strong></div>
                  <div><span>Questionnaire Template</span><strong>{{ questionnaireTemplate }}</strong></div>
                  <div><span>Candidate Consent</span><strong>{{ candidateConsent ? 'Required' : 'Optional' }}</strong></div>
                  <div><span>Reminder Frequency</span><strong>{{ reminderFrequency }}</strong></div>
                  <div><span>Due Date</span><strong>{{ dueDate }}</strong></div>
                  <div class="reference-summary-meta__status">
                    <span>Auto Follow-up</span>
                    <strong :class="{ 'is-enabled': autoFollowUp }">
                      <AppIcon v-if="autoFollowUp" name="checkCircle" :size="14" />
                      {{ autoFollowUp ? 'Enabled' : 'Disabled' }}
                    </strong>
                  </div>
                </div>

                <div v-if="selectedMethod === 'manual' && manualPreparedReferences.length" class="reference-summary-list">
                  <h4>Added References</h4>
                  <div
                    v-for="(reference, index) in manualPreparedReferences"
                    :key="`summary-${reference.id}`"
                    class="reference-summary-list__reference"
                  >
                    <span><b>{{ index + 1 }}</b>{{ reference.fullName }}</span>
                    <small>{{ reference.jobTitle }}<span v-if="reference.company"> at {{ reference.company }}</span></small>
                    <em>{{ reference.relationship }}</em>
                  </div>
                </div>

                <article class="reference-summary-insight">
                  <AppIcon name="sparkles" :size="15" />
                  <div>
                    <strong>AI Insight</strong>
                    <p>This setup is optimized to get high-quality feedback for this role.</p>
                    <button type="button">View details</button>
                  </div>
                </article>
              </div>
            </aside>
          </section>

          <section v-else-if="currentStep === 3 && isManualFlow" class="reference-review-layout reference-review-layout--manual">
            <div class="reference-review-main">
              <section class="reference-config-card reference-config-card--manual-review">
                <div class="reference-config-card__title reference-config-card__title--between">
                  <div>
                    <h3>Review Your Request</h3>
                    <p>
                      {{
                        manualReviewPhase === 'configure'
                          ? 'Review your references, questions, and settings before sending.'
                          : 'Please review all details below before sending the reference requests.'
                      }}
                    </p>
                  </div>

                  <button type="button" class="reference-inline-action" @click="goToManualListStage">
                    <AppIcon name="edit" :size="14" />
                    <span>{{ manualReviewPhase === 'configure' ? 'Edit Request Settings' : 'Edit All' }}</span>
                  </button>
                </div>

                <div class="reference-manual-review-list">
                  <div class="reference-manual-review-list__head">
                    <strong>References ({{ manualPreparedReferences.length }} of {{ referencesRequired }})</strong>
                  </div>

                  <article
                    v-for="reference in manualPreparedReferences"
                    :key="`review-reference-${reference.id}`"
                    class="reference-manual-review-item"
                  >
                    <div class="reference-manual-review-item__identity">
                      <span class="reference-manual-review-item__index">
                        {{ reference.fullName.charAt(0) || 'R' }}
                      </span>
                      <div>
                        <strong>{{ reference.fullName }}</strong>
                        <p>{{ reference.jobTitle }}<span v-if="reference.company"> at {{ reference.company }}</span></p>
                      </div>
                    </div>

                    <div class="reference-manual-review-item__meta">
                      <small>Relationship to candidate</small>
                      <strong>{{ reference.capacity || reference.relationship || 'Direct Manager' }}</strong>
                    </div>

                    <div class="reference-manual-review-item__actions">
                      <button type="button" class="reference-manual-stage__icon-button" @click="goToManualFormStage(reference)">
                        <AppIcon name="edit" :size="14" />
                      </button>
                      <button type="button" class="reference-manual-stage__icon-button" @click="removeManualReference(reference.id)">
                        <AppIcon name="trash" :size="14" />
                      </button>
                    </div>
                  </article>

                  <button type="button" class="reference-manual-review-list__add" @click="goToManualFormStage()">
                    <AppIcon name="plus" :size="15" />
                    <div>
                      <strong>Add Another Reference</strong>
                      <small>You can add up to {{ referencesRequired }} references for this request.</small>
                    </div>
                  </button>
                </div>

                <section class="reference-manual-review-section">
                  <div class="reference-manual-review-section__head">
                    <h4>Questionnaire &amp; Content</h4>
                    <p>This is what your references will receive.</p>
                  </div>

                  <div class="reference-manual-settings-grid">
                  <article class="reference-manual-setting-card">
                    <span><AppIcon name="document" :size="16" /></span>
                    <div>
                      <strong>Questionnaire Template</strong>
                      <small>{{ questionnaireTemplate }}</small>
                      <em>Preview Questions</em>
                    </div>
                  </article>

                  <article class="reference-manual-setting-card">
                    <span><AppIcon name="shield" :size="16" /></span>
                    <div>
                      <strong>Candidate Consent</strong>
                      <small>{{ candidateConsent ? 'Required' : 'Optional' }}</small>
                      <em>Preview Consent</em>
                    </div>
                  </article>

                  <article class="reference-manual-setting-card">
                    <span><AppIcon name="bell" :size="16" /></span>
                    <div>
                      <strong>Reminder Frequency</strong>
                      <small>{{ reminderFrequency }}</small>
                      <em>Edit Reminders</em>
                    </div>
                  </article>
                </div>
                </section>

                <article class="reference-manual-highlight">
                  <div>
                    <strong>AI-Enhanced Reference</strong>
                    <p>AI will analyze responses and provide actionable insights to help you make better hiring decisions.</p>
                  </div>
                  <span>Enabled</span>
                </article>

                <section class="reference-manual-message">
                  <div class="reference-config-card__title reference-config-card__title--between reference-config-card__title--compact">
                    <div>
                      <h3>Message to References</h3>
                      <p>This is the email your references will receive.</p>
                    </div>

                    <button type="button" class="reference-inline-link">
                      {{ manualReviewPhase === 'configure' ? 'Preview Full Message' : 'Edit Message' }}
                    </button>
                  </div>

                  <div class="reference-manual-message__preview">
                    <strong>Subject: Reference request for {{ candidateName }}</strong>
                    <p>{{ manualRequestMessage }}</p>
                  </div>
                </section>

                <div class="reference-manual-bottom-actions">
                  <button type="button" class="reference-collection-button secondary" @click="goBackFromManualReview">
                    Back
                  </button>

                  <div class="reference-manual-bottom-actions__group">
                    <button
                      v-if="manualReviewPhase === 'review'"
                      type="button"
                      class="reference-collection-button ghost"
                    >
                      Save as Draft
                    </button>

                    <button
                      type="button"
                      class="reference-collection-button primary-alt"
                      :disabled="!manualCanContinue"
                      @click="manualReviewPhase === 'configure' ? goToManualReviewPhase() : sendManualReferences()"
                    >
                      {{ manualReviewPhase === 'configure' ? 'Continue to Review' : 'Send Requests' }}
                      <AppIcon :name="manualReviewPhase === 'configure' ? 'chevronRight' : 'mail'" :size="16" />
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <aside class="reference-collection-summary">
              <div class="reference-collection-summary__card reference-collection-summary__card--manual">
                <div class="reference-collection-summary__head">
                  <div>
                    <h3>Reference Request Summary</h3>
                    <p>Here's what will be sent.</p>
                  </div>

                  <button type="button" class="reference-inline-link" @click="currentStep = 1">
                    Change
                  </button>
                </div>

                <div class="reference-collection-summary__provider">
                  <div>
                    <small>Collection Method</small>
                    <strong>Manual</strong>
                  </div>
                  <span class="reference-collection-summary__provider-icon">
                    <AppIcon name="userPlus" :size="14" />
                  </span>
                </div>

                <div class="reference-summary-meta reference-summary-meta--spacious">
                  <div><span>References Added</span><strong>{{ manualPreparedReferences.length }} / {{ referencesRequired }}</strong></div>
                  <div><span>Due Date</span><strong>{{ dueDate }}</strong></div>
                  <div><span>Reminder Frequency</span><strong>{{ reminderFrequency }}</strong></div>
                  <div class="reference-summary-meta__status">
                    <span>Auto Follow-up</span>
                    <strong :class="{ 'is-enabled': autoFollowUp }">
                      <AppIcon v-if="autoFollowUp" name="checkCircle" :size="14" />
                      {{ autoFollowUp ? 'Enabled' : 'Disabled' }}
                    </strong>
                  </div>
                  <div><span>Questionnaire Template</span><strong>{{ questionnaireTemplate }}</strong></div>
                  <div><span>Candidate Consent</span><strong>{{ candidateConsent ? 'Required' : 'Optional' }}</strong></div>
                  <div class="reference-summary-meta__status">
                    <span>AI-Enhanced Reference</span>
                    <strong class="is-enabled">
                      <AppIcon name="checkCircle" :size="14" />
                      Enabled
                    </strong>
                  </div>
                </div>

                <div class="reference-summary-list">
                  <h4>Added References</h4>
                  <div
                    v-for="(reference, index) in manualPreparedReferences"
                    :key="`manual-sidebar-${reference.id}`"
                    class="reference-summary-list__reference"
                  >
                    <span><b>{{ index + 1 }}</b>{{ reference.fullName }}</span>
                    <small>{{ reference.jobTitle }}<span v-if="reference.company"> at {{ reference.company }}</span></small>
                    <em>{{ reference.relationship || 'Manager' }}</em>
                  </div>
                </div>

                <article class="reference-summary-insight">
                  <AppIcon name="sparkles" :size="15" />
                  <div>
                    <strong>{{ manualReviewPhase === 'configure' ? 'AI will help you' : "You're ready to send!" }}</strong>
                    <p>
                      {{
                        manualReviewPhase === 'configure'
                          ? 'Once references respond, AI will analyze the feedback and provide actionable insights.'
                          : 'When you send this request, your references will receive an email invitation with the questionnaire and instructions.'
                      }}
                    </p>
                    <button type="button">{{ manualReviewPhase === 'configure' ? 'View details' : 'What happens next?' }}</button>
                  </div>
                </article>
              </div>
            </aside>
          </section>

          <section v-else-if="currentStep === 3" class="reference-review-layout">
            <div class="reference-review-main">
              <section class="reference-config-card">
                <div class="reference-config-card__title">
                  <div>
                    <h3>Review Your Request</h3>
                    <p>Please review all details before sending the reference request.</p>
                  </div>

                  <button type="button" class="reference-inline-action" @click="currentStep = 2">
                    <AppIcon name="edit" :size="14" />
                    <span>Edit Request</span>
                  </button>
                </div>

                <div class="reference-review-stats">
                  <article class="reference-review-stat">
                    <span class="reference-review-stat__icon is-pink">
                      <AppIcon name="briefcase" :size="16" />
                    </span>
                    <div>
                      <small>Reference Provider</small>
                      <strong>{{ selectedMethod === 'automated' ? selectedProvider : 'Manual Collection' }}</strong>
                      <em>{{ selectedMethod === 'automated' ? 'Automated' : 'Manual' }}</em>
                    </div>
                  </article>

                  <article class="reference-review-stat">
                    <span class="reference-review-stat__icon is-violet">
                      <AppIcon name="users" :size="16" />
                    </span>
                    <div>
                      <small>Total References</small>
                      <strong>{{ totalReferenceMix }}</strong>
                      <em>References</em>
                    </div>
                  </article>

                  <article class="reference-review-stat">
                    <span class="reference-review-stat__icon is-blue">
                      <AppIcon name="calendar" :size="16" />
                    </span>
                    <div>
                      <small>Request Due Date</small>
                      <strong>{{ dueDate }}</strong>
                      <em>In 5 days</em>
                    </div>
                  </article>

                  <article class="reference-review-stat">
                    <span class="reference-review-stat__icon is-orange">
                      <AppIcon name="bell" :size="16" />
                    </span>
                    <div>
                      <small>Reminder Frequency</small>
                      <strong>{{ reminderFrequency }}</strong>
                      <em>{{ autoFollowUp ? 'Auto follow-up enabled' : 'Manual follow-up' }}</em>
                    </div>
                  </article>
                </div>
              </section>

              <section class="reference-config-card">
                <div class="reference-config-card__title">
                  <div>
                    <h3>Reference Mix</h3>
                    <p>The types and number of references that will be requested.</p>
                  </div>
                </div>

                <div class="reference-review-mix">
                  <article
                    v-for="item in referenceMixSummary"
                    :key="item[0]"
                    class="reference-review-mix__card"
                    :class="`is-${item[2]}`"
                  >
                    <span class="reference-review-mix__icon">
                      <i :class="`is-${item[2]}`" />
                    </span>
                    <strong>{{ item[0] }}</strong>
                    <b>{{ item[1] }}</b>
                  </article>
                </div>
              </section>

              <div class="reference-review-details-grid">
                <section class="reference-config-card">
                  <div class="reference-config-card__title">
                    <div>
                      <h3>Questionnaire &amp; Settings</h3>
                    </div>
                  </div>

                  <div class="reference-review-list">
                    <div><span><AppIcon name="document" :size="14" /> Questionnaire Template</span><strong>{{ questionnaireTemplate }}</strong></div>
                    <div><span><AppIcon name="user-check" :size="14" /> Candidate Consent</span><strong>{{ candidateConsent ? 'Required' : 'Optional' }}</strong></div>
                    <div><span><AppIcon name="users" :size="14" /> Candidate adds &amp; replaces references</span><strong>{{ addCandidateToPool ? 'Allowed' : 'Disabled' }}</strong></div>
                    <div><span><AppIcon name="refresh" :size="14" /> Auto Follow-up</span><strong>{{ autoFollowUp ? 'Enabled' : 'Disabled' }}</strong></div>
                    <div><span><AppIcon name="settings" :size="14" /> Advanced Settings</span><strong>8 options enabled</strong></div>
                  </div>
                </section>

                <section class="reference-config-card">
                  <div class="reference-config-card__title">
                    <div>
                      <h3>Advanced Settings (Summary)</h3>
                    </div>

                    <button type="button" class="reference-inline-link">View all</button>
                  </div>

                  <div class="reference-review-pills">
                    <article>
                      <span class="is-pink"><AppIcon name="sparkles" :size="14" /></span>
                      <div><strong>Automation</strong><small>3 actions enabled</small></div>
                      <em>On</em>
                    </article>
                    <article>
                      <span class="is-violet"><AppIcon name="sparkles" :size="14" /></span>
                      <div><strong>AI Analysis</strong><small>4 insights enabled</small></div>
                      <em>On</em>
                    </article>
                    <article>
                      <span class="is-green"><AppIcon name="shield" :size="14" /></span>
                      <div><strong>Validation</strong><small>3 checks enabled</small></div>
                      <em>On</em>
                    </article>
                  </div>
                </section>
              </div>

              <section class="reference-config-card">
                <div class="reference-config-card__title">
                  <div>
                    <h3>What happens next?</h3>
                  </div>
                </div>

                <div class="reference-review-timeline">
                  <article>
                    <span>1</span>
                    <strong>Invitations will be sent</strong>
                    <p>Reference invitations will be sent via {{ selectedMethod === 'automated' ? selectedProvider : 'your team workflow' }}.</p>
                  </article>
                  <article>
                    <span>2</span>
                    <strong>Responses collected</strong>
                    <p>References will complete the questionnaire.</p>
                  </article>
                  <article>
                    <span>3</span>
                    <strong>AI analysis</strong>
                    <p>Responses will be analyzed and summarized.</p>
                  </article>
                  <article>
                    <span>4</span>
                    <strong>Results ready</strong>
                    <p>You'll be notified when all references are in.</p>
                  </article>
                </div>
              </section>
            </div>

            <aside class="reference-collection-summary">
              <div class="reference-collection-summary__card">
                <h3>Reference Request Summary</h3>
                <p>Here's what will be sent.</p>

                <div class="reference-collection-summary__provider">
                  <div>
                    <small>Collection Method</small>
                    <strong>{{ selectedMethod === 'automated' ? `Automated via ${selectedProvider}` : 'Manual Collection' }}</strong>
                  </div>
                  <span>{{ providerBadge }}</span>
                </div>

                <div class="reference-summary-list">
                  <h4>Reference Mix</h4>
                  <div
                    v-for="item in referenceMixSummary"
                    :key="`review-${item[0]}`"
                    class="reference-summary-list__row"
                  >
                    <span class="reference-summary-list__label">
                      <i :class="`is-${item[2]}`" />
                      {{ item[0] }}
                    </span>
                    <strong>{{ item[1] }}</strong>
                  </div>
                </div>

                <div class="reference-summary-meta">
                  <div class="reference-summary-meta__total"><span>Total References</span><strong>{{ totalReferenceMix }}</strong></div>
                  <div><span>Questionnaire Template</span><strong>{{ questionnaireTemplate }}</strong></div>
                  <div><span>Candidate Consent</span><strong>{{ candidateConsent ? 'Required' : 'Optional' }}</strong></div>
                  <div><span>Reminder Frequency</span><strong>{{ reminderFrequency }}</strong></div>
                  <div><span>Due Date</span><strong>{{ dueDate }}</strong></div>
                  <div class="reference-summary-meta__status">
                    <span>Auto Follow-up</span>
                    <strong :class="{ 'is-enabled': autoFollowUp }">
                      <AppIcon v-if="autoFollowUp" name="checkCircle" :size="14" />
                      {{ autoFollowUp ? 'Enabled' : 'Disabled' }}
                    </strong>
                  </div>
                </div>

                <article class="reference-summary-insight">
                  <AppIcon name="sparkles" :size="15" />
                  <div>
                    <strong>AI Insight</strong>
                    <p>This request is optimized to get high-quality feedback for this role.</p>
                    <button type="button">View details</button>
                  </div>
                </article>
              </div>
            </aside>
          </section>

                    <section v-else-if="currentStep === 4 && isManualFlow" class="reference-success-layout reference-success-layout--manual">
            <div class="reference-success-main">
              <section class="reference-manual-sent-hero">
                <div class="reference-manual-sent-hero__main">
                  <div class="reference-manual-sent-hero__copy">
                    <span class="reference-manual-sent-hero__badge">
                      <AppIcon name="checkCircle" :size="28" />
                    </span>
                    <div>
                      <h3>Reference requests sent!</h3>
                      <p>
                        Your reference requests have been sent to {{ manualPreparedReferences.length }} reference{{ manualPreparedReferences.length === 1 ? '' : 's' }}.
                        We'll notify you as soon as we receive responses.
                      </p>
                    </div>
                  </div>

                  <div class="reference-manual-sent-hero__art" aria-hidden="true">
                    <span class="reference-manual-sent-hero__spark is-one"></span>
                    <span class="reference-manual-sent-hero__spark is-two"></span>
                    <span class="reference-manual-sent-hero__spark is-three"></span>
                    <div class="reference-manual-sent-hero__envelope">
                      <AppIcon name="mail" :size="26" />
                      <span class="reference-manual-sent-hero__check">
                        <AppIcon name="checkCircle" :size="13" />
                      </span>
                    </div>
                  </div>
                </div>

                <div class="reference-manual-sent-stats">
                  <article>
                    <span class="is-green"><AppIcon name="mail" :size="16" /></span>
                    <div>
                      <strong>{{ manualPreparedReferences.length }}</strong>
                      <small>Invitations Sent</small>
                    </div>
                  </article>
                  <article>
                    <span class="is-violet"><AppIcon name="eye" :size="16" /></span>
                    <div>
                      <strong>0</strong>
                      <small>Opened</small>
                    </div>
                  </article>
                  <article>
                    <span class="is-orange"><AppIcon name="users" :size="16" /></span>
                    <div>
                      <strong>0</strong>
                      <small>In Progress</small>
                    </div>
                  </article>
                  <article>
                    <span class="is-mint"><AppIcon name="checkCircle" :size="16" /></span>
                    <div>
                      <strong>0</strong>
                      <small>Completed</small>
                    </div>
                  </article>
                </div>
              </section>

              <section class="reference-config-card reference-config-card--manual-success">
                <div class="reference-config-card__title">
                  <div>
                    <h3>What happens next?</h3>
                  </div>
                </div>

                <div class="reference-manual-success-flow">
                  <article>
                    <span><AppIcon name="mail" :size="15" /></span>
                    <strong>Sent</strong>
                    <p>Invitations have been sent to your reference.</p>
                  </article>
                  <article>
                    <span><AppIcon name="document" :size="15" /></span>
                    <strong>Reference opens</strong>
                    <p>They will receive an email and open the questionnaire.</p>
                  </article>
                  <article>
                    <span><AppIcon name="message" :size="15" /></span>
                    <strong>Completes questionnaire</strong>
                    <p>They will answer the questions.</p>
                  </article>
                  <article>
                    <span><AppIcon name="sparkles" :size="15" /></span>
                    <strong>AI analyzes</strong>
                    <p>We'll analyze the feedback and generate an AI summary.</p>
                  </article>
                  <article>
                    <span><AppIcon name="bell" :size="15" /></span>
                    <strong>You're notified</strong>
                    <p>You'll be notified when responses are ready.</p>
                  </article>
                </div>
              </section>

              <section class="reference-config-card reference-config-card--manual-success">
                <div class="reference-config-card__title">
                  <div>
                    <h3>Sent to ({{ manualPreparedReferences.length }})</h3>
                  </div>
                </div>

                <div class="reference-manual-sent-table">
                  <div class="reference-manual-sent-table__head">
                    <span>Reference</span>
                    <span>Relationship to Candidate</span>
                    <span>Status</span>
                    <span>Sent On</span>
                    <span></span>
                  </div>

                  <article
                    v-for="reference in manualPreparedReferences"
                    :key="'sent-' + reference.id"
                    class="reference-manual-sent-row"
                  >
                    <div class="reference-manual-sent-row__main">
                      <span>{{ reference.fullName.slice(0, 2).toUpperCase() }}</span>
                      <div>
                        <strong>{{ reference.fullName }}</strong>
                        <p>{{ reference.jobTitle }}<span v-if="reference.company"> at {{ reference.company }}</span></p>
                        <em>{{ reference.relationship || 'Manager' }}</em>
                      </div>
                    </div>
                    <small>{{ reference.capacity || reference.relationship || 'Direct Manager' }}</small>
                    <strong class="is-success">
                      <AppIcon name="checkCircle" :size="12" />
                      Sent
                    </strong>
                    <em>Just now</em>
                    <button type="button" class="reference-manual-stage__icon-button">
                      <AppIcon name="more" :size="14" />
                    </button>
                  </article>
                </div>

                <article class="reference-manual-sent-note">
                  <AppIcon name="shield" :size="14" />
                  <p>Secure &amp; Confidential: All reference data is encrypted and shared securely.</p>
                </article>
              </section>

              <div class="reference-manual-bottom-actions">
                <button type="button" class="reference-collection-button secondary" @click="backToManualReview">
                  Back to Setup
                </button>
                <button type="button" class="reference-collection-button primary-alt" @click="closeOverlay">
                  Done
                </button>
              </div>
            </div>

            <aside class="reference-collection-summary">
              <div class="reference-collection-summary__card reference-collection-summary__card--manual">
                <div class="reference-collection-summary__head">
                  <div>
                    <h3>Reference Request Summary</h3>
                    <p>Here's what will be sent.</p>
                  </div>
                </div>

                <div class="reference-collection-summary__provider reference-collection-summary__provider--manual-success">
                  <div>
                    <small>Collection Method</small>
                    <strong>Manual</strong>
                  </div>
                  <div class="reference-collection-summary__provider-actions">
                    <span class="reference-collection-summary__provider-icon">
                      <AppIcon name="userPlus" :size="14" />
                    </span>
                    <button type="button" class="reference-inline-link" @click="currentStep = 1">
                      Change
                    </button>
                  </div>
                </div>

                <div class="reference-summary-meta reference-summary-meta--spacious">
                  <div><span>References Added</span><strong>{{ manualPreparedReferences.length }} / {{ referencesRequired }}</strong></div>
                  <div><span>Due Date</span><strong>{{ dueDate }}</strong></div>
                  <div><span>Reminder Frequency</span><strong>{{ reminderFrequency }}</strong></div>
                  <div class="reference-summary-meta__status">
                    <span>Auto Follow-up</span>
                    <strong :class="{ 'is-enabled': autoFollowUp }">
                      <AppIcon v-if="autoFollowUp" name="checkCircle" :size="14" />
                      {{ autoFollowUp ? 'Enabled' : 'Disabled' }}
                    </strong>
                  </div>
                  <div><span>Questionnaire</span><strong>{{ questionnaireTemplate }}</strong></div>
                  <div><span>Candidate Consent</span><strong>{{ candidateConsent ? 'Required' : 'Optional' }}</strong></div>
                  <div class="reference-summary-meta__status">
                    <span>AI-Enhanced Reference</span>
                    <strong class="is-enabled">
                      <AppIcon name="checkCircle" :size="14" />
                      Enabled
                    </strong>
                  </div>
                  <div><span>Message to References</span><strong>Custom message</strong></div>
                </div>

                <div class="reference-summary-list">
                  <h4>Added References</h4>
                  <div
                    v-for="(reference, index) in manualPreparedReferences"
                    :key="'manual-sent-sidebar-' + reference.id"
                    class="reference-summary-list__reference"
                  >
                    <span><b>{{ index + 1 }}</b>{{ reference.fullName }}</span>
                    <small>{{ reference.jobTitle }}<span v-if="reference.company"> at {{ reference.company }}</span></small>
                    <em>{{ reference.relationship || 'Manager' }}</em>
                  </div>
                </div>

                <article class="reference-summary-insight reference-summary-insight--checklist">
                  <AppIcon name="sparkles" :size="15" />
                  <div>
                    <strong>Automation Enabled</strong>
                    <ul>
                      <li>Reminders every 3 days</li>
                      <li>Auto follow-up enabled</li>
                      <li>You'll be notified when responses are received</li>
                      <li>AI summary will be generated automatically</li>
                    </ul>
                  </div>
                </article>
              </div>
            </aside>
          </section>
          <section v-else class="reference-success-layout">
            <div class="reference-success-main">
              <section class="reference-success-hero">
                <div class="reference-success-hero__copy">
                  <span class="reference-success-hero__badge">
                    <AppIcon name="checkCircle" :size="28" />
                  </span>
                  <div>
                    <p>
                      {{ requestsCreated }} reference invitation{{ requestsCreated === 1 ? '' : 's' }}
                      have been sent successfully via {{ selectedMethod === 'automated' ? selectedProvider : 'your hiring workflow' }}.
                    </p>
                    <strong>We'll notify you as soon as responses start coming in.</strong>
                  </div>
                </div>

                <div class="reference-success-stats">
                  <article>
                    <span class="is-pink"><AppIcon name="users" :size="16" /></span>
                    <div>
                      <strong>{{ requestsCreated }}</strong>
                      <small>Requests Created</small>
                    </div>
                  </article>
                  <article>
                    <span class="is-violet"><AppIcon name="mail" :size="16" /></span>
                    <div>
                      <strong>{{ requestsCreated }}</strong>
                      <small>Invitations Sent</small>
                    </div>
                  </article>
                  <article>
                    <span class="is-green"><AppIcon name="message" :size="16" /></span>
                    <div>
                      <strong>0</strong>
                      <small>Responses Received</small>
                    </div>
                  </article>
                </div>
              </section>

              <div class="reference-success-grid">
                <section class="reference-config-card">
                  <div class="reference-config-card__title">
                    <div>
                      <h3>What happens next?</h3>
                    </div>
                  </div>

                  <div class="reference-success-timeline">
                    <article v-for="item in successTimeline" :key="item[1]">
                      <span :class="`is-${item[3]}`">
                        <AppIcon :name="item[0]" :size="14" />
                      </span>
                      <div>
                        <strong>{{ item[1] }}</strong>
                        <p>{{ item[2] }}</p>
                      </div>
                    </article>
                  </div>
                </section>

                <section class="reference-config-card">
                  <div class="reference-config-card__title">
                    <div>
                      <h3>Live Invitation Status</h3>
                      <p>Track your invitations in real time.</p>
                    </div>

                    <strong class="reference-success-state">Sent</strong>
                  </div>

                  <div class="reference-success-status-list">
                    <article v-for="group in responseGroups" :key="group.title">
                      <div class="reference-success-status-list__main">
                        <span class="reference-success-status-list__icon" :class="`is-${group.tone}`">
                          <AppIcon name="users" :size="15" />
                        </span>
                        <div>
                          <strong>{{ group.title }}</strong>
                          <small>{{ group.count }} reference{{ group.count === 1 ? '' : 's' }}</small>
                        </div>
                      </div>

                      <div class="reference-success-status-list__meta">
                        <div v-if="group.people.length" class="reference-success-avatars">
                          <span v-for="person in group.people" :key="person">{{ person }}</span>
                        </div>
                        <strong :class="`is-${group.tone}`">{{ group.status }}</strong>
                      </div>
                    </article>
                  </div>
                </section>
              </div>

              <section class="reference-success-footnote">
                <div>
                  <strong>Automation is on</strong>
                  <p>We'll handle the follow-ups and keep everything moving.</p>
                </div>

                <div class="reference-success-chips">
                  <span><AppIcon name="refresh" :size="13" /> Reminders {{ reminderFrequency }}</span>
                  <span><AppIcon name="bell" :size="13" /> Hiring manager notified</span>
                  <span><AppIcon name="sparkles" :size="13" /> AI analysis enabled</span>
                  <span><AppIcon name="checkCircle" :size="13" /> Auto-move to next stage</span>
                </div>
              </section>
            </div>

            <aside class="reference-collection-summary">
              <div class="reference-collection-summary__card">
                <h3>Reference Request Summary</h3>
                <p>Here's what will be sent.</p>

                <div class="reference-collection-summary__provider">
                  <div>
                    <small>Method</small>
                    <strong>{{ selectedMethod === 'automated' ? `Automated via ${selectedProvider}` : 'Manual Collection' }}</strong>
                  </div>
                  <span>{{ providerBadge }}</span>
                </div>

                <div class="reference-summary-list">
                  <h4>Reference Mix</h4>
                  <div
                    v-for="item in referenceMixSummary"
                    :key="`success-${item[0]}`"
                    class="reference-summary-list__row"
                  >
                    <span class="reference-summary-list__label">
                      <i :class="`is-${item[2]}`" />
                      {{ item[0] }}
                    </span>
                    <strong>{{ item[1] }}</strong>
                  </div>
                </div>

                <div class="reference-summary-meta">
                  <div class="reference-summary-meta__total"><span>Total References</span><strong>{{ totalReferenceMix }}</strong></div>
                  <div><span>Questionnaire Template</span><strong>{{ questionnaireTemplate }}</strong></div>
                  <div><span>Candidate Consent</span><strong>{{ candidateConsent ? 'Required' : 'Optional' }}</strong></div>
                  <div><span>Reminder Frequency</span><strong>{{ reminderFrequency }}</strong></div>
                  <div><span>Due Date</span><strong>{{ dueDate }}</strong></div>
                  <div class="reference-summary-meta__status">
                    <span>Auto Follow-up</span>
                    <strong :class="{ 'is-enabled': autoFollowUp }">
                      <AppIcon v-if="autoFollowUp" name="checkCircle" :size="14" />
                      {{ autoFollowUp ? 'Enabled' : 'Disabled' }}
                    </strong>
                  </div>
                </div>

                <article class="reference-summary-insight">
                  <AppIcon name="sparkles" :size="15" />
                  <div>
                    <strong>View live progress</strong>
                    <p>See responses in real time, send reminders and review feedback as it comes in.</p>
                    <button type="button" @click="handlePrimaryAction">Go to Reference Tracking</button>
                  </div>
                </article>
              </div>
            </aside>
          </section>
        </div>

        <footer v-if="showModalFooter" class="reference-collection-modal__foot">
          <button
            type="button"
            class="reference-collection-button secondary"
            @click="handleSecondaryAction"
          >
            {{ secondaryActionLabel }}
          </button>
          <button
            type="button"
            class="reference-collection-button primary"
            :class="{ 'is-disabled': isPrimaryActionDisabled }"
            :disabled="isPrimaryActionDisabled"
            @click="handlePrimaryAction"
          >
            {{ primaryActionLabel }}
            <AppIcon :name="primaryActionIcon" :size="16" />
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.reference-collection-overlay {
  position: fixed;
  inset: 0;
  z-index: 2200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(10px);
}

.reference-collection-modal {
  width: min(1240px, calc(100vw - 40px));
  max-height: calc(100vh - 36px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #dfe7fb;
  border-radius: 28px;
  box-shadow: 0 34px 80px rgba(15, 23, 42, 0.24);
  overflow: hidden;
}

.reference-collection-modal__head,
.reference-collection-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid #e8eefb;
}

.reference-collection-modal__foot {
  border-top: 1px solid #e8eefb;
  border-bottom: 0;
}

.reference-collection-modal__title {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.reference-collection-modal__title-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f15bb5;
  background: #fdf0f8;
}

.reference-collection-modal__title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #1f2a44;
}

.reference-collection-modal__title p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #7282a2;
}

.reference-collection-modal__head button {
  width: 40px;
  height: 40px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  background: #fff;
  color: #8ea0c0;
  cursor: pointer;
}

.reference-collection-modal__body {
  flex: 1;
  overflow: auto;
  padding: 18px 22px;
  background:
    radial-gradient(circle at top left, rgba(241, 91, 181, 0.08), transparent 20%),
    radial-gradient(circle at top right, rgba(107, 92, 255, 0.08), transparent 22%),
    linear-gradient(180deg, #fff 0%, #fbfdff 100%);
}

.reference-collection-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 22px;
}

.reference-collection-steps article {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #92a0bd;
}

.reference-collection-steps article span {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eef2fb;
  font-size: 12px;
  font-weight: 800;
}

.reference-collection-steps article strong {
  font-size: 13px;
}

.reference-collection-steps article.is-active {
  color: #f15bb5;
}

.reference-collection-steps article.is-complete {
  color: #5b6c8d;
}

.reference-collection-steps article.is-complete span {
  color: #fff;
  background: linear-gradient(135deg, #ff5ca8 0%, #f472b6 100%);
}

.reference-collection-steps article.is-active span {
  color: #fff;
  background: linear-gradient(135deg, #ff5ca8 0%, #f472b6 100%);
}

.reference-collection-steps i {
  width: clamp(40px, 6vw, 72px);
  height: 1px;
  flex: none;
  background: #dbe4fb;
}

.reference-collection-panel {
  border: 1px solid #e1e9fb;
  border-radius: 24px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.06);
}

.reference-collection-panel__hero {
  margin-bottom: 16px;
  text-align: center;
}

.reference-collection-panel__hero h3,
.reference-method-config__head h4,
.reference-timing__head h4 {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-collection-panel__hero p,
.reference-method-config__head p,
.reference-timing__head p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #7282a2;
}

.reference-collection-method-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  align-items: stretch;
}

.reference-method-column {
  display: flex;
}

.reference-method-card {
  width: 100%;
  min-height: 192px;
  height: 100%;
  padding: 16px;
  border: 1px solid #dfe7fb;
  border-radius: 18px;
  background: #fff;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.reference-method-card.is-selected {
  border-color: rgba(241, 91, 181, 0.55);
  box-shadow: 0 18px 32px rgba(241, 91, 181, 0.1);
  transform: translateY(-1px);
}

.reference-method-card__radio,
.reference-timing-card__radio {
  flex: none;
  width: 20px;
  height: 20px;
  border: 1.5px solid #cfd8ee;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.reference-method-card__radio span,
.reference-timing-card__radio span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff5ca8 0%, #f472b6 100%);
}

.reference-method-card__icon {
  flex: none;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b5cff;
  background: #f3f2ff;
}

.reference-method-card__copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.reference-method-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.reference-method-card__head strong {
  font-size: 18px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-method-card__head small {
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  color: #f15bb5;
  background: #fff1f8;
}

.reference-method-card__copy > p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #5d6e8d;
}

.reference-method-card ul {
  padding: 0;
  margin: 12px 0 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.reference-method-card li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: #4a5d7e;
}

.reference-method-card li :deep(svg) {
  color: #f15bb5;
}

.reference-method-card__providers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 12px;
  margin-top: auto;
  border-top: 1px solid #edf2fd;
}

.reference-method-card__providers span {
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  color: #5d6e8d;
  background: #f8fbff;
}

.reference-method-expand {
  margin-top: 14px;
  border: 1px solid #e1e9fb;
  border-radius: 20px;
  padding: 16px;
  background: #fbfdff;
}

.reference-method-expand__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.reference-method-expand__head small {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #93a2bf;
}

.reference-method-expand__head h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-method-expand__head > span {
  max-width: 420px;
  font-size: 13px;
  line-height: 1.55;
  color: #6f809f;
}

.reference-method-config__fields {
  display: grid;
  gap: 14px;
}

.reference-method-config__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) 260px;
  gap: 14px;
}

.reference-method-config__card,
.reference-method-config__aside {
  padding: 14px;
  border: 1px solid #e7ecfb;
  border-radius: 16px;
  background: #fff;
}

.reference-method-config__aside strong {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: #1f2a44;
}

.reference-method-config__aside ul {
  margin: 0;
  padding-left: 18px;
  color: #667899;
  font-size: 12px;
  line-height: 1.7;
}

.reference-method-config__stack {
  display: grid;
  gap: 12px;
}

.reference-method-config__manual-label {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 800;
  color: #6b5cff;
}

.reference-method-config__fields.two-col {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.reference-method-config label {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.reference-method-config label span {
  font-size: 12px;
  font-weight: 700;
  color: #8c9cbb;
}

.reference-method-config input,
.reference-method-config select {
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  background: #fff;
  font-size: 13px;
  color: #2b3753;
  outline: none;
}

.toggle-field button {
  width: 54px;
  height: 30px;
  padding: 3px;
  border: 0;
  border-radius: 999px;
  background: #e9eefb;
  cursor: pointer;
}

.toggle-field button span {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.14);
  transition: transform 0.2s ease;
}

.toggle-field button.active {
  background: linear-gradient(135deg, #ff5ca8 0%, #f472b6 100%);
}

.toggle-field button.active span {
  transform: translateX(24px);
}

.reference-method-config__manual-card + .reference-method-config__manual-card {
  margin-top: 14px;
}

.reference-method-config__add {
  margin-top: 14px;
  width: 100%;
  min-height: 46px;
  border: 1px dashed rgba(241, 91, 181, 0.45);
  border-radius: 14px;
  background: #fff8fc;
  color: #f15bb5;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.reference-method-config__add small {
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(241, 91, 181, 0.12);
}

.reference-manual-empty {
  padding: 20px;
  border: 1px dashed #d8e3fb;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff 0%, #fbfdff 100%);
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 8px;
}

.reference-manual-empty__icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f2ff;
  color: #6b5cff;
}

.reference-manual-empty strong {
  font-size: 16px;
  color: #1f2a44;
}

.reference-manual-empty p {
  max-width: 420px;
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: #6f809f;
}

.reference-ai-recommendation {
  margin-top: 16px;
  padding: 14px 16px;
  border: 1px solid #e2e8ff;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(107, 92, 255, 0.06) 0%, rgba(241, 91, 181, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.reference-ai-recommendation__copy {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reference-ai-recommendation__copy :deep(svg) {
  color: #6b5cff;
}

.reference-ai-recommendation__copy strong {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #6b5cff;
}

.reference-ai-recommendation__copy p {
  margin: 3px 0 0;
  font-size: 12px;
  color: #607292;
}

.reference-ai-recommendation__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reference-ai-recommendation__chips span {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #5b55ff;
  background: rgba(107, 92, 255, 0.09);
}

.reference-ai-recommendation button {
  flex: none;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  background: #fff;
  color: #6b5cff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.reference-timing {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #edf2fd;
}

.reference-timing__grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.reference-timing-card {
  min-height: 88px;
  padding: 14px;
  border: 1px solid #dfe7fb;
  border-radius: 18px;
  background: #fff;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  cursor: pointer;
}

.reference-timing-card.is-selected {
  border-color: rgba(241, 91, 181, 0.52);
  background: #fff6fb;
}

.reference-timing-card__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b5cff;
  background: #f3f2ff;
}

.reference-timing-card strong {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #1f2a44;
}

.reference-timing-card p {
  margin: 5px 0 0;
  font-size: 11px;
  line-height: 1.55;
  color: #6f809f;
}

.reference-collection-configure {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) 320px;
  gap: 18px;
}

.reference-review-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) 320px;
  gap: 18px;
}

.reference-review-main {
  display: grid;
  gap: 16px;
}

.reference-collection-configure__main {
  display: grid;
  gap: 16px;
}

.reference-collection-summary__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.reference-config-card,
.reference-collection-summary__card {
  padding: 18px;
  border: 1px solid #e1e9fb;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
}

.reference-config-card__title {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.reference-config-card__title > span {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff5ca8 0%, #f472b6 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.reference-config-card__title > span.is-plain {
  width: 42px;
  height: 42px;
  border-radius: 14px;
}

.reference-config-card__title h3,
.reference-collection-summary__card h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-config-card__title p,
.reference-collection-summary__card > p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #7282a2;
}

.reference-collection-summary__head p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #7282a2;
}

.reference-config-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.reference-config-field span {
  font-size: 12px;
  font-weight: 700;
  color: #8c9cbb;
}

.reference-config-field input,
.reference-config-field select {
  width: 100%;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  background: #fff;
  font-size: 13px;
  color: #2b3753;
  outline: none;
}

.reference-config-field input::placeholder,
.reference-config-field textarea::placeholder {
  color: #9aa8c4;
}

.reference-config-field input:focus,
.reference-config-field select:focus,
.reference-config-field textarea:focus {
  border-color: rgba(241, 91, 181, 0.42);
  box-shadow: 0 0 0 4px rgba(241, 91, 181, 0.12);
}

.reference-config-card--manual-form {
  display: grid;
  gap: 22px;
}

.reference-config-card__title--manual {
  align-items: flex-start;
}

.reference-back-link {
  margin-bottom: 8px;
}

.reference-required-note {
  font-size: 13px;
  font-weight: 800;
  color: #1f2a44;
  white-space: nowrap;
}

.reference-manual-section {
  display: grid;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid #eef2fb;
}

.reference-manual-section:first-of-type {
  padding-top: 0;
  border-top: 0;
}

.reference-manual-section h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-manual-section p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #7282a2;
}

.reference-method-config__fields.three-col {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.reference-config-field--textarea textarea {
  width: 100%;
  min-height: 124px;
  padding: 13px 14px;
  border: 1px solid #dbe4fb;
  border-radius: 14px;
  background: #fff;
  font: inherit;
  line-height: 1.6;
  color: #2b3753;
  resize: vertical;
  outline: none;
}

.reference-config-field--textarea small {
  align-self: flex-end;
  font-size: 12px;
  font-weight: 700;
  color: #9aa8c4;
}

.reference-request-check--inline {
  margin-top: -2px;
}

.reference-manual-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-top: 4px;
}

.reference-manual-actions__main {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.reference-collection-button.ghost {
  color: #6b5cff;
  background: #fff;
  border: 1px solid #dbe4fb;
  box-shadow: none;
}

.reference-collection-button.ghost:hover:not(:disabled) {
  border-color: #cdd8f7;
  background: #f8faff;
}

.reference-collection-button.primary-alt {
  color: #fff;
  background: linear-gradient(135deg, #ff5ca8 0%, #a855f7 100%);
  box-shadow: 0 18px 32px rgba(241, 91, 181, 0.22);
}

.reference-collection-button.primary-alt:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 22px 36px rgba(241, 91, 181, 0.26);
}

.reference-config-note {
  margin-top: 12px;
  padding: 12px 14px;
  border: 1px solid #e8ecff;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(107, 92, 255, 0.05) 0%, rgba(244, 114, 182, 0.04) 100%);
  display: flex;
  align-items: center;
  gap: 10px;
}

.reference-config-note :deep(svg) {
  color: #6b5cff;
}

.reference-config-note p {
  flex: 1;
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #607292;
}

.reference-config-note button {
  flex: none;
  border: 0;
  background: transparent;
  color: #6b5cff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.reference-inline-action,
.reference-inline-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  background: #fff;
  color: #6b5cff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.reference-inline-link {
  min-height: auto;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.reference-inline-action--compact {
  min-height: 40px;
  padding: 0 14px;
  border-color: #d7dfff;
  box-shadow: 0 8px 18px rgba(107, 92, 255, 0.08);
}

.reference-manual-stage {
  display: grid;
  gap: 14px;
}

.reference-manual-success {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid #e3f4e9;
  border-radius: 18px;
  background: linear-gradient(135deg, #f5fff8 0%, #ffffff 100%);
}

.reference-manual-success__head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.reference-manual-success__icon {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
  background: #eafaf0;
  flex: none;
}

.reference-manual-success__head strong {
  display: block;
  font-size: 16px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-manual-success__head p {
  margin: 4px 0 0;
  max-width: 560px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.reference-manual-stage__head h4 {
  margin: 0;
  font-size: 15px;
  color: #22314e;
}

.reference-manual-stage__empty {
  min-height: 240px;
  padding: 24px;
  border: 1px solid #e7ecfb;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff 0%, #fbfdff 100%);
  display: grid;
  align-content: center;
  justify-items: center;
  text-align: center;
  gap: 10px;
}

.reference-manual-stage__empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f2ff;
  color: #6b5cff;
}

.reference-manual-stage__empty strong {
  font-size: 24px;
  color: #1f2a44;
}

.reference-manual-stage__empty p {
  max-width: 420px;
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #7484a2;
}

.reference-manual-stage__empty-button {
  min-height: 42px;
  margin-top: 4px;
  padding: 0 18px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #6b5cff 0%, #5b55ff 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.reference-manual-stage__list {
  display: grid;
  gap: 14px;
}

.reference-manual-stage__card {
  padding: 16px;
  border: 1px solid #e7ecfb;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
}

.reference-manual-stage__card--detailed {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
}

.reference-manual-stage__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.reference-manual-stage__card-head strong {
  font-size: 14px;
  color: #22314e;
}

.reference-manual-stage__card-head p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #7282a2;
}

.reference-manual-stage__card-index {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f2ff;
  color: #6b5cff;
  font-size: 13px;
  font-weight: 900;
}

.reference-manual-stage__card-copy strong {
  display: block;
  font-size: 14px;
  color: #22314e;
}

.reference-manual-stage__card-copy p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #7282a2;
}

.reference-manual-stage__card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reference-manual-stage__pill {
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff1f8;
  color: #f15bb5;
  font-size: 11px;
  font-weight: 800;
}

.reference-manual-stage__icon-button {
  width: 34px;
  height: 34px;
  border: 1px solid #e3eafc;
  border-radius: 12px;
  background: #fff;
  color: #7a8aa8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.reference-manual-stage__icon-button:hover {
  background: #f8faff;
}

.reference-manual-summary-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #e7ecfb;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.reference-manual-tip {
  padding: 14px 16px;
  border: 1px solid #ece7ff;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(107, 92, 255, 0.06) 0%, rgba(244, 114, 182, 0.04) 100%);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.reference-manual-tip :deep(svg) {
  color: #6b5cff;
}

.reference-manual-tip strong {
  display: block;
  font-size: 13px;
  color: #31415f;
}

.reference-manual-tip p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #7282a2;
}

.reference-manual-mix-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.reference-manual-mix-card {
  padding: 16px;
  border: 1px solid #e7ecfb;
  border-radius: 16px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.reference-manual-mix-card--with-icon {
  align-items: flex-start;
}

.reference-manual-mix-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  background: rgba(255, 255, 255, 0.78);
}

.reference-manual-mix-card.is-pink {
  background: #fff8fc;
  border-color: #f9d7e8;
}

.reference-manual-mix-card.is-pink .reference-manual-mix-card__icon {
  color: #f15bb5;
}

.reference-manual-mix-card.is-violet {
  background: #f8f6ff;
  border-color: #e4dcff;
}

.reference-manual-mix-card.is-violet .reference-manual-mix-card__icon {
  color: #6b5cff;
}

.reference-manual-mix-card.is-orange {
  background: #fff8f0;
  border-color: #ffe0bf;
}

.reference-manual-mix-card.is-orange .reference-manual-mix-card__icon {
  color: #fb923c;
}

.reference-manual-mix-card.is-green {
  background: #f4fdf7;
  border-color: #d5f3df;
}

.reference-manual-mix-card.is-green .reference-manual-mix-card__icon {
  color: #22c55e;
}

.reference-manual-mix-card__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex: none;
}

.reference-manual-mix-card__dot.is-pink {
  background: #f472b6;
}

.reference-manual-mix-card__dot.is-violet {
  background: #6b5cff;
}

.reference-manual-mix-card__dot.is-orange {
  background: #fb923c;
}

.reference-manual-mix-card__dot.is-green {
  background: #22c55e;
}

.reference-manual-mix-card strong {
  display: block;
  font-size: 13px;
  color: #22314e;
}

.reference-manual-mix-card small {
  display: block;
  margin-top: 4px;
  font-size: 20px;
  font-weight: 900;
  color: #20304c;
}

.reference-manual-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-top: 2px;
}

.reference-summary-list__reference {
  display: grid;
  gap: 3px;
  padding: 10px 0;
  border-top: 1px solid #edf2fc;
}

.reference-summary-list__reference:first-of-type {
  padding-top: 0;
  border-top: 0;
}

.reference-summary-list__reference span {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  color: #1f2a44;
}

.reference-summary-list__reference b {
  width: 20px;
  height: 20px;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f2ff;
  color: #6b5cff;
  font-size: 11px;
  font-weight: 900;
  flex: none;
}

.reference-summary-list__reference small {
  font-size: 12px;
  line-height: 1.5;
  color: #7282a2;
}

.reference-summary-list__reference em {
  margin-top: 6px;
  width: fit-content;
  padding: 5px 9px;
  border-radius: 999px;
  background: #fff1f8;
  color: #f15bb5;
  font-size: 10px;
  font-style: normal;
  font-weight: 800;
}

.reference-collection-summary__provider-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff1f8;
  color: #f15bb5;
}

.reference-review-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.reference-review-stat {
  padding: 14px;
  border: 1px solid #e7ecfb;
  border-radius: 16px;
  background: #fff;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.reference-review-stat__icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.reference-review-stat__icon.is-pink {
  color: #f15bb5;
  background: #fff2f8;
}

.reference-review-stat__icon.is-violet {
  color: #6b5cff;
  background: #f3f2ff;
}

.reference-review-stat__icon.is-blue {
  color: #4f7cff;
  background: #eef4ff;
}

.reference-review-stat__icon.is-orange {
  color: #f97316;
  background: #fff2e8;
}

.reference-review-stat small {
  display: block;
  font-size: 11px;
  color: #8ea0c0;
}

.reference-review-stat strong {
  display: block;
  margin-top: 5px;
  font-size: 20px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-review-stat em {
  display: block;
  margin-top: 4px;
  font-style: normal;
  font-size: 11px;
  color: #6f809f;
}

.reference-review-mix {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.reference-review-mix__card {
  padding: 13px 14px;
  border: 1px solid #e7ecfb;
  border-radius: 14px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.reference-review-mix__card.is-pink {
  background: #fff8fc;
  border-color: #f9d7e8;
}

.reference-review-mix__card.is-violet {
  background: #f8f6ff;
  border-color: #e4dcff;
}

.reference-review-mix__card.is-orange {
  background: #fff8f0;
  border-color: #ffe0bf;
}

.reference-review-mix__card.is-green {
  background: #f4fdf7;
  border-color: #d5f3df;
}

.reference-review-mix__icon {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.reference-review-mix__icon i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
}

.reference-review-mix__icon i.is-pink {
  background: #f472b6;
}

.reference-review-mix__icon i.is-violet {
  background: #6b5cff;
}

.reference-review-mix__icon i.is-orange {
  background: #fb923c;
}

.reference-review-mix__icon i.is-green {
  background: #22c55e;
}

.reference-review-mix__card strong {
  flex: 1;
  font-size: 13px;
  font-weight: 800;
  color: #1f2a44;
}

.reference-review-mix__card b {
  font-size: 16px;
  color: #1f2a44;
}

.reference-review-details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.reference-review-list {
  display: grid;
  gap: 10px;
}

.reference-review-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #edf2fd;
}

.reference-review-list div:last-child {
  border-bottom: 0;
}

.reference-review-list span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #637492;
}

.reference-review-list span :deep(svg) {
  color: #8ea0c0;
}

.reference-review-list strong {
  font-size: 13px;
  font-weight: 800;
  color: #20304c;
}

.reference-review-pills {
  display: grid;
  gap: 10px;
}

.reference-review-pills article {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #edf2fd;
  border-radius: 14px;
  background: #fff;
}

.reference-review-pills article > span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.reference-review-layout--manual {
  align-items: stretch;
}

.reference-config-card--manual-review {
  display: grid;
  gap: 18px;
}

.reference-config-card__title--between {
  justify-content: space-between;
}

.reference-config-card__title--compact {
  margin-bottom: 0;
}

.reference-manual-review-list {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #e9eefc;
  border-radius: 18px;
  background: #fff;
}

.reference-manual-review-list__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.reference-manual-review-list__head strong {
  font-size: 14px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-manual-review-list__add {
  width: 100%;
  padding: 16px 18px;
  border: 1px dashed #d8cdfd;
  border-radius: 16px;
  background: #fdfbff;
  color: #6b5cff;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  cursor: pointer;
}

.reference-manual-review-list__add strong {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #6b5cff;
}

.reference-manual-review-list__add small {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  color: #8a97b4;
}

.reference-manual-review-item {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(180px, 0.9fr) auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border: 1px solid #e7ecfb;
  border-radius: 16px;
  background: #fff;
}

.reference-manual-review-item__identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.reference-manual-review-item__identity strong,
.reference-manual-review-item__meta strong {
  display: block;
  font-size: 14px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-manual-review-item__identity p,
.reference-manual-review-item__meta small {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: #7282a2;
}

.reference-manual-review-item__index {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f2ff;
  color: #6b5cff;
  font-size: 13px;
  font-weight: 900;
}

.reference-manual-review-item__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.reference-manual-review-section {
  display: grid;
  gap: 14px;
}

.reference-manual-review-section__head h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-manual-review-section__head p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #7282a2;
}

.reference-manual-settings-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.reference-manual-setting-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e7ecfb;
  border-radius: 16px;
  background: #fff;
}

.reference-manual-setting-card > span {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b5cff;
  background: #f3f2ff;
  flex: none;
}

.reference-manual-setting-card strong {
  display: block;
  font-size: 14px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-manual-setting-card small,
.reference-manual-setting-card em {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.55;
  color: #7282a2;
  font-style: normal;
}

.reference-manual-highlight {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid #ece7ff;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(107, 92, 255, 0.06) 0%, rgba(244, 114, 182, 0.04) 100%);
}

.reference-manual-highlight strong {
  display: block;
  font-size: 14px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-manual-highlight p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #7282a2;
}

.reference-manual-highlight > span {
  padding: 6px 12px;
  border-radius: 999px;
  background: #e8f9ee;
  color: #16a34a;
  font-size: 11px;
  font-weight: 800;
  flex: none;
}

.reference-manual-message {
  display: grid;
  gap: 14px;
}

.reference-manual-message__preview {
  padding: 16px;
  border: 1px solid #e7ecfb;
  border-radius: 16px;
  background: #fff;
}

.reference-manual-message__preview strong {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #22314e;
}

.reference-manual-message__preview p {
  margin: 10px 0 0;
  white-space: pre-line;
  font-size: 12px;
  line-height: 1.8;
  color: #7282a2;
}

.reference-manual-bottom-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.reference-manual-bottom-actions__group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reference-collection-summary__card--manual {
  display: grid;
  gap: 16px;
}

.reference-summary-meta--spacious {
  gap: 0;
}

.reference-summary-meta--spacious div {
  padding: 12px 0;
  border-top: 1px solid #edf2fc;
}

.reference-summary-meta--spacious div:first-child {
  border-top: 0;
  padding-top: 0;
}

.reference-manual-sent-hero {
  display: grid;
  gap: 20px;
  padding: 24px;
  border: 1px solid #dff3e6;
  border-radius: 24px;
  background: linear-gradient(135deg, #f3fff8 0%, #ffffff 100%);
}

.reference-manual-sent-hero__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.reference-manual-sent-hero__copy {
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 1;
}

.reference-manual-sent-hero__badge {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #e8f9ee;
  flex: none;
}

.reference-manual-sent-hero__copy h3 {
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-manual-sent-hero__copy p {
  margin: 10px 0 0;
  max-width: 640px;
  font-size: 14px;
  line-height: 1.7;
  color: #5f718f;
}

.reference-manual-sent-hero__art {
  position: relative;
  width: 160px;
  min-height: 116px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reference-manual-sent-hero__spark {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #e7f9ee 0%, #c7f3d9 100%);
}

.reference-manual-sent-hero__spark.is-one {
  top: 14px;
  right: 28px;
}

.reference-manual-sent-hero__spark.is-two {
  bottom: 20px;
  right: 12px;
}

.reference-manual-sent-hero__spark.is-three {
  top: 24px;
  left: 26px;
}

.reference-manual-sent-hero__envelope {
  position: relative;
  width: 92px;
  height: 74px;
  border: 1px solid #e5eefc;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8a80ff;
  background: linear-gradient(180deg, #f9fbff 0%, #eef3ff 100%);
  box-shadow: 0 18px 36px rgba(107, 92, 255, 0.12);
}

.reference-manual-sent-hero__check {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: #fff;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
}

.reference-manual-sent-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.reference-manual-sent-stats article {
  padding: 16px;
  border: 1px solid #e7ecfb;
  border-radius: 16px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.reference-manual-sent-stats article > span {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.reference-manual-sent-stats article > span.is-green {
  color: #16a34a;
  background: #eefbf2;
}

.reference-manual-sent-stats article > span.is-violet {
  color: #6b5cff;
  background: #f3f2ff;
}

.reference-manual-sent-stats article > span.is-orange {
  color: #fb923c;
  background: #fff4ea;
}

.reference-manual-sent-stats article > span.is-mint {
  color: #10b981;
  background: #ecfdf5;
}

.reference-manual-sent-stats strong {
  display: block;
  font-size: 30px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-manual-sent-stats small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #7282a2;
}

.reference-manual-success-flow {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
}

.reference-manual-success-flow article {
  position: relative;
  padding-top: 6px;
}

.reference-manual-success-flow article:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 26px;
  left: calc(100% - 10px);
  width: calc(100% - 20px);
  border-top: 2px dashed #dbe4fb;
}

.reference-manual-success-flow article span {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b5cff;
  background: #f3f2ff;
  border: 1px solid #e5e9ff;
}

.reference-manual-success-flow article strong {
  display: block;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 800;
  color: #1f2a44;
}

.reference-manual-success-flow article p {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: #7282a2;
}

.reference-manual-sent-table {
  display: grid;
  gap: 10px;
}

.reference-manual-sent-table__head {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(160px, 0.9fr) auto auto auto;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf2fd;
}

.reference-manual-sent-table__head span {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3bf;
}

.reference-manual-sent-row {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(160px, 0.9fr) auto auto auto;
  gap: 16px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #edf2fd;
}

.reference-manual-sent-row:last-child {
  border-bottom: 0;
}

.reference-manual-sent-row__main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.reference-manual-sent-row__main span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff1f8;
  color: #f15bb5;
  font-size: 12px;
  font-weight: 900;
  flex: none;
}

.reference-manual-sent-row__main strong {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #1f2a44;
}

.reference-manual-sent-row__main p,
.reference-manual-sent-row small,
.reference-manual-sent-row em {
  margin: 4px 0 0;
  font-size: 12px;
  color: #7282a2;
  font-style: normal;
}

.reference-manual-sent-row > strong.is-success {
  justify-self: start;
  padding: 6px 11px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e8f9ee;
  color: #16a34a;
  font-size: 11px;
  font-weight: 800;
}

.reference-manual-sent-note {
  margin-top: 6px;
  padding: 13px 16px;
  border-radius: 14px;
  border: 1px solid #e6ecfb;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f9fbff;
  color: #7282a2;
  font-size: 12px;
}

.reference-collection-summary__provider--manual-success {
  align-items: center;
}

.reference-collection-summary__provider-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reference-summary-insight--checklist ul {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.reference-summary-insight--checklist li {
  position: relative;
  padding-left: 18px;
  font-size: 12px;
  line-height: 1.6;
  color: #7282a2;
}

.reference-summary-insight--checklist li::before {
  content: '?';
  position: absolute;
  left: 0;
  top: 0;
  color: #6b5cff;
  font-weight: 800;
}

.reference-review-pills article > span.is-pink {
  color: #f15bb5;
  background: #fff2f8;
}

.reference-review-pills article > span.is-violet {
  color: #6b5cff;
  background: #f3f2ff;
}

.reference-review-pills article > span.is-green {
  color: #16a34a;
  background: #eefbf2;
}

.reference-review-pills article div {
  flex: 1;
}

.reference-review-pills article strong {
  display: block;
  font-size: 13px;
  color: #1f2a44;
}

.reference-review-pills article small {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  color: #7a8aa8;
}

.reference-review-pills article em {
  min-width: 34px;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-size: 11px;
  font-weight: 800;
  color: #16a34a;
  background: #eefbf2;
}

.reference-review-timeline {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.reference-review-timeline article {
  padding: 14px;
  border: 1px solid #edf2fd;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff 0%, #fbfdff 100%);
}

.reference-review-timeline article span {
  width: 28px;
  height: 28px;
  margin-bottom: 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff2f8;
  color: #f15bb5;
  font-size: 12px;
  font-weight: 800;
}

.reference-review-timeline article strong {
  display: block;
  font-size: 13px;
  color: #1f2a44;
}

.reference-review-timeline article p {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: #7382a0;
}

.reference-success-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.78fr);
  gap: 18px;
  align-items: start;
}

.reference-success-main {
  display: grid;
  gap: 18px;
}

.reference-success-hero {
  padding: 22px;
  border: 1px solid #dff4e4;
  border-radius: 22px;
  background: linear-gradient(135deg, #fbfffc 0%, #f4fff7 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.reference-success-hero__copy {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.reference-success-hero__badge {
  width: 76px;
  height: 76px;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  box-shadow: 0 18px 26px rgba(34, 197, 94, 0.2);
}

.reference-success-hero__copy h3 {
  margin: 2px 0 8px;
  font-size: 30px;
  line-height: 1.1;
  color: #1f2a44;
}

.reference-success-hero__copy p,
.reference-success-hero__copy strong {
  display: block;
  max-width: 640px;
  font-size: 14px;
  line-height: 1.7;
}

.reference-success-hero__copy p {
  margin: 0;
  color: #617392;
}

.reference-success-hero__copy strong {
  margin-top: 8px;
  color: #2b6c42;
}

.reference-success-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.reference-success-stats article {
  padding: 16px;
  border: 1px solid #e8eefb;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  display: flex;
  align-items: center;
  gap: 12px;
}

.reference-success-stats article > span {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.reference-success-stats article > span.is-pink {
  color: #f15bb5;
  background: #fff2f8;
}

.reference-success-stats article > span.is-violet {
  color: #6b5cff;
  background: #f3f2ff;
}

.reference-success-stats article > span.is-green {
  color: #16a34a;
  background: #eefbf2;
}

.reference-success-stats strong {
  display: block;
  font-size: 28px;
  font-weight: 900;
  color: #1f2a44;
}

.reference-success-stats small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #7182a0;
}

.reference-success-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.reference-success-timeline {
  display: grid;
  gap: 14px;
}

.reference-success-timeline article {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.reference-success-timeline article > span {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.reference-success-timeline article > span.is-success {
  color: #16a34a;
  background: #eefbf2;
}

.reference-success-timeline article > span.is-progress {
  color: #f15bb5;
  background: #fff2f8;
}

.reference-success-timeline article > span.is-violet {
  color: #6b5cff;
  background: #f3f2ff;
}

.reference-success-timeline article > span.is-blue {
  color: #4f7cff;
  background: #eef4ff;
}

.reference-success-timeline strong {
  display: block;
  font-size: 13px;
  color: #1f2a44;
}

.reference-success-timeline p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #7585a1;
}

.reference-success-state {
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eefbf2;
  color: #16a34a;
  font-size: 11px;
  font-weight: 800;
}

.reference-success-status-list {
  display: grid;
  gap: 12px;
}

.reference-success-status-list article {
  padding: 14px 16px;
  border: 1px solid #eaf0fb;
  border-radius: 16px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.reference-success-status-list__main,
.reference-success-status-list__meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reference-success-status-list__main {
  min-width: 0;
}

.reference-success-status-list__main div strong,
.reference-success-status-list__meta strong {
  font-size: 13px;
  color: #20304c;
}

.reference-success-status-list__main div small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #7a8aa8;
}

.reference-success-status-list__icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.reference-success-status-list__icon.is-success {
  color: #16a34a;
  background: #eefbf2;
}

.reference-success-status-list__icon.is-muted {
  color: #7d8ca9;
  background: #f4f7fc;
}

.reference-success-status-list__meta {
  margin-left: auto;
}

.reference-success-status-list__meta strong.is-success {
  color: #16a34a;
}

.reference-success-status-list__meta strong.is-muted {
  color: #7c8ba7;
}

.reference-success-avatars {
  display: inline-flex;
  align-items: center;
  padding-right: 2px;
}

.reference-success-avatars span {
  width: 28px;
  height: 28px;
  margin-right: -8px;
  border: 2px solid #fff;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0b15c 0%, #7ea86a 100%);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
}

.reference-success-footnote {
  padding: 18px;
  border: 1px solid #ece7ff;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(107, 92, 255, 0.06) 0%, rgba(244, 114, 182, 0.04) 100%);
}

.reference-success-footnote strong {
  display: block;
  font-size: 14px;
  color: #243250;
}

.reference-success-footnote p {
  margin: 6px 0 0;
  font-size: 12px;
  color: #6f809f;
}

.reference-success-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.reference-success-chips span {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.82);
  color: #5f7190;
  font-size: 11px;
  font-weight: 700;
}

.reference-mix-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.reference-mix-card {
  padding: 14px;
  border: 1px solid #e7ecfb;
  border-radius: 16px;
  background: #fff;
}

.reference-mix-card__icon {
  width: 34px;
  height: 34px;
  margin-bottom: 12px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b5cff;
  background: #f3f2ff;
}

.reference-mix-card strong {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #1f2a44;
}

.reference-mix-card small {
  display: block;
  min-height: 30px;
  margin-top: 5px;
  font-size: 11px;
  line-height: 1.45;
  color: #7b8ba9;
}

.reference-mix-counter {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.reference-mix-counter button {
  width: 28px;
  height: 28px;
  border: 1px solid #dbe4fb;
  border-radius: 10px;
  background: #fff;
  color: #5d6e8d;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.reference-mix-counter span {
  min-width: 18px;
  text-align: center;
  font-size: 18px;
  font-weight: 800;
  color: #1f2a44;
}

.reference-mix-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.reference-mix-footer > span {
  font-size: 12px;
  color: #7b8ba9;
}

.reference-mix-footer > span strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  margin-left: 6px;
  padding: 0 8px;
  border-radius: 999px;
  background: #fff2f8;
  color: #f15bb5;
}

.reference-ai-inline {
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #e8ecff;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(107, 92, 255, 0.05) 0%, rgba(244, 114, 182, 0.04) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.reference-ai-inline > div {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.reference-ai-inline :deep(svg) {
  color: #6b5cff;
}

.reference-ai-inline p {
  margin: 0;
  display: grid;
  gap: 2px;
  font-size: 12px;
  color: #617394;
}

.reference-ai-inline p strong {
  color: #6b5cff;
}

.reference-ai-inline button {
  flex: none;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid #dbe4fb;
  border-radius: 12px;
  background: #fff;
  color: #6b5cff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.reference-request-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.reference-request-options {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.reference-request-check {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #546784;
}

.reference-request-check input {
  width: 16px;
  height: 16px;
  accent-color: #f472b6;
}

.reference-request-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #edf2fd;
}

.reference-request-toggle-row strong {
  display: block;
  font-size: 13px;
  color: #1f2a44;
}

.reference-request-toggle-row p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #7282a2;
}

.toggle-switch {
  width: 54px;
  height: 30px;
  padding: 3px;
  border: 0;
  border-radius: 999px;
  background: #e9eefb;
  cursor: pointer;
}

.toggle-switch span {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.14);
  transition: transform 0.2s ease;
}

.toggle-switch.active {
  background: linear-gradient(135deg, #ff5ca8 0%, #f472b6 100%);
}

.toggle-switch.active span {
  transform: translateX(24px);
}

.reference-collection-summary__provider {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  margin-top: 16px;
  border: 1px solid #f8d7e8;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff 0%, #fff7fb 100%);
}

.reference-collection-summary__provider small,
.reference-summary-meta span,
.reference-summary-list span {
  font-size: 11px;
  color: #8ea0c0;
}

.reference-collection-summary__provider strong,
.reference-summary-meta strong,
.reference-summary-list strong {
  font-size: 13px;
  font-weight: 800;
  color: #20304c;
}

.reference-collection-summary__provider > span {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff5ca8 0%, #f472b6 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 900;
}

.reference-summary-list,
.reference-summary-meta {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.reference-summary-list {
  padding-bottom: 14px;
  border-bottom: 1px solid #edf2fd;
}

.reference-summary-list h4 {
  margin: 0 0 2px;
  font-size: 13px;
  font-weight: 800;
  color: #22314e;
}

.reference-summary-list div,
.reference-summary-meta div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.reference-summary-list__label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #617392;
}

.reference-summary-list__label i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
}

.reference-summary-list__label i.is-pink {
  background: #f472b6;
}

.reference-summary-list__label i.is-violet {
  background: #6b5cff;
}

.reference-summary-list__label i.is-orange {
  background: #fb923c;
}

.reference-summary-list__label i.is-green {
  background: #22c55e;
}

.reference-summary-meta {
  gap: 12px;
}

.reference-summary-meta__total {
  padding-bottom: 12px;
  border-bottom: 1px solid #edf2fd;
}

.reference-summary-meta__total strong {
  color: #f15bb5;
}

.reference-summary-meta__status strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.reference-summary-meta__status strong.is-enabled {
  color: #16a34a;
}

.reference-summary-insight {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 18px;
  padding: 14px;
  border: 1px solid #ece7ff;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(107, 92, 255, 0.06) 0%, rgba(244, 114, 182, 0.04) 100%);
}

.reference-summary-insight :deep(svg) {
  color: #6b5cff;
}

.reference-summary-insight strong {
  display: block;
  font-size: 13px;
  color: #6b5cff;
}

.reference-summary-insight p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: #667899;
}

.reference-summary-insight button {
  margin-top: 8px;
  border: 0;
  padding: 0;
  background: transparent;
  color: #f15bb5;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.reference-collection-button {
  min-width: 126px;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  border: 1px solid #dbe4fb;
  font-size: 14px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.reference-collection-button.secondary {
  background: #fff;
  color: #485878;
}

.reference-collection-button.primary {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff5ca8 0%, #f472b6 100%);
  box-shadow: 0 18px 28px rgba(244, 114, 182, 0.24);
}

.reference-collection-button.is-disabled,
.reference-collection-button:disabled {
  cursor: not-allowed;
  background: linear-gradient(135deg, #e4dff8 0%, #d9d6f3 100%);
  box-shadow: none;
  color: #fff;
}

@media (max-width: 1180px) {
  .reference-collection-method-grid,
  .reference-timing__grid {
    grid-template-columns: 1fr;
  }

  .reference-collection-configure,
  .reference-review-layout,
  .reference-success-layout,
  .reference-review-stats,
  .reference-review-mix,
  .reference-review-details-grid,
  .reference-review-timeline,
  .reference-success-grid,
  .reference-manual-mix-grid,
  .reference-mix-grid,
  .reference-request-grid,
  .reference-method-config__layout,
  .reference-method-config__fields.three-col,
  .reference-method-config__fields.two-col {
    grid-template-columns: 1fr;
  }

  .reference-ai-recommendation {
    flex-direction: column;
    align-items: flex-start;
  }

  .reference-method-expand__head {
    flex-direction: column;
  }

  .reference-mix-footer,
  .reference-request-toggle-row,
  .reference-manual-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .reference-manual-actions__main {
    width: 100%;
    justify-content: flex-start;
  }

  .reference-success-stats {
    grid-template-columns: 1fr;
  }

  .reference-success-status-list article,
  .reference-success-status-list__meta {
    flex-wrap: wrap;
  }
}

@media (max-width: 760px) {
  .reference-collection-overlay {
    padding: 12px;
  }

  .reference-collection-modal {
    width: 100%;
    max-height: calc(100vh - 16px);
    border-radius: 22px;
  }

  .reference-collection-modal__head,
  .reference-collection-modal__body,
  .reference-collection-modal__foot {
    padding-left: 16px;
    padding-right: 16px;
  }

  .reference-collection-modal__head,
  .reference-collection-modal__foot,
  .reference-collection-steps {
    flex-wrap: wrap;
  }

  .reference-method-card,
  .reference-timing-card {
    min-height: auto;
  }

  .reference-collection-button {
    width: 100%;
  }
}
</style>
