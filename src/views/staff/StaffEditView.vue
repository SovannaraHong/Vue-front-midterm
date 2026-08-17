<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { staffResponse } from '@/types/staff'
import { getStaffById } from '@/services/staff.service'
import StaffForm from '@/components/staff/StaffForm.vue'

const route = useRoute()
const router = useRouter()

const staff = ref<staffResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)

  if (!id || Number.isNaN(id)) {
    error.value = 'Invalid staff ID.'
    loading.value = false
    return
  }

  try {
    staff.value = await getStaffById(id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load staff'
  } finally {
    loading.value = false
  }
})

const handleSaved = () => {
  router.push('/staff')
}

const handleCancel = () => {
  router.push('/staff')
}
</script>

<template>
  <div class="p-6 bg-[#f5f5f5]">
    <!-- Loading -->
    <p v-if="loading" class="text-xs text-slate-400">Loading staff...</p>

    <!-- Error -->
    <div v-else-if="error" class="bg-white rounded-2xl border border-red-100 p-6">
      <p class="text-xs text-red-500">
        {{ error }}
      </p>

      <button
        type="button"
        class="mt-4 text-[13px] font-semibold text-white bg-slate-900 rounded-full px-4 py-2"
        @click="router.push('/staff')"
      >
        Back to staff
      </button>
    </div>

    <!-- Staff Form -->
    <StaffForm v-else-if="staff" :staff="staff" @saved="handleSaved" @cancel="handleCancel" />
  </div>
</template>
