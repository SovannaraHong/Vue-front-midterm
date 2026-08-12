<script setup lang="ts">
import { computed } from 'vue'
import type { GradientStatCard, GradientTone } from '@/types/dashboard'

const props = defineProps<{ card: GradientStatCard }>()

const toneClass: Record<GradientTone, string> = {
  pink: 'bg-gradient-to-br from-[#f0327c] to-[#f76b8a]',
  purple: 'bg-gradient-to-br from-[#7b5cf0] to-[#a78bfa]',
  blue: 'bg-gradient-to-br from-[#3aa9f0] to-[#63c4f5]',
  orange: 'bg-gradient-to-br from-[#f6a93b] to-[#fbbf5c]',
}

const gradientClass = computed(() => toneClass[props.card.tone])
</script>

<template>
  <div
    class="rounded-2xl p-4 text-white shadow-card flex flex-col justify-between min-h-[128px]"
    :class="gradientClass"
  >
    <div class="flex items-center justify-between">
      <span class="text-[12px] font-medium opacity-90">{{ card.title }}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        stroke-width="2"
        class="opacity-80"
      >
        <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <div class="flex items-end justify-between mt-3">
      <div>
        <div class="text-2xl font-extrabold">$ {{ card.value }}</div>
        <div v-if="card.sub" class="text-[11px] opacity-80 mt-0.5">{{ card.sub }}</div>
      </div>
      <svg viewBox="0 0 100 30" class="w-16 h-8 opacity-90">
        <polyline
          :points="card.points"
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>
