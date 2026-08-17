<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppIcon from '@/components/common/AppIcon.vue'
import ProductTableRow from '@/components/product/ProductTableRow.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

import { useProductList } from '@/composables/useProductList'

import type { Category } from '@/types/category'
import { getCategories } from '@/services/category.service'

const router = useRouter()

// =====================================================
// Product list
// =====================================================

const {
  products,
  loading,
  error,

  search,
  selectedCategory,

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

// =====================================================
// Row menu
// =====================================================

const openMenuId = ref<number | null>(null)

const toggleMenu = (id: number) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

// =====================================================
// Categories
// =====================================================

const categoryList = ref<Category[]>([])
const categoryMenuOpen = ref(false)

const fetchCategories = async () => {
  try {
    categoryList.value = await getCategories()
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

// Select category
const selectCategory = (catId: number | null) => {
  selectedCategory.value = catId

  // Close dropdown
  categoryMenuOpen.value = false

  // Go back to first page
  page.value = 1

  // Clear selected products
  selectedIds.value = new Set()
}

// Selected category name
const selectedCategoryName = computed(() => {
  if (selectedCategory.value === null) {
    return ''
  }

  return (
    categoryList.value.find((category) => category.catId === selectedCategory.value)
      ?.categoryName ?? ''
  )
})

// =====================================================
// Search
// =====================================================

watch(search, () => {
  page.value = 1
  selectedIds.value = new Set()
})

// =====================================================
// Close menus when clicking outside
// =====================================================

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  // Close row menu
  if (!target.closest('[data-actions-cell]')) {
    openMenuId.value = null
  }

  // Close category menu
  if (!target.closest('[data-category-menu]')) {
    categoryMenuOpen.value = false
  }
}

// =====================================================
// Mounted
// =====================================================

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)

  fetchCategories()
})

// =====================================================
// Unmounted
// =====================================================

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
})

// =====================================================
// Edit product from row
// =====================================================

const handleEdit = (id: number) => {
  openMenuId.value = null

  router.push(`/products/${id}/edit`)
}

// =====================================================
// Edit selected product
// =====================================================

const editSelected = () => {
  // Only allow exactly one selected product
  if (selectedIds.value.size !== 1) {
    return
  }

  const id = [...selectedIds.value][0]

  router.push(`/products/${id}/edit`)
}

// =====================================================
// Delete
// =====================================================

const pendingDeleteId = ref<number | null>(null)

const pendingBulkDelete = ref(false)

const deleting = ref(false)

// Product name for confirmation
const pendingProductName = computed(() => {
  if (pendingDeleteId.value === null) {
    return ''
  }

  return (
    products.value.find((product) => product.pid === pendingDeleteId.value)?.productName ??
    'ផលិតផលនេះ'
  )
})

// Modal open
const modalOpen = computed(() => {
  return pendingDeleteId.value !== null || pendingBulkDelete.value
})

