export interface LoginRequest {
  userName: string
  password: string
}

export interface LoginResponse {
  sid: number
  userName: string
  status: boolean
  role: 'ADMIN' | 'STOCK' | 'USER'
}
