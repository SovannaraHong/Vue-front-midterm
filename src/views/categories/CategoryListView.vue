<template>
  <div>
    <h1 class="text-red-300">Categories</h1>

    <ul>
      <li v-for="category in categories" :key="category.catId">
        {{ category.categoryName }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types/category'
import { onMounted, ref } from 'vue'
import { getCategories } from '@/services/category.service'

const categories = ref<Category[]>([])

const loadCategories = async () => {
  try {
    categories.value = await getCategories()
    console.log('Categories loaded:', categories.value)
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style lang="scss" scoped></style>
