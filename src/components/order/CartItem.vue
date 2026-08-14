<script setup lang="ts">
import type { CartItem } from '@/types/product'
import AppIcon from '@/components/common/AppIcon.vue'

defineProps<{ item: CartItem }>()
const emit = defineEmits<{
  (e: 'increment', pid: number): void
  (e: 'decrement', pid: number): void
  (e: 'remove', pid: number): void
}>()
</script>

<template>
  <div class="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0">
    <img
      src="/images/notfound.svg"
      :alt="item.product.productName"
      class="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
    />

    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <h4 class="text-[12px] font-semibold text-slate-800 truncate">{{ item.product.productName }}</h4>
        <button class="text-slate-300 hover:text-red-500 shrink-0" @click="emit('remove', item.product.pid)">
          <AppIcon name="trash" :size="14" />
        </button>
      </div>
      <p class="text-[10px] text-slate-400">Small Bowl</p>
      <div class="flex items-center justify-between mt-1">
        <span class="text-[12px] font-bold text-emerald-600">${{ item.product.price.toFixed(0) }}</span>
        <div class="flex items-center gap-2">
          <button
            class="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
            @click="emit('increment', item.product.pid)"
          >
            <AppIcon name="plus" :size="11" :stroke-width="2.5" />
          </button>
          <span class="text-[11px] font-semibold text-slate-700 w-4 text-center">{{
            String(item.quantity).padStart(2, '0')
          }}</span>
          <button
            class="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
            @click="emit('decrement', item.product.pid)"
          >
            <AppIcon name="minus" :size="11" :stroke-width="2.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
