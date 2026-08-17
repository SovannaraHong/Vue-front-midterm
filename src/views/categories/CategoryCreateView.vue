<script setup lang="ts">
import { useRouter } from 'vue-router'
import CategoryForm from '@/components/categories/CategoryForm.vue'

const router = useRouter()
</script>

<template>
  <div class="p-6 bg-[#f5f5f5] min-h-full">
    <CategoryForm @saved="router.push('/categories')" @cancel="router.push('/categories')" />
  </div>
</template>
