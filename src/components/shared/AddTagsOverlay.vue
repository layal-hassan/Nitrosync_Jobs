<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const tagName = ref('')
const selectedColor = ref('pink')

const colorOptions = [
  { id: 'pink', value: '#f062ad' },
  { id: 'violet', value: '#8b5cf6' },
  { id: 'blue', value: '#3b82f6' },
  { id: 'cyan', value: '#2dc1df' },
  { id: 'green', value: '#4ad878' },
  { id: 'yellow', value: '#ffbe1a' },
  { id: 'orange', value: '#ff9538' },
  { id: 'slate', value: '#94a3b8' },
]

const previewLabel = computed(() => tagName.value.trim() || 'New Tag')
const previewColor = computed(() => (
  colorOptions.find((item) => item.id === selectedColor.value)?.value ?? '#f062ad'
))

function closeOverlay() {
  emit('close')
}

function saveTag() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="add-tags-overlay" @click.self="closeOverlay">
      <section class="add-tags-modal">
        <header class="add-tags-modal__head">
          <div class="add-tags-modal__title">
            <span class="add-tags-modal__title-icon">
              <AppIcon name="tag" :size="18" />
            </span>
            <div>
              <h2>Add Tags</h2>
              <p>Add one or more tags to organize this candidate.</p>
            </div>
          </div>

          <button class="add-tags-modal__close" type="button" aria-label="Close Add Tags" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="add-tags-modal__body">
          <section class="add-tags-field">
            <label>Tag Name</label>
            <div class="add-tags-input">
              <AppIcon name="search" :size="18" />
              <input v-model="tagName" type="text" placeholder="Enter tag name...">
            </div>
          </section>

          <section class="add-tags-field">
            <label>Choose Color</label>
            <div class="add-tags-colors">
              <button
                v-for="color in colorOptions"
                :key="color.id"
                class="add-tags-color"
                :class="{ 'is-active': selectedColor === color.id }"
                :style="{ '--tag-color': color.value }"
                type="button"
                @click="selectedColor = color.id"
              >
                <AppIcon v-if="selectedColor === color.id" name="check" :size="18" />
              </button>
            </div>
          </section>

          <section class="add-tags-field">
            <label>Tag Preview</label>
            <div class="add-tags-preview">
              <span class="add-tags-pill" :style="{ '--tag-color': previewColor }">
                <i />
                <strong>{{ previewLabel }}</strong>
                <button type="button" aria-label="Remove preview tag">
                  <AppIcon name="close" :size="14" />
                </button>
              </span>
            </div>
          </section>
        </div>

        <footer class="add-tags-modal__footer">
          <button class="add-tags-button add-tags-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="add-tags-button add-tags-button--primary" type="button" @click="saveTag">Add Tag</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.add-tags-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(32, 35, 47, 0.62);
  backdrop-filter: blur(4px);
}

.add-tags-modal {
  width: min(100%, 640px);
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.26);
}

.add-tags-modal__head,
.add-tags-modal__title,
.add-tags-modal__footer,
.add-tags-input,
.add-tags-colors,
.add-tags-pill {
  display: flex;
  align-items: center;
}

.add-tags-modal__head,
.add-tags-modal__footer {
  justify-content: space-between;
}

.add-tags-modal__head {
  padding: 22px 38px;
}

.add-tags-modal__title {
  gap: 18px;
}

.add-tags-modal__title-icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #fff1f8;
  color: #ff4f9b;
}

.add-tags-modal__title h2,
.add-tags-field label {
  margin: 0;
  color: #1f2940;
}

.add-tags-modal__title p {
  margin: 6px 0 0;
  color: #738199;
}

.add-tags-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.add-tags-modal__body {
  padding: 8px 38px 34px;
}

.add-tags-field + .add-tags-field {
  margin-top: 30px;
}

.add-tags-field label {
  display: block;
  margin-bottom: 14px;
  font-size: 0.95rem;
  font-weight: 700;
}

.add-tags-input {
  gap: 10px;
  min-height: 62px;
  padding: 0 16px;
  border: 1px solid #ffd8ea;
  border-radius: 16px;
  color: #9aa7bd;
}

.add-tags-input input {
  width: 100%;
  border: 0;
  outline: none;
  color: #1f2940;
  font: inherit;
}

.add-tags-colors {
  gap: 18px;
  flex-wrap: wrap;
}

.add-tags-color {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: var(--tag-color);
  color: #fff;
  cursor: pointer;
  box-shadow: inset 0 0 0 0 #fff;
}

.add-tags-color.is-active {
  box-shadow: 0 0 0 3px #fff, 0 0 0 5px var(--tag-color);
}

.add-tags-preview {
  min-height: 56px;
}

.add-tags-pill {
  gap: 12px;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tag-color) 12%, white);
  color: #1f2940;
}

.add-tags-pill i {
  width: 18px;
  height: 18px;
  display: inline-block;
  border-radius: 50%;
  background: var(--tag-color);
}

.add-tags-pill strong {
  font-size: 0.95rem;
  font-weight: 700;
}

.add-tags-pill button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #ff67b5;
  cursor: pointer;
}

.add-tags-modal__footer {
  padding: 30px 38px;
  border-top: 1px solid #edf2fb;
}

.add-tags-button {
  min-width: 138px;
  height: 58px;
  border-radius: 16px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.add-tags-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #2e3952;
}

.add-tags-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 18px 28px rgba(235, 94, 171, 0.18);
}

@media (max-width: 720px) {
  .add-tags-overlay {
    padding: 12px;
  }

  .add-tags-modal {
    border-radius: 18px;
  }

  .add-tags-modal__head,
  .add-tags-modal__body,
  .add-tags-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .add-tags-modal__head,
  .add-tags-modal__footer {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .add-tags-button {
    width: 100%;
  }
}
</style>
