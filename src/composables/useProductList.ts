import { computed, onMounted, ref } from 'vue'
import type { Product } from '@/types/product'
import { getAllProducts, deleteProduct } from '@/services/product.service'

export function useProductList(pageSize = 10) {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Search
  const search = ref('')

  // Category filter
  const selectedCategory = ref<number | null>(null)

  // Pagination
  const page = ref(1)

  // Selection
  const selectedIds = ref<Set<number>>(new Set())

  // =========================
  // Fetch products
  // =========================

  const fetchProducts = async () => {
    loading.value = true
    error.value = null

    try {
      products.value = await getAllProducts()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchProducts)

  // =========================
  // Filter products
  // =========================

  const filtered = computed(() => {
    const searchText = search.value.toLowerCase().trim()

    return products.value.filter((product) => {
      // Search filter
      const matchesSearch =
        searchText === '' || product.productName.toLowerCase().includes(searchText)

      // Category filter
      const matchesCategory =
        selectedCategory.value === null || product.catId === selectedCategory.value

      return matchesSearch && matchesCategory
    })
  })

  // =========================
  // Pagination
  // =========================

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))

  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize

    return filtered.value.slice(start, start + pageSize)
  })

  const rangeLabel = computed(() => {
    if (filtered.value.length === 0) {
      return '0 of 0'
    }

    const start = (page.value - 1) * pageSize + 1

    const end = Math.min(page.value * pageSize, filtered.value.length)

    return `${start} to ${end} of ${filtered.value.length}`
  })

  // =========================
  // Selection
  // =========================

  const allOnPageSelected = computed(
    () =>
      paginated.value.length > 0 &&
      paginated.value.every((product) => selectedIds.value.has(product.pid)),
  )

  const toggleSelectAll = () => {
    if (allOnPageSelected.value) {
      paginated.value.forEach((product) => {
        selectedIds.value.delete(product.pid)
      })
    } else {
      paginated.value.forEach((product) => {
        selectedIds.value.add(product.pid)
      })
    }

    // Trigger Vue reactivity
    selectedIds.value = new Set(selectedIds.value)
  }

  const toggleSelect = (id: number) => {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }

    // Trigger Vue reactivity
    selectedIds.value = new Set(selectedIds.value)
  }

  // =========================
  // Delete one product
  // =========================

  const removeProduct = async (id: number) => {
    await deleteProduct(id)

    products.value = products.value.filter((product) => product.pid !== id)

    selectedIds.value.delete(id)
    selectedIds.value = new Set(selectedIds.value)
  }

  // =========================
  // Delete selected products
  // =========================

  const removeSelected = async () => {
    const ids = Array.from(selectedIds.value)

    for (const id of ids) {
      await removeProduct(id)
    }
  }

  // =========================
  // Reset page when filters change
  // =========================

  const resetPage = () => {
    page.value = 1
  }

  return {
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

    fetchProducts,
    resetPage,
  }
}
