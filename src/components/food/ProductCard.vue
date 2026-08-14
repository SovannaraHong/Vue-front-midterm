<script setup lang="ts">
import type { Product } from '@/types/product'
import AppIcon from '@/components/common/AppIcon.vue'

defineProps<{ product: Product }>()
const emit = defineEmits<{ (e: 'add', product: Product): void }>()
</script>

<template>
  <div class="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow">
    <div class="relative">
     <img
  :src="
    product.imageUrl
      ? `http://localhost:8080${product.imageUrl}`
      : 'https://via.placeholder.com/150'
  "
  :alt="product.productName"
  class="w-full h-58 object-cover rounded-xl bg-slate-100"
/>
      <button
        class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-slate-400 hover:text-pink-500 shadow-sm"
      >
        <AppIcon name="heart" :size="14" />
      </button>
    </div>

    <div class="mt-3 flex items-start justify-between gap-2">
      <h3 class="text-[13px] font-bold text-slate-800 leading-tight">{{ product.productName }}</h3>
      <span class="text-[13px] font-bold text-emerald-600 whitespace-nowrap"
        >${{ product.price.toFixed(2) }}</span
      >
    </div>

    <p class="text-[11px] text-slate-400 mt-1 line-clamp-1">
      With Onion, cheese, Olives And many more...
    </p>

    <div class="flex items-center justify-between mt-3">
      <span class="flex items-center gap-1 text-[12px] font-medium text-slate-700">
        <AppIcon name="star" :size="13" class="text-amber-400 fill-amber-400" />
        5.0
      </span>
      <button
        class="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg px-3 py-1.5"
        @click="emit('add', product)"
      >
        Add to cart
      </button>
    </div>
  </div>
</template>
