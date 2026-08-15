<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'

defineProps<{ page: number; totalPages: number; rangeLabel: string }>()
const emit = defineEmits<{ (e: 'update:page', page: number): void }>()
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 border-t border-slate-100">
    <span class="text-[12px] text-slate-400">{{ rangeLabel }}</span>
    <div class="flex items-center gap-1">
      <button
        class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        :disabled="page === 1"
        @click="emit('update:page', page - 1)"
      >
        <AppIcon name="chevronLeft" :size="14" />
      </button>
      <span class="text-[12px] text-slate-500 px-2">Page {{ page }} of {{ totalPages }}</span>
      <button
        class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        :disabled="page === totalPages"
        @click="emit('update:page', page + 1)"
      >
        <AppIcon name="chevronRight" :size="14" />
      </button>
    </div>
  </div>
</template>
