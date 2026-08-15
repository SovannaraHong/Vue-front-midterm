import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/login',
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },

    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),

      meta: {
        requiresAuth: true,
      },

      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),

          meta: {
            requiresAuth: true,
            roles: ['ADMIN'],
          },
        },

        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/views/categories/CategoryListView.vue'),

          meta: {
            requiresAuth: true,
            roles: ['ADMIN'],
          },
        },

        {
          path: 'foods',
          name: 'foods',
          component: () => import('@/views/food/FoodOrderView.vue'),

          meta: {
            requiresAuth: true,
            roles: ['ADMIN', 'STOCK', 'USER'],
          },
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/products/ProductListView.vue'),

          meta: {
            requiresAuth: true,
            roles: ['ADMIN', 'STOCK', 'USER'],
          },
        },
      ],
    },

    // {
    //   path: '/forbidden',
    //   name: 'forbidden',
    //   component: () => import('@/views/ForbiddenView.vue'),
    // },
  ],
})

// =========================
// ROUTE GUARD
// =========================
router.beforeEach((to) => {
  const authUser = localStorage.getItem('auth_user')

  // -------------------------
  // NOT LOGGED IN
  // -------------------------
  if (to.meta.requiresAuth && !authUser) {
    return { name: 'login' }
  }

  // -------------------------
  // ALREADY LOGGED IN
  // Don't allow going back to login
  // -------------------------
  if (to.name === 'login' && authUser) {
    const user = JSON.parse(authUser)

    if (user.role === 'ADMIN') {
      return { name: 'dashboard' }
    }

    return { name: 'foods' }
  }

  // -------------------------
  // ROLE CHECK
  // -------------------------
  if (to.meta.roles && authUser) {
    const user = JSON.parse(authUser)

    const allowedRoles = to.meta.roles as string[]

    if (!allowedRoles.includes(user.role)) {
      return { name: 'forbidden' }
    }
  }

  return true
})

export default router
