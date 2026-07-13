<script setup>
import { computed, ref } from 'vue'
import { navigationSections } from '../../data/navigation'
import AppIcon from '../shared/AppIcon.vue'
import NitroSyncLogo from '../shared/NitroSyncLogo.vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  activeItem: {
    type: String,
    default: 'jobs',
  },
  mobileOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close-mobile', 'navigate'])

const sections = ref(
  navigationSections
    .filter((section) => section.id !== 'settings')
    .map((section) => ({
      ...section,
      isExpanded: section.expanded ?? false,
    })),
)

const settingsItem = computed(() => (
  navigationSections.find((section) => section.id === 'settings')
))

function toggleGroup(id) {
  const current = sections.value.find((section) => section.id === id)

  if (!current || current.type !== 'group') {
    return
  }

  current.isExpanded = !current.isExpanded
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed, 'mobile-open': mobileOpen }">
    <div class="sidebar-top">
      <div class="brand">
        <NitroSyncLogo :mode="collapsed ? 'mark' : 'full'" size="sm" />
      </div>
    </div>

    <nav class="nav">
      <template v-for="section in sections" :key="section.id">
        <button
          v-if="section.type === 'item'"
          class="nav-item nav-item-main"
          :class="{ active: activeItem === section.id }"
          type="button"
          @click="emit('navigate', section.id)"
        >
          <AppIcon :name="section.icon" :size="18" />
          <span v-if="!collapsed">{{ section.label }}</span>
        </button>

        <div v-else class="nav-group">
          <button class="group-label" type="button" @click="toggleGroup(section.id)">
            <span v-if="!collapsed">{{ section.label }}</span>
            <AppIcon
              v-if="!collapsed"
              :name="section.isExpanded ? 'chevronUp' : 'chevronDown'"
              :size="13"
            />
          </button>

          <div v-if="section.isExpanded && !collapsed" class="group-items">
            <button
              v-for="item in section.items"
              :key="item.id"
              class="nav-item"
              :class="{ active: activeItem === item.id }"
              type="button"
              @click="emit('navigate', item.id)"
            >
              <AppIcon :name="item.icon" :size="18" />
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>
      </template>
    </nav>

    <div v-if="settingsItem && !collapsed" class="sidebar-bottom">
      <button
        class="nav-item nav-item-settings"
        :class="{ active: activeItem === settingsItem.id }"
        type="button"
        @click="emit('navigate', settingsItem.id)"
      >
        <AppIcon :name="settingsItem.icon" :size="18" />
        <span>{{ settingsItem.label }}</span>
      </button>
    </div>

    <button class="mobile-close" type="button" @click="emit('close-mobile')">Close</button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 256px;
  min-width: 256px;
  min-height: 100vh;
  border-right: 1px solid #edf1f8;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  transition: transform 0.25s ease;
}

.sidebar.collapsed {
  width: 88px;
  min-width: 88px;
}

.sidebar-top {
  padding: 24px 22px 18px;
}

.brand {
  display: flex;
  align-items: center;
  min-height: 34px;
}

.sidebar.collapsed .brand {
  justify-content: center;
}

.nav {
  flex: 1;
  padding: 10px 18px 18px;
  overflow-y: auto;
}

.nav-item,
.group-label {
  width: 100%;
  border: 0;
  background: transparent;
}

.nav-item {
  position: relative;
  min-height: 38px;
  padding: 0 12px;
  margin-bottom: 6px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #44526b;
  font-size: 13px;
}

.nav-item.active {
  color: #f24193;
  font-weight: 700;
  background: linear-gradient(180deg, #fff6fb 0%, #fff0f8 100%);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  top: 2px;
  right: -1px;
  bottom: 2px;
  width: 4px;
  border-radius: 999px;
  background: #f24193;
}

.nav-group {
  margin-top: 12px;
}

.group-label {
  min-height: 26px;
  padding: 0 10px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #a0acc0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.group-items {
  display: flex;
  flex-direction: column;
}

.sidebar-bottom {
  padding: 0 18px 18px;
}

.nav-item-settings {
  margin-bottom: 0;
}

.mobile-close {
  display: none;
}

@media (max-width: 720px) {
  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 30;
    transform: translateX(-100%);
    box-shadow: var(--shadow-soft);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .mobile-close {
    display: block;
    margin: 0 18px 18px;
    height: 40px;
    border: 1px solid #e4ebf5;
    border-radius: 12px;
    background: #fff;
    color: #17213f;
  }
}
</style>
