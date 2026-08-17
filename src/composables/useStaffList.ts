import { getAllStaff } from '@/services/staff.service'
import type { staffResponse } from '@/types/staff'
import { computed, onMounted, ref } from 'vue'

export function useStaffList(pagesize = 10) {
  const staff = ref<staffResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const search = ref('')
  const page = ref(1)
  const selectedIds = ref<Set<number>>(new Set())

  //fetch staff
  const fetchStaff = async () => {
    loading.value = true
    error.value = null

    try {
      staff.value = await getAllStaff()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch Staff'
    } finally {
      loading.value = false
    }
  }
  onMounted(fetchStaff)
  //search

  const filtered = computed(() => {
    const searchText = search.value.toLowerCase().trim()
    if (!searchText) {
      return staff.value
    }
    return staff.value.filter((item) => {
      return (
        item.userName.toLowerCase().includes(searchText) ||
        item.role.toLowerCase().includes(searchText)
      )
    })
  })
  //pagination

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filtered.value.length / pagesize))
  })
  const paginated = computed(() => {
    const start = (page.value - 1) * pagesize
    return filtered.value.slice(start, start + pagesize)
  })
  const rangeLabel = computed(() => {
    if (filtered.value.length === 0) {
      return '0 of 0'
    }

    const start = (page.value - 1) * pagesize + 1

    const end = Math.min(page.value * pagesize, filtered.value.length)

    return `${start} to ${end} of ${filtered.value.length}`
  })
  const allOnPageSelected = computed(() => {
    return (
      paginated.value.length > 0 && paginated.value.every((item) => selectedIds.value.has(item.sid))
    )
  })

  const toggleSelectAll = () => {
    if (allOnPageSelected.value) {
      paginated.value.forEach((item) => {
        selectedIds.value.delete(item.sid)
      })
    } else {
      paginated.value.forEach((item) => {
        selectedIds.value.add(item.sid)
      })
    }

    selectedIds.value = new Set(selectedIds.value)
  }

  const toggleSelect = (id: number) => {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }

    selectedIds.value = new Set(selectedIds.value)
  }
  return {
    staff,

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

    fetchStaff,
  }
}
