import { computed, onMounted, ref } from 'vue'
import type { Product } from '@/types/product'
import { getAllProducts, deleteProduct } from '@/services/product.service'

export function useProductList(pageSize = 10) {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const search = ref('')
  const page = ref(1)
  const selectedIds = ref<Set<number>>(new Set())

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

  const filtered = computed(() =>
    products.value.filter((p) => p.productName.toLowerCase().includes(search.value.toLowerCase())),
  )

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))

  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize
    return filtered.value.slice(start, start + pageSize)
  })

  const rangeLabel = computed(() => {
    if (filtered.value.length === 0) return '0 of 0'
    const start = (page.value - 1) * pageSize + 1
    const end = Math.min(page.value * pageSize, filtered.value.length)
    return `${start} to ${end} of ${filtered.value.length}`
  })

  const allOnPageSelected = computed(
    () => paginated.value.length > 0 && paginated.value.every((p) => selectedIds.value.has(p.pid)),
  )

  const toggleSelectAll = () => {
    if (allOnPageSelected.value) {
      paginated.value.forEach((p) => selectedIds.value.delete(p.pid))
    } else {
      paginated.value.forEach((p) => selectedIds.value.add(p.pid))
    }
    selectedIds.value = new Set(selectedIds.value)
  }

  const toggleSelect = (id: number) => {
    if (selectedIds.value.has(id)) selectedIds.value.delete(id)
    else selectedIds.value.add(id)
    selectedIds.value = new Set(selectedIds.value)
  }

  const removeProduct = async (id: number) => {
    await deleteProduct(id)
    products.value = products.value.filter((p) => p.pid !== id)
    selectedIds.value.delete(id)
    selectedIds.value = new Set(selectedIds.value)
  }

  const removeSelected = async () => {
    for (const id of Array.from(selectedIds.value)) {
      await removeProduct(id)
    }
  }

  return {
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
    fetchProducts,
  }
}
