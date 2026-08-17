<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'

defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-slate-900/40" @click="emit('cancel')"></div>

      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div
          class="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4"
        >
          <AppIcon name="alertTriangle" :size="20" />
        </div>

        <h2 class="text-[15px] font-bold text-slate-800 mb-1.5">{{ title }}</h2>
        <p class="text-[13px] text-slate-500 leading-relaxed">{{ message }}</p>

        <div class="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            :disabled="loading"
            class="text-[13px] font-semibold cursor-pointer text-white bg-red-500 hover:bg-red-600 rounded-full px-5 py-2 disabled:opacity-50"
            @click="emit('confirm')"
          >
            {{ loading ? 'Deleting...' : confirmLabel || 'Delete' }}
          </button>
          <button
            type="button"
            class="text-[13px] font-medium cursor-pointer bg-gray-400 text-white px-4 py-2 rounded-full"
            @click="emit('cancel')"
          >
            {{ cancelLabel || 'Cancel' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
