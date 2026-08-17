<script setup lang="ts">
import { ref } from 'vue'

import type { StaffRequest, staffResponse } from '@/types/staff'

import { createStaff, updateStaff, uploadStaffImage } from '@/services/staff.service'

import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps<{
  staff?: staffResponse
}>()

const emit = defineEmits<{
  (e: 'saved', staff: staffResponse): void
  (e: 'cancel'): void
}>()

// =====================================================
// Edit / Create
// =====================================================

const isEdit = !!props.staff

// =====================================================
// Form
// =====================================================

const form = ref({
  userName: props.staff?.userName ?? '',
  password: '',
  role: props.staff?.role ?? '',
  status: props.staff?.status ?? true,
})

// =====================================================
// Image
// =====================================================

const selectedImage = ref<File | null>(null)

const imagePreview = ref<string | null>(
  props.staff?.imageUrl ? `http://localhost:8080${props.staff.imageUrl}` : null,
)

// =====================================================
// State
// =====================================================

const saving = ref(false)
const error = ref<string | null>(null)

const fieldErrors = ref({
  userName: '',
  password: '',
  role: '',
})

// =====================================================
// Image change
// =====================================================

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  const file = target.files?.[0]

  if (!file) {
    return
  }

  selectedImage.value = file

  if (imagePreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }

  imagePreview.value = URL.createObjectURL(file)
}

// =====================================================
// Validation
// =====================================================

const validate = () => {
  fieldErrors.value = {
    userName: '',
    password: '',
    role: '',
  }

  let valid = true

  // Username
  if (!form.value.userName.trim()) {
    fieldErrors.value.userName = 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់។'
    valid = false
  }

  // Password
  // Required only when creating a staff member.
  // When editing, empty password means "keep current password".
  if (!isEdit && !form.value.password.trim()) {
    fieldErrors.value.password = 'សូមបញ្ចូលលេខសម្ងាត់។'
    valid = false
  }

  if (form.value.password.trim() && form.value.password.trim().length < 6) {
    fieldErrors.value.password = 'លេខសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ។'
    valid = false
  }

  // Role
  if (!form.value.role.trim()) {
    fieldErrors.value.role = 'សូមជ្រើសរើសតួនាទី។'
    valid = false
  }

  return valid
}

// =====================================================
// Submit
// =====================================================

const submit = async () => {
  if (!validate()) {
    return
  }

  saving.value = true
  error.value = null

  try {
    const request: StaffRequest = {
      userName: form.value.userName.trim(),
      role: form.value.role.trim(),
      status: form.value.status,
    }

    // Only send password when:
    // 1. Creating
    // 2. Editing and user entered a new password
    if (form.value.password.trim()) {
      request.password = form.value.password.trim()
    }

    let saved: staffResponse

    // =================================================
    // CREATE
    // =================================================

    if (!isEdit) {
      saved = await createStaff(request)

      // Upload image after staff is created
      if (selectedImage.value) {
        saved = await uploadStaffImage(saved.sid, selectedImage.value)
      }
    }

    // =================================================
    // UPDATE
    // =================================================
    else {
      saved = await updateStaff(props.staff!.sid, request)

      // Upload new image if selected
      if (selectedImage.value) {
        saved = await uploadStaffImage(props.staff!.sid, selectedImage.value)
      }
    }

    emit('saved', saved)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'បរាជ័យក្នុងការរក្សាទុកទិន្នន័យបុគ្គលិក។'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="bg-white rounded-2xl border border-slate-100 p-6 w-full" @submit.prevent="submit">
    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <h2 class="text-[18px] font-extrabold text-slate-800 mb-5">
      {{ isEdit ? 'កែប្រែព័ត៌មានបុគ្គលិក' : 'បន្ថែមបុគ្គលិក' }}
    </h2>

    <!-- Error -->

    <p v-if="error" class="text-[12px] text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">
      {{ error }}
    </p>

    <!-- ================================================= -->
    <!-- IMAGE + STATUS -->
    <!-- ================================================= -->

    <div class="flex items-center justify-between mb-5">
      <!-- Image -->

      <div class="flex items-center gap-4">
        <div class="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            alt="រូបថតបុគ្គលិក"
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

      <!-- Status -->

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

    <!-- ================================================= -->
    <!-- USERNAME -->
    <!-- ================================================= -->

    <div class="mb-4">
      <label class="block text-[12px] font-semibold text-slate-600 mb-1.5">
        ឈ្មោះអ្នកប្រើប្រាស់
      </label>

      <input
        v-model="form.userName"
        type="text"
        placeholder="ឧទាហរណ៍៖ john"
        class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
        :class="fieldErrors.userName ? 'border-red-300' : ''"
      />

      <p v-if="fieldErrors.userName" class="text-[11px] text-red-500 mt-1">
        {{ fieldErrors.userName }}
      </p>
    </div>

    <!-- ================================================= -->
    <!-- PASSWORD -->
    <!-- ================================================= -->

    <div class="mb-4">
      <label class="block text-[12px] font-semibold text-slate-600 mb-1.5"> លេខសម្ងាត់ </label>

      <input
        v-model="form.password"
        type="password"
        :placeholder="isEdit ? 'ទុកទំនេរប្រសិនបើមិនចង់ផ្លាស់ប្តូរ' : 'បញ្ចូលលេខសម្ងាត់'"
        class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
        :class="fieldErrors.password ? 'border-red-300' : ''"
      />

      <p v-if="fieldErrors.password" class="text-[11px] text-red-500 mt-1">
        {{ fieldErrors.password }}
      </p>

      <p v-if="isEdit && !fieldErrors.password" class="text-[11px] text-slate-400 mt-1">
        ទុកទំនេរប្រសិនបើអ្នកមិនចង់ផ្លាស់ប្តូរលេខសម្ងាត់។
      </p>
    </div>

    <!-- ================================================= -->
    <!-- ROLE -->
    <!-- ================================================= -->

    <div class="mb-6">
      <label class="block text-[12px] font-semibold text-slate-600 mb-1.5"> តួនាទី </label>

      <select
        v-model="form.role"
        class="w-full text-[13px] text-slate-700 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 bg-white"
        :class="fieldErrors.role ? 'border-red-300' : ''"
      >
        <option value="" disabled>ជ្រើសរើសតួនាទី</option>

        <option value="ADMIN">ADMIN</option>

        <option value="STOCK">STOCK</option>

        <option value="USER">USER</option>
      </select>

      <p v-if="fieldErrors.role" class="text-[11px] text-red-500 mt-1">
        {{ fieldErrors.role }}
      </p>
    </div>

    <!-- ================================================= -->
    <!-- ACTIONS -->
    <!-- ================================================= -->

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
        {{ saving ? 'កំពុងរក្សាទុក...' : isEdit ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'បន្ថែមបុគ្គលិក' }}
      </button>
    </div>
  </form>
</template>
