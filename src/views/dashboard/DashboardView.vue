<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import EarningsChartCard from '@/components/dashboard/EarningsChartCard.vue'
import TrafficCard from '@/components/dashboard/TrafficCard.vue'
import GradientStatCard from '@/components/dashboard/GradientStatCard.vue'
// import RecentActivities from '@/components/dashboard/RecentActivities.vue'
// import OrderStatusTable from '@/components/dashboard/OrderStatusTable.vue'

import { getSales } from '@/services/sale.service'
import { getAllStaff } from '@/services/staff.service'
import { getAllProducts } from '@/services/product.service'

import type { saleResponse } from '@/types/sale'
import type { staffResponse } from '@/types/staff'
import type { Product } from '@/types/product'

// =====================================================
// API DATA
// =====================================================

const sales = ref<saleResponse[]>([])
const staff = ref<staffResponse[]>([])
const products = ref<Product[]>([])

const loading = ref(false)
const error = ref<string | null>(null)

// =====================================================
// FETCH DATA
// =====================================================

const fetchDashboardData = async () => {
  loading.value = true
  error.value = null

  try {
    const [salesData, staffData, productsData] = await Promise.all([
      getSales(),
      getAllStaff(),
      getAllProducts(),
    ])

    sales.value = salesData
    staff.value = staffData
    products.value = productsData
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboardData)

// =====================================================
// TOTAL SALES MONEY
// =====================================================

const totalSales = computed(() => {
  return sales.value.reduce((total, sale) => {
    return total + Number(sale.totalAmount || 0)
  }, 0)
})

// =====================================================
// TOTAL USERS
// =====================================================

const totalUsers = computed(() => {
  return staff.value.length
})

// =====================================================
// TOTAL PRODUCTS
// =====================================================

const totalProducts = computed(() => {
  return products.value.length
})

// =====================================================
// LOW STOCK PRODUCTS
// =====================================================

const lowStockProducts = computed(() => {
  return products.value.filter((product) => {
    return Number(product.sQty) <= 5
  }).length
})
</script>

<template>
  <main class="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
    <!-- ================================================= -->
    <!-- LOADING -->
    <!-- ================================================= -->

    <p v-if="loading" class="text-xs text-slate-400">Loading dashboard...</p>

    <!-- ================================================= -->
    <!-- ERROR -->
    <!-- ================================================= -->

    <p v-else-if="error" class="text-xs text-red-500">
      {{ error }}
    </p>

    <!-- ================================================= -->
    <!-- DASHBOARD CARDS -->
    <!-- ================================================= -->

    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- ================================================= -->
      <!-- TOTAL SALES -->
      <!-- ================================================= -->

      <GradientStatCard
        :card="{
          title: 'Total Sales',
          value: `$${totalSales.toFixed(2)}`,
          sub: 'Total sales amount',
          tone: 'pink',
          points: '0,25 20,20 40,23 60,12 80,15 100,5',
        }"
      />

      <!-- ================================================= -->
      <!-- TOTAL USERS -->
      <!-- ================================================= -->

      <GradientStatCard
        :card="{
          title: 'Total Users',
          value: totalUsers.toString(),
          sub: 'Staff members',
          tone: 'purple',
          points: '0,24 20,18 40,20 60,10 80,14 100,5',
        }"
      />

      <!-- ================================================= -->
      <!-- TOTAL PRODUCTS -->
      <!-- ================================================= -->

      <GradientStatCard
        :card="{
          title: 'Total Products',
          value: totalProducts.toString(),
          sub: 'Products',
          tone: 'blue',
          points: '0,22 20,18 40,20 60,13 80,10 100,5',
        }"
      />

      <!-- ================================================= -->
      <!-- LOW STOCK -->
      <!-- ================================================= -->

      <GradientStatCard
        :card="{
          title: 'Low Stock',
          value: lowStockProducts.toString(),
          sub: '5 or fewer in stock',
          tone: 'orange',
          points: '0,8 20,12 40,10 60,18 80,15 100,25',
        }"
      />
    </div>

    <!-- ================================================= -->
    <!-- EARNINGS / TRAFFIC -->
    <!-- ================================================= -->

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <EarningsChartCard />
      <TrafficCard />
    </div>

    <!-- ================================================= -->
    <!-- RECENT ACTIVITIES / ORDER STATUS -->
    <!-- ================================================= -->

    <!-- <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <RecentActivities />
      <OrderStatusTable />
    </div> -->
  </main>
</template>
