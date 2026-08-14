<script setup lang="ts">
defineProps<{
  categories: string[]
  active: string
}>()

const emit = defineEmits<{ (e: 'select', category: string): void }>()
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap">
    <button
      v-for="cat in categories"
      :key="cat"
      class="px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors"
      :class="
        active === cat
          ? 'bg-emerald-500 text-white'
          : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
      "
      @click="emit('select', cat)"
    >
      {{ cat }}
    </button>
  </div>
</template>
