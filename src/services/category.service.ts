import type { Category } from '@/types/category'
import { apiFetch } from './api'

export const getCategories = () => {
  return apiFetch<Category[]>('/api/categories')
}

export const getCategoryById = (catId: number) => {
  return apiFetch<Category>(`/api/categories/${catId}`)
}

export const createCategory = (data: Omit<Category, 'catId'>) => {
  return apiFetch<Category>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateCategory = (id: number, data: Omit<Category, 'catId'>) => {
  return apiFetch<Category>(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteCategory = (id: number) => {
  return apiFetch<void>(`/api/categories/${id}`, {
    method: 'DELETE',
  })
}
