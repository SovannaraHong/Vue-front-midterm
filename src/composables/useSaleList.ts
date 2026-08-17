import { computed, onMounted, ref, watch } from 'vue'
import { getSales } from '@/services/sale.service'
import type { saleResponse } from '@/types/sale'

export function useSaleList(pageSize = 10) {
  const sales = ref<saleResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const search = ref('')
  const page = ref(1)

  const fetchSales = async () => {
    loading.value = true
    error.value = null

    try {
      sales.value = await getSales()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch sales'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchSales)

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

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filtered.value.length / pageSize))
  })

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

  watch(search, () => {
    page.value = 1
  })

  return {
    sales,
    loading,
    error,

    search,
    page,

    filtered,
    paginated,
    totalPages,
    rangeLabel,

    fetchSales,
  }
}
