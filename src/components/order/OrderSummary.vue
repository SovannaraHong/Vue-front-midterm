<script setup lang="ts">
import { ref } from 'vue'
import type { PaymentMethod } from '@/types/product'

defineProps<{
  itemsTotal: number
  discount: number
  totalAmount: number
}>()

const emit = defineEmits<{ (e: 'checkout', method: PaymentMethod): void }>()

// const methods: PaymentMethod[] = ['Cash', 'Debit', 'E-Wallet']
const activeMethod = ref<PaymentMethod>('Cash')
</script>

<template>
  <div>
    <div class="space-y-2 text-[12px]">
      <div class="flex items-center justify-between">
        <span class="text-slate-400">Items</span>
        <span class="font-semibold text-slate-700">${{ itemsTotal.toFixed(2) }}</span>
      </div>
      <!-- <div class="flex items-center justify-between">
        <span class="text-slate-400">Discount</span>
        <span class="font-semibold text-red-500">-${{ discount.toFixed(2) }}</span>
      </div> -->
      <div class="flex items-center justify-between pt-2 border-t border-slate-100">
        <span class="text-slate-500 font-medium">Total Amount</span>
        <span class="font-bold text-slate-800">${{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>

    <h4 class="text-[13px] font-bold text-slate-800 mt-6 mb-3">Payments</h4>
    <!-- <div class="flex items-center gap-2">
      <button
        v-for="method in methods"
        :key="method"
        class="flex-1 text-[11px] font-semibold rounded-lg py-2 border transition-colors"
        :class="
          activeMethod === method
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
        "
        @click="activeMethod = method"
      >
        {{ method }}
      </button>
    </div> -->

    <button
      class="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-semibold rounded-xl py-3"
      @click="emit('checkout', activeMethod)"
    >
      Checkout
    </button>
  </div>
</template>
