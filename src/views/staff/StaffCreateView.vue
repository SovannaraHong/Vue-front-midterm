<script setup lang="ts">
import { useRouter } from 'vue-router'
import StaffForm from '@/components/staff/StaffForm.vue'

const router = useRouter()
</script>

<template>
  <div class="p-6 bg-[#f5f5f5]">
    <StaffForm @saved="router.push('/staff')" @cancel="router.push('/staff')" />
  </div>
</template>
