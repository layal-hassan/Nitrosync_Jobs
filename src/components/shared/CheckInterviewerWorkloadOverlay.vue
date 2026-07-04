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
    default: 'Sarah Johnson',
  },
  candidateRole: {
    type: String,
    default: 'Senior Product Designer',
  },
  candidateStage: {
    type: String,
    default: 'Shortlisted',
  },
})

const emit = defineEmits(['close', 'use-current-panel', 'view-replacements'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const workloadMembers = [
  {
    name: 'Emma Wilson',
    role: 'Design Director',
    badge: 'Hiring Manager',
    chips: ['Product Thinking', 'Leadership'],
    workload: 'Moderate Workload',
    tone: 'green',
    interviews: '5 interviews this week',
    capacity: 'Capacity: 60%',
    activeBars: 5,
    availability: 'Tomorrow, 10:00 AM',
    availabilityBadge: '',
    availabilityTone: 'neutral',
    initials: 'EW',
    avatarTone: 'rose',
  },
  {
    name: 'Michael Chen',
    role: 'Design Lead',
    badge: '',
    chips: ['UX Design', 'Systems Thinking'],
    workload: 'Light Workload',
    tone: 'green',
    interviews: '2 interviews this week',
    capacity: 'Capacity: 25%',
    activeBars: 2,
    availability: 'Today, 2:00 PM',
    availabilityBadge: 'Best availability',
    availabilityTone: 'pink',
    initials: 'MC',
    avatarTone: 'slate',
  },
  {
    name: 'David Park',
    role: 'Principal Designer',
    badge: '',
    chips: ['Portfolio Review', 'Case Studies'],
    workload: 'High Workload',
    tone: 'orange',
    interviews: '8 interviews this week',
    capacity: 'Capacity: 90%',
    activeBars: 8,
    availability: 'Friday, 11:00 AM',
    availabilityBadge: 'Potential scheduling delay',
    availabilityTone: 'orange',
    initials: 'DP',
    avatarTone: 'midnight',
  },
]

const insightItems = [
  'Michael Chen has the earliest availability and lowest workload.',
  'David Park is approaching weekly interview capacity and may cause delays.',
  'Current panel can be scheduled within 3 business days.',
]

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
    <div v-if="open" class="workload-overlay" @click.self="closeOverlay">
      <section class="workload-modal">
        <header class="workload-modal__header">
          <div class="workload-modal__title">
            <span class="workload-modal__title-icon">
              <AppIcon name="users" :size="20" />
            </span>
            <div>
              <h2>Check Interviewer Workload</h2>
              <p>See current workload and availability for your interview panel.</p>
            </div>
          </div>

          <button class="workload-modal__close" type="button" aria-label="Close interviewer workload" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <section class="workload-candidate">
          <div class="workload-candidate__profile">
            <span class="workload-candidate__avatar">{{ candidateInitials }}</span>

            <div class="workload-candidate__info">
              <div class="workload-candidate__name-row">
                <h3>{{ candidateName }}</h3>
                <span class="workload-candidate__stage">{{ candidateStage }}</span>
              </div>

              <p>{{ candidateRole }}</p>

              <div class="workload-candidate__meta">
                <span><AppIcon name="mapPin" :size="14" /> New York, NY (Hybrid)</span>
                <span><AppIcon name="briefcase" :size="14" /> 6+ years experience</span>
                <span><AppIcon name="calendar" :size="14" /> Applied on 10 May 2026</span>
              </div>
            </div>
          </div>

          <div class="workload-candidate__current-stage">
            <span>Current Stage</span>
            <strong>Round 1 - Technical Interview</strong>
            <p><AppIcon name="clock" :size="14" /> 60 Minutes</p>
          </div>
        </section>

        <section class="workload-panel">
          <div class="workload-panel__head">
            <div>
              <div class="workload-section-title">
                <AppIcon name="users" :size="18" />
                <h3>Interview Panel Workload</h3>
              </div>
              <p>Overview of current workload and upcoming availability for selected interviewers.</p>
            </div>

            <div class="workload-panel__tools">
              <button type="button" class="workload-refresh">
                <AppIcon name="refresh" :size="15" />
                <span>Refresh Data</span>
              </button>
              <span>Last updated: Just now</span>
            </div>
          </div>

          <div class="workload-member-list">
            <article v-for="member in workloadMembers" :key="member.name" class="workload-member-card">
              <div class="workload-member-card__identity">
                <span class="workload-member-card__avatar" :class="`is-${member.avatarTone}`">{{ member.initials }}</span>

                <div class="workload-member-card__copy">
                  <div class="workload-member-card__title-row">
                    <strong>{{ member.name }}</strong>
                    <em v-if="member.badge">{{ member.badge }}</em>
                  </div>

                  <p>{{ member.role }}</p>

                  <div class="workload-member-card__chips">
                    <span v-for="chip in member.chips" :key="chip">{{ chip }}</span>
                  </div>
                </div>
              </div>

              <div class="workload-member-card__stats">
                <strong :class="`is-${member.tone}`">{{ member.workload }}</strong>
                <span>{{ member.interviews }}</span>

                <div class="workload-member-card__bars" :class="`is-${member.tone}`">
                  <span
                    v-for="barIndex in 8"
                    :key="`${member.name}-${barIndex}`"
                    :class="{ 'is-active': barIndex <= member.activeBars }"
                  />
                </div>

                <small>{{ member.capacity }}</small>
              </div>

              <div class="workload-member-card__availability">
                <span>Next Availability</span>
                <strong>{{ member.availability }}</strong>
                <em v-if="member.availabilityBadge" :class="`is-${member.availabilityTone}`">
                  <AppIcon :name="member.availabilityTone === 'orange' ? 'alert' : 'spark'" :size="12" />
                  {{ member.availabilityBadge }}
                </em>
              </div>
            </article>
          </div>

          <section class="workload-insights">
            <div class="workload-section-title">
              <AppIcon name="spark" :size="18" />
              <h3>AI Insights</h3>
            </div>

            <div class="workload-insights__grid">
              <article v-for="item in insightItems" :key="item">
                <span><AppIcon name="checkCircle" :size="16" /></span>
                <p>{{ item }}</p>
              </article>
            </div>
          </section>

          <section class="workload-recommendations">
            <div class="workload-section-title">
              <AppIcon name="message" :size="18" />
              <h3>Recommendations</h3>
            </div>

            <div class="workload-recommendations__grid">
              <button type="button" class="workload-recommendation-card is-primary" @click="emit('use-current-panel')">
                <span class="workload-recommendation-card__icon">
                  <AppIcon name="checkCircle" :size="18" />
                </span>
                <div>
                  <strong>Proceed with current panel</strong>
                  <p>Good balance of availability and expertise.</p>
                </div>
              </button>

              <button type="button" class="workload-recommendation-card" @click="emit('view-replacements')">
                <span class="workload-recommendation-card__icon">
                  <AppIcon name="userPlus" :size="18" />
                </span>
                <div>
                  <strong>View Suggested Replacements</strong>
                  <p>Find alternative interviewers with lower workload.</p>
                </div>
              </button>
            </div>
          </section>
        </section>

        <footer class="workload-modal__footer">
          <button class="workload-modal__secondary" type="button" @click="closeOverlay">Cancel</button>
          <button class="workload-modal__primary" type="button" @click="emit('use-current-panel')">Use Current Panel</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.workload-overlay {
  position: fixed;
  inset: 0;
  z-index: 1700;
  display: grid;
  place-items: center;
  padding: 28px;
  background: rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(10px);
}

.workload-modal {
  width: min(1220px, calc(100vw - 40px));
  max-height: calc(100vh - 36px);
  overflow: auto;
  border: 1px solid #e6ebf5;
  border-radius: 28px;
  background:
    linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.16);
}

.workload-modal__header,
.workload-candidate,
.workload-panel,
.workload-modal__footer {
  padding-left: 34px;
  padding-right: 34px;
}

.workload-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding-top: 30px;
  padding-bottom: 26px;
  border-bottom: 1px solid #edf1f7;
}

