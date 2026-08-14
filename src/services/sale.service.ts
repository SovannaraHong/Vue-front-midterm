import type { saleRequest, saleResponse } from '@/types/sale'
import { apiFetch } from './api'

export const getSales = () => {
  return apiFetch<saleResponse[]>('/api/sales')
}

export const getSaleById = (saleId: number) => {
  return apiFetch<saleResponse>(`/api/sales/${saleId}`)
}
export const createSale = (data: Omit<saleRequest, 'saleId'>) => {
  return apiFetch<saleResponse>('/api/sales', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
