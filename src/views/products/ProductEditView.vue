<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '@/types/product'
import { getProductById } from '@/services/product.service'
import ProductForm from '@/components/product/ProductForm.vue'

const route = useRoute()
const router = useRouter()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    product.value = await getProductById(Number(route.params.id))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load product'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6 bg-[#f5f5f5]">
    <p v-if="loading" class="text-xs text-slate-400">Loading product...</p>
    <p v-else-if="error" class="text-xs text-red-500">{{ error }}</p>
    <ProductForm
      v-else-if="product"
      :product="product"
      @saved="router.push('/products')"
      @cancel="router.push('/products')"
    />
  </div>
</template>
