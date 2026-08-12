<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { DateRange, StatPillData } from '@/types/dashboard'
import { useLineChart } from '@/composables/useLineChart'
import StatPill from '@/components/dashboard/StatPill.vue'

const ranges: DateRange[] = ['Daily', 'Weekly', 'Monthly', 'Yearly']
const activeRange = ref<DateRange>('Monthly')

const canvasRef = ref<HTMLCanvasElement | null>(null)
useLineChart(canvasRef)

const pills = ref<StatPillData[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchPills = async () => {
  loading.value = true
  error.value = null
  try {
    // Replace with a real endpoint, e.g. await getWalletSummary()
    pills.value = [
      {
        label: 'Wallet Balance',
        value: '$4,567.53',
        icon: 'star',
        gradientClass: 'bg-gradient-to-br from-[#f0327c] to-[#f76b8a]',
      },
      {
        label: 'Referral Earning',
        value: '$1689.53',
        icon: 'user',
        gradientClass: 'bg-gradient-to-br from-[#7b5cf0] to-[#a78bfa]',
      },
      {
        label: 'Estimate Sales',
        value: '$2851.53',
        icon: 'barChart',
        gradientClass: 'bg-gradient-to-br from-[#3aa9f0] to-[#63c4f5]',
      },
      {
        label: 'Earning',
        value: '$52,567.53',
        icon: 'mail',
        gradientClass: 'bg-gradient-to-br from-[#f6a93b] to-[#fbbf5c]',
      },
    ]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch wallet summary'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPills)
</script>

<template>
  <div class="xl:col-span-2 bg-white rounded-2xl p-5 shadow-soft">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h2 class="font-bold text-slate-800">Dashboard</h2>
        <p class="text-[11px] text-slate-400 mt-0.5">Overview of Latest Months</p>
      </div>

      <div class="flex items-center gap-4 text-[12px] font-medium">
        <button
          v-for="r in ranges"
          :key="r"
          class="pb-1 border-b-2 transition-colors"
          :class="
            activeRange === r
              ? 'text-pink-600 border-pink-500'
              : 'text-slate-400 border-transparent hover:text-slate-600'
          "
          @click="activeRange = r"
        >
          {{ r.toUpperCase() }}
        </button>
      </div>

      <div class="flex items-center gap-4 text-[11px] text-slate-500">
        <span class="flex items-center gap-1.5"
          ><span class="w-2 h-2 rounded-full bg-sky-400" />Online</span
        >
        <span class="flex items-center gap-1.5"
          ><span class="w-2 h-2 rounded-full bg-pink-500" />Store</span
        >
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6">
      <div class="flex sm:flex-col gap-8 sm:gap-6 sm:w-40 shrink-0">
        <div>
          <div class="text-2xl font-extrabold text-slate-800">$3468.96</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Current Month Earnings</div>
        </div>
        <div>
          <div class="text-2xl font-extrabold text-slate-800">82</div>
          <div class="text-[11px] text-slate-400 mt-0.5">Current Month Sales</div>
        </div>
        <button
          class="hidden sm:flex items-center justify-center gap-1 bg-pink-500 hover:bg-pink-600 text-white text-[12px] font-semibold rounded-full px-4 py-2 mt-1 w-fit shadow-md shadow-pink-200"
        >
          Last Month Summary
        </button>
      </div>
      <div class="h-56">
        <canvas ref="canvasRef" />
      </div>
    </div>

    <p v-if="error" class="text-xs text-red-500 mt-4">{{ error }}</p>
    <div v-else class="flex flex-wrap gap-3 mt-5">
      <StatPill v-for="pill in pills" :key="pill.label" :pill="pill" />
    </div>
  </div>
</template>
