<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppIcon from '@/components/common/AppIcon.vue'
import CategoryTableRow from '@/components/categories/CategoryTableRow.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

import type { Category } from '@/types/category'
import { getCategories, deleteCategory } from '@/services/category.service'

const router = useRouter()

// =====================================================
// Categories
// =====================================================

const categories = ref<Category[]>([])

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
// Fetch categories
// =====================================================

const fetchCategories = async () => {
  loading.value = true
  error.value = null

  try {
    categories.value = await getCategories()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'បរាជ័យក្នុងការទាញយកប្រភេទផលិតផល។'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)

// =====================================================
// Filter
// =====================================================

const filtered = computed(() => {
  const searchText = search.value.toLowerCase().trim()

  if (!searchText) {
    return categories.value
  }

  return categories.value.filter((category) =>
    category.categoryName.toLowerCase().includes(searchText),
  )
})

// =====================================================
// Pagination
// =====================================================

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))

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
// Action menu
// =====================================================

const openMenuId = ref<number | null>(null)

const toggleMenu = (id: number) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

// =====================================================
// Outside click
// =====================================================

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (!target.closest('[data-actions-cell]')) {
    openMenuId.value = null
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
})

// =====================================================
// Edit
// =====================================================

const handleEdit = (id: number) => {
  openMenuId.value = null

  router.push(`/categories/${id}/edit`)
}

// =====================================================
// Delete
// =====================================================

const pendingDeleteId = ref<number | null>(null)
const deleting = ref(false)

const pendingCategoryName = computed(() => {
  if (pendingDeleteId.value === null) {
    return ''
  }

  return (
    categories.value.find((category) => category.catId === pendingDeleteId.value)?.categoryName ??
    'ប្រភេទនេះ'
  )
})

const modalOpen = computed(() => pendingDeleteId.value !== null)

const modalMessage = computed(() => {
  return `សកម្មភាពនេះនឹងលុប "${pendingCategoryName.value}" ជាអចិន្ត្រៃយ៍។ ការធ្វើបែបនេះមិនអាចត្រឡប់ក្រោយបានទេ។`
})

const requestDelete = (id: number) => {
  openMenuId.value = null
  pendingDeleteId.value = id
}

const cancelDelete = () => {
  if (deleting.value) {
    return
  }

  pendingDeleteId.value = null
}

const confirmDelete = async () => {
  if (pendingDeleteId.value === null) {
    return
  }

  deleting.value = true
  error.value = null

  try {
    await deleteCategory(pendingDeleteId.value)

    categories.value = categories.value.filter(
      (category) => category.catId !== pendingDeleteId.value,
    )

    pendingDeleteId.value = null

    // Fix current page if last item was deleted
    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'បរាជ័យក្នុងការលុបប្រភេទផលិតផល។'
  } finally {
    deleting.value = false
  }
}

// =====================================================
// Export
// =====================================================

const exportData = () => {
  const rows = filtered.value

  if (rows.length === 0) {
    return
  }

  const header = 'ID,Category Name'

  const csvRows = rows.map((category) => {
    const name = `"${category.categoryName.replaceAll('"', '""')}"`

    return `${category.catId},${name}`
  })

  const csv = [header, ...csvRows].join('\n')

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')

  link.href = url
  link.download = 'categories.csv'

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="p-6 bg-[#f5f5f5] font-kantumruy min-h-full">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-[26px] font-extrabold text-slate-800">ប្រភេទផលិតផល</h1>

        <p class="text-[12px] text-slate-400 mt-1 flex items-center gap-1">
          <AppIcon name="bag" :size="11" />

          សរុប:

          <span class="font-semibold text-slate-600">
            {{ categories.length.toLocaleString() }}
          </span>
        </p>
      </div>

      <!-- Header actions -->
      <div class="flex items-center gap-2">
        <!-- Export -->
        <button
          type="button"
          class="flex items-center gap-1.5 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 hover:bg-slate-50"
          @click="exportData"
        >
          <AppIcon name="download" :size="13" />

          ទាញយកទិន្នន័យ
        </button>

        <!-- Add category -->
        <button
          type="button"
          class="flex items-center gap-1.5 text-[13px] font-semibold text-white rounded-full px-4 py-2 bg-slate-900 hover:bg-slate-800"
          @click="router.push('/categories/new')"
        >
          <AppIcon name="plus" :size="13" />

          បន្ថែមប្រភេទ
        </button>
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
          placeholder="ស្វែងរកប្រភេទ"
          class="bg-transparent outline-none text-[12px] text-slate-600 placeholder:text-slate-400 w-full"
        />
      </div>
    </div>

    <!-- ================================================= -->
    <!-- TABLE -->
    <!-- ================================================= -->

    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <!-- Loading -->
      <p v-if="loading" class="text-xs text-slate-400 p-6">កំពុងផ្ទុកប្រភេទផលិតផល...</p>

      <!-- Error -->
      <p v-else-if="error && categories.length === 0" class="text-xs text-red-500 p-6">
        {{ error }}
      </p>

      <!-- Empty -->
      <p v-else-if="filtered.length === 0" class="text-xs text-slate-400 p-6">
        រកមិនឃើញប្រភេទផលិតផលឡើយ។
      </p>

      <!-- Table -->
      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-100">
            <!-- ID -->
            <th class="px-4 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              លេខសម្គាល់
            </th>

            <!-- Category -->
            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              ឈ្មោះប្រភេទ
            </th>

            <!-- Actions -->
            <th
              class="w-32 px-4 py-3 text-[13px] font-semibold text-slate-950uppercase tracking-wide text-right"
            >
              សកម្មភាព
            </th>
          </tr>
        </thead>

        <tbody>
          <CategoryTableRow
            v-for="category in paginated"
            :key="category.catId"
            :category="category"
            :open="openMenuId === category.catId"
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

          <!-- Page -->
          <span class="text-[12px] text-slate-500 px-2">
            ទំព័រទី {{ page }} នៃ {{ totalPages }}
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

    <!-- Error after delete -->
    <p v-if="error && categories.length > 0" class="text-xs text-red-500 mt-3">
      {{ error }}
    </p>

    <!-- Delete dialog -->
    <ConfirmDialog
      :open="modalOpen"
      title="លុបប្រភេទ"
      :message="modalMessage"
      confirm-label="លុប"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
