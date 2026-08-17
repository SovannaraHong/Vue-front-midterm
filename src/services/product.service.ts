import type { Product, ProductRequest } from '@/types/product'
import { apiFetch } from './api'

export const getAllProducts = () => {
  return apiFetch<Product[]>('/api/products')
}

export const getProductById = (id: number) => {
  return apiFetch<Product>(`/api/products/${id}`)
}

export const createProduct = (data: ProductRequest) => {
  return apiFetch<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateProduct = (id: number, data: ProductRequest) => {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteProduct = (id: number) => {
  return apiFetch<void>(`/api/products/${id}`, {
    method: 'DELETE',
  })
}
export const getExpiredProducts = () => {
  return apiFetch<Product[]>('/api/products/expired')
}

export const getProductsByCategory = (catId: number) => {
  return apiFetch<Product[]>(`/api/products/category/${catId}`)
}

export const buyProduct = (id: number, quantity: number) => {
  return apiFetch<Product>(`/api/products/${id}/buy?quantity=${quantity}`, {
    method: 'POST',
  })
}

export const getBestSeller = () => {
  return apiFetch<Product>('/api/products/best-seller')
}

export const getBestSellerByCategory = (catId: number) => {
  return apiFetch<Product>(`/api/products/category/${catId}/best-seller`)
}
export const uploadProductImage = (id: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch<Product>(`/api/products/${id}/image`, {
    method: 'POST',
    body: formData,
  })
}
