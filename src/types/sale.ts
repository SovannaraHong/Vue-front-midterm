// export interface saleResponse {
//   saleId: number
//   saleDate: Date
//   totalAmount: number
//   staffId: number
//   staffName: string
//   saleDetails: SaleDetailResponse[]
// }

// export interface SaleDetailResponse {
//   saleDetailId: number
//   productId: number
//   productName: string
//   quantity: number
//   unitPrice: number
//   subtotal: number
// }

// export interface saleRequest {
//   staffId: number
//   items: SaleItemRequest[]
// }
// export interface SaleItemRequest {
//   productId: number
//   quantity: number
// }
export interface saleResponse {
  saleId: number
  saleDate: string
  totalAmount: number
  staffId: number
  staffName: string
  details: SaleDetailResponse[]
}

export interface SaleDetailResponse {
  saleDetailId: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface saleRequest {
  staffId: number
  items: SaleItemRequest[]
}

export interface SaleItemRequest {
  productId: number
  quantity: number
}
