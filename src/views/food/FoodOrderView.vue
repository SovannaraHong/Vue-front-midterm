<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { PaymentMethod, Product } from '@/types/product'
import type { SaleItemRequest } from '@/types/sale'
import { getAllProducts } from '@/services/product.service'
import { createSale } from '@/services/sale.service'
import { useCart } from '@/composables/useCart'

import AppIcon from '@/components/common/AppIcon.vue'
import CategoryTabs from '@/components/food/CategoryTabs.vue'
import ProductCard from '@/components/food/ProductCard.vue'
import CartItem from '@/components/order/CartItem.vue'
import OrderSummary from '@/components/order/OrderSummary.vue'
import { getCategories } from '@/services/category.service'
import type { Category } from '@/types/category'

const products = ref<Product[]>([])
const category = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const activeCategory = ref('ទាំងអស់') // "All" -> "ទាំងអស់"
// const orderMode = ref<OrderMode>('Dine')

// const orderModes: OrderMode[] = ['ញ៉ាំនៅទីនេះ', 'ខ្ចប់', 'ដឹកជញ្ជូន']

const {
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
} = useCart()

// Auto-dismiss the stock warning a few seconds after it appears.
watch(cartError, (message) => {
  if (!message) return
  window.setTimeout(() => {
    if (cartError.value === message) cartError.value = null
  }, 3500)
})

const isCheckingOut = ref(false)
const checkoutError = ref('')

const fetchProducts = async () => {
  loading.value = true
  error.value = null

  try {
    products.value = await getAllProducts()
    category.value = await getCategories()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'បរាជ័យក្នុងការទាញយកទិន្នន័យផលិតផល'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
  discount.value = 3
})

const categories = computed(() => [
  'ទាំងអស់',
  ...Array.from(new Set(category.value.map((c) => c.categoryName))),
])

const filteredProducts = computed(() =>
  products.value.filter((p) => {
    const matchesStatus = p.status === true

    const matchesCategory =
      activeCategory.value === 'ទាំងអស់' || p.categoryName === activeCategory.value

    const matchesSearch = p.productName.toLowerCase().includes(search.value.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
  }),
)

const today = new Date().toLocaleDateString('km-KH', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const handleCheckout = async (method: PaymentMethod) => {
  if (cart.value.length === 0) {
    checkoutError.value = 'កន្ត្រកទំនិញទទេរ។'
    return
  }

  isCheckingOut.value = true
  checkoutError.value = ''

  const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}')

  const items: SaleItemRequest[] = cart.value.map((item) => ({
    productId: item.product.pid,
    quantity: item.quantity,
  }))

  try {
    const sale = await createSale({
      staffId: authUser.sid,
      items,
    })

    console.log('Sale created with method', method, sale)

    clearCart()
    discount.value = 0
    await fetchProducts()
  } catch (err) {
    checkoutError.value = err instanceof Error ? err.message : 'ការទូទាត់ប្រាក់បរាជ័យ។'
  } finally {
    isCheckingOut.value = false
  }
}
</script>

<template>
  <div class="h-screen font-kantumruy bg-[#f7f7f9] flex relative">
    <!-- Out-of-stock toast -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="cartError"
        class="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900 text-white text-[12px] font-medium rounded-full pl-3 pr-4 py-2 shadow-lg"
      >
        <AppIcon name="alertTriangle" :size="14" class="text-amber-400" />
        {{ cartError }}
      </div>
    </Transition>

    <!-- Left: menu -->
    <div class="flex-1 p-6">
      <div class="flex items-start justify-between gap-4 mb-6">
        <div>
          <p class="text-[11px] text-slate-400">
            {{ today }}
          </p>
          <h1 class="font-poppins text-4xl font-extrabold text-slate-800">អាហារដ្ឋានមួកក្រហម</h1>
        </div>

        <div class="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm w-72">
          <AppIcon name="search" :size="15" class="text-slate-400" />
          <input
            v-model="search"
            placeholder="ស្វែងរកនៅទីនេះ"
            class="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 w-full"
          />
          <AppIcon name="filter" :size="15" class="text-slate-400" />
        </div>
      </div>

      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[15px] font-bold text-slate-800">ស្វែងរកអាហារឆ្ងាញ់ៗ</h2>
        <a href="#" class="text-[12px] font-semibold text-emerald-600 hover:underline">
          មើលទាំងអស់
        </a>
      </div>

      <CategoryTabs
        :categories="categories"
        :active="activeCategory"
        @select="activeCategory = $event"
      />

      <p v-if="loading" class="text-xs text-slate-400 mt-6">កំពុងផ្ទុកបញ្ជីមុខម្ហូប...</p>
      <p v-else-if="error" class="text-xs text-red-500 mt-6">{{ error }}</p>
      <p v-else-if="filteredProducts.length === 0" class="text-xs text-slate-400 mt-6">
        មិនមានមុខម្ហូបត្រូវបានរកឃើញទេ។
      </p>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.pid"
          :product="product"
          @add="addToCart"
        />
      </div>
    </div>

    <!-- Right: order sidebar -->
    <aside class="w-96 shrink-0 bg-white border-l border-slate-100 p-5 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[15px] font-bold text-slate-800">ការកុម្ម៉ង់របស់ខ្ញុំ</h2>
        <button class="text-slate-300 hover:text-slate-500">
          <AppIcon name="x" :size="16" />
        </button>
      </div>

      <!-- <div class="flex items-center gap-2 mb-4">
        <button
          v-for="mode in orderModes"
          :key="mode"
          class="flex-1 text-[11px] font-semibold rounded-full py-1.5 transition-colors"
          :class="
            orderMode === mode
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          "
          @click="orderMode = mode"
        >
          {{ mode }}
        </button>
      </div> -->

      <div class="flex-1 overflow-y-auto">
        <p v-if="cart.length === 0" class="text-xs text-slate-400 text-center py-10">
          កន្ត្រករបស់អ្នកទទេរ — សូមជ្រើសរើសអាហារឆ្ងាញ់ៗ!
        </p>
        <CartItem
          v-for="item in cart"
          :key="item.product.pid"
          :item="item"
          @increment="increment"
          @decrement="decrement"
          @remove="removeFromCart"
        />
      </div>

      <div class="mt-4 pt-4 border-t border-slate-100">
        <p v-if="checkoutError" class="text-xs text-red-500 mb-2">{{ checkoutError }}</p>
        <p v-if="isCheckingOut" class="text-xs text-slate-400 mb-2">កំពុងដំណើរការ...</p>

        <OrderSummary
          :items-total="itemsTotal"
          :discount="discount"
          :total-amount="totalAmount"
          @checkout="handleCheckout"
        />
      </div>
    </aside>
  </div>
</template>
