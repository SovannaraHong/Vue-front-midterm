<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { NavItem } from '@/types/dashboard'
import { getNavItems } from '@/services/dashboard.service'

import AppIcon from '@/components/common/AppIcon.vue'
import { logout } from '@/services/auth.service'

interface Props {
  open?: boolean
}

withDefaults(defineProps<Props>(), {
  open: true,
})

const route = useRoute()
const router = useRouter()

const navItems = ref<NavItem[]>([])

// Get logged-in user
const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}')

// Get user's role
const userRole = authUser.role

// Only show navigation items allowed for the user's role
const filteredNavItems = computed(() => {
  return navItems.value.filter((item) => {
    // If item has no roles, allow everyone
    if (!item.roles || item.roles.length === 0) {
      return true
    }

    // Show item only if user's role is allowed
    return item.roles.includes(userRole)
  })
})

const fetchNavItems = async () => {
  try {
    navItems.value = await getNavItems()
  } catch (error) {
    console.error('Failed to fetch navigation items:', error)
  }
}
function handleLogout() {
  logout()
  router.push({ name: 'login' })
}
onMounted(fetchNavItems)
</script>

<template>
  <aside
    class="hidden md:flex flex-col bg-white shrink-0 overflow-hidden border-r h-screen border-slate-100 transition-all duration-300"
    :class="open ? 'w-64' : 'w-0'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2 px-6 h-16 shrink-0">
      <div
        class="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-400 flex items-center justify-center text-white font-bold text-sm"
      >
        L
      </div>

      <span class="font-extrabold text-lg text-slate-800"> Red Hat System. </span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      <RouterLink
        v-for="item in filteredNavItems"
        :key="item.label"
        :to="item.path || '#'"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
        :class="
          route.path === item.path
            ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-md shadow-pink-200'
            : 'text-slate-500 hover:bg-pink-50 hover:text-pink-600'
        "
      >
        <AppIcon :name="item.icon" :size="17" />

        <span>
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>
    <div class="mt-[20px] mb-[130px] px-[10px]">
      <button
        @click="handleLogout"
        class="px-4 py-2.5 w-full rounded-[5px] text-white font-semibold font-sans text-[13px] font-medium cursor-pointer bg-[#fb669a]"
      >
        Logout
      </button>
    </div>
  </aside>
</template>
