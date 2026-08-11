<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Category } from '@/types/category'
import { getCategories } from '@/services/category.service'

const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchCategories = async () => {
  loading.value = true
  error.value = null

  try {
    categories.value = await getCategories()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch categories'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div>
    <p v-if="loading">Loading...</p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <ul v-else>
      <li v-for="category in categories" :key="category.catId">
        {{ category.categoryName }}
      </li>
    </ul>
  </div>
</template>
