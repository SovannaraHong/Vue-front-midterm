import type { ActivityItem, GradientStatCard, NavItem, Order } from '@/types/dashboard'

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'home',
    path: '/dashboard',
    roles: ['ADMIN'],
  },
  {
    label: 'Products',
    icon: 'grid',
    path: '/categories',
    roles: ['ADMIN'],
  },
  {
    label: 'ProductList',
    icon: 'layers',
    path: '/foods',
    roles: ['ADMIN', 'USER', 'STOCK'],
  },

  {
    label: 'Advanced UI',
    icon: 'sliders',
    path: '/products',
    roles: ['ADMIN'],
  },
  {
    label: 'Form Elements',
    icon: 'edit',
    roles: ['ADMIN'],
  },
  {
    label: 'Editors',
    icon: 'code',
    roles: ['ADMIN'],
  },
  {
    label: 'Charts',
    icon: 'barChart',
    roles: ['ADMIN'],
  },
  {
    label: 'Tables',
    icon: 'table',
    roles: ['ADMIN'],
  },
  {
    label: 'Popups',
    icon: 'messageSquare',
    roles: ['ADMIN'],
  },
  {
    label: 'Notifications',
    icon: 'bell',
    roles: ['ADMIN'],
  },
  // {
  //   label: 'Icons',
  //   icon: 'star',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'Maps',
  //   icon: 'mapPin',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'User Pages',
  //   icon: 'user',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'Error Pages',
  //   icon: 'alertTriangle',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'General Pages',
  //   icon: 'file',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'E-Commerce',
  //   icon: 'shoppingCart',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'E-mail',
  //   icon: 'mail',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'Calendar',
  //   icon: 'calendar',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'Todo List',
  //   icon: 'checkSquare',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'Gallery',
  //   icon: 'image',
  //   roles: ['ADMIN'],
  // },
  // {
  //   label: 'Documentation',
  //   icon: 'bookOpen',
  //   roles: ['ADMIN'],
  // },
]

const gradientStatCards: GradientStatCard[] = [
  {
    title: 'Revenue Status',
    value: '432',
    sub: 'Jan 01 - Jan 10',
    tone: 'pink',
    points: '0,20 15,10 30,18 45,5 60,15 75,8 90,12 100,4',
  },
  {
    title: 'Page View',
    value: '432',
    tone: 'purple',
    points: '0,22 15,16 30,20 45,10 60,18 75,6 90,14 100,8',
  },
  {
    title: 'Bounce Rate',
    value: '432',
    sub: 'Monthly',
    tone: 'blue',
    points: '0,10 15,20 30,6 45,18 60,4 75,16 90,8 100,20',
  },
  {
    title: 'Revenue Status',
    value: '432',
    sub: 'Jan 01 - Jan 10',
    tone: 'orange',
    points: '0,20 15,4 30,14 45,8 60,20 75,10 90,18 100,6',
  },
]

const activities: ActivityItem[] = [
  {
    time: '42 Mins Ago',
    title: 'Task Updated',
    by: 'Nikolai updated a task',
    dotClass: 'bg-pink-500',
  },
  { time: '1 day ago', title: 'Deal Added', by: 'Faruk updated a task', dotClass: 'bg-violet-500' },
  {
    time: '1 day ago',
    title: 'Published Article',
    by: 'Hazel published an article',
    dotClass: 'bg-sky-500',
  },
  {
    time: '1 day ago',
    title: 'Dock Updated',
    by: 'Reshmi updated a dock',
    dotClass: 'bg-amber-500',
  },
  {
    time: '1 day ago',
    title: 'Replied Comment',
    by: 'Jonathon added a comment',
    dotClass: 'bg-emerald-500',
  },
]

const orders: Order[] = [
  { invoice: '12356', customer: 'Charly Dues', from: 'Brazil', price: '$299', status: 'Process' },
  { invoice: '12356', customer: 'Marko', from: 'Italy', price: '$2642', status: 'Open' },
  { invoice: '12356', customer: 'Daniyel Onak', from: 'Russia', price: '$981', status: 'On Way' },
  { invoice: '12356', customer: 'Belgin Bastana', from: 'Korea', price: '$369', status: 'Process' },
  {
    invoice: '12356',
    customer: 'Sarti Onuoka',
    from: 'Japan',
    price: '$1240',
    status: 'Delivered',
  },
]

// Swap these for real calls through your `api.ts` instance, e.g.:
// export const getOrders = () => api.get<Order[]>('/orders').then((r) => r.data)
export const getNavItems = async (): Promise<NavItem[]> => navItems
export const getGradientStatCards = async (): Promise<GradientStatCard[]> => gradientStatCards
export const getActivities = async (): Promise<ActivityItem[]> => activities
export const getOrders = async (): Promise<Order[]> => orders
