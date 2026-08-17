<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Product } from '@/types/product'
import type { Category } from '@/types/category'
import { getCategories } from '@/services/category.service'
import { useProductForm } from '@/composables/useProductForm'
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps<{ product?: Product }>()
const emit = defineEmits<{ (e: 'saved', product: Product): void; (e: 'cancel'): void }>()

const { form, imagePreview, saving, error, fieldErrors, isEdit, handleImageChange, submit } =
  useProductForm(props.product)

const categories = ref<Category[]>([])

onMounted(async () => {
  try {
    categories.value = await getCategories()
  } catch {
    // category list failing shouldn't block the form; the select will just be empty
  }
})

const handleSubmit = async () => {
  const saved = await submit()
  if (saved) emit('saved', saved)
}
</script>

<template>
  <form
    class="bg-white rounded-2xl border w-full border-slate-100 p-6"
    @submit.prevent="handleSubmit"
  >
    <h2 class="text-[18px] font-extrabold text-slate-800 mb-5">
      {{ isEdit ? 'កែប្រែផលិតផល' : 'បន្ថែមផលិតផល' }}
    </h2>

    <p v-if="error" class="text-[12px] text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">
      {{ error }}
    </p>

    <!-- Image + Status -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-4">
        <div class="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            alt="រូបថតផលិតផល"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
            <AppIcon name="image" :size="22" />
          </div>
        </div>
        <label class="text-[12px] font-semibold text-indigo-600 cursor-pointer">
          បង្ហោះរូបថត
          <input type="file" accept="image/*" class="hidden" @change="handleImageChange" />
        </label>
      </div>

      <div class="flex flex-col items-end gap-1.5">
        <span class="text-[12px] font-semibold text-slate-600">
          {{ form.status ? 'សកម្ម' : 'អសកម្ម' }}
        </span>
        <button
          type="button"
          role="switch"
          :aria-checked="form.status"
          class="w-10 h-[22px] rounded-full transition-colors relative shrink-0"
          :class="form.status ? 'bg-emerald-500' : 'bg-slate-300'"
          @click="form.status = !form.status"
        >
          <span
            class="absolute left-0.5 top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform"
            :class="form.status ? 'translate-x-[18px]' : 'translate-x-0'"
          />
        </button>
      </div>
    </div>

    <!-- Product name -->
    <div class="mb-4">
      <label class="block text-[12px] font-semibold text-slate-600 mb-1.5">ឈ្មោះផលិតផល</label>
      <input
        v-model="form.productName"
        type="text"
        placeholder="ឧទាហរណ៍៖ Iced Latte"
        class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
        :class="fieldErrors.productName && 'border-red-300'"
      />
      <p v-if="fieldErrors.productName" class="text-[11px] text-red-500 mt-1">
        {{ fieldErrors.productName }}
      </p>
    </div>

    <!-- Category + Price -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div>
        <label class="block text-[12px] font-semibold text-slate-600 mb-1.5">ប្រភេទ</label>
        <select
          v-model="form.catId"
          class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 bg-white"
          :class="fieldErrors.catId && 'border-red-300'"
        >
          <option :value="null" disabled>ជ្រើសរើសប្រភេទ</option>
          <option v-for="cat in categories" :key="cat.catId" :value="cat.catId">
            {{ cat.categoryName }}
          </option>
        </select>
        <p v-if="fieldErrors.catId" class="text-[11px] text-red-500 mt-1">
          {{ fieldErrors.catId }}
        </p>
      </div>

      <div>
        <label class="block text-[12px] font-semibold text-slate-600 mb-1.5">តម្លៃ ($)</label>
        <input
          v-model.number="form.price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
          :class="fieldErrors.price && 'border-red-300'"
        />
        <p v-if="fieldErrors.price" class="text-[11px] text-red-500 mt-1">
          {{ fieldErrors.price }}
        </p>
      </div>
    </div>

    <!-- Stock + Expiry -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div>
        <label class="block text-[12px] font-semibold text-slate-600 mb-1.5"
          >បរិមាណក្នុងស្តុក</label
        >
        <input
          v-model.number="form.sQty"
          type="number"
          min="0"
          placeholder="0"
          class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
          :class="fieldErrors.sQty && 'border-red-300'"
        />
        <p v-if="fieldErrors.sQty" class="text-[11px] text-red-500 mt-1">{{ fieldErrors.sQty }}</p>
      </div>

      <div>
        <label class="block text-[12px] font-semibold text-slate-600 mb-1.5"
          >កាលបរិច្ឆេទផុតកំណត់</label
        >
        <input
          v-model="form.expiredDate"
          type="date"
          class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
          :class="fieldErrors.expiredDate && 'border-red-300'"
        />
        <p v-if="fieldErrors.expiredDate" class="text-[11px] text-red-500 mt-1">
          {{ fieldErrors.expiredDate }}
        </p>
      </div>
    </div>

    <!-- Description -->
    <div class="mb-6">
      <label class="block text-[12px] font-semibold text-slate-600 mb-1.5">ការបរិយាយ</label>
      <textarea
        v-model="form.description"
        rows="3"
        placeholder="ការបរិយាយសង្ខេបដែលបង្ហាញលើប័ណ្ណផលិតផល"
        class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 resize-none"
      />
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
        {{ saving ? 'កំពុងរក្សាទុក...' : isEdit ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'បន្ថែមផលិតផល' }}
      </button>
    </div>
  </form>
</template>
