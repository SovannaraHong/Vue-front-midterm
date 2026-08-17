import type { StaffRequest, staffResponse } from '@/types/staff'
import { apiFetch } from './api'

export const getAllStaff = () => {
  return apiFetch<staffResponse[]>('/api/staff')
}

export const getStaffById = (id: number) => {
  return apiFetch<staffResponse>(`/api/staff/${id}`)
}

export const createStaff = (request: StaffRequest) => {
  return apiFetch<staffResponse>('/api/staff', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export const updateStaff = (id: number, request: StaffRequest) => {
  return apiFetch<staffResponse>(`/api/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  })
}

export const deleteStaff = (id: number) => {
  return apiFetch<void>(`/api/staff/${id}`, {
    method: 'DELETE',
  })
}

export const uploadStaffImage = (id: number, file: File) => {
  const formData = new FormData()

  formData.append('file', file)

  return apiFetch<staffResponse>(`/api/staff/${id}/image`, {
    method: 'POST',
    body: formData,
  })
}
