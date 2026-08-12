<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { NavItem } from '@/types/dashboard'
import { getNavItems } from '@/services/dashboard.service'
import AppIcon from '@/components/common/AppIcon.vue'

interface Props {
  open?: boolean
}
withDefaults(defineProps<Props>(), { open: true })

const navItems = ref<NavItem[]>([])
const activeLabel = ref('Dashboard')

const fetchNavItems = async () => {
  navItems.value = await getNavItems()
}

onMounted(fetchNavItems)
</script>

<template>
  <aside
    class="hidden md:flex flex-col bg-white shrink-0 overflow-hidden border-r border-slate-100 transition-all duration-300"
    :class="open ? 'w-64' : 'w-0'"
  >
    <div class="flex items-center gap-2 px-6 h-16 shrink-0">
      <div
        class="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-400 flex items-center justify-center text-white font-bold text-sm"
      >
        L
      </div>
      <span class="font-extrabold text-lg text-slate-800">Red Hat System.</span>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.path || '#'"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
        :class="
          activeLabel === item.label
            ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-md shadow-pink-200'
            : 'text-slate-500 hover:bg-pink-50 hover:text-pink-600'
        "
        @click.prevent="activeLabel = item.label"
      >
        <AppIcon :name="item.icon" :size="17" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
