<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import AppIcon from '@/components/common/AppIcon.vue'
import SaleTableRow from '@/components/sale/SaleTableRow.vue'

import { getSales } from '@/services/sale.service'
import type { saleResponse } from '@/types/sale'

// =====================================================
// Sales
// =====================================================

const sales = ref<saleResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// =====================================================
// Search
// =====================================================

const search = ref('')

// =====================================================
// Pagination
// =====================================================

const page = ref(1)
const pageSize = 10

// =====================================================
// Fetch sales
// =====================================================

const fetchSales = async () => {
  loading.value = true
  error.value = null

  try {
    sales.value = await getSales()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'បរាជ័យក្នុងការទាញយកទិន្នន័យការលក់'
  } finally {
    loading.value = false
  }
}

onMounted(fetchSales)

// =====================================================
// Search
// =====================================================

const filtered = computed(() => {
  const text = search.value.toLowerCase().trim()

  if (!text) {
    return sales.value
  }

  return sales.value.filter((sale) => {
    return (
      sale.saleId.toString().includes(text) ||
      sale.staffName.toLowerCase().includes(text) ||
      sale.details.some((detail) => detail.productName.toLowerCase().includes(text))
    )
  })
})

// =====================================================
// Pagination
// =====================================================

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filtered.value.length / pageSize))
})

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize

  return filtered.value.slice(start, start + pageSize)
})

const rangeLabel = computed(() => {
  if (filtered.value.length === 0) {
    return '0 នៃ 0'
  }

  const start = (page.value - 1) * pageSize + 1

  const end = Math.min(page.value * pageSize, filtered.value.length)

  return `${start} ដល់ ${end} នៃ ${filtered.value.length}`
})

// =====================================================
// Search watcher
// =====================================================

watch(search, () => {
  page.value = 1
})

// =====================================================
// Total sales amount
// =====================================================

const totalAmount = computed(() => {
  return sales.value.reduce((total, sale) => total + sale.totalAmount, 0)
})
</script>

<template>
  <div class="p-6 bg-[#f5f5f5] font-kantumruy">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-[26px] font-extrabold text-slate-800">ការលក់</h1>

        <p class="text-[12px] text-slate-400 mt-1 flex items-center gap-1">
          <AppIcon name="bag" :size="11" />

          សរុប:

          <span class="font-semibold text-slate-600">
            {{ sales.length.toLocaleString() }}
          </span>

          <span class="text-slate-300"> ប្រតិបត្តិការ </span>
        </p>
      </div>

      <!-- Total amount -->
      <div class="bg-white border border-slate-100 rounded-xl px-5 py-3">
        <p class="text-[11px] text-slate-400">ចំណូលសរុប</p>

        <p class="text-[18px] font-bold text-slate-800">${{ totalAmount.toFixed(2) }}</p>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- FILTER BAR -->
    <!-- ================================================= -->

    <div class="flex items-center justify-end mb-3">
      <!-- Search -->
      <div
        class="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-2 w-64"
      >
        <AppIcon name="search" :size="13" class="text-slate-400" />

        <input
          v-model="search"
          type="text"
          placeholder="ស្វែងរកការលក់"
          class="bg-transparent outline-none text-[12px] text-slate-600 placeholder:text-slate-400 w-full"
        />
      </div>
    </div>

    <!-- ================================================= -->
    <!-- TABLE -->
    <!-- ================================================= -->

    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <!-- Loading -->
      <p v-if="loading" class="text-xs text-slate-400 p-6">កំពុងផ្ទុកទិន្នន័យការលក់...</p>

      <!-- Error -->
      <p v-else-if="error" class="text-xs text-red-500 p-6">
        {{ error }}
      </p>

      <!-- Empty -->
      <p v-else-if="filtered.length === 0" class="text-xs text-slate-400 p-6">
        រកមិនឃើញទិន្នន័យការលក់ឡើយ។
      </p>

      <!-- Table -->
      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-100">
            <th class="px-4 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              លេខសម្គាល់
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              កាលបរិច្ឆេទ
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              បុគ្គលិក
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              មុខទំនិញ
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              សរុប
            </th>
          </tr>
        </thead>

        <tbody>
          <SaleTableRow v-for="sale in paginated" :key="sale.saleId" :sale="sale" />
        </tbody>
      </table>

      <!-- ================================================= -->
      <!-- PAGINATION -->
      <!-- ================================================= -->

      <div
        v-if="filtered.length > 0"
        class="flex items-center justify-between px-4 py-3 border-t border-slate-100"
      >
        <span class="text-[12px] text-slate-400">
          {{ rangeLabel }}
        </span>

        <div class="flex items-center gap-1">
          <!-- First -->
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30"
            :disabled="page === 1"
            @click="page = 1"
          >
            <AppIcon name="chevronLeft" :size="12" />

            <AppIcon name="chevronLeft" :size="12" class="-ml-2.5" />
          </button>

          <!-- Previous -->
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30"
            :disabled="page === 1"
            @click="page--"
          >
            <AppIcon name="chevronLeft" :size="13" />
          </button>

          <!-- Page -->
          <span class="text-[12px] text-slate-500 px-2">
            ទំព័រទី {{ page }} នៃ {{ totalPages }}
          </span>

          <!-- Next -->
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30"
            :disabled="page === totalPages"
            @click="page++"
          >
            <AppIcon name="chevronRight" :size="13" />
          </button>

          <!-- Last -->
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30"
            :disabled="page === totalPages"
            @click="page = totalPages"
          >
            <AppIcon name="chevronRight" :size="12" />

            <AppIcon name="chevronRight" :size="12" class="-ml-2.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
