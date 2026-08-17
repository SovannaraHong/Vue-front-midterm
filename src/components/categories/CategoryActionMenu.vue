<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useClickOutside } from '@/composables/useClickOutside'

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)

useClickOutside(menuRef, () => {
  open.value = false
})

const handleEdit = () => {
  open.value = false
  emit('edit')
}

const handleDelete = () => {
  open.value = false
  emit('delete')
}
</script>

<template>
  <div ref="menuRef" class="relative flex justify-end">
    <button
      type="button"
      class="w-7 h-7 rounded-md flex items-center justify-center text-black font-extrabold text-[20px] hover:bg-slate-100 hover:text-slate-600 leading-none"
      @click="open = !open"
    >
      ⋯
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-9 z-20 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1"
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
        class="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-500 hover:bg-red-50"
        @click="handleDelete"
      >
        <AppIcon name="trash" :size="12" />
        Delete
      </button>
    </div>
  </div>
</template>
