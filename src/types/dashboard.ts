import type { IconName } from './icon'

export interface NavItem {
  label: string
  icon: IconName
  path?: string
  roles?: string[]
}

export interface StatPillData {
  label: string
  value: string
  icon: IconName
  gradientClass: string
}

export type GradientTone = 'pink' | 'purple' | 'blue' | 'orange'

export interface GradientStatCard {
  title: string
  value: string
  sub?: string
  tone: GradientTone
  points: string
}

export interface ActivityItem {
  time: string
  title: string
  by: string
  dotClass: string
}

export type OrderStatus = 'Process' | 'Open' | 'On Way' | 'Delivered'

export interface Order {
  invoice: string
  customer: string
  from: string
  price: string
  status: OrderStatus
}

export type DateRange = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
