  <script setup lang="ts">
  import { ref } from 'vue'
  import Navbar from '@/components/layout/Navbar.vue'
  import Footer from '@/components/layout/Footer.vue'
  import DashboardSidebar from '@/components/layout/DashboardSidebar.vue';

  const sidebarOpen = ref(true)
  </script>

  <template>
    <div class="flex min-h-screen bg-[#f3f2f8] text-slate-800">
      <DashboardSidebar :open="sidebarOpen" />
      <div class="flex-1 flex flex-col min-w-0">
        <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
        <router-view />
        <Footer />
      </div>
    </div>
  </template>
