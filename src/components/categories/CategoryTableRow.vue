<script setup lang="ts">
import type { Category } from '@/types/category'
import CategoryActionMenu from './CategoryActionMenu.vue'

defineProps<{
  category: Category
}>()

const emit = defineEmits<{
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <tr class="border-b border-slate-50 hover:bg-slate-50/50">
    <!-- ID -->
    <td class="px-4 py-3">
      <span class="text-[12px] font-medium text-slate-500"> #{{ category.catId }} </span>
    </td>

    <!-- Category -->
    <td class="px-2 py-3">
      <span class="text-[13px] font-semibold text-slate-700">
        {{ category.categoryName }}
      </span>
    </td>

    <!-- Actions -->
    <td class="w-32 px-4 py-3 text-right">
      <CategoryActionMenu
        @edit="emit('edit', category.catId)"
        @delete="emit('delete', category.catId)"
      />
    </td>
  </tr>
</template>
