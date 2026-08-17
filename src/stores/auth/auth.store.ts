// src/stores/auth.ts
import { defineStore } from 'pinia'

interface AuthUser {
  sid: number
  userName: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
  }),
  actions: {
    setUser(user: AuthUser) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
  },
})
