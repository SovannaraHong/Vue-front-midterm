import { computed, ref, watch } from 'vue'
import type { CartItem, Product } from '@/types/product'

const CART_STORAGE_KEY = 'cart'

export function useCart() {
  const cart = ref<CartItem[]>([])
  const discount = ref(0)

  const cartError = ref<string | null>(null)

  // Load cart from localStorage
  const savedCart = localStorage.getItem(CART_STORAGE_KEY)

  if (savedCart) {
    try {
      cart.value = JSON.parse(savedCart)
    } catch {
      cart.value = []
    }
  }

  // Save cart whenever it changes
  watch(
    cart,
    (value) => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  const addToCart = (product: Product) => {
    const existing = cart.value.find((item) => item.product.pid === product.pid)
    const currentQty = existing?.quantity ?? 0

    if (currentQty + 1 > product.sQty) {
      cartError.value =
        product.sQty === 0
          ? `${product.productName} is out of stock.`
          : `Only ${product.sQty} of ${product.productName} left in stock.`
      return
    }

    cartError.value = null

    // No discount when adding product
    discount.value = 0

    if (existing) {
      existing.quantity++
    } else {
      cart.value.push({
        product,
        quantity: 1,
      })
    }
  }

  const increment = (pid: number) => {
    const item = cart.value.find((i) => i.product.pid === pid)
    if (!item) return

    if (item.quantity + 1 > item.product.sQty) {
      cartError.value = `Only ${item.product.sQty} of ${item.product.productName} left in stock.`
      return
    }

    cartError.value = null
    discount.value = 0
    item.quantity++
  }

  const decrement = (pid: number) => {
    const item = cart.value.find((i) => i.product.pid === pid)
    if (!item) return

    discount.value = 0

    if (item.quantity <= 1) {
      cart.value = cart.value.filter((i) => i.product.pid !== pid)
    } else {
      item.quantity--
    }
  }

  const removeFromCart = (pid: number) => {
    cart.value = cart.value.filter((i) => i.product.pid !== pid)
  }

  const clearCart = () => {
    cart.value = []
    discount.value = 0
    cartError.value = null
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  const itemsTotal = computed(() =>
    cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  const totalAmount = computed(() => Math.max(0, itemsTotal.value - discount.value))

  return {
    cart,
    discount,
    cartError,
    addToCart,
    increment,
    decrement,
    removeFromCart,
    clearCart,
    itemsTotal,
    totalAmount,
  }
}
