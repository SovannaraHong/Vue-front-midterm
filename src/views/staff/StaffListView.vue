<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppIcon from '@/components/common/AppIcon.vue'
import StaffTableRow from '@/components/staff/StaffTableRow.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

import type { staffResponse } from '@/types/staff'
import { deleteStaff, getAllStaff } from '@/services/staff.service'

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const resolveImageUrl = (url: string | null | undefined): string | undefined => {
  if (!url) {
    return undefined
  }

  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`
}

const staff = ref<staffResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const deleteError = ref<string | null>(null)
let deleteErrorTimeout: ReturnType<typeof setTimeout> | null = null

const showDeleteError = (message: string) => {
  deleteError.value = message

  if (deleteErrorTimeout) {
    clearTimeout(deleteErrorTimeout)
  }

  deleteErrorTimeout = setTimeout(() => {
    deleteError.value = null
  }, 5000)
}

const search = ref('')

const page = ref(1)
const pageSize = 10

const selectedIds = ref<Set<number>>(new Set())

const fetchStaff = async () => {
  loading.value = true
  error.value = null

  try {
    staff.value = await getAllStaff()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'បរាជ័យក្នុងការទាញយកទិន្នន័យបុគ្គលិក'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStaff)

const adminCount = computed(() => staff.value.filter((m) => m.role === 'ADMIN').length)

const filtered = computed(() => {
  const searchText = search.value.toLowerCase().trim()

  if (!searchText) {
    return staff.value
  }

  return staff.value.filter((member) => {
    return (
      member.userName.toLowerCase().includes(searchText) ||
      member.role.toLowerCase().includes(searchText)
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
    return '0 នៃ 0'
  }

  const start = (page.value - 1) * pageSize + 1

  const end = Math.min(page.value * pageSize, filtered.value.length)

  return `${start} ដល់ ${end} នៃ ${filtered.value.length}`
})

watch(search, () => {
  page.value = 1
  selectedIds.value = new Set()
})

const allOnPageSelected = computed(() => {
  return (
    paginated.value.length > 0 &&
    paginated.value.every((member) => member.sid !== undefined && selectedIds.value.has(member.sid))
  )
})

const toggleSelectAll = () => {
  if (allOnPageSelected.value) {
    paginated.value.forEach((member) => {
      if (member.sid !== undefined) {
        selectedIds.value.delete(member.sid)
      }
    })
  } else {
    paginated.value.forEach((member) => {
      if (member.sid !== undefined) {
        selectedIds.value.add(member.sid)
      }
    })
  }

  selectedIds.value = new Set(selectedIds.value)
}

const toggleSelect = (id: number | undefined) => {
  if (id === undefined) {
    return
  }

  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }

  selectedIds.value = new Set(selectedIds.value)
}

const openMenuId = ref<number | null>(null)

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

  if (deleteErrorTimeout) {
    clearTimeout(deleteErrorTimeout)
  }
})

const handleEdit = (id: number | undefined) => {
  if (id === undefined) {
    return
  }

  openMenuId.value = null

  router.push(`/staff/${id}/edit`)
}

const editSelected = () => {
  if (selectedIds.value.size !== 1) {
    return
  }

  const id = [...selectedIds.value][0]

  router.push(`/staff/${id}/edit`)
}

const pendingDeleteId = ref<number | null>(null)
const pendingBulkDelete = ref(false)
const deleting = ref(false)

const pendingStaffName = computed(() => {
  if (pendingDeleteId.value === null) {
    return ''
  }

  return (
    staff.value.find((member) => member.sid === pendingDeleteId.value)?.userName ?? 'បុគ្គលិកនេះ'
  )
})

const modalOpen = computed(() => {
  return pendingDeleteId.value !== null || pendingBulkDelete.value
})

const modalMessage = computed(() => {
  if (pendingBulkDelete.value) {
    const count = selectedIds.value.size

    return `ទិន្នន័យនេះនឹងលុប ${count} បុគ្គលិកដែលបានជ្រើសរើសជារៀងរហូត។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
  }

  return `ទិន្នន័យនេះនឹងលុប "${pendingStaffName.value}" ជារៀងរហូត។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
})

const requestDelete = (id: number | undefined) => {
  if (id === undefined) {
    return
  }

  openMenuId.value = null

  pendingDeleteId.value = id
  pendingBulkDelete.value = false
}

const requestBulkDelete = () => {
  if (selectedIds.value.size === 0) {
    return
  }

  pendingDeleteId.value = null
  pendingBulkDelete.value = true
}

const cancelDelete = () => {
  if (deleting.value) {
    return
  }

  pendingDeleteId.value = null
  pendingBulkDelete.value = false
}

const confirmDelete = async () => {
  if (deleting.value) {
    return
  }

  deleting.value = true
  error.value = null

  try {
    if (pendingDeleteId.value !== null) {
      const id = pendingDeleteId.value

      await deleteStaff(id)

      staff.value = staff.value.filter((member) => member.sid !== id)

      selectedIds.value.delete(id)
      selectedIds.value = new Set(selectedIds.value)
    }

    if (pendingBulkDelete.value) {
      const ids = [...selectedIds.value]

      const results = await Promise.allSettled(ids.map((id) => deleteStaff(id)))

      const failedIds = new Set<number>()
      let firstFailureMessage: string | null = null

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const failedId = ids[index]

          if (failedId !== undefined) {
            failedIds.add(failedId)
          }

          if (!firstFailureMessage) {
            firstFailureMessage =
              result.reason instanceof Error ? result.reason.message : 'មិនអាចលុបបានទេ'
          }
        }
      })

      staff.value = staff.value.filter((member) => {
        if (member.sid === undefined) {
          return true
        }

        return !selectedIds.value.has(member.sid) || failedIds.has(member.sid)
      })

      if (failedIds.size > 0) {
        showDeleteError(
          failedIds.size === 1
            ? (firstFailureMessage ?? 'មិនអាចលុបបុគ្គលិកនេះបានទេ។')
            : `មិនអាចលុបបុគ្គលិកចំនួន ${failedIds.size} នាក់បានទេ។`,
        )
      }

      selectedIds.value = new Set()
    }

    pendingDeleteId.value = null
    pendingBulkDelete.value = false

    if (page.value > totalPages.value) {
      page.value = totalPages.value
    }
  } catch (err) {
    pendingDeleteId.value = null
    pendingBulkDelete.value = false

    showDeleteError(err instanceof Error ? err.message : 'មិនអាចលុបបុគ្គលិកនេះបានទេ។')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="p-6 bg-[#f5f5f5] font-kantumruy">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="deleteError"
        class="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
      >
        <span class="text-[12px] text-red-600 font-medium">
          {{ deleteError }}
        </span>

        <button
          type="button"
          class="text-red-400 hover:text-red-600 text-[12px] font-semibold"
          @click="deleteError = null"
        >
          បិទ
        </button>
      </div>
    </transition>

    <div class="flex items-start justify-between mb-6 font-font-kantumruy">
      <div>
        <h1 class="text-[26px] font-extrabold text-slate-800">បុគ្គលិក</h1>

        <p class="text-[12px] text-slate-400 mt-1 flex items-center gap-1">
          <AppIcon name="bag" :size="11" />

          សរុប:

          <span class="font-semibold text-slate-600">
            {{ staff.length.toLocaleString() }}
          </span>
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex items-center gap-1.5 text-[13px] font-semibold text-white rounded-full px-4 py-2 bg-slate-900 hover:bg-slate-800"
          @click="router.push('/staff/new')"
        >
          <AppIcon name="plus" :size="13" />
          បន្ថែមបុគ្គលិក
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2 flex-wrap">
        <div class="w-px h-5 bg-slate-200 mx-1"></div>

        <button
          type="button"
          class="w-9 h-9 disabled:opacity-40 rounded-full flex items-center justify-center border border-indigo-200 bg-indigo-50"
          title="កែប្រែបុគ្គលិកដែលបានជ្រើសរើស"
          :disabled="selectedIds.size !== 1"
          @click="editSelected"
        >
          <AppIcon name="edit" :size="14" />
        </button>

        <button
          type="button"
          class="w-9 h-9 rounded-full flex items-center justify-center border border-indigo-200 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
          title="លុបអ្វីដែលបានជ្រើសរើស"
          :disabled="selectedIds.size === 0"
          @click="requestBulkDelete"
        >
          <AppIcon name="trash" :size="14" />
        </button>
      </div>

      <div
        class="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-2 w-64"
      >
        <AppIcon name="search" :size="13" class="text-slate-400" />

        <input
          v-model="search"
          type="text"
          placeholder="ស្វែងរកបុគ្គលិក"
          class="bg-transparent outline-none text-[12px] text-slate-600 placeholder:text-slate-400 w-full"
        />
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <p v-if="loading" class="text-xs text-slate-400 p-6">កំពុងផ្ទុកទិន្នន័យបុគ្គលិក...</p>

      <p v-else-if="error" class="text-xs text-red-500 p-6">
        {{ error }}
      </p>

      <p v-else-if="filtered.length === 0" class="text-xs text-slate-400 p-6">
        រកមិនឃើញបុគ្គលិកឡើយ។
      </p>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-100">
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
              បុគ្គលិក
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              តួនាទី
            </th>

            <th class="px-2 py-3 text-[13px] font-semibold text-slate-950 uppercase tracking-wide">
              លេខសម្ងាត់
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

        <tbody>
          <tr
            v-for="member in paginated"
            :key="member.sid"
            class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
          >
            <td class="px-4 py-3">
              <input
                type="checkbox"
                :checked="member.sid !== undefined && selectedIds.has(member.sid)"
                class="accent-indigo-600 w-4 h-4 rounded border-slate-300"
                @change="toggleSelect(member.sid)"
              />
            </td>

            <td class="px-2 py-3 text-[12px] text-slate-500">
              {{ member.sid }}
            </td>
            <td class="px-2 py-3 text-[12px] font-medium text-slate-700">
              <div class="flex items-center gap-2">
                <img
                  v-if="member.imageUrl"
                  :src="resolveImageUrl(member.imageUrl)"
                  :alt="member.userName"
                  class="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-500"
                >
                  {{ member.userName?.charAt(0).toUpperCase() }}
                </div>

                {{ member.userName }}
              </div>
            </td>

            <td class="px-2 py-3 text-[12px] text-slate-500">
              {{ member.role }}
            </td>

            <td class="px-2 py-3 text-[12px] text-slate-400">••••••••</td>

            <td class="px-2 py-3 text-[12px]">
              <span
                class="px-2 py-0.5 rounded-full text-[11px] font-medium"
                :class="
                  member.status ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                "
              >
                {{ member.status ? 'សកម្ម' : 'អសកម្ម' }}
              </span>
            </td>

            <td class="px-4 py-3 text-right" data-actions-cell>
              <StaffTableRow
                :is-admin="member.role === 'ADMIN'"
                :is-last-admin="member.role === 'ADMIN' && adminCount === 1"
                @edit="handleEdit(member.sid)"
                @delete="requestDelete(member.sid)"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="filtered.length > 0"
        class="flex items-center justify-between px-4 py-3 border-t border-slate-100"
      >
        <span class="text-[12px] text-slate-400">
          {{ rangeLabel }}
        </span>

        <div class="flex items-center gap-1">
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30"
            :disabled="page === 1"
            @click="page = 1"
          >
            <AppIcon name="chevronLeft" :size="12" />
            <AppIcon name="chevronLeft" :size="12" class="-ml-2.5" />
          </button>

          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30"
            :disabled="page === 1"
            @click="page--"
          >
            <AppIcon name="chevronLeft" :size="13" />
          </button>

          <span class="text-[12px] text-slate-500 px-2">
            ទំព័រទី {{ page }} នៃ {{ totalPages }}
          </span>

          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30"
            :disabled="page === totalPages"
            @click="page++"
          >
            <AppIcon name="chevronRight" :size="13" />
          </button>

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

    <ConfirmDialog
      :open="modalOpen"
      title="លុបបុគ្គលិក"
      :message="modalMessage"
      confirm-label="លុប"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
