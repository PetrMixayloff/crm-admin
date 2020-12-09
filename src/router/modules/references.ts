import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const referencesRoutes: RouteConfig = {
  path: '/references',
  component: Layout,
  redirect: '/references/products',
  name: 'References',
  meta: {
    title: 'Справочники',
    icon: 'nested'
  },
  children: [
    {
      path: 'products',
      component: () => import('@/views/references/products/index.vue'),
      name: 'Products',
      meta: { title: 'Товары' }
    },
    {
      path: 'materials',
      component: () => import('@/views/references/materials/index.vue'),
      name: 'Materials',
      meta: { title: 'Сырье' }
    },
    {
      path: 'clients',
      component: () => import('@/views/references/clients/index.vue'),
      name: 'Clients',
      meta: { title: 'Клиенты' }
    },
    {
      path: 'staff',
      component: () => import('@/views/references/staff/index.vue'),
      name: 'Staff',
      meta: {
        title: 'Сотрудники',
        roles: ['admin']
      }
    }
  ]
}

export default referencesRoutes
