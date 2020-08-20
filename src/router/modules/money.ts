import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const moneyRoutes: RouteConfig = {
  path: '/money',
  component: Layout,
  redirect: 'money/profit',
  name: 'Money',
  meta: {
    title: 'Деньги',
    icon: 'money'
  },
  children: [
    {
      path: 'profit',
      component: () => import('@/views/money/profit/index.vue'),
      name: 'Profit',
      meta: {
        title: 'Прибыль',
        noCache: true
      }
    },
    {
      path: 'expenses',
      component: () => import('@/views/money/expenses/index.vue'),
      name: 'Expenses',
      meta: {
        title: 'Расходы',
        noCache: true
      }
    }
  ]
}

export default moneyRoutes