.workload-modal__title {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.workload-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: #f45fb4;
  background: linear-gradient(135deg, #ffe8f5 0%, #fff3fb 100%);
}

.workload-modal__title h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.05rem;
  font-weight: 800;
}

.workload-modal__title p {
  margin: 6px 0 0;
  color: #7d889f;
  font-size: 0.95rem;
}

.workload-modal__close {
  border: 0;
  background: transparent;
  color: #9aa4b8;
  cursor: pointer;
}

.workload-candidate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #edf1f7;
}

.workload-candidate__profile {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
}

.workload-candidate__avatar {
  flex: 0 0 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 22px;
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 800;
  background: linear-gradient(135deg, #121826 0%, #f06fb6 100%);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.82);
}

.workload-candidate__info {
  min-width: 0;
}

.workload-candidate__name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.workload-candidate__name-row h3 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.2rem;
  font-weight: 800;
}

.workload-candidate__stage {
  padding: 6px 12px;
  border-radius: 999px;
  color: #ef69b3;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: capitalize;
  background: #ffeaf4;
}

.workload-candidate__info > p {
  margin: 4px 0 0;
  color: #5f6b82;
  font-size: 0.98rem;
}

.workload-candidate__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  color: #7d889f;
  font-size: 0.9rem;
}

.workload-candidate__meta span,
.workload-candidate__current-stage p {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.workload-candidate__current-stage {
  flex: 0 0 290px;
  text-align: right;
}

.workload-candidate__current-stage span {
  display: block;
  color: #a0a9bc;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.workload-candidate__current-stage strong {
  display: block;
  margin-top: 8px;
  color: #f160af;
  font-size: 1rem;
  font-weight: 800;
}

.workload-candidate__current-stage p {
  justify-content: flex-end;
  margin: 10px 0 0;
  color: #6c7891;
}

.workload-panel {
  padding-top: 28px;
  padding-bottom: 32px;
  background: linear-gradient(180deg, #fafbff 0%, #f8f9ff 100%);
}

.workload-panel__head,
.workload-section-title,
.workload-panel__tools,
.workload-member-card,
.workload-modal__footer,
.workload-recommendations__grid {
  display: flex;
}

.workload-panel__head {
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}

.workload-section-title {
  align-items: center;
  gap: 10px;
  color: #3f50ff;
}

.workload-section-title h3 {
  margin: 0;
  color: #1f2a44;
  font-size: 1rem;
  font-weight: 800;
}

.workload-panel__head p {
  margin: 6px 0 0;
  color: #7c879b;
  font-size: 0.95rem;
}

.workload-panel__tools {
  align-items: center;
  gap: 14px;
  color: #a1abbd;
  font-size: 0.88rem;
}

.workload-refresh {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border: 1px solid #dfe5f2;
  border-radius: 12px;
  background: #ffffff;
  color: #4f46e5;
  font-size: 0.93rem;
  font-weight: 700;
  cursor: pointer;
}

.workload-member-list {
  display: grid;
  gap: 16px;
}

.workload-member-card {
  align-items: center;
  gap: 18px;
  padding: 24px 26px;
  border: 1px solid #e7edf6;
  border-radius: 20px;
  background: #ffffff;
}

.workload-member-card__identity {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1.2;
  min-width: 0;
}

.workload-member-card__avatar {
  flex: 0 0 62px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  border-radius: 20px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 800;
}

.workload-member-card__avatar.is-rose {
  background: linear-gradient(135deg, #161616 0%, #f5d1bf 100%);
}

.workload-member-card__avatar.is-slate {
  background: linear-gradient(135deg, #121826 0%, #61858f 100%);
}

.workload-member-card__avatar.is-midnight {
  background: linear-gradient(135deg, #101828 0%, #324968 100%);
}

.workload-member-card__copy {
  min-width: 0;
}

.workload-member-card__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.workload-member-card__title-row strong {
  color: #1f2a44;
  font-size: 1rem;
  font-weight: 800;
}

.workload-member-card__title-row em {
  padding: 5px 10px;
  border-radius: 10px;
  background: #ffe8f4;
  color: #ef69b3;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.workload-member-card__copy p {
  margin: 6px 0 0;
  color: #707c92;
}

.workload-member-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.workload-member-card__chips span {
  padding: 6px 10px;
  border-radius: 9px;
  background: #eef2ff;
  color: #4f63ff;
  font-size: 0.74rem;
  font-weight: 700;
}

.workload-member-card__stats {
  flex: 0.85;
  min-width: 220px;
}

.workload-member-card__stats strong {
  display: block;
  font-size: 1rem;
  font-weight: 800;
}

.workload-member-card__stats strong.is-green {
  color: #17a34a;
}

.workload-member-card__stats strong.is-orange {
  color: #f97316;
}

.workload-member-card__stats > span {
  display: block;
  margin-top: 6px;
  color: #6f7b92;
}

.workload-member-card__bars {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 5px;
  max-width: 192px;
  margin-top: 11px;
}

.workload-member-card__bars span {
  height: 10px;
  border-radius: 999px;
  background: #d9dee8;
}

.workload-member-card__bars.is-green span.is-active {
  background: linear-gradient(90deg, #22c55e 0%, #39b36d 100%);
}

.workload-member-card__bars.is-orange span.is-active {
  background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
}

.workload-member-card__stats small {
  display: block;
  margin-top: 8px;
  color: #8a95a8;
  font-size: 0.8rem;
}

.workload-member-card__availability {
  flex: 0.75;
  min-width: 226px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #f6f8fc;
}

.workload-member-card__availability > span {
  display: block;
  color: #9aa3b6;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.workload-member-card__availability > strong {
  display: block;
  margin-top: 9px;
  color: #1f2a44;
  font-size: 1rem;
  font-weight: 800;
}

.workload-member-card__availability em {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 6px 10px;
  border-radius: 9px;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 700;
}

.workload-member-card__availability em.is-pink {
  color: #ef69b3;
  background: #ffeaf4;
}

.workload-member-card__availability em.is-orange {
  color: #f97316;
  background: #fff1e8;
}

.workload-insights,
.workload-recommendations {
  margin-top: 26px;
  padding: 22px 26px;
  border: 1px solid #dce5fb;
  border-radius: 20px;
  background: linear-gradient(180deg, #f6f8ff 0%, #f8fbff 100%);
}

.workload-insights__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-top: 18px;
}

.workload-insights__grid article {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
}

.workload-insights__grid article + article {
  border-left: 1px solid #dbe4fa;
}

.workload-insights__grid span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #22c55e;
  background: #e8fbef;
}

.workload-insights__grid p {
  margin: 0;
  color: #445067;
  line-height: 1.55;
}

.workload-recommendations {
  border-color: transparent;
  padding: 0;
  background: transparent;
}

.workload-recommendations__grid {
  gap: 18px;
  margin-top: 18px;
}

.workload-recommendation-card {
  flex: 1;
  align-items: center;
  gap: 18px;
  padding: 18px 22px;
  border: 1px solid #cfd9f9;
  border-radius: 18px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
}

.workload-recommendation-card.is-primary {
  border-color: #a9e8be;
  background: linear-gradient(180deg, #f2fff6 0%, #f7fff9 100%);
}

.workload-recommendation-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: #4f46e5;
  background: #f1f2ff;
}

.workload-recommendation-card.is-primary .workload-recommendation-card__icon {
  color: #22c55e;
  background: #ecfdf3;
}

.workload-recommendation-card strong {
  display: block;
  color: #1f2a44;
  font-size: 1rem;
  font-weight: 800;
}

.workload-recommendation-card p {
  margin: 6px 0 0;
  color: #6f7b92;
  line-height: 1.55;
}

.workload-modal__footer {
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  padding-top: 24px;
  padding-bottom: 24px;
  border-top: 1px solid #edf1f7;
  background: #ffffff;
}

.workload-modal__secondary,
.workload-modal__primary {
  min-width: 112px;
  padding: 14px 24px;
  border-radius: 14px;
  font-size: 0.96rem;
  font-weight: 800;
  cursor: pointer;
}

.workload-modal__secondary {
  border: 1px solid #d7deea;
  background: #ffffff;
  color: #334155;
}

.workload-modal__primary {
  border: 0;
  color: #ffffff;
  background: linear-gradient(135deg, #f060ae 0%, #ee7fbc 100%);
  box-shadow: 0 18px 32px rgba(240, 96, 174, 0.26);
}

@media (max-width: 1120px) {
  .workload-member-card,
  .workload-candidate,
  .workload-panel__head,
  .workload-recommendations__grid,
  .workload-insights__grid {
    flex-direction: column;
  }

  .workload-candidate__current-stage,
  .workload-panel__tools,
  .workload-member-card__stats,
  .workload-member-card__availability {
    width: 100%;
    min-width: 0;
  }

  .workload-candidate__current-stage {
    text-align: left;
  }

  .workload-candidate__current-stage p {
    justify-content: flex-start;
  }

  .workload-insights__grid {
    grid-template-columns: 1fr;
  }

  .workload-insights__grid article + article {
    border-left: 0;
    border-top: 1px solid #dbe4fa;
  }
}

@media (max-width: 720px) {
  .workload-overlay {
    padding: 12px;
  }

  .workload-modal {
    width: min(100vw - 8px, 100%);
    max-height: calc(100vh - 12px);
    border-radius: 22px;
  }

  .workload-modal__header,
  .workload-candidate,
  .workload-panel,
  .workload-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .workload-modal__footer {
    flex-direction: column-reverse;
  }

  .workload-modal__secondary,
  .workload-modal__primary {
    width: 100%;
  }
}
</style>
