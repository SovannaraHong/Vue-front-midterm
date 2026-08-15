<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import ProductTableRow from '@/components/product/ProductTableRow.vue'
import TablePagination from '@/components/common/TablePagination.vue'
import { useProductList } from '@/composables/useProductList'

const {
  products,
  loading,
  error,
  search,
  page,
  totalPages,
  paginated,
  filtered,
  rangeLabel,
  selectedIds,
  allOnPageSelected,
  toggleSelectAll,
  toggleSelect,
  removeProduct,
  removeSelected,
} = useProductList()

const handleEdit = (id: number) => {
  // router.push(`/products/${id}/edit`)
  console.log('hello', id)
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-800">Products</h1>
        <p class="text-[12px] text-slate-400 mt-1">
          Total: <span class="font-semibold text-slate-600">{{ products.length }}</span>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-3.5 py-2 hover:bg-slate-50"
        >
          <AppIcon name="download" :size="13" />
          Export data
        </button>
        <button
          class="flex items-center gap-1.5 text-[12px] font-semibold text-white rounded-lg px-3.5 py-2 bg-gradient-to-r from-pink-500 to-pink-400 shadow-sm hover:shadow-md transition-shadow"
        >
          <AppIcon name="plus" :size="13" />
          Add product
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between mb-3">
      <div
        class="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-2 w-72"
      >
        <AppIcon name="search" :size="14" class="text-slate-400" />
        <input
          v-model="search"
          placeholder="Search products"
          class="bg-transparent outline-none text-[12px] text-slate-600 placeholder:text-slate-400 w-full"
        />
      </div>
      <div v-if="selectedIds.size > 0" class="flex items-center gap-2">
        <span class="text-[12px] text-slate-500">{{ selectedIds.size }} selected</span>
        <button
          class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-red-500 hover:bg-red-50"
          @click="removeSelected"
        >
          <AppIcon name="trash" :size="14" />
        </button>
      </div>
      <button
        v-else
        class="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50"
      >
        <AppIcon name="filter" :size="13" />
        All filters
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <p v-if="loading" class="text-xs text-slate-400 p-6">Loading products...</p>
      <p v-else-if="error" class="text-xs text-red-500 p-6">{{ error }}</p>
      <p v-else-if="filtered.length === 0" class="text-xs text-slate-400 p-6">No products found.</p>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-100">
            <th class="w-10 px-4 py-3">
              <input
                type="checkbox"
                :checked="allOnPageSelected"
                class="accent-pink-500 w-4 h-4 rounded"
                @change="toggleSelectAll"
              />
            </th>
            <th class="px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Product
            </th>
            <th class="px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Category
            </th>
            <th class="px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Price
            </th>
            <th class="px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Stock
            </th>
            <th class="px-2 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Expires
            </th>
            <th class="w-16 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <ProductTableRow
            v-for="product in paginated"
            :key="product.pid"
            :product="product"
            :selected="selectedIds.has(product.pid)"
            @toggle-select="toggleSelect"
            @edit="handleEdit"
            @delete="removeProduct"
          />
        </tbody>
      </table>

      <TablePagination
        v-if="filtered.length > 0"
        :page="page"
        :total-pages="totalPages"
        :range-label="rangeLabel"
        @update:page="page = $event"
      />
    </div>
  </div>
</template>
