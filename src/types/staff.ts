export interface staffResponse {
  sid: number
  userName: string
  role: string
  status: boolean
  imageUrl?: string
  password: string
}
export interface StaffRequest {
  userName: string
  role: string
  status: boolean
  password?: string
}
