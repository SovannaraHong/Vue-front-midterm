// Mirrors com.midterm.midterm.dto.response.ProductResponse
export interface Product {
  pid: number
  productName: string
  sQty: number
  price: number
  expiredDate: string // LocalDate -> ISO string, e.g. "2026-06-15"
  catId: number
  categoryName: string
  soldQty: number
  imageUrl?: string
}

// Mirrors com.midterm.midterm.dto.request.ProductRequest
export interface ProductRequest {
  productName: string
  sQty: number
  price: number
  expiredDate: string
  catId: number
}

// UI-only: an item sitting in the cart on the right-hand "My Order" panel
export interface CartItem {
  product: Product
  quantity: number
}

export type OrderMode = 'Dine' | 'Pick Up' | 'Delivery'
export type PaymentMethod = 'Cash' | 'Debit' | 'E-Wallet'
