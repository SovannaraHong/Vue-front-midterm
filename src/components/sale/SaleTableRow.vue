<script setup lang="ts">
import type { saleResponse } from '@/types/sale'

defineProps<{
  sale: saleResponse
}>()
</script>

<template>
  <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
    <!-- Sale ID -->
    <td class="px-4 py-3 text-[12px] font-semibold text-slate-600">#{{ sale.saleId }}</td>

    <!-- Date -->
    <td class="px-2 py-3 text-[12px] text-slate-500">
      {{ new Date(sale.saleDate).toLocaleDateString() }}
    </td>

    <!-- Staff -->
    <td class="px-2 py-3 text-[12px] font-semibold text-slate-700">
      {{ sale.staffName }}
    </td>

    <!-- Products -->
    <td class="px-2 py-3">
      <div class="flex flex-col gap-1">
        <div
          v-for="detail in sale.details"
          :key="detail.saleDetailId"
          class="flex items-center gap-2 text-[12px]"
        >
          <span class="font-medium text-slate-700">
            {{ detail.productName }}
          </span>

          <span class="text-slate-400"> × {{ detail.quantity }} </span>
        </div>

        <span v-if="sale.details.length === 0" class="text-[12px] text-slate-400">
          No details
        </span>
      </div>
    </td>

    <!-- Total -->
    <td class="px-2 py-3 text-[12px] font-bold text-slate-700">
      ${{ sale.totalAmount.toFixed(2) }}
    </td>

    <!-- View -->
    <!-- <td class="px-4 py-3 text-right">
      <button type="button" class="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800">
        View
      </button>
    </td> -->
  </tr>
</template>
