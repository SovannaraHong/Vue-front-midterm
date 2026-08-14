<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="shrink-0 bg-white border-t border-slate-100 px-4 md:px-6 py-3 text-[11px] text-slate-400 flex items-center justify-between"
  >
    <span>© {{ year }} Lector. All rights reserved.</span>
    <span>Crafted with Vue 3 + TypeScript + Tailwind</span>
  </footer>
</template>
