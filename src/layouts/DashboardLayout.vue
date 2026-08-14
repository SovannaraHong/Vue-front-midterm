<script setup lang="ts">
import { ref } from 'vue'
import DashboardSidebar from '@/components/layout/DashboardSidebar.vue'
import FooterLayout from '@/components/layout/FooterLayout.vue'
import NavbarLayout from '@/components/layout/NavbarLayout.vue'

const sidebarOpen = ref(true)
</script>

<template>
  <div class="flex h-screen text-slate-800">
    <DashboardSidebar :open="sidebarOpen" />
    <div class="flex-1 flex flex-col min-w-0">
      <NavbarLayout @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <router-view />
      <FooterLayout />
    </div>
  </div>
</template>
