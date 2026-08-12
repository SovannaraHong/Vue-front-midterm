<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Order, OrderStatus } from '@/types/dashboard'
import { getOrders } from '@/services/dashboard.service'
import AppIcon from '@/components/common/AppIcon.vue'

const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const pages = [1, 2, 3, 4, 5]

const fetchOrders = async () => {
  loading.value = true
  error.value = null
  try {
    orders.value = await getOrders()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch orders'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

const badgeClass: Record<OrderStatus, string> = {
  Process: 'bg-pink-100 text-pink-600',
  Open: 'bg-violet-100 text-violet-600',
  'On Way': 'bg-sky-100 text-sky-600',
  Delivered: 'bg-emerald-100 text-emerald-600',
}

const statusClass = computed(
  () => (status: OrderStatus) => badgeClass[status] ?? 'bg-slate-100 text-slate-600',
)
</script>

<template>
  <div class="xl:col-span-2 bg-white rounded-2xl p-5 shadow-soft">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div>
        <h2 class="font-bold text-slate-800">Order Status</h2>
        <p class="text-[11px] text-slate-400 mt-0.5">Overview of Latest Months</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white text-[12px] font-semibold rounded-full px-4 py-2"
        >
          <AppIcon name="plus" :size="14" />Add
        </button>
        <button
          class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-200"
        >
          <AppIcon name="filter" :size="14" />
        </button>
        <button
          class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-200"
        >
          <AppIcon name="download" :size="14" />
        </button>
        <div class="hidden sm:flex items-center gap-2 bg-slate-50 rounded-full px-3 py-1.5">
          <AppIcon name="search" :size="13" class="text-slate-400" />
          <input
            placeholder="Search"
            class="bg-transparent outline-none text-xs text-slate-600 placeholder:text-slate-400 w-20"
          />
        </div>
      </div>
    </div>

    <p v-if="loading" class="text-xs text-slate-400">Loading...</p>
    <p v-else-if="error" class="text-xs text-red-500">{{ error }}</p>

    <div v-else class="overflow-x-auto -mx-1">
      <table class="w-full text-left border-separate border-spacing-y-2 px-1 min-w-[560px]">
        <thead>
          <tr class="bg-slate-800 text-white text-[11px] uppercase tracking-wide">
            <th class="py-3 px-4 rounded-l-lg font-semibold">Invoice</th>
            <th class="py-3 px-4 font-semibold">Customers</th>
            <th class="py-3 px-4 font-semibold">From</th>
            <th class="py-3 px-4 font-semibold">Price</th>
            <th class="py-3 px-4 rounded-r-lg font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(order, i) in orders"
            :key="i"
            class="text-[12px] text-slate-600 hover:bg-slate-50"
          >
            <td class="py-2.5 px-4">{{ order.invoice }}</td>
            <td class="py-2.5 px-4 font-medium text-slate-700">{{ order.customer }}</td>
            <td class="py-2.5 px-4">{{ order.from }}</td>
            <td class="py-2.5 px-4">{{ order.price }}</td>
            <td class="py-2.5 px-4">
              <span
                class="text-[10px] font-semibold px-3 py-1 rounded-full"
                :class="statusClass(order.status)"
              >
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between mt-4 text-[11px] text-slate-400">
      <span>Showing 1 to 20 of 20 entries</span>
      <div class="flex items-center gap-1">
        <button class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100">
          <AppIcon name="chevronLeft" :size="14" />
        </button>
        <button
          v-for="p in pages"
          :key="p"
          class="w-7 h-7 rounded-full text-[11px] font-semibold flex items-center justify-center"
          :class="
            currentPage === p ? 'bg-pink-500 text-white' : 'hover:bg-slate-100 text-slate-500'
          "
          @click="currentPage = p"
        >
          {{ p }}
        </button>
        <button class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100">
          <AppIcon name="chevronRight" :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>
