<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '@/types/category'
import { createCategory, updateCategory } from '@/services/category.service'

const props = defineProps<{
  category?: Category
}>()

const emit = defineEmits<{
  (e: 'saved', category: Category): void
  (e: 'cancel'): void
}>()

const isEdit = !!props.category

const categoryName = ref(props.category?.categoryName ?? '')

const saving = ref(false)
const error = ref('')

const fieldError = ref('')

const validate = () => {
  fieldError.value = ''

  if (!categoryName.value.trim()) {
    fieldError.value = 'សូមបញ្ចូលឈ្មោះប្រភេទផលិតផល។'
    return false
  }

  return true
}

const submit = async () => {
  if (!validate()) {
    return
  }

  saving.value = true
  error.value = ''

  try {
    const data = {
      categoryName: categoryName.value.trim(),
    }

    let saved: Category

    if (isEdit) {
      saved = await updateCategory(props.category!.catId, data)
    } else {
      saved = await createCategory(data)
    }

    emit('saved', saved)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'បរាជ័យក្នុងការរក្សាទុកប្រភេទផលិតផល។'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form
    class="bg-white font-kantumruy rounded-2xl border border-slate-100 p-6 w-full"
    @submit.prevent="submit"
  >
    <!-- Header -->
    <h2 class="text-[18px] font-extrabold text-slate-800 mb-5">
      {{ isEdit ? 'កែប្រែប្រភេទ' : 'បន្ថែមប្រភេទ' }}
    </h2>

    <!-- Error -->
    <p v-if="error" class="text-[12px] text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">
      {{ error }}
    </p>

    <!-- Category name -->
    <div class="mb-6">
      <label class="block text-[12px] font-semibold text-slate-600 mb-1.5"> ឈ្មោះប្រភេទ </label>

      <input
        v-model="categoryName"
        type="text"
        placeholder="ឧទាហរណ៍៖ កាហ្វេ"
        class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
        :class="fieldError ? 'border-red-300' : ''"
      />

      <p v-if="fieldError" class="text-[11px] text-red-500 mt-1">
        {{ fieldError }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <button
        type="button"
        class="text-[13px] font-medium text-slate-500 px-4 py-2 rounded-full hover:bg-slate-50"
        @click="emit('cancel')"
      >
        បោះបង់
      </button>

      <button
        type="submit"
        :disabled="saving"
        class="text-[13px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full px-5 py-2 disabled:opacity-50"
      >
        {{ saving ? 'កំពុងរក្សាទុក...' : isEdit ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'បន្ថែមប្រភេទ' }}
      </button>
    </div>
  </form>
</template>
