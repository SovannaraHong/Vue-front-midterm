<script setup lang="ts">
import type { StatPillData } from '@/types/dashboard'
import AppIcon from '@/components/common/AppIcon.vue'

defineProps<{ pill: StatPillData }>()
</script>

<template>
  <div
    class="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-soft flex-1 min-w-[190px]"
  >
    <div
      class="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
      :class="pill.gradientClass"
    >
      <AppIcon :name="pill.icon" :size="18" />
    </div>
    <div class="leading-tight">
      <div class="text-[13px] font-bold text-slate-800">{{ pill.value }}</div>
      <div class="text-[11px] text-slate-400">{{ pill.label }}</div>
    </div>
  </div>
</template>
