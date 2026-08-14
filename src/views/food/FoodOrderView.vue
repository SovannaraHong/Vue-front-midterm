<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { OrderMode, Product } from '@/types/product'
import { getAllProducts } from '@/services/product.service'
import { useCart } from '@/composables/useCart'

import AppIcon from '@/components/common/AppIcon.vue'
import CategoryTabs from '@/components/food/CategoryTabs.vue'
import ProductCard from '@/components/food/ProductCard.vue'
import CartItem from '@/components/order/CartItem.vue'
import OrderSummary from '@/components/order/OrderSummary.vue'

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const activeCategory = ref('All')
const orderMode = ref<OrderMode>('Dine')

const orderModes: OrderMode[] = ['Dine', 'Pick Up', 'Delivery']

const { cart, discount, addToCart, increment, decrement, removeFromCart, itemsTotal, totalAmount } =
  useCart()

const fetchProducts = async () => {
  loading.value = true
  error.value = null

  try {
    products.value = await getAllProducts()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch products'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
  discount.value = 3
})

const categories = computed(() => [
  'All',
  ...Array.from(new Set(products.value.map((p) => p.categoryName))),
])

const filteredProducts = computed(() =>
  products.value.filter((p) => {
    const matchesCategory =
      activeCategory.value === 'All' || p.categoryName === activeCategory.value

    const matchesSearch = p.productName.toLowerCase().includes(search.value.toLowerCase())

    return matchesCategory && matchesSearch
  }),
)

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const handleCheckout = () => {
  console.log('Checkout with', cart.value)
}
</script>

<template>
  <div class="min-h-screen bg-[#f7f7f9] flex">
    <!-- Left: menu -->
    <div class="flex-1 p-6">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 mb-6">
        <div>
          <p class="text-[11px] text-slate-400">
            {{ today }}
          </p>

          <!-- Poppins heading -->
          <h1 class="font-poppins text-4xl font-extrabold text-slate-800">Grill Restaurant</h1>
        </div>

        <!-- Search -->
        <div class="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm w-72">
          <AppIcon name="search" :size="15" class="text-slate-400" />

          <input
            v-model="search"
            placeholder="Search Here"
            class="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 w-full"
          />

          <AppIcon name="filter" :size="15" class="text-slate-400" />
        </div>
      </div>

      <!-- Section title -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[15px] font-bold text-slate-800">Find The Best Food</h2>

        <a href="#" class="text-[12px] font-semibold text-emerald-600 hover:underline">
          View All
        </a>
      </div>

      <!-- Categories -->
      <CategoryTabs
        :categories="categories"
        :active="activeCategory"
        @select="activeCategory = $event"
      />

      <!-- Loading -->
      <p v-if="loading" class="text-xs text-slate-400 mt-6">Loading menu...</p>

      <!-- Error -->
      <p v-else-if="error" class="text-xs text-red-500 mt-6">
        {{ error }}
      </p>

      <!-- No products -->
      <p v-else-if="filteredProducts.length === 0" class="text-xs text-slate-400 mt-6">
        No dishes found.
      </p>

      <!-- Products -->
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
      <!-- Order header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[15px] font-bold text-slate-800">My Order</h2>

        <button class="text-slate-300 hover:text-slate-500">
          <AppIcon name="x" :size="16" />
        </button>
      </div>

      <!-- Order modes -->
      <div class="flex items-center gap-2 mb-4">
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
      </div>

      <!-- Cart -->
      <div class="flex-1 overflow-y-auto">
        <p v-if="cart.length === 0" class="text-xs text-slate-400 text-center py-10">
          Your cart is empty — add something tasty!
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

      <!-- Order summary -->
      <div class="mt-4 pt-4 border-t border-slate-100">
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
