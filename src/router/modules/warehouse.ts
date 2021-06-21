import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const warehouseRoutes: RouteConfig = {
  path: '/warehouse',
  component: Layout,
  redirect: '/warehouse/remains',
  name: 'Warehouse',
  meta: {
    title: 'Склад',
    icon: 'shopping'
  },
  children: [
    {
      path: 'remains',
      component: () => import('@/views/warehouse/remains/index.vue'),
      name: 'BarChartDemo',
      meta: {title: 'Остатки'}
    },
    {
      path: 'inventory',
      component: () => import('@/views/warehouse/inventory/index.vue'),
      name: 'Inventory',
      meta: {title: 'Инвентаризация'}
    },
    {
      path: 'cancellation',
      component: () => import('@/views/warehouse/cancellation/index.vue'),
      name: 'Cancellation',
      meta: {title: 'Списание'}
    },
    {
      path: 'invoice',
      component: () => import('@/views/warehouse/invoice/index.vue'),
      name: 'Invoice',
      meta: {title: 'Оприходование'}
    },
    {
      path: 'opening',
      component: () => import('@/views/warehouse/opening/index.vue'),
      name: 'Opening',
      meta: {title: 'Разборка'}
    }
  ]
}

export default warehouseRoutes
