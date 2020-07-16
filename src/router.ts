import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
  }
*/

export default new Router({
  // mode: 'history',  // Enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
      meta: { hidden: true }
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
      meta: { hidden: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
          meta: {
            title: 'Главная',
            icon: 'dashboard'
          }
        }
      ]
    },
    {
      path: '/orders',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/orders/index.vue'),
          meta: {
            title: 'Заказы',
            icon: 'tree'
          }
        }
      ]
    },
    {
      path: '/references',
      component: Layout,
      redirect: '/references/products',
      meta: {
        title: 'Справочники',
        icon: 'table'
      },
      children: [
        {
          path: 'products',
          component: () => import('@/views/references/products/index.vue'),
          meta: {
            title: 'Товары',
            icon: 'form' }
        },
        {
          path: 'materials',
          component: () => import('@/views/references/materials/index.vue'),
          meta: {
            title: 'Сырье',
            icon: 'form' }
        },
        {
          path: 'clients',
          component: () => import('@/views/references/clients/index.vue'),
          meta: {
            title: 'Клиенты',
            icon: 'form' }
        },
        {
          path: 'staff',
          component: () => import('@/views/references/staff/index.vue'),
          meta: {
            title: 'Персонал',
            icon: 'form' }
        }
      ]
    },
    {
      path: '/warehouse',
      component: Layout,
      redirect: '/warehouse/remains',
      meta: {
        title: 'Склад',
        icon: 'table'
      },
      children: [
        {
          path: 'remains',
          component: () => import('@/views/warehouse/remains/index.vue'),
          meta: {
            title: 'Остатки',
            icon: 'form' }
        },
        {
          path: 'inventory',
          component: () => import('@/views/warehouse/inventory/index.vue'),
          meta: {
            title: 'Инвентаризация',
            icon: 'form' }
        },
        {
          path: 'cancellation',
          component: () => import('@/views/warehouse/cancellation/index.vue'),
          meta: {
            title: 'Списание',
            icon: 'form' }
        },
        {
          path: 'invoice',
          component: () => import('@/views/warehouse/invoice/index.vue'),
          meta: {
            title: 'Оприходование',
            icon: 'form' }
        }
      ]
    },
    {
      path: '/money',
      component: Layout,
      redirect: '/money/profit',
      meta: {
        title: 'Деньги',
        icon: 'table'
      },
      children: [
        {
          path: 'profit',
          component: () => import('@/views/money/profit/index.vue'),
          meta: {
            title: 'Прибыль',
            icon: 'form' }
        },
        {
          path: 'expenses',
          component: () => import('@/views/money/expenses/index.vue'),
          meta: {
            title: 'Расходы',
            icon: 'form' }
        }
      ]
    },
    {
      path: '/statistic',
      component: Layout,
      redirect: '/statistic/summary',
      meta: {
        title: 'Статистика',
        icon: 'table'
      },
      children: [
        {
          path: 'summary',
          component: () => import('@/views/statistic/summary/index.vue'),
          meta: {
            title: 'Сводка',
            icon: 'form' }
        },
        {
          path: 'reports',
          component: () => import('@/views/statistic/reports/index.vue'),
          meta: {
            title: 'Отчеты',
            icon: 'form' }
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
})
