<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DateRange, StatPillData } from '@/types/dashboard'
import { useLineChart, type LineChartDataset } from '@/composables/useLineChart'
import StatPill from '@/components/dashboard/StatPill.vue'

import { getSales } from '@/services/sale.service'
import type { saleResponse } from '@/types/sale'

const ranges: DateRange[] = ['Daily', 'Weekly', 'Monthly', 'Yearly']
const activeRange = ref<DateRange>('Monthly')

const canvasRef = ref<HTMLCanvasElement | null>(null)
const lineChart = useLineChart(canvasRef)

const sales = ref<saleResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// =====================================================
// Current month sales
// =====================================================

const currentMonthSales = computed(() => {
  const now = new Date()

  return sales.value.filter((sale) => {
    const saleDate = new Date(sale.saleDate)
    return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
  })
})

const currentMonthEarnings = computed(() => {
  return currentMonthSales.value.reduce((total, sale) => total + Number(sale.totalAmount || 0), 0)
})

const currentMonthSalesCount = computed(() => currentMonthSales.value.length)

// =====================================================
// Last 6 months, oldest -> newest, real totals
// =====================================================

const monthlyTotals = computed(() => {
  const now = new Date()

  const months: { year: number; month: number; label: string }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: monthNames[d.getMonth()] ?? '',
    })
  }

  const totals = months.map(({ year, month }) => {
    return sales.value
      .filter((sale) => {
        const saleDate = new Date(sale.saleDate)
        return saleDate.getFullYear() === year && saleDate.getMonth() === month
      })
      .reduce((sum, sale) => sum + Number(sale.totalAmount || 0), 0)
  })

  return {
    labels: months.map((m) => m.label),
    totals,
  }
})

// =====================================================
// Stat pills (top staff by sale total this month)
// =====================================================

const pills = computed<StatPillData[]>(() => {
  const byStaff: Record<string, { total: number; count: number }> = {}

  for (const sale of currentMonthSales.value) {
    const name = sale.staffName || 'Unknown'
    if (!byStaff[name]) byStaff[name] = { total: 0, count: 0 }
    byStaff[name].total += Number(sale.totalAmount || 0)
    byStaff[name].count += 1
  }

  const gradients = [
    'bg-gradient-to-br from-[#f0327c] to-[#f76b8a]',
    'bg-gradient-to-br from-[#7b5cf0] to-[#a78bfa]',
    'bg-gradient-to-br from-[#3aa9f0] to-[#63c4f5]',
    'bg-gradient-to-br from-[#f6a93b] to-[#fbbf5c]',
  ]

  return Object.entries(byStaff)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 4)
    .map(([name, data], index) => ({
      label: name,
      value: `$${data.total.toFixed(2)}`,
      icon: 'star' as const,
      gradientClass: gradients[index] ?? 'bg-gradient-to-br from-[#f0327c] to-[#f76b8a]',
    }))
})

// =====================================================
// Fetch
// =====================================================

const fetchSales = async () => {
  loading.value = true
  error.value = null

  try {
    sales.value = await getSales()

    const { labels, totals } = monthlyTotals.value
    const datasets: LineChartDataset[] = [{ label: 'Sales', data: totals, color: '#ec4899' }]

    lineChart.update(labels, datasets)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch sales'
  } finally {
    loading.value = false
  }
}

onMounted(fetchSales)
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
          ><span class="w-2 h-2 rounded-full bg-pink-500" />Sales</span
        >
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6">
      <div class="flex sm:flex-col gap-8 sm:gap-6 sm:w-40 shrink-0">
        <div>
          <div class="text-2xl font-extrabold text-slate-800">
            ${{ currentMonthEarnings.toFixed(2) }}
          </div>
          <div class="text-[11px] text-slate-400 mt-0.5">Current Month Earnings</div>
        </div>
        <div>
          <div class="text-2xl font-extrabold text-slate-800">{{ currentMonthSalesCount }}</div>
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
    <p v-else-if="loading" class="text-xs text-slate-400 mt-4">Loading...</p>
    <div v-else class="flex flex-wrap gap-3 mt-5">
      <StatPill v-for="pill in pills" :key="pill.label" :pill="pill" />
    </div>
  </div>
</template>
