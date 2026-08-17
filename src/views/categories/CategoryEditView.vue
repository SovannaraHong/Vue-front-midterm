<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Category } from '@/types/category'
import { getCategoryById } from '@/services/category.service'
import CategoryForm from '@/components/categories/CategoryForm.vue'

const route = useRoute()
const router = useRouter()

const category = ref<Category | null>(null)

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const id = Number(route.params.id)

    if (!id) {
      throw new Error('Invalid category ID.')
    }

    category.value = await getCategoryById(id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load category.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6 bg-[#f5f5f5] min-h-full">
    <!-- Loading -->
    <p v-if="loading" class="text-xs text-slate-400">Loading category...</p>

    <!-- Error -->
    <p v-else-if="error" class="text-xs text-red-500 bg-red-50 rounded-lg p-3">
      {{ error }}
    </p>

    <!-- Form -->
    <CategoryForm
      v-else-if="category"
      :category="category"
      @saved="router.push('/categories')"
      @cancel="router.push('/categories')"
    />
  </div>
</template>
