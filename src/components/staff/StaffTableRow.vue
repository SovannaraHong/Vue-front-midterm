<script setup lang="ts">
import { ref, computed } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useClickOutside } from '@/composables/useClickOutside'

const props = defineProps<{
  isAdmin?: boolean
  isSelf?: boolean
  isLastAdmin?: boolean
  isProtected?: boolean
  protectedReason?: string
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)

useClickOutside(menuRef, () => {
  open.value = false
})

const deleteDisabled = computed(() => {
  return Boolean(props.isAdmin || props.isSelf || props.isLastAdmin || props.isProtected)
})

const deleteLabel = computed(() => {
  if (props.isAdmin) return 'Cannot delete admin'
  if (props.isSelf) return 'Cannot delete yourself'
  if (props.isLastAdmin) return 'Cannot delete last admin'
  if (props.isProtected) return props.protectedReason ?? 'Cannot delete'
  return 'Delete'
})

const handleEdit = () => {
  open.value = false
  emit('edit')
}

const handleDelete = () => {
  if (deleteDisabled.value) {
    open.value = false
    return
  }

  open.value = false
  emit('delete')
}
</script>

<template>
  <div ref="menuRef" class="relative">
    <button
      type="button"
      class="w-7 h-7 rounded-md flex items-center justify-center text-black font-extrabold text-[20px] hover:bg-slate-100 hover:text-slate-600 leading-none"
      @click="open = !open"
    >
      ⋯
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-9 z-10 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1"
    >
      <button
        type="button"
        class="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-600 hover:bg-slate-50"
        @click="handleEdit"
      >
        <AppIcon name="edit" :size="12" />
        Edit
      </button>

      <button
        type="button"
        :disabled="deleteDisabled"
        :title="deleteDisabled ? deleteLabel : undefined"
        class="w-full flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-300 text-red-500"
        @click="handleDelete"
      >
        <AppIcon name="trash" :size="12" />
        {{ deleteLabel }}
      </button>
    </div>
  </div>
</template>