// Modal message
const modalMessage = computed(() => {
  if (pendingBulkDelete.value) {
    const count = selectedIds.value.size

    return `ទិន្នន័យនេះនឹងលុប ${count} ផលិតផលដែលបានជ្រើសរើសជារៀងរហូត។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
  }

  return `ទិន្នន័យនេះនឹងលុប "${pendingProductName.value}" ជារៀងរហូត។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
})

// Request single delete
const requestDelete = (id: number) => {
  openMenuId.value = null

  pendingDeleteId.value = id
}

// Request bulk delete
const requestBulkDelete = () => {
  if (selectedIds.value.size === 0) {
    return
  }

  pendingBulkDelete.value = true
}

// Cancel delete
const cancelDelete = () => {
  if (deleting.value) {
    return
  }

  pendingDeleteId.value = null
  pendingBulkDelete.value = false
}

// Confirm delete
const confirmDelete = async () => {
  deleting.value = true

  try {
    if (pendingBulkDelete.value) {
      await removeSelected()
    } else if (pendingDeleteId.value !== null) {
      await removeProduct(pendingDeleteId.value)
    }
  } finally {
    deleting.value = false

    pendingDeleteId.value = null
    pendingBulkDelete.value = false
  }
}
</script>

<template>
  <div class="p-6 bg-[#f5f5f5] font-kantumruy">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-[26px] font-extrabold text-slate-800">ផលិតផល</h1>

        <p class="text-[12px] text-slate-400 mt-1 flex items-center gap-1">
          <AppIcon name="bag" :size="11" />

          សរុប:

          <span class="font-semibold text-slate-600">
            {{ products.length.toLocaleString() }}
          </span>
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Export -->
        <!-- <button
          type="button"
          class="flex items-center gap-1.5 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 hover:bg-slate-50"
        >
          <AppIcon name="download" :size="13" />

          ទាញយកទិន្នន័យ
        </button> -->

        <!-- Add product -->
        <button
          type="button"
          class="flex items-center gap-1.5 text-[13px] font-semibold text-white rounded-full px-4 py-2 bg-slate-900 hover:bg-slate-800"
          @click="router.push('/products/new')"
        >
          <AppIcon name="plus" :size="13" />

          បន្ថែមផលិតផល
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- FILTER BAR -->
    <!-- ================================================= -->

    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2 flex-wrap">
        <!-- ================================================= -->
        <!-- CATEGORY DROPDOWN -->
        <!-- ================================================= -->

        <div class="relative" data-category-menu>
          <!-- Category button -->
          <button
            type="button"
            class="flex items-center gap-1.5 text-[12px] font-medium text-slate-600 bg-white border border-slate-200 rounded-full px-3.5 py-2 hover:bg-slate-50"
            @click="categoryMenuOpen = !categoryMenuOpen"
          >
            <span> ប្រភេទ </span>

            <span v-if="selectedCategory !== null" class="text-indigo-600">
              ({{ selectedCategoryName }})
            </span>

            <AppIcon name="chevronRight" :size="10" class="rotate-90" />
          </button>

          <!-- Dropdown -->
          <div
            v-if="categoryMenuOpen"
            class="absolute left-0 top-full mt-2 z-50 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1"
          >
            <!-- All categories -->
            <button
              type="button"
              class="w-full text-left px-3 py-2 text-[12px] hover:bg-slate-50"
              :class="
                selectedCategory === null
                  ? 'text-indigo-600 font-semibold bg-indigo-50'
                  : 'text-slate-600'
              "
              @click="selectCategory(null)"
            >
              ប្រភេទទាំងអស់
            </button>

            <!-- Category list -->
            <button
              v-for="category in categoryList"
              :key="category.catId"
              type="button"
              class="w-full text-left px-3 py-2 text-[12px] hover:bg-slate-50"
              :class="
                selectedCategory === category.catId
                  ? 'text-indigo-600 font-semibold bg-indigo-50'
                  : 'text-slate-600'
              "
              @click="selectCategory(category.catId)"
            >
              {{ category.categoryName }}
            </button>

            <!-- No categories -->
            <div v-if="categoryList.length === 0" class="px-3 py-2 text-[12px] text-slate-400">
              រកមិនឃើញប្រភេទឡើយ
            </div>
          </div>
        </div>

        <!-- ================================================= -->
        <!-- SEPARATOR -->
        <!-- ================================================= -->

        <div class="w-px h-5 bg-slate-200 mx-1"></div>

        <!-- ================================================= -->
        <!-- EDIT SELECTED -->
        <!-- ================================================= -->

        <button
          type="button"
          class="w-9 h-9 disabled:opacity-40 rounded-full cursor-pointer flex items-center justify-center border border-indigo-200 bg-indigo-50"
          title="កែប្រែផលិតផលដែលបានជ្រើសរើស"
          :disabled="selectedIds.size !== 1"
          @click="editSelected"
        >
          <AppIcon name="edit" :size="14" />
        </button>

        <!-- ================================================= -->
        <!-- DELETE SELECTED -->
        <!-- ================================================= -->

        <button
          type="button"
          class="w-9 h-9 rounded-full flex items-center justify-center border border-indigo-200 cursor-pointer text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
          title="លុបអ្វីដែលបានជ្រើសរើស"
          :disabled="selectedIds.size === 0"
          @click="requestBulkDelete"
        >
          <AppIcon name="trash" :size="14" />
        </button>
      </div>

      <!-- ================================================= -->
      <!-- SEARCH -->
      <!-- ================================================= -->

      <div
        class="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-2 w-64"
      >
        <AppIcon name="search" :size="13" class="text-slate-400" />

        <input
          v-model="search"
          type="text"
          placeholder="ស្វែងរកផលិតផល"
          class="bg-transparent outline-none text-[12px] text-slate-600 placeholder:text-slate-400 w-full"
        />
      </div>
    </div>

    <!-- ================================================= -->
    <!-- TABLE -->
    <!-- ================================================= -->

    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <!-- Loading -->
      <p v-if="loading" class="text-xs text-slate-400 p-6">កំពុងផ្ទុកផលិតផល...</p>

      <!-- Error -->
      <p v-else-if="error" class="text-xs text-red-500 p-6">
        {{ error }}
      </p>

      <!-- Empty -->
      <p v-else-if="filtered.length === 0" class="text-xs text-slate-400 p-6">រកមិនឃើញផលិតផលឡើយ។</p>

      <!-- Table -->
      <table v-else class="w-full text-left border-collapse">
        <!-- Table header -->
        <thead>
          <tr class="border-b border-slate-100">
            <!-- Select all -->
            <th class="w-10 px-4 py-3">
              <input
                type="checkbox"
                :checked="allOnPageSelected"
                class="accent-indigo-600 w-4 h-4 rounded border-slate-300"
                @change="toggleSelectAll"
              />
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              លេខសម្គាល់
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              ផលិតផល
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              ប្រភេទ
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              តម្លៃ
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              ស្តុក
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              កាលបរិច្ឆេទផុតកំណត់
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              ស្ថានភាព
            </th>

            <th
              class="w-32 px-4 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide text-right"
            >
              សកម្មភាព
            </th>
          </tr>
        </thead>

        <!-- Table body -->
        <tbody>
          <ProductTableRow
            v-for="product in paginated"
            :key="product.pid"
            :product="product"
            :selected="selectedIds.has(product.pid)"
            :menu-open="openMenuId === product.pid"
            @toggle-select="toggleSelect"
            @toggle-menu="toggleMenu"
            @edit="handleEdit"
            @delete="requestDelete"
          />
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
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            :disabled="page === 1"
            @click="page = 1"
          >
            <AppIcon name="chevronLeft" :size="12" />

            <AppIcon name="chevronLeft" :size="12" class="-ml-2.5" />
          </button>

          <!-- Previous -->
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            :disabled="page === 1"
            @click="page--"
          >
            <AppIcon name="chevronLeft" :size="13" />
          </button>

          <!-- Page number -->
          <span class="text-[12px] text-slate-500 px-2">
            ទំព័រទី
            {{ page }}
            នៃ
            {{ totalPages }}
          </span>

          <!-- Next -->
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            :disabled="page === totalPages"
            @click="page++"
          >
            <AppIcon name="chevronRight" :size="13" />
          </button>

          <!-- Last -->
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            :disabled="page === totalPages"
            @click="page = totalPages"
          >
            <AppIcon name="chevronRight" :size="12" />

            <AppIcon name="chevronRight" :size="12" class="-ml-2.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- DELETE CONFIRMATION -->
    <!-- ================================================= -->

    <ConfirmDialog
      :open="modalOpen"
      title="លុបផលិតផល"
      :message="modalMessage"
      confirm-label="លុប"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
