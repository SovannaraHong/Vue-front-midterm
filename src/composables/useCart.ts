import { computed, ref } from 'vue'
import type { CartItem, Product } from '@/types/product'

const cart = ref<CartItem[]>([])
const discount = ref(0)

export function useCart() {
  const addToCart = (product: Product) => {
    const existing = cart.value.find((item) => item.product.pid === product.pid)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.value.push({ product, quantity: 1 })
    }
  }

  const increment = (pid: number) => {
    const item = cart.value.find((i) => i.product.pid === pid)
    if (item) item.quantity += 1
  }

  const decrement = (pid: number) => {
    const item = cart.value.find((i) => i.product.pid === pid)
    if (!item) return
    if (item.quantity <= 1) {
      removeFromCart(pid)
    } else {
      item.quantity -= 1
    }
  }

  const removeFromCart = (pid: number) => {
    cart.value = cart.value.filter((i) => i.product.pid !== pid)
  }

  const clearCart = () => {
    cart.value = []
  }

  const itemsTotal = computed(() =>
    cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  const totalAmount = computed(() => Math.max(itemsTotal.value - discount.value, 0))

  return {
    cart,
    discount,
    addToCart,
    increment,
    decrement,
    removeFromCart,
    clearCart,
    itemsTotal,
    totalAmount,
  }
}
