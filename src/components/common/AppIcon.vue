<script setup lang="ts">
import { ICON_PATHS, type IconName } from '@/types/icon'

interface Props {
  name: IconName
  size?: number
  strokeWidth?: number
}

withDefaults(defineProps<Props>(), {
  size: 18,
  strokeWidth: 2,
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="strokeWidth"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path :d="ICON_PATHS[name]" />
  </svg>
</template>
