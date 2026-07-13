<script setup>
import nitrosyncMark from '../../assets/nitrosync-logo.png'

const props = defineProps({
  mode: {
    type: String,
    default: 'full',
  },
  size: {
    type: String,
    default: 'md',
  },
  showTagline: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div
    class="nitrosync-logo"
    :class="[`is-${size}`, `is-${mode}`, { 'has-tagline': showTagline && mode !== 'mark' }]"
    aria-label="NitroSync"
  >
    <img class="nitrosync-logo__mark" :src="nitrosyncMark" alt="" aria-hidden="true">

    <div v-if="mode !== 'mark'" class="nitrosync-logo__copy">
      <strong class="nitrosync-logo__wordmark">NitroSync</strong>
      <span v-if="showTagline" class="nitrosync-logo__tagline">
        Recruitment in another perspective
      </span>
    </div>
  </div>
</template>

<style scoped>
.nitrosync-logo {
  --logo-gap: 10px;
  --logo-mark-size: 34px;
  --logo-word-size: 27px;
  --logo-tagline-size: 9px;
  --logo-tagline-max: 240px;
  display: inline-flex;
  align-items: center;
  gap: var(--logo-gap);
  line-height: 1;
}

.nitrosync-logo.is-xs {
  --logo-gap: 8px;
  --logo-mark-size: 20px;
  --logo-word-size: 14px;
  --logo-tagline-size: 7px;
  --logo-tagline-max: 132px;
}

.nitrosync-logo.is-sm {
  --logo-gap: 9px;
  --logo-mark-size: 26px;
  --logo-word-size: 20px;
  --logo-tagline-size: 7.5px;
  --logo-tagline-max: 170px;
}

.nitrosync-logo.is-md {
  --logo-gap: 10px;
  --logo-mark-size: 34px;
  --logo-word-size: 27px;
  --logo-tagline-size: 9px;
  --logo-tagline-max: 240px;
}

.nitrosync-logo.is-lg {
  --logo-gap: 12px;
  --logo-mark-size: 42px;
  --logo-word-size: 34px;
  --logo-tagline-size: 10px;
  --logo-tagline-max: 280px;
}

.nitrosync-logo.is-xl {
  --logo-gap: 14px;
  --logo-mark-size: 52px;
  --logo-word-size: 42px;
  --logo-tagline-size: 12px;
  --logo-tagline-max: 340px;
}

.nitrosync-logo.is-mark {
  --logo-gap: 0;
}

.nitrosync-logo__mark {
  width: var(--logo-mark-size);
  height: var(--logo-mark-size);
  flex: 0 0 auto;
  display: block;
  object-fit: contain;
}

.nitrosync-logo__copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.nitrosync-logo__wordmark {
  color: #ff4f9c;
  font-size: var(--logo-word-size);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.92;
}

.nitrosync-logo__tagline {
  max-width: var(--logo-tagline-max);
  color: #dd789d;
  font-size: var(--logo-tagline-size);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: 0.01em;
}
</style>
