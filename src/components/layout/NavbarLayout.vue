<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'

const emit = defineEmits<{ (e: 'toggle-sidebar'): void }>()

function getAuthUser() {
  const authUser = localStorage.getItem('auth_user')
  return authUser ? JSON.parse(authUser) : null
}
</script>

<template>
  <header
    class="h-16 shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6"
  >
    <div class="flex items-center gap-3">
      <button class="text-slate-400 hover:text-slate-600" @click="emit('toggle-sidebar')">
        <AppIcon name="menu" :size="20" />
      </button>
      <div class="hidden sm:flex items-center gap-2 bg-slate-50 rounded-full px-3 py-1.5 w-64">
        <AppIcon name="search" :size="15" class="text-slate-400" />
        <input
          placeholder="Search here..."
          class="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 w-full"
        />
      </div>
    </div>

    <div class="flex items-center gap-4 md:gap-5">
      <button class="relative text-slate-400 hover:text-pink-500">
        <AppIcon name="mail" :size="19" />
        <span
          class="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center"
        >
          3
        </span>
      </button>
      <button class="relative text-slate-400 hover:text-pink-500">
        <AppIcon name="bell" :size="19" />
        <span
          class="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center"
        >
          5
        </span>
      </button>
      <div class="flex items-center gap-2 pl-3 border-l border-slate-100">
        <div
          class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center text-white text-xs font-bold"
        >
          {{ getAuthUser()?.userName?.charAt(0)?.toUpperCase() || 'M' }}
        </div>
        <div class="hidden md:block leading-tight">
          <div class="text-xs font-semibold text-slate-700">
            {{ getAuthUser()?.userName || 'Maria Jones' }}
          </div>
          <div class="text-[11px] text-slate-400">{{ getAuthUser()?.role || 'Admin' }}</div>
        </div>
      </div>
    </div>
  </header>
</template>
