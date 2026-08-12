<script setup lang="ts">
import { ref } from 'vue'
import { useDonutChart, type DonutSlice } from '@/composables/useDonutChart'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const slices: DonutSlice[] = [
  { label: 'Facebook', value: 33, color: '#7b5cf0' },
  { label: 'Youtube', value: 55, color: '#f0327c' },
  { label: 'Direct Search', value: 12, color: '#f6a93b' },
]

useDonutChart(canvasRef, slices)

const dotClass: Record<string, string> = {
  Facebook: 'bg-violet-500',
  Youtube: 'bg-pink-500',
  'Direct Search': 'bg-amber-400',
}
</script>

<template>
  <div class="bg-white rounded-2xl p-5 shadow-soft flex flex-col">
    <h2 class="font-bold text-slate-800">Traffic</h2>

    <div class="flex-1 flex items-center justify-center py-4">
      <div class="relative w-48 h-48">
        <canvas ref="canvasRef" />
      </div>
    </div>

    <div class="grid grid-cols-3 text-center gap-2">
      <div v-for="slice in slices" :key="slice.label">
        <div class="text-lg font-extrabold text-slate-800">{{ slice.value }}%</div>
        <div class="text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
          <span class="w-1.5 h-1.5 rounded-full" :class="dotClass[slice.label]" />
          {{ slice.label }}
        </div>
      </div>
    </div>
  </div>
</template>
