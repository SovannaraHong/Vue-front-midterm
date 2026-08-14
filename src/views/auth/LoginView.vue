<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/auth.service'
import type { LoginRequest } from '@/types/auth'

const router = useRouter()

const form = reactive<LoginRequest>({
  userName: '',
  password: '',
})

const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

function togglePassword() {
  showPassword.value = !showPassword.value
}

async function handleSubmit() {
  errorMessage.value = ''

  if (!form.userName || !form.password) {
    errorMessage.value = 'Please enter your username and password.'
    return
  }

  isSubmitting.value = true
  try {
   const user = await login({ ...form })

localStorage.setItem('auth_user', JSON.stringify(user))

if (user.role === 'ADMIN') {
  router.push({ name: 'dashboard' })
} else if (user.role === 'STOCK') {
  router.push({ name: 'foods' })
} else if (user.role === 'USER') {
  router.push({ name: 'foods' })
}
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Login failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4">
    <div class="w-[450px] bg-gray-100 rounded-[2rem] p-3">
      <div class="bg-white rounded-[1.75rem] shadow-sm px-8 py-10">
        <div class="flex justify-center mb-6">
          <div class="flex justify-center mb-7">
            <div
              class="relative w-50 px-[10px] h-15 rounded-[10px] flex items-center justify-center shadow-lg shadow-gray-300/50 ring-8 ring-gray-100 overflow-hidden"
            >
              <img src="@/assets/logo1.svg" alt="Logo" class="w-50 h-50 object-contain" />
            </div>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 text-center">Sign in to continue</h1>
        <p class="text-sm text-gray-400 text-center mt-1 mb-8">
          Please sign in to start your rental application
        </p>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="relative">
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <input
              v-model="form.userName"
              type="text"
              autocomplete="username"
              placeholder="Username"
              class="w-full bg-gray-100 rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div class="relative">
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z"
              />
            </svg>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Password"
              class="w-full bg-gray-100 rounded-xl pl-11 pr-11 py-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="togglePassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <svg
                v-if="showPassword"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.09 0 2.13.19 3.09.54M6.1 6.1L3 3m18 18l-3.1-3.1M9.9 9.9a3 3 0 104.2 4.2"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl py-3.5 transition-colors disabled:opacity-60"
          >
            {{ isSubmitting ? 'Signing In…' : 'Sign In' }}
          </button>
        </form>

        <div class="flex items-center gap-3 my-6">
          <span class="flex-1 border-t border-dashed border-gray-200"></span>
          <span class="text-xs text-gray-400 whitespace-nowrap">Or continue with</span>
          <span class="flex-1 border-t border-dashed border-gray-200"></span>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <button
            type="button"
            class="flex items-center justify-center border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors"
            aria-label="Continue with Google"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.47a5.53 5.53 0 01-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0012 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.27a7.2 7.2 0 010-4.54V6.62H1.27a12 12 0 000 10.76l4-3.11z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 001.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77z"
              />
            </svg>
          </button>

          <button
            type="button"
            class="flex items-center justify-center border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors"
            aria-label="Continue with Facebook"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path
                d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
              />
            </svg>
          </button>

          <button
            type="button"
            class="flex items-center justify-center border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors"
            aria-label="Continue with Apple"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
              <path
                d="M16.36 1.43c0 1.14-.42 2.2-1.24 3.08-.86.9-2.15 1.59-3.25 1.5-.14-1.1.42-2.26 1.2-3.06.87-.9 2.36-1.57 3.29-1.52zM20.6 17.14c-.5 1.16-1.09 2.22-1.98 3.2-.86.95-1.75 1.9-3.05 1.92-1.26.03-1.67-.75-3.11-.75-1.44 0-1.9.73-3.08.78-1.28.04-2.26-1.03-3.13-1.97-1.79-1.94-3.16-5.49-1.32-7.9.9-1.2 2.34-1.94 3.68-1.96 1.28-.02 2.5.86 3.28.86.79 0 2.26-1.07 3.81-.91.65.03 2.48.26 3.65 1.95-.09.06-2.18 1.27-2.16 3.79.02 3.01 2.66 4.01 2.71 4.01-.02.06-.42 1.44-1.3 2.98z"
              />
            </svg>
          </button>
        </div>
      </div>

      <p class="text-center text-sm text-gray-400 mt-6">
        Contact your administrator for account access.
      </p>
    </div>
  </div>
</template>
