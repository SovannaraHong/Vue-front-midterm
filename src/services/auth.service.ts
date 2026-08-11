import type { LoginRequest, LoginResponse } from '@/types/auth'
import { apiFetch } from './api'

export const login = (data: LoginRequest) => {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
