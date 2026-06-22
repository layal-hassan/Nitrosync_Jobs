<script setup>
import AppIcon from '../shared/AppIcon.vue'

defineProps({
  mobileMenuOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-mobile-menu', 'open-nitro'])
</script>

<template>
  <header class="top-header">
    <button class="icon-button only-mobile" type="button" @click="emit('toggle-mobile-menu')">
      <AppIcon :name="mobileMenuOpen ? 'chevronLeft' : 'menu'" :size="18" />
    </button>

    <label class="search-bar">
      <AppIcon name="search" :size="16" />
      <input type="text" placeholder="Search for people, jobs, skills..." />
    </label>

    <div class="header-actions">
      <button class="nitro-button" type="button" @click="emit('open-nitro')">
        <AppIcon name="sparkles" :size="14" />
        Nitro
      </button>

      <div class="header-shortcuts">
        <button class="icon-button" type="button">
          <AppIcon name="git-branch" :size="16" />
        </button>

        <button class="icon-button notification" type="button">
          <span class="badge-count">8</span>
          <AppIcon name="bell" :size="16" />
        </button>
      </div>

      <button class="profile-button" type="button">
        <div class="profile-copy">
          <strong>Tanya Ahmed</strong>
          <span>HEAD OF TALENT</span>
        </div>
        <div class="profile-avatar">TA</div>
      </button>
    </div>
  </header>
</template>

<style scoped>
.top-header,
.header-actions,
.header-shortcuts,
.profile-button {
  display: flex;
  align-items: center;
}

.top-header {
  gap: 18px;
  padding: 12px 22px;
  border-bottom: 1px solid #edf1f8;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
}

.icon-button {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8895aa;
  background: transparent;
}

.search-bar {
  flex: 1;
  min-width: 200px;
  max-width: 580px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9aa6bb;
  background: #fff;
}

.search-bar input {
  flex: 1;
  border: 0;
  outline: none;
  color: #1d2943;
  background: transparent;
  font-size: 12px;
}

.header-actions {
  margin-left: auto;
  gap: 14px;
}

.nitro-button {
  height: 36px;
  padding: 0 18px;
  border: 0;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  background: linear-gradient(90deg, #6758f4 0%, #6263eb 100%);
  box-shadow: 0 10px 18px rgba(103, 88, 244, 0.18);
}

.header-shortcuts {
  gap: 8px;
  padding-left: 16px;
  border-left: 1px solid #edf1f7;
}

.notification {
  position: relative;
}

.badge-count {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #ff5d6f;
  box-shadow: 0 0 0 2px #fff;
  font-size: 9px;
  font-weight: 800;
}

.profile-button {
  gap: 12px;
  padding-left: 16px;
  border: 0;
  border-left: 1px solid #edf1f7;
  background: transparent;
}

.profile-copy {
  text-align: right;
  line-height: 1.1;
}

.profile-copy strong {
  display: block;
  color: #1b2447;
  font-size: 12px;
  font-weight: 800;
}

.profile-copy span {
  display: block;
  margin-top: 2px;
  color: #8a97ac;
  font-size: 10px;
  letter-spacing: 0.05em;
}

.profile-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  background:
    radial-gradient(circle at 30% 30%, #ffd9c7, transparent 32%),
    linear-gradient(145deg, #6d422b, #f59a61);
}

.only-mobile {
  display: none;
}

@media (max-width: 720px) {
  .only-mobile {
    display: inline-flex;
  }

  .top-header {
    flex-wrap: wrap;
  }

  .search-bar {
    order: 2;
    max-width: none;
    width: 100%;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .header-shortcuts,
  .profile-button {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
