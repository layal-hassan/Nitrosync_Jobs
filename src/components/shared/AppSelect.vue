<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select',
  },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const rootRef = ref(null)

const selectedLabel = computed(() => {
  const selected = props.options.find((option) => option === props.modelValue)
  return selected ?? props.placeholder
})

function toggleOpen() {
  open.value = !open.value
}

function selectOption(option) {
  emit('update:modelValue', option)
  open.value = false
}

function handleDocumentPointerDown(event) {
  const target = event.target

  if (!(target instanceof Node)) {
    return
  }

  if (rootRef.value?.contains(target)) {
    return
  }

  open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
})
</script>

<template>
  <div ref="rootRef" class="app-select" :class="{ open }">
    <button class="app-select-trigger" type="button" @click="toggleOpen">
      <span>{{ selectedLabel }}</span>
      <AppIcon name="chevronDown" :size="16" />
    </button>

    <div v-if="open" class="app-select-menu">
      <button
        v-for="option in options"
        :key="option"
        class="app-select-option"
        :class="{ selected: option === modelValue }"
        type="button"
        @click="selectOption(option)"
      >
        <span>{{ option }}</span>
        <AppIcon v-if="option === modelValue" name="check" :size="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.app-select {
  position: relative;
}

.app-select-trigger,
.app-select-option {
  width: 100%;
  border: 0;
  background: transparent;
  font: inherit;
}

.app-select-trigger {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dbe3ee;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-main);
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
}

.app-select.open .app-select-trigger {
  border-color: #bfd2ef;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
}

.app-select-trigger span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-select-trigger :deep(svg) {
  color: #94a3b8;
  flex-shrink: 0;
}

.app-select-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 30;
  padding: 6px;
  border: 1px solid #dbe3ee;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
  display: grid;
  gap: 2px;
  max-height: 200px;
  overflow-y: auto;
}

.app-select-option {
  min-height: 32px;
  padding: 0 10px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #445166;
  text-align: left;
  font-size: 11px;
}

.app-select-option:hover {
  background: #f8fbff;
  color: var(--text-main);
}

.app-select-option.selected {
  color: #2563eb;
  background: #edf4ff;
  font-weight: 700;
}

.app-select-option :deep(svg) {
  flex-shrink: 0;
}
</style>
