<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ActivityItem } from '@/types/dashboard'
import { getActivities } from '@/services/dashboard.service'

const activities = ref<ActivityItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchActivities = async () => {
  loading.value = true
  error.value = null
  try {
    activities.value = await getActivities()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch activities'
  } finally {
    loading.value = false
  }
}

onMounted(fetchActivities)
</script>

<template>
  <div class="bg-white rounded-2xl p-5 shadow-soft">
    <h2 class="font-bold text-slate-800 mb-5">Recent Activities</h2>

    <p v-if="loading" class="text-xs text-slate-400">Loading...</p>
    <p v-else-if="error" class="text-xs text-red-500">{{ error }}</p>

    <ol v-else class="relative border-l-2 border-dashed border-slate-100 ml-2.5 space-y-6">
      <li v-for="(activity, i) in activities" :key="i" class="ml-5 relative">
        <span
          class="absolute -left-[27px] top-0 w-4 h-4 rounded-full ring-4 ring-white"
          :class="activity.dotClass"
        />
        <div class="text-[10px] text-slate-400">{{ activity.time }}</div>
        <div class="text-[13px] font-semibold text-slate-700 mt-0.5">{{ activity.title }}</div>
        <div class="text-[11px] text-slate-400">{{ activity.by }}</div>
      </li>
    </ol>
  </div>
</template>
