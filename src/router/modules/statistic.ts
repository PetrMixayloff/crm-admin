import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const statisticRoutes: RouteConfig = {
  path: '/statistic',
  component: Layout,
  redirect: '/statistic/summary',
  name: 'Statistic',
  meta: {
    title: 'Статистика',
    icon: 'form'
  },
  children: [
    {
      path: 'summary',
      component: () => import('@/views/statistic/summary/index.vue'),
      name: 'Summary',
      meta: {
        title: 'Сводка',
        noCache: true
      }
    },
    {
      path: 'reports',
      component: () => import('@/views/statistic/reports/index.vue'),
      name: 'Reports',
      meta: {
        title: 'Отчеты',
        noCache: true
      }
    }
  ]
}

export default statisticRoutes
