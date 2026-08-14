<script setup lang="ts">
import type { Product } from '@/types/product'
import AppIcon from '@/components/common/AppIcon.vue'

defineProps<{ product: Product }>()
const emit = defineEmits<{ (e: 'add', product: Product): void }>()
</script>

<template>
  <div
    class="bg-white rounded-2xl p-2.5 border font-sans border-slate-100 hover:shadow-md transition-shadow"
  >
    <!-- Photo + hang-tag price -->
    <div class="relative rounded-xl overflow-hidden bg-slate-100">
      <img
        :src="
          product.imageUrl
            ? `http://localhost:8080${product.imageUrl}`
            : 'https://placehold.net/main.svg'
        "
        :alt="product.productName"
        class="w-full h-52 object-cover"
      />

      <button
        class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-slate-400 hover:text-pink-500 shadow-sm"
      >
        <AppIcon name="heart" :size="14" />
      </button>

      <!-- Hang tag: die-cut price badge, top-left, overlapping the edge -->
      <div class="absolute top-2.5 -left-1">
        <svg width="64" height="30" viewBox="0 0 64 30" class="drop-shadow-sm">
          <path d="M4 0 H54 L64 15 L54 30 H4 Z" fill="#B98B4E" />
          <circle cx="14" cy="15" r="3" fill="white" />
        </svg>
        <span
          class="absolute left-5 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#3D2B0F]"
        >
          ${{ product.price.toFixed(2) }}
        </span>
      </div>
    </div>

    <!-- Stitch divider -->
    <div class="border-t border-dashed border-slate-300 mx-0.5 mt-2.5"></div>

    <!-- Details -->
    <div class="pt-2.5 px-0.5">
      <h3 class="text-[15px] font-medium text-slate-800 leading-snug line-clamp-2">
        {{ product.productName }}
      </h3>
      <p class="text-[11px] text-slate-400 mt-1 line-clamp-1">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between mt-2.5">
        <span
          class="flex items-center gap-1 text-[11px]"
          :class="product.sQty > 0 ? 'text-slate-500' : 'text-red-500 font-medium'"
        >
          <AppIcon name="tag" :size="11" />
          {{ product.sQty > 0 ? `${product.sQty} left` : 'Out of stock' }}
        </span>
        <span class="flex items-center gap-1 text-[11px] text-slate-600">
          <AppIcon name="star" :size="12" class="text-amber-400 fill-amber-400" />
          5.0
        </span>
      </div>

      <button
        class="w-full mt-2.5 flex items-center justify-center gap-1.5 bg-[#6B2438] hover:bg-[#5A1E2F] text-white text-[12px] font-medium rounded-lg py-2"
        @click="emit('add', product)"
      >
        <AppIcon name="bag" :size="14" />
        Add to bag
      </button>
    </div>
  </div>
</template>
