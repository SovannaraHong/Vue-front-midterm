<script setup lang="ts">
import { useRouter } from 'vue-router'
import ProductForm from '@/components/product/ProductForm.vue'

const router = useRouter()
</script>

<template>
  <div class="p-6">
    <ProductForm @saved="router.push('/products')" @cancel="router.push('/products')" />
  </div>
</template>
