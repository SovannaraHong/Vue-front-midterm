<script setup lang="ts">
import type { Product } from '@/types/product'
import ProductActionsMenu from './ProductActionsMenu.vue'

defineProps<{ product: Product; selected: boolean }>()
const emit = defineEmits<{
  (e: 'toggle-select', id: number): void
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}>()

const isLowStock = (qty: number) => qty <= 5
</script>

<template>
  <tr
    class="border-b border-slate-50 last:border-0 transition-colors"
    :class="selected ? 'bg-pink-50/60' : 'hover:bg-slate-50/60'"
  >
    <td class="px-4 py-3">
      <input
        type="checkbox"
        :checked="selected"
        class="accent-pink-500 w-4 h-4 rounded"
        @change="emit('toggle-select', product.pid)"
      />
    </td>
    <td class="px-2 py-3 text-[12px] text-slate-500">{{ product.pid }}</td>
    <td class="px-2 py-3">
      <div class="flex items-center gap-3">
        <img
          :src="
            product.imageUrl
              ? `http://localhost:8080${product.imageUrl}`
              : 'https://placehold.net/main.svg'
          "
          :alt="product.productName"
          class="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
        />
        <span class="text-[13px] font-semibold text-slate-700 line-clamp-1">{{
          product.productName
        }}</span>
      </div>
    </td>

    <td class="px-2 py-3 text-[12px] text-slate-500">{{ product.categoryName }}</td>
    <td class="px-2 py-3 text-[12px] font-semibold text-slate-700">
      ${{ product.price.toFixed(2) }}
    </td>

    <td class="px-2 py-3">
      <span
        class="text-[12px] font-medium"
        :class="isLowStock(product.sQty) ? 'text-red-500' : 'text-slate-600'"
      >
        {{ product.sQty }}
      </span>
    </td>

    <td class="px-2 py-3 text-[12px] text-slate-500">{{ product.expiredDate }}</td>
    <td class="px-2 py-3 text-[12px]">
      <span
        class="px-2.5 py-1 rounded-full text-[11px] font-medium"
        :class="product.status ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'"
      >
        {{ product.status ? 'Active' : 'Inactive' }}
      </span>
    </td>

    <td class="px-4 py-3">
      <div class="flex items-center justify-end">
        <ProductActionsMenu
          @edit="emit('edit', product.pid)"
          @delete="emit('delete', product.pid)"
        />
      </div>
    </td>
  </tr>
</template>
