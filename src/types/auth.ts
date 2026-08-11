export interface LoginRequest {
  userName: string
  password: string
}

export interface LoginResponse {
  sid: number
  userName: string
  role: string
}
