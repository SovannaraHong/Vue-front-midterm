import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/categories',
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/categories/CategoryListView.vue'),
    },
  ],
})

export default router
