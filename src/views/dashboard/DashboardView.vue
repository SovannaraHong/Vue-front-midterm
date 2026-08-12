<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { GradientStatCard as GradientStatCardType } from '@/types/dashboard'
import { getGradientStatCards } from '@/services/dashboard.service'

import EarningsChartCard from '@/components/dashboard/EarningsChartCard.vue'
import TrafficCard from '@/components/dashboard/TrafficCard.vue'
import GradientStatCard from '@/components/dashboard/GradientStatCard.vue'
import RecentActivities from '@/components/dashboard/RecentActivities.vue'
import OrderStatusTable from '@/components/dashboard/OrderStatusTable.vue'

const gradientCards = ref<GradientStatCardType[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchGradientCards = async () => {
  loading.value = true
  error.value = null
  try {
    gradientCards.value = await getGradientStatCards()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch stat cards'
  } finally {
    loading.value = false
  }
}

onMounted(fetchGradientCards)
</script>

<template>
  <main class="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
    <p v-if="loading" class="text-xs text-slate-400">Loading...</p>
    <p v-else-if="error" class="text-xs text-red-500">{{ error }}</p>
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <GradientStatCard v-for="(card, i) in gradientCards" :key="i" :card="card" />
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <EarningsChartCard />
      <TrafficCard />
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <RecentActivities />
      <OrderStatusTable />
    </div>
  </main>
</template>
