<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useDonutChart, type DonutSlice } from '@/composables/useDonutChart'

import { getSales } from '@/services/sale.service'
import { getAllProducts } from '@/services/product.service'

import type { saleResponse } from '@/types/sale'
import type { Product } from '@/types/product'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const sales = ref<saleResponse[]>([])
const products = ref<Product[]>([])

const loading = ref(false)
const error = ref<string | null>(null)

// =====================================================
// Category sales
// =====================================================

const categorySales = computed(() => {
  const result: Record<string, number> = {}

  for (const sale of sales.value) {
    for (const detail of sale.details) {
      const product = products.value.find((item) => item.pid === detail.productId)

      const categoryName = product?.categoryName ?? 'Other'

      if (!result[categoryName]) {
        result[categoryName] = 0
      }

      result[categoryName] += detail.subtotal
    }
  }

  return result
})

const topCategories = computed(() => {
  return Object.entries(categorySales.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
})

const totalCategorySales = computed(() => {
  return Object.values(categorySales.value).reduce((total, value) => total + value, 0)
})

// =====================================================
// Donut slices
// =====================================================

const colors = ['#7b5cf0', '#f0327c', '#f6a93b']

const slices = ref<DonutSlice[]>([])

const updateChart = async () => {
  slices.value = topCategories.value.map(([label, value], index) => ({
    label,
    value: totalCategorySales.value > 0 ? Math.round((value / totalCategorySales.value) * 100) : 0,
    color: colors[index] ?? '#94a3b8',
  }))

  await nextTick()

  if (canvasRef.value) {
    useDonutChart(canvasRef, slices.value)
  }
}

const dotClass = (index: number) => {
  const classes = ['bg-violet-500', 'bg-pink-500', 'bg-amber-400']
  return classes[index] ?? 'bg-slate-400'
}

// =====================================================
// Fetch API
// =====================================================

const fetchTraffic = async () => {
  loading.value = true
  error.value = null

  try {
    const [salesData, productsData] = await Promise.all([getSales(), getAllProducts()])

    sales.value = salesData
    products.value = productsData

    // Let the canvas render into the DOM first, THEN draw the chart
    loading.value = false
    await updateChart()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch category sales'
    loading.value = false
  }
}

const topPercent = computed(() => slices.value[0]?.value ?? 0)
onMounted(fetchTraffic)
</script>

<template>
  <div class="bg-white rounded-2xl p-5 shadow-soft flex flex-col">
    <h2 class="font-bold text-slate-800 mb-4">Traffic</h2>

    <p v-if="loading" class="text-xs text-slate-400">Loading sales...</p>

    <p v-else-if="error" class="text-xs text-red-500">
      {{ error }}
    </p>

    <p v-else-if="topCategories.length === 0" class="text-xs text-slate-400">
      No sales data found.
    </p>

    <div v-else class="flex flex-col items-center gap-4">
      <!-- Donut chart with centered percentage -->
      <div class="relative w-40 h-40 shrink-0">
        <canvas ref="canvasRef" class="w-full h-full" />

        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="text-2xl font-extrabold text-slate-800">{{ topPercent }}%</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-5">
        <div
          v-for="(category, index) in topCategories"
          :key="category[0]"
          class="flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :class="dotClass(index)" />

          <div class="flex flex-col leading-tight">
            <span class="text-sm font-extrabold text-slate-800"
              >{{ slices[index]?.value ?? 0 }}%</span
            >
            <span class="text-[11px] text-slate-400 truncate max-w-[100px]">{{ category[0] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
